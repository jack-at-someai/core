/* ===================================================================
   Entomology  --  Curated Reference Hub
   The study of insects and their world-shaping impact
   =================================================================== */

const SECTIONS = [

/* ---------------------------------------------------------------
   1. OVERVIEW  --  Introduction to Entomology
   --------------------------------------------------------------- */
{
  id: "overview",
  icon: "◇",
  label: "Overview",
  intro: `
    <p>
      <strong>Entomology</strong> is the scientific study of insects &mdash; the most
      species-rich, ecologically dominant, and evolutionarily successful group of
      animals on Earth. With over one million described species and an estimated
      five to ten million yet unnamed, insects comprise roughly 80% of all known
      animal species. They inhabit every terrestrial and freshwater ecosystem, and
      their collective biomass dwarfs that of all vertebrates combined.
    </p>
    <p>
      Insects are not marginal players; they are <em>planetary infrastructure</em>.
      They pollinate the majority of flowering plants, decompose organic matter,
      cycle nutrients, control pest populations, and serve as the primary food
      source for countless birds, fish, and mammals. The collapse of insect
      populations would cascade through every trophic level on Earth.
    </p>
    <p>Key themes of modern entomology:</p>
    <ul>
      <li><strong>Ecological Dominance</strong> &mdash; insects drive nutrient cycling, pollination, and food webs across virtually all terrestrial biomes.</li>
      <li><strong>Co-Evolution</strong> &mdash; insects have co-evolved with flowering plants for over 100 million years, producing intricate mutualistic and antagonistic relationships.</li>
      <li><strong>Biomimicry Engine</strong> &mdash; insect flight, social organization, and material science inspire engineering innovations from micro air vehicles to self-healing materials.</li>
      <li><strong>Convex Hull Thesis</strong> &mdash; Charlotte's thesis proposes that insects represent a key node in the convex hull of biological knowledge, where small-scale organisms drive planetary-scale effects. Studying insects at the micro level reveals emergent dynamics that shape macro-level ecological stability.</li>
      <li><strong>Containerized Reality</strong> &mdash; advances in containerized simulation environments allow researchers to model insect populations and ecosystems as reproducible, scalable services, enabling a new era of computational entomology.</li>
    </ul>
    <p>
      The resources below provide a comprehensive foundation for understanding
      insect biology, ecology, and the technologies that are transforming how we
      study them. From classic textbooks to cutting-edge computational tools,
      this hub serves as a gateway to the most consequential group of organisms
      on the planet.
    </p>`,
  subsections: [
    {
      title: "Foundational Texts",
      items: [
        {
          title: "Borror and DeLong's Introduction to the Study of Insects",
          author: "Charles A. Triplehorn & Norman F. Johnson",
          type: "book",
          level: "beginner",
          url: "https://www.cengage.com/c/borror-and-delong-s-introduction-to-the-study-of-insects-7e-triplehorn/",
          desc: "The definitive introductory entomology textbook, covering insect morphology, taxonomy, ecology, and collection methods across all major orders."
        },
        {
          title: "The Insects: An Outline of Entomology",
          author: "P.J. Gullan & P.S. Cranston",
          type: "book",
          level: "beginner",
          url: "https://www.wiley.com/en-us/The+Insects%3A+An+Outline+of+Entomology%2C+5th+Edition-p-9781118846155",
          desc: "A widely adopted university textbook providing a modern, integrative overview of insect biology with superb illustrations and up-to-date phylogenetics."
        },
        {
          title: "Encyclopedia of Insects",
          author: "Vincent H. Resh & Ring T. Carde (eds.)",
          type: "book",
          level: "intermediate",
          url: "https://www.elsevier.com/books/encyclopedia-of-insects/resh/978-0-12-374144-8",
          desc: "A comprehensive reference with 270 chapters by leading specialists covering every major topic in entomology, from anatomy to zoonoses."
        },
        {
          title: "For Love of Insects",
          author: "Thomas Eisner",
          type: "book",
          level: "beginner",
          url: "https://www.hup.harvard.edu/books/9780674011816",
          desc: "A beautifully written memoir and scientific narrative by the father of chemical ecology, revealing decades of discoveries about insect chemical defense."
        }
      ]
    },
    {
      title: "Survey & Review Articles",
      items: [
        {
          title: "The Diversity of Insects",
          author: "Brian D. Farrell",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1126/science.281.5376.555",
          desc: "A landmark Science paper examining the extraordinary species richness of phytophagous beetles and the role of plant-insect co-evolution in generating diversity."
        },
        {
          title: "Phylogenomics Resolves the Timing and Pattern of Insect Evolution",
          author: "Bernhard Misof et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1126/science.1257570",
          desc: "The 1KITE project's landmark phylogenomic analysis of insect evolution using transcriptomes from over 1,400 species, resolving deep divergences."
        },
        {
          title: "How Many Species of Insects and Other Terrestrial Arthropods Are There on Earth?",
          author: "Nigel E. Stork",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1146/annurev-ento-020117-043348",
          desc: "A comprehensive Annual Review of Entomology article evaluating species richness estimates, concluding approximately 5.5 million insect species exist globally."
        },
        {
          title: "Insects as Food and Feed: A Review",
          author: "Arnold van Huis",
          type: "notes",
          level: "beginner",
          url: "https://doi.org/10.1146/annurev-ento-120811-153704",
          desc: "Reviews the potential of edible insects as a sustainable protein source, covering nutritional value, farming methods, and cultural acceptance worldwide."
        }
      ]
    },
    {
      title: "Introductory Courses",
      items: [
        {
          title: "Bugs 101: Insect-Human Interactions",
          author: "University of Alberta via Coursera",
          type: "course",
          level: "beginner",
          url: "https://www.coursera.org/learn/bugs-101",
          desc: "A popular MOOC exploring the diversity of insects and their complex relationships with humans, from pollination to disease transmission."
        },
        {
          title: "Introductory Entomology (ENT 425)",
          author: "NC State University",
          type: "course",
          level: "beginner",
          url: "https://genent.cals.ncsu.edu/",
          desc: "A comprehensive open-access entomology course covering insect anatomy, physiology, ecology, and identification with detailed lecture notes and images."
        },
        {
          title: "The Insect World (BBC Earth)",
          author: "BBC Earth",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=POwFP4lQJ14",
          desc: "A visually stunning documentary introduction to insect diversity, behavior, and ecological roles narrated with BBC Earth's signature production quality."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   2. MORPHOLOGY  --  Anatomy, Physiology & Systematics
   --------------------------------------------------------------- */
{
  id: "morphology",
  icon: "⊕",
  label: "Morphology",
  intro: `
    <p>
      Insect <strong>morphology and physiology</strong> reveal some of the most
      extraordinary engineering solutions in nature. The insect body plan &mdash;
      head, thorax, and abdomen &mdash; has been refined over 400 million years
      of evolution into a modular, adaptable chassis that supports flight,
      metamorphosis, extreme miniaturization, and sensory capabilities that
      surpass most vertebrates.
    </p>
    <p>
      The <strong>exoskeleton</strong>, composed of chitin and sclerotized proteins,
      functions simultaneously as armor, muscle attachment site, waterproofing
      barrier, and sensory interface. Insects were the first animals to evolve
      powered flight &mdash; approximately 350 million years ago &mdash; and their
      flight mechanics remain unsurpassed in terms of maneuverability, efficiency,
      and scale.
    </p>
    <p>Key morphological systems:</p>
    <ul>
      <li><strong>Exoskeleton</strong> &mdash; a composite biomaterial combining rigidity, flexibility, and lightness through laminated chitin-protein microstructure.</li>
      <li><strong>Metamorphosis</strong> &mdash; holometabolous insects undergo complete body reconstruction during pupation, effectively building two different organisms from one genome.</li>
      <li><strong>Tracheal System</strong> &mdash; insects breathe through a network of air tubes delivering oxygen directly to tissues, bypassing the circulatory system entirely.</li>
      <li><strong>Sensory Systems</strong> &mdash; compound eyes with thousands of ommatidia, antennae detecting single pheromone molecules, and mechanosensory organs like Johnston's organ enabling hearing and flight stabilization.</li>
    </ul>`,
  subsections: [
    {
      title: "Anatomy & Physiology",
      items: [
        {
          title: "Insect Physiology and Biochemistry",
          author: "James L. Nation",
          type: "book",
          level: "intermediate",
          url: "https://www.routledge.com/Insect-Physiology-and-Biochemistry/Nation/p/book/9781482247589",
          desc: "A comprehensive textbook covering all major physiological systems of insects including respiration, circulation, excretion, endocrinology, and reproduction."
        },
        {
          title: "The Insects: Structure and Function",
          author: "R.F. Chapman (ed. S.J. Simpson & A.E. Douglas)",
          type: "book",
          level: "advanced",
          url: "https://www.cambridge.org/core/books/insects/1AC952FC18F4D41A72930AE50B10FC42",
          desc: "The most authoritative reference on insect functional morphology, thoroughly revised in its fifth edition with modern molecular and physiological insights."
        },
        {
          title: "Insect Morphology and Phylogeny",
          author: "Rolf G. Beutel, Frank Friedrich & Richard A.B. Leschen",
          type: "book",
          level: "advanced",
          url: "https://www.degruyter.com/document/doi/10.1515/9783110264043/html",
          desc: "A detailed treatment of insect morphology in a phylogenetic context, integrating traditional anatomy with modern cladistic analysis."
        },
        {
          title: "Insect Anatomy and Physiology (ENT 425 Module)",
          author: "NC State University",
          type: "notes",
          level: "beginner",
          url: "https://genent.cals.ncsu.edu/insect-identification/anatomy/",
          desc: "Open-access illustrated lecture notes covering the external and internal anatomy of insects with labeled diagrams and microscopy images."
        }
      ]
    },
    {
      title: "Metamorphosis & Development",
      items: [
        {
          title: "Insect Metamorphosis: From Natural History to Regulation of Development and Evolution",
          author: "Xavier Belles",
          type: "book",
          level: "advanced",
          url: "https://www.elsevier.com/books/insect-metamorphosis/belles/978-0-12-813020-9",
          desc: "A thorough synthesis of metamorphosis research spanning historical observations, hormonal regulation, gene networks, and evolutionary origins."
        },
        {
          title: "The Mystery of Metamorphosis: A Scientific Detective Story",
          author: "Frank Ryan",
          type: "book",
          level: "beginner",
          url: "https://www.chelseagreen.com/product/the-mystery-of-metamorphosis/",
          desc: "A popular science account tracing the history of metamorphosis research, from Fabre's field observations to modern molecular developmental biology."
        },
        {
          title: "Hormonal Control of Insect Metamorphosis",
          author: "Lynn M. Riddiford",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1016/B978-0-12-384749-2.10011-1",
          desc: "An authoritative review of the ecdysone and juvenile hormone signaling cascades that orchestrate insect metamorphosis at the molecular level."
        },
        {
          title: "The Caterpillar to Butterfly Transformation (Deep Look)",
          author: "KQED Deep Look",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=kVm5k99PGk0",
          desc: "Award-winning ultra-macro videography documenting the complete metamorphosis of a painted lady butterfly with expert narration."
        }
      ]
    },
    {
      title: "Sensory Systems",
      items: [
        {
          title: "The Ecology of the Eyes of Insects",
          author: "Michael F. Land & Dan-Eric Nilsson",
          type: "book",
          level: "intermediate",
          url: "https://global.oup.com/academic/product/animal-eyes-9780199581146",
          desc: "A comprehensive treatment of animal visual systems with extensive coverage of compound eyes, ocelli, and the optical physics behind insect vision."
        },
        {
          title: "Insect Hearing and Acoustic Communication",
          author: "Berthold Hedwig (ed.)",
          type: "book",
          level: "advanced",
          url: "https://link.springer.com/book/10.1007/978-3-642-40462-7",
          desc: "A multi-author volume covering the diversity of insect auditory systems, from tympanal ears in moths to substrate vibration detection in treehoppers."
        },
        {
          title: "Pheromone Communication in Moths",
          author: "Jeremy D. Allison & Ring T. Carde (eds.)",
          type: "book",
          level: "advanced",
          url: "https://www.ucpress.edu/book/9780520278561/pheromone-communication-in-moths",
          desc: "An in-depth review of moth olfactory systems, pheromone biosynthesis, antennal receptor biology, and the neural processing of chemical signals."
        },
        {
          title: "How Insects See (Veritasium)",
          author: "Veritasium / Derek Muller",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=rhjQzGk3eJg",
          desc: "An accessible video exploration of compound eye optics, ultraviolet vision, and how insect visual perception differs fundamentally from vertebrate vision."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   3. ECOLOGY  --  Insect Ecology
   --------------------------------------------------------------- */
{
  id: "ecology",
  icon: "⬡",
  label: "Ecology",
  intro: `
    <p>
      <strong>Insect ecology</strong> examines how insects interact with each other,
      with other organisms, and with their physical environment. Because insects
      occupy virtually every ecological niche &mdash; as herbivores, predators,
      parasitoids, detritivores, and mutualists &mdash; they are central to
      understanding community assembly, food web dynamics, and ecosystem function.
    </p>
    <p>
      <strong>Chemical ecology</strong> is a cornerstone of the field. Insects
      communicate through a vast chemical lexicon: pheromones coordinate mating
      and colony behavior, allomones deter predators, kairomones attract
      parasitoids to their hosts, and synomones mediate mutualistic interactions
      between plants and their insect defenders.
    </p>
    <p>
      The emerging field of <strong>insect-microbiome interactions</strong> is
      revealing that insects are not autonomous organisms but holobionts &mdash;
      composite entities whose ecology, nutrition, immunity, and even behavior
      are shaped by symbiotic bacteria, fungi, and viruses.
    </p>
    <ul>
      <li><strong>Tritrophic Interactions</strong> &mdash; plants, herbivorous insects, and their natural enemies form three-level ecological networks that structure terrestrial communities.</li>
      <li><strong>Chemical Communication</strong> &mdash; semiochemicals (pheromones, allomones, kairomones) mediate insect behavior across scales from individual mating to landscape-level migration.</li>
      <li><strong>Holobiont Ecology</strong> &mdash; obligate and facultative microbial symbionts profoundly shape insect nutrition, defense, speciation, and adaptation to novel environments.</li>
    </ul>`,
  subsections: [
    {
      title: "Population & Community Ecology",
      items: [
        {
          title: "Insect Ecology: An Ecosystem Approach",
          author: "Timothy D. Schowalter",
          type: "book",
          level: "intermediate",
          url: "https://www.elsevier.com/books/insect-ecology/schowalter/978-0-12-803033-2",
          desc: "A leading textbook treating insect ecology through an ecosystem lens, covering population regulation, community interactions, and biogeochemical cycling."
        },
        {
          title: "Ecological Entomology",
          author: "Carl B. Huffaker & Andrew P. Gutierrez (eds.)",
          type: "book",
          level: "advanced",
          url: "https://www.wiley.com/en-us/Ecological+Entomology%2C+2nd+Edition-p-9780471244837",
          desc: "A comprehensive multi-author reference on the ecological principles governing insect populations, from life table analysis to landscape ecology."
        },
        {
          title: "Multitrophic Level Interactions",
          author: "Teja Tscharntke & Bradford A. Hawkins (eds.)",
          type: "book",
          level: "advanced",
          url: "https://www.cambridge.org/core/books/multitrophic-level-interactions/43A5A5B2DAE0BF0CE35ED6A8894C02A3",
          desc: "An authoritative volume examining how interactions cascade across trophic levels, with insects as the central connecting nodes."
        },
        {
          title: "Insect Population Ecology (Crash Course)",
          author: "CrashCourse",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=RBOsqmBQBQk",
          desc: "An engaging animated introduction to population ecology concepts illustrated with insect examples including r/K selection and carrying capacity."
        }
      ]
    },
    {
      title: "Chemical Ecology",
      items: [
        {
          title: "Chemical Ecology of Insects",
          author: "William J. Bell & Ring T. Carde (eds.)",
          type: "book",
          level: "advanced",
          url: "https://link.springer.com/book/10.1007/978-1-4899-3368-3",
          desc: "A foundational multi-author volume on insect semiochemistry covering pheromone biology, host-plant selection, and chemical defense mechanisms."
        },
        {
          title: "The Ecology of Plant Secondary Metabolites: From Genes to Global Processes",
          author: "Glenn R. Iason, Marcel Dicke & Susan E. Hartley (eds.)",
          type: "book",
          level: "advanced",
          url: "https://www.cambridge.org/core/books/ecology-of-plant-secondary-metabolites/B4DD249ABD7D3EBB3E6F9E55BAE09BA0",
          desc: "Explores how plant chemical defenses shape insect communities and drive co-evolutionary dynamics from molecular to ecosystem scales."
        },
        {
          title: "Pheromones and Animal Behavior: Chemical Signals and Signatures",
          author: "Tristram D. Wyatt",
          type: "book",
          level: "intermediate",
          url: "https://www.cambridge.org/core/books/pheromones-and-animal-behavior/1E5640BDC71C0B41C0F361D0DE4B3E9D",
          desc: "An accessible and thorough introduction to pheromone biology across the animal kingdom, with extensive insect coverage and evolutionary context."
        },
        {
          title: "Chemical Ecology: The Language of Bugs (iBiology)",
          author: "May Berenbaum / iBiology",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=GFSC1zCBb7U",
          desc: "A captivating lecture by pioneer chemical ecologist May Berenbaum on how insects use chemistry for communication, defense, and warfare."
        }
      ]
    },
    {
      title: "Insect-Microbiome Interactions",
      items: [
        {
          title: "Insect-Symbiont Interactions",
          author: "Angela E. Douglas",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1146/annurev-ento-010814-020822",
          desc: "An Annual Review of Entomology article reviewing the molecular mechanisms, ecological consequences, and evolutionary dynamics of insect-microbe symbioses."
        },
        {
          title: "Symbiosis: An Introduction to Biological Associations",
          author: "Surindar Paracer & Vernon Ahmadjian",
          type: "book",
          level: "intermediate",
          url: "https://global.oup.com/academic/product/symbiosis-9780195118063",
          desc: "A comprehensive textbook on biological symbiosis with detailed chapters on insect-microbe associations including Buchnera in aphids and Wolbachia."
        },
        {
          title: "The Gut Microbiome of Insects: Diversity in Diet and Ecology",
          author: "Tobin J. Hammer & Noah Fierer",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1016/j.cois.2019.06.006",
          desc: "A review examining how diet and ecological niche shape insect gut microbial communities, with implications for pest management and conservation."
        },
        {
          title: "Wolbachia: Master Manipulators of Invertebrate Biology",
          author: "John H. Werren, Laura Baldo & Michael E. Clark",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1038/nrmicro1969",
          desc: "A Nature Reviews Microbiology article on the most widespread intracellular symbiont on Earth, exploring its manipulation of insect reproduction and evolution."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   4. POLLINATION  --  Pollination Biology & Ecosystem Services
   --------------------------------------------------------------- */
{
  id: "pollination",
  icon: "◉",
  label: "Pollination",
  intro: `
    <p>
      <strong>Pollination</strong> is arguably the single most economically and
      ecologically important ecosystem service provided by insects. Approximately
      87.5% of flowering plant species depend on animal pollination, and insects
      &mdash; particularly bees, butterflies, flies, and beetles &mdash; are the
      dominant pollinators in most terrestrial ecosystems.
    </p>
    <p>
      The global economic value of insect pollination is estimated at over
      $200 billion annually. Beyond agriculture, insect pollination sustains the
      reproduction of wild plants that form the structural and nutritional
      foundation of terrestrial ecosystems.
    </p>
    <p>
      Yet pollinators are in crisis. Colony Collapse Disorder, pesticide exposure,
      habitat loss, parasites, and climate change are driving declines in both
      managed honeybee colonies and wild pollinator populations worldwide.
      Understanding and protecting pollination networks is one of the most urgent
      challenges in applied entomology.
    </p>
    <ul>
      <li><strong>Bee Biology (Apiology)</strong> &mdash; the study of honeybees and wild bees, covering social organization, foraging behavior, navigation, and colony health.</li>
      <li><strong>Pollination Networks</strong> &mdash; mutualistic networks linking plant and pollinator species reveal the architecture of ecological resilience and vulnerability.</li>
      <li><strong>Pollinator Decline</strong> &mdash; quantifying, diagnosing, and mitigating the global loss of pollinator diversity and abundance is a pressing conservation priority.</li>
    </ul>`,
  subsections: [
    {
      title: "Bee Biology & Apiology",
      items: [
        {
          title: "The Bees in Your Backyard: A Guide to North America's Bees",
          author: "Joseph S. Wilson & Olivia Messinger Carril",
          type: "book",
          level: "beginner",
          url: "https://press.princeton.edu/books/paperback/9780691160771/the-bees-in-your-backyard",
          desc: "A beautifully illustrated field guide introducing the astonishing diversity of native North American bees beyond the familiar honeybee."
        },
        {
          title: "The Biology of the Honey Bee",
          author: "Mark L. Winston",
          type: "book",
          level: "intermediate",
          url: "https://www.hup.harvard.edu/books/9780674074095",
          desc: "A classic and comprehensive treatment of honeybee biology covering development, social organization, communication, foraging, and colony reproduction."
        },
        {
          title: "The Lives of Bees: The Untold Story of the Honey Bee in the Wild",
          author: "Thomas D. Seeley",
          type: "book",
          level: "beginner",
          url: "https://press.princeton.edu/books/hardcover/9780691166766/the-lives-of-bees",
          desc: "Seeley draws on decades of field research to reveal how wild honeybee colonies thrive without human management, offering lessons for sustainable beekeeping."
        },
        {
          title: "Honeybee Democracy",
          author: "Thomas D. Seeley",
          type: "book",
          level: "intermediate",
          url: "https://press.princeton.edu/books/paperback/9780691147215/honeybee-democracy",
          desc: "An accessible account of collective decision-making in honeybee swarms, demonstrating how decentralized groups can make optimal choices."
        }
      ]
    },
    {
      title: "Pollination Networks & Services",
      items: [
        {
          title: "Plant-Pollinator Interactions: From Specialization to Generalization",
          author: "Nickolas M. Waser & Jeff Ollerton (eds.)",
          type: "book",
          level: "advanced",
          url: "https://press.uchicago.edu/ucp/books/book/chicago/P/bo3533228.html",
          desc: "A multi-author volume examining the spectrum from specialized to generalized pollination systems, network topology, and their evolutionary consequences."
        },
        {
          title: "The Economics of Ecosystems and Biodiversity (TEEB) for Agriculture: Pollination",
          author: "IPBES",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.5281/zenodo.3402856",
          desc: "The IPBES assessment report on pollinators, pollination, and food production, providing the most comprehensive global evaluation of pollination services."
        },
        {
          title: "The Structure of Plant-Pollinator Interaction Networks",
          author: "Jordi Bascompte & Pedro Jordano",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1146/annurev-ecolsys-110411-160300",
          desc: "A seminal review on the nested, modular architecture of pollination networks and how network structure buffers ecosystems against species loss."
        },
        {
          title: "The Hidden Beauty of Pollination (TED Talk)",
          author: "Louie Schwartzberg",
          type: "video",
          level: "beginner",
          url: "https://www.ted.com/talks/louie_schwartzberg_the_hidden_beauty_of_pollination",
          desc: "Stunning time-lapse and macro photography revealing the intimate mechanics of pollination, accompanied by a meditation on nature's interconnectedness."
        }
      ]
    },
    {
      title: "Pollinator Decline & Conservation",
      items: [
        {
          title: "A World Without Bees",
          author: "Alison Benjamin & Brian McCallum",
          type: "book",
          level: "beginner",
          url: "https://www.penguinrandomhouse.com/books/303893/a-world-without-bees-by-alison-benjamin-and-brian-mccallum/",
          desc: "An accessible investigation into Colony Collapse Disorder, pesticide impacts, and the global implications of declining bee populations."
        },
        {
          title: "Neonicotinoids in Bees: A Review on Concentrations, Side-Effects, and Risk Assessment",
          author: "Tjeerd Blacquiere et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1007/s10646-012-0863-x",
          desc: "A widely cited review of neonicotinoid insecticide impacts on bee physiology, behavior, and colony viability at field-realistic exposure levels."
        },
        {
          title: "Safeguarding Pollinators and Their Values to Human Well-Being",
          author: "Simon G. Potts et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1038/nature20588",
          desc: "A Nature paper synthesizing evidence on pollinator decline and proposing ten policy-relevant strategies for pollinator conservation globally."
        },
        {
          title: "Silence of the Bees (PBS Nature Documentary)",
          author: "PBS Nature",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=JilYBVrFDhk",
          desc: "An Emmy-nominated PBS documentary investigating the mysterious disappearance of honeybee colonies and the scientists racing to find answers."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   5. BIOMIMICRY  --  Insect-Inspired Engineering
   --------------------------------------------------------------- */
{
  id: "biomimicry",
  icon: "∿",
  label: "Biomimicry",
  intro: `
    <p>
      Insects are the greatest engineers on Earth. Over 400 million years, they have
      evolved solutions to problems that human engineers are only beginning to tackle:
      micro-scale flight, distributed intelligence, self-cleaning surfaces, structural
      coloration without pigments, and materials that are simultaneously strong, light,
      and self-repairing.
    </p>
    <p>
      <strong>Insect-inspired biomimicry</strong> translates these biological solutions
      into human technology. The field spans mechanical engineering (insect flight for
      micro air vehicles), computer science (ant colony optimization, swarm robotics),
      materials science (beetle fog-harvesting, cicada antibacterial surfaces), and
      architecture (termite-inspired ventilation).
    </p>
    <p>Applications of insect biomimicry:</p>
    <ul>
      <li><strong>Micro Air Vehicles (MAVs)</strong> &mdash; insect wing kinematics, vortex shedding, and clap-and-fling mechanisms inspire the design of centimeter-scale flying robots.</li>
      <li><strong>Swarm Intelligence</strong> &mdash; ant colony optimization, bee waggle-dance communication, and termite stigmergy have produced powerful algorithms for routing, scheduling, and construction.</li>
      <li><strong>Bio-Surfaces</strong> &mdash; cicada wing nanopillars that kill bacteria on contact, moth-eye anti-reflective coatings, and beetle elytra fog-collection surfaces inspire functional materials.</li>
    </ul>`,
  subsections: [
    {
      title: "Insect Flight & Micro Air Vehicles",
      items: [
        {
          title: "Flying Insects and Robots",
          author: "Dario Floreano & Jean-Christophe Zufferey (eds.)",
          type: "book",
          level: "advanced",
          url: "https://link.springer.com/book/10.1007/978-3-540-89393-6",
          desc: "A multidisciplinary volume bridging insect flight biomechanics and robotics, covering sensory systems, control architectures, and MAV prototypes."
        },
        {
          title: "Insect Flight Mechanisms: Anatomy, Kinematics, Aerodynamics",
          author: "Robert Dudley",
          type: "book",
          level: "advanced",
          url: "https://press.princeton.edu/books/paperback/9780691094915/the-biomechanics-of-insect-flight",
          desc: "The definitive monograph on the biomechanics of insect flight, integrating morphology, aerodynamics, energetics, and evolutionary history."
        },
        {
          title: "RoboBee: An Insect-Scale Flying Robot (Harvard Microrobotics Lab)",
          author: "Harvard Microrobotics Lab",
          type: "video",
          level: "intermediate",
          url: "https://www.youtube.com/watch?v=MJbOoNpqabc",
          desc: "A demonstration video of Harvard's RoboBee project, showing a sub-gram flying robot inspired by insect wing mechanics and hovering flight."
        },
        {
          title: "DelFly: Design, Aerodynamics, and Artificial Intelligence of a Flapping Wing Robot",
          author: "G.C.H.E. de Croon et al.",
          type: "book",
          level: "advanced",
          url: "https://link.springer.com/book/10.1007/978-94-017-9208-0",
          desc: "A complete account of the DelFly project — from bio-inspired design through aerodynamic analysis to autonomous flight with onboard vision."
        }
      ]
    },
    {
      title: "Social Insect Algorithms",
      items: [
        {
          title: "Ant Colony Optimization",
          author: "Marco Dorigo & Thomas Stutzle",
          type: "book",
          level: "intermediate",
          url: "https://mitpress.mit.edu/9780262042192/ant-colony-optimization/",
          desc: "The foundational text on ACO algorithms, showing how the pheromone trail-laying behavior of ants solves combinatorial optimization problems."
        },
        {
          title: "Swarm Intelligence: From Natural to Artificial Systems",
          author: "Eric Bonabeau, Marco Dorigo & Guy Theraulaz",
          type: "book",
          level: "intermediate",
          url: "https://global.oup.com/academic/product/swarm-intelligence-9780195131598",
          desc: "A pioneering book establishing the theoretical foundations of swarm intelligence, drawing on ant colonies, bee swarms, and termite construction."
        },
        {
          title: "The Ant Colony Optimization Metaheuristic: Algorithms, Applications, and Advances",
          author: "Marco Dorigo, Gianni Di Caro & Luca M. Gambardella",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1007/978-1-4615-1507-4_11",
          desc: "A comprehensive overview of ACO variants and their applications to the traveling salesman problem, vehicle routing, and network design."
        },
        {
          title: "Ant Colony Optimization Explained (Reducible)",
          author: "Reducible",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=783ZtAF4j5g",
          desc: "An animated explanation of how ant colony optimization algorithms work, with clear visualizations of pheromone dynamics and convergence behavior."
        }
      ]
    },
    {
      title: "Insect Surface & Material Science",
      items: [
        {
          title: "Biomimetics of Optical Nanostructures",
          author: "Andrew R. Parker",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1038/nphoton.2007.11",
          desc: "A Nature Photonics review of structural coloration in insects (Morpho butterfly wings, jewel beetles) and their translation into photonic materials."
        },
        {
          title: "Bio-Inspired Surfaces: Cicada Wing Nanopillar Bactericidal Mechanisms",
          author: "Elena P. Ivanova et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1002/smll.201200528",
          desc: "The landmark paper demonstrating that cicada wing nanopillar surfaces kill bacteria through mechanical rupture, inspiring a new class of antibacterial materials."
        },
        {
          title: "Fog-Basking Behaviour and Water Collection Efficiency in Namib Desert Beetles",
          author: "Andrew R. Parker & Chris R. Lawrence",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1038/35102108",
          desc: "The original Nature paper on the Stenocara beetle's fog-harvesting surface, which uses alternating hydrophilic and hydrophobic patches to capture water from air."
        },
        {
          title: "Insect-Inspired Materials and Surfaces (Nature Masterclass)",
          author: "Nature Video",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=YZR1E3HX1zI",
          desc: "A short documentary on how insect surfaces — from moth-eye antireflection to butterfly wing iridescence — inspire next-generation functional materials."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   6. PEST  --  Pest Science & Integrated Pest Management
   --------------------------------------------------------------- */
{
  id: "pest",
  icon: "⊗",
  label: "Pest Science",
  intro: `
    <p>
      While insects provide irreplaceable ecosystem services, a small fraction of
      species &mdash; roughly 1-3% &mdash; cause enormous damage to agriculture,
      forestry, stored products, and human health. <strong>Pest science</strong>
      develops strategies to manage these species while minimizing ecological harm.
    </p>
    <p>
      <strong>Integrated Pest Management (IPM)</strong> combines biological,
      cultural, physical, and chemical tools to suppress pest populations below
      economic thresholds. Modern approaches increasingly rely on ecological
      understanding: manipulating tritrophic interactions, enhancing natural enemy
      populations, and using semiochemicals for monitoring and mass trapping.
    </p>
    <p>
      <strong>Medical and veterinary entomology</strong> focuses on insects as
      vectors of human and animal disease. Mosquitoes alone transmit malaria,
      dengue, Zika, and West Nile virus, causing hundreds of thousands of deaths
      annually. Novel control strategies &mdash; Wolbachia-mediated population
      suppression, gene drives, and sterile insect technique (SIT) &mdash; are
      transforming vector control.
    </p>
    <ul>
      <li><strong>IPM</strong> &mdash; ecologically-based pest management integrating monitoring, biological control, cultural practices, and judicious pesticide use.</li>
      <li><strong>Biological Control</strong> &mdash; using natural enemies (predators, parasitoids, pathogens) to regulate pest populations, including augmentative and classical approaches.</li>
      <li><strong>Sterile Insect Technique (SIT)</strong> &mdash; mass-releasing sterile males to suppress wild populations, a proven area-wide strategy for fruit flies and mosquitoes.</li>
      <li><strong>RNAi Pest Control</strong> &mdash; RNA interference technology targeting essential pest genes represents the next frontier in species-specific insect management.</li>
    </ul>`,
  subsections: [
    {
      title: "Integrated Pest Management",
      items: [
        {
          title: "Integrated Pest Management: Concepts, Tactics, Strategies and Case Studies",
          author: "Edward B. Radcliffe, William D. Hutchison & Rafael E. Cancelado (eds.)",
          type: "book",
          level: "intermediate",
          url: "https://www.cambridge.org/core/books/integrated-pest-management/BCC1F6E72B8B7ED5E47CB2C72B0AFC09",
          desc: "A comprehensive textbook covering IPM principles, tactics, and case studies across major crop systems, with contributions from leading practitioners."
        },
        {
          title: "IPM World Textbook",
          author: "University of Minnesota",
          type: "notes",
          level: "beginner",
          url: "https://ipmworld.umn.edu/",
          desc: "A free, peer-reviewed online textbook providing foundational knowledge of integrated pest management principles and practices."
        },
        {
          title: "Destructive Insects: The Science of Pest Control (USDA)",
          author: "USDA APHIS",
          type: "data",
          level: "beginner",
          url: "https://www.aphis.usda.gov/plant-pests-diseases",
          desc: "USDA's official portal for plant pest and disease information, including invasive species alerts, regulatory updates, and management resources."
        },
        {
          title: "RNA Interference for Insect Control: From Research to Application",
          author: "Jozef Vanden Broeck & Guy Smagghe (eds.)",
          type: "book",
          level: "advanced",
          url: "https://doi.org/10.1016/bs.aiip.2019.12.001",
          desc: "A state-of-the-art review of RNAi-based pest management, covering dsRNA delivery mechanisms, target gene selection, and regulatory considerations."
        }
      ]
    },
    {
      title: "Biological Control & SIT",
      items: [
        {
          title: "Biological Control: Ecology and Applications",
          author: "George E. Heimpel & Nicholas J. Mills",
          type: "book",
          level: "intermediate",
          url: "https://www.cambridge.org/core/books/biological-control/68B9E038C56CEA27B5899F7A8AB5F877",
          desc: "A modern textbook integrating ecological theory with biological control practice, covering classical, augmentative, and conservation approaches."
        },
        {
          title: "Sterile Insect Technique: Principles and Practice in Area-Wide Integrated Pest Management",
          author: "Victor A. Dyck, Jorge Hendrichs & Alan S. Robinson (eds.)",
          type: "book",
          level: "advanced",
          url: "https://link.springer.com/book/10.1007/1-4020-4051-2",
          desc: "The authoritative reference on SIT, covering the biology, mass-rearing, sterilization methods, and field application for controlling tsetse flies, fruit flies, and mosquitoes."
        },
        {
          title: "Eliminating the Screw-Worm Fly: A Success Story (IAEA)",
          author: "IAEA",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=mkM0o0LBDII",
          desc: "An IAEA documentary on the eradication of the New World screw-worm fly from North America using the sterile insect technique — one of entomology's greatest applied successes."
        },
        {
          title: "World Mosquito Program: Wolbachia Method",
          author: "World Mosquito Program",
          type: "notes",
          level: "intermediate",
          url: "https://www.worldmosquitoprogram.org/en/work/wolbachia-method",
          desc: "Overview of the Wolbachia-based strategy to reduce dengue, Zika, and chikungunya transmission by introducing Wolbachia-infected Aedes aegypti into wild populations."
        }
      ]
    },
    {
      title: "Medical & Veterinary Entomology",
      items: [
        {
          title: "Medical and Veterinary Entomology",
          author: "Gary R. Mullen & Lance A. Durden (eds.)",
          type: "book",
          level: "intermediate",
          url: "https://www.elsevier.com/books/medical-and-veterinary-entomology/mullen/978-0-12-814043-7",
          desc: "The standard textbook covering biology, ecology, and medical significance of arthropod vectors including mosquitoes, ticks, lice, fleas, and biting flies."
        },
        {
          title: "Mosquito: The Story of Man's Deadliest Foe",
          author: "Andrew Spielman & Michael D'Antonio",
          type: "book",
          level: "beginner",
          url: "https://www.hachettebookgroup.com/titles/andrew-spielman/mosquito/9780786886678/",
          desc: "A gripping popular account of how mosquitoes have shaped human history, from Alexander the Great to the Panama Canal to modern malaria control."
        },
        {
          title: "Gene Drives in Mosquitoes: A Potential Tool for Malaria Elimination",
          author: "Austin Burt et al. (Target Malaria)",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1038/s41576-022-00550-y",
          desc: "A Nature Reviews Genetics article examining CRISPR-based gene drives designed to suppress Anopheles mosquito populations and reduce malaria transmission."
        },
        {
          title: "Mosquitoes: The Most Dangerous Animal in the World (TED-Ed)",
          author: "TED-Ed",
          type: "video",
          level: "beginner",
          url: "https://www.youtube.com/watch?v=KHkYMbOk9H4",
          desc: "An animated TED-Ed lesson explaining why mosquitoes are responsible for more human deaths than any other animal and how we fight back."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   7. DECLINE  --  Insect Decline & Conservation
   --------------------------------------------------------------- */
{
  id: "decline",
  icon: "▽",
  label: "Decline",
  intro: `
    <p>
      The <strong>insect decline</strong> hypothesis &mdash; sometimes called the
      "insect apocalypse" &mdash; has emerged as one of the most alarming and
      debated topics in ecology. Multiple long-term studies from Germany, Puerto
      Rico, and elsewhere have documented dramatic declines in insect abundance,
      biomass, and diversity over recent decades.
    </p>
    <p>
      A landmark 2017 study from the Krefeld Entomological Society reported a 75%
      decline in flying insect biomass over 27 years in German nature reserves. A
      2019 meta-analysis estimated global insect populations declining at roughly
      2.5% per year. However, the universality, magnitude, and taxonomic breadth
      of decline remain actively debated, with some regions and taxa showing
      stability or increases.
    </p>
    <p>Drivers and responses:</p>
    <ul>
      <li><strong>Habitat Loss</strong> &mdash; agricultural intensification, urbanization, and deforestation destroy and fragment insect habitats at landscape scales.</li>
      <li><strong>Pesticides</strong> &mdash; neonicotinoids and other systemic insecticides affect non-target insects through direct toxicity and sublethal behavioral effects.</li>
      <li><strong>Climate Change</strong> &mdash; phenological mismatches, range shifts, and thermal stress alter insect communities, with tropical species particularly vulnerable.</li>
      <li><strong>Light Pollution</strong> &mdash; artificial light at night disrupts nocturnal insect navigation, reproduction, predator-prey dynamics, and pollination.</li>
      <li><strong>Conservation</strong> &mdash; strategies include habitat restoration, pesticide reduction, agri-environment schemes, and improved monitoring through citizen science and automated trapping.</li>
    </ul>`,
  subsections: [
    {
      title: "Evidence & Scale of Decline",
      items: [
        {
          title: "More Than 75 Percent Decline over 27 Years in Total Flying Insect Biomass in Protected Areas",
          author: "Caspar A. Hallmann et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1371/journal.pone.0185809",
          desc: "The landmark Krefeld study that ignited global concern about insect decline, documenting dramatic biomass loss in German nature reserves using Malaise trap data."
        },
        {
          title: "Worldwide Decline of the Entomofauna: A Review of Its Drivers",
          author: "Francisco Sanchez-Bayo & Kris A.G. Wyckhuys",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1016/j.biocon.2019.01.020",
          desc: "A comprehensive meta-review synthesizing 73 studies of insect decline across taxa and regions, identifying habitat change, pollution, and biological factors as primary drivers."
        },
        {
          title: "Insect Decline in the Anthropocene: Death by a Thousand Cuts",
          author: "David L. Wagner et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1073/pnas.2023989118",
          desc: "A PNAS perspectives article examining the synergistic effects of multiple stressors on insect populations and arguing that no single cause explains global patterns."
        },
        {
          title: "The Insect Crisis: The Fall of the Tiny Empires That Run the World",
          author: "Oliver Milman",
          type: "book",
          level: "beginner",
          url: "https://wwnorton.com/books/The-Insect-Crisis/",
          desc: "A journalist's accessible investigation of worldwide insect decline, combining field reporting, scientific interviews, and data analysis into a compelling narrative."
        }
      ]
    },
    {
      title: "Drivers & Mechanisms",
      items: [
        {
          title: "Declines in Insect Abundance and Diversity: We Know Enough to Act Now",
          author: "Matthew L. Forister et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1111/cobi.13722",
          desc: "A Conservation Biology article arguing that despite data gaps, the evidence base for insect decline is sufficient to justify immediate policy and management action."
        },
        {
          title: "Light Pollution Is a Driver of Insect Declines",
          author: "Avalon C.S. Owens et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1016/j.biocon.2019.108259",
          desc: "A comprehensive review of the mechanisms through which artificial light at night disrupts insect ecology, from phototactic trapping to disrupted circadian rhythms."
        },
        {
          title: "Impacts of Neonicotinoid Use on Long-Term Population Changes in Wild Bees in England",
          author: "Ben A. Woodcock et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1038/s41467-016-0215-2",
          desc: "A Nature Communications study linking long-term wild bee population trends to landscape-scale neonicotinoid usage patterns across England."
        },
        {
          title: "Insect Apocalypse? Not So Fast (Atlantic)",
          author: "Ed Yong / The Atlantic",
          type: "notes",
          level: "beginner",
          url: "https://www.theatlantic.com/science/archive/2019/02/insect-apocalypse-really-upon-us/583018/",
          desc: "An award-winning science journalism piece critically examining the insect apocalypse narrative, highlighting methodological concerns and geographic biases in the data."
        }
      ]
    },
    {
      title: "Conservation Strategies",
      items: [
        {
          title: "Insect Conservation: A Handbook of Approaches and Methods",
          author: "Michael J. Samways, Melodie A. McGeoch & Tim R. New",
          type: "book",
          level: "intermediate",
          url: "https://global.oup.com/academic/product/insect-conservation-9780199298235",
          desc: "A practical handbook covering survey methods, habitat management, landscape-scale planning, and policy frameworks for conserving insect biodiversity."
        },
        {
          title: "Eight Simple Actions That Individuals Can Take to Save Insects from Global Declines",
          author: "Matt J. Forister et al.",
          type: "notes",
          level: "beginner",
          url: "https://doi.org/10.1073/pnas.2002547117",
          desc: "A PNAS paper outlining actionable steps individuals can take to support insect populations, from reducing pesticide use to planting native gardens."
        },
        {
          title: "Scientists' Warning to Humanity on Insect Extinctions",
          author: "Pedro Cardoso et al.",
          type: "notes",
          level: "intermediate",
          url: "https://doi.org/10.1016/j.biocon.2019.108426",
          desc: "A formal warning signed by 70+ scientists proposing a roadmap for insect conservation including research priorities, management actions, and societal engagement."
        },
        {
          title: "Insect Conservation (Buglife UK)",
          author: "Buglife",
          type: "data",
          level: "beginner",
          url: "https://www.buglife.org.uk/",
          desc: "The website of Europe's leading invertebrate conservation charity, offering species guides, habitat management advice, and citizen science project portals."
        }
      ]
    }
  ]
},

/* ---------------------------------------------------------------
   8. SIMULATION  --  Computational Entomology & Containerized Ecosystems
   --------------------------------------------------------------- */
{
  id: "simulation",
  icon: "⟐",
  label: "Simulation",
  intro: `
    <p>
      <strong>Computational entomology</strong> harnesses simulation, machine learning,
      and high-performance computing to model, monitor, and understand insect systems
      at scales impossible through fieldwork alone. From agent-based models of ant
      colonies to convolutional neural networks that identify species from photographs,
      computation is transforming entomological research.
    </p>
    <p>
      <strong>Charlotte's vision of containerized reality</strong> brings this further:
      entire insect ecosystems can be modeled as isolated, reproducible, scalable
      simulation services. Using container orchestration (Docker, Kubernetes) and
      cloud infrastructure, researchers can spin up digital twin ecosystems where
      insect populations interact with plants, predators, pathogens, and climate
      variables &mdash; all running as reality-as-a-service. Each simulation is
      a sealed environment: deterministic, version-controlled, and shareable like
      a software artifact. This containerized approach enables parameter sweeps
      across thousands of parallel ecosystem configurations, revealing emergent
      dynamics that would take decades to observe in the field.
    </p>
    <p>Key computational approaches:</p>
    <ul>
      <li><strong>Agent-Based Modeling (ABM)</strong> &mdash; individual insects are modeled as autonomous agents following local rules; colony-level patterns emerge from interactions. ABM captures the essential feature of insect societies: macro-scale order from micro-scale simplicity.</li>
      <li><strong>Computer Vision & Deep Learning</strong> &mdash; CNNs and vision transformers trained on millions of specimen images enable automated species identification, population monitoring, and behavioral analysis from camera traps and drones.</li>
      <li><strong>Containerized Ecosystem Simulation</strong> &mdash; Docker containers encapsulate complete ecosystem models with all dependencies, enabling reproducible runs across institutions and cloud platforms. Charlotte's convex hull thesis argues that these containerized micro-worlds reveal the disproportionate influence of insects on planetary-scale dynamics.</li>
      <li><strong>Digital Twins & eDNA</strong> &mdash; remote sensing, environmental DNA sampling, and sensor networks feed real-time data into digital twin ecosystems that mirror field conditions with computational fidelity.</li>
    </ul>`,
  subsections: [
    {
      title: "Agent-Based Modeling",
      items: [
        {
          title: "An Introduction to Agent-Based Modeling: Modeling Natural, Social, and Engineered Complex Systems with NetLogo",
          author: "Uri Wilensky & William Rand",
          type: "book",
          level: "beginner",
          url: "https://mitpress.mit.edu/9780262731898/an-introduction-to-agent-based-modeling/",
          desc: "The standard ABM textbook using NetLogo, with extensive examples of insect colony simulations including ants, termites, and bee foraging models."
        },
        {
          title: "NetLogo Ant Colony Model",
          author: "Uri Wilensky / Northwestern University",
          type: "code",
          level: "beginner",
          url: "http://ccl.northwestern.edu/netlogo/models/Ants",
          desc: "The classic NetLogo ant foraging model demonstrating how simple pheromone-following rules produce efficient colony-level food retrieval — a gateway to agent-based entomological modeling."
        },
        {
          title: "Mesa: Agent-Based Modeling in Python",
          author: "Project Mesa Contributors",
          type: "code",
          level: "intermediate",
          url: "https://github.com/projectmesa/mesa",
          desc: "A modern Python framework for agent-based modeling with built-in visualization, data collection, and batch-run capabilities for insect population and ecology simulations."
        },
        {
          title: "Individual-Based Ecology of Insect Communities",
          author: "Volker Grimm & Steven F. Railsback",
          type: "book",
          level: "advanced",
          url: "https://press.princeton.edu/books/paperback/9780691096667/individual-based-modeling-and-ecology",
          desc: "A rigorous treatment of individual-based modeling in ecology with detailed protocols for model design, calibration, and analysis applicable to insect community dynamics."
        },
        {
          title: "GAMA Platform: Agent-Based Spatial Simulation",
          author: "GAMA Platform Team",
          type: "code",
          level: "intermediate",
          url: "https://github.com/gama-platform/gama",
          desc: "An open-source platform for spatially explicit agent-based simulations, widely used for modeling insect-borne disease spread and pest population dynamics in landscapes."
        }
      ]
    },
    {
      title: "Computer Vision & Identification",
      items: [
        {
          title: "iNaturalist Computer Vision: Insect Identification",
          author: "iNaturalist / California Academy of Sciences",
          type: "data",
          level: "beginner",
          url: "https://www.inaturalist.org/",
          desc: "The world's largest biodiversity citizen science platform, using computer vision trained on 100M+ observations to automatically identify insect species from photographs."
        },
        {
          title: "Automated Insect Monitoring with Deep Learning",
          author: "Kim Bjerge et al.",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1111/2041-210X.13618",
          desc: "A Methods in Ecology and Evolution paper presenting deep learning pipelines for automated insect detection and classification from camera trap images."
        },
        {
          title: "InsectCV: A Dataset for Insect Detection and Classification",
          author: "Various Contributors",
          type: "code",
          level: "intermediate",
          url: "https://github.com/quarrying/awesome-insect-recognition",
          desc: "A curated list of datasets, models, and papers for insect recognition using computer vision, including links to benchmark datasets and pretrained models."
        },
        {
          title: "ip102: A Large-Scale Benchmark Dataset for Insect Pest Recognition",
          author: "Xiaoping Wu et al.",
          type: "data",
          level: "intermediate",
          url: "https://github.com/xpwu95/IP102",
          desc: "A benchmark dataset of 75,000 images across 102 insect pest species, widely used for training and evaluating deep learning classification models."
        }
      ]
    },
    {
      title: "Containerized Ecosystem Simulation",
      items: [
        {
          title: "EcoSimR: Null Models for Community Ecology in R",
          author: "Nicholas J. Gotelli & Aaron M. Ellison",
          type: "code",
          level: "intermediate",
          url: "https://github.com/GotelliLab/EcoSimR",
          desc: "An R package for running null model analyses of ecological communities, containerizable for reproducible batch analyses of insect assemblage data."
        },
        {
          title: "Repast Simphony: Agent-Based Modeling Toolkit",
          author: "Argonne National Laboratory",
          type: "code",
          level: "advanced",
          url: "https://repast.github.io/",
          desc: "A Java-based agent modeling toolkit from Argonne National Lab supporting distributed simulations of insect populations scalable across cloud computing clusters."
        },
        {
          title: "Docker for Data Science: Building Reproducible Computational Environments",
          author: "Joshua Cook",
          type: "book",
          level: "intermediate",
          url: "https://link.springer.com/book/10.1007/978-1-4842-3012-1",
          desc: "A practical guide to containerizing scientific computing workflows with Docker, directly applicable to packaging and distributing insect ecosystem simulations as reproducible services."
        },
        {
          title: "Ecological Modeling with NetLogo (Docker-Ready)",
          author: "NetLogo Community / Docker Hub",
          type: "code",
          level: "intermediate",
          url: "https://github.com/NetLogo/NetLogo",
          desc: "The open-source NetLogo repository, which can be containerized in Docker for headless batch execution of ecological models — ideal for parameter sweeps of insect population dynamics."
        },
        {
          title: "Digital Twins for Ecosystems: Concept, Challenges, and Opportunities",
          author: "Mark Sherlock & Peter van der Putten",
          type: "notes",
          level: "advanced",
          url: "https://doi.org/10.1016/j.ecoinf.2023.102032",
          desc: "A review of digital twin concepts applied to ecological systems, examining how sensor networks, simulation models, and real-time data fusion create virtual ecosystem replicas."
        }
      ]
    }
  ]
}

];

/* rendering engine */
const tabBar = document.getElementById("tab-bar");
const mainEl = document.getElementById("main-content");
const searchIn = document.getElementById("search-input");
const searchClr = document.getElementById("search-clear");
const statCount = document.getElementById("stat-count");
let activeTab = SECTIONS[0].id;
let activeFilter = "all";
let searchQuery = "";
const totalResources = SECTIONS.reduce((n, s) => n + s.subsections.reduce((m, sub) => m + sub.items.length, 0), 0);
statCount.textContent = totalResources;
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
function hl(text, q) {
  if (!q) return text;
  const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${esc})`, "gi"), "<mark>$1</mark>");
}
function render() {
  buildTabs();
  const sec = SECTIONS.find(s => s.id === activeTab);
  if (!sec) return;
  const types = new Set();
  sec.subsections.forEach(sub => sub.items.forEach(it => types.add(it.type)));
  let html = `<div class="section-header"><h2><span class="section-icon">${sec.icon}</span>${sec.label}</h2></div>`;
  html += `<div class="section-intro">${sec.intro}</div>`;
  html += `<div class="filter-bar">`;
  html += `<button class="filter-btn${activeFilter === "all" ? " active" : ""}" data-filter="all">All</button>`;
  types.forEach(t => {
    html += `<button class="filter-btn${activeFilter === t ? " active" : ""}" data-filter="${t}">${t.charAt(0).toUpperCase() + t.slice(1)}</button>`;
  });
  html += `</div>`;
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
  mainEl.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => { activeFilter = btn.dataset.filter; render(); });
  });
}
searchIn.addEventListener("input", () => { searchQuery = searchIn.value.trim().toLowerCase(); render(); });
searchClr.addEventListener("click", () => { searchIn.value = ""; searchQuery = ""; render(); });
render();
