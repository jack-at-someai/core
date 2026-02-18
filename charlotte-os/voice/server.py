#!/usr/bin/env python3
"""
Charlotte Voice Agent — Main Server
=====================================
Single Python asyncio process handling:
  - POST /twilio/voice      — TwiML webhook for incoming calls
  - WS   /twilio/media      — Twilio bidirectional media stream
  - WS   /app/ws            — PWA WebSocket (push-to-talk + text)
  - GET  /app/*             — Static files for PWA
  - GET  /health            — Health check

Usage:
    python server.py [--demo] [--port 8080]

On the Pi:
    source ~/charlotte-env/bin/activate
    python server.py

Development (no API calls):
    python server.py --demo
"""

import argparse
import asyncio
import base64
import json
import logging
import os
import sys
import time
from pathlib import Path

from aiohttp import web

from config import Config
from session import SessionStore
from claude_agent import ClaudeAgent
from deepgram_client import DeepgramStreamer, DemoDeepgramStreamer
from elevenlabs_client import ElevenLabsTTS, DemoElevenLabsTTS
from twilio_handler import handle_voice_webhook, TwilioMediaStream
from tools.notes import set_store as set_notes_store

log = logging.getLogger("charlotte.voice")

# ---- Globals ----
store: SessionStore
agent: ClaudeAgent


# ===========================================================================
# Twilio media stream handler
# ===========================================================================

async def handle_twilio_media(request: web.Request) -> web.WebSocketResponse:
    """WS /twilio/media — bidirectional audio with Twilio."""
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    stream = TwilioMediaStream(ws)
    session = None
    deepgram = None
    tts = None
    is_speaking = False
    current_task = None

    async def on_transcript(text: str, is_final: bool):
        nonlocal current_task
        if not is_final:
            return
        log.info("STT [twilio]: %s", text)
        # Cancel any in-flight response so we don't pile up
        if current_task and not current_task.done():
            current_task.cancel()
            log.info("Cancelled previous response task")
        current_task = asyncio.create_task(process_utterance(text))

    async def on_speech_started():
        nonlocal is_speaking
        if is_speaking:
            # Barge-in: user started talking while Charlotte is speaking
            await stream.clear_audio()
            is_speaking = False
            log.info("Barge-in detected — cleared audio")

    async def process_utterance(text: str):
        nonlocal is_speaking
        if not session:
            return

        await store.save_message(session, "user", text)
        messages = session.get_claude_messages()

        async def on_tool_use(name, args):
            pass  # Could send a "thinking" tone

        try:
            response_text = await agent.respond(messages, on_tool_use=on_tool_use)
        except asyncio.CancelledError:
            log.info("Response cancelled (new utterance arrived)")
            return
        await store.save_message(session, "assistant", response_text)
        log.info("Claude [twilio]: %s", response_text[:200])

        # Synthesize and stream audio back
        is_speaking = True
        if Config.DEMO:
            tts_engine = DemoElevenLabsTTS(output_format="ulaw_8000")
        else:
            tts_engine = ElevenLabsTTS(output_format="ulaw_8000")
        try:
            await tts_engine.connect()
            async for audio_b64 in tts_engine.synthesize(response_text):
                if not is_speaking:
                    break
                await stream.send_audio(audio_b64)
        except asyncio.CancelledError:
            log.info("TTS cancelled (new utterance arrived)")
        except Exception:
            log.exception("TTS error")
        finally:
            await tts_engine.close()
            is_speaking = False

    async def on_start(stream_sid, call_sid, custom_params):
        nonlocal session, deepgram
        # Use call SID as session identifier for phone calls
        identifier = call_sid or "unknown"
        session = await store.get_or_create(identifier, source="phone")
        session.stream_sid = stream_sid
        log.info("Session created: %s (call=%s)", session.id, call_sid)

        # Start Deepgram
        if Config.DEMO:
            deepgram = DemoDeepgramStreamer(on_transcript, on_speech_started)
        else:
            deepgram = DeepgramStreamer(on_transcript, on_speech_started, encoding="mulaw", sample_rate=8000)
        await deepgram.connect()

        # Publish session start to MQTT
        try:
            from tools.charlotte import _get_mqtt
            mqtt = _get_mqtt()
            if mqtt:
                mqtt.publish("charlotte/voice/session", json.dumps({
                    "event": "call_start",
                    "call_sid": call_sid,
                    "timestamp": time.time(),
                }))
        except Exception:
            pass

    _audio_chunks = 0

    async def on_audio(audio_bytes: bytes):
        nonlocal _audio_chunks
        _audio_chunks += 1
        if _audio_chunks == 1:
            log.info("First audio chunk received: %d bytes", len(audio_bytes))
        elif _audio_chunks % 500 == 0:
            log.info("Audio chunks received: %d", _audio_chunks)
        if deepgram:
            await deepgram.send_audio(audio_bytes)

    async def on_stop():
        nonlocal session
        if deepgram:
            await deepgram.close()
        if session:
            log.info("Call ended: %s (%d messages)", session.id, len(session.messages))
            store.remove_session(session.id)
            # Publish session end
            try:
                from tools.charlotte import _get_mqtt
                mqtt = _get_mqtt()
                if mqtt:
                    mqtt.publish("charlotte/voice/session", json.dumps({
                        "event": "call_end",
                        "session_id": session.id,
                        "messages": len(session.messages),
                        "timestamp": time.time(),
                    }))
            except Exception:
                pass

    try:
        await stream.receive_events(on_audio, on_start, on_stop)
    except Exception:
        log.exception("Twilio media stream error")
    finally:
        if deepgram:
            await deepgram.close()

    return ws


# ===========================================================================
# PWA app WebSocket handler
# ===========================================================================

async def handle_app_ws(request: web.Request) -> web.WebSocketResponse:
    """WS /app/ws — PWA push-to-talk and text interface."""
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    # Auth check
    token = request.query.get("token", "")
    if Config.APP_AUTH_TOKEN and token != Config.APP_AUTH_TOKEN:
        await ws.send_json({"type": "error", "message": "Unauthorized"})
        await ws.close()
        return ws

    session = await store.get_or_create(token or "app-default", source="app")
    deepgram = None
    log.info("App client connected: session=%s", session.id)

    # Send conversation history
    history = [
        {"role": m["role"], "content": m["content"]}
        for m in session.messages[-20:]
        if m["role"] in ("user", "assistant")
    ]
    await ws.send_json({"type": "history", "messages": history})

    async def on_transcript(text: str, is_final: bool):
        await ws.send_json({"type": "transcript", "text": text, "is_final": is_final})
        if is_final and text.strip():
            await process_app_utterance(text)

    async def process_app_utterance(text: str):
        await store.save_message(session, "user", text)
        await ws.send_json({"type": "status", "status": "thinking"})

        messages = session.get_claude_messages()

        async def on_tool_use(name, args):
            await ws.send_json({"type": "status", "status": "tool", "tool": name})

        response_text = await agent.respond(messages, on_tool_use=on_tool_use)
        await store.save_message(session, "assistant", response_text)
        log.info("Claude [app]: %s", response_text[:200])

        # Send text response
        await ws.send_json({"type": "response", "text": response_text})

        # Generate TTS audio
        await ws.send_json({"type": "status", "status": "speaking"})
        if Config.DEMO:
            tts = DemoElevenLabsTTS(output_format="mp3_44100_128")
        else:
            tts = ElevenLabsTTS(output_format="mp3_44100_128")
        await tts.connect()
        try:
            audio_chunks = []
            async for audio_b64 in tts.synthesize(response_text):
                audio_chunks.append(audio_b64)
                await ws.send_json({"type": "audio", "data": audio_b64, "final": False})
            await ws.send_json({"type": "audio", "data": "", "final": True})
        finally:
            await tts.close()

        await ws.send_json({"type": "status", "status": "idle"})

    async for msg in ws:
        if msg.type == web.WSMsgType.TEXT:
            try:
                data = json.loads(msg.data)
            except json.JSONDecodeError:
                continue

            msg_type = data.get("type")

            if msg_type == "text":
                # Text input (typed message)
                text = data.get("text", "").strip()
                if text:
                    await process_app_utterance(text)

            elif msg_type == "audio_start":
                # Start streaming audio from app
                if Config.DEMO:
                    deepgram = DemoDeepgramStreamer(on_transcript, encoding="linear16", sample_rate=16000)
                else:
                    deepgram = DeepgramStreamer(on_transcript, encoding="linear16", sample_rate=16000)
                await deepgram.connect()
                await ws.send_json({"type": "status", "status": "listening"})

            elif msg_type == "audio_data":
                # Raw PCM audio chunk from app (base64 encoded)
                if deepgram:
                    audio = base64.b64decode(data.get("data", ""))
                    await deepgram.send_audio(audio)

            elif msg_type == "audio_stop":
                # Stop streaming audio
                if deepgram:
                    await deepgram.close()
                    deepgram = None

        elif msg.type == web.WSMsgType.BINARY:
            # Raw audio bytes (alternative to base64)
            if deepgram:
                await deepgram.send_audio(msg.data)

    # Cleanup
    if deepgram:
        await deepgram.close()
    log.info("App client disconnected: session=%s", session.id)
    return ws


# ===========================================================================
# Static file serving (PWA)
# ===========================================================================

async def handle_app_static(request: web.Request) -> web.Response:
    """GET /app/* — serve PWA static files."""
    path = request.match_info.get("path", "index.html")
    if not path or path == "/":
        path = "index.html"

    file_path = Path(__file__).parent / "app" / path
    if not file_path.exists() or not file_path.is_file():
        return web.Response(status=404, text="Not found")

    # Content type mapping
    ext = file_path.suffix.lower()
    content_types = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".ico": "image/x-icon",
        ".svg": "image/svg+xml",
        ".webmanifest": "application/manifest+json",
    }
    ct = content_types.get(ext, "application/octet-stream")

    return web.Response(
        body=file_path.read_bytes(),
        content_type=ct,
        headers={"Cache-Control": "public, max-age=3600"},
    )


# ===========================================================================
# Health check
# ===========================================================================

async def handle_health(request: web.Request) -> web.Response:
    """GET /health — returns server status."""
    return web.json_response({
        "status": "ok",
        "mode": "demo" if Config.DEMO else "live",
        "uptime": time.time() - _start_time,
    })


# ===========================================================================
# Demo endpoint (trigger test utterances)
# ===========================================================================

async def handle_demo_trigger(request: web.Request) -> web.Response:
    """POST /demo/trigger — trigger a demo utterance (demo mode only)."""
    if not Config.DEMO:
        return web.Response(status=404, text="Not found")

    data = await request.json()
    text = data.get("text", "Hello Charlotte")

    session = await store.get_or_create("demo-user", source="demo")
    await store.save_message(session, "user", text)
    messages = session.get_claude_messages()
    response = await agent.respond(messages)
    await store.save_message(session, "assistant", response)

    return web.json_response({"input": text, "response": response})


# ===========================================================================
# Server setup
# ===========================================================================

_start_time = time.time()


async def on_startup(app: web.Application):
    """Initialize stores and connections on server start."""
    global store, agent
    store = SessionStore()
    await store.init()
    set_notes_store(store)
    agent = ClaudeAgent()
    log.info("Charlotte Voice Agent started")
    log.info(Config.log_status())
    missing = Config.validate()
    if missing:
        log.warning("Missing API keys: %s — some features disabled", ", ".join(missing))


async def on_shutdown(app: web.Application):
    """Cleanup on server shutdown."""
    if store:
        await store.close()
    log.info("Charlotte Voice Agent stopped")


def create_app() -> web.Application:
    """Create and configure the aiohttp application."""
    app = web.Application()

    # Routes
    app.router.add_post("/twilio/voice", handle_voice_webhook)
    app.router.add_get("/twilio/media", handle_twilio_media)
    app.router.add_get("/app/ws", handle_app_ws)
    app.router.add_get("/app/{path:.*}", handle_app_static)
    app.router.add_get("/app", handle_app_static)
    app.router.add_get("/health", handle_health)
    app.router.add_post("/demo/trigger", handle_demo_trigger)

    # Root redirect to app
    async def root_redirect(request):
        raise web.HTTPFound("/app/")
    app.router.add_get("/", root_redirect)

    app.on_startup.append(on_startup)
    app.on_shutdown.append(on_shutdown)

    return app


def main():
    parser = argparse.ArgumentParser(description="Charlotte Voice Agent")
    parser.add_argument("--demo", action="store_true", help="Run in demo mode (no API calls)")
    parser.add_argument("--port", type=int, default=None, help="Server port (default: 8080)")
    parser.add_argument("--host", type=str, default=None, help="Server host (default: 0.0.0.0)")
    args = parser.parse_args()

    if args.demo:
        Config.DEMO = True
    if args.port:
        Config.PORT = args.port
    if args.host:
        Config.HOST = args.host

    # Logging
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
        datefmt="%H:%M:%S",
    )

    mode = "DEMO" if Config.DEMO else "LIVE"
    log.info("Starting Charlotte Voice Agent (%s) on %s:%d", mode, Config.HOST, Config.PORT)

    app = create_app()
    web.run_app(app, host=Config.HOST, port=Config.PORT, print=None)


if __name__ == "__main__":
    main()
