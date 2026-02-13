# Monroe Livestock Auction — Software Design Document

## Architecture Overview

- **Charlotte substrate:** KRF knowledge graph (~350 nodes, ~500 edges initially, growing weekly as sale data is ingested)
- **Signal sources:** USDA market report PDFs (primary), DVAuction web data (secondary), manual ingestion from Tyler/Mel (tertiary)
- **Visualization:** Single-page dashboard (`index.html`) — D3.js force-directed graph + time series charts
- **Backend:** Charlotte OS (Python 3.12, async WebSocket)
- **Storage:** Firestore (facts collection per client, scoped to `monroe-livestock`)

### System Diagram

```
                    ┌──────────────────────────────┐
                    │        Signal Sources         │
                    ├──────────────────────────────┤
                    │  USDA Market Report PDFs      │
                    │  DVAuction Web Data            │
                    │  Manual Ingestion (Tyler/Mel)  │
                    └──────────┬───────────────────┘
                               │
                    ┌──────────▼───────────────────┐
                    │     Charlotte OS Backend      │
                    │  Python 3.12 / async WebSocket│
                    │                               │
                    │  ┌─────────────────────────┐  │
                    │  │  KRF Knowledge Graph     │  │
                    │  │  ~350 nodes, ~500 edges  │  │
                    │  │  MonroeLivestockAuctionMt │  │
                    │  └─────────────────────────┘  │
                    │                               │
                    │  Valuation Pipeline:          │
                    │  METRIC → SIGNAL → PROTOCOL   │
                    └──────────┬───────────────────┘
                               │
                    ┌──────────▼───────────────────┐
                    │       Firestore               │
                    │  /clients/monroe-livestock/    │
                    │  facts, metrics, signals       │
                    └──────────┬───────────────────┘
                               │
                    ┌──────────▼───────────────────┐
                    │    Dashboard (index.html)     │
                    │  D3.js force graph + charts   │
                    │  WebSocket real-time updates  │
                    └──────────────────────────────┘
```

---

## Domain Model

### Node Types

| Node Type | KRF Symbol | Description |
|-----------|------------|-------------|
| Company | `MonroeLivestockAuction` | The auction house itself — single facility, Monroe, IN |
| Person | `TylerBluhm`, `MelHorseCoordinator` | Named operators with defined roles |
| Sale | Weekly event instances | Individual auction events — date, type (regular/specialty), species scope |
| Lot | Individual animals | Each animal or animal group presented at ring — species, breed, weight, vaccine status |
| Seller | Consignors | Farmers, breeders, Amish operations consigning animals for sale |
| Buyer | Bidders | In-person (cash, anonymized) or DVAuction (digital trail) |
| Species | `Cattle`, `Horse`, `SmallAnimal`, `Exotic` | Top-level animal classification |
| Breed | Angus, Belgian Draft, Standardbred, etc. | Species subdivision — drives price segmentation |
| SaleCategory | `FeederCalf`, `BredStock`, `DrivingHorse`, `DraftHorse`, `Pony`, `Poultry`, etc. | Auction ring groupings — each category has distinct pricing dynamics |
| Platform | `DVAuctionPlatform` | Third-party broadcast/bidding service |

### Edge Types

| Edge | Source → Target | Description |
|------|----------------|-------------|
| `consignedBy` | Lot → Seller | Which consignor brought this animal |
| `soldTo` | Lot → Buyer | Which bidder won this lot (anonymized for cash buyers) |
| `boughtAt` | Buyer → Sale | Links buyer to the event where purchase occurred |
| `categorizedAs` | Lot → SaleCategory | Ring grouping assignment |
| `breedOf` | Lot → Breed | Breed classification of the animal |
| `speciesOf` | Lot → Species | Top-level species classification |
| `vaccineVerified` | Lot → Boolean | Proof of vaccines for feeder calf specials (1st Friday requirement) |
| `broadcastOn` | Sale → Platform | DVAuction broadcast linkage |
| `hostsSale` | Company → Sale | MLA operates this event |
| `scheduledFor` | Sale → Date | Temporal assignment for event |

### Metric Types

| Metric | Unit | Description | Source |
|--------|------|-------------|--------|
| `headCount` | count | Number of head sold per sale, per category | USDA report / manual |
| `saleAverage` | $/head | Average price per head by category | USDA report |
| `pricePerCWT` | $/cwt | Price per hundredweight for feeder calves — the benchmark metric for cattle | USDA report |
| `clearanceRate` | % | Percentage of consigned lots that actually sell — measures market health | Derived (lots sold / lots consigned) |
| `bidderAttendance` | count | Active bidders per sale — split: in-person count + DVAuction online count | Manual + DVAuction |
| `repeatBuyerRate` | % | Percentage of buyers returning within 4 weeks — loyalty signal | Derived from buyer graph |
| `onlineVsFloorRatio` | ratio | DVAuction bids vs. in-person bids — tracks digital adoption | DVAuction + manual |
| `settlementDays` | days | Time from hammer fall to consignor payout — operational efficiency | Manual |

### Signal Types

| Signal | Trigger | Description |
|--------|---------|-------------|
| `lotConsigned` | Animal arrives at facility | Consignment intake — animal enters the system |
| `saleOpened` | Tuesday 11 AM (or specialty sale time) | Auction ring goes live |
| `bidPlaced` | Auctioneer receives bid (floor or DVAuction) | Active bidding event |
| `hammerFall` | Lot closes — winning bid accepted | Sale completion for one lot |
| `paymentReceived` | Cash/check/wire collected from buyer | Settlement trigger |
| `marketReportFiled` | Weekly USDA PDF submitted | Regulatory reporting event — primary data artifact |
| `specialtySaleScheduled` | Tyler/Mel books a specialty event | Calendar event — feeder special, horse sale, exotic sale |
| `dvAuctionBroadcastStarted` | Camera goes live, stream active | Remote buyer channel opens |

### Protocol Types

| Protocol | Steps | Description |
|----------|-------|-------------|
| `consignmentIntake` | Animal arrives → lot assignment → vaccine check → pen assignment | Entry point for all animals entering the system |
| `auctionSequence` | Ring order → bidding (floor + online) → hammer → settlement | Core revenue-generating workflow |
| `feederVaccineVerification` | Consignor provides proof → verify against lot → approve/reject for 1st Friday special | Compliance gate — unverified calves cannot enter feeder specials |
| `DVAuctionBroadcast` | Camera setup → stream start → online bids relayed to ring → merge with floor bids | Remote buyer integration — expands buyer pool beyond barn |
| `USDAMarketReport` | Aggregate sale data → categorize by species/breed/weight → compute averages → file PDF | Weekly regulatory output — currently the only structured data MLA produces |
| `settlementProcess` | Calculate commission → process buyer payment (cash/check/wire) → deduct commission → pay consignor → issue receipt | Financial close — cash-heavy, manual, error-prone today |
| `horseConsignmentBooking` | Mel receives inquiry → schedule consignment → catalog in sale → confirm with consignor | Horse-specific intake — Mel is the single point of contact |

---

## Integration Points

| System | Direction | Protocol | Data Format | Frequency |
|--------|-----------|----------|-------------|-----------|
| USDA Market Report PDFs | Inbound | HTTP download / manual upload | PDF → OCR → structured JSON → KRF | Weekly (every Tuesday post-sale) |
| DVAuction | Inbound | Web scrape (no public API) | HTML → parsed lots/results → KRF | Weekly (sale day broadcast data) |
| Monroe website (upcoming sales) | Inbound | Web scrape | HTML → specialty sale calendar → KRF | Monthly (schedule updates) |
| Manual ingestion (Tyler) | Inbound | Email / meeting notes | Paper scans → Claude-assisted KRF generation | Biweekly (ingestion meetings) |
| Charlotte Dashboard | Outbound | WebSocket | KRF facts → D3.js visualization | Real-time (on fact write) |
| Firestore | Bidirectional | Firebase SDK | JSON documents | Continuous |

### Integration Detail: USDA Market Report Pipeline

This is the primary automated data source. The pipeline:

```
USDA PDF (weekly)
    │
    ▼
Download (HTTP from USDA AMS website or manual upload)
    │
    ▼
OCR extraction (Python: pdfplumber / pytesseract)
    │
    ▼
Structured JSON (headCount, pricePerCWT, saleAverage by category)
    │
    ▼
KRF fact generation (Claude-assisted mapping to Charlotte primitives)
    │
    ▼
Firestore write → WebSocket push → Dashboard update
```

### Integration Detail: DVAuction Data

DVAuction does not provide a public API. Data extraction is via:

1. **Broadcast page scrape:** Lot listings, descriptions, starting bids
2. **Results page scrape:** Hammer prices, online bid counts
3. **Cross-reference:** Match DVAuction lot data to USDA report categories

This integration is secondary and arrives in Phase 3. Phase 1-2 relies on USDA reports and manual ingestion.

---

## Deployment

### Phase 1 — Manual Ingestion (Weeks 1-4)

- Charlotte substrate (`substrate.krf`) validated and loaded into Firestore
- USDA market report PDFs scraped manually — Claude-assisted KRF generation from each weekly report
- Tyler provides consignment and settlement data in biweekly meetings
- Dashboard (`index.html`) deployed with initial static graph + first 4 weeks of time series data
- **Milestone:** First weekly sale fully represented as KRF facts in the graph

### Phase 2 — Semi-Automated Pipeline (Weeks 5-8)

- Scheduled USDA PDF download (Python cron job, weekly)
- Automated OCR pipeline: PDF → JSON → KRF (human-in-the-loop for validation)
- Dashboard live with weekly auto-updates after each Tuesday sale
- First before/after Charlotte report delivered to Tyler
- **Milestone:** Tyler can open dashboard on Wednesday morning and see Tuesday's sale results visualized

### Phase 3 — DVAuction Correlation (Months 3-6)

- DVAuction web scraping active — lot-level data extraction from broadcast/results pages
- Online vs. floor bid ratio tracked per sale
- Consignor and buyer pattern tracking active (repeat rates, volume trends)
- Settlement automation prototype (structured payout reports generated from KRF)
- **Milestone:** Consignor leaderboard and buyer heat map populated with 12+ weeks of data

### Phase 4 — Predictive Analytics (Months 7-12)

- Predictive price modeling: seasonal CWT trends, breed-specific demand curves
- Competitive benchmarking: cross-reference Topeka and Shipshewana USDA reports with MLA data
- Seasonal demand modeling: which specialty sales should expand, contract, or shift dates
- Anomaly detection: sudden drops in consignor volume, unusual clearance rates, settlement delays
- **Milestone:** Charlotte generates actionable specialty sale scheduling recommendations backed by data

---

## Security

### Authentication

- **Method:** Firebase Auth (email/password)
- **Initial users:** Tyler Bluhm and Mel only (2 accounts)
- **Expansion:** Additional staff accounts as needed — no self-registration

### Authorization

- **Model:** Organization-scoped, role-based access control (RBAC)
- **Roles:**
  - `admin` — Full read/write access to all facts, metrics, signals. Can add users. Tyler.
  - `viewer` — Read-only dashboard access. Mel (initially). Expandable to ring crew if needed.

### Data Isolation

- **Firestore path:** `/clients/monroe-livestock/` — separate subcollection, no cross-client data leakage
- **KRF microtheory:** `MonroeLivestockAuctionMt` — logically scoped within Charlotte OS
- **No shared indices** with other Charlotte client instances

### Encryption

- **At rest:** Firestore default encryption (Google-managed keys)
- **In transit:** TLS for all connections (Firestore SDK, WebSocket, dashboard HTTPS)

### PII Handling

- **Amish buyer anonymization:** Cash buyers have no digital identity by default. Charlotte tracks patterns (repeat attendance, volume trends, category preferences) but does not attempt to identify individuals. The graph models buyer *behavior*, not buyer *identity*.
- **Consignor data:** Named consignors are stored only when voluntarily provided through consignment intake. No external data enrichment.
- **No buyer-facing interfaces.** All data capture is barn-side/operator-side only. Buyers never interact with Charlotte directly.
- **DVAuction handles:** Online bidder usernames are stored as opaque identifiers for pattern tracking. No PII enrichment beyond what DVAuction exposes publicly.

### Compliance

- **USDA data:** Market report data is public domain once filed. No restrictions on storage or analysis.
- **No HIPAA / PCI scope:** MLA does not process health data or credit card data through Charlotte. Cash and check settlement stays in MLA's existing accounting flow.

---

## Dashboard Design

**Dashboard type:** Agriculture — adapted from the playbook pattern ("Herd/flock cards + genetic lineage + health metrics") to auction context.

### Layout

```
┌──────────────────────────────────────────────────────────┐
│  Monroe Livestock Auction — Charlotte Dashboard          │
│  Last sale: {date} | Next sale: {date} | {node count}    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────┐  ┌────────────────────────────┐ │
│  │  Weekly Sale Results │  │  Price Trends (CWT)        │ │
│  │  (bar chart)         │  │  (line chart, by category) │ │
│  │  Head count by       │  │  12-week rolling window    │ │
│  │  species/category    │  │                            │ │
│  └─────────────────────┘  └────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────┐  ┌────────────────────────────┐ │
│  │  Clearance Rate      │  │  Specialty Sale Calendar   │ │
│  │  (gauge / radial)    │  │  (timeline view)           │ │
│  │  % lots sold this    │  │  Upcoming events with      │ │
│  │  week vs. last 4     │  │  historical comparison     │ │
│  └─────────────────────┘  └────────────────────────────┘ │
│                                                          │
│  ┌─────────────────────┐  ┌────────────────────────────┐ │
│  │  Consignor           │  │  Buyer Heat Map            │ │
│  │  Leaderboard         │  │  (geographic)              │ │
│  │  Top consignors by   │  │  DVAuction online bidder   │ │
│  │  volume (anonymized  │  │  distribution — shows      │ │
│  │  if needed)          │  │  reach beyond Adams County │ │
│  └─────────────────────┘  └────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Knowledge Graph (D3.js force-directed)              │ │
│  │  Filterable by node type: Sale, Lot, Seller, Buyer,  │ │
│  │  Species, Breed, Category                            │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Widget Specifications

| Widget | Chart Type | Data Source | Update Frequency |
|--------|-----------|-------------|------------------|
| Weekly Sale Results | Stacked bar chart | USDA report + manual | Weekly |
| Price Trends (CWT) | Multi-line chart (one line per category) | USDA report | Weekly |
| Clearance Rate | Radial gauge with 4-week trailing average | Derived metric | Weekly |
| Specialty Sale Calendar | Horizontal timeline with event markers | `substrate.krf` schedule + manual | Monthly |
| Consignor Leaderboard | Ranked table (top 10 by volume) | Manual ingestion + USDA | Weekly |
| Buyer Heat Map | Choropleth or pin map (US states/counties) | DVAuction bidder data | Phase 3+ |
| Knowledge Graph | D3.js force-directed, interactive | Full KRF substrate | Real-time |

### Technology Stack

- **D3.js** (v7) — all charts and force graph
- **Dark theme** — matching brand book palette (earth green, warm brown, gold on dark background)
- **No framework** — vanilla HTML/CSS/JS, single `index.html` file
- **WebSocket** — live updates from Charlotte OS backend on fact writes
- **Responsive** — works on Tyler's laptop and phone (barn-side use case)
