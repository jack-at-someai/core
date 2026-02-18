"""
Charlotte Voice Agent — Deepgram Streaming STT
================================================
Opens a persistent WebSocket to Deepgram Nova-2 for real-time transcription.
Accepts raw audio bytes (mulaw 8kHz for Twilio, PCM 16kHz for app).
Yields final transcripts via callback.
"""

import asyncio
import json
import logging

import websockets

from config import Config

log = logging.getLogger("charlotte.deepgram")


class DeepgramStreamer:
    """Streaming speech-to-text via Deepgram WebSocket API."""

    DEEPGRAM_WSS = "wss://api.deepgram.com/v1/listen"

    def __init__(
        self,
        on_transcript,
        on_speech_started=None,
        encoding: str = "mulaw",
        sample_rate: int = 8000,
    ):
        """
        Args:
            on_transcript: async callback(text: str, is_final: bool)
            on_speech_started: async callback() — for barge-in detection
            encoding: "mulaw" for Twilio, "linear16" for app PCM
            sample_rate: 8000 for Twilio, 16000 for app
        """
        self._on_transcript = on_transcript
        self._on_speech_started = on_speech_started
        self._encoding = encoding
        self._sample_rate = sample_rate
        self._ws = None
        self._running = False
        self._ready = False
        self._receive_task = None
        self._send_task = None
        self._audio_queue = asyncio.Queue()

    async def connect(self):
        """Open WebSocket connection to Deepgram."""
        if Config.DEMO:
            log.info("DEMO: Deepgram connection simulated")
            self._running = True
            self._ready = True
            return

        params = (
            f"encoding={self._encoding}"
            f"&sample_rate={self._sample_rate}"
            f"&channels=1"
            f"&model=nova-2"
            f"&punctuate=true"
            f"&interim_results=true"
            f"&endpointing=300"
            f"&vad_events=true"
        )
        url = f"{self.DEEPGRAM_WSS}?{params}"
        headers = {"Authorization": f"Token {Config.DEEPGRAM_API_KEY}"}

        self._ws = await websockets.connect(
            url,
            additional_headers=headers,
            ping_interval=20,
            ping_timeout=20,
        )
        self._running = True
        self._ready = True
        self._receive_task = asyncio.create_task(self._receive_loop())
        self._send_task = asyncio.create_task(self._send_loop())
        log.info("Deepgram connected (%s @ %dHz)", self._encoding, self._sample_rate)

    async def send_audio(self, audio_bytes: bytes):
        """Queue raw audio bytes for sending to Deepgram."""
        if not self._running:
            return
        try:
            self._audio_queue.put_nowait(audio_bytes)
        except asyncio.QueueFull:
            pass

    async def _send_loop(self):
        """Send queued audio to Deepgram as fast as possible."""
        sent = 0
        try:
            while self._running and self._ws:
                audio = await asyncio.wait_for(self._audio_queue.get(), timeout=30.0)
                await self._ws.send(audio)
                sent += 1
                if sent == 1:
                    log.info("First audio chunk sent to Deepgram")
                elif sent % 500 == 0:
                    log.info("Sent %d audio chunks to Deepgram", sent)
        except asyncio.TimeoutError:
            log.warning("Deepgram send loop: no audio for 5s, closing")
        except websockets.ConnectionClosed:
            log.warning("Deepgram connection closed during send")
        except Exception:
            log.exception("Deepgram send loop error")
        finally:
            self._running = False

    async def _receive_loop(self):
        """Listen for transcription results from Deepgram."""
        msg_count = 0
        try:
            async for msg in self._ws:
                msg_count += 1
                if isinstance(msg, bytes):
                    log.debug("Deepgram binary message (%d bytes)", len(msg))
                    continue
                data = json.loads(msg)
                msg_type = data.get("type", "")

                if msg_count <= 2:
                    log.info("Deepgram msg #%d: type=%s", msg_count, msg_type)

                if msg_type == "Results":
                    alt = data.get("channel", {}).get("alternatives", [{}])[0]
                    text = alt.get("transcript", "").strip()
                    is_final = data.get("is_final", False)
                    speech_final = data.get("speech_final", False)
                    if text:
                        log.info("Deepgram transcript (final=%s, speech_final=%s): %s", is_final, speech_final, text)
                        await self._on_transcript(text, is_final or speech_final)
                    elif is_final:
                        log.debug("Deepgram empty final result (silence)")

                elif msg_type == "SpeechStarted":
                    log.info("Deepgram: speech started")
                    if self._on_speech_started:
                        await self._on_speech_started()

                elif msg_type == "Metadata":
                    log.info("Deepgram metadata: request_id=%s", data.get("request_id", "?"))

                elif msg_type == "Error":
                    log.error("Deepgram error: %s", data.get("message", data))

                elif msg_type == "UtteranceEnd":
                    log.debug("Deepgram: utterance end")

        except websockets.ConnectionClosed as e:
            log.info("Deepgram WebSocket closed: code=%s reason=%s (after %d msgs)", e.code, e.reason, msg_count)
        except Exception:
            log.exception("Deepgram receive error (after %d msgs)", msg_count)
        finally:
            self._running = False

    async def close(self):
        """Gracefully close the Deepgram connection."""
        self._running = False
        if self._ws:
            try:
                await self._ws.send(json.dumps({"type": "CloseStream"}))
                await self._ws.close()
            except Exception:
                pass
            self._ws = None
        if self._send_task:
            self._send_task.cancel()
            try:
                await self._send_task
            except asyncio.CancelledError:
                pass
            self._send_task = None
        if self._receive_task:
            self._receive_task.cancel()
            try:
                await self._receive_task
            except asyncio.CancelledError:
                pass
            self._receive_task = None
        log.info("Deepgram disconnected")


class DemoDeepgramStreamer(DeepgramStreamer):
    """Demo mode: yields canned transcripts without API calls."""

    _DEMO_PHRASES = [
        "Hello Charlotte, what can you do?",
        "Take a note: remember to check the compressor readings tomorrow.",
        "What notes do I have?",
    ]

    def __init__(self, on_transcript, on_speech_started=None, **kwargs):
        super().__init__(on_transcript, on_speech_started, **kwargs)
        self._demo_index = 0

    async def connect(self):
        self._running = True
        log.info("DEMO: Deepgram streamer ready (simulated)")

    async def send_audio(self, audio_bytes: bytes):
        """In demo mode, every ~2 seconds of audio triggers a canned transcript."""
        pass

    async def simulate_utterance(self, text: str | None = None):
        """Manually trigger a transcript for demo testing."""
        if text is None:
            text = self._DEMO_PHRASES[self._demo_index % len(self._DEMO_PHRASES)]
            self._demo_index += 1
        await self._on_transcript(text, True)

    async def close(self):
        self._running = False
        log.info("DEMO: Deepgram disconnected")
