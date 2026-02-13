# Monroe Livestock Auction — Business Analysis

## Company Profile

- **Legal Name:** Monroe Livestock Auction (MLA)
- **Location:** 1871 E 200 S, Monroe, IN 46772 (Adams County)
- **Founded:** Unknown — established regional auction in the heart of the world's largest Swiss Amish settlement (est. 1840, ~11,000 adherents, 24% of Adams County population)
- **Ownership:** Owner-operator model; Tyler Bluhm is primary operations contact
- **Revenue:** $500K–$1.5M annually (estimated; small regional weekly auction)
- **Employee Count:** 3–8 (core staff + ring crew + clerks scaled for sale days)
- **Facility:** Single auction facility on US-27 in Monroe, IN — ring, holding pens, consignment intake area
- **Contact:**
  - Phone: 260-216-5489
  - Email: monroelivestock@gmail.com
- **Organizational Chart:**

| Person | Role | Responsibilities |
|--------|------|-----------------|
| Tyler Bluhm | Operations Lead | Runs feeder specials, primary operations contact, day-to-day management |
| Mel | Horse Consignment | Horse consignment intake and coordination |
| Ring Crew (variable) | Sale Day Staff | Auctioneering, animal handling, DVAuction broadcast operation |
| Clerks (variable) | Sale Day Staff | Manual cataloging, settlement, cash/check processing |

## Business Model

- **What they sell:** Auction services — MLA does not own the livestock. They provide the marketplace (ring, broadcast, buyer pool) and take a commission on each sale.
- **To whom:** Dual market of buyers and sellers:
  - **Sellers/Consignors:** Local farmers, Amish breeders, horse owners, small animal hobbyists, exotic animal dealers
  - **Buyers:** Local Amish community (cash, in-person, relationship-driven), remote non-Amish buyers (DVAuction online bidding, card/wire payment)
- **Through what channels:**
  - In-person weekly Tuesday auction (11 AM livestock, 5 PM small animals/poultry)
  - DVAuction live broadcast + online bidding (remote buyers)
  - National Beef Wire channel 6145
  - Facebook page and basic Squarespace-style website for scheduling/announcements
- **Revenue streams:**
  - Commission on livestock sales (primary — percentage of hammer price)
  - Consignment fees
  - Specialty sale premiums (feeder calf specials, horse sales, exotic sales)
  - Yardage/pen fees (if applicable)
  - All revenue is transaction-based; no recurring/subscription income
- **Supply chain position:** MLA is the **marketplace intermediary** — the node where supply (consignors) meets demand (bidders). They sit at the center of the local livestock value chain but own no inventory. Their value is the ring, the crowd, and the trust.

### Sale Categories

| Category | Examples | Frequency |
|----------|----------|-----------|
| Cattle | Feeder calves, bred stock, cow-calf pairs | Weekly + monthly feeder specials (1st Friday @ 2 PM) |
| Horses | Driving horses, draft horses, ponies, stallions, yearlings | Scheduled specialty sales (Mar–Nov) |
| Small Animals | Poultry, rabbits | Weekly (Tuesday 5 PM) |
| Exotics | Seasonal variety | Annual 3-day event (April) |

### Specialty Sale Schedule (2026)

| Sale | Dates |
|------|-------|
| Feeder Calf Special | 1st Friday monthly @ 2 PM (proof of vaccines required) |
| Pony Sale | Apr 16, Aug 13, Sep 10 |
| Driving Horse Sale | Mar 20, May 15, Aug 14, Sep 18 |
| Draft Horse Sale | Apr 6, Sep 17 |
| Exotic Animal Sale | Apr 16–18 (3-day) |
| Stallion Presentation & Yearling/Driving | Nov 12–13 |

### Dual Market Dynamic

The Amish settlement in Adams County creates a structurally bifurcated buyer base:

- **Local Amish buyers:** Cash transactions, in-person attendance only, relationship-driven repeat buying, no technology interaction. Driving horses and draft horses are not luxury goods — they are essential transportation and farming equipment. This is a captive demand base.
- **Remote non-Amish buyers:** DVAuction online bidding, card/wire payment, no personal relationship with the ring. This is an expanding demand base enabled by broadcast technology.

MLA must serve both simultaneously. The auctioneer calls the ring while DVAuction captures remote bids. Settlement splits between cash (local) and wire/card (remote). This dual dynamic is the core operational complexity.

## Current Operations

- **Tools/Software in use:**

| Tool | Purpose | Type |
|------|---------|------|
| DVAuction | Live broadcast + online bidding | SaaS (broadcast/marketplace) |
| National Beef Wire (ch. 6145) | Market visibility | Broadcast listing |
| Squarespace-style website | Schedule, contact info, announcements | Static web |
| Facebook | Community engagement, sale announcements | Social media |
| USDA Market Reports | Weekly price/volume filing | PDF (government reporting) |
| Manual ledgers / paper | Consignment intake, settlement, accounting | Paper/cash |

- **No CRM.** Buyer/seller relationships are managed through memory and reputation.
- **No ERP.** No digital inventory, no automated accounting, no integrated systems.
- **No digital catalog.** Animals are cataloged manually on sale day.

- **Data Maturity Assessment: 1 — Spreadsheets/Paper**
  - PDF market reports are filed weekly with USDA (structured but not queryable)
  - DVAuction provides some digital record of online bids and broadcasts
  - All other operations are paper, cash, and verbal
  - No historical analytics, no trend tracking, no buyer/seller profiling
  - Settlement is manual (cash/check, handwritten receipts)

- **Key Workflows:**

| # | Workflow | Current Method |
|---|----------|---------------|
| 1 | **Consignment Intake** | Animals arrive, cataloged manually (species, breed, count, consignor info) |
| 2 | **Vaccine Verification** | Feeder calves require proof of vaccines — verified manually at intake |
| 3 | **Ring Sale** | Auctioneer calls lots in-person; DVAuction broadcasts simultaneously to remote bidders |
| 4 | **Settlement** | Cash/check primary; manual accounting; consignor paid after commission deduction |
| 5 | **USDA Market Report** | Weekly PDF filed — headcount, price ranges by category, averages |

- **Bottlenecks and blind spots:**
  - **No buyer history:** MLA cannot identify repeat buyers, track purchasing patterns, or segment their buyer base. The Amish cash economy makes this structurally invisible.
  - **No consignor analytics:** No way to see which consignors bring the best-performing lots, which return most frequently, or which are trending up/down.
  - **Settlement is a black box:** Manual cash/check processing with no digital trail beyond the USDA report. Reconciliation is labor-intensive and error-prone.
  - **Price discovery is retrospective only:** USDA market reports show what happened last Tuesday. There is no forward-looking price signal, no trend analysis, no seasonal pattern detection.
  - **DVAuction data is siloed:** Online bidding generates digital records, but these are trapped in DVAuction's platform — not integrated with in-person cash transactions, not queryable, not connected to consignment data.
  - **Specialty sale planning is intuition-based:** Which specialty sales to schedule, when, and how many — all driven by Tyler's experience, not by data.

## Industry Position

- **Market segment:** Regional livestock auction — small-scale, community-focused, weekly cadence. Serves a hyper-local agricultural economy anchored by Amish settlement patterns.
- **Niche:** MLA occupies a unique position as the marketplace serving the world's largest Swiss Amish community. The horse categories (driving, draft, pony) are not hobby markets — they are infrastructure for a non-mechanized agricultural community. This is a captive, recession-resistant demand base that most auction operations do not have access to.
- **Competitive advantages:**
  - **Geographic monopoly:** Monroe sits on US-27 in the heart of Adams County's Amish corridor. The nearest competing auctions require significant travel for a community that moves by horse.
  - **Cultural trust:** Serving the Amish community requires deep relationship capital that cannot be replicated by a new entrant. Decades of trust, face-to-face reputation, and community embeddedness.
  - **Dual-channel reach:** DVAuction broadcast expands the buyer pool beyond local, increasing competition on lots and driving up hammer prices for consignors.
  - **Specialty sale calendar:** The rotating schedule of driving horse, draft horse, pony, and exotic sales creates event-driven demand spikes that draw buyers from outside the region.
- **Vulnerabilities:**
  - **Single-location, single-day dependency:** All revenue flows through one ring on one day per week. Any disruption (weather, disease quarantine, facility issue) stops income entirely.
  - **No data moat:** MLA generates valuable market data every Tuesday but captures almost none of it in queryable form. A competitor with better data infrastructure could offer consignors superior price discovery.
  - **Succession and key-person risk:** Owner-operator model means institutional knowledge lives in a small number of heads. No documented processes, no digital institutional memory.
  - **DVAuction dependency:** Remote buyer channel is entirely dependent on a third-party platform. No owned digital relationship with online buyers.

## Charlotte Opportunity

- **Transformation thesis:** "Charlotte makes weekly auction dynamics observable at the layer where paper market reports are blind."

- **What becomes observable:**

### NODE Types
| Node | Description |
|------|-------------|
| Animal (Lot) | Individual lot presented at auction — species, breed, age, weight, vaccine status |
| Seller / Consignor | Person or operation consigning animals for sale |
| Buyer / Bidder | Person or operation purchasing animals (in-person or DVAuction) |
| Sale (Event) | Individual auction event — date, type (regular, specialty), category |
| Species | Cattle, Horse, Poultry, Rabbit, Exotic |
| Breed | Specific breed within species (Angus, Belgian Draft, Standardbred, etc.) |

### EDGE Types
| Edge | Description |
|------|-------------|
| consignedBy | Lot → Consignor (who brought this animal) |
| soldTo | Lot → Buyer (who bought this animal) |
| boughtAt | Buyer → Sale (which event the purchase occurred at) |
| breedOf | Animal → Breed |
| speciesOf | Animal → Species |
| vaccineVerified | Animal → Boolean (feeder calf vaccine proof status) |

### METRIC Types
| Metric | Unit | Description |
|--------|------|-------------|
| headCount | count | Number of head sold per sale event |
| saleAverage | $/head or $/cwt | Average sale price by category |
| clearanceRate | % | Percentage of consigned lots that sell |
| pricePerCWT | $/cwt | Price per hundredweight for cattle |
| attendanceBidders | count | Number of active bidders per sale (in-person + online) |
| repeatBuyerRate | % | Percentage of buyers who return within N sales |

### SIGNAL Types
| Signal | Trigger | Description |
|--------|---------|-------------|
| lotConsigned | Animal arrives at facility | Consignment intake event |
| bidPlaced | Auctioneer receives bid (ring or DVAuction) | Active bidding event |
| hammerFall | Lot sold to winning bidder | Sale completion event |
| paymentReceived | Cash/check/wire collected | Settlement event |
| marketReportFiled | Weekly USDA PDF submitted | Regulatory reporting event |

### PROTOCOL Types
| Protocol | Steps | Description |
|----------|-------|-------------|
| consignmentIntake | Receive animal, verify identity, catalog lot, assign pen | Consignment process |
| auctionSequence | Queue lot, present in ring, call bids, hammer, record sale | Core auction workflow |
| feederVaccineVerification | Check consignor vaccine proof, verify against lot, approve/reject | Feeder calf compliance |
| DVAuctionBroadcast | Start stream, sync bids with ring, merge online/in-person bidding | Remote buyer integration |
| USDAMarketReport | Compile sale data, format PDF, file with USDA | Weekly regulatory reporting |
| settlementProcess | Calculate commission, process payment (cash/check/wire), issue consignor payment | Financial settlement |

- **Estimated complexity: 2–3** (6 node types, 6 edge types, 6 metric types, 5 signal types, 6 protocol types). Single location, limited integrations (DVAuction API is the only digital source beyond manual entry). Small substrate — estimated 200–400 lines of KRF.

- **Immediate value unlocks:**
  1. **Buyer profiling from the blind side:** Even without digitizing cash transactions, Charlotte can begin building buyer/consignor profiles from USDA reports and DVAuction data, creating the first queryable history MLA has ever had.
  2. **Price trend detection:** Weekly METRIC ingestion turns static PDF reports into time-series data. Seasonal patterns, breed-specific price movements, and clearance rate trends become visible.
  3. **Specialty sale optimization:** With historical data in the graph, Charlotte can surface which specialty sales drive the highest consignor participation, the best clearance rates, and the strongest price premiums — replacing intuition with evidence.
  4. **Consignor retention signal:** Track which consignors are increasing, decreasing, or disappearing from the weekly sale. Early warning on consignor churn.
