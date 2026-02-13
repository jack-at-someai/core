# Monroe Livestock Auction — Charlotte Deployment PRD

## Overview
- **Client:** Monroe Livestock Auction (MLA)
- **Location:** 1871 E 200 S, Monroe, IN 46772 (Adams County)
- **Deployment Tier:** Foundation ($2,500/mo)
- **Migration Path:** C — Pilot POC
- **Timeline:** 8 weeks (Foundation deployment), then 24-month Operations engagement
- **Objective:** Make weekly auction dynamics observable at the layer where paper market reports are blind

---

## User Personas

| Persona | Role | Needs | Charlotte Touch Points |
|---------|------|-------|----------------------|
| **Tyler Bluhm** | Operations Manager / Primary Contact (260-849-2635) | Sale day overview, settlement reporting, consignor communication, vaccine verification tracking | Admin dashboard (full access), weekly price trend views, settlement reconciliation reports, consignor performance cards, vaccine compliance log |
| **Mel** | Horse Consignment Coordinator (260-301-1793) | Horse consignment pipeline, specialty sale calendar, consignor history | Viewer dashboard (horse-filtered), specialty sale analytics, consignor history lookup, calendar-driven demand views |
| **Remote Bidders** | Anonymous online buyers via DVAuction | Lot information, bidding interface (handled by DVAuction) | No direct Charlotte touch point — DVAuction remains the buyer interface. Charlotte observes DVAuction data from the barn side for online-vs-floor analytics |
| **Consignors / Sellers** | Local farmers, Amish breeders | Settlement statements, price history, market comparisons | Quarterly consignor reports (printed/mailed — no digital delivery assumed), price benchmarking against regional averages |
| **Amish Buyers** | In-person, cash, no technology | None — no tech touchpoints | **CRITICAL: No buyer-facing technology.** Charlotte observes their patterns from the barn side only (lot outcomes, repeat purchase patterns inferred from ring data, species/breed demand signals). All intelligence is gathered without requiring any behavioral change from Amish participants |

---

## Functional Requirements

### Phase 1 — Foundation (Weeks 1-8)

- [x] Charlotte substrate created and validated (substrate.krf — 347 lines, complete)
- [ ] Historical data ingestion: scrape/OCR last 12 months of USDA market report PDFs from ams.usda.gov
- [ ] Structure USDA data into Charlotte graph: prices by species/category, head counts, weight ranges, weekly time series
- [ ] Build initial knowledge graph from market reports (map to NODE: Animal, Sale, Species, SaleCategory; METRIC: headCount, saleAverage, pricePerCWT)
- [ ] Dashboard deployed (index.html) showing weekly price trends by species and sale category
- [ ] Monthly ingestion meeting cadence established with Tyler Bluhm
- [ ] First quarterly before/after report template prepared (baseline = pre-Charlotte state)

**Data ingestion scope (Phase 1):**
- 52 weeks of USDA market report PDFs (Feb 2025 - Feb 2026)
- Specialty sale calendar (2026 schedule from website)
- Initial consignor list from Tyler (manual handoff at first meeting)

### Phase 2 — Operations (Months 3-6)

- [ ] DVAuction data correlation: manual or semi-automated capture of lot counts, online bid rates, online-vs-floor sale ratios per weekly sale
- [ ] Consignor tracking: who is bringing what species/breed, how often, what prices they achieve, consignor lifetime value
- [ ] Buyer pattern identification: repeat buyers by species, anonymized for Amish cash buyers (barn-side observation only — no buyer-facing tech)
- [ ] Automated USDA market report generation from Charlotte data (replace manual PDF compilation — save 4-6 hours/week)
- [ ] Specialty sale performance analytics: driving horses vs draft horses vs ponies vs exotics — revenue per head, clearance rate, buyer attendance by sale type
- [ ] Settlement reconciliation dashboard: digital tracking of commission calculations, consignor payouts, cash/check/wire split
- [ ] First before/after Charlotte report delivered to Tyler

### Phase 3 — Intelligence (Months 7-12)

- [ ] Seasonal demand prediction: which months have highest feeder calf volume, which specialty sales peak, breed-specific demand curves
- [ ] Competitive price benchmarking: Monroe vs Topeka vs Shipshewana — automated from USDA reports, per species, per weight class, per sale type
- [ ] Consignor optimization: suggest best sale dates based on historical price patterns (e.g., "feeder calves average 8% higher in October")
- [ ] Buyer retention monitoring: flag regular buyers who stop attending (anonymized for Amish — pattern-based, not identity-based)
- [ ] Cross-auction intelligence: if Sounder/SC Online Sales are also Charlotte clients, buyer graph connects across auctions — shared demand signals without exposing individual buyer identity
- [ ] Vaccine verification analytics: compliance rates over time, correlation between vaccine status and price premium
- [ ] ROI measurement against baseline — target $30K/year in combined savings and revenue enablement

---

## Data Sources

| Source | Type | Frequency | Integration Method | Charlotte Primitives Fed |
|--------|------|-----------|-------------------|------------------------|
| **USDA Market Reports** | Structured PDF (categories, head counts, weight ranges, prices) | Weekly (after each Tuesday sale) | Manual download or scrape from ams.usda.gov; OCR/parse into structured data | METRIC: headCount, saleAverage, pricePerCWT; NODE: Sale, SaleCategory |
| **DVAuction** | Semi-structured (lot listings, online bid counts, sale results) | Real-time during sales | No public API — manual capture or screen scrape. Possible future API partnership | METRIC: onlineVsFloorRatio, bidderAttendance; SIGNAL: bidPlaced, hammerFall |
| **Manual Ingestion (Tyler)** | Unstructured (consignment lists, settlement sheets, vaccine records) | Monthly meetings + ad-hoc email | Paper/scanned docs initially; Claude-assisted KRF generation during ingestion meetings | NODE: Animal, Consignor; EDGE: consignedBy, vaccineVerified; SIGNAL: lotConsigned, paymentReceived |
| **Specialty Sale Calendar** | Structured (dates, sale types) | Semi-annual update | Published on website; manual entry into Charlotte | NODE: Sale; EDGE: saleCategory |
| **Facebook Page** | Unstructured (engagement metrics, announcements) | Ongoing | Manual observation; low priority — community signal only | Not directly mapped to primitives; contextual enrichment |

---

## Charlotte Primitives — Domain Mapping

### NODEs (What Exists)
| Node Type | Description | Source |
|-----------|-------------|--------|
| Animal (Lot) | Individual lot presented at auction — species, breed, age, weight, vaccine status | Manual ingestion, USDA reports |
| Seller / Consignor | Person or operation consigning animals for sale | Manual ingestion |
| Buyer / Bidder | Person or operation purchasing (in-person or DVAuction) | DVAuction data, barn-side observation |
| Sale (Event) | Individual auction event — date, type (regular, specialty), category | USDA reports, calendar |
| Species | Cattle, Horse, Poultry, Rabbit, Exotic | Substrate definition |
| Breed | Specific breed within species (Angus, Belgian Draft, Standardbred, etc.) | Manual ingestion |
| SaleCategory | Feeder, bred stock, cow-calf, driving horse, draft horse, pony, small animal, exotic | USDA reports, substrate |

### EDGEs (How Things Connect)
| Edge Type | Relationship | Source |
|-----------|-------------|--------|
| consignedBy | Lot -> Consignor | Manual ingestion |
| soldTo | Lot -> Buyer | DVAuction, barn-side observation |
| boughtAt | Buyer -> Sale | DVAuction, barn-side observation |
| breedOf | Animal -> Breed | Manual ingestion |
| speciesOf | Animal -> Species | USDA reports, manual ingestion |
| vaccineVerified | Animal -> Boolean | Tyler (vaccine records) |
| broadcastOn | Sale -> DVAuction | DVAuction |

### METRICs (What We Measure)
| Metric | Unit | Description |
|--------|------|-------------|
| headCount | count | Number of head sold per sale event |
| saleAverage | $/head or $/cwt | Average sale price by category |
| clearanceRate | % | Percentage of consigned lots that sell |
| pricePerCWT | $/cwt | Price per hundredweight for cattle |
| bidderAttendance | count | Number of active bidders per sale (in-person + online) |
| repeatBuyerRate | % | Percentage of buyers who return within N sales |
| onlineVsFloorRatio | ratio | DVAuction online bids vs in-person floor bids |

### SIGNALs (What Happens)
| Signal | Trigger | Description |
|--------|---------|-------------|
| lotConsigned | Animal arrives at facility | Consignment intake event |
| bidPlaced | Auctioneer receives bid (ring or DVAuction) | Active bidding event |
| hammerFall | Lot sold to winning bidder | Sale completion event |
| paymentReceived | Cash/check/wire collected | Settlement event |
| marketReportFiled | Weekly USDA PDF submitted | Regulatory reporting event |

### PROTOCOLs (How Things Should Work)
| Protocol | Steps | Description |
|----------|-------|-------------|
| consignmentIntake | Receive animal, verify identity, catalog lot, assign pen | Consignment process |
| auctionSequence | Queue lot, present in ring, call bids, hammer, record sale | Core auction workflow |
| feederVaccineVerification | Check consignor vaccine proof, verify against lot, approve/reject | Feeder calf compliance |
| DVAuctionBroadcast | Start stream, sync bids with ring, merge online/in-person bidding | Remote buyer integration |
| USDAMarketReport | Compile sale data, format PDF, file with USDA | Weekly regulatory reporting |
| settlementProcess | Calculate commission, process payment (cash/check/wire), issue consignor payment | Financial settlement |

---

## Success Metrics

| Timeframe | Target | Measurement |
|-----------|--------|-------------|
| **Baseline (Today)** | 0 digital records, 52 manual USDA PDF reports/year, no buyer analytics, no consignor profiling, no price trend visibility, settlement via paper/cash only | Data maturity score: 1 |
| **6-Month** | 52 weeks of historical market data structured in Charlotte graph; price trend dashboard live and updated weekly; settlement reconciliation time reduced 50%; consignor profiles seeded for top 20 consignors; first competitive benchmark report (Monroe vs Topeka vs Shipshewana) | Data maturity score: 2 |
| **12-Month** | Buyer pattern reports automated (anonymized for Amish); seasonal demand predictions active for feeder calves and horse categories; competitive benchmarking dashboard live; USDA report generation automated from Charlotte data; specialty sale ROI analytics informing 2027 calendar | Data maturity score: 3 |
| **ROI Threshold** | $30K/year in combined savings and revenue improvement = break-even on $2,500/mo Foundation tier | Measured via: reporting labor savings ($4,200-$7,800/yr), pricing intelligence uplift (3% on $1M throughput = $30K), buyer retention protection ($10K-$50K), settlement error reduction |

---

## Non-Functional Requirements

| Requirement | Specification |
|-------------|---------------|
| **Data Residency** | United States |
| **Uptime SLA** | 99.5% |
| **Access Control** | Role-based: Admin (Tyler Bluhm — full access), Viewer (consignors — filtered to own data, quarterly reports only) |
| **Backup** | Daily snapshots |
| **Amish Buyer Constraint** | **CRITICAL:** No buyer-facing technology for Amish buyers. All intelligence gathered from barn-side observation only. Charlotte sits at the barn level, not the buyer level. No behavioral change required from any auction participant. |
| **Data Privacy** | Buyer identities anonymized in all analytics. Amish cash buyers represented as patterns (species preference, frequency, spend range) — never as named individuals |
| **Delivery Format** | Dashboard via web (index.html). Consignor reports printed/mailed where needed (Amish consignors have no email). Tyler receives digital access |
| **Integration Constraints** | DVAuction has no public API — all DVAuction data integration is manual or semi-automated until/unless API access is negotiated |
| **Ingestion Cadence** | Monthly in-person meetings with Tyler (primary data capture). Weekly automated USDA report ingestion once pipeline is established |

---

## Contract Reference

- **Contract 1 — Deployment & Migration:** $7,500 (50% upfront / 50% on completion). 8-week timeline. Covers substrate creation, historical USDA data ingestion, dashboard deployment, first ingestion meeting.
- **Contract 2 — Ongoing Service:** $2,500/mo, 24-month commitment. Monthly ingestion meetings, quarterly before/after reports, dashboard updates, support.
- **Total 2-Year Value:** $67,500
- **Migration Path:** C — Pilot POC (single location, manual ingestion, low integration complexity)
