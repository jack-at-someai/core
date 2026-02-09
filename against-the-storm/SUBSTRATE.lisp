;;;; SUBSTRATE.lisp — Against the Storm as First-Order Logic
;;;;
;;;; The entire game backend expressed as Lisp predicates.
;;;; If these predicates hold for a fantasy city builder,
;;;; and the same predicates hold for a pig farm,
;;;; then the predicates are the substrate.

;;; ============================================================
;;; PART 0 — THE FIVE PRIMITIVES
;;; ============================================================
;;; Charlotte's five types map directly to FOL constructs:
;;;   NODE     = entity declaration     (exists x)
;;;   EDGE     = binary relation        (relates x y r)
;;;   METRIC   = predicate declaration  (measurable x dimension type)
;;;   SIGNAL   = time-indexed assertion (observed x dimension value t)
;;;   PROTOCOL = constraint generator   (expected x dimension value t)

(deftype fact-type () '(member :node :edge :metric :signal :protocol))

(defstruct fact
  (id       nil :type symbol)
  (type     nil :type fact-type)
  (created  nil :type symbol)        ; temporal node reference, not timestamp
  (p0       nil)                     ; primary register
  (p1       nil)                     ; secondary register
  (p2       nil)                     ; tertiary register
  (p3       nil))                    ; quaternary register

;;; ============================================================
;;; PART 1 — ONTOLOGY: ENTITY DECLARATIONS
;;; ============================================================

;;; --- Species (Node Categories) ---

(defparameter *species*
  '(:human :beaver :lizard :harpy :fox))

(defparameter *species-traits*
  '((:human  :base-resolve 15 :hunger-tolerance 6  :break-interval 120 :resilience :normal)
    (:beaver :base-resolve 10 :hunger-tolerance 6  :break-interval 120 :resilience :normal)
    (:lizard :base-resolve 5  :hunger-tolerance 12 :break-interval 100 :resilience :high)
    (:harpy  :base-resolve 5  :hunger-tolerance 4  :break-interval 100 :resilience :normal)
    (:fox    :base-resolve 5  :hunger-tolerance 3  :break-interval 120 :resilience :low)))

;;; --- Resources (Node Categories) ---

(defparameter *raw-resources*
  '(:wood :meat :grain :berries :mushrooms :roots :vegetables :eggs
    :herbs :clay :copper-ore :stone :coal :plant-fiber :reed :resin
    :insects :leather-raw :broccoli :sea-marrow))

(defparameter *complex-foods*
  '(:biscuits :jerky :pie :pickled-goods :porridge :skewers :stew :tea :beer :wine))

(defparameter *building-materials*
  '(:planks :bricks :fabric :pipes))

(defparameter *fuels*
  '(:wood :coal :oil :sea-marrow))

(defparameter *trade-goods*
  '(:amber :ancient-tablets :barrels :cloth :crystallized-dew :incense
    :metal-bars :pigment :scrolls :tools :waterskins :wildfire-essence))

(defparameter *water-types*
  '(:clearance :drizzle :storm))

;;; --- Buildings (Edge Categories — Transformation Nodes) ---

(defparameter *gathering-buildings*
  '(:woodcutters-camp :foragers-camp :trappers-camp :herbalists-camp
    :small-farm :herb-garden :plantation :ranch :clay-pit :mine :rain-collector))

(defparameter *production-buildings*
  '(:bakery :beanery :brewery :butcher :cellar :cookhouse :grill :smokehouse
    :teahouse :workshop :carpenter :lumber-mill :brick-oven :brickyard
    :furnace :kiln :smelter :toolshop :tinkerer :alchemist-hut :apothecary
    :artisan :clothier :cooperage :distillery :leatherworker :press :scribe
    :stamping-mill :weaver :manufacturery))

(defparameter *service-buildings*
  '(:tavern :temple :market :library :guild-house :tea-doctor
    :bath-house :clan-hall :forum :monastery))

(defparameter *infrastructure*
  '(:ancient-hearth :hearth :shelter :human-house :beaver-house
    :lizard-house :harpy-house :fox-house :warehouse :trading-post
    :explorers-lodge :blight-post))


;;; ============================================================
;;; PART 2 — PREDICATES: THE RELATIONS THAT HOLD
;;; ============================================================

;;; --- Core Predicates (Domain-Agnostic) ---

;; (exists ?entity ?category ?time)
;; An entity of a given category exists at time t.
(defun exists-p (entity category time)
  "NODE: declares that entity exists as category at time."
  (make-fact :id (gensym "N") :type :node :created time
             :p0 category))

;; (relates ?from ?to ?relation ?time)
;; A directed, typed relationship between two entities.
(defun relates-p (from to relation time)
  "EDGE: connects two nodes with a typed relation."
  (make-fact :id (gensym "E") :type :edge :created time
             :p0 from :p1 to :p2 relation))

;; (measurable ?entity ?dimension ?value-type)
;; A dimension that can be observed on an entity.
(defun measurable-p (entity dimension value-type &optional constraints)
  "METRIC: declares what can be measured on a node."
  (make-fact :id (gensym "M") :type :metric :created :substrate
             :p0 entity :p1 value-type :p2 dimension :p3 constraints))

;; (observed ?entity ?dimension ?value ?time &optional ?protocol)
;; A time-indexed observation. Append-only. Never mutated.
(defun observed-p (entity dimension value time &optional protocol)
  "SIGNAL: records an observation at a point in time."
  (make-fact :id (gensym "S") :type :signal :created time
             :p0 entity :p1 dimension :p2 value :p3 protocol))

;; (expected ?entity ?dimension ?value ?time ?schedule)
;; A forecasted observation. Generates future signal targets.
(defun expected-p (entity dimension value time schedule)
  "PROTOCOL: forecasts an expected signal."
  (make-fact :id (gensym "P") :type :protocol :created time
             :p0 entity :p1 schedule :p2 `(:metric ,dimension :target ,value)))


;;; ============================================================
;;; PART 3 — RULES: INFERENCE OVER THE GRAPH
;;; ============================================================

;;; --- Specialization ---
;;; (specializes ?species ?building) → bonus resolve + production speed

(defparameter *specializations*
  '((:beaver  . (:woodcutters-camp :lumber-mill :cooperage :mine :toolshop :rain-mill))
    (:human   . (:small-farm :herb-garden :bakery :granary :brewery :tavern :butcher))
    (:lizard  . (:trappers-camp :smokehouse :ranch :furnace :kiln :blight-post))
    (:harpy   . (:alchemist-hut :clothier :teahouse))
    (:fox     . (:rain-collector))))

(defun specializes-p (species building)
  (member building (cdr (assoc species *specializations*))))

;;; --- Needs ---
;;; (needs ?species ?need-type ?satisfiers)
;;; Each species requires specific goods/services for resolve.

(defparameter *complex-needs*
  '((:beaver  (:food       . (:biscuits :pickled-goods))
              (:housing    . :beaver-house)
              (:service-1  . (:luxury    (:tea-doctor :library :market)))
              (:service-2  . (:education (:guild-house :library :temple))))
    (:human   (:food       . (:pie :biscuits :jerky))
              (:housing    . :human-house)
              (:service-1  . (:religion  (:library :market :temple)))
              (:service-2  . (:leisure   (:guild-house :tavern :tea-doctor))))
    (:lizard  (:food       . (:jerky :pie :biscuits :pickled-goods :skewers))
              (:housing    . :lizard-house)
              (:service-1  . (:religion    (:library :market :temple)))
              (:service-2  . (:brotherhood (:market :tavern :temple))))
    (:harpy   (:food       . (:jerky :biscuits :skewers))
              (:housing    . :harpy-house)
              (:service-1  . (:bloodthirst nil))
              (:service-2  . (:cleanliness (:bath-house))))
    (:fox     (:food       . (:biscuits :jerky :pie))
              (:housing    . :fox-house)
              (:service-1  . (:luxury    (:tea-doctor :library :market)))
              (:service-2  . (:education (:guild-house :library :temple))))))

(defun needs-p (species need-type)
  "Returns satisfiers for a species' need."
  (cdr (assoc need-type (cdr (assoc species *complex-needs*)))))

;;; --- Production Rules ---
;;; (produces ?building ?input ?output ?star-rating)
;;; A building transforms input resources into output resources.

(defparameter *recipes*
  '(;; Food chains
    (:bakery       :grain        :pie           3)
    (:bakery       :grain        :biscuits      2)
    (:smokehouse   :meat         :jerky         3)
    (:beanery      :vegetables   :pickled-goods 2)
    (:beanery      :grain        :porridge      2)
    (:cookhouse    :meat         :stew          2)
    (:cookhouse    :mushrooms    :stew          2)
    (:grill        :meat         :skewers       2)
    (:teahouse     :herbs        :tea           2)
    (:brewery      :grain        :beer          2)
    (:cellar       :berries      :wine          2)
    ;; Material chains
    (:carpenter    :wood         :planks        2)
    (:lumber-mill  :wood         :planks        3)
    (:brick-oven   :clay         :bricks        2)
    (:kiln         :wood         :coal          2)
    (:workshop     :wood         :planks        2)
    (:workshop     :clay         :bricks        2)
    (:workshop     :plant-fiber  :fabric        2)
    (:workshop     :copper-ore   :pipes         1)
    ;; Tool chains
    (:furnace      :copper-ore   :metal-bars    2)
    (:furnace      :metal-bars   :tools         2)
    (:toolshop     :wood         :tools         1)
    (:toolshop     :metal-bars   :tools         3)
    ;; Trade goods
    (:alchemist-hut :herbs       :crystallized-dew 2)
    (:apothecary   :herbs        :incense       2)
    (:artisan      :resin        :pigment       2)
    (:artisan      :wood         :barrels       2)
    (:clothier     :plant-fiber  :cloth         2)
    (:cooperage    :planks       :barrels       2)
    (:press        :grain        :oil           2)
    (:stamping-mill :wood        :scrolls       2)
    (:scribe       :plant-fiber  :scrolls       2)))

(defun produces-p (building input)
  "What does this building produce from this input?"
  (remove-if-not (lambda (r) (and (eq (first r) building) (eq (second r) input)))
                 *recipes*))

(defun produced-by-p (output)
  "Which buildings can produce this output?"
  (remove-if-not (lambda (r) (eq (third r) output)) *recipes*))

;;; --- Water Power ---
;;; (powered-by ?building ?water-type)

(defparameter *water-power*
  '((:clearance . (:alchemist-hut :apothecary :artisan :clothier :cooperage))
    (:drizzle   . (:bakery :brewery :butcher :cellar :cookhouse))
    (:storm     . (:brickyard :carpenter :kiln :workshop :smelter))))

(defun powered-by-p (building water-type)
  (member building (cdr (assoc water-type *water-power*))))

;;; --- Firekeeper ---
;;; (firekeeper-bonus ?species) → global modifier when assigned to hearth

(defparameter *firekeeper-bonuses*
  '((:beaver . (:fuel-reduction 0.20))
    (:human  . (:global-resolve +2))
    (:lizard . (:global-resolve +1))
    (:harpy  . (:break-frequency :increased))
    (:fox    . (:hostility-per-glade -6))))


;;; ============================================================
;;; PART 4 — PRESSURE DYNAMICS: SYSTEMIC RULES
;;; ============================================================

;;; --- Resolve Calculation ---
;;; resolve(species, t) = base + Σ(positive) - Σ(negative)

(defun resolve-at (species settlement time)
  "Compute resolve for a species at a given time.
   This is the core signal: a time-indexed observation derived from
   the sum of all positive and negative effects."
  (let* ((base     (getf (cdr (assoc species *species-traits*)) :base-resolve))
         (housing  (if (housed-p species settlement) 3 0))
         (sp-house (if (species-housed-p species settlement) 8 0))
         (food     (complex-food-bonus species settlement))
         (services (service-bonus species settlement))
         (fkeeper  (firekeeper-resolve settlement))
         (hostile  (* -2 (hostility-level settlement time)))
         (storm    (if (storm-active-p time) -3 0)))
    ;; The signal:
    (observed-p species :resolve
                (+ base housing sp-house food services fkeeper hostile storm)
                time)))

;;; --- Hostility ---
;;; hostility(t) = f(years, glades, villagers) - Σ(hearths * 30) - fox-bonus

(defun hostility-at (settlement time)
  "Hostility is systemic pressure. It does not target individuals.
   It degrades the resolve of ALL species simultaneously."
  (let* ((years     (years-elapsed settlement time))
         (glades    (glades-opened settlement))
         (pop       (population settlement))
         (hearths   (count-hearths settlement))
         (fox-fk    (if (firekeeper-is-p :fox settlement) (* -6 glades) 0))
         (raw       (+ (* 2 years) (* 3 glades) (floor pop 5)))
         (reduced   (- raw (* 30 hearths) (abs fox-fk))))
    (max 0 reduced)))

;;; --- Impatience ---
;;; impatience(t) = passive-gain + Σ(deaths) - Σ(reputation-gained)

(defun impatience-at (settlement time)
  "Impatience is the expression of failure, not the cause.
   Every villager death increases it. Every reputation point decreases it.
   At 14, the game ends."
  (let* ((passive  (passive-impatience-gain time))
         (deaths   (total-deaths settlement time))
         (rep      (reputation-gained settlement time)))
    (min 14.0 (max 0.0 (- (+ passive deaths) rep)))))

;;; --- Blightrot ---
;;; blightrot(t) = Σ(rain-engine-ticks) + Σ(production-during-storm) - Σ(purges)
;;; purge-cost = 10 wood | 4 oil | 3 coal (PER CYST)

(defun blightrot-cost (cysts)
  "Blightrot is a fuel tax. Each cyst costs one purging fire.
   This couples production output to fuel consumption."
  `(:or (:wood ,(* 10 cysts))
        (:oil  ,(* 4 cysts))
        (:coal ,(* 3 cysts))))

;;; --- Reputation ---
;;; win-condition: reputation >= 18 before impatience >= 14

(defun reputation-sources (settlement time)
  "Three sources with different risk/reliability profiles."
  `((:orders      . ,(orders-completed settlement time))     ; reliable, fast
    (:resolve     . ,(resolve-reputation settlement time))   ; medium, passive
    (:glade-events . ,(glade-reputation settlement time))))  ; unreliable, high-risk

(defun victory-p (settlement time)
  "The settlement is won when reputation fills before impatience."
  (and (>= (total-reputation settlement time) 18)
       (< (impatience-at settlement time) 14.0)))


;;; ============================================================
;;; PART 5 — COMPOSITION: THE TOPOLOGY OF A SETTLEMENT
;;; ============================================================

;;; A settlement is not a container. It is a GRAPH.
;;; Species, buildings, resources, and pressure systems
;;; are all nodes connected by typed edges.

(defun make-settlement (name species-set blueprints biome time)
  "A settlement is a composition of:
   - 3 species (of 5)        → node categories active
   - N blueprints (random)   → transformation edges available
   - 1 biome                 → resource nodes present
   - 1 ancient hearth        → temporal substrate (always present)
   - 0 initial hostility     → pressure starts at zero

   The settlement is the GRAPH, not a record."
  (let ((facts nil))
    ;; Declare settlement exists
    (push (exists-p name :settlement time) facts)
    ;; Declare species membership
    (dolist (sp species-set)
      (push (relates-p sp name :member-of time) facts))
    ;; Declare available blueprints (available transformations)
    (dolist (bp blueprints)
      (push (relates-p bp name :available-in time) facts))
    ;; Declare biome
    (push (relates-p name biome :located-in time) facts)
    ;; Declare hearth (always present — the substrate)
    (push (exists-p (gensym "HEARTH") :ancient-hearth time) facts)
    ;; Initialize pressure gauges as signals
    (push (observed-p name :hostility 0 time) facts)
    (push (observed-p name :impatience 0.0 time) facts)
    (push (observed-p name :reputation 0 time) facts)
    (nreverse facts)))

;;; --- Composition Analysis ---

(defun composition-strength (species-set)
  "Given 3 species, what systemic properties emerge?
   This is not stored. It is DERIVED from traversal."
  (let ((has-fuel-edge    (member :beaver species-set))
        (has-food-edge    (member :human species-set))
        (has-survival     (member :lizard species-set))
        (has-rep-convert  (member :harpy species-set))
        (has-hostility-mgmt (member :fox species-set)))
    `(:fuel-security     ,(not (null has-fuel-edge))
      :food-security     ,(not (null has-food-edge))
      :collapse-resist   ,(not (null has-survival))
      :rep-acceleration  ,(not (null has-rep-convert))
      :pressure-mgmt     ,(not (null has-hostility-mgmt))
      :critical-gaps     ,(remove nil
                            (list (unless has-fuel-edge    :no-fuel-edge)
                                  (unless has-food-edge    :no-food-edge)
                                  (unless has-survival     :no-survival-edge)
                                  (unless has-rep-convert  :no-rep-edge)
                                  (unless has-hostility-mgmt :no-pressure-edge))))))


;;; ============================================================
;;; PART 6 — THE CROSS-INDUSTRY PROOF
;;; ============================================================

;;; The predicates above are domain-agnostic.
;;; Below: the SAME predicates, different vocabulary.

;;; --- Against the Storm ---
;; (exists-p :beaver-07 :beaver :year-1)
;; (relates-p :beaver-07 :settlement-alpha :member-of :year-1)
;; (measurable-p :beaver-07 :resolve :number)
;; (observed-p :beaver-07 :resolve 12 :year-1)
;; (specializes-p :beaver :lumber-mill) → T
;; (produces-p :lumber-mill :wood) → ((:lumber-mill :wood :planks 3))
;; (needs-p :beaver :food) → (:biscuits :pickled-goods)

;;; --- Swine Operation ---
;; (exists-p :bella :sow :date-1-30-2026)
;; (relates-p :bella :trogdon-showpigs :member-of :date-1-30-2026)
;; (measurable-p :bella :weight :number)
;; (observed-p :bella :weight 285 :date-1-30-2026)
;; (specializes-p :hampshire :farrowing-barn) → T
;; (produces-p :farrowing-barn :bred-sow) → ((:farrowing-barn :bred-sow :litter 3))
;; (needs-p :sow :nutrition) → (:gestation-feed :lactation-feed)

;;; --- Industrial Equipment ---
;; (exists-p :compressor-412 :compressor :date-3-15-2026)
;; (relates-p :compressor-412 :isg-fleet :member-of :date-3-15-2026)
;; (measurable-p :compressor-412 :vibration :number)
;; (observed-p :compressor-412 :vibration 4.2 :date-3-15-2026)
;; (specializes-p :rotary-screw :high-pressure-line) → T
;; (produces-p :compressor-station :intake-air) → ((:compressor-station :intake-air :compressed-air 3))
;; (needs-p :compressor :maintenance) → (:oil-change :filter-replacement)

;;; --- Violin Collection ---
;; (exists-p :strad-1715 :violin :date-1-1-1715)
;; (relates-p :strad-1715 :prier-collection :member-of :date-6-1-2020)
;; (measurable-p :strad-1715 :provenance :string)
;; (observed-p :strad-1715 :provenance "Acquired by Prier" :date-6-1-2020)
;; (specializes-p :cremonese :concert-hall) → T
;; (produces-p :luthier-workshop :raw-spruce) → ((:luthier-workshop :raw-spruce :top-plate 3))
;; (needs-p :violin :conservation) → (:humidity-control :case-storage)


;;; ============================================================
;;; PART 7 — THE SETTLEMENT AS FACT STACK
;;; ============================================================

;;; A complete settlement in pure FACT form.
;;; This is what the backend actually stores.
;;; Every line is one document in the `facts` collection.

(defparameter *settlement-alpha*
  (list
    ;; TEMPORAL SUBSTRATE (always present)
    (make-fact :id 'date:y1  :type :node :created 'date:y1  :p0 :date)
    (make-fact :id 'date:y2  :type :node :created 'date:y1  :p0 :date)
    (make-fact :id 'date:y3  :type :node :created 'date:y1  :p0 :date)
    (make-fact :id 't:1-2    :type :edge :created 'date:y1  :p0 'date:y1 :p1 'date:y2 :p2 :next)
    (make-fact :id 't:2-3    :type :edge :created 'date:y2  :p0 'date:y2 :p1 'date:y3 :p2 :next)

    ;; SETTLEMENT
    (make-fact :id 'set:alpha :type :node :created 'date:y1 :p0 :settlement)

    ;; SPECIES NODES
    (make-fact :id 'bv:01 :type :node :created 'date:y1 :p0 :beaver)
    (make-fact :id 'bv:02 :type :node :created 'date:y1 :p0 :beaver)
    (make-fact :id 'hu:01 :type :node :created 'date:y1 :p0 :human)
    (make-fact :id 'hu:02 :type :node :created 'date:y1 :p0 :human)
    (make-fact :id 'lz:01 :type :node :created 'date:y1 :p0 :lizard)
    (make-fact :id 'lz:02 :type :node :created 'date:y1 :p0 :lizard)

    ;; MEMBERSHIP EDGES
    (make-fact :id 'e:bv1 :type :edge :created 'date:y1 :p0 'bv:01 :p1 'set:alpha :p2 :member-of)
    (make-fact :id 'e:bv2 :type :edge :created 'date:y1 :p0 'bv:02 :p1 'set:alpha :p2 :member-of)
    (make-fact :id 'e:hu1 :type :edge :created 'date:y1 :p0 'hu:01 :p1 'set:alpha :p2 :member-of)
    (make-fact :id 'e:hu2 :type :edge :created 'date:y1 :p0 'hu:02 :p1 'set:alpha :p2 :member-of)
    (make-fact :id 'e:lz1 :type :edge :created 'date:y1 :p0 'lz:01 :p1 'set:alpha :p2 :member-of)
    (make-fact :id 'e:lz2 :type :edge :created 'date:y1 :p0 'lz:02 :p1 'set:alpha :p2 :member-of)

    ;; INFRASTRUCTURE NODES (buildings)
    (make-fact :id 'bld:hearth    :type :node :created 'date:y1 :p0 :ancient-hearth)
    (make-fact :id 'bld:lumber    :type :node :created 'date:y1 :p0 :lumber-mill)
    (make-fact :id 'bld:farm      :type :node :created 'date:y1 :p0 :small-farm)
    (make-fact :id 'bld:smokehouse :type :node :created 'date:y1 :p0 :smokehouse)
    (make-fact :id 'bld:shelter1  :type :node :created 'date:y1 :p0 :shelter)
    (make-fact :id 'bld:shelter2  :type :node :created 'date:y1 :p0 :shelter)
    (make-fact :id 'bld:temple    :type :node :created 'date:y1 :p0 :temple)

    ;; BUILDING → SETTLEMENT EDGES
    (make-fact :id 'e:bl1 :type :edge :created 'date:y1 :p0 'bld:hearth    :p1 'set:alpha :p2 :belongs-to)
    (make-fact :id 'e:bl2 :type :edge :created 'date:y1 :p0 'bld:lumber    :p1 'set:alpha :p2 :belongs-to)
    (make-fact :id 'e:bl3 :type :edge :created 'date:y1 :p0 'bld:farm      :p1 'set:alpha :p2 :belongs-to)
    (make-fact :id 'e:bl4 :type :edge :created 'date:y1 :p0 'bld:smokehouse :p1 'set:alpha :p2 :belongs-to)

    ;; WORKER ASSIGNMENTS (villager → building edges)
    (make-fact :id 'e:w1 :type :edge :created 'date:y1 :p0 'bv:01 :p1 'bld:lumber    :p2 :works-at)
    (make-fact :id 'e:w2 :type :edge :created 'date:y1 :p0 'bv:02 :p1 'bld:lumber    :p2 :works-at)
    (make-fact :id 'e:w3 :type :edge :created 'date:y1 :p0 'hu:01 :p1 'bld:farm      :p2 :works-at)
    (make-fact :id 'e:w4 :type :edge :created 'date:y1 :p0 'hu:02 :p1 'bld:farm      :p2 :works-at)
    (make-fact :id 'e:w5 :type :edge :created 'date:y1 :p0 'lz:01 :p1 'bld:smokehouse :p2 :works-at)
    (make-fact :id 'e:w6 :type :edge :created 'date:y1 :p0 'lz:02 :p1 'bld:hearth    :p2 :works-at)

    ;; HOUSING EDGES (villager → shelter)
    (make-fact :id 'e:h1 :type :edge :created 'date:y1 :p0 'bv:01 :p1 'bld:shelter1 :p2 :housed-in)
    (make-fact :id 'e:h2 :type :edge :created 'date:y1 :p0 'bv:02 :p1 'bld:shelter1 :p2 :housed-in)
    (make-fact :id 'e:h3 :type :edge :created 'date:y1 :p0 'hu:01 :p1 'bld:shelter1 :p2 :housed-in)
    (make-fact :id 'e:h4 :type :edge :created 'date:y1 :p0 'hu:02 :p1 'bld:shelter2 :p2 :housed-in)
    (make-fact :id 'e:h5 :type :edge :created 'date:y1 :p0 'lz:01 :p1 'bld:shelter2 :p2 :housed-in)
    (make-fact :id 'e:h6 :type :edge :created 'date:y1 :p0 'lz:02 :p1 'bld:shelter2 :p2 :housed-in)

    ;; RESOURCE NODES
    (make-fact :id 'res:wood  :type :node :created 'date:y1 :p0 :resource)
    (make-fact :id 'res:grain :type :node :created 'date:y1 :p0 :resource)
    (make-fact :id 'res:meat  :type :node :created 'date:y1 :p0 :resource)

    ;; PRODUCTION EDGES (resource → building → product)
    (make-fact :id 'e:p1 :type :edge :created 'date:y1 :p0 'res:wood  :p1 'bld:lumber    :p2 :input-to)
    (make-fact :id 'e:p2 :type :edge :created 'date:y1 :p0 'bld:lumber :p1 'res:planks   :p2 :outputs)
    (make-fact :id 'e:p3 :type :edge :created 'date:y1 :p0 'res:grain :p1 'bld:farm      :p2 :gathered-by)
    (make-fact :id 'e:p4 :type :edge :created 'date:y1 :p0 'res:meat  :p1 'bld:smokehouse :p2 :input-to)
    (make-fact :id 'e:p5 :type :edge :created 'date:y1 :p0 'bld:smokehouse :p1 'res:jerky :p2 :outputs)

    ;; METRICS (what is measurable on this settlement)
    (make-fact :id 'm:resolve-bv :type :metric :created 'date:y1 :p0 :beaver  :p1 :number :p2 :resolve)
    (make-fact :id 'm:resolve-hu :type :metric :created 'date:y1 :p0 :human   :p1 :number :p2 :resolve)
    (make-fact :id 'm:resolve-lz :type :metric :created 'date:y1 :p0 :lizard  :p1 :number :p2 :resolve)
    (make-fact :id 'm:hostility  :type :metric :created 'date:y1 :p0 'set:alpha :p1 :number :p2 :hostility)
    (make-fact :id 'm:impatience :type :metric :created 'date:y1 :p0 'set:alpha :p1 :number :p2 :impatience)
    (make-fact :id 'm:reputation :type :metric :created 'date:y1 :p0 'set:alpha :p1 :number :p2 :reputation)
    (make-fact :id 'm:fuel       :type :metric :created 'date:y1 :p0 'bld:hearth :p1 :number :p2 :fuel-level)
    (make-fact :id 'm:corruption :type :metric :created 'date:y1 :p0 'bld:hearth :p1 :number :p2 :corruption)

    ;; SIGNALS — Year 1 observations
    (make-fact :id 's:r-bv-y1 :type :signal :created 'date:y1 :p0 :beaver  :p1 'm:resolve-bv :p2 13)
    (make-fact :id 's:r-hu-y1 :type :signal :created 'date:y1 :p0 :human   :p1 'm:resolve-hu :p2 18)
    (make-fact :id 's:r-lz-y1 :type :signal :created 'date:y1 :p0 :lizard  :p1 'm:resolve-lz :p2 9)
    (make-fact :id 's:host-y1 :type :signal :created 'date:y1 :p0 'set:alpha :p1 'm:hostility :p2 0)
    (make-fact :id 's:imp-y1  :type :signal :created 'date:y1 :p0 'set:alpha :p1 'm:impatience :p2 2.0)
    (make-fact :id 's:rep-y1  :type :signal :created 'date:y1 :p0 'set:alpha :p1 'm:reputation :p2 3)
    (make-fact :id 's:fuel-y1 :type :signal :created 'date:y1 :p0 'bld:hearth :p1 'm:fuel :p2 45)

    ;; SIGNALS — Year 2 observations (pressure building)
    (make-fact :id 's:r-bv-y2 :type :signal :created 'date:y2 :p0 :beaver  :p1 'm:resolve-bv :p2 11)
    (make-fact :id 's:r-hu-y2 :type :signal :created 'date:y2 :p0 :human   :p1 'm:resolve-hu :p2 14)
    (make-fact :id 's:r-lz-y2 :type :signal :created 'date:y2 :p0 :lizard  :p1 'm:resolve-lz :p2 7)
    (make-fact :id 's:host-y2 :type :signal :created 'date:y2 :p0 'set:alpha :p1 'm:hostility :p2 4)
    (make-fact :id 's:imp-y2  :type :signal :created 'date:y2 :p0 'set:alpha :p1 'm:impatience :p2 5.5)
    (make-fact :id 's:rep-y2  :type :signal :created 'date:y2 :p0 'set:alpha :p1 'm:reputation :p2 9)
    (make-fact :id 's:fuel-y2 :type :signal :created 'date:y2 :p0 'bld:hearth :p1 'm:fuel :p2 22)

    ;; PROTOCOL — Course correction: push resolve before year 3
    (make-fact :id 'proto:resolve-push :type :protocol :created 'date:y2
               :p0 'set:alpha
               :p1 '(:type :course-correction
                     :target-metric :reputation
                     :current 9 :target 18
                     :target-date date:y3
                     :strategy :resolve-party
                     :checkpoints ((date:y2 . 12)))
               :p2 '(:actions (:build-services :stockpile-complex-food :release-consumption-control)))))


;;; ============================================================
;;; PART 8 — THE PROOF
;;; ============================================================

;;; Count the predicates used above:
;;;
;;;   exists-p      — entity declaration
;;;   relates-p     — typed binary relation
;;;   measurable-p  — dimension declaration
;;;   observed-p    — time-indexed assertion
;;;   expected-p    — constraint/forecast
;;;   specializes-p — capability assertion
;;;   needs-p       — requirement assertion
;;;   produces-p    — transformation rule
;;;   powered-by-p  — dependency assertion
;;;
;;; Nine predicates.
;;;
;;; Now ask: which of these predicates are specific to Against the Storm?
;;;
;;; None.
;;;
;;; exists-p      works for beavers, sows, compressors, violins.
;;; relates-p     works for member-of, parent-of, located-in, fuels.
;;; measurable-p  works for resolve, weight, vibration, provenance.
;;; observed-p    works for happiness ticks, weigh-ins, sensor reads, auction records.
;;; expected-p    works for reputation targets, show weights, maintenance schedules, conservation plans.
;;; specializes-p works for species-building, breed-facility, model-line, maker-school.
;;; needs-p       works for food/service, nutrition/veterinary, maintenance/parts, humidity/storage.
;;; produces-p    works for bakery→pie, barn→litter, station→compressed-air, workshop→top-plate.
;;; powered-by-p  works for water types, feed types, power sources, climate conditions.
;;;
;;; The predicates are the substrate.
;;; The vocabulary is the industry.
;;; Lisp proves the separation is clean.

;;; ============================================================
;;; END
;;; ============================================================
