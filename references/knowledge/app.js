/* ============================================================
   Knowledge Primitives Reference Hub
   Convex hull of knowledge — derived from ATLAS_KNOWLEDGE_PRIMITIVES
   Maps to Charlotte Papers 0 (Synthesis), 1 (FINN), 5 (Domain)
   Five knowledge types: Structural, Declarative, Procedural,
   Heuristic, Meta — mapped to primitives NODE, EDGE, METRIC,
   SIGNAL, PROTOCOL
   ============================================================ */

const SECTIONS = [
  /* ──────────────────── 0  OVERVIEW ──────────────────── */
  {
    id: "overview",
    icon: "\u25C7",
    label: "Overview",
    intro: `
      <p><strong>Knowledge</strong>, at a programmatic level, is complicated. The Atlas Knowledge
      Primitives diagram&mdash;drawn during the early days of Charlotte (then called Atlas) at
      Northwestern&mdash;decomposes knowledge into five irreducible types: <em>structural</em>,
      <em>declarative</em>, <em>procedural</em>, <em>heuristic</em>, and <em>meta</em>. Together
      these form the <strong>convex hull</strong> of knowledge: the minimal bounding surface that
      encloses every form of knowing a system can possess.</p>

      <h3>The Five Knowledge Types</h3>
      <ul>
        <li><strong>Structural Knowledge</strong> &mdash; relationships between objects and concepts (maps to <em>EDGE</em>)</li>
        <li><strong>Declarative Knowledge</strong> &mdash; object facts, ground truths, assertions (maps to <em>NODE</em>)</li>
        <li><strong>Procedural Knowledge</strong> &mdash; rules, procedures, recipes for action (maps to <em>PROTOCOL</em>)</li>
        <li><strong>Heuristic Knowledge</strong> &mdash; rules of thumb, approximate reasoning (maps to <em>SIGNAL / METRIC</em>)</li>
        <li><strong>Meta Knowledge</strong> &mdash; knowledge about knowledge, self-awareness of what is known (maps to the system itself)</li>
      </ul>

      <h3>Charlotte&rsquo;s Primitive Mapping</h3>
      <p>Charlotte&rsquo;s five primitives (NODE, EDGE, METRIC, SIGNAL, PROTOCOL) were designed
      to be expressive enough to represent all five knowledge types. A <strong>NODE</strong>
      carries declarative facts about an entity. An <strong>EDGE</strong> encodes structural
      relationships between nodes. A <strong>PROTOCOL</strong> captures procedural rules that
      govern how the graph evolves. <strong>SIGNAL</strong> and <strong>METRIC</strong> represent
      heuristic observations&mdash;timestamped events and quantitative measurements that approximate
      ground truth. Meta knowledge emerges when the graph reflects on itself: nodes about nodes,
      edges about edges, protocols that govern other protocols.</p>

      <h3>Why a Convex Hull?</h3>
      <p>A convex hull is the tightest enclosure of a point set&mdash;every interior point is a
      combination of boundary points. Likewise, every real-world knowledge artifact (a medical
      diagnosis, a recipe, a swarm behaviour rule, a violin provenance chain) can be decomposed
      into some combination of these five primitive types. If a knowledge system can represent all
      five, it can represent <em>anything</em>.</p>
    `,
    subsections: [
      {
        title: "Foundational Texts on Knowledge",
        items: [
          { title: "Knowledge Representation and Reasoning", author: "Ronald Brachman & Hector Levesque", type: "book", level: "intermediate", url: "https://www.elsevier.com/books/knowledge-representation-and-reasoning/brachman/978-0-12-382432-1", desc: "The standard textbook on KR&R covering logic, frames, semantic networks, description logics, and non-monotonic reasoning." },
          { title: "Knowledge Representation: Logical, Philosophical, and Computational Foundations", author: "John F. Sowa", type: "book", level: "advanced", url: "https://www.jfsowa.com/krbook/", desc: "Encyclopaedic treatment of knowledge representation spanning philosophy, logic, linguistics, and AI. Introduces conceptual graphs." },
          { title: "The Knowledge Level", author: "Allen Newell (1982)", type: "notes", level: "advanced", url: "https://doi.org/10.1016/0004-3702(82)90012-1", desc: "Newell's seminal AI paper proposing knowledge as an independent level of analysis above the symbol level, characterised by goals and rationality." },
          { title: "Epistemology (Stanford Encyclopedia of Philosophy)", author: "SEP / Matthias Steup", type: "notes", level: "beginner", url: "https://plato.stanford.edu/entries/epistemology/", desc: "Authoritative philosophical survey of what knowledge is, the conditions for justified belief, and the structure of epistemic warrant." },
          { title: "Personal Knowledge: Towards a Post-Critical Philosophy", author: "Michael Polanyi", type: "book", level: "intermediate", url: "https://press.uchicago.edu/ucp/books/book/chicago/P/bo19722848.html", desc: "Polanyi's classic on tacit knowledge — the idea that 'we know more than we can tell' — foundational for heuristic and procedural knowledge." }
        ]
      },
      {
        title: "Knowledge in AI Systems",
        items: [
          { title: "Artificial Intelligence: A Modern Approach (4th Ed.)", author: "Stuart Russell & Peter Norvig", type: "book", level: "beginner", url: "https://aima.cs.berkeley.edu/", desc: "The definitive AI textbook. Chapters on knowledge representation, logical agents, planning, and probabilistic reasoning cover all five knowledge types." },
          { title: "Building Knowledge Graphs", author: "Mayank Kejriwal, Craig Knoblock & Pedro Szekely", type: "book", level: "intermediate", url: "https://mitpress.mit.edu/9780262045094/building-knowledge-graphs/", desc: "End-to-end guide to constructing knowledge graphs from heterogeneous sources, covering extraction, integration, completion, and querying." },
          { title: "Knowledge Graphs: Fundamentals, Techniques, and Applications", author: "Mayank Kejriwal, Craig Knoblock & Pedro Szekely", type: "book", level: "intermediate", url: "https://mitpress.mit.edu/9780262045094/knowledge-graphs/", desc: "Comprehensive textbook on knowledge graph construction, embedding, reasoning, and deployment in real-world applications." },
          { title: "The Semantic Web (W3C Overview)", author: "W3C", type: "notes", level: "beginner", url: "https://www.w3.org/standards/semanticweb/", desc: "W3C standards page covering RDF, OWL, SPARQL, and linked data — the web-scale infrastructure for machine-readable knowledge." }
        ]
      },
      {
        title: "Lectures & Surveys",
        items: [
          { title: "Knowledge Graphs (Stanford CS520)", author: "Vinay Chaudhri et al.", type: "course", level: "intermediate", url: "https://web.stanford.edu/class/cs520/", desc: "Stanford seminar covering knowledge graph construction, reasoning, embedding, and applications across industry." },
          { title: "A Survey of Knowledge Graph Embedding Methods", author: "Dai et al. (2020)", type: "notes", level: "advanced", url: "https://doi.org/10.1109/TKDE.2017.2754499", desc: "Comprehensive survey of KG embedding techniques including TransE, RotatE, ComplEx, and their theoretical properties." },
          { title: "Knowledge Representation and Reasoning (Brachman & Levesque lectures)", author: "Hector Levesque", type: "video", level: "intermediate", url: "https://www.youtube.com/results?search_query=Hector+Levesque+knowledge+representation", desc: "Lectures by Levesque covering the foundations of KR: expressiveness vs tractability, the frame problem, and closed-world reasoning." }
        ]
      }
    ]
  },

  /* ──────────────────── 1  STRUCTURAL KNOWLEDGE ──────────────────── */
  {
    id: "structural",
    icon: "\u2694",
    label: "Structural",
    intro: `
      <p><strong>Structural knowledge</strong> captures the <em>relationships between objects and
      concepts</em>&mdash;the connective tissue that gives meaning to isolated facts. In the Atlas
      diagram, structural knowledge is the web of typed edges between entities: <em>is-a</em>,
      <em>part-of</em>, <em>causes</em>, <em>adjacent-to</em>, <em>derived-from</em>.</p>

      <h3>Mapping to Charlotte</h3>
      <p>Structural knowledge maps directly to the <strong>EDGE</strong> primitive. Every EDGE in
      Charlotte carries a type, a direction, optional weights, and temporal bounds. The structural
      knowledge of a domain is the complete edge set of its knowledge graph&mdash;the topology of
      relationships that enables traversal, inference, and discovery.</p>

      <h3>Key Paradigms</h3>
      <ul>
        <li><strong>Semantic Networks</strong> &mdash; labelled directed graphs where nodes are concepts and edges are relations</li>
        <li><strong>Ontologies</strong> &mdash; formal specifications of conceptualisations with taxonomic (is-a) and mereological (part-of) hierarchies</li>
        <li><strong>Frame Systems</strong> &mdash; structured representations with slots, fillers, and inheritance</li>
        <li><strong>Conceptual Graphs</strong> &mdash; Sowa's bipartite graphs linking concept nodes through relation nodes</li>
        <li><strong>Property Graphs</strong> &mdash; the labeled property graph model used in Neo4j, with properties on both nodes and edges</li>
      </ul>
    `,
    subsections: [
      {
        title: "Semantic Networks & Ontologies",
        items: [
          { title: "Semantic Networks in Artificial Intelligence", author: "John F. Sowa (1992)", type: "notes", level: "intermediate", url: "https://www.jfsowa.com/pubs/semnet.htm", desc: "Sowa's definitive survey of semantic network formalisms from Quillian's Teachable Language Comprehender to modern conceptual graphs." },
          { title: "Ontology Development 101: A Guide to Creating Your First Ontology", author: "Noy & McGuinness (Stanford)", type: "notes", level: "beginner", url: "https://protege.stanford.edu/publications/ontology_development/ontology101.pdf", desc: "The classic practical guide to ontology engineering with Protege, covering classes, properties, constraints, and design patterns." },
          { title: "The Description Logic Handbook (2nd Ed.)", author: "Baader, Calvanese, McGuinness et al.", type: "book", level: "advanced", url: "https://www.cambridge.org/core/books/description-logic-handbook/9780521150118", desc: "Comprehensive reference on description logics — the formal foundation of OWL and modern ontology languages." },
          { title: "An Introduction to Description Logics", author: "Franz Baader & Werner Nutt", type: "notes", level: "intermediate", url: "https://lat.inf.tu-dresden.de/research/papers/2003/BaaderNutt-IntroToDL-KR.pdf", desc: "Accessible introduction to DL syntax, semantics, reasoning services, and the expressiveness-tractability trade-off." },
          { title: "Ontologies: A Silver Bullet for Knowledge Management and Electronic Commerce", author: "Dieter Fensel", type: "book", level: "intermediate", url: "https://link.springer.com/book/10.1007/978-3-662-09083-1", desc: "Early but influential monograph on the role of ontologies in enabling interoperability across knowledge systems." }
        ]
      },
      {
        title: "Graph Data Models & Property Graphs",
        items: [
          { title: "Graph Databases (2nd Ed.)", author: "Ian Robinson, Jim Webber & Emil Eifrem", type: "book", level: "beginner", url: "https://neo4j.com/graph-databases-book/", desc: "Free O'Reilly book introducing the property graph model, Cypher query language, and graph database design patterns." },
          { title: "RDF 1.1 Primer (W3C)", author: "W3C", type: "notes", level: "beginner", url: "https://www.w3.org/TR/rdf11-primer/", desc: "Official W3C primer on the Resource Description Framework — subject-predicate-object triples as the atomic unit of structural knowledge." },
          { title: "SPARQL 1.1 Query Language (W3C)", author: "W3C", type: "notes", level: "intermediate", url: "https://www.w3.org/TR/sparql11-query/", desc: "The W3C specification for querying RDF graphs. SPARQL is the SQL of the semantic web." },
          { title: "Property Graph Model (ISO GQL & SQL/PGQ)", author: "ISO / Deutsch et al.", type: "notes", level: "advanced", url: "https://doi.org/10.1145/3183713.3190657", desc: "Academic foundation for the ISO Graph Query Language standard, unifying property graph models across database systems." }
        ]
      },
      {
        title: "Knowledge Graph Construction & Link Prediction",
        items: [
          { title: "Translating Embeddings for Modeling Multi-relational Data (TransE)", author: "Bordes et al. (2013)", type: "notes", level: "advanced", url: "https://proceedings.neurips.cc/paper/2013/hash/1cecc7a77928ca8133fa24680a88d2f9-Abstract.html", desc: "The foundational KG embedding paper: model relations as translations in embedding space (h + r ≈ t). Over 10,000 citations." },
          { title: "RotatE: Knowledge Graph Embedding by Relational Rotation in Complex Space", author: "Sun et al. (2019)", type: "notes", level: "advanced", url: "https://openreview.net/forum?id=HkgEQnRqYQ", desc: "Models relations as rotations in complex vector space, capturing symmetry, antisymmetry, inversion, and composition patterns." },
          { title: "Knowledge Graph Completion via Complex Tensor Factorization (ComplEx)", author: "Trouillon et al. (2016)", type: "notes", level: "advanced", url: "https://jmlr.org/papers/v18/16-563.html", desc: "Complex-valued tensor factorization for KG link prediction, handling asymmetric relations through complex conjugation." },
          { title: "A Review of Relational Machine Learning for Knowledge Graphs", author: "Nickel et al. (2016)", type: "notes", level: "intermediate", url: "https://doi.org/10.1109/JPROC.2015.2483592", desc: "IEEE Proceedings survey covering statistical relational learning, tensor factorization, and neural approaches for KG completion." }
        ]
      }
    ]
  },

  /* ──────────────────── 2  DECLARATIVE KNOWLEDGE ──────────────────── */
  {
    id: "declarative",
    icon: "\u25CB",
    label: "Declarative",
    intro: `
      <p><strong>Declarative knowledge</strong> is <em>object facts</em>&mdash;assertions about
      entities that are true or false independent of any process. It is the "what" of knowledge:
      a violin's maker, a pig's genotype, a venue's capacity, a star's luminosity.</p>

      <h3>Mapping to Charlotte</h3>
      <p>Declarative knowledge maps to the <strong>NODE</strong> primitive. Each NODE in Charlotte
      carries an identity and a set of typed attributes&mdash;key-value pairs that constitute the
      declarative facts about that entity. In the FINN architecture (Paper 1), these facts are
      versioned over time, creating a temporal record of what was known and when.</p>

      <h3>Traditions</h3>
      <ul>
        <li><strong>Logic-based</strong> &mdash; first-order logic, propositional calculus, Datalog</li>
        <li><strong>Frame-based</strong> &mdash; Minsky's frames, KL-ONE, slots and fillers</li>
        <li><strong>Database-theoretic</strong> &mdash; relational model, entity-attribute-value stores</li>
        <li><strong>Encyclopaedic</strong> &mdash; Wikidata, Cyc, YAGO, DBpedia as large-scale fact stores</li>
      </ul>
    `,
    subsections: [
      {
        title: "Logic & Formal Foundations",
        items: [
          { title: "Introduction to Mathematical Logic (6th Ed.)", author: "Elliott Mendelson", type: "book", level: "intermediate", url: "https://www.routledge.com/Introduction-to-Mathematical-Logic/Mendelson/p/book/9781482237726", desc: "Classic textbook on propositional and predicate logic, completeness, incompleteness, and model theory — the foundation of declarative knowledge." },
          { title: "Logic for Computer Science: Foundations of Automatic Theorem Proving", author: "Jean Gallier", type: "book", level: "intermediate", url: "https://www.cis.upenn.edu/~jean/gbooks/logic.html", desc: "Free textbook covering resolution, unification, Herbrand's theorem, and automated reasoning — the computational engine behind declarative knowledge." },
          { title: "Datalog and Recursive Query Processing", author: "Todd J. Green et al. (2013)", type: "notes", level: "intermediate", url: "https://doi.org/10.1561/1900000017", desc: "Survey of Datalog as a knowledge representation language: stratified negation, aggregation, and modern implementations." },
          { title: "What is a Knowledge Base? (Levesque 1986)", author: "Hector Levesque", type: "notes", level: "advanced", url: "https://www.cs.toronto.edu/~hector/Papers/whatis.pdf", desc: "Foundational paper distinguishing a knowledge base (declarative semantics) from a database (extensional semantics)." }
        ]
      },
      {
        title: "Large-Scale Knowledge Bases",
        items: [
          { title: "Wikidata: A Free Collaborative Knowledgebase", author: "Vrandecic & Krotzsch (2014)", type: "notes", level: "beginner", url: "https://doi.org/10.1145/2629489", desc: "The foundational paper on Wikidata — the free, multilingual knowledge base with 100M+ items serving as structured backbone of Wikipedia." },
          { title: "DBpedia: A Large-Scale, Multilingual Knowledge Base", author: "Lehmann et al. (2015)", type: "notes", level: "intermediate", url: "https://doi.org/10.3233/SW-140134", desc: "Describes DBpedia's extraction framework, ontology, and interlinks. One of the central hubs of the Linked Open Data cloud." },
          { title: "YAGO: A Core of Semantic Knowledge", author: "Suchanek, Kasneci & Weikum (2007)", type: "notes", level: "intermediate", url: "https://doi.org/10.1145/1242572.1242667", desc: "Introduces YAGO, unifying WordNet taxonomy with Wikipedia facts into a high-precision knowledge base with 120M+ facts." },
          { title: "Freebase: A Collaboratively Created Graph Database for Structuring Human Knowledge", author: "Bollacker et al. (2008)", type: "notes", level: "intermediate", url: "https://doi.org/10.1145/1376616.1376746", desc: "The Freebase paper — the collaborative structured knowledge project that became Google's Knowledge Graph." },
          { title: "Cyc: A Large-Scale Investment in Knowledge Infrastructure", author: "Douglas Lenat (1995)", type: "notes", level: "intermediate", url: "https://doi.org/10.1145/219717.219745", desc: "Lenat's overview of the Cyc project — the ambitious 30+ year effort to encode common-sense declarative knowledge in formal logic." }
        ]
      },
      {
        title: "Fact Extraction & Knowledge Base Construction",
        items: [
          { title: "Knowledge Vault: A Web-Scale Approach to Probabilistic Knowledge Fusion", author: "Dong et al. (Google, 2014)", type: "notes", level: "advanced", url: "https://doi.org/10.1145/2623330.2623623", desc: "Google's probabilistic approach to extracting and fusing facts from web text, DOM structure, and existing KBs at web scale." },
          { title: "OpenIE: Open Information Extraction from the Web", author: "Banko et al. (2007)", type: "notes", level: "intermediate", url: "https://dl.acm.org/doi/10.5555/1625275.1625705", desc: "Seminal paper on domain-independent relation extraction from text — extracting (subject, relation, object) triples without pre-defined schemas." },
          { title: "DeepDive: A Knowledge Management System for Science", author: "Zhang et al. (2017)", type: "notes", level: "intermediate", url: "https://doi.org/10.1109/TKDE.2017.2697432", desc: "Stanford's system for constructing knowledge bases from dark data using statistical inference, distant supervision, and user feedback." },
          { title: "Knowledge Base Population (TAC-KBP)", author: "NIST / TAC", type: "data", level: "intermediate", url: "https://tac.nist.gov/", desc: "NIST's Text Analysis Conference benchmark for extracting entities, relations, and events from text to populate knowledge bases." }
        ]
      }
    ]
  },

  /* ──────────────────── 3  PROCEDURAL KNOWLEDGE ──────────────────── */
  {
    id: "procedural",
    icon: "\u2699",
    label: "Procedural",
    intro: `
      <p><strong>Procedural knowledge</strong> is the knowledge of <em>rules and procedures</em>&mdash;
      how to do things, what steps to follow, under what conditions to act. It is the "how" of
      knowledge: the recipe, the workflow, the algorithm, the business rule.</p>

      <h3>Mapping to Charlotte</h3>
      <p>Procedural knowledge maps to the <strong>PROTOCOL</strong> primitive. In Charlotte, a
      PROTOCOL is a named, versioned rule that governs graph evolution: when a SIGNAL arrives
      matching condition X, execute action Y. Protocols encode business logic, validation
      constraints, state machines, and transformation pipelines&mdash;all the procedural knowledge
      a domain needs to operate.</p>

      <h3>Traditions</h3>
      <ul>
        <li><strong>Production systems</strong> &mdash; if-then rules with conflict resolution (OPS5, CLIPS, ACT-R, Drools)</li>
        <li><strong>Planning</strong> &mdash; STRIPS, PDDL, hierarchical task networks</li>
        <li><strong>Process algebras</strong> &mdash; CCS, CSP, pi-calculus for concurrent processes</li>
        <li><strong>Workflow engines</strong> &mdash; BPMN, state machines, event-driven architectures</li>
        <li><strong>Constraint programming</strong> &mdash; encoding procedural constraints as declarative specifications</li>
      </ul>
    `,
    subsections: [
      {
        title: "Production Systems & Rule Engines",
        items: [
          { title: "Production Systems and Rule-Based Inference", author: "Brownston, Farrell, Kant & Martin", type: "book", level: "intermediate", url: "https://dl.acm.org/doi/book/10.5555/4944", desc: "Classic reference on production system architectures: working memory, conflict resolution, the Rete algorithm, and OPS5." },
          { title: "The Rete Match Algorithm", author: "Charles Forgy (1982)", type: "notes", level: "advanced", url: "https://doi.org/10.1016/0004-3702(82)90020-0", desc: "The original paper on the Rete algorithm — the efficient pattern-matching algorithm at the heart of production rule systems." },
          { title: "CLIPS Reference Manual", author: "NASA / Gary Riley", type: "code", level: "intermediate", url: "https://www.clipsrules.net/", desc: "CLIPS (C Language Integrated Production System) — NASA's expert system shell, still the standard teaching tool for rule-based AI." },
          { title: "Drools: Business Rules Management System", author: "Red Hat / KIE Group", type: "code", level: "intermediate", url: "https://www.drools.org/", desc: "Open-source Java rule engine implementing the Rete algorithm. Widely used in enterprise for encoding procedural business logic." }
        ]
      },
      {
        title: "Planning & Automated Reasoning",
        items: [
          { title: "Automated Planning: Theory and Practice", author: "Ghallab, Nau & Traverso", type: "book", level: "intermediate", url: "https://www.elsevier.com/books/automated-planning/ghallab/978-1-55860-856-6", desc: "The definitive textbook on AI planning covering STRIPS, partial-order planning, hierarchical task networks, and planning under uncertainty." },
          { title: "STRIPS: A New Approach to the Application of Theorem Proving to Problem Solving", author: "Fikes & Nilsson (1971)", type: "notes", level: "intermediate", url: "https://doi.org/10.1016/0004-3702(71)90010-5", desc: "The foundational planning paper introducing preconditions and effects as the formalism for procedural knowledge of actions." },
          { title: "PDDL — The Planning Domain Definition Language", author: "McDermott et al. (1998)", type: "notes", level: "intermediate", url: "https://planning.wiki/ref/pddl", desc: "The standard language for encoding planning domains, used across the International Planning Competition. Encodes procedural knowledge as action schemas." },
          { title: "Hierarchical Task Network Planning: Formalization, Analysis, and Implementation", author: "Erol, Hendler & Nau (1994)", type: "notes", level: "advanced", url: "https://doi.org/10.1016/0004-3702(94)90022-1", desc: "Formal treatment of HTN planning — decomposing complex procedures into sub-tasks, the closest planning formalism to human procedural knowledge." }
        ]
      },
      {
        title: "Workflow, State Machines & Process Modelling",
        items: [
          { title: "Business Process Model and Notation (BPMN 2.0)", author: "OMG", type: "notes", level: "beginner", url: "https://www.omg.org/spec/BPMN/2.0/", desc: "The OMG standard for graphically modelling business processes — the industry-standard language for encoding procedural knowledge in organisations." },
          { title: "Communicating Sequential Processes", author: "C.A.R. Hoare", type: "book", level: "advanced", url: "http://www.usingcsp.com/cspbook.pdf", desc: "Hoare's landmark work on process algebra — a formal language for describing concurrent procedural interactions. Free PDF." },
          { title: "XState: State Machines and Statecharts for JavaScript", author: "David Khourshid", type: "code", level: "beginner", url: "https://xstate.js.org/", desc: "Modern implementation of Harel statecharts in JavaScript/TypeScript — encoding procedural UI and system logic as finite state machines." },
          { title: "Statecharts: A Visual Formalism for Complex Systems", author: "David Harel (1987)", type: "notes", level: "intermediate", url: "https://doi.org/10.1016/0167-6423(87)90035-9", desc: "Harel's influential paper extending finite state machines with hierarchy, concurrency, and history — the theoretical basis for UML state diagrams." }
        ]
      }
    ]
  },

  /* ──────────────────── 4  HEURISTIC KNOWLEDGE ──────────────────── */
  {
    id: "heuristic",
    icon: "\u2248",
    label: "Heuristic",
    intro: `
      <p><strong>Heuristic knowledge</strong> is the domain of <em>rules of thumb</em>&mdash;
      approximate, experience-derived guidelines that work well in practice without being formally
      provable. Heuristics bridge the gap between perfect theoretical knowledge and the messy
      realities of bounded computation and incomplete information.</p>

      <h3>Mapping to Charlotte</h3>
      <p>Heuristic knowledge maps to <strong>SIGNAL</strong> and <strong>METRIC</strong> primitives.
      A SIGNAL is a timestamped observation — an empirical data point that may be noisy,
      incomplete, or approximate. A METRIC is a quantitative measurement derived from signals.
      Together they form the heuristic substrate: the system does not have perfect declarative
      facts, but it has approximate observations from which it can reason heuristically.</p>

      <h3>Key Traditions</h3>
      <ul>
        <li><strong>Expert Systems</strong> &mdash; encoding expert heuristics as weighted rules with certainty factors</li>
        <li><strong>Bounded Rationality</strong> &mdash; Simon's framework for satisficing under cognitive limits</li>
        <li><strong>Heuristic Search</strong> &mdash; A*, beam search, and admissible heuristic functions</li>
        <li><strong>Fuzzy Logic</strong> &mdash; Zadeh's framework for reasoning with graded truth values</li>
        <li><strong>Probabilistic Reasoning</strong> &mdash; Bayesian networks, Markov models, uncertain inference</li>
      </ul>
    `,
    subsections: [
      {
        title: "Expert Systems & Certainty Reasoning",
        items: [
          { title: "Rule-Based Expert Systems: The MYCIN Experiments", author: "Buchanan & Shortliffe (Eds.)", type: "book", level: "intermediate", url: "https://people.dbmi.columbia.edu/~ehs7001/Buchanan-Shortliffe-1984/MYCIN%20Book.htm", desc: "The definitive account of MYCIN — the landmark expert system for antibiotic therapy, introducing certainty factors for heuristic reasoning." },
          { title: "Expert Systems: Principles and Programming", author: "Giarratano & Riley", type: "book", level: "beginner", url: "https://www.cengage.com/c/expert-systems-4e-giarratano/9780534384470/", desc: "Standard textbook on expert system design covering forward/backward chaining, certainty factors, and CLIPS programming." },
          { title: "The Delphi Method: Techniques and Applications", author: "Linstone & Turoff (Eds.)", type: "book", level: "intermediate", url: "https://web.njit.edu/~turMDoff/pubs/delphibook/", desc: "Classic reference on structured expert elicitation — systematically extracting heuristic knowledge from human experts." },
          { title: "Heuristics: Intelligent Search Strategies for Computer Problem Solving", author: "Judea Pearl", type: "book", level: "advanced", url: "https://www.pearson.com/en-us/subject-catalog/p/heuristics-intelligent-search-strategies-for-computer-problem-solving/P200000003530", desc: "Pearl's early masterwork on heuristic search: A*, branch-and-bound, and the theory of admissible heuristics." }
        ]
      },
      {
        title: "Bounded Rationality & Cognitive Heuristics",
        items: [
          { title: "Models of Bounded Rationality (Vols 1-3)", author: "Herbert A. Simon", type: "book", level: "advanced", url: "https://mitpress.mit.edu/9780262193726/models-of-bounded-rationality-volume-3/", desc: "Simon's collected works on bounded rationality, satisficing, and the adaptive toolbox — the theoretical foundation of heuristic reasoning." },
          { title: "Judgment Under Uncertainty: Heuristics and Biases", author: "Kahneman, Slovic & Tversky (Eds.)", type: "book", level: "intermediate", url: "https://www.cambridge.org/core/books/judgment-under-uncertainty/5F2C8FFD09766B8E2B85B5B00D3B0B20", desc: "The landmark collection of papers on representativeness, availability, anchoring, and other cognitive heuristics that shape human judgment." },
          { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", type: "book", level: "beginner", url: "https://us.macmillan.com/books/9780374533557/thinkingfastandslow", desc: "Kahneman's popular masterwork on dual-process theory — System 1 (heuristic, fast) vs System 2 (deliberate, slow) thinking." },
          { title: "Simple Heuristics That Make Us Smart", author: "Gigerenzer, Todd & the ABC Research Group", type: "book", level: "intermediate", url: "https://global.oup.com/academic/product/simple-heuristics-that-make-us-smart-9780195143812", desc: "The 'fast and frugal heuristics' programme showing that simple heuristics can outperform complex optimization in uncertain environments." },
          { title: "Ecological Rationality: Intelligence in the World", author: "Todd & Gigerenzer (2012)", type: "notes", level: "intermediate", url: "https://doi.org/10.1093/acprof:oso/9780195315448.001.0001", desc: "Framework for understanding when and why heuristics succeed by matching their structure to environmental regularities." }
        ]
      },
      {
        title: "Fuzzy Logic & Approximate Reasoning",
        items: [
          { title: "Fuzzy Sets", author: "Lotfi Zadeh (1965)", type: "notes", level: "intermediate", url: "https://doi.org/10.1016/S0019-9958(65)90241-X", desc: "Zadeh's foundational paper introducing fuzzy sets — graded membership functions that formalize heuristic vagueness." },
          { title: "Fuzzy Logic with Engineering Applications (4th Ed.)", author: "Timothy J. Ross", type: "book", level: "intermediate", url: "https://www.wiley.com/en-us/Fuzzy+Logic+with+Engineering+Applications,+4th+Edition-p-9781119235866", desc: "Standard engineering textbook on fuzzy sets, fuzzy inference systems, and fuzzy control — the applied side of heuristic knowledge." },
          { title: "Probabilistic Reasoning in Intelligent Systems: Networks of Plausible Inference", author: "Judea Pearl", type: "book", level: "advanced", url: "https://www.elsevier.com/books/probabilistic-reasoning-in-intelligent-systems/pearl/978-0-08-051489-5", desc: "Pearl's seminal work on Bayesian networks — the formal framework for propagating heuristic beliefs through graphical models." },
          { title: "An Introduction to Bayesian Networks", author: "Finn V. Jensen & Thomas D. Nielsen", type: "book", level: "intermediate", url: "https://link.springer.com/book/10.1007/978-0-387-68282-2", desc: "Accessible textbook on Bayesian network construction, inference algorithms, and applications to uncertain heuristic reasoning." }
        ]
      }
    ]
  },

  /* ──────────────────── 5  META KNOWLEDGE ──────────────────── */
  {
    id: "meta",
    icon: "\u221E",
    label: "Meta",
    intro: `
      <p><strong>Meta knowledge</strong> is <em>knowledge about knowledge</em>&mdash;the system's
      awareness of what it knows, what it doesn't know, how reliable its knowledge is, and how
      to acquire more. It is the self-reflective layer that enables a knowledge system to reason
      about its own capabilities and limitations.</p>

      <h3>Mapping to Charlotte</h3>
      <p>Meta knowledge is not a single primitive — it is the <strong>system reflecting on
      itself</strong>. In Charlotte, meta knowledge manifests as: nodes that describe other nodes
      (schema definitions), edges that annotate other edges (provenance, confidence), metrics
      that quantify graph coverage and completeness, and protocols that govern other protocols
      (meta-rules for conflict resolution). Paper 10 (<em>Lifecycle</em>) explicitly addresses
      how the graph tracks what it has learned and forgotten over time.</p>

      <h3>Dimensions of Meta Knowledge</h3>
      <ul>
        <li><strong>Epistemic status</strong> &mdash; certainty, confidence, provenance of individual facts</li>
        <li><strong>Completeness awareness</strong> &mdash; open-world vs closed-world assumptions, known unknowns</li>
        <li><strong>Schema & ontology</strong> &mdash; the structural definition of what kinds of knowledge are possible</li>
        <li><strong>Metacognition</strong> &mdash; monitoring and controlling one's own reasoning processes</li>
        <li><strong>Knowledge evolution</strong> &mdash; versioning, belief revision, truth maintenance</li>
      </ul>
    `,
    subsections: [
      {
        title: "Epistemology & Philosophy of Knowledge",
        items: [
          { title: "Epistemology: A Contemporary Introduction to the Theory of Knowledge", author: "Robert Audi", type: "book", level: "beginner", url: "https://www.routledge.com/Epistemology-A-Contemporary-Introduction-to-the-Theory-of-Knowledge/Audi/p/book/9780415879231", desc: "Leading introductory textbook covering justified true belief, Gettier problems, foundationalism, coherentism, and reliabilism." },
          { title: "The Structure of Scientific Revolutions", author: "Thomas Kuhn", type: "book", level: "beginner", url: "https://press.uchicago.edu/ucp/books/book/chicago/S/bo13179781.html", desc: "Kuhn's paradigm-shifting work on how scientific knowledge evolves through normal science, crisis, and paradigm shifts — meta knowledge at civilisational scale." },
          { title: "On Certainty", author: "Ludwig Wittgenstein", type: "book", level: "advanced", url: "https://www.wiley.com/en-us/On+Certainty-p-9780631169406", desc: "Wittgenstein's final work examining the foundations of knowledge — what it means to 'know' something and the role of bedrock propositions." },
          { title: "Metacognition (Stanford Encyclopedia)", author: "SEP / Joelle Proust", type: "notes", level: "intermediate", url: "https://plato.stanford.edu/entries/metacognition/", desc: "Comprehensive philosophical survey of metacognition: monitoring, control, and the relationship between knowing and knowing that you know." }
        ]
      },
      {
        title: "Belief Revision & Truth Maintenance",
        items: [
          { title: "On the Logic of Theory Change: Partial Meet Contraction and Revision Functions (AGM)", author: "Alchourron, Gardenfors & Makinson (1985)", type: "notes", level: "advanced", url: "https://doi.org/10.2307/2274239", desc: "The AGM paper — the foundational framework for belief revision, defining rational postulates for how knowledge bases should change when new information arrives." },
          { title: "Knowledge in Flux: Modeling the Dynamics of Epistemic States", author: "Peter Gardenfors", type: "book", level: "advanced", url: "https://mitpress.mit.edu/9780262071116/knowledge-in-flux/", desc: "Book-length treatment of belief revision theory: expansion, contraction, revision, and the epistemic entrenchment ordering." },
          { title: "A Truth Maintenance System", author: "Jon Doyle (1979)", type: "notes", level: "advanced", url: "https://doi.org/10.1016/0004-3702(79)90008-0", desc: "The original TMS paper — maintaining consistency of beliefs and their justifications, enabling non-monotonic reasoning and dependency-directed backtracking." },
          { title: "An Assumption-based Truth Maintenance System (ATMS)", author: "Johan de Kleer (1986)", type: "notes", level: "advanced", url: "https://doi.org/10.1016/0004-3702(86)90080-9", desc: "De Kleer's ATMS — tracking all possible consistent belief sets simultaneously, enabling efficient hypothetical reasoning about what is known." }
        ]
      },
      {
        title: "Schema, Provenance & Knowledge Quality",
        items: [
          { title: "PROV-O: The PROV Ontology (W3C)", author: "W3C Provenance Working Group", type: "notes", level: "intermediate", url: "https://www.w3.org/TR/prov-o/", desc: "W3C standard for representing provenance of knowledge — who created it, how, when, and from what sources. Essential meta knowledge infrastructure." },
          { title: "Data Quality: Concepts, Methodologies and Techniques", author: "Batini & Scannapieco", type: "book", level: "intermediate", url: "https://link.springer.com/book/10.1007/978-3-540-33173-5", desc: "Comprehensive treatment of data quality dimensions (accuracy, completeness, timeliness, consistency) — the quantitative side of meta knowledge." },
          { title: "OWL 2 Web Ontology Language Primer (W3C)", author: "W3C OWL Working Group", type: "notes", level: "intermediate", url: "https://www.w3.org/TR/owl2-primer/", desc: "The W3C OWL 2 primer — defining what kinds of knowledge are expressible in a domain, the schema-level meta knowledge." },
          { title: "Knowledge Graph Refinement: A Survey of Approaches and Evaluation Methods", author: "Paulheim (2017)", type: "notes", level: "intermediate", url: "https://doi.org/10.3233/SW-160218", desc: "Survey of methods for assessing and improving KG quality: completeness estimation, error detection, and type prediction." },
          { title: "Open World Assumption (SEP entry on Logic and Databases)", author: "SEP / Raymond Reiter", type: "notes", level: "intermediate", url: "https://plato.stanford.edu/entries/logic-ai/", desc: "Philosophical treatment of open vs closed world assumptions — the fundamental meta-knowledge decision about what absence of information means." }
        ]
      }
    ]
  },

  /* ──────────────────── 6  KNOWLEDGE ENGINEERING ──────────────────── */
  {
    id: "engineering",
    icon: "\u2692",
    label: "Engineering",
    intro: `
      <p><strong>Knowledge engineering</strong> is the discipline of eliciting, formalising, and
      deploying knowledge in computational systems. It is the practical craft that turns the five
      knowledge types into working software.</p>

      <h3>The Knowledge Engineering Pipeline</h3>
      <ul>
        <li><strong>Elicitation</strong> &mdash; extracting knowledge from domain experts, documents, and data</li>
        <li><strong>Formalisation</strong> &mdash; encoding knowledge in machine-readable representations</li>
        <li><strong>Validation</strong> &mdash; verifying knowledge correctness, completeness, and consistency</li>
        <li><strong>Deployment</strong> &mdash; integrating knowledge into operational systems</li>
        <li><strong>Maintenance</strong> &mdash; updating knowledge as the world changes</li>
      </ul>

      <h3>Charlotte's Validation Domains</h3>
      <p>Charlotte validates across seven operational domains: LineLeap (human/social), Industrial
      Service Group (mechanical), Prier Violins (cultural/artisan), Top Tier Moving (logistics),
      Constellation (memory), Sounder/Trogdon (biological), and Sea Lion (marine). Each domain
      stress-tests different aspects of the knowledge engineering pipeline.</p>
    `,
    subsections: [
      {
        title: "Knowledge Elicitation & Acquisition",
        items: [
          { title: "Knowledge Acquisition in Practice: A Step-by-step Guide", author: "Shadbolt, Smart & Wilson", type: "book", level: "beginner", url: "https://link.springer.com/book/10.1007/978-1-84628-667-0", desc: "Practical guide to structured knowledge elicitation techniques: interviews, protocol analysis, card sorting, and repertory grids." },
          { title: "A Practical Guide to Knowledge Acquisition", author: "Scott, Clayton & Gibson", type: "book", level: "beginner", url: "https://www.springer.com/gp/book/9781461283546", desc: "Classic reference on knowledge acquisition methodology for building expert systems, covering task analysis and structured interviews." },
          { title: "Ontology Learning from Text: Methods, Evaluation, and Applications", author: "Cimiano (2006)", type: "book", level: "advanced", url: "https://link.springer.com/book/10.1007/978-0-387-39252-3", desc: "Methods for automatically extracting ontological knowledge from unstructured text — bridging NLP and knowledge engineering." },
          { title: "Knowledge Elicitation Techniques (SEP)", author: "SEP / Various", type: "notes", level: "beginner", url: "https://plato.stanford.edu/entries/knowledge-how/", desc: "Philosophical perspective on knowledge-how vs knowledge-that, relevant to eliciting procedural vs declarative knowledge from experts." }
        ]
      },
      {
        title: "Ontology Engineering & Design Patterns",
        items: [
          { title: "Ontology Design Patterns (ODP)", author: "ontologydesignpatterns.org", type: "notes", level: "intermediate", url: "http://ontologydesignpatterns.org/", desc: "Community catalogue of reusable ontology design patterns — best practices for encoding structural and declarative knowledge." },
          { title: "A Pattern-Based Method for Building Ontologies", author: "Blomqvist & Sandkuhl (2005)", type: "notes", level: "intermediate", url: "https://doi.org/10.1007/11575863_45", desc: "Methodology for using ontology design patterns to systematically build domain ontologies — knowledge engineering as pattern composition." },
          { title: "Protege Ontology Editor", author: "Stanford BMIR", type: "code", level: "beginner", url: "https://protege.stanford.edu/", desc: "The most widely-used open-source ontology editor, supporting OWL 2 and SWRL rules. The de facto tool for knowledge engineers." },
          { title: "The Semantic Web — ISWC Conference Proceedings", author: "Various (Annual)", type: "notes", level: "advanced", url: "https://iswc2024.semanticweb.org/", desc: "Proceedings of the International Semantic Web Conference — the premier venue for knowledge engineering research." }
        ]
      },
      {
        title: "Knowledge Graph Platforms & Tools",
        items: [
          { title: "Neo4j Graph Database", author: "Neo4j Inc.", type: "code", level: "beginner", url: "https://neo4j.com/", desc: "The leading property graph database with Cypher query language. Over 800 enterprise customers using knowledge graphs in production." },
          { title: "Apache Jena: A Semantic Web Framework for Java", author: "Apache Foundation", type: "code", level: "intermediate", url: "https://jena.apache.org/", desc: "Full-featured RDF/OWL framework with SPARQL engine, reasoner, and TDB triple store. The workhorse of semantic web applications." },
          { title: "Stardog: Enterprise Knowledge Graph Platform", author: "Stardog Union", type: "code", level: "intermediate", url: "https://www.stardog.com/", desc: "Enterprise KG platform supporting OWL reasoning, SPARQL, GraphQL, and virtual knowledge graphs over relational sources." },
          { title: "Amazon Neptune / Azure Cosmos DB (Graph)", author: "AWS / Microsoft", type: "code", level: "intermediate", url: "https://aws.amazon.com/neptune/", desc: "Cloud-native graph database services supporting both property graph (Gremlin/openCypher) and RDF (SPARQL) models at scale." }
        ]
      }
    ]
  },

  /* ──────────────────── 7  DATASETS & BENCHMARKS ──────────────────── */
  {
    id: "datasets",
    icon: "\u262C",
    label: "Datasets & Benchmarks",
    intro: `
      <p>Benchmarks and datasets are the empirical backbone of knowledge systems research. They
      enable reproducible evaluation of knowledge representation, reasoning, extraction, and
      completion methods.</p>

      <h3>Benchmark Categories</h3>
      <ul>
        <li><strong>Link prediction</strong> &mdash; FB15k-237, WN18RR, YAGO3-10 for KG completion</li>
        <li><strong>Question answering</strong> &mdash; testing knowledge retrieval and reasoning over KGs</li>
        <li><strong>Ontology alignment</strong> &mdash; matching concepts across heterogeneous knowledge bases</li>
        <li><strong>Knowledge extraction</strong> &mdash; TAC-KBP, SemEval for information extraction from text</li>
      </ul>
    `,
    subsections: [
      {
        title: "Knowledge Graph Benchmarks",
        items: [
          { title: "FB15k-237: A Filtered Version of FB15k", author: "Toutanova & Chen (2015)", type: "data", level: "intermediate", url: "https://www.microsoft.com/en-us/download/details.aspx?id=52312", desc: "Standard benchmark for KG link prediction, derived from Freebase with test leakage removed. 14,541 entities, 237 relations." },
          { title: "WN18RR: A Reinvestigation of WordNet-based KG Benchmarks", author: "Dettmers et al. (2018)", type: "data", level: "intermediate", url: "https://github.com/TimDettmers/ConvE", desc: "Cleaned WordNet benchmark for link prediction. 40,943 entities and 11 relations capturing lexical relationships." },
          { title: "OGBL-WikiKG2 (Open Graph Benchmark)", author: "Hu et al. (2021)", type: "data", level: "advanced", url: "https://ogb.stanford.edu/docs/linkprop/#ogbl-wikikg2", desc: "Large-scale Wikidata-based KG benchmark with 2.5M entities, 535 relations, and 17M triples for realistic link prediction evaluation." },
          { title: "Freebase/Wikidata Entity Linking Benchmarks", author: "Various", type: "data", level: "intermediate", url: "https://www.wikidata.org/wiki/Wikidata:Tools/For_programmers", desc: "Collection of entity linking and disambiguation benchmarks built on Wikidata, testing the ability to ground text mentions to KG entities." }
        ]
      },
      {
        title: "Question Answering over Knowledge",
        items: [
          { title: "SimpleQuestions: A Resource for Question Answering over KGs", author: "Bordes et al. (2015)", type: "data", level: "beginner", url: "https://research.facebook.com/downloads/babi/", desc: "108K simple factual questions paired with Freebase triples. The foundational benchmark for single-hop KGQA." },
          { title: "ComplexWebQuestions: Multi-Hop QA over Knowledge Graphs", author: "Talmor & Berant (2018)", type: "data", level: "intermediate", url: "https://www.tau-nlp.sites.tau.ac.il/compwebq", desc: "34K complex questions requiring multi-hop reasoning, comparison, and aggregation over a knowledge graph." },
          { title: "WebQuestionsSP: Semantic Parsing on Freebase", author: "Yih et al. (2016)", type: "data", level: "intermediate", url: "https://www.microsoft.com/en-us/research/publication/the-value-of-semantic-parse-labeling/", desc: "4,737 questions with SPARQL annotations over Freebase, bridging NL understanding and structured knowledge retrieval." },
          { title: "KGQA Survey: Knowledge Graph Question Answering", author: "Lan et al. (2021)", type: "notes", level: "intermediate", url: "https://doi.org/10.1145/3512467", desc: "Comprehensive survey of KGQA methods: semantic parsing, embedding-based, and retrieval-augmented approaches." }
        ]
      },
      {
        title: "Reasoning & Commonsense Benchmarks",
        items: [
          { title: "ATOMIC: An Atlas of Machine Commonsense for If-Then Reasoning", author: "Sap et al. (2019)", type: "data", level: "intermediate", url: "https://homes.cs.washington.edu/~msap/atomic/", desc: "877K inferential knowledge tuples covering causes, effects, mental states — a commonsense knowledge graph for heuristic reasoning." },
          { title: "ConceptNet 5.5: An Open Multilingual Graph of General Knowledge", author: "Speer, Chin & Havasi (2017)", type: "data", level: "beginner", url: "https://conceptnet.io/", desc: "Large-scale commonsense knowledge graph with 21M edges across 36 relation types. Links to WordNet, DBpedia, and Wikidata." },
          { title: "CommonsenseQA: A Question Answering Challenge Targeting World Knowledge", author: "Talmor et al. (2019)", type: "data", level: "intermediate", url: "https://www.tau-nlp.sites.tau.ac.il/commonsenseqa", desc: "12K multiple-choice questions requiring commonsense reasoning, sourced from ConceptNet relation triples." },
          { title: "RuleTaker: Probing Neural Models for Compositional Reasoning", author: "Clark et al. (2020)", type: "data", level: "advanced", url: "https://allenai.org/data/ruletaker", desc: "Benchmark testing whether language models can follow logical rules and derive conclusions — probing procedural and meta knowledge in neural systems." }
        ]
      }
    ]
  }
];

/* ──────────────────── rendering engine ──────────────────── */

const tabBar     = document.getElementById("tab-bar");
const mainEl     = document.getElementById("main-content");
const searchIn   = document.getElementById("search-input");
const searchClr  = document.getElementById("search-clear");
const statCount  = document.getElementById("stat-count");

let activeTab    = SECTIONS[0].id;
let activeFilter = "all";
let searchQuery  = "";

/* count total resources */
const totalResources = SECTIONS.reduce((n, s) => n + s.subsections.reduce((m, sub) => m + sub.items.length, 0), 0);
statCount.textContent = totalResources;

/* ── build tabs ── */
function buildTabs() {
  tabBar.innerHTML = "";
  SECTIONS.forEach(sec => {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (sec.id === activeTab ? " active" : "");
    btn.innerHTML = `<span class="tab-icon">${sec.icon}</span><span class="tab-label">${sec.label}</span>`;
    btn.onclick = () => { activeTab = sec.id; activeFilter = "all"; render(); };
    tabBar.appendChild(btn);
  });
}

/* ── highlight helper ── */
function hl(text, q) {
  if (!q) return text;
  const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${esc})`, "gi"), "<mark>$1</mark>");
}

/* ── render section ── */
function render() {
  buildTabs();
  const sec = SECTIONS.find(s => s.id === activeTab);
  if (!sec) return;

  /* gather unique types for filter bar */
  const types = new Set();
  sec.subsections.forEach(sub => sub.items.forEach(it => types.add(it.type)));

  let html = `<div class="section-header"><h2><span class="section-icon">${sec.icon}</span>${sec.label}</h2></div>`;
  html += `<div class="section-intro">${sec.intro}</div>`;

  /* filter bar */
  html += `<div class="filter-bar">`;
  html += `<button class="filter-btn${activeFilter === "all" ? " active" : ""}" data-filter="all">All</button>`;
  types.forEach(t => {
    html += `<button class="filter-btn${activeFilter === t ? " active" : ""}" data-filter="${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</button>`;
  });
  html += `</div>`;

  /* subsections & cards */
  sec.subsections.forEach(sub => {
    const filtered = sub.items.filter(it => {
      if (activeFilter !== "all" && it.type !== activeFilter) return false;
      if (searchQuery) {
        const hay = (it.title + " " + it.author + " " + it.desc).toLowerCase();
        return hay.includes(searchQuery);
      }
      return true;
    });
    if (filtered.length === 0) return;

    html += `<div class="subsection"><h3>${sub.title}</h3><div class="card-grid">`;
    filtered.forEach(it => {
      html += `
        <a class="card" href="${it.url}" target="_blank" rel="noopener">
          <div class="card-top">
            <span class="type-badge badge-${it.type}">${it.type}</span>
            <span class="level-badge level-${it.level}">${it.level}</span>
          </div>
          <div class="card-title">${hl(it.title, searchQuery)}</div>
          <div class="card-author">${hl(it.author, searchQuery)}</div>
          <div class="card-desc">${hl(it.desc, searchQuery)}</div>
        </a>`;
    });
    html += `</div></div>`;
  });

  mainEl.innerHTML = html;

  /* bind filter buttons */
  mainEl.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      render();
    });
  });
}

/* ── search ── */
searchIn.addEventListener("input", () => {
  searchQuery = searchIn.value.trim().toLowerCase();
  render();
});
searchClr.addEventListener("click", () => {
  searchIn.value = "";
  searchQuery = "";
  render();
});

/* ── initial render ── */
render();
