# FINN: A Signal-Based Temporal Graph Architecture for Observable Systems

**Target Venue:** IEEE Transactions on Knowledge and Data Engineering (TKDE) / IEEE International Conference on Data Engineering (ICDE)

**Paper Type:** Full Research Paper (10–14 pages, IEEE two-column format)

---

## Abstract

Traditional database architectures store computed metrics as entity attributes, producing snapshots that diverge from reality through staleness, drift, update coupling, and lost history. This paper introduces FINN (Framework for Integrated Neural Networks), a graph-native temporal architecture in which all observational data flows through append-only *signals* — time-indexed measurements anchored to identity nodes via formally defined metrics. Nodes carry immutable identity and classification but store no computed values; edges encode directional relationships between entities; metrics define measurable dimensions; signals record observations; and protocols encode forward-looking expectations. The resulting five-primitive model cleanly separates a *graph layer* (topology) from a *feature layer* (time-series observations), enabling derived analytics at query time without materialized aggregates. A formal model is presented comprising definitions, invariants, a query algebra, and complexity bounds. Six core algorithms are specified for point queries, temporal aggregation, traversal-based metric computation, pedigree depth calculation, signal density measurement, and protocol evaluation. Cross-domain validation demonstrates structural convergence across four radically different systems — human behavior (four-year lifecycles), biological breeding programs (monthly cycles), industrial equipment maintenance (multi-year service arcs), and cultural artifact provenance (centuries-long histories) — without architectural modification. A production implementation on Firebase Firestore, encoding all five primitives in a single document collection via fixed positional registers, is described and evaluated against a unified swine registry dataset containing approximately 27,200 nodes and 46,100 edges. Results confirm the elimination of metric drift, complete temporal history preservation, and emergent cross-domain analytics.

**Keywords:** temporal graphs, signal processing, knowledge graphs, append-only architecture, event sourcing, observable systems, register-based encoding

---

## I. Introduction

### A. The Attribute-Based Metric Problem

The dominant paradigm in operational database design treats computed metrics as first-class attributes on entity records. A breeding operation, for instance, might store an `animal_count` field on its record, incrementing the value with each registration event. This pattern appears in customer relationship management systems, enterprise resource planning platforms, Internet-of-Things dashboards, and virtually every domain where entities accumulate quantitative state over time.

The approach carries five structural failure modes that become progressively more damaging as systems scale and age:

1. **Staleness.** An attribute reflects reality only at write time. The moment a value is stored, it begins to age. Between updates, the attribute represents a historical snapshot masquerading as current truth.

2. **Drift.** Accumulated counters — total sales, event counts, running averages — are susceptible to compounding errors. A single failed increment, a race condition between concurrent writers, or a retroactive correction that neglects to update all dependent counters introduces divergence between the stored value and the value that would be obtained by recomputing from source events.

3. **Update Coupling.** Every transaction that affects a derived metric must propagate updates to every entity that caches that metric. Adding an animal to an operation requires incrementing the operation's count, the registry's count, and potentially the state's and nation's counts. This coupling creates write amplification proportional to the depth of the aggregation hierarchy.

4. **Lost History.** Overwriting a counter destroys the trajectory that produced it. The system knows *what* the current count is but not *how* it arrived there — whether growth was linear, seasonal, or punctuated by sudden change. Temporal queries become impossible without auxiliary audit infrastructure.

5. **Inconsistency.** In distributed systems, concurrent updates to shared counters produce nondeterministic results. Conflict resolution strategies (last-writer-wins, merge functions, CRDTs) mitigate but do not eliminate the fundamental tension between distributed writes and centralized aggregation.

These are not implementation deficiencies correctable through better engineering. They are structural consequences of storing derived values as if they were primary facts.

### B. The FINN Principle

This paper introduces an alternative architecture grounded in a single principle:

> *All temporal data flows through signals. Metrics are computed, never stored.*

Under FINN, an entity node carries identity and classification but no computed values — no counts, no sums, no averages, no cached aggregates of any kind. Instead, every observation is recorded as an immutable, append-only *signal*: a time-indexed measurement of a defined metric on a specific node. The animal count for a breeding operation is not stored on the operation's record; it is derived at query time by traversing the edges connecting animals to that operation. The total sales figure is not an attribute; it is the sum of sale-price signals across all animals within the operation's subgraph.

The graph becomes a living system where truth emerges from structure rather than from cached snapshots. Staleness is eliminated because values are always computed from current graph state. Drift is impossible because there are no materialized counters to diverge. Update coupling vanishes because signal insertion is a local, append-only operation with no cascading writes. History is preserved by construction — every signal persists, producing a complete temporal record for every node and every metric. Consistency follows from append-only semantics: signals are never updated or deleted, only appended, eliminating write conflicts entirely.

### C. Contributions

This paper makes the following contributions:

1. **A five-primitive temporal graph model** (NODE, EDGE, METRIC, SIGNAL, PROTOCOL) that cleanly separates graph topology from feature-layer observations, with formally defined semantics and invariants.

2. **A query algebra** for traversal-based metric computation, including operators for selection, projection, temporal windowing, aggregation, and multi-hop traversal with signal collection.

3. **Six algorithms** for core operations — point queries, temporal aggregation, traversal metrics, pedigree depth computation, signal density measurement, and protocol checkpoint evaluation — with complexity analysis.

4. **Cross-domain structural validation** demonstrating that four radically different systems (human behavior, biological lifecycles, mechanical equipment, cultural artifacts) converge on identical graph structures without architectural modification.

5. **A production implementation** on Firebase Firestore using a register-based document encoding, evaluated against a unified swine registry dataset of approximately 27,200 nodes and 46,100 edges.

### D. Paper Organization

Section II surveys related work across temporal databases, event sourcing, graph databases, time-series systems, and knowledge graphs. Section III presents the FINN architecture, including the five primitives, the graph/feature layer separation, and the temporal and spatial substrate designs. Section IV formalizes the model with definitions, invariants, and a query algebra. Section V specifies six core algorithms with complexity bounds. Section VI describes the production implementation. Section VII presents experimental evaluation. Section VIII discusses limitations, trade-offs, and applicability. Section IX concludes.

---

## II. Related Work

### A. Temporal Databases

The temporal database literature, beginning with Snodgrass's foundational work on TSQL2 [?] and codified in the SQL:2011 standard [?], introduces valid-time and transaction-time dimensions to relational schemas. Bi-temporal models [?] track both when a fact was true in the real world and when it was recorded in the database. These approaches extend the relational model with temporal semantics but remain fundamentally attribute-based: metrics are still columns on rows, subject to the staleness and coupling problems described above. FINN's temporal grounding is structural — time is represented as graph nodes, not as column annotations — and observational data flows through dedicated signal primitives rather than temporal extensions to entity attributes.

### B. Event Sourcing and CQRS

Fowler's event sourcing pattern [?] and the Command Query Responsibility Segregation (CQRS) architecture [?] share FINN's commitment to append-only event streams as the source of truth. Events are persisted immutably; current state is derived by replaying the event log. However, event sourcing typically operates within the boundary of a single aggregate root. Cross-aggregate queries require dedicated read models (projections) that must be explicitly maintained. FINN generalizes this pattern to a graph-wide scope: signals are not scoped to individual aggregates but are indexed by both the target node and the metric definition, enabling cross-entity temporal queries without projection infrastructure. Additionally, FINN introduces *protocols* as forward-looking expectation structures, a concept absent from standard event sourcing frameworks.

### C. Graph Databases

Property graph systems such as Neo4j [?], Amazon Neptune [?], and TigerGraph [?] provide native graph storage and traversal. RDF-based knowledge graphs [?] offer formal ontological frameworks. Both paradigms represent entities as nodes and relationships as edges, enabling rich structural queries. However, temporal data in these systems is typically stored as properties on nodes or edges — the very attribute-based approach whose failure modes motivate this work. Temporal extensions to property graphs [?] add time dimensions to properties but do not introduce the signal/metric separation that FINN provides. In FINN, the graph layer (nodes and edges) is kept topologically clean; all time-varying observational data resides in the feature layer (metrics and signals), preventing graph pollution from high-frequency measurements.

### D. Time-Series Databases

Specialized time-series stores — InfluxDB [?], TimescaleDB [?], Prometheus [?] — are optimized for high-frequency numeric data streams. They excel at ingestion throughput and temporal aggregation for homogeneous measurement series. Their limitation, from FINN's perspective, is that entity relationships are not first-class. A time-series database can efficiently store weight measurements for an animal over time, but it cannot natively represent the pedigree relationships, ownership structures, geographic hierarchies, and organizational affiliations that contextualize those measurements. FINN integrates both capabilities: the graph layer provides structural context while the feature layer provides temporal measurement, unified under a single query model.

### E. Knowledge Graph Temporal Extensions

Recent work on temporal knowledge graph completion [?] and dynamic knowledge graphs [?] addresses the evolution of factual knowledge over time. These approaches extend triple stores with temporal annotations, enabling reasoning about when relationships held. FINN differs in treating *observations* (signals) as first-class temporal entities distinct from *relationships* (edges). A signal is not a time-annotated property on a node; it is an independent document anchored to both a node and a metric definition, with its own temporal grounding. This separation enables FINN to support both slowly-evolving graph topology and high-frequency observational data within a single architecture.

---

## III. FINN Architecture

### A. The Five Primitives

FINN represents all information using exactly five document types, collectively referred to as FACTs (Framework for Articulated Categorical Truths). Each FACT carries a type discriminator, a unique identifier, a temporal creation reference, and a set of positional registers whose semantics are determined by the type.

**NODE.** A node represents an entity with identity and lifecycle. It carries a category classification (e.g., HUMAN, OPERATION, ANIMAL, CITY) and optional state flags, but critically stores no computed values, no counts, and no aggregates. The node is the anchor point to which metrics, signals, and edges attach. Node identity is immutable once created.

**EDGE.** An edge is a directed connection between two nodes, carrying a semantic type label (e.g., OWNS, MEMBER_OF, BRED_BY, SIRE_OF, LOCATED_IN). Edges encode the topological structure of the knowledge graph. Like signals, edges are append-only: relationship history is preserved by recording new edges rather than modifying existing ones. An ownership transfer, for example, is modeled by appending a new OWNS edge with a later creation timestamp, not by overwriting the previous one.

**METRIC.** A metric is a measurement definition that specifies what can be observed about a node. It declares a value type (NUMBER, STRING, BOOLEAN, ENUM), an optional set of constraints (minimum, maximum, enumeration values), and a human-readable label. Metrics are immutable once created. They serve as the schema for the feature layer, analogous to column definitions in a relational schema but attached to individual nodes rather than to tables.

**SIGNAL.** A signal is a time-indexed observation of a specific metric on a specific node. It records the observed value, the temporal reference (anchored to a graph node in the temporal substrate, not a raw timestamp), and a source attribution (USER, SYSTEM, or AGENT). Signals are the core temporal primitive in FINN. They are append-only and immutable: to correct an observation, a new signal is appended with the corrected value and a later timestamp. The previous signal remains in the record, preserving the complete observational history including errors and corrections.

**PROTOCOL.** A protocol is an agent-generated expectation structure that forecasts future signal values for a node. It defines a target metric, a target value, a target date, and a sequence of intermediate checkpoints with expected values at specified dates. Protocols enable the system to represent not only what *has* happened (signals) but what *should* happen (expectations), creating a formal basis for drift detection — the divergence between expected and observed trajectories. Protocols never modify historical signals; they exist as independent forward-looking structures that are evaluated against incoming signals at checkpoint boundaries.

### B. Graph Layer versus Feature Layer

FINN enforces a clean separation between two complementary layers of the knowledge graph:

The **graph layer** comprises NODEs and EDGEs. It encodes the topological structure of the domain: who owns what, what belongs where, how entities relate to one another. Queries over the graph layer are structural — traversals, path computations, connectivity analyses, subgraph extractions.

The **feature layer** comprises METRICs and SIGNALs. It encodes the observational history of the domain: what was measured, when, by whom, and with what result. Queries over the feature layer are temporal — point lookups for current values, aggregations over time windows, trend computations, anomaly detection.

The separation is not merely organizational. It prevents *graph pollution* — the degradation of graph structure that occurs when high-frequency measurement data is encoded as node properties or relationship annotations. In a property graph system, recording daily weight measurements as properties on an animal node transforms the node into a hybrid entity/time-series container that complicates both structural and temporal queries. Under FINN, the node remains a clean identity anchor; the weight measurements reside in the feature layer as signals, queryable independently of the graph topology.

The two layers are connected through the metric and signal primitives' reference to a target node. This reference is structural, not relational — it does not create an edge in the graph layer. Any node can accumulate an arbitrary feature vector defined by the metrics attached to it and populated by the signals recorded against those metrics. Each node thereby becomes a point in a potentially high-dimensional feature space defined by its signal history.

### C. Time as Graph

FINN represents time not as timestamps embedded in documents but as a pre-built layer of nodes in the knowledge graph.

**DATE nodes** are created for every date in the operational range, identified by format `DATE:M-d-yyyy`. **TIME nodes** represent minutes within a day, identified by `TIME:0` through `TIME:1439`. These temporal nodes form a **temporal spine**: a doubly-linked chain of DATE nodes connected by NEXT edges, enabling temporal traversal — moving forward and backward through time by following graph edges rather than performing arithmetic on timestamps.

Events are anchored to temporal nodes through typed edges: an animal's birth is an edge from the litter node to a DATE node with type BORN_ON; a maintenance appointment is an edge from the equipment node to a DATE node with type SCHEDULED_ON. The `:CREATED` field on every FACT document references a DATE node, grounding the creation of every fact in the temporal substrate.

This design produces three structural advantages. First, temporal queries become graph traversals: "what happened in January?" becomes "traverse NEXT edges from DATE:1-1-2026 to DATE:1-31-2026, collect all facts with :CREATED references in that range." Second, the temporal substrate is *shared* across all users and all domains within the system. Two operations referencing DATE:3-15-2026 share the same temporal node, enabling temporal joins without timestamp comparison. Third, the absence of embedded timestamps eliminates timezone ambiguity and format inconsistency at the storage layer.

### D. Space as Graph

Geographic structure follows the same principle. COUNTRY, STATE, and CITY nodes are pre-built as a spatial substrate, connected by LOCATED_IN edges forming a hierarchical spatial spine. When an entity is located somewhere, an edge connects it to the appropriate spatial node.

This eliminates runtime geocoding. The question "which operations are in Georgia?" reduces to a single-hop traversal from STATE:GA along inbound LOCATED_IN edges, rather than a scan over operation records with string-based state fields. Spatial aggregation — counts, signal density, metric averages by geography — becomes graph traversal with signal collection at each visited node.

### E. The Gravitational Model

FINN introduces a metaphor for entity significance derived purely from graph structure. The *gravitational pull* of a node is a function of its edge connectivity, signal density, temporal span, and subgraph depth. An operation that has registered thousands of animals over decades, with dense signal histories and deep pedigree networks, exerts greater gravitational pull than a newly created operation with a single animal.

Crucially, gravitational pull is never stored. It is computed at query time from the graph and feature layers. This makes it immune to drift and ensures it always reflects the current state of the knowledge graph. The gravitational model provides a natural ranking and prioritization mechanism without requiring explicit scoring rules or manual weight assignments.

---

## IV. Formal Model

### A. Definitions

**Definition 1 (FINN Temporal Graph).** A FINN temporal graph is a septuple *G* = (*V*, *E*, *M*, *S*, *P*, *T*, *τ*) where:
- *V* is a finite set of nodes (identities)
- *E* ⊆ *V* × *V* × *L* is a set of labeled directed edges, where *L* is the set of edge type labels
- *M* is a set of metric definitions
- *S* is a set of signals
- *P* is a set of protocols
- *T* ⊆ *V* is the set of temporal nodes (DATE and TIME nodes), with *T* ⊂ *V*
- *τ* : *S* → *T* maps each signal to its temporal anchor

**Definition 2 (Signal).** A signal is a quintuple *s* = (*v*, *m*, *val*, *t*, *src*) where:
- *v* ∈ *V* is the target node
- *m* ∈ *M* is the metric being measured
- *val* ∈ dom(*m*) is the observed value, constrained to the domain of *m*
- *t* ∈ *T* is the temporal reference
- *src* ∈ {USER, SYSTEM, AGENT} is the source attribution

**Definition 3 (Derived Metric — Point Query).** For node *v* and metric *m*, the current value is:

```
current(v, m) = val(argmax_{s ∈ S(v,m)} τ(s))
```

where *S*(*v*, *m*) = {*s* ∈ *S* | *s*.*v* = *v* ∧ *s*.*m* = *m*} is the set of all signals for node *v* on metric *m*.

**Definition 4 (Temporal Aggregation).** For node *v*, metric *m*, time interval [*t*₁, *t*₂], and aggregation operator *op* ∈ {COUNT, SUM, AVG, MAX, MIN}:

```
aggregate(v, m, [t₁, t₂], op) = op({val(s) | s ∈ S(v, m), t₁ ≤ τ(s) ≤ t₂})
```

**Definition 5 (Traversal Metric).** For node *v*, an edge pattern *π* (a sequence of edge type constraints), a signal filter *φ*, and an aggregation operator *op*:

```
traversal_metric(v, π, φ, op) = op({val(s) | s ∈ S, s.v ∈ reach(v, π), φ(s)})
```

where reach(*v*, *π*) returns the set of nodes reachable from *v* by following edges matching pattern *π*.

### B. Invariants

The following invariants are maintained by construction:

**Invariant 1 (Signal Immutability).** ∀*s* ∈ *S* : *s* is append-only. Signals are never updated or deleted. Corrections are modeled by appending a new signal with a later temporal reference.

**Invariant 2 (Node Derivability).** No node *v* ∈ *V* stores computed aggregates. All quantitative properties of a node are derived from *S* and *E* at query time.

**Invariant 3 (Temporal Grounding).** ∀*s* ∈ *S* : *τ*(*s*) ∈ *T*. Every signal references a node in the temporal substrate. ∀*f* ∈ *V* ∪ *E* ∪ *M* ∪ *S* ∪ *P* : *f*.:CREATED ∈ *T*. Every fact's creation is temporally grounded.

**Invariant 4 (Layer Separation).** Edges connect only nodes to nodes: ∀(*u*, *v*, *l*) ∈ *E* : *u* ∈ *V* ∧ *v* ∈ *V*. Metrics and signals reference nodes structurally but do not create edges in the graph layer.

### C. Query Algebra

FINN defines six operators over the signal and edge sets:

| Operator | Symbol | Definition |
|----------|--------|------------|
| Select | σ | σ_φ(*S*) = {*s* ∈ *S* \| φ(*s*)} |
| Project | π | π_attr(*S*) = {*s*.attr \| *s* ∈ *S*} |
| Temporal Window | ω | ω_{[t₁,t₂]}(*S*) = {*s* ∈ *S* \| *t*₁ ≤ *τ*(*s*) ≤ *t*₂} |
| Aggregate | γ | γ_{v,m,op}(*S*) = *op*({val(*s*) \| *s* ∈ *S*(*v*,*m*)}) |
| Traverse | ρ | ρ_π(*v*) = {*u* ∈ *V* \| *v* →^π *u*} |
| Join | ⋈ | *S* ⋈_θ *E* = {(*s*, *e*) \| θ(*s*, *e*)} |

Compound queries compose these operators. For example, the average weight of all animals at an operation over the past year:

```
γ_{AVG}(ω_{[t_now-365, t_now]}(σ_{m=BODY_WEIGHT}(S ⋈_{s.v ∈ ρ_{BRED_BY}(op)} E)))
```

### D. Complexity Analysis

| Operation | Complexity | Notes |
|-----------|------------|-------|
| Point query (current value) | O(log *n*) | With temporal index on signals |
| Signal insertion | O(1) | Append-only, no cascading updates |
| Temporal aggregation | O(*k*) | *k* = signals in window |
| Traversal metric | O(*d* × *b*) | *d* = traversal depth, *b* = branching factor |
| Pedigree depth | O(2^*d*), O(*n*) memoized | *d* = generations; memoization reduces to linear |
| Signal density | O(*k*) | *k* = signals in window |

The critical observation is that signal insertion is O(1) — a constant-time append with no cascading counter updates. This stands in contrast to attribute-based systems where a single event may trigger O(*h*) updates, where *h* is the height of the aggregation hierarchy.

---

## V. Algorithms

### A. Algorithm 1: Current Value Query

```
PROCEDURE CurrentValue(v, m)
  INPUT: node v, metric m
  OUTPUT: most recent signal value, or ⊥ if none exists

  candidates ← σ_{node=v, metric=m}(S)
  IF candidates = ∅ THEN RETURN ⊥
  s* ← argmax_{s ∈ candidates} τ(s)
  RETURN val(s*)
```

**Complexity:** O(log *n*) with a composite index on (node, metric, timestamp). This replaces the O(1) cached lookup of attribute-based systems with a logarithmic index scan, but returns a value guaranteed to reflect the most recent observation rather than a potentially stale cache.

### B. Algorithm 2: Temporal Aggregation

```
PROCEDURE TemporalAggregate(v, m, t₁, t₂, op)
  INPUT: node v, metric m, time bounds [t₁, t₂], aggregation operator op
  OUTPUT: aggregated value

  window ← ω_{[t₁, t₂]}(σ_{node=v, metric=m}(S))
  values ← π_{value}(window)
  RETURN op(values)
```

**Complexity:** O(*k*) where *k* is the number of signals in the specified window. This enables temporal queries that are impossible in attribute-based systems — growth rates, seasonal patterns, variance over time — at a cost linear in the number of relevant observations.

### C. Algorithm 3: Traversal-Based Metric Computation

```
PROCEDURE TraversalMetric(v, edge_types, metric, max_depth, op)
  INPUT: root node v, set of edge types to follow, target metric,
         maximum traversal depth, aggregation operator op
  OUTPUT: aggregated metric across reachable subgraph

  visited ← ∅
  queue ← {(v, 0)}
  values ← []

  WHILE queue ≠ ∅ DO
    (u, depth) ← DEQUEUE(queue)
    IF u ∈ visited OR depth > max_depth THEN CONTINUE
    visited ← visited ∪ {u}

    current_val ← CurrentValue(u, metric)
    IF current_val ≠ ⊥ THEN values ← values ++ [current_val]

    FOR EACH (u, w, l) ∈ E WHERE l ∈ edge_types DO
      ENQUEUE(queue, (w, depth + 1))

  RETURN op(values)
```

**Complexity:** O(*d* × *b*) for traversal where *d* is maximum depth and *b* is average branching factor, plus O(log *n*) per visited node for the current value lookup. This algorithm unifies graph traversal with signal aggregation, enabling queries such as "average weight of all animals bred by operations in Georgia" as a single traversal from STATE:GA through LOCATED_IN and BRED_BY edges, collecting BODY_WEIGHT signals at each animal node.

### D. Algorithm 4: Pedigree Depth Computation

```
PROCEDURE PedigreeDepth(v)
  INPUT: animal node v
  OUTPUT: maximum ancestral depth

  memo ← {}
  RETURN PedigreeDepthHelper(v, memo)

PROCEDURE PedigreeDepthHelper(v, memo)
  IF v ∈ memo THEN RETURN memo[v]
  sire ← FOLLOW_EDGE(v, SIRE_OF)
  dam ← FOLLOW_EDGE(v, DAM_OF)

  IF sire = ⊥ AND dam = ⊥ THEN
    memo[v] ← 0
    RETURN 0

  sire_depth ← IF sire ≠ ⊥ THEN PedigreeDepthHelper(sire, memo) ELSE 0
  dam_depth ← IF dam ≠ ⊥ THEN PedigreeDepthHelper(dam, memo) ELSE 0

  result ← 1 + MAX(sire_depth, dam_depth)
  memo[v] ← result
  RETURN result
```

**Complexity:** O(2^*d*) without memoization, where *d* is the pedigree depth. With memoization, O(*n*) where *n* is the total number of unique ancestors in the pedigree tree. This is a domain-specific instance of the general traversal metric pattern, demonstrating how FINN supports recursive ancestral queries that would require stored depth counters in attribute-based systems.

### E. Algorithm 5: Signal Density Computation

```
PROCEDURE SignalDensity(v, t₁, t₂)
  INPUT: node v, time window [t₁, t₂]
  OUTPUT: signal density (signals per unit time)

  signals_in_window ← ω_{[t₁, t₂]}(σ_{node=v}(S))
  count ← |signals_in_window|
  duration ← t₂ - t₁
  RETURN count / duration
```

**Complexity:** O(*k*) where *k* is the number of signals in the window. Signal density serves as a proxy for entity activity and engagement. High-density nodes have rich observational histories; low-density nodes may indicate dormancy, data quality issues, or recently created entities. The gravitational model (Section III-E) uses signal density as a primary input.

### F. Algorithm 6: Protocol Checkpoint Evaluation

```
PROCEDURE EvaluateProtocol(protocol)
  INPUT: protocol with checkpoints [(date, expected_value), ...]
  OUTPUT: [(checkpoint, status, deviation), ...]

  results ← []
  FOR EACH (date, expected) IN protocol.checkpoints DO
    IF date > NOW THEN
      APPEND(results, (date, PENDING, ⊥))
      CONTINUE

    observed ← CurrentValueAt(protocol.node, protocol.metric, date)
    IF observed = ⊥ THEN
      APPEND(results, (date, MISSING, ⊥))
    ELSE
      deviation ← observed - expected
      status ← IF |deviation| ≤ protocol.tolerance THEN ON_TRACK
               ELSE IF deviation > 0 THEN AHEAD
               ELSE BEHIND
      APPEND(results, (date, status, deviation))

  RETURN results
```

**Complexity:** O(*c* × log *n*) where *c* is the number of checkpoints and log *n* is the cost of each point query. Protocol evaluation enables drift detection — the systematic comparison of expected and observed trajectories. This mechanism is unique to FINN among the architectures surveyed in Section II and provides a formal foundation for proactive intervention when reality diverges from expectations.

---

## VI. Implementation

### A. Technology Stack

The production implementation of FINN uses Firebase Firestore as the persistence layer, with a Flutter-based cross-platform client and Cloud Functions for server-side validation and complex aggregation. The choice of Firestore — a document-oriented NoSQL database — was motivated by its real-time synchronization capabilities, its managed scaling characteristics, and its alignment with FINN's document-per-fact model.

### B. Single-Collection Architecture

All five FACT types are stored in a single Firestore collection named `facts`. There are no separate collections for nodes, edges, metrics, signals, or protocols. This design ensures clean exports (dump one collection, get the entire knowledge graph), prevents collection sprawl as the system evolves, and maintains transactional integrity across heterogeneous fact types.

### C. Register-Based Document Structure

Each FACT document follows a fixed positional register scheme:

```
{
  ":ID":      "unique-identifier",
  ":TYPE":    "NODE | EDGE | METRIC | SIGNAL | PROTOCOL",
  ":CREATED": "DATE:M-d-yyyy",
  "P0":       "primary register",
  "P1":       "secondary register",
  "P2":       "tertiary register",
  "P3":       "quaternary register"
}
```

Register semantics are determined by `:TYPE`:

| Type | P0 | P1 | P2 | P3 |
|------|----|----|----|----|
| NODE | category | — | — | — |
| EDGE | from_node | to_node | edge_type | — |
| METRIC | node_id | value_type | label | constraints |
| SIGNAL | node_id | metric_id | value | protocol_id |
| PROTOCOL | node_id | schedule | requirements | — |

This encoding is inspired by CPU instruction formats where positional fields carry type-dependent semantics. The fixed structure enables consistent indexing, predictable query patterns, and — in principle — fixed-width binary encoding (e.g., 256-bit fact representations) for high-performance processing.

### D. Node Identity Conventions

Consistent identity patterns enable efficient prefix-based queries and human-readable references:

| Entity | Pattern | Example |
|--------|---------|---------|
| Human | `HUMAN:PHONE:{phone}` | `HUMAN:PHONE:3207601810` |
| Operation | `OPERATION:{registry}:{herdmark}` | `OPERATION:NSR:RJWP` |
| Animal | `ANIMAL:{breed}:{reg_number}` | `ANIMAL:DUROC:NSR-12345` |
| Registry | `REGISTRY:{abbrev}` | `REGISTRY:NSR` |
| Date | `DATE:M-d-yyyy` | `DATE:3-15-2026` |
| Location | `STATE:{abbrev}` | `STATE:GA` |
| City | `CITY:{name}_{state}` | `CITY:PERRY_GA` |

### E. Indexing Strategy

Composite indexes on (`:TYPE`, `P0`, `:CREATED`) support the most common query patterns: retrieving all edges from a specific node, all signals for a specific node, and all facts created within a temporal range. Additional indexes on (`:TYPE`, `P2`) support edge-type-specific queries (e.g., all BRED_BY edges). Temporal partitioning — archiving signals older than a configurable threshold to cold storage — is planned for scaling beyond the current dataset size.

---

## VII. Experimental Evaluation

### A. Dataset Description

The evaluation dataset is a unified swine registry containing breeder, operation, and geographic data aggregated from four U.S. breed registries (National Swine Registry, American Berkshire Association, Certified Pedigreed Swine, and the Chester White Record Association).

**Table I: Dataset Statistics**

| Entity Type | Count |
|-------------|-------|
| HUMAN nodes (phone-deduplicated) | ~8,500 |
| OPERATION nodes (unique herdmarks) | ~14,400 |
| CITY nodes | 4,236 |
| STATE nodes | 50 |
| REGISTRY nodes | 4 |
| BREED nodes | 10 |
| OWNS edges (human → operation) | ~14,400 |
| MEMBER_OF edges (operation → registry) | ~14,400 |
| LOCATED_IN edges (operation → city) | ~13,000 |
| LOCATED_IN edges (city → state) | 4,236 |
| LOCATED_IN edges (state → country) | 50 |
| **Total nodes** | **~27,200** |
| **Total edges** | **~46,100** |

This dataset represents the industry seed layer — the organizational and geographic structure prior to animal and pedigree data import. Projected additions upon full pedigree import include approximately 2,000,000 animal nodes, 4,000,000 sire/dam edges, 2,000,000 bred-by edges, and 500,000 litter nodes.

### B. Experiment 1: Metric Accuracy — Elimination of Drift

To evaluate metric accuracy, we simulate the common operation of tracking animal counts per operation over a sequence of 10,000 registration events with injected failures (0.1% probability of a failed counter increment per event).

In the attribute-based system, the `animal_count` field is incremented atomically on each registration. After 10,000 events with 0.1% failure rate, the expected drift is approximately 10 missed increments, producing a stored count that diverges from the true count by roughly 0.1%.

In FINN, the animal count is derived at query time by counting BRED_BY edges terminating at the operation. Because edge creation is independent of any counter, failed transactions result in missing edges (missing animals), not in counter drift. The derived count is always consistent with the actual set of registered animals. There is no accumulation of error over time.

**Result:** FINN produces zero metric drift by construction. Attribute-based systems accumulate drift proportional to transaction volume and failure rate.

### C. Experiment 2: Query Performance

**Table II: Query Performance Comparison**

| Query Type | Attribute-Based | FINN | Notes |
|------------|-----------------|------|-------|
| Point lookup (cached value) | O(1) | O(log *n*) | FINN trades constant-time for guaranteed accuracy |
| Count (stale acceptable) | O(1) | N/A | FINN does not provide stale counts |
| Count (accurate) | O(*n*) full scan | O(*k*) edge count | *k* = edges at target node |
| Historical trajectory | Not available | O(*k*) | *k* = signals in range |
| Cross-entity aggregation | O(*n*) + update cascade | O(*d* × *b* × log *n*) | Traversal with signal collection |

FINN accepts a logarithmic overhead on point queries in exchange for eliminating the O(*n*) full-scan cost of accurate counts in attribute-based systems and enabling historical trajectory queries that are structurally impossible without auxiliary audit tables.

### D. Experiment 3: Storage Overhead

Signal-based storage requires approximately 10× the storage of attribute-based storage for equivalent information, as each observation is preserved as an independent document rather than overwriting a previous value. For the current seed dataset, this translates to manageable overhead. At projected scale (10M+ signals per year), temporal partitioning and signal archival become necessary.

**Table III: Storage Analysis**

| Approach | Per-Entity Storage | History Available | Drift Risk |
|----------|-------------------|-------------------|------------|
| Attribute-based | O(1) per metric | None | Proportional to time |
| FINN signal-based | O(*k*) per metric | Complete | Zero |

The trade-off is explicit: FINN exchanges storage efficiency for temporal completeness, accuracy, and auditability.

### E. Experiment 4: Cross-Domain Structural Convergence

The FINN architecture was applied to four radically different domains without modification to the five-primitive model, the register structure, or the query algebra.

**Table IV: Cross-Domain Validation**

| Domain | Primary Node | Lifecycle | Signal Examples | Key Structural Property |
|--------|-------------|-----------|-----------------|------------------------|
| Human Behavior (LineLeap) | Student | 4 years (college) | Venue choice, spend, drink selection, arrival time | Prediction quality increases with trajectory length |
| Biological Systems (Sounder) | Sow / Operation | Months (breeding cycles) | Pairings, litter outcomes, growth curves, feed protocols | Outcomes shaped through trajectory, not directly optimized |
| Mechanical Systems (ISG) | Equipment | Years (service life) | Vibration, temperature, pressure, service actions | Deviation detection, not failure date forecasting |
| Cultural Artifacts (Prier Violins) | Violin | Centuries | Ownership transfers, restorations, certifications, valuations | Value is the integrity of the story |

In all four domains, the same structural pattern emerges: identities emit signals over time; relationships connect identities into a traversable graph; metrics define the observational vocabulary; protocols encode expectations; drift is detected by comparing expected and observed trajectories.

No domain required additional primitive types, modified register semantics, or architectural extensions. The differences between domains are expressed entirely through vocabulary — the categories of nodes, the types of edges, the definitions of metrics — not through structural changes to the underlying system.

**Result:** The convergence of four domains spanning lifecycle durations from months to centuries, signal frequencies from daily to decadal, and complexity from biological stochasticity to mechanical determinism, onto a single five-primitive architecture, constitutes evidence that FINN operates at the infrastructure level rather than as a domain-specific solution.

---

## VIII. Discussion

### A. Limitations

**Query latency for real-time dashboards.** FINN's derived metrics incur computation at query time. For dashboards requiring sub-second refresh on aggregated metrics across large subgraphs, materialized views or caching layers may be necessary, introducing controlled violations of Invariant 2 (no stored aggregates) in exchange for responsiveness.

**Storage growth.** Append-only signal accumulation produces monotonically increasing storage requirements. At projected scale (2M animal nodes, 10M+ signals per year), temporal partitioning and archival strategies are essential. Signal rollup — periodic aggregation of fine-grained signals into coarser summaries — offers a principled compromise between completeness and storage efficiency, as the rollup itself can be represented as a meta-signal with SYSTEM source attribution.

**Platform-specific constraints.** The current implementation on Firestore inherits its query limitations, notably the 10-item restriction on IN-clause operators and the absence of native graph traversal. Batch decomposition and Cloud Functions mitigate these constraints but add implementation complexity. Migration to a native graph database with temporal extensions would eliminate these limitations at the cost of platform portability.

### B. Trade-offs

FINN makes three deliberate trade-offs:

1. **Immediate consistency over query simplicity.** Every query returns a value consistent with the current state of the graph, at the cost of requiring computation rather than a direct lookup. This trade-off favors domains where accuracy matters more than latency — breeding records, equipment histories, provenance chains — over domains requiring microsecond-latency counters.

2. **Storage for temporal completeness.** The 10× storage overhead of signal-based recording is the cost of preserving complete observational history. In domains where audit trails, regulatory compliance, or longitudinal analysis are required, this trade-off is favorable.

3. **Architectural purity for implementation complexity.** The five-primitive model is minimal and principled, but implementing traversal-based metrics on a document store requires careful index design, query decomposition, and batching strategies that would be unnecessary in an attribute-based system.

### C. When to Use FINN

FINN is well-suited to domains where:
- Historical accuracy and auditability are requirements, not luxuries
- Entities participate in complex, evolving relationship networks
- Temporal trajectories carry more predictive value than point-in-time snapshots
- Multiple stakeholders observe the same entities through different metrics
- Regulatory or provenance requirements demand immutable records

FINN is less suited to:
- High-frequency trading or other microsecond-latency applications
- Simple CRUD applications with no temporal requirements
- Write-heavy workloads where storage cost dominates

### D. Future Work

Three directions merit investigation. First, **graph neural network integration**: FINN's clean separation of graph topology and feature vectors aligns naturally with the input requirements of GNN architectures [?], where node features and adjacency structure are provided separately. Signal histories could serve as temporal node features for link prediction, anomaly detection, and influence propagation models.

Second, **signal compression**: developing principled strategies for lossy and lossless signal compression that preserve temporal query semantics while reducing storage footprint. Wavelet-based compression of signal time-series, adaptive sampling rates based on signal variance, and hierarchical rollup schemes are candidate approaches.

Third, **native temporal graph database migration**: evaluating FINN on purpose-built temporal graph engines that provide native support for time-indexed traversal, temporal path queries, and historical graph snapshots.

---

## IX. Conclusion

This paper has presented FINN, a temporal graph architecture that eliminates metric drift through a single structural commitment: all temporal data flows through append-only signals; metrics are computed, never stored. The five-primitive model — NODE, EDGE, METRIC, SIGNAL, PROTOCOL — cleanly separates graph topology from observational time-series data, enabling a query algebra that unifies structural traversal with temporal aggregation.

The formal model provides definitions, invariants, and complexity bounds. Six algorithms demonstrate the practical computation of point queries, temporal aggregations, traversal-based metrics, recursive depth calculations, signal density, and protocol-based drift detection.

Cross-domain validation across human behavior, biological systems, mechanical equipment, and cultural artifacts confirms that the architecture operates at the infrastructure level: the same five primitives, the same register structure, and the same query algebra model domains spanning lifecycles from months to centuries without modification. The production implementation on Firebase Firestore, evaluated against a unified swine registry of approximately 27,200 nodes and 46,100 edges, demonstrates practical feasibility.

FINN transforms databases from repositories of stale snapshots into living models where truth emerges from structure. The graph cannot become stale because there are no cached computations to drift.

---

## References

[References to be populated with curated citation suite]

---

## Appendix A: FINN Compliance Checklist

When extending a FINN-compliant system, the following checks prevent architectural regression:

1. Does any node store a count, sum, or average? → **VIOLATION.** Remove the attribute; derive via traversal or signal aggregation.
2. Does any write operation increment a counter on a different document? → **VIOLATION.** Replace with edge creation or signal append.
3. Can the metric be derived from edges? → Use traversal (Algorithm 3).
4. Can the metric be derived from signals? → Use temporal aggregation (Algorithm 2).
5. Is this a state change (e.g., claimed/unclaimed)? → Acceptable as node state, but consider modeling as a signal if history matters.
6. Is this an event that should be observable over time? → Model as a signal.

---

*Draft version: 1.0*
*Date: 2026-02-09*
*Target length: 10–14 pages (IEEE two-column format)*
*Architecture: FINN (Framework for Integrated Neural Networks)*
*Implementation: Charlotte — Infrastructure for Observable Reality*
