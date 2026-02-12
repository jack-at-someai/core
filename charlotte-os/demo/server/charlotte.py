#!/usr/bin/env python3
"""
Charlotte OS — Demo Server
===========================
The brain. Runs on Raspberry Pi 5.

- Pulls frames from all cameras (Zeus + 2x Pi Zero W)
- Identifies faces, reads emotions
- Generates KRF facts in real time
- Broadcasts facts over WebSocket to visualization clients
- Serves the visualization page over HTTP
- Tracks meeting protocol divergence
- Generates minutes on demand

Usage:
    source ~/charlotte-env/bin/activate
    python3 charlotte.py [--port 8000] [--ws-port 8765]

Or on Windows for development:
    python charlotte.py --demo
"""

import asyncio
import json
import os
import sys
import time
import threading
import signal
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
from functools import partial

# Local modules
from camera_ingest import CameraIngest
from face_engine import FaceEngine
from krf import (
    make_node, make_edge, make_metric, make_signal,
    make_protocol_check, fact_to_json
)
from protocol_engine import ProtocolEngine
from minutes import MinutesGenerator

try:
    import websockets
except ImportError:
    print("ERROR: websockets not installed. Run: pip install websockets")
    sys.exit(1)


# ── Configuration ──

DEFAULT_HTTP_PORT = 8000
DEFAULT_WS_PORT = 8765
DEMO_DIR = Path(__file__).parent.parent
SERVER_DIR = Path(__file__).parent
VIZ_DIR = DEMO_DIR / "visualization"
FACES_DIR = DEMO_DIR / "faces"
PROTOCOL_PATH = DEMO_DIR / "meeting_protocol.json"

# Camera URLs — edit these to match your network
CAMERAS = {
    "zeus":      "http://192.168.4.1:81/stream",        # Zeus ESP32-CAM default AP
    "eye-left":  "http://eye-left.local:8080/?action=stream",
    "eye-right": "http://eye-right.local:8080/?action=stream",
}

# How often to process frames (seconds)
PROCESS_INTERVAL = 0.3  # ~3 FPS analysis

# ── Global state ──

connected_clients = set()
fact_history = []
known_persons = {}  # name -> NODE fact already sent
meeting_active = False


class CharlotteServer:
    def __init__(self, demo_mode=False):
        self.demo_mode = demo_mode
        self.running = False

        # Initialize subsystems
        self.cameras = CameraIngest()
        self.face_engine = FaceEngine(str(FACES_DIR))
        self.protocol = ProtocolEngine(str(PROTOCOL_PATH))
        self.minutes = MinutesGenerator()

        # Metrics accumulators (per-person rolling averages)
        self.engagement_history = {}   # name -> [float, ...]
        self.attention_scores = {}     # name -> [float, ...]

    def configure_cameras(self, camera_config=None):
        """Register cameras. Uses defaults or custom config."""
        config = camera_config or CAMERAS
        for cam_id, url in config.items():
            self.cameras.add_camera(cam_id, url)
            print(f"  Camera registered: {cam_id} -> {url}")

    async def broadcast(self, message):
        """Send a message to all connected WebSocket clients."""
        if connected_clients:
            payload = json.dumps(message) if isinstance(message, dict) else message
            await asyncio.gather(
                *[client.send(payload) for client in connected_clients],
                return_exceptions=True
            )

    async def broadcast_fact(self, fact_krf_list, fact_type, data):
        """Broadcast KRF facts to all visualization clients.

        fact_krf_list is the list of S-expressions returned by make_node/make_signal/etc.
        We pick the first substantive fact (not in-microtheory) for the KRF string,
        then overlay the pre-built data dict.
        """
        # Find the first real fact string (skip microtheory context)
        krf_str = ""
        for expr in fact_krf_list:
            if not expr.strip().startswith("(in-microtheory"):
                krf_str = expr
                break

        fact_json = {
            "type": fact_type,
            "krf": krf_str,
            "timestamp": data.get("timestamp", time.time()),
            "data": data
        }
        fact_history.append(fact_json)
        self.minutes.add_fact(fact_json)
        await self.broadcast(fact_json)

    async def process_detection(self, detection):
        """Convert a face detection into KRF facts and broadcast."""
        name = detection["name"]
        ts = detection["timestamp"]

        # First time seeing this person? Create NODE
        if name not in known_persons:
            node_krf = make_node(name, "Person", {"camera_first_seen": detection["camera_id"]})
            known_persons[name] = True
            self.minutes.register_attendee(name)
            await self.broadcast_fact(node_krf, "NODE", {
                "id": name, "type": "Person",
                "camera": detection["camera_id"]
            })
            print(f"  [NODE] New person: {name}")

        # Emotion SIGNAL
        emotion = detection["emotion"]
        emotion_score = detection["emotion_scores"].get(emotion, 0)
        signal_krf = make_signal(
            name, f"EMOTION:{emotion.upper()}", emotion_score, ts,
            detection["confidence"]
        )
        await self.broadcast_fact(signal_krf, "SIGNAL", {
            "node": name, "emotion": emotion,
            "scores": detection["emotion_scores"],
            "confidence": detection["confidence"]
        })

        # Engagement METRIC
        engagement = self.face_engine.get_engagement_score(detection)
        metric_krf = make_metric(name, "ENGAGEMENT", engagement, ts)
        await self.broadcast_fact(metric_krf, "METRIC", {
            "node": name, "metric": "ENGAGEMENT", "value": engagement
        })

        # Track engagement history
        if name not in self.engagement_history:
            self.engagement_history[name] = []
        self.engagement_history[name].append(engagement)

        # Protocol divergence check
        if meeting_active:
            divergence = self.protocol.check_divergence("engagement", engagement)
            if divergence and abs(divergence["divergence"]) > 0.1:
                proto_krf = make_protocol_check(
                    divergence["phase"], "ENGAGEMENT",
                    divergence["expected"], divergence["actual"], ts
                )
                await self.broadcast_fact(proto_krf, "PROTOCOL", divergence)

    async def observation_loop(self):
        """
        Charlotte's heartbeat — the observation loop from agent/observer.krf:
        1. Perceive the current state (pull camera frames)
        2. Evaluate protocols against current state
        3. If a protocol fires, execute its action
        4. If the human places a signal, ingest it
        5. Advance along the temporal spine
        6. Repeat
        """
        print("\n  Observation loop started.")
        print(f"  Processing every {PROCESS_INTERVAL}s (~{1/PROCESS_INTERVAL:.0f} FPS)")

        while self.running:
            loop_start = time.time()

            # 1. Perceive — get latest frames from all cameras
            frames = self.cameras.get_all_frames()

            for cam_id, frame in frames.items():
                if frame is None:
                    continue

                # 2. Process faces in this frame
                detections = self.face_engine.process_frame(frame, cam_id)

                for det in detections:
                    await self.process_detection(det)

                # 3. Generate EDGE facts for attention (who's facing whom)
                if len(detections) >= 2:
                    # Simple heuristic: people facing same direction = attending same thing
                    for i, d1 in enumerate(detections):
                        for d2 in detections[i+1:]:
                            edge_krf = make_edge(
                                d1["name"], d2["name"],
                                "CO_ATTENDING", time.time()
                            )
                            await self.broadcast_fact(edge_krf, "EDGE", {
                                "from": d1["name"], "to": d2["name"],
                                "type": "CO_ATTENDING"
                            })

            # 4. Broadcast room-level metrics
            if known_persons:
                all_engagement = []
                for name, hist in self.engagement_history.items():
                    if hist:
                        all_engagement.append(hist[-1])

                if all_engagement:
                    room_engagement = sum(all_engagement) / len(all_engagement)
                    room_krf = make_metric("ROOM", "AVG_ENGAGEMENT", room_engagement, time.time())
                    await self.broadcast_fact(room_krf, "METRIC", {
                        "node": "ROOM", "metric": "AVG_ENGAGEMENT",
                        "value": room_engagement,
                        "individual": {n: h[-1] for n, h in self.engagement_history.items() if h}
                    })

            # 5. Sleep for remainder of interval
            elapsed = time.time() - loop_start
            sleep_time = max(0, PROCESS_INTERVAL - elapsed)
            await asyncio.sleep(sleep_time)

    async def handle_websocket(self, websocket):
        """Handle a WebSocket connection from a visualization client."""
        connected_clients.add(websocket)
        remote = websocket.remote_address
        print(f"  [WS] Client connected: {remote}")

        try:
            # Send current state to new client
            await websocket.send(json.dumps({
                "type": "STATE_SYNC",
                "persons": list(known_persons.keys()),
                "meeting_active": meeting_active,
                "fact_count": len(fact_history),
                "camera_status": self.cameras.get_status()
            }))

            # Listen for commands from visualization
            async for message in websocket:
                try:
                    cmd = json.loads(message)
                    await self.handle_command(cmd, websocket)
                except json.JSONDecodeError:
                    pass

        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            connected_clients.discard(websocket)
            print(f"  [WS] Client disconnected: {remote}")

    async def handle_command(self, cmd, websocket):
        """Handle commands from the visualization UI."""
        global meeting_active

        action = cmd.get("action")

        if action == "start_meeting":
            meeting_active = True
            self.protocol.start_meeting()
            print("  [PROTOCOL] Meeting started")
            await self.broadcast({"type": "MEETING_STARTED", "timestamp": time.time()})

        elif action == "end_meeting":
            meeting_active = False
            timeline = self.protocol.end_meeting()
            minutes_data = self.minutes.generate_minutes(timeline)
            minutes_html = self.minutes.generate_html(minutes_data)
            print("  [PROTOCOL] Meeting ended — minutes generated")
            await self.broadcast({
                "type": "MEETING_ENDED",
                "minutes": minutes_data,
                "minutes_html": minutes_html,
                "timestamp": time.time()
            })

        elif action == "get_status":
            await websocket.send(json.dumps({
                "type": "STATUS",
                "cameras": self.cameras.get_status(),
                "persons": list(known_persons.keys()),
                "fact_count": len(fact_history),
                "meeting_active": meeting_active
            }))

        elif action == "get_minutes":
            timeline = self.protocol.get_timeline()
            minutes_data = self.minutes.generate_minutes(timeline)
            await websocket.send(json.dumps({
                "type": "MINUTES_SNAPSHOT",
                "minutes": minutes_data
            }))

    async def run(self, http_port=DEFAULT_HTTP_PORT, ws_port=DEFAULT_WS_PORT):
        """Start all Charlotte services."""
        self.running = True

        print("=======================================")
        print("  Charlotte OS — Demo Server")
        print("=======================================")
        print(f"  Visualization: http://localhost:{http_port}")
        print(f"  WebSocket:     ws://localhost:{ws_port}")
        print(f"  Faces dir:     {FACES_DIR}")
        print(f"  Protocol:      {PROTOCOL_PATH}")
        print(f"  Demo mode:     {self.demo_mode}")
        print()

        # Start camera ingestion
        if not self.demo_mode:
            self.configure_cameras()
            self.cameras.start()
            print("  Cameras started.")
        else:
            print("  Demo mode — cameras disabled, generating synthetic data.")

        # Start HTTP server in background thread
        http_thread = threading.Thread(
            target=self._run_http_server,
            args=(http_port,),
            daemon=True
        )
        http_thread.start()
        print(f"  HTTP server on port {http_port}")

        # Start WebSocket server
        ws_server = await websockets.serve(
            self.handle_websocket, "0.0.0.0", ws_port
        )
        print(f"  WebSocket server on port {ws_port}")
        print()
        print("  Charlotte is watching.")
        print("  Open the visualization in a browser to begin.")
        print("=======================================")

        # Run the observation loop (or demo loop)
        if self.demo_mode:
            await self._demo_loop()
        else:
            await self.observation_loop()

    async def _demo_loop(self):
        """Generate synthetic data for testing without cameras."""
        import random

        demo_people = ["Jim", "Joseph", "Jack", "Dave", "Sarah", "Mike", "Lisa", "Tom"]
        emotions = ["happy", "neutral", "surprise", "sad", "angry", "fear"]

        print("\n  [DEMO] Generating synthetic detections...\n")

        # First, register all demo people as NODEs
        for name in demo_people:
            await asyncio.sleep(0.5)
            node_krf = make_node(name, "Person", {"source": "demo"})
            known_persons[name] = True
            self.minutes.register_attendee(name)
            await self.broadcast_fact(node_krf, "NODE", {
                "id": name, "type": "Person", "camera": "demo"
            })

        # Then generate continuous signals
        while self.running:
            for name in demo_people:
                ts = time.time()

                # Random emotion with weighted distribution
                weights = [0.35, 0.30, 0.15, 0.08, 0.05, 0.07]
                emotion = random.choices(emotions, weights=weights, k=1)[0]

                # Generate scores
                scores = {}
                remaining = 1.0
                for e in emotions:
                    if e == emotion:
                        scores[e] = round(random.uniform(0.5, 0.95), 2)
                        remaining -= scores[e]
                    else:
                        s = round(random.uniform(0, max(0, remaining / 3)), 2)
                        scores[e] = s
                        remaining -= s

                engagement = round(random.uniform(0.4, 0.95), 2)

                # Signal
                signal_krf = make_signal(name, f"EMOTION:{emotion.upper()}", scores[emotion], ts, 0.85)
                await self.broadcast_fact(signal_krf, "SIGNAL", {
                    "node": name, "emotion": emotion,
                    "scores": scores, "confidence": 0.85
                })

                # Metric
                metric_krf = make_metric(name, "ENGAGEMENT", engagement, ts)
                await self.broadcast_fact(metric_krf, "METRIC", {
                    "node": name, "metric": "ENGAGEMENT", "value": engagement
                })

                if name not in self.engagement_history:
                    self.engagement_history[name] = []
                self.engagement_history[name].append(engagement)

            # Room-level metric
            all_eng = [h[-1] for h in self.engagement_history.values() if h]
            if all_eng:
                room_eng = sum(all_eng) / len(all_eng)
                room_krf = make_metric("ROOM", "AVG_ENGAGEMENT", room_eng, time.time())
                await self.broadcast_fact(room_krf, "METRIC", {
                    "node": "ROOM", "metric": "AVG_ENGAGEMENT",
                    "value": round(room_eng, 2),
                    "individual": {n: round(h[-1], 2) for n, h in self.engagement_history.items() if h}
                })

            await asyncio.sleep(1.5)

    def _run_http_server(self, port):
        """Serve visualization files over HTTP."""
        handler = partial(SimpleHTTPRequestHandler, directory=str(VIZ_DIR))
        server = HTTPServer(("0.0.0.0", port), handler)
        server.serve_forever()

    def shutdown(self):
        """Clean shutdown."""
        self.running = False
        self.cameras.stop()
        print("\n  Charlotte shutting down.")


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Charlotte OS Demo Server")
    parser.add_argument("--port", type=int, default=DEFAULT_HTTP_PORT, help="HTTP port")
    parser.add_argument("--ws-port", type=int, default=DEFAULT_WS_PORT, help="WebSocket port")
    parser.add_argument("--demo", action="store_true", help="Run with synthetic data (no cameras)")
    args = parser.parse_args()

    charlotte = CharlotteServer(demo_mode=args.demo)

    # Handle Ctrl+C
    def signal_handler(sig, frame):
        charlotte.shutdown()
        sys.exit(0)
    signal.signal(signal.SIGINT, signal_handler)

    # Run
    asyncio.run(charlotte.run(args.port, args.ws_port))


if __name__ == "__main__":
    main()
