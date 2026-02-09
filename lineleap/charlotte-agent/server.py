#!/usr/bin/env python3
"""
Charlotte Bar Agent — Pure Python server
Serves the Charlotte substrate + Claude-powered conversational bar management agent.
No pip dependencies except stdlib. Claude API called via urllib.

Usage:
    python server.py
    # then open http://localhost:3000
"""

import http.server
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
import uuid
from datetime import datetime, timedelta
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

PORT = int(os.environ.get("CHARLOTTE_PORT", 3000))
API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
MODEL = os.environ.get("CHARLOTTE_MODEL", "claude-sonnet-4-5-20250929")
MAX_TOKENS = 1024
HISTORY_LIMIT = 10  # messages per session to keep
SERVER_DIR = Path(__file__).resolve().parent

# ---------------------------------------------------------------------------
# Substrate — seed data (loaded from substrate.json if present, else built)
# ---------------------------------------------------------------------------


def _today_id():
    """Return a DATE node :ID like DATE:2-9-2026."""
    d = datetime.now()
    return f"DATE:{d.month}-{d.day}-{d.year}"


def _ts():
    return datetime.now().isoformat()


def build_seed_substrate():
    """Build a realistic Kollege Klub substrate as a list of FACT dicts."""
    today = _today_id()
    facts = []

    def fact(**kw):
        facts.append(kw)

    # ── Date nodes ──────────────────────────────────────────────────────
    now = datetime.now()
    for delta in range(-14, 15):
        d = now + timedelta(days=delta)
        did = f"DATE:{d.month}-{d.day}-{d.year}"
        fact(**{":ID": did, ":TYPE": "NODE", ":CREATED": did,
               "P0": "DATE", "P1": None, "P2": None, "P3": {"iso": d.strftime("%Y-%m-%d"), "dow": d.strftime("%A")}})

    # ── Venue node ──────────────────────────────────────────────────────
    fact(**{":ID": "venue-kollege-klub", ":TYPE": "NODE", ":CREATED": today,
           "P0": "VENUE", "P1": None, "P2": None,
           "P3": {"name": "Kollege Klub", "address": "529 N State Street, Madison WI",
                  "capacity": 400, "est": 1953, "owner": "Jordan Meier",
                  "type": "college_bar", "license": "Class B Liquor"}})

    # ── Owner node ──────────────────────────────────────────────────────
    fact(**{":ID": "person-jordan-meier", ":TYPE": "NODE", ":CREATED": today,
           "P0": "PERSON", "P1": None, "P2": None,
           "P3": {"name": "Jordan Meier", "role": "owner"}})
    fact(**{":ID": "edge-jordan-owns-kk", ":TYPE": "EDGE", ":CREATED": today,
           "P0": "person-jordan-meier", "P1": "venue-kollege-klub", "P2": "OWNS", "P3": None})

    # ── Product nodes ───────────────────────────────────────────────────
    products = [
        ("prod-lineskip",    "LineSkip",         "access",  10.00),
        ("prod-bud-light",   "Bud Light",        "beer",     5.00),
        ("prod-miller-lite", "Miller Lite",      "beer",     5.00),
        ("prod-white-claw",  "White Claw",       "seltzer",  6.00),
        ("prod-vodka-soda",  "Vodka Soda",       "cocktail", 8.00),
        ("prod-margarita",   "Margarita",        "cocktail", 9.00),
        ("prod-long-island", "Long Island",      "cocktail", 10.00),
        ("prod-fireball",    "Fireball Shot",    "shot",     5.00),
        ("prod-jager-bomb",  "Jager Bomb",       "shot",     7.00),
        ("prod-cover",       "Door Cover",       "access",   5.00),
        ("prod-bucket",      "Beer Bucket (5)",  "beer",    20.00),
        ("prod-pitcher",     "Pitcher",          "beer",    12.00),
    ]
    for pid, name, cat, price in products:
        fact(**{":ID": pid, ":TYPE": "NODE", ":CREATED": today,
               "P0": "PRODUCT", "P1": None, "P2": None,
               "P3": {"name": name, "category": cat, "price": price, "active": True}})
        fact(**{":ID": f"edge-{pid}-at-kk", ":TYPE": "EDGE", ":CREATED": today,
               "P0": pid, "P1": "venue-kollege-klub", "P2": "SOLD_AT", "P3": None})

    # ── Customer segment nodes ──────────────────────────────────────────
    segments = [
        ("seg-thursday-regulars", "Thursday Regulars",   245, "Users who visit 3+ Thursdays/month"),
        ("seg-weekend-warriors",  "Weekend Warriors",    812, "Fri+Sat visitors, 2+ visits/month"),
        ("seg-vip-spenders",      "VIP Spenders",         67, "Top 5% by monthly spend"),
        ("seg-freshmen",          "Freshmen",            390, "First-year users, < 6 months on platform"),
        ("seg-dormant",           "Dormant",             158, "No visit in 30+ days"),
        ("seg-greek-life",        "Greek Life",          305, "Users affiliated with Greek organizations"),
    ]
    for sid, name, count, desc in segments:
        fact(**{":ID": sid, ":TYPE": "NODE", ":CREATED": today,
               "P0": "SEGMENT", "P1": None, "P2": None,
               "P3": {"name": name, "size": count, "description": desc}})
        fact(**{":ID": f"edge-{sid}-of-kk", ":TYPE": "EDGE", ":CREATED": today,
               "P0": sid, "P1": "venue-kollege-klub", "P2": "SEGMENT_OF", "P3": None})

    # ── Staff nodes ─────────────────────────────────────────────────────
    staff = [
        ("staff-mike",   "Mike",   "bartender",     "full-time"),
        ("staff-sarah",  "Sarah",  "bartender",     "full-time"),
        ("staff-tony",   "Tony",   "bartender",     "part-time"),
        ("staff-jess",   "Jess",   "bartender",     "part-time"),
        ("staff-chris",  "Chris",  "door",          "full-time"),
        ("staff-anna",   "Anna",   "door",          "part-time"),
        ("staff-dave",   "Dave",   "bar_back",      "part-time"),
    ]
    for sid, name, role, status in staff:
        fact(**{":ID": sid, ":TYPE": "NODE", ":CREATED": today,
               "P0": "STAFF", "P1": None, "P2": None,
               "P3": {"name": name, "role": role, "status": status}})
        fact(**{":ID": f"edge-{sid}-works-kk", ":TYPE": "EDGE", ":CREATED": today,
               "P0": sid, "P1": "venue-kollege-klub", "P2": "WORKS_AT", "P3": None})

    # ── Event nodes ─────────────────────────────────────────────────────
    fri = now + timedelta(days=(4 - now.weekday()) % 7 or 7)
    sat = fri + timedelta(days=1)
    thu = now + timedelta(days=(3 - now.weekday()) % 7 or 7)
    events = [
        ("event-thirsty-thursday", "Thirsty Thursday",
         f"{thu.month}-{thu.day}-{thu.year}", "21:00", 0, 280),
        ("event-friday-night-live", "Friday Night Live",
         f"{fri.month}-{fri.day}-{fri.year}", "22:00", 5, 350),
        ("event-saturday-social", "Saturday Social",
         f"{sat.month}-{sat.day}-{sat.year}", "21:00", 10, 380),
    ]
    for eid, name, date_str, time_str, cover, expected in events:
        fact(**{":ID": eid, ":TYPE": "NODE", ":CREATED": today,
               "P0": "EVENT", "P1": None, "P2": None,
               "P3": {"name": name, "date": date_str, "time": time_str,
                      "cover": cover, "expected_attendance": expected}})
        fact(**{":ID": f"edge-{eid}-at-kk", ":TYPE": "EDGE", ":CREATED": today,
               "P0": eid, "P1": "venue-kollege-klub", "P2": "EVENT_AT", "P3": None})

    # ── Metrics ─────────────────────────────────────────────────────────
    metrics = [
        ("metric-revenue-today",       "venue-kollege-klub", "NUMBER", "Revenue Today",         {"current": 0, "unit": "USD"}),
        ("metric-revenue-wtd",         "venue-kollege-klub", "NUMBER", "Revenue WTD",           {"current": 14820, "unit": "USD"}),
        ("metric-revenue-mtd",         "venue-kollege-klub", "NUMBER", "Revenue MTD",           {"current": 38450, "unit": "USD"}),
        ("metric-revenue-last-friday", "venue-kollege-klub", "NUMBER", "Revenue Last Friday",   {"current": 6240, "unit": "USD"}),
        ("metric-revenue-last-saturday","venue-kollege-klub","NUMBER", "Revenue Last Saturday",  {"current": 7180, "unit": "USD"}),
        ("metric-avg-spend",           "venue-kollege-klub", "NUMBER", "Avg Spend Per Customer", {"current": 22.40, "unit": "USD"}),
        ("metric-avg-spend-vip",       "venue-kollege-klub", "NUMBER", "Avg Spend VIP",         {"current": 48.60, "unit": "USD"}),
        ("metric-lineskip-today",      "prod-lineskip",      "NUMBER", "LineSkip Sales Today",   {"current": 0, "unit": "count"}),
        ("metric-lineskip-wtd",        "prod-lineskip",      "NUMBER", "LineSkip Sales WTD",     {"current": 187, "unit": "count"}),
        ("metric-lineskip-conversion", "prod-lineskip",      "NUMBER", "LineSkip Conversion %",  {"current": 34.2, "unit": "percent"}),
        ("metric-door-count-today",    "venue-kollege-klub", "NUMBER", "Door Count Today",      {"current": 0, "unit": "count"}),
        ("metric-door-count-last-fri", "venue-kollege-klub", "NUMBER", "Door Count Last Friday", {"current": 342, "unit": "count"}),
        ("metric-door-count-last-sat", "venue-kollege-klub", "NUMBER", "Door Count Last Sat",   {"current": 378, "unit": "count"}),
        ("metric-demand-forecast",     "venue-kollege-klub", "NUMBER", "Demand Forecast Tonight",{"current": 0, "score": 0.0, "label": "closed"}),
        ("metric-capacity-utilization", "venue-kollege-klub","NUMBER", "Capacity Utilization %", {"current": 0, "unit": "percent"}),
        ("metric-wait-time",           "venue-kollege-klub", "NUMBER", "Avg Wait Time (min)",   {"current": 0, "unit": "minutes"}),
        ("metric-csat",                "venue-kollege-klub", "NUMBER", "Customer Satisfaction",  {"current": 4.2, "unit": "stars", "max": 5}),
        ("metric-repeat-rate",         "venue-kollege-klub", "NUMBER", "30-Day Repeat Rate %",  {"current": 42.8, "unit": "percent"}),
    ]

    # Set forecast based on day of week
    dow = now.strftime("%A")
    forecast_map = {
        "Monday": (40, 0.15, "dead"),
        "Tuesday": (75, 0.25, "slow"),
        "Wednesday": (130, 0.45, "moderate"),
        "Thursday": (280, 0.78, "busy"),
        "Friday": (350, 0.92, "packed"),
        "Saturday": (380, 0.95, "packed"),
        "Sunday": (60, 0.20, "dead"),
    }
    fc = forecast_map.get(dow, (100, 0.3, "moderate"))

    for mid, target, vtype, label, constraints in metrics:
        if mid == "metric-demand-forecast":
            constraints = {"current": fc[0], "score": fc[1], "label": fc[2]}
        fact(**{":ID": mid, ":TYPE": "METRIC", ":CREATED": today,
               "P0": target, "P1": vtype, "P2": label, "P3": constraints})

    # ── Product-level revenue metrics (last 7 days) ────────────────────
    product_revenue = [
        ("prod-bud-light",   1845),
        ("prod-vodka-soda",  1520),
        ("prod-lineskip",    1870),
        ("prod-white-claw",  1230),
        ("prod-miller-lite", 1105),
        ("prod-fireball",     980),
        ("prod-long-island",  910),
        ("prod-margarita",    860),
        ("prod-jager-bomb",   740),
        ("prod-cover",        685),
        ("prod-bucket",       620),
        ("prod-pitcher",      455),
    ]
    for pid, rev in product_revenue:
        fact(**{":ID": f"metric-rev7d-{pid}", ":TYPE": "METRIC", ":CREATED": today,
               "P0": pid, "P1": "NUMBER", "P2": "Revenue (7-day)", "P3": {"current": rev, "unit": "USD"}})

    # ── Signals (recent activity) ───────────────────────────────────────
    signals = [
        ("sig-001", "venue-kollege-klub", "metric-revenue-last-saturday", 7180,
         "Revenue recorded for Saturday night — strong performance.",
         -1),
        ("sig-002", "prod-lineskip", "metric-lineskip-wtd", 187,
         "LineSkip weekly tally: 187 sales at $10 avg.",
         -1),
        ("sig-003", "seg-thursday-regulars", None, None,
         "Push campaign sent: '$3 Wells this Thursday' — 245 recipients, 38% open rate.",
         -2),
        ("sig-004", "venue-kollege-klub", "metric-door-count-last-fri", 342,
         "Friday door count: 342 (85.5% capacity).",
         -2),
        ("sig-005", "venue-kollege-klub", "metric-door-count-last-sat", 378,
         "Saturday door count: 378 (94.5% capacity). Near sellout.",
         -2),
        ("sig-006", "prod-bud-light", "metric-rev7d-prod-bud-light", 1845,
         "Bud Light top seller by volume this week — 369 units.",
         -3),
        ("sig-007", "prod-lineskip", "metric-lineskip-conversion", 34.2,
         "LineSkip conversion rate: 34.2% of app openers purchased.",
         -3),
        ("sig-008", "venue-kollege-klub", "metric-csat", 4.2,
         "CSAT survey: 4.2/5.0 (n=89 responses this week).",
         -4),
        ("sig-009", "seg-dormant", None, None,
         "Win-back SMS sent to 158 dormant users: '$5 LineSkip comeback offer'.",
         -5),
        ("sig-010", "venue-kollege-klub", "metric-repeat-rate", 42.8,
         "30-day repeat rate: 42.8%, up 2.1pp from last month.",
         -6),
        ("sig-011", "staff-mike", None, None,
         "Mike clocked 38 hrs last week — approaching overtime threshold.",
         -3),
        ("sig-012", "event-friday-night-live", None, None,
         "Friday Night Live event created — DJ Ricky confirmed, $5 cover.",
         -4),
    ]
    for sid, target, metric_ref, value, description, day_offset in signals:
        d = now + timedelta(days=day_offset)
        created = f"DATE:{d.month}-{d.day}-{d.year}"
        fact(**{":ID": sid, ":TYPE": "SIGNAL", ":CREATED": created,
               "P0": target, "P1": metric_ref, "P2": value,
               "P3": {"description": description, "ts": (now + timedelta(days=day_offset)).isoformat()}})

    # ── Protocols ───────────────────────────────────────────────────────
    protocols = [
        ("proto-dynamic-pricing", "Dynamic Pricing",
         "Adjust LineSkip price based on demand forecast. Below 50% -> $8, 50-80% -> $10, above 80% -> $15.",
         "active", {"trigger": "demand_score", "thresholds": [0.5, 0.8], "prices": [8, 10, 15]}),
        ("proto-surge-staffing", "Surge Staffing",
         "When forecast > 300, schedule 4 bartenders + 2 door. Otherwise 3 + 1.",
         "active", {"trigger": "demand_forecast", "threshold": 300,
                    "surge": {"bartenders": 4, "door": 2}, "normal": {"bartenders": 3, "door": 1}}),
        ("proto-happy-hour", "Happy Hour Automation",
         "Mon-Wed 4-7pm: all wells $3, all domestics $3. Auto-activate via time trigger.",
         "active", {"days": ["Monday", "Tuesday", "Wednesday"], "start": "16:00", "end": "19:00",
                    "well_price": 3, "domestic_price": 3}),
        ("proto-campaign-thursday", "Thursday Push Campaign",
         "Every Wednesday at 2pm, send push to Thursday Regulars with the Thursday special.",
         "active", {"send_day": "Wednesday", "send_time": "14:00", "segment": "seg-thursday-regulars"}),
        ("proto-capacity-alert", "Capacity Alert",
         "When door count exceeds 360 (90% of 400), send alert to owner and pause LineSkip sales.",
         "active", {"threshold": 360, "actions": ["alert_owner", "pause_lineskip"]}),
    ]
    for pid, name, desc, status, rules in protocols:
        fact(**{":ID": pid, ":TYPE": "PROTOCOL", ":CREATED": today,
               "P0": status, "P1": name, "P2": desc, "P3": rules})

    return facts


# ---------------------------------------------------------------------------
# Substrate Engine
# ---------------------------------------------------------------------------

class Substrate:
    """In-memory FACT store with query and mutation."""

    def __init__(self, facts=None):
        self.facts = facts or []
        self._index_by_id = {}
        self._index_by_type = {}
        self._reindex()

    def _reindex(self):
        self._index_by_id = {}
        self._index_by_type = {"NODE": [], "EDGE": [], "METRIC": [], "SIGNAL": [], "PROTOCOL": []}
        for f in self.facts:
            self._index_by_id[f[":ID"]] = f
            ftype = f.get(":TYPE", "")
            if ftype in self._index_by_type:
                self._index_by_type[ftype].append(f)

    def count(self):
        return len(self.facts)

    # ── Query ───────────────────────────────────────────────────────────

    def get_nodes(self, category=None):
        nodes = self._index_by_type.get("NODE", [])
        if category:
            return [n for n in nodes if n.get("P0") == category]
        return list(nodes)

    def get_edges(self, source=None, target=None, edge_type=None):
        edges = self._index_by_type.get("EDGE", [])
        result = edges
        if source:
            result = [e for e in result if e.get("P0") == source]
        if target:
            result = [e for e in result if e.get("P1") == target]
        if edge_type:
            result = [e for e in result if e.get("P2") == edge_type]
        return result

    def get_metrics(self, node_id=None):
        metrics = self._index_by_type.get("METRIC", [])
        if node_id:
            return [m for m in metrics if m.get("P0") == node_id]
        return list(metrics)

    def get_signals(self, node_id=None, signal_type=None, limit=20):
        signals = self._index_by_type.get("SIGNAL", [])
        if node_id:
            signals = [s for s in signals if s.get("P0") == node_id]
        if signal_type:
            signals = [s for s in signals if s.get("P1") == signal_type]
        # Sort by timestamp descending (newest first)
        signals.sort(key=lambda s: (s.get("P3") or {}).get("ts", ""), reverse=True)
        return signals[:limit]

    def get_protocols(self, status=None):
        protocols = self._index_by_type.get("PROTOCOL", [])
        if status:
            return [p for p in protocols if p.get("P0") == status]
        return list(protocols)

    def get_fact(self, fact_id):
        return self._index_by_id.get(fact_id)

    # ── Mutation ────────────────────────────────────────────────────────

    def add_signal(self, source, signal_type, payload, description=""):
        sid = f"sig-{uuid.uuid4().hex[:8]}"
        signal = {
            ":ID": sid,
            ":TYPE": "SIGNAL",
            ":CREATED": _today_id(),
            "P0": source,
            "P1": signal_type,
            "P2": payload,
            "P3": {"description": description, "ts": _ts()}
        }
        self.facts.append(signal)
        self._index_by_id[sid] = signal
        self._index_by_type["SIGNAL"].append(signal)
        return signal

    def update_metric(self, metric_id, new_value):
        metric = self._index_by_id.get(metric_id)
        if metric and isinstance(metric.get("P3"), dict):
            old_value = metric["P3"].get("current")
            metric["P3"]["current"] = new_value
            return {"metric_id": metric_id, "old": old_value, "new": new_value}
        return None

    def update_node(self, node_id, properties):
        node = self._index_by_id.get(node_id)
        if node and isinstance(node.get("P3"), dict):
            node["P3"].update(properties)
            return node
        return None

    def add_node(self, node_id, category, properties):
        node = {
            ":ID": node_id,
            ":TYPE": "NODE",
            ":CREATED": _today_id(),
            "P0": category,
            "P1": None,
            "P2": None,
            "P3": properties
        }
        self.facts.append(node)
        self._index_by_id[node_id] = node
        self._index_by_type["NODE"].append(node)
        return node

    def add_edge(self, edge_id, source, target, edge_type):
        edge = {
            ":ID": edge_id,
            ":TYPE": "EDGE",
            ":CREATED": _today_id(),
            "P0": source,
            "P1": target,
            "P2": edge_type,
            "P3": None
        }
        self.facts.append(edge)
        self._index_by_id[edge_id] = edge
        self._index_by_type["EDGE"].append(edge)
        return edge

    # ── Summaries for system prompt ─────────────────────────────────────

    def venue_metrics_summary(self):
        lines = []
        for m in self.get_metrics("venue-kollege-klub"):
            p3 = m.get("P3") or {}
            label = m.get("P2", m[":ID"])
            current = p3.get("current", "N/A")
            unit = p3.get("unit", "")
            extra = ""
            if "score" in p3:
                extra = f" (score: {p3['score']}, label: {p3.get('label', '')})"
            if "max" in p3:
                extra = f" / {p3['max']}"
            lines.append(f"  - {label}: {current} {unit}{extra}")
        return "\n".join(lines)

    def product_revenue_summary(self):
        lines = []
        rev_metrics = [m for m in self._index_by_type.get("METRIC", [])
                       if m[":ID"].startswith("metric-rev7d-")]
        rev_metrics.sort(key=lambda m: (m.get("P3") or {}).get("current", 0), reverse=True)
        for m in rev_metrics:
            product = self.get_fact(m.get("P0", ""))
            name = (product.get("P3") or {}).get("name", m["P0"]) if product else m["P0"]
            price = (product.get("P3") or {}).get("price", "?") if product else "?"
            rev = (m.get("P3") or {}).get("current", 0)
            lines.append(f"  - {name} (${price}): ${rev}")
        return "\n".join(lines)

    def segment_summary(self):
        lines = []
        for s in self.get_nodes("SEGMENT"):
            p3 = s.get("P3") or {}
            lines.append(f"  - {p3.get('name', s[':ID'])}: {p3.get('size', '?')} users — {p3.get('description', '')}")
        return "\n".join(lines)

    def recent_signals_summary(self, limit=10):
        lines = []
        for s in self.get_signals(limit=limit):
            p3 = s.get("P3") or {}
            lines.append(f"  - [{s[':CREATED']}] {p3.get('description', 'No description')}")
        return "\n".join(lines)

    def protocols_summary(self):
        lines = []
        for p in self.get_protocols("active"):
            lines.append(f"  - {p.get('P1', p[':ID'])}: {p.get('P2', '')}")
        return "\n".join(lines)

    def product_listing(self):
        lines = []
        for p in self.get_nodes("PRODUCT"):
            p3 = p.get("P3") or {}
            lines.append(f"  - {p3.get('name')} [{p[':ID']}] — ${p3.get('price', '?')} ({p3.get('category', '')})")
        return "\n".join(lines)

    def staff_listing(self):
        lines = []
        for s in self.get_nodes("STAFF"):
            p3 = s.get("P3") or {}
            lines.append(f"  - {p3.get('name')} [{s[':ID']}] — {p3.get('role', '')} ({p3.get('status', '')})")
        return "\n".join(lines)

    def events_listing(self):
        lines = []
        for e in self.get_nodes("EVENT"):
            p3 = e.get("P3") or {}
            lines.append(f"  - {p3.get('name')} [{e[':ID']}] — {p3.get('date', '?')} at {p3.get('time', '?')}, cover: ${p3.get('cover', 0)}, expected: {p3.get('expected_attendance', '?')}")
        return "\n".join(lines)

    def forecast_summary(self):
        fc = self.get_fact("metric-demand-forecast")
        if fc:
            p3 = fc.get("P3") or {}
            return f"  Predicted attendance: {p3.get('current', '?')} | Demand score: {p3.get('score', '?')} | Label: {p3.get('label', '?')}"
        return "  No forecast available."


# ---------------------------------------------------------------------------
# Claude API Integration
# ---------------------------------------------------------------------------

def call_claude(messages, system_prompt):
    """Call the Anthropic Messages API via raw urllib. Returns text response."""
    if not API_KEY:
        return None  # triggers fallback mode

    body = json.dumps({
        "model": MODEL,
        "max_tokens": MAX_TOKENS,
        "system": system_prompt,
        "messages": messages
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=body,
        headers={
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            "anthropic-version": "2023-06-01"
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            return result["content"][0]["text"]
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        print(f"[Claude API error] {e.code}: {error_body}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"[Claude API error] {e}", file=sys.stderr)
        return None


def build_system_prompt(substrate):
    """Build Charlotte's system prompt with live substrate context."""
    dow = datetime.now().strftime("%A")
    date_str = datetime.now().strftime("%B %d, %Y")
    time_str = datetime.now().strftime("%I:%M %p")

    return f"""You are Charlotte, an autonomous bar management agent powered by the Charlotte substrate.
You manage Kollege Klub, an iconic college bar at 529 N State Street, Madison WI (est. 1953, 400 capacity).
Owner: Jordan Meier.

Today is {dow}, {date_str}. Current time: {time_str}.

Your personality:
- Professional but warm — you're talking to a bar owner, not a CEO
- Data-driven — always cite numbers when available
- Proactive — suggest actions, don't just report
- Concise — bar owners are busy, especially on busy nights
- You speak like a trusted advisor who knows the bar inside and out

Current venue metrics:
{substrate.venue_metrics_summary()}

Tonight's forecast:
{substrate.forecast_summary()}

Recent activity (last 10 signals):
{substrate.recent_signals_summary(10)}

Active protocols:
{substrate.protocols_summary()}

Top products by revenue (last 7 days):
{substrate.product_revenue_summary()}

Product catalog:
{substrate.product_listing()}

Customer segments:
{substrate.segment_summary()}

Staff:
{substrate.staff_listing()}

Upcoming events:
{substrate.events_listing()}

You can execute these actions by including action tags in your response:
- [ACTION:update_price:{{"product_id":"...","new_price":N}}] — change a product price
- [ACTION:send_campaign:{{"segment":"...","message":"...","channel":"push|sms|email"}}] — send marketing campaign
- [ACTION:create_event:{{"name":"...","date":"...","time":"...","cover":N,"expected":N}}] — create event
- [ACTION:update_staffing:{{"bartenders":N,"door":N}}] — set staffing recommendation
- [ACTION:add_special:{{"product_id":"...","special_price":N,"duration":"tonight|weekend|week"}}] — add drink special
- [ACTION:adjust_forecast:{{"expected":N,"score":F,"label":"..."}}] — override demand forecast

When you execute an action, confirm it naturally in your response. You may include multiple actions in a single response.
Keep responses under 150 words unless the owner asks for a detailed report or analysis.
Do not use markdown headers. Use plain text with occasional bold (**text**) for emphasis.
"""


# ---------------------------------------------------------------------------
# Action Execution
# ---------------------------------------------------------------------------

ACTION_PATTERN = re.compile(r'\[ACTION:(\w+):(.*?)\]', re.DOTALL)


def parse_actions(text):
    """Extract action tags from Claude's response text."""
    actions = []
    for match in ACTION_PATTERN.finditer(text):
        action_type = match.group(1)
        try:
            params = json.loads(match.group(2))
        except json.JSONDecodeError:
            params = {"raw": match.group(2)}
        actions.append({"type": action_type, "params": params, "raw": match.group(0)})
    return actions


def clean_response(text, actions):
    """Remove action tags from response text."""
    cleaned = text
    for a in actions:
        cleaned = cleaned.replace(a["raw"], "")
    # Clean up double spaces / blank lines left behind
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned).strip()
    return cleaned


def execute_action(substrate, action_type, params):
    """Execute an action on the substrate. Returns a result dict."""
    result = {"type": action_type, "success": False, "detail": ""}

    if action_type == "update_price":
        product_id = params.get("product_id", "")
        new_price = params.get("new_price")
        if new_price is not None:
            node = substrate.update_node(product_id, {"price": float(new_price)})
            if node:
                product_name = (node.get("P3") or {}).get("name", product_id)
                sig = substrate.add_signal(
                    product_id, "price_change",
                    {"new_price": float(new_price)},
                    f"Price updated: {product_name} -> ${new_price:.2f}"
                )
                result["success"] = True
                result["detail"] = f"{product_name} price set to ${new_price:.2f}"
                result["signal"] = sig
            else:
                result["detail"] = f"Product {product_id} not found"
        else:
            result["detail"] = "Missing new_price"

    elif action_type == "send_campaign":
        segment = params.get("segment", "")
        message = params.get("message", "")
        channel = params.get("channel", "push")
        # Find segment node for count
        seg_node = substrate.get_fact(segment)
        recipient_count = (seg_node.get("P3") or {}).get("size", 0) if seg_node else 0
        sig = substrate.add_signal(
            segment or "venue-kollege-klub", "campaign_sent",
            {"message": message, "channel": channel, "recipients": recipient_count},
            f"Campaign sent via {channel} to {segment}: \"{message}\" ({recipient_count} recipients)"
        )
        result["success"] = True
        result["detail"] = f"Campaign sent to {recipient_count} users via {channel}"
        result["signal"] = sig

    elif action_type == "create_event":
        name = params.get("name", "New Event")
        date = params.get("date", "TBD")
        time_str = params.get("time", "21:00")
        cover = params.get("cover", 0)
        expected = params.get("expected", 200)
        eid = f"event-{uuid.uuid4().hex[:8]}"
        node = substrate.add_node(eid, "EVENT", {
            "name": name, "date": date, "time": time_str,
            "cover": cover, "expected_attendance": expected
        })
        substrate.add_edge(f"edge-{eid}-at-kk", eid, "venue-kollege-klub", "EVENT_AT")
        sig = substrate.add_signal(
            eid, "event_created", {"name": name, "date": date},
            f"Event created: {name} on {date} at {time_str}, cover ${cover}, expected {expected}"
        )
        result["success"] = True
        result["detail"] = f"Event '{name}' created for {date}"
        result["signal"] = sig
        result["event_id"] = eid

    elif action_type == "update_staffing":
        bartenders = params.get("bartenders", 3)
        door = params.get("door", 1)
        sig = substrate.add_signal(
            "venue-kollege-klub", "staffing_recommendation",
            {"bartenders": bartenders, "door": door},
            f"Staffing recommendation: {bartenders} bartenders, {door} door staff"
        )
        result["success"] = True
        result["detail"] = f"Staffing set: {bartenders} bartenders, {door} door"
        result["signal"] = sig

    elif action_type == "add_special":
        product_id = params.get("product_id", "")
        special_price = params.get("special_price")
        duration = params.get("duration", "tonight")
        product = substrate.get_fact(product_id)
        product_name = (product.get("P3") or {}).get("name", product_id) if product else product_id
        sig = substrate.add_signal(
            product_id, "special_added",
            {"special_price": special_price, "duration": duration},
            f"Special: {product_name} at ${special_price} for {duration}"
        )
        result["success"] = True
        result["detail"] = f"{product_name} special: ${special_price} ({duration})"
        result["signal"] = sig

    elif action_type == "adjust_forecast":
        expected = params.get("expected")
        score = params.get("score")
        label = params.get("label")
        updates = {}
        if expected is not None:
            updates["current"] = expected
        if score is not None:
            updates["score"] = score
        if label is not None:
            updates["label"] = label
        fc = substrate.get_fact("metric-demand-forecast")
        if fc and isinstance(fc.get("P3"), dict):
            fc["P3"].update(updates)
            sig = substrate.add_signal(
                "venue-kollege-klub", "forecast_adjusted",
                updates,
                f"Forecast adjusted: expected {expected}, score {score}, label {label}"
            )
            result["success"] = True
            result["detail"] = f"Forecast updated: {expected} expected, {label}"
            result["signal"] = sig
        else:
            result["detail"] = "Forecast metric not found"

    else:
        result["detail"] = f"Unknown action type: {action_type}"

    return result


# ---------------------------------------------------------------------------
# Fallback Local Inference (no API key)
# ---------------------------------------------------------------------------

def fallback_response(message, substrate):
    """Pattern-match common queries when no API key is set."""
    msg = message.lower().strip()

    # Forecast / tonight
    if any(w in msg for w in ["tonight", "forecast", "how busy", "how's it look"]):
        fc = substrate.get_fact("metric-demand-forecast")
        p3 = (fc.get("P3") or {}) if fc else {}
        dow = datetime.now().strftime("%A")
        return (f"It's {dow}. Tonight's forecast: **{p3.get('label', 'unknown')}** — "
                f"expecting around {p3.get('current', '?')} people "
                f"(demand score: {p3.get('score', '?')}).\n\n"
                f"Based on the dynamic pricing protocol, I'd recommend "
                f"{'raising LineSkip to $15' if p3.get('score', 0) > 0.8 else 'keeping LineSkip at $10' if p3.get('score', 0) > 0.5 else 'dropping LineSkip to $8 to drive volume'}.")

    # Revenue
    if any(w in msg for w in ["revenue", "how did we do", "how'd we do", "numbers", "sales"]):
        rev_wtd = substrate.get_fact("metric-revenue-wtd")
        rev_mtd = substrate.get_fact("metric-revenue-mtd")
        rev_fri = substrate.get_fact("metric-revenue-last-friday")
        rev_sat = substrate.get_fact("metric-revenue-last-saturday")
        return (f"Here's the revenue snapshot:\n\n"
                f"**Week to date:** ${(rev_wtd.get('P3') or {}).get('current', '?'):,}\n"
                f"**Month to date:** ${(rev_mtd.get('P3') or {}).get('current', '?'):,}\n"
                f"**Last Friday:** ${(rev_fri.get('P3') or {}).get('current', '?'):,} (342 through the door)\n"
                f"**Last Saturday:** ${(rev_sat.get('P3') or {}).get('current', '?'):,} (378 through the door)\n\n"
                f"Saturday was a near-sellout at 94.5% capacity. Strong week overall.")

    # Price change
    if "raise" in msg or "price" in msg or "increase" in msg:
        # Try to extract product and price
        if "lineskip" in msg or "line skip" in msg:
            price_match = re.search(r'\$?(\d+)', msg)
            new_price = float(price_match.group(1)) if price_match else 15.0
            result = execute_action(substrate, "update_price",
                                     {"product_id": "prod-lineskip", "new_price": new_price})
            if result["success"]:
                return f"Done. LineSkip is now **${new_price:.0f}**. I've logged the price change in the substrate. This will take effect immediately for all new purchases."
        return "Which product would you like to reprice? Give me the product name and new price."

    # Top seller / drink
    if "top" in msg and any(w in msg for w in ["drink", "seller", "product", "selling"]):
        return (f"Top sellers by revenue (last 7 days):\n\n"
                f"{substrate.product_revenue_summary()}\n\n"
                f"LineSkip and Bud Light are neck-and-neck at the top. "
                f"Vodka Soda is our strongest cocktail. Fireball shots are solid impulse buys.")

    # Campaign / push / marketing
    if any(w in msg for w in ["send", "push", "campaign", "market", "blast"]):
        if "thursday" in msg:
            result = execute_action(substrate, "send_campaign", {
                "segment": "seg-thursday-regulars",
                "message": "Thirsty Thursday at KK — $3 wells all night!",
                "channel": "push"
            })
            return f"Push sent to **245 Thursday Regulars**: \"Thirsty Thursday at KK — $3 wells all night!\" Campaign logged."
        return "Which segment should I target? Options: Thursday Regulars (245), Weekend Warriors (812), VIP Spenders (67), Freshmen (390), Dormant (158), Greek Life (305)."

    # Staff / bartender
    if any(w in msg for w in ["staff", "bartender", "door", "schedule", "who's working"]):
        fc = substrate.get_fact("metric-demand-forecast")
        score = ((fc.get("P3") or {}).get("score", 0)) if fc else 0
        if score > 0.8:
            rec = "I'd go **4 bartenders + 2 door** tonight (surge protocol)."
        elif score > 0.5:
            rec = "Standard **3 bartenders + 1 door** should be fine."
        else:
            rec = "Light night — **2 bartenders + 1 door** will cover it."
        return (f"Current roster:\n{substrate.staff_listing()}\n\n"
                f"Tonight's recommendation based on demand forecast: {rec}")

    # Events
    if any(w in msg for w in ["event", "upcoming", "what's happening"]):
        return f"Upcoming events:\n{substrate.events_listing()}"

    # Segments / customers
    if any(w in msg for w in ["segment", "customer", "audience", "who"]):
        return f"Customer segments:\n{substrate.segment_summary()}"

    # Avg spend
    if "spend" in msg or "average" in msg:
        avg = substrate.get_fact("metric-avg-spend")
        avg_vip = substrate.get_fact("metric-avg-spend-vip")
        return (f"**Average spend per customer:** ${(avg.get('P3') or {}).get('current', '?')}\n"
                f"**Average VIP spend:** ${(avg_vip.get('P3') or {}).get('current', '?')}\n\n"
                f"VIPs spend 2x+ the average. Worth investing in that segment.")

    # Repeat rate / retention
    if any(w in msg for w in ["repeat", "retention", "return", "loyal"]):
        rr = substrate.get_fact("metric-repeat-rate")
        return (f"**30-day repeat rate:** {(rr.get('P3') or {}).get('current', '?')}%\n\n"
                f"Up 2.1 percentage points from last month. The Thursday push campaigns are working.")

    # CSAT / satisfaction
    if any(w in msg for w in ["satisfaction", "csat", "rating", "review"]):
        csat = substrate.get_fact("metric-csat")
        return (f"**Customer satisfaction:** {(csat.get('P3') or {}).get('current', '?')}/5.0 stars "
                f"(89 responses this week).\n\n"
                f"Solid rating. Main complaint themes from reviews: wait times on Saturday peaks, "
                f"bathroom cleanliness. Consider adding a bar back on Saturdays.")

    # Protocols
    if any(w in msg for w in ["protocol", "rule", "automation", "auto"]):
        return f"Active protocols:\n{substrate.protocols_summary()}"

    # Metrics overview
    if any(w in msg for w in ["metric", "dashboard", "overview", "status", "kpi"]):
        return (f"Kollege Klub Dashboard:\n\n"
                f"{substrate.venue_metrics_summary()}\n\n"
                f"Tonight's forecast:\n{substrate.forecast_summary()}")

    # LineSkip specific
    if "lineskip" in msg or "line skip" in msg:
        ls_wtd = substrate.get_fact("metric-lineskip-wtd")
        ls_conv = substrate.get_fact("metric-lineskip-conversion")
        ls_prod = substrate.get_fact("prod-lineskip")
        price = (ls_prod.get("P3") or {}).get("price", "?") if ls_prod else "?"
        return (f"**LineSkip Report:**\n"
                f"Current price: ${price}\n"
                f"Sales this week: {(ls_wtd.get('P3') or {}).get('current', '?')}\n"
                f"Conversion rate: {(ls_conv.get('P3') or {}).get('current', '?')}%\n\n"
                f"At {(ls_conv.get('P3') or {}).get('current', 0)}% conversion, every 3rd app opener is buying. "
                f"That's strong for a college market.")

    # Help / what can you do
    if any(w in msg for w in ["help", "what can you", "capabilities", "what do you"]):
        return ("I'm Charlotte, your bar management agent. Here's what I can do:\n\n"
                "- **Revenue reports** — \"How did we do last Friday?\"\n"
                "- **Demand forecasting** — \"How's tonight looking?\"\n"
                "- **Price management** — \"Raise LineSkip to $15\"\n"
                "- **Marketing campaigns** — \"Send a push to Thursday regulars\"\n"
                "- **Drink analytics** — \"What's our top seller?\"\n"
                "- **Staffing** — \"How many bartenders tonight?\"\n"
                "- **Event management** — \"Set up a new event for Friday\"\n"
                "- **Customer insights** — \"What's our repeat rate?\"\n"
                "- **Protocol management** — \"What automations are running?\"\n\n"
                "Just ask me anything about Kollege Klub.")

    # Default
    return ("I'm Charlotte, managing Kollege Klub. I can help with revenue reports, "
            "demand forecasts, pricing, campaigns, staffing, and more. "
            "Try: \"How's tonight looking?\" or \"What's our top seller?\"")


# ---------------------------------------------------------------------------
# Conversation History
# ---------------------------------------------------------------------------

sessions = {}  # session_id -> [{"role": "user"/"assistant", "content": "..."}]


def get_session(session_id):
    if session_id not in sessions:
        sessions[session_id] = []
    return sessions[session_id]


def add_to_session(session_id, role, content):
    history = get_session(session_id)
    history.append({"role": role, "content": content})
    # Keep only the last HISTORY_LIMIT messages
    if len(history) > HISTORY_LIMIT:
        sessions[session_id] = history[-HISTORY_LIMIT:]


# ---------------------------------------------------------------------------
# HTTP Server
# ---------------------------------------------------------------------------

class CharlotteHandler(BaseHTTPRequestHandler):
    """Handles all HTTP requests for the Charlotte agent."""

    substrate = None  # set after startup

    def log_message(self, format, *args):
        """Custom log format."""
        print(f"  [{datetime.now().strftime('%H:%M:%S')}] {args[0]}", file=sys.stderr)

    def _cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Session-ID")

    def _json_response(self, data, status=200):
        body = json.dumps(data, default=str).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self._cors_headers()
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _html_response(self, html, status=200):
        body = html.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self._cors_headers()
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_body(self):
        length = int(self.headers.get("Content-Length", 0))
        if length == 0:
            return {}
        raw = self.rfile.read(length)
        try:
            return json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            return {}

    def _get_session_id(self):
        return self.headers.get("X-Session-ID", "default")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors_headers()
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?")[0]
        query_string = self.path.split("?")[1] if "?" in self.path else ""
        params = {}
        if query_string:
            for pair in query_string.split("&"):
                if "=" in pair:
                    k, v = pair.split("=", 1)
                    params[k] = v

        if path == "/" or path == "/index.html":
            self._serve_static("index.html")

        elif path == "/api/substrate":
            self._json_response({"facts": self.substrate.facts, "count": self.substrate.count()})

        elif path == "/api/metrics":
            node_id = params.get("node_id", "venue-kollege-klub")
            metrics = self.substrate.get_metrics(node_id)
            self._json_response({"metrics": metrics, "count": len(metrics)})

        elif path == "/api/signals":
            limit = int(params.get("limit", 20))
            node_id = params.get("node_id")
            signals = self.substrate.get_signals(node_id=node_id, limit=limit)
            self._json_response({"signals": signals, "count": len(signals)})

        elif path == "/api/nodes":
            category = params.get("category")
            nodes = self.substrate.get_nodes(category)
            self._json_response({"nodes": nodes, "count": len(nodes)})

        elif path == "/api/protocols":
            status = params.get("status")
            protocols = self.substrate.get_protocols(status)
            self._json_response({"protocols": protocols, "count": len(protocols)})

        elif path.startswith("/api/"):
            self._json_response({"error": "Not found"}, 404)

        else:
            # Try to serve static file
            self._serve_static(path.lstrip("/"))

    def do_POST(self):
        path = self.path.split("?")[0]

        if path == "/api/chat":
            self._handle_chat()
        elif path == "/api/action":
            self._handle_action()
        else:
            self._json_response({"error": "Not found"}, 404)

    def _serve_static(self, filename):
        """Serve a static file from the server directory."""
        filepath = SERVER_DIR / filename
        if not filepath.exists() or not filepath.is_file():
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not found")
            return

        # Determine content type
        ext = filepath.suffix.lower()
        content_types = {
            ".html": "text/html; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".js": "application/javascript; charset=utf-8",
            ".json": "application/json",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".svg": "image/svg+xml",
            ".ico": "image/x-icon",
            ".woff": "font/woff",
            ".woff2": "font/woff2",
        }
        ctype = content_types.get(ext, "application/octet-stream")

        data = filepath.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self._cors_headers()
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _handle_chat(self):
        """Handle POST /api/chat."""
        body = self._read_body()
        message = body.get("message", "").strip()
        if not message:
            self._json_response({"error": "Empty message"}, 400)
            return

        session_id = self._get_session_id()
        add_to_session(session_id, "user", message)

        # Build messages for Claude (or fallback)
        history = get_session(session_id)

        if API_KEY:
            system_prompt = build_system_prompt(self.substrate)
            response_text = call_claude(history, system_prompt)

        if not API_KEY or response_text is None:
            # Fallback mode
            response_text = fallback_response(message, self.substrate)

        # Parse and execute actions
        actions = parse_actions(response_text)
        action_results = []
        for action in actions:
            result = execute_action(self.substrate, action["type"], action["params"])
            action_results.append(result)

        # Clean response text (remove action tags)
        clean_text = clean_response(response_text, actions)

        # Store assistant response in history
        add_to_session(session_id, "assistant", clean_text)

        # Build updated metrics snapshot
        updated_metrics = {}
        for m in self.substrate.get_metrics("venue-kollege-klub"):
            p3 = m.get("P3") or {}
            updated_metrics[m[":ID"]] = p3.get("current")

        self._json_response({
            "response": clean_text,
            "actions": action_results,
            "updated_metrics": updated_metrics
        })

    def _handle_action(self):
        """Handle POST /api/action."""
        body = self._read_body()
        action_type = body.get("type", "")
        params = body.get("params", {})

        if not action_type:
            self._json_response({"error": "Missing action type"}, 400)
            return

        result = execute_action(self.substrate, action_type, params)
        self._json_response(result)


# ---------------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------------

def load_or_build_substrate():
    """Load substrate.json if present, otherwise build seed data."""
    substrate_path = SERVER_DIR / "substrate.json"
    if substrate_path.exists():
        try:
            with open(substrate_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            facts = data if isinstance(data, list) else data.get("facts", [])
            print(f"  Loaded {len(facts)} facts from substrate.json")
            return Substrate(facts)
        except Exception as e:
            print(f"  Warning: Could not load substrate.json ({e}), using seed data")

    facts = build_seed_substrate()
    # Save for next time
    try:
        with open(substrate_path, "w", encoding="utf-8") as f:
            json.dump(facts, f, indent=2, default=str)
        print(f"  Generated seed substrate with {len(facts)} facts -> substrate.json")
    except Exception as e:
        print(f"  Warning: Could not save substrate.json ({e})")
    return Substrate(facts)


def main():
    substrate = load_or_build_substrate()
    CharlotteHandler.substrate = substrate

    api_status = "Claude API connected" if API_KEY else "local inference (no API key)"
    fact_count = substrate.count()

    banner = (
        f"\n  Charlotte Bar Agent v1.0\n"
        f"  Venue: Kollege Klub, Madison WI\n"
        f"  Substrate: {fact_count} facts loaded\n"
        f"  API: {api_status}\n"
        f"  http://localhost:{PORT}\n"
    )
    print(banner)

    if not API_KEY:
        print("\n  \033[33mWARNING: ANTHROPIC_API_KEY not set — running in fallback mode.\033[0m")
        print("    Set it with: export ANTHROPIC_API_KEY=sk-ant-...")
        print("    Charlotte will use pattern-matching for responses.\n")
    else:
        print(f"\n  Using model: {MODEL}\n")

    server = HTTPServer(("0.0.0.0", PORT), CharlotteHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\n  Charlotte shutting down. Goodnight, KK. 🌙\n")
        server.server_close()


if __name__ == "__main__":
    main()
