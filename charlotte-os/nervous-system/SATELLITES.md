# Charlotte Nervous System — Phase 2: Pi Zero 2W Satellites

**Goal:** Instrument a single boardroom with Pi Zero 2W satellites so Charlotte can observe the room as an environment and each individual in it. Track facial expressions, emotional responses, engagement, and environmental state in real time during presentations. Full dive line from micro-expression to fired PROTOCOL.

**The demo premise:** Someone gives a presentation. Charlotte watches the room. Afterward, Charlotte can tell you exactly when the audience lost interest, who was confused at slide 14, when energy peaked, and what environmental factors (temperature, CO2, lighting) may have contributed. Every claim traces back through SIGNAL → METRIC → sensor reading.

---

## The Oculus Principle: Triangulation via Opposing Sensors

Oculus Rift achieves room-scale tracking with 2+ sensors at different positions and heights. The same principle applies here:

```
                    BOARDROOM (top-down view)
    ┌─────────────────────────────────────────────┐
    │                                             │
    │  SAT-A (high)                SAT-B (low)   │
    │  ┌───┐                          ┌───┐      │
    │  │Pi0│ cam↘    ┌─────────┐   ↙cam│Pi0│      │
    │  │ 2W│ mic     │ TABLE   │    mic│ 2W│      │
    │  └───┘         │         │      └───┘      │
    │     ↕ 2.1m     │  ☺ ☺ ☺ │       ↕ 0.8m    │
    │                │  ☺ ☺ ☺ │                  │
    │  SAT-C (low)   │         │   SAT-D (high)  │
    │  ┌───┐         └─────────┘      ┌───┐      │
    │  │Pi0│ cam↗                   ↖cam│Pi0│      │
    │  │ 2W│ mic                    mic│ 2W│      │
    │  └───┘                          └───┘      │
    │     ↕ 0.8m          SCREEN       ↕ 2.1m    │
    │                   ┌────────┐                │
    └───────────────────┴────────┴────────────────┘

    High mount: ~2.1m (angled down — captures face, head tilt, posture)
    Low mount:  ~0.8m (angled up — captures under-chin expressions,
                       hand gestures, laptop screens)

    Diagonal pairs: A↔D (high), B↔C (low)
    Cross coverage: every seat visible from 2+ angles
```

**Why 4 satellites, not 8:** Each Pi Zero 2W carries a camera + microphone + environmental sensor. Four positions at alternating heights on opposite corners gives overlapping coverage of every seat from multiple angles. The "8 eyes and ears" = 4 cameras + 4 microphones. If a room is large or has blind spots, add a 5th/6th satellite on the long walls.

---

## Hardware Per Satellite

### Each Pi Zero 2W carries:

| Component | Model | Purpose | Cost |
|---|---|---|---|
| **Pi Zero 2W** | Raspberry Pi Zero 2W | Compute, WiFi, streaming | ~$15 |
| **Camera** | Pi Camera Module 3 Wide (120°) | Facial tracking, posture, gaze | ~$35 |
| **Microphone** | I2S MEMS mic (INMP441 or SPH0645) | Voice capture, tone analysis | ~$5 |
| **Env sensor** | BME680 (I2C) | Temperature, humidity, pressure, air quality (VOC) | ~$15 |
| **mmWave (optional)** | LD2410 or HLK-LD2410B | Presence, micro-motion, fidget detection | ~$5 |
| **IR LEDs (optional)** | 850nm IR illuminator board | Low-light facial tracking without visible light | ~$5 |
| **Power** | USB-C 5V/2.5A or PoE hat | Continuous power | ~$10 |
| **Case + mount** | 3D printed or off-shelf bracket | Wall/ceiling mount at specified height | ~$5 |

**Per satellite: ~$80-95.** Four satellites per room: **~$320-380.**

### Wiring diagram (per satellite)
```
Pi Zero 2W
├── CSI ribbon cable ──→ Pi Camera Module 3 Wide
├── GPIO (I2S) ────────→ INMP441 MEMS Microphone
│   ├── GPIO 18 (BCLK)
│   ├── GPIO 19 (LRCLK)
│   └── GPIO 20 (DIN)
├── GPIO (I2C) ────────→ BME680 Environmental Sensor
│   ├── GPIO 2 (SDA)
│   └── GPIO 3 (SCL)
├── GPIO (UART, optional)→ LD2410 mmWave
│   ├── GPIO 14 (TX)
│   └── GPIO 15 (RX)
└── USB-C ─────────────→ Power
```

---

## What Runs Where

The Pi Zero 2W (512MB RAM, 1GHz quad-core) is a **sensor node**, not a compute node. It captures and streams. The Pi 5 hub does all inference.

### On each Pi Zero 2W satellite:
| Task | Method | CPU Load |
|---|---|---|
| Camera capture | `libcamera` → MJPEG stream at 10fps, 640x480 | ~15% |
| Audio capture | ALSA/I2S → raw PCM 16kHz stream | ~5% |
| Env sensor read | I2C poll every 30s (temp, humidity, VOC) | ~1% |
| mmWave read | UART poll, parse presence/motion | ~2% |
| MQTT publish | Sensor telemetry to hub | ~2% |
| Stream video | TCP/RTSP to hub for ML inference | ~10% |
| **Total** | | **~35%** |

### On the Pi 5 hub (the brain):
| Task | Method | Notes |
|---|---|---|
| Receive 4 video streams | TCP/RTSP ingest | 4 × 640x480 @ 10fps |
| Face detection | MediaPipe Face Detection | Locate faces in each frame |
| Face mesh / landmarks | MediaPipe Face Mesh (468 points) | Per-person facial geometry |
| Facial Action Units | FACS decoder on landmarks | AU1, AU4, AU6, AU7, AU12, AU43, etc. |
| Emotion classification | AU combinations → emotion | Mapped locally, no cloud needed |
| Gaze estimation | Head pose + eye landmarks | Where is each person looking |
| Speaker diarization | Audio stream analysis | Who is speaking when |
| Voice tone analysis | Pitch, energy, speech rate | Engagement proxy |
| Sensor fusion | Combine all satellite data | Unified room state |
| METRIC → SIGNAL → PROTOCOL | Charlotte valuation pipeline | The dive line |
| SQLite logging | Time-series storage | Full audit trail |

**Pi 5 load estimate:** ~60-80% CPU with 4 streams. The 8GB model is recommended. If it's too heavy, drop to 5fps or process every other frame.

---

## Two Observable Layers

Charlotte observes two things simultaneously, each with its own microtheory:

### Layer 1: The Room as Environment
```
NODE:   BoardroomAlpha           (the physical room)
METRIC: temperature = 23.4°C     (from BME680 average across 4 satellites)
METRIC: co2_proxy = 412 VOC      (air quality index)
METRIC: ambient_light = 340 lux  (from camera exposure analysis)
METRIC: noise_floor = 42 dB      (from mic baseline)
METRIC: occupancy = 6            (from mmWave + face count)
SIGNAL: room_getting_warm        (temp > 24°C for > 5 min)
SIGNAL: air_quality_declining    (VOC rising trend over 20 min)
PROTOCOL: suggest_break          (triggered by warm + stale air + low engagement)
```

### Layer 2: Each Individual as Observed Subject
```
NODE:   Person_Seat3             (identified by position, or by face enrollment)
METRIC: au4_brow_lower = 0.73   (brow furrow intensity, 0-1)
METRIC: au7_lid_tight = 0.61    (eyelid tightener)
METRIC: gaze_on_screen = 0.82   (fraction of time looking at presentation)
METRIC: head_tilt = -12°        (negative = tilting away)
METRIC: speech_rate = 0 wpm     (silent, listening)
SIGNAL: confusion_detected       (AU4 > 0.6 AND AU7 > 0.5 for > 3s)
SIGNAL: attention_drift          (gaze_on_screen < 0.5 for > 30s)
PROTOCOL: flag_for_presenter     ("Seat 3 showed confusion at 14:32,
                                   correlates with slide 14 transition")
```

**The dive line is unbroken:**
```
PROTOCOL: flag_for_presenter
  └─ SIGNAL: confusion_detected
       └─ METRIC: au4_brow_lower = 0.73 (threshold: 0.6)
            └─ SOURCE: Face Mesh landmark delta, SAT-A camera
                 └─ FRAME: sat-a_frame_84231.jpg @ 14:32:07.442
       └─ METRIC: au7_lid_tight = 0.61 (threshold: 0.5)
            └─ SOURCE: Face Mesh landmark delta, SAT-D camera
                 └─ FRAME: sat-d_frame_84229.jpg @ 14:32:07.318
```

Every PROTOCOL traces back to a specific frame from a specific camera at a specific timestamp. That is the dive line. No confidence scores. No "the model thinks." Just: this was measured, this threshold was crossed, this rule fired.

---

## Facial Action Coding System (FACS) → Charlotte METRICs

FACS Action Units are the METRICs. Emotion labels are SIGNALs derived from AU combinations.

### Core Action Units to track:

| AU | Name | What it measures | METRIC name |
|---|---|---|---|
| AU1 | Inner brow raise | Surprise, worry | `au1_inner_brow_raise` |
| AU2 | Outer brow raise | Surprise | `au2_outer_brow_raise` |
| AU4 | Brow lowerer | Confusion, anger, concentration | `au4_brow_lower` |
| AU5 | Upper lid raise | Surprise, fear | `au5_upper_lid_raise` |
| AU6 | Cheek raise | Genuine smile (Duchenne) | `au6_cheek_raise` |
| AU7 | Lid tightener | Focus, squinting, confusion | `au7_lid_tight` |
| AU9 | Nose wrinkle | Disgust | `au9_nose_wrinkle` |
| AU12 | Lip corner pull | Smile | `au12_lip_corner_pull` |
| AU15 | Lip corner depress | Sadness, disapproval | `au15_lip_corner_depress` |
| AU20 | Lip stretch | Fear, tension | `au20_lip_stretch` |
| AU23 | Lip tightener | Anger, determination | `au23_lip_tight` |
| AU26 | Jaw drop | Surprise, awe | `au26_jaw_drop` |
| AU43 | Eye closure | Fatigue, boredom | `au43_eye_closure` |
| AU45 | Blink | Blink rate (stress proxy) | `au45_blink_rate` |

### Emotion SIGNALs (derived from AU combinations):

| SIGNAL | AU Formula | Meaning |
|---|---|---|
| `engagement_high` | AU6 > 0.4 AND AU12 > 0.3 AND gaze_on_screen > 0.7 | Actively engaged, smiling |
| `confusion_detected` | AU4 > 0.6 AND AU7 > 0.5 | Furrowed brow, squinting |
| `surprise_detected` | AU1 > 0.5 AND AU2 > 0.5 AND AU5 > 0.4 | Eyebrows up, eyes wide |
| `boredom_onset` | AU43 > 0.3 AND gaze_on_screen < 0.4 AND au45_blink_rate < 10/min | Drowsy eyes, looking away |
| `disagreement_subtle` | AU15 > 0.4 AND AU4 > 0.3 AND head_shake > 2/min | Lip corners down, slight head shake |
| `stress_elevated` | au45_blink_rate > 25/min AND AU20 > 0.3 | Rapid blink + lip tension |
| `focus_deep` | AU4 > 0.3 AND AU7 > 0.4 AND gaze_on_screen > 0.9 | Concentrated stare |

These are all local computations. No cloud. No LLM. Pure METRIC → threshold → SIGNAL.

---

## Satellite Software Stack

### Provisioning each Pi Zero 2W

#### Flash
Same as hub: Raspberry Pi OS Lite 64-bit via Imager.
- Hostname: `charlotte-sat-a`, `charlotte-sat-b`, `charlotte-sat-c`, `charlotte-sat-d`
- User: `jack`
- WiFi: same network as hub
- SSH enabled

#### Base packages
```bash
sudo apt update && sudo apt full-upgrade -y
sudo apt install -y python3-pip python3-venv libcamera-apps \
  mosquitto-clients i2c-tools git ffmpeg
```

#### Enable interfaces
```bash
sudo raspi-config nonint do_camera 0    # enable camera
sudo raspi-config nonint do_i2c 0       # enable I2C
sudo raspi-config nonint do_serial_hw 0 # enable UART (for mmWave)
sudo reboot
```

#### Camera streaming service
```python
"""
satellite_camera.py — Streams camera frames to hub via TCP.
Runs on each Pi Zero 2W.
"""
import socket
import subprocess
import time
import json

HUB_IP = "192.168.1.100"  # charlotte-hub static IP
STREAM_PORT = 5000         # SAT-A=5000, B=5001, C=5002, D=5003
SAT_ID = "sat-a"           # set per satellite

def stream_camera():
    """Stream MJPEG frames to hub over TCP."""
    # libcamera-vid outputs H.264, but for frame-by-frame ML we want MJPEG
    proc = subprocess.Popen([
        "libcamera-vid",
        "--codec", "mjpeg",
        "--width", "640",
        "--height", "480",
        "--framerate", "10",
        "--inline",            # headers in each frame
        "--listen",            # wait for TCP connection
        "-t", "0",             # run forever
        "-o", f"tcp://0.0.0.0:{STREAM_PORT}"
    ])
    return proc
```

#### Sensor telemetry service
```python
"""
satellite_sensors.py — Reads I2C/UART sensors, publishes to MQTT.
Runs on each Pi Zero 2W.
"""
import time
import json
import paho.mqtt.client as mqtt

# BME680 via I2C
try:
    import bme680
    env_sensor = bme680.BME680(bme680.I2C_ADDR_PRIMARY)
    env_sensor.set_humidity_oversample(bme680.OS_2X)
    env_sensor.set_pressure_oversample(bme680.OS_4X)
    env_sensor.set_temperature_oversample(bme680.OS_8X)
    env_sensor.set_filter(bme680.FILTER_SIZE_3)
    HAS_ENV = True
except Exception:
    HAS_ENV = False

SAT_ID = "sat-a"
ROOM = "boardroom"
HUB_IP = "192.168.1.100"

client = mqtt.Client(client_id=f"charlotte-{SAT_ID}")
client.connect(HUB_IP, 1883)
client.loop_start()

def publish_env():
    if not HAS_ENV:
        return
    if env_sensor.get_sensor_data():
        payload = {
            "satellite": SAT_ID,
            "room": ROOM,
            "timestamp": time.time(),
            "temperature_c": round(env_sensor.data.temperature, 2),
            "humidity_pct": round(env_sensor.data.humidity, 2),
            "pressure_hpa": round(env_sensor.data.pressure, 2),
            "gas_resistance_ohms": env_sensor.data.gas_resistance if env_sensor.data.heat_stable else None
        }
        client.publish(f"charlotte/sensor/{ROOM}/environment", json.dumps(payload))

def publish_heartbeat():
    client.publish(f"charlotte/satellite/{SAT_ID}/status", json.dumps({
        "satellite": SAT_ID,
        "timestamp": time.time(),
        "status": "online"
    }))

while True:
    publish_env()
    publish_heartbeat()
    time.sleep(30)
```

#### Audio capture service
```python
"""
satellite_audio.py — Captures I2S mic audio, streams to hub.
Runs on each Pi Zero 2W.
"""
import subprocess

HUB_IP = "192.168.1.100"
AUDIO_PORT = 6000  # SAT-A=6000, B=6001, C=6002, D=6003
SAT_ID = "sat-a"

def stream_audio():
    """Capture I2S mic and stream raw PCM to hub via TCP."""
    # arecord captures from I2S MEMS mic
    # Pipe to netcat for TCP streaming to hub
    proc = subprocess.Popen(
        f"arecord -D plughw:1,0 -f S16_LE -r 16000 -c 1 -t raw | "
        f"nc {HUB_IP} {AUDIO_PORT}",
        shell=True
    )
    return proc
```

#### Systemd service (per satellite)
```bash
sudo tee /etc/systemd/system/charlotte-satellite.service << 'EOF'
[Unit]
Description=Charlotte Satellite Node
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=jack
WorkingDirectory=/home/jack/charlotte-satellite
ExecStart=/home/jack/charlotte-satellite/venv/bin/python main.py
Restart=always
RestartSec=10
Environment=SAT_ID=sat-a
Environment=ROOM=boardroom

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable charlotte-satellite
sudo systemctl start charlotte-satellite
```

---

## Hub-Side: Receiving & Processing

### Video ingest + face analysis (runs on Pi 5)
```python
"""
hub_vision.py — Receives satellite video streams, runs face mesh,
computes Action Units, publishes METRICs to MQTT.
"""
import cv2
import mediapipe as mp
import numpy as np
import json
import time
import paho.mqtt.client as mqtt
from threading import Thread

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=8,       # boardroom max ~8 people
    refine_landmarks=True, # iris tracking for gaze
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

mqtt_client = mqtt.Client(client_id="charlotte-hub-vision")
mqtt_client.connect("localhost", 1883)
mqtt_client.loop_start()

# Satellite stream endpoints
STREAMS = {
    "sat-a": "tcp://192.168.1.101:5000",
    "sat-b": "tcp://192.168.1.102:5001",
    "sat-c": "tcp://192.168.1.103:5002",
    "sat-d": "tcp://192.168.1.104:5003",
}

def compute_action_units(landmarks) -> dict:
    """
    Derive FACS Action Units from MediaPipe 468 face landmarks.
    Each AU is a float 0.0-1.0 representing activation intensity.

    This is the METRIC layer — raw measurements from the face mesh.
    """
    pts = np.array([(lm.x, lm.y, lm.z) for lm in landmarks])

    # AU4: Brow lowerer — distance between inner brow points and eye center
    brow_inner_l = pts[107]
    brow_inner_r = pts[336]
    eye_center_l = pts[159]
    eye_center_r = pts[386]
    brow_eye_dist_l = np.linalg.norm(brow_inner_l - eye_center_l)
    brow_eye_dist_r = np.linalg.norm(brow_inner_r - eye_center_r)
    # Normalize against face height
    face_height = np.linalg.norm(pts[10] - pts[152])  # forehead to chin
    au4 = max(0, 1.0 - ((brow_eye_dist_l + brow_eye_dist_r) / 2) / (face_height * 0.18))

    # AU6: Cheek raise — cheek landmark elevation
    cheek_l = pts[123]
    cheek_r = pts[352]
    nose_tip = pts[4]
    cheek_rise = 1.0 - (((cheek_l[1] + cheek_r[1]) / 2 - nose_tip[1]) / (face_height * 0.15))
    au6 = np.clip(cheek_rise, 0, 1)

    # AU12: Lip corner pull (smile) — mouth width vs rest
    mouth_l = pts[61]
    mouth_r = pts[291]
    mouth_width = np.linalg.norm(mouth_l - mouth_r)
    au12 = np.clip((mouth_width / (face_height * 0.38)) - 0.5, 0, 1)

    # AU43: Eye closure — eyelid aperture
    eye_top_l, eye_bot_l = pts[159], pts[145]
    eye_top_r, eye_bot_r = pts[386], pts[374]
    eye_open_l = np.linalg.norm(eye_top_l - eye_bot_l)
    eye_open_r = np.linalg.norm(eye_top_r - eye_bot_r)
    au43 = max(0, 1.0 - ((eye_open_l + eye_open_r) / 2) / (face_height * 0.045))

    # Gaze: iris position relative to eye bounds (simplified)
    iris_l = pts[468]  # left iris center (refined landmarks)
    iris_r = pts[473]  # right iris center
    eye_inner_l, eye_outer_l = pts[133], pts[33]
    gaze_x = (iris_l[0] - eye_inner_l[0]) / (eye_outer_l[0] - eye_inner_l[0] + 1e-6)
    gaze_centered = 1.0 - abs(gaze_x - 0.5) * 2  # 1.0 = looking center

    return {
        "au4_brow_lower": round(float(au4), 3),
        "au6_cheek_raise": round(float(au6), 3),
        "au12_lip_corner_pull": round(float(au12), 3),
        "au43_eye_closure": round(float(au43), 3),
        "gaze_centered": round(float(gaze_centered), 3),
    }

def process_stream(sat_id: str, stream_url: str):
    """Process one satellite's video stream."""
    cap = cv2.VideoCapture(stream_url)
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            time.sleep(1)
            cap = cv2.VideoCapture(stream_url)  # reconnect
            continue

        frame_count += 1
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb)

        if results.multi_face_landmarks:
            for i, face_landmarks in enumerate(results.multi_face_landmarks):
                aus = compute_action_units(face_landmarks.landmark)
                aus["satellite"] = sat_id
                aus["person_index"] = i
                aus["frame"] = frame_count
                aus["timestamp"] = time.time()

                # Publish each AU as a METRIC
                person_id = f"person_{i}"  # TODO: replace with face enrollment ID
                for metric_name, value in aus.items():
                    if metric_name in ("satellite", "person_index", "frame", "timestamp"):
                        continue
                    mqtt_client.publish(
                        f"charlotte/metric/{person_id}/{metric_name}",
                        json.dumps({
                            "person": person_id,
                            "metric": metric_name,
                            "value": value,
                            "source_satellite": sat_id,
                            "frame": frame_count,
                            "timestamp": aus["timestamp"]
                        })
                    )

# Launch one thread per satellite stream
for sat_id, url in STREAMS.items():
    Thread(target=process_stream, args=(sat_id, url), daemon=True).start()
```

### Signal detection engine (runs on Pi 5)
```python
"""
hub_signals.py — Subscribes to METRIC topics, detects SIGNALs,
fires PROTOCOLs. This IS the Charlotte valuation layer at the edge.
"""
import json
import time
import paho.mqtt.client as mqtt
from collections import defaultdict

# ── State: rolling window of METRICs per person ──
metric_windows = defaultdict(lambda: defaultdict(list))
WINDOW_SIZE = 30  # keep last 30 readings (~3 seconds at 10fps)

# ── SIGNAL definitions: threshold rules ──
SIGNAL_RULES = {
    "confusion_detected": {
        "conditions": [
            ("au4_brow_lower", ">", 0.6),
            ("au7_lid_tight", ">", 0.5),
        ],
        "duration_s": 3.0,  # must persist for 3 seconds
        "logic": "AND"
    },
    "engagement_high": {
        "conditions": [
            ("au6_cheek_raise", ">", 0.4),
            ("au12_lip_corner_pull", ">", 0.3),
            ("gaze_centered", ">", 0.7),
        ],
        "duration_s": 2.0,
        "logic": "AND"
    },
    "boredom_onset": {
        "conditions": [
            ("au43_eye_closure", ">", 0.3),
            ("gaze_centered", "<", 0.4),
        ],
        "duration_s": 5.0,
        "logic": "AND"
    },
    "attention_drift": {
        "conditions": [
            ("gaze_centered", "<", 0.3),
        ],
        "duration_s": 10.0,
        "logic": "AND"
    },
}

# ── PROTOCOL definitions: what to do when SIGNALs fire ──
PROTOCOL_RULES = {
    "flag_confusion_for_presenter": {
        "trigger_signals": ["confusion_detected"],
        "action": "log_and_notify",
        "message": "Confusion detected — consider pausing for questions"
    },
    "flag_engagement_drop": {
        "trigger_signals": ["boredom_onset", "attention_drift"],
        "logic": "OR",
        "action": "log_and_notify",
        "message": "Audience engagement dropping — consider a change of pace"
    },
    "suggest_break": {
        "trigger_signals": ["boredom_onset"],
        "env_conditions": [
            ("temperature_c", ">", 24.0),
            # co2/VOC rising would also trigger this
        ],
        "action": "log_and_notify",
        "message": "Room warm + audience fatigue — suggest a break"
    },
}

# ── Active signals per person (with timestamps) ──
active_signals = defaultdict(dict)

mqtt_client = mqtt.Client(client_id="charlotte-hub-signals")

def on_metric(client, userdata, msg):
    """Ingest a METRIC reading, check for SIGNAL threshold crossings."""
    data = json.loads(msg.payload)
    person = data["person"]
    metric = data["metric"]
    value = data["value"]
    ts = data["timestamp"]

    # Update rolling window
    window = metric_windows[person][metric]
    window.append((ts, value))
    # Trim to window size
    while len(window) > WINDOW_SIZE:
        window.pop(0)

    # Check each SIGNAL rule
    for signal_name, rule in SIGNAL_RULES.items():
        if check_signal(person, rule, ts):
            if signal_name not in active_signals[person]:
                # New signal firing
                active_signals[person][signal_name] = ts
                fire_signal(person, signal_name, ts, data)

                # Check PROTOCOLs
                check_protocols(person, ts)
        else:
            # Signal no longer active
            active_signals[person].pop(signal_name, None)

def check_signal(person: str, rule: dict, now: float) -> bool:
    """Check if all conditions in a signal rule are met over its duration window."""
    duration = rule["duration_s"]

    for metric_name, op, threshold in rule["conditions"]:
        window = metric_windows[person].get(metric_name, [])
        # Get readings within duration window
        recent = [(t, v) for t, v in window if now - t <= duration]
        if not recent:
            return False

        # All readings in window must satisfy the condition
        for _, value in recent:
            if op == ">" and not (value > threshold):
                return False
            elif op == "<" and not (value < threshold):
                return False
            elif op == ">=" and not (value >= threshold):
                return False

    return True

def fire_signal(person: str, signal_name: str, ts: float, source_data: dict):
    """Publish a SIGNAL to MQTT with full dive-line trace."""
    payload = {
        "person": person,
        "signal": signal_name,
        "timestamp": ts,
        "source_metric": source_data["metric"],
        "source_value": source_data["value"],
        "source_satellite": source_data.get("source_satellite"),
        "source_frame": source_data.get("frame"),
    }
    mqtt_client.publish(f"charlotte/signal/{person}/{signal_name}", json.dumps(payload))
    print(f"[SIGNAL] {person}: {signal_name} @ {ts}")

def check_protocols(person: str, ts: float):
    """Check if any PROTOCOL should fire based on active signals."""
    person_signals = set(active_signals.get(person, {}).keys())

    for protocol_name, rule in PROTOCOL_RULES.items():
        triggers = set(rule["trigger_signals"])
        logic = rule.get("logic", "AND")

        if logic == "AND" and triggers.issubset(person_signals):
            fire_protocol(person, protocol_name, rule, ts)
        elif logic == "OR" and triggers.intersection(person_signals):
            fire_protocol(person, protocol_name, rule, ts)

def fire_protocol(person: str, protocol_name: str, rule: dict, ts: float):
    """Publish a PROTOCOL firing with complete dive-line trace."""
    # Build the dive line
    trace = {
        "protocol": protocol_name,
        "message": rule["message"],
        "person": person,
        "timestamp": ts,
        "trigger_signals": {},
    }
    for sig_name in rule["trigger_signals"]:
        if sig_name in active_signals.get(person, {}):
            trace["trigger_signals"][sig_name] = {
                "fired_at": active_signals[person][sig_name],
                # Source metrics are in the signal payloads on MQTT
            }

    mqtt_client.publish(f"charlotte/protocol/{protocol_name}", json.dumps(trace))
    print(f"[PROTOCOL] {protocol_name} for {person}: {rule['message']}")

mqtt_client.on_message = on_metric
mqtt_client.connect("localhost", 1883)
mqtt_client.subscribe("charlotte/metric/#")
mqtt_client.loop_forever()
```

---

## Person Identification & Tracking

### Cross-satellite identity resolution

The same person appears in multiple camera feeds. The hub must resolve "face in SAT-A frame 842" and "face in SAT-D frame 843" to the same Person node.

**Approach: Seat-based assignment (Phase 1 — simple)**
- Pre-map seat positions in each camera's field of view
- Face bounding box position → seat assignment
- Works for fixed-seating boardrooms

**Approach: Face enrollment (Phase 2 — production)**
- On first meeting entry, capture face embeddings per person
- Use a lightweight face recognition model (e.g., `face_recognition` library with dlib, or MobileFaceNet)
- Match across camera feeds: "This face in SAT-A is the same as that face in SAT-D"
- Assign a persistent Person NODE ID
- Future: speaker voice enrollment for speaker ID even when face is occluded

```python
"""
Person enrollment — captures face embedding for persistent identity.
Run once per new person entering the room.
"""
# Using face_recognition (dlib-based, runs on Pi 5)
import face_recognition

def enroll_person(frame, name: str) -> dict:
    """Capture face encoding from a frame, return enrollment data."""
    encodings = face_recognition.face_encodings(frame)
    if encodings:
        return {
            "name": name,
            "encoding": encodings[0].tolist(),
            "enrolled_at": time.time()
        }
    return None

def identify_person(frame, enrolled: list[dict]) -> str:
    """Match a face in frame against enrolled people."""
    encodings = face_recognition.face_encodings(frame)
    if not encodings:
        return "unknown"

    for person in enrolled:
        match = face_recognition.compare_faces(
            [np.array(person["encoding"])],
            encodings[0],
            tolerance=0.6
        )
        if match[0]:
            return person["name"]
    return "unknown"
```

---

## Room-Scale Spatial Plane (New KRF addition)

The existing spatial spine has GeospatialPlane (Earth) and TopologicalPlane (graph). The boardroom needs a **RoomSpatialPlane** — x, y, z coordinates within a physical room.

```
;;; This would be added to charlotte-os/spine/spatial/
;;; as room-scale.krf

(in-microtheory CharlotteSpatialMt)

;;; ── Room-scale spatial plane ──
;;; Coordinates within a physical room: x (width), y (depth), z (height)
;;; Origin: corner nearest the door, floor level.
;;; Units: meters.

(isa RoomSpatialPlane SpatialPlane)
(isa RoomCoordinate Collection)
(isa RoomX SpatialDimension)   ;; width axis
(isa RoomY SpatialDimension)   ;; depth axis
(isa RoomZ SpatialDimension)   ;; height axis
(dimensionUnit RoomX Meters)
(dimensionUnit RoomY Meters)
(dimensionUnit RoomZ Meters)

;;; ── Sensor placement ──
(isa SensorNode NODE)
(isa sensorPosition Relation)
(arity sensorPosition 4)  ;; (sensorPosition ?sensor ?x ?y ?z)

;;; ── Observable zones ──
;;; Each sensor has a field-of-view cone. Overlapping cones = triangulation.
(isa fieldOfView Relation)
(arity fieldOfView 3)  ;; (fieldOfView ?sensor ?angle_degrees ?range_meters)

(isa triangulatedZone Relation)
(implies
  (and (isa ?S1 SensorNode)
       (isa ?S2 SensorNode)
       (not (equals ?S1 ?S2))
       (fieldOfViewOverlap ?S1 ?S2 ?ZONE))
  (triangulatedZone ?S1 ?S2 ?ZONE))

;;; ── Seated positions ──
(isa SeatPosition NODE)
(isa seatLocation Relation)
(arity seatLocation 4)  ;; (seatLocation ?seat ?x ?y ?z)

;;; ── Person-at-seat binding ──
(isa seatedAt Relation)
(arity seatedAt 2)
(arg1Isa seatedAt Person)
(arg2Isa seatedAt SeatPosition)
```

---

## Demo Dashboard

The hub serves a real-time web dashboard (lightweight — Python + websockets + MQTT over websockets on port 9001).

```
┌─────────────────────────────────────────────────────────────┐
│  CHARLOTTE — Boardroom Alpha — Live Session                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─── Room Environment ───────────────────────────────┐    │
│  │ Temp: 23.4°C  │  Humidity: 42%  │  VOC: 412       │    │
│  │ Light: 340 lux │  Occupancy: 6  │  ⚡ All normal   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─── Audience Engagement Timeline ───────────────────┐    │
│  │ ██████████████████████▓▓▓▓▒▒▒▒▒▒░░░░████████████  │    │
│  │ HIGH            MED    LOW    DRIFTING   RECOVERED │    │
│  │ Slide 1-8       9-11   12-14  15        16-20     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─── Individual Tracking ────────────────────────────┐    │
│  │ Seat 1 (Sarah)  : ████████ Engaged     AU6: 0.7   │    │
│  │ Seat 2 (Mike)   : ████░░░░ Confused    AU4: 0.8   │    │
│  │ Seat 3 (Unknown): ██████▓▓ Focused     gaze: 0.9  │    │
│  │ Seat 4 (Raj)    : ██░░░░░░ Drifting    gaze: 0.2  │    │
│  │ Seat 5 (Lisa)   : ████████ Engaged     AU12: 0.6  │    │
│  │ Seat 6 (Tom)    : ███▓░░░░ Fatigued    AU43: 0.5  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─── Active Signals ────────────────────────────────┐     │
│  │ ⚠ confusion_detected — Seat 2 (Mike) — 3.2s      │     │
│  │ ⚠ attention_drift — Seat 4 (Raj) — 12.1s         │     │
│  │ ● engagement_high — Seat 1 (Sarah) — 45.0s       │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ┌─── Protocol Log ──────────────────────────────────┐     │
│  │ 14:32 flag_confusion_for_presenter (Seat 2)       │     │
│  │       └─ confusion_detected                       │     │
│  │           └─ au4_brow_lower = 0.73 (> 0.6)       │     │
│  │               └─ sat-a frame 84231 @ 14:32:07     │     │
│  │                                                    │     │
│  │ 14:38 flag_engagement_drop (Seat 4)               │     │
│  │       └─ attention_drift                          │     │
│  │           └─ gaze_centered = 0.18 (< 0.3)        │     │
│  │               └─ sat-d frame 87902 @ 14:38:22     │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  [DIVE LINE] Click any protocol to see full trace ──→      │
└─────────────────────────────────────────────────────────────┘
```

---

## Bill of Materials — Single Boardroom

| Item | Qty | Unit Cost | Total |
|---|---|---|---|
| Raspberry Pi 5 (8GB) — hub | 1 | $80 | $80 |
| Pi Zero 2W — satellites | 4 | $15 | $60 |
| Pi Camera Module 3 Wide | 4 | $35 | $140 |
| INMP441 I2S MEMS mic | 4 | $5 | $20 |
| BME680 env sensor | 4 | $15 | $60 |
| LD2410 mmWave (optional) | 4 | $5 | $20 |
| microSD cards (32GB) | 5 | $8 | $40 |
| USB-C power supplies | 5 | $10 | $50 |
| Cases + wall mounts | 5 | $5 | $25 |
| USB mic + speaker (hub) | 1 | $30 | $30 |
| Ethernet cable (hub) | 1 | $5 | $5 |
| | | **Total** | **~$530** |

---

## Implementation Order

| Step | What | Depends On |
|---|---|---|
| 1 | Hub fully operational (Phase 1 plan) | Nothing |
| 2 | Flash + provision 1 satellite (SAT-A) | Step 1 |
| 3 | Camera streaming SAT-A → Hub working | Step 2 |
| 4 | MediaPipe face mesh running on hub | Step 3 |
| 5 | AU computation + MQTT publishing | Step 4 |
| 6 | Signal detection engine running | Step 5 |
| 7 | Add remaining 3 satellites | Step 3 proven |
| 8 | Cross-satellite person identity | Step 7 |
| 9 | Dashboard (websocket + HTML) | Step 6 |
| 10 | Face enrollment system | Step 8 |
| 11 | Room-scale KRF added to boot image | Step 6 |
| 12 | Voice integration (wake word → Claude) | Hub Phase 1 |
| 13 | Presentation correlation (slide sync) | Step 9 |

---

## Next: Phase 3 — Additional Sensor Types

Once the boardroom demo is proven, extend to other room types with different sensor loadouts:
- **Research lab rooms**: air quality focus, equipment vibration sensors, chemical sensors
- **Common areas**: traffic flow, occupancy patterns, energy usage
- **Outdoor**: weather station, light levels, noise

Each room type gets its own sensor profile but shares the same MQTT → METRIC → SIGNAL → PROTOCOL pipeline. The nervous system is the same everywhere. Only the sensors change.
