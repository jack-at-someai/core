/* ============================================================
   Cognitive Science Reference Hub
   Maps to Charlotte papers 11 (Harmonic Resonance) & 0 (Synthesis)
   ============================================================ */

const SECTIONS = [
  /* ──────────────────── 0  OVERVIEW ──────────────────── */
  {
    id: "overview",
    icon: "\u25C7",
    label: "Overview",
    intro: `
      <p><strong>Cognitive science</strong> is the interdisciplinary study of mind and intelligence,
      weaving together neuroscience, psychology, linguistics, philosophy, artificial intelligence,
      and anthropology. It asks the deepest questions about how minds perceive, learn, remember,
      reason, and act.</p>

      <h3>Charlotte's Harmonic Resonance Metaphor</h3>
      <p>In Charlotte's Paper 11 (<em>Harmonic Resonance</em>), the brain is conceived as a
      collection of oscillatory nodes&mdash;each tuned to a characteristic frequency. When two
      nodes resonate at the same frequency, information flows between them with minimal loss,
      enabling rapid knowledge transfer and binding. This metaphor unifies predictive coding
      (top-down expectations meeting bottom-up signals), neural oscillations (phase-locked
      assemblies), and memory consolidation (replay during resonant sleep rhythms).</p>

      <h3>Paper 0 &mdash; Synthesis</h3>
      <p>Paper 0 (<em>Synthesis</em>) frames cognition as a multi-scale integration problem:
      molecular signalling, synaptic plasticity, circuit dynamics, whole-brain network states,
      and embodied interaction with the world must all be brought into a single coherent account.
      The resources collected here span every level of that hierarchy.</p>

      <ul>
        <li><strong>Predictive Coding</strong> &mdash; the brain as a prediction machine</li>
        <li><strong>Neural Oscillations</strong> &mdash; rhythmic coordination of neural populations</li>
        <li><strong>Bayesian Brain</strong> &mdash; probabilistic inference under uncertainty</li>
        <li><strong>Embodied Cognition</strong> &mdash; mind shaped by body and environment</li>
        <li><strong>Memory &amp; Resonance</strong> &mdash; consolidation, replay, and adaptive resonance</li>
        <li><strong>Consciousness</strong> &mdash; integrated information, global workspace, higher-order theories</li>
      </ul>
    `,
    subsections: [
      {
        title: "Foundational Texts",
        items: [
          { title: "The MIT Encyclopedia of Cognitive Sciences", author: "Wilson & Keil (Eds.)", type: "book", level: "beginner", url: "https://mitpress.mit.edu/9780262731447/the-mit-encyclopedia-of-the-cognitive-sciences/", desc: "Comprehensive A-Z reference covering every major topic in cognitive science, from attention to working memory." },
          { title: "Cognitive Science: An Introduction to the Study of Mind", author: "Jay Friedenberg & Gordon Silverman", type: "book", level: "beginner", url: "https://us.sagepub.com/en-us/nam/cognitive-science/book253955", desc: "Widely-used undergraduate textbook covering perception, memory, language, and computational modeling." },
          { title: "Mind: Introduction to Cognitive Science (2nd Ed.)", author: "Paul Thagard", type: "book", level: "beginner", url: "https://mitpress.mit.edu/9780262701099/mind/", desc: "Concise introduction comparing representational approaches: logic, rules, concepts, analogies, images, neural networks." },
          { title: "How the Mind Works", author: "Steven Pinker", type: "book", level: "beginner", url: "https://www.penguinrandomhouse.com/books/159918/how-the-mind-works-by-steven-pinker/", desc: "Evolutionary psychology meets computational theory of mind; an accessible tour of cognitive architecture." },
          { title: "The Cambridge Handbook of Cognitive Science", author: "Frankish & Ramsey (Eds.)", type: "book", level: "intermediate", url: "https://www.cambridge.org/core/books/cambridge-handbook-of-cognitive-science/32F1B7E4A0703A228AE9B7D554B2B57A", desc: "Authoritative survey of current debates in cognitive science including embodiment, consciousness, and modularity." }
        ]
      },
      {
        title: "Lectures & Courses",
        items: [
          { title: "MIT 9.00SC Introduction to Psychology", author: "MIT OpenCourseWare", type: "course", level: "beginner", url: "https://ocw.mit.edu/courses/9-00sc-introduction-to-psychology-fall-2011/", desc: "Full MIT course covering perception, cognition, emotion, and development with video lectures and problem sets." },
          { title: "Cognitive Science: A Multidisciplinary Introduction (Coursera)", author: "University of Toronto", type: "course", level: "beginner", url: "https://www.coursera.org/learn/cognitive-science", desc: "Broad introduction to cognitive science spanning AI, neuroscience, psychology, and philosophy." },
          { title: "The Computational Brain (Stanford Encyclopedia)", author: "SEP / Gualtiero Piccinini", type: "notes", level: "intermediate", url: "https://plato.stanford.edu/entries/computational-mind/", desc: "Rigorous philosophical overview of the computational theory of mind and its variants." },
          { title: "Neuroscience Online — UTHealth", author: "UT Houston", type: "course", level: "intermediate", url: "https://nba.uth.tmc.edu/neuroscience/", desc: "Free open-access neuroscience textbook with rich multimedia covering cellular, systems, and cognitive neuroscience." }
        ]
      },
      {
        title: "Cross-Disciplinary Resources",
        items: [
          { title: "Surfing Uncertainty: Prediction, Action, and the Embodied Mind", author: "Andy Clark", type: "book", level: "intermediate", url: "https://global.oup.com/academic/product/surfing-uncertainty-9780190217013", desc: "A bridge between predictive coding, embodied cognition, and philosophy of mind by one of the field's most influential thinkers." },
          { title: "The Brain from Inside Out", author: "Gyorgy Buzsaki", type: "book", level: "advanced", url: "https://global.oup.com/academic/product/the-brain-from-inside-out-9780190905385", desc: "Buzsaki argues the brain is not a passive input-output device but an active, self-organized explorer of the world." },
          { title: "Cognitive Science Society — Annual Conference Proceedings", author: "CogSci Society", type: "notes", level: "advanced", url: "https://cognitivesciencesociety.org/past-conferences/", desc: "Archive of proceedings from the premier interdisciplinary cognitive science conference." }
        ]
      }
    ]
  },

  /* ──────────────────── 1  PREDICTIVE CODING ──────────────────── */
  {
    id: "predictive",
    icon: "\u2283",
    label: "Predictive Coding",
    intro: `
      <p><strong>Predictive coding</strong> (also called predictive processing) proposes that the brain
      constantly generates top-down predictions about incoming sensory input and only propagates
      the <em>prediction errors</em>&mdash;the mismatch between expectation and reality. This
      error-driven updating is at the heart of perception, action, attention, and learning.</p>

      <h3>Key Principles</h3>
      <ul>
        <li><strong>Hierarchical generative model</strong> &mdash; each cortical level predicts activity at the level below</li>
        <li><strong>Prediction error minimisation</strong> &mdash; the brain minimises surprise (free energy) by updating its model or acting on the world</li>
        <li><strong>Precision weighting</strong> &mdash; the brain modulates the gain on prediction errors depending on their estimated reliability</li>
      </ul>

      <h3>Connection to Harmonic Resonance</h3>
      <p>In Charlotte's framework, predictive signals travel along resonant channels: when a
      generative model "tunes in" to the correct oscillatory frequency, prediction errors
      propagate efficiently via phase-locked gamma bursts, while stable predictions suppress
      neural activity through alpha-band inhibition.</p>
    `,
    subsections: [
      {
        title: "Seminal Papers",
        items: [
          { title: "Predictive coding in the visual cortex", author: "Rao & Ballard (1999)", type: "notes", level: "advanced", url: "https://www.nature.com/articles/nn0199_79", desc: "The landmark computational model showing how hierarchical prediction and error correction explains extra-classical receptive field effects in V1." },
          { title: "A free energy principle for the brain", author: "Karl Friston (2005)", type: "notes", level: "advanced", url: "https://www.sciencedirect.com/science/article/pii/S0022249605000828", desc: "Friston's foundational paper unifying perception, learning, and action under the variational free energy principle." },
          { title: "Whatever next? Predictive brains, situated agents, and the future of cognitive science", author: "Andy Clark (2013)", type: "notes", level: "intermediate", url: "https://doi.org/10.1017/S0140525X12000477", desc: "Influential BBS target article arguing that predictive processing is the unifying framework for understanding mind, brain, and behavior." },
          { title: "The free-energy principle: a unified brain theory?", author: "Karl Friston (2010)", type: "notes", level: "advanced", url: "https://www.nature.com/articles/nrn2787", desc: "Nature Reviews Neuroscience piece positioning free energy as the single imperative behind all neural computation." }
        ]
      },
      {
        title: "Books & Monographs",
        items: [
          { title: "Surfing Uncertainty", author: "Andy Clark", type: "book", level: "intermediate", url: "https://global.oup.com/academic/product/surfing-uncertainty-9780190217013", desc: "Book-length treatment of the predictive processing paradigm, linking it to embodied cognition, attention, and consciousness." },
          { title: "The Experience Machine: How Our Minds Predict and Shape Reality", author: "Andy Clark", type: "book", level: "beginner", url: "https://www.penguinrandomhouse.com/books/717971/the-experience-machine-by-andy-clark/", desc: "Clark's accessible 2023 popular-science book on how the brain constructs experience through prediction." },
          { title: "Active Inference: The Free Energy Principle in Mind, Brain, and Behavior", author: "Thomas Parr, Giovanni Pezzulo & Karl Friston", type: "book", level: "advanced", url: "https://mitpress.mit.edu/9780262045353/active-inference/", desc: "Comprehensive textbook on active inference, covering mathematical foundations, neuroscience, and applications." }
        ]
      },
      {
        title: "Lectures & Tutorials",
        items: [
          { title: "Karl Friston: The Free Energy Principle (MLSS)", author: "Karl Friston", type: "video", level: "advanced", url: "https://www.youtube.com/watch?v=NIu_dJGyIQI", desc: "Friston's own tutorial lecture on the free energy principle, variational inference, and active inference." },
          { title: "Predictive Processing — Anil Seth (Royal Institution)", author: "Anil Seth", type: "video", level: "beginner", url: "https://www.youtube.com/watch?v=lyu7v7nWzfo", desc: "Engaging public lecture on how the brain constructs reality through controlled hallucination and prediction." },
          { title: "Predictive Coding: A Tutorial (Bogacz 2017)", author: "Rafal Bogacz", type: "notes", level: "intermediate", url: "https://doi.org/10.1016/j.jmp.2015.11.003", desc: "Step-by-step mathematical tutorial deriving predictive coding from first principles, highly cited pedagogical resource." }
        ]
      }
    ]
  },

  /* ──────────────────── 2  NEURAL OSCILLATIONS ──────────────────── */
  {
    id: "oscillations",
    icon: "\u223F",
    label: "Neural Oscillations",
    intro: `
      <p><strong>Neural oscillations</strong> are rhythmic fluctuations in the electrical activity of
      neuronal populations. They span frequencies from sub-hertz infra-slow oscillations to
      ultra-fast ripples above 200 Hz, and they coordinate information processing across brain
      regions.</p>

      <h3>Canonical Frequency Bands</h3>
      <ul>
        <li><strong>Delta (0.5&ndash;4 Hz)</strong> &mdash; deep sleep, cortical silence</li>
        <li><strong>Theta (4&ndash;8 Hz)</strong> &mdash; navigation, episodic memory, hippocampal sequences</li>
        <li><strong>Alpha (8&ndash;13 Hz)</strong> &mdash; idling, inhibition, attentional gating</li>
        <li><strong>Beta (13&ndash;30 Hz)</strong> &mdash; motor planning, status quo maintenance</li>
        <li><strong>Gamma (30&ndash;100+ Hz)</strong> &mdash; perceptual binding, working memory, consciousness</li>
      </ul>

      <h3>Harmonic Resonance (Charlotte Paper 11)</h3>
      <p>Charlotte's harmonic resonance model proposes that cross-frequency coupling&mdash;especially
      theta-gamma phase-amplitude coupling&mdash;is the mechanism by which distributed neural
      assemblies bind into coherent representations. Nodes that oscillate at harmonically
      related frequencies (e.g., gamma nested within theta) form transient resonant networks
      that enable flexible routing of information.</p>
    `,
    subsections: [
      {
        title: "Core References",
        items: [
          { title: "Rhythms of the Brain", author: "Gyorgy Buzsaki", type: "book", level: "intermediate", url: "https://global.oup.com/academic/product/rhythms-of-the-brain-9780195301069", desc: "The definitive monograph on neural oscillations: from single neurons to large-scale brain dynamics, by the field's leading figure." },
          { title: "Neuronal oscillations in cortical networks", author: "Buzsaki & Draguhn (2004)", type: "notes", level: "advanced", url: "https://doi.org/10.1126/science.1099745", desc: "Science review explaining how oscillatory frequency bands emerge from network architecture and support cognitive functions." },
          { title: "Dynamic predictions: Oscillations and synchrony in top-down processing", author: "Engel, Fries & Singer (2001)", type: "notes", level: "advanced", url: "https://doi.org/10.1038/35094565", desc: "Influential Nature Reviews Neuroscience paper on how oscillatory synchrony implements top-down predictions." },
          { title: "A mechanism for cognitive dynamics: neuronal communication through neuronal coherence", author: "Pascal Fries (2005)", type: "notes", level: "advanced", url: "https://doi.org/10.1016/j.tics.2005.08.011", desc: "Communication Through Coherence (CTC) hypothesis: effective connectivity depends on phase-synchronization between oscillating populations." }
        ]
      },
      {
        title: "Cross-Frequency Coupling & Phase Coding",
        items: [
          { title: "Theta-gamma coupling in hippocampus during memory encoding", author: "Tort et al. (2009)", type: "notes", level: "advanced", url: "https://doi.org/10.1073/pnas.0911331106", desc: "Demonstrates that theta-gamma phase-amplitude coupling in hippocampus predicts successful memory encoding in rodents." },
          { title: "Phase-amplitude coupling and working memory capacity", author: "Axmacher et al. (2010)", type: "notes", level: "advanced", url: "https://doi.org/10.1523/JNEUROSCI.1871-10.2010", desc: "Human intracranial EEG study linking theta-gamma coupling strength to individual differences in working memory capacity." },
          { title: "Hippocampal theta oscillations: from single cells to networks", author: "Colgin (2013)", type: "notes", level: "intermediate", url: "https://doi.org/10.1016/j.conb.2013.01.004", desc: "Review of theta oscillation generation, function, and interaction with gamma oscillations in memory and navigation." },
          { title: "Phase coding by grid cells in the hippocampal formation", author: "Hafting et al. (2008)", type: "notes", level: "advanced", url: "https://doi.org/10.1038/nature06957", desc: "Nature paper demonstrating theta phase precession in entorhinal grid cells, linking oscillations to spatial cognition." }
        ]
      },
      {
        title: "Tutorials & Practical Resources",
        items: [
          { title: "Analyzing Neural Time Series Data (ANTS)", author: "Mike X Cohen", type: "book", level: "intermediate", url: "https://mitpress.mit.edu/9780262019873/analyzing-neural-time-series-data/", desc: "The go-to practical textbook for time-frequency analysis, coherence, and oscillatory connectivity in EEG/MEG data." },
          { title: "Mike X Cohen's Lecture Series on Neural Signal Processing", author: "Mike X Cohen", type: "video", level: "intermediate", url: "https://www.youtube.com/channel/UCUR_LsXk7IYyueSnXcNextQ", desc: "YouTube channel with extensive tutorials on Fourier analysis, wavelets, connectivity, and oscillatory dynamics." },
          { title: "FieldTrip Toolbox for MEG/EEG Analysis", author: "Donders Institute", type: "code", level: "intermediate", url: "https://www.fieldtriptoolbox.org/", desc: "Open-source MATLAB toolbox for advanced analysis of MEG, EEG, and intracranial data including time-frequency and connectivity." },
          { title: "MNE-Python: MEG + EEG Analysis in Python", author: "Gramfort et al.", type: "code", level: "intermediate", url: "https://mne.tools/stable/index.html", desc: "Comprehensive Python package for processing, analyzing, and visualizing neurophysiological data with excellent documentation." }
        ]
      }
    ]
  },

  /* ──────────────────── 3  BAYESIAN BRAIN ──────────────────── */
  {
    id: "bayesian",
    icon: "\u22A8",
    label: "Bayesian Brain",
    intro: `
      <p>The <strong>Bayesian brain</strong> hypothesis holds that the nervous system performs
      approximate probabilistic (Bayesian) inference: combining prior beliefs with incoming
      sensory evidence (likelihoods) to form posterior estimates of the state of the world.
      This framework accounts for perceptual illusions, multisensory integration, motor
      planning, and decision-making under uncertainty.</p>

      <h3>Core Ideas</h3>
      <ul>
        <li><strong>Prior &times; Likelihood &prop; Posterior</strong> &mdash; Bayes' rule as the fundamental computation</li>
        <li><strong>Uncertainty representation</strong> &mdash; the brain maintains probability distributions, not point estimates</li>
        <li><strong>Kalman filtering</strong> &mdash; sequential Bayesian updating for tracking dynamic states</li>
        <li><strong>Bayesian decision theory</strong> &mdash; optimal actions minimise expected loss given posterior beliefs</li>
      </ul>

      <h3>Resonance &amp; Bayesian Inference</h3>
      <p>Charlotte's synthesis (Paper 0) frames Bayesian updating as a resonance phenomenon:
      the prior is a standing oscillatory pattern; incoming evidence modulates phase and
      amplitude; the posterior emerges when these signals constructively interfere. Precision
      weighting maps onto oscillatory gain control (alpha suppression = low precision;
      gamma amplification = high precision).</p>
    `,
    subsections: [
      {
        title: "Foundational Papers",
        items: [
          { title: "Bayesian integration in sensorimotor learning", author: "Kording & Wolpert (2004)", type: "notes", level: "advanced", url: "https://doi.org/10.1038/nature03169", desc: "Nature paper demonstrating that humans combine prior knowledge and sensory information in a statistically optimal (Bayesian) way during reaching." },
          { title: "Perception as Bayesian Inference", author: "Knill & Pouget (2004)", type: "notes", level: "advanced", url: "https://doi.org/10.1016/j.tics.2004.05.004", desc: "Influential TICS review arguing that Bayesian inference provides the unifying computational framework for understanding perception." },
          { title: "Bayesian approaches to brain function", author: "Doya, Ishii, Pouget & Rao (Eds.)", type: "book", level: "advanced", url: "https://mitpress.mit.edu/9780262042383/bayesian-brain/", desc: "Edited volume collecting key perspectives on probabilistic computation in neural circuits, decision-making, and motor control." },
          { title: "The Bayesian brain: the role of uncertainty in neural coding and computation", author: "Knill & Pouget (2004)", type: "notes", level: "intermediate", url: "https://doi.org/10.1016/j.tins.2004.10.007", desc: "TINS review on how neural populations might encode probability distributions and perform Bayesian inference." }
        ]
      },
      {
        title: "Multisensory Integration & Cue Combination",
        items: [
          { title: "Optimal multisensory integration (Ernst & Banks 2002)", author: "Ernst & Banks", type: "notes", level: "intermediate", url: "https://doi.org/10.1038/nature00694", desc: "Classic Nature paper showing that humans combine visual and haptic cues in a statistically optimal, reliability-weighted manner." },
          { title: "Humans integrate visual and haptic information in a statistically optimal fashion", author: "Alais & Burr (2004)", type: "notes", level: "intermediate", url: "https://doi.org/10.1016/j.cub.2003.12.033", desc: "Demonstrates Bayesian cue combination in audio-visual spatial localisation, extending the optimal integration framework." },
          { title: "Causal inference in multisensory perception", author: "Kording et al. (2007)", type: "notes", level: "advanced", url: "https://doi.org/10.1371/journal.pone.0000943", desc: "Bayesian causal inference model explaining how the brain decides whether to integrate or segregate multisensory signals." }
        ]
      },
      {
        title: "Computational Tutorials & Tools",
        items: [
          { title: "Bayesian Reasoning and Machine Learning", author: "David Barber", type: "book", level: "intermediate", url: "http://www.cs.ucl.ac.uk/staff/d.barber/brml/", desc: "Free online textbook covering graphical models, inference algorithms, and connections to neural computation." },
          { title: "Probabilistic Models of Cognition (probmods.org)", author: "Goodman & Tenenbaum", type: "course", level: "intermediate", url: "https://probmods.org/", desc: "Interactive online textbook using WebPPL to teach probabilistic models of cognition, from perception to language." },
          { title: "Stan: Statistical Modeling Platform", author: "Stan Development Team", type: "code", level: "intermediate", url: "https://mc-stan.org/", desc: "State-of-the-art probabilistic programming framework for Bayesian inference with interfaces to R, Python, and Julia." },
          { title: "Bayesian Cognitive Modeling: A Practical Course", author: "Lee & Wagenmakers", type: "book", level: "intermediate", url: "https://bayesmodels.com/", desc: "Hands-on textbook teaching Bayesian cognitive modeling with worked examples in JAGS/WinBUGS." }
        ]
      }
    ]
  },

  /* ──────────────────── 4  EMBODIED COGNITION ──────────────────── */
  {
    id: "embodied",
    icon: "\u2295",
    label: "Embodied Cognition",
    intro: `
      <p><strong>Embodied cognition</strong> is the thesis that cognitive processes are deeply shaped
      by the body's interactions with the world. Rather than the brain being an isolated
      computer manipulating abstract symbols, thinking emerges from sensorimotor engagement
      with the environment.</p>

      <h3>Key Frameworks</h3>
      <ul>
        <li><strong>Enactivism</strong> (Varela, Thompson, Rosch) &mdash; cognition is enacted through a history of structural coupling between organism and environment</li>
        <li><strong>Situated cognition</strong> &mdash; thought is inseparable from the physical and social context in which it occurs</li>
        <li><strong>Affordances</strong> (Gibson) &mdash; the environment offers action possibilities that the agent directly perceives</li>
        <li><strong>Sensorimotor contingency theory</strong> (O'Regan & Noe) &mdash; perception is mastery of the laws governing sensory change during action</li>
        <li><strong>Extended mind</strong> (Clark & Chalmers) &mdash; cognitive processes can extend beyond the skull into tools and environment</li>
      </ul>

      <h3>Embodiment Meets Resonance</h3>
      <p>Charlotte's synthesis frames embodied cognition through harmonic resonance: the body's
      sensorimotor rhythms (gait cycles, saccade sequences, respiration) entrain neural
      oscillations, creating resonant loops between brain, body, and world that ground
      abstract cognition in physical action.</p>
    `,
    subsections: [
      {
        title: "Classic Texts",
        items: [
          { title: "The Embodied Mind: Cognitive Science and Human Experience", author: "Varela, Thompson & Rosch", type: "book", level: "intermediate", url: "https://mitpress.mit.edu/9780262529365/the-embodied-mind/", desc: "Founding text of enactivism, bridging cognitive science and phenomenology. Argues cognition arises from embodied action." },
          { title: "Philosophy in the Flesh", author: "George Lakoff & Mark Johnson", type: "book", level: "intermediate", url: "https://www.basicbooks.com/titles/george-lakoff/philosophy-in-the-flesh/9780465056743/", desc: "Argues that abstract thought is fundamentally metaphorical and grounded in bodily experience." },
          { title: "Being There: Putting Brain, Body, and World Together Again", author: "Andy Clark", type: "book", level: "beginner", url: "https://mitpress.mit.edu/9780262531566/being-there/", desc: "Clark's influential argument for situated, embodied, and dynamical approaches to cognitive science." },
          { title: "The Ecological Approach to Visual Perception", author: "James J. Gibson", type: "book", level: "intermediate", url: "https://www.routledge.com/The-Ecological-Approach-to-Visual-Perception/Gibson/p/book/9781848725782", desc: "Gibson's masterwork introducing affordances, optic flow, and direct perception. A paradigm-defining text." },
          { title: "Supersizing the Mind: Embodiment, Action, and Cognitive Extension", author: "Andy Clark", type: "book", level: "intermediate", url: "https://global.oup.com/academic/product/supersizing-the-mind-9780195333213", desc: "Extended mind thesis developed in full, arguing tools, language, and social structures are part of the cognitive system." }
        ]
      },
      {
        title: "Key Papers",
        items: [
          { title: "The Extended Mind", author: "Clark & Chalmers (1998)", type: "notes", level: "intermediate", url: "https://doi.org/10.1093/analys/58.1.7", desc: "The original paper proposing that cognitive processes can extend beyond the biological brain into the environment." },
          { title: "Sensorimotor contingencies and perceptual experience", author: "O'Regan & Noe (2001)", type: "notes", level: "advanced", url: "https://doi.org/10.1017/S0140525X01000115", desc: "BBS target article proposing that perception is constituted by practical knowledge of sensorimotor contingencies." },
          { title: "How the body shapes the mind", author: "Shaun Gallagher", type: "book", level: "advanced", url: "https://global.oup.com/academic/product/how-the-body-shapes-the-mind-9780199271948", desc: "Systematic philosophical treatment of body schema, body image, and their role in shaping cognitive processes." }
        ]
      },
      {
        title: "Lectures & Courses",
        items: [
          { title: "Embodied Cognition (Stanford Encyclopedia)", author: "SEP / Robert Wilson & Lucia Foglia", type: "notes", level: "beginner", url: "https://plato.stanford.edu/entries/embodied-cognition/", desc: "Authoritative philosophical overview of the embodied cognition research programme, its varieties, and critiques." },
          { title: "4E Cognition: Embodied, Embedded, Enacted, Extended", author: "Various lecturers", type: "video", level: "intermediate", url: "https://www.youtube.com/results?search_query=4E+cognition+lecture", desc: "Collection of lectures covering the four E's of cognition: embodied, embedded, enacted, and extended." },
          { title: "Radical Embodied Cognitive Science", author: "Anthony Chemero", type: "book", level: "advanced", url: "https://mitpress.mit.edu/9780262516471/radical-embodied-cognitive-science/", desc: "Argues for a non-representational, dynamical-systems approach to embodied cognition, drawing on Gibson and phenomenology." }
        ]
      }
    ]
  },

  /* ──────────────────── 5  MEMORY & RESONANCE ──────────────────── */
  {
    id: "memory",
    icon: "\u25C8",
    label: "Memory & Resonance",
    intro: `
      <p><strong>Memory</strong> is central to cognition, and its neural mechanisms involve
      oscillatory dynamics at every stage&mdash;from encoding through consolidation to retrieval.
      <strong>Resonance theories</strong> propose that memory traces are stored and recalled via
      standing patterns of oscillatory activity that resonate when reactivated.</p>

      <h3>Key Mechanisms</h3>
      <ul>
        <li><strong>Hippocampal replay</strong> &mdash; compressed reactivation of waking sequences during sleep sharp-wave ripples</li>
        <li><strong>Systems consolidation</strong> &mdash; gradual transfer of memory traces from hippocampus to neocortex</li>
        <li><strong>Adaptive Resonance Theory (ART)</strong> &mdash; Grossberg's neural network theory of how the brain self-organises stable category representations through resonant matching</li>
        <li><strong>Theta-gamma coding</strong> &mdash; multi-item working memory maintained via gamma cycles nested within theta periods</li>
      </ul>

      <h3>Charlotte's Resonance Framework</h3>
      <p>Paper 11 explicitly builds on ART and hippocampal resonance: memory encoding occurs
      when bottom-up input and top-down expectation achieve harmonic resonance (constructive
      interference at matched frequencies). Failed matches produce adaptive search&mdash;the
      system explores new attractor states until resonance is achieved.</p>
    `,
    subsections: [
      {
        title: "Adaptive Resonance Theory",
        items: [
          { title: "Adaptive Resonance Theory: How a brain learns to consciously attend, learn, and recognize a changing world", author: "Stephen Grossberg (2013)", type: "notes", level: "advanced", url: "https://doi.org/10.1016/j.neunet.2012.09.017", desc: "Grossberg's comprehensive review of ART covering its neural architecture, vigilance parameter, and applications to attention and learning." },
          { title: "Neural Networks and Natural Intelligence", author: "Stephen Grossberg", type: "book", level: "advanced", url: "https://mitpress.mit.edu/9780262071055/neural-networks-and-natural-intelligence/", desc: "Foundational collection of Grossberg's work on ART, competitive learning, and resonant neural dynamics." },
          { title: "A neural model of attention and memory in the hippocampus (ART + hippocampus)", author: "Grossberg & Versace (2008)", type: "notes", level: "advanced", url: "https://doi.org/10.1016/j.neunet.2007.09.002", desc: "Extends ART to hippocampal memory circuits, modelling how resonant matching drives encoding and retrieval." }
        ]
      },
      {
        title: "Memory Consolidation & Replay",
        items: [
          { title: "Memory consolidation during sleep: a form of brain restitution", author: "Diekelmann & Born (2010)", type: "notes", level: "intermediate", url: "https://doi.org/10.1016/j.neubiorev.2009.05.001", desc: "Major review of how sleep-dependent replay consolidates declarative and procedural memories." },
          { title: "Hippocampal sharp-wave ripples and memory replay", author: "Buzsaki (2015)", type: "notes", level: "advanced", url: "https://doi.org/10.1126/science.1217230", desc: "Science review on sharp-wave ripples as the key mechanism for offline memory consolidation and planning." },
          { title: "Memory, Amnesia, and the Hippocampal System", author: "Nadel & Moscovitch (1997)", type: "notes", level: "intermediate", url: "https://doi.org/10.1002/(SICI)1098-1063(1997)7:2<130::AID-HIPO2>3.0.CO;2-M", desc: "The Multiple Trace Theory proposing that hippocampus is always needed for episodic memory retrieval, not just consolidation." },
          { title: "Cognitive and Neural Mechanisms of Memory", author: "Howard Eichenbaum", type: "book", level: "intermediate", url: "https://global.oup.com/academic/product/the-cognitive-neuroscience-of-memory-9780199778614", desc: "Comprehensive textbook covering hippocampal anatomy, relational memory, and systems consolidation." }
        ]
      },
      {
        title: "Working Memory & Oscillatory Coding",
        items: [
          { title: "Working memory capacity as controlled attention", author: "Engle (2002)", type: "notes", level: "intermediate", url: "https://doi.org/10.1111/1467-8721.00167", desc: "Influential framework linking working memory capacity to executive attention control." },
          { title: "Theta-gamma neural code for memory", author: "Lisman & Jensen (2013)", type: "notes", level: "advanced", url: "https://doi.org/10.1016/j.neuron.2013.03.007", desc: "Detailed model of how multiple items are maintained in working memory via gamma cycles nested within theta oscillations." },
          { title: "The role of neural oscillations in memory processes", author: "Hanslmayr et al. (2016)", type: "notes", level: "intermediate", url: "https://doi.org/10.1016/j.coph.2015.09.004", desc: "Review unifying oscillatory correlates of encoding (desynchronisation) and retrieval (synchronisation) in human memory." }
        ]
      }
    ]
  },

  /* ──────────────────── 6  CONSCIOUSNESS ──────────────────── */
  {
    id: "consciousness",
    icon: "\u25C9",
    label: "Consciousness",
    intro: `
      <p><strong>Consciousness studies</strong> investigate the nature of subjective experience&mdash;
      the "hard problem" of why and how physical brain processes give rise to phenomenal
      awareness. Several major theories compete to explain what makes a neural process
      conscious.</p>

      <h3>Major Theories</h3>
      <ul>
        <li><strong>Integrated Information Theory (IIT)</strong> (Tononi) &mdash; consciousness corresponds to integrated information (&Phi;) in a system</li>
        <li><strong>Global Workspace Theory (GWT)</strong> (Baars, Dehaene) &mdash; conscious content is information broadcast globally across cortical networks</li>
        <li><strong>Higher-Order Theories</strong> (Rosenthal, Lau) &mdash; a state is conscious when there is a higher-order representation of being in that state</li>
        <li><strong>Recurrent Processing Theory</strong> (Lamme) &mdash; consciousness requires recurrent processing in sensory cortex</li>
        <li><strong>Orchestrated Objective Reduction</strong> (Penrose & Hameroff) &mdash; quantum coherence in microtubules underlies conscious experience</li>
      </ul>

      <h3>Consciousness &amp; Resonance</h3>
      <p>Charlotte's harmonic resonance model connects to consciousness through the idea that
      conscious states correspond to globally resonant patterns&mdash;when distributed neural
      assemblies achieve coherent oscillatory binding, integrated information rises above a
      threshold, creating a unified phenomenal experience.</p>
    `,
    subsections: [
      {
        title: "Integrated Information Theory",
        items: [
          { title: "Integrated information theory of consciousness: an updated account", author: "Tononi (2012)", type: "notes", level: "advanced", url: "https://doi.org/10.1007/s10439-012-0658-0", desc: "Tononi's updated formulation of IIT (version 3.0) with the mathematical framework for computing integrated information." },
          { title: "Consciousness: Here, There and Everywhere?", author: "Tononi & Koch (2015)", type: "notes", level: "intermediate", url: "https://doi.org/10.1098/rstb.2014.0167", desc: "Accessible overview of IIT's postulates and their implications, including why it predicts consciousness in some surprising systems." },
          { title: "Phi: A Voyage from the Brain to the Soul", author: "Giulio Tononi", type: "book", level: "beginner", url: "https://www.penguinrandomhouse.com/books/315649/phi-by-giulio-tononi/", desc: "Tononi's literary-scientific exploration of IIT through Galilean dialogues, blending neuroscience with art and philosophy." }
        ]
      },
      {
        title: "Global Workspace & Higher-Order Theories",
        items: [
          { title: "Consciousness and the Brain: Deciphering How the Brain Codes Our Thoughts", author: "Stanislas Dehaene", type: "book", level: "beginner", url: "https://www.penguinrandomhouse.com/books/233932/consciousness-and-the-brain-by-stanislas-dehaene/", desc: "Dehaene's accessible account of Global Neuronal Workspace theory with rich experimental evidence from masking and brain imaging." },
          { title: "A Cognitive Theory of Consciousness", author: "Bernard Baars", type: "book", level: "intermediate", url: "https://www.cambridge.org/core/books/cognitive-theory-of-consciousness/AE55D019D72E71C6F2695E994E6B2B39", desc: "The original formulation of Global Workspace Theory, proposing consciousness as a broadcast mechanism for cognitive access." },
          { title: "Consciousness without a cerebral cortex: A challenge for neuroscience and medicine", author: "Bjorn Merker (2007)", type: "notes", level: "advanced", url: "https://doi.org/10.1017/S0140525X07000891", desc: "Provocative BBS paper arguing that subcortical structures can support basic forms of consciousness." },
          { title: "The neural correlates of consciousness: an update", author: "Christof Koch et al. (2016)", type: "notes", level: "intermediate", url: "https://doi.org/10.1111/nyas.13171", desc: "Comprehensive review of NCC research including the distinction between full, content, and background NCC." }
        ]
      },
      {
        title: "Philosophical & Popular Works",
        items: [
          { title: "The Conscious Mind: In Search of a Fundamental Theory", author: "David Chalmers", type: "book", level: "intermediate", url: "https://global.oup.com/academic/product/the-conscious-mind-9780195117899", desc: "Chalmers' landmark work introducing the hard problem of consciousness and defending property dualism." },
          { title: "Being You: A New Science of Consciousness", author: "Anil Seth", type: "book", level: "beginner", url: "https://www.penguinrandomhouse.com/books/600300/being-you-by-anil-seth/", desc: "Seth's bestselling 2021 book connecting predictive processing to consciousness through the concept of controlled hallucination." },
          { title: "Consciousness Explained", author: "Daniel Dennett", type: "book", level: "intermediate", url: "https://www.hachettebookgroup.com/titles/daniel-c-dennett/consciousness-explained/9780316180665/", desc: "Dennett's influential eliminativist-functionalist account of consciousness, rejecting the Cartesian Theatre." },
          { title: "Other Minds: The Octopus, the Sea, and the Deep Origins of Consciousness", author: "Peter Godfrey-Smith", type: "book", level: "beginner", url: "https://us.macmillan.com/books/9780374537197/otherminds", desc: "Philosophical exploration of consciousness through cephalopod cognition, asking what it is like to be an octopus." }
        ]
      }
    ]
  },

  /* ──────────────────── 7  DATASETS & SOFTWARE ──────────────────── */
  {
    id: "datasets",
    icon: "\u262C",
    label: "Datasets & Software",
    intro: `
      <p>Cognitive science increasingly relies on <strong>computational modeling</strong> and
      <strong>large-scale datasets</strong> to test theories. This section collects the most
      important software frameworks for cognitive architecture simulation, neural data analysis,
      and brain imaging datasets.</p>

      <h3>Modeling Paradigms</h3>
      <ul>
        <li><strong>Production systems</strong> &mdash; ACT-R, SOAR (symbolic rule-based architectures)</li>
        <li><strong>Neural simulation</strong> &mdash; Nengo, NEST, Brian2 (spiking neural network simulators)</li>
        <li><strong>Bayesian modeling</strong> &mdash; Stan, PyMC, WebPPL (probabilistic programming)</li>
        <li><strong>Neuroimaging analysis</strong> &mdash; FSL, FreeSurfer, SPM, nilearn (fMRI/structural MRI)</li>
        <li><strong>Electrophysiology</strong> &mdash; MNE-Python, FieldTrip, EEGLAB (EEG/MEG analysis)</li>
      </ul>

      <h3>Open Science &amp; Reproducibility</h3>
      <p>Open datasets and shared analysis pipelines are essential for reproducible cognitive
      science. The resources below represent the most widely-used tools and data repositories
      in the field.</p>
    `,
    subsections: [
      {
        title: "Cognitive Architectures",
        items: [
          { title: "ACT-R: Adaptive Control of Thought - Rational", author: "John Anderson Lab (CMU)", type: "code", level: "intermediate", url: "http://act-r.psy.cmu.edu/", desc: "The most widely-used cognitive architecture, modeling human cognition through production rules, declarative memory chunks, and Bayesian learning." },
          { title: "Soar Cognitive Architecture", author: "John Laird Lab (Michigan)", type: "code", level: "intermediate", url: "https://soar.eecs.umich.edu/", desc: "General cognitive architecture for developing intelligent agents, based on problem spaces, chunking, and reinforcement learning." },
          { title: "Nengo: Neural Engineering Framework", author: "Applied Brain Research", type: "code", level: "intermediate", url: "https://www.nengo.ai/", desc: "Python framework implementing the Neural Engineering Framework (NEF) for building large-scale brain models with spiking or rate neurons." },
          { title: "NEST Simulator", author: "NEST Initiative", type: "code", level: "advanced", url: "https://www.nest-simulator.org/", desc: "Simulator for spiking neural network models focusing on the dynamics, size, and structure of neural systems." }
        ]
      },
      {
        title: "Brain Imaging Datasets",
        items: [
          { title: "Human Connectome Project (HCP)", author: "WU-Minn Consortium", type: "data", level: "intermediate", url: "https://www.humanconnectome.org/", desc: "Massive dataset of high-resolution fMRI, diffusion MRI, and behavioral data from 1,200 healthy adults." },
          { title: "OpenNeuro", author: "Stanford Center for Reproducible Neuroscience", type: "data", level: "beginner", url: "https://openneuro.org/", desc: "Free platform for sharing neuroimaging data in BIDS format. Thousands of fMRI, EEG, MEG, and iEEG datasets." },
          { title: "Allen Brain Atlas", author: "Allen Institute for Brain Science", type: "data", level: "intermediate", url: "https://portal.brain-map.org/", desc: "Comprehensive gene expression atlas, connectivity atlas, and cell-type databases for mouse and human brains." },
          { title: "NeuroVault: Repository of brain statistical maps", author: "Gorgolewski et al.", type: "data", level: "beginner", url: "https://neurovault.org/", desc: "Public repository for sharing unthresholded statistical maps, parcellations, and atlases from neuroimaging studies." }
        ]
      },
      {
        title: "Analysis & Simulation Frameworks",
        items: [
          { title: "nilearn: Machine Learning for Neuroimaging in Python", author: "nilearn contributors", type: "code", level: "intermediate", url: "https://nilearn.github.io/stable/index.html", desc: "Python library for statistical learning on neuroimaging data: decoding, connectivity, parcellation, and visualization." },
          { title: "Brian2: Spiking Neural Network Simulator", author: "Goodman & Brette", type: "code", level: "intermediate", url: "https://brian2.readthedocs.io/", desc: "Flexible Python simulator for spiking neural networks defined by equations, ideal for computational neuroscience research." },
          { title: "PyMC: Probabilistic Programming in Python", author: "PyMC Developers", type: "code", level: "intermediate", url: "https://www.pymc.io/", desc: "Bayesian modeling framework using MCMC and variational inference, widely used for cognitive modeling and data analysis." },
          { title: "PsychoPy: Psychology Experiment Software", author: "Jonathan Peirce", type: "code", level: "beginner", url: "https://www.psychopy.org/", desc: "Free Python-based software for running psychology and neuroscience experiments with precise timing control." }
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
