"""
face_engine.py -- Face recognition + emotion detection pipeline for Charlotte OS demo.

Runs on Raspberry Pi 5. Processes camera frames to identify enrolled people
and read their emotions. Produces structured Detection dicts consumed by the
Charlotte signal layer.

Dependencies (Pi 5):
    pip install face_recognition fer opencv-python-headless

On dev machines without dlib/TensorFlow the module still imports cleanly
and returns synthetic detections so the rest of the stack can run.
"""

import logging
import os
import time
from pathlib import Path

# ---------------------------------------------------------------------------
# Guarded imports -- graceful fallback when native libs are missing
# ---------------------------------------------------------------------------

_HAS_FACE_RECOGNITION = False
try:
    import face_recognition
    _HAS_FACE_RECOGNITION = True
except ImportError:
    face_recognition = None

_HAS_FER = False
try:
    from fer import FER as _FER
    _HAS_FER = True
except ImportError:
    _FER = None

try:
    import cv2
    _HAS_CV2 = True
except ImportError:
    cv2 = None
    _HAS_CV2 = False

try:
    import numpy as np
    _HAS_NUMPY = True
except ImportError:
    np = None
    _HAS_NUMPY = False

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("face_engine")

# ---------------------------------------------------------------------------
# Engagement mapping -- emotion -> base engagement score
# ---------------------------------------------------------------------------

_ENGAGEMENT_MAP = {
    "happy":    0.95,
    "surprise": 0.85,
    "neutral":  0.50,
    "sad":      0.25,
    "fear":     0.20,
    "angry":    0.15,
    "disgust":  0.10,
}

# ---------------------------------------------------------------------------
# Dummy / fallback helpers
# ---------------------------------------------------------------------------

_DUMMY_EMOTIONS = {
    "happy": 0.02,
    "sad": 0.01,
    "angry": 0.01,
    "surprise": 0.02,
    "fear": 0.01,
    "disgust": 0.01,
    "neutral": 0.92,
}


def _dummy_detection(index: int, camera_id: str) -> dict:
    """Return a synthetic detection when native libs are unavailable."""
    return {
        "name": f"Simulated-{index}",
        "emotion": "neutral",
        "emotion_scores": dict(_DUMMY_EMOTIONS),
        "confidence": 0.50,
        "bbox": [60 * index, 200 + 160 * index, 260 * index, 40 + 160 * index],
        "camera_id": camera_id,
        "timestamp": time.time(),
    }


# ---------------------------------------------------------------------------
# FaceEngine
# ---------------------------------------------------------------------------

class FaceEngine:
    """Identify enrolled faces and detect emotions from camera frames.

    Parameters
    ----------
    faces_dir : str
        Path to a directory of enrolled face photos.  Each file should be
        named ``firstname.jpg`` (or ``.png``).  The stem becomes the display
        name (e.g. ``jim.jpg`` -> ``"Jim"``).
    tolerance : float
        face_recognition distance tolerance (lower = stricter).  Default 0.6.
    scale : float
        Downscale factor applied before face detection for speed.  0.5 means
        the frame is halved in each dimension (4x fewer pixels).
    """

    def __init__(self, faces_dir: str = "faces", tolerance: float = 0.6, scale: float = 0.5):
        self.faces_dir = Path(faces_dir)
        self.tolerance = tolerance
        self.scale = scale

        # Enrolled identities
        self.known_encodings: list = []
        self.known_names: list[str] = []

        # Running counter for unknown faces within a session
        self._unknown_counter = 0

        # FER detector -- initialized lazily on first use so the TF graph
        # load only happens when we actually process a frame.
        self._fer_detector = None

        # Load enrolled faces
        self._load_faces()

        # Status summary
        if not _HAS_FACE_RECOGNITION:
            log.warning("face_recognition library not available -- running in simulation mode")
        if not _HAS_FER:
            log.warning("fer library not available -- emotion scores will be synthetic")
        log.info(
            "FaceEngine ready | enrolled=%d | tolerance=%.2f | scale=%.1f | native=%s",
            len(self.known_names),
            self.tolerance,
            self.scale,
            _HAS_FACE_RECOGNITION and _HAS_FER,
        )

    # ------------------------------------------------------------------
    # Initialization helpers
    # ------------------------------------------------------------------

    def _load_faces(self) -> None:
        """Scan faces_dir and compute an encoding for every image found."""
        if not self.faces_dir.exists():
            log.info("Faces directory '%s' does not exist -- no enrollments loaded", self.faces_dir)
            return

        if not _HAS_FACE_RECOGNITION:
            # Still catalogue the names so logs are informative
            for p in sorted(self.faces_dir.iterdir()):
                if p.suffix.lower() in (".jpg", ".jpeg", ".png"):
                    name = p.stem.capitalize()
                    self.known_names.append(name)
                    self.known_encodings.append(None)  # placeholder
                    log.info("Catalogued (no encoding) %s from %s", name, p.name)
            return

        for p in sorted(self.faces_dir.iterdir()):
            if p.suffix.lower() not in (".jpg", ".jpeg", ".png"):
                continue
            name = p.stem.capitalize()
            try:
                img = face_recognition.load_image_file(str(p))
                encodings = face_recognition.face_encodings(img)
                if not encodings:
                    log.warning("No face found in %s -- skipping", p.name)
                    continue
                self.known_encodings.append(encodings[0])
                self.known_names.append(name)
                log.info("Enrolled %s from %s", name, p.name)
            except Exception as exc:
                log.error("Failed to load %s: %s", p.name, exc)

    def _get_fer(self):
        """Lazy-init the FER detector (loads TensorFlow on first call)."""
        if self._fer_detector is None and _HAS_FER:
            log.info("Initializing FER detector (this loads TensorFlow)...")
            self._fer_detector = _FER(mtcnn=False)
            log.info("FER detector ready")
        return self._fer_detector

    # ------------------------------------------------------------------
    # Core API
    # ------------------------------------------------------------------

    def process_frame(self, frame, camera_id: str = "main") -> list[dict]:
        """Process a single BGR frame and return a list of Detection dicts.

        Parameters
        ----------
        frame : numpy.ndarray
            OpenCV BGR image (H x W x 3).
        camera_id : str
            Identifier for the source camera.

        Returns
        -------
        list[dict]
            One dict per detected face.  See module docstring for schema.
        """
        ts = time.time()

        # -- Fallback when native libs are missing --
        if not _HAS_FACE_RECOGNITION or not _HAS_CV2 or not _HAS_NUMPY:
            detections = [_dummy_detection(i, camera_id) for i in range(1, 2)]
            log.info("[%s] SIM  1 face(s) | %s", camera_id, _fmt_names(detections))
            return detections

        h, w = frame.shape[:2]

        # Downscale for speed
        small = cv2.resize(frame, (0, 0), fx=self.scale, fy=self.scale)
        # face_recognition expects RGB
        rgb_small = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)

        # Detect faces + compute encodings
        face_locations = face_recognition.face_locations(rgb_small, model="hog")
        face_encodings = face_recognition.face_encodings(rgb_small, face_locations)

        detections: list[dict] = []

        for loc, encoding in zip(face_locations, face_encodings):
            top, right, bottom, left = loc

            # Scale bbox back to original resolution
            inv = 1.0 / self.scale
            bbox = [
                int(top * inv),
                int(right * inv),
                int(bottom * inv),
                int(left * inv),
            ]

            # --- Identity ---
            name, confidence = self._match_identity(encoding)

            # --- Emotion ---
            emotion, emotion_scores = self._detect_emotion(frame, bbox)

            detections.append({
                "name": name,
                "emotion": emotion,
                "emotion_scores": emotion_scores,
                "confidence": round(confidence, 3),
                "bbox": bbox,
                "camera_id": camera_id,
                "timestamp": ts,
            })

        elapsed_ms = (time.time() - ts) * 1000
        log.info(
            "[%s] %3d face(s) | %.0fms | %s",
            camera_id,
            len(detections),
            elapsed_ms,
            _fmt_names(detections),
        )
        return detections

    def enroll_face(self, name: str, image_path: str) -> bool:
        """Add a new face encoding at runtime.

        Parameters
        ----------
        name : str
            Display name for this person.
        image_path : str
            Path to a photo containing exactly one face.

        Returns
        -------
        bool
            True if enrollment succeeded.
        """
        if not _HAS_FACE_RECOGNITION:
            log.warning("Cannot enroll -- face_recognition not available")
            return False

        try:
            img = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(img)
            if not encodings:
                log.warning("No face found in %s", image_path)
                return False
            self.known_encodings.append(encodings[0])
            self.known_names.append(name.capitalize())
            log.info("Enrolled %s from %s (total=%d)", name.capitalize(), image_path, len(self.known_names))
            return True
        except Exception as exc:
            log.error("Enrollment failed for %s: %s", name, exc)
            return False

    def get_engagement_score(self, detection: dict) -> float:
        """Map a detection's emotion profile to an engagement score in [0, 1].

        Uses a weighted sum across all emotion scores so a face that is 60%
        happy and 40% neutral yields a blended value rather than a hard switch.
        """
        scores = detection.get("emotion_scores", {})
        if not scores:
            return 0.5

        total_weight = 0.0
        weighted_sum = 0.0
        for emotion, prob in scores.items():
            engagement = _ENGAGEMENT_MAP.get(emotion, 0.5)
            weighted_sum += prob * engagement
            total_weight += prob

        if total_weight == 0:
            return 0.5
        return round(min(max(weighted_sum / total_weight, 0.0), 1.0), 3)

    def get_attention_vector(self, detection: dict, frame_width: int = 640, frame_height: int = 480) -> dict:
        """Return the face position relative to frame center.

        This is a placeholder for gaze estimation.  Currently it returns the
        normalized offset of the face center from the frame center, where
        (0, 0) means the face is dead-center, (-1, -1) is top-left, and
        (1, 1) is bottom-right.

        Returns
        -------
        dict
            ``{"dx": float, "dy": float, "distance_from_center": float}``
        """
        bbox = detection.get("bbox", [0, 0, 0, 0])
        top, right, bottom, left = bbox

        face_cx = (left + right) / 2.0
        face_cy = (top + bottom) / 2.0

        # Normalize to [-1, 1]
        dx = (face_cx - frame_width / 2.0) / (frame_width / 2.0)
        dy = (face_cy - frame_height / 2.0) / (frame_height / 2.0)

        # Clamp
        dx = max(-1.0, min(1.0, dx))
        dy = max(-1.0, min(1.0, dy))

        distance = (dx ** 2 + dy ** 2) ** 0.5

        return {
            "dx": round(dx, 3),
            "dy": round(dy, 3),
            "distance_from_center": round(min(distance, 1.414), 3),
        }

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _match_identity(self, encoding) -> tuple[str, float]:
        """Compare a face encoding against enrolled faces.

        Returns (name, confidence) where confidence = 1 - best_distance.
        """
        if not self.known_encodings:
            self._unknown_counter += 1
            return (f"Unknown-{self._unknown_counter}", 0.0)

        distances = face_recognition.face_distance(self.known_encodings, encoding)
        best_idx = int(distances.argmin())
        best_distance = float(distances[best_idx])

        if best_distance <= self.tolerance:
            return (self.known_names[best_idx], round(1.0 - best_distance, 3))
        else:
            self._unknown_counter += 1
            return (f"Unknown-{self._unknown_counter}", round(1.0 - best_distance, 3))

    def _detect_emotion(self, frame, bbox: list) -> tuple[str, dict]:
        """Run FER on the face region and return (primary_emotion, scores).

        Falls back to synthetic neutral scores when FER is unavailable.
        """
        fer = self._get_fer()
        if fer is None or not _HAS_CV2:
            return ("neutral", dict(_DUMMY_EMOTIONS))

        top, right, bottom, left = bbox

        # Clamp bbox to frame bounds
        h, w = frame.shape[:2]
        top = max(0, top)
        left = max(0, left)
        bottom = min(h, bottom)
        right = min(w, right)

        if bottom <= top or right <= left:
            return ("neutral", dict(_DUMMY_EMOTIONS))

        face_roi = frame[top:bottom, left:right]

        try:
            results = fer.detect_emotions(face_roi)
            if results and results[0].get("emotions"):
                raw = results[0]["emotions"]
                # Normalize keys to lowercase, ensure floats
                scores = {k.lower(): round(float(v), 3) for k, v in raw.items()}
                primary = max(scores, key=scores.get)
                return (primary, scores)
        except Exception as exc:
            log.debug("FER failed on ROI: %s", exc)

        return ("neutral", dict(_DUMMY_EMOTIONS))


# ---------------------------------------------------------------------------
# Module-level utilities
# ---------------------------------------------------------------------------

def _fmt_names(detections: list[dict]) -> str:
    """Format detection names for log output."""
    if not detections:
        return "(none)"
    parts = []
    for d in detections:
        emotion_tag = d.get("emotion", "?")
        parts.append(f"{d['name']}({emotion_tag})")
    return ", ".join(parts)


# ---------------------------------------------------------------------------
# CLI smoke test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import sys

    engine = FaceEngine(faces_dir="faces")

    # If an image path was provided, process it
    if len(sys.argv) > 1 and _HAS_CV2:
        img_path = sys.argv[1]
        frame = cv2.imread(img_path)
        if frame is None:
            log.error("Could not read image: %s", img_path)
            sys.exit(1)

        detections = engine.process_frame(frame, camera_id="cli")
        h, w = frame.shape[:2]
        for det in detections:
            engagement = engine.get_engagement_score(det)
            attention = engine.get_attention_vector(det, frame_width=w, frame_height=h)
            print(f"  {det['name']:20s}  conf={det['confidence']:.2f}  "
                  f"emotion={det['emotion']:10s}  engagement={engagement:.2f}  "
                  f"attention=({attention['dx']:+.2f}, {attention['dy']:+.2f})")
    else:
        # Dry run with no frame -- exercises the fallback path
        log.info("No image provided. Running simulation detection...")
        detections = engine.process_frame(None, camera_id="sim")
        for det in detections:
            engagement = engine.get_engagement_score(det)
            print(f"  {det['name']:20s}  emotion={det['emotion']:10s}  engagement={engagement:.2f}")
