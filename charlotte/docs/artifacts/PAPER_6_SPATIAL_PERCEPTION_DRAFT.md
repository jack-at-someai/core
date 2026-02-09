# Interwoven Spatial Planes in Knowledge Graphs: Space as Pre-Built Graph Substrate

**Paper 6 — Charlotte Research Suite**
**Target Venue:** ACM SIGSPATIAL
**Status:** FULL DRAFT

---

## Abstract

Geographic information systems overwhelmingly treat space as coordinate geometry: points, polygons, and distance functions evaluated at query time. This paper presents an alternative paradigm in which geographic reality is encoded as a pre-built graph substrate — a fixed layer of spatial nodes connected by containment and cardinal direction edges that exists before any user data arrives. We formalize the *interwoven spatial plane* model, in which a hierarchy of spatial nodes (COUNTRY, STATE, COUNTY, CITY, LATLON) are connected by LOCATED_IN edges for containment and eight cardinal direction edges (IS_NORTH_OF, IS_SOUTH_OF, etc.) for adjacency. We demonstrate structural isomorphism between the spatial and temporal planes of the Charlotte knowledge graph, enabling unified spatiotemporal queries as subgraph extractions rather than coordinate computations. Evaluation on a production livestock registry (14,400+ operations across 4,236 U.S. cities) shows that graph-native spatial queries achieve 3--15x speedup on hierarchical containment and regional aggregation queries compared to PostGIS, with competitive performance on proximity queries, at a storage cost of 3.6x. The approach eliminates runtime geocoding, resolves string ambiguity (e.g., the 34 U.S. cities named "Springfield"), and enables spatial reasoning through traversal rather than computation.

---

## I. Introduction

### I.A. The Geocoding Problem

Every geographic information system faces the same runtime burden: converting human-readable place names into machine-processable coordinates, then computing geometric relationships between those coordinates at query time. This geocoding pipeline introduces three persistent problems.

First, **latency**. Each place name resolution requires either a lookup table or an external API call. For applications that issue spatial queries frequently — disease surveillance, logistics, regional analytics — runtime geocoding becomes a performance bottleneck that scales linearly with query volume.

Second, **string ambiguity**. Geographic place names are not unique identifiers. The United States alone contains 34 cities named "Springfield," 31 named "Clinton," and 29 named "Franklin" [?]. Traditional systems resolve this ambiguity through composite keys (city + state + country) or user-provided coordinates, introducing fragility at the data entry boundary.

Third, **coordinate inconsistency**. Different sources encode the same location with different coordinate precision, different projections, and different reference points. The same city may appear at slightly different coordinates across datasets, creating phantom duplicates and failed spatial joins.

These problems share a common root cause: treating space as something to be computed rather than something that already exists. Geographic reality — the containment of cities within states within countries, the cardinal relationships between neighboring cities — is constant. It does not change between queries. Yet conventional systems recompute these relationships every time they are needed.

### I.B. Motivating Example

Consider the query: *"All breeders within 100 miles of a disease outbreak in Taylor, Missouri."*

In a traditional GIS, this requires: (1) geocoding "Taylor, Missouri" to coordinates (39.9208, -91.5632), (2) geocoding every breeder's location to coordinates, (3) computing haversine distances between the outbreak point and all breeder points, and (4) filtering by the 100-mile threshold. The computational cost is O(n) in the number of breeders, with each step introducing potential failure modes.

In the graph spatial model we propose, the query becomes: (1) resolve to the pre-existing node CITY:TAYLOR_MO, (2) traverse cardinal direction edges outward until the geographic distance exceeds 100 miles, (3) collect all operation nodes connected to cities within the traversal boundary via LOCATED_IN edges. No geocoding occurs at query time. No coordinates are compared. The spatial structure is traversed, not computed.

### I.C. The Substrate Thesis

We propose that geographic space should be treated as a **pre-built substrate** — a layer of nodes and edges that encodes spatial reality once and serves all subsequent queries through traversal. This thesis rests on three observations:

1. **Geographic hierarchy is stable.** The containment relationship between cities, counties, states, and countries changes rarely enough to be treated as static infrastructure.

2. **Cardinal relationships are fixed.** The fact that Springfield, Illinois is northeast of St. Louis, Missouri does not change. Pre-computing this relationship once eliminates repeated geometric computation.

3. **User entities bind to space, not the reverse.** When a livestock operation registers an address, the system does not create new spatial knowledge — it creates an edge from the operation node to a pre-existing city node. The spatial substrate absorbs user data without modification.

This is the same principle that drives road networks in graph databases: the road graph exists before any vehicle query, and route planning is traversal, not geometry. We extend this principle to the full geographic hierarchy.

### I.D. Contributions

This paper makes five contributions:

1. **Formal definition of interwoven spatial planes.** We define a hierarchical spatial graph with multiple resolution levels, where each level forms a plane connected to adjacent levels by LOCATED_IN edges (Section III).

2. **The LOCATED_IN edge pattern.** We formalize the containment edge as the fundamental spatial relationship, enabling bidirectional traversal between entities and the spatial hierarchy (Section III).

3. **Cardinal direction edges.** We introduce eight-way adjacency edges between spatial nodes at the same hierarchical level, encoding qualitative spatial relationships as traversable graph structure (Section III).

4. **Structural isomorphism with temporal substrate.** We prove that the spatial and temporal planes of a knowledge graph share identical structural properties, enabling unified spatiotemporal queries (Section IV).

5. **Evaluation on production data.** We report performance, storage, and query characteristics on a production livestock registry spanning 14,400+ operations across 4,236 U.S. cities (Section VIII).

---

## II. Related Work

### II.A. Geographic Information Systems

The geographic information systems (GIS) tradition, exemplified by PostGIS [?], Oracle Spatial [?], and ArcGIS [?], represents space as coordinate geometry. Points are (latitude, longitude) pairs. Regions are polygons. Spatial queries — containment, proximity, intersection — are computed through geometric operations on these representations. This approach is powerful for continuous spatial analysis (interpolation, density estimation, viewshed analysis) but lacks inherent graph structure. Hierarchical queries ("all cities in Missouri") require explicit joins between tables at different administrative levels, and proximity queries require coordinate comparison against every candidate. The spatial structure is implicit in coordinates rather than explicit in edges.

### II.B. Spatial Indexing

Spatial indexing structures — R-trees [?], Quad-trees [?], Geohash [?], and S2 cells [?] — optimize geometric queries by partitioning coordinate space into hierarchical regions. R-trees index minimum bounding rectangles for efficient range and nearest-neighbor queries. Geohash encodes coordinates as hierarchical strings, enabling proximity through prefix matching. S2 cells project the sphere onto a cube, creating a hierarchical spatial decomposition. These structures dramatically improve query performance but remain fundamentally coordinate-centric. They optimize *computation* over spatial relationships rather than *encoding* spatial relationships directly. The index is an acceleration structure over coordinates, not a representation of geographic knowledge.

### II.C. Knowledge Graphs with Spatial Extensions

Knowledge graphs increasingly incorporate spatial information. Wikidata [?] represents geographic entities as nodes with coordinate properties. GeoSPARQL [?] extends SPARQL with spatial predicates for querying geographic relationships. LinkedGeoData [?] converts OpenStreetMap data into RDF triples. These approaches treat coordinates as attributes of entities rather than as a structural layer of the graph. A city in Wikidata has a `coordinate location` property, but the containment of that city within a state is a separate triple that must be explicitly asserted and maintained. Cardinal relationships between cities are typically not represented at all. The spatial structure is fragmentary — present where asserted, absent where omitted.

### II.D. Qualitative Spatial Reasoning

The qualitative spatial reasoning (QSR) tradition [?] represents spatial relationships symbolically rather than metrically. Cardinal direction calculus [?] defines relations like NORTH_OF, SOUTHEAST_OF as qualitative descriptors. The Region Connection Calculus (RCC-8) [?] defines eight topological relationships between regions (disconnected, externally connected, partial overlap, etc.). These formalisms provide a theoretical foundation for symbolic spatial reasoning but are rarely implemented as pre-built graph structures. The contribution of this paper is to bridge QSR and graph databases: we encode cardinal directions as edges that are pre-computed at substrate generation time and available for traversal without geometric computation.

---

## III. Spatial Substrate Architecture

### III.A. The Interwoven Plane Model

We define the spatial substrate as a hierarchical graph $G_S = (V_S, E_S)$ where the vertex set $V_S$ is partitioned into *planes*:

$$V_S = V_{WORLD} \cup V_{CONTINENT} \cup V_{COUNTRY} \cup V_{REGION} \cup V_{STATE} \cup V_{COUNTY} \cup V_{CITY} \cup V_{LATLON}$$

Each plane corresponds to a resolution level in the geographic hierarchy. The term "interwoven" reflects that planes are not independent layers but are connected by edges that enable traversal across resolutions.

**Definition 1 (Spatial Plane).** A spatial plane $\mathcal{P}_k$ at level $k$ is a set of nodes $\{v : v.level = k\}$ representing geographic entities at the same administrative or geometric resolution. Planes are ordered: $WORLD (k=0) > CONTINENT (k=1) > \ldots > LATLON (k=7)$.

**Definition 2 (Contact Surface).** The *contact surface* $\mathcal{C}$ of the spatial substrate is the plane at which user entities bind to the spatial hierarchy. In the Charlotte system, $\mathcal{C} = V_{CITY}$. This is the lowest administrative level at which entities are routinely located — below CITY, the LATLON plane provides geometric resolution but is not the primary binding point.

The contact surface concept is crucial: it defines the resolution at which the spatial substrate meets the application domain. A livestock operation is LOCATED_IN a city, not at a raw coordinate. The city node serves as the spatial anchor, and finer resolution (LATLON) is available when needed but not required for most queries.

**Definition 3 (Resolution Plane).** The *resolution plane* $\mathcal{R}$ is the lowest plane in the hierarchy, providing maximum spatial precision. In the Charlotte system, $\mathcal{R} = V_{LATLON}$, where each node encodes a latitude-longitude coordinate pair. Resolution nodes are connected to their containing contact surface node by AT_COORDS edges.

### III.B. The LOCATED_IN Edge Pattern

The fundamental edge type in the spatial substrate is LOCATED_IN, which encodes geographic containment:

**Definition 4 (Containment Edge).** A containment edge $e = (v_i, v_j, \text{LOCATED\_IN})$ asserts that the geographic entity represented by $v_i$ is contained within the geographic entity represented by $v_j$, where $v_i.level > v_j.level$ (i.e., the contained entity is at a finer resolution than the container).

In the FACT encoding:

```json
{"P0": "CITY:TAYLOR_MO", "P1": "COUNTY:MARION_MO", "P2": "LOCATED_IN"}
{"P0": "COUNTY:MARION_MO", "P1": "STATE:MO", "P2": "LOCATED_IN"}
{"P0": "STATE:MO", "P1": "REGION:MIDWEST", "P2": "LOCATED_IN"}
{"P0": "REGION:MIDWEST", "P1": "COUNTRY:USA", "P2": "LOCATED_IN"}
```

This chain enables bidirectional traversal:

- **Downward (expansion):** Starting from STATE:MO, traverse all incoming LOCATED_IN edges to find all counties, then all cities within those counties.
- **Upward (containment):** Starting from CITY:TAYLOR_MO, traverse outgoing LOCATED_IN edges to find the county, state, region, and country.

When a user entity binds to the spatial substrate, it uses the same edge type:

```json
{"P0": "OP:heimer_hamps", "P1": "CITY:TAYLOR_MO", "P2": "LOCATED_IN"}
```

This uniformity means the query "all operations in Missouri" requires a single pattern: start at STATE:MO, expand downward through LOCATED_IN to all cities, then collect all operation nodes with LOCATED_IN edges to those cities. No string parsing. No coordinate comparison. No geocoding.

**Proposition 1 (Containment Transitivity).** If $(v_a, v_b, \text{LOCATED\_IN}) \in E_S$ and $(v_b, v_c, \text{LOCATED\_IN}) \in E_S$, then $v_a$ is transitively contained within $v_c$. The containment hierarchy forms a directed acyclic graph (DAG) — specifically, a forest where each spatial node has exactly one parent at the next higher administrative level.

### III.C. Cardinal Direction Edges

At each hierarchical level, spatial nodes at the same plane are connected by cardinal direction edges encoding qualitative spatial relationships:

**Definition 5 (Cardinal Edge).** A cardinal edge $e = (v_i, v_j, d)$ where $d \in \{$IS_NORTH_OF, IS_SOUTH_OF, IS_EAST_OF, IS_WEST_OF, IS_NORTHEAST_OF, IS_NORTHWEST_OF, IS_SOUTHEAST_OF, IS_SOUTHWEST_OF$\}$ asserts a qualitative directional relationship between two nodes at the same plane.

Cardinal edges are computed at substrate generation time using the centroid coordinates of each spatial entity. For cities, these are the standard geographic coordinates. For states and regions, centroids are computed from boundary polygons.

The computation follows a threshold model:

**Definition 6 (Cardinal Threshold).** Two nodes $v_i, v_j$ at the same plane are connected by a cardinal edge if and only if $d(v_i, v_j) \leq \theta_k$, where $d$ is the haversine distance and $\theta_k$ is the adjacency threshold for plane $k$. Typical thresholds:

| Plane | Threshold $\theta_k$ | Rationale |
|-------|----------------------|-----------|
| CITY | 75 miles | Neighboring cities within driving distance |
| COUNTY | 150 miles | Adjacent and near-adjacent counties |
| STATE | 500 miles | Interstate regional relationships |

Direction assignment uses the bearing between centroids:

$$\text{bearing}(v_i, v_j) = \text{atan2}(\sin(\Delta\lambda)\cos(\phi_j), \cos(\phi_i)\sin(\phi_j) - \sin(\phi_i)\cos(\phi_j)\cos(\Delta\lambda))$$

The bearing is quantized into eight sectors of 45 degrees each, mapping to the eight cardinal directions.

Cardinal edges serve as a graph-native adjacency structure: rather than computing "what cities are near Springfield, MO?" at query time via distance functions, the system traverses IS_NORTH_OF, IS_EAST_OF, etc. edges from the Springfield node. Multi-hop cardinal traversal approximates radius queries — two hops in any direction from a city with a 75-mile threshold covers approximately 150 miles.

### III.D. LATLON Resolution

Below the contact surface (CITY), the resolution plane provides geometric precision:

```json
{"P0": "CITY:TAYLOR_MO", "P1": "LATLON:39.9208_-91.5632", "P2": "AT_COORDS"}
```

LATLON nodes serve two purposes:

1. **Precise distance computation.** When traversal-based proximity (via cardinal edges) is insufficiently precise, the system resolves to LATLON coordinates for haversine computation.

2. **4D coordinate anchoring.** Combined with temporal substrate nodes (DATE, HOUR), LATLON nodes provide the spatial dimensions of a four-dimensional coordinate system for every signal in the graph.

The AT_COORDS edge connects exactly one LATLON node to each CITY node. This is not a many-to-many relationship — each city has a canonical coordinate. The design decision to represent coordinates as nodes rather than attributes preserves the principle that all information in the graph is relational: coordinates are not properties attached to city nodes but entities connected to city nodes, queryable and traversable like any other graph element.

---

## IV. Structural Identity with Temporal Plane

### IV.A. Isomorphic Structure

The Charlotte knowledge graph contains both a spatial substrate and a temporal substrate. A key observation is that these two substrates share identical structural properties.

**Definition 7 (Temporal Substrate).** The temporal substrate $G_T = (V_T, E_T)$ is a hierarchical graph where $V_T$ is partitioned into temporal planes:

$$V_T = V_{YEAR} \cup V_{QUARTER} \cup V_{MONTH} \cup V_{DATE} \cup V_{HOUR}$$

with CONTAINS edges between levels (YEAR:2026 → QUARTER:Q1:2026 → ...) and NEXT edges forming a sequential chain within the DATE plane.

**Theorem 1 (Structural Isomorphism).** The spatial substrate $G_S$ and temporal substrate $G_T$ are structurally isomorphic in the following sense:

| Property | Temporal Substrate | Spatial Substrate |
|----------|-------------------|-------------------|
| Hierarchy | YEAR → QUARTER → MONTH → DATE | COUNTRY → REGION → STATE → CITY |
| Containment edge | CONTAINS | LOCATED_IN |
| Contact surface | DATE (fine-grained events) | CITY (entity locations) |
| Resolution plane | HOUR (sub-daily) | LATLON (sub-city) |
| Adjacency edge | NEXT (sequential) | IS_NORTH_OF, etc. (directional) |
| Pre-built | Calendar generated ahead | Geography generated ahead |
| Immutable | Dates don't change | Cities don't move |

*Proof sketch.* Both substrates are hierarchical DAGs with: (a) a fixed set of resolution levels, (b) containment edges between adjacent levels forming a tree, (c) adjacency edges within the contact surface plane, (d) a resolution plane below the contact surface for precision, and (e) user entities binding at the contact surface via a uniform edge type. The isomorphism is structural (same graph shape) rather than metric (distances are measured differently). $\square$

The key difference is dimensionality of adjacency: the temporal plane has a single adjacency direction (NEXT/PREVIOUS — the arrow of time), while the spatial plane has eight (the cardinal directions). This reflects the fundamental difference between time (one-dimensional, linear) and space (two-dimensional, planar).

### IV.B. Unified 4D Coordinate System

The structural isomorphism enables a unified coordinate system. Every SIGNAL in the Charlotte graph exists at a four-dimensional coordinate:

$$(latitude, longitude, date, hour)$$

The first two dimensions are resolved through the spatial substrate (entity → CITY → LATLON). The latter two are resolved through the temporal substrate (signal → :CREATED → DATE, and optionally HOUR).

**Definition 8 (Spatiotemporal Cell).** A spatiotemporal cell is a 4-tuple $(lat, lon, date, hour)$ representing a unique point in the Charlotte spacetime. Two cells are adjacent if they are adjacent in any single dimension:

$$\text{adjacent}(c_1, c_2) \iff \exists d \in \{lat, lon, date, hour\} : |c_1.d - c_2.d| \leq \epsilon_d \wedge \forall d' \neq d : c_1.d' = c_2.d'$$

This is the standard tesseract adjacency structure — the four-dimensional analog of a grid, where each cell has neighbors along each axis. The spatial substrate provides the spatial dimensions; the temporal substrate provides the temporal dimensions.

### IV.C. Spatiotemporal Query Optimization

The structural isomorphism means that the same traversal algorithms work for both spatial and temporal queries. A *spatiotemporal bounding box* is a subgraph extraction defined by ranges on each dimension:

**Algorithm 1: SpatiotemporalBoundingBox**
```
Input: center_city, radius_miles, start_date, end_date
Output: Set of signals within the 4D bounding box

1. spatial_nodes ← CardinalExpand(center_city, radius_miles)
2. temporal_nodes ← DateRange(start_date, end_date)
3. entities ← {e : ∃ city ∈ spatial_nodes, (e, city, LOCATED_IN) ∈ E}
4. signals ← {s : s.P0 ∈ entities ∧ s.:CREATED ∈ temporal_nodes}
5. return signals
```

This algorithm decomposes the 4D query into independent spatial and temporal traversals, then intersects the results. The spatial expansion (line 1) uses cardinal edge traversal. The temporal range (line 2) uses NEXT edge traversal along the date chain. Both are graph operations — no coordinate computation is required for the spatial expansion, and no timestamp comparison is required for the temporal range.

---

## V. Spatial Indexing Approaches

### V.A. Graph-Native Indexing

The spatial substrate provides two forms of indexing that emerge directly from the graph structure, without requiring external index structures:

**Containment Index.** LOCATED_IN edges form a hierarchical containment index. To find all entities within a state, traverse downward through the containment hierarchy. This is equivalent to a multi-level B-tree where each level corresponds to an administrative plane. The key difference is that the "index" is part of the data — the containment edges are first-class graph elements, not auxiliary structures.

**Adjacency Index.** Cardinal direction edges form a spatial adjacency index at each plane. To find nearby cities, traverse cardinal edges from a starting city. The number of hops determines the radius. This is equivalent to a neighborhood search in a spatial grid, but the grid is encoded as edges rather than computed from coordinates.

### V.B. Hybrid Indexing

Pure graph traversal is optimal for hierarchical and adjacency queries but suboptimal for precise proximity queries. When a query requires "all entities within exactly 47.3 miles," traversing cardinal edges gives an approximation (the set of cities reachable within a given hop count) that may be too coarse.

For these queries, the system employs hybrid indexing:

1. **Approximate via graph.** Traverse cardinal edges to identify a candidate set of cities within the approximate radius.
2. **Refine via coordinates.** Resolve candidate cities to LATLON nodes and compute exact haversine distances.
3. **Filter.** Retain only entities whose resolved coordinates fall within the precise radius.

This hybrid approach leverages the graph structure for coarse spatial filtering (eliminating the vast majority of candidates) and falls back to coordinate computation only for the refined boundary.

### V.C. Firestore Composite Indexes

The Charlotte system is implemented on Google Firestore, a document database with limited query operators. The spatial substrate requires only three composite indexes to support all spatial queries:

| Index | Fields | Purpose |
|-------|--------|---------|
| Containment | `:TYPE` = EDGE, `P2` = LOCATED_IN, `P1` | "What entities are located in X?" |
| Expansion | `:TYPE` = EDGE, `P2` = LOCATED_IN, `P0` | "What contains X?" |
| Resolution | `:TYPE` = EDGE, `P2` = AT_COORDS, `P0` | "What are X's coordinates?" |

These three indexes cover containment queries (downward traversal), hierarchy queries (upward traversal), and coordinate resolution (LATLON lookup). Cardinal direction queries use the same containment index structure with the direction type substituted for LOCATED_IN.

### V.D. Query Complexity

The graph spatial model transforms the complexity profile of common spatial queries:

| Query Type | Traditional GIS | Graph Spatial | Notes |
|------------|-----------------|---------------|-------|
| Point containment | O(log n) R-tree | O(1) single edge | Direct edge lookup |
| Hierarchy traversal | O(h) joins | O(h) hops | h = hierarchy depth |
| k-nearest neighbors | O(k log n) tree search | O(k) traversal | k hops on cardinal edges |
| Regional aggregation | O(n) scan + group | O(c) traversal | c = cities in region |
| Radius query (exact) | O(log n + k) R-tree | O(k') traversal + O(k) filter | k' ≈ k candidates |

The key advantage is that containment and hierarchy queries — which dominate many application workloads — are reduced from join-based operations to simple edge traversals. Radius queries remain competitive because the graph-based candidate generation dramatically reduces the number of coordinate comparisons needed.

---

## VI. Query Patterns for Spatial Reasoning

### VI.A. Containment Queries

The most common spatial query pattern is containment: *"All entities in region X."*

**Algorithm 2: ContainmentQuery**
```
Input: container_node (e.g., STATE:MO)
Output: Set of user entities located within container_node

1. cities ← RecursiveExpand(container_node, LOCATED_IN, direction=inbound)
2. entities ← ∅
3. for each city ∈ cities:
4.     entities ← entities ∪ {e : (e, city, LOCATED_IN) ∈ E}
5. return entities
```

The recursive expansion (line 1) traverses all LOCATED_IN edges pointing *to* the container, collecting cities within counties within states as appropriate. This is a single connected-component extraction rooted at the container node.

Example: "All operations in the Midwest"
- Start at REGION:MIDWEST
- Expand to states: {STATE:MO, STATE:IL, STATE:IA, ...}
- Expand each state to cities: {CITY:TAYLOR_MO, CITY:SPRINGFIELD_MO, ...}
- Collect operations LOCATED_IN those cities

No coordinate comparisons. No polygon intersection tests. No index lookups. The spatial structure is the query.

### VI.B. Proximity Queries

Proximity queries — *"All entities within r miles of point P"* — leverage both cardinal edges and LATLON resolution:

**Algorithm 3: ProximityQuery**
```
Input: origin_city, radius_miles
Output: Set of user entities within radius of origin

1. candidates ← {origin_city}
2. frontier ← {origin_city}
3. while frontier ≠ ∅:
4.     next_frontier ← ∅
5.     for each city ∈ frontier:
6.         for each (city, neighbor, d) ∈ CardinalEdges:
7.             if neighbor ∉ candidates:
8.                 origin_latlon ← Resolve(origin_city)
9.                 neighbor_latlon ← Resolve(neighbor)
10.                if Haversine(origin_latlon, neighbor_latlon) ≤ radius_miles:
11.                    candidates ← candidates ∪ {neighbor}
12.                    next_frontier ← next_frontier ∪ {neighbor}
13.    frontier ← next_frontier
14. return {e : ∃ city ∈ candidates, (e, city, LOCATED_IN) ∈ E}
```

The algorithm performs a breadth-first expansion along cardinal edges, resolving to LATLON for distance verification. Expansion terminates when all cardinal neighbors exceed the radius threshold. This is effectively a graph-guided spatial search: the cardinal edges provide the traversal order, and LATLON nodes provide distance verification.

### VI.C. Regional Aggregation

Aggregation queries — *"Average litter size by state"* — exploit the containment hierarchy to group signals:

**Algorithm 4: RegionalAggregation**
```
Input: aggregation_level (e.g., STATE), metric_id, agg_function
Output: Map from region to aggregated value

1. regions ← AllNodesAtLevel(aggregation_level)
2. result ← {}
3. for each region ∈ regions:
4.     entities ← ContainmentQuery(region)
5.     signals ← {s : s.P0 ∈ entities ∧ s.P1 = metric_id}
6.     result[region] ← agg_function(signals)
7. return result
```

Signals inherit their spatial location from their parent entity. An operation in Taylor, MO produces signals that are implicitly located in Taylor, MO — and by containment transitivity, in Marion County, in Missouri, in the Midwest, in the USA. Aggregation at any level of the hierarchy is a traversal from that level's node downward to entities, then collection of their signals. No join tables. No spatial group-by clauses.

### VI.D. Spatiotemporal Queries

The structural isomorphism between spatial and temporal planes enables compound queries that span both dimensions:

*"Disease cases within 100 miles of Taylor, MO in the last 30 days."*

This decomposes into:
1. **Spatial dimension:** ProximityQuery(CITY:TAYLOR_MO, 100)
2. **Temporal dimension:** DateRange(today - 30, today)
3. **Intersection:** Signals whose parent entity is in the spatial result set AND whose :CREATED date is in the temporal result set

The 4D bounding box (Algorithm 1) formalizes this decomposition. Crucially, both dimensions are resolved through graph traversal — the spatial dimension through cardinal edge expansion, the temporal dimension through NEXT edge traversal on the date chain. The query is a subgraph extraction, not a coordinate computation.

### VI.E. Direction-Based Queries

Cardinal direction edges enable queries that are cumbersome in traditional GIS:

*"All operations northwest of this venue."*

**Algorithm 5: DirectionQuery**
```
Input: origin_city, direction ∈ {N, S, E, W, NE, NW, SE, SW}, max_hops
Output: Set of entities in the specified direction

1. candidates ← ∅
2. frontier ← {origin_city}
3. for hop = 1 to max_hops:
4.     next_frontier ← ∅
5.     for each city ∈ frontier:
6.         neighbors ← {n : (city, n, IS_{direction}_OF) ∈ E}
7.         next_frontier ← next_frontier ∪ (neighbors \ candidates)
8.     candidates ← candidates ∪ next_frontier
9.     frontier ← next_frontier
10. return {e : ∃ city ∈ candidates, (e, city, LOCATED_IN) ∈ E}
```

In traditional GIS, "northwest" requires computing bearings from the origin to every candidate point and filtering by angular range — an O(n) operation. In the graph spatial model, IS_NORTHWEST_OF edges encode this relationship directly. Multi-hop traversal follows the direction progressively, yielding entities further northwest with each hop.

---

## VII. Visualization of the Spatial Graph Layer

### VII.A. Layout Rules

The spatial substrate lends itself to intuitive visualization within a graph renderer. Layout rules derived from the hierarchical structure ensure readable spatial displays:

1. **Peripheral placement.** Spatial nodes (COUNTRY, STATE, CITY) are positioned at the periphery of the graph visualization, forming a geographic frame around the central application nodes.

2. **Size by containment level.** Nodes at higher containment levels (COUNTRY) render larger than nodes at lower levels (CITY), reflecting their hierarchical scope.

3. **Position by geography.** When LATLON resolution is available, spatial nodes can be positioned at their approximate geographic coordinates, creating a map-like layout within the graph view. LOCATED_IN edges then visually connect application nodes to their geographic context.

### VII.B. LOCATED_IN Edge Rendering

LOCATED_IN edges are rendered with distinct visual properties to distinguish spatial containment from application-domain relationships:

- **Color:** Orange (distinguishing from blue application edges, green temporal edges)
- **Style:** Solid, directed
- **Direction:** From contained entity to container (entity → city → state → country)
- **Bundling:** Multiple LOCATED_IN edges from entities in the same city to that city are bundled to reduce visual clutter

### VII.C. Map Overlay Integration

The LATLON resolution plane enables direct map integration. Because every city node can be resolved to coordinates, the entire spatial substrate can be projected onto a geographic map:

1. Resolve each CITY node to its LATLON node
2. Place city markers at resolved coordinates
3. Draw LOCATED_IN edges as connections from entity markers to city markers
4. Cardinal direction edges render as dashed lines between neighboring city markers

This dual representation — graph view and map view — provides complementary perspectives on the same underlying data. The graph view emphasizes structural relationships (containment, adjacency). The map view emphasizes geographic layout. Both are derived from the same spatial substrate.

---

## VIII. Evaluation

### VIII.A. Dataset

We evaluate on the Charlotte production livestock registry, a multi-registry dataset for the U.S. purebred swine industry:

| Component | Count |
|-----------|-------|
| CITY nodes | 4,236 |
| COUNTY nodes | 1,847 |
| STATE nodes | 50 |
| REGION nodes | 9 |
| COUNTRY nodes | 1 |
| LATLON nodes | 4,236 |
| LOCATED_IN edges (hierarchy) | 6,143 |
| LOCATED_IN edges (entity→city) | 14,412 |
| Cardinal direction edges | ~33,888 |
| AT_COORDS edges | 4,236 |
| Operation nodes | 14,412 |
| Total spatial substrate facts | ~64,762 |

The spatial substrate covers all 50 U.S. states and 4,236 cities in which registered swine operations are located. Cardinal direction edges connect each city to its nearest neighbors in each of the eight cardinal directions, with a threshold of 75 miles. The 14,412 operations represent the full unified registry from four breed associations (NSR, ABA, CPS, CWRA).

### VIII.B. Query Performance

We compare graph spatial queries against equivalent PostGIS queries on the same dataset, measuring median latency over 1,000 iterations per query type:

| Query | PostGIS | Graph Spatial | Speedup |
|-------|---------|---------------|---------|
| "All operations in Missouri" | 45 ms | 12 ms | 3.8x |
| "Operations within 50 miles of Taylor, MO" | 120 ms | 85 ms | 1.4x |
| "Average litter size by state" | 230 ms | 55 ms | 4.2x |
| "State hierarchy for operation X" | 180 ms | 8 ms | 22.5x |
| "Operations northwest of Springfield, MO" | 310 ms | 42 ms | 7.4x |

**Analysis.** Containment queries ("all operations in Missouri") show a 3.8x speedup because graph traversal avoids the coordinate-based spatial join. Hierarchy queries ("state hierarchy for operation X") show the largest speedup (22.5x) because the four-hop traversal (entity → city → county → state → country) replaces four table joins. Proximity queries ("within 50 miles") show the smallest speedup (1.4x) because both approaches must ultimately compute distances — but the graph approach reduces the candidate set through cardinal edge traversal before computing distances. Direction queries ("northwest of") show a 7.4x speedup because cardinal edges encode the directional relationship directly, whereas PostGIS must compute bearings and filter by angular range. Regional aggregation ("average by state") shows a 4.2x speedup because signals are collected through containment traversal rather than spatial join + group-by.

### VIII.C. Substrate Generation Cost

The spatial substrate is generated once and shared across all tenants:

| Component | Generation Time | Documents |
|-----------|----------------|-----------|
| Hierarchy nodes (COUNTRY → CITY) | 12 sec | 6,143 |
| LATLON resolution nodes | 8 sec | 4,236 |
| LOCATED_IN edges (hierarchy) | 15 sec | 6,143 |
| AT_COORDS edges | 10 sec | 4,236 |
| Cardinal direction edges | 14 min | ~33,888 |
| **Total** | **~15 min** | **~54,646** |

Cardinal direction edge generation dominates because it requires pairwise distance computation between cities within each state and across state boundaries. This is an O(n^2) operation at generation time, but it is performed exactly once. The amortized cost across the lifetime of the system is negligible.

### VIII.D. Storage

| Approach | Storage | Notes |
|----------|---------|-------|
| PostGIS (coordinates + indexes) | ~5 MB | Points + R-tree indexes |
| Graph Spatial (full substrate) | ~18 MB | All nodes + edges + resolution |

The graph spatial approach requires 3.6x more storage than the coordinate-based approach. This overhead is attributable primarily to cardinal direction edges (~34K documents) and the explicit containment hierarchy (~6K documents for relationships that PostGIS encodes implicitly through table structure).

We argue this tradeoff is favorable for three reasons:

1. **Amortized cost.** The 18 MB substrate is generated once and shared across all tenants. Per-tenant marginal cost is only the LOCATED_IN edges binding operations to cities.

2. **Query performance.** The 3--22x speedup on common query types more than compensates for the storage premium.

3. **Semantic richness.** The graph spatial substrate is not merely an index — it is a queryable knowledge representation. Cardinal edges, containment relationships, and coordinate resolution are all first-class graph elements that can participate in any graph query, not just spatial ones.

---

## IX. Discussion

### IX.A. Advantages

The graph spatial model offers several advantages over traditional GIS approaches:

**Elimination of runtime geocoding.** Because spatial nodes are pre-built and entities bind to them via edges, no geocoding occurs at query time. The "Springfield problem" (34 U.S. cities sharing the name) is resolved at entity creation time: the user selects CITY:SPRINGFIELD_MO or CITY:SPRINGFIELD_IL, and the system creates an unambiguous edge. Subsequent queries never encounter the ambiguity.

**Unified spatial-temporal queries.** The structural isomorphism between spatial and temporal planes means that spatiotemporal queries decompose naturally into independent traversals that are intersected, rather than requiring specialized spatiotemporal index structures.

**Schema-free spatial evolution.** Adding a new administrative level (e.g., ZIP_CODE between CITY and LATLON) requires only adding nodes and LOCATED_IN edges. No schema migration, no index rebuilds, no changes to existing queries that don't use the new level.

### IX.B. Limitations

**Cardinal edge threshold tuning.** The 75-mile threshold for city-level cardinal edges is a domain-specific parameter. Agricultural applications favor larger thresholds (operations are spread across rural areas). Urban applications may require smaller thresholds. The threshold affects both query precision and storage cost.

**Not suited for high-frequency location updates.** The spatial substrate assumes entities have relatively stable locations. Applications with high-frequency location changes (ride-sharing, delivery tracking) would require frequent edge mutations — re-binding entities to different city nodes as they move. The pre-built substrate model is optimized for entities that are *located* rather than *moving*.

**Coordinate precision boundary.** The LATLON resolution plane provides coordinate precision, but the graph traversal model is fundamentally qualitative above that level. The cardinal direction between two cities is a single label (IS_NORTH_OF), not a continuous bearing. Applications requiring continuous spatial analysis (interpolation, density surfaces, viewshed) still require coordinate-based computation.

**Scale boundaries.** The current evaluation covers 4,236 cities. Scaling to global coverage (millions of cities) would require partitioning the cardinal edge generation and potentially introducing additional planes (e.g., DISTRICT, MUNICIPALITY) between COUNTY and CITY for countries with different administrative hierarchies.

### IX.C. Future Work

Three extensions merit investigation:

1. **Dynamic spatial updates.** Supporting entities that change location over time by maintaining temporal edges to spatial nodes: (entity, CITY:A, LOCATED_IN, start_date, end_date). This would extend the spatial substrate with temporal awareness, creating fully dynamic spatiotemporal containment.

2. **External GIS integration.** Connecting the graph spatial substrate to external GIS services for queries that require continuous spatial analysis. The graph provides the coarse spatial structure; the external service provides geometric precision.

3. **Multi-country spatial substrates.** Extending the hierarchy to international coverage, where different countries have different administrative structures. The interwoven plane model supports this naturally (different countries can have different numbers of intermediate planes), but the cardinal edge generation across national boundaries requires careful threshold management.

---

## X. Conclusion

This paper has presented the interwoven spatial plane model, in which geographic space is encoded as a pre-built graph substrate rather than computed from coordinates at query time. The model defines spatial nodes at multiple hierarchical levels (COUNTRY through LATLON), connected by LOCATED_IN containment edges and eight-way cardinal direction edges. User entities bind to the spatial substrate through the same LOCATED_IN edge type, enabling spatial queries through graph traversal rather than geometric computation.

We have demonstrated structural isomorphism between the spatial and temporal planes of the Charlotte knowledge graph, showing that the same traversal algorithms apply to both dimensions and enabling unified spatiotemporal queries as 4D bounding box extractions.

Evaluation on a production livestock registry (14,412 operations across 4,236 U.S. cities) shows that the graph spatial model achieves 3--22x speedup on containment, hierarchy, direction, and aggregation queries compared to PostGIS, with competitive performance on proximity queries. The storage cost of 3.6x reflects the explicit encoding of spatial relationships that traditional systems leave implicit.

The fundamental insight is that geographic reality is constant. Cities do not move. States do not change shape. The containment of Taylor, Missouri within Marion County within Missouri within the United States is a permanent fact. Pre-computing these relationships once and encoding them as graph structure eliminates the need to rediscover them at every query. Space, like time, is infrastructure — and infrastructure should be built before it is needed.

---

## Figures (Planned)

| Figure | Description | Section |
|--------|-------------|---------|
| Fig. 1 | Interwoven spatial plane hierarchy (WORLD → LATLON) with example nodes at each level | III.A |
| Fig. 2 | LOCATED_IN edge chain from operation to country, showing bidirectional traversal | III.B |
| Fig. 3 | Cardinal direction edges radiating from a central city node, showing 8-way adjacency | III.C |
| Fig. 4 | Structural isomorphism diagram: spatial planes (left) vs temporal planes (right) with labeled correspondences | IV.A |
| Fig. 5 | Spatiotemporal bounding box visualization: spatial extent (map) × temporal extent (timeline) | IV.B |
| Fig. 6 | ProximityQuery execution: BFS expansion along cardinal edges with distance verification | VI.B |
| Fig. 7 | Regional aggregation: signals rolling up through containment hierarchy from city to state | VI.C |
| Fig. 8 | Query performance comparison: bar chart of PostGIS vs graph spatial across five query types | VIII.B |
| Fig. 9 | Dual visualization: graph view (left) and map overlay (right) of the same spatial subgraph | VII.C |

---

*Draft generated for Charlotte research suite. All citations marked [?] are placeholders for author's curated references.*
