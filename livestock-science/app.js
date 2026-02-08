const TYPE_BADGES = {
  book: 'badge-book',
  notes: 'badge-notes',
  video: 'badge-video',
  course: 'badge-course',
  code: 'badge-code',
  data: 'badge-data'
};

const LEVEL_BADGES = {
  beginner: 'level-beginner',
  intermediate: 'level-intermediate',
  advanced: 'level-advanced'
};

const SECTIONS = [
  {
    id: 'overview',
    icon: '\u25C7',
    label: 'Overview',
    intro: `<p><strong>Livestock Science</strong> is a multidisciplinary field encompassing genetics, reproduction, nutrition, health, and management of domesticated animals raised for food, fiber, and exhibition. This reference hub is curated specifically around <strong>Charlotte's target vertical</strong> \u2014 show pig breeding and animal husbandry \u2014 a domain that sits at the intersection of applied quantitative genetics, precision nutrition, and competitive livestock exhibition.</p>
<h3>Why This Domain Matters for the FACT Architecture</h3>
<p>Show pig breeding represents a high-stakes, data-rich vertical where <strong>Expected Progeny Differences (EPDs)</strong>, phenotypic evaluations, nutritional protocols, and health management decisions all converge. The FACT architecture benefits from this domain because:</p>
<ul>
<li><strong>Quantitative trait selection</strong> \u2014 EPDs, heritabilities, and genetic correlations provide structured numerical data ideal for analytical pipelines</li>
<li><strong>Time-series production data</strong> \u2014 growth curves, feed conversion ratios, and reproductive records form natural longitudinal datasets</li>
<li><strong>Multi-objective optimization</strong> \u2014 balancing structural correctness, muscle expression, growth rate, and maternal traits mirrors complex decision systems</li>
<li><strong>Industry registry databases</strong> \u2014 NSR, ABA, and breed association records provide rich relational data</li>
</ul>
<h3>Scope of This Reference</h3>
<p>Resources span from foundational textbooks in animal genetics and reproductive physiology through applied show ring strategy guides and herd management software. Each section targets a specific knowledge domain relevant to Charlotte's operational needs, from mating system design to fitting and grooming protocols.</p>`,
    subsections: [
      {
        title: 'Foundational Texts',
        resources: [
          { title: 'Introduction to Quantitative Genetics', author: 'Falconer & Mackay', type: 'book', level: 'intermediate', url: 'https://www.pearson.com/en-us/subject-catalog/p/introduction-to-quantitative-genetics/P200000003561', desc: 'The definitive textbook on quantitative genetics \u2014 heritability, selection response, genetic correlations. Essential foundation for understanding EPDs and breeding value estimation.' },
          { title: 'Animal Breeding and Genetics', author: 'Julius van der Werf, et al. \u2014 University of New England', type: 'course', level: 'intermediate', url: 'https://jvanderw.une.edu.au/ABGbook/ABGbook.html', desc: 'Open-access animal breeding genetics textbook covering BLUP, genomic selection, and breeding program design for livestock species.' },
          { title: 'Pathways to Pregnancy and Parturition', author: 'P.L. Senger', type: 'book', level: 'intermediate', url: 'https://www.redlandspublishing.com/', desc: 'Comprehensive reproductive physiology textbook covering estrous cycles, pregnancy, and parturition across livestock species. Standard reference for swine reproduction.' },
          { title: 'Pork Industry Handbook', author: 'Purdue University Extension', type: 'notes', level: 'beginner', url: 'https://www.extension.purdue.edu/extmedia/pork-industry-handbook/', desc: 'Comprehensive collection of fact sheets covering all aspects of pork production \u2014 genetics, nutrition, health, facilities, and management.' },
          { title: 'Genetics and the Behavior of Domestic Animals', author: 'Temple Grandin & Mark Deesing', type: 'book', level: 'intermediate', url: 'https://www.elsevier.com/books/genetics-and-the-behavior-of-domestic-animals/grandin/978-0-12-394586-0', desc: 'Explores the genetic basis of behavior in livestock, including temperament and handling traits relevant to show ring performance.' },
          { title: 'Journal of Animal Science', author: 'American Society of Animal Science', type: 'notes', level: 'advanced', url: 'https://academic.oup.com/jas', desc: 'Premier peer-reviewed journal publishing research on animal genetics, nutrition, physiology, and management. Essential for staying current with swine science.' },
          { title: 'Livestock Science (Elsevier Journal)', author: 'Elsevier', type: 'notes', level: 'advanced', url: 'https://www.sciencedirect.com/journal/livestock-science', desc: 'International journal covering animal production science including breeding, nutrition, and welfare across all livestock species.' },
          { title: 'Swine Science', author: 'Palmer Holden & M.E. Ensminger', type: 'book', level: 'beginner', url: 'https://www.pearson.com/en-us/subject-catalog/p/swine-science/P200000003668', desc: 'Comprehensive introductory text covering swine breeds, genetics, reproduction, nutrition, health, and management. Ideal starting reference.' }
        ]
      }
    ]
  },
  {
    id: 'genetics',
    icon: '\u25CE',
    label: 'Genetics & Breeding',
    intro: `<p><strong>Genetics and breeding</strong> form the scientific backbone of show pig production. Selection decisions are driven by <strong>Expected Progeny Differences (EPDs)</strong> \u2014 statistical predictions of an animal's genetic merit for specific traits such as backfat thickness, loin muscle area, days to 250 lbs, and number born alive.</p>
<h3>Core Concepts</h3>
<ul>
<li><strong>Mendelian genetics</strong> \u2014 single-gene traits like coat color patterns (white belt in Hampshire, red/black in Duroc)</li>
<li><strong>Quantitative genetics</strong> \u2014 polygenic traits measured by heritability (h\u00B2), genetic correlations, and selection indices</li>
<li><strong>EPDs</strong> \u2014 breed-specific genetic evaluations published by registries (NSR, ABA); include accuracy values</li>
<li><strong>Heterosis (hybrid vigor)</strong> \u2014 crossbred advantage for reproductive and fitness traits, exploited in rotational and terminal crossing systems</li>
<li><strong>Crossbreeding systems</strong> \u2014 two-breed, three-breed rotational, and terminal cross designs that optimize both maternal and carcass traits</li>
</ul>
<h3>Key Breeds for Show</h3>
<p>Major show breeds include <strong>Yorkshire</strong>, <strong>Duroc</strong>, <strong>Hampshire</strong>, <strong>Berkshire</strong>, <strong>Chester White</strong>, <strong>Landrace</strong>, <strong>Poland China</strong>, and <strong>Spotted</strong>. Crossbred market hog classes also feature prominently at county fairs and national shows.</p>`,
    subsections: [
      {
        title: 'Textbooks & References',
        resources: [
          { title: 'Introduction to Quantitative Genetics', author: 'Falconer & Mackay', type: 'book', level: 'intermediate', url: 'https://www.pearson.com/en-us/subject-catalog/p/introduction-to-quantitative-genetics/P200000003561', desc: 'Gold-standard textbook on heritability, selection response (R = h\u00B2S), genetic drift, and inbreeding. Foundational for all EPD-based selection programs.' },
          { title: 'Understanding Animal Breeding', author: 'Richard M. Bourdon', type: 'book', level: 'intermediate', url: 'https://www.pearson.com/en-us/subject-catalog/p/understanding-animal-breeding/P200000003527', desc: 'Applied animal breeding textbook covering EPDs, accuracy, selection indices, mating systems, and breeding program design. Written with livestock producers in mind.' },
          { title: 'Genetics of Livestock Improvement', author: 'John F. Lasley', type: 'book', level: 'intermediate', url: 'https://www.pearson.com/en-us/subject-catalog/p/genetics-of-livestock-improvement/P200000003573', desc: 'Classic text on livestock genetics with practical applications for cattle and swine breeding programs. Covers both qualitative and quantitative traits.' },
          { title: 'Breeding and Genetics \u2014 National Swine Registry', author: 'NSR', type: 'notes', level: 'beginner', url: 'https://nationalswine.com/', desc: 'Breed registry for Yorkshire, Duroc, Hampshire, and Landrace. Publishes EPDs, sire summaries, and genetic trend data for registered seedstock.' }
        ]
      },
      {
        title: 'Breed Registries & Genetic Evaluation',
        resources: [
          { title: 'National Swine Registry (NSR)', author: 'NSR', type: 'data', level: 'beginner', url: 'https://nationalswine.com/', desc: 'Central registry for four major U.S. swine breeds. Provides EPDs for backfat, loin muscle area, days to 250, and number born alive. Maintains pedigree records.' },
          { title: 'American Berkshire Association (ABA)', author: 'ABA', type: 'data', level: 'beginner', url: 'https://americanberkshire.com/', desc: 'Breed registry for Berkshire hogs. Known for meat quality (pH, marbling, color). Publishes Berkshire-specific EPDs and maintains herd book records.' },
          { title: 'Certified Pedigreed Swine (CPS)', author: 'CPS', type: 'data', level: 'beginner', url: 'https://cpswine.com/', desc: 'Registry for Chester White, Poland China, and Spotted breeds. Publishes genetic evaluations and sire summaries for registered populations.' },
          { title: 'National Swine Improvement Federation (NSIF) Guidelines', author: 'NSIF', type: 'notes', level: 'intermediate', url: 'https://www.nsif.com/', desc: 'Industry guidelines for swine genetic evaluation, on-farm testing, ultrasound scanning protocols, and EPD calculation methodologies. Standard for seedstock programs.' }
        ]
      },
      {
        title: 'University Extension & Applied Genetics',
        resources: [
          { title: 'Swine Genetics \u2014 Iowa State Extension', author: 'Iowa State University', type: 'notes', level: 'beginner', url: 'https://www.extension.iastate.edu/ipic/swine-genetics', desc: 'Extension publications on crossbreeding systems, EPD interpretation, breed selection, and genetic improvement strategies for Iowa pork producers.' },
          { title: 'Swine Breeding and Gestation Management', author: 'Penn State Extension', type: 'notes', level: 'intermediate', url: 'https://extension.psu.edu/animals-and-livestock/swine', desc: 'Practical guides on mating management, boar selection, gilt development, and reproductive performance optimization for swine operations.' },
          { title: 'Applied Swine Genetics', author: 'Purdue University Extension', type: 'notes', level: 'intermediate', url: 'https://www.extension.purdue.edu/extmedia/AS/AS-SwineGenetics.html', desc: 'Extension publications covering heritability estimates for swine traits, use of EPDs in selection, and crossbreeding system design for commercial and seedstock herds.' },
          { title: 'Pig Genetics and Genomics', author: 'Max Rothschild \u2014 Iowa State University', type: 'book', level: 'advanced', url: 'https://www.cabidigitallibrary.org/doi/book/10.1079/9781845937560.0000', desc: 'Advanced reference covering molecular genetics, QTL mapping, marker-assisted selection, and genomic tools applied to swine improvement.' }
        ]
      }
    ]
  },
  {
    id: 'reproduction',
    icon: '\u2295',
    label: 'Reproduction',
    intro: `<p><strong>Reproductive biology</strong> is the rate-limiting factor in swine production. Understanding the estrous cycle, gestation physiology, and assisted reproduction technologies directly impacts genetic progress and herd productivity.</p>
<h3>Swine Reproductive Parameters</h3>
<ul>
<li><strong>Estrous cycle length</strong> \u2014 21 days (range 18\u201324); standing heat lasts 24\u201372 hours in gilts and sows</li>
<li><strong>Gestation length</strong> \u2014 114 days (3 months, 3 weeks, 3 days); range 111\u2013117 days</li>
<li><strong>Puberty (gilts)</strong> \u2014 5\u20138 months of age, influenced by boar exposure, nutrition, and photoperiod</li>
<li><strong>Litter size</strong> \u2014 breed-dependent; Yorkshire/Landrace average 10\u201314 born alive per litter</li>
<li><strong>Ovulation rate</strong> \u2014 15\u201325 ova per cycle in mature sows; embryonic mortality reduces this to born-alive count</li>
</ul>
<h3>Assisted Reproduction</h3>
<p><strong>Artificial insemination (AI)</strong> is standard in commercial swine production, with >90% of sows in the U.S. bred via AI. Extended semen doses allow widespread use of elite sires. <strong>Embryo transfer</strong> remains less common in swine than cattle due to surgical requirements, but is used in seedstock multiplication of high-value genetics.</p>`,
    subsections: [
      {
        title: 'Textbooks & Core References',
        resources: [
          { title: 'Pathways to Pregnancy and Parturition', author: 'P.L. Senger', type: 'book', level: 'intermediate', url: 'https://www.redlandspublishing.com/', desc: 'The standard reproductive physiology textbook for animal science programs. Covers neuroendocrine control, folliculogenesis, spermatogenesis, pregnancy, and parturition.' },
          { title: 'Reproduction in Domestic Animals (Hafez)', author: 'Hafez & Hafez', type: 'book', level: 'intermediate', url: 'https://www.wiley.com/en-us/Reproduction+in+Farm+Animals-p-9781118710289', desc: 'Classic reference covering comparative reproductive anatomy, endocrinology, and assisted reproduction across livestock species including detailed swine chapters.' },
          { title: 'Boar Stud Management & AI Techniques', author: 'Iowa State University Extension', type: 'notes', level: 'intermediate', url: 'https://www.extension.iastate.edu/ipic/', desc: 'Practical extension guides on semen collection, evaluation, extension, and insemination timing for swine AI programs. Includes protocols for on-farm use.' },
          { title: 'Control of Pig Reproduction (SRF Series)', author: 'Society for Reproduction and Fertility', type: 'book', level: 'advanced', url: 'https://www.cambridge.org/core/books/control-of-pig-reproduction/AA5D4EF7F6C5DEBD22F4C4F0AB88CD55', desc: 'Advanced reference on reproductive endocrinology, ovarian function, and technologies for controlling and synchronizing reproduction in swine.' }
        ]
      },
      {
        title: 'Applied Reproduction & Management',
        resources: [
          { title: 'Swine Reproduction Guide \u2014 PIC', author: 'PIC (Pig Improvement Company)', type: 'notes', level: 'intermediate', url: 'https://www.pic.com/resources/', desc: 'Technical bulletins on gilt development, estrus detection, AI timing, farrowing management, and reproductive benchmarks from a major genetics company.' },
          { title: 'Gilt Development and Breeding Management', author: 'National Hog Farmer', type: 'notes', level: 'beginner', url: 'https://www.nationalhogfarmer.com/reproduction', desc: 'Applied articles on gilt selection, boar exposure protocols, body condition targets, and breeding herd replacement strategies.' },
          { title: 'Swine Reproductive Physiology', author: 'University of Missouri Extension', type: 'notes', level: 'intermediate', url: 'https://extension.missouri.edu/programs/swine/', desc: 'Extension publications on estrous cycle management, heat detection, and reproductive failure diagnosis in commercial and seedstock swine operations.' },
          { title: 'Reproductive Technologies in Swine', author: 'Theriogenology (Journal)', type: 'notes', level: 'advanced', url: 'https://www.sciencedirect.com/journal/theriogenology', desc: 'Leading journal for animal reproduction research. Publishes studies on AI, embryo transfer, cryopreservation, and reproductive biotechnologies in swine.' }
        ]
      },
      {
        title: 'Hormones & Estrus Synchronization',
        resources: [
          { title: 'Matrix (Altrenogest) for Estrus Synchronization', author: 'Merck Animal Health', type: 'notes', level: 'intermediate', url: 'https://www.merck-animal-health-usa.com/species/swine', desc: 'Product information and protocols for altrenogest-based estrus synchronization in gilts. Standard tool for batch farrowing management in show and commercial herds.' },
          { title: 'Prostaglandin & Oxytocin Use in Swine Reproduction', author: 'Iowa State Veterinary Extension', type: 'notes', level: 'advanced', url: 'https://vetmed.iastate.edu/vdpam/new-vdpam-page/food-supply-veterinary-medicine/swine', desc: 'Veterinary protocols for prostaglandin-based parturition induction, oxytocin use during farrowing, and hormonal intervention for reproductive disorders.' },
          { title: 'Reproductive Failure in Swine \u2014 Diagnostic Approach', author: 'Pig Site / 5m Publishing', type: 'notes', level: 'intermediate', url: 'https://www.thepigsite.com/articles/reproductive-failure-in-swine', desc: 'Diagnostic decision trees for investigating reproductive failure \u2014 returns to estrus, small litters, mummified fetuses, abortions, and anestrus in sow herds.' }
        ]
      }
    ]
  },
  {
    id: 'nutrition',
    icon: '\u229B',
    label: 'Nutrition & Growth',
    intro: `<p><strong>Nutrition</strong> is the primary controllable input in swine production and show pig management. Feed represents 60\u201370% of total production cost, and nutritional management directly determines growth rate, body composition, and show ring appearance.</p>
<h3>Key Nutritional Metrics</h3>
<ul>
<li><strong>Feed Conversion Ratio (FCR)</strong> \u2014 lbs of feed per lb of gain; elite show pigs achieve 2.5\u20133.0:1</li>
<li><strong>Average Daily Gain (ADG)</strong> \u2014 target 1.8\u20132.2 lbs/day for market hogs; managed carefully in show pigs to hit target weights on show date</li>
<li><strong>Lysine:Calorie ratio</strong> \u2014 the first-limiting amino acid in swine diets; drives lean growth when properly balanced to metabolizable energy</li>
<li><strong>Phase feeding</strong> \u2014 adjusting nutrient density across growth phases (starter, grower, finisher) to match changing requirements</li>
</ul>
<h3>Show Pig Nutrition</h3>
<p>Show pig feeding programs emphasize <strong>muscle expression without excessive fat cover</strong>. This requires precise control of energy and lysine levels, strategic use of <strong>ractopamine (Paylean)</strong> where allowed, and careful monitoring of condition relative to show dates. Many exhibitors use specialized show feeds from companies like <strong>Purina Honor Show Chow</strong>, <strong>Kent Show Feed</strong>, and <strong>Lindner Show Feeds</strong>.</p>`,
    subsections: [
      {
        title: 'Core References & Standards',
        resources: [
          { title: 'Nutrient Requirements of Swine (NRC)', author: 'National Research Council', type: 'book', level: 'advanced', url: 'https://nap.nationalacademies.org/catalog/13298/nutrient-requirements-of-swine-eleventh-revised-edition', desc: 'The authoritative reference for swine nutrient requirements. Provides detailed tables for energy, amino acids, minerals, and vitamins across all production stages. 11th Revised Edition.' },
          { title: 'Applied Animal Nutrition', author: 'Peter Cheeke & Ellen Dierenfeld', type: 'book', level: 'intermediate', url: 'https://www.pearson.com/en-us/subject-catalog/p/applied-animal-nutrition-feeds-and-feeding/P200000003507', desc: 'Comprehensive animal nutrition textbook covering digestive physiology, feedstuffs, ration formulation, and species-specific nutrition including swine.' },
          { title: 'Swine Nutrition Guide', author: 'Kansas State University', type: 'notes', level: 'intermediate', url: 'https://www.asi.k-state.edu/research-and-extension/swine/', desc: 'K-State applied swine nutrition publications covering diet formulation, amino acid requirements, feed additives, and grow-finish feeding programs.' },
          { title: 'Swine Nutrition', author: 'Austin Lewis & Lee Southern', type: 'book', level: 'advanced', url: 'https://www.taylorfrancis.com/books/edit/10.1201/9781315381473/swine-nutrition-austin-lewis-lee-southern', desc: 'Advanced reference text covering amino acid nutrition, energy metabolism, mineral and vitamin requirements, and feed processing effects in swine.' }
        ]
      },
      {
        title: 'Show Pig Feeding & Growth Management',
        resources: [
          { title: 'Honor Show Chow Feeding Guide', author: 'Purina Animal Nutrition', type: 'notes', level: 'beginner', url: 'https://www.purinamills.com/show-animal-feed/products/show-pig-feed', desc: 'Product line and feeding guides for the Honor Show Chow show pig feed program. Includes phase-feeding recommendations and body condition management tips.' },
          { title: 'Show Pig Nutrition and Feeding', author: 'Texas A&M AgriLife Extension', type: 'notes', level: 'beginner', url: 'https://animalscience.tamu.edu/extension/swine/', desc: 'Extension guide on show pig feeding programs covering feed selection, feeding schedules, and nutritional strategies to optimize muscle and condition for the show ring.' },
          { title: 'Growth Curves and Feed Management', author: 'Iowa State Extension \u2014 IPIC', type: 'notes', level: 'intermediate', url: 'https://www.extension.iastate.edu/ipic/nutrition', desc: 'Publications on modeling swine growth curves, adjusting feed intake for target weight and condition, and using ADG projections for show date planning.' },
          { title: 'Feed Additives and Growth Promotants in Swine', author: 'University of Kentucky Extension', type: 'notes', level: 'intermediate', url: 'https://afs.ca.uky.edu/swine', desc: 'Extension guide covering feed additives including antibiotics, probiotics, organic acids, and beta-agonists (ractopamine) in swine diets. Includes withdrawal times and show rules.' }
        ]
      },
      {
        title: 'Feed Science & Formulation Tools',
        resources: [
          { title: 'Feedstuffs Magazine & Database', author: 'Feedstuffs', type: 'data', level: 'intermediate', url: 'https://www.feedstuffs.com/', desc: 'Industry publication and ingredient database covering feed markets, ingredient analysis, and ration formulation tools for livestock nutritionists.' },
          { title: 'INRA-CIRAD-AFZ Feed Tables', author: 'INRA/AFZ', type: 'data', level: 'advanced', url: 'https://www.feedtables.com/', desc: 'Comprehensive online database of feed ingredient composition including amino acid profiles, digestibility coefficients, and energy values for swine diet formulation.' },
          { title: 'Swine Diet Formulation \u2014 Spreadsheet Tools', author: 'University of Minnesota Extension', type: 'code', level: 'intermediate', url: 'https://extension.umn.edu/swine-nutrition-and-feed', desc: 'Downloadable spreadsheet tools for swine diet formulation using linear programming. Includes ingredient databases and nutrient requirement tables.' }
        ]
      }
    ]
  },
  {
    id: 'show',
    icon: '\u229E',
    label: 'Show Industry',
    intro: `<p>The <strong>show pig industry</strong> combines livestock evaluation skills, animal husbandry, and competitive showmanship into a demanding performance arena. From county fairs to national expositions like the <strong>World Pork Expo</strong>, <strong>National Western Stock Show</strong>, and <strong>NAILE (North American International Livestock Exposition)</strong>, exhibitors must master animal selection, fitting, feeding, and ring presentation.</p>
<h3>Judging Criteria</h3>
<p>Market hogs are evaluated on:</p>
<ul>
<li><strong>Structural correctness</strong> \u2014 skeletal soundness, joint angles, feet and leg structure, free and fluid movement</li>
<li><strong>Muscle shape and expression</strong> \u2014 loin and ham development, width of base, muscling through the center body</li>
<li><strong>Volume and capacity</strong> \u2014 rib shape, body depth, gut capacity, spring of rib</li>
<li><strong>Lean growth</strong> \u2014 overall growth pattern, leanness, absence of excess fat</li>
<li><strong>Balance and eye appeal</strong> \u2014 overall proportion, levelness, style, and attractiveness</li>
</ul>
<h3>Breeding gilts</h3>
<p>Breeding classes additionally evaluate <strong>femininity</strong>, <strong>underline quality</strong> (teat placement, number, and spacing), <strong>reproductive potential</strong>, and <strong>maternal characteristics</strong>.</p>`,
    subsections: [
      {
        title: 'Showmanship & Exhibition Guides',
        resources: [
          { title: '4-H Swine Showmanship Guide', author: 'Ohio State University Extension', type: 'notes', level: 'beginner', url: 'https://ohio4h.org/animals/swine', desc: 'Comprehensive 4-H showmanship guide covering pig handling, driving techniques, positioning for the judge, and show ring etiquette for youth exhibitors.' },
          { title: 'FFA Livestock Evaluation Career Development Event', author: 'National FFA Organization', type: 'notes', level: 'beginner', url: 'https://www.ffa.org/cde-lde-descriptions/', desc: 'Official FFA livestock evaluation CDE materials including judging rubrics, oral reasons frameworks, and practice classes for swine evaluation.' },
          { title: 'Fitting and Grooming Show Pigs', author: 'Purdue University Extension', type: 'notes', level: 'beginner', url: 'https://www.extension.purdue.edu/extmedia/4H/4H-Swine.html', desc: 'Step-by-step guide to show pig preparation including washing, clipping, skin conditioning, and day-of-show grooming techniques.' },
          { title: 'Show Ring Success \u2014 The Showman\'s Guide', author: 'Sullivan Supply', type: 'notes', level: 'beginner', url: 'https://sullivansupply.com/', desc: 'Industry-leading show supply company providing educational resources, video tutorials, and product guides for fitting and grooming across species including swine.' }
        ]
      },
      {
        title: 'Livestock Judging & Evaluation',
        resources: [
          { title: 'Livestock Judging Manual', author: 'Oklahoma State University', type: 'notes', level: 'intermediate', url: 'https://extension.okstate.edu/programs/4-h-youth-development/livestock/', desc: 'Comprehensive livestock judging manual covering market hog evaluation, breeding gilt selection, oral reasons delivery, and comparative terminology for swine classes.' },
          { title: 'Evaluating and Grading Swine', author: 'USDA Agricultural Marketing Service', type: 'notes', level: 'intermediate', url: 'https://www.ams.usda.gov/grades-standards/swine', desc: 'Official USDA grading standards for barrows and gilts. Covers yield grades, quality grades, and carcass evaluation criteria used in industry and contest grading.' },
          { title: 'Visual Appraisal of Market Hogs', author: 'University of Nebraska Extension', type: 'notes', level: 'intermediate', url: 'https://beef.unl.edu/cattleproduction/livestock-judging', desc: 'Guide to visual evaluation of market hogs covering structural soundness assessment, muscling evaluation, and lean growth prediction from live animal appraisal.' },
          { title: 'Oral Reasons \u2014 A Guide to Livestock Judging', author: 'Texas A&M Meat Science', type: 'notes', level: 'intermediate', url: 'https://animalscience.tamu.edu/academics/meat-science/', desc: 'Framework for delivering oral reasons in livestock judging contests including terminology, structure (grant-initial-middle-final), and comparative language for swine classes.' }
        ]
      },
      {
        title: 'Major Shows & Industry Organizations',
        resources: [
          { title: 'World Pork Expo', author: 'National Pork Producers Council', type: 'data', level: 'beginner', url: 'https://www.worldpork.org/', desc: 'The largest pork-specific trade show and exhibition in the world, held annually in Des Moines, Iowa. Features junior and open swine shows, educational seminars, and trade exhibits.' },
          { title: 'North American International Livestock Exposition (NAILE)', author: 'Kentucky State Fair Board', type: 'data', level: 'beginner', url: 'https://livestockexpo.org/', desc: 'One of the largest purebred livestock shows in North America held annually in Louisville, KY. Premier venue for show pig competition and genetics showcasing.' },
          { title: 'Team Purebred', author: 'Team Purebred', type: 'notes', level: 'beginner', url: 'https://teampurebred.com/', desc: 'National junior swine organization providing point-based recognition for youth exhibitors showing registered purebred swine across sanctioned shows.' },
          { title: 'Showpig.com', author: 'Showpig.com', type: 'data', level: 'beginner', url: 'https://showpig.com/', desc: 'Industry marketplace and community hub for show pig breeders and exhibitors. Includes sale listings, show results, breeder directories, and industry news.' }
        ]
      }
    ]
  },
  {
    id: 'herd',
    icon: '\u25C8',
    label: 'Herd Management',
    intro: `<p><strong>Herd management</strong> encompasses the systematic practices of record keeping, health protocols, facility management, and production analytics that drive efficient swine operations. For show pig breeders, rigorous management systems enable data-driven mating decisions, health tracking, and performance benchmarking.</p>
<h3>Key Management Areas</h3>
<ul>
<li><strong>Record keeping</strong> \u2014 pedigree records, performance data (birth weights, weaning weights, ADG), health events, and breeding records form the basis of genetic evaluation and management decisions</li>
<li><strong>Herd health protocols</strong> \u2014 vaccination schedules, deworming programs, biosecurity SOPs, and veterinary relationships ensure herd stability</li>
<li><strong>Biosecurity</strong> \u2014 isolation procedures, visitor protocols, load-out facilities, and disease monitoring prevent catastrophic health breaks</li>
<li><strong>Facility design</strong> \u2014 farrowing crates/pens, nursery environments, grow-finish barns, and show barn layouts optimized for animal welfare and management efficiency</li>
<li><strong>Production metrics</strong> \u2014 pigs weaned per sow per year, pre-weaning mortality, feed efficiency, and days to market weight track operational performance</li>
</ul>`,
    subsections: [
      {
        title: 'Record Keeping & Data Management',
        resources: [
          { title: 'PigCHAMP', author: 'PigCHAMP Inc.', type: 'code', level: 'intermediate', url: 'https://www.pigchamp.com/', desc: 'Industry-standard swine herd management software. Tracks reproductive performance, production metrics, health events, and generates benchmarking reports for sow herds.' },
          { title: 'Easy Pig', author: 'Agritec Software', type: 'code', level: 'beginner', url: 'https://www.easypig.com/', desc: 'Cloud-based pig herd management system designed for smaller operations. Tracks breeding, farrowing, growth, and health records with mobile access.' },
          { title: 'Swine Management Services Benchmarking', author: 'Swine Management Services', type: 'data', level: 'intermediate', url: 'https://www.swinems.com/', desc: 'SMS publishes quarterly benchmarking reports comparing reproductive and production performance metrics across U.S. sow farms. Establishes industry KPI targets.' },
          { title: 'Record Keeping for Show Pig Operations', author: 'University of Illinois Extension', type: 'notes', level: 'beginner', url: 'https://extension.illinois.edu/animals-and-livestock', desc: 'Extension guide on essential records for show pig breeders including pedigree tracking, performance records, health logs, and financial record-keeping for youth projects.' }
        ]
      },
      {
        title: 'Biosecurity & Health Protocols',
        resources: [
          { title: 'Secure Pork Supply Plan', author: 'USDA APHIS / Iowa State', type: 'notes', level: 'intermediate', url: 'https://www.securepork.org/', desc: 'National biosecurity framework for swine operations. Includes site-specific biosecurity plans, movement controls, and business continuity guidance for disease outbreak scenarios.' },
          { title: 'Pork Quality Assurance Plus (PQA Plus)', author: 'National Pork Board', type: 'notes', level: 'beginner', url: 'https://porkcheckoff.org/certification-programs/pqa-plus/', desc: 'Industry certification program covering animal welfare, food safety, and on-farm management practices. Required for many show exhibitions and commercial marketing channels.' },
          { title: 'Swine Biosecurity Protocols', author: 'American Association of Swine Veterinarians', type: 'notes', level: 'intermediate', url: 'https://www.aasv.org/resources/', desc: 'AASV guidelines on entry protocols, shower-in/shower-out procedures, downtime requirements, and transport biosecurity for maintaining herd health status.' }
        ]
      },
      {
        title: 'Facility Design & Environment',
        resources: [
          { title: 'Swine Housing and Equipment Handbook', author: 'Midwest Plan Service (MWPS)', type: 'book', level: 'intermediate', url: 'https://www-mwps.sws.iastate.edu/', desc: 'Engineering reference for swine facility design including ventilation, heating, flooring, pen layouts, and environmental control systems for all production stages.' },
          { title: 'Small-Scale Swine Facility Design', author: 'Penn State Extension', type: 'notes', level: 'beginner', url: 'https://extension.psu.edu/animals-and-livestock/swine', desc: 'Facility design guide scaled for small and show pig operations covering barn layouts, pen sizes, ventilation basics, and manure management for 10\u2013100 sow operations.' },
          { title: 'Environmental Management in Swine Production', author: 'North Carolina State Extension', type: 'notes', level: 'intermediate', url: 'https://swine.ces.ncsu.edu/', desc: 'Extension resources on temperature management, ventilation design, waste handling, and environmental regulations affecting swine facility operations.' }
        ]
      }
    ]
  },
  {
    id: 'veterinary',
    icon: '\u2B21',
    label: 'Veterinary Science',
    intro: `<p><strong>Veterinary science</strong> for swine focuses on disease prevention, diagnosis, and treatment protocols essential to maintaining herd health and show eligibility. Show pig operations face unique challenges at the interface of biosecurity (exposure at shows and sales) and animal welfare requirements.</p>
<h3>Major Swine Diseases</h3>
<ul>
<li><strong>PRRS (Porcine Reproductive and Respiratory Syndrome)</strong> \u2014 the most economically significant swine disease in the U.S., causing reproductive failure and respiratory disease. Estimated >$660 million annual industry losses.</li>
<li><strong>PED (Porcine Epidemic Diarrhea)</strong> \u2014 highly contagious coronavirus causing severe diarrhea and high mortality in neonatal piglets. Emerged in U.S. in 2013.</li>
<li><strong>TGE (Transmissible Gastroenteritis)</strong> \u2014 another coronavirus causing diarrhea, vomiting, and dehydration. Particularly severe in piglets under 2 weeks.</li>
<li><strong>Mycoplasma hyopneumoniae</strong> \u2014 chronic respiratory pathogen causing enzootic pneumonia and reduced growth performance.</li>
<li><strong>Swine Influenza (SIV)</strong> \u2014 endemic respiratory virus with multiple subtypes (H1N1, H3N2, H1N2) causing acute respiratory disease.</li>
<li><strong>Erysipelas</strong> \u2014 bacterial infection (Erysipelothrix rhusiopathiae) causing diamond skin lesions, arthritis, and endocarditis.</li>
</ul>
<h3>Preventive Medicine</h3>
<p>Vaccination programs, strategic deworming, and biosecurity protocols form the foundation of preventive health. Show pigs require additional attention to skin conditions, lameness prevention, and stress management related to transport and exhibition.</p>`,
    subsections: [
      {
        title: 'Core Veterinary References',
        resources: [
          { title: 'Diseases of Swine', author: 'Zimmerman, Karriker, Ramirez, Schwartz & Stevenson', type: 'book', level: 'advanced', url: 'https://www.wiley.com/en-us/Diseases+of+Swine%2C+11th+Edition-p-9781119350927', desc: 'The definitive veterinary reference for swine diseases. 11th edition covers infectious, metabolic, and toxicologic diseases with detailed diagnosis, treatment, and prevention protocols.' },
          { title: 'Merck Veterinary Manual \u2014 Swine', author: 'Merck & Co.', type: 'notes', level: 'intermediate', url: 'https://www.merckvetmanual.com/management-and-nutrition/management-of-pigs', desc: 'Free online veterinary reference covering swine diseases, nutrition, management, and pharmacology. Continuously updated by veterinary experts.' },
          { title: 'The Pig Site \u2014 Disease Reference', author: '5m Publishing', type: 'notes', level: 'intermediate', url: 'https://www.thepigsite.com/disease-guide/', desc: 'Online disease reference guide with detailed entries for each major swine disease including clinical signs, diagnosis, treatment, and prevention strategies.' },
          { title: 'Swine Disease Manual', author: 'American Association of Swine Veterinarians', type: 'book', level: 'intermediate', url: 'https://www.aasv.org/swine-disease-manual/', desc: 'Pocket reference for field veterinarians covering clinical identification, differential diagnosis, and treatment protocols for common swine diseases.' }
        ]
      },
      {
        title: 'Vaccination & Preventive Medicine',
        resources: [
          { title: 'Swine Vaccination Guidelines', author: 'Iowa State Veterinary Diagnostic Lab', type: 'notes', level: 'intermediate', url: 'https://vetmed.iastate.edu/vdpam/new-vdpam-page/food-supply-veterinary-medicine/swine/swine-diseases', desc: 'Evidence-based vaccination recommendations for commercial and seedstock swine herds including timing, routes, and product selection for major swine pathogens.' },
          { title: 'PRRS Elimination and Control Strategies', author: 'Swine Health Information Center (SHIC)', type: 'notes', level: 'advanced', url: 'https://www.swinehealth.org/prrs/', desc: 'Comprehensive PRRS resource including regional elimination strategies, load-close-expose protocols, McREBEL procedures, and area/regional control programs.' },
          { title: 'Internal and External Parasites of Swine', author: 'University of Kentucky Extension', type: 'notes', level: 'intermediate', url: 'https://afs.ca.uky.edu/swine', desc: 'Extension guide on common swine parasites (Ascaris, Trichuris, Sarcoptic mange) including identification, treatment protocols, deworming schedules, and resistance management.' },
          { title: 'Antibiotic Use and Stewardship in Swine', author: 'National Pork Board', type: 'notes', level: 'intermediate', url: 'https://porkcheckoff.org/certification-programs/', desc: 'Industry guidelines on responsible antibiotic use including VFD (Veterinary Feed Directive) requirements, withdrawal times, and antimicrobial stewardship principles.' }
        ]
      },
      {
        title: 'Show-Related Health Management',
        resources: [
          { title: 'Health Requirements for Swine Exhibition', author: 'USDA APHIS VS', type: 'notes', level: 'beginner', url: 'https://www.aphis.usda.gov/aphis/ourfocus/animalhealth/nvap/NVAP-Reference-Guide/Animal-Specific/Swine', desc: 'Federal and state health certificate requirements, testing protocols (brucellosis, pseudorabies), and import/export regulations for exhibition swine.' },
          { title: 'Swine Show Health and Biosecurity', author: 'Ohio State University Extension', type: 'notes', level: 'beginner', url: 'https://ohio4h.org/animals/swine', desc: 'Guide for youth exhibitors on pre-show health checks, post-show isolation protocols, and biosecurity practices to protect home herds from show-acquired pathogens.' },
          { title: 'Common Skin Conditions in Show Pigs', author: 'Michigan State University Extension', type: 'notes', level: 'beginner', url: 'https://www.canr.msu.edu/swine/', desc: 'Identification and treatment of skin conditions affecting show pigs including mange, ringworm, greasy pig disease, sunburn, and pityriasis rosea.' }
        ]
      }
    ]
  },
  {
    id: 'datasets',
    icon: '\u262C',
    label: 'Datasets & Software',
    intro: `<p><strong>Data and software tools</strong> are increasingly central to modern swine production and show pig breeding. From USDA market reports to breed registry databases and herd management platforms, data-driven decision making separates elite programs from the rest.</p>
<h3>Data Sources</h3>
<ul>
<li><strong>USDA NASS</strong> \u2014 National Agricultural Statistics Service provides quarterly hogs and pigs reports, slaughter data, prices, and production statistics</li>
<li><strong>Breed registries</strong> \u2014 NSR, ABA, and CPS maintain pedigree databases, EPD records, and genetic trend analyses for registered swine populations</li>
<li><strong>University research farms</strong> \u2014 Iowa State, Purdue, NC State, and other land-grant universities publish research datasets and benchmarking data</li>
</ul>
<h3>Software Ecosystem</h3>
<p>Herd management software (PigCHAMP, MetaFarms), genetic evaluation systems (STAGES, NSIF-compatible platforms), and ration formulation tools form the technological infrastructure of modern swine operations. Increasingly, <strong>genomic selection platforms</strong> incorporating SNP chip data are being adopted by progressive seedstock producers.</p>`,
    subsections: [
      {
        title: 'Government & Industry Data',
        resources: [
          { title: 'USDA NASS \u2014 Hogs and Pigs Report', author: 'USDA National Agricultural Statistics Service', type: 'data', level: 'beginner', url: 'https://usda.library.cornell.edu/concern/publications/rj430453j', desc: 'Quarterly report on U.S. swine inventory, breeding herd size, pig crop, and farrowing intentions. Essential market intelligence for production planning and breeding decisions.' },
          { title: 'USDA ERS \u2014 Hog and Pork Sector Data', author: 'USDA Economic Research Service', type: 'data', level: 'intermediate', url: 'https://www.ers.usda.gov/topics/animal-products/hogs-pork/', desc: 'Economic research data on pork production costs, trade, per capita consumption, farm-to-retail price spreads, and industry structure analysis.' },
          { title: 'USDA Market News \u2014 Swine Reports', author: 'USDA AMS Market News', type: 'data', level: 'beginner', url: 'https://www.ams.usda.gov/market-news/livestock-poultry-grain', desc: 'Daily and weekly market reports including negotiated hog prices, cutout values, slaughter data, and carcass merit premiums/discounts.' },
          { title: 'National Pork Board Research Database', author: 'National Pork Board (Checkoff)', type: 'data', level: 'intermediate', url: 'https://porkcheckoff.org/pork-production/research/', desc: 'Searchable database of checkoff-funded research projects covering genetics, nutrition, health, welfare, and pork quality. Includes final reports and producer-facing summaries.' }
        ]
      },
      {
        title: 'Genetic Evaluation & Genomics Software',
        resources: [
          { title: 'NSIF Swine Genetic Evaluation Programs', author: 'National Swine Improvement Federation', type: 'code', level: 'intermediate', url: 'https://www.nsif.com/', desc: 'NSIF guidelines and standards for on-farm performance testing, central test station protocols, ultrasound scanning, and genetic evaluation methodologies across U.S. swine breeds.' },
          { title: 'BLUPF90 Family of Programs', author: 'Ignacy Misztal \u2014 University of Georgia', type: 'code', level: 'advanced', url: 'http://nce.ads.uga.edu/wiki/doku.php?id=readme.blupf90', desc: 'Suite of programs for genetic evaluation including BLUP, REML variance component estimation, and single-step genomic BLUP (ssGBLUP). Widely used in livestock breeding research.' },
          { title: 'Neogen GeneSeek Genomic Profiler (GGP) Porcine', author: 'Neogen Corporation', type: 'data', level: 'advanced', url: 'https://www.neogen.com/categories/genomics/ggp-porcine/', desc: 'Commercial SNP genotyping arrays for pigs (GGP Porcine HD: ~62K SNPs). Used for genomic selection, parentage verification, and genetic defect screening in seedstock programs.' },
          { title: 'AGIL (Animal Genomics and Improvement Laboratory)', author: 'USDA ARS', type: 'data', level: 'advanced', url: 'https://www.ars.usda.gov/northeast-area/beltsville-md-barc/beltsville-agricultural-research-center/agil/', desc: 'USDA research lab developing genomic evaluation methods for livestock. Publishes research on genetic evaluation accuracy, genomic prediction, and breed composition estimation.' }
        ]
      },
      {
        title: 'Herd Management & Production Software',
        resources: [
          { title: 'PigCHAMP', author: 'PigCHAMP Inc.', type: 'code', level: 'intermediate', url: 'https://www.pigchamp.com/', desc: 'Comprehensive sow herd management system tracking breeding, farrowing, weaning, and health events. Industry benchmark data enables performance comparison across operations.' },
          { title: 'MetaFarms', author: 'MetaFarms Inc.', type: 'code', level: 'intermediate', url: 'https://www.metafarms.com/', desc: 'Cloud-based livestock production platform for record keeping, compliance reporting, and production analytics. Integrates sow farm, nursery, and finisher data across multi-site operations.' },
          { title: 'Iowa State \u2014 Iowa Pork Industry Center', author: 'Iowa State University', type: 'data', level: 'beginner', url: 'https://www.ipic.iastate.edu/', desc: 'Central resource hub for Iowa pork production data, extension publications, management tools, and decision aids from Iowa State University\u2019s pork industry center.' },
          { title: 'Pig Improvement Company (PIC) Technical Resources', author: 'PIC / Genus plc', type: 'notes', level: 'intermediate', url: 'https://www.pic.com/resources/', desc: 'Technical bulletins, management guides, and production benchmarks from one of the world\u2019s largest swine genetics companies. Covers nutrition, reproduction, and health management.' }
        ]
      }
    ]
  }
];

let activeSection = SECTIONS[0].id;
let activeFilter = 'all';
let searchQuery = '';

function init() {
  renderTabs();
  renderContent();
  updateStats();
  bindEvents();
}

function renderTabs() {
  const tabBar = document.getElementById('tab-bar');
  tabBar.innerHTML = SECTIONS.map(s =>
    `<button class="tab-btn ${s.id === activeSection ? 'active' : ''}" data-section="${s.id}">
      <span class="tab-icon">${s.icon}</span>
      <span class="tab-label">${s.label}</span>
    </button>`
  ).join('');

  tabBar.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSection = btn.dataset.section;
      activeFilter = 'all';
      searchQuery = '';
      document.getElementById('search-input').value = '';
      renderTabs();
      renderContent();
    });
  });
}

function renderContent() {
  const section = SECTIONS.find(s => s.id === activeSection);
  if (!section) return;

  const types = new Set();
  section.subsections.forEach(sub => sub.resources.forEach(r => types.add(r.type)));

  let html = `<div class="section-header"><h2><span class="section-icon">${section.icon}</span>${section.label}</h2></div>`;
  html += `<div class="section-intro">${section.intro}</div>`;

  html += `<div class="filter-bar">`;
  html += `<button class="filter-btn ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>`;
  types.forEach(t => {
    html += `<button class="filter-btn ${activeFilter === t ? 'active' : ''}" data-filter="${t}">${t}</button>`;
  });
  html += `</div>`;

  section.subsections.forEach(sub => {
    const filtered = filterResources(sub.resources);
    if (filtered.length === 0) return;
    html += `<div class="subsection"><h3>${sub.title}</h3><div class="card-grid">`;
    filtered.forEach(r => { html += renderCard(r); });
    html += `</div></div>`;
  });

  document.getElementById('main-content').innerHTML = html;
  bindFilters();
}

function filterResources(resources) {
  return resources.filter(r => {
    if (activeFilter !== 'all' && r.type !== activeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) ||
             r.author.toLowerCase().includes(q) ||
             r.desc.toLowerCase().includes(q);
    }
    return true;
  });
}

function renderCard(r) {
  const typeBadge = TYPE_BADGES[r.type] || 'badge-book';
  const levelBadge = LEVEL_BADGES[r.level] || 'level-beginner';
  const title = highlightMatch(r.title);
  const author = highlightMatch(r.author);
  const desc = highlightMatch(r.desc);

  return `<a class="card" href="${r.url}" target="_blank" rel="noopener noreferrer">
    <div class="card-top">
      <span class="type-badge ${typeBadge}">${r.type}</span>
      <span class="level-badge ${levelBadge}">${r.level}</span>
    </div>
    <div class="card-title">${title}</div>
    <div class="card-author">${author}</div>
    <div class="card-desc">${desc}</div>
  </a>`;
}

function highlightMatch(text) {
  if (!searchQuery) return text;
  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function updateStats() {
  let count = 0;
  SECTIONS.forEach(s => s.subsections.forEach(sub => { count += sub.resources.length; }));
  document.getElementById('stat-count').textContent = count;
}

function bindEvents() {
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');

  input.addEventListener('input', () => {
    searchQuery = input.value.trim();
    renderContent();
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    searchQuery = '';
    renderContent();
    input.focus();
  });
}

function bindFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      renderContent();
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
