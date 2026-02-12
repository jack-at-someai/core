"""
protocol_engine.py -- Meeting protocol tracker for Charlotte OS demo.

Loads meeting_protocol.json and compares expected engagement/attention
metrics against actual measurements from the face engine in real time.
The protocol engine is Charlotte's PROTOCOL primitive made concrete:
it defines expected behavior and detects divergence.

Runs on Pi 5.  Stdlib only (json, time, datetime, statistics).
"""

import json
import time
from datetime import datetime, timezone
from statistics import mean


class ProtocolEngine:
    """Track a meeting protocol -- expected vs actual metrics per phase.

    The protocol is a sequence of phases, each with a duration and expected
    metric values.  As the meeting runs, the engine auto-advances through
    phases based on elapsed time and accumulates divergence measurements
    for downstream consumers (visualization, minutes generator).
    """

    def __init__(self, protocol_path: str):
        """Load a meeting protocol from disk.

        protocol_path -- absolute path to meeting_protocol.json.
        """
        with open(protocol_path, "r", encoding="utf-8") as f:
            self._protocol = json.load(f)

        self._phases = self._protocol["phases"]
        self._phase_index = 0
        self._start_time = None
        self._end_time = None
        self._running = False

        # History of every check_divergence call, keyed by phase id.
        # {phase_id: [{"metric": str, "expected": float, "actual": float,
        #              "divergence": float, "timestamp": float, "elapsed": float}]}
        self._history = {}
        for phase in self._phases:
            self._history[phase["id"]] = []

        # Per-phase actual timing: {phase_id: {"entered": float, "exited": float}}
        self._phase_timing = {}

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    def start_meeting(self) -> None:
        """Record the meeting start time and enter phase 0."""
        self._start_time = time.time()
        self._phase_index = 0
        self._running = True
        self._end_time = None

        # Mark entry into the first phase.
        first = self._phases[0]
        self._phase_timing[first["id"]] = {
            "entered": self._start_time,
            "exited": None,
        }
        print(f"[protocol_engine] meeting started — phase '{first['id']}'")

    def end_meeting(self) -> dict:
        """Mark meeting as ended and return the final timeline.

        Returns the same structure as get_timeline(), frozen at the
        moment the meeting ended.
        """
        self._end_time = time.time()
        self._running = False

        # Close out the current phase timing if still open.
        current = self._phases[self._phase_index]
        timing = self._phase_timing.get(current["id"])
        if timing and timing["exited"] is None:
            timing["exited"] = self._end_time

        print(
            f"[protocol_engine] meeting ended — "
            f"{self._elapsed_minutes():.1f} min total"
        )
        return self.get_timeline()

    # ------------------------------------------------------------------
    # Phase tracking
    # ------------------------------------------------------------------

    def get_current_phase(self) -> dict:
        """Return the current phase dict based on elapsed time.

        Auto-advances through phases when the cumulative duration of all
        preceding phases has been exceeded.  If all phases are exhausted,
        returns the last phase (the meeting ran long).
        """
        if not self._running or self._start_time is None:
            return self._phases[self._phase_index]

        elapsed = time.time() - self._start_time
        cumulative = 0.0

        for i, phase in enumerate(self._phases):
            cumulative += phase["duration_minutes"] * 60.0
            if elapsed < cumulative:
                if i != self._phase_index:
                    self._advance_to(i)
                return dict(phase)

        # Past the last phase -- stay on the final one.
        if self._phase_index != len(self._phases) - 1:
            self._advance_to(len(self._phases) - 1)
        return dict(self._phases[-1])

    def _advance_to(self, new_index: int) -> None:
        """Advance the phase pointer, recording timing boundaries."""
        now = time.time()

        # Close the old phase.
        old_phase = self._phases[self._phase_index]
        timing = self._phase_timing.get(old_phase["id"])
        if timing and timing["exited"] is None:
            timing["exited"] = now

        # Open the new phase.
        new_phase = self._phases[new_index]
        self._phase_timing[new_phase["id"]] = {
            "entered": now,
            "exited": None,
        }
        self._phase_index = new_index
        print(
            f"[protocol_engine] phase -> '{new_phase['id']}' "
            f"({self._elapsed_minutes():.1f} min elapsed)"
        )

    # ------------------------------------------------------------------
    # Divergence detection
    # ------------------------------------------------------------------

    def check_divergence(self, metric_name: str, actual_value: float) -> dict:
        """Compare an actual metric value to the current phase expectation.

        metric_name  -- one of "engagement", "attention_convergence".
        actual_value -- float 0.0-1.0 from the face engine.

        Returns a divergence record dict:
            {
                "phase": "charlotte_intro",
                "metric": "engagement",
                "expected": 0.80,
                "actual": 0.72,
                "divergence": -0.08,
                "timestamp": 1740300000.0,
                "elapsed": 1230.5
            }
        """
        phase = self.get_current_phase()
        phase_id = phase["id"]

        # Map metric name to the expected-value key in the protocol JSON.
        expected_key = f"expected_{metric_name}"
        expected = phase.get(expected_key, 0.0)

        now = time.time()
        elapsed = now - self._start_time if self._start_time else 0.0
        divergence = round(actual_value - expected, 4)

        record = {
            "phase": phase_id,
            "metric": metric_name,
            "expected": expected,
            "actual": round(actual_value, 4),
            "divergence": divergence,
            "timestamp": now,
            "elapsed": round(elapsed, 2),
        }

        self._history[phase_id].append(record)
        return record

    # ------------------------------------------------------------------
    # Timeline
    # ------------------------------------------------------------------

    def get_timeline(self) -> list:
        """Return a list of all phases with actual vs expected metrics.

        Each entry:
            {
                "id": "welcome",
                "label": "Welcome & Introductions",
                "expected_duration_minutes": 5,
                "actual_duration_seconds": 312.5,
                "expected_engagement": 0.60,
                "actual_engagement_avg": 0.58,
                "expected_attention_convergence": 0.40,
                "actual_attention_convergence_avg": 0.37,
                "divergence_records": [...]
            }
        """
        timeline = []
        for phase in self._phases:
            pid = phase["id"]
            records = self._history.get(pid, [])
            timing = self._phase_timing.get(pid)

            # Compute actual duration.
            if timing:
                entered = timing["entered"]
                exited = timing["exited"] or time.time()
                actual_seconds = round(exited - entered, 2)
            else:
                actual_seconds = 0.0

            # Average actual values per metric.
            engagement_vals = [
                r["actual"] for r in records if r["metric"] == "engagement"
            ]
            attention_vals = [
                r["actual"]
                for r in records
                if r["metric"] == "attention_convergence"
            ]

            entry = {
                "id": pid,
                "label": phase["label"],
                "description": phase.get("description", ""),
                "expected_duration_minutes": phase["duration_minutes"],
                "actual_duration_seconds": actual_seconds,
                "expected_engagement": phase.get("expected_engagement", 0.0),
                "actual_engagement_avg": (
                    round(mean(engagement_vals), 4) if engagement_vals else None
                ),
                "expected_attention_convergence": phase.get(
                    "expected_attention_convergence", 0.0
                ),
                "actual_attention_convergence_avg": (
                    round(mean(attention_vals), 4) if attention_vals else None
                ),
                "sample_count": len(records),
                "divergence_records": records,
            }
            timeline.append(entry)

        return timeline

    # ------------------------------------------------------------------
    # Accessors
    # ------------------------------------------------------------------

    @property
    def protocol(self) -> dict:
        """The raw protocol dict as loaded from JSON."""
        return dict(self._protocol)

    @property
    def history(self) -> dict:
        """Full divergence history keyed by phase id."""
        return dict(self._history)

    @property
    def is_running(self) -> bool:
        return self._running

    def _elapsed_minutes(self) -> float:
        """Minutes since meeting start."""
        if self._start_time is None:
            return 0.0
        end = self._end_time or time.time()
        return (end - self._start_time) / 60.0
