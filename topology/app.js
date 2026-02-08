const SECTIONS = [
  {
    id: "overview",
    label: "Overview",
    icon: "\u25C7",
    intro: `
<p><strong>Topology</strong> is the branch of mathematics concerned with properties of spaces that are preserved under continuous deformations&mdash;stretching, bending, twisting&mdash;but not tearing or gluing. It provides the foundational language for understanding shape, connectivity, and dimension in the most general sense.</p>

<h3>Why Topology Matters for Charlotte Paper 9: Tesseract Topology</h3>
<p>Charlotte's Paper 9 explores <strong>4-dimensional tesseract navigation</strong>, where an agent must reason about spatial structure beyond our familiar three dimensions. Topology supplies the exact mathematical machinery needed:</p>
<ul>
  <li><strong>Point-set topology</strong> defines the notion of "nearness" and continuity that governs movement through higher-dimensional cells.</li>
  <li><strong>Algebraic topology</strong> classifies the loops, cavities, and voids of a tesseract&mdash;its fundamental group is trivial, but its cell structure is rich.</li>
  <li><strong>Persistent homology</strong> tracks how topological features appear and disappear as one "zooms out" on a 4D structure.</li>
  <li><strong>Higher-dimensional geometry</strong> directly characterizes polytopes like the tesseract (8 cubes, 24 faces, 32 edges, 16 vertices).</li>
  <li><strong>Fiber bundles</strong> model how local 3D slices of a 4D object stitch together into a global whole.</li>
</ul>

<h3>The Tesseract as a Topological Object</h3>
<p>The tesseract (or 4-cube, or hypercube) is the 4-dimensional analog of the cube. Topologically it is homeomorphic to the closed 4-ball, but its <em>combinatorial</em> cell structure&mdash;16 vertices, 32 edges, 24 square faces, 8 cubic cells&mdash;is what makes navigation nontrivial. Understanding its CW-complex decomposition, its face lattice, and its symmetry group (the hyperoctahedral group of order 384) are all topological questions.</p>

<p>This hub collects the best textbooks, lecture notes, video courses, software tools, and datasets for building a deep understanding of topology from foundations through the cutting-edge tools of TDA and higher-dimensional geometry.</p>
    `,
    subsections: [
      {
        title: "Foundational Textbooks",
        items: [
          { title: "Topology (2nd Edition)", author: "James R. Munkres", type: "book", level: "beginner", url: "https://www.pearson.com/en-us/subject-catalog/p/topology/P200000003526", desc: "The gold-standard undergraduate/graduate text. Part I covers point-set topology; Part II covers algebraic topology. Clear exposition, excellent exercises." },
          { title: "Algebraic Topology", author: "Allen Hatcher", type: "book", level: "intermediate", url: "https://pi.math.cornell.edu/~hatcher/AT/ATpage.html", desc: "Freely available online. Covers fundamental group, homology, cohomology with geometric intuition. The most-used graduate algebraic topology text worldwide." },
          { title: "Regular Polytopes", author: "H.S.M. Coxeter", type: "book", level: "intermediate", url: "https://store.doverpublications.com/0486614808.html", desc: "The classic reference on polytopes in all dimensions. Essential for understanding the tesseract and its symmetries within the broader theory of regular figures." },
          { title: "Computational Topology: An Introduction", author: "Herbert Edelsbrunner & John L. Harer", type: "book", level: "intermediate", url: "https://bookstore.ams.org/mbk-69", desc: "Bridges pure topology and computation. Covers simplicial complexes, homology algorithms, persistent homology, and Morse theory for data analysis." }
        ]
      },
      {
        title: "Video Introductions",
        items: [
          { title: "Topology & Geometry by Dr. Tadashi Tokieda", author: "African Institute for Mathematical Sciences", type: "video", level: "beginner", url: "https://www.youtube.com/playlist?list=PLTBqohhFNBE_09L0i-lf3fYXF5woAbrzJ", desc: "Charismatic, intuition-driven lectures covering surfaces, Euler characteristic, knots, and topological invariants. Ideal starting point." },
          { title: "Understanding 4D: The Tesseract", author: "3Blue1Brown / Grant Sanderson", type: "video", level: "beginner", url: "https://www.youtube.com/watch?v=XGsS9OKCd5k", desc: "Visual explanation of higher-dimensional cubes, projections from 4D to 3D, and how to build geometric intuition for the tesseract." },
          { title: "Topology for Beginners", author: "Michael Penn (YouTube)", type: "video", level: "beginner", url: "https://www.youtube.com/playlist?list=PL22w63XsKjqJmyKJlMQ1LGGEE_zeaOFCM", desc: "Step-by-step lecture series walking through open sets, continuity, compactness, and connectedness with proofs and examples." }
        ]
      },
      {
        title: "Quick References & Overviews",
        items: [
          { title: "Topology Without Tears", author: "Sidney A. Morris", type: "notes", level: "beginner", url: "https://www.topologywithouttears.net/", desc: "Free online textbook designed for self-study. Covers topological spaces, subspaces, products, quotients, and compactness with a gentle learning curve." },
          { title: "nLab: Topology", author: "nLab Community", type: "notes", level: "advanced", url: "https://ncatlab.org/nlab/show/topology", desc: "Comprehensive wiki-style reference with a category-theoretic perspective. Deep coverage of point-set, algebraic, and differential topology." }
        ]
      }
    ]
  },
  {
    id: "pointset",
    label: "Point-Set",
    icon: "\u25CB",
    intro: `
<p><strong>Point-set topology</strong> (also called general topology) studies the most fundamental notions of "space": open and closed sets, continuity, convergence, compactness, and connectedness. It provides the axiomatic foundations upon which all other branches of topology rest.</p>

<h3>Core Concepts</h3>
<ul>
  <li><strong>Topological spaces &amp; open sets</strong> &mdash; the axioms that generalize metric spaces.</li>
  <li><strong>Continuity &amp; homeomorphisms</strong> &mdash; structure-preserving maps between spaces.</li>
  <li><strong>Compactness</strong> &mdash; the generalization of "closed and bounded" (Heine-Borel). Crucial for guaranteeing convergence.</li>
  <li><strong>Connectedness &amp; path-connectedness</strong> &mdash; when a space cannot be split into disjoint open pieces.</li>
  <li><strong>Metric spaces</strong> &mdash; the concrete setting where distance gives rise to topology.</li>
  <li><strong>Product &amp; quotient topologies</strong> &mdash; building new spaces from old ones. The tesseract is a product I<sup>4</sup> = I &times; I &times; I &times; I.</li>
  <li><strong>Separation axioms</strong> &mdash; T0 through T4 (Hausdorff, regular, normal) distinguish how well points can be separated.</li>
</ul>

<h3>Relevance to the Tesseract</h3>
<p>The tesseract, as the unit hypercube [0,1]<sup>4</sup>, is a compact, path-connected, metrizable space. Its topological properties&mdash;like being simply connected and locally contractible&mdash;all follow from point-set foundations. Understanding product topologies is essential since the tesseract is literally the 4-fold product of intervals.</p>
    `,
    subsections: [
      {
        title: "Textbooks",
        items: [
          { title: "Topology (2nd Edition)", author: "James R. Munkres", type: "book", level: "beginner", url: "https://www.pearson.com/en-us/subject-catalog/p/topology/P200000003526", desc: "Part I (Chapters 1-8) is the definitive treatment of point-set topology. Covers all separation axioms, metrization theorems, Tychonoff's theorem." },
          { title: "General Topology", author: "Stephen Willard", type: "book", level: "intermediate", url: "https://store.doverpublications.com/0486434796.html", desc: "More comprehensive than Munkres on general topology. Covers nets, filters, uniform spaces, and function spaces. Dover reprint makes it affordable." },
          { title: "General Topology", author: "John L. Kelley", type: "book", level: "advanced", url: "https://link.springer.com/book/10.1007/978-1-4612-5361-9", desc: "A classic graduate text with a more abstract approach. Known for rigorous treatment of nets, filters, and the axiom of choice in topology." },
          { title: "Topology Without Tears", author: "Sidney A. Morris", type: "notes", level: "beginner", url: "https://www.topologywithouttears.net/", desc: "Freely available self-study text. Builds from set theory through topological spaces, continuity, compactness, and connectedness with exercises." },
          { title: "Counterexamples in Topology", author: "Lynn Arthur Steen & J. Arthur Seebach Jr.", type: "book", level: "intermediate", url: "https://store.doverpublications.com/0486687353.html", desc: "Catalog of 143 topological spaces illustrating how properties (compact, Hausdorff, connected, etc.) interact. Essential reference for building counterexamples." }
        ]
      },
      {
        title: "Lecture Notes & Courses",
        items: [
          { title: "MIT 18.901: Introduction to Topology", author: "MIT OpenCourseWare", type: "course", level: "beginner", url: "https://ocw.mit.edu/courses/18-901-introduction-to-topology-fall-2004/", desc: "Full MIT course with lecture notes, problem sets, and exams. Based on Munkres. Covers topological spaces through Urysohn metrization." },
          { title: "Point-Set Topology Lecture Notes", author: "Ren\u00e9 L. Schilling (TU Dresden)", type: "notes", level: "beginner", url: "https://math.mit.edu/~jhirsh/topology.pdf", desc: "Concise lecture notes covering the essentials: topological spaces, bases, continuity, compactness, connectedness, and product spaces." },
          { title: "Topology Video Lectures", author: "Bruno Zimmermann (ICTP)", type: "video", level: "beginner", url: "https://www.youtube.com/playlist?list=PLLq_gUfXAnkl8bjQh-hGQ9u24xZP9x0dx", desc: "Complete video lecture course from the International Centre for Theoretical Physics. Covers point-set topology with algebraic topology motivation." }
        ]
      },
      {
        title: "Advanced & Specialized",
        items: [
          { title: "Topology and Groupoids", author: "Ronald Brown", type: "book", level: "advanced", url: "https://groupoids.org.uk/topgpds.html", desc: "Unique approach combining point-set and algebraic topology using groupoids. Free online. Emphasizes the fundamental groupoid over the fundamental group." },
          { title: "Engelking: General Topology (Revised Edition)", author: "Ryszard Engelking", type: "book", level: "advanced", url: "https://www.heldermann.de/SSPM/SSPM06/sspm06.htm", desc: "Encyclopedic reference for general topology. Covers dimension theory, paracompactness, and the most general versions of key theorems." }
        ]
      }
    ]
  },
  {
    id: "algebraic",
    label: "Algebraic",
    icon: "\u2295",
    intro: `
<p><strong>Algebraic topology</strong> uses algebraic structures&mdash;groups, rings, modules&mdash;to classify topological spaces up to continuous deformation. By assigning algebraic invariants to spaces, we can prove that two spaces are <em>not</em> homeomorphic without needing to check all possible maps.</p>

<h3>Core Concepts</h3>
<ul>
  <li><strong>Fundamental group \u03C0<sub>1</sub></strong> &mdash; captures the loops in a space up to homotopy. The tesseract is simply connected (\u03C0<sub>1</sub> = 0).</li>
  <li><strong>Higher homotopy groups \u03C0<sub>n</sub></strong> &mdash; generalize loops to higher-dimensional spheres mapped into the space.</li>
  <li><strong>Homology H<sub>n</sub></strong> &mdash; detects n-dimensional "holes." For the tesseract (solid 4-cube), all homology is trivial since it is contractible.</li>
  <li><strong>Cohomology H<sup>n</sup></strong> &mdash; the dual theory to homology, with a rich ring structure.</li>
  <li><strong>CW complexes</strong> &mdash; spaces built by attaching cells. The tesseract has a natural CW structure with cells in dimensions 0 through 4.</li>
  <li><strong>Exact sequences</strong> &mdash; Mayer-Vietoris, long exact sequences of pairs: the tools for computing invariants.</li>
</ul>

<h3>Relevance to the Tesseract</h3>
<p>While the solid tesseract is contractible, its <em>boundary</em> \u2202I<sup>4</sup> is homeomorphic to S<sup>3</sup> (the 3-sphere), which has rich topology. The CW decomposition of the tesseract&mdash;its face lattice of 16 vertices, 32 edges, 24 squares, and 8 cubes&mdash;is a central object of study in algebraic topology of polytopes.</p>
    `,
    subsections: [
      {
        title: "Core Textbooks",
        items: [
          { title: "Algebraic Topology", author: "Allen Hatcher", type: "book", level: "intermediate", url: "https://pi.math.cornell.edu/~hatcher/AT/ATpage.html", desc: "Freely available. The standard graduate text covering fundamental group, van Kampen's theorem, homology (simplicial, singular, cellular), and cohomology." },
          { title: "Elements of Algebraic Topology", author: "James R. Munkres", type: "book", level: "intermediate", url: "https://www.pearson.com/en-us/subject-catalog/p/elements-of-algebraic-topology/P200000003513", desc: "Computational emphasis. Covers simplicial homology in great detail with explicit algorithms, then develops singular homology. Excellent for understanding chain complexes." },
          { title: "A Concise Course in Algebraic Topology", author: "J. Peter May", type: "book", level: "advanced", url: "https://www.math.uchicago.edu/~may/CONCISE/ConciseRevised.pdf", desc: "Free online. Dense, elegant treatment for the mathematically mature reader. Covers homotopy theory, cofibrations, fibrations, and spectral sequences." },
          { title: "Algebraic Topology", author: "Edwin H. Spanier", type: "book", level: "advanced", url: "https://link.springer.com/book/10.1007/978-1-4684-9322-1", desc: "Classic comprehensive reference. Rigorous and complete. Covers homotopy, homology, cohomology, duality theorems, and fiber bundles." }
        ]
      },
      {
        title: "Lecture Notes & Videos",
        items: [
          { title: "Algebraic Topology Lectures", author: "Pierre Albin (UIUC)", type: "video", level: "intermediate", url: "https://www.youtube.com/playlist?list=PLpRLWqLFLVTCL15U6N3o35g4uhMSBVA2b", desc: "Full semester video course following Hatcher. Clear blackboard lectures covering fundamental group, covering spaces, and homology." },
          { title: "MIT 18.905: Algebraic Topology I", author: "Haynes Miller (MIT OCW)", type: "course", level: "intermediate", url: "https://ocw.mit.edu/courses/18-905-algebraic-topology-i-fall-2016/", desc: "Graduate-level MIT course with detailed lecture notes. Covers singular homology, CW complexes, cohomology, and Poincar\u00e9 duality." },
          { title: "Algebraic Topology Lecture Notes", author: "Akhil Mathew", type: "notes", level: "intermediate", url: "https://math.uchicago.edu/~amathew/ATnotes.pdf", desc: "Well-written notes covering the fundamental group, covering spaces, homology, and cohomology with a modern perspective." },
          { title: "Interactive Algebraic Topology", author: "Topology Explained (YouTube)", type: "video", level: "beginner", url: "https://www.youtube.com/playlist?list=PLd8NbPjkXPliJunBcGKMBVSMA1ztCBlfv", desc: "Visual, intuition-building videos on homology, the fundamental group, exact sequences, and key theorems of algebraic topology." }
        ]
      },
      {
        title: "Specialized & Advanced",
        items: [
          { title: "Homotopy Type Theory (HoTT Book)", author: "Univalent Foundations Program", type: "book", level: "advanced", url: "https://homotopytypetheory.org/book/", desc: "Free online. Radical new foundation blending homotopy theory with type theory. Relevant to computational approaches to higher-dimensional topology." },
          { title: "Homology of Cell Complexes", author: "George Lundell & Stephen Weingram", type: "book", level: "advanced", url: "https://www.sciencedirect.com/book/9780124605503/the-topology-of-cw-complexes", desc: "Detailed treatment of CW complexes and cellular homology. Directly applicable to computing the homology of polytopes like the tesseract." }
        ]
      }
    ]
  },
  {
    id: "persistent",
    label: "Persistent Homology",
    icon: "\u25C9",
    intro: `
<p><strong>Persistent homology</strong> is the central tool of topological data analysis. It tracks how topological features&mdash;connected components, loops, cavities, and higher-dimensional voids&mdash;appear (<em>are born</em>) and disappear (<em>die</em>) across a parameterized family of spaces (a <strong>filtration</strong>).</p>

<h3>Core Concepts</h3>
<ul>
  <li><strong>Filtrations</strong> &mdash; nested sequences of simplicial complexes (or sublevel sets) indexed by a parameter.</li>
  <li><strong>Persistence modules</strong> &mdash; the algebraic structures that capture how homology evolves over the filtration.</li>
  <li><strong>Barcodes &amp; persistence diagrams</strong> &mdash; visual summaries pairing birth and death times of each feature.</li>
  <li><strong>Stability theorems</strong> &mdash; small perturbations in the input cause small perturbations in the persistence diagram (bottleneck/Wasserstein distance).</li>
  <li><strong>Persistent cohomology</strong> &mdash; dual theory enabling efficient representative cycle computation.</li>
  <li><strong>Multi-parameter persistence</strong> &mdash; extending to filtrations with two or more parameters (an active research frontier).</li>
</ul>

<h3>Relevance to the Tesseract</h3>
<p>When exploring a tesseract via point-cloud sampling or sublevel-set filtrations, persistent homology reveals how the topological structure of the 4-cube emerges. One can detect its boundary (homeomorphic to S<sup>3</sup>), identify the eight bounding cubes as features, and study how the 4-dimensional topology is reflected in persistence diagrams.</p>
    `,
    subsections: [
      {
        title: "Foundational Texts",
        items: [
          { title: "Computational Topology: An Introduction", author: "Herbert Edelsbrunner & John L. Harer", type: "book", level: "intermediate", url: "https://bookstore.ams.org/mbk-69", desc: "The first comprehensive textbook on computational topology. Covers simplicial complexes, homology computation, persistent homology, and Morse theory." },
          { title: "Topology and Data", author: "Gunnar Carlsson", type: "notes", level: "intermediate", url: "https://www.ams.org/journals/bull/2009-46-02/S0273-0979-09-01249-X/", desc: "Influential 2009 survey paper in the Bulletin of the AMS. Explains the philosophical underpinning of TDA and the role of persistent homology." },
          { title: "Persistence Theory: From Quiver Representations to Data Analysis", author: "Steve Y. Oudot", type: "book", level: "advanced", url: "https://bookstore.ams.org/surv-209", desc: "Rigorous algebraic treatment of persistence modules via quiver theory. Covers decomposition theorems, stability, and multi-parameter persistence." },
          { title: "Persistent Homology: A Survey", author: "Herbert Edelsbrunner & Dmitriy Morozov", type: "notes", level: "intermediate", url: "https://mrzv.org/publications/persistent-homology-survey/", desc: "Concise survey covering the development of persistent homology from simplicial complexes through stability and computational aspects." }
        ]
      },
      {
        title: "Lectures & Courses",
        items: [
          { title: "Applied Algebraic Topology Network (AATRN) Webinars", author: "AATRN Community", type: "video", level: "intermediate", url: "https://www.youtube.com/@aaaboringmorning/playlists", desc: "Archive of research seminars on persistent homology, mapper, TDA applications. Features talks by leading researchers." },
          { title: "Computational Persistent Homology (Tutorial)", author: "Matthew Wright", type: "video", level: "beginner", url: "https://www.youtube.com/watch?v=h0bnG1Wavag", desc: "Self-contained video tutorial building persistent homology from scratch with examples. Good entry point before diving into textbooks." },
          { title: "Persistent Homology and TDA (TU Munich)", author: "Ulrich Bauer", type: "course", level: "intermediate", url: "https://www.youtube.com/playlist?list=PLBh0vFJaw0GCR1JY8Qb1KmU1R-BjQOVvr", desc: "University lecture course by the creator of Ripser. Covers filtrations, barcodes, stability, and computational algorithms." },
          { title: "The Structure and Stability of Persistence Modules", author: "Fr\u00e9d\u00e9ric Chazal et al.", type: "notes", level: "advanced", url: "https://link.springer.com/book/10.1007/978-3-319-42545-0", desc: "Springer monograph giving a thorough algebraic treatment of persistence modules, interleaving distance, and stability in general settings." }
        ]
      },
      {
        title: "Key Papers",
        items: [
          { title: "Topological Persistence and Simplification", author: "Edelsbrunner, Letscher & Zomorodian (2002)", type: "notes", level: "advanced", url: "https://link.springer.com/article/10.1007/s00454-002-2885-2", desc: "The foundational paper introducing persistent homology and the pairing algorithm. Required reading for understanding the field's origins." },
          { title: "Computing Persistent Homology", author: "Afra Zomorodian & Gunnar Carlsson (2005)", type: "notes", level: "intermediate", url: "https://link.springer.com/article/10.1007/s00454-004-1146-y", desc: "Introduces the standard algorithm and the persistence module decomposition theorem. Established the algebraic framework used by most implementations." },
          { title: "Stability of Persistence Diagrams", author: "David Cohen-Steiner, Herbert Edelsbrunner & John Harer (2007)", type: "notes", level: "advanced", url: "https://link.springer.com/article/10.1007/s00454-006-1276-5", desc: "Proves the celebrated stability theorem: small changes in the input function produce small changes in the persistence diagram. Foundation of statistical TDA." }
        ]
      }
    ]
  },
  {
    id: "tda",
    label: "TDA",
    icon: "\u25EC",
    intro: `
<p><strong>Topological Data Analysis (TDA)</strong> applies tools from topology&mdash;especially persistent homology&mdash;to real-world data. It extracts shape-based features that are invisible to classical statistical and machine-learning methods, providing robust summaries of complex, high-dimensional datasets.</p>

<h3>Core Concepts</h3>
<ul>
  <li><strong>Vietoris-Rips complexes</strong> &mdash; simplicial complexes built from point clouds using pairwise distances.</li>
  <li><strong>\u010Cech complexes</strong> &mdash; built from intersections of balls; theoretically cleaner but computationally harder.</li>
  <li><strong>Alpha complexes</strong> &mdash; based on Delaunay triangulations; efficient in low dimensions.</li>
  <li><strong>Mapper algorithm</strong> &mdash; creates a simplicial complex summarizing the "shape" of data via a reference map, cover, and clustering.</li>
  <li><strong>Persistence landscapes &amp; images</strong> &mdash; vectorizations of persistence diagrams for use in machine learning pipelines.</li>
  <li><strong>TDA + ML pipelines</strong> &mdash; integrating topological features with neural networks, kernel methods, and classical ML.</li>
</ul>

<h3>Relevance to the Tesseract</h3>
<p>TDA provides practical tools for <em>reconstructing</em> the topology of a tesseract from sampled data. Given a point cloud sampled from a 4-cube or its boundary, Vietoris-Rips persistent homology will detect the correct Betti numbers and reveal the 4-dimensional structure. Mapper can produce low-dimensional summaries of the tesseract's combinatorial geometry.</p>
    `,
    subsections: [
      {
        title: "Textbooks & Monographs",
        items: [
          { title: "Elementary Applied Topology", author: "Robert Ghrist", type: "book", level: "intermediate", url: "https://www.math.upenn.edu/~ghrist/notes.html", desc: "Beautifully illustrated text covering topology, sheaves, Morse theory, and persistent homology with applications to robotics, sensing, and data." },
          { title: "Persistence Theory: From Quiver Representations to Data Analysis", author: "Steve Y. Oudot", type: "book", level: "advanced", url: "https://bookstore.ams.org/surv-209", desc: "Theoretical foundations of persistence for data analysis. Covers algebraic stability, interleaving distances, and multiparameter persistence." },
          { title: "Geometric and Topological Inference", author: "Jean-Daniel Boissonnat, Fr\u00e9d\u00e9ric Chazal & Mariette Yvinec", type: "book", level: "intermediate", url: "https://www.cambridge.org/core/books/geometric-and-topological-inference/96B596D5FCFB279F0B43F1F258B3E886", desc: "Covers geometric inference, distance functions, simplicial complexes, and topological persistence from a computational geometry perspective." },
          { title: "An Introduction to Topological Data Analysis", author: "Fr\u00e9d\u00e9ric Chazal & Bertrand Michel", type: "notes", level: "beginner", url: "https://arxiv.org/abs/1710.04019", desc: "Accessible introduction aimed at statisticians and data scientists. Covers simplicial complexes, persistent homology, stability, and statistical aspects." }
        ]
      },
      {
        title: "Tutorials & Courses",
        items: [
          { title: "TDA with R (CRAN Vignette)", author: "CRAN / Fasy, Kim, Lecci, Maria", type: "course", level: "beginner", url: "https://cran.r-project.org/web/packages/TDA/vignettes/article.pdf", desc: "Practical tutorial using the TDA R package. Covers Rips filtrations, persistence diagrams, landscapes, and statistical inference with code examples." },
          { title: "Topological Data Analysis with scikit-tda", author: "Nathaniel Saul & Chris Tralie", type: "course", level: "beginner", url: "https://scikit-tda.org/", desc: "Python ecosystem for TDA. Tutorials covering Ripser (persistent homology), Persim (diagram distances), KeplerMapper, and integration with scikit-learn." },
          { title: "TDA: A Practical Guide for Non-Mathematicians", author: "Leland McInnes (Talk)", type: "video", level: "beginner", url: "https://www.youtube.com/watch?v=F3s2SBmyEZs", desc: "Talk by the creator of UMAP explaining TDA concepts (persistent homology, Mapper) for practitioners without heavy math background." },
          { title: "Topological Methods in Data Analysis (Stanford)", author: "Gunnar Carlsson (Stanford)", type: "course", level: "intermediate", url: "https://online.stanford.edu/courses/cme-291-topological-methods-data-analysis", desc: "Stanford course covering TDA fundamentals, persistent homology, Mapper, and applications to biomedicine and materials science." }
        ]
      },
      {
        title: "Key Papers & Surveys",
        items: [
          { title: "Barcodes: The Persistent Topology of Data", author: "Robert Ghrist", type: "notes", level: "intermediate", url: "https://www.ams.org/journals/bull/2008-45-01/S0273-0979-07-01191-3/", desc: "Influential Bulletin of the AMS article providing an accessible overview of persistent homology and its role in data analysis." },
          { title: "Topological Pattern Recognition for Point Cloud Data", author: "Gunnar Carlsson (2014)", type: "notes", level: "intermediate", url: "https://www.cambridge.org/core/journals/acta-numerica/article/topological-pattern-recognition-for-point-cloud-data/BB0DA0F0EBD79809C563AF80B555A23C", desc: "Acta Numerica survey covering the full TDA pipeline from point clouds through persistent homology to statistical and machine-learning applications." },
          { title: "A Roadmap for the Computation of Persistent Homology", author: "Nina Otter et al. (2017)", type: "notes", level: "intermediate", url: "https://epjdatascience.springeropen.com/articles/10.1140/epjds/s13688-017-0109-5", desc: "Practical guide comparing TDA software and workflows. Benchmarks different persistent homology implementations on real datasets." }
        ]
      }
    ]
  },
  {
    id: "higher",
    label: "Higher Dimensions",
    icon: "\u2B21",
    intro: `
<p><strong>Higher-dimensional geometry</strong> studies the properties of geometric objects in n-dimensional spaces (n \u2265 4). This includes polytopes (higher-dimensional polyhedra), manifolds, hyperbolic spaces, and the rich interplay between combinatorics and topology in dimensions beyond direct visual experience.</p>

<h3>Core Concepts</h3>
<ul>
  <li><strong>Polytopes</strong> &mdash; convex hulls of finite point sets in \u211D<sup>n</sup>. Regular polytopes are the higher-dimensional analogs of the Platonic solids.</li>
  <li><strong>The tesseract (4-cube, hypercube)</strong> &mdash; the 4D analog of the cube: 16 vertices, 32 edges, 24 square faces, 8 cubic cells. Symmetry group of order 384.</li>
  <li><strong>Schlegel diagrams</strong> &mdash; projections of n-dimensional polytopes into (n-1)-dimensional space, preserving the combinatorial structure.</li>
  <li><strong>Manifolds</strong> &mdash; spaces locally resembling \u211D<sup>n</sup>. The boundary of the tesseract is a 3-manifold (homeomorphic to S<sup>3</sup>).</li>
  <li><strong>Hyperbolic geometry</strong> &mdash; constant negative curvature geometry in any dimension, with exponentially growing volumes.</li>
  <li><strong>Thurston's geometrization</strong> &mdash; classification of 3-manifolds into eight geometric types; proved by Perelman.</li>
</ul>

<h3>The Tesseract in Detail</h3>
<p>The tesseract is the <strong>4-dimensional hypercube</strong>, denoted \u03B3<sub>4</sub> or [0,1]<sup>4</sup>. Its face lattice encodes a rich combinatorial structure. Its dual is the <strong>16-cell</strong> (\u03B2<sub>4</sub>), with 8 vertices and 16 tetrahedral cells. Understanding the tesseract requires facility with higher-dimensional visualization (nets, projections, cross-sections) and group theory (hyperoctahedral group B<sub>4</sub>).</p>
    `,
    subsections: [
      {
        title: "Polytopes & Higher-Dimensional Geometry",
        items: [
          { title: "Regular Polytopes (3rd Edition)", author: "H.S.M. Coxeter", type: "book", level: "intermediate", url: "https://store.doverpublications.com/0486614808.html", desc: "The definitive classical work on regular polytopes in all dimensions. Covers the tesseract, 16-cell, 24-cell, 120-cell, and 600-cell with full symmetry analysis." },
          { title: "Convex Polytopes (2nd Edition)", author: "Branko Gr\u00fcnbaum", type: "book", level: "advanced", url: "https://link.springer.com/book/10.1007/978-1-4613-0019-9", desc: "Comprehensive treatment of the combinatorial theory of convex polytopes. Face lattices, f-vectors, Dehn-Sommerville equations, and the upper-bound theorem." },
          { title: "Lectures on Polytopes", author: "G\u00fcnter M. Ziegler", type: "book", level: "intermediate", url: "https://link.springer.com/book/10.1007/978-1-4613-8431-1", desc: "Modern, accessible introduction to polytope theory. Covers face lattices, Schlegel diagrams, shellability, and the g-theorem. Rich in examples." },
          { title: "The Symmetries of Things", author: "John H. Conway, Heidi Burgiel & Chaim Goodman-Strauss", type: "book", level: "intermediate", url: "https://www.routledge.com/The-Symmetries-of-Things/Conway-Burgiel-Goodman-Strauss/p/book/9781568812205", desc: "Beautiful exploration of symmetry from frieze patterns to higher-dimensional symmetry groups. The hyperoctahedral group B_4 governing the tesseract is covered." }
        ]
      },
      {
        title: "Manifolds & Geometric Topology",
        items: [
          { title: "The Geometry and Topology of Three-Manifolds", author: "William P. Thurston", type: "notes", level: "advanced", url: "https://library.msri.org/books/gt3m/", desc: "Thurston's legendary lecture notes, freely available from MSRI. Covers hyperbolic geometry, geometric structures, and the eight Thurston geometries." },
          { title: "Introduction to Topological Manifolds (2nd Edition)", author: "John M. Lee", type: "book", level: "intermediate", url: "https://link.springer.com/book/10.1007/978-1-4419-7940-7", desc: "Graduate text covering topological manifolds, fundamental group, covering spaces, CW complexes, and classification of surfaces." },
          { title: "Four-Dimensional Geometry", author: "Koji Miyazaki", type: "video", level: "beginner", url: "https://www.youtube.com/watch?v=0t4aKJuKP0Q", desc: "Visual exploration of 4D objects including the tesseract, featuring cross-sections, projections, and unfolding into 3D nets." },
          { title: "Dimensions (Film Series)", author: "Jos Leys, \u00c9tienne Ghys & Aur\u00e9lien Alvarez", type: "video", level: "beginner", url: "https://www.dimensions-math.org/", desc: "Award-winning nine-chapter film series on geometry and dimensions. Chapters 5-6 cover 4D polytopes including the tesseract with stunning visualizations." }
        ]
      },
      {
        title: "Visualization & Interactive Tools",
        items: [
          { title: "4D Visualization Project", author: "Mathematics Visualization Group", type: "code", level: "beginner", url: "https://github.com/henryseg/Hyperbolica", desc: "Open-source tools for visualizing 4D objects via projections, cross-sections, and rotations. Useful for building intuition about the tesseract." },
          { title: "Exploring Hyperspace with the Geometric Product", author: "Steven De Keninck", type: "notes", level: "intermediate", url: "https://bivector.net/", desc: "Projective and conformal geometric algebra tools for working with higher-dimensional geometry. Interactive demos for 4D rotations and reflections." }
        ]
      }
    ]
  },
  {
    id: "fiber",
    label: "Fiber Bundles",
    icon: "\u2297",
    intro: `
<p><strong>Fiber bundles</strong> and <strong>sheaves</strong> are the mathematical frameworks for understanding how local pieces of a space stitch together to form a global whole. A fiber bundle is a space that locally looks like a product E \u2248 B \u00d7 F (base \u00d7 fiber), but may have nontrivial global "twisting."</p>

<h3>Core Concepts</h3>
<ul>
  <li><strong>Vector bundles</strong> &mdash; fiber bundles where each fiber is a vector space. The tangent bundle of a manifold is the fundamental example.</li>
  <li><strong>Principal bundles</strong> &mdash; bundles with a structure group G acting freely on each fiber. Foundation for gauge theory in physics.</li>
  <li><strong>Characteristic classes</strong> &mdash; cohomology classes (Chern, Stiefel-Whitney, Pontryagin) that detect the twisting of a bundle.</li>
  <li><strong>Sheaves</strong> &mdash; generalize bundles by assigning algebraic data to open sets with consistency (gluing) conditions.</li>
  <li><strong>Sheaf cohomology</strong> &mdash; a powerful computational tool connecting local data to global invariants.</li>
  <li><strong>Connections &amp; curvature</strong> &mdash; differential-geometric structures on bundles that measure parallel transport and twisting.</li>
</ul>

<h3>Relevance to the Tesseract</h3>
<p>When navigating a tesseract, one naturally encounters fiber-bundle-like structures: projecting the tesseract onto a lower-dimensional base (e.g., an edge or face) yields fibers that are lower-dimensional cubes. The <em>Hopf fibration</em> S<sup>3</sup> \u2192 S<sup>2</sup> is intimately related to 4-dimensional geometry. Sheaf theory provides the language for consistently assembling local "views" of the tesseract&mdash;seen from different 3D cross-sections&mdash;into a global understanding.</p>
    `,
    subsections: [
      {
        title: "Fiber Bundles",
        items: [
          { title: "Fibre Bundles (3rd Edition)", author: "Dale Husemoller", type: "book", level: "intermediate", url: "https://link.springer.com/book/10.1007/978-1-4757-2261-1", desc: "Standard graduate text on fiber bundles. Covers vector bundles, principal bundles, classifying spaces, characteristic classes, and K-theory." },
          { title: "Topology and Geometry", author: "Glen E. Bredon", type: "book", level: "intermediate", url: "https://link.springer.com/book/10.1007/978-1-4757-6848-0", desc: "Comprehensive text covering general topology, differentiable manifolds, fundamental group, homology, cohomology, and fiber bundles in a unified treatment." },
          { title: "Characteristic Classes", author: "John W. Milnor & James D. Stasheff", type: "book", level: "advanced", url: "https://press.princeton.edu/books/paperback/9780691081229/characteristic-classes-am-76-volume-76", desc: "The classic Princeton Annals volume. Constructs Stiefel-Whitney, Chern, and Pontryagin classes from scratch. Essential for understanding bundle invariants." },
          { title: "The Topology of Fibre Bundles", author: "Norman Steenrod", type: "book", level: "advanced", url: "https://press.princeton.edu/books/paperback/9780691005485/the-topology-of-fibre-bundles-pms-14-volume-14", desc: "The original systematic treatment of fiber bundles. Historical importance and still relevant for coordinate bundles and the homotopy classification of bundles." }
        ]
      },
      {
        title: "Sheaves & Derived Categories",
        items: [
          { title: "Sheaves in Geometry and Logic", author: "Saunders Mac Lane & Ieke Moerdijk", type: "book", level: "advanced", url: "https://link.springer.com/book/10.1007/978-1-4612-0927-0", desc: "Introduces sheaves, topoi, and their applications. Connects sheaf theory with logic and category theory in an accessible style for the prerequisites." },
          { title: "Sheaves on Manifolds", author: "Masaki Kashiwara & Pierre Schapira", type: "book", level: "advanced", url: "https://link.springer.com/book/10.1007/978-3-662-02661-8", desc: "Comprehensive treatment of sheaf theory and derived categories on manifolds. Covers microlocal analysis, constructible sheaves, and D-modules." },
          { title: "Cellular Sheaves and Applications", author: "Justin Curry (PhD Thesis)", type: "notes", level: "advanced", url: "https://arxiv.org/abs/1303.3255", desc: "Develops sheaves on cell complexes (like polytopes) with applications to network coding, opinion dynamics, and topological signal processing." },
          { title: "Sheaf Theory through Examples", author: "Daniel Rosiak", type: "book", level: "intermediate", url: "https://mitpress.mit.edu/9780262542159/sheaf-theory-through-examples/", desc: "Recent, accessible introduction to sheaves with concrete examples from topology, logic, linguistics, and data science. Good entry point." }
        ]
      },
      {
        title: "Lectures & Visual Resources",
        items: [
          { title: "Fiber Bundles and Gauge Theory (Schuller)", author: "Frederic Schuller", type: "video", level: "intermediate", url: "https://www.youtube.com/playlist?list=PLFeEvEPtX_0S6vxxiiNPrJbLu9aK1UVC_", desc: "Rigorous lecture series covering manifolds, fiber bundles, connections, curvature, and gauge theory. Physics-motivated but mathematically precise." },
          { title: "The Hopf Fibration (Niles Johnson)", author: "Niles Johnson", type: "video", level: "beginner", url: "https://nilesjohnson.net/hopf.html", desc: "Beautiful visualizations of the Hopf fibration S^3 -> S^2, directly relevant to 4-dimensional geometry and the topology of the 3-sphere (tesseract boundary)." }
        ]
      }
    ]
  },
  {
    id: "datasets",
    label: "Datasets & Software",
    icon: "\u262C",
    intro: `
<p><strong>Software and datasets</strong> are essential for making topology computational. Modern TDA software can compute persistent homology on millions of simplices, visualize high-dimensional persistence diagrams, and integrate topological features into machine-learning pipelines.</p>

<h3>Software Ecosystem</h3>
<ul>
  <li><strong>GUDHI</strong> &mdash; comprehensive C++/Python library for simplicial complexes, persistent homology, Mapper, and more (INRIA).</li>
  <li><strong>Ripser</strong> &mdash; the fastest Vietoris-Rips persistent homology computation. Available as C++, Python (ripser.py), and web versions.</li>
  <li><strong>Dionysus 2</strong> &mdash; C++/Python library for persistent homology with support for zigzag persistence and cohomology.</li>
  <li><strong>scikit-tda</strong> &mdash; Python ecosystem integrating Ripser, Persim, KeplerMapper, and UMAP for TDA pipelines.</li>
  <li><strong>TopoX / TopoBench</strong> &mdash; frameworks for topological deep learning on cell complexes, simplicial complexes, and hypergraphs.</li>
  <li><strong>JavaPlex</strong> &mdash; Java library for persistent homology, with emphasis on pedagogical use and visualization.</li>
</ul>

<h3>Relevance to the Tesseract</h3>
<p>These tools let you <em>compute</em> the topology of the tesseract and related structures. You can sample points from a tesseract, build Vietoris-Rips or Alpha complexes, compute persistent homology, and verify the expected Betti numbers. TopoX and TopoBench provide benchmarking frameworks for topological neural networks operating on cell complexes&mdash;including the cell complex of the tesseract itself.</p>
    `,
    subsections: [
      {
        title: "Persistent Homology Libraries",
        items: [
          { title: "GUDHI (Geometry Understanding in Higher Dimensions)", author: "INRIA / GUDHI Project", type: "code", level: "intermediate", url: "https://gudhi.inria.fr/", desc: "Comprehensive C++/Python library. Simplicial/cubical complexes, Alpha/Rips/witness complexes, persistent homology, bottleneck/Wasserstein distances, Mapper." },
          { title: "Ripser", author: "Ulrich Bauer", type: "code", level: "intermediate", url: "https://github.com/Ripser/ripser", desc: "State-of-the-art Vietoris-Rips persistent homology. Extremely fast and memory-efficient via implicit matrix reduction and cohomology." },
          { title: "ripser.py (Scikit-TDA)", author: "Chris Tralie & Nathaniel Saul", type: "code", level: "beginner", url: "https://github.com/scikit-tda/ripser.py", desc: "Python bindings for Ripser with scikit-learn-compatible API. Pip-installable, integrates with NumPy/SciPy. The easiest way to compute persistence in Python." },
          { title: "Dionysus 2", author: "Dmitriy Morozov", type: "code", level: "intermediate", url: "https://mrzv.org/software/dionysus2/", desc: "C++/Python library supporting standard and zigzag persistent homology, cohomology, Wasserstein distances, and persistence diagram operations." },
          { title: "JavaPlex", author: "Stanford Applied Topology Group", type: "code", level: "beginner", url: "https://appliedtopology.github.io/javaplex/", desc: "Java library for persistent homology with Matlab interface. Designed for teaching and experimentation. Good documentation and tutorials." }
        ]
      },
      {
        title: "TDA Ecosystems & Pipelines",
        items: [
          { title: "scikit-tda", author: "Nathaniel Saul & Chris Tralie", type: "code", level: "beginner", url: "https://scikit-tda.org/", desc: "Unified Python ecosystem: Ripser (persistence), Persim (diagram distances/visualization), KeplerMapper (Mapper algorithm), tadasets (sample datasets)." },
          { title: "giotto-tda", author: "giotto.ai / L2F EPFL", type: "code", level: "intermediate", url: "https://giotto-ai.github.io/gtda-docs/", desc: "High-performance Python library for TDA + ML. Scikit-learn API, GPU-accelerated Ripser, persistence diagrams to feature vectors, time-series TDA." },
          { title: "KeplerMapper", author: "Hendrik Jacob van Veen & Nathaniel Saul", type: "code", level: "beginner", url: "https://kepler-mapper.scikit-tda.org/", desc: "Python implementation of the Mapper algorithm. Interactive HTML visualizations. Integrates with scikit-learn for clustering and dimensionality reduction." },
          { title: "TDA R Package", author: "Fasy, Kim, Lecci, Maria et al.", type: "code", level: "intermediate", url: "https://cran.r-project.org/web/packages/TDA/", desc: "R package for TDA: persistent homology via GUDHI/Dionysus/PHAT backends, kernel density estimation, confidence sets for persistence diagrams." }
        ]
      },
      {
        title: "Topological Deep Learning",
        items: [
          { title: "TopoX (TopoNetX + TopoModelX + TopoEmbedX)", author: "PyT-Team", type: "code", level: "intermediate", url: "https://github.com/pyt-team/TopoNetX", desc: "Python suite for topological deep learning. TopoNetX computes on cell/simplicial/combinatorial complexes. TopoModelX provides neural network layers." },
          { title: "TopoBenchmarkX", author: "PyT-Team", type: "code", level: "intermediate", url: "https://github.com/pyt-team/TopoBenchmarkX", desc: "Benchmarking framework for topological deep learning methods. Standardized datasets, metrics, and model comparison on cell complexes and simplicial complexes." },
          { title: "Topology ToolKit (TTK)", author: "Julien Tierny et al.", type: "code", level: "intermediate", url: "https://topology-tool-kit.github.io/", desc: "Open-source library for topological analysis and visualization of scientific data. Integrates with ParaView/VTK. Morse-Smale complexes, contour trees, persistence." }
        ]
      },
      {
        title: "Datasets & Benchmarks",
        items: [
          { title: "tadasets (Sample Point Clouds for TDA)", author: "scikit-tda", type: "data", level: "beginner", url: "https://github.com/scikit-tda/tadasets", desc: "Python package generating standard point-cloud datasets for TDA experiments: torus, sphere, Swiss roll, clusters, and other shapes in various dimensions." },
          { title: "Eirene.jl Datasets", author: "Gregory Henselman-Petrusek", type: "data", level: "intermediate", url: "https://github.com/Eetion/Eirene.jl", desc: "Julia persistent homology library with bundled datasets including Betti curve examples and benchmark complexes for performance testing." }
        ]
      }
    ]
  }
];

/* ── rendering engine (identical pattern) ── */
const tabBar   = document.getElementById("tab-bar");
const mainArea = document.getElementById("main-content");
const searchIn = document.getElementById("search-input");
const clearBtn = document.getElementById("search-clear");
const statEl   = document.getElementById("stat-count");

let activeTab    = SECTIONS[0].id;
let activeFilter = "all";
let searchTerm   = "";

/* count total resources */
const totalResources = SECTIONS.reduce((sum, sec) =>
  sum + sec.subsections.reduce((s2, sub) => s2 + sub.items.length, 0), 0);
statEl.textContent = totalResources;

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
function hl(text) {
  if (!searchTerm) return text;
  const esc = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${esc})`, "gi"), "<mark>$1</mark>");
}

/* ── filter types for section ── */
function getTypes(sec) {
  const types = new Set();
  sec.subsections.forEach(sub => sub.items.forEach(it => types.add(it.type)));
  return Array.from(types);
}

/* ── match search ── */
function matchSearch(item) {
  if (!searchTerm) return true;
  const t = searchTerm.toLowerCase();
  return item.title.toLowerCase().includes(t) ||
         item.author.toLowerCase().includes(t) ||
         item.desc.toLowerCase().includes(t) ||
         item.type.toLowerCase().includes(t);
}

/* ── render ── */
function render() {
  buildTabs();
  const sec = SECTIONS.find(s => s.id === activeTab);
  if (!sec) return;

  const types = getTypes(sec);

  let html = `<div class="section-header"><h2><span class="section-icon">${sec.icon}</span>${sec.label}</h2></div>`;
  html += `<div class="section-intro">${sec.intro}</div>`;

  /* filter bar */
  html += `<div class="filter-bar">`;
  html += `<button class="filter-btn ${activeFilter === "all" ? "active" : ""}" data-filter="all">All</button>`;
  types.forEach(t => {
    html += `<button class="filter-btn ${activeFilter === t ? "active" : ""}" data-filter="${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</button>`;
  });
  html += `</div>`;

  /* subsections */
  sec.subsections.forEach(sub => {
    const items = sub.items.filter(it =>
      (activeFilter === "all" || it.type === activeFilter) && matchSearch(it));
    if (items.length === 0) return;
    html += `<div class="subsection"><h3>${sub.title}</h3><div class="card-grid">`;
    items.forEach(it => {
      html += `<a class="card" href="${it.url}" target="_blank" rel="noopener">
        <div class="card-top">
          <span class="type-badge badge-${it.type}">${it.type}</span>
          <span class="level-badge level-${it.level}">${it.level}</span>
        </div>
        <div class="card-title">${hl(it.title)}</div>
        <div class="card-author">${hl(it.author)}</div>
        <div class="card-desc">${hl(it.desc)}</div>
      </a>`;
    });
    html += `</div></div>`;
  });

  mainArea.innerHTML = html;

  /* filter buttons */
  mainArea.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      render();
    });
  });
}

/* ── search ── */
searchIn.addEventListener("input", () => {
  searchTerm = searchIn.value.trim();
  render();
});
clearBtn.addEventListener("click", () => {
  searchIn.value = "";
  searchTerm = "";
  render();
});

/* ── init ── */
render();
