# Charlotte Value Plan: Embedded Service Model

**Classification:** Strategic — Internal Use Only

**Prepared:** February 2026

**Model:** Managed service deployment via relationship-driven acquisition (PE firms, industry associations, adjacent operators). Not self-served. Not SaaS.

---

## I. The ISG Precedent

Industrial Service Group does not sell software to industrial facilities. ISG embeds as a service partner. The facility doesn't log into a dashboard, configure settings, or manage data. ISG's people are on-site. ISG's instruments are on the equipment. ISG's expertise interprets the signals. The client receives *operational intelligence as a service* — and the client pays for outcomes, not for access to a tool.

Charlotte operates on the same model.

Charlotte does not sell a platform. Charlotte deploys a substrate into a client's operational domain, manages the signal infrastructure, and delivers derived intelligence that the client cannot produce independently. The client never touches the graph. The client never writes a query. The client receives a mirror of their own reality — built, maintained, and interpreted by Charlotte.

This is not SaaS. This is embedded infrastructure intelligence.

---

## II. How Clients Find Charlotte

Charlotte does not market. Charlotte is found.

| Channel | Mechanism | Example |
|---------|-----------|---------|
| **Private equity** | PE firm acquires portfolio companies, needs unified operational intelligence across the portfolio | Fund acquires 12 livestock operations → needs cross-operation visibility, standardized KPIs, breeding analytics |
| **Adjacent operators** | An operator sees what Charlotte does for their neighbor, competitor, or industry peer and asks for the same | Trogdon Showpigs → other competitive breeders see the trajectories and ask "how are you doing that?" |
| **Industry associations** | Registries, trade groups, and standards bodies adopt Charlotte as member infrastructure | National Swine Registry → Charlotte becomes the intelligence layer under registry operations |
| **Service partners** | Companies like ISG that already embed in client operations deploy Charlotte as their intelligence substrate | ISG deploys Charlotte for equipment monitoring → ISG's clients receive Charlotte intelligence through ISG |
| **Domain experts** | Individuals like Paul Prier (Prier Violins) whose authority in their domain attracts others | Prier validates a provenance system → auction houses, dealers, and collectors request access |

**The common thread: every channel is relationship-driven.** No one finds Charlotte through a Google ad. They find it because someone they trust is already using it, and the results are visible.

---

## III. Unit Economics: What Charlotte Costs to Serve One Client

### 3.1 Infrastructure Cost (Per Client Per Month)

Charlotte's substrate runs on document-native cloud infrastructure (Firestore or Convex). The math below uses published pricing.

**Firestore Pricing Basis:**
- Reads: $0.06 per 100K reads
- Writes: $0.18 per 100K writes
- Storage: $0.18 per GB/month

**Per-Client Infrastructure Load (Mid-Size Operation):**

| Resource | Volume | Unit Cost | Monthly Cost |
|----------|--------|-----------|-------------|
| Nodes (stored documents) | 2,000–10,000 | — | Included in storage |
| Edges (stored documents) | 5,000–25,000 | — | Included in storage |
| Signals (append-only, growing) | +5,000–20,000/mo | — | Included in storage |
| Document storage | 2–15 GB | $0.18/GB | $0.36–$2.70 |
| Daily reads (queries, analytics) | 200K–1M/day | $0.06/100K | $3.60–$18.00 |
| Daily writes (signal ingestion) | 5K–50K/day | $0.18/100K | $2.70–$27.00 |
| **Total infrastructure per client** | | | **$7–$48/mo** |

**Shared Substrate Cost (Amortized Across All Clients):**

| Substrate Component | Documents | Storage | Monthly Cost |
|--------------------|-----------|---------|-------------|
| Temporal spine (DATE nodes, 10yr) | ~3,650 | <1 MB | ~$0.01 |
| Sub-temporal planes (DAY_OF_WEEK, MONTH, QUARTER) | ~500 | <1 MB | ~$0.01 |
| Spatial hierarchy (COUNTRY → STATE → CITY) | ~42,000 | ~5 MB | ~$0.01 |
| Industry reference nodes | ~5,000–50,000 | 1–10 MB | ~$0.01 |
| **Total substrate** | | | **<$1/mo (shared)** |

The substrate costs essentially nothing because it is built once and shared. The Nth client adds zero substrate cost.

**Convex Alternative Pricing:**

| Resource | Volume | Unit Cost | Monthly Cost |
|----------|--------|-----------|-------------|
| Function calls (queries + writes) | 500K–3M/mo | $2/1M calls | $1.00–$6.00 |
| Database storage | 2–15 GB | $0.30/GB-hr → ~$0.22/GB-mo at steady state | $0.44–$3.30 |
| **Total per client** | | | **$1.50–$9.30/mo** |

**Bottom line: Charlotte's marginal infrastructure cost per client is $7–$48/mo on Firestore, or $2–$10/mo on Convex.** Call it **$10–$50/mo** with buffer. This is the cost of running the graph.

### 3.2 Onboarding Cost (One-Time Per Client)

Onboarding is where Charlotte's human expertise delivers value. This is not a signup flow — it is an embedded deployment.

| Phase | Activity | Hours | Blended Rate | Cost |
|-------|----------|-------|-------------|------|
| **Discovery** | Domain walkthrough with operator. Understand entities, relationships, metrics, protocols, vocabulary. | 8–16 | $175/hr | $1,400–$2,800 |
| **Vocabulary Configuration** | Define NODE categories, EDGE types, METRIC definitions, PROTOCOL templates for this domain. | 12–24 | $175/hr | $2,100–$4,200 |
| **Historical Import** | Ingest existing records (registry data, sensor logs, transaction history) into the graph as nodes, edges, and backdated signals. | 16–40 | $150/hr | $2,400–$6,000 |
| **Graph Seeding** | Connect client entities to the shared substrate (spatial nodes, temporal spine). Establish cross-boundary edges where pedigrees, supply chains, or service histories cross organizational boundaries. | 8–16 | $150/hr | $1,200–$2,400 |
| **Protocol Calibration** | Build initial protocols (expected trajectories, checkpoints, drift thresholds) from historical patterns and domain expert input. | 8–20 | $175/hr | $1,400–$3,500 |
| **Validation & Handoff** | Verify graph integrity, run test traversals, demonstrate derived metrics against known values. Train client contact (1–2 people) on what reports look like — NOT on how to use the system. | 8–12 | $150/hr | $1,200–$1,800 |
| **Total Onboarding** | | **60–128 hrs** | | **$9,700–$22,700** |

**At scale within a vertical**, onboarding costs drop dramatically:

| Deployment | Onboarding Hours | Cost | Why |
|------------|-----------------|------|-----|
| First client in a domain | 100–128 hrs | $17K–$23K | Vocabulary, protocols, and import pipelines built from scratch |
| 2nd–5th client (same domain) | 50–70 hrs | $8K–$12K | Vocabulary and protocols templated; import pipelines reusable |
| 6th–20th client | 30–50 hrs | $5K–$9K | Onboarding is mostly data import + calibration |
| 20th+ client | 20–35 hrs | $3K–$6K | Turnkey deployment; custom only where the client's domain diverges |

**This is the infrastructure advantage.** The first deployment builds the vocabulary. Every subsequent deployment in the same domain reuses it. The marginal cost of the Nth client approaches the cost of data import alone.

### 3.3 Ongoing Service Cost (Per Client Per Month)

Charlotte delivers intelligence, not access. The ongoing service is where the value relationship lives.

| Service Component | Hours/Month | Blended Rate | Monthly Cost |
|-------------------|-------------|-------------|-------------|
| **Signal Quality Monitoring** — Ensure signal ingestion is clean, complete, and temporally grounded. Flag gaps, anomalies, source attribution issues. | 4–8 | $125/hr | $500–$1,000 |
| **Protocol Evaluation & Drift Alerts** — Evaluate active protocols against incoming signals. Identify entities deviating from expected trajectories. Deliver drift reports. | 4–10 | $150/hr | $600–$1,500 |
| **Derived Analytics Delivery** — Compute and deliver metrics, trajectory analyses, cross-entity comparisons, cohort reports. This is the "mirror" — what the client receives. | 6–12 | $150/hr | $900–$1,800 |
| **Account Management** — Relationship maintenance, quarterly reviews, protocol refinement based on operational feedback. | 2–4 | $175/hr | $350–$700 |
| **Graph Maintenance** — New entity onboarding (new animals, new equipment, new artifacts), edge updates (ownership transfers, service events), protocol creation for new cycles. | 4–8 | $125/hr | $500–$1,000 |
| **Total Ongoing Service** | **20–42 hrs/mo** | | **$2,850–$6,000/mo** |

### 3.4 Total Cost to Serve (Charlotte's Perspective)

| Cost Component | Year 1 | Year 2+ | Notes |
|----------------|--------|---------|-------|
| Onboarding (one-time) | $9,700–$22,700 | $0 | Amortize over client lifetime |
| Infrastructure (annual) | $84–$576 | $84–$576 | Marginal; approaches zero at scale |
| Ongoing service (annual) | $34,200–$72,000 | $34,200–$72,000 | Primary cost driver |
| **Total Year 1** | **$44,000–$95,300** | | |
| **Total Year 2+** | **$34,300–$72,600** | | |

**Charlotte's all-in cost to serve one mid-size client: ~$45K–$95K in Year 1, dropping to ~$35K–$73K annually thereafter.** Infrastructure is rounding error. The cost is people.

---

## IV. What the Client Pays: Value-Based Pricing

Charlotte does not price on cost. Charlotte prices on value captured. The question is not "what does it cost us to serve this client?" — it is "what is this intelligence worth to the client?"

### 4.1 Value Framework by Domain

#### Livestock Operations (500–2,000 Head)

| Value Source | Mechanism | Annual Value |
|-------------|-----------|-------------|
| **Breeding decision quality** | Signal trajectories reveal which pairings produce predictable outcomes. Operators currently guess. Charlotte shows. One avoided bad pairing = one litter saved from waste. | $10,000–$50,000 |
| **Show preparation optimization** | Protocol-driven growth trajectories identify animals on track vs. animals deviating before show day. Redirects conditioning effort to the right animals. | $5,000–$25,000 |
| **Pedigree integrity premium** | Signal-backed pedigrees command higher prices. A Charlotte-verified lineage with complete signal history sells for 15–30% more than an unverified claim. | $10,000–$100,000 |
| **Operational time savings** | No manual recordkeeping across 3–5 separate systems. No spreadsheet reconciliation. No phone calls to registries. | $5,000–$15,000 |
| **Loss avoidance** | Protocol drift alerts catch health deviations (weight stalls, feed intake drops, temperature anomalies) days before clinical signs. One avoided loss event. | $5,000–$30,000 |
| **Total annual value** | | **$35,000–$220,000** |

**Pricing for livestock:** **$3,000–$8,000/mo ($36K–$96K/yr)**

This represents 16–44% of quantified value at the low end, 44–100% at the high end. The sweet spot is **$5,000/mo ($60K/yr)** — roughly 27% of median value. The client pays less than a third of what they gain.

#### Industrial Equipment (ISG Model — Single Facility)

| Value Source | Mechanism | Annual Value |
|-------------|-----------|-------------|
| **Unplanned downtime avoidance** | Protocol-driven drift detection on compressor vibration, valve temperature, pump pressure signals. Charlotte detects deviation from expected trajectory weeks before failure. One avoided shutdown. | $200,000–$2,000,000 |
| **Maintenance scheduling optimization** | Replace calendar-based maintenance with signal-based maintenance. Service when the signal trajectory indicates need, not when the schedule says so. | $50,000–$200,000 |
| **Integration tax elimination** | Replaces SCADA + historian + CMMS + analytics dashboard + custom integration. Single substrate. | $100,000–$500,000 |
| **Regulatory compliance** | Complete, immutable signal history for every piece of equipment. Audit-ready at all times. | $25,000–$100,000 |
| **Insurance premium reduction** | Signal-backed maintenance records reduce risk profile. Documented drift detection = lower premiums. | $10,000–$50,000 |
| **Total annual value** | | **$385,000–$2,850,000** |

**Pricing for industrial:** **$12,000–$35,000/mo ($144K–$420K/yr)**

At median value of ~$1.6M, a $25K/mo engagement captures 19% of value. The client keeps 81%.

#### PE Portfolio (10–30 Companies)

| Value Source | Mechanism | Annual Value |
|-------------|-----------|-------------|
| **Unified operational intelligence** | Cross-portfolio visibility without each company running its own analytics stack. Same substrate, same metrics, comparable signals across all holdings. | $500,000–$2,000,000 |
| **Due diligence acceleration** | New acquisition target's data drops into the existing substrate. Immediate benchmarking against current portfolio. | $100,000–$500,000 per deal |
| **Operational benchmarking** | Identify which portfolio companies are outperforming / underperforming on signal density, protocol adherence, drift rates. Allocate operational improvement resources to the right places. | $200,000–$1,000,000 |
| **Exit valuation uplift** | Portfolio company with Charlotte-grade operational intelligence and complete signal history commands a premium at exit. Buyers trust the data. | $1,000,000–$10,000,000+ (per exit) |
| **Integration tax eliminated (portfolio-wide)** | Instead of 10–30 companies each running their own stack, one substrate serves all. | $2,000,000–$10,000,000 |
| **Total annual value** | | **$3,800,000–$23,500,000** |

**Pricing for PE portfolio:**

| Model Component | Monthly | Annual |
|-----------------|---------|--------|
| Platform retainer (substrate + shared analytics) | $25,000–$50,000 | $300,000–$600,000 |
| Per-company deployment fee | $3,000–$8,000 each | $36,000–$96,000 each |
| Portfolio of 20 companies | $85,000–$210,000 total | $1,020,000–$2,520,000 total |

At median portfolio value of ~$13M, a $1.5M annual engagement captures 12% of value. This is a bargain for a PE firm. They spend more on legal fees for a single acquisition.

### 4.2 Pricing Tiers

Charlotte offers three engagement tiers. All are managed service. None are self-served.

| Tier | Client Profile | Monthly Retainer | Onboarding Fee | What They Get |
|------|---------------|-----------------|----------------|---------------|
| **Operator** | Single operation (farm, facility, workshop) | $3,000–$8,000 | $5,000–$15,000 | Full substrate deployment, weekly analytics delivery, protocol management, drift alerts, quarterly review |
| **Enterprise** | Multi-site operation or industry association | $12,000–$35,000 | $15,000–$40,000 | Everything in Operator + cross-site intelligence, centralized protocol library, custom metric definitions, monthly strategic review |
| **Portfolio** | PE firm or holding company | $50,000–$150,000 | $30,000–$75,000 | Everything in Enterprise + portfolio-wide substrate, acquisition due diligence integration, benchmarking analytics, exit preparation reports, dedicated account team |

### 4.3 The Math — Charlotte's P&L Per Client

**Operator Tier ($5,000/mo — Midpoint):**

| Line Item | Monthly | Annual |
|-----------|---------|--------|
| Revenue | $5,000 | $60,000 |
| Infrastructure cost | ($25) | ($300) |
| Service delivery (25 hrs @ $60/hr loaded) | ($1,500) | ($18,000) |
| Account management (3 hrs @ $75/hr loaded) | ($225) | ($2,700) |
| **Gross profit** | **$3,250** | **$39,000** |
| **Gross margin** | **65%** | |

*Onboarding amortized: $10K one-time / 36 months = $278/mo → adjusted margin ~59% in Year 1, 65% in Year 2+.*

**Enterprise Tier ($25,000/mo — Midpoint):**

| Line Item | Monthly | Annual |
|-----------|---------|--------|
| Revenue | $25,000 | $300,000 |
| Infrastructure cost | ($100) | ($1,200) |
| Service delivery (60 hrs @ $65/hr loaded) | ($3,900) | ($46,800) |
| Account management (8 hrs @ $85/hr loaded) | ($680) | ($8,160) |
| Domain specialists (10 hrs @ $100/hr loaded) | ($1,000) | ($12,000) |
| **Gross profit** | **$19,320** | **$231,840** |
| **Gross margin** | **77%** | |

**Portfolio Tier ($100,000/mo — Midpoint for 20 companies):**

| Line Item | Monthly | Annual |
|-----------|---------|--------|
| Revenue | $100,000 | $1,200,000 |
| Infrastructure cost (20 clients) | ($500) | ($6,000) |
| Service delivery team (3 FTEs @ $8K/mo loaded) | ($24,000) | ($288,000) |
| Domain specialists (2 @ $10K/mo loaded) | ($20,000) | ($240,000) |
| Account director (0.5 FTE @ $14K/mo loaded) | ($7,000) | ($84,000) |
| **Gross profit** | **$48,500** | **$582,000** |
| **Gross margin** | **48.5%** | |

*Portfolio margins are lower because they require dedicated team members. But the absolute dollars are 15x an Operator client.*

---

## V. Scaling Economics — Why the Model Compounds

### 5.1 The Substrate Leverage Effect

Every new client within a domain reuses the same vocabulary, the same protocol templates, and the same shared spatiotemporal substrate. The onboarding cost curve is:

```
Client #  | Onboarding Cost | Reason
──────────┼─────────────────┼──────────────────────────────────
    1      |  $18,000        | Build vocabulary + protocols from scratch
    2      |  $12,000        | Reuse vocabulary, customize protocols
    5      |   $8,000        | Template deployment, data import only
   10      |   $5,000        | Turnkey; custom only where domain diverges
   25      |   $3,500        | Assembly line onboarding
   50+     |   $2,500        | Near-zero marginal onboarding cost
```

### 5.2 The Network Revenue Multiplier

As more clients join the same substrate, cross-client value emerges — and Charlotte captures a share of it.

| Network Size | New Revenue Source | Mechanism |
|-------------|-------------------|-----------|
| 5+ clients in same vertical | **Cross-operation benchmarking** | Anonymized signal comparisons. "Your litter sizes are in the 40th percentile vs. operations in your region." Charge a premium analytics tier. |
| 10+ clients | **Industry intelligence reports** | Aggregated signal trends, seasonal patterns, regional variations. Sell to industry associations, registries, analysts. |
| 20+ clients | **Protocol marketplace** | Proven protocols (breeding, maintenance, conditioning) derived from the best-performing operations. License to new clients. |
| 50+ clients | **Ensemble prediction** | Completed lifecycles feed prediction models. Forecast accuracy improves with every lifecycle. Premium tier for predictive analytics. |
| 100+ clients | **Platform economics** | Charlotte becomes the substrate for the industry. New entrants join because their peers, suppliers, and customers are already on it. Pricing power increases. |

### 5.3 Revenue Projection: First Vertical (Livestock)

| Year | Operator Clients | Enterprise Clients | Avg. Revenue/Client | Annual Revenue | Gross Margin |
|------|------------------|--------------------|--------------------|--------------:|-------------|
| 1 | 5 | 1 | $72,000 | $432,000 | 55% |
| 2 | 15 | 3 | $72,000 | $1,296,000 | 62% |
| 3 | 35 | 5 | $78,000 | $3,120,000 | 68% |
| 4 | 60 | 8 | $84,000 | $5,712,000 | 72% |
| 5 | 100 | 12 | $90,000 | $11,160,000 | 75% |

*Revenue/client increases as network analytics and prediction tiers are introduced.*

### 5.4 Revenue Projection: Second Vertical (Industrial / ISG Model)

| Year | Facility Clients | Enterprise Clients | Portfolio Clients | Annual Revenue | Gross Margin |
|------|------------------|--------------------|-------------------|-------------:|-------------|
| 1 | 3 | 1 | 0 | $756,000 | 60% |
| 2 | 8 | 2 | 1 | $2,616,000 | 65% |
| 3 | 15 | 4 | 2 | $5,460,000 | 70% |
| 4 | 25 | 6 | 3 | $9,060,000 | 73% |
| 5 | 40 | 10 | 5 | $16,200,000 | 76% |

### 5.5 Combined Five-Year Trajectory

| Year | Verticals Active | Total Clients | Annual Revenue | Cumulative Revenue | Gross Margin |
|------|-----------------|---------------|-------------:|-----------------:|-------------|
| 1 | 1 (livestock) | 6 | $432,000 | $432,000 | 55% |
| 2 | 2 (+industrial) | 29 | $3,912,000 | $4,344,000 | 63% |
| 3 | 3 (+provenance/cultural) | 65 | $9,580,000 | $13,924,000 | 69% |
| 4 | 3 | 107 | $16,272,000 | $30,196,000 | 72% |
| 5 | 4 (+healthcare or logistics) | 172 | $29,860,000 | $60,056,000 | 75% |

---

## VI. Why This Model Beats SaaS

| Dimension | Self-Serve SaaS | Charlotte Managed Service |
|-----------|----------------|--------------------------|
| **Client acquisition** | Marketing funnels, ad spend, freemium conversion | Word of mouth, PE relationships, industry trust networks |
| **CAC** | $500–$5,000 (SMB) to $50K–$200K (enterprise) | Near zero — referrals and relationship-driven |
| **Churn** | 5–15% monthly (SMB SaaS) | <5% annually — embedded service creates structural dependency |
| **Revenue per client** | $50–$500/mo (SMB) to $5K–$50K/mo (enterprise) | $3K–$150K/mo — value-priced, not seat-priced |
| **Gross margin** | 75–85% (software only) | 50–77% (people-intensive but value-priced) |
| **Data moat** | Weak — client can export and leave | Strong — signal history, graph structure, protocol configurations, and cross-client network intelligence are irreproducible |
| **Switching cost** | Low | Extreme — leaving means abandoning accumulated signal history and losing network intelligence |
| **Competitive defense** | Feature matching | Architecture + data + relationships. No one can replicate 3 years of signal history, 50 clients on the same substrate, and established trust with PE firms and industry associations. |
| **Scalability ceiling** | Unlimited users but low revenue/user | Limited by service capacity but high revenue/client and compounding network value |

The SaaS model optimizes for volume. The managed service model optimizes for depth. Charlotte's architecture — where value compounds with signal density and network size — rewards depth over volume.

---

## VII. The Pitch: What the Client Hears

Charlotte does not pitch technology. Charlotte pitches outcomes.

**To a livestock breeder (via ISG-style referral):**
> "You've been breeding for 20 years. You have opinions about which matings work. Charlotte has trajectories. We'll show you what your herd is actually doing — every weight curve, every breeding outcome, every growth trajectory — and compare it to the 200 operations in your registry. You don't touch a computer. We deliver a report every week. In 6 months, you'll know things about your program that 20 years of experience couldn't tell you."

**To a PE firm (via industry network):**
> "You own 15 operations across three states. Right now you're getting quarterly financials and operator-reported KPIs. You have no idea if those numbers are real. Charlotte deploys a signal layer across all 15 operations. Every metric is derived from raw observations, not from what operators type into a spreadsheet. In 90 days, you'll have the first cross-portfolio operational intelligence you've ever seen — and it's impossible to fabricate because it's built from append-only signals that the operators can't edit."

**To an industrial facility (via ISG):**
> "Your maintenance schedule is calendar-based. You replace parts on a schedule, not because they need it. Charlotte puts a signal layer on your equipment. When a compressor starts deviating from its expected vibration trajectory — three weeks before anyone notices — you get an alert. You service it during scheduled downtime instead of losing a shift. One avoided shutdown pays for Charlotte for three years."

---

## VIII. Summary: The Numbers That Matter

| Metric | Value |
|--------|-------|
| **Infrastructure cost per client** | $10–$50/mo (approaches zero at scale) |
| **Service delivery cost per client** | $2,850–$6,000/mo |
| **Client pays (Operator)** | $3,000–$8,000/mo |
| **Client pays (Enterprise)** | $12,000–$35,000/mo |
| **Client pays (Portfolio)** | $50,000–$150,000/mo |
| **Gross margin (Operator)** | 59–65% |
| **Gross margin (Enterprise)** | 72–77% |
| **Gross margin (Portfolio)** | 45–55% |
| **Client value captured** | 15–35% of quantifiable value created |
| **Onboarding cost (after 10 clients in domain)** | $3,000–$6,000 |
| **Client lifetime (expected)** | 5–10+ years (embedded service + data moat) |
| **LTV:CAC ratio** | >50:1 (near-zero CAC from referral model) |
| **Year 5 revenue (two verticals)** | $27M–$30M |
| **Year 5 gross margin** | 75% |

The math is simple. Charlotte's infrastructure costs nothing. Charlotte's value is enormous. The delta between cost-to-serve and value-delivered is where the business lives. And because the service is embedded, the signal history is irreproducible, and the network effects compound — clients don't leave.

Charlotte is not a product you sell. It is an intelligence relationship you build. And like all relationships built on trust and truth, it compounds.

---

*This document is the internal pricing and value model for Charlotte's go-to-market strategy. All figures are based on current infrastructure pricing (Firebase Firestore / Convex, February 2026), blended personnel costs at US market rates, and value estimates derived from cross-domain validation across four operational deployments.*
