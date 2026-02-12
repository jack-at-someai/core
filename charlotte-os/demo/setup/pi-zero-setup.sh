#!/bin/bash
# ================================================================
# Pi Zero W Setup — Charlotte's Eyes
# ================================================================
# Run this on each Pi Zero W after first boot:
#   chmod +x pi-zero-setup.sh && ./pi-zero-setup.sh
#
# Prerequisites: Raspberry Pi OS Lite (32-bit) with SSH + WiFi
# Camera: Pi Camera Module v2 or USB webcam
# ================================================================

set -e

STREAM_PORT=${1:-8080}

echo "═══════════════════════════════════════"
echo "  Charlotte OS — Eye Setup"
echo "  Streaming on port: $STREAM_PORT"
echo "═══════════════════════════════════════"

# ── System updates ──
echo "[1/5] Updating system packages..."
sudo apt update && sudo apt upgrade -y

# ── Camera dependencies ──
echo "[2/5] Installing camera tools..."
sudo apt install -y cmake libjpeg62-turbo-dev git

# ── mjpg-streamer (lightweight MJPEG server) ──
echo "[3/5] Building mjpg-streamer..."
cd ~
if [ ! -d "mjpg-streamer" ]; then
    git clone https://github.com/jacksonliam/mjpg-streamer.git
fi
cd mjpg-streamer/mjpg-streamer-experimental
make
sudo make install

# ── Detect camera type ──
echo "[4/5] Detecting camera..."
if [ -e /dev/video0 ]; then
    INPUT_PLUGIN="input_uvc.so -d /dev/video0 -r 640x480 -f 10"
    echo "  Found USB camera at /dev/video0"
else
    # For Pi Camera Module, use v4l2 driver
    sudo modprobe bcm2835-v4l2 2>/dev/null || true
    if [ -e /dev/video0 ]; then
        INPUT_PLUGIN="input_uvc.so -d /dev/video0 -r 640x480 -f 10"
        echo "  Found Pi Camera via v4l2"
    else
        echo "  WARNING: No camera detected. Connect a camera and re-run."
        INPUT_PLUGIN="input_uvc.so -d /dev/video0 -r 640x480 -f 5"
    fi
fi

# ── Create systemd service for auto-start ──
echo "[5/5] Creating streaming service..."
sudo tee /etc/systemd/system/charlotte-eye.service > /dev/null <<UNIT
[Unit]
Description=Charlotte Eye — MJPEG Camera Stream
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=$USER
ExecStart=/usr/local/bin/mjpg_streamer -i "$INPUT_PLUGIN" -o "output_http.so -p $STREAM_PORT -w /usr/local/share/mjpg-streamer/www"
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable charlotte-eye.service
sudo systemctl start charlotte-eye.service

# ── Get IP for brain configuration ──
MY_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "═══════════════════════════════════════"
echo "  Eye streaming!"
echo ""
echo "  Stream URL: http://$MY_IP:$STREAM_PORT/?action=stream"
echo "  Snapshot:   http://$MY_IP:$STREAM_PORT/?action=snapshot"
echo ""
echo "  Add this URL to Charlotte's camera config"
echo "  on the Pi 5 brain."
echo "═══════════════════════════════════════"
