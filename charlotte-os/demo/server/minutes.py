"""
minutes.py -- Meeting minutes generator for Charlotte OS demo.

Produces structured meeting minutes from Charlotte's fact stream:
per-attendee engagement stats, per-phase signal analysis, and
heuristic marching orders derived from engagement patterns.

Runs on Pi 5.  Stdlib only (json, time, datetime, statistics).
"""

import json
import time
from datetime import datetime, timezone
from statistics import mean, stdev


class MinutesGenerator:
    """Generate meeting minutes from Charlotte's SIGNAL and NODE facts.

    Usage:
        gen = MinutesGenerator()
        gen.register_attendee("Jim", role="CEO")
        gen.register_attendee("Sarah", role="COO")
        # ... during meeting, buffer every fact from krf.py:
        gen.add_fact(fact_json)
        # ... after meeting ends:
        minutes = gen.generate_minutes(protocol_timeline)
        html = gen.generate_html(minutes)
    """

    def __init__(self):
        self._attendees = []       # [{"name": str, "role": str}]
        self._attendee_set = set() # fast lookup by name
        self._facts = []           # buffered fact dicts from krf.py

    # ------------------------------------------------------------------
    # Registration
    # ------------------------------------------------------------------

    def register_attendee(self, name: str, role: str = "") -> None:
        """Add a known attendee to the registry.

        name -- display name (must match the face engine's label).
        role -- optional title, e.g. "CEO", "VP Engineering".
        """
        if name not in self._attendee_set:
            self._attendees.append({"name": name, "role": role})
            self._attendee_set.add(name)

    # ------------------------------------------------------------------
    # Fact ingestion
    # ------------------------------------------------------------------

    def add_fact(self, fact_json: dict) -> None:
        """Buffer a fact dict (the output of krf.py's fact_to_json).

        Expected shape (Charlotte SIGNAL facts from the face engine):
            {
                "type": "SIGNAL",
                "metric": "engagement" | "attention_convergence" | "emotion",
                "node": "Jim",
                "value": 0.85,
                "timestamp": 1740300000.0,
                "metadata": {...}
            }

        Also accepts NODE facts (person identified) and EDGE facts
        (attention directed at another person / the presenter).
        """
        self._facts.append(fact_json)

    # ------------------------------------------------------------------
    # Minutes generation
    # ------------------------------------------------------------------

    def generate_minutes(self, protocol_timeline: list) -> dict:
        """Produce structured meeting minutes.

        protocol_timeline -- the list returned by ProtocolEngine.get_timeline().

        Returns a dict suitable for JSON serialization or HTML rendering.
        """
        person_stats = self._compute_per_person_stats()

        # Meeting-level aggregates.
        all_engagement = [
            f["value"]
            for f in self._facts
            if f.get("type") == "SIGNAL" and f.get("metric") == "engagement"
        ]
        overall_engagement = round(mean(all_engagement), 2) if all_engagement else 0.0

        # Expected overall engagement from the protocol.
        phase_expected = [
            p.get("expected_engagement", 0.0) for p in protocol_timeline
        ]
        expected_overall = (
            round(mean(phase_expected), 2) if phase_expected else 0.0
        )

        # Duration.
        if protocol_timeline:
            total_seconds = sum(
                p.get("actual_duration_seconds", 0.0) for p in protocol_timeline
            )
        else:
            total_seconds = 0.0
        duration_minutes = round(total_seconds / 60.0)

        # Peak phase by actual engagement.
        peak_phase = ""
        peak_val = -1.0
        for p in protocol_timeline:
            avg = p.get("actual_engagement_avg")
            if avg is not None and avg > peak_val:
                peak_val = avg
                peak_phase = p["id"]

        # Build attendee summaries.
        attendee_summaries = []
        for att in self._attendees:
            name = att["name"]
            stats = person_stats.get(name, {})
            eng_vals = stats.get("engagement", [])
            avg_eng = round(mean(eng_vals), 2) if eng_vals else 0.0

            # Find the phase where this person peaked.
            person_peak_phase = self._find_peak_phase(name, protocol_timeline)

            # Emotion summary.
            emotion_summary = self._summarize_emotions(name)

            attendee_summaries.append({
                "name": name,
                "role": att["role"],
                "avg_engagement": avg_eng,
                "peak_phase": person_peak_phase,
                "emotion_summary": emotion_summary,
            })

        # Build phase summaries.
        phase_summaries = []
        for p in protocol_timeline:
            pid = p["id"]
            notable = self._identify_notable_signals(pid)
            actual_dur = round(p.get("actual_duration_seconds", 0.0) / 60.0)
            avg_eng = p.get("actual_engagement_avg")
            phase_summaries.append({
                "label": p["label"],
                "actual_duration": actual_dur if actual_dur > 0 else 1,
                "avg_engagement": round(avg_eng, 2) if avg_eng is not None else 0.0,
                "notable_signals": notable,
            })

        # Marching orders.
        marching_orders = self._generate_marching_orders(
            person_stats, protocol_timeline
        )

        # Action item count.
        action_count = sum(len(m["items"]) for m in marching_orders)

        # Date string from the first fact timestamp, or today.
        date_str = self._infer_date()

        # Summary sentence.
        summary = (
            f"{len(self._attendees)} attendees. "
            f"Overall engagement {overall_engagement:.2f} "
            f"(expected {expected_overall:.2f}). "
            f"Peak during {peak_phase.replace('_', ' ')} phase. "
            f"Charlotte identified {action_count} action items."
        )

        return {
            "meeting": "ISG ServiceIQ \u2014 Charlotte Demo",
            "date": date_str,
            "duration_minutes": duration_minutes if duration_minutes > 0 else 1,
            "attendees": attendee_summaries,
            "phases": phase_summaries,
            "marching_orders": marching_orders,
            "summary": summary,
        }

    # ------------------------------------------------------------------
    # HTML rendering
    # ------------------------------------------------------------------

    def generate_html(self, minutes_dict: dict) -> str:
        """Render minutes as a standalone, printable HTML page.

        Uses SomeAI brand colors:
            --bg:   #141414
            --red:  #E53E3E
            --text: #E8E0E0
        """
        m = minutes_dict

        # Attendee rows.
        att_rows = ""
        for a in m.get("attendees", []):
            att_rows += (
                f"<tr>"
                f"<td>{_esc(a['name'])}</td>"
                f"<td>{_esc(a.get('role', ''))}</td>"
                f"<td>{a.get('avg_engagement', 0):.2f}</td>"
                f"<td>{_esc(a.get('peak_phase', '').replace('_', ' '))}</td>"
                f"<td>{_esc(a.get('emotion_summary', ''))}</td>"
                f"</tr>\n"
            )

        # Phase rows.
        phase_rows = ""
        for p in m.get("phases", []):
            signals_html = "<br>".join(_esc(s) for s in p.get("notable_signals", []))
            phase_rows += (
                f"<tr>"
                f"<td>{_esc(p['label'])}</td>"
                f"<td>{p.get('actual_duration', 0)} min</td>"
                f"<td>{p.get('avg_engagement', 0):.2f}</td>"
                f"<td>{signals_html or '&mdash;'}</td>"
                f"</tr>\n"
            )

        # Marching orders.
        orders_html = ""
        for mo in m.get("marching_orders", []):
            items_html = "".join(
                f"<li>{_esc(item)}</li>" for item in mo.get("items", [])
            )
            orders_html += (
                f"<div class=\"person-orders\">"
                f"<h3>{_esc(mo['name'])}</h3>"
                f"<ul>{items_html}</ul>"
                f"</div>\n"
            )

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{_esc(m.get('meeting', 'Meeting Minutes'))}</title>
<style>
  :root {{
    --bg: #141414;
    --surface: #1E1E1E;
    --red: #E53E3E;
    --text: #E8E0E0;
    --dim: #888;
    --border: #333;
  }}
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    background: var(--bg);
    color: var(--text);
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    line-height: 1.6;
    padding: 40px 24px;
    max-width: 900px;
    margin: 0 auto;
  }}
  h1 {{
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--red);
  }}
  h2 {{
    font-size: 1.1rem;
    font-weight: 600;
    margin: 32px 0 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--border);
    color: var(--text);
  }}
  h3 {{
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--red);
  }}
  .meta {{
    font-size: 0.85rem;
    color: var(--dim);
    margin-bottom: 24px;
  }}
  .summary {{
    background: var(--surface);
    border-left: 3px solid var(--red);
    padding: 12px 16px;
    margin: 16px 0 24px;
    font-size: 0.95rem;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    margin-bottom: 8px;
  }}
  th {{
    text-align: left;
    padding: 8px 10px;
    border-bottom: 2px solid var(--border);
    color: var(--dim);
    font-weight: 500;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }}
  td {{
    padding: 8px 10px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }}
  .person-orders {{
    background: var(--surface);
    padding: 12px 16px;
    margin-bottom: 8px;
    border-radius: 4px;
  }}
  .person-orders ul {{
    margin-left: 20px;
    margin-top: 4px;
  }}
  .person-orders li {{
    margin-bottom: 4px;
    font-size: 0.9rem;
  }}
  .footer {{
    margin-top: 40px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
    font-size: 0.75rem;
    color: var(--dim);
  }}
  @media print {{
    body {{ background: #fff; color: #222; padding: 20px; }}
    .summary {{ border-left-color: #E53E3E; background: #f9f9f9; }}
    .person-orders {{ background: #f5f5f5; }}
    th {{ color: #666; border-bottom-color: #ccc; }}
    td {{ border-bottom-color: #eee; }}
    h1, h3 {{ color: #E53E3E; }}
    .footer {{ color: #999; border-top-color: #ddd; }}
  }}
</style>
</head>
<body>

<h1>{_esc(m.get('meeting', 'Meeting Minutes'))}</h1>
<div class="meta">{_esc(m.get('date', ''))} &middot; {m.get('duration_minutes', 0)} minutes</div>

<div class="summary">{_esc(m.get('summary', ''))}</div>

<h2>Attendees</h2>
<table>
<thead>
<tr><th>Name</th><th>Role</th><th>Avg Engagement</th><th>Peak Phase</th><th>Emotion Summary</th></tr>
</thead>
<tbody>
{att_rows}
</tbody>
</table>

<h2>Phases</h2>
<table>
<thead>
<tr><th>Phase</th><th>Duration</th><th>Avg Engagement</th><th>Notable Signals</th></tr>
</thead>
<tbody>
{phase_rows}
</tbody>
</table>

<h2>Marching Orders</h2>
{orders_html if orders_html else '<p style="color:var(--dim)">No action items identified.</p>'}

<div class="footer">
Generated by Charlotte OS &middot; {_esc(m.get('date', ''))}
</div>

</body>
</html>"""
        return html

    # ------------------------------------------------------------------
    # Internal: per-person aggregation
    # ------------------------------------------------------------------

    def _compute_per_person_stats(self) -> dict:
        """Aggregate all SIGNAL facts per person.

        Returns:
            {
                "Jim": {
                    "engagement": [0.8, 0.7, ...],
                    "attention_convergence": [0.9, ...],
                    "emotions": [{"emotion": "happy", "confidence": 0.8, "timestamp": ...}, ...],
                    "timestamps": [1740300000.0, ...]
                },
                ...
            }
        """
        stats = {}
        for fact in self._facts:
            if fact.get("type") != "SIGNAL":
                continue

            node = fact.get("node", "")
            if not node:
                continue

            if node not in stats:
                stats[node] = {
                    "engagement": [],
                    "attention_convergence": [],
                    "emotions": [],
                    "timestamps": [],
                }

            metric = fact.get("metric", "")
            value = fact.get("value", 0.0)
            ts = fact.get("timestamp", 0.0)

            stats[node]["timestamps"].append(ts)

            if metric == "engagement":
                stats[node]["engagement"].append(value)
            elif metric == "attention_convergence":
                stats[node]["attention_convergence"].append(value)
            elif metric == "emotion":
                # Emotion facts carry metadata with the detected emotion.
                meta = fact.get("metadata", {})
                stats[node]["emotions"].append({
                    "emotion": meta.get("emotion", "neutral"),
                    "confidence": value,
                    "timestamp": ts,
                })

        return stats

    # ------------------------------------------------------------------
    # Internal: notable signal detection
    # ------------------------------------------------------------------

    def _identify_notable_signals(self, phase_id: str) -> list:
        """Find emotion spikes, engagement drops, and attention shifts
        during a specific phase.

        Returns a list of human-readable strings, e.g.:
            ["Jim: high engagement 0.91 at 2:30",
             "Sarah: engagement dip 0.35 at 5:10"]
        """
        # Collect all facts that fall within this phase's time window.
        # We identify phase boundaries from fact timestamps and phase id.
        # Since facts don't carry phase_id directly, we rely on the
        # divergence records that DO carry phase labels.  But for a more
        # robust approach, bucket facts by the protocol timeline.
        #
        # Heuristic: we scan all facts and bucket them by person,
        # then look for outliers.

        notable = []
        person_stats = self._compute_per_person_stats()

        # We need phase-specific facts.  The protocol_engine stamps each
        # divergence record with a phase id, but raw facts don't carry it.
        # We approximate: for each person, compute global engagement mean
        # and flag values > mean + 0.15 or < mean - 0.15 as notable.

        meeting_start = None
        if self._facts:
            signal_facts = [
                f for f in self._facts
                if f.get("type") == "SIGNAL" and f.get("metric") == "engagement"
            ]
            if signal_facts:
                meeting_start = min(f.get("timestamp", 0) for f in signal_facts)

        for name, stats in person_stats.items():
            eng = stats.get("engagement", [])
            if len(eng) < 3:
                continue

            avg = mean(eng)
            for i, val in enumerate(eng):
                ts = stats["timestamps"][i] if i < len(stats["timestamps"]) else 0

                # Format timestamp as M:SS relative to meeting start.
                if meeting_start and ts > 0:
                    offset = ts - meeting_start
                    mins = int(offset // 60)
                    secs = int(offset % 60)
                    ts_label = f"{mins}:{secs:02d}"
                else:
                    ts_label = "?"

                if val >= avg + 0.15:
                    notable.append(
                        f"{name}: high engagement {val:.2f} at {ts_label}"
                    )
                elif val <= avg - 0.15:
                    notable.append(
                        f"{name}: engagement dip {val:.2f} at {ts_label}"
                    )

            # Emotion spikes: high-confidence non-neutral emotions.
            for emo in stats.get("emotions", []):
                if emo["confidence"] >= 0.7 and emo["emotion"] not in ("neutral", ""):
                    if meeting_start and emo["timestamp"] > 0:
                        offset = emo["timestamp"] - meeting_start
                        mins = int(offset // 60)
                        secs = int(offset % 60)
                        ts_label = f"{mins}:{secs:02d}"
                    else:
                        ts_label = "?"
                    notable.append(
                        f"{name}: {emo['emotion']} ({emo['confidence']:.2f}) at {ts_label}"
                    )

        # Cap at 10 most interesting signals to keep minutes readable.
        return notable[:10]

    # ------------------------------------------------------------------
    # Internal: marching orders heuristic
    # ------------------------------------------------------------------

    def _generate_marching_orders(
        self, person_stats: dict, protocol_timeline: list
    ) -> list:
        """Map engagement patterns to actionable follow-up items.

        Heuristics:
        - Peak engagement during a phase -> "Schedule deeper dive on [topic]"
        - Engagement dip during a phase -> "Follow up on [topic] concerns"
        - High emotion during vision -> "Explore [topic] interest"
        - Low overall engagement -> "Consider shorter format next time"

        Returns:
            [{"name": "Jim", "items": ["Schedule dedicated Oasis review...", ...]}]
        """
        orders = []

        for att in self._attendees:
            name = att["name"]
            stats = person_stats.get(name, {})
            eng = stats.get("engagement", [])
            items = []

            if not eng:
                orders.append({"name": name, "items": items})
                continue

            avg_eng = mean(eng)

            # Find per-phase engagement for this person.
            # We approximate by dividing the engagement list evenly across
            # the phases (facts arrive in chronological order).
            n_phases = len(protocol_timeline)
            chunk_size = max(1, len(eng) // n_phases) if n_phases > 0 else len(eng)

            phase_avgs = []
            for i, phase in enumerate(protocol_timeline):
                start_idx = i * chunk_size
                end_idx = start_idx + chunk_size if i < n_phases - 1 else len(eng)
                chunk = eng[start_idx:end_idx]
                phase_avg = mean(chunk) if chunk else 0.0
                phase_avgs.append((phase, phase_avg, chunk))

            # Peak phase: suggest deeper dive.
            if phase_avgs:
                peak_phase, peak_avg, _ = max(phase_avgs, key=lambda x: x[1])
                if peak_avg > avg_eng + 0.05:
                    topic = peak_phase["label"]
                    items.append(
                        f"Schedule dedicated follow-up on "
                        f"{topic.lower()} \u2014 peak engagement "
                        f"{peak_avg:.2f} during this phase"
                    )

            # Dip phases: flag concerns.
            for phase, phase_avg, chunk in phase_avgs:
                if phase_avg < avg_eng - 0.10 and chunk:
                    topic = phase["label"]
                    # Find the approximate timestamp of the dip.
                    min_val = min(chunk)
                    min_idx = chunk.index(min_val)
                    global_idx = phase_avgs.index((phase, phase_avg, chunk)) * chunk_size + min_idx
                    if global_idx < len(stats.get("timestamps", [])):
                        ts = stats["timestamps"][global_idx]
                        meeting_start = min(
                            (f.get("timestamp", 0) for f in self._facts if f.get("timestamp", 0) > 0),
                            default=0,
                        )
                        offset = ts - meeting_start if meeting_start else 0
                        mins = int(offset // 60)
                        ts_label = f"{mins}:00"
                    else:
                        ts_label = ""

                    concern = (
                        f"Follow up on {topic.lower()} concerns"
                    )
                    if ts_label:
                        concern += f" \u2014 engagement dip at {ts_label}"
                    items.append(concern)

            # Emotion-driven orders.
            for emo in stats.get("emotions", []):
                if emo["confidence"] >= 0.75 and emo["emotion"] in ("surprise", "happy"):
                    items.append(
                        f"Explore {emo['emotion']} reaction \u2014 "
                        f"high confidence {emo['confidence']:.2f}"
                    )
                    break  # One emotion order is enough.

            orders.append({"name": name, "items": items})

        return orders

    # ------------------------------------------------------------------
    # Internal: helpers
    # ------------------------------------------------------------------

    def _find_peak_phase(self, name: str, protocol_timeline: list) -> str:
        """Find the phase where a person's engagement was highest."""
        # Get this person's engagement facts.
        eng_facts = [
            f for f in self._facts
            if f.get("type") == "SIGNAL"
            and f.get("metric") == "engagement"
            and f.get("node") == name
        ]
        if not eng_facts or not protocol_timeline:
            return ""

        # Divide facts evenly across phases (chronological approximation).
        n = len(protocol_timeline)
        chunk = max(1, len(eng_facts) // n)

        best_phase = ""
        best_avg = -1.0

        for i, phase in enumerate(protocol_timeline):
            start = i * chunk
            end = start + chunk if i < n - 1 else len(eng_facts)
            vals = [f.get("value", 0) for f in eng_facts[start:end]]
            if vals:
                avg = mean(vals)
                if avg > best_avg:
                    best_avg = avg
                    best_phase = phase["id"]

        return best_phase

    def _summarize_emotions(self, name: str) -> str:
        """Produce a one-line emotion summary for an attendee."""
        emotions = [
            f.get("metadata", {}).get("emotion", "neutral")
            for f in self._facts
            if f.get("type") == "SIGNAL"
            and f.get("metric") == "emotion"
            and f.get("node") == name
        ]

        if not emotions:
            return "No emotion data captured"

        # Count occurrences.
        counts = {}
        for e in emotions:
            counts[e] = counts.get(e, 0) + 1

        # Sort by frequency, ignore neutral.
        ranked = sorted(
            [(e, c) for e, c in counts.items() if e != "neutral"],
            key=lambda x: -x[1],
        )

        if not ranked:
            return "Predominantly neutral"

        dominant = ranked[0][0]
        total = len(emotions)
        pct = round(100 * ranked[0][1] / total)

        # Secondary emotion if present.
        if len(ranked) >= 2:
            secondary = ranked[1][0]
            return f"Predominantly {dominant} ({pct}%), with {secondary} moments"
        else:
            return f"Predominantly {dominant} ({pct}%)"

    def _infer_date(self) -> str:
        """Get the meeting date from fact timestamps, or use today."""
        timestamps = [
            f.get("timestamp", 0)
            for f in self._facts
            if f.get("timestamp", 0) > 0
        ]
        if timestamps:
            ts = min(timestamps)
            return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")
        return datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")


# ----------------------------------------------------------------------
# Utility
# ----------------------------------------------------------------------

def _esc(text: str) -> str:
    """Minimal HTML escaping for untrusted strings."""
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )
