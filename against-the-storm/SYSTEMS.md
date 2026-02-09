# Systems — Resolve, Hostility, Impatience, and Blightrot

> The pressure dynamics that make infrastructure decisions consequential.

---

## The Four Gauges

Against the Storm runs on four interconnected pressure systems. Each one feeds the others. Understanding them individually is necessary; understanding their coupling is the game.

---

## 1. Resolve (Villager Happiness)

**What it is:** A per-species number representing willingness to stay in the settlement.

**Base formula:**
```
Resolve = Base Resolve + Positive Effects - Negative Effects
```

**If resolve falls below 1, villagers leave.** Lost villagers reduce workforce AND increase Impatience.

### Positive Sources (Stacking)

| Source | Resolve Bonus | Cost |
|--------|--------------|------|
| Basic Shelter | +3 | 5 Wood |
| Species Housing | +8 | Building materials |
| Complex Food (preferred) | Variable (+2 to +6) | Production chain |
| Clothing | Variable | Production chain |
| Service Goods | +8 to +10 each | Good + staffed building |
| Firekeeper Bonus | Species-dependent | Hearth assignment |
| Cornerstones/Perks | Variable | Random/earned |
| Lighter Treatment | +5 (one species) | -5 penalty to others |

### Negative Sources

| Source | Resolve Penalty |
|--------|----------------|
| No housing | Baseline penalty |
| Hostility (per level above 0) | -2 per level |
| Storm season | Variable |
| Failed glade events | Significant |
| Hearth failure (no fuel) | Rapid deterioration |
| Food scarcity | Direct penalty |
| Blightrot corruption | Cascading |

### The Resolve Economy

Resolve is not just morale — it is a **reputation generation engine**.

- High resolve generates passive reputation over time
- Harpies convert resolve to reputation at 2x the rate of other species
- Resolve is both a survival metric AND a victory condition
- "Sustainable resolve" (permanent bonuses) vs "temporary resolve" (stockpile-and-release)

### The Resolve Party

Late-game strategy: use Consumption Control to stockpile service goods and complex food, then release everything at once during favorable weather. This spikes resolve across all species simultaneously, generating a burst of reputation. The "resolve party" is a designed win condition — the game rewards systems mastery with a coordinated resource release.

---

## 2. Hostility (Forest Pressure)

**What it is:** The forest's resistance to settlement expansion. Scales with time and exploitation.

### What Increases Hostility
- Years passed (automatic)
- Glades opened
- Villagers added to settlement
- Buildings constructed

### What Decreases Hostility
- Hearths (-30 per hearth)
- Fox Firekeeper bonus (-6 per opened glade)
- Specific cornerstones/perks
- Losing villagers (grim but mechanical — fewer people = less pressure)

### Hostility Effects

| Hostility Level | Effect |
|----------------|--------|
| 0 | No penalty |
| 1+ | -2 global resolve per level |
| High | Forest Mysteries trigger during storms |
| Critical | Forest Mysteries become lethal |

### Forest Mysteries

Stackable negative events that trigger during Storm season based on hostility level. Higher hostility = more frequent and more dangerous mysteries. They create a ratcheting pressure — each storm season is worse than the last unless hostility is managed.

### The Hostility Spiral

Hostility scales while solutions don't. Hearths consume fuel. Cornerstones are random. The only guaranteed long-term answer is either:
1. **Resolve high enough to tank the damage** while still generating reputation
2. **Win fast** before hostility overwhelms

Above a certain level, hostility WILL kill the settlement. This creates a hard timer on every run.

---

## 3. Impatience (Queen's Timer)

**What it is:** The red gauge. When it hits 14, you lose (or enter Last Stand).

### What Increases Impatience
- Per-minute passive gain
- Villager deaths from ANY cause (starvation, hostility, glade events)
- Failed glade events

### What Decreases Impatience
- Gaining reputation (each reputation point pushes impatience back)
- Capped at 13.99 reduction

### The Death Cascade

Impatience creates cascading failure:

```
Food shortage → Starvation → Villager deaths → Impatience rise
                                              → Workforce reduction
                                              → Less production
                                              → More starvation
                                              → More deaths
                                              → Impatience hits 14
                                              → Game over
```

The guide notes: "If you lose 10 villagers from starvation and have your impatience shoot up to 14, then technically it was the impatience that killed you, but it's more accurate to say that you catastrophically failed to solve the food problem."

Impatience is not the problem. It is the **expression** of the problem.

---

## 4. Blightrot (Corruption Pressure)

**What it is:** A fungal corruption that grows in buildings during storms, especially when using Rain Engines.

### How It Works
- Blightrot cysts spawn in production buildings during storm season
- Cysts must be purged using Blight Posts (Lizard specialization)
- Each Purging Fire costs: 10 Wood OR 4 Oil OR 3 Coal
- Blightrot is a **fuel tax** — it doesn't attack directly, it depletes your fuel reserves

### The Corruption Limit

The Ancient Hearth has a corruption threshold. If Blightrot reaches the limit:

**Voice of the Sealed Ones** — 3 ghosts emerge from the Hearth and kill 3 random villagers.

This links Blightrot directly to Impatience (villager deaths) and workforce reduction.

### Blightrot Mutation

At high difficulty, Blightrot mutates — production in buildings also generates Blightrot during storms, not just Rain Engines. This makes **all production** a corruption source, coupling output to corruption pressure.

---

## System Coupling Map

Every system feeds every other system. There are no isolated gauges.

```
HOSTILITY ──→ Resolve penalty ──→ Low resolve ──→ Villagers leave
    │                                                      │
    │                                                      ▼
    │                                              Workforce shrinks
    │                                                      │
    │                                                      ▼
    │                                              Production drops
    │                                                      │
    │                    ┌─────────────────────────────────┘
    │                    ▼
    │              Food shortage ──→ Starvation ──→ Deaths
    │                                                  │
    │                                                  ▼
    │                                           IMPATIENCE rises
    │                                                  │
    ▼                                                  ▼
FOREST MYSTERIES ──→ Villager deaths ──────→ IMPATIENCE rises
                                                       │
BLIGHTROT ──→ Fuel depletion ──→ Hearth failure ──→ Resolve collapse
    │                                                      │
    │                                                      ▼
    ▼                                              Villagers leave
Corruption limit ──→ Voice kills 3 ──→ IMPATIENCE rises
```

### The Meta-System

The game is won by filling the **Reputation** bar (blue) before **Impatience** (red) hits 14.

Reputation comes from three sources:
1. **Orders** — Complete specific resource/building objectives (reliable, fast, cheap)
2. **Resolve** — Sustained high resolve generates passive reputation (medium reliability)
3. **Glade Events** — Solving dangerous/forbidden glade challenges (unreliable, variable, high risk)

The tension: every action that generates reputation (building, exploring, growing population) also increases hostility and system pressure. Growth feeds both victory AND failure simultaneously.

---

## The Arc

Every settlement follows the same pressure arc:

| Phase | Priority | Risk |
|-------|----------|------|
| Early Game | Building materials, basic food, shelter | Overexpansion, no fuel reserves |
| Mid Game | Production chains, complex food, services | Food crisis, hostility ramp |
| Late Game | Reputation push, resolve party, glade events | Cascade failure, blightrot overwhelm |

Breaking this arc — opening too many glades early, delaying food infrastructure, ignoring fuel reserves — creates cascading failures that the system coupling map makes irreversible.
