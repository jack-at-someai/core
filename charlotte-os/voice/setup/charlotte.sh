#!/usr/bin/env bash
# Charlotte Service Manager
# =========================
# Install, start, stop, and check Charlotte services.
# Safe to run multiple times — checks state before acting.
#
# Usage:
#   charlotte.sh install   — copy service files + enable
#   charlotte.sh start     — start both services (if not already running)
#   charlotte.sh stop      — stop both services
#   charlotte.sh restart   — restart both services
#   charlotte.sh status    — show status of both services
#   charlotte.sh logs      — tail live logs from both services

set -euo pipefail

VOICE_SERVICE="charlotte-voice"
TUNNEL_SERVICE="charlotte-tunnel"

cmd_install() {
    echo "=== Installing Charlotte services ==="
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

    sudo cp "$SCRIPT_DIR/charlotte-tunnel.service" /etc/systemd/system/
    sudo cp "$SCRIPT_DIR/charlotte-voice.service" /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable "$TUNNEL_SERVICE"
    sudo systemctl enable "$VOICE_SERVICE"
    echo "Services installed and enabled."
    echo "Run: charlotte.sh start"
}

cmd_start() {
    echo "=== Starting Charlotte ==="
    for svc in "$TUNNEL_SERVICE" "$VOICE_SERVICE"; do
        if systemctl is-active --quiet "$svc"; then
            echo "  $svc: already running"
        else
            sudo systemctl start "$svc"
            echo "  $svc: started"
        fi
    done
}

cmd_stop() {
    echo "=== Stopping Charlotte ==="
    for svc in "$VOICE_SERVICE" "$TUNNEL_SERVICE"; do
        if systemctl is-active --quiet "$svc"; then
            sudo systemctl stop "$svc"
            echo "  $svc: stopped"
        else
            echo "  $svc: not running"
        fi
    done
}

cmd_restart() {
    echo "=== Restarting Charlotte ==="
    sudo systemctl restart "$TUNNEL_SERVICE"
    echo "  $TUNNEL_SERVICE: restarted"
    sudo systemctl restart "$VOICE_SERVICE"
    echo "  $VOICE_SERVICE: restarted"
}

cmd_status() {
    echo "=== Charlotte Status ==="
    for svc in "$TUNNEL_SERVICE" "$VOICE_SERVICE"; do
        if systemctl is-active --quiet "$svc"; then
            echo "  $svc: RUNNING"
        else
            echo "  $svc: STOPPED"
        fi
    done
    echo ""
    echo "Health check:"
    curl -s http://localhost:8080/health 2>/dev/null || echo "  Voice agent not responding"
}

cmd_logs() {
    journalctl -u "$TUNNEL_SERVICE" -u "$VOICE_SERVICE" -f --no-hostname
}

case "${1:-status}" in
    install) cmd_install ;;
    start)   cmd_start ;;
    stop)    cmd_stop ;;
    restart) cmd_restart ;;
    status)  cmd_status ;;
    logs)    cmd_logs ;;
    *)
        echo "Usage: charlotte.sh {install|start|stop|restart|status|logs}"
        exit 1
        ;;
esac
