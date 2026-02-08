/* ===================================================================
   Temporal Databases Reference Hub — app.js
   Charlotte Paper 7 (Temporal Perception): "Time is the primary axis of truth."
   =================================================================== */

const SECTIONS = [
  /* ---------------------------------------------------------------
     TAB 1 — Overview
     --------------------------------------------------------------- */
  {
    id: "overview",
    icon: "\u25C7",
    label: "Overview",
    intro: `
      <p><strong>Time is the primary axis of truth.</strong> Temporal databases treat time not as metadata
      tacked onto rows but as a first-class structural dimension. Every fact carries <em>when</em> it was
      true and <em>when</em> it was recorded, enabling perfect audit trails, point-in-time queries, and
      causal reasoning over change.</p>

      <h3>Charlotte's "Time as Graph" Approach</h3>
      <p>In the Charlotte knowledge-graph framework, time is encoded as a <strong>temporal spine</strong>:
      a chain of <code>DATE</code> nodes linked by <code>NEXT</code> edges. Events, facts, and state
      transitions attach to date nodes, turning chronology into a traversable graph structure. This allows
      queries like <em>"What was true on 2024-03-15?"</em> to resolve via simple graph walks rather than
      range scans on timestamp columns.</p>

      <h3>Why Temporal Data Matters</h3>
      <ul>
        <li><strong>Auditability</strong> &mdash; Reconstruct the state of any entity at any point in time.</li>
        <li><strong>Bi-temporality</strong> &mdash; Distinguish "when something happened" (valid time) from "when we learned about it" (transaction time).</li>
        <li><strong>Event Sourcing</strong> &mdash; Store every change as an immutable event; derive current state by replaying the log.</li>
        <li><strong>Causal Ordering</strong> &mdash; Lamport clocks, vector clocks, and happens-before relationships preserve causality in distributed systems.</li>
      </ul>

      <h3>Scope of This Hub</h3>
      <p>This reference covers the full temporal-data landscape: formal temporal logic, event sourcing
      and CQRS patterns, bitemporal modeling, time-series databases, calendar/timezone systems, and the
      software tools that implement them. Each tab collects the best books, talks, papers, docs, and
      code repositories for its topic.</p>
    `,
    subsections: [
      {
        title: "Foundational Reading",
        resources: [
          { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", type: "book", level: "intermediate", url: "https://dataintensive.net/", desc: "The essential systems text. Chapter 11 on stream processing and Chapter 12 on data integration cover temporal concerns deeply." },
          { title: "Temporal Data & the Relational Model", author: "C.J. Date, Hugh Darwen, Nikos Lorentzos", type: "book", level: "advanced", url: "https://www.elsevier.com/books/temporal-data-and-the-relational-model/date/978-1-55860-855-9", desc: "Rigorous treatment of how temporal data fits into relational theory. Foundational reference for anyone building temporal schemas." },
          { title: "The Log: What every software engineer should know about real-time data's unifying abstraction", author: "Jay Kreps (LinkedIn Engineering)", type: "notes", level: "beginner", url: "https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying", desc: "Seminal blog post explaining how append-only logs underpin event sourcing, stream processing, and temporal data systems." },
          { title: "Time, Clocks, and the Ordering of Events in a Distributed System", author: "Leslie Lamport", type: "notes", level: "advanced", url: "https://lamport.azurewebsites.net/pubs/time-clocks.pdf", desc: "The 1978 paper that defined causal ordering and Lamport clocks. The intellectual foundation for all temporal reasoning in distributed systems." },
          { title: "Turning the Database Inside-Out with Apache Samza", author: "Martin Kleppmann (Strange Loop 2014)", type: "video", level: "intermediate", url: "https://www.youtube.com/watch?v=fU9hR3kiOK0", desc: "Influential talk reframing databases as materialized views over an immutable event log. Core conceptual model for temporal architectures." }
        ]
      },
      {
        title: "Introductory Talks & Tutorials",
        resources: [
          { title: "Event Sourcing You Are Doing It Wrong", author: "David Schmitz (Devoxx)", type: "video", level: "beginner", url: "https://www.youtube.com/watch?v=GzrZworHpIk", desc: "Practical overview of common event sourcing mistakes and how temporal thinking helps avoid them." },
          { title: "Introduction to Temporal Databases (Wikipedia)", author: "Wikipedia Contributors", type: "notes", level: "beginner", url: "https://en.wikipedia.org/wiki/Temporal_database", desc: "Comprehensive encyclopedia article covering valid time, transaction time, and bitemporal models with academic references." },
          { title: "Bi-Temporal Data Modeling with Envelope", author: "Cloudera Engineering Blog", type: "notes", level: "intermediate", url: "https://blog.cloudera.com/bi-temporal-data-modeling-with-envelope/", desc: "Practical walkthrough of bitemporal modeling in big-data pipelines using Cloudera Envelope on Apache Spark." },
          { title: "Time in Databases (Stanford CS345 Lecture Notes)", author: "Hector Garcia-Molina et al.", type: "notes", level: "intermediate", url: "https://cs.stanford.edu/people/chrismre/cs345/rl/temporal.pdf", desc: "Academic lecture notes on temporal query languages, Allen's interval algebra, and temporal extensions to SQL." }
        ]
      },
      {
        title: "Charlotte Framework Context",
        resources: [
          { title: "Paper 7: Temporal Perception", author: "Charlotte Architecture Papers", type: "notes", level: "advanced", url: "#", desc: "The Charlotte paper defining the temporal spine model: DATE nodes, NEXT edges, and time as a graph-traversable dimension of truth." },
          { title: "Graph-Based Temporal Modeling (Neo4j Blog)", author: "Neo4j", type: "notes", level: "intermediate", url: "https://neo4j.com/blog/modeling-time-series-data-neo4j/", desc: "How to model time-series and temporal data natively in a property graph. Directly relevant to the Charlotte temporal spine approach." }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     TAB 2 — Temporal Logic
     --------------------------------------------------------------- */
  {
    id: "temporal-logic",
    icon: "\u2283",
    label: "Temporal Logic",
    intro: `
      <p><strong>Temporal logic</strong> extends classical logic with operators that reason about time:
      "always", "eventually", "until", and "next". These formalisms underpin model checking, program
      verification, and the specification of concurrent systems.</p>

      <h3>Key Formalisms</h3>
      <ul>
        <li><strong>LTL (Linear Temporal Logic)</strong> &mdash; Reasons over a single infinite path of states. Operators: G (globally), F (finally), X (next), U (until).</li>
        <li><strong>CTL (Computation Tree Logic)</strong> &mdash; Branches over all possible futures. Adds path quantifiers A (all paths) and E (exists a path).</li>
        <li><strong>TLA+ (Temporal Logic of Actions)</strong> &mdash; Lamport's specification language combining temporal logic with set theory for systems design.</li>
        <li><strong>Allen's Interval Algebra</strong> &mdash; 13 relations between time intervals (before, meets, overlaps, during, etc.) for qualitative temporal reasoning.</li>
      </ul>

      <h3>Why It Matters for Temporal Databases</h3>
      <p>Temporal logic provides the formal language for expressing temporal constraints and queries.
      SQL:2011 temporal predicates, bitemporal assertions, and event-pattern matching in stream
      processors all descend from these formalisms.</p>
    `,
    subsections: [
      {
        title: "Textbooks & References",
        resources: [
          { title: "Principles of Model Checking", author: "Christel Baier & Joost-Pieter Katoen", type: "book", level: "advanced", url: "https://mitpress.mit.edu/books/principles-model-checking", desc: "The definitive graduate textbook on LTL, CTL, CTL*, and model-checking algorithms. Rigorous and comprehensive." },
          { title: "Specifying Systems: The TLA+ Language and Tools for Hardware and Software Engineers", author: "Leslie Lamport", type: "book", level: "advanced", url: "https://lamport.azurewebsites.net/tla/book.html", desc: "Lamport's own book on TLA+. Freely available online. The canonical reference for temporal specification of systems." },
          { title: "Temporal Logic: From Ancient Ideas to Artificial Intelligence", author: "Peter Øhrstrøm & Per Hasle", type: "book", level: "intermediate", url: "https://link.springer.com/book/10.1007/978-94-015-8616-2", desc: "Traces temporal logic from medieval philosophy to modern computer science. Unique historical perspective." },
          { title: "Logic in Computer Science: Modelling and Reasoning about Systems", author: "Michael Huth & Mark Ryan", type: "book", level: "intermediate", url: "https://www.cs.bham.ac.uk/research/projects/lics/", desc: "Excellent undergraduate text covering propositional, predicate, and temporal logics (LTL and CTL) with clear examples." }
        ]
      },
      {
        title: "TLA+ & Formal Methods",
        resources: [
          { title: "Lamport's TLA+ Video Course", author: "Leslie Lamport", type: "course", level: "intermediate", url: "https://lamport.azurewebsites.net/video/videos.html", desc: "Free video lectures by Lamport himself teaching TLA+ from scratch. The authoritative introduction." },
          { title: "Learn TLA+ (Practical Guide)", author: "Hillel Wayne", type: "notes", level: "beginner", url: "https://learntla.com/", desc: "A practical, example-driven introduction to TLA+ and PlusCal for working programmers. Much more approachable than the formal texts." },
          { title: "Practical TLA+: Planning Driven Development", author: "Hillel Wayne", type: "book", level: "beginner", url: "https://www.apress.com/gp/book/9781484238288", desc: "Book-length guide to using TLA+ for real-world system design. Covers PlusCal, model checking, and specification patterns." },
          { title: "Use of Formal Methods at Amazon Web Services", author: "Chris Newcombe et al.", type: "notes", level: "intermediate", url: "https://cacm.acm.org/magazines/2015/4/184701-how-amazon-web-services-uses-formal-methods/abstract", desc: "How AWS uses TLA+ to verify DynamoDB, S3, and other critical systems. Demonstrates industrial-scale value of temporal specification." }
        ]
      },
      {
        title: "Allen's Interval Algebra & Temporal Reasoning",
        resources: [
          { title: "Maintaining Knowledge about Temporal Intervals", author: "James F. Allen (1983)", type: "notes", level: "advanced", url: "https://cse.unl.edu/~choueiry/Documents/Allen-CACM1983.pdf", desc: "The original paper defining the 13 interval relations. Foundational for qualitative temporal reasoning in AI and databases." },
          { title: "Temporal Reasoning with Constraints (Tutorial)", author: "Stanford AI Lab", type: "notes", level: "intermediate", url: "https://ai.stanford.edu/~shoham/www%20papers/temporal-reasoning.pdf", desc: "Survey of constraint-based temporal reasoning covering Allen's algebra, point algebras, and their computational complexity." },
          { title: "SPIN Model Checker", author: "Gerard Holzmann", type: "code", level: "advanced", url: "https://spinroot.com/spin/whatispin.html", desc: "The most widely used LTL model checker. Verifies concurrent software against temporal-logic specifications written in Promela." },
          { title: "NuSMV Model Checker", author: "FBK-IRST", type: "code", level: "advanced", url: "https://nusmv.fbk.eu/", desc: "Symbolic model checker supporting both LTL and CTL specifications. Used extensively in hardware verification and protocol analysis." }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     TAB 3 — Event Sourcing
     --------------------------------------------------------------- */
  {
    id: "event-sourcing",
    icon: "\u27F3",
    label: "Event Sourcing",
    intro: `
      <p><strong>Event Sourcing</strong> stores every change to application state as an immutable event in an
      append-only log. Current state is derived by replaying or projecting the event stream. This gives you
      a complete audit trail, temporal queries for free, and the ability to rebuild state from any point.</p>

      <h3>Core Concepts</h3>
      <ul>
        <li><strong>Events</strong> &mdash; Immutable facts that something happened: <code>OrderPlaced</code>, <code>PaymentReceived</code>, <code>ItemShipped</code>.</li>
        <li><strong>Event Store</strong> &mdash; Append-only database optimized for writing and reading ordered event streams.</li>
        <li><strong>Projections</strong> &mdash; Read models built by folding over the event stream. Multiple projections can serve different query patterns.</li>
        <li><strong>Snapshots</strong> &mdash; Periodic checkpoints of aggregate state to avoid replaying the full history on every load.</li>
        <li><strong>Commands & Aggregates</strong> &mdash; Commands express intent; aggregates validate and emit events. The write side of CQRS.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Essential Talks",
        resources: [
          { title: "Event Sourcing", author: "Greg Young (GOTO 2014)", type: "video", level: "beginner", url: "https://www.youtube.com/watch?v=8JKjvY4etTY", desc: "The canonical introduction to event sourcing by the person most associated with the pattern. Start here." },
          { title: "A Decade of DDD, CQRS, Event Sourcing", author: "Greg Young (DDD Europe 2016)", type: "video", level: "intermediate", url: "https://www.youtube.com/watch?v=LDW0QWie21s", desc: "Retrospective on lessons learned after a decade of applying event sourcing in production systems." },
          { title: "Event Sourcing & Stream Processing at Scale", author: "Martin Kleppmann (Strange Loop 2016)", type: "video", level: "intermediate", url: "https://www.youtube.com/watch?v=avi-TZI9t2I", desc: "Connects event sourcing to stream processing, Kafka, and the broader data-infrastructure landscape." },
          { title: "The Many Meanings of Event-Driven Architecture", author: "Martin Fowler (GOTO 2017)", type: "video", level: "beginner", url: "https://www.youtube.com/watch?v=STKCRSUsyP0", desc: "Fowler distinguishes four patterns: event notification, event-carried state transfer, event sourcing, and CQRS." }
        ]
      },
      {
        title: "Articles & Patterns",
        resources: [
          { title: "Event Sourcing Pattern", author: "Martin Fowler", type: "notes", level: "beginner", url: "https://martinfowler.com/eaaDev/EventSourcing.html", desc: "Fowler's original pattern description. Concise, clear, and widely referenced." },
          { title: "Event Sourcing Pattern (Microsoft Azure Architecture)", author: "Microsoft", type: "notes", level: "intermediate", url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing", desc: "Detailed pattern documentation with implementation considerations, anti-patterns, and Azure-specific guidance." },
          { title: "Versioning in an Event Sourced System", author: "Greg Young", type: "book", level: "intermediate", url: "https://leanpub.com/esversioning", desc: "Free e-book covering the hardest practical problem in event sourcing: evolving event schemas over time." },
          { title: "Event Sourcing Made Simple", author: "Oskar Dudycz", type: "notes", level: "beginner", url: "https://event-driven.io/en/event_sourcing_on_the_whole/", desc: "Practical blog series walking through event sourcing step by step with .NET examples. Excellent for getting started." }
        ]
      },
      {
        title: "Books & Deep Dives",
        resources: [
          { title: "Implementing Domain-Driven Design", author: "Vaughn Vernon", type: "book", level: "intermediate", url: "https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/", desc: "Chapters on aggregates, domain events, and event sourcing within a DDD context. The practical companion to Evans' blue book." },
          { title: "Domain-Driven Design: Tackling Complexity in the Heart of Software", author: "Eric Evans", type: "book", level: "advanced", url: "https://www.domainlanguage.com/ddd/", desc: "The original DDD book. Event sourcing grew out of this community. Essential conceptual foundation." },
          { title: "Building Event-Driven Microservices", author: "Adam Bellemare (O'Reilly)", type: "book", level: "intermediate", url: "https://www.oreilly.com/library/view/building-event-driven-microservices/9781492057888/", desc: "Comprehensive guide to event-driven architecture with Kafka, event sourcing, and stream processing at the center." },
          { title: "Retroactive Events (Pattern)", author: "Martin Fowler", type: "notes", level: "advanced", url: "https://martinfowler.com/eaaDev/RetroactiveEvent.html", desc: "Pattern for handling late-arriving or corrected events. Critical for real-world temporal correctness." }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     TAB 4 — Bitemporal Modeling
     --------------------------------------------------------------- */
  {
    id: "bitemporal",
    icon: "\u229E",
    label: "Bitemporal",
    intro: `
      <p><strong>Bitemporal modeling</strong> tracks two independent time dimensions for every fact:</p>
      <ul>
        <li><strong>Valid Time (VT)</strong> &mdash; When the fact was true in the real world.</li>
        <li><strong>Transaction Time (TT)</strong> &mdash; When the fact was recorded in the database.</li>
      </ul>
      <p>This two-dimensional timeline enables four classes of queries: <em>current</em> (now/now),
      <em>historical</em> (past VT / now TT), <em>rollback</em> (now VT / past TT), and
      <em>bitemporal</em> (past VT / past TT). The SQL:2011 standard added temporal table support,
      and databases like PostgreSQL, Oracle, IBM DB2, and SQL Server now offer temporal features.</p>

      <h3>Snodgrass's Axiom</h3>
      <p><em>"A temporal database never forgets."</em> Unlike conventional UPDATE/DELETE, bitemporal
      systems preserve all previous versions of every row, making corrections visible rather than destructive.</p>
    `,
    subsections: [
      {
        title: "Canonical Textbooks",
        resources: [
          { title: "Developing Time-Oriented Database Applications in SQL", author: "Richard T. Snodgrass", type: "book", level: "advanced", url: "https://www2.cs.arizona.edu/~rts/tdbbook.pdf", desc: "The Snodgrass textbook, freely available as PDF. The foundational reference for bitemporal SQL modeling. Every temporal DB practitioner should read this." },
          { title: "Bitemporal Data: Theory and Practice", author: "Tom Johnston & Randall Weis", type: "book", level: "intermediate", url: "https://www.elsevier.com/books/bitemporal-data/johnston/978-0-12-408067-2", desc: "Modern, practical treatment of bitemporal modeling. Covers asserted versioning, temporal foreign keys, and real-world patterns." },
          { title: "Managing Time in Relational Databases", author: "Tom Johnston", type: "book", level: "intermediate", url: "https://www.elsevier.com/books/managing-time-in-relational-databases/johnston/978-0-12-375041-9", desc: "Johnston's earlier book focusing on practical temporal modeling techniques for relational databases." },
          { title: "Temporal Data & the Relational Model", author: "C.J. Date, Hugh Darwen, Nikos Lorentzos", type: "book", level: "advanced", url: "https://www.elsevier.com/books/temporal-data-and-the-relational-model/date/978-1-55860-855-9", desc: "Theoretical treatment grounded in relational algebra. How temporal operators should work in a truly relational system." }
        ]
      },
      {
        title: "SQL:2011 Temporal & Database Implementations",
        resources: [
          { title: "SQL:2011 Temporal Features (Kulkarni & Michels)", author: "Krishna Kulkarni, Jan-Eike Michels", type: "notes", level: "intermediate", url: "https://dl.acm.org/doi/10.1145/2380776.2380786", desc: "Paper by the SQL:2011 temporal feature authors explaining the standard's application-time and system-time period support." },
          { title: "Temporal Tables in SQL Server", author: "Microsoft Docs", type: "notes", level: "beginner", url: "https://learn.microsoft.com/en-us/sql/relational-databases/tables/temporal-tables", desc: "Official documentation for system-versioned temporal tables in SQL Server. Includes creation, querying, and retention policies." },
          { title: "PostgreSQL Temporal Tables Extension", author: "arkhipov/temporal_tables", type: "code", level: "intermediate", url: "https://github.com/arkhipov/temporal_tables", desc: "PostgreSQL extension implementing system-versioned temporal tables. Automatic history tracking with FOR SYSTEM_TIME queries." },
          { title: "Oracle Workspace Manager (Temporal)", author: "Oracle Docs", type: "notes", level: "intermediate", url: "https://docs.oracle.com/en/database/oracle/oracle-database/19/adwsm/", desc: "Oracle's approach to temporal versioning using workspaces. Supports valid-time and transaction-time dimensions." },
          { title: "IBM DB2 Time Travel Query", author: "IBM Documentation", type: "notes", level: "intermediate", url: "https://www.ibm.com/docs/en/db2/11.5?topic=tables-temporal", desc: "DB2's bitemporal table support including system time, business time, and bitemporal queries with period specifications." }
        ]
      },
      {
        title: "Tutorials & Practical Guides",
        resources: [
          { title: "Bitemporal Modeling (Martin Fowler)", author: "Martin Fowler", type: "notes", level: "beginner", url: "https://martinfowler.com/articles/bitemporal-history.html", desc: "Clear introduction to bitemporal concepts with diagrams showing the four quadrants of temporal queries." },
          { title: "Slowly Changing Dimensions vs. Bitemporal Tables", author: "Kimball Group", type: "notes", level: "intermediate", url: "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/", desc: "Data warehousing perspective comparing SCD Type 2 with full bitemporal modeling. Important for analytical temporal systems." },
          { title: "Bitemporal Adventures with Datomic", author: "Cognitect / Rich Hickey community", type: "notes", level: "intermediate", url: "https://docs.datomic.com/cloud/whatis/data-model.html", desc: "Datomic's immutable, time-aware database model. Every fact is stored with its transaction time, enabling as-of queries natively." }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     TAB 5 — Time-Series Databases
     --------------------------------------------------------------- */
  {
    id: "timeseries-db",
    icon: "\u23F1",
    label: "Time-Series DBs",
    intro: `
      <p><strong>Time-series databases (TSDBs)</strong> are optimized for ingesting, storing, and querying
      timestamped data points at high throughput. They power observability (metrics, logs, traces),
      IoT telemetry, financial tick data, and sensor networks.</p>

      <h3>Key Characteristics</h3>
      <ul>
        <li><strong>Write-optimized</strong> &mdash; Append-heavy workloads with millions of data points per second.</li>
        <li><strong>Time-based partitioning</strong> &mdash; Data is chunked by time windows for efficient range queries and retention.</li>
        <li><strong>Compression</strong> &mdash; Delta-of-delta, Gorilla encoding, and dictionary compression exploit temporal locality.</li>
        <li><strong>Downsampling & Retention</strong> &mdash; Automatic rollup of old data to lower resolutions.</li>
        <li><strong>Specialized Query Languages</strong> &mdash; PromQL, Flux, InfluxQL, SQL with time-series extensions.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Major Time-Series Databases",
        resources: [
          { title: "TimescaleDB Documentation", author: "Timescale Inc.", type: "notes", level: "beginner", url: "https://docs.timescale.com/", desc: "PostgreSQL extension for time-series. Full SQL support, hypertables, continuous aggregates, and compression. Best choice for teams already on PostgreSQL." },
          { title: "InfluxDB Documentation", author: "InfluxData", type: "notes", level: "beginner", url: "https://docs.influxdata.com/influxdb/", desc: "Purpose-built TSDB with its own query languages (Flux, InfluxQL). Strong ecosystem for monitoring and IoT." },
          { title: "QuestDB Documentation", author: "QuestDB", type: "notes", level: "intermediate", url: "https://questdb.io/docs/", desc: "High-performance TSDB with SQL support, columnar storage, and SIMD-accelerated queries. Excellent benchmark performance." },
          { title: "Prometheus Documentation", author: "CNCF / Prometheus Authors", type: "notes", level: "beginner", url: "https://prometheus.io/docs/introduction/overview/", desc: "The standard for cloud-native monitoring. Pull-based metrics collection with PromQL query language. Foundation of the observability stack." },
          { title: "VictoriaMetrics Documentation", author: "VictoriaMetrics", type: "notes", level: "intermediate", url: "https://docs.victoriametrics.com/", desc: "High-performance, cost-effective Prometheus-compatible TSDB. Excellent for long-term storage and high-cardinality metrics." }
        ]
      },
      {
        title: "Comparisons & Benchmarks",
        resources: [
          { title: "DB-Engines Ranking: Time Series DBMS", author: "DB-Engines", type: "notes", level: "beginner", url: "https://db-engines.com/en/ranking/time+series+dbms", desc: "Live popularity ranking of time-series databases. Useful for understanding market adoption and trends." },
          { title: "Time Series Benchmark Suite (TSBS)", author: "Timescale Inc.", type: "code", level: "intermediate", url: "https://github.com/timescale/tsbs", desc: "Open-source benchmark framework for comparing TSDBs. Generates realistic workloads for InfluxDB, TimescaleDB, MongoDB, and others." },
          { title: "Choosing a Time-Series Database", author: "Percona Blog", type: "notes", level: "beginner", url: "https://www.percona.com/blog/an-overview-of-time-series-databases/", desc: "Practical comparison of TSDB architectures, trade-offs, and use cases. Good starting point for technology selection." },
          { title: "ClickHouse for Time Series", author: "ClickHouse Documentation", type: "notes", level: "intermediate", url: "https://clickhouse.com/docs/en/guides/developer/time-series", desc: "How to use ClickHouse's columnar OLAP engine for time-series workloads. MergeTree engine and time-based partitioning." }
        ]
      },
      {
        title: "Architecture & Internals",
        resources: [
          { title: "Gorilla: A Fast, Scalable, In-Memory Time Series Database", author: "Facebook / Pelkonen et al. (VLDB 2015)", type: "notes", level: "advanced", url: "http://www.vldb.org/pvldb/vol8/p1816-teller.pdf", desc: "The paper behind Facebook's in-memory TSDB. Introduced delta-of-delta and XOR-based float compression, now used in Prometheus and others." },
          { title: "Prometheus TSDB (Fabian Reinartz)", author: "Fabian Reinartz", type: "video", level: "advanced", url: "https://www.youtube.com/watch?v=b_pEevMAC3I", desc: "Deep dive into the internal architecture of Prometheus's time-series storage engine by its creator." },
          { title: "Writing a Time Series Database from Scratch", author: "Fabian Reinartz (blog)", type: "notes", level: "advanced", url: "https://fabxc.org/tsdb/", desc: "Detailed walkthrough of designing and building a TSDB from first principles. Covers chunks, indexes, compaction, and WAL." }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     TAB 6 — CQRS & Event-Driven Architecture
     --------------------------------------------------------------- */
  {
    id: "cqrs",
    icon: "\u27C1",
    label: "CQRS & EDA",
    intro: `
      <p><strong>CQRS (Command Query Responsibility Segregation)</strong> separates the write model
      (commands that change state) from the read model (queries that return data). Combined with
      <strong>Event-Driven Architecture (EDA)</strong>, this creates systems where every state change
      flows through an event bus, enabling temporal replay, audit trails, and independent scaling of
      reads and writes.</p>

      <h3>Why CQRS + Events?</h3>
      <ul>
        <li><strong>Temporal decoupling</strong> &mdash; Writes and reads evolve independently; projections can be rebuilt from the event log.</li>
        <li><strong>Scalability</strong> &mdash; Read-heavy and write-heavy sides scale separately.</li>
        <li><strong>Flexibility</strong> &mdash; Multiple read models (search index, cache, analytics) all derived from the same event stream.</li>
        <li><strong>Auditability</strong> &mdash; The event log is the system of record; current state is a derivative.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Core CQRS Resources",
        resources: [
          { title: "CQRS Documents", author: "Greg Young", type: "notes", level: "beginner", url: "https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf", desc: "Greg Young's original CQRS paper. Short, clear, and definitive. The primary source for the pattern." },
          { title: "CQRS Pattern (Microsoft Azure Architecture)", author: "Microsoft", type: "notes", level: "beginner", url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs", desc: "Well-structured pattern documentation with diagrams, implementation considerations, and guidance on when to use CQRS." },
          { title: "CQRS, Task Based UIs, Event Sourcing aaagh!", author: "Greg Young", type: "notes", level: "beginner", url: "https://goodenoughsoftware.net/2012/03/02/cqrs/", desc: "Clarifying post disentangling CQRS from event sourcing. They're complementary but independent patterns." },
          { title: "Clarified CQRS", author: "Udi Dahan", type: "notes", level: "intermediate", url: "https://udidahan.com/2009/12/09/clarified-cqrs/", desc: "Udi Dahan's influential take on CQRS emphasizing service boundaries and autonomous components." }
        ]
      },
      {
        title: "Event-Driven Architecture",
        resources: [
          { title: "Enterprise Integration Patterns", author: "Gregor Hohpe & Bobby Woolf", type: "book", level: "intermediate", url: "https://www.enterpriseintegrationpatterns.com/", desc: "The canonical catalog of messaging patterns: publish-subscribe, message routing, event aggregation. Foundation for all EDA work." },
          { title: "Building Event-Driven Microservices", author: "Adam Bellemare", type: "book", level: "intermediate", url: "https://www.oreilly.com/library/view/building-event-driven-microservices/9781492057888/", desc: "End-to-end guide to event-driven microservice architecture with Kafka, event stores, and stream processing." },
          { title: "Kafka: The Definitive Guide (2nd Edition)", author: "Gwen Shapira, Todd Palino, Rajini Sivaram, Krit Petty", type: "book", level: "intermediate", url: "https://www.oreilly.com/library/view/kafka-the-definitive/9781492043072/", desc: "Comprehensive guide to Apache Kafka: the dominant event streaming platform powering most production event-driven systems." },
          { title: "The Log (Jay Kreps)", author: "Jay Kreps", type: "notes", level: "beginner", url: "https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying", desc: "How the append-only log unifies event sourcing, stream processing, and data integration. Essential conceptual reading." }
        ]
      },
      {
        title: "Tutorials & Implementation Guides",
        resources: [
          { title: "Implementing CQRS with MediatR and .NET", author: "Jason Taylor", type: "video", level: "intermediate", url: "https://www.youtube.com/watch?v=5kOzBRqZiDI", desc: "Practical walkthrough of implementing CQRS in .NET using MediatR for command/query dispatching." },
          { title: "Event-Driven Architecture with Apache Kafka (Confluent)", author: "Confluent Developer", type: "course", level: "beginner", url: "https://developer.confluent.io/learn-kafka/", desc: "Free course series covering Kafka fundamentals, stream processing, and event-driven design patterns." },
          { title: "Saga Pattern for Distributed Transactions", author: "Chris Richardson / Microservices.io", type: "notes", level: "intermediate", url: "https://microservices.io/patterns/data/saga.html", desc: "The Saga pattern for managing distributed transactions across event-sourced services. Choreography vs. orchestration approaches." },
          { title: "Outbox Pattern (Reliable Event Publishing)", author: "Debezium / Gunnar Morling", type: "notes", level: "intermediate", url: "https://debezium.io/blog/2019/02/19/reliable-microservices-data-exchange-with-the-outbox-pattern/", desc: "Transactional outbox pattern for reliable event publishing. Solves the dual-write problem in event-driven systems." }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     TAB 7 — Calendar Systems
     --------------------------------------------------------------- */
  {
    id: "calendar",
    icon: "\u25C8",
    label: "Calendar Systems",
    intro: `
      <p>Correct temporal data handling requires understanding <strong>calendar systems</strong>,
      <strong>timezone rules</strong>, and the many surprising edge cases in date/time representation.
      This tab collects resources on ISO 8601, the Julian/Gregorian transition, timezone databases,
      and the infamous "falsehoods programmers believe about time."</p>

      <h3>Key Topics</h3>
      <ul>
        <li><strong>ISO 8601</strong> &mdash; The international standard for date/time representation: <code>2024-03-15T14:30:00Z</code>.</li>
        <li><strong>Julian & Gregorian Calendars</strong> &mdash; Historical calendar systems and the 10-day gap of October 1582.</li>
        <li><strong>IANA Time Zone Database (tzdata)</strong> &mdash; The definitive source for timezone rules, maintained by ICANN.</li>
        <li><strong>Temporal Types in SQL</strong> &mdash; DATE, TIME, TIMESTAMP, TIMESTAMP WITH TIME ZONE, INTERVAL.</li>
        <li><strong>Date/Time Libraries</strong> &mdash; java.time, Joda-Time, Moment.js/Luxon, chrono (Rust), arrow (Python).</li>
      </ul>
    `,
    subsections: [
      {
        title: "Standards & References",
        resources: [
          { title: "ISO 8601 (Wikipedia)", author: "Wikipedia Contributors", type: "notes", level: "beginner", url: "https://en.wikipedia.org/wiki/ISO_8601", desc: "Comprehensive overview of the ISO 8601 date/time standard including durations, intervals, and week numbering." },
          { title: "IANA Time Zone Database", author: "ICANN / Paul Eggert", type: "data", level: "intermediate", url: "https://www.iana.org/time-zones", desc: "The tzdata database: the authoritative source for global timezone rules. Updated several times per year as governments change their rules." },
          { title: "The Complexity of Time Data Programming", author: "Jon Skeet (blog)", type: "notes", level: "intermediate", url: "https://codeblog.jonskeet.uk/2019/03/27/storing-utc-is-not-a-silver-bullet/", desc: "Jon Skeet's incisive post on why 'just store UTC' is insufficient. Covers future events, timezone transitions, and calendar intent." },
          { title: "Falsehoods Programmers Believe About Time", author: "Noah Sussman", type: "notes", level: "beginner", url: "https://infiniteundo.com/post/25326999628/falsehoods-programmers-believe-about-time", desc: "The classic list of time-related assumptions that break software. Required reading for every developer handling dates." }
        ]
      },
      {
        title: "Falsehoods & Edge Cases",
        resources: [
          { title: "More Falsehoods Programmers Believe About Time", author: "Noah Sussman", type: "notes", level: "beginner", url: "https://infiniteundo.com/post/25509354022/more-falsehoods-programmers-believe-about-time", desc: "The sequel: even more broken assumptions about time, including timezone political changes and calendar transitions." },
          { title: "The Problem with Time & Timezones (Computerphile)", author: "Tom Scott / Computerphile", type: "video", level: "beginner", url: "https://www.youtube.com/watch?v=-5wpm-gesOY", desc: "Entertaining and educational video on why timezone handling is a nightmare. Leap seconds, DST, and political whims." },
          { title: "UTC is Enough for Everyone, Right?", author: "Zach Holman", type: "notes", level: "beginner", url: "https://zachholman.com/talk/utc-is-enough-for-everyone-right", desc: "Talk/post covering the full horror of date/time edge cases: leap seconds, date-line crossings, timezone abbreviation ambiguity." },
          { title: "Leap Second (Wikipedia)", author: "Wikipedia Contributors", type: "notes", level: "beginner", url: "https://en.wikipedia.org/wiki/Leap_second", desc: "Explanation of leap seconds, their history, and the ongoing debate about abolishing them (tentatively scheduled for 2035)." }
        ]
      },
      {
        title: "Date/Time Libraries",
        resources: [
          { title: "java.time (JSR 310) — Official Tutorial", author: "Oracle", type: "notes", level: "beginner", url: "https://docs.oracle.com/javase/tutorial/datetime/", desc: "Official tutorial for Java's modern date/time API. ZonedDateTime, Instant, Duration, Period, and temporal adjusters." },
          { title: "Luxon (JavaScript Date Library)", author: "Isaac Cambron / Moment.js team", type: "code", level: "beginner", url: "https://moment.github.io/luxon/", desc: "Modern JavaScript date/time library replacing Moment.js. Immutable, timezone-aware, and built on the Intl API." },
          { title: "Temporal Proposal (TC39)", author: "TC39 / Maggie Pint, Philipp Dunkel et al.", type: "code", level: "intermediate", url: "https://tc39.es/proposal-temporal/docs/", desc: "The TC39 Temporal proposal: a complete replacement for JavaScript's broken Date object. PlainDate, ZonedDateTime, Duration, and more." },
          { title: "Arrow (Python Date Library)", author: "Chris Smith et al.", type: "code", level: "beginner", url: "https://arrow.readthedocs.io/", desc: "Python library for sensible date/time handling. Human-friendly creation, timezone conversion, and relative delta support." }
        ]
      }
    ]
  },

  /* ---------------------------------------------------------------
     TAB 8 — Datasets & Software
     --------------------------------------------------------------- */
  {
    id: "datasets",
    icon: "\u262C",
    label: "Datasets & Software",
    intro: `
      <p>This tab collects the <strong>tools, frameworks, and platforms</strong> that implement temporal
      data patterns: event stores, event-sourcing frameworks, temporal workflow engines, and time-series
      libraries. These are the building blocks for constructing temporal systems.</p>

      <h3>Categories</h3>
      <ul>
        <li><strong>Event Stores</strong> &mdash; Databases purpose-built for event sourcing: EventStoreDB, Apache Kafka.</li>
        <li><strong>Frameworks</strong> &mdash; Libraries for building event-sourced applications: Axon, Marten, EventSourcing.</li>
        <li><strong>Temporal Workflows</strong> &mdash; Durable execution engines: Temporal.io, Cadence, Restate.</li>
        <li><strong>Time Libraries</strong> &mdash; Low-level date/time manipulation across languages.</li>
      </ul>
    `,
    subsections: [
      {
        title: "Event Stores & Streaming Platforms",
        resources: [
          { title: "EventStoreDB", author: "Event Store Ltd.", type: "code", level: "intermediate", url: "https://www.eventstore.com/", desc: "Purpose-built database for event sourcing. Supports projections, subscriptions, and optimistic concurrency. The reference event store implementation." },
          { title: "Apache Kafka", author: "Apache Software Foundation", type: "code", level: "intermediate", url: "https://kafka.apache.org/documentation/", desc: "Distributed event streaming platform. The de facto standard for high-throughput event pipelines. Topic-based, partitioned, and replicated." },
          { title: "Apache Pulsar", author: "Apache Software Foundation", type: "code", level: "intermediate", url: "https://pulsar.apache.org/docs/", desc: "Multi-tenant distributed messaging and streaming platform. Tiered storage, schema registry, and Kafka-compatible API." },
          { title: "Redpanda", author: "Redpanda Data", type: "code", level: "intermediate", url: "https://docs.redpanda.com/", desc: "Kafka-compatible streaming platform written in C++. No JVM, no ZooKeeper. Simpler operations with Kafka API compatibility." }
        ]
      },
      {
        title: "Event Sourcing Frameworks",
        resources: [
          { title: "Axon Framework", author: "AxonIQ", type: "code", level: "intermediate", url: "https://docs.axoniq.io/reference-guide/", desc: "Java/Kotlin framework for CQRS and event sourcing. Aggregates, sagas, projections, and the Axon Server event store." },
          { title: "Marten (.NET Document DB & Event Store)", author: "Jeremy D. Miller et al.", type: "code", level: "intermediate", url: "https://martendb.io/", desc: ".NET library using PostgreSQL as both document database and event store. Excellent for .NET teams adopting event sourcing incrementally." },
          { title: "Eventuous (.NET Event Sourcing)", author: "Alexey Zimarev", type: "code", level: "intermediate", url: "https://eventuous.dev/", desc: "Modern .NET event sourcing library with first-class support for EventStoreDB, subscriptions, and projections." },
          { title: "Commanded (Elixir CQRS/ES)", author: "Ben Smith", type: "code", level: "intermediate", url: "https://github.com/commanded/commanded", desc: "Elixir framework for CQRS and event sourcing. Leverages OTP for fault-tolerant aggregate processes." }
        ]
      },
      {
        title: "Temporal Workflow Engines",
        resources: [
          { title: "Temporal.io", author: "Temporal Technologies", type: "code", level: "intermediate", url: "https://docs.temporal.io/", desc: "Durable execution platform for long-running workflows. Automatic retries, timeouts, and state persistence. Supports Go, Java, TypeScript, Python." },
          { title: "Cadence (Uber)", author: "Uber Engineering", type: "code", level: "intermediate", url: "https://cadenceworkflow.io/docs/", desc: "The predecessor to Temporal.io, built at Uber. Durable workflow orchestration with activity-based programming model." },
          { title: "Restate", author: "Restate Dev", type: "code", level: "beginner", url: "https://restate.dev/", desc: "Lightweight durable execution engine. Simpler than Temporal for many use cases. SDK-first approach with journal-based durability." },
          { title: "Datomic", author: "Cognitect (Rich Hickey)", type: "code", level: "advanced", url: "https://www.datomic.com/", desc: "Immutable database where all data is temporal by default. Every transaction is recorded with its time, enabling as-of queries across the full database history." }
        ]
      },
      {
        title: "Time Libraries & Utilities",
        resources: [
          { title: "chrono (Rust)", author: "Kang Seonghoon et al.", type: "code", level: "intermediate", url: "https://docs.rs/chrono/latest/chrono/", desc: "The standard Rust date/time library. Timezone-aware, leap-second aware, with formatting and parsing." },
          { title: "Noda Time (.NET)", author: "Jon Skeet et al.", type: "code", level: "intermediate", url: "https://nodatime.org/", desc: "Alternative .NET date/time library inspired by Joda-Time. Strict separation of concepts: Instant, LocalDate, ZonedDateTime." },
          { title: "dateutil (Python)", author: "Gustavo Niemeyer / Paul Ganssle", type: "code", level: "beginner", url: "https://dateutil.readthedocs.io/", desc: "Powerful Python extensions to the standard datetime module. Relative deltas, timezone handling, and flexible date parsing." },
          { title: "day.js (JavaScript)", author: "iamkun", type: "code", level: "beginner", url: "https://day.js.org/", desc: "Minimalist JavaScript date library (2KB). Moment.js-compatible API with immutable operations and plugin architecture." }
        ]
      }
    ]
  }
];

/* ===================================================================
   Rendering Engine
   =================================================================== */

const tabBar    = document.getElementById("tab-bar");
const mainEl    = document.getElementById("main-content");
const searchIn  = document.getElementById("search-input");
const searchClr = document.getElementById("search-clear");
const statCount = document.getElementById("stat-count");

let activeTab    = SECTIONS[0].id;
let activeFilter = "all";
let searchTerm   = "";

/* --- count total resources --- */
const totalResources = SECTIONS.reduce((sum, s) =>
  sum + s.subsections.reduce((ss, sub) => ss + sub.resources.length, 0), 0);
statCount.textContent = totalResources;

/* --- build tabs --- */
SECTIONS.forEach(s => {
  const btn = document.createElement("button");
  btn.className = "tab-btn" + (s.id === activeTab ? " active" : "");
  btn.dataset.tab = s.id;
  btn.innerHTML = `<span class="tab-icon">${s.icon}</span><span class="tab-label">${s.label}</span>`;
  btn.addEventListener("click", () => switchTab(s.id));
  tabBar.appendChild(btn);
});

function switchTab(id) {
  activeTab = id;
  activeFilter = "all";
  tabBar.querySelectorAll(".tab-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.tab === id));
  render();
}

/* --- search --- */
searchIn.addEventListener("input", () => {
  searchTerm = searchIn.value.trim().toLowerCase();
  render();
});
searchClr.addEventListener("click", () => {
  searchIn.value = "";
  searchTerm = "";
  render();
});

/* --- highlight helper --- */
function hl(text) {
  if (!searchTerm) return text;
  const esc = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${esc})`, "gi"), "<mark>$1</mark>");
}

/* --- filter bar types --- */
function getTypes(section) {
  const types = new Set();
  section.subsections.forEach(sub =>
    sub.resources.forEach(r => types.add(r.type)));
  return Array.from(types);
}

/* --- render --- */
function render() {
  const section = SECTIONS.find(s => s.id === activeTab);
  if (!section) return;

  let html = `<div class="section-header"><h2><span class="section-icon">${section.icon}</span>${section.label}</h2></div>`;
  html += `<div class="section-intro">${section.intro}</div>`;

  /* filter bar */
  const types = getTypes(section);
  html += `<div class="filter-bar">`;
  html += `<button class="filter-btn${activeFilter === "all" ? " active" : ""}" data-filter="all">All</button>`;
  types.forEach(t => {
    html += `<button class="filter-btn${activeFilter === t ? " active" : ""}" data-filter="${t}">${t}</button>`;
  });
  html += `</div>`;

  /* subsections */
  section.subsections.forEach(sub => {
    const filtered = sub.resources.filter(r => {
      if (activeFilter !== "all" && r.type !== activeFilter) return false;
      if (searchTerm) {
        const blob = `${r.title} ${r.author} ${r.desc} ${r.type} ${r.level}`.toLowerCase();
        if (!blob.includes(searchTerm)) return false;
      }
      return true;
    });
    if (filtered.length === 0) return;

    html += `<div class="subsection"><h3>${sub.title}</h3><div class="card-grid">`;
    filtered.forEach(r => {
      const badge = `badge-${r.type}`;
      const level = `level-${r.level}`;
      html += `
        <a class="card" href="${r.url}" target="_blank" rel="noopener noreferrer">
          <div class="card-top">
            <span class="type-badge ${badge}">${r.type}</span>
            <span class="level-badge ${level}">${r.level}</span>
          </div>
          <div class="card-title">${hl(r.title)}</div>
          <div class="card-author">${hl(r.author)}</div>
          <div class="card-desc">${hl(r.desc)}</div>
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

/* initial render */
render();
