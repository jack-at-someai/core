"""
krf.py — KRF fact generator for the Charlotte demo server.

Generates Knowledge Representation Format facts in Charlotte's
S-expression notation. Converts face detection / emotion detection
results into structured facts for WebSocket broadcast.

Five primitives:
    NODE     — identity (person, object, location)
    EDGE     — relationship (directed, typed, temporal)
    METRIC   — quantitative signal line (engagement, attention)
    SIGNAL   — timestamped observation on a metric line
    PROTOCOL — rule/expectation (divergence detection)

All facts are scoped to CharlotteDemoMt and use the colon-register
grammar from the kernel type system:
    :field   — framework field (immutable)
    ::attr   — attribute (mutable, domain-specific)
    :::rel   — relationship (resolved to EDGE)
"""

import time
import json
import re


# ---------------------------------------------------------------------------
# Microtheory — scopes every fact emitted by the demo server
# ---------------------------------------------------------------------------

MICROTHEORY = "CharlotteDemoMt"


# ---------------------------------------------------------------------------
# Fact generators
# ---------------------------------------------------------------------------

def make_node(node_id, node_type, attributes=None):
    """Create a NODE fact.

    Returns a list of KRF strings: the isa assertion followed by one
    hasAttribute assertion per key in *attributes*.

    Example output:
        (in-microtheory CharlotteDemoMt)
        (isa Jim Person)
        (hasAttribute Jim :role "CEO")
        (hasAttribute Jim :company "ISG")

    Args:
        node_id:    Unique identifier for the node (e.g. "Jim").
        node_type:  Collection the node belongs to (e.g. "Person").
        attributes: Optional dict of :key -> value pairs.

    Returns:
        List[str] of KRF S-expressions.
    """
    facts = [
        f"(in-microtheory {MICROTHEORY})",
        f"(isa {node_id} {node_type})",
    ]
    if attributes:
        for key, value in attributes.items():
            k = key if key.startswith(":") else f":{key}"
            v = f'"{value}"' if isinstance(value, str) else str(value)
            facts.append(f"(hasAttribute {node_id} {k} {v})")
    return facts


def make_edge(from_id, to_id, edge_type, timestamp=None):
    """Create an EDGE fact.

    Example output:
        (in-microtheory CharlotteDemoMt)
        (edge Jim Jack :FACING_TOWARD 1708621921.0)

    Args:
        from_id:   Source node identifier.
        to_id:     Target node identifier.
        edge_type: Relationship label (e.g. ":FACING_TOWARD").
        timestamp: Epoch float. Defaults to now.

    Returns:
        List[str] of KRF S-expressions.
    """
    ts = timestamp if timestamp is not None else time.time()
    et = edge_type if edge_type.startswith(":") else f":{edge_type}"
    return [
        f"(in-microtheory {MICROTHEORY})",
        f"(edge {from_id} {to_id} {et} {ts})",
    ]


def make_metric(node_id, metric_name, value, timestamp=None):
    """Create a METRIC + SIGNAL pair.

    A metric assertion declares the current value on a signal line.
    The companion signal pins that value to a specific time.

    Example output:
        (in-microtheory CharlotteDemoMt)
        (metric Jim :ENGAGEMENT 0.87)
        (signal Jim :ENGAGEMENT 0.87 1708621921.0)

    Args:
        node_id:     Node the metric is attached to.
        metric_name: Signal line name (e.g. ":ENGAGEMENT").
        value:       Numeric value (float or int).
        timestamp:   Epoch float. Defaults to now.

    Returns:
        List[str] of KRF S-expressions.
    """
    ts = timestamp if timestamp is not None else time.time()
    mn = metric_name if metric_name.startswith(":") else f":{metric_name}"
    return [
        f"(in-microtheory {MICROTHEORY})",
        f"(metric {node_id} {mn} {value})",
        f"(signal {node_id} {mn} {value} {ts})",
    ]


def make_signal(node_id, signal_type, value, timestamp=None, confidence=None):
    """Create a SIGNAL fact.

    Signals carry an optional confidence tag for probabilistic
    observations (e.g. emotion classification from FER).

    Example output:
        (in-microtheory CharlotteDemoMt)
        (signal Jim :EMOTION:HAPPY 0.82 1708621921.0 :confidence 0.91)

    Args:
        node_id:     Node the signal is attached to.
        signal_type: Signal label (e.g. ":EMOTION:HAPPY").
        value:       Numeric value (float or int).
        timestamp:   Epoch float. Defaults to now.
        confidence:  Optional confidence score (0.0 - 1.0).

    Returns:
        List[str] of KRF S-expressions.
    """
    ts = timestamp if timestamp is not None else time.time()
    st = signal_type if signal_type.startswith(":") else f":{signal_type}"
    tail = f" :confidence {confidence}" if confidence is not None else ""
    return [
        f"(in-microtheory {MICROTHEORY})",
        f"(signal {node_id} {st} {value} {ts}{tail})",
    ]


def make_protocol_check(phase_id, metric_name, expected, actual, timestamp=None):
    """Create a PROTOCOL divergence fact.

    Compares a protocol's expected metric value against an observed
    actual value. Divergence triggers downstream reasoning.

    Example output:
        (in-microtheory CharlotteDemoMt)
        (protocol-divergence "charlotte_intro" :ENGAGEMENT
            :expected 0.80 :actual 0.72 1708621921.0)

    Args:
        phase_id:    Meeting phase identifier (e.g. "charlotte_intro").
        metric_name: Metric being evaluated (e.g. ":ENGAGEMENT").
        expected:    Protocol-specified expected value.
        actual:      Observed actual value.
        timestamp:   Epoch float. Defaults to now.

    Returns:
        List[str] of KRF S-expressions.
    """
    ts = timestamp if timestamp is not None else time.time()
    mn = metric_name if metric_name.startswith(":") else f":{metric_name}"
    return [
        f"(in-microtheory {MICROTHEORY})",
        f'(protocol-divergence "{phase_id}" {mn} :expected {expected} :actual {actual} {ts})',
    ]


# ---------------------------------------------------------------------------
# KRF -> JSON conversion
# ---------------------------------------------------------------------------

# Map predicate names to primitive types
_PREDICATE_TYPE_MAP = {
    "isa":                  "NODE",
    "hasAttribute":         "NODE",
    "edge":                 "EDGE",
    "metric":               "METRIC",
    "signal":               "SIGNAL",
    "protocol-divergence":  "PROTOCOL",
    "in-microtheory":       None,       # context, not a fact
}


def _parse_sexp(sexp):
    """Minimal S-expression tokenizer.

    Splits a parenthesized expression into its constituent tokens,
    handling quoted strings as single tokens.

    Args:
        sexp: A single S-expression string like '(isa Jim Person)'.

    Returns:
        List[str] of tokens (without outer parens).
    """
    inner = sexp.strip()
    if inner.startswith("(") and inner.endswith(")"):
        inner = inner[1:-1].strip()
    tokens = []
    i = 0
    while i < len(inner):
        if inner[i] == '"':
            j = inner.index('"', i + 1)
            tokens.append(inner[i:j + 1])
            i = j + 1
        elif inner[i] in (' ', '\t', '\n'):
            i += 1
        else:
            j = i
            while j < len(inner) and inner[j] not in (' ', '\t', '\n', ')'):
                j += 1
            tokens.append(inner[i:j])
            i = j
    return tokens


def _build_data(predicate, tokens):
    """Build the 'data' dict for a parsed fact based on its predicate type."""
    if predicate == "isa" and len(tokens) >= 3:
        return {"id": tokens[1], "type": tokens[2]}
    if predicate == "hasAttribute" and len(tokens) >= 4:
        return {"id": tokens[1], "attribute": tokens[2], "value": tokens[3].strip('"')}
    if predicate == "edge" and len(tokens) >= 5:
        return {"from": tokens[1], "to": tokens[2], "edge_type": tokens[3], "timestamp": _to_num(tokens[4])}
    if predicate == "metric" and len(tokens) >= 4:
        return {"id": tokens[1], "metric": tokens[2], "value": _to_num(tokens[3])}
    if predicate == "signal":
        data = {"id": tokens[1], "signal_type": tokens[2], "value": _to_num(tokens[3])}
        if len(tokens) >= 5:
            data["timestamp"] = _to_num(tokens[4])
        # Parse optional keyword args (:confidence etc.)
        i = 5
        while i + 1 < len(tokens):
            if tokens[i].startswith(":"):
                data[tokens[i][1:]] = _to_num(tokens[i + 1])
                i += 2
            else:
                i += 1
        return data
    if predicate == "protocol-divergence":
        data = {"phase_id": tokens[1].strip('"')}
        data["metric"] = tokens[2]
        # Parse keyword pairs
        i = 3
        while i + 1 < len(tokens):
            if tokens[i] == ":expected":
                data["expected"] = _to_num(tokens[i + 1])
                i += 2
            elif tokens[i] == ":actual":
                data["actual"] = _to_num(tokens[i + 1])
                i += 2
            else:
                # Last bare token is timestamp
                data["timestamp"] = _to_num(tokens[i])
                i += 1
        return data
    return {"raw_tokens": tokens}


def _to_num(s):
    """Try to convert a string to a float, fall back to the string itself."""
    try:
        return float(s)
    except (ValueError, TypeError):
        return s


def fact_to_json(krf_string):
    """Convert a single KRF fact to a JSON-ready dict.

    Args:
        krf_string: A KRF S-expression string.

    Returns:
        dict with keys: type, krf, timestamp, data.
        Returns None for microtheory context lines.

    Example:
        >>> fact_to_json('(signal Jim :EMOTION:HAPPY 0.82 1708621921.0 :confidence 0.91)')
        {
            "type": "SIGNAL",
            "krf": "(signal Jim :EMOTION:HAPPY 0.82 1708621921.0 :confidence 0.91)",
            "timestamp": 1708621921.0,
            "data": {
                "id": "Jim",
                "signal_type": ":EMOTION:HAPPY",
                "value": 0.82,
                "timestamp": 1708621921.0,
                "confidence": 0.91
            }
        }
    """
    tokens = _parse_sexp(krf_string)
    if not tokens:
        return None

    predicate = tokens[0]
    fact_type = _PREDICATE_TYPE_MAP.get(predicate)

    # Skip microtheory context lines
    if fact_type is None:
        return None

    data = _build_data(predicate, tokens)
    ts = data.get("timestamp", time.time())

    return {
        "type": fact_type,
        "krf": krf_string,
        "timestamp": ts,
        "data": data,
    }


def format_fact_stream(facts_list):
    """Convert a list of KRF strings into a JSON array for WebSocket broadcast.

    Filters out microtheory context lines (in-microtheory) so only
    substantive facts are transmitted.

    Args:
        facts_list: List[str] of KRF S-expressions.

    Returns:
        str — JSON array ready for WebSocket send().

    Example:
        >>> facts = make_signal("Jim", ":EMOTION:HAPPY", 0.82, confidence=0.91)
        >>> print(format_fact_stream(facts))
        [{"type": "SIGNAL", "krf": "(signal Jim ...)", ...}]
    """
    payload = []
    for fact in facts_list:
        converted = fact_to_json(fact)
        if converted is not None:
            payload.append(converted)
    return json.dumps(payload)


# ---------------------------------------------------------------------------
# Convenience: emit a complete frame of facts for one detected face
# ---------------------------------------------------------------------------

def emit_face_frame(person_id, person_name, emotions, engagement,
                    gaze_target=None, phase_id=None, phase_expected=None):
    """Generate all KRF facts for a single face detection frame.

    This is the main entry point called by the detection loop. It
    produces a complete fact bundle for one person in one frame:
    a NODE (if first seen), emotion SIGNALs, an ENGAGEMENT metric,
    an optional gaze EDGE, and optional PROTOCOL divergence.

    Args:
        person_id:      Stable identifier for the person (e.g. "Person_01").
        person_name:    Display name (e.g. "Jim").
        emotions:       Dict of emotion -> confidence (from FER).
                        e.g. {"happy": 0.82, "neutral": 0.12, ...}
        engagement:     Float 0.0-1.0, composite engagement score.
        gaze_target:    Optional person_id this person is looking at.
        phase_id:       Optional current meeting phase id.
        phase_expected: Optional expected engagement for this phase.

    Returns:
        str — JSON array ready for WebSocket broadcast.
    """
    ts = time.time()
    all_facts = []

    # NODE — declare the person
    all_facts.extend(make_node(person_id, "Person", {
        "name": person_name,
    }))

    # SIGNALs — one per detected emotion
    for emotion, confidence in emotions.items():
        all_facts.extend(make_signal(
            person_id,
            f":EMOTION:{emotion.upper()}",
            round(confidence, 4),
            timestamp=ts,
            confidence=round(confidence, 4),
        ))

    # METRIC — engagement score
    all_facts.extend(make_metric(person_id, ":ENGAGEMENT", round(engagement, 4), timestamp=ts))

    # EDGE — gaze direction
    if gaze_target is not None:
        all_facts.extend(make_edge(person_id, gaze_target, ":FACING_TOWARD", timestamp=ts))

    # PROTOCOL — divergence check
    if phase_id is not None and phase_expected is not None:
        all_facts.extend(make_protocol_check(
            phase_id, ":ENGAGEMENT", phase_expected, round(engagement, 4), timestamp=ts
        ))

    return format_fact_stream(all_facts)
