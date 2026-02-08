/* ===== Swarm Intelligence Reference Hub — app.js ===== */

const SECTIONS = [
  /* ── 0  Overview ── */
  {
    id: "overview",
    icon: "\u25C7",
    label: "Overview",
    intro: `
<p><strong>Swarm Intelligence</strong> studies how simple agents following local rules produce globally coherent, adaptive behavior&mdash;without any central controller. Flocking birds, foraging ants, and schooling fish all demonstrate that sophisticated collective computation can arise from recursive interactions among neighbours.</p>

<h3>Charlotte&rsquo;s Recursive Flocking Model</h3>
<p>Charlotte&rsquo;s Paper&nbsp;3 frames swarm intelligence through <strong>recursive flocking</strong>: each agent continuously re-evaluates three steering forces&mdash;<em>separation</em> (avoid crowding neighbours), <em>alignment</em> (steer toward average heading), and <em>cohesion</em> (move toward average position)&mdash;at every time-step, feeding the output back as input to the next cycle. The recursion creates a feedback loop that lets structure emerge, dissolve, and re-form without top-down planning.</p>

<h3>Key Themes Across This Hub</h3>
<ul>
  <li><strong>Local rules, global order</strong> &mdash; simple heuristics scale to collective intelligence</li>
  <li><strong>Stigmergy</strong> &mdash; indirect communication via environment modification (pheromones, trails)</li>
  <li><strong>Positive &amp; negative feedback</strong> &mdash; amplification loops balanced by decay and inhibition</li>
  <li><strong>Decentralization &amp; robustness</strong> &mdash; no single point of failure; graceful degradation</li>
  <li><strong>Self-organization &amp; emergence</strong> &mdash; macro-patterns not encoded in micro-rules</li>
</ul>

<h3>How to Use This Reference</h3>
<p>Each tab collects curated books, papers, lectures, code repos, and datasets. Use the search bar to filter across all sections, or click a tab to dive into a specific domain. Resource levels range from <em>beginner</em> introductions to <em>advanced</em> research monographs.</p>
    `,
    subsections: [
      {
        title: "Foundational Texts",
        items: [
          { type: "book", level: "beginner", title: "Swarm Intelligence: From Natural to Artificial Systems", author: "Bonabeau, Dorigo & Theraulaz (1999)", desc: "The canonical introduction. Covers ant colonies, flocking, task allocation, and computational models grounded in biological swarms.", url: "https://global.oup.com/academic/product/swarm-intelligence-9780195131598" },
          { type: "book", level: "intermediate", title: "The Computational Beauty of Nature", author: "Gary William Flake (2000)", desc: "Unified tour of fractals, chaos, complex systems, and swarm computation. Excellent bridge between biology and CS.", url: "https://mitpress.mit.edu/9780262561273/" },
          { type: "notes", level: "beginner", title: "Swarm Intelligence (Wikipedia survey)", author: "Wikipedia Contributors", desc: "Broad overview article linking ant colony optimization, particle swarm optimization, artificial bee colonies, and stochastic diffusion search.", url: "https://en.wikipedia.org/wiki/Swarm_intelligence" },
          { type: "book", level: "advanced", title: "Swarm Intelligence: Introduction and Applications", author: "Blum & Merkle, eds. (2008)", desc: "Springer collection of chapters by leading researchers covering theoretical foundations, combinatorial optimization, and robotics applications.", url: "https://link.springer.com/book/10.1007/978-3-540-74089-6" },
          { type: "video", level: "beginner", title: "Swarm Intelligence — Kurzgesagt Style Explainer", author: "Kurzgesagt (YouTube)", desc: "Animated primer on how ants, bees, and termites collectively solve problems no individual could handle.", url: "https://www.youtube.com/watch?v=dkP8NUwB2io" },
        ]
      },
      {
        title: "Cross-Cutting Surveys & Overviews",
        items: [
          { type: "notes", level: "intermediate", title: "Swarm Intelligence: A Whole Greater Than the Sum of Its Parts (IEEE)", author: "Beni & Wang (1993)", desc: "Foundational paper coining the term 'swarm intelligence' and distinguishing it from distributed AI.", url: "https://ieeexplore.ieee.org/document/657307" },
          { type: "notes", level: "advanced", title: "Swarm Intelligence Algorithms: A Tutorial", author: "Ab Wahab, Nefti-Meziani & Atyabi (2015)", desc: "Comprehensive survey of SI meta-heuristics including PSO, ACO, ABC, firefly, cuckoo search, and bat algorithms.", url: "https://doi.org/10.1109/TSMCC.2015.2489669" },
          { type: "course", level: "beginner", title: "Complexity Explorer — Agent-Based Modeling", author: "Santa Fe Institute (online)", desc: "Free MOOC introducing ABM, emergence, and self-organization using NetLogo. Ideal starting point for hands-on swarm modelling.", url: "https://www.complexityexplorer.org/courses/abm" },
          { type: "video", level: "intermediate", title: "The Secret Life of Chaos (BBC)", author: "Jim Al-Khalili (BBC Four)", desc: "Documentary tracing order from chaos through feedback, self-organization, and emergent patterns in nature.", url: "https://www.bbc.co.uk/programmes/b00pv1c3" },
        ]
      }
    ]
  },

  /* ── 1  Flocking & Boids ── */
  {
    id: "flocking",
    icon: "\u25CE",
    label: "Flocking & Boids",
    intro: `
<p><strong>Flocking</strong> is the prototypical swarm behaviour. Craig Reynolds' 1987 <em>Boids</em> model demonstrated that three local steering rules&mdash;<strong>separation</strong>, <strong>alignment</strong>, and <strong>cohesion</strong>&mdash;are sufficient to generate realistic flock motion without a leader or global plan.</p>

<h3>The Three Rules (Charlotte&rsquo;s Recursive Core)</h3>
<ul>
  <li><strong>Separation</strong> &mdash; steer away from neighbours that are too close, preventing collision</li>
  <li><strong>Alignment</strong> &mdash; steer toward the average heading of nearby flock-mates</li>
  <li><strong>Cohesion</strong> &mdash; steer toward the average position of nearby flock-mates</li>
</ul>
<p>These three forces are blended with tunable weights and applied <em>recursively</em> each frame. Charlotte&rsquo;s recursive-flocking model emphasises this feedback loop: the flock&rsquo;s shape at time <em>t</em> determines the neighbourhood used to compute forces at <em>t+1</em>, creating a self-referential dynamical system.</p>

<h3>Why It Matters</h3>
<p>Flocking extends far beyond birds. The same principles drive crowd simulation in VFX, autonomous drone swarms, traffic flow models, and collective robotics. Understanding boids is the gateway to every other swarm algorithm.</p>
    `,
    subsections: [
      {
        title: "Seminal Papers & Books",
        items: [
          { type: "notes", level: "intermediate", title: "Flocks, Herds, and Schools: A Distributed Behavioral Model", author: "Craig W. Reynolds (SIGGRAPH 1987)", desc: "The original boids paper. Introduces separation, alignment, and cohesion as the minimal rule-set for emergent flocking.", url: "https://www.red3d.com/cwr/papers/1987/SIGGRAPH87.pdf" },
          { type: "notes", level: "intermediate", title: "Steering Behaviors for Autonomous Characters", author: "Craig W. Reynolds (GDC 1999)", desc: "Extends boids with pursuit, evasion, path-following, obstacle avoidance, and leader-following behaviours.", url: "https://www.red3d.com/cwr/steer/gdc99/" },
          { type: "book", level: "beginner", title: "The Nature of Code — Chapter 6: Autonomous Agents", author: "Daniel Shiffman (2012)", desc: "Accessible Processing/p5.js walkthrough of Reynolds' steering behaviours and flocking. Code-first pedagogy.", url: "https://natureofcode.com/autonomous-agents/" },
          { type: "notes", level: "advanced", title: "Self-Organized Flocking in 2D and 3D with Metric and Topological Interactions", author: "Vicsek et al. (1995) / Ballerini et al. (2008)", desc: "Vicsek's minimal alignment model + Ballerini's discovery that real starlings use topological (nearest-N) not metric (radius) neighbourhoods.", url: "https://doi.org/10.1103/PhysRevLett.75.1226" },
        ]
      },
      {
        title: "Videos & Courses",
        items: [
          { type: "video", level: "beginner", title: "Coding Challenge #124: Flocking Simulation", author: "Daniel Shiffman / The Coding Train", desc: "Live-coded boids implementation in p5.js. Crystal-clear explanation of the three rules with visual feedback.", url: "https://www.youtube.com/watch?v=mhjuuHl6qHM" },
          { type: "video", level: "beginner", title: "Boids Algorithm Explained Visually", author: "Sebastian Lague (YouTube)", desc: "Beautiful 3D visualisation of boids in Unity, showing how parameter tweaks alter emergent behaviour.", url: "https://www.youtube.com/watch?v=bqtqltqcQhw" },
          { type: "course", level: "intermediate", title: "Autonomous Agents & Steering (Nature of Code 2.0)", author: "Daniel Shiffman / The Coding Train", desc: "Full playlist covering vectors, forces, steering, flocking, and flow fields. 20+ episodes with p5.js code.", url: "https://www.youtube.com/playlist?list=PLRqwX-V7Uu6ZV4yEcW3uDwOgGXKUUsPOM" },
        ]
      },
      {
        title: "Code & Interactive Demos",
        items: [
          { type: "code", level: "beginner", title: "Reynolds' Boids — Original C Implementation", author: "Craig W. Reynolds", desc: "Reynolds' personal site with links to his original code, papers, and a curated list of boids implementations.", url: "https://www.red3d.com/cwr/boids/" },
          { type: "code", level: "beginner", title: "p5.js Flocking Example", author: "p5.js Community", desc: "Interactive browser demo of boids in p5.js. Fork and tweak separation/alignment/cohesion weights live.", url: "https://p5js.org/examples/simulate-flocking.html" },
          { type: "code", level: "intermediate", title: "Boids in Rust (ECS Architecture)", author: "GitHub — jgayfer/bevy_boids", desc: "High-performance boids using Bevy ECS in Rust. Spatial hashing for O(n) neighbour queries.", url: "https://github.com/jgayfer/bevy_boids" },
          { type: "code", level: "intermediate", title: "GPU Boids in Unity (Compute Shader)", author: "GitHub — SebLague/Boids", desc: "Sebastian Lague's Unity compute-shader boids. Thousands of agents at 60fps with spatial partitioning.", url: "https://github.com/SebLague/Boids" },
        ]
      }
    ]
  },

  /* ── 2  Ant Colony Optimization ── */
  {
    id: "aco",
    icon: "\u229B",
    label: "Ant Colony Optimization",
    intro: `
<p><strong>Ant Colony Optimization (ACO)</strong> is a meta-heuristic inspired by how real ants find shortest paths between food and nest. Ants deposit <em>pheromones</em> on trails; shorter paths accumulate pheromone faster (positive feedback), while longer paths evaporate (negative feedback). The balance creates a distributed optimization engine.</p>

<h3>Core Mechanism</h3>
<ol>
  <li><strong>Construction</strong> &mdash; artificial ants probabilistically build solutions, biased by pheromone intensity and a heuristic desirability function</li>
  <li><strong>Pheromone update</strong> &mdash; good solutions deposit more pheromone; all trails decay over time</li>
  <li><strong>Iteration</strong> &mdash; the colony converges toward high-quality solutions over many cycles</li>
</ol>

<h3>Applications</h3>
<p>ACO excels at combinatorial optimization: the Travelling Salesman Problem (TSP), vehicle routing, network routing (AntNet), scheduling, and protein folding. Its strengths are adaptability to dynamic environments and inherent parallelism.</p>
    `,
    subsections: [
      {
        title: "Foundational References",
        items: [
          { type: "notes", level: "intermediate", title: "Ant System: Optimization by a Colony of Cooperating Agents", author: "Marco Dorigo, Vittorio Maniezzo & Alberto Colorni (1996)", desc: "The founding paper of ACO. Introduces Ant System (AS) for TSP with pheromone-based probabilistic construction.", url: "https://doi.org/10.1109/3477.484436" },
          { type: "book", level: "intermediate", title: "Ant Colony Optimization", author: "Marco Dorigo & Thomas Stützle (2004)", desc: "The definitive textbook. Covers AS, Ant Colony System (ACS), MAX-MIN Ant System, convergence proofs, and applications.", url: "https://mitpress.mit.edu/9780262042192/" },
          { type: "notes", level: "advanced", title: "Ant Colony System: A Cooperative Learning Approach to the TSP", author: "Dorigo & Gambardella (1997)", desc: "Introduces ACS with local pheromone update and pseudo-random-proportional rule, significantly improving AS performance.", url: "https://doi.org/10.1109/4235.585892" },
          { type: "notes", level: "advanced", title: "MAX-MIN Ant System", author: "Stützle & Hoos (2000)", desc: "Adds pheromone bounds to prevent stagnation. One of the best-performing ACO variants for static combinatorial problems.", url: "https://doi.org/10.1016/S0167-739X(00)00043-1" },
        ]
      },
      {
        title: "Tutorials & Lectures",
        items: [
          { type: "video", level: "beginner", title: "Ant Colony Optimization — Intuition & Algorithm", author: "StatQuest with Josh Starmer", desc: "Beginner-friendly animated walkthrough of pheromone trails, evaporation, and convergence on the TSP.", url: "https://www.youtube.com/results?search_query=ant+colony+optimization+statquest" },
          { type: "course", level: "intermediate", title: "Metaheuristics — ACO Module", author: "Coursera / University of Melbourne", desc: "University-level module covering ACO theory, implementation, parameter tuning, and hybridization with local search.", url: "https://www.coursera.org/learn/discrete-optimization" },
          { type: "video", level: "intermediate", title: "Ant Colony Optimization Visualized", author: "Pezzza's Work (YouTube)", desc: "Mesmerizing real-time visualisation of ants solving mazes and TSP instances with pheromone diffusion.", url: "https://www.youtube.com/watch?v=X-iSQQgOd1A" },
        ]
      },
      {
        title: "Code & Implementations",
        items: [
          { type: "code", level: "beginner", title: "ACO-Pants — Python ACO Library", author: "GitHub — Rhyd Lewis", desc: "Clean Python implementation of Ant Colony System for TSP. Pip-installable with good documentation.", url: "https://github.com/rhyd-lewis/ACO" },
          { type: "code", level: "intermediate", title: "AntNet for Network Routing", author: "Di Caro & Dorigo (1998)", desc: "Adaptive routing algorithm using mobile ant agents that deposit pheromones on network nodes. Paper + reference implementation.", url: "https://doi.org/10.1007/BFb0056889" },
          { type: "code", level: "intermediate", title: "ACO in MATLAB — TSPACO", author: "MathWorks File Exchange", desc: "Well-documented MATLAB implementation of ACO for TSP with visualization of pheromone maps and convergence curves.", url: "https://www.mathworks.com/matlabcentral/fileexchange/?q=ant+colony+optimization" },
        ]
      }
    ]
  },

  /* ── 3  Particle Swarm Optimization ── */
  {
    id: "pso",
    icon: "\u2295",
    label: "Particle Swarm Optimization",
    intro: `
<p><strong>Particle Swarm Optimization (PSO)</strong> simulates a flock of particles flying through a continuous search space. Each particle remembers its personal best position and is attracted toward the global best found by any particle. The interplay of <em>cognitive</em> (memory) and <em>social</em> (communication) components drives convergence.</p>

<h3>Velocity Update Equation</h3>
<p>At each step: <em>v<sub>i</sub>(t+1) = w&middot;v<sub>i</sub>(t) + c<sub>1</sub>&middot;r<sub>1</sub>&middot;(pbest<sub>i</sub> - x<sub>i</sub>) + c<sub>2</sub>&middot;r<sub>2</sub>&middot;(gbest - x<sub>i</sub>)</em>, where <strong>w</strong> is the inertia weight, <strong>c<sub>1</sub></strong>/<strong>c<sub>2</sub></strong> are acceleration coefficients, and <strong>r<sub>1</sub></strong>/<strong>r<sub>2</sub></strong> are uniform random values. The particle then moves: <em>x<sub>i</sub>(t+1) = x<sub>i</sub>(t) + v<sub>i</sub>(t+1)</em>.</p>

<h3>Variants & Extensions</h3>
<ul>
  <li><strong>Constriction coefficient</strong> (Clerc & Kennedy) &mdash; guaranteed convergence via chi factor</li>
  <li><strong>Multi-objective PSO (MOPSO)</strong> &mdash; Pareto-based archive for multi-objective optimization</li>
  <li><strong>Discrete PSO</strong> &mdash; adaptations for combinatorial domains</li>
  <li><strong>Comprehensive Learning PSO (CLPSO)</strong> &mdash; each dimension learns from a different exemplar</li>
</ul>
    `,
    subsections: [
      {
        title: "Seminal Papers & Books",
        items: [
          { type: "notes", level: "intermediate", title: "Particle Swarm Optimization", author: "James Kennedy & Russell Eberhart (ICNN 1995)", desc: "The founding paper. Introduces PSO as a social-cognitive optimization algorithm inspired by bird flocking and fish schooling.", url: "https://doi.org/10.1109/ICNN.1995.488968" },
          { type: "book", level: "intermediate", title: "Swarm Intelligence (Morgan Kaufmann)", author: "Kennedy, Eberhart & Shi (2001)", desc: "Comprehensive textbook covering PSO theory, variants, parameter selection, and connections to social psychology.", url: "https://www.elsevier.com/books/swarm-intelligence/kennedy/978-1-55860-595-4" },
          { type: "notes", level: "advanced", title: "The Particle Swarm — Explosion, Stability, and Convergence", author: "Maurice Clerc & James Kennedy (2002)", desc: "Introduces the constriction coefficient that guarantees convergence. Foundational for modern PSO implementations.", url: "https://doi.org/10.1109/4235.985692" },
          { type: "notes", level: "advanced", title: "A Modified Particle Swarm Optimizer (Inertia Weight)", author: "Yuhui Shi & Russell Eberhart (1998)", desc: "Introduces the inertia weight parameter to balance exploration vs exploitation. One of the most-cited PSO papers.", url: "https://doi.org/10.1109/ICEC.1998.699146" },
          { type: "notes", level: "advanced", title: "Handling Multi-Objective Optimization with PSO (MOPSO)", author: "Coello Coello, Pulido & Lechuga (2004)", desc: "Extends PSO to multi-objective problems using external archive and crowding for Pareto-front approximation.", url: "https://doi.org/10.1109/TEVC.2004.826067" },
        ]
      },
      {
        title: "Tutorials & Videos",
        items: [
          { type: "video", level: "beginner", title: "Particle Swarm Optimization Clearly Explained", author: "Yarpiz (YouTube)", desc: "Step-by-step visual walkthrough of PSO with MATLAB code. Shows particles converging on benchmark functions.", url: "https://www.youtube.com/watch?v=JhgDMAm-imI" },
          { type: "course", level: "intermediate", title: "Bio-Inspired Computation — PSO Module", author: "edX / various universities", desc: "University-level treatment of PSO including topology, parameter tuning, and hybrid approaches.", url: "https://www.edx.org/search?q=particle+swarm+optimization" },
          { type: "video", level: "intermediate", title: "PSO for Neural Network Training", author: "Sentdex (YouTube)", desc: "Using PSO as an alternative to gradient descent for training neural networks. Python implementation from scratch.", url: "https://www.youtube.com/results?search_query=pso+neural+network+training" },
        ]
      },
      {
        title: "Code & Libraries",
        items: [
          { type: "code", level: "beginner", title: "PySwarms — Python PSO Library", author: "GitHub — ljvmiranda921/pyswarms", desc: "Well-maintained Python library for PSO with visualization tools, benchmark functions, and parallel evaluation.", url: "https://github.com/ljvmiranda921/pyswarms" },
          { type: "code", level: "intermediate", title: "DEAP — Distributed Evolutionary Algorithms in Python", author: "GitHub — DEAP/deap", desc: "General evolutionary computation framework supporting PSO, genetic algorithms, GP, and multi-objective optimization.", url: "https://github.com/DEAP/deap" },
          { type: "code", level: "intermediate", title: "Yarpiz PSO in MATLAB", author: "Yarpiz.com", desc: "Clean, well-commented MATLAB implementations of standard PSO, MOPSO, and binary PSO with visualization.", url: "https://yarpiz.com/440/ytea101-particle-swarm-optimization-pso-in-matlab-video-tutorial" },
        ]
      }
    ]
  },

  /* ── 4  Self-Organization ── */
  {
    id: "selforg",
    icon: "\u25EC",
    label: "Self-Organization",
    intro: `
<p><strong>Self-organization</strong> is the process by which global order arises from local interactions without external direction. It is the engine beneath every swarm: the same principles that create flocking patterns also produce Turing patterns on animal skins, Benard convection cells, and spiral waves in chemical reactions.</p>

<h3>Core Concepts</h3>
<ul>
  <li><strong>Positive feedback</strong> &mdash; amplification of fluctuations (autocatalysis, recruitment)</li>
  <li><strong>Negative feedback</strong> &mdash; stabilisation and saturation (resource depletion, inhibition)</li>
  <li><strong>Amplification + inhibition</strong> &mdash; the Turing instability that generates spatial patterns</li>
  <li><strong>Multiple stable states</strong> &mdash; bistability and symmetry breaking</li>
  <li><strong>Randomness</strong> &mdash; noise as a source of exploration and symmetry-breaking</li>
</ul>

<h3>Connections to Charlotte&rsquo;s Model</h3>
<p>Recursive flocking is a specific instance of self-organization: the three steering rules are local interaction functions, and the flock geometry is the emergent global pattern. Changing rule weights moves the system between ordered (tight flock) and disordered (diffuse swarm) phases&mdash;a phase transition analogous to the Vicsek model.</p>
    `,
    subsections: [
      {
        title: "Foundational Books",
        items: [
          { type: "book", level: "intermediate", title: "The Origins of Order: Self-Organization and Selection in Evolution", author: "Stuart A. Kauffman (1993)", desc: "Kauffman's magnum opus arguing that self-organization, not just natural selection, drives biological complexity. Boolean networks, fitness landscapes, NK models.", url: "https://global.oup.com/academic/product/the-origins-of-order-9780195079517" },
          { type: "book", level: "advanced", title: "A New Kind of Science", author: "Stephen Wolfram (2002)", desc: "Exhaustive exploration of cellular automata and the thesis that simple programs generate the complexity of nature. Controversial but highly influential.", url: "https://www.wolframscience.com/nks/" },
          { type: "book", level: "advanced", title: "Self-Organization in Biological Systems", author: "Camazine, Deneubourg, Franks, Sneyd, Theraulaz & Bonabeau (2001)", desc: "The definitive survey of self-organization in biology: termite mounds, slime molds, fish schools, pattern formation. Rigorous yet accessible.", url: "https://press.princeton.edu/books/paperback/9780691116242/self-organization-in-biological-systems" },
          { type: "book", level: "advanced", title: "Order Out of Chaos: Man's New Dialogue with Nature", author: "Ilya Prigogine & Isabelle Stengers (1984)", desc: "Nobel laureate Prigogine on dissipative structures, irreversibility, and how thermodynamic systems far from equilibrium spontaneously organize.", url: "https://www.penguinrandomhouse.com/books/324437/order-out-of-chaos-by-ilya-prigogine/" },
        ]
      },
      {
        title: "Turing Patterns & Reaction-Diffusion",
        items: [
          { type: "notes", level: "intermediate", title: "The Chemical Basis of Morphogenesis", author: "Alan M. Turing (1952)", desc: "Turing's landmark paper proposing reaction-diffusion as the mechanism for biological pattern formation. Stripes, spots, and spirals from two interacting chemicals.", url: "https://doi.org/10.1098/rstb.1952.0012" },
          { type: "video", level: "beginner", title: "Turing Patterns — 3Blue1Brown Style Explainer", author: "Primer (YouTube)", desc: "Visual, intuitive explanation of how activator-inhibitor dynamics generate patterns at multiple scales.", url: "https://www.youtube.com/results?search_query=turing+patterns+reaction+diffusion+explainer" },
          { type: "code", level: "intermediate", title: "Gray-Scott Reaction-Diffusion Explorer", author: "Karl Sims (karlsims.com)", desc: "Interactive browser simulation of Gray-Scott reaction-diffusion. Tweak feed/kill rates to explore the full parameter space of emergent patterns.", url: "https://www.karlsims.com/rd.html" },
          { type: "code", level: "intermediate", title: "Reaction-Diffusion in WebGL", author: "GitHub — pmneila/jsexp", desc: "GPU-accelerated Gray-Scott simulation running in the browser. Real-time parameter manipulation.", url: "https://github.com/pmneila/jsexp" },
        ]
      },
      {
        title: "Cellular Automata & Autopoiesis",
        items: [
          { type: "book", level: "beginner", title: "Cellular Automata: A Discrete Universe", author: "Andrew Ilachinski (2001)", desc: "Comprehensive treatment of CA theory, including Wolfram classes, Langton's edge of chaos, and applications to physics and biology.", url: "https://www.worldscientific.com/worldscibooks/10.1142/4702" },
          { type: "video", level: "beginner", title: "Coding Challenge — Game of Life", author: "Daniel Shiffman / The Coding Train", desc: "Live-coded Conway's Game of Life in p5.js. Gateway to understanding how local rules create global dynamics.", url: "https://www.youtube.com/watch?v=FWSR_7kZuYg" },
          { type: "book", level: "advanced", title: "Autopoiesis and Cognition: The Realization of the Living", author: "Humberto Maturana & Francisco Varela (1980)", desc: "Introduces autopoiesis: self-producing systems that maintain their own organization. Foundational for enactive cognitive science.", url: "https://link.springer.com/book/10.1007/978-94-009-8947-4" },
          { type: "notes", level: "intermediate", title: "Computation at the Edge of Chaos: Phase Transitions and Emergent Computation", author: "Chris Langton (1990)", desc: "Langton's influential paper arguing that computation is maximized at the boundary between order and chaos in CA.", url: "https://doi.org/10.1016/0167-2789(90)90064-V" },
        ]
      }
    ]
  },

  /* ── 5  Emergence & Complexity ── */
  {
    id: "emergence",
    icon: "\u2B21",
    label: "Emergence & Complexity",
    intro: `
<p><strong>Emergence</strong> occurs when collective behaviour has properties that cannot be predicted from individual components alone. <strong>Complexity science</strong> studies systems poised between order and randomness&mdash;where adaptation, learning, and innovation occur.</p>

<h3>Core Ideas</h3>
<ul>
  <li><strong>Complex Adaptive Systems (CAS)</strong> &mdash; agents interact, adapt, and co-evolve; the system itself learns</li>
  <li><strong>Power laws &amp; scale-free networks</strong> &mdash; many real systems lack a characteristic scale; heavy tails everywhere</li>
  <li><strong>Feedback loops</strong> &mdash; the same positive/negative feedback driving swarms operates in economies, ecosystems, and brains</li>
  <li><strong>Edge of chaos</strong> &mdash; the hypothesis that complex computation occurs at phase transitions</li>
</ul>

<h3>Connection to Swarms</h3>
<p>Every swarm algorithm is a complex adaptive system. The flock is an emergent entity; no single boid &ldquo;knows&rdquo; the flock exists. Charlotte&rsquo;s recursive flocking model is an explicit example: the macro-pattern (flock shape) is not encoded anywhere in the micro-rules (separation, alignment, cohesion).</p>
    `,
    subsections: [
      {
        title: "Essential Books",
        items: [
          { type: "book", level: "beginner", title: "Emergence: The Connected Lives of Ants, Brains, Cities, and Software", author: "Steven Johnson (2001)", desc: "Popular-science introduction to emergence. Slime molds, city neighbourhoods, and software agents as case studies of bottom-up intelligence.", url: "https://www.penguinrandomhouse.com/books/67538/emergence-by-steven-johnson/" },
          { type: "book", level: "intermediate", title: "Hidden Order: How Adaptation Builds Complexity", author: "John H. Holland (1995)", desc: "Holland (inventor of genetic algorithms) on complex adaptive systems: aggregation, tagging, internal models, and building blocks.", url: "https://www.perseusbooksgroup.com/book/hidden-order-9780201442304" },
          { type: "book", level: "intermediate", title: "Complexity: A Guided Tour", author: "Melanie Mitchell (2009)", desc: "Lucid, authoritative survey of complexity science: dynamics, computation, evolution, networks, and the search for universal principles.", url: "https://global.oup.com/academic/product/complexity-9780199798100" },
          { type: "book", level: "intermediate", title: "Linked: The New Science of Networks", author: "Albert-László Barabási (2002)", desc: "Scale-free networks, preferential attachment, and the power-law structure underlying the web, biology, and social systems.", url: "https://www.penguinrandomhouse.com/books/176272/linked-by-albert-laszlo-barabasi/" },
          { type: "book", level: "advanced", title: "The Quark and the Jaguar: Adventures in the Simple and Complex", author: "Murray Gell-Mann (1994)", desc: "Nobel physicist Gell-Mann on the relationship between fundamental simplicity and emergent complexity. A Santa Fe Institute classic.", url: "https://www.penguinrandomhouse.com/books/330790/the-quark-and-the-jaguar-by-murray-gell-mann/" },
        ]
      },
      {
        title: "Santa Fe Institute & Lectures",
        items: [
          { type: "course", level: "beginner", title: "Introduction to Complexity (Complexity Explorer)", author: "Santa Fe Institute / Melanie Mitchell", desc: "Free 10-week MOOC. Dynamics, chaos, fractals, information, self-organization, networks, scaling, evolution. The ideal starting course.", url: "https://www.complexityexplorer.org/courses/introduction-to-complexity" },
          { type: "video", level: "intermediate", title: "Scale-Free Networks — Barabási Lecture", author: "Albert-László Barabási", desc: "Barabási's own lecture on preferential attachment, robustness vs. attack vulnerability, and network science applications.", url: "https://www.youtube.com/results?search_query=barabasi+scale+free+networks+lecture" },
          { type: "video", level: "intermediate", title: "Emergence — How Stupid Things Become Smart Together", author: "Kurzgesagt — In a Nutshell", desc: "Beautifully animated 10-minute primer on emergence: ants, neurons, cells, and how simple rules create intelligent collectives.", url: "https://www.youtube.com/watch?v=16W7c0mb-rE" },
        ]
      },
      {
        title: "Key Papers",
        items: [
          { type: "notes", level: "advanced", title: "More Is Different", author: "P. W. Anderson (Science, 1972)", desc: "Landmark essay arguing that each level of complexity involves genuinely new laws that cannot be reduced to lower levels. The philosophical foundation of emergence.", url: "https://doi.org/10.1126/science.177.4047.393" },
          { type: "notes", level: "advanced", title: "Statistical Mechanics of Complex Networks", author: "Albert & Barabási (Reviews of Modern Physics, 2002)", desc: "Comprehensive review of random graphs, small-world networks, scale-free topology, and dynamical processes on networks.", url: "https://doi.org/10.1103/RevModPhys.74.47" },
          { type: "notes", level: "intermediate", title: "Collective Dynamics of Small-World Networks", author: "Duncan Watts & Steven Strogatz (Nature, 1998)", desc: "Introduces the small-world network model. Shows that a few random long-range links dramatically reduce path length while preserving clustering.", url: "https://doi.org/10.1038/30918" },
        ]
      }
    ]
  },

  /* ── 6  Multi-Agent Systems ── */
  {
    id: "multiagent",
    icon: "\u27C1",
    label: "Multi-Agent Systems",
    intro: `
<p><strong>Multi-Agent Systems (MAS)</strong> study how autonomous agents interact, coordinate, and compete. Where swarm intelligence focuses on simple agents with local rules, MAS encompasses the full spectrum from reactive swarms to deliberative BDI (Belief-Desire-Intention) agents, game-theoretic rational actors, and deep reinforcement learning agents.</p>

<h3>Key Concepts</h3>
<ul>
  <li><strong>Agent architectures</strong> &mdash; reactive (Brooks subsumption), deliberative (BDI), hybrid layered</li>
  <li><strong>Coordination</strong> &mdash; contract net protocol, auction mechanisms, consensus algorithms</li>
  <li><strong>Communication</strong> &mdash; FIPA-ACL, blackboard systems, stigmergy</li>
  <li><strong>Game theory</strong> &mdash; Nash equilibria, mechanism design, social choice in multi-agent settings</li>
  <li><strong>Multi-agent reinforcement learning (MARL)</strong> &mdash; independent learners, centralized training with decentralized execution (CTDE)</li>
</ul>

<h3>Connection to Swarms</h3>
<p>Swarm intelligence is a subfield of MAS where agents are simple and homogeneous. Charlotte&rsquo;s recursive flocking model sits at the reactive end of the MAS spectrum&mdash;but the same coordination problems (consensus, task allocation, collision avoidance) recur at every level of agent sophistication.</p>
    `,
    subsections: [
      {
        title: "Textbooks & References",
        items: [
          { type: "book", level: "intermediate", title: "An Introduction to MultiAgent Systems (2nd ed.)", author: "Michael Wooldridge (2009)", desc: "The standard MAS textbook. Covers agent architectures, communication, coordination, negotiation, and social choice. Clear, well-structured.", url: "https://www.cs.ox.ac.uk/people/michael.wooldridge/pubs/imas/IMAS2e.html" },
          { type: "book", level: "intermediate", title: "Multiagent Systems: Algorithmic, Game-Theoretic, and Logical Foundations", author: "Yoav Shoham & Kevin Leyton-Brown (2008)", desc: "Rigorous treatment of MAS from a game theory and mechanism design perspective. Free PDF available from authors.", url: "http://www.masfoundations.org/" },
          { type: "book", level: "advanced", title: "Multi-Agent Machine Learning: A Reinforcement Learning Approach", author: "H. James Park (2021)", desc: "Covers multi-agent RL algorithms: independent Q-learning, QMIX, MAPPO, communication learning, and emergent behaviour.", url: "https://www.wiley.com/en-us/Multi-Agent+Machine+Learning-p-9781119699033" },
          { type: "notes", level: "intermediate", title: "A Survey of Multi-Agent Reinforcement Learning (MARL)", author: "Gronauer & Diepold (2022)", desc: "Comprehensive survey of MARL: cooperative, competitive, mixed settings. Taxonomy of algorithms and open problems.", url: "https://doi.org/10.1007/s10462-021-09996-w" },
        ]
      },
      {
        title: "Courses & Videos",
        items: [
          { type: "course", level: "intermediate", title: "Multi-Agent Systems (COMP310) — Lecture Notes", author: "University of Liverpool / Michael Wooldridge", desc: "Full university lecture slides covering BDI, STRIPS planning, interaction protocols, argumentation, and voting.", url: "https://www.cs.ox.ac.uk/people/michael.wooldridge/teaching.html" },
          { type: "video", level: "beginner", title: "Multi-Agent Hide & Seek (OpenAI)", author: "OpenAI (YouTube)", desc: "Agents learn emergent tool-use, fort-building, and exploitation strategies through multi-agent competition. A viral demonstration of MARL.", url: "https://www.youtube.com/watch?v=kopoLzvh5jY" },
          { type: "video", level: "intermediate", title: "Game Theory & Multi-Agent RL", author: "David Silver / DeepMind (UCL Lecture)", desc: "David Silver's lecture on game theory fundamentals applied to multi-agent settings. Part of the famous RL course.", url: "https://www.youtube.com/results?search_query=david+silver+game+theory+multi+agent" },
        ]
      },
      {
        title: "Code & Frameworks",
        items: [
          { type: "code", level: "intermediate", title: "PettingZoo — Multi-Agent OpenAI Gym", author: "Farama Foundation", desc: "Standard API for multi-agent reinforcement learning environments. Dozens of built-in games (MPE, Atari, classic). Drop-in replacement for Gym.", url: "https://github.com/Farama-Foundation/PettingZoo" },
          { type: "code", level: "intermediate", title: "JADE — Java Agent DEvelopment Framework", author: "Telecom Italia / JADE Board", desc: "FIPA-compliant agent platform. Industry-standard for building BDI agents with ACL messaging. Mature and well-documented.", url: "https://jade.tilab.com/" },
          { type: "code", level: "advanced", title: "EPyMARL — Extended Python MARL Library", author: "GitHub — uoe-agents/epymarl", desc: "PyTorch MARL library supporting QMIX, MAPPO, MADDPG, and more. Built on top of StarCraft Multi-Agent Challenge (SMAC).", url: "https://github.com/uoe-agents/epymarl" },
        ]
      }
    ]
  },

  /* ── 7  Datasets & Software ── */
  {
    id: "datasets",
    icon: "\u262C",
    label: "Datasets & Software",
    intro: `
<p>Simulation platforms and benchmark datasets are the workbench of swarm intelligence research. This section collects the most widely used <strong>agent-based modelling frameworks</strong>, <strong>multi-agent RL environments</strong>, and <strong>benchmark suites</strong> for testing swarm and collective-behaviour algorithms.</p>

<h3>Choosing a Platform</h3>
<ul>
  <li><strong>NetLogo</strong> &mdash; the gold standard for teaching and prototyping ABM; huge model library; visual and accessible</li>
  <li><strong>Mesa (Python)</strong> &mdash; Pythonic ABM framework; integrates with NumPy/Pandas/matplotlib; good for research pipelines</li>
  <li><strong>MASON (Java)</strong> &mdash; high-performance, discrete-event ABM; used for large-scale simulations</li>
  <li><strong>PettingZoo / Gymnasium</strong> &mdash; standard APIs for multi-agent RL; dozens of environments</li>
  <li><strong>Unity ML-Agents</strong> &mdash; 3D physics-based multi-agent environments with visual observations</li>
</ul>
    `,
    subsections: [
      {
        title: "Agent-Based Modelling Platforms",
        items: [
          { type: "code", level: "beginner", title: "NetLogo", author: "Uri Wilensky / CCL, Northwestern University", desc: "The most widely used ABM platform. Hundreds of built-in models (flocking, ant foraging, segregation, epidemics). Logo-based language; ideal for teaching.", url: "https://ccl.northwestern.edu/netlogo/" },
          { type: "code", level: "intermediate", title: "Mesa — Python Agent-Based Modeling", author: "Project Mesa Contributors", desc: "Pure Python ABM framework. Modular architecture with schedulers, grids, data collectors. Jupyter integration for interactive exploration.", url: "https://github.com/projectmesa/mesa" },
          { type: "code", level: "intermediate", title: "MASON — Multi-Agent Simulator of Neighborhoods", author: "George Mason University", desc: "Fast Java ABM library. Separates model from visualization. Used for large-scale simulations (millions of agents). GeoMASON for GIS integration.", url: "https://cs.gmu.edu/~eclab/projects/mason/" },
          { type: "code", level: "intermediate", title: "Repast Suite (Repast Simphony / Repast4Py)", author: "Argonne National Laboratory", desc: "Mature ABM toolkit. Repast Simphony (Java/Groovy) for desktop; Repast4Py for distributed HPC simulations in Python.", url: "https://repast.github.io/" },
        ]
      },
      {
        title: "Multi-Agent RL Environments",
        items: [
          { type: "code", level: "intermediate", title: "PettingZoo", author: "Farama Foundation", desc: "Standard multi-agent RL API (successor to OpenAI Gym for MARL). Includes MPE, Atari, butterfly, SISL, and classic game environments.", url: "https://pettingzoo.farama.org/" },
          { type: "code", level: "intermediate", title: "OpenAI Multi-Agent Particle Environments (MPE)", author: "OpenAI / Mordatch & Abbeel", desc: "Lightweight 2D multi-agent environments: cooperative navigation, predator-prey, communication. Standard MARL benchmark.", url: "https://github.com/openai/multiagent-particle-envs" },
          { type: "code", level: "advanced", title: "StarCraft Multi-Agent Challenge (SMAC)", author: "WhiRL, University of Oxford", desc: "Cooperative multi-agent benchmark based on StarCraft II micromanagement. De facto standard for evaluating MARL algorithms like QMIX and MAPPO.", url: "https://github.com/oxwhirl/smac" },
          { type: "code", level: "intermediate", title: "Unity ML-Agents Toolkit", author: "Unity Technologies", desc: "Train agents in 3D Unity environments using PPO, SAC, and self-play. Rich observation spaces (visual, ray-cast). Multi-agent support built-in.", url: "https://github.com/Unity-Technologies/ml-agents" },
        ]
      },
      {
        title: "Benchmark Suites & Datasets",
        items: [
          { type: "data", level: "intermediate", title: "TSPLIB — TSP Benchmark Library", author: "University of Heidelberg", desc: "Standard benchmark instances for TSP, ATSP, and VRP. Used to evaluate ACO and other combinatorial optimizers. Includes optimal solutions.", url: "http://comopt.ifi.uni-heidelberg.de/software/TSPLIB95/" },
          { type: "data", level: "intermediate", title: "CEC Benchmark Functions", author: "IEEE Congress on Evolutionary Computation", desc: "Standard benchmark suites (CEC 2005, 2013, 2017, 2022) for evaluating PSO, DE, and other continuous optimizers. Shifted, rotated, composite functions.", url: "https://www.ntu.edu.sg/home/epnsugan/" },
          { type: "data", level: "beginner", title: "NetLogo Models Library — Social & Natural Sciences", author: "CCL, Northwestern University", desc: "400+ ready-to-run NetLogo models spanning flocking, ant foraging, epidemics, traffic, economics, and more. Excellent for exploration and teaching.", url: "https://ccl.northwestern.edu/netlogo/models/" },
          { type: "code", level: "advanced", title: "Swarm Library (Santa Fe Institute legacy)", author: "Santa Fe Institute", desc: "Historic Objective-C ABM library from SFI, one of the first platforms for agent-based simulation. Now largely superseded by Repast and Mesa but historically important.", url: "http://www.swarm.org/wiki/Swarm_main_page" },
        ]
      }
    ]
  }
];

/* ===== Rendering Engine ===== */
const $ = s => document.querySelector(s);
const tabBar   = $("#tab-bar");
const mainArea = $("#main-content");
const searchIn = $("#search-input");
const searchCl = $("#search-clear");
const statEl   = $("#stat-count");

let activeTab    = SECTIONS[0].id;
let activeFilter = "all";
let searchTerm   = "";

/* Count total resources */
const totalResources = SECTIONS.reduce((sum, sec) =>
  sum + sec.subsections.reduce((s2, sub) => s2 + sub.items.length, 0), 0);
statEl.textContent = totalResources;

/* ── Build tabs ── */
SECTIONS.forEach(sec => {
  const btn = document.createElement("button");
  btn.className = "tab-btn" + (sec.id === activeTab ? " active" : "");
  btn.dataset.tab = sec.id;
  btn.innerHTML = `<span class="tab-icon">${sec.icon}</span><span class="tab-label">${sec.label}</span>`;
  btn.addEventListener("click", () => switchTab(sec.id));
  tabBar.appendChild(btn);
});

function switchTab(id) {
  activeTab = id;
  activeFilter = "all";
  tabBar.querySelectorAll(".tab-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.tab === id));
  render();
}

/* ── Search ── */
searchIn.addEventListener("input", () => { searchTerm = searchIn.value.trim().toLowerCase(); render(); });
searchCl.addEventListener("click", () => { searchIn.value = ""; searchTerm = ""; render(); });

/* ── Helpers ── */
function badgeClass(type) {
  const map = { book:"badge-book", notes:"badge-notes", video:"badge-video",
                course:"badge-course", code:"badge-code", data:"badge-data" };
  return map[type] || "badge-notes";
}
function levelClass(lv) {
  return "level-" + lv;
}
function highlight(text) {
  if (!searchTerm) return text;
  const re = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`, "gi");
  return text.replace(re, "<mark>$1</mark>");
}
function matches(item) {
  if (!searchTerm) return true;
  const hay = (item.title + " " + item.author + " " + item.desc + " " + item.type).toLowerCase();
  return hay.includes(searchTerm);
}

/* ── Render ── */
function render() {
  const sec = SECTIONS.find(s => s.id === activeTab);
  if (!sec) return;

  /* Collect unique types for filter bar */
  const types = new Set();
  sec.subsections.forEach(sub => sub.items.forEach(it => types.add(it.type)));

  let html = `<div class="section-header"><h2><span class="section-icon">${sec.icon}</span>${sec.label}</h2></div>`;
  html += `<div class="section-intro">${sec.intro}</div>`;

  /* Filter bar */
  if (types.size > 1) {
    html += `<div class="filter-bar">`;
    html += `<button class="filter-btn${activeFilter==="all"?" active":""}" data-filter="all">All</button>`;
    types.forEach(t => {
      html += `<button class="filter-btn${activeFilter===t?" active":""}" data-filter="${t}">${t.charAt(0).toUpperCase()+t.slice(1)}</button>`;
    });
    html += `</div>`;
  }

  /* Subsections & cards */
  sec.subsections.forEach(sub => {
    const filtered = sub.items.filter(it =>
      (activeFilter === "all" || it.type === activeFilter) && matches(it));
    if (filtered.length === 0) return;

    html += `<div class="subsection"><h3>${sub.title}</h3><div class="card-grid">`;
    filtered.forEach(it => {
      html += `<a class="card" href="${it.url}" target="_blank" rel="noopener noreferrer">
        <div class="card-top">
          <span class="type-badge ${badgeClass(it.type)}">${it.type}</span>
          <span class="level-badge ${levelClass(it.level)}">${it.level}</span>
        </div>
        <div class="card-title">${highlight(it.title)}</div>
        <div class="card-author">${highlight(it.author)}</div>
        <div class="card-desc">${highlight(it.desc)}</div>
      </a>`;
    });
    html += `</div></div>`;
  });

  mainArea.innerHTML = html;

  /* Attach filter listeners */
  mainArea.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      render();
    });
  });
}

/* ── Initial render ── */
render();
