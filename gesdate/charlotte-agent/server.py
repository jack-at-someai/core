#!/usr/bin/env python3
"""
Charlotte Herd Agent — Pure Python server
Serves the Charlotte substrate + Claude-powered conversational herd management agent.
No pip dependencies except stdlib. Claude API called via urllib.

Usage:
    python server.py
    # then open http://localhost:3001
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

PORT = int(os.environ.get("CHARLOTTE_PORT", 3001))
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
    """Build a realistic Trogdon Showpigs substrate as a list of FACT dicts."""
    today = _today_id()
    facts = []

    def fact(**kw):
        facts.append(kw)

    # -- Date nodes --------------------------------------------------------
    now = datetime.now()
    for delta in range(-14, 15):
        d = now + timedelta(days=delta)
        did = f"DATE:{d.month}-{d.day}-{d.year}"
        fact(**{":ID": did, ":TYPE": "NODE", ":CREATED": did,
               "P0": "DATE", "P1": None, "P2": None, "P3": {"iso": d.strftime("%Y-%m-%d"), "dow": d.strftime("%A")}})

    # -- Operation node ----------------------------------------------------
    fact(**{":ID": "operation-trogdon-showpigs", ":TYPE": "NODE", ":CREATED": today,
           "P0": "OPERATION", "P1": None, "P2": None,
           "P3": {"name": "Trogdon Showpigs", "location": "Shelby, NC",
                  "owner": "Todd Trogdon", "herd_size": 85,
                  "operation_type": "show_pig", "established": 2014}})

    # -- Owner node --------------------------------------------------------
    fact(**{":ID": "person-todd-trogdon", ":TYPE": "NODE", ":CREATED": today,
           "P0": "PERSON", "P1": None, "P2": None,
           "P3": {"name": "Todd Trogdon", "role": "owner"}})
    fact(**{":ID": "edge-todd-owns-trogdon", ":TYPE": "EDGE", ":CREATED": today,
           "P0": "person-todd-trogdon", "P1": "operation-trogdon-showpigs", "P2": "OWNS", "P3": None})

    # -- Sow nodes ---------------------------------------------------------
    sows = [
        ("sow-lady-42",    "Lady 42",    "Yorkshire",  "2022-03-15", "bred",      "2026-01-12"),
        ("sow-duchess-7",  "Duchess 7",  "Hampshire",  "2021-09-20", "bred",      "2026-01-18"),
        ("sow-bella-19",   "Bella 19",   "Duroc",      "2023-01-08", "gestating", "2026-02-05"),
        ("sow-rosie-33",   "Rosie 33",   "Yorkshire",  "2022-06-11", "farrowed",  None),
        ("sow-queen-88",   "Queen 88",   "Berkshire",  "2021-04-22", "open",      None),
        ("sow-daisy-15",   "Daisy 15",   "Hampshire",  "2023-05-03", "bred",      "2026-01-25"),
        ("sow-pearl-61",   "Pearl 61",   "Yorkshire",  "2022-11-30", "gestating", "2026-02-14"),
        ("sow-stella-44",  "Stella 44",  "Duroc",      "2023-03-17", "open",      None),
        ("sow-ruby-22",    "Ruby 22",    "Berkshire",  "2021-12-05", "bred",      "2026-02-01"),
        ("sow-grace-56",   "Grace 56",   "Hampshire",  "2022-08-19", "lactating", None),
        ("sow-ivy-77",     "Ivy 77",     "Yorkshire",  "2023-07-14", "bred",      "2026-02-08"),
        ("sow-luna-90",    "Luna 90",    "Duroc",      "2022-02-28", "gestating", "2026-02-20"),
    ]
    for sid, name, breed, dob, status, due_date in sows:
        p3 = {"name": name, "breed": breed, "dob": dob, "status": status}
        if due_date:
            p3["due_date"] = due_date
        fact(**{":ID": sid, ":TYPE": "NODE", ":CREATED": today,
               "P0": "SOW", "P1": None, "P2": None, "P3": p3})
        fact(**{":ID": f"edge-{sid}-member-of", ":TYPE": "EDGE", ":CREATED": today,
               "P0": sid, "P1": "operation-trogdon-showpigs", "P2": "MEMBER_OF", "P3": None})

    # -- Boar nodes --------------------------------------------------------
    boars = [
        ("boar-thunder-1",  "Thunder",  "Duroc",     "proven", 42),
        ("boar-champion-3", "Champion", "Hampshire", "proven", 38),
        ("boar-titan-5",    "Titan",    "Yorkshire", "young",  12),
        ("boar-ace-8",      "Ace",      "Berkshire", "proven", 29),
    ]
    for bid, name, breed, status, litter_count in boars:
        fact(**{":ID": bid, ":TYPE": "NODE", ":CREATED": today,
               "P0": "BOAR", "P1": None, "P2": None,
               "P3": {"name": name, "breed": breed, "status": status, "litter_count": litter_count}})
        fact(**{":ID": f"edge-{bid}-member-of", ":TYPE": "EDGE", ":CREATED": today,
               "P0": bid, "P1": "operation-trogdon-showpigs", "P2": "MEMBER_OF", "P3": None})

    # -- Litter nodes ------------------------------------------------------
    litters = [
        ("litter-2026-001", "L-2026-001", "sow-rosie-33",  "boar-thunder-1",  "2026-01-05", 12, 11, 1, 0, 6, 5),
        ("litter-2026-002", "L-2026-002", "sow-grace-56",  "boar-champion-3", "2026-01-20", 10,  9, 1, 0, 5, 4),
        ("litter-2025-089", "L-2025-089", "sow-queen-88",  "boar-ace-8",      "2025-12-15", 14, 13, 0, 1, 7, 6),
    ]
    for lid, litter_id, dam_id, sire_id, farrowed_date, born_total, born_alive, stillborn, mummies, gilts, boar_count in litters:
        fact(**{":ID": lid, ":TYPE": "NODE", ":CREATED": today,
               "P0": "LITTER", "P1": None, "P2": None,
               "P3": {"litter_id": litter_id, "dam_id": dam_id, "sire_id": sire_id,
                      "farrowed_date": farrowed_date, "born_total": born_total,
                      "born_alive": born_alive, "stillborn": stillborn, "mummies": mummies,
                      "gilts": gilts, "boars": boar_count}})
        # Dam -> Litter edge
        fact(**{":ID": f"edge-{dam_id.split('-', 1)[1]}-parent-{lid}", ":TYPE": "EDGE", ":CREATED": today,
               "P0": dam_id, "P1": lid, "P2": "PARENT_OF", "P3": None})
        # Sire -> Litter edge
        fact(**{":ID": f"edge-{sire_id.split('-', 1)[1]}-parent-{lid}", ":TYPE": "EDGE", ":CREATED": today,
               "P0": sire_id, "P1": lid, "P2": "PARENT_OF", "P3": None})

    # -- Breeding group nodes ----------------------------------------------
    groups = [
        ("bg-january-2026",  "January 2026 Batch",
         ["sow-lady-42", "sow-duchess-7", "sow-daisy-15", "sow-ruby-22", "sow-ivy-77"],
         "MATRIX_PG600"),
        ("bg-february-2026", "February 2026 Batch",
         ["sow-bella-19", "sow-pearl-61", "sow-luna-90"],
         "NATURAL"),
    ]
    for gid, name, members, protocol in groups:
        fact(**{":ID": gid, ":TYPE": "NODE", ":CREATED": today,
               "P0": "BREEDING_GROUP", "P1": None, "P2": None,
               "P3": {"name": name, "protocol": protocol, "member_count": len(members)}})
        for member_id in members:
            fact(**{":ID": f"edge-{member_id.split('-', 1)[1]}-in-{gid}", ":TYPE": "EDGE", ":CREATED": today,
                   "P0": member_id, "P1": gid, "P2": "MEMBER_OF", "P3": None})

    # -- Metrics -----------------------------------------------------------
    metrics = [
        ("metric-herd-size",            "operation-trogdon-showpigs", "NUMBER", "Active Herd Size",               {"current": 85, "unit": "head"}),
        ("metric-sows-bred",            "operation-trogdon-showpigs", "NUMBER", "Sows Currently Bred",            {"current": 7, "unit": "count"}),
        ("metric-sows-gestating",       "operation-trogdon-showpigs", "NUMBER", "Sows Gestating",                 {"current": 3, "unit": "count"}),
        ("metric-sows-open",            "operation-trogdon-showpigs", "NUMBER", "Sows Open",                      {"current": 2, "unit": "count"}),
        ("metric-due-this-week",        "operation-trogdon-showpigs", "NUMBER", "Due This Week",                  {"current": 1, "unit": "count"}),
        ("metric-due-next-week",        "operation-trogdon-showpigs", "NUMBER", "Due Next Week",                  {"current": 2, "unit": "count"}),
        ("metric-avg-litter-size",      "operation-trogdon-showpigs", "NUMBER", "Avg Litter Size (Born Alive)",   {"current": 11.0, "unit": "piglets"}),
        ("metric-avg-born-total",       "operation-trogdon-showpigs", "NUMBER", "Avg Born Total",                 {"current": 12.0, "unit": "piglets"}),
        ("metric-stillborn-rate",       "operation-trogdon-showpigs", "NUMBER", "Stillborn Rate",                 {"current": 5.6, "unit": "percent"}),
        ("metric-preweaning-mortality", "operation-trogdon-showpigs", "NUMBER", "Pre-Weaning Mortality",          {"current": 8.2, "unit": "percent"}),
        ("metric-conception-rate",      "operation-trogdon-showpigs", "NUMBER", "Conception Rate (30-day)",       {"current": 87.5, "unit": "percent"}),
        ("metric-farrowing-rate",       "operation-trogdon-showpigs", "NUMBER", "Farrowing Rate",                 {"current": 82.0, "unit": "percent"}),
        ("metric-pigs-weaned-per-sow",  "operation-trogdon-showpigs", "NUMBER", "Pigs Weaned Per Sow Per Year",  {"current": 22.4, "unit": "piglets"}),
        ("metric-feed-conversion",      "operation-trogdon-showpigs", "NUMBER", "Feed Conversion Ratio",          {"current": 2.8, "unit": "ratio"}),
        ("metric-gestation-length-avg", "operation-trogdon-showpigs", "NUMBER", "Avg Gestation Length",           {"current": 114.2, "unit": "days"}),
        ("metric-piglets-sold-mtd",     "operation-trogdon-showpigs", "NUMBER", "Piglets Sold MTD",               {"current": 18, "unit": "count"}),
        ("metric-revenue-mtd",          "operation-trogdon-showpigs", "NUMBER", "Revenue MTD",                    {"current": 14400, "unit": "USD"}),
        ("metric-avg-sale-price",       "operation-trogdon-showpigs", "NUMBER", "Avg Sale Price",                 {"current": 800, "unit": "USD"}),
    ]
    for mid, target, vtype, label, constraints in metrics:
        fact(**{":ID": mid, ":TYPE": "METRIC", ":CREATED": today,
               "P0": target, "P1": vtype, "P2": label, "P3": constraints})

    # -- Signals (recent activity) -----------------------------------------
    signals = [
        ("sig-001", "sow-bella-19",            "breeding_confirmation", None,
         "Bella 19 confirmed bred -- ultrasound positive, 35 days post-service.", -1),
        ("sig-002", "sow-rosie-33",            "farrowing_event",       None,
         "Rosie 33 farrowed: 12 total, 11 alive, 1 stillborn. Sire: Thunder.", -3),
        ("sig-003", "sow-ivy-77",              "heat_detected",         None,
         "Ivy 77 showing heat signs -- standing reflex positive, appetite reduced.", -5),
        ("sig-004", "sow-ivy-77",              "breeding_event",        None,
         "Ivy 77 bred to Champion (Hampshire). Natural service, good cover.", -4),
        ("sig-005", "bg-january-2026",         "protocol_started",      None,
         "January 2026 breeding group started Matrix+PG600 protocol. 5 sows enrolled.", -8),
        ("sig-006", "sow-lady-42",             "weight_check",          None,
         "Lady 42 weight check: 485 lbs. Condition score 3.5/5. On target.", -2),
        ("sig-007", "litter-2026-001",         "piglet_sale",           None,
         "Sold 3 gilts from L-2026-001 to buyer in Gastonia. $850 each.", -6),
        ("sig-008", "sow-pearl-61",            "vaccination",           None,
         "Pearl 61 received FarrowSure Gold B at day 93 of gestation.", -1),
        ("sig-009", "sow-queen-88",            "heat_cycle_check",      None,
         "Queen 88 heat cycle day 19 -- no signs yet. Continue monitoring.", -2),
        ("sig-010", "operation-trogdon-showpigs", "feed_delivery",      None,
         "Feed delivery: 2 tons Purina Sow & Pig Complete. Bin at 85%.", -4),
        ("sig-011", "boar-thunder-1",          "semen_collection",      None,
         "Thunder semen collected -- motility 88%, morphology good. Stored 4 doses.", -7),
        ("sig-012", "sow-daisy-15",            "ultrasound",            None,
         "Daisy 15 ultrasound at day 28 -- positive for pregnancy. 8+ embryos visible.", -3),
    ]
    for sid, target, signal_type, value, description, day_offset in signals:
        d = now + timedelta(days=day_offset)
        created = f"DATE:{d.month}-{d.day}-{d.year}"
        fact(**{":ID": sid, ":TYPE": "SIGNAL", ":CREATED": created,
               "P0": target, "P1": signal_type, "P2": value,
               "P3": {"description": description, "ts": (now + timedelta(days=day_offset)).isoformat()}})

    # -- Protocols ---------------------------------------------------------
    protocols = [
        ("proto-gestation-114", "Gestation Protocol (114-day)",
         "Track gestation from breeding to farrowing. Day 0: breeding. Day 21: confirm bred. Day 90: move to farrowing. Day 110: watch for signs. Day 114: expected farrowing.",
         "active", {"duration": 114, "checkpoints": [21, 90, 110, 114]}),
        ("proto-heat-cycle-21", "Heat Cycle Detection (21-day)",
         "Monitor for heat signs on days 18-21 of cycle. Check standing reflex, vulva swelling, appetite changes, discharge.",
         "active", {"duration": 21, "detection_window": [18, 21]}),
        ("proto-matrix-pg600", "Matrix + PG600 Synchronization",
         "Day 0-13: Matrix feeding (daily oral supplement). Day 14: stop Matrix. Day 15: PG600 injection. Day 18-25: heat detection window.",
         "active", {"duration": 25, "matrix_days": [0, 13], "pg600_day": 15, "heat_window": [18, 25]}),
        ("proto-farrowing-prep", "Farrowing Preparation",
         "Day 110: move to farrowing crate. Clean and disinfect. Heat lamp ready. Day 112: reduce feed 25%. Day 113: watch for nesting behavior.",
         "active", {"start_day": 110, "feed_reduction_day": 112}),
        ("proto-piglet-processing", "Piglet Processing (Day 1-3)",
         "Day 1: clip needle teeth, dock tails, iron injection. Day 2: ear notch. Day 3: weigh and record. Males: castrate by day 5 if not kept intact.",
         "active", {"processing_window": [1, 3], "castration_deadline": 5}),
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

    # -- Query -------------------------------------------------------------

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

    # -- Mutation ----------------------------------------------------------

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

    # -- Summaries for system prompt (swine-specific) ----------------------

    def herd_summary(self):
        """Sow counts by status."""
        status_counts = {}
        for s in self.get_nodes("SOW"):
            st = (s.get("P3") or {}).get("status", "unknown")
            status_counts[st] = status_counts.get(st, 0) + 1
        lines = []
        for st in ["bred", "gestating", "farrowed", "lactating", "open"]:
            if st in status_counts:
                lines.append(f"  - {st.capitalize()}: {status_counts[st]}")
        total = sum(status_counts.values())
        lines.insert(0, f"  Total sows: {total}")
        return "\n".join(lines)

    def upcoming_farrowings(self):
        """Sows due in next 14 days with dates."""
        lines = []
        today = datetime.now().date()
        cutoff = today + timedelta(days=14)
        sows_due = []
        for s in self.get_nodes("SOW"):
            p3 = s.get("P3") or {}
            due = p3.get("due_date")
            if due:
                try:
                    due_date = datetime.strptime(due, "%Y-%m-%d").date()
                    if due_date <= cutoff:
                        sows_due.append((due_date, p3.get("name", s[":ID"]), s[":ID"], p3.get("status", "")))
                except ValueError:
                    pass
        sows_due.sort(key=lambda x: x[0])
        if not sows_due:
            return "  No sows due in the next 14 days."
        for due_date, name, sid, status in sows_due:
            days_until = (due_date - today).days
            if days_until < 0:
                label = f"OVERDUE by {abs(days_until)} day{'s' if abs(days_until) != 1 else ''}"
            elif days_until == 0:
                label = "DUE TODAY"
            else:
                label = f"in {days_until} day{'s' if days_until != 1 else ''}"
            lines.append(f"  - {name} [{sid}] — due {due_date.strftime('%Y-%m-%d')} ({label})")
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

    def breeding_group_summary(self):
        lines = []
        for g in self.get_nodes("BREEDING_GROUP"):
            p3 = g.get("P3") or {}
            lines.append(f"  - {p3.get('name', g[':ID'])} [{g[':ID']}] — {p3.get('member_count', '?')} sows, protocol: {p3.get('protocol', '?')}")
        return "\n".join(lines)

    def sow_listing(self):
        lines = []
        for s in self.get_nodes("SOW"):
            p3 = s.get("P3") or {}
            due_str = f", due {p3['due_date']}" if p3.get("due_date") else ""
            lines.append(f"  - {p3.get('name', s[':ID'])} [{s[':ID']}] — {p3.get('breed', '?')}, {p3.get('status', '?')}{due_str}")
        return "\n".join(lines)

    def boar_listing(self):
        lines = []
        for b in self.get_nodes("BOAR"):
            p3 = b.get("P3") or {}
            lines.append(f"  - {p3.get('name', b[':ID'])} [{b[':ID']}] — {p3.get('breed', '?')}, {p3.get('status', '?')}, {p3.get('litter_count', '?')} litters")
        return "\n".join(lines)

    def litter_summary(self):
        lines = []
        for lit in self.get_nodes("LITTER"):
            p3 = lit.get("P3") or {}
            dam = self.get_fact(p3.get("dam_id", ""))
            sire = self.get_fact(p3.get("sire_id", ""))
            dam_name = (dam.get("P3") or {}).get("name", p3.get("dam_id", "?")) if dam else p3.get("dam_id", "?")
            sire_name = (sire.get("P3") or {}).get("name", p3.get("sire_id", "?")) if sire else p3.get("sire_id", "?")
            lines.append(
                f"  - {p3.get('litter_id', lit[':ID'])} [{lit[':ID']}] — "
                f"Dam: {dam_name}, Sire: {sire_name}, "
                f"Farrowed: {p3.get('farrowed_date', '?')}, "
                f"Born: {p3.get('born_total', '?')} total / {p3.get('born_alive', '?')} alive / "
                f"{p3.get('stillborn', 0)} SB / {p3.get('mummies', 0)} mum, "
                f"Sex: {p3.get('gilts', '?')}G {p3.get('boars', '?')}B"
            )
        return "\n".join(lines)

    def metrics_summary(self):
        lines = []
        for m in self.get_metrics("operation-trogdon-showpigs"):
            p3 = m.get("P3") or {}
            label = m.get("P2", m[":ID"])
            current = p3.get("current", "N/A")
            unit = p3.get("unit", "")
            lines.append(f"  - {label}: {current} {unit}")
        return "\n".join(lines)


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

    return f"""You are Charlotte, an intelligent herd management agent powered by the Charlotte substrate.
You manage Trogdon Showpigs, a competitive show pig operation in Shelby, NC (85 head, est. 2014).
Owner: Todd Trogdon.

Today is {dow}, {date_str}. Current time: {time_str}.

Your personality:
- Knowledgeable -- you understand swine genetics, gestation, and show pig management
- Data-driven -- cite specific numbers, dates, and metrics
- Proactive -- flag upcoming due dates, overdue tasks, protocol steps
- Practical -- farmers are busy, keep it concise and actionable
- You speak like a trusted herd manager who knows every sow by name

Herd status:
{substrate.herd_summary()}

Upcoming farrowings:
{substrate.upcoming_farrowings()}

Operation metrics:
{substrate.metrics_summary()}

Recent activity (last 10 signals):
{substrate.recent_signals_summary(10)}

Active protocols:
{substrate.protocols_summary()}

Breeding groups:
{substrate.breeding_group_summary()}

Sow roster:
{substrate.sow_listing()}

Boar roster:
{substrate.boar_listing()}

Recent litters:
{substrate.litter_summary()}

You can execute these actions by including action tags in your response:
- [ACTION:record_breeding:{{"sow_id":"...","boar_id":"...","method":"natural|ai","date":"..."}}] -- record a breeding event
- [ACTION:record_farrowing:{{"sow_id":"...","born_alive":N,"stillborn":N,"mummies":N,"gilts":N,"boars":N}}] -- record a farrowing
- [ACTION:record_heat:{{"sow_id":"...","signs":"..."}}] -- record heat detection
- [ACTION:record_weight:{{"sow_id":"...","weight":N,"condition_score":N}}] -- record weight/condition
- [ACTION:record_sale:{{"litter_id":"...","count":N,"price_each":N,"buyer":"..."}}] -- record a piglet sale
- [ACTION:start_protocol:{{"group_id":"...","protocol":"..."}}] -- start a protocol on a breeding group

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

    if action_type == "record_breeding":
        sow_id = params.get("sow_id", "")
        boar_id = params.get("boar_id", "")
        method = params.get("method", "natural")
        date = params.get("date", datetime.now().strftime("%Y-%m-%d"))
        sow = substrate.get_fact(sow_id)
        boar = substrate.get_fact(boar_id)
        if sow:
            sow_name = (sow.get("P3") or {}).get("name", sow_id)
            boar_name = (boar.get("P3") or {}).get("name", boar_id) if boar else boar_id
            # Update sow status
            substrate.update_node(sow_id, {"status": "bred", "due_date": (datetime.strptime(date, "%Y-%m-%d") + timedelta(days=114)).strftime("%Y-%m-%d")})
            # Record signal
            sig = substrate.add_signal(
                sow_id, "breeding_event",
                {"boar_id": boar_id, "method": method, "date": date},
                f"{sow_name} bred to {boar_name} ({method} service) on {date}."
            )
            # Add breeding edge
            edge_id = f"edge-breeding-{uuid.uuid4().hex[:8]}"
            substrate.add_edge(edge_id, boar_id, sow_id, "BRED_TO")
            result["success"] = True
            result["detail"] = f"{sow_name} bred to {boar_name} ({method}), due {(datetime.strptime(date, '%Y-%m-%d') + timedelta(days=114)).strftime('%Y-%m-%d')}"
            result["signal"] = sig
        else:
            result["detail"] = f"Sow {sow_id} not found"

    elif action_type == "record_farrowing":
        sow_id = params.get("sow_id", "")
        born_alive = params.get("born_alive", 0)
        stillborn = params.get("stillborn", 0)
        mummies = params.get("mummies", 0)
        gilts = params.get("gilts", 0)
        boar_count = params.get("boars", 0)
        born_total = born_alive + stillborn + mummies
        sow = substrate.get_fact(sow_id)
        if sow:
            sow_name = (sow.get("P3") or {}).get("name", sow_id)
            # Update sow status
            substrate.update_node(sow_id, {"status": "farrowed"})
            # Remove due_date
            if isinstance(sow.get("P3"), dict) and "due_date" in sow["P3"]:
                del sow["P3"]["due_date"]
            # Find sire from breeding edges
            breeding_edges = substrate.get_edges(target=sow_id, edge_type="BRED_TO")
            sire_id = breeding_edges[-1].get("P0", "unknown") if breeding_edges else "unknown"
            # Create litter node
            litter_num = len(substrate.get_nodes("LITTER")) + 1
            lid = f"litter-{datetime.now().year}-{litter_num:03d}"
            litter_id_str = f"L-{datetime.now().year}-{litter_num:03d}"
            farrowed_date = datetime.now().strftime("%Y-%m-%d")
            substrate.add_node(lid, "LITTER", {
                "litter_id": litter_id_str, "dam_id": sow_id, "sire_id": sire_id,
                "farrowed_date": farrowed_date, "born_total": born_total,
                "born_alive": born_alive, "stillborn": stillborn, "mummies": mummies,
                "gilts": gilts, "boars": boar_count
            })
            # Parent edges
            substrate.add_edge(f"edge-dam-{lid}", sow_id, lid, "PARENT_OF")
            if sire_id != "unknown":
                substrate.add_edge(f"edge-sire-{lid}", sire_id, lid, "PARENT_OF")
            # Signal
            sig = substrate.add_signal(
                sow_id, "farrowing_event",
                {"born_alive": born_alive, "stillborn": stillborn, "mummies": mummies, "gilts": gilts, "boars": boar_count},
                f"{sow_name} farrowed: {born_total} total, {born_alive} alive, {stillborn} SB, {mummies} mum. {gilts}G {boar_count}B."
            )
            result["success"] = True
            result["detail"] = f"{sow_name} farrowed {litter_id_str}: {born_alive} alive, {stillborn} SB"
            result["signal"] = sig
            result["litter_id"] = lid
        else:
            result["detail"] = f"Sow {sow_id} not found"

    elif action_type == "record_heat":
        sow_id = params.get("sow_id", "")
        signs = params.get("signs", "standing reflex positive")
        sow = substrate.get_fact(sow_id)
        if sow:
            sow_name = (sow.get("P3") or {}).get("name", sow_id)
            sig = substrate.add_signal(
                sow_id, "heat_detected",
                {"signs": signs},
                f"{sow_name} heat detected: {signs}"
            )
            result["success"] = True
            result["detail"] = f"Heat recorded for {sow_name}: {signs}"
            result["signal"] = sig
        else:
            result["detail"] = f"Sow {sow_id} not found"

    elif action_type == "record_weight":
        sow_id = params.get("sow_id", "")
        weight = params.get("weight")
        condition_score = params.get("condition_score")
        sow = substrate.get_fact(sow_id)
        if sow:
            sow_name = (sow.get("P3") or {}).get("name", sow_id)
            updates = {}
            if weight is not None:
                updates["last_weight"] = weight
            if condition_score is not None:
                updates["condition_score"] = condition_score
            if updates:
                substrate.update_node(sow_id, updates)
            sig = substrate.add_signal(
                sow_id, "weight_check",
                {"weight": weight, "condition_score": condition_score},
                f"{sow_name} weight: {weight} lbs, condition score: {condition_score}/5."
            )
            result["success"] = True
            result["detail"] = f"Weight recorded for {sow_name}: {weight} lbs, CS {condition_score}"
            result["signal"] = sig
        else:
            result["detail"] = f"Sow {sow_id} not found"

    elif action_type == "record_sale":
        litter_id = params.get("litter_id", "")
        count = params.get("count", 0)
        price_each = params.get("price_each", 0)
        buyer = params.get("buyer", "")
        total = count * price_each
        litter = substrate.get_fact(litter_id)
        litter_label = (litter.get("P3") or {}).get("litter_id", litter_id) if litter else litter_id
        sig = substrate.add_signal(
            litter_id or "operation-trogdon-showpigs", "piglet_sale",
            {"count": count, "price_each": price_each, "total": total, "buyer": buyer},
            f"Sold {count} piglets from {litter_label} to {buyer}. ${price_each} each, ${total} total."
        )
        # Update revenue metric
        rev_metric = substrate.get_fact("metric-revenue-mtd")
        if rev_metric and isinstance(rev_metric.get("P3"), dict):
            old_rev = rev_metric["P3"].get("current", 0)
            rev_metric["P3"]["current"] = old_rev + total
        # Update piglets sold metric
        sold_metric = substrate.get_fact("metric-piglets-sold-mtd")
        if sold_metric and isinstance(sold_metric.get("P3"), dict):
            old_sold = sold_metric["P3"].get("current", 0)
            sold_metric["P3"]["current"] = old_sold + count
        result["success"] = True
        result["detail"] = f"Sale recorded: {count} piglets from {litter_label} to {buyer} (${total})"
        result["signal"] = sig

    elif action_type == "start_protocol":
        group_id = params.get("group_id", "")
        protocol = params.get("protocol", "")
        group = substrate.get_fact(group_id)
        if group:
            group_name = (group.get("P3") or {}).get("name", group_id)
            member_count = (group.get("P3") or {}).get("member_count", "?")
            substrate.update_node(group_id, {"protocol": protocol})
            sig = substrate.add_signal(
                group_id, "protocol_started",
                {"protocol": protocol},
                f"{group_name} started {protocol} protocol. {member_count} sows enrolled."
            )
            result["success"] = True
            result["detail"] = f"{protocol} protocol started for {group_name} ({member_count} sows)"
            result["signal"] = sig
        else:
            result["detail"] = f"Group {group_id} not found"

    else:
        result["detail"] = f"Unknown action type: {action_type}"

    return result


# ---------------------------------------------------------------------------
# Fallback Local Inference (no API key)
# ---------------------------------------------------------------------------

def fallback_response(message, substrate):
    """Pattern-match common queries when no API key is set."""
    msg = message.lower().strip()

    # Due / farrowing / upcoming
    if any(w in msg for w in ["due", "farrowing", "upcoming", "coming up"]):
        return (f"Upcoming farrowings:\n\n"
                f"{substrate.upcoming_farrowings()}\n\n"
                f"Make sure farrowing crates are prepped per protocol -- move sows in at day 110, "
                f"reduce feed 25% at day 112, and have heat lamps ready.")

    # Sows / herd / status
    if any(w in msg for w in ["sows", "herd", "status"]):
        return (f"Herd status:\n\n"
                f"{substrate.herd_summary()}\n\n"
                f"Full sow roster:\n{substrate.sow_listing()}")

    # Breed / breeding
    if any(w in msg for w in ["breed", "breeding"]):
        return (f"Breeding groups:\n\n"
                f"{substrate.breeding_group_summary()}\n\n"
                f"Boar roster:\n{substrate.boar_listing()}\n\n"
                f"To record a breeding, tell me which sow, which boar, and whether it was natural service or AI.")

    # Litter / born / piglet
    if any(w in msg for w in ["litter", "born", "piglet"]):
        return (f"Recent litters:\n\n"
                f"{substrate.litter_summary()}\n\n"
                f"Avg litter size (born alive): 11.0 piglets. Avg born total: 12.0. "
                f"Stillborn rate: 5.6%.")

    # Heat / cycle
    if any(w in msg for w in ["heat", "cycle"]):
        open_sows = [s for s in substrate.get_nodes("SOW") if (s.get("P3") or {}).get("status") == "open"]
        lines = []
        for s in open_sows:
            p3 = s.get("P3") or {}
            lines.append(f"  - {p3.get('name', s[':ID'])} [{s[':ID']}] -- open, monitor for heat signs")
        sow_list = "\n".join(lines) if lines else "  No open sows currently."
        return (f"Open sows to monitor for heat:\n\n"
                f"{sow_list}\n\n"
                f"Heat detection protocol: check days 18-21 of cycle. Look for standing reflex, "
                f"vulva swelling, appetite changes, and discharge.")

    # Protocol / matrix / pg600
    if any(w in msg for w in ["protocol", "matrix", "pg600"]):
        return f"Active protocols:\n\n{substrate.protocols_summary()}"

    # Boar / sire
    if any(w in msg for w in ["boar", "sire"]):
        return f"Boar roster:\n\n{substrate.boar_listing()}"

    # Weight / condition
    if any(w in msg for w in ["weight", "condition"]):
        return ("To record a weight check, tell me which sow, the weight in lbs, and condition score (1-5 scale).\n\n"
                "Target condition scores:\n"
                "  - Breeding: 3.0-3.5\n"
                "  - Mid-gestation: 3.0-3.5\n"
                "  - Late gestation: 3.5-4.0\n"
                "  - Lactation: allow some loss, maintain > 2.5")

    # Sale / sold / revenue
    if any(w in msg for w in ["sale", "sold", "revenue", "money", "income"]):
        rev = substrate.get_fact("metric-revenue-mtd")
        sold = substrate.get_fact("metric-piglets-sold-mtd")
        avg_price = substrate.get_fact("metric-avg-sale-price")
        return (f"Sales snapshot (month to date):\n\n"
                f"**Piglets sold:** {(sold.get('P3') or {}).get('current', '?')}\n"
                f"**Revenue MTD:** ${(rev.get('P3') or {}).get('current', '?'):,}\n"
                f"**Avg sale price:** ${(avg_price.get('P3') or {}).get('current', '?')}\n\n"
                f"To record a sale, tell me: litter ID, number of piglets, price each, and buyer name.")

    # Feed / nutrition
    if any(w in msg for w in ["feed", "nutrition"]):
        fc = substrate.get_fact("metric-feed-conversion")
        return (f"Feed info:\n\n"
                f"**Feed conversion ratio:** {(fc.get('P3') or {}).get('current', '?')}\n"
                f"**Current feed:** Purina Sow & Pig Complete\n"
                f"**Last delivery:** 2 tons, bin at 85%\n\n"
                f"Gestation sows: 4-5 lbs/day. Lactating sows: ad lib (target 12-15 lbs/day). "
                f"Reduce feed 25% at day 112 pre-farrowing.")

    # Metrics / dashboard / overview
    if any(w in msg for w in ["metric", "dashboard", "overview", "kpi"]):
        return (f"Trogdon Showpigs Dashboard:\n\n"
                f"{substrate.metrics_summary()}\n\n"
                f"Herd status:\n{substrate.herd_summary()}\n\n"
                f"Upcoming farrowings:\n{substrate.upcoming_farrowings()}")

    # Help / what can you do
    if any(w in msg for w in ["help", "what can you", "capabilities", "what do you"]):
        return ("I'm Charlotte, your herd management agent. Here's what I can do:\n\n"
                "- **Herd status** -- \"How are the sows?\"\n"
                "- **Upcoming farrowings** -- \"Who's due this week?\"\n"
                "- **Record breeding** -- \"Bred Stella 44 to Thunder, natural service\"\n"
                "- **Record farrowing** -- \"Pearl 61 farrowed, 13 born alive\"\n"
                "- **Heat detection** -- \"Queen 88 is showing heat\"\n"
                "- **Weight/condition** -- \"Lady 42 weighs 490, CS 3.5\"\n"
                "- **Sales** -- \"Sold 4 gilts from L-2026-001 at $900 each\"\n"
                "- **Litter stats** -- \"Show me recent litters\"\n"
                "- **Boar info** -- \"How's Thunder doing?\"\n"
                "- **Protocols** -- \"What protocols are active?\"\n"
                "- **Dashboard** -- \"Give me the full overview\"\n\n"
                "Just ask me anything about Trogdon Showpigs.")

    # Default
    return ("I'm Charlotte, managing Trogdon Showpigs. I can help with herd status, "
            "farrowings, breeding records, litter stats, sales, and more. "
            "Try: \"Who's due this week?\" or \"How are the sows?\"")


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
    """Handles all HTTP requests for the Charlotte herd agent."""

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
            node_id = params.get("node_id", "operation-trogdon-showpigs")
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
        for m in self.substrate.get_metrics("operation-trogdon-showpigs"):
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
        f"\n  Charlotte Herd Agent v1.0\n"
        f"  Operation: Trogdon Showpigs, Shelby NC\n"
        f"  Substrate: {fact_count} facts loaded\n"
        f"  API: {api_status}\n"
        f"  http://localhost:{PORT}\n"
    )
    print(banner)

    if not API_KEY:
        print("\n  \033[33mWARNING: ANTHROPIC_API_KEY not set -- running in fallback mode.\033[0m")
        print("    Set it with: export ANTHROPIC_API_KEY=sk-ant-...")
        print("    Charlotte will use pattern-matching for responses.\n")
    else:
        print(f"\n  Using model: {MODEL}\n")

    server = HTTPServer(("0.0.0.0", PORT), CharlotteHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n\n  Charlotte shutting down. Goodnight, Trogdon Showpigs.\n")
        server.server_close()


if __name__ == "__main__":
    main()
