# Resonance — Where Against the Storm Meets Charlotte

> Two systems, designed independently, converging on the same architecture.

---

## The Claim

Against the Storm is a working simulation of Charlotte's core thesis: **multiple species emitting signals across time within shared infrastructure, where meaning emerges from traversal and composition rather than stored hierarchy.**

The game designers didn't read SUBSTRATE.md. They solved a different problem (make a fun city builder) and arrived at the same structural answer. That convergence is the evidence.

---

## Structural Mapping

### Species Are Node Categories

| Against the Storm | Charlotte |
|-------------------|-----------|
| Human, Beaver, Lizard, Harpy, Fox | NODE categories (SOW, BOAR, PIGLET, COMPRESSOR, VIOLIN) |
| Each species has traits, needs, tolerances | Each category has metrics, signals, protocols |
| Species don't store hierarchy — they belong to a settlement by being present | Nodes don't store hierarchy — they belong to operations by EDGE traversal |
| 3-of-5 species per settlement | Scoped container with subset of categories active |

The game doesn't embed species into a hierarchy. A Beaver isn't "owned by" a settlement — it exists, and happens to be working there. Charlotte's nodes work the same way. A SOW isn't "owned by" an operation — it exists, and edges connect it to a location.

### Resolve Is a Signal

| Against the Storm | Charlotte |
|-------------------|-----------|
| Resolve = happiness number per species | SIGNAL on METRIC:resolve for each NODE |
| Resolve changes over time based on conditions | Signals are append-only, creating a history |
| High resolve → reputation generation | High signal values → protocol satisfaction |
| Resolve collapse → villagers leave | Signal drift → protocol deviation alerts |

Resolve is not a static field. It fluctuates based on food, housing, services, weather, hostility. Every tick produces a new resolve value. In Charlotte terms, resolve is a **metric with continuous signal emission** — exactly the kind of time-indexed observation Charlotte is built to track.

### Needs Are Metrics

| Against the Storm | Charlotte |
|-------------------|-----------|
| Housing Need | METRIC:housing (BOOLEAN — sheltered or not) |
| Complex Food Need | METRIC:complex_food (STRING — which type) |
| Service Need (Religion, Leisure, etc.) | METRIC:service_religion, METRIC:service_leisure |
| Clothing Need | METRIC:clothing (BOOLEAN) |
| Species-specific needs | Category-specific metrics |

Each species has different needs. Beavers want Luxury and Education. Lizards want Religion and Brotherhood. Harpies want Bloodthirst and Cleanliness. In Charlotte, these are just different metric sets attached to different node categories. **The architecture doesn't change — only the vocabulary.**

### Buildings Are Edges

| Against the Storm | Charlotte |
|-------------------|-----------|
| A Smokehouse connects Meat to Jerky | EDGE from RESOURCE:meat to RESOURCE:jerky via BUILDING:smokehouse |
| A Tavern connects Ale to Leisure service | EDGE from RESOURCE:ale to SERVICE:leisure via BUILDING:tavern |
| A Shelter connects a Villager to Housing | EDGE from VILLAGER:x to SHELTER:y (HOUSED_IN) |
| Workers assigned to buildings | EDGE from VILLAGER:x to BUILDING:y (WORKS_AT) |

Buildings are not containers. They are **transformation edges** — they connect inputs to outputs. A Bakery doesn't "hold" flour and produce pie. A Bakery is the relationship between flour and pie. Charlotte's edges work identically: EDGE facts connect nodes to nodes with a typed relationship.

### Production Chains Are Graph Traversals

```
Against the Storm:
  Wood → [Kiln] → Coal → [Hearth] → Settlement Warmth

Charlotte equivalent:
  NODE:wood --[PRODUCES_VIA:kiln]--> NODE:coal --[FUELS:hearth]--> NODE:settlement
```

Every production chain in Against the Storm is a path through a directed graph. Resources flow from gathering nodes through transformation nodes to consumption nodes. Charlotte's graph traversal does the same thing — meaning is derived by walking the edges, not by looking at any single node's fields.

### The Ancient Hearth Is the Temporal Substrate

| Against the Storm | Charlotte |
|-------------------|-----------|
| Ancient Hearth is always present | Temporal substrate (DATE nodes) is always present |
| All villagers return to it on break cycles | All signals reference DATE nodes via :CREATED |
| It burns fuel constantly (time has a cost) | Temporal spine runs whether or not signals are emitted |
| It provides the firekeeper bonus (global modifier) | Temporal substrate enables global queries across all nodes |
| Corruption limit triggers catastrophic events | Substrate integrity is required for system health |

The Hearth is the one structure you never choose, never build, and can never remove. It is infrastructure. It runs whether you want it to or not. It consumes resources just by existing. Charlotte's temporal substrate is identical — DATE nodes exist independently of any operation, and all facts reference them. Time runs whether or not you observe it.

### Hostility Is Environmental Pressure

| Against the Storm | Charlotte |
|-------------------|-----------|
| Hostility increases with settlement growth | System pressure scales with operation complexity |
| Forest Mysteries are external events | Environmental signals affect node trajectories |
| Hostility is reduced by Hearths (infrastructure) | Environmental pressure is managed through substrate design |
| Above a threshold, hostility is lethal | Unmanaged system pressure causes cascade failure |

Charlotte's CONVEX_HULL.md describes how different domains have different environmental pressures: market conditions for LineLeap, breeding cycles for showpigs, industrial load for compressors, cultural context for violins. Against the Storm makes this pressure literal — the forest fights back. Same pattern, different vocabulary.

### Blueprints Are Available Metrics

The blueprint constraint — you get random buildings, not chosen ones — maps to a fundamental Charlotte principle: **you observe what you can, not what you want.**

An operation doesn't get to choose its metric space. It gets the metrics that are available for its categories, its context, its time window. Against the Storm makes the same constraint: you build with the blueprints you're given, not the blueprints you'd prefer.

### Cornerstones Are Protocols

| Against the Storm | Charlotte |
|-------------------|-----------|
| Cornerstones modify production/resolve/behavior | Protocols generate expected signals |
| Chosen annually, persist for the settlement | Created on demand, persist for the node lifecycle |
| "3 barrels every time you produce 10 planks" | "Target weight 260 by DATE:6-15-2026" |
| Modify system behavior without changing structure | Shape trajectories without changing observed history |

Cornerstones don't change the rules. They modify the **rates and relationships** within the existing system. A cornerstone that gives bonus barrels per plank production doesn't add a new building — it changes the signal rate on an existing edge. Charlotte's protocols do the same thing: they forecast expected signals and create checkpoints, but they never modify the underlying fact structure.

---

## The Three Species on a Farm

Against the Storm's 3-of-5 species composition maps directly to livestock operation management:

| Game Concept | Farm Concept |
|--------------|-------------|
| Beavers (fuel/materials) | Infrastructure animals — the breed that converts feed to maintenance output reliably |
| Humans (food production) | Production animals — the breed that generates primary output (litters, milk, eggs) |
| Lizards (survival/support) | Foundation animals — the breed with resilience, genetic stability, long tolerance |
| Harpies (reputation/conversion) | Show animals — high maintenance, high yield when conditions are perfect |
| Foxes (hostility management) | Scout/guard animals — specialist role that manages environmental pressure |

A real farm, like a real settlement, runs on **composition**. You don't breed one type of animal. You select for different roles — some for production, some for resilience, some for genetic diversity, some for show. The question is always: **which three do I need given my environment, my infrastructure, and my goals?**

---

## The Core Resonance

Both systems share five structural principles:

### 1. Identity Without Hierarchy
Species/nodes exist independently. They connect to settlements/operations through presence, not ownership.

### 2. Signals Over State
Resolve, food consumption, production output — these are continuous emissions, not static fields. Charlotte's append-only signals encode the same reality.

### 3. Infrastructure Is Shared
The Hearth/temporal substrate runs for everyone. Housing, food, and service buildings serve all compatible species. The infrastructure doesn't belong to any species — it belongs to the settlement.

### 4. Pressure Is Systemic
Hostility, blightrot, impatience — these affect the whole system, not individual species. Charlotte's environmental signals work the same way: market conditions, weather, regulatory changes affect all nodes in a container.

### 5. Composition Over Optimization
There is no "best species." There is no "best breed." There is only the best composition for this environment, these constraints, this moment. Charlotte's containers deploy with different category sets for different industries — not because one set is correct, but because different compositions serve different conditions.

---

## What This Means for Charlotte

Against the Storm proves — through the entirely separate discipline of game design — that Charlotte's architecture is not an invention. It is a **discovery**.

When game designers need to make multi-species management engaging, they build:
- Identities with distinct signal profiles
- Shared infrastructure with transformation edges
- Systemic pressure that scales with complexity
- Composition-based strategy over optimization-based strategy
- Time as a constant cost, not a free dimension

Charlotte builds the same things for observable reality.

The game is a toy model of the substrate. The substrate is the game's architecture made real.
