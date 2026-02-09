#!/usr/bin/env python3
"""
Agent — Conversational Guide for SomeAI Research Lab
Python HTTP server serving chat UI + Claude API proxy
"""

import os
import re
import json
import http.server
import socketserver
import urllib.request
import urllib.error
from pathlib import Path

PORT = int(os.environ.get('PORT', 3456))
PUBLIC_DIR = Path(__file__).parent / 'public'

SYSTEM_PROMPT = """You are the conversational guide for the SomeAI research lab. You know the entire lab — its thesis, architecture, people, papers, competitive landscape, and validation domains. Answer questions clearly and concisely. Use specific names, numbers, and details. Do not hedge.

## Charlotte — Core Thesis
Charlotte is infrastructure for observable reality — a universal substrate for modeling any domain where identities emit signals over time. Time is the primary axis of truth.

Five primitives (non-negotiable):
- NODE — An identity with a lifecycle
- EDGE — A first-class relationship, append-only
- METRIC — A measurable dimension, immutable once created
- SIGNAL — A time-indexed fact, append-only, never edited
- PROTOCOL — An expectation generator, never modifies history

Pre-built spatiotemporal substrate: DATE nodes, TIME nodes, COUNTRY/STATE/CITY nodes form a shared layer all data connects to.

## Three-Generation Architecture
- Jim Richard — CEO of Industrial Service Group, Chairman of Richard Enterprises / Serengeti. Strategy & acquisitions layer. Manages portfolio of 16+ companies.
- Joseph Richard — Internal operations, accounting, engineering management.
- Jack Richard — R&D & architecture. 8 years refining Charlotte across 4 domains. Northwestern CS background. Advisors include Ken Forbus (QRG, analogical reasoning), Kris Hammond (case-based reasoning), Dave Ferrucci (Watson), Louis Rosenberg (Unanimous AI, swarm intelligence).

## Key People
- Dave Genger (1962-2010) — Foundational teacher at Lake Forest Country Day School. Taught Jack robotics and Joseph biology. His influence persists as a "standing wave" — the subject of Paper 11 on harmonic resonance.
- Donald Almquist — Jack's grandfather. VP at General Motors, shaped Delco Electronics. Foundational industrial frequency for the family.
- Paul Prier — Master luthier and domain authority for the Prier Violins validation domain. Cultural artifact provenance.

## Four Validation Domains
1. LineLeap — Human behavior. College students buying drinks over 4-year lifecycles. Prediction quality increases with trajectory length.
2. Sounder/Trogdon Showpigs — Biological lifecycles. Competitive livestock breeding. Completed lifecycles become training data. Production dataset: ~27,200 nodes, ~46,100 edges.
3. Industrial Service Group (ISG) — Mechanical systems. Equipment maintenance, deviation detection from expected trajectories.
4. Prier Violins — Cultural artifacts. Provenance tracking. Lifecycles measured in centuries.

## 12 Research Papers (all drafted Feb 2026)
0. "Infrastructure for Observable Reality" — Nature/Science — Unifying thesis: five primitives model any domain where identities emit signals over time.
1. "FINN: A Signal-Based Temporal Graph Architecture" — IEEE TKDE/ICDE — All temporal data flows through append-only signals; metrics are computed, never stored.
2. "Operational Infrastructure for Signal-Driven Industries" — Management Science — Signal density as leading indicator of customer lifetime value.
3. "Recursive Flocking: Swarm Intelligence for Knowledge Graphs" — Swarm Intelligence Journal — Reynolds' three rules applied recursively achieve emergent coordination without central control.
4. "Containerized Knowledge Graphs with Register-Based Primitives" — IEEE Software — Register-based document model eliminates collection sprawl.
5. "Universal Ontology Through Register-Based Primitives" — ACM MODELS — Five primitives provide complete domain expressiveness without architectural modification.
6. "Interwoven Spatial Planes in Knowledge Graphs" — ACM SIGSPATIAL — Geographic space as pre-built substrate of spatial nodes and cardinal edges.
7. "Time as Graph: A Temporal Substrate Architecture" — ACM TODS — Time is structural (nodes/edges) not attributive (timestamps).
8. "The Serialized Interface" — ACM CHI/UIST — UIs encoded as graph traversals; append-only signal mutations replace code recompilation.
9. "Tesseract Topology: 4D Navigation Through Knowledge Space" — ACM SoCG — Spatiotemporal substrates form tesseract-structured lattices for 4D navigation.
10. "The Dead Teach the Living: Lifecycle Ensemble Learning" — NeurIPS/ICML — Completed lifecycles as natural anonymization boundaries for cross-operation learning.
11. "Harmonic Resonance: Folding Time Across Generations" — Cognitive Science/PNAS — Intergenerational knowledge transfer through sympathetic resonance.

## Competitive Landscape
TAM: $6.9B core (2025) growing to $19.3B by 2030 at ~23% CAGR. Extended TAM (+ spatial + digital twin): $15B → $40B+.

Key competitors and their gaps vs Charlotte:
- Neo4j ($200M+ ARR, $2B valuation) — No temporal substrate; conflates topology with features; metric drift.
- Amazon Neptune — AWS lock-in; no temporal substrate; OLTP-only; no protocol layer.
- TigerGraph (~$18M ARR) — GSQL adoption barrier; corporate instability; no temporal substrate.
- InfluxDB (~$75M ARR) — No entity relationships; no identity model; no spatial substrate.
- TimescaleDB (~$18M ARR) — Relational foundation; no graph traversal; no spatiotemporal substrate.
- ArangoDB — Multi-model does not mean unified model; impedance mismatches.

Charlotte's gap: Nobody offers the full pipeline. Enterprises need 3-5 systems (graph DB + time-series + PostGIS + Kafka + custom app). Integration tax: $200K-$1M+ licensing + $500K-$2M+ engineering. Charlotte replaces all of it with one architecture.

Charlotte heat map score: 96/120 vs Neo4j 56, Neptune 47, InfluxDB 54, TimescaleDB 43.

## Business Model
Managed service, not self-serve SaaS. Relationship-driven through PE firms, adjacent operators, industry associations, domain experts.
- Operator tier: $3K-$8K/mo
- Enterprise tier: $12K-$35K/mo
- Portfolio tier: $50K-$150K/mo
5-year projection: Year 1 $432K → Year 5 $27-30M at 75% gross margin.

## Lab Projects (37 interactive web projects)
Research instruments, not portfolio pieces. Each stress-tests a facet: real-time rendering, graph traversal, state management, algorithmic complexity, human interaction patterns, domain modeling. Includes games (Chess, Go, 2048, Tetris, Snake, Minesweeper, Sudoku, Solitaire, Tic-Tac-Toe, Pong, Block Dude), simulations (Chaos Theory, Swarm, Pig Breeder), ML tools (CNN visualizer, Neural Playground), reference hubs (Graph Theory, Topology, Neuroscience, Signal Processing, Spatial Computing, Temporal Databases, Swarm Intelligence, Formal Logic, Cognitive Science, Livestock Science, Systems Architecture), design tools (Neumorphism, Component Showcase), and infrastructure (Substrate explorer, Hoshin Kanri, TSP Visualizer, Hex Grid, Show Animal Tree, Sacred Geometry, Fourier).

## Key Architectural Facts
- Storage: Single Firestore collection called "facts" — every document is one of the five primitive types.
- Signals replace fields: Attributes have full history because they are append-only.
- Protocols forecast signals but never rewrite history.
- Hierarchy emerges from edge traversal, never stored on nodes.
- Network effect: All containers share the spatiotemporal substrate. Every new participant adds cross-referencing value.

## What Charlotte Is NOT
Not a dashboard (dashboards tell you what should matter). Not a workflow engine. Not a goal-setting tool. Not a prediction system. Charlotte shows what IS happening, what was expected, and where reality diverged."""

# Knowledge sections for keyword fallback
KNOWLEDGE_SECTIONS = {
    'charlotte': 'Charlotte is infrastructure for observable reality — a universal substrate for modeling any domain where identities emit signals over time. Five primitives: NODE (identity with lifecycle), EDGE (first-class relationship), METRIC (measurable dimension), SIGNAL (time-indexed fact), PROTOCOL (expectation generator). Pre-built spatiotemporal substrate with DATE, TIME, and location nodes.',
    'primitives': 'Charlotte has exactly five primitives: NODE (an identity with a lifecycle), EDGE (a first-class append-only relationship), METRIC (an immutable measurable dimension), SIGNAL (a time-indexed append-only fact), and PROTOCOL (an expectation generator that never modifies history).',
    'thesis': 'Charlotte\'s thesis: everything that matters can be represented as identities emitting signals on measurable dimensions over time. Time is the primary axis of truth. One substrate, every vertical, observable reality as a service.',
    'jack': 'Jack Richard — R&D & Architecture lead. 8 years refining Charlotte across 4 validation domains. Northwestern CS background. Advisors: Ken Forbus (QRG, analogical reasoning), Kris Hammond (case-based reasoning), Dave Ferrucci (Watson), Louis Rosenberg (Unanimous AI, swarm intelligence).',
    'jim': 'Jim Richard — CEO of Industrial Service Group, Chairman of Richard Enterprises / Serengeti. Strategy & acquisitions layer. Manages a portfolio of 16+ companies. Represents the operational layer of the three-generation architecture.',
    'joseph': 'Joseph Richard — Internal operations, accounting, and engineering management layer of the three-generation architecture.',
    'genger': 'Dave Genger (1962-2010) — Foundational teacher at Lake Forest Country Day School. Taught Jack robotics and Joseph biology. Died three months after Jack graduated 8th grade. His influence persists as a "standing wave" — the subject of Paper 11 on harmonic resonance.',
    'almquist': 'Donald Almquist — Jack\'s grandfather. VP at General Motors, shaped Delco Electronics. Foundational industrial frequency for the family. Archived node representing post-LIFE_END resonance.',
    'prier': 'Paul Prier — Master luthier and domain authority for the Prier Violins validation domain. Cultural artifact provenance where lifecycles are measured in centuries.',
    'advisors': 'Four academic advisors from Northwestern: Ken Forbus (QRG — knowledge representation & analogical reasoning), Kris Hammond (case-based reasoning, memory-centric AI), Dave Ferrucci (Watson — large-scale symbolic reasoning), Louis Rosenberg (Unanimous AI — swarm intelligence, conviction/entrenchment measurement).',
    'lineleap': 'LineLeap — Human behavior validation domain. College students buying drinks over 4-year lifecycles. Prediction quality increases with trajectory length. Demonstrates Charlotte\'s ability to model human identity signals over time.',
    'sounder': 'Sounder/Trogdon Showpigs — Biological lifecycle validation domain. Competitive livestock breeding. Completed lifecycles become training data. Production dataset: ~27,200 nodes, ~46,100 edges in the unified swine registry.',
    'trogdon': 'Sounder/Trogdon Showpigs — Biological lifecycle validation domain. Competitive livestock breeding. Completed lifecycles become training data. Production dataset: ~27,200 nodes, ~46,100 edges in the unified swine registry.',
    'isg': 'Industrial Service Group (ISG) — Mechanical systems validation domain. Equipment maintenance and deviation detection from expected trajectories. Led by Jim Richard. Demonstrates Charlotte for industrial rotating equipment monitoring.',
    'industrial': 'Industrial Service Group (ISG) — Mechanical systems validation domain. Equipment maintenance and deviation detection from expected trajectories. Led by Jim Richard. Demonstrates Charlotte for industrial rotating equipment monitoring.',
    'violin': 'Prier Violins — Cultural artifact validation domain. Provenance tracking where lifecycles are measured in centuries. Domain authority: Paul Prier, master luthier. Demonstrates that Charlotte\'s five primitives model any domain.',
    'papers': 'The lab has 12 research papers, all drafted Feb 2026: Paper 0 "Infrastructure for Observable Reality" (Nature), Paper 1 "FINN" (IEEE TKDE), Paper 2 "Business Strategy" (Management Science), Paper 3 "Recursive Flocking" (Swarm Intelligence), Paper 4 "Substrate Architecture" (IEEE Software), Paper 5 "Domain Modeling" (ACM MODELS), Paper 6 "Spatial Perception" (ACM SIGSPATIAL), Paper 7 "Temporal Perception" (ACM TODS), Paper 8 "Frontend as Graph" (ACM CHI), Paper 9 "Tesseract Topology" (ACM SoCG), Paper 10 "Lifecycle Ensemble" (NeurIPS), Paper 11 "Harmonic Resonance" (Cognitive Science/PNAS).',
    'finn': 'Paper 1 — "FINN: A Signal-Based Temporal Graph Architecture" targeting IEEE TKDE/ICDE. Core claim: all temporal data flows through append-only signals; metrics are computed, never stored, eliminating metric drift, staleness, and update coupling.',
    'swarm': 'Paper 3 — "Recursive Flocking: Swarm Intelligence for Knowledge Graphs" targeting Swarm Intelligence Journal. Core claim: Reynolds\' three rules (separation, alignment, cohesion) applied recursively across organizational layers achieve emergent coordination without central control.',
    'tesseract': 'Paper 9 — "Tesseract Topology: 4D Navigation Through Knowledge Space" targeting ACM SoCG. Core claim: knowledge graphs with spatiotemporal substrates form tesseract-structured lattices enabling 4D navigation.',
    'resonance': 'Paper 11 — "Harmonic Resonance: Folding Time Across Generations" targeting Cognitive Science/PNAS. Core claim: intergenerational knowledge transfers through sympathetic resonance when systems share natural frequency (metrics), phase alignment (protocols), and connective medium (shared substrate). Inspired by Dave Genger\'s lasting influence.',
    'lifecycle': 'Paper 10 — "The Dead Teach the Living: Lifecycle Ensemble Learning" targeting NeurIPS/ICML. Core claim: completed lifecycles constitute natural anonymization boundaries enabling cross-operation collective learning through similarity-weighted ensembles.',
    'competitors': 'Charlotte\'s competitors: Neo4j ($200M+ ARR, $2B) — no temporal substrate. Amazon Neptune — AWS lock-in, OLTP-only. TigerGraph (~$18M) — corporate instability. InfluxDB (~$75M) — no entity relationships. TimescaleDB (~$18M) — relational foundation. ArangoDB — multi-model but not unified. Charlotte scores 96/120 on feature heat map vs Neo4j 56, Neptune 47.',
    'neo4j': 'Neo4j: $200M+ ARR, $2B valuation. Gap vs Charlotte: no temporal substrate, conflates topology with features, metric drift by design, single-writer bottleneck. Charlotte replaces Neo4j\'s graph layer + time-series DB + spatial DB + event bus in one architecture.',
    'neptune': 'Amazon Neptune: AWS-locked, no temporal substrate, OLTP-only, single-writer, no protocol layer. Charlotte provides a cloud-agnostic unified architecture.',
    'tam': 'Total Addressable Market — Core TAM (graph + knowledge graph + time-series + event sourcing): $6.9B (2025) → $19.3B (2030) at ~23% CAGR. Extended TAM (+ spatial + digital twin): $15B → $40B+.',
    'business': 'Charlotte\'s business model: managed service (not self-serve SaaS). Operator tier $3K-$8K/mo, Enterprise $12K-$35K/mo, Portfolio $50K-$150K/mo. Revenue projection: Year 1 $432K → Year 5 $27-30M at 75% gross margin. Prices at 15-35% of client\'s realized value.',
    'pricing': 'Charlotte pricing tiers: Operator (single facility) $3K-$8K/mo, Enterprise (multi-site) $12K-$35K/mo, Portfolio (PE firm) $50K-$150K/mo. Integration tax for competitors: $200K-$1M+ licensing + $500K-$2M+ engineering. Charlotte replaces 3-5 systems with one.',
    'projects': 'The lab has 37 interactive web projects — research instruments that stress-test facets of the problem space. Includes games (Chess, Go, 2048, Tetris, Snake, Minesweeper, etc.), simulations (Chaos Theory, Swarm, Pig Breeder), ML tools (CNN visualizer, Neural Playground), reference hubs (Graph Theory, Topology, Neuroscience, etc.), and infrastructure tools (Substrate explorer, Hoshin Kanri).',
    'games': 'Lab games: 2048 (sliding tile), Chess (AI opponent), Go (ancient board game), Minesweeper, Snake, Solitaire Glass (glassmorphism), Sudoku, Tetris, Tic-Tac-Toe, Pong, Block Dude (puzzle platformer). Each tests different complexity facets: search trees, state management, real-time rendering, algorithmic complexity.',
    'substrate': 'Charlotte\'s substrate architecture: single Firestore collection called "facts". Every document has :ID, :TYPE (one of 5 primitives), :CREATED (DATE node reference), and P0-P3 positional registers. Graph layer (NODE-EDGE-NODE) + Feature layer (NODE-METRIC-SIGNAL). Time is a linked list of DATE nodes. Space is hierarchical COUNTRY→STATE→CITY nodes.',
    'signals': 'In Charlotte, signals replace fields. Every attribute is an append-only SIGNAL pointing to a METRIC with a value and timestamp. This gives full history for every property. Signals are never edited — corrections are new signals. Source-tagged: USER, PROTOCOL, or AGENT.',
    'protocols': 'Protocols are expectation generators. They forecast what signals should look like at future checkpoints. They detect drift between expected and actual. They NEVER modify history — they only propose what should happen next. Schema: type, metric, current, target, target_date, checkpoints, frequency.',
    'family': 'Three-generation architecture: Jim Richard (strategy & acquisitions, CEO ISG / Chairman Serengeti), Joseph Richard (operations & finance), Jack Richard (R&D & architecture, Charlotte development). This is Paper 11\'s harmonic resonance in action — three generations operating as a coordinated unit with shared metrics and protocols.',
    'serengeti': 'Serengeti Enterprises — organization founded/led by Jim Richard. Parent entity that acquired ISG (Industrial Service Group). Manages portfolio of 16+ companies across industrial sectors.',
    'data': 'Production dataset (unified swine registry): ~27,200 nodes, ~46,100 edges. Append-only signal stream growing continuously.',
    'nodes': 'Production dataset: ~27,200 nodes, ~46,100 edges in the unified swine registry. Nodes are identities with lifecycles — animals, equipment, people, violins — anything that emits signals over time.',
}


class AgentHandler(http.server.SimpleHTTPRequestHandler):
    """Serves static files from public/ + handles /api/chat."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def do_POST(self):
        if self.path == '/api/chat':
            self._handle_chat()
        else:
            self.send_error(404)

    def _handle_chat(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        data = json.loads(body)
        messages = data.get('messages', [])

        api_key = os.environ.get('ANTHROPIC_API_KEY', '')

        if api_key:
            result = self._claude_chat(messages, api_key)
        else:
            query = messages[-1]['content'] if messages else ''
            result = self._keyword_fallback(query)

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())

    def _claude_chat(self, messages, api_key):
        payload = json.dumps({
            'model': 'claude-haiku-4-5-20251001',
            'max_tokens': 1024,
            'system': SYSTEM_PROMPT,
            'messages': messages,
        }).encode()

        req = urllib.request.Request(
            'https://api.anthropic.com/v1/messages',
            data=payload,
            headers={
                'Content-Type': 'application/json',
                'x-api-key': api_key,
                'anthropic-version': '2023-06-01',
            },
        )

        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read())
                text = data['content'][0]['text']
                return {'response': text}
        except (urllib.error.URLError, urllib.error.HTTPError) as e:
            print(f'Claude API error: {e}')
            query = messages[-1]['content'] if messages else ''
            return self._keyword_fallback(query)

    def _keyword_fallback(self, query):
        stop_words = {
            'what', 'who', 'where', 'when', 'why', 'how', 'is', 'are', 'was',
            'were', 'the', 'and', 'or', 'but', 'for', 'with', 'about', 'tell',
            'me', 'show', 'can', 'you', 'do', 'does', 'did', 'this', 'that',
            'from', 'has', 'have', 'had', 'will', 'would', 'could', 'should',
            'compare', 'list', 'all', 'many',
        }
        words = re.findall(r'[a-zA-Z]+', query.lower())
        keywords = [w for w in words if len(w) > 2 and w not in stop_words]

        if not keywords:
            return {
                'response': (
                    'I\'m the SomeAI lab guide. Ask me about Charlotte (our '
                    'infrastructure thesis), the five primitives, our 12 research '
                    'papers, the team (Jack, Jim, Joseph), validation domains '
                    '(LineLeap, Sounder, ISG, Prier Violins), competitive landscape, '
                    'or any of the 37 lab projects.'
                )
            }

        scored = []
        for key, text in KNOWLEDGE_SECTIONS.items():
            score = 0
            text_lower = text.lower()
            for kw in keywords:
                if kw == key or kw in key:
                    score += 10
                elif kw in text_lower:
                    score += 1
            if score > 0:
                scored.append((score, key, text))

        scored.sort(key=lambda x: x[0], reverse=True)

        if not scored:
            return {
                'response': (
                    'I don\'t have specific information about that yet. Try asking '
                    'about Charlotte, the five primitives, our papers, the team, '
                    'validation domains, or the competitive landscape.'
                )
            }

        # Return top 1-2 matches
        parts = [scored[0][2]]
        if len(scored) > 1 and scored[1][0] >= scored[0][0] * 0.5:
            parts.append(scored[1][2])

        return {'response': '\n\n'.join(parts)}

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        if '/api/' in str(args[0]) if args else False:
            super().log_message(format, *args)


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def main():
    print(f'\n  AGENT - SomeAI Lab Guide')
    print(f'  {"=" * 28}')
    print(f'  http://localhost:{PORT}')
    api_status = 'connected' if os.environ.get('ANTHROPIC_API_KEY') else 'no key (keyword fallback)'
    print(f'  Claude API: {api_status}')
    print(f'  Knowledge: {len(KNOWLEDGE_SECTIONS)} sections\n')

    with ReusableTCPServer(('', PORT), AgentHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\nShutting down.')
            httpd.shutdown()


if __name__ == '__main__':
    main()
