#!/bin/bash
# ================================================================
# Pi 5 Setup — Charlotte's Brain
# ================================================================
# Run this on the Pi 5 after first boot:
#   chmod +x pi5-setup.sh && ./pi5-setup.sh
#
# Prerequisites: Raspberry Pi OS (64-bit) with SSH + WiFi configured
# ================================================================

set -e

echo "═══════════════════════════════════════"
echo "  Charlotte OS — Pi 5 Brain Setup"
echo "═══════════════════════════════════════"

# ── System updates ──
echo "[1/6] Updating system packages..."
sudo apt update && sudo apt upgrade -y

# ── Python + pip ──
echo "[2/6] Installing Python build dependencies..."
sudo apt install -y python3-pip python3-venv python3-dev \
    cmake build-essential libopenblas-dev liblapack-dev \
    libhdf5-dev libatlas-base-dev libjpeg-dev libpng-dev \
    libavcodec-dev libavformat-dev libswscale-dev

# ── OpenCV (system package — fastest on Pi) ──
echo "[3/6] Installing OpenCV..."
sudo apt install -y python3-opencv

# ── Create virtual environment ──
echo "[4/6] Creating Charlotte venv..."
cd ~
python3 -m venv charlotte-env --system-site-packages
source charlotte-env/bin/activate

# ── Python dependencies ──
echo "[5/6] Installing Python packages..."
pip install --upgrade pip
pip install face-recognition
pip install fer
pip install websockets
pip install numpy Pillow

# ── Verify installation ──
echo "[6/6] Verifying..."
python3 -c "
import cv2; print(f'  OpenCV: {cv2.__version__}')
import face_recognition; print('  face_recognition: OK')
from fer import FER; print('  FER: OK')
import websockets; print(f'  websockets: {websockets.__version__}')
print()
print('All dependencies installed successfully.')
"

echo ""
echo "═══════════════════════════════════════"
echo "  Setup complete!"
echo ""
echo "  To run Charlotte:"
echo "    source ~/charlotte-env/bin/activate"
echo "    python3 charlotte.py"
echo "═══════════════════════════════════════"
