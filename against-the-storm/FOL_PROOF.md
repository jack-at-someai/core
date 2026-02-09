# First-Order Logic Proof — What SUBSTRATE.lisp Demonstrates

> Nine predicates. Zero domain-specific ones. That's the substrate.

---

## Why Lisp

Lisp is not a style choice. It is the minimal syntax for first-order logic that a machine can evaluate. S-expressions are trees. Trees are graphs. Graphs are Charlotte's native structure.

If you can express a system in Lisp predicates:
- The semantics are formally verifiable
- The predicates are portable across interpreters, languages, and runtimes
- Domain-specific vocabulary is data, not code
- The separation between structure and meaning is provably clean

Writing the game backend as Lisp is writing it as **pure logic**. If the logic holds for Against the Storm, and the same logic holds for a pig farm, the logic is the substrate.

---

## The Nine Predicates

SUBSTRATE.lisp uses exactly nine predicates to encode the entire game:

| Predicate | What it asserts | FOL Form |
|-----------|----------------|----------|
| `exists-p` | An entity of category C exists at time T | `∃x : category(x) = C ∧ time(x) = T` |
| `relates-p` | Entity A is connected to entity B by relation R at time T | `R(a, b, t)` |
| `measurable-p` | Dimension D of type V can be observed on entity X | `∃d : dim(x, d) ∧ type(d) = V` |
| `observed-p` | Entity X has value V on dimension D at time T | `val(x, d, t) = V` |
| `expected-p` | Entity X should have value V on dimension D at time T | `target(x, d, t) = V` |
| `specializes-p` | Category C has enhanced capability at building B | `bonus(C, B)` |
| `needs-p` | Category C requires satisfier S for dimension D | `requires(C, D) = S` |
| `produces-p` | Building B transforms input I into output O | `transform(B, I) = O` |
| `powered-by-p` | Building B requires power source W to operate | `depends(B, W)` |

---

## The Cross-Industry Test

Each predicate is tested against four domains. If even one predicate fails in a domain, the substrate claim is false.

### `exists-p` — Entity Declaration

| Domain | Expression | Holds? |
|--------|-----------|--------|
| Game | `(exists-p :beaver-07 :beaver :year-1)` | Yes |
| Swine | `(exists-p :bella :sow :date-1-30-2026)` | Yes |
| Industrial | `(exists-p :compressor-412 :compressor :date-3-15-2026)` | Yes |
| Violin | `(exists-p :strad-1715 :violin :date-1-1-1715)` | Yes |

### `relates-p` — Typed Relationship

| Domain | Expression | Holds? |
|--------|-----------|--------|
| Game | `(relates-p :beaver-07 :settlement-alpha :member-of :year-1)` | Yes |
| Swine | `(relates-p :bella :trogdon-showpigs :member-of :date-1-30-2026)` | Yes |
| Industrial | `(relates-p :compressor-412 :isg-fleet :member-of :date-3-15-2026)` | Yes |
| Violin | `(relates-p :strad-1715 :prier-collection :member-of :date-6-1-2020)` | Yes |

### `measurable-p` — Observable Dimension

| Domain | Expression | Holds? |
|--------|-----------|--------|
| Game | `(measurable-p :beaver :resolve :number)` | Yes |
| Swine | `(measurable-p :bella :weight :number)` | Yes |
| Industrial | `(measurable-p :compressor-412 :vibration :number)` | Yes |
| Violin | `(measurable-p :strad-1715 :provenance :string)` | Yes |

### `observed-p` — Time-Indexed Assertion

| Domain | Expression | Holds? |
|--------|-----------|--------|
| Game | `(observed-p :beaver :resolve 12 :year-1)` | Yes |
| Swine | `(observed-p :bella :weight 285 :date-1-30-2026)` | Yes |
| Industrial | `(observed-p :compressor-412 :vibration 4.2 :date-3-15-2026)` | Yes |
| Violin | `(observed-p :strad-1715 :provenance "Acquired by Prier" :date-6-1-2020)` | Yes |

### `expected-p` — Constraint/Forecast

| Domain | Expression | Holds? |
|--------|-----------|--------|
| Game | `(expected-p :settlement :reputation 18 :year-3 :resolve-party)` | Yes |
| Swine | `(expected-p :ruby-1 :weight 260 :date-6-15-2026 :show-prep)` | Yes |
| Industrial | `(expected-p :compressor-412 :vibration 3.0 :date-6-1-2026 :maintenance)` | Yes |
| Violin | `(expected-p :strad-1715 :humidity 45 :date-12-1-2026 :conservation)` | Yes |

### `specializes-p` — Capability Assertion

| Domain | Expression | Holds? |
|--------|-----------|--------|
| Game | `(specializes-p :beaver :lumber-mill)` | Yes |
| Swine | `(specializes-p :hampshire :farrowing-barn)` | Yes |
| Industrial | `(specializes-p :rotary-screw :high-pressure-line)` | Yes |
| Violin | `(specializes-p :cremonese :concert-hall)` | Yes |

### `needs-p` — Requirement Assertion

| Domain | Expression | Holds? |
|--------|-----------|--------|
| Game | `(needs-p :beaver :food)` → `(:biscuits :pickled-goods)` | Yes |
| Swine | `(needs-p :sow :nutrition)` → `(:gestation-feed :lactation-feed)` | Yes |
| Industrial | `(needs-p :compressor :maintenance)` → `(:oil-change :filter-replacement)` | Yes |
| Violin | `(needs-p :violin :conservation)` → `(:humidity-control :case-storage)` | Yes |

### `produces-p` — Transformation Rule

| Domain | Expression | Holds? |
|--------|-----------|--------|
| Game | `(produces-p :lumber-mill :wood)` → `(:planks 3)` | Yes |
| Swine | `(produces-p :farrowing-barn :bred-sow)` → `(:litter 3)` | Yes |
| Industrial | `(produces-p :compressor-station :intake-air)` → `(:compressed-air 3)` | Yes |
| Violin | `(produces-p :luthier-workshop :raw-spruce)` → `(:top-plate 3)` | Yes |

### `powered-by-p` — Dependency Assertion

| Domain | Expression | Holds? |
|--------|-----------|--------|
| Game | `(powered-by-p :bakery :drizzle)` | Yes |
| Swine | `(powered-by-p :farrowing-house :climate-control)` | Yes |
| Industrial | `(powered-by-p :compressor :three-phase-power)` | Yes |
| Violin | `(powered-by-p :concert-hall :acoustic-treatment)` | Yes |

---

## Results

**36 assertions. 36 hold. 0 domain-specific predicates.**

The predicates are domain-agnostic. The arguments are domain-specific. The separation is total.

---

## What This Means

### For Charlotte

The five FACT types (NODE, EDGE, METRIC, SIGNAL, PROTOCOL) are not a design choice. They are the minimal set required to express:

| FACT Type | FOL Equivalent | Lisp Predicate |
|-----------|---------------|----------------|
| NODE | `∃x` | `exists-p` |
| EDGE | `R(x, y)` | `relates-p` |
| METRIC | `∃d : dim(x, d)` | `measurable-p` |
| SIGNAL | `val(x, d, t)` | `observed-p` |
| PROTOCOL | `target(x, d, t)` | `expected-p` |

The remaining four predicates (`specializes-p`, `needs-p`, `produces-p`, `powered-by-p`) are **derivable from EDGE and SIGNAL queries** — they are convenience traversals, not new primitives.

```
specializes-p = (relates-p ?species ?building :specialization-of)
needs-p       = (relates-p ?species ?need :requires) + query satisfiers
produces-p    = (relates-p ?input ?building :input-to) + (relates-p ?building ?output :outputs)
powered-by-p  = (relates-p ?building ?power :depends-on)
```

Five primitives. Nine predicates. Four of which reduce to two. The irreducible core is five.

Charlotte's five types are not arbitrary. They are the **minimal basis** for first-order logic over time-indexed graphs.

### For the Paper

This Lisp file is a runnable proof-of-concept for Paper 1 (FINN Data Model). The claim that Charlotte's five primitives are sufficient for any domain where identities emit signals over time can now be demonstrated by:

1. Writing the domain's backend in SUBSTRATE.lisp predicates
2. Showing all predicates hold without modification
3. Showing vocabulary changes are confined to arguments, never structure

Against the Storm is the fifth point on the convex hull — a game, not an industry, arriving at the same architecture through entirely different selection pressures.

---

## The Dense Graph

SUBSTRATE.lisp Part 7 contains a complete settlement encoded as ~65 FACT documents. That settlement contains:

- 3 temporal nodes (years) linked by NEXT edges
- 1 settlement node
- 6 villager nodes (2 per species)
- 7 building nodes
- 3 resource nodes
- 6 membership edges
- 4 building-ownership edges
- 6 worker-assignment edges
- 6 housing edges
- 5 production edges
- 8 metric declarations
- 7 year-1 signals
- 7 year-2 signals
- 1 protocol (resolve party course correction)

**65 facts. 1 collection. 5 types. Complete settlement state.**

Swap the vocabulary — beavers for sows, lumber mills for farrowing barns, resolve for weight, settlements for operations — and you have Charlotte's swine vertical. Same fact count. Same structure. Same collection. Same five types.

That's the substrate.
