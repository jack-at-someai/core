// Systems Architecture Reference Hub
// Maps to Charlotte papers 4 (Substrate Architecture) and 2 (Business Strategy)

const SECTIONS = [
  {
    id: "overview",
    label: "Overview",
    icon: "\u25C7",
    intro: `
      <p><strong>Systems Architecture</strong> is the disciplined practice of designing, structuring, and reasoning about large-scale software systems. It spans the full stack: from how data flows through distributed nodes, to how domain logic is modeled, to how serverless functions are orchestrated, to how costs are managed at scale.</p>
      <h3>Charlotte's Substrate Infrastructure</h3>
      <p>Charlotte's platform (Paper 4 &mdash; Substrate Architecture) is built on <strong>Firebase + Firestore</strong> as the primary data layer, with <strong>Cloud Functions</strong> for serverless compute. The <strong>FACT collection</strong> pattern (Firestore-Anchored Canonical Truths) ensures that every domain event is captured as an immutable, timestamped document &mdash; enabling audit trails, replay, and downstream event-driven reactions.</p>
      <p>Paper 2 (Business Strategy) connects architecture decisions to unit economics: every Cloud Function invocation, every Firestore read, and every pub/sub message has a cost. Systems architecture is therefore inseparable from cost modeling and business viability.</p>
      <h3>What This Hub Covers</h3>
      <ul>
        <li><strong>Distributed Systems</strong> &mdash; CAP theorem, consensus, replication, partitioning</li>
        <li><strong>Event-Driven Architecture</strong> &mdash; event buses, pub/sub, streaming, choreography vs orchestration</li>
        <li><strong>Domain-Driven Design</strong> &mdash; aggregates, bounded contexts, ubiquitous language</li>
        <li><strong>Firebase & NoSQL</strong> &mdash; Firestore patterns, denormalization, security rules</li>
        <li><strong>Serverless Patterns</strong> &mdash; FaaS, cold starts, composition patterns</li>
        <li><strong>Cost Modeling</strong> &mdash; cloud cost optimization, unit economics, pricing</li>
        <li><strong>Datasets & Software</strong> &mdash; IaC, monitoring, testing, infrastructure tooling</li>
      </ul>
    `,
    subsections: [
      {
        title: "Foundational Texts",
        resources: [
          { type: "book", title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", level: "intermediate", url: "https://dataintensive.net/", desc: "The definitive guide to data systems: replication, partitioning, transactions, batch and stream processing. Required reading." },
          { type: "book", title: "Software Architecture: The Hard Parts", author: "Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani", level: "advanced", url: "https://www.oreilly.com/library/view/software-architecture-the/9781492086888/", desc: "Modern trade-off analysis for distributed architectures: service granularity, data ownership, contracts, and operational coupling." },
          { type: "book", title: "Fundamentals of Software Architecture", author: "Mark Richards & Neal Ford", level: "beginner", url: "https://www.oreilly.com/library/view/fundamentals-of-software/9781492043447/", desc: "Broad survey of architecture styles (layered, microkernel, event-driven, microservices) with practical decision frameworks." },
          { type: "book", title: "Building Evolutionary Architectures", author: "Neal Ford, Rebecca Parsons, Patrick Kua", level: "intermediate", url: "https://www.oreilly.com/library/view/building-evolutionary-architectures/9781492097532/", desc: "Fitness functions, incremental change, and governance mechanisms for architectures that evolve over time." },
          { type: "video", title: "The Many Meanings of Event-Driven Architecture", author: "Martin Fowler (GOTO 2017)", level: "intermediate", url: "https://www.youtube.com/watch?v=STKCRSUsyP0", desc: "Fowler disambiguates event notification, event-carried state transfer, event sourcing, and CQRS." },
          { type: "notes", title: "The Twelve-Factor App", author: "Heroku / Adam Wiggins", level: "beginner", url: "https://12factor.net/", desc: "Twelve principles for building cloud-native, portable, scalable SaaS applications. Still foundational." },
          { type: "video", title: "How to Think About System Architecture", author: "Rich Hickey (Strange Loop)", level: "advanced", url: "https://www.youtube.com/watch?v=ROor6_NGIWU", desc: "Hickey on simplicity, complecting, and the deep structure of systems decisions." },
          { type: "book", title: "A Philosophy of Software Design", author: "John Ousterhout", level: "beginner", url: "https://web.stanford.edu/~ouster/cgi-bin/aposd.php", desc: "Complexity as the root enemy. Deep modules, information hiding, and strategic vs tactical programming." }
        ]
      },
      {
        title: "Charlotte-Specific Architecture",
        resources: [
          { type: "notes", title: "Charlotte Paper 4: Substrate Architecture", author: "Charlotte Research", level: "advanced", url: "#", desc: "FACT collection pattern, Firestore as event store, Cloud Functions orchestration, and the substrate data model." },
          { type: "notes", title: "Charlotte Paper 2: Business Strategy", author: "Charlotte Research", level: "intermediate", url: "#", desc: "Unit economics of serverless: cost-per-invocation modeling, Firestore read/write budgets, and pricing strategy." },
          { type: "notes", title: "Firebase Architecture Patterns for AI Platforms", author: "Internal Reference", level: "intermediate", url: "#", desc: "How Firebase Auth, Firestore, Cloud Functions, and Cloud Storage compose into a coherent AI-serving substrate." }
        ]
      }
    ]
  },
  {
    id: "distributed",
    label: "Distributed",
    icon: "\u229B",
    intro: `
      <p><strong>Distributed systems</strong> underpin every modern architecture. Once data or computation spans multiple nodes, you must contend with partial failure, network partitions, consistency trade-offs, and coordination overhead.</p>
      <h3>Core Concepts</h3>
      <ul>
        <li><strong>CAP Theorem</strong> &mdash; You cannot simultaneously guarantee Consistency, Availability, and Partition tolerance. Firestore chooses strong consistency within regions with eventual consistency for multi-region.</li>
        <li><strong>Consensus</strong> &mdash; Raft and Paxos ensure replicated state machines agree on a single value despite failures.</li>
        <li><strong>Replication</strong> &mdash; Leader-follower, multi-leader, leaderless (Dynamo-style). Each has distinct failure modes.</li>
        <li><strong>Partitioning (Sharding)</strong> &mdash; Range-based, hash-based, directory-based. Critical for horizontal scalability.</li>
      </ul>
      <h3>Charlotte Relevance</h3>
      <p>Firestore is a distributed document database built on Google's Spanner. Understanding its consistency model, transaction semantics, and partition behavior is essential for designing the FACT collection correctly.</p>
    `,
    subsections: [
      {
        title: "Textbooks & References",
        resources: [
          { type: "book", title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", level: "intermediate", url: "https://dataintensive.net/", desc: "Chapters 5-9 cover replication, partitioning, transactions, and consensus in extraordinary depth." },
          { type: "book", title: "Distributed Systems (3rd Edition)", author: "Maarten van Steen & Andrew S. Tanenbaum", level: "advanced", url: "https://www.distributed-systems.net/", desc: "Comprehensive academic textbook: processes, communication, naming, synchronization, consistency, fault tolerance." },
          { type: "book", title: "Distributed Algorithms", author: "Nancy Lynch", level: "advanced", url: "https://mitpress.mit.edu/9780080504704/distributed-algorithms/", desc: "Formal treatment of distributed algorithms. The gold standard for proofs of impossibility results and correctness." },
          { type: "book", title: "Understanding Distributed Systems", author: "Roberto Vitillo", level: "beginner", url: "https://understandingdistributed.systems/", desc: "Accessible introduction for practitioners. Communication, coordination, scalability, and resiliency patterns." }
        ]
      },
      {
        title: "Consensus & Coordination",
        resources: [
          { type: "notes", title: "The Raft Consensus Algorithm (Paper)", author: "Diego Ongaro & John Ousterhout", level: "intermediate", url: "https://raft.github.io/raft.pdf", desc: "Understandable consensus. Leader election, log replication, and safety proofs. The reference for modern consensus." },
          { type: "notes", title: "Paxos Made Simple", author: "Leslie Lamport", level: "advanced", url: "https://lamport.azurewebsites.net/pubs/paxos-simple.pdf", desc: "Lamport's simplified explanation of the Paxos consensus protocol. Still requires careful reading." },
          { type: "video", title: "Raft Visualization", author: "The Secret Lives of Data", level: "beginner", url: "https://thesecretlivesofdata.com/raft/", desc: "Interactive visualization of Raft consensus: leader election, log replication, and network partitions." },
          { type: "notes", title: "The Part-Time Parliament (Original Paxos)", author: "Leslie Lamport", level: "advanced", url: "https://lamport.azurewebsites.net/pubs/lamport-paxos.pdf", desc: "The original Paxos paper, famously written as a story about a Greek parliament. Historically important." }
        ]
      },
      {
        title: "Papers & Deep Dives",
        resources: [
          { type: "notes", title: "Dynamo: Amazon's Highly Available Key-value Store", author: "DeCandia et al. (Amazon)", level: "advanced", url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf", desc: "Consistent hashing, vector clocks, sloppy quorums, and anti-entropy. Inspired Cassandra, Riak, and DynamoDB." },
          { type: "notes", title: "Google Spanner: Globally-Distributed Database", author: "Corbett et al. (Google)", level: "advanced", url: "https://research.google/pubs/pub39966/", desc: "TrueTime, externally consistent transactions at global scale. The foundation underlying Firestore." },
          { type: "notes", title: "Time, Clocks, and the Ordering of Events", author: "Leslie Lamport", level: "intermediate", url: "https://lamport.azurewebsites.net/pubs/time-clocks.pdf", desc: "Logical clocks, happens-before relation, and causal ordering. One of the most cited papers in CS." },
          { type: "video", title: "Distributed Systems Lecture Series", author: "Martin Kleppmann (Cambridge)", level: "intermediate", url: "https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB", desc: "Full university lecture series covering models, clocks, replication, consensus, and Byzantine faults." }
        ]
      }
    ]
  },
  {
    id: "eventdriven",
    label: "Event-Driven",
    icon: "\u27F3",
    intro: `
      <p><strong>Event-Driven Architecture (EDA)</strong> decouples producers from consumers: components communicate by emitting and reacting to events rather than calling each other directly. This enables loose coupling, temporal decoupling, and natural audit trails.</p>
      <h3>Key Patterns</h3>
      <ul>
        <li><strong>Event Notification</strong> &mdash; Lightweight signal that something happened. Consumer fetches details if needed.</li>
        <li><strong>Event-Carried State Transfer</strong> &mdash; Event contains all data the consumer needs. No callback required.</li>
        <li><strong>Event Sourcing</strong> &mdash; Store every state change as an immutable event. Current state is derived by replaying events.</li>
        <li><strong>CQRS</strong> &mdash; Command Query Responsibility Segregation. Separate write models from read models.</li>
        <li><strong>Choreography vs Orchestration</strong> &mdash; Decentralized event reactions vs centralized workflow coordination.</li>
      </ul>
      <h3>Charlotte Relevance</h3>
      <p>The <strong>FACT collection</strong> is fundamentally an event-sourced store. Each FACT document represents an immutable domain event. Cloud Functions act as event handlers triggered by Firestore writes, implementing a choreography-based architecture where downstream processes react to upstream events.</p>
    `,
    subsections: [
      {
        title: "Books & Guides",
        resources: [
          { type: "book", title: "Enterprise Integration Patterns", author: "Gregor Hohpe & Bobby Woolf", level: "intermediate", url: "https://www.enterpriseintegrationpatterns.com/", desc: "The canonical catalog of messaging patterns: channels, routers, transformers, endpoints. 65 patterns still relevant today." },
          { type: "book", title: "Designing Event-Driven Systems", author: "Ben Stopford (Confluent)", level: "intermediate", url: "https://www.confluent.io/designing-event-driven-systems/", desc: "Free O'Reilly book. Event streaming with Kafka: event sourcing, CQRS, stream processing, and materialized views." },
          { type: "book", title: "Building Event-Driven Microservices", author: "Adam Bellemare", level: "intermediate", url: "https://www.oreilly.com/library/view/building-event-driven-microservices/9781492057888/", desc: "Practical patterns for event-driven microservices: event schemas, topology, stateful streaming, and testing strategies." },
          { type: "book", title: "Flow Architectures", author: "James Urquhart", level: "beginner", url: "https://www.oreilly.com/library/view/flow-architectures/9781492075882/", desc: "The future of event-driven integration: event flows as the primary integration paradigm across organizations." }
        ]
      },
      {
        title: "Apache Kafka & Streaming",
        resources: [
          { type: "notes", title: "Apache Kafka Documentation", author: "Apache Software Foundation", level: "intermediate", url: "https://kafka.apache.org/documentation/", desc: "Official docs: topics, partitions, consumer groups, exactly-once semantics, Kafka Streams, and Connect." },
          { type: "video", title: "Kafka Internals: How Kafka Works", author: "Confluent (YouTube)", level: "intermediate", url: "https://www.youtube.com/watch?v=jY02MB-sz8I", desc: "Deep dive into Kafka internals: log structure, ISR, leader election, and consumer group rebalancing." },
          { type: "course", title: "Apache Kafka for Event-Driven Architecture", author: "Confluent Developer", level: "beginner", url: "https://developer.confluent.io/courses/", desc: "Free courses from Confluent covering Kafka fundamentals, Kafka Streams, ksqlDB, and schema management." },
          { type: "notes", title: "Turning the Database Inside-Out", author: "Martin Kleppmann (Strange Loop 2014)", level: "advanced", url: "https://www.confluent.io/blog/turning-the-database-inside-out-with-apache-samza/", desc: "Seminal talk/post on treating the event log as the source of truth and deriving all views from it." }
        ]
      },
      {
        title: "Event Sourcing & CQRS",
        resources: [
          { type: "video", title: "Event Sourcing You Are Doing It Wrong", author: "David Schmitz (Devoxx)", level: "intermediate", url: "https://www.youtube.com/watch?v=GzrZworHpIk", desc: "Common pitfalls in event sourcing implementations: schema evolution, snapshots, and projection rebuilds." },
          { type: "notes", title: "CQRS Documents by Greg Young", author: "Greg Young", level: "advanced", url: "https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf", desc: "The original CQRS/ES document. Task-based UIs, command handlers, event stores, and projection patterns." },
          { type: "notes", title: "Event Sourcing Pattern (Microsoft)", author: "Microsoft Azure Architecture Center", level: "beginner", url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing", desc: "Clear explanation of event sourcing with diagrams, when to use it, and implementation considerations." },
          { type: "video", title: "A Decade of DDD, CQRS, Event Sourcing", author: "Greg Young (DDD Europe)", level: "advanced", url: "https://www.youtube.com/watch?v=LDW0QWie21s", desc: "Retrospective on a decade of event sourcing in production: lessons learned, what worked, what didn't." }
        ]
      }
    ]
  },
  {
    id: "ddd",
    label: "DDD",
    icon: "\u25C8",
    intro: `
      <p><strong>Domain-Driven Design (DDD)</strong> is a software design approach that centers the architecture around the core business domain. It provides both strategic patterns (bounded contexts, context maps) and tactical patterns (aggregates, entities, value objects, repositories) for managing complexity.</p>
      <h3>Strategic Design</h3>
      <ul>
        <li><strong>Bounded Context</strong> &mdash; A linguistic and model boundary. Each context has its own ubiquitous language and internal model.</li>
        <li><strong>Context Map</strong> &mdash; How bounded contexts relate: shared kernel, customer-supplier, anticorruption layer, etc.</li>
        <li><strong>Ubiquitous Language</strong> &mdash; A shared vocabulary between developers and domain experts within a bounded context.</li>
      </ul>
      <h3>Tactical Design</h3>
      <ul>
        <li><strong>Aggregates</strong> &mdash; Consistency boundaries. A cluster of entities and value objects treated as a single unit for data changes.</li>
        <li><strong>Domain Events</strong> &mdash; Something that happened in the domain that domain experts care about. Bridges DDD with EDA.</li>
        <li><strong>Repositories</strong> &mdash; Abstractions for persisting and retrieving aggregates.</li>
      </ul>
      <h3>Charlotte Relevance</h3>
      <p>The FACT collection maps directly to DDD domain events. Each Firestore collection can be understood as a repository for an aggregate. Bounded contexts help partition the system into independently deployable Cloud Functions.</p>
    `,
    subsections: [
      {
        title: "Core Texts",
        resources: [
          { type: "book", title: "Domain-Driven Design: Tackling Complexity in the Heart of Software", author: "Eric Evans", level: "advanced", url: "https://www.domainlanguage.com/ddd/", desc: "The original DDD book (the 'Blue Book'). Dense but foundational: ubiquitous language, bounded contexts, aggregates, repositories." },
          { type: "book", title: "Implementing Domain-Driven Design", author: "Vaughn Vernon", level: "intermediate", url: "https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/", desc: "The 'Red Book'. Practical implementation of DDD patterns with concrete code examples in Java. More accessible than Evans." },
          { type: "book", title: "Domain-Driven Design Distilled", author: "Vaughn Vernon", level: "beginner", url: "https://www.oreilly.com/library/view/domain-driven-design-distilled/9780134434964/", desc: "Compact 170-page distillation of DDD core concepts. Best starting point for newcomers." },
          { type: "book", title: "Learning Domain-Driven Design", author: "Vlad Khononov", level: "beginner", url: "https://www.oreilly.com/library/view/learning-domain-driven-design/9781098100124/", desc: "Modern, practical DDD guide. Connects strategic patterns to microservices architecture and event-driven systems." }
        ]
      },
      {
        title: "Strategic Design & Modeling",
        resources: [
          { type: "video", title: "Bounded Contexts, Microservices, and Everything In Between", author: "Vladik Khononov (KanDDDinsky)", level: "intermediate", url: "https://www.youtube.com/watch?v=dlnu5pSsg7k", desc: "How bounded contexts map to microservices boundaries. Practical guidance on finding the right service granularity." },
          { type: "notes", title: "DDD Reference (Eric Evans)", author: "Eric Evans", level: "intermediate", url: "https://www.domainlanguage.com/ddd/reference/", desc: "Free PDF summarizing all DDD patterns. An excellent quick-reference companion to the Blue Book." },
          { type: "video", title: "EventStorming Workshop", author: "Alberto Brandolini", level: "intermediate", url: "https://www.youtube.com/watch?v=mLXQIYEwK24", desc: "Brandolini introduces EventStorming: a workshop format for discovering domain events and bounded contexts collaboratively." },
          { type: "notes", title: "Context Mapping Pattern Catalog", author: "DDD Crew (GitHub)", level: "intermediate", url: "https://github.com/ddd-crew/context-mapping", desc: "Visual catalog of context mapping patterns: shared kernel, ACL, open host, published language, and more." }
        ]
      },
      {
        title: "Tactical Patterns & Implementation",
        resources: [
          { type: "video", title: "Aggregate Design Heuristics", author: "Vaughn Vernon", level: "advanced", url: "https://www.youtube.com/watch?v=dnUFEg68ESM", desc: "Four rules of aggregate design: protect invariants, small aggregates, reference by identity, eventual consistency." },
          { type: "notes", title: "Effective Aggregate Design (3-Part Series)", author: "Vaughn Vernon (DDD Community)", level: "advanced", url: "https://www.dddcommunity.org/library/vernon_2011/", desc: "Three-part essay on aggregate design: modeling business rules, managing consistency, and achieving scalability." },
          { type: "code", title: "DDD Starter Modelling Process", author: "DDD Crew (GitHub)", level: "beginner", url: "https://github.com/ddd-crew/ddd-starter-modelling-process", desc: "Step-by-step process for applying DDD: from domain discovery through bounded context integration." },
          { type: "video", title: "All Our Aggregates Are Wrong", author: "Mauro Servienti (NDC)", level: "advanced", url: "https://www.youtube.com/watch?v=KkzvQSuYd5I", desc: "Challenges common aggregate design assumptions. Shows how SOA principles lead to better aggregate boundaries." }
        ]
      }
    ]
  },
  {
    id: "firebase",
    label: "Firebase",
    icon: "\u229E",
    intro: `
      <p><strong>Firebase and Firestore</strong> form Charlotte's primary infrastructure substrate. Firestore is a serverless, strongly-consistent (within regions) document database built on Google Spanner. Understanding its data model, query semantics, and operational characteristics is critical.</p>
      <h3>Key Concepts</h3>
      <ul>
        <li><strong>Document Model</strong> &mdash; Collections contain documents. Documents contain fields and subcollections. No JOINs; denormalization is expected.</li>
        <li><strong>Security Rules</strong> &mdash; Declarative rules that enforce access control at the document level. Evaluated on every read/write.</li>
        <li><strong>Cloud Functions Triggers</strong> &mdash; onCreate, onUpdate, onDelete, onWrite triggers fire Cloud Functions when documents change.</li>
        <li><strong>Denormalization</strong> &mdash; Data is duplicated across documents to support different query patterns. Consistency is managed via Cloud Functions.</li>
      </ul>
      <h3>FACT Collection Pattern</h3>
      <p>The FACT collection stores immutable event documents. Each document has a timestamp, event type, payload, and metadata. Cloud Functions subscribe to FACT writes to trigger downstream processes &mdash; projections, notifications, analytics, and external integrations.</p>
    `,
    subsections: [
      {
        title: "Official Documentation",
        resources: [
          { type: "notes", title: "Cloud Firestore Documentation", author: "Google Firebase", level: "beginner", url: "https://firebase.google.com/docs/firestore", desc: "Official Firestore docs: data model, queries, indexes, transactions, security rules, and best practices." },
          { type: "notes", title: "Cloud Functions for Firebase", author: "Google Firebase", level: "beginner", url: "https://firebase.google.com/docs/functions", desc: "Official Cloud Functions docs: triggers (Firestore, Auth, Storage), deployment, environment config, and testing." },
          { type: "notes", title: "Firebase Security Rules Guide", author: "Google Firebase", level: "intermediate", url: "https://firebase.google.com/docs/rules", desc: "Comprehensive guide to writing and testing security rules for Firestore, Storage, and Realtime Database." },
          { type: "notes", title: "Firestore Data Modeling Guide", author: "Google Firebase", level: "intermediate", url: "https://firebase.google.com/docs/firestore/data-model", desc: "Official guidance on structuring data: subcollections vs root collections, arrays vs maps, and reference fields." }
        ]
      },
      {
        title: "Patterns & Best Practices",
        resources: [
          { type: "video", title: "Firestore Data Modeling (Firebase Summit)", author: "Todd Kerpelman (Google)", level: "intermediate", url: "https://www.youtube.com/watch?v=lW7DWV2jST0", desc: "Practical data modeling strategies: denormalization, aggregation queries, and handling relational data in Firestore." },
          { type: "video", title: "How to Structure Your Data in Firestore", author: "Fireship (YouTube)", level: "beginner", url: "https://www.youtube.com/watch?v=v_hR4K4auoQ", desc: "Concise guide to Firestore data modeling: root collections, subcollections, duplication strategies, and collection groups." },
          { type: "notes", title: "Firestore Best Practices", author: "Google Cloud Architecture Center", level: "intermediate", url: "https://cloud.google.com/firestore/docs/best-practices", desc: "Official best practices: distributed counters, pagination, batch writes, transaction limits, and hotspot avoidance." },
          { type: "code", title: "Firebase Extensions Repository", author: "Google Firebase (GitHub)", level: "beginner", url: "https://github.com/firebase/extensions", desc: "Official Firebase extensions: prebuilt Cloud Functions for common patterns (Stripe, Algolia, BigQuery export)." }
        ]
      },
      {
        title: "NoSQL & Document Database Theory",
        resources: [
          { type: "book", title: "NoSQL Distilled", author: "Pramod Sadalage & Martin Fowler", level: "beginner", url: "https://martinfowler.com/books/nosql.html", desc: "Compact guide to NoSQL databases: document, key-value, column-family, graph. Data modeling and distribution patterns." },
          { type: "video", title: "Firebase for SQL Developers", author: "David East (Firebase)", level: "beginner", url: "https://www.youtube.com/watch?v=sKFLI5FOOHs", desc: "Bridges the mental model gap: how to think about Firestore when coming from relational database backgrounds." },
          { type: "notes", title: "Google Cloud Spanner Paper", author: "Corbett et al. (Google)", level: "advanced", url: "https://research.google/pubs/pub39966/", desc: "The database engine under Firestore. TrueTime, external consistency, and globally distributed transactions." },
          { type: "notes", title: "Firestore Under the Hood (Blog)", author: "Google Cloud Blog", level: "intermediate", url: "https://cloud.google.com/blog/products/databases/cloud-firestore-production-ready", desc: "How Firestore uses Spanner for storage, handles indexes, and achieves strong consistency at scale." }
        ]
      }
    ]
  },
  {
    id: "serverless",
    label: "Serverless",
    icon: "\u2B21",
    intro: `
      <p><strong>Serverless architecture</strong> removes infrastructure management from the developer's concern: no servers to provision, patch, or scale. Functions-as-a-Service (FaaS) like Cloud Functions or AWS Lambda execute code in response to events, scaling automatically to zero when idle.</p>
      <h3>Key Concerns</h3>
      <ul>
        <li><strong>Cold Starts</strong> &mdash; The latency penalty when a new function instance must be initialized. Mitigated by min instances, keep-warm pings, or runtime choice.</li>
        <li><strong>Function Composition</strong> &mdash; Chaining functions: direct invocation, event-driven choreography, or orchestration (Step Functions / Workflows).</li>
        <li><strong>Statelessness</strong> &mdash; Functions are ephemeral. State must be externalized to databases, caches, or queues.</li>
        <li><strong>Vendor Lock-in</strong> &mdash; Serverless tightly couples to cloud provider APIs. Portability requires abstraction layers.</li>
      </ul>
      <h3>Charlotte Relevance</h3>
      <p>Charlotte's compute layer is entirely Cloud Functions. Every FACT collection write triggers a chain of function invocations. Understanding cold start behavior, concurrency limits, and retry semantics is critical for system reliability. Paper 2's cost model directly depends on function invocation counts and durations.</p>
    `,
    subsections: [
      {
        title: "Books & Comprehensive Guides",
        resources: [
          { type: "book", title: "Serverless Architectures on AWS (2nd Ed)", author: "Peter Sbarski, Yan Cui, Ajay Nair", level: "intermediate", url: "https://www.manning.com/books/serverless-architectures-on-aws-second-edition", desc: "Comprehensive guide to serverless on AWS: Lambda, API Gateway, Step Functions, DynamoDB, and event-driven patterns." },
          { type: "book", title: "Serverless Applications with Node.js", author: "Slobodan Stojanovic & Aleksandar Simovic", level: "beginner", url: "https://www.manning.com/books/serverless-applications-with-node-js", desc: "Building serverless APIs and applications with Claudia.js and AWS Lambda. Practical, code-heavy approach." },
          { type: "book", title: "Building Serverless Applications with Google Cloud Run", author: "Wietse Venema", level: "intermediate", url: "https://www.oreilly.com/library/view/building-serverless-applications/9781492057086/", desc: "Google Cloud serverless: Cloud Run, Cloud Functions, event-driven architectures, and container-based serverless." },
          { type: "notes", title: "Serverless Land (AWS)", author: "AWS", level: "beginner", url: "https://serverlessland.com/", desc: "AWS curated resource hub: patterns, snippets, learning paths, and a catalog of serverless architecture patterns." }
        ]
      },
      {
        title: "Patterns & Anti-Patterns",
        resources: [
          { type: "video", title: "Serverless Patterns and Best Practices", author: "Yan Cui (AWS re:Invent)", level: "intermediate", url: "https://www.youtube.com/watch?v=9IYpGTS7Jy0", desc: "Battle-tested serverless patterns: fan-out/fan-in, saga pattern, circuit breaker, and Lambda destinations." },
          { type: "notes", title: "Cloud Functions Tips & Tricks", author: "Google Cloud", level: "intermediate", url: "https://cloud.google.com/functions/docs/bestpractices/tips", desc: "Official best practices: cold start mitigation, connection pooling, idempotency, and error handling." },
          { type: "notes", title: "The Serverless Trilemma", author: "Eirini Kalliamvakou et al.", level: "advanced", url: "https://blog.acolyer.org/2019/03/25/the-serverless-trilemma/", desc: "You can have two of three: black-box functions, double billing avoidance, and direct function composition." },
          { type: "video", title: "Mistakes I Made and Lessons Learned (Serverless)", author: "Yan Cui (GOTO)", level: "intermediate", url: "https://www.youtube.com/watch?v=cnOrmhjnRBk", desc: "Common serverless mistakes: oversized functions, synchronous chains, missing idempotency, and testing gaps." }
        ]
      },
      {
        title: "Cold Starts & Performance",
        resources: [
          { type: "notes", title: "Cold Starts in Cloud Functions", author: "Mikhail Shilkov", level: "intermediate", url: "https://mikhail.io/serverless/coldstarts/", desc: "Comprehensive benchmarking of cold start latencies across AWS, Azure, and GCP. Regularly updated data." },
          { type: "video", title: "Optimizing Cloud Functions Performance", author: "Google Cloud (YouTube)", level: "intermediate", url: "https://www.youtube.com/watch?v=IOXrwFqR6kY", desc: "Google's guidance on reducing cold starts: min instances, lazy initialization, and connection reuse." },
          { type: "notes", title: "AWS Lambda Power Tuning", author: "Alex Casalboni (GitHub)", level: "intermediate", url: "https://github.com/alexcasalboni/aws-lambda-power-tuning", desc: "Open-source tool for finding optimal Lambda memory/power configuration. Cost vs performance optimization." },
          { type: "code", title: "Serverless Framework", author: "Serverless Inc (GitHub)", level: "beginner", url: "https://github.com/serverless/serverless", desc: "Multi-cloud serverless deployment framework. Abstracts provider differences with a common YAML configuration." }
        ]
      }
    ]
  },
  {
    id: "cost",
    label: "Cost Modeling",
    icon: "\u25C9",
    intro: `
      <p><strong>Cost modeling</strong> connects architectural decisions to financial outcomes. In serverless and cloud-native architectures, every API call, database read, and function invocation has a measurable cost. Paper 2 (Business Strategy) frames this as unit economics: what does it cost to serve one user, one request, one workflow?</p>
      <h3>Core Principles</h3>
      <ul>
        <li><strong>Unit Economics</strong> &mdash; Cost per user, cost per transaction, cost per workflow. The foundation of sustainable pricing.</li>
        <li><strong>Cloud Cost Optimization</strong> &mdash; Right-sizing, reserved capacity, spot instances, and architectural refactoring for cost efficiency.</li>
        <li><strong>FinOps</strong> &mdash; The practice of bringing financial accountability to cloud spending. Cross-functional collaboration between engineering, finance, and business.</li>
        <li><strong>Pricing Strategy</strong> &mdash; How infrastructure costs inform product pricing. Margins, breakeven analysis, and cost pass-through models.</li>
      </ul>
      <h3>Charlotte Relevance</h3>
      <p>Charlotte's cost model is dominated by Firestore reads/writes and Cloud Function invocations. Each FACT write triggers N downstream reads and M function invocations. Understanding this cost amplification factor is essential for sustainable unit economics and the pricing model described in Paper 2.</p>
    `,
    subsections: [
      {
        title: "Cloud Cost Frameworks",
        resources: [
          { type: "notes", title: "AWS Well-Architected: Cost Optimization Pillar", author: "Amazon Web Services", level: "intermediate", url: "https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html", desc: "AWS framework for cost optimization: expenditure awareness, cost-effective resources, matching supply and demand." },
          { type: "notes", title: "Google Cloud Architecture Framework: Cost Optimization", author: "Google Cloud", level: "intermediate", url: "https://cloud.google.com/architecture/framework/cost-optimization", desc: "Google's cost optimization guidance: right-sizing, committed use discounts, and Firestore-specific pricing optimization." },
          { type: "notes", title: "FinOps Foundation Framework", author: "FinOps Foundation", level: "beginner", url: "https://www.finops.org/framework/", desc: "The industry-standard FinOps framework: Inform, Optimize, Operate. Lifecycle approach to cloud financial management." },
          { type: "book", title: "Cloud FinOps (2nd Edition)", author: "J.R. Storment & Mike Fuller", level: "intermediate", url: "https://www.oreilly.com/library/view/cloud-finops-2nd/9781492098348/", desc: "Comprehensive guide to FinOps practices: tagging strategies, showback/chargeback, and organizational adoption." }
        ]
      },
      {
        title: "Unit Economics & Pricing",
        resources: [
          { type: "notes", title: "Firestore Pricing Deep Dive", author: "Google Firebase", level: "beginner", url: "https://firebase.google.com/pricing", desc: "Firestore pricing breakdown: per-document reads ($0.06/100K), writes ($0.18/100K), and storage ($0.18/GiB/month)." },
          { type: "video", title: "The Unit Economics of Serverless", author: "Yan Cui (ServerlessDays)", level: "intermediate", url: "https://www.youtube.com/watch?v=KMUr_MYVm_Q", desc: "Calculating cost-per-request in serverless architectures. When serverless is cheaper and when it's not." },
          { type: "notes", title: "Cloud Functions Pricing", author: "Google Cloud", level: "beginner", url: "https://cloud.google.com/functions/pricing", desc: "Cloud Functions pricing: per-invocation, compute time (GB-seconds), and networking. The variables in Charlotte's cost model." },
          { type: "video", title: "Last Week in AWS (Podcast)", author: "Corey Quinn", level: "beginner", url: "https://www.lastweekinaws.com/podcast/", desc: "Weekly podcast on AWS pricing, billing surprises, and cloud economics. Entertaining and informative." }
        ]
      },
      {
        title: "Optimization Strategies",
        resources: [
          { type: "notes", title: "Reducing Firestore Costs", author: "Google Cloud Blog", level: "intermediate", url: "https://cloud.google.com/firestore/docs/best-practices#reducing_costs", desc: "Specific strategies: query cursors instead of offsets, projection queries, bundled queries, and caching layers." },
          { type: "code", title: "Infracost: Cloud Cost Estimates for IaC", author: "Infracost (GitHub)", level: "intermediate", url: "https://github.com/infracost/infracost", desc: "Shift-left on cloud costs: see cost estimates in pull requests before infrastructure changes are deployed." },
          { type: "video", title: "Architecting for Cost on GCP", author: "Google Cloud (Next)", level: "intermediate", url: "https://www.youtube.com/watch?v=7VPsGxLDhJo", desc: "GCP-specific cost optimization: committed use, preemptible VMs, tiered storage, and Firestore cost patterns." },
          { type: "notes", title: "The Frugal Architect", author: "Werner Vogels (AWS CTO)", level: "beginner", url: "https://thefrugalarchitect.com/", desc: "Werner Vogels' seven laws of frugal architecture: cost-aware design, sustainability, and business alignment." }
        ]
      }
    ]
  },
  {
    id: "datasets",
    label: "Datasets & Software",
    icon: "\u262C",
    intro: `
      <p><strong>Infrastructure tooling, monitoring, and testing</strong> form the operational backbone of any systems architecture. These tools enable observability, reproducibility, and confidence in the systems you build.</p>
      <h3>Categories</h3>
      <ul>
        <li><strong>Infrastructure as Code (IaC)</strong> &mdash; Terraform, Pulumi, CDK. Declarative infrastructure definitions that are version-controlled and repeatable.</li>
        <li><strong>Monitoring & Observability</strong> &mdash; Prometheus, Grafana, OpenTelemetry. Metrics, logs, and traces for understanding system behavior.</li>
        <li><strong>Testing</strong> &mdash; Load testing, chaos engineering, contract testing. Validating system behavior under stress and failure.</li>
        <li><strong>CI/CD & Deployment</strong> &mdash; GitHub Actions, Cloud Build, ArgoCD. Automated pipelines from code to production.</li>
      </ul>
      <h3>Charlotte Relevance</h3>
      <p>Charlotte's deployment pipeline uses Firebase CLI and Cloud Build. Monitoring relies on Google Cloud's operations suite (formerly Stackdriver). Testing the FACT collection requires Firestore emulators and integration test harnesses.</p>
    `,
    subsections: [
      {
        title: "Infrastructure as Code",
        resources: [
          { type: "code", title: "Terraform", author: "HashiCorp", level: "intermediate", url: "https://github.com/hashicorp/terraform", desc: "The industry-standard IaC tool. Declarative HCL configuration for provisioning cloud infrastructure across all major providers." },
          { type: "code", title: "Pulumi", author: "Pulumi", level: "intermediate", url: "https://github.com/pulumi/pulumi", desc: "IaC using real programming languages (TypeScript, Python, Go). Full IDE support, testing, and package management." },
          { type: "code", title: "AWS CDK (Cloud Development Kit)", author: "Amazon Web Services", level: "intermediate", url: "https://github.com/aws/aws-cdk", desc: "Define AWS infrastructure using TypeScript, Python, Java, or C#. Synthesizes to CloudFormation templates." },
          { type: "book", title: "Terraform: Up & Running (3rd Edition)", author: "Yevgeniy Brikman", level: "beginner", url: "https://www.oreilly.com/library/view/terraform-up-and/9781098116743/", desc: "Practical Terraform guide: modules, state management, testing, team workflows, and multi-cloud patterns." }
        ]
      },
      {
        title: "Monitoring & Observability",
        resources: [
          { type: "code", title: "Prometheus", author: "CNCF / Prometheus Authors", level: "intermediate", url: "https://github.com/prometheus/prometheus", desc: "Pull-based metrics monitoring system. Time-series database with powerful PromQL query language. CNCF graduated project." },
          { type: "code", title: "Grafana", author: "Grafana Labs", level: "beginner", url: "https://github.com/grafana/grafana", desc: "Visualization and dashboarding platform. Connects to Prometheus, Loki, Tempo, and dozens of other data sources." },
          { type: "code", title: "OpenTelemetry", author: "CNCF / OpenTelemetry Authors", level: "intermediate", url: "https://github.com/open-telemetry/opentelemetry-js", desc: "Vendor-neutral instrumentation framework for traces, metrics, and logs. The emerging standard for observability." },
          { type: "book", title: "Observability Engineering", author: "Charity Majors, Liz Fong-Jones, George Miranda", level: "intermediate", url: "https://www.oreilly.com/library/view/observability-engineering/9781492076438/", desc: "The definitive guide to observability: instrumentation, high-cardinality data, SLOs, and debugging in production." }
        ]
      },
      {
        title: "Testing & Reliability",
        resources: [
          { type: "code", title: "Firebase Emulator Suite", author: "Google Firebase", level: "beginner", url: "https://firebase.google.com/docs/emulator-suite", desc: "Local emulators for Firestore, Auth, Functions, Storage, and Pub/Sub. Essential for testing Charlotte's architecture locally." },
          { type: "code", title: "k6 Load Testing", author: "Grafana Labs", level: "intermediate", url: "https://github.com/grafana/k6", desc: "Modern load testing tool using JavaScript. Scriptable scenarios, thresholds, and CI integration for performance testing." },
          { type: "code", title: "Chaos Monkey", author: "Netflix", level: "advanced", url: "https://github.com/Netflix/chaosmonkey", desc: "Netflix's chaos engineering tool. Randomly terminates instances in production to test resilience and recovery." },
          { type: "book", title: "Chaos Engineering (O'Reilly)", author: "Casey Rosenthal & Nora Jones", level: "intermediate", url: "https://www.oreilly.com/library/view/chaos-engineering/9781492043850/", desc: "Systematic approach to uncovering system weaknesses: experiment design, blast radius, and organizational adoption." }
        ]
      },
      {
        title: "CI/CD & Deployment",
        resources: [
          { type: "code", title: "GitHub Actions", author: "GitHub", level: "beginner", url: "https://github.com/features/actions", desc: "CI/CD directly in GitHub. Workflow YAML, reusable actions marketplace, and matrix builds for multi-platform testing." },
          { type: "code", title: "ArgoCD", author: "CNCF / Argo Project", level: "intermediate", url: "https://github.com/argoproj/argo-cd", desc: "GitOps continuous delivery for Kubernetes. Declarative application definitions and automated sync from Git." },
          { type: "notes", title: "Firebase CLI & Deployment", author: "Google Firebase", level: "beginner", url: "https://firebase.google.com/docs/cli", desc: "Firebase CLI: deploy functions, rules, hosting, and extensions. Supports preview channels and rollback." },
          { type: "book", title: "Continuous Delivery", author: "Jez Humble & David Farley", level: "intermediate", url: "https://continuousdelivery.com/", desc: "The foundational text on deployment pipelines, automated testing, release strategies, and configuration management." }
        ]
      }
    ]
  }
];

// ── Rendering Engine ──────────────────────────────────────────────

let activeTab = SECTIONS[0].id;
let activeFilters = {};
let searchTerm = "";

function getAllResources() {
  const all = [];
  SECTIONS.forEach(sec => {
    sec.subsections.forEach(sub => {
      sub.resources.forEach(r => {
        all.push({ ...r, sectionId: sec.id, subsection: sub.title });
      });
    });
  });
  return all;
}

function updateStatCount() {
  const count = getAllResources().length;
  document.getElementById("stat-count").textContent = count;
}

function getTypes(section) {
  const types = new Set();
  section.subsections.forEach(sub => {
    sub.resources.forEach(r => types.add(r.type));
  });
  return Array.from(types);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text, term) {
  if (!term) return text;
  const regex = new RegExp(`(${escapeRegex(term)})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

function matchesSearch(resource, term) {
  if (!term) return true;
  const lower = term.toLowerCase();
  return (
    resource.title.toLowerCase().includes(lower) ||
    resource.author.toLowerCase().includes(lower) ||
    resource.desc.toLowerCase().includes(lower) ||
    resource.type.toLowerCase().includes(lower)
  );
}

function renderTabs() {
  const tabBar = document.getElementById("tab-bar");
  tabBar.innerHTML = SECTIONS.map(sec => `
    <button class="tab-btn ${sec.id === activeTab ? "active" : ""}" data-tab="${sec.id}">
      <span class="tab-icon">${sec.icon}</span>
      <span class="tab-label">${sec.label}</span>
    </button>
  `).join("");

  tabBar.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.tab;
      activeFilters = {};
      renderTabs();
      renderContent();
    });
  });
}

function renderContent() {
  const section = SECTIONS.find(s => s.id === activeTab);
  if (!section) return;

  const types = getTypes(section);
  const currentFilter = activeFilters[section.id] || "all";

  let html = `<div class="section-header"><h2><span class="section-icon">${section.icon}</span>${section.label}</h2></div>`;
  html += `<div class="section-intro">${section.intro}</div>`;

  if (types.length > 1) {
    html += `<div class="filter-bar">`;
    html += `<button class="filter-btn ${currentFilter === "all" ? "active" : ""}" data-filter="all">All</button>`;
    types.forEach(t => {
      html += `<button class="filter-btn ${currentFilter === t ? "active" : ""}" data-filter="${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</button>`;
    });
    html += `</div>`;
  }

  section.subsections.forEach(sub => {
    let resources = sub.resources;
    if (currentFilter !== "all") {
      resources = resources.filter(r => r.type === currentFilter);
    }
    resources = resources.filter(r => matchesSearch(r, searchTerm));
    if (resources.length === 0) return;

    html += `<div class="subsection"><h3>${sub.title}</h3><div class="card-grid">`;
    resources.forEach(r => {
      html += `
        <a class="card" href="${r.url}" target="_blank" rel="noopener noreferrer">
          <div class="card-top">
            <span class="type-badge badge-${r.type}">${r.type}</span>
            <span class="level-badge level-${r.level}">${r.level}</span>
          </div>
          <div class="card-title">${highlightText(r.title, searchTerm)}</div>
          <div class="card-author">${highlightText(r.author, searchTerm)}</div>
          <div class="card-desc">${highlightText(r.desc, searchTerm)}</div>
        </a>`;
    });
    html += `</div></div>`;
  });

  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = html;

  mainContent.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeFilters[section.id] = btn.dataset.filter;
      renderContent();
    });
  });
}

// ── Search ──────────────────────────────────────────────────────

const searchInput = document.getElementById("search-input");
const searchClear = document.getElementById("search-clear");

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  renderContent();
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  renderContent();
  searchInput.focus();
});

// ── Init ──────────────────────────────────────────────────────

renderTabs();
renderContent();
updateStatCount();
