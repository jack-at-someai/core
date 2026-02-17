# Charlotte Nervous System — Raspberry Pi 5 Provisioning Plan

**Goal:** Take a fresh Raspberry Pi 5 from first boot to a fully operational nervous system — wake word detection, voice I/O, IoT signal processing, MQTT brokering, and Claude API integration. The Pi is the body. Claude is the brain. The valuation layer (METRIC → SIGNAL → PROTOCOL) runs at the edge.

**Hardware assumed:**
- Raspberry Pi 5 (4GB or 8GB)
- microSD card (64GB+ recommended)
- USB microphone or USB speakerphone (for the hub room)
- Speaker (3.5mm or USB/Bluetooth)
- Ethernet or WiFi
- Pi Zero 2W units (satellites — covered in Phase 2, separate doc)

---

## Phase 0: Flash & First Boot

### 0.1 Flash the OS
1. Download **Raspberry Pi Imager** on your main machine
2. Select **Raspberry Pi OS Lite (64-bit)** — Bookworm, no desktop
   - Lite because this is a headless server, no GUI needed
   - 64-bit because Whisper and ML models need it
3. Click the gear icon **before** flashing — pre-configure:
   - **Hostname:** `charlotte-hub`
   - **Enable SSH:** yes, use password auth (or paste your public key)
   - **Username:** `jack`
   - **Password:** (set something strong, you'll add key auth later)
   - **WiFi:** enter SSID and password (or plan to use Ethernet)
   - **Locale:** your timezone, US keyboard
4. Flash to microSD, insert into Pi, power on

### 0.2 First SSH
```bash
# From your main machine — find the Pi on your network
ping charlotte-hub.local
# or check your router's DHCP lease table

ssh jack@charlotte-hub.local
```

### 0.3 Initial system update
```bash
sudo apt update && sudo apt full-upgrade -y
sudo apt install -y git python3-pip python3-venv build-essential \
  cmake libffi-dev libssl-dev portaudio19-dev libasound2-dev \
  libatlas-base-dev libopenblas-dev mosquitto mosquitto-clients \
  ffmpeg curl wget
sudo reboot
```

### 0.4 Set a static IP (recommended for IoT hub)
```bash
sudo nmtui
# → Edit a connection → your interface → set static IPv4
# Example: 192.168.1.100/24, gateway 192.168.1.1, DNS 8.8.8.8
```

---

## Phase 1: Audio Stack

### 1.1 Verify audio hardware
```bash
# Plug in USB mic and speaker
arecord -l    # list capture devices
aplay -l      # list playback devices
```

### 1.2 Test recording and playback
```bash
# Record 5 seconds
arecord -D plughw:1,0 -f S16_LE -r 16000 -c 1 -d 5 test.wav
# Play it back
aplay test.wav
```

### 1.3 Set default audio devices
```bash
# Create/edit ALSA config
cat << 'EOF' > ~/.asoundrc
pcm.!default {
    type asym
    playback.pcm "plughw:0,0"   # adjust card numbers from aplay -l
    capture.pcm "plughw:1,0"    # adjust card numbers from arecord -l
}
EOF
```

If using PulseAudio/PipeWire (installed later for satellite routing):
```bash
sudo apt install -y pipewire pipewire-pulse wireplumber
```

---

## Phase 2: Wake Word Detection

### 2.1 Install OpenWakeWord
```bash
mkdir -p ~/charlotte && cd ~/charlotte
python3 -m venv venv
source venv/bin/activate

pip install openwakeword pyaudio numpy
```

### 2.2 Test with built-in wake words
```bash
python3 -c "
import openwakeword
from openwakeword.model import Model
print('Available models:', openwakeword.get_pretrained_model_paths())
"
```

### 2.3 Custom "Hey Charlotte" wake word
OpenWakeWord supports training custom wake words. Two paths:

**Path A — Quick (synthetic training):**
```bash
# Generate synthetic training clips using Piper TTS (installed in Phase 4)
# Then fine-tune OpenWakeWord on those clips
# This gets you 80% accuracy fast
```

**Path B — Production (real recordings):**
```
# Record ~200 samples of "Hey Charlotte" from multiple speakers
# Record ~1000 negative samples (ambient, other speech)
# Train using OpenWakeWord's training pipeline
# This gets you 95%+ accuracy
```

For launch, start with the built-in "hey_jarvis" model as a placeholder, swap in "Hey Charlotte" once trained.

### 2.4 Wake word listener service
Create `~/charlotte/wake_listener.py`:
```python
"""
Charlotte Wake Word Listener
Listens continuously for wake word, then hands off to STT pipeline.
"""
import pyaudio
import numpy as np
from openwakeword.model import Model

CHUNK = 1280  # 80ms at 16kHz
RATE = 16000
THRESHOLD = 0.5

model = Model(wakeword_models=["hey_jarvis"])  # swap for hey_charlotte later

audio = pyaudio.PyAudio()
stream = audio.open(
    format=pyaudio.paInt16,
    channels=1,
    rate=RATE,
    input=True,
    frames_per_buffer=CHUNK
)

print("Listening for wake word...")
while True:
    data = np.frombuffer(stream.read(CHUNK), dtype=np.int16)
    prediction = model.predict(data)

    for mdl_name, score in prediction.items():
        if score > THRESHOLD:
            print(f"Wake word detected! ({mdl_name}: {score:.2f})")
            # → Hand off to STT (Phase 3)
            # → Signal MQTT topic: charlotte/wake (Phase 5)
```

---

## Phase 3: Speech-to-Text (Whisper)

### 3.1 Install whisper.cpp (optimized C++ port)
```bash
cd ~/charlotte
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp

# Build with ARM NEON optimizations
cmake -B build -DWHISPER_NO_METAL=ON
cmake --build build --config Release -j4

# Download the small model (good speed/accuracy tradeoff for Pi 5)
bash models/download-ggml-model.sh small.en
# Also grab tiny.en for fast-response mode
bash models/download-ggml-model.sh tiny.en
```

### 3.2 Test STT
```bash
# Record a clip and transcribe
arecord -f S16_LE -r 16000 -c 1 -d 5 /tmp/test.wav
./build/bin/whisper-cli -m models/ggml-small.en.bin -f /tmp/test.wav
```

Expected performance on Pi 5:
- `tiny.en`: ~1-2s for 5s audio (use for quick commands)
- `small.en`: ~3-5s for 5s audio (use for longer requests)

### 3.3 Python wrapper
```python
"""STT module — wraps whisper.cpp subprocess for Charlotte."""
import subprocess
import tempfile

WHISPER_BIN = "/home/jack/charlotte/whisper.cpp/build/bin/whisper-cli"
MODEL_FAST = "/home/jack/charlotte/whisper.cpp/models/ggml-tiny.en.bin"
MODEL_FULL = "/home/jack/charlotte/whisper.cpp/models/ggml-small.en.bin"

def transcribe(wav_path: str, fast: bool = True) -> str:
    model = MODEL_FAST if fast else MODEL_FULL
    result = subprocess.run(
        [WHISPER_BIN, "-m", model, "-f", wav_path, "-np", "-nt"],
        capture_output=True, text=True
    )
    return result.stdout.strip()
```

---

## Phase 4: Text-to-Speech (Piper)

### 4.1 Install Piper TTS
```bash
cd ~/charlotte
wget https://github.com/rhasspy/piper/releases/latest/download/piper_linux_aarch64.tar.gz
tar -xzf piper_linux_aarch64.tar.gz
rm piper_linux_aarch64.tar.gz

# Download a voice model (Amy — medium quality, fast on Pi)
mkdir -p piper-voices && cd piper-voices
wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/medium/en_US-amy-medium.onnx
wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/medium/en_US-amy-medium.onnx.json
```

### 4.2 Test TTS
```bash
echo "Hello Jack. Charlotte is online." | \
  ~/charlotte/piper/piper \
    --model ~/charlotte/piper-voices/en_US-amy-medium.onnx \
    --output_file /tmp/hello.wav

aplay /tmp/hello.wav
```

### 4.3 Python wrapper
```python
"""TTS module — wraps Piper for Charlotte voice output."""
import subprocess

PIPER_BIN = "/home/jack/charlotte/piper/piper"
VOICE_MODEL = "/home/jack/charlotte/piper-voices/en_US-amy-medium.onnx"

def speak(text: str, output_path: str = "/tmp/charlotte_tts.wav"):
    subprocess.run(
        [PIPER_BIN, "--model", VOICE_MODEL, "--output_file", output_path],
        input=text, text=True
    )
    subprocess.run(["aplay", output_path])
```

---

## Phase 5: MQTT Broker (IoT Backbone)

### 5.1 Configure Mosquitto
Mosquitto was installed in Phase 0. Configure it:

```bash
sudo tee /etc/mosquitto/conf.d/charlotte.conf << 'EOF'
# Charlotte MQTT broker config
listener 1883
allow_anonymous true

# Websockets for browser dashboards
listener 9001
protocol websockets

# Logging
log_dest file /var/log/mosquitto/charlotte.log
log_type all
EOF

sudo systemctl enable mosquitto
sudo systemctl restart mosquitto
```

### 5.2 Topic hierarchy
```
charlotte/                      # Root
├── wake                        # Wake word detected (room, timestamp)
├── voice/                      # Voice pipeline
│   ├── stt                     # Transcribed text
│   ├── intent                  # Parsed intent
│   └── tts                     # Response text to speak
├── sensor/                     # IoT sensor data
│   ├── {room}/temperature
│   ├── {room}/humidity
│   ├── {room}/motion
│   ├── {room}/light
│   └── {room}/air_quality
├── metric/                     # Charlotte METRIC primitives
│   ├── {metric_name}           # Raw metric values
│   └── ...
├── signal/                     # Charlotte SIGNAL primitives
│   ├── {signal_name}           # Fired signals
│   └── ...
├── protocol/                   # Charlotte PROTOCOL primitives
│   ├── {protocol_name}         # Protocol activations
│   └── ...
├── device/                     # Device management
│   ├── {device_id}/status
│   ├── {device_id}/command
│   └── {device_id}/heartbeat
└── satellite/                  # Pi Zero 2W satellites
    ├── {room}/audio            # Audio stream from satellite
    ├── {room}/status           # Satellite health
    └── {room}/command          # Commands to satellite
```

### 5.3 Test MQTT
```bash
# Terminal 1: Subscribe
mosquitto_sub -t "charlotte/#" -v

# Terminal 2: Publish
mosquitto_pub -t "charlotte/wake" -m '{"room": "lab", "timestamp": 1708100000}'
```

---

## Phase 6: Claude API Integration

### 6.1 Install Anthropic SDK
```bash
source ~/charlotte/venv/bin/activate
pip install anthropic
```

### 6.2 API key setup
```bash
# Store key securely
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' >> ~/.bashrc
source ~/.bashrc
```

### 6.3 Charlotte brain module
```python
"""
Charlotte Brain — Claude API integration.
Only called when a PROTOCOL requires general intelligence.
Local signal processing handles the rest.
"""
import anthropic
import json

client = anthropic.Anthropic()

SYSTEM_PROMPT = """You are Charlotte, an operating system for operations.
You are running as the reasoning layer of a research lab's nervous system.
You have access to real-time sensor data and IoT devices via MQTT.
You speak conversationally but precisely.
When asked about operational data, trace your reasoning:
  METRIC (what was measured) → SIGNAL (what was detected) → PROTOCOL (what to do).
Keep responses concise — you are being spoken aloud via TTS."""

def think(user_input: str, context: dict = None) -> str:
    messages = [{"role": "user", "content": user_input}]

    if context:
        # Inject recent sensor state, active signals, etc.
        context_str = f"Current state:\n{json.dumps(context, indent=2)}"
        messages[0]["content"] = f"{context_str}\n\nUser says: {user_input}"

    response = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=300,  # Keep TTS responses short
        system=SYSTEM_PROMPT,
        messages=messages
    )
    return response.content[0].text
```

---

## Phase 7: The Pipeline — Wiring It All Together

### 7.1 Main event loop
```
┌──────────────────────────────────────────────────────┐
│                   EVENT LOOP                          │
│                                                       │
│  wake_listener (always on, ~2% CPU)                  │
│       │                                               │
│       ▼ wake detected                                │
│  record_audio (capture until silence, ~3-10s)        │
│       │                                               │
│       ▼ .wav file                                    │
│  whisper_stt (transcribe locally)                    │
│       │                                               │
│       ▼ text                                         │
│  intent_router                                       │
│       │                                               │
│       ├─→ LOCAL: IoT command (lights, temp, status)  │
│       │   → MQTT publish → device acts               │
│       │   → TTS confirmation                         │
│       │                                               │
│       ├─→ LOCAL: Sensor query (what's the temp?)     │
│       │   → Read latest METRIC from MQTT/state       │
│       │   → TTS response                             │
│       │                                               │
│       └─→ CLOUD: Needs reasoning (Claude API)        │
│           → Send to Claude with sensor context       │
│           → TTS response                             │
│                                                       │
│  PARALLEL: sensor_ingestion (always on)              │
│       → MQTT subscribe sensor/#                      │
│       → Update local state                           │
│       → Run SIGNAL detection on METRICs              │
│       → Fire PROTOCOLs when thresholds crossed       │
│       → Log to local SQLite for analytics            │
└──────────────────────────────────────────────────────┘
```

### 7.2 Intent routing (local vs. cloud)
```python
"""
Intent Router — decides what stays local vs. what goes to Claude.
90% of commands should resolve locally. Only ambiguous or complex
reasoning goes to the cloud.
"""

LOCAL_PATTERNS = {
    "light": "device_control",
    "lights": "device_control",
    "temperature": "sensor_query",
    "temp": "sensor_query",
    "humidity": "sensor_query",
    "motion": "sensor_query",
    "status": "system_status",
    "turn on": "device_control",
    "turn off": "device_control",
    "set": "device_control",
}

def route_intent(text: str) -> tuple[str, str]:
    """Returns (handler_type, matched_keyword)."""
    text_lower = text.lower()
    for keyword, handler in LOCAL_PATTERNS.items():
        if keyword in text_lower:
            return ("local", handler)
    return ("cloud", "general")
```

---

## Phase 8: Systemd Services

Everything runs as systemd services so it survives reboots.

### 8.1 Charlotte main service
```bash
sudo tee /etc/systemd/system/charlotte.service << 'EOF'
[Unit]
Description=Charlotte Nervous System
After=network.target mosquitto.service
Requires=mosquitto.service

[Service]
Type=simple
User=jack
WorkingDirectory=/home/jack/charlotte
Environment=PATH=/home/jack/charlotte/venv/bin:/usr/local/bin:/usr/bin
ExecStart=/home/jack/charlotte/venv/bin/python main.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

### 8.2 Sensor ingestion service
```bash
sudo tee /etc/systemd/system/charlotte-sensors.service << 'EOF'
[Unit]
Description=Charlotte Sensor Ingestion & Signal Processing
After=mosquitto.service
Requires=mosquitto.service

[Service]
Type=simple
User=jack
WorkingDirectory=/home/jack/charlotte
Environment=PATH=/home/jack/charlotte/venv/bin:/usr/local/bin:/usr/bin
ExecStart=/home/jack/charlotte/venv/bin/python sensor_pipeline.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

### 8.3 Enable everything
```bash
sudo systemctl daemon-reload
sudo systemctl enable charlotte charlotte-sensors mosquitto
sudo systemctl start charlotte charlotte-sensors
```

---

## Phase 9: Local Analytics & Storage

### 9.1 SQLite for time-series sensor data
```bash
pip install aiosqlite
```

Schema:
```sql
CREATE TABLE metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp REAL NOT NULL,
    room TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    value REAL NOT NULL
);

CREATE TABLE signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp REAL NOT NULL,
    signal_name TEXT NOT NULL,
    source_metric TEXT NOT NULL,
    threshold REAL,
    actual_value REAL
);

CREATE TABLE protocols (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp REAL NOT NULL,
    protocol_name TEXT NOT NULL,
    trigger_signal TEXT NOT NULL,
    action_taken TEXT NOT NULL,
    trace TEXT  -- full dive line JSON
);

CREATE INDEX idx_metrics_room_time ON metrics(room, timestamp);
CREATE INDEX idx_signals_time ON signals(timestamp);
```

### 9.2 Future: local tiny models
The Pi 5 can run small ONNX/TFLite models for:
- **Speaker recognition** — identify who's talking (enrollment + verification)
- **Sound classification** — glass breaking, smoke alarm, doorbell, dog bark
- **Anomaly detection** — unusual sensor patterns (auto-learned baselines)
- **Presence detection** — BLE beacon tracking, room occupancy inference

These are all nervous-system concerns — pattern detection at the edge, no general intelligence needed. Train small, deploy small, run fast.

---

## Phase 10: Security Hardening

### 10.1 SSH key-only auth
```bash
# From your main machine, copy your key
ssh-copy-id jack@charlotte-hub.local

# Then on the Pi, disable password auth
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

### 10.2 Firewall
```bash
sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 1883/tcp    # MQTT (internal network only)
sudo ufw allow 9001/tcp    # MQTT websockets (for dashboards)
sudo ufw enable
```

### 10.3 MQTT authentication (before adding external devices)
```bash
sudo mosquitto_passwd -c /etc/mosquitto/passwd charlotte
# Set password for the charlotte user

# Update mosquitto config
sudo tee /etc/mosquitto/conf.d/charlotte.conf << 'EOF'
listener 1883
password_file /etc/mosquitto/passwd
allow_anonymous false

listener 9001
protocol websockets

log_dest file /var/log/mosquitto/charlotte.log
EOF

sudo systemctl restart mosquitto
```

---

## Summary: What You End Up With

| Layer | Component | Runs On | Notes |
|---|---|---|---|
| Ears | OpenWakeWord | Pi 5 (local) | Always listening, ~2% CPU |
| Ears → Text | Whisper.cpp | Pi 5 (local) | ~2-5s latency per utterance |
| Text → Speech | Piper TTS | Pi 5 (local) | <1s latency, natural voice |
| Nervous System | MQTT + sensor pipeline | Pi 5 (local) | METRIC → SIGNAL → PROTOCOL |
| Storage | SQLite | Pi 5 (local) | Time-series metrics, dive line traces |
| Brain | Claude API | Anthropic cloud | Only for reasoning, 10% of requests |
| Satellites | Pi Zero 2W (Phase 2) | Per-room | Mic + speaker + sensors |

**Boot order:** Pi powers on → systemd starts Mosquitto → starts Charlotte main service + sensor pipeline → wake listener begins → Charlotte is alive.

---

## Next: Phase 2 Document — Pi Zero 2W Satellites

Once the hub is operational, the next document covers:
- Pi Zero 2W provisioning for each room
- Wyoming protocol for satellite audio streaming
- Sensor wiring (temperature, humidity, motion, light via GPIO/I2C)
- mDNS auto-discovery so satellites self-register
- Satellite ↔ Hub MQTT protocol
