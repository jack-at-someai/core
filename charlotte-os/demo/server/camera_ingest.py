"""
camera_ingest.py — MJPEG multi-camera ingest for Charlotte OS face engine.

Pulls MJPEG frames from multiple camera streams (2x Pi Zero W + 1x Zeus Car
ESP32-CAM) and delivers them as numpy BGR arrays to the face engine running
on the Pi 5.

No external dependencies beyond opencv-python (cv2) and Python 3.12 stdlib.
"""

import threading
import time
import urllib.request

try:
    import numpy as np
    import cv2
    _HAS_CV2 = True
except ImportError:
    np = None
    cv2 = None
    _HAS_CV2 = False


class CameraIngest:
    """Pull MJPEG frames from multiple cameras and serve the latest frame
    for each camera to downstream consumers (face engine, etc.)."""

    def __init__(self):
        self._cameras = {}       # camera_id -> {"url": str}
        self._frames = {}        # camera_id -> numpy array (BGR) or None
        self._status = {}        # camera_id -> {"connected", "fps", "last_frame_time"}
        self._threads = {}       # camera_id -> Thread
        self._lock = threading.Lock()
        self._running = False

    # ------------------------------------------------------------------
    # Registry
    # ------------------------------------------------------------------

    def add_camera(self, camera_id: str, url: str) -> None:
        """Register a camera stream.

        camera_id — short label like "zeus", "eye-left", "eye-right".
        url       — full MJPEG stream URL, e.g.
                    "http://192.168.1.100:8080/?action=stream"  (Pi Zero W)
                    "http://192.168.1.101:81/stream"            (ESP32-CAM)
        """
        with self._lock:
            self._cameras[camera_id] = {"url": url}
            self._frames[camera_id] = None
            self._status[camera_id] = {
                "connected": False,
                "fps": 0.0,
                "last_frame_time": 0.0,
            }
        print(f"[camera_ingest] registered camera '{camera_id}' -> {url}")

        # If we are already running, spin up a thread for the new camera
        # immediately so it begins streaming without requiring a restart.
        if self._running:
            self._start_thread(camera_id)

    def remove_camera(self, camera_id: str) -> None:
        """Unregister a camera and stop its ingest thread."""
        with self._lock:
            if camera_id not in self._cameras:
                return
            del self._cameras[camera_id]
            self._frames.pop(camera_id, None)
            self._status.pop(camera_id, None)

        # The thread will notice camera_id is gone and exit on its own.
        thread = self._threads.pop(camera_id, None)
        if thread is not None and thread.is_alive():
            thread.join(timeout=6)

        print(f"[camera_ingest] removed camera '{camera_id}'")

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    def start(self) -> None:
        """Start background ingest threads for every registered camera."""
        self._running = True
        with self._lock:
            camera_ids = list(self._cameras.keys())
        for cid in camera_ids:
            self._start_thread(cid)
        print(f"[camera_ingest] started ({len(camera_ids)} cameras)")

    def stop(self) -> None:
        """Stop all ingest threads cleanly."""
        self._running = False
        for cid, thread in list(self._threads.items()):
            if thread.is_alive():
                thread.join(timeout=6)
        self._threads.clear()
        print("[camera_ingest] stopped")

    # ------------------------------------------------------------------
    # Frame access (non-blocking)
    # ------------------------------------------------------------------

    def get_frame(self, camera_id: str):
        """Return the latest BGR numpy frame for *camera_id*, or None."""
        with self._lock:
            return self._frames.get(camera_id)

    def get_all_frames(self) -> dict:
        """Return {camera_id: frame} for every camera that has a frame."""
        with self._lock:
            return {
                cid: frame
                for cid, frame in self._frames.items()
                if frame is not None
            }

    def get_status(self) -> dict:
        """Return {camera_id: {"connected": bool, "fps": float,
        "last_frame_time": float}} for every registered camera."""
        with self._lock:
            return {cid: dict(s) for cid, s in self._status.items()}

    # ------------------------------------------------------------------
    # Internal — thread management
    # ------------------------------------------------------------------

    def _start_thread(self, camera_id: str) -> None:
        thread = threading.Thread(
            target=self._ingest_loop,
            args=(camera_id,),
            daemon=True,
            name=f"cam-{camera_id}",
        )
        self._threads[camera_id] = thread
        thread.start()

    # ------------------------------------------------------------------
    # Internal — per-camera ingest loop
    # ------------------------------------------------------------------

    def _ingest_loop(self, camera_id: str) -> None:
        """Main loop for a single camera.  Runs in its own thread.
        Automatically reconnects on stream failure with 5-second backoff."""

        RECONNECT_BACKOFF = 5.0
        FPS_WINDOW = 10

        while self._running:
            # Check the camera is still registered.
            with self._lock:
                cam = self._cameras.get(camera_id)
                if cam is None:
                    break
                url = cam["url"]

            stream = None
            try:
                print(f"[camera_ingest] {camera_id}: connecting to {url}")
                request = urllib.request.Request(url)
                stream = urllib.request.urlopen(request, timeout=10)

                with self._lock:
                    self._status[camera_id]["connected"] = True
                print(f"[camera_ingest] {camera_id}: connected")

                frame_times = []  # timestamps of last FPS_WINDOW frames

                buf = b""
                while self._running:
                    # Check camera still registered.
                    with self._lock:
                        if camera_id not in self._cameras:
                            break

                    # Read a chunk from the stream.
                    chunk = stream.read(4096)
                    if not chunk:
                        print(f"[camera_ingest] {camera_id}: stream ended (empty read)")
                        break
                    buf += chunk

                    # Scan for complete JPEG frames using SOI / EOI markers.
                    while True:
                        soi = buf.find(b"\xff\xd8")
                        if soi == -1:
                            # No JPEG start yet — discard everything before
                            # the last byte (it could be half of 0xff 0xd8).
                            if len(buf) > 1:
                                buf = buf[-1:]
                            break

                        eoi = buf.find(b"\xff\xd9", soi + 2)
                        if eoi == -1:
                            # JPEG start found but no end yet — trim bytes
                            # before SOI and wait for more data.
                            buf = buf[soi:]
                            break

                        # Complete JPEG: SOI .. EOI inclusive (EOI marker is 2 bytes).
                        jpeg_bytes = buf[soi : eoi + 2]
                        buf = buf[eoi + 2 :]

                        # Decode JPEG -> BGR numpy array.
                        arr = np.frombuffer(jpeg_bytes, dtype=np.uint8)
                        frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
                        if frame is None:
                            continue

                        now = time.monotonic()
                        frame_times.append(now)
                        if len(frame_times) > FPS_WINDOW:
                            frame_times = frame_times[-FPS_WINDOW:]

                        if len(frame_times) >= 2:
                            elapsed = frame_times[-1] - frame_times[0]
                            fps = (len(frame_times) - 1) / elapsed if elapsed > 0 else 0.0
                        else:
                            fps = 0.0

                        with self._lock:
                            self._frames[camera_id] = frame
                            self._status[camera_id]["fps"] = round(fps, 1)
                            self._status[camera_id]["last_frame_time"] = time.time()

            except Exception as exc:
                print(f"[camera_ingest] {camera_id}: error — {exc}")

            finally:
                if stream is not None:
                    try:
                        stream.close()
                    except Exception:
                        pass

                with self._lock:
                    if camera_id in self._status:
                        self._status[camera_id]["connected"] = False
                        self._status[camera_id]["fps"] = 0.0

            # Still running?  Wait before reconnect.
            if self._running and camera_id in self._cameras:
                print(
                    f"[camera_ingest] {camera_id}: reconnecting in "
                    f"{RECONNECT_BACKOFF}s"
                )
                # Sleep in small increments so stop() isn't blocked.
                deadline = time.monotonic() + RECONNECT_BACKOFF
                while time.monotonic() < deadline and self._running:
                    time.sleep(0.25)

        print(f"[camera_ingest] {camera_id}: thread exiting")
