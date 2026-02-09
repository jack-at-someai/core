# Infrastructure — Buildings, Resources, and Production Chains

> The physical graph: what exists, what it produces, what it connects to.

---

## Building Categories

Against the Storm organizes buildings into functional categories that form a dependency graph. No building exists in isolation — every structure either feeds into or draws from other structures.

---

### Gathering Buildings (Raw Input)

These buildings extract resources from the map. They are the roots of every production chain.

| Building | Output | Notes |
|----------|--------|-------|
| Woodcutter's Camp | Wood | Primary fuel and material source. Beaver specialization. |
| Forager's Camp | Berries, Mushrooms, Roots, Vegetables | Depends on biome and soil |
| Trapper's Camp | Meat, Leather, Insects | Lizard specialization |
| Herbalist's Camp | Herbs | Medical and service chains |
| Small Farm | Grain, Vegetables, Broccoli | Human specialization. Requires Fertile Soil. |
| Herb Garden | Herbs, Roots | Human specialization |
| Plantation | Plant Fiber, Reed | Specialized agriculture |
| Ranch | Meat, Leather, Eggs | Lizard specialization |
| Clay Pit | Clay | Building material chain |
| Mine | Copper Ore, Stone, Coal | Beaver specialization |
| Rain Collector | Clearance Water, Drizzle Water, Storm Water | Three distinct water types power different buildings |

---

### Production Buildings (Transformation)

These take raw inputs and produce processed goods. Each building has **recipes** — specific input/output combinations rated by star level (efficiency).

#### Food Processing

| Building | Recipes | Species Notes |
|----------|---------|---------------|
| Bakery | Pie, Biscuits, Pottery | Human spec. Drizzle water powered. |
| Beanery | Pickled Goods, Porridge | 4 worker slots. Cross-species synergy. |
| Brewery | Beer (3 recipes) | Human spec. Drizzle water powered. |
| Butcher | Meat recipes (3 variants) | Human spec. Drizzle water powered. |
| Cellar | Wine (3 recipes) | Drizzle water powered. |
| Cookhouse | Stews (multiple species) | Broad output. |
| Grill | Food for Lizards and Beavers only | Species-restricted output. |
| Smokehouse | Jerky (preserved meat) | Lizard spec. Grants resolve bonus. |
| Teahouse | Tea recipes | Grants bonus resolve to Harpies. |

#### Material Processing

| Building | Recipes | Species Notes |
|----------|---------|---------------|
| Workshop | Planks, Fabric, Bricks, Pipes | Cheapest building materials. Universal early-game. |
| Carpenter | Logs to Planks | Storm water powered. Fuel stabilization. |
| Lumber Mill | Planks (advanced) | Beaver spec. Fuel stabilization. |
| Brick Oven / Brickyard | Bricks from Clay | Storm water powered. |
| Furnace | Tools, Metal Bars | Lizard spec. Critical for tool chains. |
| Kiln | Coal from Logs | Lizard spec. Storm water powered. |
| Smelter | Metal processing | Advanced metal chain. |
| Toolshop / Tinkerer | Tools | Beaver spec. |

#### Craft and Trade Goods

| Building | Recipes | Species Notes |
|----------|---------|---------------|
| Alchemist Hut | Crystallized Dew | Clearance water powered. |
| Apothecary | Incense | Clearance water powered. |
| Artisan | Pigment, Barrels | Clearance water powered. |
| Clothier | Cloth (all recipes) | Harpy spec. Clearance water powered. |
| Cooperage | Barrels | Beaver spec. Clearance water powered. |
| Distillery | Alcohol (all recipes) | |
| Leatherworker | Leather goods | |
| Press | Oil (all recipes) | |
| Scribe | Scrolls, Paper goods | |
| Stamping Mill | Paper (all recipes) | Research and trade. |
| Weaver | Woven goods | |

---

### Service Buildings (Resolve Input)

Service buildings consume **service goods** to generate **resolve bonuses**. They require two things simultaneously: the good AND a staffed building. Missing either half kills the bonus.

| Building | Services Provided | Species Affinity |
|----------|------------------|------------------|
| Tavern | Leisure, Brotherhood | Human leisure, Lizard brotherhood |
| Temple | Religion, Brotherhood | All species. Essential for glade events. |
| Market | Religion, Luxury, Brotherhood | Multi-use. Lizard and Beaver affinity. |
| Library | Religion, Luxury, Education | Beaver luxury, Beaver education |
| Guild House | Leisure, Education | Human leisure, Beaver education |
| Tea Doctor | Luxury, Leisure | Beaver luxury, Human leisure |
| Bath House | Cleanliness | Harpy need |
| Clan Hall | Social | |
| Forum | Social | |
| Monastery | Religion | |

---

### Core Infrastructure

| Building | Function |
|----------|----------|
| Ancient Hearth | Central hub. Burns fuel constantly. Firekeeper species bonus. Villagers visit for breaks. Corruption limit triggers Voice of the Sealed Ones (kills 3 villagers). |
| Secondary Hearths | Reduce hostility by 30 each. Extend settlement range. Consume fuel. |
| Shelters | Basic housing for up to 3 villagers. +3 resolve. Cost: 5 wood to relocate. |
| Species Housing | Species-specific housing. +8 resolve bonus. More efficient for small populations of that species. |
| Warehouse | Storage expansion. |
| Trading Post | Enables trader visits. Access to blueprints, resources, and perks. |
| Explorer's Lodge | Free glade entry (normally costs resources). |
| Blight Post | Removes Blightrot cysts. Lizard specialization. |

---

## Resource Categories

### Raw Resources
Berries, Broccoli, Clay, Copper Ore, Eggs, Grain, Herbs, Insects, Leather (raw), Meat, Mushrooms, Plant Fiber, Reed, Resin, Roots, Stone, Vegetables, Wood

### Processed Food (Complex Food)
Beer, Biscuits, Jerky, Pickled Goods, Pie, Porridge, Skewers, Stews, Tea, Wine

### Building Materials
Bricks, Fabric, Pipes, Planks

### Fuel
Coal (from Kiln or Mine), Oil (from Press), Sea Marrow (gathered), Wood

### Crafted / Trade Goods
Alcohol, Amber (currency), Ancient Tablets (highest value), Barrels, Cloth, Crystallized Dew, Incense, Metal Bars, Pigment, Scrolls, Tools, Waterskins, Wildfire Essence

### Water Types (Infused Rainwater)
| Type | Color | Powers |
|------|-------|--------|
| Clearance | Gold | Alchemist Hut, Apothecary, Artisan, Clothier, Cooperage |
| Drizzle | Green | Bakery, Brewery, Butcher, Cellar, Cookhouse |
| Storm | Blue | Brickyard, Carpenter, Crude Workshop, Finesmith, Kiln |

Water types create a **second dependency axis** — buildings need both raw ingredients AND the correct water type to operate at full efficiency.

---

## Production Chain Examples

### Wood to Everything
```
Wood (Woodcutter) → Planks (Carpenter/Lumber Mill) → Buildings
Wood (Woodcutter) → Coal (Kiln) → Fuel
Wood (Woodcutter) → Direct Fuel → Hearth
```

### Meat to Jerky
```
Meat (Trapper/Ranch) → Jerky (Smokehouse) → Complex Food + Resolve
```

### Grain to Pie
```
Grain (Farm) → Pie (Bakery + Drizzle Water) → Complex Food + Resolve
```

### Ore to Tools to Victory
```
Copper Ore (Mine) → Metal Bars (Furnace) → Tools (Toolshop)
Tools → Cache Opening → Citadel Resources → Reputation
```

### Building Material Cascade
```
Wood → Planks ──┐
Clay → Bricks ──┤→ All expansion buildings
Fiber → Fabric ─┘
Pipes (Workshop) → Building upgrades for rainwater
```

---

## The Blueprint Constraint

You don't get to choose your buildings freely. Each settlement offers a randomized selection of **blueprints** — building plans you can construct. This means:

- You may have species that need Biscuits but no Bakery blueprint
- You may have Beavers but no Lumber Mill
- You must adapt production chains to whatever buildings you're offered

The blueprint system forces **adaptive infrastructure design** rather than optimized templates. Every settlement is a unique graph of available transformations.
