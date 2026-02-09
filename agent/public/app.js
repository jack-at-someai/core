const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('input');
const sendBtn = document.getElementById('send');

const conversation = [];

const WELCOME = `Welcome to the SomeAI research lab. I can answer questions about:

- **Charlotte** — our infrastructure thesis and five primitives
- **The team** — Jack, Jim, Joseph, advisors, key people
- **12 research papers** — from Nature to NeurIPS
- **Validation domains** — LineLeap, Sounder, ISG, Prier Violins
- **Competitive landscape** — Neo4j, Neptune, InfluxDB, and our gap
- **Business model** — pricing, TAM, projections
- **37 lab projects** — games, simulations, reference hubs

What would you like to know?`;

// Knowledge sections for client-side keyword fallback
const KNOWLEDGE = {
  charlotte: 'Charlotte is infrastructure for observable reality — a universal substrate for modeling any domain where identities emit signals over time. Five primitives: NODE (identity with lifecycle), EDGE (first-class relationship), METRIC (measurable dimension), SIGNAL (time-indexed fact), PROTOCOL (expectation generator). Pre-built spatiotemporal substrate with DATE, TIME, and location nodes.',
  primitives: 'Charlotte has exactly five primitives: NODE (an identity with a lifecycle), EDGE (a first-class append-only relationship), METRIC (an immutable measurable dimension), SIGNAL (a time-indexed append-only fact), and PROTOCOL (an expectation generator that never modifies history).',
  thesis: 'Charlotte\'s thesis: everything that matters can be represented as identities emitting signals on measurable dimensions over time. Time is the primary axis of truth. One substrate, every vertical, observable reality as a service.',
  jack: 'Jack Richard — R&D & Architecture lead. 8 years refining Charlotte across 4 validation domains. Northwestern CS background. Advisors: Ken Forbus (QRG, analogical reasoning), Kris Hammond (case-based reasoning), Dave Ferrucci (Watson), Louis Rosenberg (Unanimous AI, swarm intelligence).',
  jim: 'Jim Richard — CEO of Industrial Service Group, Chairman of Richard Enterprises / Serengeti. Strategy & acquisitions layer. Manages a portfolio of 16+ companies. Represents the operational layer of the three-generation architecture.',
  joseph: 'Joseph Richard — Internal operations, accounting, and engineering management layer of the three-generation architecture.',
  genger: 'Dave Genger (1962-2010) — Foundational teacher at Lake Forest Country Day School. Taught Jack robotics and Joseph biology. Died three months after Jack graduated 8th grade. His influence persists as a "standing wave" — the subject of Paper 11 on harmonic resonance.',
  almquist: 'Donald Almquist — Jack\'s grandfather. VP at General Motors, shaped Delco Electronics. Foundational industrial frequency for the family. Archived node representing post-LIFE_END resonance.',
  prier: 'Paul Prier — Master luthier and domain authority for the Prier Violins validation domain. Cultural artifact provenance where lifecycles are measured in centuries.',
  advisors: 'Four academic advisors from Northwestern: Ken Forbus (QRG — knowledge representation & analogical reasoning), Kris Hammond (case-based reasoning, memory-centric AI), Dave Ferrucci (Watson — large-scale symbolic reasoning), Louis Rosenberg (Unanimous AI — swarm intelligence, conviction/entrenchment measurement).',
  lineleap: 'LineLeap — Human behavior validation domain. College students buying drinks over 4-year lifecycles. Prediction quality increases with trajectory length. Demonstrates Charlotte\'s ability to model human identity signals over time.',
  sounder: 'Sounder/Trogdon Showpigs — Biological lifecycle validation domain. Competitive livestock breeding. Completed lifecycles become training data. Production dataset: ~27,200 nodes, ~46,100 edges in the unified swine registry.',
  trogdon: 'Sounder/Trogdon Showpigs — Biological lifecycle validation domain. Competitive livestock breeding. Completed lifecycles become training data. Production dataset: ~27,200 nodes, ~46,100 edges in the unified swine registry.',
  isg: 'Industrial Service Group (ISG) — Mechanical systems validation domain. Equipment maintenance and deviation detection from expected trajectories. Led by Jim Richard. Demonstrates Charlotte for industrial rotating equipment monitoring.',
  industrial: 'Industrial Service Group (ISG) — Mechanical systems validation domain. Equipment maintenance and deviation detection from expected trajectories. Led by Jim Richard. Demonstrates Charlotte for industrial rotating equipment monitoring.',
  violin: 'Prier Violins — Cultural artifact validation domain. Provenance tracking where lifecycles are measured in centuries. Domain authority: Paul Prier, master luthier. Demonstrates that Charlotte\'s five primitives model any domain.',
  papers: 'The lab has 12 research papers, all drafted Feb 2026: Paper 0 "Infrastructure for Observable Reality" (Nature), Paper 1 "FINN" (IEEE TKDE), Paper 2 "Business Strategy" (Management Science), Paper 3 "Recursive Flocking" (Swarm Intelligence), Paper 4 "Substrate Architecture" (IEEE Software), Paper 5 "Domain Modeling" (ACM MODELS), Paper 6 "Spatial Perception" (ACM SIGSPATIAL), Paper 7 "Temporal Perception" (ACM TODS), Paper 8 "Frontend as Graph" (ACM CHI), Paper 9 "Tesseract Topology" (ACM SoCG), Paper 10 "Lifecycle Ensemble" (NeurIPS), Paper 11 "Harmonic Resonance" (Cognitive Science/PNAS).',
  finn: 'Paper 1 — "FINN: A Signal-Based Temporal Graph Architecture" targeting IEEE TKDE/ICDE. Core claim: all temporal data flows through append-only signals; metrics are computed, never stored, eliminating metric drift, staleness, and update coupling.',
  swarm: 'Paper 3 — "Recursive Flocking: Swarm Intelligence for Knowledge Graphs" targeting Swarm Intelligence Journal. Core claim: Reynolds\' three rules (separation, alignment, cohesion) applied recursively across organizational layers achieve emergent coordination without central control.',
  tesseract: 'Paper 9 — "Tesseract Topology: 4D Navigation Through Knowledge Space" targeting ACM SoCG. Core claim: knowledge graphs with spatiotemporal substrates form tesseract-structured lattices enabling 4D navigation.',
  resonance: 'Paper 11 — "Harmonic Resonance: Folding Time Across Generations" targeting Cognitive Science/PNAS. Core claim: intergenerational knowledge transfers through sympathetic resonance when systems share natural frequency (metrics), phase alignment (protocols), and connective medium (shared substrate). Inspired by Dave Genger\'s lasting influence.',
  lifecycle: 'Paper 10 — "The Dead Teach the Living: Lifecycle Ensemble Learning" targeting NeurIPS/ICML. Core claim: completed lifecycles constitute natural anonymization boundaries enabling cross-operation collective learning through similarity-weighted ensembles.',
  competitors: 'Charlotte\'s competitors: Neo4j ($200M+ ARR, $2B) — no temporal substrate. Amazon Neptune — AWS lock-in, OLTP-only. TigerGraph (~$18M) — corporate instability. InfluxDB (~$75M) — no entity relationships. TimescaleDB (~$18M) — relational foundation. ArangoDB — multi-model but not unified. Charlotte scores 96/120 on feature heat map vs Neo4j 56, Neptune 47.',
  neo4j: 'Neo4j: $200M+ ARR, $2B valuation. Gap vs Charlotte: no temporal substrate, conflates topology with features, metric drift by design, single-writer bottleneck. Charlotte replaces Neo4j\'s graph layer + time-series DB + spatial DB + event bus in one architecture.',
  neptune: 'Amazon Neptune: AWS-locked, no temporal substrate, OLTP-only, single-writer, no protocol layer. Charlotte provides a cloud-agnostic unified architecture.',
  tam: 'Total Addressable Market — Core TAM (graph + knowledge graph + time-series + event sourcing): $6.9B (2025) → $19.3B (2030) at ~23% CAGR. Extended TAM (+ spatial + digital twin): $15B → $40B+.',
  business: 'Charlotte\'s business model: managed service (not self-serve SaaS). Operator tier $3K-$8K/mo, Enterprise $12K-$35K/mo, Portfolio $50K-$150K/mo. Revenue projection: Year 1 $432K → Year 5 $27-30M at 75% gross margin. Prices at 15-35% of client\'s realized value.',
  pricing: 'Charlotte pricing tiers: Operator (single facility) $3K-$8K/mo, Enterprise (multi-site) $12K-$35K/mo, Portfolio (PE firm) $50K-$150K/mo. Integration tax for competitors: $200K-$1M+ licensing + $500K-$2M+ engineering. Charlotte replaces 3-5 systems with one.',
  projects: 'The lab has 37 interactive web projects — research instruments that stress-test facets of the problem space. Includes games (Chess, Go, 2048, Tetris, Snake, Minesweeper, etc.), simulations (Chaos Theory, Swarm, Pig Breeder), ML tools (CNN visualizer, Neural Playground), reference hubs (Graph Theory, Topology, Neuroscience, etc.), and infrastructure tools (Substrate explorer, Hoshin Kanri).',
  games: 'Lab games: 2048 (sliding tile), Chess (AI opponent), Go (ancient board game), Minesweeper, Snake, Solitaire Glass (glassmorphism), Sudoku, Tetris, Tic-Tac-Toe, Pong, Block Dude (puzzle platformer). Each tests different complexity facets: search trees, state management, real-time rendering, algorithmic complexity.',
  substrate: 'Charlotte\'s substrate architecture: single Firestore collection called "facts". Every document has :ID, :TYPE (one of 5 primitives), :CREATED (DATE node reference), and P0-P3 positional registers. Graph layer (NODE-EDGE-NODE) + Feature layer (NODE-METRIC-SIGNAL). Time is a linked list of DATE nodes. Space is hierarchical COUNTRY→STATE→CITY nodes.',
  signals: 'In Charlotte, signals replace fields. Every attribute is an append-only SIGNAL pointing to a METRIC with a value and timestamp. This gives full history for every property. Signals are never edited — corrections are new signals. Source-tagged: USER, PROTOCOL, or AGENT.',
  protocols: 'Protocols are expectation generators. They forecast what signals should look like at future checkpoints. They detect drift between expected and actual. They NEVER modify history — they only propose what should happen next. Schema: type, metric, current, target, target_date, checkpoints, frequency.',
  family: 'Three-generation architecture: Jim Richard (strategy & acquisitions, CEO ISG / Chairman Serengeti), Joseph Richard (operations & finance), Jack Richard (R&D & architecture, Charlotte development). This is Paper 11\'s harmonic resonance in action — three generations operating as a coordinated unit with shared metrics and protocols.',
  serengeti: 'Serengeti Enterprises — organization founded/led by Jim Richard. Parent entity that acquired ISG (Industrial Service Group). Manages portfolio of 16+ companies across industrial sectors.',
  data: 'Production dataset (unified swine registry): ~27,200 nodes, ~46,100 edges. Append-only signal stream growing continuously.',
  nodes: 'Production dataset: ~27,200 nodes, ~46,100 edges in the unified swine registry. Nodes are identities with lifecycles — animals, equipment, people, violins — anything that emits signals over time.',
  domains: 'Four validation domains prove Charlotte works across any domain: LineLeap (human behavior — college students), Sounder/Trogdon (biological — show pig breeding), ISG (mechanical — industrial equipment), Prier Violins (cultural — instrument provenance). Same five primitives, four completely different industries.',
  validation: 'Four validation domains prove Charlotte works across any domain: LineLeap (human behavior — college students), Sounder/Trogdon (biological — show pig breeding), ISG (mechanical — industrial equipment), Prier Violins (cultural — instrument provenance). Same five primitives, four completely different industries.',
};

const STOP_WORDS = new Set([
  'what', 'who', 'where', 'when', 'why', 'how', 'is', 'are', 'was',
  'were', 'the', 'and', 'or', 'but', 'for', 'with', 'about', 'tell',
  'me', 'show', 'can', 'you', 'do', 'does', 'did', 'this', 'that',
  'from', 'has', 'have', 'had', 'will', 'would', 'could', 'should',
  'compare', 'list', 'all', 'many',
]);

function keywordFallback(query) {
  const words = query.toLowerCase().match(/[a-z]+/g) || [];
  const keywords = words.filter(w => w.length > 2 && !STOP_WORDS.has(w));

  if (!keywords.length) {
    return 'I\'m the SomeAI lab guide. Ask me about Charlotte (our infrastructure thesis), the five primitives, our 12 research papers, the team (Jack, Jim, Joseph), validation domains (LineLeap, Sounder, ISG, Prier Violins), competitive landscape, or any of the 37 lab projects.';
  }

  const scored = [];
  for (const [key, text] of Object.entries(KNOWLEDGE)) {
    let score = 0;
    const textLower = text.toLowerCase();
    for (const kw of keywords) {
      if (kw === key || key.includes(kw)) score += 10;
      else if (textLower.includes(kw)) score += 1;
    }
    if (score > 0) scored.push({ score, key, text });
  }

  scored.sort((a, b) => b.score - a.score);

  if (!scored.length) {
    return 'I don\'t have specific information about that yet. Try asking about Charlotte, the five primitives, our papers, the team, validation domains, or the competitive landscape.';
  }

  const parts = [scored[0].text];
  if (scored.length > 1 && scored[1].score >= scored[0].score * 0.5) {
    parts.push(scored[1].text);
  }
  return parts.join('\n\n');
}

function addMessage(text, role) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.innerHTML = formatText(text);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function formatText(text) {
  let html = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`(.+?)`/g, '<code style="background:#1e293b;padding:1px 5px;border-radius:3px;font-size:13px">$1</code>');
  html = html.replace(/\n/g, '<br>');
  return html;
}

function showLoading() {
  const div = document.createElement('div');
  div.className = 'loading';
  div.id = 'loading';
  div.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function hideLoading() {
  const el = document.getElementById('loading');
  if (el) el.remove();
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  inputEl.value = '';
  inputEl.style.height = 'auto';
  addMessage(text, 'user');
  conversation.push({ role: 'user', content: text });

  sendBtn.disabled = true;
  showLoading();

  let reply;

  try {
    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversation }),
    });

    const data = await resp.json();
    reply = data.response || keywordFallback(text);
  } catch {
    // No server available (GitHub Pages) — use client-side fallback
    reply = keywordFallback(text);
  }

  hideLoading();
  addMessage(reply, 'agent');
  conversation.push({ role: 'assistant', content: reply });

  sendBtn.disabled = false;
  inputEl.focus();
}

// Auto-resize textarea
inputEl.addEventListener('input', () => {
  inputEl.style.height = 'auto';
  inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
});

// Enter to send, Shift+Enter for newline
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.addEventListener('click', sendMessage);

// Welcome message on load
addMessage(WELCOME, 'agent');
inputEl.focus();
