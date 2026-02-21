"""
Charlotte Voice Agent — Configuration
=======================================
Loads API keys and settings from .env file or environment variables.
"""

import os
from pathlib import Path


def _load_dotenv(path: Path) -> None:
    """Minimal .env loader — no external dependency."""
    if not path.exists():
        return
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip("\"'")
            if key and key not in os.environ:
                os.environ[key] = value


# Load .env from voice/ directory, then home directory fallback
_load_dotenv(Path(__file__).parent / ".env")
_load_dotenv(Path.home() / "charlotte" / "voice" / ".env")


class Config:
    """All configuration accessed via class attributes."""

    # Server
    HOST: str = os.getenv("VOICE_HOST", "0.0.0.0")
    PORT: int = int(os.getenv("VOICE_PORT", "8080"))
    TUNNEL_DOMAIN: str = os.getenv("TUNNEL_DOMAIN", "charlotte.example.com")

    # Twilio
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_PHONE_NUMBER: str = os.getenv("TWILIO_PHONE_NUMBER", "")

    # Deepgram
    DEEPGRAM_API_KEY: str = os.getenv("DEEPGRAM_API_KEY", "")
    DEEPGRAM_MODEL: str = os.getenv("DEEPGRAM_MODEL", "nova-2")  # "nova-2" or "flux"
    DEEPGRAM_EOT_THRESHOLD: float = float(os.getenv("DEEPGRAM_EOT_THRESHOLD", "0.7"))
    DEEPGRAM_EAGER_EOT_THRESHOLD: float = float(os.getenv("DEEPGRAM_EAGER_EOT_THRESHOLD", "0.4"))
    DEEPGRAM_EOT_SILENCE_MS: int = int(os.getenv("DEEPGRAM_EOT_SILENCE_MS", "5000"))

    # ElevenLabs
    ELEVENLABS_API_KEY: str = os.getenv("ELEVENLABS_API_KEY", "")
    ELEVENLABS_VOICE_ID: str = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")  # Rachel default

    # Anthropic
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    CLAUDE_MODEL: str = os.getenv("CLAUDE_MODEL", "claude-sonnet-4-6")
    CLAUDE_MAX_TOKENS: int = int(os.getenv("CLAUDE_MAX_TOKENS", "500"))
    CLAUDE_MAX_TOKENS_BRIEFING: int = int(os.getenv("CLAUDE_MAX_TOKENS_BRIEFING", "2000"))
    CLAUDE_MAX_TOKENS_SMS: int = int(os.getenv("CLAUDE_MAX_TOKENS_SMS", "250"))
    CLAUDE_MAX_TOOL_ROUNDS: int = int(os.getenv("CLAUDE_MAX_TOOL_ROUNDS", "3"))

    # MQTT
    MQTT_HOST: str = os.getenv("MQTT_HOST", "localhost")
    MQTT_PORT: int = int(os.getenv("MQTT_PORT", "1883"))

    # Session
    SESSION_DB: str = os.getenv("SESSION_DB", str(Path.home() / "charlotte" / "voice" / "sessions.db"))
    SESSION_EXPIRY_HOURS: int = int(os.getenv("SESSION_EXPIRY_HOURS", "72"))
    SESSION_CONTEXT_MESSAGES: int = int(os.getenv("SESSION_CONTEXT_MESSAGES", "50"))

    # Security
    APP_AUTH_TOKEN: str = os.getenv("APP_AUTH_TOKEN", "")
    ALLOWED_PATHS: list = [
        str(Path.home() / "charlotte"),
        str(Path.home() / "dev"),
    ]
    BLOCKED_COMMANDS: list = [
        "rm -rf /", "mkfs", "dd if=", "shutdown", "reboot",
        "passwd", "userdel", "useradd", "chmod 777",
        "> /dev/sd", ":(){ :|:& };:",
    ]

    # Demo mode
    DEMO: bool = False

    @classmethod
    def validate(cls) -> list[str]:
        """Return list of missing required keys."""
        missing = []
        if cls.DEMO:
            return missing
        for key in ("DEEPGRAM_API_KEY", "ELEVENLABS_API_KEY", "ANTHROPIC_API_KEY"):
            if not getattr(cls, key):
                missing.append(key)
        return missing

    @classmethod
    def log_status(cls) -> str:
        """Return a safe status string (no secrets)."""
        keys = {
            "Twilio": bool(cls.TWILIO_ACCOUNT_SID and cls.TWILIO_AUTH_TOKEN),
            "Deepgram": f"{cls.DEEPGRAM_MODEL} ({'OK' if cls.DEEPGRAM_API_KEY else 'missing'})",
            "ElevenLabs": bool(cls.ELEVENLABS_API_KEY),
            "Anthropic": bool(cls.ANTHROPIC_API_KEY),
            "MQTT": f"{cls.MQTT_HOST}:{cls.MQTT_PORT}",
        }
        lines = [f"  {k}: {'OK' if v is True else ('missing' if v is False else v)}" for k, v in keys.items()]
        return "Config status:\n" + "\n".join(lines)
