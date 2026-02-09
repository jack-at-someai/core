# Containerized Knowledge Graphs with Register-Based Primitives and Pre-Built Spatiotemporal Substrate

**Target Venue:** IEEE Software

**Paper Type:** Full Research Paper (10–12 pages)

---

## Abstract

Multi-tenant knowledge graph systems typically suffer from two compounding problems: *collection sprawl* (separate database collections per entity type, producing schema explosion and migration complexity) and *runtime context burden* (temporal and spatial context computed at query time, producing repeated work, timezone ambiguity, and validation gaps). This paper presents a substrate architecture that addresses both problems through two complementary mechanisms. First, a *register-based document model* encodes all information — entities, relationships, measurements, observations, and expectations — in a single database collection using five document types with fixed positional registers whose semantics are determined by type. Second, a *pre-built spatiotemporal substrate* materializes temporal and spatial context as graph nodes prior to any user data, creating a shared coordinate system into which per-tenant data is planted. Individual tenants operate in isolated *containers* that share the substrate but maintain private entity graphs. Because all containers reference the same temporal and spatial nodes, cross-container queries, industry-wide aggregations, and inter-tenant graph traversals require no data migration, schema alignment, or identifier remapping — containers merge by overlay on the shared grid. We describe the architecture, its implementation on Firebase Firestore, container deployment and merging patterns, and performance characteristics. A production deployment containing approximately 27,200 nodes and 46,100 edges across four breed registries validates the approach. The substrate eliminates an entire category of temporal and spatial bugs, constrains AI-generated references to valid nodes, and amortizes context-building cost across all queries through one-time pre-computation.

**Keywords:** software architecture, knowledge graphs, multi-tenant systems, document databases, temporal modeling, spatial modeling, register-based encoding

---

## I. Introduction

### A. The Collection Sprawl Problem

A conventional approach to building an operational data system begins with schema design: define a collection (or table) for each entity type, specify the fields on each collection, establish foreign key relationships between collections, and implement migration scripts for when the schema inevitably changes.

This approach produces *collection sprawl* — a proliferation of collections that grows with the complexity of the domain. A livestock management system might start with collections for `sows`, `boars`, `litters`, `operations`, and `breeders`. As requirements evolve, collections are added for `weights`, `health_events`, `breeding_records`, `show_results`, `feed_logs`, `pedigrees`, `registries`, and `locations`. Each collection has its own schema, its own indexes, its own validation rules, and its own migration history.

The consequences compound over time. Queries that span multiple entity types require joins across collections, increasing latency and complexity. Schema changes — adding a field, renaming a relationship, splitting a collection — require migration scripts that must be tested against production data. New features that introduce new entity types require new collections, new indexes, new security rules, and new migration paths. The system accretes structural debt proportional to its lifetime.

### B. The Runtime Context Problem

Operational data acquires meaning through temporal and spatial context. A weight measurement has meaning only in relation to a date (when was it taken?), a location (where was the animal?), and a temporal trajectory (what did it weigh before and after?). A breeding event has meaning only in relation to a calendar (when is the due date?) and a spatial network (where is the operation?).

Conventional systems compute this context at runtime. A query for "all sows due this week" performs date arithmetic on stored timestamps, comparing farrowing predictions against the current date. A query for "operations within 100 miles" computes haversine distances from stored latitude-longitude pairs. A query for "last quarter's average litter size" parses date strings, determines quarter boundaries, and filters records accordingly.

This runtime computation has three failure modes. First, *timezone ambiguity*: timestamps stored as UTC must be converted to local time for display, but the appropriate timezone depends on the user's location, the entity's location, or the operation's location — and these may differ. Second, *format inconsistency*: date strings stored in different formats ("2026-01-30", "01/30/2026", "January 30, 2026") resist consistent comparison. Third, *AI hallucination*: when AI agents generate date references, they may produce valid-looking but nonexistent dates ("February 30, 2026") or dates outside the system's operational range.

### C. The Substrate Solution

This paper presents an architecture that addresses both problems through a single design: store all data in one collection using register-based documents, and pre-build temporal and spatial context as nodes in the graph before any user data exists.

The *register-based document model* replaces collection sprawl with a universal document structure. Every piece of information — an entity, a relationship, a measurement, an observation, an expectation — is encoded as a single document type (a FACT) with a type discriminator and positional registers. Five types suffice for all domains. One collection contains everything.

The *pre-built substrate* replaces runtime context computation with pre-materialized graph structure. DATE nodes for every date in the operational range, connected by NEXT edges, form a temporal spine. CITY, STATE, and COUNTRY nodes, connected by LOCATED_IN edges, form a spatial spine. These nodes exist before any user records a signal. Temporal and spatial context is not computed — it is traversed.

### D. Contributions

1. A register-based document model encoding five semantic types in a single collection with fixed positional registers, eliminating collection sprawl and enabling consistent indexing.

2. A pre-built spatiotemporal substrate that amortizes context-building across all queries through one-time pre-computation, eliminating runtime temporal and spatial bugs.

3. A container architecture enabling multi-tenant isolation on a shared substrate, with seamless cross-container merging through shared node references.

4. A production implementation on Firebase Firestore with performance characteristics and design patterns for practitioners.

---

## II. Background and Related Work

### A. Multi-Tenant Database Architectures

Multi-tenant systems typically choose among three isolation patterns: separate databases per tenant, separate schemas within a shared database, or shared tables with tenant discriminators [?]. Each trades isolation strength against operational cost. Separate databases provide strong isolation but high operational overhead. Shared tables minimize overhead but risk data leakage and complicate indexing.

None of these patterns provide a *shared semantic layer* — a common set of reference nodes that all tenants can access without data duplication. The substrate architecture introduces this layer: temporal and spatial nodes shared across all tenants, providing a common coordinate system without compromising tenant isolation.

### B. Knowledge Graph Architectures

Knowledge graph systems — whether property graphs (Neo4j [?]), RDF stores (Blazegraph [?]), or document-based graph encodings (ArangoDB [?]) — represent entities as nodes and relationships as edges. Multi-tenant knowledge graphs typically isolate tenants through named graphs, separate databases, or access control policies [?]. Cross-tenant queries require explicit federation or data integration.

The substrate architecture enables implicit cross-tenant connectivity: two tenants referencing the same DATE or CITY node are structurally connected through the shared substrate, enabling cross-tenant temporal and spatial queries without federation infrastructure.

### C. Event Sourcing and CQRS

Event sourcing [?] shares the substrate architecture's commitment to append-only data streams. Events are persisted immutably; current state is derived by replay. The key difference is scope: event sourcing operates within aggregate boundaries, with cross-aggregate queries served by dedicated projections. The substrate architecture operates across the entire graph, with cross-entity queries served by traversal over the shared substrate.

### D. Temporal and Spatial Databases

Temporal database extensions (SQL:2011 [?], TSQL2 [?]) and spatial databases (PostGIS [?]) add temporal and spatial capabilities to relational systems. These approaches treat time and space as *attributes* — columns on rows with special operators. The substrate architecture treats time and space as *entities* — first-class nodes in the graph with their own edges and traversal semantics. This distinction enables temporal and spatial joins through graph traversal rather than attribute comparison.

---

## III. The Register-Based Document Model

### A. The FACT as Universal Primitive

Every piece of information in the system is encoded as a FACT document — a small, fixed-structure document with a type discriminator, a unique identifier, a temporal creation reference, and positional registers:

```json
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

The design draws inspiration from CPU instruction formats, where a fixed-width instruction word contains an opcode and operand fields whose semantics depend on the opcode [?]. In the FACT model, `:TYPE` serves as the opcode, and P0–P3 serve as operands.

Three core fields are shared across all types:
- **`:ID`** — A globally unique identifier, typically structured as `{TYPE}:{discriminators}` (e.g., `HUMAN:PHONE:3207601810`, `DATE:3-15-2026`)
- **`:TYPE`** — One of exactly five values: NODE, EDGE, METRIC, SIGNAL, PROTOCOL
- **`:CREATED`** — A reference to a DATE node in the temporal substrate (not a raw timestamp)

The `:CREATED` field deserves emphasis. It is not a timestamp string or a Unix epoch value. It is a *node reference* — a pointer to an existing DATE node in the temporal substrate. This means the creation time of every FACT is grounded in the graph. A FACT cannot be created with a date that does not exist as a node. This constraint prevents temporal hallucination by construction.

### B. The Five Types and Their Register Semantics

Each type assigns specific semantics to the positional registers:

**Table I: Register Semantics by Type**

| Type | P0 | P1 | P2 | P3 |
|------|----|----|----|----|
| NODE | Category (e.g., SOW, CITY, DATE) | — | — | — |
| EDGE | From node :ID | To node :ID | Edge type label | — |
| METRIC | Target node :ID | Value type (STRING, NUMBER, BOOLEAN) | Human-readable label | Constraints (min, max, enum) |
| SIGNAL | Target node :ID | Metric :ID | Observed value | Protocol :ID (optional) |
| PROTOCOL | Target node :ID | Schedule definition | Requirements | — |

The register design has three properties:

1. **Positional consistency.** P0 always carries the primary operand (category for nodes, source for edges, target for metrics/signals/protocols). This enables consistent indexing: a composite index on (`:TYPE`, `P0`, `:CREATED`) supports the most common query patterns across all types.

2. **Schema-free evolution.** Adding a new domain requires defining new P0 categories (SOW, COMPRESSOR, VIOLIN), new P2 edge types (SIRE_OF, PART_OF, OWNED_BY), and new metric labels — all within the existing register structure. No new collections, no new fields, no migration.

3. **Fixed-width encoding potential.** Because every document has the same positional structure, the entire collection can in principle be encoded as a stream of fixed-width binary records. A 256-bit encoding (64 bits per register × 4 registers, plus type and ID fields) would enable hardware-level batch processing without deserialization.

### C. Graph Layer versus Feature Layer

The five types partition into two architectural layers:

The **graph layer** (NODE + EDGE) encodes explicit topology — which entities exist and how they relate. EDGEs connect only NODEs to NODEs. The graph layer is sparse, slowly evolving, and structurally clean.

The **feature layer** (METRIC + SIGNAL) encodes implicit feature vectors — what has been measured and observed. METRICs and SIGNALs reference nodes through P0 but do not create edges. The feature layer is dense, rapidly growing, and temporally rich.

This separation prevents *graph pollution* — the degradation of graph topology that occurs when high-frequency measurement data is stored as node properties or edge annotations. Weight measurements, sensor readings, and observational logs reside in the feature layer, leaving the graph layer to represent structural relationships without clutter.

PROTOCOL bridges the two layers: it references a node (feature layer connection) and may generate edges to temporal checkpoints (graph layer connections), linking expectations to the spatiotemporal substrate.

### D. Benefits of Single-Collection Design

Storing all five types in a single Firestore collection (`facts`) produces four operational benefits:

1. **Clean exports.** Dumping one collection produces the complete knowledge graph — all entities, relationships, measurements, observations, and expectations — in a single file. No cross-collection join logic, no export order dependencies.

2. **Consistent indexing.** A single composite index on (`:TYPE`, `P0`, `:CREATED`) supports the dominant query patterns for all five types. Index management scales with the number of query patterns, not with the number of entity types.

3. **No collection sprawl.** Adding a new domain, a new entity type, or a new measurement does not create new collections. The system's structural complexity is bounded by five types regardless of domain complexity.

4. **Transactional integrity.** A single-collection transaction can atomically create a NODE, its METRIC definitions, and an initial SIGNAL in one batch write. Cross-collection transactions are unnecessary.

---

## IV. Substrate Planes as Shared Infrastructure

### A. The Temporal Substrate

The temporal substrate is a pre-built layer of DATE nodes and NEXT edges that represents the structure of time within the system's operational range.

**DATE nodes** are created for every date in the operational window. For a five-year deployment, this produces 1,826 DATE nodes (including a leap year). Each DATE node follows the identifier pattern `DATE:M-d-yyyy`:

```json
{":ID": "DATE:1-30-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-30-2026", "P0": "DATE"}
```

**NEXT edges** connect consecutive dates, forming a temporal spine — a traversable chain through time:

```json
{":ID": "T:1-29-to-1-30", ":TYPE": "EDGE", ":CREATED": "DATE:1-29-2026",
 "P0": "DATE:1-29-2026", "P1": "DATE:1-30-2026", "P2": "NEXT"}
```

The temporal spine enables temporal traversal: moving forward or backward in time by following NEXT edges. "Next seven days" is seven NEXT hops from today's DATE node. "Previous quarter" is a traversal to the relevant QUARTER node (see below) and collection of all DATE nodes within it.

**Hierarchical temporal planes** extend the flat date spine with aggregation nodes:

| Plane | Node Pattern | Example | Connects To |
|-------|-------------|---------|-------------|
| YEAR | `YEAR:yyyy` | `YEAR:2026` | DATE nodes via PART_OF |
| QUARTER | `QUARTER:yyyy-Qq` | `QUARTER:2026-Q1` | DATE nodes via PART_OF |
| MONTH | `MONTH:yyyy-MM` | `MONTH:2026-01` | DATE nodes via PART_OF |
| WEEK | `WEEK:yyyy-Ww` | `WEEK:2026-W05` | DATE nodes via PART_OF |
| DAY_OF_WEEK | `DOW:d` | `DOW:TUESDAY` | DATE nodes via IS_DAY |

These planes are *interwoven*: every DATE node has PART_OF edges to its MONTH, QUARTER, and YEAR, and an IS_DAY edge to its day of week. The query "what happened on Tuesdays in Q1 2026?" becomes a graph intersection: traverse from `DOW:TUESDAY` and from `QUARTER:2026-Q1`, intersect the reached DATE nodes, collect signals with matching `:CREATED` references.

All temporal pivots are pre-computed at container deployment. No date arithmetic, no quarter-boundary logic, no day-of-week calculation occurs at query time.

### B. The Spatial Substrate

The spatial substrate follows the same pattern: pre-built geographic nodes connected by hierarchical edges.

```
COUNTRY:USA
  ├── STATE:MO ── CITY:TAYLOR_MO (lat: 39.92, lon: -91.56)
  ├── STATE:GA ── CITY:PERRY_GA  (lat: 32.46, lon: -83.73)
  └── STATE:IA ── CITY:AMES_IA   (lat: 42.03, lon: -93.62)
```

Each CITY node resolves to latitude-longitude coordinates, enabling distance computation. LOCATED_IN edges connect the hierarchy: CITY → STATE → COUNTRY.

Cardinal direction edges connect neighboring spatial nodes, enabling relative spatial queries:

| Edge Type | Direction |
|-----------|-----------|
| IS_NORTH_OF | +latitude |
| IS_SOUTH_OF | −latitude |
| IS_EAST_OF | +longitude |
| IS_WEST_OF | −longitude |
| IS_NORTHEAST_OF | +lat, +lon |
| IS_SOUTHEAST_OF | −lat, +lon |
| IS_NORTHWEST_OF | +lat, −lon |
| IS_SOUTHWEST_OF | −lat, −lon |

"Operations north of Dallas" becomes a multi-hop traversal along IS_NORTH_OF edges from CITY:DALLAS_TX, collecting entities with LOCATED_IN edges at each visited city.

### C. Industry-Specific Planes

Domain-specific reference structures are pre-built alongside the spatiotemporal substrate:

- **Livestock:** REGISTRY nodes (NSR, ABA, CPS, CWRA), BREED nodes (DUROC, HAMPSHIRE, BERKSHIRE), connected by REGISTERED_UNDER and HEADQUARTERED_IN edges
- **Industrial:** EQUIPMENT_TYPE nodes, MANUFACTURER nodes, connected by TYPE_OF and MANUFACTURED_BY edges
- **Cultural:** PERIOD nodes (BAROQUE, CLASSICAL, ROMANTIC), SCHOOL nodes (CREMONA, MITTENWALD), connected by ERA_OF and TRADITION_OF edges

These planes follow the same pattern: pre-built, immutable, shared across tenants.

### D. The Seed-Soil Metaphor

The relationship between user data and the substrate is agricultural. The substrate is the *soil*: pre-built, shared, immutable. It exists before any user plants anything. User-created entities — operations, animals, equipment, artifacts — are *seeds* planted into this soil. As signals accumulate and edges connect entities to temporal and spatial nodes, the seeds grow *roots* into the substrate.

The metaphor captures a critical architectural property: the soil does not change when seeds are planted. The substrate is not modified by user activity. User data references substrate nodes through edges and `:CREATED` fields, but the substrate nodes themselves remain static. This immutability guarantees that the coordinate system shared across all tenants remains consistent regardless of individual tenant activity.

---

## V. Container Architecture and Isolation

### A. Container Deployment Parameters

A container is a tenant-specific deployment of Charlotte, initialized with three parameter sets:

**Temporal bounds** define the operational window:
```
start_date: DATE:1-1-2026
end_date:   DATE:12-31-2030   (5-year window)
```

**Spatial focus** defines the geographic scope:
```
center_lat:  39.92
center_lon: -91.56
radius_km:   500
```

**Operation identity** defines the tenant:
```
operation_name: "Heimer Hampshires"
industry:       SWINE
```

### B. Substrate Generation on Deploy

Upon container creation, the system generates the tenant's substrate slice:

1. **Temporal substrate.** All DATE nodes from `start_date` to `end_date`, NEXT edges between them, and hierarchical plane nodes (YEAR, QUARTER, MONTH, WEEK, DAY_OF_WEEK) with appropriate PART_OF and IS_DAY edges.

2. **Spatial substrate.** All CITY nodes within `radius_km` of the spatial focus point, with STATE and COUNTRY parents, LOCATED_IN edges, and cardinal direction edges between neighboring cities.

3. **Industry substrate.** Domain-specific reference nodes (registries, breeds, equipment types) appropriate to the declared industry.

For a typical five-year livestock deployment:

| Component | Nodes | Edges | Storage |
|-----------|-------|-------|---------|
| DATE nodes | 1,826 | — | ~180 KB |
| NEXT edges | 1,825 | — | ~180 KB |
| Hierarchical planes | ~140 | ~1,826 | ~200 KB |
| CITY nodes | ~2,000 | — | ~200 KB |
| STATE nodes | 50 | — | ~5 KB |
| LOCATED_IN edges | ~2,050 | — | ~200 KB |
| Cardinal edges | ~8,000 | — | ~800 KB |
| Industry nodes | ~20 | ~30 | ~5 KB |
| **Total** | **~4,036** | **~13,731** | **~1.8 MB** |

The substrate represents approximately 1.8 MB of pre-built infrastructure — a one-time cost that amortizes across all subsequent queries.

### C. Tenant Isolation Patterns

Tenant isolation is achieved through identifier conventions rather than database-level separation:

- **Operation-specific nodes** carry tenant-scoped ID prefixes: `ANIMAL:DUROC:NSR-12345` belongs to whichever operation registered it
- **Shared substrate nodes** carry universal IDs: `DATE:1-30-2026` is the same node for all tenants
- **Ownership edges** connect tenant-specific nodes to operations: `BRED_BY` edges from animals to operations establish provenance

Query routing follows a simple rule: start from the tenant's operation node and traverse. The traversal naturally scopes to the tenant's entities through ownership edges, while substrate nodes are accessible to all tenants.

For strict isolation scenarios (regulatory compliance, competitive sensitivity), query-time filters on operation ID ensure that traversal does not cross tenant boundaries even when the underlying graph is shared.

### D. Container Merging

Because all containers share the same substrate structure, merging containers requires no data migration:

1. **Same temporal nodes.** DATE:1-30-2026 is the same node in Container A and Container B. Signals from different operations on the same date naturally co-locate on the same temporal node.

2. **Same spatial nodes.** CITY:TAYLOR_MO is the same node in all containers. Operations in the same city share the same spatial anchor.

3. **Universal identifiers.** Substrate node IDs are globally unique and universally formatted. No identifier remapping is required.

4. **Edges cross boundaries.** A SIRE_OF edge can connect an animal in Container A to an animal in Container B. Pedigree threads, supply chains, and provenance chains cross container boundaries naturally.

The merge operation is an *overlay*: the merged view is the union of all containers' entities on the shared substrate grid. Cross-container queries — "all operations in Missouri with signals this week," "average litter size across the industry this quarter" — are single traversals over the merged graph, with no federation protocol, no schema alignment, and no ETL pipeline.

---

## VI. Implementation Patterns

### A. Substrate Pre-Seeding

Temporal substrate generation follows a linear scan over the date range:

```
PROCEDURE GenerateTemporalSubstrate(start_date, end_date)
  prev ← NULL
  FOR date IN DateRange(start_date, end_date) DO
    // Create DATE node
    CREATE_FACT(:ID = DateNodeId(date), :TYPE = "NODE",
                :CREATED = DateNodeId(date), P0 = "DATE")

    // Create NEXT edge from previous date
    IF prev ≠ NULL THEN
      CREATE_FACT(:ID = NextEdgeId(prev, date), :TYPE = "EDGE",
                  :CREATED = DateNodeId(prev),
                  P0 = DateNodeId(prev), P1 = DateNodeId(date), P2 = "NEXT")

    // Create hierarchical plane edges
    CREATE_PART_OF(date, GetMonth(date))
    CREATE_PART_OF(date, GetQuarter(date))
    CREATE_PART_OF(date, GetYear(date))
    CREATE_IS_DAY(date, GetDayOfWeek(date))

    prev ← date
```

On Firebase Firestore, batch writes of 500 documents execute in approximately 2–3 seconds. A five-year substrate (approximately 17,000 documents) generates in under two minutes.

### B. Lazy Spatial Expansion

Core spatial regions are pre-built at deployment. New CITY nodes are added on first reference through a lazy expansion pattern:

```
PROCEDURE EnsureSpatialNode(city_name, state_abbrev)
  city_id ← "CITY:" + city_name + "_" + state_abbrev
  IF NOT EXISTS(city_id) THEN
    CREATE_FACT(:ID = city_id, :TYPE = "NODE", P0 = "CITY")
    CREATE_LOCATED_IN(city_id, "STATE:" + state_abbrev)
    COMPUTE_AND_STORE_CARDINAL_EDGES(city_id)
  RETURN city_id
```

This pattern allows the spatial substrate to grow incrementally as new geographies are encountered, while maintaining the pre-built structure for known regions.

### C. The Temporal Reference Pattern

The substrate architecture replaces embedded timestamps with node references:

| Traditional | Substrate |
|-------------|-----------|
| `"created_at": "2026-01-30T14:30:00Z"` | `":CREATED": "DATE:1-30-2026"` |
| `"due_date": "2026-05-24"` | EDGE: entity → DATE:5-24-2026, type: DUE_ON |
| `"last_weighed": "2026-01-15"` | Latest SIGNAL with `:CREATED` = DATE:1-15-2026 |

The node reference pattern has three advantages. First, validation is structural: a reference to `DATE:2-30-2026` fails because no such node exists (February has no 30th day). Second, temporal queries become graph traversals: "events this week" is a traversal from today's DATE node through seven NEXT hops, not a date comparison. Third, AI agents cannot hallucinate dates: they can only reference DATE nodes that exist in the substrate.

### D. Query Patterns

The register-based model produces consistent query patterns across all five types:

**Point query (most recent signal value):**
```
WHERE :TYPE = "SIGNAL" AND P0 = {node_id} AND P1 = {metric_id}
ORDER BY :CREATED DESC
LIMIT 1
```

**Temporal range (signals in period):**
```
WHERE :TYPE = "SIGNAL" AND P0 = {node_id}
AND :CREATED >= "DATE:{start}" AND :CREATED <= "DATE:{end}"
```

**Spatial query (entities in region):**
```
// Step 1: Get cities in state
WHERE :TYPE = "EDGE" AND P1 = "STATE:MO" AND P2 = "LOCATED_IN"
// Step 2: Get operations in those cities
WHERE :TYPE = "EDGE" AND P1 IN {city_ids} AND P2 = "LOCATED_IN"
```

**Cross-type traversal (operation → animals → signals):**
```
// Step 1: Animals at operation
WHERE :TYPE = "EDGE" AND P1 = {operation_id} AND P2 = "BRED_BY"
// Step 2: Signals on those animals
WHERE :TYPE = "SIGNAL" AND P0 IN {animal_ids}
```

### E. Indexing Strategy

Three composite indexes support the dominant query patterns:

| Index | Supports |
|-------|----------|
| (`:TYPE`, `P0`, `:CREATED`) | Point queries, temporal filtering by entity |
| (`:TYPE`, `P2`, `P1`) | Edge queries by type and target |
| (`:TYPE`, `P1`, `:CREATED`) | Signal queries by metric, temporal range |

The single-collection design means these three indexes cover all five types. In a traditional architecture with separate collections, equivalent coverage would require indexes on each collection — at minimum 15 indexes (3 per type × 5 types).

---

## VII. Comparison with Traditional Architectures

### A. Schema Design

| Aspect | Traditional | Substrate |
|--------|-------------|-----------|
| Collections/tables | N per entity type | 1 (`facts`) |
| Schema changes | Migration scripts | New P0 values, new metrics |
| Adding a domain | New collections + schemas | New vocabulary only |
| Export | Multi-collection orchestration | Single collection dump |
| Index count | O(collections × patterns) | O(patterns) |
| Foreign keys | Explicit, cross-collection | :ID references within collection |

### B. Multi-Tenancy

| Aspect | Traditional | Substrate |
|--------|-------------|-----------|
| Isolation mechanism | Separate DB / schema / discriminator | ID prefix + ownership edges |
| Shared infrastructure | None (each tenant fully independent) | Temporal + spatial substrate |
| Cross-tenant queries | Federation / ETL | Traversal over shared substrate |
| Tenant merge | Data migration project | Graph overlay (zero migration) |
| New tenant onboard | Schema provisioning | Substrate generation (~2 min) |

### C. Temporal Handling

| Operation | Traditional | Substrate |
|-----------|-------------|-----------|
| "Last 7 days" | Date arithmetic on timestamps | 7 NEXT hops from today |
| "This quarter" | Quarter boundary logic | Traverse from QUARTER node |
| "Tuesdays in Q1" | Day-of-week + quarter filter | Graph intersection: DOW:TUESDAY ∩ QUARTER:2026-Q1 |
| Co-occurrence | Timestamp equality comparison | Same DATE node reference |
| AI date reference | Can hallucinate invalid dates | Constrained to existing DATE nodes |
| Timezone handling | Client conversion from UTC | Eliminated (nodes are universal) |

The temporal handling comparison is the most striking. Every temporal operation that requires date parsing, arithmetic, or boundary logic in traditional systems reduces to graph traversal in the substrate architecture. The traversal is O(hops) where hops is typically small (7 for a week, 90 for a quarter), and the result set is pre-indexed through the hierarchical plane edges.

---

## VIII. Performance Characteristics

### A. Substrate Pre-Building Cost

The one-time cost of generating a five-year substrate:

| Operation | Documents | Time (Firestore) |
|-----------|-----------|-------------------|
| DATE nodes | 1,826 | ~4 sec |
| NEXT edges | 1,825 | ~4 sec |
| Hierarchical edges | ~5,500 | ~12 sec |
| Spatial nodes | ~2,050 | ~5 sec |
| Spatial edges | ~10,050 | ~21 sec |
| Industry nodes | ~50 | <1 sec |
| **Total** | **~21,300** | **~46 sec** |

Generation is a one-time operation at container deployment. The cost is amortized across all subsequent queries for the container's lifetime.

### B. Query Performance

| Query Type | Traditional | Substrate | Improvement |
|------------|-------------|-----------|-------------|
| Temporal context lookup | O(*n*) scan + parse | O(1) node reference | Eliminates parsing |
| "Events this week" | O(*n*) date filter | O(7) NEXT hops + index | Bounded traversal |
| Spatial radius query | O(*n*) haversine calculation | O(*k*) edge traversal | Eliminates computation |
| Cross-tenant temporal | O(*t* × *n*) per-tenant scans | O(*k*) on shared DATE nodes | Single traversal |
| Temporal join | O(*n*²) timestamp comparison | O(1) same node reference | Structural join |

The key insight: queries that are O(*n*) in traditional systems (requiring scans over entities with timestamp filtering) become O(*k*) in the substrate architecture (requiring traversal over pre-built edges), where *k* is bounded by the query scope (days in range, cities in radius) rather than by the entity count.

### C. The Edge Density Insight

The performance benefit of the substrate is proportional to its edge density. A temporal substrate with only DATE nodes and NEXT edges supports linear traversal. Adding hierarchical plane edges (PART_OF to MONTH, QUARTER, YEAR) adds shortcut paths that reduce traversal distance. Adding cardinal temporal edges (IS_BEFORE, IS_AFTER connecting non-adjacent dates) creates skip-list-like structures that enable sub-linear temporal range queries.

The principle generalizes: *the edge density of the substrate is the speedup*. Each additional pre-computed edge eliminates a runtime computation. The one-time cost of generating edges trades storage (approximately 100 bytes per edge) for query-time savings (milliseconds of computation per query, amortized across every query that touches the temporal or spatial dimension).

### D. Storage Trade-offs

The substrate architecture consumes approximately 1.8 MB per container for a five-year temporal spine with 2,000 cities. For context, a single high-resolution photograph exceeds this size. The storage cost is negligible relative to the operational signal data that will accumulate over the container's lifetime (projected at 10–100 MB per year for an active operation).

The trade-off is explicit and favorable: approximately 21,000 pre-built documents (substrate) eliminate date arithmetic, timezone logic, spatial computation, and AI hallucination constraints for every subsequent query against the potentially millions of operational documents that accumulate over time.

---

## IX. Discussion

### A. Limitations

**Initial generation latency.** Substrate generation requires approximately 46 seconds on Firestore for a five-year deployment. This latency is acceptable for container provisioning (a one-time operation) but would be prohibitive if generation were required per-query. The architecture assumes that containers are provisioned in advance, not on demand.

**Firestore batching constraints.** Firestore limits batch writes to 500 operations and IN queries to 30 disjuncts (increased from 10 in recent updates [?]). Substrate generation must decompose into batches, and spatial queries over many cities require batched IN clauses. These are Firestore-specific constraints, not architectural limitations.

**High-frequency signal domains.** Domains producing millions of signals per day (financial trading, IoT sensor networks) may exceed the single-collection model's indexing capacity. For these domains, the register-based model may require partitioning (e.g., sharding by temporal window) or delegation to specialized time-series stores for the feature layer while retaining the graph layer in the single collection.

### B. When to Use Substrate Architecture

The substrate architecture is well-suited when:

1. **Multiple tenants share semantic context.** Dates, locations, and industry reference nodes are meaningful across tenants. Without shared semantics, the substrate provides no cross-tenant benefit.

2. **Cross-tenant queries are valuable.** Industry benchmarks, regional comparisons, and supply-chain traversals require cross-tenant data access. If tenants are fully independent, the substrate overhead is unjustified.

3. **Temporal and spatial context are integral to queries.** If the domain's queries rarely involve temporal or spatial dimensions, the pre-built substrate is an unnecessary cost.

4. **AI agents interact with the data.** The substrate's constraint that all temporal and spatial references must resolve to existing nodes provides structural guardrails against hallucinated dates, invalid locations, and nonsensical references.

### C. Future Work

Three extensions merit exploration. First, **substrate versioning** — supporting evolving temporal ranges (extending a container's end date) and spatial scope (adding new regions) without regenerating the entire substrate. Second, **substrate federation** — connecting substrates across independent Charlotte deployments to enable cross-deployment queries while maintaining deployment-level isolation. Third, **graph neural network integration** — using the substrate's pre-built structure as the adjacency matrix for GNN models that learn over the combined graph-and-feature layer.

---

## X. Conclusion

The substrate architecture addresses two compounding problems in multi-tenant operational systems. The register-based document model eliminates collection sprawl by encoding all information in five types within a single collection with fixed positional registers. The pre-built spatiotemporal substrate eliminates runtime context burden by materializing temporal and spatial structure as graph nodes before user data exists.

The combination produces four practical outcomes:

1. **One collection for everything.** No schema migrations. No collection proliferation. Adding a domain requires new vocabulary, not new structure.

2. **Pre-computed context.** Temporal and spatial queries reduce to graph traversal over pre-built edges. Date arithmetic, timezone conversion, and haversine distance calculation are eliminated from query-time execution.

3. **Seamless multi-tenancy.** Containers share substrate infrastructure while maintaining entity-level isolation. Cross-container queries require no federation, migration, or schema alignment.

4. **AI grounding by construction.** Temporal and spatial references are constrained to existing substrate nodes. AI agents cannot hallucinate dates, fabricate locations, or reference entities outside the system's operational scope.

The substrate is a small, one-time investment — approximately 21,000 documents and 1.8 MB per container — that eliminates an entire category of runtime computation and temporal/spatial bugs for every subsequent query. The heavy lifting is done upfront. What follows is navigation.

---

## References

[References to be populated with curated citation suite]

---

## Figures (Planned)

| Figure | Title | Section |
|--------|-------|---------|
| 1 | Collection Sprawl versus Single-Collection Architecture | I |
| 2 | Register-Based Document Structure | III |
| 3 | Graph Layer versus Feature Layer | III |
| 4 | Temporal Spine with Hierarchical Planes | IV |
| 5 | Seed-Soil Metaphor | IV |
| 6 | Container Deployment and Merging | V |

## Tables

| Table | Title | Section |
|-------|-------|---------|
| I | Register Semantics by Type | III |
| II | Substrate Generation Cost | V |
| III | Query Performance Comparison | VIII |

---

*Draft version: 1.0*
*Date: 2026-02-09*
*Target length: 10–12 pages (IEEE Software format)*
