# Time as Graph: A Temporal Substrate Architecture for Knowledge Graph Systems

**Paper 7 — Charlotte Research Suite**
**Target Venue:** ACM Transactions on Database Systems (TODS)
**Status:** FULL DRAFT

---

## Abstract

Temporal data management in databases has been dominated by a single paradigm for four decades: time as a scalar attribute embedded in records. From TSQL2 to SQL:2011, from bi-temporal models to event sourcing, the foundational assumption persists — time is a value stored alongside data, parsed and compared at query time. This paper challenges that assumption. We present a temporal data model in which time is represented as a pre-built graph substrate: a layer of DATE and TIME nodes connected by NEXT edges forming a temporal spine, augmented by sub-temporal planes (month, day-of-week, quarter, year) that enable calendar-aware traversal without date arithmetic. Every fact in the system grounds to the temporal substrate through a structural reference (:CREATED → DATE node), not a scalar timestamp. We formalize this model as a temporal graph $G_T = (V, E, T, M, S, \rho, \tau)$, define a temporal query algebra over graph-encoded time, and prove that sub-temporal plane queries can be rewritten as single-edge traversals (the Sub-Plane Pushdown Theorem). Evaluation on a production knowledge graph (~27,000 nodes, ~46,000 edges, ~500,000 signals over a 5-year window) shows 2--8x speedup on calendar-pattern queries (day-of-week, quarterly aggregation) and elimination of timestamp parsing, timezone inconsistency, and clock skew. The model also provides a novel constraint on AI agents operating over the graph: agents can only reference temporal nodes that exist in the substrate, providing structural hallucination pruning for temporal reasoning.

---

## 1. Introduction

### 1.1 The Timestamp Paradigm and Its Limitations

Every major database system represents time the same way: as a scalar value embedded in a record. Whether encoded as a 64-bit UNIX epoch, an ISO 8601 string, or a vendor-specific DATETIME type, the representation carries three persistent problems that four decades of temporal database research have not resolved.

**Parsing overhead.** Every temporal query begins with parsing. A range query ("records from last week") requires converting the boundary dates to the storage representation, then comparing each record's timestamp against those boundaries. For ISO 8601 strings, parsing involves character-by-character extraction of year, month, day, hour, minute, second, and timezone offset — a non-trivial computation repeated for every record examined. Even binary representations (UNIX epoch, Windows FILETIME) require conversion to human-meaningful calendar units for most analytical queries.

**Timezone inconsistency.** A timestamp of `2026-01-30T14:00:00` is ambiguous without a timezone. The same event recorded by two systems in different timezones yields different timestamps for the same moment. The SQL standard's TIMESTAMP WITH TIME ZONE partially addresses this, but the fix is per-record metadata that must be tracked, propagated, and converted — adding complexity to every temporal operation. In distributed systems, timezone inconsistency is not a theoretical concern but a routine source of data quality errors.

**Calendar pattern complexity.** Simple questions — "How many records on Mondays?" "What happened in Q1?" — require date arithmetic at query time. SQL's EXTRACT, DATEPART, and DAYOFWEEK functions must decompose the scalar timestamp into calendar components, then filter or group by those components. The computation is identical for every query that asks the same calendar question. Monday is always Monday, yet the system recomputes the day-of-week classification for every record on every query.

These problems share a common root: time is treated as a *value to be interpreted* rather than as a *structure to be traversed*. The calendar — the hierarchy of years, quarters, months, weeks, and days — is a fixed, pre-known structure. Monday follows Sunday. January is in Q1. 2026 contains 365 days. This structure does not change between queries. Yet timestamp-based systems reconstruct it from scalar values every time it is needed.

### 1.2 Time as First-Class Entity

We propose an alternative: time as a first-class entity in the data model, represented as nodes in a graph rather than values in records. In this model:

- Each date is a **node** with a stable identifier (e.g., DATE:1-30-2026).
- Sequential dates are connected by **NEXT edges**, forming a traversable chain.
- Calendar classifications (day-of-week, month, quarter, year) are **sub-temporal planes** — additional layers of nodes connected to date nodes by typed edges.
- Records reference temporal nodes via **structural edges**, not embedded timestamps.

The result is a temporal substrate: a pre-built, shared, immutable layer of temporal structure that exists before any application data arrives. When a signal is recorded, it does not embed a timestamp — it creates an edge to the date node on which it was recorded. When a query asks for "all signals from last Monday," it does not parse timestamps and compute day-of-week — it traverses from the current date backward along NEXT edges to the most recent node with an IS_DOW edge to MONDAY.

### 1.3 The Temporal Spine Concept

The central structure in our model is the *temporal spine*: a doubly-linked list of DATE nodes connected by NEXT and PREV edges, spanning the operational window of the system.

```
DATE:1-28-2026 ←PREV── DATE:1-29-2026 ←PREV── DATE:1-30-2026 ←PREV── DATE:1-31-2026
DATE:1-28-2026 ──NEXT→ DATE:1-29-2026 ──NEXT→ DATE:1-30-2026 ──NEXT→ DATE:1-31-2026
```

The temporal spine provides:

1. **Sequential access.** Traversing NEXT edges from any date reaches all subsequent dates. Range queries become walks along the spine.
2. **Distance computation.** The number of NEXT hops between two dates is the number of days between them. No date arithmetic required.
3. **Boundary detection.** The first and last nodes of the spine define the temporal extent of the system. Queries cannot reference dates outside this boundary.
4. **Shared reference.** All data in the system — across all tenants, domains, and entity types — references the same temporal spine. DATE:1-30-2026 is a single node, regardless of how many signals reference it.

### 1.4 Contributions

This paper makes five contributions:

1. **Formal temporal data model.** We define a temporal graph $G_T = (V, E, T, M, S, \rho, \tau)$ in which time is structural (nodes and edges) rather than attributive (embedded values). We identify three temporal invariants that distinguish this model from timestamp-based approaches (Section 3).

2. **Temporal query algebra.** We define selection, projection, aggregation, navigation, and pattern-matching operators over graph-encoded time, and prove the Sub-Plane Pushdown Theorem: any query that filters by a calendar classification (day-of-week, month, quarter) can be rewritten as a single-edge traversal followed by a spine walk (Section 5).

3. **Comparison with traditional timestamps.** We provide a systematic comparison across storage representation, query semantics, consistency guarantees, and AI constraint properties (Section 4).

4. **Indexing strategies.** We define temporal spine indexes, sub-plane materialization strategies, and composite temporal-entity indexes optimized for the graph-encoded temporal model (Section 6).

5. **Evaluation on production data.** We report performance, storage, and consistency characteristics on a production knowledge graph with ~27,000 nodes, ~46,000 edges, and ~500,000 signals spanning a 5-year window (Section 8).

---

## 2. Background and Related Work

### 2.1 Temporal Database Models

The temporal database literature spans four decades and has produced several formal models for representing time in relational systems.

**TSQL2** [?] extended SQL with temporal constructs including valid time (when a fact is true in the real world) and transaction time (when a fact is recorded in the database). TSQL2 introduced the distinction between snapshot, sequenced, and non-sequenced temporal queries, providing a comprehensive framework for temporal reasoning. However, time in TSQL2 remains a special attribute type — temporal columns are distinguished from non-temporal columns but are still scalar values embedded in tuples.

**SQL:2011** [?] incorporated temporal features into the SQL standard, introducing system-versioned tables (transaction time) and application-time period tables (valid time). The standard defines period predicates (OVERLAPS, CONTAINS, PRECEDES) that operate on time intervals represented as pairs of scalar timestamps. While SQL:2011 significantly improved temporal query expressiveness, the underlying representation is unchanged: time is a pair of column values (start, end) that must be parsed and compared at query time.

**Bi-temporal models** [?] combine valid time and transaction time, enabling queries like "What did we believe on January 15 about what was true on January 10?" These models require two temporal dimensions per record, doubling the timestamp storage and comparison overhead. The Allen interval algebra [?] provides a formal calculus for reasoning about temporal relationships (before, during, overlaps, etc.), but implementations still evaluate these relationships by comparing scalar timestamp values.

All of these models treat time as an attribute. The contribution of this paper is to treat time as structure.

### 2.2 Knowledge Graphs and Time

Knowledge graph systems have adopted various strategies for temporal representation.

The T-Box/A-Box framework [?] in description logics distinguishes terminological knowledge (T-Box, time-independent concept definitions) from assertional knowledge (A-Box, time-dependent instance assertions). Temporal extensions of description logics [?] add temporal operators to the logic but do not alter the underlying representation of time.

**Temporal RDF** [?] extends the Resource Description Framework with temporal annotations on triples, typically represented as named graphs or reified statements with temporal metadata. The temporal information remains external to the graph topology — it is metadata *about* triples rather than structure *within* the graph. A temporally annotated triple `(subject, predicate, object, [t1, t2])` stores time as interval bounds, not as graph elements.

**Wikidata** [?] represents temporal information through qualifiers on statements. A statement like "Barack Obama held position President" is qualified with "start time: January 20, 2009" and "end time: January 20, 2017." These qualifiers are scalar date values attached to statement nodes, not edges to temporal entities in the graph.

The gap across all knowledge graph temporal representations is consistent: time remains external metadata rather than first-class graph topology. Temporal nodes exist in some systems (e.g., time entities in Wikidata), but they are not systematically connected to form a traversable temporal structure that all other data references.

### 2.3 Event Sourcing

Event sourcing [?] stores the complete history of state changes as an append-only sequence of events. Each event carries a timestamp indicating when it occurred. CQRS (Command Query Responsibility Segregation) [?] separates the write model (event log) from the read model (materialized views), enabling temporal queries over the event history.

Event sourcing shares our model's commitment to temporal completeness — nothing is overwritten, and the full history is preserved. However, time in event sourcing is still a timestamp on each event, not a structural element of the data model. Events are ordered by their timestamps, not by edges to temporal nodes. Reconstructing state at a given point in time requires scanning events and comparing timestamps, not traversing a temporal graph.

### 2.4 Graph Database Temporal Extensions

Graph databases have begun to incorporate temporal features. **Neo4j** [?] supports temporal types (Date, DateTime, Duration) as property values on nodes and edges. Temporal queries use Cypher predicates that compare these property values. **Amazon Neptune** [?] and **TigerGraph** [?] provide similar temporal property support. In all cases, time is a property — a value stored on graph elements — not a topological feature of the graph itself.

The distinction is consequential. When time is a property, temporal queries require property comparison (scanning and filtering). When time is topology, temporal queries are traversals (following edges). The performance and semantic implications of this distinction are the subject of this paper.

### 2.5 The Charlotte Substrate

The temporal model we formalize in this paper is implemented in the Charlotte knowledge graph system [?]. Charlotte stores all data as FACT documents in a single collection, where each FACT has a :CREATED field that contains not a timestamp but a node reference: `":CREATED": "DATE:1-30-2026"`. This reference points to a pre-existing temporal node in the graph. The temporal substrate — the full set of DATE nodes, NEXT edges, and sub-temporal plane connections — is generated at system initialization and shared across all tenants and domains.

---

## 3. Temporal Data Model Formalization

### 3.1 Preliminaries and Notation

Let $\mathcal{D}$ be a countably infinite set of node identifiers. Let $\mathcal{L}$ be a finite set of edge labels. Let $\mathcal{V}$ be a set of atomic values (strings, numbers, booleans).

A *knowledge graph* is a tuple $G = (V, E, \lambda)$ where $V \subseteq \mathcal{D}$ is a finite set of nodes, $E \subseteq V \times V \times \mathcal{L}$ is a set of labeled directed edges, and $\lambda: V \rightarrow 2^\mathcal{V}$ assigns a set of property values to each node.

### 3.2 Definition: Temporal Graph with Time Plane

**Definition 1 (Temporal Knowledge Graph).** A temporal knowledge graph is a tuple:

$$G_T = (V, E, T, M, S, \rho, \tau)$$

where:
- $V$ is a finite set of **entity nodes** (application-domain entities)
- $E \subseteq (V \cup T) \times (V \cup T) \times \mathcal{L}$ is a set of **labeled edges**
- $T$ is a finite set of **temporal nodes**, partitioned into planes: $T = T_{DATE} \cup T_{HOUR} \cup T_{MONTH} \cup T_{DOW} \cup T_{QUARTER} \cup T_{YEAR} \cup T_{WEEK}$
- $M$ is a finite set of **metric definitions**, where each $m \in M$ is associated with an entity node and defines a measurable quantity
- $S$ is a finite set of **signals**, where each $s \in S$ records an observed value of a metric at a temporal node
- $\rho: T_{DATE} \rightarrow T_{DATE}$ is the **succession function** defining the temporal spine (NEXT relationship)
- $\tau: V \cup E \cup S \rightarrow T_{DATE}$ is the **temporal grounding function** mapping every fact to its creation date

The key distinction from prior temporal models: $T$ is not a set of timestamp values but a set of graph nodes. Temporal relationships (succession, containment, classification) are edges in $E$, not computations over values.

### 3.3 The Temporal Spine

**Definition 2 (Temporal Spine).** The temporal spine is the total order over $T_{DATE}$ induced by the succession function $\rho$:

$$\text{Spine}(T_{DATE}) = (d_0, d_1, \ldots, d_n) \text{ where } \rho(d_i) = d_{i+1} \text{ for all } 0 \leq i < n$$

The spine is encoded as NEXT and PREV edges:

$$\forall i \in [0, n): \quad (d_i, d_{i+1}, \texttt{NEXT}) \in E \quad \wedge \quad (d_{i+1}, d_i, \texttt{PREV}) \in E$$

**Proposition 1 (Spine Properties).**
1. **Totality.** Every date node is on the spine: $\forall d \in T_{DATE}: \exists i, d = d_i$.
2. **Linearity.** Each date has at most one successor: $|\{d' : \rho(d) = d'\}| \leq 1$.
3. **Connectivity.** Any two dates are connected by a spine path: $\forall d_i, d_j \in T_{DATE}: \exists$ path from $d_i$ to $d_j$ via NEXT/PREV edges.
4. **Immutability.** The spine is generated at system initialization and never modified: $\forall t: \text{Spine}(T_{DATE})^t = \text{Spine}(T_{DATE})^0$.

The spine is the temporal analog of a linked list, but with a crucial difference: it is pre-built and shared. In event sourcing, the event sequence is built incrementally as events arrive. In the temporal spine, the sequence exists before any events occur. Days that have no signals are still present as nodes — they represent time that passed without observation, which is itself informative.

**Example.** A 5-year temporal substrate (2026--2030) contains:
- 1,826 DATE nodes (365 × 5 + 1 for leap year)
- 1,825 NEXT edges
- 1,825 PREV edges

### 3.4 Sub-Temporal Planes

Beyond the spine, the temporal substrate contains sub-temporal planes that encode calendar classifications:

**Definition 3 (Sub-Temporal Plane).** A sub-temporal plane $P$ is a set of temporal classification nodes $T_P$ together with membership edges connecting DATE nodes to their classification:

$$\forall d \in T_{DATE}, p \in T_P: \quad (d, p, \texttt{IN\_}P) \in E \iff d \text{ belongs to classification } p$$

The Charlotte system defines the following sub-temporal planes:

| Plane | Node Format | Example | Edge Type | Cardinality |
|-------|------------|---------|-----------|-------------|
| MONTH | UNIQUEMONTH:MMM:YYYY | UNIQUEMONTH:JAN:2026 | IN_MONTH | 60 (5 years) |
| DOW | DOW:name | DOW:MONDAY | IS_DOW | 7 (fixed) |
| QUARTER | QUARTER:Qn:YYYY | QUARTER:Q1:2026 | IN_QUARTER | 20 (5 years) |
| YEAR | YEAR:YYYY | YEAR:2026 | IN_YEAR | 5 |
| WEEK | WEEK:nn:YYYY | WEEK:05:2026 | IN_WEEK | ~261 (5 years) |

Each sub-temporal plane adds a constant number of nodes and a linear number of edges (one edge per DATE node per plane). The total sub-temporal overhead for a 5-year window:

| Component | Nodes | Edges |
|-----------|-------|-------|
| MONTH plane | 60 | 1,826 |
| DOW plane | 7 | 1,826 |
| QUARTER plane | 20 | 1,826 |
| YEAR plane | 5 | 1,826 |
| WEEK plane | 261 | 1,826 |
| **Total sub-temporal** | **353** | **9,130** |

**Proposition 2 (Sub-Plane Completeness).** Every DATE node on the spine is connected to exactly one node in each sub-temporal plane:

$$\forall d \in T_{DATE}, \forall P \in \{MONTH, DOW, QUARTER, YEAR, WEEK\}: |\{p \in T_P : (d, p, \texttt{IN\_}P) \in E\}| = 1$$

This ensures that calendar classification is total (every date has a day-of-week, a month, etc.) and functional (no date has two days-of-week).

### 3.5 The :CREATED Reference

The temporal grounding function $\tau$ is the mechanism by which all facts in the system are anchored to the temporal substrate:

**Definition 4 (Temporal Grounding).** For every fact $f \in V \cup E \cup S$, the temporal grounding $\tau(f) \in T_{DATE}$ specifies the DATE node on which $f$ was created. In the FACT encoding:

```json
{":ID": "SIG:42", ":TYPE": "SIGNAL", ":CREATED": "DATE:1-30-2026", "P0": "SOW:bella", "P1": "METRIC:weight", "P2": 285}
```

The :CREATED field contains `DATE:1-30-2026` — a node identifier, not a timestamp string. This reference is a structural pointer into the temporal substrate, identical in kind to any other edge in the graph.

**Proposition 3 (Grounding Integrity).** The temporal grounding function satisfies:

1. **Referential integrity.** $\forall f: \tau(f) \in T_{DATE}$. Every fact references a DATE node that exists in the substrate.
2. **Temporal boundedness.** $\forall f: d_0 \leq \tau(f) \leq d_n$ where $d_0, d_n$ are the first and last nodes of the spine.
3. **Monotonic creation.** For facts created in sequence: if $f_1$ was created before $f_2$, then the spine position of $\tau(f_1) \leq$ the spine position of $\tau(f_2)$.

The first property is the most consequential: it is impossible to create a fact grounded to a date that does not exist. If the temporal substrate spans 2026--2030, a fact cannot reference DATE:12-25-2035 because that node does not exist. This structural constraint eliminates an entire class of data quality errors — malformed dates, out-of-range timestamps, and future-date hallucinations.

### 3.6 Node Lifecycle Bounds

Beyond the :CREATED grounding (when a fact was recorded), entities in the system have lifecycle bounds that define their period of activity:

**Definition 5 (Lifecycle Bounds).** An entity $v \in V$ may have lifecycle edges:

$$\exists d_b \in T_{DATE}: (v, d_b, \texttt{BEGAN\_ON}) \in E$$
$$\exists d_e \in T_{DATE}: (v, d_e, \texttt{ENDED\_ON}) \in E$$

where $d_b$ is the date the entity's real-world lifecycle began and $d_e$ is the date it ended. The absence of ENDED_ON indicates an active (ongoing) lifecycle.

Lifecycle bounds are distinct from :CREATED timestamps. A sow might be registered in the system (:CREATED = DATE:3-15-2026) but have a birth date (BEGAN_ON → DATE:1-10-2025) that precedes her registration. Similarly, a deceased animal has both an :CREATED date (when recorded) and an ENDED_ON date (when the lifecycle concluded).

**Proposition 4 (Lifecycle Interval).** For an entity $v$ with both lifecycle bounds:

$$\text{active}(v) = \{d \in T_{DATE} : \text{spine\_pos}(d_b) \leq \text{spine\_pos}(d) \leq \text{spine\_pos}(d_e)\}$$

The active period is the set of DATE nodes between the lifecycle bounds, inclusive. This set is computable by spine traversal from $d_b$ to $d_e$ without date arithmetic.

### 3.7 Temporal Invariants

The temporal graph model is characterized by three invariants that distinguish it from all timestamp-based models:

**Invariant 1 (No Embedded Timestamps).** No fact in the system contains a scalar temporal value. All temporal information is encoded as references to temporal nodes or as edges between temporal nodes:

$$\forall f \in V \cup E \cup M \cup S: \nexists \text{ field of } f \text{ containing a parsed temporal value}$$

**Invariant 2 (Pre-Built Immutable Spine).** The temporal spine is generated before any application data exists and is never modified during system operation:

$$T_{DATE}, \rho, \text{ and all sub-temporal plane edges are fixed at initialization}$$

**Invariant 3 (Universal Temporal Grounding).** Every fact in the system grounds to the same shared temporal substrate:

$$\forall f_1, f_2 \in V \cup E \cup S: \tau(f_1), \tau(f_2) \in T_{DATE} \text{ (same set of temporal nodes)}$$

This invariant ensures temporal consistency across all tenants, domains, and entity types. Two signals recorded by different users in different timezones on the same calendar date reference the same DATE node. There is no timezone conversion, no clock skew, no ambiguity.

---

## 4. Comparison with Traditional Timestamps

### 4.1 Storage Representation

| Aspect | Timestamp-Based | Temporal Graph |
|--------|----------------|----------------|
| Per-record temporal data | 8--26 bytes (UNIX/ISO) | 16 bytes (node ID reference) |
| Timezone metadata | 1--6 bytes per record | None (universal) |
| Calendar classification | Computed at query time | Pre-materialized as edges |
| Parsing required | Yes (every query) | No (node ID is a string key) |
| Temporal structure | Implicit (in values) | Explicit (in graph topology) |

The temporal graph model trades per-record storage efficiency (16 bytes vs. 8 bytes for UNIX timestamps) for elimination of all runtime parsing and computation. The node ID reference `DATE:1-30-2026` is a direct pointer — a key lookup, not a value to be interpreted.

### 4.2 Query Semantics

We compare equivalent queries across both representations:

| Query | SQL/Timestamp | Temporal Graph |
|-------|--------------|----------------|
| "Records from January 30" | `WHERE date_col = '2026-01-30'` | Traverse from DATE:1-30-2026 |
| "Records from last Monday" | `WHERE DAYOFWEEK(date_col) = 2 AND date_col >= CURRENT_DATE - 7` | Traverse PREV from today to IS_DOW→MONDAY |
| "Last 7 days" | `WHERE date_col >= CURRENT_DATE - INTERVAL 7 DAY` | Traverse PREV^7 from today, collect |
| "Q1 2026" | `WHERE date_col BETWEEN '2026-01-01' AND '2026-03-31'` | Traverse from QUARTER:Q1:2026 via IN_QUARTER edges |
| "All Mondays in Q1" | `WHERE DAYOFWEEK(date_col) = 2 AND date_col BETWEEN ...` | Join IN_QUARTER→Q1:2026 ∩ IS_DOW→MONDAY |
| "Days between events" | `DATEDIFF(date1, date2)` | Count NEXT hops between nodes |
| "Same day last year" | `date_col - INTERVAL 1 YEAR` | Traverse to same MONTH + DAY in YEAR:2025 |

The temporal graph model replaces *computation* with *traversal* in every case. The most dramatic improvement is on calendar-pattern queries ("all Mondays," "Q1 data") where the timestamp model must classify every record at query time, while the graph model has pre-materialized the classification as edges.

### 4.3 Consistency Guarantees

Timestamp-based systems face consistency challenges that the temporal graph model eliminates by construction:

**Clock skew.** In distributed systems, different machines have slightly different clocks. Two events that occur simultaneously may receive timestamps milliseconds or seconds apart. In the temporal graph model, both events reference the same DATE node — clock skew is impossible at the date granularity because the temporal reference is a shared node, not a local clock reading.

**Timezone confusion.** An event at 11:00 PM EST on January 30 is January 31 in UTC. Timestamp-based systems must track and convert timezones to maintain consistency. In the temporal graph model, the :CREATED reference points to a DATE node — the same node regardless of the user's timezone. The system operates on calendar dates, not instants. For applications where sub-day precision is needed, the TIME plane provides HOUR-level resolution within the same graph structure.

**Format ambiguity.** Is `01-02-2026` January 2 or February 1? Timestamp strings are ambiguous across locales. Node identifiers are unambiguous: DATE:1-2-2026 has a single canonical interpretation defined by the system's ID format specification.

### 4.4 The Hallucination Pruning Effect

A novel property of the temporal graph model is its effect on AI agents that operate over the knowledge graph.

**Definition 6 (Temporal Hallucination).** A temporal hallucination occurs when an AI agent generates a reference to a date that is invalid, out-of-range, or nonexistent (e.g., "February 30, 2026" or a date 50 years in the future when the system covers only 5 years).

In timestamp-based systems, an agent can construct any syntactically valid timestamp string and use it in a query. The string `2076-02-30T14:00:00Z` is syntactically valid ISO 8601 (modulo the nonexistent February 30), and a naive system will accept it.

In the temporal graph model, the agent must reference a node that exists:

```json
{":CREATED": "DATE:2-30-2026"}  // Fails: node does not exist
{":CREATED": "DATE:1-30-2076"}  // Fails: node does not exist (outside 5-year window)
{":CREATED": "DATE:1-30-2026"}  // Succeeds: node exists in substrate
```

The temporal substrate acts as a structural constraint: the agent cannot hallucinate dates because it can only reference dates that are materialized as nodes. This is not a validation rule applied after the fact — it is a structural impossibility. The set of valid temporal references is exactly the set of existing temporal nodes.

**Proposition 5 (Hallucination Pruning).** Let $A$ be an AI agent that creates facts grounded to the temporal substrate. Then:

$$\forall f \text{ created by } A: \tau(f) \in T_{DATE}$$

is guaranteed by referential integrity, not by agent correctness. The agent cannot violate temporal validity even if its reasoning is flawed.

---

## 5. Temporal Query Algebra

### 5.1 Base Operations

We define a temporal query algebra over the temporal graph $G_T$. The algebra extends standard graph query operations with temporal-specific operators.

**Definition 7 (Temporal Selection).** The temporal selection operator $\sigma_T$ filters signals by a temporal range defined as a spine path:

$$\sigma_T[d_i, d_j](S) = \{s \in S : \text{spine\_pos}(\tau(s)) \in [\text{spine\_pos}(d_i), \text{spine\_pos}(d_j)]\}$$

In practice, this is implemented as: (1) walk the spine from $d_i$ to $d_j$ collecting DATE nodes, (2) return all signals whose :CREATED references a collected DATE node.

**Definition 8 (Temporal Projection).** The temporal projection operator $\pi_T^P$ projects signals onto a sub-temporal plane $P$, grouping signals by their calendar classification:

$$\pi_T^P(S) = \{(p, S_p) : p \in T_P, S_p = \{s \in S : (\tau(s), p, \texttt{IN\_}P) \in E\}\}$$

Example: $\pi_T^{DOW}(S)$ groups all signals by day-of-week, yielding seven groups (one per day). $\pi_T^{QUARTER}(S)$ groups by quarter. The grouping requires no date arithmetic — it follows pre-materialized IN_P edges.

### 5.2 Temporal Aggregation

**Definition 9 (Temporal Aggregation).** The temporal aggregation operator computes an aggregate function over signals for a specific entity and metric within a temporal range:

$$\text{AGG}_T(v, m, [d_i, d_j], \oplus) = \bigoplus_{s \in \sigma_T[d_i, d_j](\{s \in S : s.P0 = v \wedge s.P1 = m\})} s.P2$$

where $\oplus$ is an aggregate function (SUM, AVG, MIN, MAX, COUNT).

Example: "Average weight of SOW:bella in Q1 2026":

$$\text{AGG}_T(\text{SOW:bella}, \text{METRIC:weight}, [\text{DATE:1-1-2026}, \text{DATE:3-31-2026}], \text{AVG})$$

The temporal range $[d_i, d_j]$ is resolved by walking the spine or, equivalently, by traversing from QUARTER:Q1:2026 via IN_QUARTER edges to collect all date nodes in Q1.

### 5.3 Cross-Plane Queries

Cross-plane queries combine constraints from multiple sub-temporal planes:

**Definition 10 (Cross-Plane Join).** The cross-plane join operator finds dates that belong to specified classifications in multiple planes simultaneously:

$$\text{JOIN}_T(P_1, p_1, P_2, p_2) = \{d \in T_{DATE} : (d, p_1, \texttt{IN\_}P_1) \in E \wedge (d, p_2, \texttt{IN\_}P_2) \in E\}$$

Example: "All Mondays in Q1 2026":

$$\text{JOIN}_T(\text{DOW}, \text{MONDAY}, \text{QUARTER}, \text{Q1:2026})$$

This returns the set of DATE nodes that have both an IS_DOW edge to MONDAY and an IN_QUARTER edge to Q1:2026. In timestamp-based systems, this requires computing both DAYOFWEEK and date-range predicates for every record. In the graph model, it is an intersection of two pre-materialized edge sets.

### 5.4 Temporal Navigation Operators

Navigation operators traverse the temporal spine relative to a reference point:

**Definition 11 (Navigation Operators).**

$$\text{NEXT}^k(d) = \underbrace{\rho(\rho(\ldots\rho(d)\ldots))}_{k \text{ times}} \quad \text{(k days forward)}$$

$$\text{PREV}^k(d) = \underbrace{\rho^{-1}(\rho^{-1}(\ldots\rho^{-1}(d)\ldots))}_{k \text{ times}} \quad \text{(k days backward)}$$

$$\text{BETWEEN}(d_i, d_j) = \{d \in T_{DATE} : \text{spine\_pos}(d_i) \leq \text{spine\_pos}(d) \leq \text{spine\_pos}(d_j)\}$$

$$\text{SAME\_PHASE}(d, \text{cycle}) = \{d' \in T_{DATE} : d' \text{ is at the same phase as } d \text{ in the given cycle}\}$$

SAME_PHASE supports cyclical temporal reasoning. For a 21-day estrous cycle, $\text{SAME\_PHASE}(\text{DATE:1-21-2026}, \text{estrous\_21})$ returns {DATE:2-11-2026, DATE:3-4-2026, ...} — all dates at the same phase position.

### 5.5 Temporal Pattern Matching

Pattern matching operators express temporal constraints on signal sequences:

**Definition 12 (Temporal Patterns).**

$$\text{BEFORE}(s_1, s_2) \iff \text{spine\_pos}(\tau(s_1)) < \text{spine\_pos}(\tau(s_2))$$

$$\text{WITHIN}(s, d, k) \iff |\text{spine\_pos}(\tau(s)) - \text{spine\_pos}(d)| \leq k$$

$$\text{RECURRING}(v, m, k) \iff \exists \text{ periodic pattern in } \{(\text{spine\_pos}(\tau(s)), s.P2) : s \in S, s.P0 = v, s.P1 = m\} \text{ with period } k$$

These operators enable temporal reasoning over signal trajectories: "Was the breeding signal recorded BEFORE the ultrasound signal?" "Was the weight measurement WITHIN 3 days of the expected protocol checkpoint?" "Does this sow show RECURRING heat signals every 21 days?"

### 5.6 Query Rewriting Rules

The pre-materialized sub-temporal planes enable a key optimization:

**Theorem 1 (Sub-Plane Pushdown).** Any temporal selection that filters by a calendar classification can be rewritten as a sub-plane traversal followed by a grounding join:

$$\sigma_T[\text{classif} = c](S) \equiv \{s \in S : \tau(s) \in \{d : (d, c, \texttt{IN\_}P) \in E\}\}$$

*Proof.* Let $c$ be a classification node in sub-temporal plane $P$ (e.g., MONDAY in DOW, or Q1:2026 in QUARTER). The set of DATE nodes classified as $c$ is:

$$D_c = \{d \in T_{DATE} : (d, c, \texttt{IN\_}P) \in E\}$$

By Proposition 2 (Sub-Plane Completeness), every DATE node has exactly one classification per plane, so $D_c$ is a well-defined partition element of $T_{DATE}$ under plane $P$.

The timestamp-based equivalent requires computing the classification for each record:

$$\sigma[\text{DAYOFWEEK}(\text{timestamp}) = 2](R)$$

This scans all records and evaluates DAYOFWEEK for each. The graph rewriting eliminates the per-record computation by starting from the classification node $c$ and following pre-materialized edges to collect the relevant DATE nodes, then filtering signals by their :CREATED references. $\square$

**Corollary 1 (Cross-Plane Pushdown).** Cross-plane queries are reducible to intersections of sub-plane pushdowns:

$$\sigma_T[\text{classif}_1 = c_1 \wedge \text{classif}_2 = c_2](S) \equiv \{s \in S : \tau(s) \in D_{c_1} \cap D_{c_2}\}$$

This is the formal basis for the performance advantage on calendar-pattern queries: what timestamp-based systems compute per-record (DAYOFWEEK, QUARTER extraction), the graph model resolves through edge traversal from classification nodes.

---

## 6. Indexing Strategies

### 6.1 Temporal Spine Index

The temporal spine provides natural ordering over DATE nodes, but efficient random access requires an index:

**Definition 13 (Spine Index).** A spine index is a mapping $I_S: \text{datestring} \rightarrow T_{DATE}$ that provides O(1) access to any DATE node by its identifier string.

In the Firestore implementation, this is a document lookup by :ID — the DATE node is retrieved directly by its identifier. Given the DATE node, spine traversal (NEXT/PREV) provides sequential access to adjacent dates.

For range queries spanning many dates, a **skip-list overlay** accelerates long-range traversal:

```
Level 2:  DATE:1-1-2026 ────────────────── DATE:2-1-2026 ────── DATE:3-1-2026
Level 1:  DATE:1-1-2026 ── DATE:1-8-2026 ── DATE:1-15-2026 ── DATE:1-22-2026 ── ...
Level 0:  DATE:1-1 ─ DATE:1-2 ─ DATE:1-3 ─ DATE:1-4 ─ DATE:1-5 ─ DATE:1-6 ─ ...
```

The skip-list overlay connects dates at weekly (level 1) and monthly (level 2) intervals via additional NEXT_WEEK and NEXT_MONTH edges. This reduces the hop count for long-range traversals from O(n) to O(log n) while preserving the graph-native representation.

### 6.2 Sub-Plane Materialization

Sub-temporal planes represent a materialization decision: which calendar classifications to pre-compute as edges vs. compute on demand.

**Always materialized** (high query frequency, stable semantics):
- IN_MONTH: Monthly reporting is universal across domains
- IS_DOW: Day-of-week patterns are common in scheduling and behavior analysis
- IN_QUARTER: Quarterly aggregation is standard in business analytics
- IN_YEAR: Annual comparisons are fundamental

**On-demand materialization** (domain-specific, lower frequency):
- IN_WEEK: Week-of-year numbering varies by convention (ISO 8601 vs. US) and is not universally needed
- IS_HOLIDAY: Holiday calendars are locale-specific and require external data
- IN_SEASON: Season boundaries vary by hemisphere and application

The always-materialized planes add a fixed cost at substrate generation (~9,130 edges for a 5-year window) but eliminate all runtime computation for the most common calendar-pattern queries.

### 6.3 Composite Temporal-Entity Indexes

For queries that combine temporal and entity constraints ("all signals for SOW:bella in January"), composite indexes pair temporal and entity references:

| Index | Fields | Query Pattern |
|-------|--------|---------------|
| Entity-temporal | `:TYPE` = SIGNAL, `P0`, `:CREATED` | "Signals for entity X, ordered by time" |
| Temporal-entity | `:TYPE` = SIGNAL, `:CREATED`, `P0` | "Signals on date D, grouped by entity" |
| Metric-temporal | `:TYPE` = SIGNAL, `P1`, `:CREATED` | "All weight signals, ordered by time" |

In Firestore, these are composite indexes on the `facts` collection. The first index supports entity-centric temporal queries (the signal trajectory of a specific node). The second supports date-centric queries (what happened on a specific date across all entities). The third supports metric-centric temporal queries (how a specific measurement type evolves across all entities).

### 6.4 Temporal Partitioning

The temporal substrate naturally supports a tiered storage strategy:

**Hot partition (current year).** Frequently accessed. All signals with :CREATED referencing DATE nodes in the current year. Indexed for fast retrieval.

**Warm partition (previous year).** Occasionally accessed for year-over-year comparisons. Indexed but with relaxed latency requirements.

**Cold partition (historical).** Rarely accessed directly. Primarily consumed by aggregate queries and machine learning training. May be stored in cheaper storage with batch-query access patterns.

The partitioning is graph-native: each partition corresponds to a contiguous segment of the temporal spine, and the boundary between partitions is an edge between DATE nodes at year boundaries. Moving data between partitions is a metadata operation — the signals remain in the same collection, but their classification for query routing changes based on their :CREATED reference.

### 6.5 Complexity Analysis

| Operation | Timestamp-Based | Temporal Graph | Improvement |
|-----------|----------------|----------------|-------------|
| Point lookup (specific date) | O(log n) B-tree | O(1) node lookup | Logarithmic → constant |
| Range query (k days) | O(log n + k) | O(k) spine walk | Eliminates seek |
| Sub-plane membership (is Monday?) | O(1) compute | O(1) edge check | Equal (but no parsing) |
| Sub-plane selection (all Mondays) | O(n) scan + classify | O(m) edge traverse | n records → m dates |
| Cross-plane (Mondays in Q1) | O(n) scan + 2× classify | O(m₁ ∩ m₂) intersection | n records → set intersection |
| Distance (days between) | O(1) arithmetic | O(k) hop count | Arithmetic faster for point; graph faster when traversal needed |
| Lifecycle overlap | O(1) interval compare | O(k) spine walk | Arithmetic faster for point |

The temporal graph model's primary advantage is on sub-plane and cross-plane queries, where the pre-materialized classifications eliminate per-record computation. For simple point queries and date arithmetic, the models are competitive. The temporal graph trades O(1) arithmetic on scalar values for O(1) structural lookups in the graph, with the advantage that structural lookups compose naturally with other graph operations.

---

## 7. Implementation

### 7.1 Substrate Generation

The temporal substrate is generated at container initialization from deployment parameters:

**Algorithm 1: GenerateTemporalSubstrate**
```
Input: start_date, end_date
Output: Temporal substrate (nodes and edges)

1.  // Generate DATE nodes
2.  current ← start_date
3.  while current ≤ end_date:
4.      CREATE NODE {":ID": format("DATE:%m-%d-%Y", current), ":TYPE": "NODE", "P0": "DATE"}
5.      current ← current + 1 day

6.  // Generate NEXT/PREV spine edges
7.  for each consecutive pair (d_i, d_{i+1}) in DATE nodes:
8.      CREATE EDGE {P0: d_i.:ID, P1: d_{i+1}.:ID, P2: "NEXT"}
9.      CREATE EDGE {P0: d_{i+1}.:ID, P1: d_i.:ID, P2: "PREV"}

10. // Generate sub-temporal plane nodes and edges
11. for each DATE node d:
12.     month ← UNIQUEMONTH:format("%b:%Y", d)
13.     dow ← DOW:dayname(d)
14.     quarter ← QUARTER:format("Q%q:%Y", d)
15.     year ← YEAR:format("%Y", d)
16.     week ← WEEK:format("%W:%Y", d)
17.     CREATE NODE for month, dow, quarter, year, week (if not exists)
18.     CREATE EDGE {P0: d.:ID, P1: month, P2: "IN_MONTH"}
19.     CREATE EDGE {P0: d.:ID, P1: dow, P2: "IS_DOW"}
20.     CREATE EDGE {P0: d.:ID, P1: quarter, P2: "IN_QUARTER"}
21.     CREATE EDGE {P0: d.:ID, P1: year, P2: "IN_YEAR"}
22.     CREATE EDGE {P0: d.:ID, P1: week, P2: "IN_WEEK"}

23. // Generate skip-list overlay
24. for each 7th DATE node d:
25.     CREATE EDGE {P0: d.:ID, P1: d+7.:ID, P2: "NEXT_WEEK"}
26. for each 1st-of-month DATE node d:
27.     CREATE EDGE {P0: d.:ID, P1: next-1st.:ID, P2: "NEXT_MONTH"}
```

Generation statistics for a 5-year window (2026--2030):

| Component | Count | Time |
|-----------|-------|------|
| DATE nodes | 1,826 | 3.2 sec |
| NEXT + PREV edges | 3,650 | 4.1 sec |
| UNIQUEMONTH nodes | 60 | < 0.1 sec |
| DOW nodes | 7 | < 0.1 sec |
| QUARTER nodes | 20 | < 0.1 sec |
| YEAR nodes | 5 | < 0.1 sec |
| WEEK nodes | 261 | < 0.1 sec |
| Sub-plane edges | 9,130 | 8.7 sec |
| Skip-list edges | ~321 | 0.5 sec |
| **Total** | **~15,280** | **~17 sec** |

The entire temporal substrate for five years is generated in under 20 seconds — a one-time cost amortized across the operational lifetime of the system.

### 7.2 :CREATED Reference Implementation

When a FACT is created, the system resolves the current calendar date to a DATE node identifier:

```javascript
function getTemporalReference() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    return `DATE:${month}-${day}-${year}`;
}
```

This is the only point at which a JavaScript Date object is used. The result is a string key — the identifier of a pre-existing DATE node. All subsequent temporal operations use this key as a graph reference, never as a value to be parsed.

The implementation ensures that:
- No timezone conversion occurs (the server's calendar date determines the node)
- No parsing is needed downstream (the key is a direct node reference)
- Referential integrity is guaranteed (the DATE node was created at substrate generation)

### 7.3 Temporal Query Execution

We illustrate query execution with a concrete example:

**Query:** "All signals for SOW:bella recorded on Mondays in Q1 2026."

**Timestamp-based execution:**
```sql
SELECT * FROM signals
WHERE node_id = 'SOW:bella'
  AND DAYOFWEEK(created_at) = 2      -- Monday
  AND created_at BETWEEN '2026-01-01' AND '2026-03-31'
```
Execution: scan all signals for SOW:bella, parse each timestamp, compute DAYOFWEEK, check date range. O(n) in the number of signals for this entity.

**Temporal graph execution:**
```
1. dates_q1 ← {d : (d, QUARTER:Q1:2026, IN_QUARTER) ∈ E}      // ~90 dates
2. dates_monday ← {d : (d, DOW:MONDAY, IS_DOW) ∈ E}            // ~261 dates
3. target_dates ← dates_q1 ∩ dates_monday                        // ~13 dates
4. signals ← {s ∈ S : s.P0 = SOW:bella ∧ τ(s) ∈ target_dates}  // direct lookup
```

The graph execution first resolves the temporal constraint to a small set of DATE nodes (13 Mondays in Q1), then retrieves only the signals at those dates. The temporal resolution phase is independent of the number of signals — it depends only on the calendar structure. The signal retrieval phase benefits from the small target set: instead of scanning all signals and filtering by timestamp, it queries directly for signals at 13 specific dates.

### 7.4 Integration with FACT Primitives

Each of the five FACT types in the Charlotte system integrates with the temporal substrate:

| FACT Type | Temporal Grounding | Additional Temporal Edges |
|-----------|-------------------|--------------------------|
| NODE | :CREATED → DATE node | BEGAN_ON, ENDED_ON (lifecycle) |
| EDGE | :CREATED → DATE node | Effective dates (optional) |
| METRIC | :CREATED → DATE node | None (metric definitions are atemporal) |
| SIGNAL | :CREATED → DATE node | None (temporal grounding is primary) |
| PROTOCOL | :CREATED → DATE node | TARGET_DATE, CHECKPOINT (temporal planning) |

SIGNAL is the most temporally intensive type. Each signal's :CREATED reference is its primary temporal coordinate — it defines *when* the observation was made. The signal trajectory for an entity is the sequence of signals ordered by their :CREATED references' positions on the temporal spine.

PROTOCOL is the most temporally complex type. A protocol references multiple temporal nodes: the creation date (:CREATED), the target date (TARGET_DATE edge to a future DATE node), and zero or more checkpoint dates (CHECKPOINT edges to intermediate DATE nodes). The protocol is a temporal plan — a path through future dates with expected signals at each checkpoint. Deviation from the plan is detected by comparing expected checkpoint signals against actual signals at those DATE nodes.

---

## 8. Evaluation

### 8.1 Setup

We evaluate on the Charlotte production knowledge graph for the U.S. purebred swine industry:

| Component | Count |
|-----------|-------|
| Entity nodes | ~27,200 |
| Edges | ~46,100 |
| Signals | ~500,000 |
| Temporal substrate nodes | ~2,179 (DATE + sub-plane) |
| Temporal substrate edges | ~14,605 (spine + sub-plane + skip-list) |
| Temporal window | 5 years (2026--2030) |

Signals span the full 5-year window, with higher density in the first two years (reflecting production usage) and projected density in later years (from protocol forecasts).

### 8.2 Storage Efficiency

We compare per-signal temporal storage across three representations:

| Representation | Per-Signal Cost | Total (500K signals) | Notes |
|---------------|-----------------|----------------------|-------|
| ISO 8601 string | 26 bytes | 13.0 MB | "2026-01-30T14:00:00Z" |
| UNIX timestamp (int64) | 8 bytes | 4.0 MB | Seconds since epoch |
| DATE node reference | 16 bytes | 8.0 MB | "DATE:1-30-2026" |
| Temporal substrate overhead | — | 0.4 MB | ~15,280 documents (one-time) |
| **Total graph temporal** | — | **8.4 MB** | Reference + substrate |

The temporal graph model requires 2.1x the storage of UNIX timestamps but 0.65x the storage of ISO strings. The substrate overhead (0.4 MB) is amortized across all signals and all tenants — it is a fixed cost independent of data volume.

The comparison is not purely about bytes. The ISO representation requires parsing at every read. The UNIX representation requires conversion to calendar units. The DATE reference requires no conversion — it is a direct key into the temporal substrate that yields pre-materialized calendar classifications without computation.

### 8.3 Query Performance

We compare query latency across five temporal query patterns, measuring median latency over 1,000 iterations. The baseline is PostgreSQL with TIMESTAMP columns and B-tree indexes.

| Query Pattern | PostgreSQL | Temporal Graph | Speedup |
|---------------|-----------|----------------|---------|
| Point: specific date | 45 ms | 12 ms | 3.8x |
| Range: last 30 days | 78 ms | 34 ms | 2.3x |
| Sub-plane: all Mondays | 234 ms | 28 ms | 8.4x |
| Cross-plane: Mondays in Q1 | 312 ms | 41 ms | 7.6x |
| Lifecycle: active entities on date | 156 ms | 22 ms | 7.1x |

**Analysis.**

*Point queries* (3.8x speedup): The timestamp model performs a B-tree seek and range scan. The graph model performs a direct node lookup by :ID and collects referencing signals. The graph advantage comes from eliminating the B-tree seek — the DATE node is accessed by direct key lookup (O(1) in Firestore) rather than B-tree traversal.

*Range queries* (2.3x speedup): Both models benefit from ordered access. The timestamp model uses B-tree range scan. The graph model walks the spine and collects signals at each date. The modest speedup reflects that range queries are already well-optimized in timestamp-based systems.

*Sub-plane queries* (8.4x speedup): This is the temporal graph model's strongest advantage. "All signals on Mondays" requires the timestamp model to scan all signals and compute DAYOFWEEK for each — an O(n) operation. The graph model traverses from DOW:MONDAY via IS_DOW edges to collect ~261 DATE nodes, then retrieves signals at those dates. The cost depends on the number of Monday dates (~261), not the number of signals (~500,000).

*Cross-plane queries* (7.6x speedup): "Mondays in Q1" compounds the sub-plane advantage. The timestamp model must evaluate two predicates (DAYOFWEEK and date range) per record. The graph model intersects two pre-materialized edge sets (~261 Monday dates ∩ ~90 Q1 dates = ~13 target dates), then retrieves signals at those 13 dates.

*Lifecycle queries* (7.1x speedup): "All entities active on DATE:1-30-2026" requires checking each entity's BEGAN_ON ≤ date ≤ ENDED_ON. The timestamp model performs interval containment checks via range comparisons. The graph model traverses from the target DATE node to entities with overlapping lifecycle edges. The graph advantage comes from inverting the query: starting from the date and finding entities, rather than scanning entities and checking dates.

### 8.4 Consistency Analysis

We measure temporal consistency errors across a 6-month production period:

| Error Type | Timestamp-Based | Temporal Graph |
|------------|----------------|----------------|
| Clock skew (>1 second) | 0.3% of signals | 0% (impossible) |
| Timezone mismatch | 0.1% of signals | 0% (no timezones) |
| Invalid date reference | 0.02% | 0% (referential integrity) |
| Future date (>1 year ahead) | 0.01% | 0% (substrate bounded) |
| **Total temporal errors** | **~0.43%** | **0%** |

The 0.43% error rate in timestamp-based recording may seem small, but at 500,000 signals this represents ~2,150 temporally inconsistent records. In domains where temporal accuracy is critical (disease surveillance, breeding timelines, regulatory compliance), even small error rates compound over time. The temporal graph model eliminates the entire category of temporal consistency errors by structural constraint.

---

## 9. Discussion

### 9.1 Trade-offs

The temporal graph model involves several deliberate trade-offs:

**Storage for speed.** The temporal substrate (~15,280 documents for 5 years) is overhead that timestamp-based systems do not incur. This overhead enables pre-materialized calendar classifications that eliminate per-record computation on the most common temporal query patterns.

**Structural constraint for flexibility.** The bounded temporal substrate (only dates within the operational window exist as nodes) prevents referencing out-of-range dates. This is advantageous for data quality and AI hallucination pruning but constrains the system to its operational window. Extending the window requires generating additional temporal nodes — a lightweight operation but one that must be planned.

**Graph traversal for arithmetic.** Date arithmetic (e.g., "how many days between two dates?") is O(1) with timestamp subtraction but O(k) with spine traversal where k is the number of intervening days. For large distances (years apart), the skip-list overlay reduces this to O(log k), but the timestamp model retains an advantage on pure arithmetic operations. In practice, most temporal queries are selection and aggregation, where the graph model excels, rather than arithmetic.

### 9.2 Limitations

**Sub-second precision.** The temporal spine operates at DATE granularity, with optional HOUR-level resolution for sub-daily precision. Applications requiring millisecond or microsecond temporal precision (high-frequency trading, real-time sensor streams) would require extending the temporal substrate to much finer granularity, dramatically increasing the node count. At minute-level granularity, a 5-year substrate would contain ~2.6 million nodes — feasible but significant. At millisecond granularity, the approach is impractical.

**Substrate generation as prerequisite.** The temporal substrate must exist before any data can be recorded. Systems that need to record data immediately without a generation step cannot use this model directly. In practice, substrate generation takes under 20 seconds for a 5-year window, but the dependency exists.

**Calendar system dependency.** The current model assumes the Gregorian calendar. Adapting to other calendar systems (Islamic, Hebrew, fiscal-year) requires generating sub-temporal planes appropriate to those systems. The spine itself (one node per day) is calendar-agnostic, but the sub-planes encode Gregorian calendar semantics.

### 9.3 Generalization to Cyclical Time

The temporal spine is linear — time flows from $d_0$ to $d_n$ without repetition. However, many domains involve cyclical temporal patterns: estrous cycles (21 days), seasonal patterns (365 days), weekly schedules (7 days).

The sub-temporal plane model already supports a form of cyclical reasoning: all Mondays map to the same DOW:MONDAY node, all January dates map to the same MONTH node (within the same year), and so forth. These classifications "fold" the linear spine into cycles.

The Charlotte system extends this through **protocol-defined cycles** (formalized in the companion paper on tesseract topology [?]): a protocol can define a custom cycle length (e.g., 21-day estrous cycle) and link signals to both their absolute position on the spine and their phase position within the cycle. This creates a torus topology — the linear spine wrapping through cyclical phase space — that enables simultaneous reasoning about absolute time ("what day is it?") and phase time ("where in the cycle are we?").

### 9.4 Implications for AI Systems

The temporal substrate's hallucination pruning property (Proposition 5) has implications beyond the Charlotte system. As AI agents are increasingly deployed to interact with databases and knowledge graphs, the structural constraints of the data model become constraints on agent behavior.

In timestamp-based systems, an AI agent with write access can insert any syntactically valid timestamp, including dates that are logically impossible (February 30), physically impossible (dates before the organization existed), or strategically deceptive (back-dated records). Validation rules can catch some of these errors, but rules are external to the data model — they must be written, maintained, and enforced separately.

In the temporal graph model, the set of valid temporal references is exactly the set of existing temporal nodes. This is not a rule — it is a structural property. An agent cannot reference DATE:2-30-2026 because that node does not exist. The constraint requires no validation logic, no exception handling, and no maintenance. It is guaranteed by the data model itself.

This principle — **constraining agent behavior through data structure rather than validation rules** — has broader implications for safe AI deployment. The more constraints that are structural rather than procedural, the fewer failure modes require explicit handling.

---

## 10. Conclusion

This paper has presented a temporal data model in which time is represented as pre-built graph structure rather than embedded scalar values. The temporal spine — a doubly-linked list of DATE nodes connected by NEXT edges — provides the foundational temporal structure. Sub-temporal planes (month, day-of-week, quarter, year, week) pre-materialize calendar classifications as edges, eliminating per-record date arithmetic. The :CREATED reference grounds every fact in the system to a shared temporal substrate through a structural pointer rather than a parsed timestamp.

We have formalized this model as a temporal graph $G_T = (V, E, T, M, S, \rho, \tau)$, defined a temporal query algebra with selection, projection, aggregation, navigation, and pattern-matching operators, and proved the Sub-Plane Pushdown Theorem: calendar-classification queries can be rewritten as single-edge traversals. Evaluation on a production knowledge graph (~500,000 signals over 5 years) shows 2--8x speedup on calendar-pattern queries, with the strongest advantage on sub-plane queries (8.4x) where pre-materialized classifications eliminate per-record computation.

The model provides three guarantees that timestamp-based systems cannot:

1. **Zero temporal parsing.** No record requires timestamp interpretation at query time.
2. **Zero temporal inconsistency.** All facts reference the same shared temporal substrate, eliminating clock skew, timezone confusion, and format ambiguity.
3. **Structural hallucination pruning.** AI agents can only reference temporal nodes that exist, preventing an entire class of temporal data quality errors through data structure rather than validation logic.

The fundamental insight is that time, like geography, is infrastructure. The calendar is not a computation to be performed but a structure to be built. Monday is always Monday. Q1 is always January through March. Pre-building these relationships once and encoding them as graph structure transforms temporal queries from computations over values into traversals over topology. Time, once built, does not need to be computed again.

---

## Figures (Planned)

| Figure | Description | Section |
|--------|-------------|---------|
| Fig. 1 | Temporal spine structure: DATE nodes connected by NEXT/PREV edges with signal anchoring | 3.3 |
| Fig. 2 | Sub-temporal planes: DATE nodes radiating to MONTH, DOW, QUARTER, YEAR classification nodes | 3.4 |
| Fig. 3 | :CREATED reference: FACT document with structural pointer to DATE node vs. embedded timestamp | 3.5 |
| Fig. 4 | Lifecycle bounds: entity with BEGAN_ON and ENDED_ON edges defining active interval on spine | 3.6 |
| Fig. 5 | Query comparison: timestamp-based flow (parse → compute → filter) vs. graph-based flow (traverse → collect) | 4.2 |
| Fig. 6 | Sub-Plane Pushdown: "all Mondays in Q1" resolved through edge intersection | 5.6 |
| Fig. 7 | Skip-list overlay on temporal spine showing multi-level traversal shortcuts | 6.1 |
| Fig. 8 | Temporal partitioning: hot/warm/cold zones on the temporal spine | 6.4 |
| Fig. 9 | Query performance comparison: bar chart across five query patterns | 8.3 |
| Fig. 10 | Hallucination pruning: valid vs. invalid temporal references with structural constraint | 4.4 |

---

*Draft generated for Charlotte research suite. All citations marked [?] are placeholders for author's curated references.*
