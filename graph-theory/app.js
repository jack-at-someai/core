// Graph Theory Reference — data + rendering

const SECTIONS = [
  {
    id: 'overview',
    icon: '\u25C7',
    title: 'Overview',
    intro: `<p><strong>Graph theory</strong> is the mathematical study of structures made up of <em>vertices</em> (nodes) connected by <em>edges</em> (links). It underpins everything from social-network analysis and route planning to knowledge representation and the FINN Data Model (Charlotte Paper 1) and Domain Modeling patterns (Charlotte Paper 5).</p>

<h3>Why Graph Theory Matters for Knowledge Systems</h3>
<p>Graphs provide the natural abstraction for modeling relationships between entities. When you build a knowledge graph, design an ontology, or implement a domain model, you are working with graph structures whether you realize it or not. Understanding the mathematical foundations helps you make better design decisions about schema, query patterns, and data evolution over time.</p>

<h3>Connection to Charlotte Papers</h3>
<ul>
  <li><strong>Paper 1 — FINN Data Model:</strong> FINN uses a graph-based approach to represent financial instruments and their relationships, leveraging property graphs and temporal edges to capture how entities evolve.</li>
  <li><strong>Paper 5 — Domain Modeling:</strong> Domain modeling patterns map directly to ontology design and knowledge graph construction, where graph theory provides the formal language for expressing constraints, hierarchies, and inference rules.</li>
</ul>

<h3>Suggested Learning Path</h3>
<ol>
  <li><strong>Fundamentals</strong> — Start with Diestel or West for pure graph theory, or Sarada Herke's YouTube lectures for a gentler introduction.</li>
  <li><strong>Knowledge Graphs</strong> — Learn RDF, OWL, and SPARQL. Read Hogan et al.'s comprehensive survey.</li>
  <li><strong>Ontology Design</strong> — Study description logics and upper ontologies (SUMO, DOLCE) to build robust schemas.</li>
  <li><strong>Graph Databases</strong> — Get hands-on with Neo4j or Amazon Neptune. Learn Cypher and Gremlin.</li>
  <li><strong>Algorithms</strong> — Master shortest paths, PageRank, community detection, and spectral methods.</li>
  <li><strong>Temporal Graphs</strong> — Explore time-varying networks and streaming graph processing for real-world dynamic data.</li>
</ol>`,
    subsections: [
      {
        title: 'Getting Started',
        resources: [
          { title: 'Graph Theory (Diestel) — Free Online Edition', author: 'Reinhard Diestel', year: 2017, url: 'https://diestel-graph-theory.com/', type: 'book', level: 'intermediate', desc: 'The standard graduate textbook on graph theory, available free online. Covers all foundational topics rigorously from connectivity to minors.' },
          { title: 'Introduction to Graph Theory — Sarada Herke YouTube Series', author: 'Sarada Herke', year: 2014, url: 'https://www.youtube.com/playlist?list=PLoJC20gNfC2gmT_5WgwYwGMvgCjYVsIQg', type: 'video', level: 'beginner', desc: 'Gentle and highly visual introduction to graph theory fundamentals. Over 50 short lectures covering vertices, edges, trees, Euler paths, and more.' },
          { title: 'Knowledge Graphs — Comprehensive Survey', author: 'Aidan Hogan et al.', year: 2021, url: 'https://arxiv.org/abs/2003.02320', type: 'notes', level: 'intermediate', desc: 'The definitive survey paper on knowledge graphs covering data models, creation, enrichment, quality, and applications. Essential reading.' },
          { title: 'MIT 18.217: Graph Theory and Additive Combinatorics', author: 'Yufei Zhao (MIT OCW)', year: 2019, url: 'https://ocw.mit.edu/courses/18-217-graph-theory-and-additive-combinatorics-fall-2019/', type: 'course', level: 'advanced', desc: 'Advanced MIT course connecting graph theory with additive combinatorics. Covers extremal graph theory, Szemeredi regularity lemma, and graph limits.' },
          { title: 'Neo4j Graph Database — Getting Started', author: 'Neo4j Inc.', year: 2024, url: 'https://neo4j.com/docs/getting-started/', type: 'notes', level: 'beginner', desc: 'Official getting-started guide for Neo4j, the most widely adopted graph database. Learn Cypher queries and property graph modeling from scratch.' },
          { title: 'NetworkX: Python Graph Library', author: 'Aric Hagberg et al.', year: 2024, url: 'https://networkx.org/', type: 'code', level: 'beginner', desc: 'The standard Python library for creating, manipulating, and studying complex networks. Includes generators, algorithms, and visualization utilities.' },
          { title: 'W3C RDF 1.1 Primer', author: 'W3C', year: 2014, url: 'https://www.w3.org/TR/rdf11-primer/', type: 'notes', level: 'beginner', desc: 'Official W3C primer for the Resource Description Framework. The foundational standard for representing knowledge as subject-predicate-object triples.' },
          { title: 'Temporal Network Theory — Holme & Saramaki', author: 'Petter Holme, Jari Saramaki', year: 2012, url: 'https://arxiv.org/abs/1108.1780', type: 'notes', level: 'advanced', desc: 'Foundational survey of temporal networks — graphs where edges carry time information. Covers models, metrics, and spreading processes on temporal structures.' },
          { title: 'Stanford SNAP: Large Network Dataset Collection', author: 'Jure Leskovec (Stanford)', year: 2024, url: 'https://snap.stanford.edu/data/', type: 'data', level: 'beginner', desc: 'Massive collection of real-world network datasets for research: social networks, web graphs, road networks, citation networks, and more.' }
        ]
      }
    ]
  },
  {
    id: 'fundamentals',
    icon: '\u229B',
    title: 'Fundamentals',
    intro: `<p><strong>Graph fundamentals</strong> form the mathematical bedrock for all applied graph work. This section covers the core concepts: vertices and edges, paths and cycles, trees and forests, directed acyclic graphs (DAGs), planarity, graph coloring, and structural properties.</p>

<h3>Core Concepts</h3>
<p>A <strong>graph</strong> G = (V, E) consists of a set of vertices V and a set of edges E. From this simple definition emerges a rich theory. Key areas include:</p>
<ul>
  <li><strong>Connectivity:</strong> How vertices relate through paths, bridges, and cut vertices</li>
  <li><strong>Trees & DAGs:</strong> Acyclic structures fundamental to hierarchies and dependency modeling</li>
  <li><strong>Planarity:</strong> Kuratowski's and Wagner's theorems characterizing graphs embeddable in the plane</li>
  <li><strong>Coloring:</strong> Chromatic number, the four-color theorem, and scheduling applications</li>
  <li><strong>Matchings:</strong> Hall's theorem, Konig's theorem, and bipartite optimization</li>
</ul>

<h3>Relevance to Domain Modeling</h3>
<p>Understanding graph structure is essential for <em>Charlotte Paper 5 (Domain Modeling)</em>. When you model a domain, you need to reason about hierarchies (trees), dependencies (DAGs), and general relationships (arbitrary graphs). Knowing whether your domain graph is planar, bipartite, or has bounded treewidth can guide schema design and query optimization.</p>`,
    subsections: [
      {
        title: 'Textbooks',
        resources: [
          { title: 'Graph Theory (5th Edition)', author: 'Reinhard Diestel', year: 2017, url: 'https://diestel-graph-theory.com/', type: 'book', level: 'intermediate', desc: 'The standard graduate text. Covers connectivity, matching, planarity, coloring, flows, extremal problems, and infinite graphs. Free online edition available.' },
          { title: 'Introduction to Graph Theory (2nd Edition)', author: 'Douglas B. West', year: 2001, url: 'https://faculty.math.illinois.edu/~west/igt/', type: 'book', level: 'intermediate', desc: 'Comprehensive undergraduate/graduate textbook with extensive exercises. Covers matchings, connectivity, coloring, planar graphs, and Ramsey theory.' },
          { title: 'Graph Theory with Applications', author: 'J.A. Bondy, U.S.R. Murty', year: 2008, url: 'https://www.springer.com/gp/book/9781846289699', type: 'book', level: 'intermediate', desc: 'Classic textbook covering graph theory from basics through advanced topics. Known for elegant proofs and thorough treatment of extremal graph theory.' },
          { title: 'A First Course in Graph Theory', author: 'Gary Chartrand, Ping Zhang', year: 2012, url: 'https://store.doverpublications.com/0486483681.html', type: 'book', level: 'beginner', desc: 'Accessible introduction to graph theory for undergraduates. Covers fundamentals with clear exposition, many examples, and exercises at varying difficulty levels.' },
          { title: 'Graph Theory and Its Applications (3rd Edition)', author: 'Jonathan L. Gross, Jay Yellen, Mark Anderson', year: 2018, url: 'https://www.routledge.com/Graph-Theory-and-Its-Applications/Gross-Yellen-Anderson/p/book/9781482249484', type: 'book', level: 'beginner', desc: 'Applied perspective on graph theory covering algorithms, network flows, and combinatorial optimization alongside pure theory.' }
        ]
      },
      {
        title: 'Courses & Lectures',
        resources: [
          { title: 'Graph Theory — Sarada Herke Full Course', author: 'Sarada Herke', year: 2014, url: 'https://www.youtube.com/playlist?list=PLoJC20gNfC2gmT_5WgwYwGMvgCjYVsIQg', type: 'video', level: 'beginner', desc: 'Comprehensive YouTube playlist covering graph theory from scratch: definitions, trees, Euler circuits, Hamiltonian paths, coloring, planarity, and matchings.' },
          { title: 'MIT 18.217: Graph Theory and Additive Combinatorics', author: 'Yufei Zhao', year: 2019, url: 'https://ocw.mit.edu/courses/18-217-graph-theory-and-additive-combinatorics-fall-2019/', type: 'course', level: 'advanced', desc: 'Advanced MIT course. Topics include extremal graph theory, Szemeredi regularity lemma, pseudorandomness, and graph limits (graphons).' },
          { title: 'MIT 18.212: Algebraic Combinatorics', author: 'Alexander Postnikov', year: 2019, url: 'https://ocw.mit.edu/courses/18-212-algebraic-combinatorics-spring-2019/', type: 'course', level: 'advanced', desc: 'MIT course covering algebraic methods in combinatorics including graph eigenvalues, chromatic polynomials, and matroid theory.' },
          { title: 'Essence of Linear Algebra (Graph Eigenvalues Context)', author: '3Blue1Brown (Grant Sanderson)', year: 2016, url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', type: 'video', level: 'beginner', desc: 'While focused on linear algebra, this series provides essential visual intuition for spectral graph theory — understanding graphs through their eigenvalues.' },
          { title: 'Graph Theory (Coursera / UC San Diego)', author: 'Alexander S. Kulikov, Michael Levin', year: 2020, url: 'https://www.coursera.org/learn/graphs', type: 'course', level: 'beginner', desc: 'Part of the Data Structures and Algorithms specialization. Covers BFS, DFS, strongly connected components, and shortest paths with hands-on programming assignments.' }
        ]
      },
      {
        title: 'Visual & Interactive Resources',
        resources: [
          { title: 'D3 Graph Theory — Interactive Tutorials', author: 'Avinash Pandey', year: 2018, url: 'https://d3gt.com/', type: 'code', level: 'beginner', desc: 'Beautiful interactive tutorials teaching graph theory concepts through D3.js visualizations. Covers vertices, edges, walks, paths, connectivity, and trees.' },
          { title: 'VisuAlgo — Graph Visualizations', author: 'Steven Halim', year: 2024, url: 'https://visualgo.net/en/graphds', type: 'code', level: 'beginner', desc: 'Interactive visualization platform for graph data structures and algorithms. Step through BFS, DFS, shortest path, MST, and more with animated execution.' },
          { title: 'Spectral Graph Theory (Spielman Lecture Notes)', author: 'Daniel A. Spielman', year: 2019, url: 'http://www.cs.yale.edu/homes/spielman/sgta/', type: 'notes', level: 'advanced', desc: 'Yale lecture notes on spectral graph theory covering Laplacian matrices, Cheeger inequality, expander graphs, and spectral sparsification.' }
        ]
      }
    ]
  },
  {
    id: 'knowledge',
    icon: '\u229E',
    title: 'Knowledge Graphs',
    intro: `<p><strong>Knowledge graphs</strong> represent real-world entities and their interrelationships in a graph-structured format. They power search engines (Google Knowledge Graph), virtual assistants, drug discovery, and enterprise data integration.</p>

<h3>Key Standards & Models</h3>
<ul>
  <li><strong>RDF (Resource Description Framework):</strong> W3C standard for expressing data as subject-predicate-object triples</li>
  <li><strong>OWL (Web Ontology Language):</strong> Formal language for defining ontologies with reasoning capabilities</li>
  <li><strong>SPARQL:</strong> Query language for RDF data, analogous to SQL for relational databases</li>
  <li><strong>Property Graphs:</strong> Alternative model (used by Neo4j, TinkerPop) where edges and nodes carry key-value properties</li>
  <li><strong>Schema.org:</strong> Collaborative vocabulary for structured data on the web</li>
</ul>

<h3>Connection to FINN Data Model (Paper 1)</h3>
<p>The FINN Data Model from Charlotte Paper 1 leverages graph-based representation to model financial instrument relationships. Understanding knowledge graph fundamentals — how to structure entities, define relationships, and maintain schema consistency — is directly applicable to implementing FINN-style data architectures.</p>`,
    subsections: [
      {
        title: 'Books & Surveys',
        resources: [
          { title: 'Knowledge Graphs (Synthesis Lectures)', author: 'Aidan Hogan, Eva Blomqvist, Michael Cochez et al.', year: 2021, url: 'https://arxiv.org/abs/2003.02320', type: 'book', level: 'intermediate', desc: 'The definitive comprehensive survey covering knowledge graph data models, creation, enrichment, quality assessment, refinement, and applications. 170+ pages.' },
          { title: 'Foundations of Semantic Web Technologies', author: 'Pascal Hitzler, Markus Krotzsch, Sebastian Rudolph', year: 2010, url: 'https://www.semantic-web-book.org/', type: 'book', level: 'intermediate', desc: 'Textbook covering RDF, RDFS, OWL, SPARQL, and semantic web reasoning. Provides solid theoretical foundations for building knowledge graphs.' },
          { title: 'Exploiting Linked Data and Knowledge Graphs in Large Organisations', author: 'Jeff Z. Pan et al.', year: 2017, url: 'https://www.springer.com/gp/book/9783319456522', type: 'book', level: 'intermediate', desc: 'Practical guide on deploying knowledge graph technologies in enterprise settings. Covers integration, querying, and real-world case studies.' },
          { title: 'A Review of Relational Machine Learning for Knowledge Graphs', author: 'Maximilian Nickel, Kevin Murphy, Volker Tresp, Evgeniy Gabrilovich', year: 2016, url: 'https://arxiv.org/abs/1503.00759', type: 'notes', level: 'advanced', desc: 'Influential survey on statistical relational learning methods for knowledge graphs including tensor factorization and neural embedding approaches.' }
        ]
      },
      {
        title: 'Standards & Specifications',
        resources: [
          { title: 'W3C RDF 1.1 Primer', author: 'W3C', year: 2014, url: 'https://www.w3.org/TR/rdf11-primer/', type: 'notes', level: 'beginner', desc: 'Official W3C introduction to RDF. Explains triples, graphs, serialization formats (Turtle, JSON-LD, N-Triples), and the RDF data model.' },
          { title: 'SPARQL 1.1 Query Language Specification', author: 'W3C', year: 2013, url: 'https://www.w3.org/TR/sparql11-query/', type: 'notes', level: 'intermediate', desc: 'The complete W3C specification for SPARQL, the standard query language for RDF data. Covers SELECT, CONSTRUCT, ASK, DESCRIBE, and federation.' },
          { title: 'Schema.org — Vocabulary for Structured Data', author: 'Schema.org Community', year: 2024, url: 'https://schema.org/', type: 'notes', level: 'beginner', desc: 'Collaborative vocabulary supported by Google, Microsoft, Yahoo, and Yandex for marking up web content with structured data understood by search engines.' },
          { title: 'JSON-LD 1.1 Specification', author: 'W3C', year: 2020, url: 'https://www.w3.org/TR/json-ld11/', type: 'notes', level: 'intermediate', desc: 'W3C standard for serializing linked data in JSON format. The bridge between developer-friendly JSON and the semantic web\'s RDF model.' }
        ]
      },
      {
        title: 'Tools & Platforms',
        resources: [
          { title: 'Wikidata — Free Knowledge Base', author: 'Wikimedia Foundation', year: 2024, url: 'https://www.wikidata.org/', type: 'data', level: 'beginner', desc: 'The largest open knowledge graph with 100M+ items. Structured data backbone for Wikipedia. Queryable via SPARQL endpoint, excellent for learning and experimentation.' },
          { title: 'Apache Jena — RDF Framework for Java', author: 'Apache Software Foundation', year: 2024, url: 'https://jena.apache.org/', type: 'code', level: 'intermediate', desc: 'Open-source Java framework for building semantic web and linked data applications. Includes TDB triple store, Fuseki SPARQL server, and OWL reasoner.' },
          { title: 'rdflib — Python RDF Library', author: 'RDFLib Team', year: 2024, url: 'https://rdflib.readthedocs.io/', type: 'code', level: 'beginner', desc: 'Pure Python library for working with RDF. Parse, serialize, and query RDF data. Supports SPARQL, Turtle, JSON-LD, and N-Triples formats.' },
          { title: 'Google Knowledge Graph Search API', author: 'Google', year: 2024, url: 'https://developers.google.com/knowledge-graph', type: 'code', level: 'beginner', desc: 'API for searching Google\'s Knowledge Graph, which contains billions of facts about people, places, and things. Useful for entity resolution and enrichment.' }
        ]
      }
    ]
  },
  {
    id: 'temporal',
    icon: '\u23F1',
    title: 'Temporal Graphs',
    intro: `<p><strong>Temporal graphs</strong> extend classical graph theory by adding a time dimension to edges and vertices. In the real world, relationships change: people form and dissolve connections, financial instruments mature or restructure, and information flows through networks over time.</p>

<h3>Key Concepts</h3>
<ul>
  <li><strong>Time-varying graphs:</strong> Graphs where the edge set changes as a function of time</li>
  <li><strong>Temporal paths:</strong> Paths where edges must be traversed in non-decreasing time order</li>
  <li><strong>Event graphs:</strong> Sequences of timestamped events modeled as graph transformations</li>
  <li><strong>Streaming graphs:</strong> Continuous streams of edge insertions/deletions requiring online algorithms</li>
  <li><strong>Snapshot models:</strong> Discrete sequence of static graph snapshots at different time points</li>
</ul>

<h3>Connection to FINN Data Model (Paper 1)</h3>
<p>The FINN Data Model explicitly addresses temporal aspects of financial data. Instruments change status, valuations fluctuate, and counterparty relationships evolve. Temporal graph theory provides the formal framework for modeling these dynamics — defining temporal reachability, time-respecting paths, and efficient representations of graph evolution.</p>`,
    subsections: [
      {
        title: 'Foundational Papers',
        resources: [
          { title: 'Temporal Networks', author: 'Petter Holme, Jari Saramaki', year: 2012, url: 'https://arxiv.org/abs/1108.1780', type: 'notes', level: 'advanced', desc: 'The foundational survey on temporal networks. Covers representations, metrics (temporal distance, reachability), burstiness, and processes on temporal structures.' },
          { title: 'Temporal Network Theory (Book)', author: 'Petter Holme, Jari Saramaki (Editors)', year: 2019, url: 'https://www.springer.com/gp/book/9783030234942', type: 'book', level: 'advanced', desc: 'Comprehensive edited volume on temporal network theory covering mathematical foundations, analysis methods, generative models, and applications across disciplines.' },
          { title: 'Stream Graphs and Link Streams for the Modeling of Interactions over Time', author: 'Matthieu Latapy, Tiphaine Viard, Clemence Magnien', year: 2018, url: 'https://arxiv.org/abs/1710.04073', type: 'notes', level: 'advanced', desc: 'Introduces the stream graph formalism as a unified framework for temporal networks, extending classical graph concepts (density, clustering, paths) to the temporal setting.' },
          { title: 'An Introduction to Temporal Graphs: An Algorithmic Perspective', author: 'Othon Michail', year: 2016, url: 'https://arxiv.org/abs/1503.00278', type: 'notes', level: 'intermediate', desc: 'Algorithmic perspective on temporal graphs covering temporal connectivity, exploration problems, and computational complexity of temporal graph problems.' },
          { title: 'Computing with Temporal Graphs', author: 'Arnaud Casteigts, Paola Flocchini, Walter Quattrociocchi, Nicola Santoro', year: 2012, url: 'https://arxiv.org/abs/1012.0009', type: 'notes', level: 'advanced', desc: 'Foundational framework for classifying temporal graphs based on their properties: edge recurrence, connectivity over time, and the computability hierarchy.' }
        ]
      },
      {
        title: 'Temporal Databases & Tools',
        resources: [
          { title: 'Apache Kafka — Event Streaming Platform', author: 'Apache Software Foundation', year: 2024, url: 'https://kafka.apache.org/', type: 'code', level: 'intermediate', desc: 'Distributed event streaming platform used to build real-time streaming data pipelines and applications. Essential infrastructure for streaming graph processing.' },
          { title: 'Raphtory — Temporal Graph Analytics', author: 'Pometry', year: 2024, url: 'https://www.raphtory.com/', type: 'code', level: 'intermediate', desc: 'Open-source temporal graph analytics engine. Query and analyze graph data that changes over time. Supports both batch and streaming temporal graph analysis.' },
          { title: 'SNAP Temporal Datasets', author: 'Jure Leskovec (Stanford)', year: 2024, url: 'https://snap.stanford.edu/data/#temporal', type: 'data', level: 'beginner', desc: 'Collection of temporal network datasets from SNAP including email networks, social media interaction streams, and Wikipedia edit histories with timestamps.' },
          { title: 'Temporal Graph Networks for Deep Learning on Dynamic Graphs', author: 'Emanuele Rossi et al.', year: 2020, url: 'https://arxiv.org/abs/2006.10637', type: 'notes', level: 'advanced', desc: 'Introduces TGN, a generic framework for deep learning on continuous-time dynamic graphs combining memory modules with graph neural networks.' },
          { title: 'NetworkX Temporal Extensions', author: 'NetworkX Community', year: 2024, url: 'https://networkx.org/documentation/stable/reference/classes/index.html', type: 'code', level: 'intermediate', desc: 'NetworkX supports temporal modeling through attributed edges with time properties. Documentation covers approaches for representing and analyzing time-varying networks.' }
        ]
      },
      {
        title: 'Courses & Tutorials',
        resources: [
          { title: 'Network Science — Chapter on Temporal Networks', author: 'Albert-Laszlo Barabasi', year: 2016, url: 'http://networksciencebook.com/', type: 'book', level: 'intermediate', desc: 'Barabasi\'s free online Network Science textbook includes coverage of dynamic and temporal network phenomena including spreading processes and epidemic modeling.' },
          { title: 'Temporal Graph Learning Workshop (NeurIPS)', author: 'Various', year: 2023, url: 'https://sites.google.com/view/tglworkshop2023/', type: 'notes', level: 'advanced', desc: 'Workshop papers and presentations from the NeurIPS Temporal Graph Learning Workshop covering cutting-edge research in learning on time-varying graph data.' }
        ]
      }
    ]
  },
  {
    id: 'ontology',
    icon: '\u25C8',
    title: 'Ontology & Schema',
    intro: `<p><strong>Ontology engineering</strong> is the discipline of formally representing knowledge about a domain — its concepts, properties, relationships, and constraints. It is the bridge between informal domain understanding and machine-processable knowledge structures.</p>

<h3>Core Technologies</h3>
<ul>
  <li><strong>OWL (Web Ontology Language):</strong> W3C standard for defining ontologies with formal semantics and reasoning support</li>
  <li><strong>Description Logics:</strong> The mathematical foundation underlying OWL, providing decidable reasoning about concept hierarchies</li>
  <li><strong>Upper Ontologies:</strong> Domain-independent frameworks (SUMO, DOLCE, BFO) providing top-level categories for organizing all knowledge</li>
  <li><strong>SHACL & ShEx:</strong> Constraint languages for validating RDF graph data against schemas</li>
</ul>

<h3>Connection to Charlotte Paper 5 — Domain Modeling</h3>
<p>Charlotte Paper 5 on Domain Modeling addresses the challenge of creating robust, evolvable domain models. Ontology design patterns provide proven solutions: how to model parthood, temporal relationships, roles, and qualities. Description logics give you the formal tools to reason about whether your model is consistent and complete. The patterns in this section directly support building FINN-compatible domain models.</p>`,
    subsections: [
      {
        title: 'Textbooks & Foundational Works',
        resources: [
          { title: 'The Description Logic Handbook (2nd Edition)', author: 'Franz Baader, Diego Calvanese, Deborah McGuinness et al.', year: 2007, url: 'https://www.cambridge.org/core/books/description-logic-handbook/2A6B3E0C7A418C837E498EF96ECB4E28', type: 'book', level: 'advanced', desc: 'The authoritative reference on description logics — the formal foundation of OWL. Covers complexity, reasoning algorithms, and extensions. Essential for ontology theorists.' },
          { title: 'Ontology Engineering (Keet)', author: 'C. Maria Keet', year: 2020, url: 'https://people.cs.uct.ac.za/~mkeet/OEbook/', type: 'book', level: 'intermediate', desc: 'Comprehensive textbook on ontology engineering methodology. Covers top-down and bottom-up approaches, ontology design patterns, and evaluation methods. Free online.' },
          { title: 'A Semantic Web Primer (3rd Edition)', author: 'Grigoris Antoniou, Paul Groth, Frank van Harmelen, Rinke Hoekstra', year: 2012, url: 'https://mitpress.mit.edu/books/semantic-web-primer', type: 'book', level: 'beginner', desc: 'Accessible introduction to semantic web technologies including RDF, OWL, SPARQL, and ontology engineering. Good starting point for newcomers.' },
          { title: 'Ontology Design Patterns (ODP Portal)', author: 'ODP Community', year: 2024, url: 'http://ontologydesignpatterns.org/', type: 'notes', level: 'intermediate', desc: 'Community portal cataloging reusable ontology design patterns. Includes content patterns, structural patterns, and correspondence patterns with examples and best practices.' }
        ]
      },
      {
        title: 'Standards & Specifications',
        resources: [
          { title: 'OWL 2 Web Ontology Language Primer', author: 'W3C', year: 2012, url: 'https://www.w3.org/TR/owl2-primer/', type: 'notes', level: 'intermediate', desc: 'Official W3C primer for OWL 2. Covers classes, properties, individuals, axioms, and the three OWL 2 profiles (EL, QL, RL) with their computational tradeoffs.' },
          { title: 'SHACL — Shapes Constraint Language', author: 'W3C', year: 2017, url: 'https://www.w3.org/TR/shacl/', type: 'notes', level: 'intermediate', desc: 'W3C recommendation for validating RDF graphs against a set of conditions (shapes). Essential for enforcing data quality in knowledge graphs.' },
          { title: 'SKOS — Simple Knowledge Organization System', author: 'W3C', year: 2009, url: 'https://www.w3.org/TR/skos-reference/', type: 'notes', level: 'beginner', desc: 'W3C standard for representing controlled vocabularies, thesauri, and taxonomies in RDF. Simpler than OWL, useful for organizing concepts hierarchically.' },
          { title: 'RDFS — RDF Schema 1.1', author: 'W3C', year: 2014, url: 'https://www.w3.org/TR/rdf-schema/', type: 'notes', level: 'beginner', desc: 'W3C specification for RDF Schema — the basic type system for RDF. Defines classes, subclasses, properties, and domains/ranges for lightweight ontologies.' }
        ]
      },
      {
        title: 'Upper Ontologies & Tools',
        resources: [
          { title: 'SUMO — Suggested Upper Merged Ontology', author: 'Adam Pease et al.', year: 2024, url: 'https://www.ontologyportal.org/', type: 'code', level: 'advanced', desc: 'One of the largest and most comprehensive formal ontologies, with over 20,000 terms and 70,000 axioms. Freely available, mapped to WordNet.' },
          { title: 'DOLCE — Descriptive Ontology for Linguistic and Cognitive Engineering', author: 'Nicola Guarino et al.', year: 2002, url: 'http://www.loa.istc.cnr.it/dolce/overview.html', type: 'notes', level: 'advanced', desc: 'Foundational ontology focused on cognitive and linguistic adequacy. Distinguishes endurants from perdurants, qualities from abstracts. Influential in ontology engineering.' },
          { title: 'Protege — Ontology Editor', author: 'Stanford Center for Biomedical Informatics Research', year: 2024, url: 'https://protege.stanford.edu/', type: 'code', level: 'beginner', desc: 'The most widely used free, open-source ontology editor. Supports OWL 2, includes reasoners (HermiT, Pellet), and provides visualization of class hierarchies.' },
          { title: 'Basic Formal Ontology (BFO)', author: 'Barry Smith et al.', year: 2024, url: 'https://basic-formal-ontology.org/', type: 'notes', level: 'advanced', desc: 'Upper-level ontology adopted as ISO/IEC 21838-2. Used as the foundation for hundreds of domain ontologies in biomedicine, defense, and industry.' }
        ]
      }
    ]
  },
  {
    id: 'databases',
    icon: '\u2B21',
    title: 'Graph Databases',
    intro: `<p><strong>Graph databases</strong> are purpose-built to store, query, and traverse graph-structured data efficiently. Unlike relational databases that require expensive joins to navigate relationships, graph databases make relationship traversal a first-class, constant-time operation.</p>

<h3>Two Dominant Models</h3>
<ul>
  <li><strong>Property Graphs:</strong> Nodes and edges carry key-value properties. Query languages: Cypher (Neo4j), Gremlin (TinkerPop). This is the model used by most commercial graph databases.</li>
  <li><strong>RDF Stores / Triple Stores:</strong> Data stored as subject-predicate-object triples. Query language: SPARQL. Used for semantic web and linked data applications.</li>
</ul>

<h3>Key Systems</h3>
<p><strong>Neo4j</strong> is the market leader for property graphs with its Cypher query language. <strong>Amazon Neptune</strong> supports both property graphs and RDF. <strong>Apache TinkerPop</strong> provides the Gremlin traversal language as a vendor-neutral standard. <strong>ArangoDB</strong> is a multi-model database supporting graphs, documents, and key-value access. <strong>Dgraph</strong> is a distributed GraphQL-native graph database.</p>

<h3>Connection to Charlotte Papers</h3>
<p>Implementing the FINN Data Model (Paper 1) requires choosing appropriate graph storage. Understanding the tradeoffs between property graphs and triple stores, between consistency models, and between query languages is essential for building production knowledge systems.</p>`,
    subsections: [
      {
        title: 'Neo4j Ecosystem',
        resources: [
          { title: 'Neo4j Documentation — Getting Started', author: 'Neo4j Inc.', year: 2024, url: 'https://neo4j.com/docs/getting-started/', type: 'notes', level: 'beginner', desc: 'Official Neo4j documentation covering installation, Cypher query language basics, data modeling in property graphs, and driver APIs for multiple languages.' },
          { title: 'Graph Databases (2nd Edition)', author: 'Ian Robinson, Jim Webber, Emil Eifrem', year: 2015, url: 'https://neo4j.com/graph-databases-book/', type: 'book', level: 'beginner', desc: 'Free ebook from Neo4j covering graph database concepts, data modeling patterns, Cypher query language, and real-world use cases. Excellent introduction.' },
          { title: 'Neo4j Graph Data Science Library', author: 'Neo4j Inc.', year: 2024, url: 'https://neo4j.com/docs/graph-data-science/current/', type: 'code', level: 'intermediate', desc: 'Neo4j\'s graph analytics library with 60+ algorithms including PageRank, community detection, node similarity, path finding, and graph embeddings.' },
          { title: 'Cypher Query Language Reference', author: 'openCypher Project', year: 2024, url: 'https://opencypher.org/', type: 'notes', level: 'intermediate', desc: 'The open standard for the Cypher graph query language. Specification, grammar, and compatibility documentation for implementing Cypher across platforms.' }
        ]
      },
      {
        title: 'Other Graph Databases',
        resources: [
          { title: 'Apache TinkerPop / Gremlin Documentation', author: 'Apache Software Foundation', year: 2024, url: 'https://tinkerpop.apache.org/docs/current/', type: 'notes', level: 'intermediate', desc: 'Documentation for Apache TinkerPop graph computing framework and Gremlin traversal language. Vendor-neutral standard supported by many graph databases.' },
          { title: 'Amazon Neptune — Developer Guide', author: 'Amazon Web Services', year: 2024, url: 'https://docs.aws.amazon.com/neptune/latest/userguide/intro.html', type: 'notes', level: 'intermediate', desc: 'AWS managed graph database supporting both property graphs (Gremlin) and RDF (SPARQL). Documentation covers setup, data loading, querying, and best practices.' },
          { title: 'ArangoDB Documentation', author: 'ArangoDB GmbH', year: 2024, url: 'https://www.arangodb.com/docs/stable/', type: 'notes', level: 'intermediate', desc: 'Multi-model database supporting graphs, documents, and key-value. AQL query language unifies access patterns. Good for projects needing flexible data modeling.' },
          { title: 'Dgraph Documentation', author: 'Dgraph Labs', year: 2024, url: 'https://dgraph.io/docs/', type: 'notes', level: 'intermediate', desc: 'Distributed, horizontally scalable graph database with native GraphQL support. Documentation covers DQL query language, schema design, and cluster management.' }
        ]
      },
      {
        title: 'Comparisons & Architecture',
        resources: [
          { title: 'Graph Database Benchmark (LDBC)', author: 'Linked Data Benchmark Council', year: 2024, url: 'https://ldbcouncil.org/', type: 'notes', level: 'advanced', desc: 'Industry benchmarks for graph database performance. The Social Network Benchmark (SNB) and Financial Benchmark provide standardized workloads for comparing systems.' },
          { title: 'GQL — Graph Query Language (ISO Standard)', author: 'ISO/IEC JTC 1', year: 2024, url: 'https://www.gqlstandards.org/', type: 'notes', level: 'intermediate', desc: 'The emerging ISO standard graph query language unifying Cypher, PGQL, and G-CORE. Will become the SQL equivalent for graph databases.' },
          { title: 'Practical Gremlin — An Apache TinkerPop Tutorial', author: 'Kelvin R. Lawrence', year: 2021, url: 'https://kelvinlawrence.net/book/Gremlin-Graph-Guide.html', type: 'book', level: 'beginner', desc: 'Comprehensive free online book teaching Gremlin from basics to advanced traversals. Uses an air routes dataset for hands-on examples throughout.' },
          { title: 'Graph Databases vs Relational Databases (Neo4j Guide)', author: 'Neo4j Inc.', year: 2024, url: 'https://neo4j.com/developer/graph-db-vs-rdbms/', type: 'notes', level: 'beginner', desc: 'Clear comparison of graph vs relational databases covering data modeling differences, query patterns, performance characteristics, and when to choose each approach.' }
        ]
      }
    ]
  },
  {
    id: 'algorithms',
    icon: '\u27C1',
    title: 'Algorithms',
    intro: `<p><strong>Graph algorithms</strong> are computational procedures for solving problems on graph structures. They are among the most practically important algorithms in computer science, powering search engines, navigation systems, social network analysis, and network optimization.</p>

<h3>Major Algorithm Families</h3>
<ul>
  <li><strong>Traversal:</strong> BFS, DFS, topological sort — the building blocks for all graph computation</li>
  <li><strong>Shortest Paths:</strong> Dijkstra, Bellman-Ford, Floyd-Warshall, A* — routing and distance computation</li>
  <li><strong>Centrality:</strong> PageRank, betweenness, closeness, eigenvector — identifying important nodes</li>
  <li><strong>Community Detection:</strong> Louvain, Girvan-Newman, label propagation — finding clusters in networks</li>
  <li><strong>Network Flow:</strong> Ford-Fulkerson, push-relabel — optimization of flow through networks</li>
  <li><strong>Spectral Methods:</strong> Graph Laplacian, spectral clustering, random walks — algebraic approaches to graph structure</li>
  <li><strong>Matching:</strong> Hungarian algorithm, Hopcroft-Karp — optimal pairing problems</li>
</ul>

<h3>Relevance to Domain Modeling</h3>
<p>Graph algorithms provide the computational tools for analyzing domain models. Community detection can reveal modular structure in ontologies. Centrality measures identify key concepts. Shortest path algorithms power inference chains in knowledge graphs.</p>`,
    subsections: [
      {
        title: 'Textbooks',
        resources: [
          { title: 'Introduction to Algorithms (CLRS) — Graph Chapters', author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein', year: 2022, url: 'https://mitpress.mit.edu/books/introduction-algorithms-fourth-edition', type: 'book', level: 'intermediate', desc: 'The definitive algorithms textbook. Chapters 20-26 cover BFS, DFS, topological sort, strongly connected components, MST, shortest paths, and network flow.' },
          { title: 'Networks: An Introduction', author: 'Mark Newman', year: 2018, url: 'https://global.oup.com/academic/product/networks-9780198805090', type: 'book', level: 'intermediate', desc: 'Comprehensive textbook on network science covering graph metrics, random graphs, community detection, network dynamics, and applications across many fields.' },
          { title: 'Algorithm Design', author: 'Jon Kleinberg, Eva Tardos', year: 2005, url: 'https://www.cs.cornell.edu/home/kleinber/algorithm-design-book/', type: 'book', level: 'intermediate', desc: 'Excellent algorithms text with strong coverage of graph algorithms, network flow, and NP-completeness. Known for clear exposition and real-world motivation.' },
          { title: 'The Algorithm Design Manual', author: 'Steven S. Skiena', year: 2020, url: 'https://www.algorist.com/', type: 'book', level: 'intermediate', desc: 'Practical algorithms reference with a catalog of graph algorithm problems. Covers implementations, war stories, and guidance on choosing the right algorithm.' }
        ]
      },
      {
        title: 'Libraries & Implementations',
        resources: [
          { title: 'NetworkX — Python Graph Library', author: 'Aric Hagberg, Dan Schult, Pieter Swart', year: 2024, url: 'https://networkx.org/', type: 'code', level: 'beginner', desc: 'The standard Python library for network analysis. Implements 500+ graph algorithms including shortest paths, centrality, community detection, and isomorphism.' },
          { title: 'igraph — High-Performance Graph Library', author: 'Gabor Csardi, Tamas Nepusz et al.', year: 2024, url: 'https://igraph.org/', type: 'code', level: 'intermediate', desc: 'High-performance graph library with R, Python, and C interfaces. Faster than NetworkX for large graphs. Strong community detection and layout algorithms.' },
          { title: 'graph-tool — Efficient Graph Analysis in Python', author: 'Tiago P. Peixoto', year: 2024, url: 'https://graph-tool.skewed.de/', type: 'code', level: 'advanced', desc: 'Python library using C++ and Boost under the hood for maximum performance. Excellent statistical analysis including stochastic block models for community detection.' },
          { title: 'JUNG — Java Universal Network/Graph Framework', author: 'Joshua O\'Madadhain et al.', year: 2024, url: 'https://jrtom.github.io/jung/', type: 'code', level: 'intermediate', desc: 'Java library for graph/network analysis. Provides algorithms for clustering, decomposition, optimization, random graph generation, and visualization.' }
        ]
      },
      {
        title: 'Courses & Tutorials',
        resources: [
          { title: 'Algorithms Specialization (Stanford / Coursera)', author: 'Tim Roughgarden', year: 2020, url: 'https://www.coursera.org/specializations/algorithms', type: 'course', level: 'intermediate', desc: 'Stanford algorithms course covering graph search, shortest paths, minimum spanning trees, and NP-completeness with rigorous analysis and programming assignments.' },
          { title: 'Graph Analytics for Big Data (Coursera / UC San Diego)', author: 'Ilkay Altintas', year: 2020, url: 'https://www.coursera.org/learn/big-data-graph-analytics', type: 'course', level: 'intermediate', desc: 'Course on graph analytics at scale covering community detection, influence propagation, and practical tools for analyzing large networks.' },
          { title: 'William Fiset — Graph Theory Algorithms (YouTube)', author: 'William Fiset', year: 2019, url: 'https://www.youtube.com/playlist?list=PLDV1Zeh2NRsDGO4--qE8yH72HFL1Km93P', type: 'video', level: 'beginner', desc: 'Excellent YouTube playlist covering graph algorithm implementations: DFS, BFS, Dijkstra, Bellman-Ford, Floyd-Warshall, topological sort, bridges, and articulation points.' },
          { title: 'Mining of Massive Datasets — Graph Chapters', author: 'Jure Leskovec, Anand Rajaraman, Jeff Ullman', year: 2020, url: 'http://www.mmds.org/', type: 'book', level: 'intermediate', desc: 'Free textbook covering PageRank, link analysis, community detection, and graph mining at web scale. Based on Stanford CS246 course.' }
        ]
      }
    ]
  },
  {
    id: 'datasets',
    icon: '\u262C',
    title: 'Datasets & Software',
    intro: `<p><strong>Datasets and software tools</strong> are essential for practical graph theory work. This section collects the most important network datasets for research and experimentation, alongside visualization tools and analysis libraries.</p>

<h3>Major Dataset Repositories</h3>
<ul>
  <li><strong>SNAP (Stanford):</strong> Social, web, road, citation, and biological networks — the most widely used repository in network science</li>
  <li><strong>KONECT (Koblenz):</strong> Large collection of network datasets with rich metadata and statistics</li>
  <li><strong>Network Repository:</strong> Interactive analytics platform with thousands of network datasets</li>
  <li><strong>Open Graph Benchmark (OGB):</strong> Standardized benchmark datasets for graph machine learning</li>
</ul>

<h3>Visualization Ecosystem</h3>
<p>Graph visualization is a discipline in itself. <strong>Gephi</strong> is the leading desktop tool for exploratory analysis. <strong>D3.js</strong> provides web-based force-directed layouts. <strong>Sigma.js</strong> is optimized for rendering large graphs in the browser. <strong>Cytoscape</strong> excels at biological network visualization. For programmatic visualization, <strong>GraphViz</strong> remains the standard for static graph rendering.</p>`,
    subsections: [
      {
        title: 'Dataset Repositories',
        resources: [
          { title: 'SNAP — Stanford Large Network Dataset Collection', author: 'Jure Leskovec (Stanford)', year: 2024, url: 'https://snap.stanford.edu/data/', type: 'data', level: 'beginner', desc: 'The most widely used network dataset repository. Includes social networks, web graphs, road networks, citation networks, Amazon co-purchasing, and Wikipedia.' },
          { title: 'KONECT — The Koblenz Network Collection', author: 'Jerome Kunegis', year: 2024, url: 'http://konect.cc/', type: 'data', level: 'beginner', desc: 'Large collection of network datasets with 300+ networks. Provides statistics, visualizations, and downloadable data in multiple formats.' },
          { title: 'Network Repository — Interactive Analysis', author: 'Ryan A. Rossi, Nesreen K. Ahmed', year: 2024, url: 'https://networkrepository.com/', type: 'data', level: 'beginner', desc: 'Interactive network data repository with thousands of datasets. Provides real-time visual analytics, statistics, and benchmarks for network analysis research.' },
          { title: 'Open Graph Benchmark (OGB)', author: 'Weihua Hu, Matthias Fey et al.', year: 2021, url: 'https://ogb.stanford.edu/', type: 'data', level: 'intermediate', desc: 'Standardized benchmark datasets for graph machine learning. Covers node classification, link prediction, and graph classification across diverse domains.' },
          { title: 'Wikidata SPARQL Endpoint', author: 'Wikimedia Foundation', year: 2024, url: 'https://query.wikidata.org/', type: 'data', level: 'beginner', desc: 'Public SPARQL endpoint for querying Wikidata\'s knowledge graph of 100M+ items. Includes query editor with autocompletion and visualization tools.' }
        ]
      },
      {
        title: 'Visualization Tools',
        resources: [
          { title: 'Gephi — Open Graph Visualization Platform', author: 'Gephi Consortium', year: 2024, url: 'https://gephi.org/', type: 'code', level: 'beginner', desc: 'The leading open-source software for network visualization and exploration. Supports large graphs, multiple layout algorithms, dynamic filtering, and plugin ecosystem.' },
          { title: 'D3.js — Force-Directed Graph Layouts', author: 'Mike Bostock', year: 2024, url: 'https://d3js.org/', type: 'code', level: 'intermediate', desc: 'JavaScript library for data-driven visualizations. Its force simulation module creates interactive, physics-based graph layouts in the browser.' },
          { title: 'Sigma.js — Large Graph Rendering for the Web', author: 'Sciences Po medialab', year: 2024, url: 'https://www.sigmajs.org/', type: 'code', level: 'intermediate', desc: 'JavaScript library dedicated to graph drawing using WebGL for performance. Optimized for rendering large networks (100K+ nodes) in the browser.' },
          { title: 'Cytoscape — Network Analysis and Visualization', author: 'Cytoscape Consortium', year: 2024, url: 'https://cytoscape.org/', type: 'code', level: 'intermediate', desc: 'Open-source platform for visualizing complex networks originally designed for biology. Rich plugin ecosystem, supports large networks, and exports publication-quality figures.' },
          { title: 'Graphviz — Graph Visualization Software', author: 'AT&T Labs Research', year: 2024, url: 'https://graphviz.org/', type: 'code', level: 'beginner', desc: 'Classic open-source graph visualization software using the DOT language. Produces static layouts (hierarchical, radial, force-directed) for documentation and analysis.' }
        ]
      },
      {
        title: 'Analysis Libraries & Frameworks',
        resources: [
          { title: 'Apache Spark GraphX', author: 'Apache Software Foundation', year: 2024, url: 'https://spark.apache.org/graphx/', type: 'code', level: 'advanced', desc: 'Distributed graph processing framework built on Apache Spark. Implements Pregel-style computation for PageRank, connected components, and triangle counting at scale.' },
          { title: 'PyTorch Geometric (PyG)', author: 'Matthias Fey, Jan Eric Lenssen', year: 2024, url: 'https://pyg.org/', type: 'code', level: 'advanced', desc: 'Library for deep learning on graphs and other irregular structures built on PyTorch. Implements GCN, GAT, GraphSAGE, and many other graph neural network architectures.' },
          { title: 'DGL — Deep Graph Library', author: 'DGL Team (Amazon)', year: 2024, url: 'https://www.dgl.ai/', type: 'code', level: 'advanced', desc: 'Framework-agnostic library for implementing graph neural networks on top of PyTorch, TensorFlow, or MXNet. Strong support for heterogeneous graphs.' },
          { title: 'SNAP.py — Stanford Network Analysis Platform for Python', author: 'Jure Leskovec (Stanford)', year: 2024, url: 'https://snap.stanford.edu/snappy/', type: 'code', level: 'intermediate', desc: 'Python interface to the SNAP C++ library for large-scale network analysis. Efficient implementations of graph algorithms for networks with millions of nodes.' }
        ]
      }
    ]
  }
];

const TYPE_BADGES = {
  book: { label: 'Book', cls: 'badge-book' },
  notes: { label: 'Notes', cls: 'badge-notes' },
  video: { label: 'Video', cls: 'badge-video' },
  course: { label: 'Course', cls: 'badge-course' },
  code: { label: 'Code', cls: 'badge-code' },
  data: { label: 'Dataset', cls: 'badge-data' }
};

const LEVEL_BADGES = {
  beginner: { label: 'Beginner', cls: 'level-beginner' },
  intermediate: { label: 'Intermediate', cls: 'level-intermediate' },
  advanced: { label: 'Advanced', cls: 'level-advanced' }
};

let activeSection = 'overview';
let activeFilter = 'all';
let searchQuery = '';

function init() { renderTabs(); renderContent(); bindEvents(); updateStats(); }

function renderTabs() {
  const bar = document.getElementById('tab-bar');
  bar.innerHTML = '';
  for (const s of SECTIONS) {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (s.id === activeSection ? ' active' : '');
    btn.dataset.id = s.id;
    btn.innerHTML = `<span class="tab-icon">${s.icon}</span><span class="tab-label">${s.title}</span>`;
    bar.appendChild(btn);
  }
}

function renderContent() {
  const main = document.getElementById('main-content');
  const section = SECTIONS.find(s => s.id === activeSection);
  if (!section) return;
  let html = `<div class="section-header"><h2><span class="section-icon">${section.icon}</span> ${section.title}</h2></div>`;
  html += `<div class="section-intro">${section.intro}</div>`;
  if (section.subsections.length) {
    html += `<div class="filter-bar">
      <button class="filter-btn${activeFilter === 'all' ? ' active' : ''}" data-filter="all">All</button>
      <button class="filter-btn${activeFilter === 'book' ? ' active' : ''}" data-filter="book">Books</button>
      <button class="filter-btn${activeFilter === 'video' ? ' active' : ''}" data-filter="video">Videos</button>
      <button class="filter-btn${activeFilter === 'course' ? ' active' : ''}" data-filter="course">Courses</button>
      <button class="filter-btn${activeFilter === 'notes' ? ' active' : ''}" data-filter="notes">Notes</button>
      <button class="filter-btn${activeFilter === 'code' ? ' active' : ''}" data-filter="code">Code</button>
      <button class="filter-btn${activeFilter === 'data' ? ' active' : ''}" data-filter="data">Data</button>
    </div>`;
    for (const sub of section.subsections) {
      const filtered = filterResources(sub.resources);
      if (!filtered.length) continue;
      html += `<div class="subsection"><h3>${sub.title}</h3><div class="card-grid">`;
      for (const r of filtered) html += renderCard(r);
      html += `</div></div>`;
    }
  }
  main.innerHTML = html;
  bindFilters();
}

function filterResources(resources) {
  return resources.filter(r => {
    if (activeFilter !== 'all' && r.type !== activeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = `${r.title} ${r.author || ''} ${r.desc || ''}`.toLowerCase();
      return hay.includes(q);
    }
    return true;
  });
}

function renderCard(r) {
  const badge = TYPE_BADGES[r.type] || { label: r.type, cls: '' };
  const levelBadge = r.level && LEVEL_BADGES[r.level] ? `<span class="level-badge ${LEVEL_BADGES[r.level].cls}">${LEVEL_BADGES[r.level].label}</span>` : '';
  const author = r.author ? `<div class="card-author">${r.author}${r.year ? ` (${r.year})` : ''}</div>` : (r.year ? `<div class="card-author">${r.year}</div>` : '');
  return `<a class="card" href="${r.url}" target="_blank" rel="noopener">
    <div class="card-top"><span class="type-badge ${badge.cls}">${badge.label}</span>${levelBadge}</div>
    <div class="card-title">${highlightMatch(r.title)}</div>${author}
    <div class="card-desc">${highlightMatch(r.desc || '')}</div></a>`;
}

function highlightMatch(text) {
  if (!searchQuery) return text;
  const re = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

function updateStats() {
  let total = 0;
  for (const s of SECTIONS) for (const sub of s.subsections) total += sub.resources.length;
  const el = document.getElementById('stat-count');
  if (el) el.textContent = total;
}

function bindEvents() {
  document.getElementById('tab-bar').addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    activeSection = btn.dataset.id;
    activeFilter = 'all';
    renderTabs();
    renderContent();
    document.getElementById('main-content').scrollTop = 0;
  });
  const search = document.getElementById('search-input');
  search.addEventListener('input', () => { searchQuery = search.value.trim(); renderContent(); });
  document.getElementById('search-clear').addEventListener('click', () => { search.value = ''; searchQuery = ''; renderContent(); search.focus(); });
}

function bindFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => { activeFilter = btn.dataset.filter; renderContent(); });
  });
}

document.addEventListener('DOMContentLoaded', init);
