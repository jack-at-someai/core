#!/usr/bin/env python3
"""
JOURNEY Knowledge Graph Builder

Reads observation JSON files from image analysis agents and assembles
a FINN-primitive knowledge graph: NODEs, EDGEs, METRICs, SIGNALs, PROTOCOLs.

Usage:
    python assets/build_knowledge_graph.py
"""

import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ASSETS = Path(__file__).resolve().parent
OUTPUT_JSON = ASSETS.parent / "charlotte" / "docs" / "artifacts" / "JOURNEY_KNOWLEDGE_GRAPH.json"
OUTPUT_MD = ASSETS.parent / "charlotte" / "docs" / "artifacts" / "JOURNEY_KNOWLEDGE_GRAPH.md"


def load_observations():
    """Load and merge all observation segment files."""
    all_obs = []
    for f in sorted(ASSETS.glob("_obs_*.json")):
        with open(f, encoding="utf-8") as fh:
            data = json.load(fh)
            # Normalize short keys to long keys
            for item in data:
                if "f" in item and "filename" not in item:
                    item["filename"] = item.pop("f", "")
                    item["description"] = item.pop("d", "")
                    item["people"] = item.pop("p", [])
                    item["setting"] = item.pop("s", "unknown")
                    item["category"] = item.pop("c", "unknown")
                    item["entities"] = item.pop("e", [])
                    item["mood"] = item.pop("m", "unknown")
                    item["era_guess"] = item.pop("t", "unknown")
            all_obs.extend(data)
        print(f"  Loaded {len(data)} from {f.name}")
    print(f"  Total: {len(all_obs)} observations")
    return all_obs


# ---------------------------------------------------------------------------
# NODE extraction
# ---------------------------------------------------------------------------

_node_counter = 0
_nodes = {}


def add_node(category, label, props=None):
    global _node_counter
    key = f"{category}:{label}"
    if key not in _nodes:
        _node_counter += 1
        _nodes[key] = {
            "id": f"N{_node_counter:04d}",
            "type": "NODE",
            "category": category,
            "label": label,
            "properties": props or {},
            "signal_count": 0,
            "edge_count": 0,
        }
    return _nodes[key]["id"]


def extract_nodes(observations):
    # Core identity nodes
    add_node("PERSON", "Jack Richard", {"role": "founder", "generation": 3})
    add_node("PERSON", "Jim Richard", {"role": "father", "generation": 2})
    add_node("PERSON", "Donald Almquist", {"role": "grandfather", "generation": 1})
    add_node("ORGANIZATION", "LineLeap", {"domain": "human_behavior", "vertex": True})
    add_node("ORGANIZATION", "Sounder", {"domain": "biological_systems", "vertex": True})
    add_node("ORGANIZATION", "ISG", {"domain": "mechanical_systems", "vertex": True})
    add_node("ORGANIZATION", "Prier Violins", {"domain": "cultural_artifacts", "vertex": True})
    add_node("ORGANIZATION", "Charlotte", {"domain": "convergence"})
    add_node("ORGANIZATION", "SomeAI", {"domain": "advisory"})
    add_node("ORGANIZATION", "Serengeti", {"domain": "industrial_acquisitions"})
    add_node("ORGANIZATION", "3SG", {"domain": "strategy"})
    add_node("INSTITUTION", "Rose-Hulman", {"type": "university"})
    add_node("INSTITUTION", "Northwestern", {"type": "university"})
    add_node("INSTITUTION", "General Motors", {"type": "corporation"})
    add_node("CONCEPT", "Temporal Torus")
    add_node("CONCEPT", "Convex Hull")
    add_node("CONCEPT", "FINN Primitives")

    # Platform nodes
    for p in ["Instagram", "Snapchat", "Facebook", "Spotify", "Chrome", "Slack", "Pinterest"]:
        add_node("PLATFORM", p)

    # Life domain nodes
    for d in ["Technology", "Social Life", "Creative Expression", "Exploration",
              "Family & Generational", "Biological Systems", "Mechanical Systems",
              "Cultural Artifacts", "Academic", "Professional"]:
        add_node("DOMAIN", d)

    # Extract unique people from observations
    person_counts = Counter()
    entity_counts = Counter()
    for obs in observations:
        for p in obs.get("people", []):
            pc = p.strip().lower()
            if pc and pc not in ("jack", "jack richard", "unknown_male", "unknown_female",
                                 "group", "none", "unknown", ""):
                person_counts[pc] += 1
        for e in obs.get("entities", []):
            ec = e.strip().lower()
            if len(ec) > 2:
                entity_counts[ec] += 1

    # Add recurring people
    for person, count in person_counts.items():
        if count >= 2:
            add_node("PERSON", person.title(), {"source": "photo_detection", "appearances": count})

    # Add top entities as OBJECT nodes
    for ent, count in entity_counts.most_common(80):
        if count >= 3:
            add_node("OBJECT", ent.title(), {"source": "photo_detection", "occurrences": count})

    return _nodes


# ---------------------------------------------------------------------------
# EDGE extraction
# ---------------------------------------------------------------------------

_edge_counter = 0
_edges = []


def add_edge(from_cat, from_label, to_cat, to_label, edge_type, props=None):
    global _edge_counter
    src_key = f"{from_cat}:{from_label}"
    tgt_key = f"{to_cat}:{to_label}"
    if src_key in _nodes and tgt_key in _nodes:
        _edge_counter += 1
        _edges.append({
            "id": f"E{_edge_counter:04d}",
            "type": "EDGE",
            "source": _nodes[src_key]["id"],
            "target": _nodes[tgt_key]["id"],
            "source_label": from_label,
            "target_label": to_label,
            "label": edge_type,
            "properties": props or {},
        })
        _nodes[src_key]["edge_count"] += 1
        _nodes[tgt_key]["edge_count"] += 1


def extract_edges(observations):
    # Structural/biographical edges
    add_edge("PERSON", "Jack Richard", "PERSON", "Jim Richard", "CHILD_OF")
    add_edge("PERSON", "Jack Richard", "PERSON", "Donald Almquist", "GRANDCHILD_OF")
    add_edge("PERSON", "Jim Richard", "ORGANIZATION", "Serengeti", "FOUNDED")
    add_edge("PERSON", "Donald Almquist", "INSTITUTION", "General Motors", "EXECUTIVE_AT")
    add_edge("PERSON", "Jack Richard", "ORGANIZATION", "LineLeap", "FOUNDED")
    add_edge("PERSON", "Jack Richard", "ORGANIZATION", "Charlotte", "FOUNDED")
    add_edge("PERSON", "Jack Richard", "ORGANIZATION", "SomeAI", "MEMBER_OF")
    add_edge("PERSON", "Jack Richard", "ORGANIZATION", "3SG", "LEADS")
    add_edge("PERSON", "Jack Richard", "INSTITUTION", "Rose-Hulman", "ATTENDED")
    add_edge("PERSON", "Jack Richard", "INSTITUTION", "Northwestern", "ATTENDED")

    # Charlotte validates on each vertex
    add_edge("ORGANIZATION", "Charlotte", "ORGANIZATION", "LineLeap", "VALIDATES_ON")
    add_edge("ORGANIZATION", "Charlotte", "ORGANIZATION", "Sounder", "VALIDATES_ON")
    add_edge("ORGANIZATION", "Charlotte", "ORGANIZATION", "ISG", "VALIDATES_ON")
    add_edge("ORGANIZATION", "Charlotte", "ORGANIZATION", "Prier Violins", "VALIDATES_ON")
    add_edge("ORGANIZATION", "Charlotte", "CONCEPT", "Temporal Torus", "IMPLEMENTS")
    add_edge("ORGANIZATION", "Charlotte", "CONCEPT", "Convex Hull", "IMPLEMENTS")
    add_edge("ORGANIZATION", "Charlotte", "CONCEPT", "FINN Primitives", "IMPLEMENTS")

    # Generational edges
    add_edge("PERSON", "Jim Richard", "PERSON", "Donald Almquist", "SON_IN_LAW_OF")
    add_edge("ORGANIZATION", "Serengeti", "ORGANIZATION", "ISG", "ACQUIRED")

    # Domain associations
    add_edge("PERSON", "Jack Richard", "DOMAIN", "Technology", "PRACTICES")
    add_edge("PERSON", "Jack Richard", "DOMAIN", "Creative Expression", "PRACTICES")
    add_edge("PERSON", "Jack Richard", "DOMAIN", "Exploration", "PRACTICES")
    add_edge("PERSON", "Jack Richard", "DOMAIN", "Social Life", "PRACTICES")
    add_edge("PERSON", "Jack Richard", "DOMAIN", "Family & Generational", "PRACTICES")
    add_edge("PERSON", "Jack Richard", "DOMAIN", "Academic", "PRACTICES")

    # Co-occurrence edges from photo analysis
    jack_cooccur = defaultdict(int)
    for obs in observations:
        people = [p.strip().lower() for p in obs.get("people", [])]
        has_jack = any(p in ("jack", "jack richard") for p in people)
        if has_jack:
            for p in people:
                if p not in ("jack", "jack richard", "unknown_male", "unknown_female",
                             "group", "none", "unknown", ""):
                    jack_cooccur[p.title()] += 1

    for person, count in jack_cooccur.items():
        if count >= 2:
            add_edge("PERSON", "Jack Richard", "PERSON", person, "APPEARS_WITH",
                     {"co_occurrence_count": count})

    return _edges


# ---------------------------------------------------------------------------
# METRIC + SIGNAL extraction
# ---------------------------------------------------------------------------

_metric_counter = 0
_metrics = {}
_signal_counter = 0
_signals = []


def add_metric(name, value_type, description):
    global _metric_counter
    if name not in _metrics:
        _metric_counter += 1
        _metrics[name] = {
            "id": f"M{_metric_counter:04d}",
            "type": "METRIC",
            "name": name,
            "value_type": value_type,
            "description": description,
        }
    return _metrics[name]["id"]


def add_signal(node_key, metric_name, value, era=None, source_file=None):
    global _signal_counter
    if node_key not in _nodes or metric_name not in _metrics:
        return
    _signal_counter += 1
    _signals.append({
        "id": f"S{_signal_counter:05d}",
        "type": "SIGNAL",
        "node": _nodes[node_key]["id"],
        "metric": _metrics[metric_name]["id"],
        "value": value,
        "era": era,
        "source": source_file,
    })
    _nodes[node_key]["signal_count"] += 1


def extract_metrics_and_signals(observations):
    # Define metrics
    add_metric("photo_appearance", "NUMBER", "Number of photos a person appears in")
    add_metric("setting_type", "ENUM", "Type of physical/digital setting observed")
    add_metric("mood_observed", "ENUM", "Perceived mood/tone in photo")
    add_metric("content_category", "ENUM", "Thematic category of image")
    add_metric("life_domain", "ENUM", "Life domain the observation maps to")
    add_metric("era_active", "STRING", "Time era in which entity is observed")
    add_metric("platform_activity", "ENUM", "Social platform where activity captured")
    add_metric("entity_present", "STRING", "Entity/object observed in frame")
    add_metric("visual_complexity", "ENUM", "Simple vs complex visual composition")

    # Category -> domain mapping
    domain_map = {
        "work": "Technology", "product": "Technology", "screenshot_app": "Technology",
        "art_ai": "Creative Expression", "branding": "Creative Expression",
        "reference": "Creative Expression",
        "travel": "Exploration", "nature": "Exploration",
        "family": "Family & Generational", "portrait": "Family & Generational",
        "friends": "Social Life", "social": "Social Life", "event": "Social Life",
        "screenshot_social": "Social Life",
        "selfie": "Social Life", "food": "Social Life",
        "livestock": "Biological Systems", "industrial": "Mechanical Systems",
        "meme": "Creative Expression",
    }

    # Generate signals for each observation
    for obs in observations:
        fn = obs.get("filename", "")
        cat = obs.get("category", "unknown")
        mood = obs.get("mood", "unknown")
        setting = obs.get("setting", "unknown")
        era = obs.get("era_guess", "unknown")
        entities = obs.get("entities", [])

        # Signals on Jack Richard
        jk = "PERSON:Jack Richard"
        add_signal(jk, "content_category", cat, era, fn)
        add_signal(jk, "mood_observed", mood, era, fn)
        add_signal(jk, "setting_type", setting, era, fn)

        domain = domain_map.get(cat, "other")
        if domain != "other":
            add_signal(jk, "life_domain", domain, era, fn)

        if era and era != "unknown":
            add_signal(jk, "era_active", era, era, fn)

    # Appearance count signals
    person_counts = Counter()
    for obs in observations:
        for p in obs.get("people", []):
            pc = p.strip().lower()
            if pc in ("jack", "jack richard"):
                person_counts["PERSON:Jack Richard"] += 1
            elif pc not in ("unknown_male", "unknown_female", "group", "none", "unknown", ""):
                person_counts[f"PERSON:{pc.title()}"] += 1

    for node_key, count in person_counts.items():
        add_signal(node_key, "photo_appearance", count)

    return _metrics, _signals


# ---------------------------------------------------------------------------
# PROTOCOL extraction
# ---------------------------------------------------------------------------

_proto_counter = 0
_protocols = []


def add_protocol(node_key, metric_name, description, trajectory):
    global _proto_counter
    if node_key not in _nodes or metric_name not in _metrics:
        return
    _proto_counter += 1
    _protocols.append({
        "id": f"P{_proto_counter:03d}",
        "type": "PROTOCOL",
        "node": _nodes[node_key]["id"],
        "metric": _metrics[metric_name]["id"],
        "description": description,
        "trajectory": trajectory,
    })


def extract_protocols(observations):
    # Analyze temporal patterns
    era_domains = defaultdict(Counter)
    era_moods = defaultdict(Counter)
    era_cats = defaultdict(Counter)

    for obs in observations:
        era = obs.get("era_guess", "unknown")
        cat = obs.get("category", "unknown")
        mood = obs.get("mood", "unknown")
        if era != "unknown":
            era_cats[era][cat] += 1
            era_moods[era][mood] += 1

    # Protocol 1: Domain focus trajectory
    add_protocol("PERSON:Jack Richard", "life_domain",
        "Domain focus shifts from social/personal toward technology and creative expression over time",
        {
            "early_eras": "Dominated by social, friends, events",
            "middle_eras": "Increasing work, product, and reference content",
            "late_eras": "AI art, architecture diagrams, technical screenshots",
            "expected": "Continued deepening of technology + creative convergence",
            "era_distribution": {era: dict(cats.most_common(5)) for era, cats in sorted(era_cats.items())[:8]},
        })

    # Protocol 2: Mood trajectory
    mood_totals = Counter()
    for obs in observations:
        mood_totals[obs.get("mood", "unknown")] += 1

    add_protocol("PERSON:Jack Richard", "mood_observed",
        "Mood profile: primarily informational and professional, with artistic expression growing",
        {
            "current_distribution": dict(mood_totals.most_common()),
            "trajectory": "Increasing professional + artistic, decreasing casual",
            "interpretation": "The archive reflects someone who processes the world through information gathering and professional lens, with growing creative output",
        })

    # Protocol 3: Setting trajectory
    setting_totals = Counter()
    for obs in observations:
        setting_totals[obs.get("setting", "unknown")] += 1

    add_protocol("PERSON:Jack Richard", "setting_type",
        "Setting profile: digital-first presence — more screenshots than outdoor photos",
        {
            "current_distribution": dict(setting_totals.most_common()),
            "interpretation": "Jack lives significantly in digital space — more content is captured from screens than from physical environments. This is consistent with a builder who processes reality through technology.",
        })

    return _protocols


# ---------------------------------------------------------------------------
# Narrative synthesis
# ---------------------------------------------------------------------------

def synthesize_narrative(observations):
    """Generate the narrative section of the report."""
    cat_counts = Counter(o.get("category", "unknown") for o in observations)
    mood_counts = Counter(o.get("mood", "unknown") for o in observations)
    setting_counts = Counter(o.get("setting", "unknown") for o in observations)
    total = len(observations)

    # Entity analysis
    entity_counts = Counter()
    for obs in observations:
        for e in obs.get("entities", []):
            entity_counts[e.strip().lower()] += 1

    # People analysis
    jack_count = sum(1 for o in observations
                     if any(p.strip().lower() in ("jack", "jack richard")
                            for p in o.get("people", [])))

    lines = []
    lines.append("## Narrative Synthesis — What the Photos Reveal About Jack Richard")
    lines.append("")
    lines.append("### The Digital Architect")
    lines.append("")

    digital_pct = (setting_counts.get("digital", 0) + setting_counts.get("screenshot", 0)) / total * 100
    indoor_pct = setting_counts.get("indoor", 0) / total * 100
    outdoor_pct = setting_counts.get("outdoor", 0) / total * 100

    lines.append(f"**{digital_pct:.0f}% of the archive is digital content** — screenshots, app captures, saved references. "
                 f"Only {outdoor_pct:.0f}% is outdoor photography. This is not someone who documents the physical world; "
                 f"this is someone who documents *information*. The camera roll is a knowledge capture system, "
                 f"not a photo album.")
    lines.append("")

    lines.append("### The Information Gatherer")
    lines.append("")
    info_pct = mood_counts.get("informational", 0) / total * 100
    prof_pct = mood_counts.get("professional", 0) / total * 100
    lines.append(f"**{info_pct:.0f}% informational, {prof_pct:.0f}% professional** — the dominant moods. "
                 f"Jack processes reality through a research lens. Screenshots of articles, technical diagrams, "
                 f"data visualizations, code, architecture patterns. The archive reads like a research journal, "
                 f"not a social media feed.")
    lines.append("")

    lines.append("### The Creative Emergence")
    lines.append("")
    art_count = cat_counts.get("art_ai", 0) + cat_counts.get("branding", 0)
    ref_count = cat_counts.get("reference", 0)
    lines.append(f"**{art_count} AI-generated artworks** and **{ref_count} reference images** reveal a parallel creative "
                 f"track. The AI art — lions, robotic insects, neural network patterns, cyberpunk aesthetics — "
                 f"forms a consistent visual vocabulary: intelligence, observation, controlled power. "
                 f"These aren't random generations; they're identity expressions.")
    lines.append("")

    lines.append("### The Social Footprint")
    lines.append("")
    social_count = (cat_counts.get("screenshot_social", 0) + cat_counts.get("friends", 0) +
                    cat_counts.get("social", 0) + cat_counts.get("event", 0))
    family_count = cat_counts.get("family", 0)
    lines.append(f"**{social_count} social/friends images** and **{family_count} family images**. "
                 f"Jack appears in {jack_count} photos out of {total} ({jack_count/total*100:.0f}%). "
                 f"He's more often the observer than the subject. Social content clusters around events, "
                 f"group gatherings, and platform screenshots — the relationships are documented through "
                 f"digital artifacts (shared posts, DMs, stories) more than posed photographs.")
    lines.append("")

    lines.append("### The Convex Hull in Evidence")
    lines.append("")
    work_count = cat_counts.get("work", 0) + cat_counts.get("product", 0)
    lines.append(f"The archive contains evidence of multiple distinct life domains converging:")
    lines.append(f"- **Technology/Work**: {work_count} images of product screenshots, code, dashboards, architecture")
    lines.append(f"- **Creative**: {art_count} AI artworks + {ref_count} reference materials")
    lines.append(f"- **Social**: {social_count} social captures across platforms")
    lines.append(f"- **Travel/Exploration**: {cat_counts.get('travel', 0)} travel photos")
    lines.append(f"- **Family**: {family_count} family/generational images")
    lines.append(f"- **Food**: {cat_counts.get('food', 0)} food photos (the human constant)")
    lines.append("")
    lines.append("This distribution mirrors the Charlotte thesis: the same person, touching multiple domains, "
                 "with the camera roll serving as the raw signal stream that would eventually be formalized "
                 "into the FINN architecture.")
    lines.append("")

    lines.append("### The Temporal Torus")
    lines.append("")
    era_counts = Counter(o.get("era_guess", "unknown") for o in observations if o.get("era_guess", "unknown") != "unknown")
    lines.append("Temporal distribution of datable content:")
    lines.append("")
    for era, count in sorted(era_counts.items()):
        lines.append(f"- **{era}**: {count} images")
    lines.append("")
    lines.append("The archive spans roughly 2019-2025, with density increasing over time — "
                 "more screenshots, more references, more creative output. The trajectory is clear: "
                 "from documenting life to documenting *knowledge*.")
    lines.append("")

    # Top entities
    lines.append("### Most Frequent Visual Entities")
    lines.append("")
    lines.append("| Entity | Occurrences |")
    lines.append("|--------|------------|")
    for ent, count in entity_counts.most_common(30):
        if count >= 5:
            lines.append(f"| {ent} | {count} |")
    lines.append("")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------

def build_report(observations):
    nodes = _nodes
    edges = _edges
    metrics = _metrics
    signals = _signals
    protocols = _protocols

    cat_counts = Counter(o.get("category", "unknown") for o in observations)
    mood_counts = Counter(o.get("mood", "unknown") for o in observations)
    setting_counts = Counter(o.get("setting", "unknown") for o in observations)
    total = len(observations)

    lines = []
    lines.append("# JOURNEY Knowledge Graph — FINN Primitive Analysis")
    lines.append("")
    lines.append(f"Knowledge graph built from visual analysis of **{total} photos** in the JOURNEY archive,")
    lines.append("mapped to Charlotte's five FINN primitives (NODE, EDGE, METRIC, SIGNAL, PROTOCOL).")
    lines.append("")
    lines.append("---")
    lines.append("")

    # Stats table
    lines.append("## Graph Statistics")
    lines.append("")
    lines.append("| Primitive | Count |")
    lines.append("|-----------|-------|")
    lines.append(f"| NODEs | {len(nodes)} |")
    lines.append(f"| EDGEs | {len(edges)} |")
    lines.append(f"| METRICs | {len(metrics)} |")
    lines.append(f"| SIGNALs | {len(signals)} |")
    lines.append(f"| PROTOCOLs | {len(protocols)} |")
    lines.append("")

    # Node categories
    node_cats = Counter(n["category"] for n in nodes.values())
    lines.append("## NODEs — Identity Categories")
    lines.append("")
    lines.append("| Category | Count |")
    lines.append("|----------|-------|")
    for cat, count in node_cats.most_common():
        lines.append(f"| {cat} | {count} |")
    lines.append("")

    # Top nodes by gravitational pull
    lines.append("## Gravitational Pull — Top Nodes by Signal Density")
    lines.append("")
    lines.append("| Node | Category | Signals | Edges |")
    lines.append("|------|----------|---------|-------|")
    top_nodes = sorted(nodes.values(), key=lambda n: -(n["signal_count"] + n["edge_count"] * 10))[:20]
    for n in top_nodes:
        if n["signal_count"] > 0 or n["edge_count"] > 0:
            lines.append(f"| {n['label']} | {n['category']} | {n['signal_count']} | {n['edge_count']} |")
    lines.append("")

    # Edges
    edge_types = Counter(e["label"] for e in edges)
    lines.append("## EDGEs — Relationship Types")
    lines.append("")
    lines.append("| Type | Count |")
    lines.append("|------|-------|")
    for etype, count in edge_types.most_common():
        lines.append(f"| {etype} | {count} |")
    lines.append("")

    # Structural edges
    lines.append("### Structural Relationships")
    lines.append("")
    for e in edges:
        if e["label"] != "APPEARS_WITH":
            lines.append(f"- **{e['source_label']}** --[{e['label']}]--> **{e['target_label']}**")
    lines.append("")

    # Co-occurrence
    cooccur = [e for e in edges if e["label"] == "APPEARS_WITH"]
    if cooccur:
        lines.append("### Co-Occurrence (People Who Appear with Jack)")
        lines.append("")
        lines.append("| Person | Photos Together |")
        lines.append("|--------|----------------|")
        for e in sorted(cooccur, key=lambda x: -x["properties"].get("co_occurrence_count", 0)):
            lines.append(f"| {e['target_label']} | {e['properties'].get('co_occurrence_count', 0)} |")
        lines.append("")

    # Metrics
    lines.append("## METRICs — Measurement Definitions")
    lines.append("")
    lines.append("| ID | Metric | Type | Description |")
    lines.append("|----|--------|------|-------------|")
    for m in metrics.values():
        lines.append(f"| {m['id']} | {m['name']} | {m['value_type']} | {m['description']} |")
    lines.append("")

    # Signal distributions
    lines.append("## SIGNALs — Observational Patterns")
    lines.append("")

    lines.append("### Content Category Distribution")
    lines.append("")
    lines.append("| Category | Count | % |")
    lines.append("|----------|-------|---|")
    for cat, count in cat_counts.most_common():
        lines.append(f"| {cat} | {count} | {count/total*100:.1f}% |")
    lines.append("")

    lines.append("### Mood Distribution")
    lines.append("")
    lines.append("| Mood | Count | % |")
    lines.append("|------|-------|---|")
    for mood, count in mood_counts.most_common():
        lines.append(f"| {mood} | {count} | {mood_counts[mood]/total*100:.1f}% |")
    lines.append("")

    lines.append("### Setting Distribution")
    lines.append("")
    lines.append("| Setting | Count | % |")
    lines.append("|---------|-------|---|")
    for s, count in setting_counts.most_common():
        lines.append(f"| {s} | {count} | {count/total*100:.1f}% |")
    lines.append("")

    # Era distribution
    era_counts = Counter(o.get("era_guess", "unknown") for o in observations)
    lines.append("### Temporal Distribution")
    lines.append("")
    lines.append("| Era | Count |")
    lines.append("|-----|-------|")
    for era, count in sorted(era_counts.items()):
        lines.append(f"| {era} | {count} |")
    lines.append("")

    # Protocols
    lines.append("## PROTOCOLs — Forward-Looking Expectations")
    lines.append("")
    for p in protocols:
        node_label = next((n["label"] for n in nodes.values() if n["id"] == p["node"]), "?")
        lines.append(f"### {p['description']}")
        lines.append("")
        lines.append(f"**Node:** {node_label}")
        lines.append("")
        traj = p["trajectory"]
        for k, v in traj.items():
            if isinstance(v, dict):
                lines.append(f"**{k}:**")
                for kk, vv in v.items():
                    lines.append(f"  - {kk}: {vv}")
            else:
                lines.append(f"- **{k}:** {v}")
        lines.append("")

    # Narrative
    lines.append("---")
    lines.append("")
    lines.append(synthesize_narrative(observations))

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("Loading observations...")
    observations = load_observations()
    if not observations:
        print("No observations found.")
        return

    print("\nExtracting NODEs...")
    nodes = extract_nodes(observations)
    print(f"  {len(nodes)} nodes")

    print("Extracting EDGEs...")
    edges = extract_edges(observations)
    print(f"  {len(edges)} edges")

    print("Extracting METRICs and SIGNALs...")
    metrics, signals = extract_metrics_and_signals(observations)
    print(f"  {len(metrics)} metrics, {len(signals)} signals")

    print("Extracting PROTOCOLs...")
    protocols = extract_protocols(observations)
    print(f"  {len(protocols)} protocols")

    # Save JSON
    graph = {
        "metadata": {
            "title": "JOURNEY Knowledge Graph — Jack Richard",
            "source": f"Visual analysis of {len(observations)} photos from JOURNEY archive",
            "primitives": "FINN (NODE, EDGE, METRIC, SIGNAL, PROTOCOL)",
            "generated": "2026-02-09",
            "coverage": f"{len(observations)}/1467 viewable images ({len(observations)/1467*100:.0f}%)",
        },
        "statistics": {
            "nodes": len(nodes),
            "edges": len(edges),
            "metrics": len(metrics),
            "signals": len(signals),
            "protocols": len(protocols),
        },
        "nodes": list(nodes.values()),
        "edges": edges,
        "metrics": list(metrics.values()),
        "signals": signals[:500],  # Truncate for readability; full set is massive
        "signals_total": len(signals),
        "protocols": protocols,
    }

    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(graph, f, indent=2, ensure_ascii=False)
    print(f"\nJSON: {OUTPUT_JSON}")

    # Save markdown
    md = build_report(observations)
    with open(OUTPUT_MD, "w", encoding="utf-8") as f:
        f.write(md)
    print(f"Markdown: {OUTPUT_MD}")

    print(f"\n{'='*60}")
    print(f"FINN Knowledge Graph — Jack Richard")
    print(f"{'='*60}")
    print(f"  NODEs:     {len(nodes)}")
    print(f"  EDGEs:     {len(edges)}")
    print(f"  METRICs:   {len(metrics)}")
    print(f"  SIGNALs:   {len(signals)}")
    print(f"  PROTOCOLs: {len(protocols)}")
    print(f"  Coverage:  {len(observations)}/1467 images")


if __name__ == "__main__":
    main()
