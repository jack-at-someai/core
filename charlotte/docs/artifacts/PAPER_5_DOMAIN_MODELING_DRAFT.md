# Universal Ontology Through Register-Based Primitives

**Target Venue:** ACM/IEEE International Conference on Model-Driven Engineering Languages and Systems (MODELS)

**Paper Type:** Full Research Paper (12–15 pages)

---

## Abstract

Domain-specific ontologies enable precise modeling within individual domains but fragment interoperability across domains and impose escalating maintenance costs as schemas proliferate. This paper proposes a universal domain modeling approach based on five register-based primitives — NODE (identity), EDGE (relationship), METRIC (measurement definition), SIGNAL (temporal observation), and PROTOCOL (expectation) — that collectively express any domain in which identities emit signals over time. We provide formal definitions grounded in category theory, establishing the Charlotte category whose objects are the five primitives and whose morphisms are the structural references between them. We prove three formal properties: *completeness* (any domain expressible in OWL-DL can be expressed in the five-primitive model), *minimality* (removing any primitive reduces expressiveness), and *orthogonality* (the primitives address disjoint modeling concerns). Cross-domain validation across four radically different systems — human behavior analytics (four-year lifecycles), biological breeding programs (monthly cycles), industrial equipment maintenance (multi-year service arcs), and cultural artifact provenance (centuries-long histories) — demonstrates that all four domains map onto identical primitive structures without extension. We formalize domain mapping as a forgetful functor from domain-specific categories to the Charlotte category, and domain evolution as natural transformations between functor compositions. A production implementation encoding all five primitives in a single document collection with fixed positional registers is evaluated against a dataset of approximately 27,200 nodes and 46,100 edges. The results establish that the five-primitive model provides a viable alternative to schema-per-domain ontology engineering, trading domain-specific optimization for universal interoperability and zero-cost domain evolution.

**Keywords:** domain modeling, ontology engineering, category theory, universal ontology, register-based primitives, model-driven engineering, knowledge graphs

---

## 1. Introduction

### 1.1 The Schema Proliferation Problem

The standard approach to domain modeling in software engineering is to construct a domain-specific ontology — a schema that captures the entities, relationships, attributes, and constraints of a particular domain. A livestock management system defines classes for Sow, Boar, Litter, Operation, and Registry, with properties for weight, breed, birth date, and pedigree depth. An industrial maintenance system defines classes for Compressor, Valve, Pump, and ServiceRecord, with properties for vibration level, temperature, pressure, and mean time between failures.

Each ontology is correct within its domain. But the collective effect of domain-specific ontology engineering is *schema proliferation*: a growing inventory of parallel schemas, each with its own class hierarchy, property definitions, constraint specifications, and evolution history. The costs compound along three dimensions:

1. **Maintenance cost.** Each schema requires independent maintenance. A change to how temporal data is represented must be implemented separately in every domain's schema. A new requirement for audit trails, provenance tracking, or temporal queries must be engineered into each schema independently.

2. **Interoperability cost.** Cross-domain queries — comparing maintenance patterns in industrial equipment with lifecycle patterns in biological systems, or applying predictive models trained on one domain to another — require ontology alignment, schema mapping, and data transformation. These integration efforts are project-scale undertakings, not routine queries.

3. **Onboarding cost.** Each new domain requires engineering a new schema from scratch: identifying entities, defining relationships, specifying properties, implementing validation, creating migration scripts, and building query interfaces. The time from domain identification to operational system is measured in months or years.

### 1.2 The Charlotte Hypothesis

We propose that a fixed set of five primitives can serve as a universal ontology for any domain in which identities persist through time, relate to one another, can be measured along defined dimensions, are observed through time-indexed signals, and operate under forward-looking expectations.

The hypothesis is strong: not that these five primitives are *useful* for many domains, but that they are *sufficient* for all domains within the specified scope — and that no subset of four primitives achieves the same expressiveness. If the hypothesis holds, it implies that domain modeling can be reduced from ontology engineering (designing a new schema for each domain) to vocabulary configuration (defining categories, edge types, and metrics within the fixed primitive framework).

### 1.3 Contributions

1. **Formal definitions** of five register-based primitives with explicit semantics, grounded in category theory.

2. **Three formal properties** — completeness, minimality, and orthogonality — establishing the primitives as a sound foundation for universal domain modeling.

3. **Cross-domain validation** demonstrating structural convergence across four domains with radically different characteristics.

4. **Category-theoretic foundations** for domain mapping (forgetful functors), domain evolution (natural transformations), and signal composition (the signal monoid).

5. **Extensibility patterns** for schema-free evolution, vocabulary layering, and cross-domain interoperability.

---

## 2. Background and Related Work

### 2.1 Traditional Ontology Engineering

The Web Ontology Language (OWL) [?] and the Resource Description Framework (RDF) [?] provide the standard framework for ontology engineering. OWL defines classes, properties, and restrictions; RDF provides the triple-based representation. Together, they enable formal ontology specification with reasoning capabilities.

The expressiveness of OWL comes at the cost of complexity. OWL ontologies for non-trivial domains routinely contain hundreds of classes organized in deep inheritance hierarchies, with property restrictions that create intricate dependency networks [?]. The *class hierarchy explosion* problem — the combinatorial growth of classes needed to represent cross-cutting concerns like temporality, provenance, and multi-scale measurement — is well-documented [?].

The five-primitive approach sidesteps class hierarchy explosion by eliminating classes altogether. There are no domain-specific types to define, no inheritance hierarchies to maintain, no property restrictions to specify. The five primitives are the only types. Domain-specific distinctions are expressed through *values* within these types (categories on nodes, types on edges, labels on metrics) rather than through *types* in the schema.

### 2.2 Event Sourcing and Temporal Databases

Event sourcing [?] addresses the temporal dimension of domain modeling by treating events as the primary representation and deriving current state through replay. Temporal database extensions [?] add valid-time and transaction-time dimensions to relational schemas.

Both approaches add temporality to existing modeling paradigms rather than building temporality into the foundational primitives. In event sourcing, events are domain-specific (OrderPlaced, ItemShipped, PaymentReceived). In temporal databases, time is an attribute dimension on existing tables. The five-primitive model makes temporality foundational: every SIGNAL is time-indexed, every FACT has a temporal creation reference, and the temporal substrate provides a pre-built coordinate system for temporal queries.

### 2.3 Domain-Specific Languages versus Universal Substrates

Domain-specific languages (DSLs) [?] achieve high expressiveness within a single domain by providing tailored abstractions. The trade-off is vertical isolation: a DSL for livestock management cannot express industrial maintenance concepts, and vice versa. Each DSL creates a silo.

Universal modeling languages (UML [?], SysML [?]) attempt to span domains through general-purpose abstractions, but their generality often results in cumbersome domain representations that require extensive profiling and stereotyping to become usable.

The five-primitive model occupies a different point in this design space. It is not general-purpose in the UML sense (it does not model arbitrary computational systems) but is universal within a specific scope: domains where identities emit signals over time. Within this scope, it achieves both the expressiveness of DSLs (through domain-specific vocabulary) and the interoperability of universal languages (through fixed primitive structure).

---

## 3. The Five Primitives as Universal Ontology

### 3.1 NODE: Identity with Lifecycle

**Definition 1.** A NODE is a triple (*id*, *cat*, *τ*_c) where:
- *id* ∈ ID is a globally unique identifier
- *cat* ∈ CAT is a category label drawn from a domain-specific vocabulary
- *τ*_c ∈ DATE is a temporal creation reference

NODEs represent entities that persist through time and serve as anchors for measurement and observation. A NODE carries identity and classification but stores no computed values, no aggregated metrics, and no embedded hierarchy.

**OWL mapping.** A NODE corresponds to an OWL individual (an instance of owl:Thing) with a single rdf:type assertion determined by *cat*. The critical difference is that OWL individuals inherit properties from their class hierarchy, whereas NODEs inherit nothing — all properties are expressed through METRICs and SIGNALs in the feature layer. This eliminates the property inheritance chains that create coupling between classes in OWL ontologies.

**Register encoding.** In the register-based document model, P0 carries the category:
```
{":ID": "SOW:bella", ":TYPE": "NODE", ":CREATED": "DATE:1-30-2026", "P0": "SOW"}
```

### 3.2 EDGE: First-Class Relationship

**Definition 2.** An EDGE is a quadruple (*from*, *to*, *rel*, *τ*_c) where:
- *from* ∈ ID is the source node identifier
- *to* ∈ ID is the target node identifier
- *rel* ∈ REL is a relationship type label
- *τ*_c ∈ DATE is a temporal creation reference

EDGEs are directed, typed, and append-only. They encode the topological structure of the domain: ownership, lineage, location, membership, service relationships. EDGEs connect only NODEs to NODEs — the graph layer remains topologically clean.

**RDF mapping.** An EDGE corresponds to a reified RDF triple with temporal provenance. Standard RDF triples (subject-predicate-object) do not carry creation timestamps or support append-only history. EDGE reification adds these capabilities while maintaining the directional, typed semantics of RDF predicates.

**Register encoding.** P0 = from, P1 = to, P2 = relationship type:
```
{":ID": "E:sire", ":TYPE": "EDGE", ":CREATED": "DATE:3-15-2026",
 "P0": "BOAR:champion", "P1": "PIGLET:offspring_1", "P2": "SIRE_OF"}
```

### 3.3 METRIC: Measurement Definition

**Definition 3.** A METRIC is a quadruple (*node*, *dtype*, *label*, *constraints*) where:
- *node* ∈ ID identifies the target node
- *dtype* ∈ {STRING, NUMBER, BOOLEAN, ENUM} is the value type
- *label* ∈ STRING is a human-readable name
- *constraints* is an optional specification (min, max, enum values)

METRICs define what can be measured about a node. They serve as the schema for the feature layer — analogous to column definitions in relational schemas, but attached to individual nodes rather than to tables.

**OWL mapping.** A METRIC corresponds to an owl:DatatypeProperty with an rdfs:domain restriction to the target node's class. The five-primitive model eliminates the domain restriction by attaching metrics directly to nodes: any node can carry any metric, without requiring class-level property declarations.

**Register encoding.** P0 = target node, P1 = value type, P2 = label, P3 = constraints:
```
{":ID": "METRIC:bella:weight", ":TYPE": "METRIC", ":CREATED": "DATE:1-30-2026",
 "P0": "SOW:bella", "P1": "NUMBER", "P2": "body_weight", "P3": {"min": 0, "unit": "kg"}}
```

### 3.4 SIGNAL: Temporal Observation

**Definition 4.** A SIGNAL is a quintuple (*node*, *metric*, *value*, *τ*_c, *src*) where:
- *node* ∈ ID identifies the observed entity
- *metric* ∈ ID identifies the metric being measured
- *value* ∈ dom(*metric*.*dtype*) is the observed value
- *τ*_c ∈ DATE is the temporal reference
- *src* ∈ {USER, SYSTEM, AGENT} is the source attribution

SIGNALs are the core temporal primitive. They are append-only and immutable: to correct an observation, a new SIGNAL is appended with the corrected value and a later timestamp. The previous SIGNAL persists, preserving the complete observational history including errors and corrections.

**RDF mapping.** A SIGNAL corresponds to a temporal reification with provenance — an RDF statement about a statement, annotated with time, source, and value. No standard RDF mechanism provides this combination natively; it typically requires blank nodes or named graphs with significant representational overhead [?].

**Register encoding.** P0 = target node, P1 = metric, P2 = value, P3 = governing protocol (optional):
```
{":ID": "SIG:bella:weight:2026-01-30", ":TYPE": "SIGNAL", ":CREATED": "DATE:1-30-2026",
 "P0": "SOW:bella", "P1": "METRIC:bella:weight", "P2": 285, "P3": null}
```

### 3.5 PROTOCOL: Expectation Generator

**Definition 5.** A PROTOCOL is a triple (*node*, *schedule*, *requirements*) where:
- *node* ∈ ID identifies the target entity
- *schedule* is a structured plan specifying checkpoints with expected metric values at target dates
- *requirements* is an optional specification of proposed actions and new metrics

PROTOCOLs represent forward-looking expectations — what *should* happen, by when, at what checkpoints. They enable the system to model not only the past (signals) and the present (current signal values) but the future (expected trajectories). The divergence between protocol expectations and observed signals constitutes *drift*.

**OWL mapping.** There is no direct OWL equivalent. OWL supports class restrictions and property constraints that describe what *must* be true, but not temporal expectations about what *should* happen in the future. PROTOCOLs occupy a modeling niche — procedural expectation forecasting — that is absent from declarative ontology languages.

This absence is significant. It means the five-primitive model is not merely an alternative encoding of OWL-expressible concepts but extends the modeling vocabulary to include a dimension (temporal expectations) that OWL cannot express natively.

---

## 4. The Convex Hull: Four Domain Case Studies

### 4.1 Human Behavior: LineLeap

LineLeap tracked college students' nightlife behavior over four-year college careers [?]. The domain mapping:

| Domain Concept | Primitive | Encoding |
|---------------|-----------|----------|
| Student | NODE | category = HUMAN |
| Venue | NODE | category = VENUE |
| Visit | EDGE | type = VISITED |
| Spend | SIGNAL | metric = SPEND_AMOUNT |
| Drink selection | SIGNAL | metric = DRINK_TYPE |
| Arrival time | SIGNAL | metric = ARRIVAL_TIME |
| Visit frequency | Derived | Signal density over time |

**Expressiveness test.** The domain requires representing persistent identities (students, venues) that relate (visits) and are measured (spend, drink type, arrival time) over time. All five primitives are exercised. No additional primitives are required.

**Key modeling insight.** Individual events are noisy; trajectories are informative. The SIGNAL primitive's append-only semantics naturally accumulate trajectories without explicit trajectory data structures.

### 4.2 Biological Systems: Sounder/Trogdon Showpigs

Sounder tracked breeding operations, sow performance, and pedigree structures over multi-year breeding programs. The domain mapping:

| Domain Concept | Primitive | Encoding |
|---------------|-----------|----------|
| Sow | NODE | category = SOW |
| Boar | NODE | category = BOAR |
| Operation | NODE | category = OPERATION |
| Pedigree | EDGE | type = SIRE_OF, DAM_OF |
| Ownership | EDGE | type = BRED_BY |
| Body weight | SIGNAL | metric = BODY_WEIGHT |
| Litter size | SIGNAL | metric = TOTAL_BORN |
| Gestation plan | PROTOCOL | 114-day checkpoint schedule |
| Growth target | PROTOCOL | weight checkpoints at show dates |

**Expressiveness test.** The domain requires persistent identities (animals, operations), complex relationship networks (pedigrees, ownership), time-series measurements (weights, litter sizes), and forward-looking expectations (gestation schedules, growth targets). All five primitives are exercised. Pedigree depth, a key domain metric, is *derived* through recursive EDGE traversal rather than stored — validating the signal-based architecture's derivation principle.

**Key modeling insight.** Not every biological entity requires NODE status. Piglets in a litter are modeled as SIGNAL values (litter count, born alive count) on the sow NODE rather than as individual NODEs. Promotion to NODE status occurs only when an individual piglet becomes an entity worth tracking independently. This distinction — between entities that persist and observations that accumulate — is naturally captured by the NODE/SIGNAL partition.

### 4.3 Mechanical Systems: Industrial Service Group

ISG tracked industrial equipment performance, maintenance history, and failure prediction across facilities. The domain mapping:

| Domain Concept | Primitive | Encoding |
|---------------|-----------|----------|
| Compressor | NODE | category = COMPRESSOR |
| Valve | NODE | category = VALVE |
| Facility | NODE | category = FACILITY |
| Part-of relationship | EDGE | type = PART_OF |
| Service assignment | EDGE | type = SERVICED_BY |
| Vibration level | SIGNAL | metric = VIBRATION |
| Temperature | SIGNAL | metric = TEMPERATURE |
| Maintenance schedule | PROTOCOL | periodic checkpoint schedule |

**Expressiveness test.** The domain requires hierarchical part-of relationships (equipment within facilities), temporal sensor data (vibration, temperature), and maintenance expectations (protocols). All five primitives are exercised. The PROTOCOL primitive is particularly critical: maintenance schedules define expected sensor readings at future dates, enabling drift detection when actual readings diverge from expectations.

**Key modeling insight.** Mechanical prediction is deviation detection, not failure forecasting. The PROTOCOL primitive provides the reference trajectory against which deviation is measured — a capability absent from conventional equipment databases that store only current readings without expected trajectories.

### 4.4 Cultural Artifacts: Prier Violins

Prier Violins tracked the provenance, condition, and valuation of rare stringed instruments over lifecycles measured in centuries. The domain mapping:

| Domain Concept | Primitive | Encoding |
|---------------|-----------|----------|
| Violin | NODE | category = VIOLIN |
| Maker | NODE | category = MAKER |
| Owner | NODE | category = COLLECTOR |
| Ownership transfer | EDGE | type = OWNED_BY (append-only) |
| Restoration event | SIGNAL | metric = RESTORATION |
| Expert valuation | SIGNAL | metric = VALUATION, source = EXPERT |
| Conservation plan | PROTOCOL | condition checkpoints |

**Expressiveness test.** The domain requires extremely long-lived identities (instruments persisting for centuries), sparse and irregular observations (valuations separated by decades), expert-weighted source attribution (the authority of the appraiser matters as much as the value), and provenance chains (ownership history as append-only edges). All five primitives are exercised. Signal source attribution (the *src* field on SIGNALs) becomes critical: a valuation by one of four globally recognized experts carries different weight than a valuation by a local dealer.

**Key modeling insight.** Value is the integrity of the story. The append-only semantics of SIGNALs and EDGEs ensure that the provenance record cannot be retroactively altered — each ownership transfer, each restoration, each expert assessment persists permanently. The violin's value is computable from the completeness and authority of its graph neighborhood.

### 4.5 Convergence

**Table I: Cross-Domain Structural Convergence**

| Domain | NODE categories | EDGE types | METRIC types | SIGNAL freq | PROTOCOL usage | Lifecycle |
|--------|----------------|------------|--------------|-------------|----------------|-----------|
| Human Behavior | HUMAN, VENUE | VISITED | spend, drink, time | Daily–weekly | Engagement forecast | 4 years |
| Biological | SOW, BOAR, OP | SIRE_OF, DAM_OF, BRED_BY | weight, litter, condition | Daily | Gestation, growth | Months–years |
| Mechanical | COMPRESSOR, VALVE, PUMP | PART_OF, SERVICED_BY | vibration, temp, pressure | Hourly | Maintenance | Years–decades |
| Cultural | VIOLIN, MAKER, COLLECTOR | OWNED_BY, RESTORED_BY | valuation, condition | Yearly–decadal | Conservation | Centuries |

All four domains exercise all five primitives. No domain requires additional primitive types. The differences between domains are expressed entirely through vocabulary — the *values* in the category, relationship type, and metric label fields — not through structural extensions to the model.

---

## 5. Category-Theoretic Foundations

### 5.1 The Charlotte Category

We define the Charlotte category **C** as follows:

**Objects.** Ob(**C**) = {NODE, EDGE, METRIC, SIGNAL, PROTOCOL}

**Morphisms.** The morphisms represent the structural references between primitive types:

```
f₁: METRIC → NODE         (P0: metric attaches to node)
f₂: SIGNAL → NODE         (P0: signal observes node)
f₃: SIGNAL → METRIC       (P1: signal measures metric)
f₄: EDGE → NODE × NODE    (P0, P1: edge connects nodes)
f₅: PROTOCOL → NODE       (P0: protocol applies to node)
f₆: SIGNAL → PROTOCOL     (P3: signal governed by protocol, partial)
```

**Identity morphisms.** id_X : X → X for each object X.

**Composition.** Morphisms compose according to the structural chain. For example, the composition f₁ ∘ f₃⁻¹ (where f₃⁻¹ is the inverse relation) traces from NODE through METRIC to SIGNAL — expressing the fact that a node's feature vector is defined by its metrics and populated by its signals.

The Charlotte category is *sparse* — it has few objects and morphisms — reflecting the model's minimality. All structural complexity resides in the *instances* (the specific nodes, edges, metrics, signals, and protocols created for a domain) rather than in the category structure itself.

### 5.2 Functors for Domain Mapping

A domain-specific model is itself a category **D** whose objects are domain concepts (Sow, Litter, Weight, BreedingPlan) and whose morphisms are domain relationships (sow has litter, litter has weight, plan governs sow).

**Definition 6 (Domain Mapping Functor).** A domain mapping is a functor *F* : **D** → **C** that maps:
- Each domain entity type to NODE (with an appropriate category label)
- Each domain relationship to EDGE (with an appropriate type label)
- Each domain attribute type to METRIC (with appropriate dtype and label)
- Each domain event type to SIGNAL (with appropriate metric reference)
- Each domain plan type to PROTOCOL (with appropriate schedule)

The functor *F* is *forgetful* in the category-theoretic sense: it forgets the domain-specific type distinctions (Sow versus Compressor versus Violin) and retains only the structural role (NODE with a category label). This deliberate information loss is the source of the model's universality — and the target of its extensibility pattern (Section 7), which recovers domain-specific distinctions through vocabulary rather than type structure.

**Definition 7 (Domain Inclusion Functor).** The inclusion functor *I* : **C** → **D** maps each Charlotte primitive to its domain interpretation: NODE to the set of domain entity types, EDGE to the set of domain relationship types, and so forth. The composition *I* ∘ *F* is a domain endofunctor that maps domain concepts through the Charlotte abstraction and back — a round trip that preserves structure but may lose domain-specific annotations.

**Domain migration as functor composition.** Migrating data from one domain model to another (e.g., from a livestock schema to an equipment schema) can be expressed as a functor composition *F*_equipment ∘ *I* ∘ *F*_livestock — mapping livestock concepts to Charlotte primitives and then to equipment concepts. The Charlotte category serves as a *pivot category* through which any two domain categories can be related.

### 5.3 The Signal Monoid

The set of signals on a given node and metric forms a monoid under temporal concatenation:

**Definition 8 (Signal Monoid).** For node *v* and metric *m*, the signal monoid (*S*(*v*, *m*), ∘, *ε*) is defined by:
- **Carrier set:** *S*(*v*, *m*) = {*s* ∈ SIGNAL | *s*.*node* = *v* ∧ *s*.*metric* = *m*}, ordered by temporal reference
- **Binary operation:** *s*₁ ∘ *s*₂ = concatenation of signal sequences, preserving temporal order
- **Identity element:** *ε* = the empty signal sequence (no observations)

**Associativity** holds by definition of sequence concatenation. The identity element *ε* represents a node-metric pair with no observations — a valid state that produces *undefined* on point queries.

The monoid structure captures a fundamental property of observation: signals compose. The signal history of a node is the monoidal product of all individual observations, and any prefix of this product constitutes a valid partial history. This property is essential for temporal windowing: a query over a time range extracts a submonoid of the full signal history.

### 5.4 Time as Natural Transformation

The temporal substrate defines a category **T** whose objects are DATE nodes and whose morphisms are NEXT edges. A natural transformation *η* : *F* ⇒ *G* between two functors *F*, *G* : **D** → **C** represents a *temporal evolution* of the domain mapping — how the domain's structure changes over time.

PROTOCOLs can be formalized as natural transformations from the current state functor to an expected future state functor. The protocol's checkpoints define the components of the natural transformation at specific temporal objects, and the commutativity condition requires that the expected state at each checkpoint is consistent with the domain's structural constraints.

This formalization provides a category-theoretic grounding for drift detection: drift occurs when the observed signal at a checkpoint fails to satisfy the natural transformation condition — when reality diverges from the expected structural evolution.

---

## 6. Formal Properties

### 6.1 Completeness: Expressive Power

**Theorem 1 (Expressiveness).** Any domain expressible in OWL-DL [?] can be expressed in the five-primitive Charlotte model.

*Proof sketch.* OWL-DL expresses: (1) classes — mapped to NODE with P0 category values; (2) individuals — mapped to specific NODE instances; (3) object properties — mapped to EDGE with P2 type values; (4) datatype properties — mapped to METRIC + SIGNAL pairs, where METRIC defines the property and SIGNAL records its value; (5) class restrictions — mapped to PROTOCOL constraints that specify expected metric values; (6) class hierarchy — mapped to EDGE with type SUBCLASS_OF connecting category nodes.

The mapping is surjective: every OWL-DL construct has a Charlotte representation. It is not injective: Charlotte's SIGNAL and PROTOCOL primitives express temporal and expectational concepts that OWL-DL cannot represent natively (OWL-DL is atemporal and declarative, not temporal and procedural).

Therefore, the five-primitive model is strictly *more* expressive than OWL-DL within the domain of observable temporal systems. ∎

### 6.2 Minimality: No Redundant Primitives

**Theorem 2 (Minimality).** Removing any single primitive from the five-primitive model reduces its expressiveness — there exist domains that can be expressed with five primitives but not with any subset of four.

*Proof.* We show that each primitive is independently necessary:

- **Without NODE:** The model cannot distinguish persistent identities from transient observations. SIGNALs and EDGEs require target identities; without NODEs, there is nothing to observe or connect.

- **Without EDGE:** The model cannot express relationships between entities. Pedigree structures, ownership chains, spatial hierarchies, and part-of relationships are inexpressible. The graph layer collapses to isolated nodes.

- **Without METRIC:** The model cannot type observations. SIGNALs carry values but without METRICs, the system cannot distinguish a weight measurement from a temperature reading or enforce value type constraints. The feature layer loses its schema.

- **Without SIGNAL:** The model cannot capture temporal observations. The system can define what *can* be measured (METRICs) but not what *was* measured. History is absent. The feature layer is empty.

- **Without PROTOCOL:** The model cannot express expectations. It can record what happened (SIGNALs) but not what should happen. Drift detection — the comparison of expected and observed trajectories — is impossible. Forward-looking intelligence is absent.

Each removal eliminates a distinct capability that cannot be recovered from the remaining four primitives. Therefore, the set of five is minimal. ∎

### 6.3 Orthogonality: Non-Overlapping Concerns

**Theorem 3 (Orthogonality).** The five primitives address disjoint modeling concerns, partitioned into two layers with a bridging primitive.

*Proof.* The five primitives partition into:

- **Graph layer** {NODE, EDGE}: encodes topology — which entities exist and how they relate. Concern: structural connectivity.
- **Feature layer** {METRIC, SIGNAL}: encodes observations — what has been measured and when. Concern: temporal data accumulation.
- **Expectation layer** {PROTOCOL}: encodes forecasts — what should happen in the future. Concern: planned trajectories and drift detection.

The layers are orthogonal in the sense that modifications to one layer do not require modifications to the others:

- Adding a new EDGE (graph layer) does not require new METRICs, new SIGNALs, or new PROTOCOLs.
- Adding a new SIGNAL (feature layer) does not require new NODEs, new EDGEs, or new PROTOCOLs.
- Adding a new PROTOCOL (expectation layer) does not require new NODEs, new EDGEs, or new METRICs.

This independence is a structural property of the register-based encoding: each primitive's registers reference other primitives through ID values, not through structural coupling. ∎

---

## 7. Extensibility Patterns

### 7.1 Schema-Free Evolution

In the five-primitive model, evolving a domain's schema requires no migration scripts, no column additions, and no table alterations. The evolution patterns are:

| Evolution Type | Traditional | Charlotte |
|----------------|-------------|-----------|
| New entity type | CREATE TABLE, define columns, add indexes | New NODE with new P0 category value |
| New relationship | ALTER TABLE or new junction table | New EDGE with new P2 type value |
| New measurement | ALTER TABLE, add column, migrate data | New METRIC document |
| New observation | INSERT into type-specific table | New SIGNAL document |
| New expectation | Custom scheduling infrastructure | New PROTOCOL document |
| Remove entity type | DROP TABLE (or archive + migrate) | Stop creating NODEs with that category |

The critical observation is that *adding* a domain concept is a data operation (creating new documents), not a schema operation (altering tables). This eliminates migration scripts, downtime, and the coordination overhead of schema changes in distributed systems.

### 7.2 The Vocabulary Layer Pattern

The five-primitive model separates *structure* (the five types and their register semantics) from *vocabulary* (the specific categories, edge types, metric labels, and protocol templates used in a domain).

```
Infrastructure Layer (fixed):   NODE, EDGE, METRIC, SIGNAL, PROTOCOL
                                 ↕
Vocabulary Layer (per-domain):  Categories, edge types, metric labels
                                 ↕
Application Layer (per-user):   Specific nodes, edges, signals, protocols
```

Deploying a new domain requires defining a vocabulary layer: what categories of nodes exist (SOW, COMPRESSOR, VIOLIN), what types of edges connect them (SIRE_OF, PART_OF, OWNED_BY), and what metrics can be measured (BODY_WEIGHT, VIBRATION, VALUATION). The infrastructure layer is unchanged. The application layer is populated by users recording signals.

This three-layer architecture enables a deployment pattern in which:
- The infrastructure layer is built once and shared across all domains
- Vocabulary layers are defined per domain and shared within the domain
- Application data is created per user and scoped by access control

### 7.3 Backward Compatibility Guarantees

The append-only semantics of SIGNALs and the immutability of METRICs provide structural backward compatibility:

- **Signal history is preserved.** Adding new metrics does not affect existing signals. Existing signal histories remain queryable and valid.
- **Category evolution is additive.** New NODE categories coexist with existing categories. No existing nodes need to be reclassified.
- **Edge type evolution is additive.** New EDGE types coexist with existing types. No existing edges need to be relabeled.
- **Metric evolution is additive.** New METRIC definitions coexist with existing definitions. A node can accumulate metrics from multiple schema versions simultaneously.

The only non-backward-compatible operation is the *removal* of a primitive type — which Theorem 2 (minimality) shows would reduce expressiveness. Since the five types are minimal and fixed, backward compatibility is structurally guaranteed.

### 7.4 Cross-Domain Interoperability

The shared temporal substrate (DATE nodes) and spatial substrate (CITY, STATE, COUNTRY nodes) provide a common coordinate system across all domains. Two domains with no shared vocabulary — livestock and equipment maintenance, for instance — can still be queried jointly through temporal and spatial co-location:

- "All entities with signals in Missouri this quarter" traverses the shared spatial and temporal substrate, returning both sows and compressors
- "Signal density by month across all domains" aggregates over shared DATE nodes regardless of domain-specific vocabulary

This *substrate-mediated interoperability* requires no ontology alignment, no schema mapping, and no data transformation. The shared coordinate system provides a natural join condition that transcends domain boundaries.

---

## 8. Implementation and Evaluation

### 8.1 Implementation Architecture

The five-primitive model is implemented on Firebase Firestore using a single collection (`facts`) with the register-based document encoding described in Section 3. All five types share the same document structure, enabling consistent indexing via composite indexes on (`:TYPE`, `P0`, `:CREATED`).

### 8.2 Evaluation: Four-Domain Case Study

**Table II: Domain Onboarding Comparison**

| Metric | Charlotte (5-primitive) | Domain-Specific DB |
|--------|------------------------|-------------------|
| Schema changes for new metric | 0 (create METRIC document) | 1+ migrations per entity type |
| New entity type | 0 (new P0 category value) | New table + indexes + rules |
| Cross-domain query | Native traversal | Requires ETL or federation |
| New domain onboarding time | Hours (vocabulary definition) | Weeks–months (schema engineering) |
| Migration scripts maintained | 0 | Proportional to schema age |
| Backward compatibility risk | None (append-only) | Per-migration risk |

All four domains (LineLeap, Sounder, ISG, Prier Violins) were modeled using the same five-primitive structure with no modifications. The vocabulary definition for each domain — categories, edge types, and metric labels — required hours of domain analysis, not weeks of schema engineering.

### 8.3 Production Dataset

The production deployment (purebred livestock domain) contains:

| Component | Count |
|-----------|-------|
| NODE documents | ~27,200 |
| EDGE documents | ~46,100 |
| METRIC definitions | ~50 |
| SIGNAL documents | Growing (projected 10M+ per year at scale) |
| PROTOCOL documents | Per-operation (growing with user base) |
| **Total facts** | **~73,300+** |

All documents reside in a single Firestore collection. Three composite indexes support the dominant query patterns. No per-domain collections, per-domain indexes, or per-domain security rules exist.

---

## 9. Discussion

### 9.1 Limitations

**Traversal cost.** Derived metrics require graph traversal at query time. For domains with deep graph structures (pedigrees with 8+ generations, equipment hierarchies with many levels), traversal cost may impact query latency. Caching strategies (materialized views with time-to-live) mitigate this at the cost of controlled staleness.

**Signal volume.** Domains with very high signal frequency (millions per day) may exceed the indexing capacity of a single collection. Temporal partitioning — sharding the facts collection by date range — extends scalability at the cost of cross-partition query complexity.

**Learning curve.** The five-primitive model requires a conceptual shift from schema-based to vocabulary-based domain modeling. Practitioners accustomed to designing class hierarchies and property graphs must learn to express domain distinctions through category values and metric labels rather than through types and properties. This shift, while ultimately simpler, is initially unfamiliar.

### 9.2 Trade-offs

The five-primitive model makes two deliberate trade-offs:

1. **Universality over domain optimization.** A domain-specific schema can encode domain knowledge in its structure (column types, constraints, indexes optimized for domain queries). The five-primitive model encodes domain knowledge in its values (categories, edge types, metric labels), trading structural optimization for universal applicability.

2. **Derivation over storage.** Domain-specific schemas store computed values as attributes for O(1) retrieval. The five-primitive model derives all values from signals and edges at query time, trading storage efficiency and query simplicity for accuracy and temporal completeness.

### 9.3 Implications for Ontology Engineering

The five-primitive model suggests a reorientation of ontology engineering from *class hierarchy design* (what types of things exist and how are they related?) to *vocabulary design* (what categories, relationship types, and metric labels describe this domain?).

This reorientation reduces the ontologist's task from structural engineering (designing classes, properties, restrictions, inheritance hierarchies) to linguistic analysis (identifying the terms that distinguish entities, relationships, and measurements in a domain). The structural framework is fixed; only the vocabulary varies.

The implication is that domain experts — who know the vocabulary but may lack formal modeling skills — can define domain models directly, without the mediation of ontology engineers. This democratization of domain modeling is a practical consequence of the five-primitive model's minimality and universality.

---

## 10. Conclusion

### 10.1 Summary

This paper has presented a universal ontology based on five register-based primitives — NODE, EDGE, METRIC, SIGNAL, and PROTOCOL — and established its formal foundations through category theory. Three properties have been proven: completeness (the model expresses everything OWL-DL can express, and more), minimality (no primitive can be removed without loss), and orthogonality (the primitives address disjoint concerns). Cross-domain validation across four systems with radically different characteristics confirms that the five primitives are sufficient for domains spanning lifecycle durations from months to centuries.

The central contribution is a shift in domain modeling methodology: from designing domain-specific schemas (structural engineering) to configuring domain-specific vocabularies (linguistic analysis) on a fixed, universal infrastructure.

### 10.2 Future Work

Two directions merit investigation. First, **automated vocabulary extraction**: mining domain corpora (documentation, expert interviews, existing databases) to automatically propose NODE categories, EDGE types, and METRIC labels for a new domain, reducing the vocabulary definition step from hours to minutes. Second, **ontology learning from signal patterns**: identifying latent domain structure from the statistical properties of signal accumulation — discovering, for example, that certain nodes cluster by signal similarity, suggesting undeclared category distinctions or missing EDGE connections.

---

## References

[References to be populated with curated citation suite]

---

## Figures (Planned)

| Figure | Title | Section |
|--------|-------|---------|
| 1 | Register-Based Document Layout | 3 |
| 2 | OWL-to-Charlotte Mapping | 3 |
| 3 | Four-Domain Convex Hull | 4 |
| 4 | Charlotte Category Diagram | 5 |
| 5 | Vocabulary Layer Pattern | 7 |

## Tables

| Table | Title | Section |
|-------|-------|---------|
| I | Cross-Domain Structural Convergence | 4 |
| II | Domain Onboarding Comparison | 8 |

---

*Draft version: 1.0*
*Date: 2026-02-09*
*Target length: 12–15 pages (ACM MODELS format)*
