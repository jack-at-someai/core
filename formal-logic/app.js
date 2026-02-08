/* ===== Formal Logic Reference Hub — app.js ===== */

const SECTIONS = [
  /* -------- 0  Overview -------- */
  {
    id: "overview",
    icon: "\u25C7",
    label: "Overview",
    intro: `
<p><strong>Formal Logic</strong> is the mathematical backbone of Charlotte's architecture. Every reasoning chain, every proof obligation, every Lisp S-expression rests on the syntax and semantics studied here.</p>

<h3>Why This Hub Exists</h3>
<p>Charlotte's papers depend on <strong>first-order logic (FOL)</strong> for knowledge representation and inference, and on <strong>Lisp/Scheme</strong> as the executable mirror of logical forms. This reference hub collects the best textbooks, lecture series, open courseware, and software tools so that every collaborator shares a common foundation.</p>

<h3>Suggested Learning Path</h3>
<ol>
  <li><strong>Propositional Logic</strong> — truth tables, connectives, normal forms, resolution</li>
  <li><strong>Predicate Logic (FOL)</strong> — quantifiers, models, soundness &amp; completeness</li>
  <li><strong>Model Theory</strong> — structures, ultraproducts, types, compactness</li>
  <li><strong>Lambda Calculus</strong> — Church encoding, typed systems, Curry-Howard</li>
  <li><strong>Lisp &amp; Scheme</strong> — SICP, The Little Schemer, practical implementations</li>
  <li><strong>Automated Reasoning</strong> — theorem provers, SMT solvers, formal verification</li>
  <li><strong>Datasets &amp; Software</strong> — hands-on tools, logic programming, SAT solvers</li>
</ol>

<h3>Connection to Charlotte</h3>
<p>Charlotte's FOL backbone translates natural-language claims into first-order formulas, checks consistency via SAT/SMT solvers, and generates Lisp code that mirrors logical structure. Every tab in this hub maps to a layer of that pipeline.</p>
    `,
    subsections: [
      {
        title: "Foundational Textbooks",
        items: [
          { title: "A Mathematical Introduction to Logic", author: "Herbert B. Enderton", type: "book", level: "beginner", url: "https://www.amazon.com/Mathematical-Introduction-Logic-Herbert-Enderton/dp/0122384520", desc: "The standard introduction covering propositional and predicate logic with completeness proofs. Ideal first textbook." },
          { title: "Introduction to Mathematical Logic", author: "Elliott Mendelson", type: "book", level: "intermediate", url: "https://www.amazon.com/Introduction-Mathematical-Logic-Elliott-Mendelson/dp/1482237725", desc: "Comprehensive treatment of propositional calculus, FOL, formal number theory, and axiomatic set theory." },
          { title: "Logic in Computer Science", author: "Michael Huth & Mark Ryan", type: "book", level: "beginner", url: "https://www.amazon.com/Logic-Computer-Science-Modelling-Reasoning/dp/052154310X", desc: "Propositional logic, predicate logic, temporal logic, and model checking oriented toward CS applications." },
          { title: "Mathematical Logic", author: "Joseph R. Shoenfield", type: "book", level: "advanced", url: "https://www.amazon.com/Mathematical-Logic-Joseph-Shoenfield/dp/1568811357", desc: "Classic graduate-level text: completeness, compactness, incompleteness, recursion theory." }
        ]
      },
      {
        title: "Courses & Lecture Series",
        items: [
          { title: "MIT 6.042J — Mathematics for Computer Science", author: "MIT OpenCourseWare", type: "course", level: "beginner", url: "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/", desc: "Covers propositional and predicate logic fundamentals, proofs, induction, and discrete math essentials." },
          { title: "Stanford CS 157 — Computational Logic", author: "Michael Genesereth", type: "course", level: "intermediate", url: "http://intrologic.stanford.edu/", desc: "Herbrand logic, relational logic, proofs, and logic programming. Full course materials online." },
          { title: "Logic & Proof (Carnegie Mellon)", author: "Jeremy Avigad et al.", type: "course", level: "beginner", url: "https://leanprover.github.io/logic_and_proof/", desc: "Interactive textbook combining logic fundamentals with the Lean theorem prover." },
          { title: "Teach Yourself Logic — Study Guide", author: "Peter Smith", type: "notes", level: "beginner", url: "https://www.logicmatters.net/tyl/", desc: "Comprehensive reading guide for self-study in mathematical logic, regularly updated with book recommendations." }
        ]
      },
      {
        title: "Encyclopedias & References",
        items: [
          { title: "Stanford Encyclopedia of Philosophy — Logic", author: "SEP Editorial Board", type: "notes", level: "intermediate", url: "https://plato.stanford.edu/entries/logic-classical/", desc: "Authoritative survey article on classical logic with extensive bibliography." },
          { title: "Open Logic Project", author: "Open Logic Project contributors", type: "notes", level: "intermediate", url: "https://openlogicproject.org/", desc: "Open-source, modular textbook on mathematical logic. Covers syntax, semantics, proofs, computability." },
          { title: "forall x: An Introduction to Formal Logic", author: "P.D. Magnus", type: "book", level: "beginner", url: "https://forallx.openlogicproject.org/", desc: "Free, open-source introductory logic textbook covering TFL and FOL with natural deduction." }
        ]
      }
    ]
  },

  /* -------- 1  Propositional Logic -------- */
  {
    id: "propositional",
    icon: "\u2283",
    label: "Propositional",
    intro: `
<p><strong>Propositional logic</strong> (zeroth-order logic) deals with propositions connected by logical connectives: AND (\u2227), OR (\u2228), NOT (\u00AC), IMPLIES (\u2283), IFF (\u2261). It is the simplest formal system and the entry point for all that follows.</p>

<h3>Key Concepts</h3>
<ul>
  <li><strong>Truth tables</strong> — mechanical method for evaluating any formula</li>
  <li><strong>Normal forms</strong> — CNF (conjunctive) and DNF (disjunctive) canonical representations</li>
  <li><strong>Satisfiability (SAT)</strong> — the foundational NP-complete decision problem</li>
  <li><strong>Resolution</strong> — the refutation-complete inference rule underpinning SAT solvers</li>
  <li><strong>Natural deduction &amp; sequent calculus</strong> — proof systems for propositional reasoning</li>
</ul>
    `,
    subsections: [
      {
        title: "Textbooks & Monographs",
        items: [
          { title: "A Mathematical Introduction to Logic (Ch. 1)", author: "Herbert B. Enderton", type: "book", level: "beginner", url: "https://www.amazon.com/Mathematical-Introduction-Logic-Herbert-Enderton/dp/0122384520", desc: "Chapter 1 provides a rigorous treatment of sentential logic: syntax, semantics, compactness, and completeness." },
          { title: "Logic in Computer Science (Ch. 1–2)", author: "Michael Huth & Mark Ryan", type: "book", level: "beginner", url: "https://www.amazon.com/Logic-Computer-Science-Modelling-Reasoning/dp/052154310X", desc: "Propositional logic with natural deduction, semantic tableaux, and SAT-solving applications." },
          { title: "Handbook of Satisfiability", author: "Armin Biere et al. (eds.)", type: "book", level: "advanced", url: "https://www.amazon.com/Handbook-Satisfiability-Artificial-Intelligence-Applications/dp/1643681605", desc: "Definitive reference on SAT: DPLL, CDCL, preprocessing, applications in verification and AI." },
          { title: "Decision Procedures: An Algorithmic Point of View", author: "Daniel Kroening & Ofer Strichman", type: "book", level: "intermediate", url: "https://www.amazon.com/Decision-Procedures-Algorithmic-Theoretical-Computer/dp/3662504960", desc: "Covers SAT solvers, BDDs, and decision procedures for propositional and first-order theories." }
        ]
      },
      {
        title: "Courses & Online Resources",
        items: [
          { title: "Coursera — Introduction to Logic", author: "Stanford University", type: "course", level: "beginner", url: "https://www.coursera.org/learn/logic-introduction", desc: "Full course on propositional and relational logic with interactive exercises. Based on Stanford CS 157." },
          { title: "Brilliant — Logic Course", author: "Brilliant.org", type: "course", level: "beginner", url: "https://brilliant.org/courses/logic/", desc: "Interactive puzzles and lessons on propositional logic, truth tables, and logical equivalences." },
          { title: "SEP — Propositional Logic", author: "Stanford Encyclopedia of Philosophy", type: "notes", level: "intermediate", url: "https://plato.stanford.edu/entries/logic-propositional/", desc: "Thorough encyclopedia article on the syntax, semantics, and proof theory of propositional calculus." },
          { title: "Logic Matters — Propositional Logic Guide", author: "Peter Smith", type: "notes", level: "beginner", url: "https://www.logicmatters.net/tyl/booknotes/prop/", desc: "Curated reading list for propositional logic self-study with annotations on difficulty and coverage." }
        ]
      },
      {
        title: "Tools & Implementations",
        items: [
          { title: "MiniSat", author: "Niklas E\u00E9n & Niklas S\u00F6rensson", type: "code", level: "intermediate", url: "http://minisat.se/", desc: "Minimalistic, high-performance SAT solver. Great for learning CDCL internals." },
          { title: "Truth Table Generator", author: "Stanford", type: "code", level: "beginner", url: "https://web.stanford.edu/class/cs103/tools/truth-table-tool/", desc: "Online tool for generating truth tables from propositional formulas. Useful for quick verification." },
          { title: "SAT Competition Benchmarks", author: "SAT Competition organizers", type: "data", level: "advanced", url: "https://satcompetition.github.io/", desc: "Annual competition benchmarks for SAT solvers. Excellent source of test instances." }
        ]
      }
    ]
  },

  /* -------- 2  Predicate Logic / FOL -------- */
  {
    id: "predicate",
    icon: "\u2200",
    label: "Predicate Logic",
    intro: `
<p><strong>Predicate logic</strong> (first-order logic, FOL) extends propositional logic with quantifiers (\u2200, \u2203), variables, predicates, and functions. It is the language of mathematics and the core representation language for Charlotte's reasoning engine.</p>

<h3>Key Concepts</h3>
<ul>
  <li><strong>Quantifiers</strong> — universal (\u2200) and existential (\u2203) quantification over domains</li>
  <li><strong>Structures &amp; interpretations</strong> — how formulas get meaning in a domain</li>
  <li><strong>Soundness &amp; completeness</strong> — G\u00F6del's completeness theorem for FOL</li>
  <li><strong>Compactness</strong> — a set of sentences has a model iff every finite subset does</li>
  <li><strong>Undecidability</strong> — Church-Turing: validity in FOL is undecidable</li>
</ul>
    `,
    subsections: [
      {
        title: "Core Textbooks",
        items: [
          { title: "A Mathematical Introduction to Logic (Ch. 2)", author: "Herbert B. Enderton", type: "book", level: "intermediate", url: "https://www.amazon.com/Mathematical-Introduction-Logic-Herbert-Enderton/dp/0122384520", desc: "Chapter 2: first-order logic syntax, semantics, deductive calculus, completeness theorem, compactness." },
          { title: "Introduction to Mathematical Logic (Ch. 2–3)", author: "Elliott Mendelson", type: "book", level: "intermediate", url: "https://www.amazon.com/Introduction-Mathematical-Logic-Elliott-Mendelson/dp/1482237725", desc: "First-order predicate calculus, formal theories, Godel's completeness and incompleteness theorems." },
          { title: "A Concise Introduction to Mathematical Logic", author: "Wolfgang Rautenberg", type: "book", level: "intermediate", url: "https://www.amazon.com/Concise-Introduction-Mathematical-Logic-Universitext/dp/1441912207", desc: "Compact yet thorough: propositional logic, FOL, completeness, incompleteness, and model theory basics." },
          { title: "First-Order Logic and Automated Theorem Proving", author: "Melvin Fitting", type: "book", level: "intermediate", url: "https://www.amazon.com/First-Order-Logic-Automated-Theorem-Proving/dp/1461275156", desc: "Bridges mathematical logic and CS: tableaux, resolution, Herbrand's theorem, unification." }
        ]
      },
      {
        title: "Courses & Encyclopedia Entries",
        items: [
          { title: "SEP — Classical Logic", author: "Stanford Encyclopedia of Philosophy", type: "notes", level: "intermediate", url: "https://plato.stanford.edu/entries/logic-classical/", desc: "Comprehensive article covering syntax, semantics, and metatheory of classical first-order logic." },
          { title: "SEP — First-Order Model Theory", author: "Wilfrid Hodges", type: "notes", level: "advanced", url: "https://plato.stanford.edu/entries/modeltheory-fo/", desc: "Survey of first-order model theory: definability, quantifier elimination, categoricity." },
          { title: "UCLA Math 220A–C — Mathematical Logic", author: "UCLA Mathematics", type: "course", level: "advanced", url: "https://www.math.ucla.edu/~ynm/lectures.htm", desc: "Graduate sequence in mathematical logic covering model theory, set theory, and recursion theory." },
          { title: "Marker — Lecture Notes on Model Theory", author: "David Marker", type: "notes", level: "advanced", url: "https://homepages.math.uic.edu/~marker/math511/", desc: "Lecture notes from UIC graduate model theory course. Accessible companion to Marker's textbook." }
        ]
      },
      {
        title: "Interactive & Computational",
        items: [
          { title: "Logic & Proofs (CMU OLI)", author: "Carnegie Mellon", type: "course", level: "beginner", url: "https://oli.cmu.edu/courses/logic-proofs/", desc: "Interactive online course on propositional and predicate logic with automated proof checking." },
          { title: "The Incredible Proof Machine", author: "Joachim Breitner", type: "code", level: "beginner", url: "https://incredible.pm/", desc: "Visual, interactive proof system for propositional and predicate logic. Drag-and-drop natural deduction." },
          { title: "Carnap.io — Logic Framework", author: "Graham Leach-Krouse et al.", type: "code", level: "intermediate", url: "https://carnap.io/", desc: "Open-source Haskell framework for teaching and studying formal logic, with interactive proof exercises." }
        ]
      }
    ]
  },

  /* -------- 3  Model Theory -------- */
  {
    id: "model",
    icon: "\u22A8",
    label: "Model Theory",
    intro: `
<p><strong>Model theory</strong> studies the relationship between formal languages (syntax) and their interpretations (semantics). It asks: which structures satisfy which sentences? This is the mathematical core behind Charlotte's semantic reasoning.</p>

<h3>Key Concepts</h3>
<ul>
  <li><strong>Structures &amp; signatures</strong> — domains, relations, functions, constants</li>
  <li><strong>Elementary equivalence &amp; substructures</strong> — when two structures agree on all first-order sentences</li>
  <li><strong>Ultraproducts</strong> — \u0141o\u015B's theorem and constructing new models from families of models</li>
  <li><strong>Types &amp; saturation</strong> — complete types, omitting types theorem, saturated models</li>
  <li><strong>Stability theory</strong> — Shelah's classification program, stable and simple theories</li>
</ul>
    `,
    subsections: [
      {
        title: "Core Texts",
        items: [
          { title: "Model Theory: An Introduction", author: "David Marker", type: "book", level: "intermediate", url: "https://www.amazon.com/Model-Theory-Introduction-Graduate-Mathematics/dp/0387987606", desc: "The modern standard: structures, theories, types, prime and saturated models, strongly minimal sets." },
          { title: "Model Theory", author: "C.C. Chang & H.J. Keisler", type: "book", level: "advanced", url: "https://www.amazon.com/Model-Theory-Studies-Foundations-Mathematics/dp/0486488217", desc: "The classic reference. Ultraproducts, saturated models, preservation theorems, two-cardinal theorems." },
          { title: "A Shorter Model Theory", author: "Wilfrid Hodges", type: "book", level: "intermediate", url: "https://www.amazon.com/Shorter-Model-Theory-Wilfrid-Hodges/dp/0521587131", desc: "Concise introduction covering the essentials: compactness, Lowenheim-Skolem, quantifier elimination, types." },
          { title: "Model Theory and the Philosophy of Mathematical Practice", author: "John Baldwin", type: "book", level: "advanced", url: "https://www.amazon.com/Model-Theory-Philosophy-Mathematical-Practice/dp/1107189217", desc: "Connects model-theoretic methods to broader mathematical and philosophical themes." }
        ]
      },
      {
        title: "Lecture Notes & Surveys",
        items: [
          { title: "Pillay — Geometric Stability Theory", author: "Anand Pillay", type: "book", level: "advanced", url: "https://www.amazon.com/Geometric-Stability-Theory-Oxford-Monographs/dp/0198534574", desc: "Advanced monograph on stable groups, orthogonality, regular types. For specialists." },
          { title: "SEP — Model Theory", author: "Wilfrid Hodges", type: "notes", level: "intermediate", url: "https://plato.stanford.edu/entries/model-theory/", desc: "Accessible philosophical overview of model theory, its methods, and its applications." },
          { title: "Tent & Ziegler — A Course in Model Theory", author: "Katrin Tent & Martin Ziegler", type: "book", level: "intermediate", url: "https://www.amazon.com/Course-Model-Theory-Lecture-Notes/dp/0521763246", desc: "Modern graduate text with applications to algebra. Covers quantifier elimination, types, stability." },
          { title: "Poizat — A Course in Model Theory", author: "Bruno Poizat (trans. Moses Klein)", type: "book", level: "advanced", url: "https://www.amazon.com/Course-Model-Theory-Introduction-Contemporary/dp/0387986553", desc: "French tradition in model theory: back-and-forth, ultraproducts, Morley's theorem, Shelah's classification." }
        ]
      },
      {
        title: "Computational Connections",
        items: [
          { title: "Finite Model Theory", author: "Heinz-Dieter Ebbinghaus & J\u00F6rg Flum", type: "book", level: "advanced", url: "https://www.amazon.com/Finite-Model-Theory-Springer-Monographs/dp/3540287876", desc: "Model theory over finite structures: Ehrenfeucht-Fraisse games, 0-1 laws, descriptive complexity." },
          { title: "Elements of Finite Model Theory", author: "Leonid Libkin", type: "book", level: "advanced", url: "https://www.amazon.com/Elements-Finite-Model-Theory-Computing/dp/3540212027", desc: "Connects logic to database theory and computational complexity. Pebble games, locality, fixed-point logics." }
        ]
      }
    ]
  },

  /* -------- 4  Lambda Calculus -------- */
  {
    id: "lambda",
    icon: "\u03BB",
    label: "Lambda Calculus",
    intro: `
<p>The <strong>lambda calculus</strong>, invented by Alonzo Church in the 1930s, is the theoretical foundation of functional programming and type theory. It provides the bridge between logic and computation central to Charlotte's Lisp backend.</p>

<h3>Key Concepts</h3>
<ul>
  <li><strong>Untyped lambda calculus</strong> — variables, abstraction (\u03BBx.M), application (M N), beta-reduction</li>
  <li><strong>Church encodings</strong> — representing data (booleans, numerals, pairs) as pure functions</li>
  <li><strong>Simply typed lambda calculus</strong> — types prevent non-termination, correspond to intuitionistic logic</li>
  <li><strong>System F (polymorphic)</strong> — universal quantification over types, parametric polymorphism</li>
  <li><strong>Curry-Howard correspondence</strong> — proofs are programs, propositions are types</li>
</ul>
    `,
    subsections: [
      {
        title: "Foundational References",
        items: [
          { title: "The Lambda Calculus: Its Syntax and Semantics", author: "Henk Barendregt", type: "book", level: "advanced", url: "https://www.amazon.com/Lambda-Calculus-Semantics-Studies-Foundations/dp/0444875085", desc: "The definitive monograph on untyped lambda calculus: Church-Rosser, Bohm trees, models, lambda definability." },
          { title: "Lambda Calculi with Types", author: "Henk Barendregt", type: "notes", level: "advanced", url: "https://doi.org/10.1016/S0049-237X(08)71776-5", desc: "Barendregt's lambda cube: systematizes typed lambda calculi from simple types through System F to the Calculus of Constructions." },
          { title: "Lectures on the Curry-Howard Isomorphism", author: "Morten Heine S\u00F8rensen & Pawel Urzyczyn", type: "book", level: "intermediate", url: "https://www.amazon.com/Lectures-Curry-Howard-Isomorphism-Foundations-Mathematics/dp/0444520775", desc: "Systematic treatment: untyped and typed lambda calculus, intuitionistic logic, second-order logic, System F." },
          { title: "An Introduction to Lambda Calculi for Computer Scientists", author: "Chris Hankin", type: "book", level: "beginner", url: "https://www.amazon.com/Introduction-Lambda-Calculi-Computer-Scientists/dp/0954300653", desc: "Accessible introduction aimed at CS students: reduction strategies, type systems, denotational semantics." }
        ]
      },
      {
        title: "Types & Programming Languages",
        items: [
          { title: "Types and Programming Languages (TAPL)", author: "Benjamin C. Pierce", type: "book", level: "intermediate", url: "https://www.cis.upenn.edu/~bcpierce/tapl/", desc: "The standard reference on type systems: untyped lambda calculus, simple types, subtyping, recursive types, polymorphism, System F." },
          { title: "Advanced Topics in Types and Programming Languages (ATTAPL)", author: "Benjamin C. Pierce (ed.)", type: "book", level: "advanced", url: "https://www.cis.upenn.edu/~bcpierce/attapl/", desc: "Sequel to TAPL covering dependent types, effect systems, linear types, module systems, and more." },
          { title: "Practical Foundations for Programming Languages", author: "Robert Harper", type: "book", level: "advanced", url: "https://www.cs.cmu.edu/~rwh/pfpl/", desc: "CMU approach to PL theory: statics, dynamics, function types, polymorphism, inductive and coinductive types." },
          { title: "Lecture Notes on the Lambda Calculus", author: "Peter Selinger", type: "notes", level: "intermediate", url: "https://arxiv.org/abs/0804.3434", desc: "Clear, self-contained notes: untyped lambda calculus, Church-Rosser theorem, simply typed calculus, strong normalization." }
        ]
      },
      {
        title: "Video Lectures & Tutorials",
        items: [
          { title: "Oregon Programming Languages Summer School (OPLSS)", author: "Various lecturers", type: "video", level: "intermediate", url: "https://www.cs.uoregon.edu/research/summerschool/", desc: "Annual summer school with recorded lectures on type theory, lambda calculus, category theory, and PL foundations." },
          { title: "Philip Wadler — Propositions as Types", author: "Philip Wadler", type: "video", level: "intermediate", url: "https://www.youtube.com/watch?v=IOiZatlZtGU", desc: "Classic talk explaining the Curry-Howard correspondence between logic and programming." },
          { title: "Computerphile — Lambda Calculus", author: "Computerphile / Graham Hutton", type: "video", level: "beginner", url: "https://www.youtube.com/watch?v=eis11j_iGMs", desc: "Accessible video introduction to lambda calculus, beta-reduction, and Church numerals." }
        ]
      }
    ]
  },

  /* -------- 5  Lisp & Scheme -------- */
  {
    id: "lisp",
    icon: "()",
    label: "Lisp & Scheme",
    intro: `
<p><strong>Lisp</strong> (LISt Processing) is the oldest functional programming family still in active use. Its homoiconic syntax — code as data, data as code — makes it the natural executable form of logical expressions. Charlotte's Lisp layer inherits this tradition directly.</p>

<h3>Key Dialects</h3>
<ul>
  <li><strong>Scheme</strong> — minimalist, lexically scoped, tail-call optimized. Language of SICP.</li>
  <li><strong>Common Lisp</strong> — industrial-strength, multi-paradigm, CLOS object system</li>
  <li><strong>Racket</strong> — language-oriented programming, macros, contracts, IDE (DrRacket)</li>
  <li><strong>Clojure</strong> — modern Lisp on the JVM, persistent data structures, concurrency primitives</li>
  <li><strong>Emacs Lisp</strong> — scripting language of Emacs, dynamic scoping, practical text processing</li>
</ul>
    `,
    subsections: [
      {
        title: "Essential Books",
        items: [
          { title: "Structure and Interpretation of Computer Programs (SICP)", author: "Harold Abelson & Gerald Jay Sussman", type: "book", level: "beginner", url: "https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/index.html", desc: "The legendary MIT textbook. Teaches computation through Scheme: abstraction, higher-order procedures, metalinguistic abstraction, interpreters." },
          { title: "The Little Schemer (4th ed.)", author: "Daniel P. Friedman & Matthias Felleisen", type: "book", level: "beginner", url: "https://www.amazon.com/Little-Schemer-Daniel-P-Friedman/dp/0262560992", desc: "Socratic dialogue teaching recursion, lambda, and computation through Scheme. The classic introduction." },
          { title: "The Seasoned Schemer", author: "Daniel P. Friedman & Matthias Felleisen", type: "book", level: "intermediate", url: "https://www.amazon.com/Seasoned-Schemer-Daniel-P-Friedman/dp/026256100X", desc: "Sequel to The Little Schemer: continuations, set!, letrec, and higher-order thinking." },
          { title: "The Reasoned Schemer (2nd ed.)", author: "Daniel P. Friedman, William E. Byrd & Oleg Kiselyov", type: "book", level: "intermediate", url: "https://www.amazon.com/Reasoned-Schemer-MIT-Press/dp/0262535513", desc: "Logic programming in Scheme via miniKanren. Bridges Lisp and formal logic — directly relevant to Charlotte." },
          { title: "Practical Common Lisp", author: "Peter Seibel", type: "book", level: "intermediate", url: "https://gigamonkeys.com/book/", desc: "Modern Common Lisp tutorial. Practical projects: unit testing, binary parsing, spam filter, MP3 database, web server." }
        ]
      },
      {
        title: "Advanced & Specialized",
        items: [
          { title: "On Lisp: Advanced Techniques for Common Lisp", author: "Paul Graham", type: "book", level: "advanced", url: "https://www.paulgraham.com/onlisp.html", desc: "Master class in macros, closures, continuations, and embedded languages. Free PDF available." },
          { title: "Let Over Lambda", author: "Doug Hoyte", type: "book", level: "advanced", url: "https://letoverlambda.com/", desc: "Deep dive into Common Lisp macros: closures over macros, reader macros, and anaphoric macros." },
          { title: "Paradigms of AI Programming (PAIP)", author: "Peter Norvig", type: "book", level: "advanced", url: "https://github.com/norvig/paip-lisp", desc: "AI programming in Common Lisp: search, logic programming, natural language, expert systems. GitHub repo with full code." },
          { title: "The Art of the Metaobject Protocol (AMOP)", author: "Gregor Kiczales, Jim des Rivi\u00E8res & Daniel G. Bobrow", type: "book", level: "advanced", url: "https://www.amazon.com/Art-Metaobject-Protocol-Gregor-Kiczales/dp/0262610744", desc: "CLOS metaobject protocol: introspection, intercessory techniques, reflective OOP in Common Lisp." }
        ]
      },
      {
        title: "Modern Dialects & Tutorials",
        items: [
          { title: "Clojure for the Brave and True", author: "Daniel Higginbotham", type: "book", level: "beginner", url: "https://www.braveclojure.com/", desc: "Fun, accessible introduction to Clojure: functional programming, concurrency, macros on the JVM." },
          { title: "How to Design Programs (HtDP)", author: "Matthias Felleisen et al.", type: "book", level: "beginner", url: "https://htdp.org/", desc: "Systematic program design using Racket. Design recipes, data-driven programming, testing." },
          { title: "The Racket Guide", author: "Racket Documentation Team", type: "notes", level: "beginner", url: "https://docs.racket-lang.org/guide/", desc: "Official Racket tutorial: language-oriented programming, macros, contracts, modules." },
          { title: "Lisp in Small Pieces", author: "Christian Queinnec", type: "book", level: "advanced", url: "https://www.amazon.com/Lisp-Small-Pieces-Christian-Queinnec/dp/0521545668", desc: "Eleven interpreters and two compilers for Lisp/Scheme. Deep understanding of evaluation, compilation, reflection." }
        ]
      }
    ]
  },

  /* -------- 6  Automated Reasoning -------- */
  {
    id: "proof",
    icon: "\u22A2",
    label: "Proof Assistants",
    intro: `
<p><strong>Automated reasoning</strong> encompasses theorem provers, proof assistants, and SMT solvers — tools that mechanically verify or discover proofs. These tools embody the connection between logic and computation at the heart of Charlotte.</p>

<h3>Major Systems</h3>
<ul>
  <li><strong>Coq</strong> — dependent types, Calculus of Inductive Constructions, tactic-based proofs</li>
  <li><strong>Lean</strong> — modern dependent type theory, strong automation, mathlib library</li>
  <li><strong>Isabelle/HOL</strong> — higher-order logic, structured proofs (Isar), sledgehammer integration</li>
  <li><strong>Agda</strong> — dependently typed functional programming, intensional type theory</li>
  <li><strong>Z3</strong> — Microsoft's SMT solver: SAT + theories (arithmetic, arrays, bit-vectors)</li>
</ul>
    `,
    subsections: [
      {
        title: "Proof Assistants",
        items: [
          { title: "Software Foundations", author: "Benjamin C. Pierce et al.", type: "course", level: "intermediate", url: "https://softwarefoundations.cis.upenn.edu/", desc: "The gold standard for learning Coq: logic, functional programming, program verification, PLT. Free online." },
          { title: "Certified Programming with Dependent Types (CPDT)", author: "Adam Chlipala", type: "book", level: "advanced", url: "http://adam.chlipala.net/cpdt/", desc: "Advanced Coq techniques: proof automation, dependent types, certified compilers and interpreters." },
          { title: "Theorem Proving in Lean 4", author: "Jeremy Avigad et al.", type: "book", level: "intermediate", url: "https://leanprover.github.io/theorem_proving_in_lean4/", desc: "Official tutorial for Lean 4: dependent type theory, tactics, term-mode proofs, and metaprogramming." },
          { title: "Mathematics in Lean", author: "Jeremy Avigad & Patrick Massot", type: "course", level: "intermediate", url: "https://leanprover-community.github.io/mathematics_in_lean/", desc: "Learn to formalize mathematics in Lean 4 using mathlib. Sets, functions, topology, algebra." },
          { title: "Concrete Semantics (with Isabelle/HOL)", author: "Tobias Nipkow & Gerwin Klein", type: "book", level: "intermediate", url: "http://concrete-semantics.org/", desc: "Programming language semantics formalized in Isabelle/HOL. Free PDF, highly practical." }
        ]
      },
      {
        title: "SMT Solvers & Automated Provers",
        items: [
          { title: "Z3 — SMT Solver", author: "Microsoft Research", type: "code", level: "intermediate", url: "https://github.com/Z3Prover/z3", desc: "Industry-standard SMT solver. Python, C++, and .NET APIs. Used in program verification, symbolic execution, and testing." },
          { title: "Z3 Tutorial (Rise4Fun)", author: "Microsoft Research", type: "course", level: "intermediate", url: "https://microsoft.github.io/z3guide/", desc: "Interactive tutorial for Z3: propositional logic, arithmetic, bit-vectors, arrays, quantifiers." },
          { title: "Vampire — First-Order Theorem Prover", author: "Andrei Voronkov et al.", type: "code", level: "advanced", url: "https://vprover.github.io/", desc: "State-of-the-art superposition-based first-order theorem prover. Multiple CASC competition winner." },
          { title: "E Theorem Prover", author: "Stephan Schulz", type: "code", level: "advanced", url: "https://eprover.org/", desc: "High-performance equational theorem prover for full first-order logic with equality. Open source." }
        ]
      },
      {
        title: "Courses & Surveys",
        items: [
          { title: "Interactive Theorem Proving (ITP) Course", author: "Jasmin Blanchette (Vrije Universiteit Amsterdam)", type: "course", level: "intermediate", url: "https://www21.in.tum.de/teaching/itp/", desc: "Course materials on interactive theorem proving with Isabelle. Slides, exercises, and recordings." },
          { title: "The QED Manifesto Revisited", author: "Various authors", type: "notes", level: "intermediate", url: "https://www.cs.ru.nl/~freek/qed/qed2.pdf", desc: "Vision document for formalizing all of mathematics. Context for the proof assistant ecosystem." },
          { title: "Handbook of Automated Reasoning", author: "Alan Robinson & Andrei Voronkov (eds.)", type: "book", level: "advanced", url: "https://www.amazon.com/Handbook-Automated-Reasoning-Alan-Robinson/dp/0444508139", desc: "Comprehensive two-volume reference: resolution, rewriting, decision procedures, higher-order reasoning." }
        ]
      }
    ]
  },

  /* -------- 7  Datasets & Software -------- */
  {
    id: "datasets",
    icon: "\u262C",
    label: "Datasets & Tools",
    intro: `
<p>Hands-on tools, datasets, and software for experimenting with logic. Includes logic programming languages, SAT/SMT solvers, proof assistants, educational games, and benchmark suites.</p>

<h3>Categories</h3>
<ul>
  <li><strong>Logic programming</strong> — Prolog, miniKanren, Datalog</li>
  <li><strong>SAT/SMT solvers</strong> — MiniSat, CaDiCaL, Z3, CVC5</li>
  <li><strong>Proof assistants</strong> — Coq, Lean, Isabelle, Agda (interactive)</li>
  <li><strong>Benchmark suites</strong> — TPTP, SMT-LIB, SAT Competition</li>
  <li><strong>Educational</strong> — logic games, interactive provers, visualization tools</li>
</ul>
    `,
    subsections: [
      {
        title: "Logic Programming",
        items: [
          { title: "SWI-Prolog", author: "Jan Wielemaker et al.", type: "code", level: "beginner", url: "https://www.swi-prolog.org/", desc: "The most widely used open-source Prolog system. Comprehensive libraries, constraint solving, web frameworks." },
          { title: "miniKanren", author: "William E. Byrd et al.", type: "code", level: "intermediate", url: "http://minikanren.org/", desc: "Minimalist relational programming language embeddable in Scheme, Python, Clojure. Core of The Reasoned Schemer." },
          { title: "Learn Prolog Now!", author: "Patrick Blackburn, Johan Bos & Kristina Striegnitz", type: "course", level: "beginner", url: "http://www.learnprolognow.org/", desc: "Free online textbook: unification, proof search, lists, definite clause grammars, cuts." },
          { title: "The Art of Prolog", author: "Leon Sterling & Ehud Shapiro", type: "book", level: "intermediate", url: "https://www.amazon.com/Art-Prolog-Advanced-Programming-Techniques/dp/0262691639", desc: "Classic text on logic programming: database programming, meta-interpreters, search strategies, constraint logic." }
        ]
      },
      {
        title: "Benchmarks & Standards",
        items: [
          { title: "TPTP Problem Library", author: "Geoff Sutcliffe", type: "data", level: "intermediate", url: "https://www.tptp.org/", desc: "Thousands of first-order and higher-order logic problems. Standard benchmark for automated theorem provers." },
          { title: "SMT-LIB — Standard for SMT Solvers", author: "Clark Barrett et al.", type: "data", level: "intermediate", url: "https://smtlib.cs.uiowa.edu/", desc: "Standard language and benchmark library for SMT solvers. Logics, benchmarks, and solver interface specification." },
          { title: "CASC — CADE ATP System Competition", author: "Geoff Sutcliffe", type: "data", level: "advanced", url: "https://www.tptp.org/CASC/", desc: "Annual competition for automated theorem provers. Results, problem sets, system descriptions." },
          { title: "Metamath", author: "Norman Megill", type: "code", level: "intermediate", url: "https://us.metamath.org/", desc: "Formal proof database with over 40,000 verified proofs. Minimal logical foundation, community-maintained." }
        ]
      },
      {
        title: "Solvers & Implementations",
        items: [
          { title: "CaDiCaL SAT Solver", author: "Armin Biere", type: "code", level: "advanced", url: "https://github.com/arminbiere/cadical", desc: "Award-winning CDCL SAT solver by a leading SAT researcher. Clean C++ codebase, excellent for learning modern SAT." },
          { title: "CVC5 SMT Solver", author: "Stanford / Iowa / NYU", type: "code", level: "advanced", url: "https://cvc5.github.io/", desc: "Open-source SMT solver supporting many theories: arithmetic, strings, datatypes, sets, sequences." },
          { title: "Alloy Analyzer", author: "Daniel Jackson (MIT)", type: "code", level: "intermediate", url: "https://alloytools.org/", desc: "Lightweight formal modeling tool using relational logic. Automatic analysis of structural models via SAT." },
          { title: "Logisim Evolution", author: "logisim-evolution contributors", type: "code", level: "beginner", url: "https://github.com/logisim-evolution/logisim-evolution", desc: "Digital logic circuit simulator. Great for visualizing Boolean logic, gates, and truth tables." }
        ]
      }
    ]
  }
];

/* ===== Rendering Engine ===== */

const tabBar     = document.getElementById("tab-bar");
const mainEl     = document.getElementById("main-content");
const searchIn   = document.getElementById("search-input");
const searchClr  = document.getElementById("search-clear");
const statCount  = document.getElementById("stat-count");

let activeTab    = SECTIONS[0].id;
let activeFilter = "all";
let searchTerm   = "";

/* --- Count total resources --- */
const totalResources = SECTIONS.reduce((sum, sec) =>
  sum + sec.subsections.reduce((s2, sub) => s2 + sub.items.length, 0), 0);
statCount.textContent = totalResources;

/* --- Build tabs --- */
SECTIONS.forEach(sec => {
  const btn = document.createElement("button");
  btn.className = "tab-btn" + (sec.id === activeTab ? " active" : "");
  btn.dataset.id = sec.id;
  btn.innerHTML = `<span class="tab-icon">${sec.icon}</span><span class="tab-label">${sec.label}</span>`;
  btn.addEventListener("click", () => switchTab(sec.id));
  tabBar.appendChild(btn);
});

function switchTab(id) {
  activeTab = id;
  activeFilter = "all";
  searchTerm = "";
  searchIn.value = "";
  tabBar.querySelectorAll(".tab-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.id === id));
  render();
}

/* --- Collect filter types for a section --- */
function getTypes(sec) {
  const s = new Set();
  sec.subsections.forEach(sub => sub.items.forEach(it => s.add(it.type)));
  return Array.from(s);
}

/* --- Render --- */
function render() {
  const sec = SECTIONS.find(s => s.id === activeTab);
  if (!sec) return;

  const types = getTypes(sec);
  const q = searchTerm.trim().toLowerCase();

  let html = `<div class="section-header"><h2><span class="section-icon">${sec.icon}</span>${sec.label}</h2></div>`;
  html += `<div class="section-intro">${sec.intro}</div>`;

  /* filter bar */
  html += `<div class="filter-bar">`;
  html += `<button class="filter-btn ${activeFilter === "all" ? "active" : ""}" data-f="all">All</button>`;
  types.forEach(t => {
    html += `<button class="filter-btn ${activeFilter === t ? "active" : ""}" data-f="${t}">${t.charAt(0).toUpperCase() + t.slice(1)}s</button>`;
  });
  html += `</div>`;

  /* subsections */
  sec.subsections.forEach(sub => {
    let items = sub.items;
    if (activeFilter !== "all") items = items.filter(i => i.type === activeFilter);
    if (q) items = items.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.author.toLowerCase().includes(q) ||
      i.desc.toLowerCase().includes(q)
    );
    if (items.length === 0) return;

    html += `<div class="subsection"><h3>${sub.title}</h3><div class="card-grid">`;
    items.forEach(it => {
      const titleHtml = q ? highlight(it.title, q) : it.title;
      const descHtml  = q ? highlight(it.desc, q)  : it.desc;
      html += `
        <a class="card" href="${it.url}" target="_blank" rel="noopener">
          <div class="card-top">
            <span class="type-badge badge-${it.type}">${it.type}</span>
            <span class="level-badge level-${it.level}">${it.level}</span>
          </div>
          <div class="card-title">${titleHtml}</div>
          <div class="card-author">${it.author}</div>
          <div class="card-desc">${descHtml}</div>
        </a>`;
    });
    html += `</div></div>`;
  });

  mainEl.innerHTML = html;

  /* attach filter handlers */
  mainEl.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.f;
      render();
    });
  });
}

/* --- Highlight search matches --- */
function highlight(text, q) {
  if (!q) return text;
  const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${esc})`, "gi"), "<mark>$1</mark>");
}

/* --- Search --- */
searchIn.addEventListener("input", () => {
  searchTerm = searchIn.value;
  render();
});
searchClr.addEventListener("click", () => {
  searchIn.value = "";
  searchTerm = "";
  render();
});

/* --- Initial render --- */
render();
