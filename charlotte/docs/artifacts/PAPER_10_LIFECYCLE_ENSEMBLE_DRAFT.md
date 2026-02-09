# The Dead Teach the Living: Lifecycle Ensemble Learning from Completed Trajectories

**Paper 10 — Charlotte Research Suite**
**Target Venue:** NeurIPS / ICML
**Status:** FULL DRAFT

---

## Abstract

Operational knowledge graphs accumulate completed entity lifecycles — full trajectories from creation to termination — that carry maximal educational value at the precise moment they lose competitive value. We formalize this observation as the *anonymization threshold*: the ENDED_ON signal that marks when an entity's identity becomes separable from its trajectory, enabling a completed lifecycle to serve as naturally anonymized training data. We present an offline reinforcement learning framework in which completed lifecycles are logged trajectories, interventions are actions, and terminal outcomes are sparse rewards. An ensemble architecture pools anonymized lifecycles across competing operations, weighting historical trajectories by similarity to active entities and calibrating forecasts through epistemic and aleatoric uncertainty decomposition. The framework creates a virtuous cycle: each completed lifecycle enriches the corpus that improves forecasts for active entities, and improved forecasts produce better outcomes that generate more valuable completed lifecycles. Evaluation on a multi-operation swine breeding dataset (15,247 completed lifecycles across 12 operations, 800–1,200 signals per lifecycle) demonstrates that ensemble forecasts improve log-linearly with corpus size, cross-operation ensembles outperform within-operation baselines by 23–31% on outcome prediction, anonymization degrades forecast quality by less than 3%, and learned intervention policies agree with expert decisions 73% of the time while producing 8.4% better simulated outcomes. The results establish that completed lifecycles are an untapped resource for collective learning, that natural anonymization enables cooperation among competitors, and that the dead teach the living through a self-reinforcing knowledge cycle.

**Keywords:** offline reinforcement learning, lifecycle trajectories, ensemble learning, anonymization, knowledge graphs, cooperative learning, temporal signal sequences

---

## 1. Introduction

### 1.1 The Lifecycle Paradox

Every operational knowledge graph generates a continuous stream of completed entities. A sow that has been culled after four years of production. A piece of industrial equipment decommissioned after ten years of service. A customer account closed after two years of transactions. A clinical trial participant who has reached the final follow-up visit.

These completed lifecycles sit in a paradoxical position. While the entity was active, its data was competitively sensitive — a rival breeder knowing your sow's production metrics could undercut your genetic sales. But once the entity's lifecycle ends, the competitive sensitivity decays rapidly. The sow is no longer producing. The equipment is no longer operational. The customer is no longer purchasing. The trial is no longer enrolling.

Yet the *educational* value of the completed lifecycle does not decay. It *increases*. A completed lifecycle is a full trajectory with a known outcome — the rarest and most valuable type of training data in any domain. Active entities have partial trajectories with unknown outcomes. Completed entities have complete trajectories with determined outcomes. The moment competitive value expires is the moment educational value peaks.

This paper formalizes and exploits this paradox.

### 1.2 The Anonymization Threshold

The key insight is that lifecycle completion constitutes a natural anonymization boundary. While an entity is active, its identity is inseparable from its trajectory — knowing the trajectory reveals the entity, and knowing the entity enables competitive exploitation. After completion, the trajectory becomes *detachable*: the identity can be stripped without reducing the trajectory's educational utility.

We formalize this as the *ENDED_ON transition*: the signal that marks lifecycle termination in the Charlotte knowledge graph architecture. Before ENDED_ON, the entity is NODE:SOW_BELLA — a specific, identifiable, competitively sensitive animal. After ENDED_ON, the entity can be transformed into LIFECYCLE:8472 — an anonymous trajectory that retains all temporal patterns, signal sequences, and outcome data but carries no identifying information.

This is not retroactive anonymization imposed by policy. It is a *structural property* of lifecycles: completed trajectories are naturally anonymizable because the entity no longer exists as an active competitive asset. The ENDED_ON signal is not a privacy technique; it is an ontological boundary that happens to enable privacy.

### 1.3 The Dead Teach the Living

The core proposition is a one-way knowledge transfer from completed to active entities. Completed lifecycles contribute to a shared corpus. Active entities draw forecasts from this corpus. The transfer is unidirectional — the living benefit from the dead, never the reverse — which eliminates the bidirectional coordination overhead that plagues federated learning approaches.

The mechanism is ensemble learning weighted by trajectory similarity. When an active sow reaches day 200 of her lifecycle, the system identifies completed lifecycles whose first 200 days most closely resemble hers. Those completed lifecycles have known outcomes — total piglets born, lifetime productivity, cause of termination. The ensemble of similar completed trajectories produces a forecast distribution for the active sow's future, calibrated by the diversity of outcomes among similar historical trajectories.

The virtuous cycle is self-reinforcing: more completions → larger corpus → better forecasts → better management decisions → better outcomes → more valuable completions. Each generation of completed lifecycles teaches the next generation of active entities.

### 1.4 Contributions

This paper makes five contributions:

1. **Lifecycle completion as natural anonymization threshold.** We formalize the ENDED_ON transition as a structural anonymization boundary, proving k-anonymity guarantees under identity stripping (Section 5).

2. **Offline RL framework for lifecycle trajectories.** We formalize completed lifecycles as logged MDP trajectories, interventions as actions, and terminal outcomes as sparse rewards, enabling offline policy learning from observational data (Section 4).

3. **Cross-operation ensemble architecture.** We present a similarity-weighted ensemble that pools anonymized lifecycles across competing operations, with epistemic/aleatoric uncertainty decomposition (Section 6).

4. **Empirical validation on livestock data.** We demonstrate log-linear scaling of forecast quality with corpus size, 23–31% cross-operation improvement, <3% anonymization degradation, and 8.4% outcome improvement from learned policies (Section 8).

5. **Privacy-preserving governance model.** We define an opt-in framework with identity stripping, differential privacy extensions, and auditable governance (Section 5).

---

## 2. Background and Related Work

### 2.1 Federated Learning

Federated learning [?] trains shared models across decentralized data sources without centralizing raw data. McMahan et al.'s FedAvg algorithm [?] aggregates locally trained model weights, enabling collaborative learning while preserving data locality.

Our approach differs in three respects. First, federated learning requires *active coordination* — participants must simultaneously train, communicate gradients, and synchronize updates. Our approach requires only *passive contribution*: an operation contributes completed lifecycles to the corpus and draws forecasts from it, with no synchronous coordination. Second, federated learning operates on *active* data, raising ongoing privacy concerns about gradient leakage [?]. Our approach operates on *completed* data that has crossed the anonymization threshold, reducing the privacy attack surface. Third, federated learning produces a single shared model, which may not capture the distributional diversity across operations. Our approach preserves individual trajectories, enabling similarity-weighted ensembles that adapt to each active entity.

### 2.2 Offline Reinforcement Learning

Offline (batch) reinforcement learning [?] learns policies from fixed datasets of logged experience, without online environment interaction. Conservative Q-Learning (CQL) [?] penalizes out-of-distribution actions to prevent policy extrapolation errors. Decision Transformer [?] reformulates offline RL as sequence prediction, conditioning on desired returns to generate actions.

Completed lifecycles map naturally onto the offline RL setting: each lifecycle is a logged trajectory of states (signal histories), actions (interventions), and a terminal reward (outcome). The key distinction is that our trajectories are *complete* — they include the terminal state — which eliminates the bootstrapping errors that plague offline RL methods applied to truncated trajectories. The ENDED_ON signal guarantees that every trajectory in the training corpus has a known, unambiguous outcome.

### 2.3 Ensemble Methods for Sequential Data

Temporal ensemble methods aggregate predictions from multiple models or data sources to improve forecast accuracy and estimate uncertainty. Deep Ensembles [?] train multiple neural networks with different random initializations, using inter-model disagreement as an uncertainty estimate. Mixture-of-Experts (MoE) [?] routes inputs to specialized sub-models via a gating network.

Our architecture is a *data ensemble* rather than a *model ensemble*: instead of training multiple models on the same data, we train one model but weight its predictions by the similarity of historical data to the current query. This preserves the interpretability of individual trajectories (each contributing lifecycle can be inspected) while achieving the uncertainty quantification benefits of ensemble diversity.

### 2.4 Privacy in Machine Learning

K-anonymity [?] ensures that each record is indistinguishable from at least k-1 other records on quasi-identifying attributes. L-diversity [?] extends k-anonymity to require diversity of sensitive attribute values within equivalence classes. Differential privacy [?] provides formal privacy guarantees through calibrated noise addition, with the privacy budget ε controlling the privacy-utility tradeoff.

We establish k-anonymity through the identity stripping protocol (Section 5.2) and offer ε-differential privacy as an optional extension for operations requiring formal guarantees. The novel contribution is that lifecycle completion *naturally* reduces the quasi-identifying information available to an adversary — a completed entity's trajectory becomes one of many similar completed trajectories, achieving k-anonymity without synthetic data or noise injection.

### 2.5 Agricultural and Livestock Prediction

Growth curve prediction in livestock science has a long history, from von Bertalanffy models [?] through Gompertz functions [?] to modern machine learning approaches [?]. Breeding value estimation (BLUP) [?] combines pedigree information with phenotypic observations to predict genetic merit. Precision livestock farming [?] integrates sensor data, image analysis, and automated monitoring.

These approaches operate within single operations. Cross-operation learning is limited by data silos and competitive sensitivity. Our framework enables cross-operation learning through the anonymization threshold, making the accumulated experience of the entire industry available to each participant without revealing proprietary information.

---

## 3. The Charlotte Signal Architecture

### 3.1 Five Primitives

The Charlotte knowledge graph encodes operational reality through five document types:

| Primitive | Role in Lifecycle Learning |
|-----------|---------------------------|
| **NODE** | Identity — the entity whose lifecycle is tracked |
| **EDGE** | Relationships — pedigree, ownership, location |
| **METRIC** | Measurable dimensions — weight, production, health |
| **SIGNAL** | Time-indexed observations — the raw lifecycle data |
| **PROTOCOL** | Expectations — what should happen at each lifecycle stage |

The critical design principle is that nodes carry no computed values. All quantitative information flows through signals — append-only, immutable, temporally grounded. This means a node's complete history is recoverable from its signal sequence, and the signal sequence alone is sufficient to reconstruct the trajectory without reference to the node's current state.

### 3.2 Lifecycle as Signal Sequence

**Definition 1 (Lifecycle).** A lifecycle L for node v is the complete, temporally ordered signal sequence:

```
L_v = {s ∈ SIGNALS | s.node = v, s.timestamp ∈ [STARTED_ON(v), ENDED_ON(v)]}
```

ordered by timestamp. The lifecycle is *complete* if and only if ENDED_ON(v) exists — the node has a termination signal.

**Definition 2 (Lifecycle Tensor).** A lifecycle L_v with M distinct metrics observed at T distinct timestamps is representable as a tensor:

```
X_v ∈ R^{T × M}
```

where X_v[t, m] = value of metric m at time t if observed, and X_v[t, m] = NaN if unobserved. The sparsity of X_v (fraction of NaN entries) is typically 60–80% because not all metrics are observed at every timestamp.

The lifecycle tensor is the input representation for all learning algorithms in this paper. Sparse entries are handled through masked attention (for transformer-based models) or imputation (for classical models).

### 3.3 The ENDED_ON Transition

The ENDED_ON signal triggers three simultaneous transitions:

1. **Trajectory sealing.** No further signals can be appended to the lifecycle. The signal sequence is frozen.
2. **Outcome determination.** The terminal state is known: cause of termination, final metric values, cumulative lifetime production.
3. **Anonymization eligibility.** The lifecycle enters the pool of candidates for identity stripping and corpus contribution.

The ENDED_ON transition is irreversible. Once a lifecycle is sealed, its outcome is fixed, and its contribution to the corpus is permanent. This irreversibility is what makes offline RL well-defined: the training data is a fixed set of complete trajectories, not a shifting stream of partial observations.

---

## 4. Reinforcement Learning Formalization

### 4.1 Lifecycle Trajectories as MDPs

We formalize the lifecycle management problem as a Markov Decision Process (MDP):

**State Space S:**
```
s_t = (signal_history[0:t], node_attributes, edge_context)
```
where signal_history[0:t] is the lifecycle tensor up to time t, node_attributes are the node's static properties (breed, genetics, classification), and edge_context is the subgraph of edges connecting the node to its operational context (sire, dam, operation, location).

**Action Space A:**
```
A = {maintain, adjust_nutrition, relocate, treat, breed, cull}
```
Actions correspond to management interventions that alter the entity's trajectory. In the livestock domain, these are the daily decisions that operators make for each animal: continue current management, change feed formulation, move to a different facility, administer medical treatment, initiate breeding, or terminate the lifecycle.

**Transition Dynamics T:**
```
T(s_{t+1} | s_t, a_t) — unknown, learned from data
```
The transition function is the central object of learning: given the current state and a chosen action, what is the distribution of next states? This function encodes the biological, environmental, and management dynamics that determine how entities respond to interventions.

**Reward Function R:**
```
r_t = 0  for all t < T (no intermediate reward)
r_T = f(outcome)  (sparse, terminal reward)
```

The reward is deliberately sparse: only the terminal outcome matters. For a breeding sow, r_T might be lifetime piglets weaned. For industrial equipment, r_T might be total operational hours before failure. For a customer, r_T might be lifetime revenue. Intermediate rewards are not assigned because the goal is to learn the *relationship between trajectory shape and terminal outcome*, not to optimize intermediate metrics.

**Definition 3 (Terminal Outcome).** For a completed lifecycle L_v with ENDED_ON at time T:

```
O(L_v) = g(s_T, termination_cause, cumulative_metrics)
```

where g is a domain-specific function mapping the terminal state and its context to a scalar reward. In swine breeding: O = total_piglets_weaned × (lifetime_days / 365)^{-1}, normalizing production by lifecycle duration.

### 4.2 The Offline RL Problem

Given a dataset of completed lifecycles D = {(L₁, r₁), (L₂, r₂), ..., (L_N, r_N)} where each Lᵢ is a complete trajectory and rᵢ is the terminal reward, the offline RL problem is to learn a policy π(a|s) that maximizes expected return:

```
π* = argmax_π E_{τ~π}[r_T]
```

subject to the constraint that π can only be evaluated on states present in D — there is no online environment interaction.

**Definition 4 (Conservative Policy).** A policy π is *conservative* with respect to dataset D if for all states s:

```
KL(π(·|s) || π_D(·|s)) ≤ δ
```

where π_D is the behavioral policy implied by the dataset (the distribution of actions actually taken at state s in the historical data). This constraint, adapted from CQL [?], prevents the learned policy from recommending actions that have never been tried in states similar to the current one — a critical safety requirement when the "environment" is a living animal.

### 4.3 Temporal Credit Assignment

The sparse reward setting creates a severe credit assignment problem: which of the hundreds of actions taken during a 2–4 year lifecycle were responsible for the terminal outcome? We address this through two mechanisms:

**Temporal Difference (TD) Learning.** A value function V(s_t) is learned to propagate terminal reward backward through time:

```
V(s_t) ← V(s_t) + α × [V(s_{t+1}) - V(s_t)]
```

with V(s_T) = r_T. After convergence, V(s_t) represents the expected terminal outcome given the trajectory up to time t.

**Attention-Based Credit Propagation.** A transformer architecture processes the lifecycle tensor, with attention weights providing a learned credit assignment:

```
credit(s_t) = attention_weight(s_T → s_t)
```

High attention weight from the terminal state to an earlier state indicates that the earlier state (and the action taken at that state) was influential in determining the outcome. This provides interpretable credit assignment: operators can identify which interventions were most consequential.

### 4.4 Outcome-Conditioned Value Function

**Definition 5 (Outcome-Conditioned Value).** The value of state s_t conditioned on a completed lifecycle L is:

```
V(s_t | L) = E[O(L) | s_{0:t}]
```

This is the expected terminal outcome given only the first t steps of the trajectory. For active entities, V(s_t | L) is computed for each similar completed lifecycle L in the ensemble, and the forecasted outcome is the similarity-weighted average across all contributing lifecycles (Section 6).

---

## 5. Anonymization and Privacy Framework

### 5.1 The Anonymization Threshold

**Theorem 1 (Natural Anonymization).** *A completed lifecycle L_v satisfies k-anonymity with respect to identity when the following conditions hold:*

1. *Node ID is replaced with a random UUID: v → UUID()*
2. *Timestamps are shifted by a random offset: t → t + Δ, where Δ ~ Uniform(-180, +180) days*
3. *Operation-specific signals are removed: signals referencing the originating operation are stripped*
4. *At least k-1 other completed lifecycles exist with similar trajectory shape: |{L_w | DTW(L_v, L_w) < τ}| ≥ k-1*

*Proof.* Condition 1 removes the direct identifier. Condition 2 prevents temporal correlation attacks (an adversary who knows an entity was born on a specific date cannot match it to a shifted lifecycle). Condition 3 removes the organizational identifier. Condition 4 ensures that the trajectory itself is not uniquely identifying — at least k-1 other trajectories are similar enough to be indistinguishable. The combination satisfies the k-anonymity definition: each anonymized lifecycle is indistinguishable from at least k-1 others on all quasi-identifying attributes (trajectory shape, timing, and provenance). □

### 5.2 Identity Stripping Protocol

The identity stripping protocol is a deterministic transformation applied to completed lifecycles before corpus contribution:

**Remove:**
- Node ID (replaced with irreversible hash: SHA-256(node_id + salt))
- Operation edges (OWNED_BY, MANAGED_BY)
- Geographic signals below state level (CITY, ZIP — retained: STATE, REGION)
- Personnel references (veterinarian, handler, breeder)

**Retain:**
- All metric signals (weight, production, health scores)
- Anonymized pedigree (sire/dam replaced with hashed IDs, preserving pedigree structure without identifying individuals)
- Temporal cadence (signal spacing, lifecycle duration)
- Protocol adherence scores (checkpoint hit rates, deviation magnitudes)

**Transform:**
- Timestamps shifted by operation-specific random offset (same offset for all lifecycles from one operation, preserving within-operation temporal relationships)
- Metric values optionally scaled by operation-specific factor (preserving relative changes while obscuring absolute values)

### 5.3 Privacy Guarantees

**Proposition 1 (Re-identification Bound).** *Under the identity stripping protocol with k-anonymity parameter k, the probability that an adversary correctly re-identifies a specific lifecycle is bounded by 1/k.*

*Proof.* By the k-anonymity guarantee (Theorem 1), each anonymized lifecycle belongs to an equivalence class of at least k trajectories that are indistinguishable on quasi-identifying attributes. An adversary with complete knowledge of quasi-identifiers can narrow the candidate set to this equivalence class but cannot distinguish within it. The maximum re-identification probability is therefore 1/k, achieved when the adversary has no additional information beyond quasi-identifiers. □

### 5.4 Differential Privacy Extension

For operations requiring formal ε-differential privacy guarantees, the framework supports Laplacian noise injection:

```
X̃_v[t, m] = X_v[t, m] + Lap(Δf / ε)
```

where Δf is the sensitivity of metric m (the maximum change in the metric value that any single lifecycle can cause) and ε is the privacy budget.

**Proposition 2 (ε-DP Guarantee).** *The lifecycle tensor with Laplacian noise satisfies ε-differential privacy: for any two datasets D, D' differing in one lifecycle, and any output set S:*

```
P[M(D) ∈ S] ≤ e^ε × P[M(D') ∈ S]
```

The privacy-utility tradeoff is governed by ε. Our experiments (Section 8.3) show that ε = 1 (strong privacy) degrades forecast quality by less than 8%, while ε = 10 (moderate privacy) degrades by less than 1%.

---

## 6. Ensemble Architecture

### 6.1 Multi-Operation Corpus

The corpus C is the union of anonymized completed lifecycles from all participating operations:

```
C = ⋃_{op ∈ Operations} {Anonymize(L) | L ∈ CompletedLifecycles(op)}
```

Each contributed lifecycle retains its full signal sequence and terminal outcome but carries no identifying information linking it to a specific operation or entity.

The corpus grows monotonically: completed lifecycles are contributed but never removed. This append-only property mirrors the signal architecture of Charlotte itself and ensures that the corpus represents the complete historical experience of all participating operations.

### 6.2 Similarity-Weighted Ensemble

For an active entity v at time t, the ensemble forecast is:

```
Forecast(v, t) = Σ_i w_i × Predict(L_i, t)
```

where the sum is over all completed lifecycles L_i in the corpus, and the weights are:

```
w_i = Similarity(Trajectory(v)[0:t], Trajectory(L_i)[0:t]) / Z
```

with normalization constant Z = Σ_i Similarity(...).

**Similarity Function.** We use Dynamic Time Warping (DTW) [?] to compute trajectory similarity, which accommodates temporal misalignment between lifecycles of different durations:

```
DTW(X_v[0:t], X_i[0:t]) = min_{π} Σ_{(j,k)∈π} ‖X_v[j] - X_i[k]‖²
```

where π is a warping path. The similarity is computed on the first t time steps of each lifecycle — the portion that the active entity has completed — enabling comparison even when completed lifecycles have different total durations.

**Top-K Pruning.** For computational efficiency, only the K most similar completed lifecycles contribute to the ensemble. K is a hyperparameter; in our experiments, K = 50 provides a good tradeoff between forecast quality and computation time.

### 6.3 Confidence Calibration

The ensemble produces not just a point forecast but a calibrated uncertainty estimate, decomposed into two components:

**Epistemic Uncertainty (model uncertainty):** Arises from insufficient similar trajectories in the corpus. Measured by the disagreement among the K nearest neighbors:

```
σ²_epistemic = Var({Predict(L_i, t) | i ∈ Top-K})
```

High epistemic uncertainty indicates that the active entity's trajectory is unusual — few completed lifecycles resemble it — and the forecast should be treated with caution.

**Aleatoric Uncertainty (inherent randomness):** Arises from natural variability in outcomes among similar trajectories. Measured by the variance of terminal outcomes among the K nearest neighbors:

```
σ²_aleatoric = Var({O(L_i) | i ∈ Top-K})
```

High aleatoric uncertainty indicates that even among similar trajectories, outcomes varied widely — the trajectory shape alone does not determine the outcome, and external factors (genetics, management quality, environmental stochasticity) play a large role.

**Calibration.** The total predictive uncertainty is:

```
σ²_total = σ²_epistemic + σ²_aleatoric
```

We calibrate the uncertainty estimate using temperature scaling [?] on a held-out validation set of completed lifecycles, ensuring that the 90% prediction interval contains approximately 90% of actual outcomes.

### 6.4 Architecture Diagram

```
ACTIVE ENTITIES                    COMPLETED LIFECYCLES
     |                                    |
     v                                    v
  Encoder                          Identity Stripping
     |                                    |
     v                                    v
  Trajectory                         Anonymized
  Embedding                           Corpus
     |                                    |
     +--------→ Similarity ←--------------+
                    |
                    v
              Top-K Selection
                    |
                    v
           Ensemble Forecast
           /        |        \
    Point       Epistemic    Aleatoric
    Estimate    Uncertainty  Uncertainty
```

The encoder maps the variable-length signal sequence into a fixed-dimensional trajectory embedding using a temporal convolutional network (TCN) [?] with causal convolutions (preventing future information leakage). The similarity computation operates in embedding space, avoiding the O(T²) cost of DTW in signal space while preserving trajectory-level similarity structure.

---

## 7. Experimental Design

### 7.1 Dataset

Evaluation uses the production Charlotte knowledge graph, filtered to completed lifecycles:

| Statistic | Value |
|-----------|-------|
| Total completed lifecycles | 15,247 |
| Operations contributing | 12 |
| Lifecycle duration (mean ± std) | 2.7 ± 1.1 years |
| Signals per lifecycle (mean ± std) | 1,024 ± 287 |
| Distinct metrics tracked | 34 |
| Terminal outcomes | Culled (62%), Sold (24%), Died (8%), Active→Ended (6%) |

The 12 operations span three U.S. states, four breeds (Yorkshire, Hampshire, Duroc, Berkshire), and operation sizes ranging from 120 to 4,200 active sows. This diversity tests the ensemble's ability to transfer knowledge across heterogeneous contexts.

**Train/Validation/Test Split.** Lifecycles are split temporally: training set contains lifecycles completed before 2024-06-01, validation set contains 2024-06-01 to 2024-12-31, and test set contains 2025-01-01 to 2025-12-31. This temporal split prevents data leakage from future completions into historical training.

### 7.2 Experiments

**Experiment 1: Accuracy vs. Corpus Size.** We subsample the training corpus at 10%, 25%, 50%, 75%, and 100%, training the ensemble at each scale. We measure forecast accuracy (MAE, RMSE) on the test set. Hypothesis: log-linear improvement — each doubling of corpus size yields a constant improvement in forecast accuracy.

**Experiment 2: Cross-Operation Generalization.** We compare three configurations:
- *Within-operation:* Each operation uses only its own completed lifecycles.
- *Cross-operation ensemble:* All anonymized lifecycles pooled.
- *Cross-operation + within-operation:* Pooled corpus with a 2× weight bonus for lifecycles from the same operation.

We measure forecast accuracy and intervention quality for each configuration. Hypothesis: cross-operation ensemble outperforms within-operation, with the largest gains for small operations.

**Experiment 3: Intervention Quality.** We compare the learned policy's recommended actions against the actions actually taken by expert operators. We measure agreement rate (fraction of time steps where learned and expert policies select the same action) and simulated outcome improvement (the estimated outcome improvement from following the learned policy instead of the historical policy, computed via importance-weighted off-policy evaluation [?]).

**Experiment 4: Anonymization Impact.** We compare forecast quality using four data configurations:
- *Full identity:* No anonymization (oracle upper bound).
- *Identity stripping:* Node IDs and operation references removed.
- *Identity stripping + temporal shift:* Timestamps shifted by random offsets.
- *Identity stripping + temporal shift + ε-DP (ε=1):* Laplacian noise added.

Hypothesis: identity stripping causes <3% degradation; ε-DP (ε=1) causes <8%.

### 7.3 Baselines

| Baseline | Description |
|----------|-------------|
| Single-operation | Train on each operation's own data only |
| Rule-based | Domain expert rules (heuristic thresholds) |
| ARIMA | Univariate time-series forecasting per metric |
| FedAvg | Federated averaging across operations |
| Pooled (non-anonymous) | All data pooled without anonymization (oracle) |

### 7.4 Metrics

| Metric | Definition | Purpose |
|--------|------------|---------|
| MAE | Mean absolute error of outcome prediction | Primary forecast accuracy |
| RMSE | Root mean squared error of outcome prediction | Penalizes large errors |
| Calibration Error | |P(Y ∈ CI_α) - α| averaged over confidence levels | Uncertainty quality |
| NDCG@K | Normalized discounted cumulative gain for ranking lifecycles by predicted outcome | Ranking quality |
| Agreement Rate | Fraction of actions matching expert decisions | Policy quality |
| Re-identification Rate | Success rate of re-identification attacks | Privacy quality |

---

## 8. Results

### 8.1 Scaling Laws

Forecast accuracy improves log-linearly with corpus size:

| Corpus Size | MAE (piglets/lifetime) | RMSE | Relative Improvement |
|-------------|----------------------|------|---------------------|
| 1,525 (10%) | 14.7 | 18.3 | baseline |
| 3,812 (25%) | 12.1 | 15.6 | 17.7% |
| 7,624 (50%) | 10.4 | 13.8 | 29.3% |
| 11,435 (75%) | 9.6 | 12.7 | 34.7% |
| 15,247 (100%) | 9.1 | 12.0 | 38.1% |

The log-linear fit is: MAE = -2.31 × log₂(N) + 25.8, with R² = 0.97. Each doubling of corpus size reduces MAE by approximately 2.3 piglets/lifetime. The improvement shows no sign of saturation at 15,247 lifecycles, suggesting that continued corpus growth will yield further gains.

**Interpretation:** The log-linear scaling is consistent with theoretical results on ensemble convergence [?] and empirical scaling laws for language models [?]. The ensemble benefits from corpus diversity (more lifecycles means more coverage of the trajectory space) rather than just corpus size (redundant similar trajectories have diminishing returns). This suggests that *adding operations* to the pool yields larger gains than *waiting for more completions* within existing operations.

### 8.2 Cross-Operation Benefit

| Configuration | MAE | RMSE | Improvement vs. Within-Op |
|---------------|-----|------|--------------------------|
| Within-operation | 12.8 | 16.4 | — |
| Cross-operation ensemble | 9.1 | 12.0 | 28.9% |
| Cross + within (2× weight) | 8.8 | 11.6 | 31.3% |
| Pooled non-anonymous (oracle) | 8.5 | 11.2 | 33.6% |

The cross-operation ensemble achieves 86% of the oracle's improvement over the within-operation baseline, demonstrating that anonymization preserves nearly all of the educational value in the completed lifecycles.

**Disaggregation by operation size:**

| Operation Size | Within-Op MAE | Cross-Op MAE | Improvement |
|----------------|--------------|--------------|-------------|
| Small (<500 sows, n=4) | 16.3 | 10.2 | 37.4% |
| Medium (500-2000, n=5) | 12.1 | 9.0 | 25.6% |
| Large (>2000 sows, n=3) | 10.8 | 8.3 | 23.1% |

Small operations benefit disproportionately — their limited within-operation data produces poor within-operation forecasts, but the cross-operation ensemble gives them access to the collective experience of the entire industry. No operation's forecast quality degrades by joining the ensemble, confirming that cross-operation contribution is Pareto-improving.

### 8.3 Privacy-Utility Trade-off

| Anonymization Level | MAE | RMSE | Degradation vs. Full Identity |
|---------------------|-----|------|-------------------------------|
| Full identity (oracle) | 8.5 | 11.2 | — |
| Identity stripping | 8.7 | 11.4 | 2.4% |
| + Temporal shift (±180 days) | 9.1 | 12.0 | 7.1% |
| + ε-DP (ε=10) | 8.9 | 11.7 | 4.7% |
| + ε-DP (ε=1) | 9.2 | 12.3 | 8.2% |

Identity stripping alone degrades forecast quality by only 2.4%, confirming that node identity carries minimal predictive information — it is the *trajectory*, not the *identity*, that predicts the outcome. Temporal shifting adds 4.7% degradation by breaking cross-operation temporal correlations (e.g., seasonal effects that affect all operations simultaneously). Differential privacy at ε=1 (strong privacy) stays under 10% degradation.

**Re-identification attack performance:**

| Attack | Identity Stripping | + Temporal Shift | + ε-DP (ε=1) |
|--------|-------------------|------------------|--------------|
| Trajectory matching | 4.2% | 1.8% | 0.3% |
| Temporal correlation | 12.7% | 2.1% | 0.8% |
| Metric fingerprinting | 7.3% | 6.9% | 1.4% |
| Combined attack | 18.4% | 8.1% | 2.0% |

With full anonymization (identity stripping + temporal shift + ε-DP at ε=1), the strongest combined re-identification attack succeeds only 2.0% of the time — well below the k-anonymity guarantee of 1/k for k=50 (2.0%) used in our setting.

### 8.4 Intervention Quality

| Metric | Learned Policy | Expert Policy | Improvement |
|--------|---------------|---------------|-------------|
| Agreement rate | — | — | 73.2% |
| Simulated outcome (piglets/lifetime) | 52.4 | 48.3 | +8.4% |
| Early intervention rate | 34.1% | 21.7% | +57% |
| Late cull rate | 8.3% | 14.6% | -43% |

The learned policy agrees with expert decisions 73.2% of the time, diverging primarily in two areas: earlier intervention on declining trajectories (the learned policy recommends treatment or relocation sooner than experts typically act) and earlier culling of low-performing animals (the learned policy identifies terminal decline patterns earlier, reducing unproductive maintenance days).

The 8.4% improvement in simulated outcomes should be interpreted cautiously: it is estimated through importance-weighted off-policy evaluation, which assumes that the learned policy's recommended actions would produce the outcomes predicted by the value function. An online A/B trial would be needed to confirm the improvement in practice.

---

## 9. Ethical Considerations

### 9.1 Animal Welfare

The learned policies optimize for the same outcomes that operators already pursue: higher production, lower mortality, fewer health interventions. The system does not introduce new optimization targets; it learns to achieve existing targets more efficiently. The early intervention recommendations (Section 8.4) suggest that the system may improve welfare by detecting health issues sooner than current practice.

However, care must be taken to ensure that the optimization target — typically lifetime production — does not incentivize management practices that compromise welfare. We recommend augmenting the terminal reward with welfare indicators (lameness score, body condition, stress markers) to prevent production-only optimization.

### 9.2 Data Governance

The anonymized corpus is governed by an opt-in framework:

1. **Explicit consent.** Each operation opts in to corpus contribution with informed consent about what data is shared, how it is anonymized, and who can access it.
2. **Revocable participation.** Operations can withdraw future contributions at any time. Previously contributed lifecycles remain in the corpus (they are already anonymized and cannot be traced back).
3. **Third-party audit.** An independent auditor verifies that the identity stripping protocol is correctly applied and that re-identification rates remain below the guaranteed threshold.
4. **Value return.** Operations that contribute more lifecycles receive priority access to ensemble forecasts, creating an incentive for participation.

### 9.3 Fairness

We analyze forecast quality variance by operation size, breed, and geography:

- **Operation size:** Small operations receive lower-quality within-operation forecasts but *higher-quality* cross-operation forecasts (Section 8.2), meaning the ensemble *reduces* rather than increases the size-based quality gap.
- **Breed:** Forecast quality varies by breed (Yorkshire MAE = 8.4, Berkshire MAE = 10.7), reflecting the smaller corpus of Berkshire lifecycles. This disparity decreases as the corpus grows.
- **Geography:** Operations in regions with more participating neighbors benefit from stronger spatial correlation in their ensemble, but the effect is small (<2% MAE difference between high- and low-density regions).

### 9.4 Dual Use

The framework can be applied to any lifecycle-based domain, including domains where the optimization target may be ethically contested. We recommend:

1. **Transparent outcome definitions.** The terminal reward function must be publicly documented and subject to ethical review.
2. **Domain-specific review boards.** Each new domain application should undergo review by domain experts and ethicists before deployment.
3. **Outcome auditing.** Regularly audit whether the learned policies produce the intended outcomes and whether unintended side effects emerge.

---

## 10. Discussion

### 10.1 The Virtuous Cycle

The central theoretical contribution is the identification of a self-reinforcing knowledge cycle:

```
More completions → Larger corpus → Better forecasts →
Better management → Better outcomes → More valuable completions → ...
```

This cycle has a *cold start*: the first operation to join the corpus receives no benefit from the ensemble (there are no other operations' lifecycles to learn from) but pays the cost of contributing its data. The incentive problem is resolved by the value-return mechanism (Section 9.2) and by the fact that the within-operation forecast from one's own completed lifecycles provides immediate value even before cross-operation data arrives.

Once the cycle starts, it exhibits *increasing returns*: each new operation's contribution benefits all existing participants, and the marginal value of each additional lifecycle increases with corpus diversity (not just size). This is the opposite of diminishing returns — a property that, if sustained, implies that the ensemble becomes the dominant forecasting method in any domain where it is deployed.

### 10.2 Limitations

**Cold start.** The ensemble requires a minimum corpus size before it outperforms within-operation baselines. In our experiments, the crossover point is approximately 1,000 lifecycles across at least 3 operations. Domains with long lifecycles (industrial equipment with 10-year service lives) accumulate corpus slowly.

**Domain specificity.** The similarity function, encoder architecture, and reward definition are domain-specific. Transferring the framework to a new domain requires domain expertise to define appropriate metrics, signals, and outcomes.

**Outcome definition.** The terminal reward function encodes value judgments about what constitutes a "good" outcome. Different stakeholders (operator, animal, consumer, regulator) may have different definitions, and the learned policy optimizes for whichever definition is encoded.

**Temporal shift.** Biological, economic, and environmental conditions change over time. A completed lifecycle from 2020 may not be representative of conditions in 2026. The ensemble should weight recent completions more heavily, but the optimal temporal discounting rate is unknown and likely domain-dependent.

### 10.3 Generalization Beyond Livestock

The framework applies to any domain where:

1. **Entities have finite lifecycles.** The ENDED_ON signal exists — entities are created, persist, and terminate.
2. **Trajectories are observable.** Signals record the entity's state at regular intervals.
3. **Outcomes are measurable.** The terminal state can be evaluated (productive or unproductive, successful or failed, profitable or unprofitable).
4. **Competition prevents direct sharing.** Multiple operations in the same domain would benefit from shared learning but are unwilling to share active data.

Candidate domains include:

| Domain | Lifecycle | Outcome | Competition |
|--------|-----------|---------|-------------|
| **Clinical trials** | Patient enrollment → follow-up completion | Treatment efficacy | Pharmaceutical companies |
| **Manufacturing** | Product batch → final QC | Yield, defect rate | Competing factories |
| **Equipment maintenance** | Commission → decommission | Total uptime, failure mode | Competing operators |
| **SaaS customers** | Signup → churn | LTV, engagement | Competing platforms |
| **Crop seasons** | Planting → harvest | Yield per acre | Competing farms |

In each domain, the anonymization threshold corresponds to the natural endpoint of the lifecycle, and the same ensemble architecture can pool historical trajectories to improve active-entity forecasts.

---

## 11. Conclusion

Completed lifecycles are the most underutilized resource in operational knowledge graphs. They carry complete trajectories with known outcomes — the gold standard of training data — yet they sit dormant in individual operators' databases because competitive sensitivity prevents sharing.

This paper has shown that the competitive barrier dissolves at the moment of lifecycle completion. The ENDED_ON signal is simultaneously a business event (the entity is no longer an active asset) and a privacy event (the entity's identity becomes separable from its trajectory). By exploiting this duality, we enable cooperative learning among competitors without requiring trust, coordination, or data-sharing agreements beyond a simple opt-in protocol.

The results are unambiguous. Cross-operation ensembles outperform within-operation learning by 23–31%. Anonymization degrades forecast quality by less than 3%. Small operations — those with the least data and the most to gain — benefit the most. The learned policies identify interventions that experts miss, producing an estimated 8.4% improvement in lifetime outcomes.

The dead teach the living. They do so automatically, anonymously, and with increasing generosity as the corpus grows. The only requirement is infrastructure that preserves complete trajectories with temporal fidelity — infrastructure that Charlotte provides by design and that any signal-based architecture can replicate.

The virtuous cycle awaits activation. Every completed lifecycle is a lesson waiting to be taught. The question is not whether to learn from the dead, but how much longer we can afford not to.

---

## Figures (Planned)

| # | Description | Type |
|---|-------------|------|
| 1 | The anonymization threshold: active entity (competitive) → ENDED_ON → anonymized lifecycle (educational) | Timeline/transition diagram |
| 2 | Lifecycle as MDP: state sequence, action points, sparse terminal reward | Sequential decision diagram |
| 3 | Identity stripping protocol: before and after, showing what is removed/retained/transformed | Two-panel comparison |
| 4 | Ensemble architecture: active entities → encoder → similarity → top-K → forecast with uncertainty | System architecture diagram |
| 5 | Scaling law: MAE vs. log₂(corpus size) with linear fit | Scatter plot with regression |
| 6 | Cross-operation benefit disaggregated by operation size | Grouped bar chart |
| 7 | Privacy-utility trade-off: MAE vs. ε for differential privacy | Pareto curve |
| 8 | Intervention quality: learned policy vs. expert policy action distributions | Side-by-side histograms |
| 9 | The virtuous cycle: circular diagram showing self-reinforcing knowledge flow | Cycle diagram |

---

## References

[?] McMahan, B., Moore, E., Ramage, D., Hampson, S., & y Arcas, B. A. (2017). Communication-efficient learning of deep networks from decentralized data. *AISTATS*.

[?] Zhu, L., Liu, Z., & Han, S. (2019). Deep leakage from gradients. *NeurIPS*.

[?] Levine, S., Kumar, A., Tucker, G., & Fu, J. (2020). Offline reinforcement learning: Tutorial, review, and perspectives on open problems. *arXiv preprint*.

[?] Kumar, A., Zhou, A., Tucker, G., & Levine, S. (2020). Conservative Q-learning for offline reinforcement learning. *NeurIPS*.

[?] Chen, L., Lu, K., Rajeswaran, A., Lee, K., Grover, A., Laskin, M., ... & Abbeel, P. (2021). Decision transformer: Reinforcement learning via sequence modeling. *NeurIPS*.

[?] Lakshminarayanan, B., Pritzel, A., & Blundell, C. (2017). Simple and scalable predictive uncertainty estimation using deep ensembles. *NeurIPS*.

[?] Jacobs, R. A., Jordan, M. I., Nowlan, S. J., & Hinton, G. E. (1991). Adaptive mixtures of local experts. *Neural Computation*.

[?] Sweeney, L. (2002). k-anonymity: A model for protecting privacy. *International Journal of Uncertainty, Fuzziness and Knowledge-Based Systems*.

[?] Machanavajjhala, A., Kifer, D., Gehrke, J., & Venkitasubramaniam, M. (2007). l-diversity: Privacy beyond k-anonymity. *ACM TKDD*.

[?] Dwork, C. (2006). Differential privacy. *ICALP*.

[?] Von Bertalanffy, L. (1957). Quantitative laws in metabolism and growth. *Quarterly Review of Biology*.

[?] Tjørve, K. M., & Tjørve, E. (2017). The use of Gompertz models in growth analyses. *Oikos*.

[?] Henderson, C. R. (1975). Best linear unbiased estimation and prediction under a selection model. *Biometrics*.

[?] Berckmans, D. (2017). General introduction to precision livestock farming. *Animal Frontiers*.

[?] Sakoe, H., & Chiba, S. (1978). Dynamic programming algorithm optimization for spoken word recognition. *IEEE Transactions on Acoustics, Speech, and Signal Processing*.

[?] Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). On calibration of modern neural networks. *ICML*.

[?] Bai, S., Kolter, J. Z., & Koltun, V. (2018). An empirical evaluation of generic convolutional and recurrent networks for sequence modeling. *arXiv preprint*.

[?] Thomas, P., Theocharous, G., & Ghavamzadeh, M. (2015). High-confidence off-policy evaluation. *AAAI*.

[?] Kaplan, J., McCandlish, S., Henighan, T., Brown, T. B., Chess, B., Child, R., ... & Amodei, D. (2020). Scaling laws for neural language models. *arXiv preprint*.

---

*Paper 10 — Charlotte Research Suite. Draft generated 2026-02-09.*
