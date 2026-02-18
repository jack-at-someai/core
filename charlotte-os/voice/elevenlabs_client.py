"""
Charlotte Voice Agent — ElevenLabs Streaming TTS
==================================================
Streams text to ElevenLabs WebSocket API, receives audio chunks.
Supports ulaw_8000 output for Twilio passthrough and mp3_44100 for app.
"""

import asyncio
import base64
import json
import logging

import websockets

from config import Config

log = logging.getLogger("charlotte.elevenlabs")


class ElevenLabsTTS:
    """Streaming text-to-speech via ElevenLabs WebSocket API."""

    ELEVENLABS_WSS = "wss://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream-input"

    def __init__(self, output_format: str = "ulaw_8000"):
        """
        Args:
            output_format: "ulaw_8000" for Twilio, "mp3_44100_128" for app
        """
        self._output_format = output_format
        self._ws = None
        self._running = False

    async def connect(self):
        """Open WebSocket to ElevenLabs."""
        if Config.DEMO:
            log.info("DEMO: ElevenLabs connection simulated")
            self._running = True
            return

        voice_id = Config.ELEVENLABS_VOICE_ID
        url = (
            self.ELEVENLABS_WSS.format(voice_id=voice_id)
            + f"?model_id=eleven_turbo_v2_5"
            + f"&output_format={self._output_format}"
        )

        self._ws = await websockets.connect(
            url,
            open_timeout=30,
            ping_interval=20,
            ping_timeout=20,
        )

        # Send initial config (BOS — beginning of stream)
        await self._ws.send(json.dumps({
            "text": " ",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75,
            },
            "xi_api_key": Config.ELEVENLABS_API_KEY,
        }))
        self._running = True
        log.info("ElevenLabs connected (format=%s)", self._output_format)

    async def synthesize(self, text: str):
        """
        Send text and yield audio chunks as base64 strings.
        Each chunk is a complete audio segment ready to play.
        """
        if Config.DEMO:
            # Yield a tiny silent mulaw frame for demo
            yield base64.b64encode(b"\xff" * 160).decode("ascii")
            return

        if not self._ws or not self._running:
            log.warning("ElevenLabs not connected, skipping TTS")
            return

        try:
            # Send text chunk
            await self._ws.send(json.dumps({
                "text": text + " ",
                "try_trigger_generation": True,
            }))

            # Send empty string to signal end of input
            await self._ws.send(json.dumps({
                "text": "",
            }))

            # Receive audio chunks until final
            while True:
                msg = await asyncio.wait_for(self._ws.recv(), timeout=30.0)
                data = json.loads(msg)

                audio_b64 = data.get("audio")
                if audio_b64:
                    yield audio_b64

                if data.get("isFinal"):
                    break

        except asyncio.TimeoutError:
            log.warning("ElevenLabs response timeout")
        except websockets.ConnectionClosed:
            log.warning("ElevenLabs connection closed during synthesis")
            self._running = False
        except Exception:
            log.exception("ElevenLabs synthesis error")

    async def close(self):
        """Close the ElevenLabs WebSocket."""
        self._running = False
        if self._ws:
            try:
                await self._ws.close()
            except Exception:
                pass
            self._ws = None
        log.info("ElevenLabs disconnected")


class DemoElevenLabsTTS(ElevenLabsTTS):
    """Demo mode: returns silent audio without API calls."""

    async def connect(self):
        self._running = True
        log.info("DEMO: ElevenLabs TTS ready (simulated)")

    async def synthesize(self, text: str):
        """Yield a small silent mulaw chunk per ~word for timing simulation."""
        words = text.split()
        # ~200ms of silence per word at 8kHz mulaw
        chunk_size = 1600
        for _ in range(0, len(words), 3):
            yield base64.b64encode(b"\xff" * chunk_size).decode("ascii")
            await asyncio.sleep(0.2)

    async def close(self):
        self._running = False
        log.info("DEMO: ElevenLabs disconnected")
