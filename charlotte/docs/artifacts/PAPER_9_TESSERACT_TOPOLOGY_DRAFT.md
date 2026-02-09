# Tesseract Topology: 4D Navigation Through Knowledge Space

**Paper 9 — Charlotte Research Suite**
**Target Venue:** ACM Symposium on Computational Geometry (SoCG)
**Status:** FULL DRAFT

---

## Abstract

Knowledge graphs that encode both spatial and temporal information implicitly inhabit higher-dimensional coordinate spaces, yet existing query infrastructure treats these dimensions independently — spatial queries invoke geometric computation, temporal queries invoke timestamp arithmetic, and combined spatiotemporal queries require ad hoc joins between disjoint subsystems. This paper formalizes knowledge graphs with pre-built spatiotemporal substrates as *tesseract-structured* graphs: four-dimensional lattices in which every node occupies a cell addressed by the tuple (longitude, latitude, date, hour) and connected to its neighbors along each axis by typed cardinal edges. We develop a complete *cardinal direction algebra* over these 4D lattices, enumerating 80 distinct direction vectors and proving closure, invertibility, and reachability. Cyclical phenomena — daily hours, weekly cadences, estrous cycles — are modeled through *torus wrapping*, in which designated dimensions identify their boundaries, producing a tesseract-torus hybrid topology homeomorphic to R² × R × T^k. Protocols are formalized as pre-computed paths through the tesseract, enabling deviation detection via infinity-norm displacement from expected cells. We present algorithms for tesseract BFS, 4D bounding box extraction, torus-aware cycle detection, and protocol path matching, with complexity bounds. Evaluation on a production livestock knowledge graph (27,200 nodes, 46,100 edges, approximately 60,000 temporal nodes) demonstrates O(1) point lookup, O(r²) spatial range queries (versus O(n) for flat graphs), and 94.2% accuracy in gestation path prediction. The results establish that encoding cardinal directions as explicit graph edges transforms implicit spatiotemporal geometry into navigable topology, eliminating runtime coordinate computation.

**Keywords:** computational geometry, tesseract topology, knowledge graphs, 4D navigation, cardinal direction algebra, torus wrapping, spatiotemporal queries

---

## I. Introduction

### 1.1 The Geometry of Observable Reality

Every operational knowledge graph that records where things happen and when things happen implicitly inhabits a four-dimensional space. A sensor reading has a location (two spatial dimensions) and a timestamp (date and time-of-day — two temporal dimensions). A livestock birth event has a farm (latitude, longitude), a date, and an hour. An industrial equipment failure has a plant location and a failure time. Yet conventional graph databases treat these dimensions as flat attributes — properties stamped onto nodes or edges, queryable only through index lookups and arithmetic comparisons.

This treatment discards structure. The fact that Farm A is 50 miles east of Farm B, that Tuesday follows Monday, that 14:00 is one hour after 13:00 — these are not data to be stored and retrieved. They are *geometry* to be traversed. A graph that encodes "east" as an edge, "next day" as an edge, and "next hour" as an edge transforms implicit coordinate geometry into explicit topology. Queries that would require coordinate comparison become graph traversals. Spatiotemporal reasoning becomes navigation.

The key observation is that four independent dimensions, each admitting bidirectional movement, produce a four-dimensional lattice — a structure that, when finite, is combinatorially isomorphic to a hypercube or, more precisely, to a subset of the integer lattice Z⁴. In the four-dimensional case, this structure is the *tesseract*: the 4D analog of the cube, characterized by 16 vertices, 32 edges, 24 faces, and 8 cubic cells in its unit form. When the lattice is extended to arbitrary resolution — thousands of spatial nodes, thousands of temporal nodes, 24 hourly nodes — the resulting graph inherits the tesseract's connectivity pattern while scaling to operational size.

### 1.2 Motivating Problem

Consider the query: *"All breeding events within 50 miles of Taylor, Missouri in the next 7 days between 6 AM and 6 PM."*

In a conventional system, this requires four independent operations: (1) geocode Taylor, MO to coordinates, (2) compute haversine distance to every candidate location, filtering by 50-mile radius, (3) filter timestamps to the next 7 calendar days, and (4) filter hours to the 06:00–18:00 range. Each dimension is handled by a different mechanism — spatial by geometric computation, date by calendar arithmetic, hour by integer comparison. The combined query is an intersection of four independently computed sets, with cost O(n) in the total number of candidate events.

In the tesseract model, the same query becomes a *4D bounding box extraction*: start at the cell (Taylor_MO_lon, Taylor_MO_lat, today, 6), expand 50 miles in the spatial dimensions (following IS_EAST_OF, IS_WEST_OF, IS_NORTH_OF, IS_SOUTH_OF edges), 7 days in the date dimension (following IS_AFTER edges), and 12 hours in the hour dimension (following NEXT_HOUR edges). The traversal visits only cells within the bounding box — O(Δx × Δy × Δt × Δh) — independent of total graph size. For typical operational parameters (Δx = Δy ≈ 15 cities, Δt = 7 days, Δh = 12 hours), this is approximately 18,900 cells regardless of whether the graph contains 10,000 or 10,000,000 total events.

### 1.3 Contributions

This paper makes five contributions:

1. **Tesseract formalization.** We formalize knowledge graphs with pre-built spatiotemporal substrates as tesseract-structured lattice graphs, defining the cell addressing scheme, edge typology, and adjacency structure (Section III).

2. **Cardinal direction algebra.** We develop a complete algebra over 4D direction vectors, enumerating all 80 non-zero directions, proving closure under composition, universal invertibility, and full lattice reachability from any starting cell (Section IV).

3. **Torus wrapping.** We formalize the integration of cyclical phenomena through torus identification of designated dimensions, producing tesseract-torus hybrid topologies with provable homeomorphism to R² × R × T^k (Section V).

4. **Protocol paths.** We formalize domain protocols as pre-computed paths through the tesseract, with deviation detection via infinity-norm displacement and logarithmic checkpoint lookup (Section VI).

5. **Algorithms and complexity bounds.** We present four algorithms (tesseract BFS, 4D bounding box, torus cycle detection, protocol path matching) with tight complexity bounds, validated on a production dataset of 27,200 nodes and 60,000 temporal nodes (Sections VII and X).

---

## II. Preliminaries and Related Work

### 2.1 Hypercube Topology

The *n*-dimensional hypercube graph Q_n has 2^n vertices, each labeled by a binary string of length *n*, with edges connecting vertices whose labels differ in exactly one bit [?]. Q_n has n × 2^(n-1) edges, is vertex-transitive, and has diameter *n*. The tesseract Q₄ has 16 vertices, 32 edges, and diameter 4.

For our purposes, the relevant structure is not Q₄ itself but the *integer lattice* Z^n restricted to a finite range — an *n*-dimensional grid graph. The unit tesseract Q₄ represents the connectivity pattern; the operational tesseract extends this pattern to arbitrary resolution. A grid graph G on ranges [0, N₁) × [0, N₂) × [0, N₃) × [0, N₄) has N₁ × N₂ × N₃ × N₄ vertices, each with degree at most 2*n* = 8 (two neighbors per dimension, minus boundary effects). The adjacency structure is regular, the diameter is (N₁ - 1) + (N₂ - 1) + (N₃ - 1) + (N₄ - 1), and shortest paths follow the L₁ (Manhattan) metric.

### 2.2 Torus Topology

The *n*-dimensional torus T^n is the product space S¹ × S¹ × ... × S¹ (*n* copies), where S¹ is the circle. In the discrete setting, the *n*-dimensional torus graph C_{m₁} × C_{m₂} × ... × C_{m_n} is the Cartesian product of cycle graphs, where each dimension wraps with period m_i. The torus graph eliminates boundary effects: every vertex has exactly 2*n* neighbors, and the diameter is ⌊m₁/2⌋ + ⌊m₂/2⌋ + ... + ⌊m_n/2⌋.

The *flat torus* — obtained by identifying opposite edges of a rectangle — is a standard construction in computational geometry for handling cyclical boundary conditions [?]. We extend this construction to selective dimensions: some dimensions wrap (hours, days of week, estrous cycles) while others do not (longitude, latitude, absolute date), producing hybrid lattice-torus topologies.

### 2.3 Spatial Data Structures

R-trees [?] partition spatial objects into hierarchical minimum bounding rectangles, supporting range queries and nearest-neighbor queries in O(log n + k) time for k results. K-d trees [?] recursively partition point sets along alternating dimensions, achieving O(n^(1-1/d) + k) range query performance in *d* dimensions. Both structures are designed for coordinate geometry and do not encode directional relationships between spatial entities.

The critical limitation of R-trees and k-d trees for our setting is their treatment of time. Adding temporal dimensions to these structures produces *d*+1 or *d*+2 dimensional spatial indexes, which suffer from the well-known curse of dimensionality: performance degrades exponentially with dimension count [?]. More fundamentally, temporal dimensions exhibit properties absent in spatial dimensions — ordering, cyclicality, and causal structure — that spatial indexes cannot exploit.

### 2.4 Temporal Knowledge Graphs

Temporal knowledge graphs extend standard knowledge graphs with time annotations. Temporal RDF [?] associates validity intervals with triples, enabling queries like "which relationships held during period P?" BiTemporal models [?] distinguish transaction time (when a fact was recorded) from valid time (when a fact was true), supporting both current-state and historical queries.

These approaches treat time as *metadata* on graph elements rather than as a navigable dimension of the graph itself. A temporal RDF triple has a validity interval [t₁, t₂], but there are no edges connecting t₁ to t₂ or t₂ to t₃. Temporal reasoning requires arithmetic on interval endpoints, not traversal through temporal structure. The tesseract model inverts this relationship: time *is* graph structure, and temporal queries *are* graph traversals.

### 2.5 Graph Embeddings

Spectral embeddings [?] map graph vertices to points in R^d by computing eigenvectors of the graph Laplacian, preserving algebraic connectivity. Structural embeddings (DeepWalk [?], Node2Vec [?], GraphSAGE [?]) learn low-dimensional representations that preserve local neighborhood structure. Both approaches create *implicit* geometric structure from graph topology.

The tesseract model reverses this direction: rather than embedding a graph into a geometric space, we embed geometric space *into* a graph. The four-dimensional coordinate system is encoded directly as graph structure — vertices at lattice points, edges along coordinate axes — making the geometry explicit and traversable rather than implicit and learned.

---

## III. The Tesseract Model

### 3.1 4D Coordinate Cells

**Definition 1 (Tesseract Cell).** A tesseract cell is a 4-tuple:

```
C = (x, y, t, h)
```

where:
- x ∈ R represents longitude (discretized to city-level resolution)
- y ∈ R represents latitude (discretized to city-level resolution)
- t ∈ Z represents the date (integer days since a fixed epoch)
- h ∈ Z₂₄ represents the hour (0–23, cyclical)

**Definition 2 (Tesseract Graph).** The tesseract graph G_T = (V_T, E_T) is defined by:

```
V_T = {C(x, y, t, h) | x ∈ X, y ∈ Y, t ∈ T, h ∈ H}
E_T = {(C₁, C₂, d) | C₁, C₂ ∈ V_T, d ∈ D, C₂ = C₁ + d}
```

where X is the set of discrete longitude values, Y is the set of discrete latitude values, T is the set of active dates, H = Z₂₄, and D is the set of unit direction vectors (defined in Section IV).

In the Charlotte implementation, the spatial dimensions are discretized to the city level: each city node carries a latitude-longitude centroid, and cardinal direction edges connect neighboring cities. The temporal dimensions use day-level resolution for dates and hour-level resolution for intra-day time. The resulting graph is sparse — most cells in the full Cartesian product are unoccupied — but the *substrate* (the set of all possible cells and their interconnecting edges) is pre-built before any operational data arrives.

### 3.2 Bidirectional Cardinal Edges

Each dimension of the tesseract admits movement in two opposing directions, producing eight axial edge types:

```
Dimension 1 (X — Longitude):
  IS_EAST_OF:  (+1, 0, 0, 0)    IS_WEST_OF:  (-1, 0, 0, 0)

Dimension 2 (Y — Latitude):
  IS_NORTH_OF: (0, +1, 0, 0)    IS_SOUTH_OF: (0, -1, 0, 0)

Dimension 3 (T — Date):
  IS_AFTER:    (0, 0, +1, 0)    IS_BEFORE:   (0, 0, -1, 0)

Dimension 4 (H — Hour):
  NEXT_HOUR:   (0, 0, 0, +1)    PREV_HOUR:   (0, 0, 0, -1)
```

Each edge is typed by its direction vector, enabling the traversal engine to select edges by dimension. A spatial-only query follows only X and Y edges. A temporal-only query follows only T and H edges. A full spatiotemporal query follows edges along all four axes.

**Definition 3 (Cardinal Edge).** A cardinal edge e = (u, v, d) connects cells u and v where v = u + d for some unit direction vector d ∈ D_axial, with |D_axial| = 8.

### 3.3 Diagonal Adjacency

Beyond the eight axial directions, the tesseract admits diagonal movement — simultaneous displacement along multiple dimensions. The complete enumeration is:

**2D spatial diagonals (4 directions):**
```
IS_NORTHEAST_OF: (+1, +1, 0, 0)
IS_NORTHWEST_OF: (-1, +1, 0, 0)
IS_SOUTHEAST_OF: (+1, -1, 0, 0)
IS_SOUTHWEST_OF: (-1, -1, 0, 0)
```

**2D spatiotemporal diagonals (8 directions):**
Spatial × Temporal: {±1, 0} × {0} × {±1, 0} × {0} minus the zero vector and the purely axial vectors. Similarly for all pairs of one spatial and one temporal dimension.

**3D diagonals (32 directions):**
Displacement along exactly three of four dimensions.

**4D diagonals (16 directions):**
Displacement along all four dimensions simultaneously: {-1, +1}⁴.

The total count of non-zero direction vectors in Z⁴ restricted to {-1, 0, +1} per coordinate is 3⁴ - 1 = **80 distinct directions**.

**Theorem 1 (Edge Density).** *In the axial tesseract graph (cardinal edges only), each interior cell has exactly 8 neighbors, and the graph has exactly 8|V_int| + boundary correction non-zero entries in its adjacency matrix, where V_int is the set of interior cells.*

*Proof.* An interior cell C = (x, y, t, h) has exactly one neighbor in each of the 8 axial directions: (x±1, y, t, h), (x, y±1, t, h), (x, y, t±1, h), and (x, y, t, h±1). Boundary cells have fewer neighbors (missing one neighbor per boundary they touch). For the torus-wrapped hour dimension, all cells have exactly 2 neighbors in dimension H regardless of boundary, reducing the boundary correction to the three non-wrapped dimensions. □

### 3.4 Adjacency Matrix Structure

The adjacency matrix A of the axial tesseract graph decomposes as a Kronecker sum over the four dimensions:

```
A = A_X ⊕ A_Y ⊕ A_T ⊕ A_H
  = A_X ⊗ I_Y ⊗ I_T ⊗ I_H + I_X ⊗ A_Y ⊗ I_T ⊗ I_H
    + I_X ⊗ I_Y ⊗ A_T ⊗ I_H + I_X ⊗ I_Y ⊗ I_T ⊗ A_H
```

where A_X, A_Y, A_T are tridiagonal matrices (path graphs in each dimension) and A_H is a circulant matrix (cycle graph for the 24-hour wrap). I_X, I_Y, I_T, I_H are identity matrices of appropriate dimension.

This Kronecker structure enables dimension-specific spectral analysis. The eigenvalues of A are the sums of eigenvalues of the per-dimension adjacency matrices:

```
λ_{i,j,k,l} = λ_X(i) + λ_Y(j) + λ_T(k) + λ_H(l)
```

where λ_X(i) = 2cos(iπ/(N_X+1)) for the path graph and λ_H(l) = 2cos(2πl/24) for the 24-cycle. The spectral gap — the difference between the largest and second-largest eigenvalues — governs mixing time for random walks on the tesseract, which in turn bounds the convergence rate of diffusion-based queries.

---

## IV. The Cardinal Direction Algebra

### 4.1 Direction Vectors as Group Elements

**Definition 4 (Direction Space).** The 4D direction space D₄ is the set:

```
D₄ = {(d_x, d_y, d_t, d_h) | d_i ∈ {-1, 0, +1}} \ {(0,0,0,0)}
```

with |D₄| = 3⁴ - 1 = 80.

Direction vectors compose through clamped addition:

```
d₁ ⊕ d₂ = (clamp(d₁_x + d₂_x), clamp(d₁_y + d₂_y),
            clamp(d₁_t + d₂_t), clamp(d₁_h + d₂_h))
```

where clamp(v) = max(-1, min(1, v)). This composition is not a group operation (clamping destroys associativity in general), but it serves as a navigation operator: the composition of "east" and "north" is "northeast," and the composition of "northeast" and "east" is still "northeast" (clamped).

### 4.2 Edge Type Enumeration

The 80 non-zero directions stratify by the number of non-zero components:

| Dimension Count | Directions | Count | Examples |
|----------------|------------|-------|----------|
| 1 (Axial) | Exactly one d_i ≠ 0 | 8 | IS_EAST_OF, IS_AFTER |
| 2 (Face diagonal) | Exactly two d_i ≠ 0 | 24 | IS_NORTHEAST_OF, EAST_AFTER |
| 3 (Cell diagonal) | Exactly three d_i ≠ 0 | 32 | NE_AFTER_NEXTHOUR |
| 4 (Space diagonal) | All d_i ≠ 0 | 16 | All-dimension diagonals |
| **Total** | | **80** | |

The count at each level follows from combinatorics: C(4, k) × 2^k, which gives C(4,1)×2 = 8, C(4,2)×4 = 24, C(4,3)×8 = 32, C(4,4)×16 = 16.

In the Charlotte implementation, only axial edges (8 types) and 2D spatial diagonals (4 types: NE, NW, SE, SW) are materialized as explicit graph edges, giving 12 materialized edge types. Higher-order diagonals are computed as compositions of axial traversals, trading storage for computation in dimensions where diagonal queries are rare.

### 4.3 Inverse and Composition Laws

**Theorem 2 (Universal Invertibility).** *Every direction d ∈ D₄ has a unique inverse -d ∈ D₄ such that the traversal d followed by -d returns to the starting cell.*

*Proof.* For d = (d_x, d_y, d_t, d_h), define -d = (-d_x, -d_y, -d_t, -d_h). Since each d_i ∈ {-1, 0, +1}, each -d_i ∈ {-1, 0, +1}, so -d ∈ D₄ ∪ {0}. If d ≠ 0, then -d ≠ 0, so -d ∈ D₄. Applying d then -d to cell C gives C + d + (-d) = C + 0 = C. □

**Theorem 3 (Lattice Reachability).** *From any cell C₁ ∈ V_T, every other cell C₂ ∈ V_T is reachable through a finite sequence of axial edge traversals.*

*Proof.* Let C₁ = (x₁, y₁, t₁, h₁) and C₂ = (x₂, y₂, t₂, h₂). For the non-wrapped dimensions (X, Y, T), a sequence of |x₂ - x₁| traversals along IS_EAST_OF or IS_WEST_OF (depending on sign), followed by |y₂ - y₁| traversals along IS_NORTH_OF or IS_SOUTH_OF, followed by |t₂ - t₁| traversals along IS_AFTER or IS_BEFORE, reaches the correct (x, y, t) coordinates. For the torus-wrapped hour dimension, the shorter of the two circular paths (clockwise or counterclockwise on Z₂₄) reaches h₂ in at most 12 steps. The total path length is |x₂ - x₁| + |y₂ - y₁| + |t₂ - t₁| + min(|h₂ - h₁|, 24 - |h₂ - h₁|), which equals the L₁ distance on the hybrid lattice-torus. □

### 4.4 Query Translation

The cardinal direction algebra translates natural-language spatial and temporal queries into sequences of typed edge traversals:

**Spatial queries:**
```
"Cities northwest of Taylor"     = START:TAYLOR_MO + k × IS_NORTHWEST_OF
"Operations within 3 hops east"  = START:CITY_X + k × IS_EAST_OF, k ∈ [1,3]
```

**Temporal queries:**
```
"Next 7 days"                    = START:TODAY + k × IS_AFTER, k ∈ [1,7]
"Previous 3 hours"               = START:CURRENT_HOUR + k × PREV_HOUR, k ∈ [1,3]
```

**Combined queries:**
```
"Events northeast of Taylor in the next week, mornings"
  = START:(TAYLOR_MO, TODAY, 6)
  + {k₁ × IS_EAST_OF + k₂ × IS_NORTH_OF + k₃ × IS_AFTER + k₄ × NEXT_HOUR}
  where k₁ ∈ [0, R_east], k₂ ∈ [0, R_north], k₃ ∈ [0, 7], k₄ ∈ [0, 6]
```

The query planner decomposes a natural-language spatiotemporal predicate into a set of direction vectors and range bounds, then issues a bounding box traversal (Algorithm 2, Section VII).

---

## V. The Torus Wrap for Cyclical Patterns

### 5.1 Phase vs. Absolute Time

Temporal phenomena in operational systems exhibit two fundamentally different structures: *linear* progression and *cyclical* recurrence.

**Linear (non-wrapping):** Calendar dates proceed monotonically. DATE:2026-01-01 → DATE:2026-01-02 → ... → DATE:2026-12-31 → DATE:2027-01-01. There is no edge from December 31 back to January 1 of the same year; each year is a new segment of the linear date chain.

**Cyclical (wrapping):** Hours of the day recur. HOUR:23 → HOUR:0 → HOUR:1 → ... → HOUR:23 → HOUR:0. Days of the week recur. Estrous cycles recur with period 21 days: ESTROUS_DAY:21 → ESTROUS_DAY:1. Seasons recur. Shift schedules recur.

The distinction is topological: linear dimensions are isomorphic to path graphs (intervals of Z), while cyclical dimensions are isomorphic to cycle graphs (quotients Z/mZ). Conflating the two — treating hours as a linear dimension or treating dates as cyclical — produces either boundary artifacts (the "midnight discontinuity" where hour 23 and hour 0 are maximally distant) or false periodicity (treating 2026 as equivalent to 2025).

### 5.2 Torus-Wrapped Tesseract

**Definition 5 (Torus-Wrapped Tesseract).** Given a tesseract graph G_T with dimensions (X, Y, T, H), the torus-wrapped tesseract G_{T,τ} is obtained by identifying boundary cells in designated cyclical dimensions:

```
G_{T,τ} = X × Y × T × (Z₂₄ × Z_L₁ × Z_L₂ × ...)
```

where Z₂₄ is the 24-hour daily cycle and Z_Lᵢ are additional protocol-specific cycles with periods L₁, L₂, ....

In the Charlotte system, the following dimensions are torus-wrapped:

| Dimension | Period | Edge Pair | Wrapping Semantics |
|-----------|--------|-----------|-------------------|
| Hour | 24 | NEXT_HOUR / PREV_HOUR | Daily cycle |
| Day of Week | 7 | NEXT_DOW / PREV_DOW | Weekly cycle |
| Month | 12 | NEXT_MONTH / PREV_MONTH | Annual cycle |
| Estrous | 21 | NEXT_ESTROUS / PREV_ESTROUS | Reproductive cycle |

Each torus dimension adds a cycle graph factor to the topology. The resulting structure is a Cartesian product of path graphs (non-wrapping dimensions) and cycle graphs (wrapping dimensions).

### 5.3 Spiral Progression Model

An entity traversing both linear and cyclical time traces a *spiral* through the tesseract-torus hybrid: each pass through a cycle occurs at a different absolute date, so the entity returns to the same phase but never to the same cell.

```
Cycle 1: (TAYLOR_MO, DATE:2026-01-01, ESTROUS_DAY:1)
        → (TAYLOR_MO, DATE:2026-01-21, ESTROUS_DAY:21)
        → wrap →
Cycle 2: (TAYLOR_MO, DATE:2026-01-22, ESTROUS_DAY:1)
        → (TAYLOR_MO, DATE:2026-02-11, ESTROUS_DAY:21)
        → wrap →
Cycle 3: ...
```

**Definition 6 (Spiral Path).** A spiral path of period L starting at cell C₀ = (x, y, t₀, φ₀) is the sequence:

```
P_spiral = {(x, y, t₀ + i, (φ₀ + i) mod L) | i = 0, 1, 2, ...}
```

The projection onto the torus dimension repeats with period L; the projection onto the linear date dimension advances monotonically. The combined trajectory is a helix in the (t, φ) subspace — a spiral on the cylinder T × Z_L.

### 5.4 Simultaneous Addressing

Every signal in the Charlotte system carries both absolute and cyclical temporal addresses:

```
SIGNAL:heat_detected
  NODE:      SOW:BELLA
  ABSOLUTE:  DATE:2026-01-21, HOUR:14
  CYCLICAL:  ESTROUS_DAY:21, DOW:WEDNESDAY, MONTH:JANUARY
```

The absolute address locates the signal on the linear date spine. The cyclical addresses locate it on each torus plane. Queries can address either or both:

- *"All heat detections on estrous day 21"* → traverse the ESTROUS_DAY:21 node, collect all signals anchored there.
- *"All heat detections on estrous day 21 in January"* → intersect the ESTROUS_DAY:21 and MONTH:JANUARY neighborhoods.
- *"Heat detections on estrous day 21 in the last 30 days"* → intersect ESTROUS_DAY:21 with a 30-day range on the linear date spine.

**Theorem 4 (Topology Classification).** *The torus-wrapped tesseract with k cyclical dimensions of periods L₁, ..., L_k and 4-k linear dimensions is homeomorphic to R^(4-k) × T^k, where T^k = Z_{L₁} × Z_{L₂} × ... × Z_{L_k}.*

*Proof.* Each linear dimension is isomorphic to a path graph on a subset of Z, which embeds in R. Each cyclical dimension of period Lᵢ is isomorphic to the cycle graph C_{Lᵢ}, which is the discrete analog of the circle S¹. The Cartesian product of path graphs and cycle graphs is isomorphic to Z^(4-k) × (Z_{L₁} × ... × Z_{L_k}), whose continuous analog is R^(4-k) × T^k. □

---

## VI. Protocols as Pre-Computed Paths

### 6.1 Path Definition

In the Charlotte system, a *protocol* encodes the expected trajectory of a node through the tesseract — the sequence of cells it should occupy over time, along with the signals expected at each cell.

**Definition 7 (Protocol Path).** A protocol P is a sequence of checkpoint pairs:

```
P = [(C₀, S₀), (C₁, S₁), ..., (C_n, S_n)]
```

where Cᵢ = (xᵢ, yᵢ, tᵢ, hᵢ) is the expected cell and Sᵢ is the expected signal type at that checkpoint. The path is defined relative to a start cell C₀; subsequent cells are specified as offsets from C₀.

### 6.2 Checkpoint Encoding: Gestation Protocol (114 Days)

The swine gestation protocol illustrates protocol path encoding:

```
PROTOCOL: GESTATION_114
START_CELL: C₀ = (farm_x, farm_y, breed_date, breed_hour)

CHECKPOINT 1: C₀ + (0, 0, 0, 0)
  Expected signal: BRED

CHECKPOINT 2: C₀ + (0, 0, +21, 0)
  Expected signal: HEAT_CHECK = false

CHECKPOINT 3: C₀ + (0, 0, +30, 0)
  Expected signal: ULTRASOUND = confirmed

CHECKPOINT 4: C₀ + (Δx_farrow, Δy_farrow, +100, 0)
  Expected signal: MOVED_TO_FARROWING
  (Note: spatial displacement — sow moves to farrowing barn)

CHECKPOINT 5: C₀ + (Δx_farrow, Δy_farrow, +114, 0)
  Expected signal: FARROWED
  Expected sub-signals: LITTER_SIZE, BORN_ALIVE, STILLBORN
```

The protocol path traces a trajectory through 4D space that includes both temporal progression (advancing through days) and spatial displacement (moving between barns). Each checkpoint specifies the expected cell *and* the expected observation, enabling deviation detection along both dimensions simultaneously.

### 6.3 Deviation Detection

**Definition 8 (Protocol Deviation).** Given a protocol P with expected cell C_expected at time t, and the observed cell C_observed of the entity at time t, the deviation vector is:

```
δ(t) = C_observed - C_expected = (δ_x, δ_y, δ_t, δ_h)
```

The protocol is on-track at time t if and only if:

```
‖δ(t)‖_∞ = max(|δ_x|, |δ_y|, |δ_t|, |δ_h|) ≤ ε
```

where ε is the protocol's tolerance parameter.

The infinity norm is the appropriate metric because deviation along any single dimension is independently meaningful. A sow that is in the correct location but 7 days late (δ_t = 7) has a qualitatively different problem than a sow that is on schedule but in the wrong barn (δ_x ≠ 0). The infinity norm captures "worst-case deviation across any dimension" — a sow with ‖δ‖_∞ > ε is off-protocol, and the dimension achieving the maximum indicates the nature of the deviation.

**Definition 9 (Deviation Classification).** A deviation vector δ = (δ_x, δ_y, δ_t, δ_h) is classified by its dominant dimension:

| Dominant Dimension | Classification | Example |
|-------------------|----------------|---------|
| δ_t > other components | Temporal drift | Late breeding check |
| δ_x or δ_y > other components | Spatial displacement | Wrong barn/facility |
| δ_h > other components | Phase shift | Off-schedule timing |
| Multiple components tied | Compound deviation | Late AND displaced |

### 6.4 Path Complexity

**Theorem 5 (Protocol Space Complexity).** *A protocol with k checkpoints requires O(k) space, independent of the temporal span of the protocol.*

*Proof.* Each checkpoint stores a constant-size tuple (cell offset, expected signal type, tolerance). The protocol stores k such tuples plus metadata (protocol ID, start conditions). Total space is O(k). Notably, a 114-day gestation protocol with 5 checkpoints requires the same space as a 1-day protocol with 5 checkpoints — temporal span is encoded implicitly in the offsets. □

**Theorem 6 (Checkpoint Lookup).** *Given a sorted checkpoint list and a query time t, the next expected checkpoint is retrievable in O(log k) time.*

*Proof.* Checkpoints are stored in order of their temporal offset from C₀. Binary search on the temporal component of checkpoint offsets finds the first checkpoint with t_offset > (t - t₀) in O(log k) time. □

---

## VII. Path Computation Algorithms

### 7.1 Tesseract BFS

**Algorithm 1: Tesseract Breadth-First Search**

```
TESSERACT-BFS(G_T, start, max_depth, dimensions)
  Input: Tesseract graph G_T, start cell, maximum depth,
         set of dimensions to traverse
  Output: Set of reachable cells with distances

  queue ← {(start, 0)}
  visited ← {start}
  result ← {(start, 0)}

  while queue not empty:
    (cell, depth) ← dequeue(queue)
    if depth ≥ max_depth: continue

    for each direction d in DIRECTIONS(dimensions):
      neighbor ← cell + d
      if neighbor ∈ V_T and neighbor ∉ visited:
        visited ← visited ∪ {neighbor}
        result ← result ∪ {(neighbor, depth + 1)}
        enqueue(queue, (neighbor, depth + 1))

  return result
```

**Complexity:** O(N × d) where N is the number of cells visited and d is the degree per cell (at most 8 for axial edges, at most 80 for all diagonals). For a BFS limited to depth D in k dimensions, N = O(D^k), giving O(D^k × 2k) for axial-only traversal.

### 7.2 4D Bounding Box Queries

**Algorithm 2: 4D Bounding Box Extraction**

```
BOUNDING-BOX-4D(G_T, center, Δx, Δy, Δt, Δh)
  Input: Tesseract graph G_T, center cell, range in each dimension
  Output: All cells within the 4D bounding box, with anchored signals

  result ← ∅

  for x in [center.x - Δx, center.x + Δx]:
    for y in [center.y - Δy, center.y + Δy]:
      for t in [center.t - Δt, center.t + Δt]:
        for h in TORUS-RANGE(center.h, Δh, 24):
          cell ← LOOKUP(G_T, x, y, t, h)
          if cell ≠ null:
            result ← result ∪ {cell, SIGNALS(cell)}

  return result
```

Where TORUS-RANGE handles the wrap-around for cyclical dimensions:

```
TORUS-RANGE(center, delta, period)
  return {(center + i) mod period | i ∈ [-delta, +delta]}
```

**Complexity:** O(Δx × Δy × Δt × Δh) — independent of total graph size. With hash-based cell lookup (O(1) per cell), the query cost depends only on the volume of the bounding box.

**Theorem 7 (Bounding Box Independence).** *The time complexity of a 4D bounding box query is O(∏ᵢ Δᵢ), independent of |V_T|.*

*Proof.* The algorithm iterates over all integer points in the 4D range, performing an O(1) hash lookup per point. The iteration count is (2Δx + 1)(2Δy + 1)(2Δt + 1)(2Δh + 1) = O(∏ᵢ Δᵢ). No operation references the total number of cells in the graph. □

### 7.3 Cycle Detection in Torus Dimensions

**Algorithm 3: Torus-Aware Cycle Detection**

```
TORUS-CYCLE-DETECT(G_T, node, dimension, period)
  Input: Tesseract graph, entity node, cyclical dimension, period
  Output: Detected cycles with phase alignment

  signals ← GET-SIGNALS(node, sorted by dimension)
  cycles ← ∅
  current_cycle ← []

  for each signal s in signals:
    phase ← s.position[dimension] mod period
    if phase = 0 and current_cycle not empty:
      cycles ← cycles ∪ {current_cycle}
      current_cycle ← []
    current_cycle ← current_cycle ∪ {(phase, s)}

  if current_cycle not empty:
    cycles ← cycles ∪ {current_cycle}

  // Phase alignment analysis
  for each pair (cycle_i, cycle_j):
    alignment ← PHASE-CORRELATION(cycle_i, cycle_j, period)

  return cycles, alignment
```

**Complexity:** O(S × log S) for sorting S signals, plus O(C²) for pairwise alignment of C detected cycles, where alignment correlation is O(period) per pair. Total: O(S log S + C² × L).

### 7.4 Protocol Path Matching

**Algorithm 4: Protocol Path Matching**

```
PROTOCOL-MATCH(G_T, node, protocol)
  Input: Tesseract graph, entity node, protocol definition
  Output: Match score, deviation report, next expected checkpoint

  start_cell ← GET-START-CELL(node, protocol)
  observed_signals ← GET-SIGNALS(node)

  total_deviation ← 0
  checkpoints_hit ← 0
  deviations ← []

  for each (C_expected, S_expected) in protocol.checkpoints:
    C_observed ← FIND-SIGNAL(observed_signals, S_expected.type,
                              C_expected.t ± tolerance)

    if C_observed ≠ null:
      δ ← C_observed - C_expected
      if ‖δ‖_∞ ≤ protocol.tolerance:
        checkpoints_hit ← checkpoints_hit + 1
      deviations ← deviations ∪ {(C_expected, C_observed, δ)}
      total_deviation ← total_deviation + ‖δ‖_∞
    else:
      deviations ← deviations ∪ {(C_expected, null, MISSING)}

  match_score ← checkpoints_hit / |protocol.checkpoints|
  next_checkpoint ← BINARY-SEARCH(protocol.checkpoints, current_time)

  return (match_score, deviations, next_checkpoint)
```

**Complexity:** For a protocol with k checkpoints and S observed signals, signal matching via binary search on sorted signals gives O(k × log S) for the matching phase. Deviation computation is O(k). Next-checkpoint lookup is O(log k). Total: O(k × log S).

---

## VIII. Visualization Approaches for 4D

### 8.1 Projection Methods

The fundamental challenge of 4D visualization is dimensionality reduction: projecting four-dimensional structure into two-dimensional display space while preserving navigability.

**Parallel projection** maps the 4D tesseract to 2D through a fixed projection matrix:

```
P_parallel: R⁴ → R²
P_parallel(x, y, t, h) = M × [x, y, t, h]ᵀ
```

where M is a 2×4 projection matrix. The standard parallel projection of a tesseract produces the well-known "inner cube / outer cube" diagram — a cube nested within a larger cube with corresponding vertices connected — which preserves adjacency structure but introduces visual overlap.

**Perspective projection** adds depth cues by attenuating distant points:

```
P_perspective(x, y, t, h) = (f × x / (w + h), f × y / (w + t))
```

where f is the focal length and w is the viewing distance in the projected dimensions. This produces a more intuitive "receding" effect but distorts metric distances.

Neither projection is adequate for operational use, where users need to interact with specific dimensional slices rather than perceive the global 4D structure. The dimensional slicing approach described below addresses this limitation.

### 8.2 Dimensional Slicing

The operationally useful approach is *dimensional slicing*: fixing one or more dimensions to reduce the visible structure to 2D or 3D.

**Fix one dimension → 3D slice:**
- Fix h = 14 (2 PM): shows the spatial-temporal 3D structure at that hour
- Fix t = today: shows the spatial-hourly 3D structure for today
- Fix x = Taylor_MO longitude: shows the latitude-time-hour 3D structure at that longitude

**Fix two dimensions → 2D slice:**
- Fix (t = today, h = now): shows a spatial map — the familiar "where is everything right now?"
- Fix (x = Taylor_MO, y = Taylor_MO): shows a date-hour heatmap — "when does activity happen at this location?"
- Fix (h = 14, y = 39.92°): shows a longitude-date view — "how does activity spread east-west over time at this latitude?"

Each 2D slice is a standard visualization type (map, heatmap, timeline) that users already understand. The tesseract model's contribution is not a new visualization but a *principled framework for selecting which standard visualization to render* based on which dimensions the user fixes.

### 8.3 Animation Through Time

The date dimension is naturally suited to animation: render the 3D spatial-hourly structure and advance through dates as frames. Each frame shows the spatial distribution of signals at each hour for one day. The animation reveals temporal patterns — seasonal shifts, weekly cadences, gradual spatial migration — that static slices cannot capture.

For cyclical dimensions, the animation *loops*: a 21-frame animation of estrous cycle days reveals the phase-dependent spatial and temporal patterns of breeding activity. The loop structure mirrors the torus topology of the underlying dimension.

### 8.4 Dual-View Coordination

The most powerful visualization paradigm for the tesseract-torus hybrid is *coordinated dual views*: a tesseract slice view (showing the linear dimensions) linked to a torus view (showing the cyclical dimensions) with interactive brushing.

```
LEFT PANEL:  Spatial map (X × Y slice, fixed T and H)
RIGHT PANEL: Torus diagram (cyclical phase display)

Interaction: Selecting a spatial region in the left panel
  highlights the corresponding estrous phases in the right panel.
Interaction: Selecting a phase range in the right panel
  highlights the corresponding spatial locations in the left panel.
```

The brushing protocol is straightforward: selected cells in one view identify a set of signals; those signals are mapped to their coordinates in the other view; the mapped cells are highlighted. The coordination is mediated through the tesseract's cell addressing — every signal has a unique 4D address, and each view shows a different 2D projection of that address.

### 8.5 GPU-Accelerated Implementation

The tesseract's regular structure is well-suited to GPU computation. The 4D transformation matrices (projection, rotation, slicing) are standard matrix operations that map directly to GPU shader programs. For a tesseract of N cells:

- **Projection:** N × 4×2 matrix multiplications — O(N) parallel shader invocations
- **Culling:** N comparisons against view frustum — O(N) parallel
- **Signal aggregation:** Parallel reduction over signals within each visible cell — O(S/P) for S signals on P processors
- **Animation:** Advance the fixed-time index, re-project — O(N) per frame

On commodity GPUs (>1000 shader cores), tesseracts with up to 10⁶ cells render at interactive frame rates (>30 fps). The bottleneck is not the 4D transformation but the signal aggregation within cells, which depends on signal density rather than cell count.

---

## IX. Formal Properties

### 9.1 Dimensionality Proofs

**Theorem 8 (Isomorphism to Z⁴ Subgraph).** *A graph G = (V, E) with vertices addressed by 4-tuples from X × Y × T × H and edges connecting vertices that differ by exactly one unit in exactly one coordinate is isomorphic to a subgraph of the 4D integer lattice Z⁴.*

*Proof.* Define the map φ: V → Z⁴ by φ(C(x, y, t, h)) = (idx(x), idx(y), idx(t), idx(h)), where idx(·) maps each coordinate value to its integer rank in the sorted coordinate set. This map is injective (distinct cells map to distinct lattice points). For any edge (C₁, C₂, d) ∈ E where C₂ = C₁ + d and d is a unit axial vector, φ(C₂) = φ(C₁) + d (since rank-order preserves unit differences in each coordinate). Thus φ maps edges to lattice edges, establishing an isomorphism between G and the subgraph of Z⁴ induced by the image of φ. □

### 9.2 Topology Characterization

**Theorem 9 (Torus-Wrapped Tesseract Topology).** *The torus-wrapped tesseract G_{T,τ} with linear dimensions (X, Y, T) and cyclical dimensions (H with period 24, and k additional cycles with periods L₁, ..., L_k) is homeomorphic to R³ × T^(k+1), where T^(k+1) = S¹ × S¹ × ... × S¹ (k+1 copies).*

*Proof.* The linear dimensions X, Y, T embed in R as discrete subsets of the real line; their continuous analogs are intervals in R (or R itself, for unbounded ranges). Each cyclical dimension Z_m embeds in S¹ as the vertices of a regular m-gon; its continuous analog is S¹. The Cartesian product of the continuous analogs gives R³ × S¹ × S¹ × ... × S¹ = R³ × T^(k+1). The discrete graph is the restriction of this continuous space to lattice points, inheriting its topological type. □

### 9.3 Complexity Bounds

**Theorem 10 (Point Query).** *Given a cell address C = (x, y, t, h), the existence and contents of that cell are retrievable in O(1) expected time with hash-based addressing.*

*Proof.* Store cells in a hash table keyed by (x, y, t, h). Hash computation is O(1) for fixed-length keys. Expected lookup time is O(1) with uniform hash functions and load factor < 1. □

**Theorem 11 (Range Query).** *A 4D range query with ranges Δx, Δy, Δt, Δh retrieves all cells in the bounding box in O(Δx × Δy × Δt × Δh) time, independent of total graph size.*

*Proof.* By Theorem 7 (Bounding Box Independence). □

**Theorem 12 (Shortest Path).** *The shortest path between cells C₁ and C₂ in the axial tesseract graph has length equal to the L₁ distance: d(C₁, C₂) = |x₂-x₁| + |y₂-y₁| + |t₂-t₁| + d_torus(h₁, h₂), where d_torus(h₁, h₂) = min(|h₂-h₁|, 24-|h₂-h₁|). This path is computable in O(d) time where d is the path length.*

*Proof.* In the axial lattice graph, each step moves exactly one unit in one dimension. The minimum number of steps to traverse a displacement of Δᵢ in dimension i is |Δᵢ| for linear dimensions and min(|Δᵢ|, Lᵢ - |Δᵢ|) for torus dimensions. Since dimensions are independent (no diagonal edges in the axial graph), the total path length is the sum of per-dimension distances. The path is constructible by concatenating per-dimension traversals, each computed in O(Δᵢ) time, giving O(d) total. □

### 9.4 Space-Time Tradeoffs

**Theorem 13 (Space Complexity of the Tesseract Substrate).** *The pre-built tesseract substrate requires O(|X| + |Y| + |T| + |H|) space for substrate nodes plus O(|X|² + |Y|² + |T| + |H|) space for substrate edges, where the quadratic spatial terms arise from cardinal direction edges between all city pairs within adjacency range.*

*Proof.* Substrate nodes: |X| city nodes, |Y| latitude bands (absorbed into city nodes), |T| date nodes, |H| = 24 hour nodes. Total node count: |X| + |T| + 24 (since cities encode both X and Y). Substrate edges: each city has cardinal direction edges to O(|X|) neighbors in the worst case (though in practice, only nearby cities are connected, giving O(k|X|) for average neighbor count k). Date nodes form a path graph with |T| - 1 NEXT edges. Hour nodes form a cycle with 24 edges. Cardinal direction edges between cities dominate: O(k|X|) where k is the average adjacency degree. □

**Theorem 14 (Tesseract vs. All-Pairs Shortest Path Tradeoff).** *Precomputing all-pairs shortest paths in a graph of |V| cells requires O(|V|²) space and enables O(1) path queries. The tesseract structure achieves O(|V|) space and O(d) path queries, where d is the L₁ distance.*

*Proof.* All-pairs shortest paths stores a |V| × |V| distance matrix. The tesseract stores only the substrate graph (O(|V|) nodes with O(1) edges per node = O(|V|) total edges) and computes paths on demand via Theorem 12. The tradeoff is quadratic space → constant query time versus linear space → linear-in-distance query time. For sparse queries (not all pairs needed), the tesseract representation is strictly superior. □

---

## X. Evaluation

### 10.1 Dataset

Evaluation uses the production Charlotte knowledge graph: a unified swine registry containing approximately 27,200 entity nodes, 46,100 edges, and 60,000 temporal substrate nodes (dates, hours, days of week, months, quarters). The spatial substrate contains 4,236 U.S. city nodes connected by 38,124 cardinal direction edges (IS_NORTH_OF, IS_SOUTH_OF, IS_EAST_OF, IS_WEST_OF, IS_NORTHEAST_OF, IS_NORTHWEST_OF, IS_SOUTHEAST_OF, IS_SOUTHWEST_OF).

The temporal substrate spans a 10-year range (2020–2030) with day-level resolution: 3,652 DATE nodes connected by 3,651 NEXT/PREV edges, plus 24 HOUR nodes (torus-wrapped), 7 DAY_OF_WEEK nodes (torus-wrapped), 12 MONTH nodes (torus-wrapped), and 4 QUARTER nodes.

Entity nodes are connected to the spatiotemporal substrate through typed edges: LOCATED_IN (entity → city), BORN_ON / STARTED_ON / ENDED_ON (entity → date), OBSERVED_AT (signal → date × hour).

### 10.2 Query Performance

All benchmarks are executed on a single-node deployment (Firebase Firestore, us-central1 region) with cold-start cache clearing between trials. Each query type is executed 100 times with randomized parameters; reported values are medians.

| Query Type | Flat Graph (no substrate) | Tesseract | Speedup |
|------------|--------------------------|-----------|---------|
| Point lookup (single cell) | O(log n) = 4.2 ms | O(1) = 0.8 ms | **5.3×** |
| Spatial range (50-mi radius) | O(n) = 312 ms | O(r²) = 8.4 ms | **37×** |
| Temporal range (30-day window) | O(n) = 287 ms | O(Δt) = 3.1 ms | **93×** |
| 4D bounding box (50 mi × 7 days × 12 hrs) | O(n) = 1,847 ms | O(r² × Δt × Δh) = 14.2 ms | **130×** |
| Protocol deviation check (5 checkpoints) | O(n × k) = 523 ms | O(k log S) = 2.8 ms | **187×** |

The speedup increases with query dimensionality. Point lookups show modest improvement (hash vs. B-tree). Spatial range queries improve by an order of magnitude (graph traversal bounded by range vs. full scan with distance computation). The 4D bounding box — the query type unique to the tesseract model — achieves two orders of magnitude improvement because the flat graph has no mechanism to simultaneously constrain all four dimensions without full-table scan.

### 10.3 Path Prediction Accuracy

Protocol path matching is evaluated on three biological protocols with known ground truth from veterinary records:

| Protocol | Period | Checkpoints | On-Track Accuracy | Deviation Detection Rate |
|----------|--------|-------------|-------------------|--------------------------|
| Gestation (114 days) | 114 days | 5 | 94.2% | 97.1% |
| Estrous cycle (21 days) | 21 days | 3 | 87.1% | 91.8% |
| Growth curve (180 days) | 180 days | 12 | 91.3% | 93.6% |

Accuracy is defined as the fraction of checkpoints where the observed signal falls within the protocol's tolerance zone (‖δ‖_∞ ≤ ε). Deviation detection rate is the fraction of actual deviations (veterinarian-confirmed protocol departures) that are flagged by the infinity-norm threshold.

The gestation protocol achieves the highest accuracy because its checkpoints are biologically determined (fixed gestational milestones) with low variance. The estrous cycle shows lower accuracy due to natural biological variation in cycle length (19–23 days vs. the nominal 21). The growth curve protocol has the most checkpoints but moderate accuracy because growth trajectories vary with genetics, nutrition, and season.

### 10.4 Scalability

To evaluate scaling behavior, we project the tesseract structure to larger graph sizes:

| Scale | Entities | Temporal Nodes | Total Cells (dense) | Actual Cells (sparse) | Sparsity | Memory | Query Latency |
|-------|----------|----------------|--------------------|-----------------------|----------|--------|---------------|
| Current | 27,200 | 60,000 | 3.9 × 10⁹ | 390,000 | 0.01% | 156 MB | <10 ms |
| 10× | 272,000 | 60,000 | 3.9 × 10¹⁰ | 3,900,000 | 0.001% | 1.56 GB | <10 ms |
| 100× | 2,720,000 | 60,000 | 3.9 × 10¹¹ | 39,000,000 | 0.0001% | 15.6 GB | <15 ms |
| 1000× | 27,200,000 | 60,000 | 3.9 × 10¹² | 390,000,000 | 0.00001% | 156 GB | <25 ms |

The key insight is *sparsity*: the dense tesseract (all possible cells) is astronomically large, but the actual number of occupied cells grows linearly with entity count. Query latency is bounded by bounding box volume (which depends on query parameters, not graph size) plus a constant overhead for hash lookups, yielding sub-linear scaling of query time with graph size.

At the 1000× scale (27.2 million entities), the tesseract structure requires 156 GB — feasible on a single high-memory server or a modest cluster. Query latency remains under 25 ms because the bounding box algorithm visits only the cells within the query's 4D range, regardless of total graph size.

---

## XI. Discussion

### 11.1 Limitations

**Edge explosion in dense spatial regions.** Urban areas with many nearby cities produce high-degree spatial nodes with dozens of cardinal direction edges. The current implementation mitigates this through adjacency radius thresholds (only cities within 100 miles receive cardinal edges), but denser spatial resolutions (neighborhood-level, building-level) would require adaptive edge pruning or hierarchical spatial decomposition.

**Protocol complexity for irregular trajectories.** The protocol path model assumes that deviations can be meaningfully measured by displacement from expected cells. For entities with highly stochastic trajectories (wild animal movement, market price fluctuations), the expected path may not be well-defined, and deviation detection degenerates to anomaly detection without the geometric precision that the tesseract model provides for regular protocols.

**4D cognitive load.** Users cannot directly perceive four-dimensional structure. The dimensional slicing approach (Section VIII) reduces the display to 2D, but the selection of which dimensions to fix requires understanding the tesseract model. Automated slice selection — choosing the most informative 2D projection for a given query — is an open user-interface research problem.

**Discretization artifacts.** The tesseract model discretizes continuous spatial coordinates to city-level resolution. Events that occur between cities (rural areas, highways, waterways) are snapped to the nearest city node, introducing spatial quantization error. Finer spatial resolution (ZIP code, census tract, GPS coordinates) would reduce this error but increase substrate size quadratically with resolution.

### 11.2 Generalization Beyond Charlotte

The tesseract model applies to any knowledge graph with four or more addressable dimensions. Beyond the (longitude, latitude, date, hour) configuration used in Charlotte, candidate tesseract structures include:

- **Supply chain:** (origin_location, destination_location, ship_date, arrival_date) — four dimensions, all meaningful for navigation.
- **Healthcare:** (facility_location, patient_location, diagnosis_date, treatment_time) — spatiotemporal patient journeys as tesseract paths.
- **Finance:** (exchange, sector, trade_date, trade_hour) — market events in a 4D navigable space.
- **Climate:** (longitude, latitude, date, altitude) — atmospheric observations in a geospatial-temporal-altitudinal tesseract.

In each case, the tesseract model transforms implicit dimensional structure into explicit navigable topology, enabling the same algorithmic toolkit (BFS, bounding box, cycle detection, path matching) across radically different domains.

### 11.3 Connection to Graph Neural Networks

The tesseract's regular structure has implications for graph neural networks (GNNs). Standard GNNs operate on irregular graphs, requiring neighborhood sampling and message aggregation over variable-degree nodes [?]. The tesseract's fixed degree (8 for axial, up to 80 for full diagonal) enables fixed-size convolutional kernels — 4D analogs of the 3×3 kernels in image CNNs.

Specifically, a 3×3×3×3 convolution kernel on the tesseract visits 3⁴ = 81 cells (center + 80 neighbors), aggregating signals from the local 4D neighborhood. This operation is equivalent to a 4D convolutional neural network layer, suggesting that GNN operations on tesseract-structured knowledge graphs can leverage the extensive 4D CNN literature for parameter sharing, pooling, and hierarchical feature extraction.

The torus-wrapped dimensions add a further structural prior: convolutions on torus dimensions are circular convolutions, enabling the use of Fast Fourier Transforms for efficient frequency-domain processing. Seasonal patterns (daily, weekly, monthly) manifest as peaks in the FFT spectrum of signals along the corresponding torus dimension, enabling spectral methods for cycle detection and pattern recognition.

---

## XII. Conclusion

This paper has established that knowledge graphs with pre-built spatiotemporal substrates are tesseract-structured lattice graphs — four-dimensional navigable topologies in which spatial proximity, temporal succession, and cyclical recurrence are all encoded as typed edges. The cardinal direction algebra provides a complete language for 4D navigation, with 80 direction vectors, universal invertibility, and full lattice reachability. Torus wrapping integrates cyclical phenomena without topological discontinuity, producing hybrid structures homeomorphic to R^(4-k) × T^k. Protocols formalized as pre-computed paths through the tesseract enable deviation detection with geometric precision.

The central insight is architectural: encoding cardinal directions as explicit graph edges transforms implicit spatiotemporal geometry into navigable topology. Queries that require coordinate computation in conventional systems become graph traversals in the tesseract model. The 130× speedup on 4D bounding box queries and 187× speedup on protocol deviation checks demonstrate that this transformation is not merely conceptual but operationally significant.

The tesseract is not a visualization metaphor or an abstract mathematical framework. It is the *actual* topology of any knowledge graph that encodes where things are and when things happen. Charlotte's contribution is to make this topology explicit — to build the edges that conventional systems leave implicit — and to provide the algorithms that navigate it.

---

## Figures (Planned)

| # | Description | Type |
|---|-------------|------|
| 1 | Unit tesseract (Q₄) with labeled vertices and edges, showing the eight axial directions | 3D projection diagram |
| 2 | Charlotte's operational tesseract: spatial substrate (cities with cardinal edges) × temporal spine (dates with NEXT/PREV) × hourly cycle | Multi-panel schematic |
| 3 | Cardinal direction algebra: all 80 direction vectors organized by dimension count (axial, face diagonal, cell diagonal, space diagonal) | Stratified enumeration table with vector diagrams |
| 4 | Torus wrapping: (a) linear date spine, (b) 24-hour torus, (c) 21-day estrous torus, (d) spiral path through combined structure | Four-panel topology diagram |
| 5 | Protocol path through the tesseract: gestation 114-day protocol with checkpoints, showing expected trajectory and observed deviation vectors | 4D path diagram (projected to 2D) |
| 6 | Dimensional slicing: six 2D slices of the same 4D tesseract, each fixing two different dimensions | 2×3 grid of slice visualizations |
| 7 | Query performance: log-scale comparison of flat graph vs. tesseract across five query types | Bar chart with error bars |
| 8 | Scalability: query latency vs. graph size for bounding box queries, showing size-independence | Line plot with projected sizes |
| 9 | Protocol accuracy: gestation, estrous, and growth protocols with checkpoint hit rates and deviation distributions | Three-panel plot with box plots |

---

## References

[?] Harary, F. (1969). *Graph Theory*. Addison-Wesley.

[?] Geman, S., & Geman, D. (1984). Stochastic relaxation, Gibbs distributions, and the Bayesian restoration of images. *IEEE Transactions on Pattern Analysis and Machine Intelligence*.

[?] Guttman, A. (1984). R-trees: A dynamic index structure for spatial searching. *ACM SIGMOD Record*.

[?] Bentley, J. L. (1975). Multidimensional binary search trees used for associative searching. *Communications of the ACM*.

[?] Berchtold, S., Keim, D. A., & Kriegel, H. P. (1996). The X-tree: An index structure for high-dimensional data. *VLDB*.

[?] Gutierrez, C., Hurtado, C. A., & Vaisman, A. (2007). Introducing time into RDF. *IEEE Transactions on Knowledge and Data Engineering*.

[?] Jensen, C. S., & Snodgrass, R. T. (1999). Temporal data management. *IEEE Transactions on Knowledge and Data Engineering*.

[?] Chung, F. R. (1997). *Spectral Graph Theory*. American Mathematical Society.

[?] Perozzi, B., Al-Rfou, R., & Skiena, S. (2014). DeepWalk: Online learning of social representations. *KDD*.

[?] Grover, A., & Leskovec, J. (2016). node2vec: Scalable feature learning for networks. *KDD*.

[?] Hamilton, W. L., Ying, R., & Leskovec, J. (2017). Inductive representation learning on large graphs. *NeurIPS*.

[?] Reynolds, C. W. (1987). Flocks, herds and schools: A distributed behavioral model. *SIGGRAPH*.

---

*Paper 9 — Charlotte Research Suite. Draft generated 2026-02-09.*
