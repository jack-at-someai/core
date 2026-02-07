/* ============================================
   Show Animal Skill Tree — Species Data
   Helper: polar(angle_degrees, ring_radius) → {x, y}
   ============================================ */
function polar(deg, r) {
  const rad = (deg - 90) * Math.PI / 180; // -90 so 0° = top
  return { x: Math.round(r * Math.cos(rad)), y: Math.round(r * Math.sin(rad)) };
}

function N(id, deg, ring, type, name, category, description, bonuses, age, note) {
  const {x, y} = polar(deg, ring);
  return { id, x, y, type, name, category, description, bonuses: bonuses || [], age: age || '', note: note || '', allocated: false };
}

function E(from, to) { return { from, to }; }

/* ============================================
   AGE RINGS
   ============================================ */
const AGE_RINGS = {
  pig: [
    { radius: 0, label: 'Birth' },
    { radius: 130, label: '0-2 Weeks' },
    { radius: 260, label: '2-8 Weeks' },
    { radius: 400, label: '8-16 Weeks' },
    { radius: 540, label: '4-6 Months' },
    { radius: 680, label: '6-9 Months' },
    { radius: 830, label: '9-12 Months' },
    { radius: 970, label: '12-18 Months' },
    { radius: 1100, label: '18+ Months' }
  ],
  cattle: [
    { radius: 0, label: 'Birth' },
    { radius: 120, label: '0-2 Weeks' },
    { radius: 240, label: '1-3 Months' },
    { radius: 380, label: '3-6 Months' },
    { radius: 520, label: '6-12 Months' },
    { radius: 660, label: '12-18 Months' },
    { radius: 810, label: '18-24 Months' },
    { radius: 960, label: '2-3 Years' },
    { radius: 1100, label: '3+ Years' }
  ],
  sheep: [
    { radius: 0, label: 'Birth' },
    { radius: 130, label: '0-2 Weeks' },
    { radius: 260, label: '2-8 Weeks' },
    { radius: 400, label: '2-4 Months' },
    { radius: 540, label: '4-6 Months' },
    { radius: 680, label: '6-9 Months' },
    { radius: 830, label: '9-12 Months' },
    { radius: 1000, label: '1-2 Years' },
    { radius: 1100, label: '2+ Years' }
  ],
  goat: [
    { radius: 0, label: 'Birth' },
    { radius: 130, label: '0-2 Weeks' },
    { radius: 260, label: '2-8 Weeks' },
    { radius: 400, label: '2-4 Months' },
    { radius: 540, label: '4-6 Months' },
    { radius: 680, label: '6-9 Months' },
    { radius: 830, label: '9-12 Months' },
    { radius: 1000, label: '1-2 Years' },
    { radius: 1100, label: '2+ Years' }
  ],
  horse: [
    { radius: 0, label: 'Birth' },
    { radius: 120, label: '0-1 Month' },
    { radius: 240, label: '1-6 Months' },
    { radius: 370, label: '6-12 Months' },
    { radius: 500, label: '1-2 Years' },
    { radius: 640, label: '2-3 Years' },
    { radius: 790, label: '3-5 Years' },
    { radius: 940, label: '5-10 Years' },
    { radius: 1100, label: '10+ Years' }
  ]
};

/* ============================================
   SWINE TREE
   Gilt path = left (240°-320°)
   Barrow path = right (40°-120°)
   Boar path = bottom (150°-210°)
   Shared/health/nutrition = top gaps & bridges
   ============================================ */
const PIG_NODES = [
  // ── CENTER ──
  N('p_birth', 0, 0, 'keystone', 'Birth', 'genetics',
    'The journey begins. A piglet is born with its genetic potential already determined by its sire and dam. Every decision from here shapes its trajectory.',
    ['Genetic potential established', 'Dam genetics inherited', 'Sire genetics inherited'], '0 days'),

  // ── RING 1: Neonatal (0-2 weeks) ──
  N('p_colostrum', 0, 130, 'notable', 'Colostrum Intake', 'health',
    'Critical first feeding within 6 hours of birth. Colostrum provides maternal antibodies essential for immune system development.',
    ['Passive immunity acquired', '+50% disease resistance (first 3 weeks)', 'Gut health foundation'], '0-6 hours'),
  N('p_navel', 45, 130, 'minor', 'Navel Care', 'health',
    'Disinfecting the navel prevents bacterial infection entry. Iodine dip within first hour.',
    ['Infection risk reduced'], '0-12 hours'),
  N('p_heat', 315, 130, 'minor', 'Heat Management', 'management',
    'Neonatal pigs cannot regulate body temperature. Heat lamps and bedding are critical for survival.',
    ['Thermoregulation supported'], '0-7 days'),
  N('p_birthwt', 90, 130, 'minor', 'Birth Weight Assessment', 'conformation',
    'Record birth weight as a baseline metric. Heavier birth weights correlate with faster growth potential.',
    ['Baseline weight recorded', 'Growth curve started'], '0-1 day'),
  N('p_teat', 270, 130, 'minor', 'Teat Order Establishment', 'nutrition',
    'Piglets naturally establish a nursing order within the first days. Consistent access to productive teats supports even growth.',
    ['Nursing position secured'], '1-3 days'),

  // ── RING 2: Nursing (2-8 weeks) ──
  N('p_creep', 350, 260, 'notable', 'Creep Feed Introduction', 'nutrition',
    'Introducing solid feed at 2-3 weeks supplements dam milk. Stimulates digestive development and eases weaning transition.',
    ['Digestive system development', 'Weaning stress reduced', 'Growth rate boost'], '2-3 weeks'),
  N('p_iron', 30, 260, 'minor', 'Iron Supplementation', 'health',
    'Injectable iron at 3-5 days prevents anemia. Indoor piglets have no access to soil iron.',
    ['Anemia prevented', 'Oxygen transport optimized'], '3-5 days'),
  N('p_handling', 310, 260, 'minor', 'Early Handling', 'training',
    'Regular human contact from an early age builds trust. Gentle handling creates a calmer, more trainable animal.',
    ['Human trust established', 'Temperament improved'], '1-4 weeks'),
  N('p_sex_decide', 180, 260, 'keystone', 'Sex Classification', 'genetics',
    'The defining fork: intact males become boar prospects, castrated males become barrows, and females enter the gilt path. This decision shapes the entire trajectory.',
    ['Path determined: Gilt / Barrow / Boar', 'Life trajectory defined'], '2-4 weeks',
    'This is the most consequential early decision. Once a boar is castrated, there is no going back.'),
  N('p_weaning', 0, 280, 'notable', 'Weaning', 'management',
    'Separation from the dam at 3-6 weeks. Nutritional independence begins. Stress management is critical during this period.',
    ['Nutritional independence', 'Social restructuring', 'Immune challenge'], '3-6 weeks'),
  N('p_vacc1', 60, 260, 'minor', 'Initial Vaccinations', 'health',
    'First round of vaccinations (Mycoplasma, Circo, etc.) to build active immunity.',
    ['Active immunity building'], '3-5 weeks'),

  // ── RING 3: Nursery/Growing (8-16 weeks) ──
  // GILT PATH (left side, 240-320°)
  N('p_gilt_id', 280, 400, 'notable', 'Gilt Identification', 'genetics',
    'Select gilts based on structural soundness, genetic merit (EPDs), and dam productivity. Only the best females enter the show/breeding pipeline.',
    ['Breeding potential assessed', 'Structural evaluation complete'], '8-10 weeks'),
  N('p_gilt_growth', 260, 400, 'minor', 'Gilt Growth Monitoring', 'nutrition',
    'Track average daily gain carefully. Gilts need moderate growth — not too fast, not too slow — for optimal skeletal development.',
    ['Growth rate optimized for longevity'], '8-14 weeks'),
  N('p_gilt_struct', 300, 400, 'minor', 'Structural Evaluation', 'conformation',
    'Assess feet, legs, underline, and body capacity. Structural soundness determines long-term breeding viability.',
    ['Structural soundness scored'], '10-14 weeks'),
  N('p_gilt_diet', 240, 420, 'minor', 'Gilt Development Diet', 'nutrition',
    'A gilt-specific ration balances growth with reproductive development. Lower energy than barrow finishing diets.',
    ['Reproductive development supported'], '10-16 weeks'),

  // BARROW PATH (right side, 40-120°)
  N('p_barrow_id', 80, 400, 'notable', 'Barrow Show Prep', 'training',
    'Selected barrows begin targeted conditioning. Goal: maximize muscle expression while maintaining structural correctness.',
    ['Show career begins', 'Conditioning program started'], '8-10 weeks'),
  N('p_barrow_muscle', 100, 400, 'minor', 'Muscle Development', 'nutrition',
    'High-protein finishing rations drive lean muscle growth. Lysine levels are critical for barrow performance.',
    ['Lean gain maximized'], '8-14 weeks'),
  N('p_barrow_exercise', 60, 420, 'minor', 'Daily Exercise', 'training',
    'Structured exercise (walking, driving) builds muscle tone, strengthens feet/legs, and teaches the pig to respond to the handler.',
    ['Muscle tone improved', 'Handler responsiveness'], '8-16 weeks'),
  N('p_barrow_finish', 120, 400, 'minor', 'Finishing Diet', 'nutrition',
    'Precision feeding to target ideal show weight and condition. Balance protein, energy, and feed additives.',
    ['Show weight targeting'], '10-16 weeks'),

  // BOAR PATH (bottom, 150-210°)
  N('p_boar_eval', 180, 400, 'notable', 'Boar Prospect Evaluation', 'genetics',
    'Only exceptional intact males are retained. Evaluate EPDs, structural soundness, and masculinity traits.',
    ['Breeding potential confirmed', 'Genetic merit assessed'], '8-12 weeks'),
  N('p_boar_test', 160, 420, 'minor', 'Testosterone Management', 'health',
    'Monitor boar behavior as testosterone increases. Separate from gilts. Manage aggression and mounting behavior.',
    ['Behavior management protocol'], '10-16 weeks'),
  N('p_boar_train', 200, 420, 'minor', 'Boar Behavior Training', 'training',
    'Boars require firm, consistent handling. Train for ring presence and controlled movement despite increased aggression.',
    ['Ring behavior trained'], '10-16 weeks'),

  // ── RING 4: Show Prep (4-6 months) ──
  N('p_hair', 0, 540, 'notable', 'Hair & Skin Conditioning', 'conformation',
    'Proper hair management (growing, training, conditioning) dramatically impacts show ring appearance. Daily brushing and oil application.',
    ['Show ring appearance enhanced', 'Skin health optimized'], '4-5 months'),
  N('p_walk', 330, 540, 'minor', 'Walking & Driving Practice', 'training',
    'Daily practice driving the pig with a show stick and whip. Teaching the pig to move at the right speed and respond to cues.',
    ['Show ring movement trained'], '4-6 months'),
  N('p_clip', 30, 540, 'minor', 'Clipping & Grooming', 'management',
    'Ears, tail, and belly clipping. Proper grooming highlights muscle definition and structural correctness.',
    ['Show-day appearance prepared'], '5-6 months'),
  N('p_etiquette', 300, 540, 'minor', 'Ring Etiquette', 'training',
    'Teach the pig to stand naturally, quarter away from the judge, and move smoothly in a show ring environment.',
    ['Judge presentation skills'], '4-6 months'),
  N('p_rog', 60, 540, 'notable', 'Rate of Gain Targeting', 'nutrition',
    'Precisely manage feed intake to hit target show weight on the correct date. Too heavy or too light loses competitiveness.',
    ['Weight trajectory optimized', 'Show date targeting'], '4-6 months'),
  N('p_feet', 270, 540, 'minor', 'Feet & Leg Conditioning', 'health',
    'Walking on varied surfaces strengthens hooves and joints. Proper flooring prevents foot rot and structural breakdown.',
    ['Structural soundness maintained'], '4-6 months'),
  N('p_judge', 90, 540, 'minor', 'Judge Perspective Training', 'training',
    'Practice setting up the pig as a judge would evaluate it. Learn to show the pig\'s strengths and minimize weaknesses.',
    ['Strategic showing skills'], '4-6 months'),
  // Cross-links back to gilt/barrow/boar paths
  N('p_gilt_show_prep', 250, 540, 'minor', 'Gilt Show Conditioning', 'training',
    'Gilt-specific show prep focusing on femininity, underline quality, and breeding character while maintaining show fitness.',
    ['Femininity showcased'], '4-6 months'),
  N('p_boar_show_prep', 180, 560, 'minor', 'Boar Show Conditioning', 'training',
    'Emphasize masculinity, width, and power. Boars are shown with more aggressive movement patterns.',
    ['Masculinity emphasized'], '4-6 months'),

  // ── RING 5: Show Season (6-9 months) ──
  N('p_county', 340, 680, 'notable', 'County / Local Fair', 'training',
    'The first official competition. County fairs teach showmanship fundamentals and expose the pig to a show environment.',
    ['Show ring experience gained', 'Evaluation feedback received'], '6-7 months'),
  N('p_jackpot', 20, 680, 'minor', 'Jackpot Show Circuit', 'training',
    'Traveling jackpot shows build experience and ranking points. Competing against diverse genetics sharpens competitive edge.',
    ['Competition experience expanded'], '6-8 months'),
  N('p_wt_mgmt', 60, 680, 'minor', 'Weight Management', 'nutrition',
    'Active weight management through feed adjustments, exercise, and gut fill strategies for show day.',
    ['Optimal show weight maintained'], '6-9 months'),
  N('p_stress', 300, 680, 'minor', 'Stress Management', 'health',
    'Travel, heat, new environments — stress management (electrolytes, cooling, familiar routines) preserves show condition.',
    ['Travel and show stress mitigated'], '6-9 months'),
  N('p_showmanship', 0, 700, 'notable', 'Showmanship Mastery', 'training',
    'Showmanship is judged on the handler\'s ability to present the animal. Eye contact with judge, smooth driving, and natural presentation.',
    ['Showmanship skills mastered', 'Handler-animal partnership'], '6-9 months'),
  N('p_breed_show', 270, 700, 'minor', 'Breed Show Entry', 'training',
    'Compete within the breed division. Judges evaluate against breed-specific ideal type.',
    ['Breed-specific evaluation'], '7-8 months'),
  N('p_state_qual', 80, 700, 'notable', 'State Fair Qualification', 'management',
    'Earn qualification through local/jackpot performance or nomination. State fair is the premier show destination.',
    ['State-level qualification earned', 'Premium competition access'], '7-9 months'),
  N('p_transport', 120, 680, 'minor', 'Transport Conditioning', 'management',
    'Acclimate the pig to trailer travel. Proper ventilation, bedding, and water during transport.',
    ['Travel readiness confirmed'], '6-8 months'),

  // ── RING 6: Peak Competition (9-12 months) ──
  N('p_state', 0, 830, 'keystone', 'State Fair Showing', 'training',
    'The pinnacle of most show pig careers. State fair competition brings the best animals and showmen together. All preparation leads here.',
    ['State-level competition', 'Peak performance demonstrated', 'Career-defining moment'], '9-10 months',
    'For many showmen, the state fair is the ultimate goal — months of preparation culminate in minutes in the ring.'),
  N('p_national', 40, 850, 'keystone', 'National Show Entry', 'training',
    'National shows (WPX, NAILE, etc.) represent the highest level of competition. Only elite animals and dedicated showmen compete here.',
    ['National-level competition', 'Elite status pursuit'], '10-12 months'),
  N('p_supreme', 350, 830, 'notable', 'Grand/Supreme Pursuit', 'training',
    'Competing for Grand Champion or Supreme Champion title — the highest honor in the show ring.',
    ['Championship title pursuit'], '9-12 months'),
  N('p_market_show', 80, 830, 'notable', 'Market Show Competition', 'management',
    'Market classes evaluate the animal\'s value as a meat animal — muscling, leanness, and carcass merit.',
    ['Market value demonstrated'], '9-11 months'),
  N('p_breed_eval', 300, 830, 'notable', 'Breeding Stock Evaluation', 'genetics',
    'Judges and breeders evaluate whether this animal merits inclusion in a breeding program.',
    ['Breeding potential judged'], '9-12 months'),
  N('p_carcass', 120, 830, 'minor', 'Carcass Merit Assessment', 'nutrition',
    'Ultrasound scanning or visual evaluation of loin depth, backfat, and intramuscular marbling.',
    ['Carcass data collected'], '9-12 months'),
  N('p_sale_prep', 160, 830, 'minor', 'Sale Preparation', 'management',
    'Prepare the animal for auction or private treaty sale. Documentation, health papers, and presentation.',
    ['Sale readiness'], '10-12 months'),

  // ── RING 7: Outcomes (12-18 months) ──
  // GILT OUTCOMES
  N('p_gilt_retain', 280, 970, 'keystone', 'Gilt Retained for Breeding', 'genetics',
    'The gilt enters the breeding herd. She will be developed as a future sow — this is the legacy path.',
    ['Breeding herd entry', 'Genetic contribution begins'], '12-14 months'),
  N('p_gilt_heat', 260, 970, 'notable', 'First Heat Cycle', 'health',
    'The gilt reaches puberty and begins cycling. Proper timing and detection is critical for breeding success.',
    ['Reproductive maturity reached'], '6-8 months'),
  N('p_gilt_bse', 300, 970, 'minor', 'Breeding Soundness Exam', 'health',
    'Veterinary evaluation of reproductive tract, structural soundness for breeding, and overall health clearance.',
    ['Breeding soundness confirmed'], '12-14 months'),
  N('p_gilt_service', 240, 990, 'minor', 'AI vs Natural Service', 'genetics',
    'Choose between artificial insemination (wider genetics access) or natural service (proven conception).',
    ['Breeding method selected'], '13-15 months'),

  // BARROW OUTCOMES
  N('p_market_sale', 80, 970, 'keystone', 'Market Sale', 'management',
    'The barrow completes its show career and enters the market chain. Premium auction, private sale, or direct market.',
    ['Show career completed', 'Market value realized'], '10-14 months'),
  N('p_carcass_data', 100, 970, 'notable', 'Carcass Data Collection', 'nutrition',
    'Post-harvest carcass data (cutability, marbling, loin eye area) validates breeding and feeding decisions.',
    ['Feeding program validated', 'Genetic merit confirmed'], '10-14 months'),
  N('p_processing', 60, 990, 'minor', 'Processing', 'management',
    'Humane harvest and processing. Understanding the full chain from farm to plate.',
    ['Full production cycle understood'], '10-14 months'),
  N('p_records', 120, 990, 'minor', 'Record Keeping & Analysis', 'management',
    'Document all performance data — ADG, feed conversion, show placings, carcass data — for future planning.',
    ['Performance database built'], '10-14 months'),

  // BOAR OUTCOMES
  N('p_boar_retain', 180, 970, 'keystone', 'Boar Retained for Breeding', 'genetics',
    'An exceptional boar enters service. His genetics will influence dozens to hundreds of offspring.',
    ['Breeding herd sire', 'Genetic multiplier'], '12-15 months'),
  N('p_semen_eval', 200, 970, 'notable', 'Semen Evaluation', 'genetics',
    'Semen quality testing — motility, concentration, morphology. Only quality sires should be used.',
    ['Semen quality confirmed'], '10-14 months'),
  N('p_breed_roster', 160, 990, 'minor', 'Breeding Roster', 'management',
    'Plan mating combinations for genetic improvement. Match sire strengths to dam weaknesses.',
    ['Mating plan established'], '12-18 months'),

  // ── RING 8: Legacy (18+ months) ──
  N('p_program', 0, 1100, 'keystone', 'Breeding Program', 'genetics',
    'Establishing your own breeding program — selecting, mating, and raising the next generation with intention.',
    ['Multi-generational program', 'Genetic line established', 'Breeder identity formed'], '18+ months',
    'This is where the showman becomes a breeder. The skills learned through showing now guide genetic decisions.'),
  N('p_sow_prod', 270, 1100, 'notable', 'Sow Productivity', 'genetics',
    'Track sow performance: pigs born alive, weaning weight, milking ability, temperament, structural longevity.',
    ['Dam line performance tracked'], '18+ months'),
  N('p_next_gen', 340, 1100, 'notable', 'Next Generation Planning', 'genetics',
    'Select from your own production. Retain the best gilts and boars for the next generation of show pigs.',
    ['Genetic improvement cycle'], '18+ months'),
  N('p_line_eval', 90, 1100, 'minor', 'Genetic Line Evaluation', 'genetics',
    'Evaluate offspring consistency. Are your matings producing the type and performance you targeted?',
    ['Breeding decisions validated'], '2+ years'),
  N('p_mentor', 180, 1100, 'notable', 'Mentoring Next Showman', 'training',
    'Pass your knowledge forward. Mentoring a younger showman multiplies the impact of your experience.',
    ['Knowledge transferred', 'Community contribution'], '18+ months'),
  N('p_record_analysis', 50, 1100, 'minor', 'Lifetime Performance Analysis', 'management',
    'Analyze multi-year data to refine genetics, nutrition, and show strategies.',
    ['Data-driven improvement'], '2+ years'),
];

const PIG_EDGES = [
  // Birth → Neonatal
  E('p_birth','p_colostrum'), E('p_birth','p_navel'), E('p_birth','p_heat'),
  E('p_birth','p_birthwt'), E('p_birth','p_teat'),
  // Neonatal → Nursing
  E('p_colostrum','p_creep'), E('p_colostrum','p_iron'), E('p_colostrum','p_weaning'),
  E('p_navel','p_iron'), E('p_navel','p_vacc1'),
  E('p_heat','p_handling'), E('p_heat','p_creep'),
  E('p_birthwt','p_creep'), E('p_birthwt','p_barrow_id'),
  E('p_teat','p_creep'), E('p_teat','p_gilt_id'),
  // Nursing internal
  E('p_creep','p_weaning'), E('p_creep','p_sex_decide'),
  E('p_iron','p_vacc1'), E('p_handling','p_sex_decide'),
  E('p_weaning','p_sex_decide'),
  // Sex decision → three paths
  E('p_sex_decide','p_gilt_id'), E('p_sex_decide','p_barrow_id'), E('p_sex_decide','p_boar_eval'),
  // Gilt path internal
  E('p_gilt_id','p_gilt_growth'), E('p_gilt_id','p_gilt_struct'),
  E('p_gilt_growth','p_gilt_diet'), E('p_gilt_struct','p_gilt_diet'),
  E('p_gilt_diet','p_gilt_show_prep'),
  // Barrow path internal
  E('p_barrow_id','p_barrow_muscle'), E('p_barrow_id','p_barrow_exercise'),
  E('p_barrow_muscle','p_barrow_finish'), E('p_barrow_exercise','p_barrow_finish'),
  // Boar path internal
  E('p_boar_eval','p_boar_test'), E('p_boar_eval','p_boar_train'),
  E('p_boar_test','p_boar_show_prep'), E('p_boar_train','p_boar_show_prep'),
  // All paths → Show Prep (ring 4)
  E('p_gilt_diet','p_hair'), E('p_gilt_struct','p_feet'),
  E('p_barrow_finish','p_hair'), E('p_barrow_finish','p_rog'),
  E('p_barrow_exercise','p_walk'), E('p_boar_show_prep','p_hair'),
  // Show prep internal
  E('p_hair','p_walk'), E('p_hair','p_clip'), E('p_walk','p_etiquette'),
  E('p_clip','p_judge'), E('p_rog','p_judge'), E('p_rog','p_wt_mgmt'),
  E('p_etiquette','p_county'), E('p_feet','p_walk'),
  E('p_gilt_show_prep','p_etiquette'), E('p_gilt_show_prep','p_feet'),
  E('p_boar_show_prep','p_etiquette'),
  // Show Prep → Show Season
  E('p_judge','p_county'), E('p_judge','p_jackpot'),
  E('p_clip','p_county'), E('p_walk','p_county'),
  // Show season internal
  E('p_county','p_jackpot'), E('p_county','p_showmanship'), E('p_county','p_stress'),
  E('p_jackpot','p_state_qual'), E('p_jackpot','p_wt_mgmt'),
  E('p_showmanship','p_state_qual'), E('p_showmanship','p_breed_show'),
  E('p_wt_mgmt','p_state_qual'), E('p_stress','p_transport'),
  E('p_breed_show','p_state_qual'), E('p_transport','p_state_qual'),
  // Show season → Peak
  E('p_state_qual','p_state'), E('p_state_qual','p_national'),
  E('p_state','p_supreme'), E('p_state','p_market_show'), E('p_state','p_breed_eval'),
  E('p_national','p_supreme'), E('p_national','p_breed_eval'),
  E('p_supreme','p_breed_eval'), E('p_market_show','p_carcass'),
  E('p_carcass','p_sale_prep'), E('p_breed_eval','p_sale_prep'),
  // Peak → Outcomes
  E('p_breed_eval','p_gilt_retain'), E('p_breed_eval','p_boar_retain'),
  E('p_sale_prep','p_market_sale'),
  E('p_market_show','p_market_sale'), E('p_carcass','p_carcass_data'),
  E('p_gilt_retain','p_gilt_heat'), E('p_gilt_retain','p_gilt_bse'),
  E('p_gilt_heat','p_gilt_bse'), E('p_gilt_bse','p_gilt_service'),
  E('p_market_sale','p_carcass_data'), E('p_market_sale','p_processing'),
  E('p_carcass_data','p_records'), E('p_processing','p_records'),
  E('p_boar_retain','p_semen_eval'), E('p_semen_eval','p_breed_roster'),
  // Outcomes → Legacy
  E('p_gilt_service','p_program'), E('p_gilt_retain','p_sow_prod'),
  E('p_sow_prod','p_next_gen'), E('p_sow_prod','p_program'),
  E('p_boar_retain','p_program'), E('p_breed_roster','p_program'),
  E('p_records','p_record_analysis'), E('p_records','p_line_eval'),
  E('p_program','p_next_gen'), E('p_program','p_mentor'),
  E('p_next_gen','p_line_eval'), E('p_record_analysis','p_line_eval'),
];

/* ============================================
   CATTLE TREE
   Heifer path = left (240°-320°)
   Steer path = right (40°-120°)
   Bull path = bottom (150°-210°)
   ============================================ */
const CATTLE_NODES = [
  N('c_birth', 0, 0, 'keystone', 'Birth (Calf)', 'genetics',
    'A calf is born. Breed, genetics, and birth conditions set the foundation for everything that follows.',
    ['Genetic blueprint established', 'Breed characteristics set'], '0 days'),

  // Ring 1
  N('c_colostrum', 0, 120, 'notable', 'Colostrum Intake', 'health',
    'Calves must receive colostrum within 4-6 hours. Immunity transfer is time-critical in cattle.',
    ['Passive immunity acquired'], '0-6 hours'),
  N('c_navel', 50, 120, 'minor', 'Navel Dipping', 'health', 'Iodine navel dip prevents infection.', ['Infection prevention'], '0-12 hours'),
  N('c_id', 310, 120, 'minor', 'Identification & Tagging', 'management', 'Ear tagging and registration.', ['Identity recorded'], '0-3 days'),
  N('c_nurse', 270, 130, 'minor', 'Nursing Establishment', 'nutrition', 'Ensure calf bonds and nurses effectively.', ['Dam-calf bond established'], '0-3 days'),

  // Ring 2
  N('c_halter', 0, 240, 'notable', 'Halter Breaking', 'training',
    'The defining early skill for show cattle. Teaching the calf to lead with a halter is the foundation of all show training.',
    ['Lead trained', 'Human partnership initiated'], '4-8 weeks'),
  N('c_vacc', 60, 240, 'minor', 'Vaccination Protocol', 'health', 'Blackleg, respiratory, and clostridial vaccines.', ['Disease prevention'], '2-4 weeks'),
  N('c_creep', 300, 240, 'minor', 'Creep Feed Introduction', 'nutrition', 'Supplemental grain to boost growth alongside dam milk.', ['Supplemental nutrition'], '4-8 weeks'),
  N('c_sex_decide', 180, 250, 'keystone', 'Sex Classification', 'genetics',
    'Heifers, steers (castrated males), and bulls diverge. Each path has a distinct trajectory in the show ring and beyond.',
    ['Heifer / Steer / Bull path defined'], '4-8 weeks'),
  N('c_wean', 330, 250, 'notable', 'Weaning', 'management', 'Separation from dam at 6-8 months. Bunk breaking and independent nutrition begin.', ['Nutritional independence'], '6-8 months'),

  // Ring 3 — three paths
  N('c_heifer_id', 280, 380, 'notable', 'Heifer Selection', 'genetics', 'Select heifers for maternal traits, structural correctness, and breed character.', ['Breeding potential assessed'], '3-6 months'),
  N('c_heifer_dev', 260, 390, 'minor', 'Heifer Development Diet', 'nutrition', 'Controlled growth for skeletal maturity without over-conditioning.', ['Growth rate managed'], '3-6 months'),
  N('c_steer_id', 80, 380, 'notable', 'Steer Show Prep', 'training', 'Steer conditioning for show ring: hair growth, muscle development, and handling.', ['Show conditioning started'], '3-6 months'),
  N('c_steer_feed', 100, 390, 'minor', 'Steer Finishing Ration', 'nutrition', 'High-energy finishing ration to develop muscling and cover.', ['Finishing program active'], '3-6 months'),
  N('c_bull_eval', 180, 380, 'notable', 'Bull Prospect Evaluation', 'genetics', 'Structural soundness, masculinity, and genetic merit evaluation for herd sire potential.', ['Sire potential assessed'], '3-6 months'),
  N('c_bull_mgmt', 200, 400, 'minor', 'Bull Management', 'management', 'Separate housing, feeding, and behavior management for intact males.', ['Bull management protocol'], '3-6 months'),

  // Ring 4 — Show prep
  N('c_fitting', 0, 520, 'notable', 'Fitting & Clipping', 'conformation',
    'Cattle fitting is an art — clipping hair patterns, blending, and product application to enhance appearance.',
    ['Show-ring presentation mastered'], '4-8 months'),
  N('c_hair', 330, 520, 'minor', 'Hair Coat Development', 'conformation', 'Blanketing, rinsing, and blowing to grow and train hair.', ['Hair coat maximized'], '4-8 months'),
  N('c_set_up', 30, 520, 'minor', 'Setting Up Practice', 'training', 'Train the animal to stand squarely and present well.', ['Show stance trained'], '4-8 months'),
  N('c_walk_train', 60, 530, 'minor', 'Leading & Pacing', 'training', 'Smooth, controlled movement at the judge\'s pace.', ['Ring movement polished'], '4-8 months'),
  N('c_nutrition_plan', 270, 530, 'minor', 'Show Nutrition Plan', 'nutrition', 'Custom ration for optimal condition on show day.', ['Show condition targeted'], '4-8 months'),

  // Ring 5 — Show season
  N('c_county', 350, 660, 'notable', 'County Fair', 'training', 'First show experience. Judges evaluate breed character, structural correctness, and condition.', ['Show career launched'], '6-10 months'),
  N('c_open_shows', 30, 660, 'minor', 'Open Show Circuit', 'training', 'Regional open shows build experience and rankings.', ['Competition experience gained'], '8-14 months'),
  N('c_showmanship', 0, 680, 'notable', 'Showmanship Competition', 'training', 'Handler is judged on presentation, control, and ring awareness.', ['Showmanship skills demonstrated'], '6-14 months'),
  N('c_state_q', 80, 670, 'notable', 'State Fair Qualification', 'management', 'Earn entry to state-level competition.', ['State-level access earned'], '8-14 months'),
  N('c_breed_show', 300, 670, 'minor', 'Breed Show Entry', 'training', 'Compete within breed-specific classes.', ['Breed evaluation'], '8-14 months'),

  // Ring 6 — Peak
  N('c_state', 0, 810, 'keystone', 'State Fair', 'training', 'Premier state-level competition. Months of preparation tested.', ['State championship pursuit'], '10-18 months'),
  N('c_national', 40, 820, 'keystone', 'National Show', 'training', 'NAILE, National Western, Houston — elite national competition.', ['National-level competition'], '12-24 months'),
  N('c_champion', 340, 810, 'notable', 'Grand Champion Pursuit', 'training', 'Competing for the banner.', ['Championship title pursuit'], '10-24 months'),
  N('c_breed_eval', 280, 820, 'notable', 'Breeding Stock Judgment', 'genetics', 'Industry evaluation of breeding merit.', ['Breeding value assessed'], '12-24 months'),

  // Ring 7 — Outcomes
  N('c_heifer_breed', 270, 960, 'keystone', 'Heifer Retained for Breeding', 'genetics', 'The heifer enters the cow herd as a future brood cow.', ['Cow herd entry'], '14-22 months'),
  N('c_steer_market', 80, 960, 'keystone', 'Steer Market/Sale', 'management', 'Show career concludes with premium sale.', ['Market value realized'], '12-18 months'),
  N('c_bull_service', 180, 960, 'keystone', 'Bull Enters Service', 'genetics', 'Bull becomes a herd sire.', ['Genetic influence multiplied'], '14-24 months'),
  N('c_carcass', 100, 980, 'minor', 'Carcass Data', 'nutrition', 'Yield grade, quality grade, rib eye area, marbling.', ['Carcass merit documented'], '12-20 months'),
  N('c_breeding_exam', 200, 970, 'minor', 'Breeding Soundness Exam', 'health', 'Semen testing and physical evaluation.', ['Fertility confirmed'], '12-18 months'),

  // Ring 8 — Legacy
  N('c_cow_herd', 270, 1100, 'keystone', 'Cow Herd Program', 'genetics', 'Build and manage a breeding cow herd. Multi-generational genetic improvement.', ['Breeding program established'], '2+ years'),
  N('c_next_gen', 0, 1100, 'notable', 'Next Generation', 'genetics', 'Select replacement heifers and bulls from your own production.', ['Genetic improvement cycle'], '2+ years'),
  N('c_mentor', 180, 1100, 'notable', 'Mentor Next Showman', 'training', 'Pass knowledge to the next generation of cattle showmen.', ['Community legacy'], '2+ years'),
  N('c_records', 90, 1100, 'minor', 'Lifetime Records', 'management', 'EPD tracking, performance data, and breeding records.', ['Data-driven decisions'], '3+ years'),
];

const CATTLE_EDGES = [
  E('c_birth','c_colostrum'), E('c_birth','c_navel'), E('c_birth','c_id'), E('c_birth','c_nurse'),
  E('c_colostrum','c_halter'), E('c_colostrum','c_vacc'),
  E('c_navel','c_vacc'), E('c_id','c_halter'), E('c_nurse','c_creep'), E('c_nurse','c_wean'),
  E('c_halter','c_sex_decide'), E('c_halter','c_wean'), E('c_vacc','c_wean'),
  E('c_creep','c_wean'), E('c_creep','c_sex_decide'),
  E('c_sex_decide','c_heifer_id'), E('c_sex_decide','c_steer_id'), E('c_sex_decide','c_bull_eval'),
  E('c_wean','c_heifer_id'), E('c_wean','c_steer_id'),
  E('c_heifer_id','c_heifer_dev'), E('c_heifer_dev','c_nutrition_plan'),
  E('c_steer_id','c_steer_feed'), E('c_steer_feed','c_fitting'),
  E('c_bull_eval','c_bull_mgmt'), E('c_bull_mgmt','c_fitting'),
  E('c_heifer_id','c_fitting'), E('c_steer_id','c_fitting'),
  E('c_fitting','c_hair'), E('c_fitting','c_set_up'), E('c_hair','c_set_up'),
  E('c_set_up','c_walk_train'), E('c_walk_train','c_county'),
  E('c_nutrition_plan','c_fitting'),
  E('c_county','c_open_shows'), E('c_county','c_showmanship'), E('c_county','c_breed_show'),
  E('c_open_shows','c_state_q'), E('c_showmanship','c_state_q'), E('c_breed_show','c_state_q'),
  E('c_state_q','c_state'), E('c_state_q','c_national'),
  E('c_state','c_champion'), E('c_state','c_breed_eval'), E('c_national','c_champion'),
  E('c_national','c_breed_eval'),
  E('c_breed_eval','c_heifer_breed'), E('c_breed_eval','c_bull_service'),
  E('c_champion','c_steer_market'), E('c_champion','c_heifer_breed'),
  E('c_steer_market','c_carcass'),
  E('c_heifer_breed','c_cow_herd'), E('c_bull_service','c_breeding_exam'),
  E('c_breeding_exam','c_cow_herd'), E('c_carcass','c_records'),
  E('c_cow_herd','c_next_gen'), E('c_cow_herd','c_mentor'), E('c_cow_herd','c_records'),
  E('c_next_gen','c_records'),
];

/* ============================================
   SHEEP TREE
   ============================================ */
const SHEEP_NODES = [
  N('s_birth', 0, 0, 'keystone', 'Birth (Lamb)', 'genetics', 'A lamb is born. Breed and genetics define its potential.', ['Genetic foundation set'], '0 days'),
  N('s_colostrum', 0, 130, 'notable', 'Colostrum', 'health', 'Critical first feeding for immune transfer.', ['Passive immunity'], '0-6 hours'),
  N('s_dock', 40, 130, 'minor', 'Tail Docking', 'management', 'Tail docking for cleanliness and health.', ['Hygiene improved'], '1-7 days'),
  N('s_navel', 320, 130, 'minor', 'Navel Care', 'health', 'Iodine dip to prevent navel ill.', ['Infection prevented'], '0-12 hours'),
  N('s_creep', 350, 260, 'minor', 'Creep Feeding', 'nutrition', 'Supplement dam milk with grain.', ['Growth supported'], '2-4 weeks'),
  N('s_sex_decide', 180, 260, 'keystone', 'Sex Classification', 'genetics', 'Ewe lamb, wether, or ram lamb path.', ['Path defined'], '2-4 weeks'),
  N('s_weaning', 0, 270, 'notable', 'Weaning', 'management', 'Separation from ewe.', ['Independence begins'], '60-90 days'),
  N('s_vacc', 50, 260, 'minor', 'CDT Vaccination', 'health', 'Clostridium/Tetanus protection.', ['Disease prevention'], '4-8 weeks'),
  N('s_handling', 300, 260, 'minor', 'Halter Training', 'training', 'Teach lamb to lead.', ['Lead trained'], '4-8 weeks'),
  // Paths
  N('s_ewe_id', 280, 400, 'notable', 'Ewe Lamb Selection', 'genetics', 'Select for breed character, structure, and fleece.', ['Breeding merit assessed'], '2-4 months'),
  N('s_ewe_diet', 260, 410, 'minor', 'Ewe Development Diet', 'nutrition', 'Moderate growth for skeletal maturity.', ['Growth managed'], '2-4 months'),
  N('s_wether_id', 80, 400, 'notable', 'Wether Show Prep', 'training', 'Market lamb conditioning for show ring.', ['Conditioning program'], '2-4 months'),
  N('s_wether_feed', 100, 410, 'minor', 'Finishing Ration', 'nutrition', 'High-energy finishing for muscling.', ['Muscle development'], '2-4 months'),
  N('s_ram_eval', 180, 400, 'notable', 'Ram Lamb Evaluation', 'genetics', 'Structural and genetic merit for flock sire.', ['Sire potential'], '2-4 months'),
  // Show prep
  N('s_shearing', 0, 540, 'notable', 'Shearing & Wool Prep', 'conformation', 'Proper shearing and wool management for breed show classes.', ['Fleece presentation'], '3-5 months'),
  N('s_blocking', 330, 540, 'minor', 'Blocking & Trimming', 'conformation', 'Card, block, and trim wool to enhance appearance.', ['Show appearance refined'], '4-6 months'),
  N('s_bracing', 30, 540, 'notable', 'Bracing Training', 'training', 'Teach lamb to brace against handler for the judge.', ['Bracing technique mastered'], '3-5 months'),
  N('s_condition', 60, 550, 'minor', 'Show Conditioning', 'nutrition', 'Target show weight and condition.', ['Show condition optimized'], '4-6 months'),
  // Show season
  N('s_county', 350, 680, 'notable', 'County Fair', 'training', 'First show ring experience.', ['Competition started'], '4-7 months'),
  N('s_showmanship', 0, 700, 'notable', 'Showmanship', 'training', 'Handler evaluation.', ['Showmanship mastery'], '4-8 months'),
  N('s_state_q', 50, 690, 'notable', 'State Fair Qualification', 'management', 'Earn state-level entry.', ['State qualification'], '5-9 months'),
  // Peak
  N('s_state', 0, 830, 'keystone', 'State Fair', 'training', 'Premier competition.', ['State-level showing'], '6-10 months'),
  N('s_national', 40, 840, 'keystone', 'National Show', 'training', 'NAILE, National Western, etc.', ['National competition'], '8-12 months'),
  N('s_champion', 320, 830, 'notable', 'Champion Pursuit', 'training', 'Competing for top honors.', ['Championship pursuit'], '6-12 months'),
  // Outcomes
  N('s_ewe_breed', 270, 1000, 'keystone', 'Ewe Retained', 'genetics', 'Ewe enters breeding flock.', ['Flock contribution'], '8-14 months'),
  N('s_wether_market', 80, 1000, 'keystone', 'Wether Market', 'management', 'Show career concludes with sale.', ['Market value realized'], '6-12 months'),
  N('s_ram_service', 180, 1000, 'keystone', 'Ram Enters Service', 'genetics', 'Flock sire.', ['Genetic influence'], '8-14 months'),
  // Legacy
  N('s_flock', 0, 1100, 'keystone', 'Flock Program', 'genetics', 'Build a breeding flock.', ['Flock established'], '1-2 years'),
  N('s_mentor', 180, 1100, 'notable', 'Mentor', 'training', 'Teach the next generation.', ['Knowledge passed on'], '1+ years'),
];

const SHEEP_EDGES = [
  E('s_birth','s_colostrum'), E('s_birth','s_dock'), E('s_birth','s_navel'),
  E('s_colostrum','s_creep'), E('s_colostrum','s_vacc'), E('s_navel','s_vacc'),
  E('s_dock','s_handling'), E('s_creep','s_weaning'), E('s_creep','s_sex_decide'),
  E('s_handling','s_sex_decide'), E('s_vacc','s_weaning'), E('s_weaning','s_sex_decide'),
  E('s_sex_decide','s_ewe_id'), E('s_sex_decide','s_wether_id'), E('s_sex_decide','s_ram_eval'),
  E('s_ewe_id','s_ewe_diet'), E('s_ewe_diet','s_shearing'),
  E('s_wether_id','s_wether_feed'), E('s_wether_feed','s_condition'),
  E('s_ram_eval','s_shearing'),
  E('s_ewe_id','s_shearing'), E('s_wether_id','s_bracing'),
  E('s_shearing','s_blocking'), E('s_shearing','s_bracing'),
  E('s_blocking','s_county'), E('s_bracing','s_county'), E('s_condition','s_county'),
  E('s_county','s_showmanship'), E('s_county','s_state_q'),
  E('s_showmanship','s_state_q'),
  E('s_state_q','s_state'), E('s_state_q','s_national'),
  E('s_state','s_champion'), E('s_state','s_national'),
  E('s_champion','s_ewe_breed'), E('s_champion','s_wether_market'), E('s_champion','s_ram_service'),
  E('s_national','s_ewe_breed'), E('s_national','s_ram_service'),
  E('s_wether_market','s_flock'), E('s_ewe_breed','s_flock'), E('s_ram_service','s_flock'),
  E('s_flock','s_mentor'),
];

/* ============================================
   GOAT TREE
   ============================================ */
const GOAT_NODES = [
  N('g_birth', 0, 0, 'keystone', 'Birth (Kid)', 'genetics', 'A kid is born. Meat or dairy breed potential is inherent.', ['Genetic blueprint set'], '0 days'),
  N('g_colostrum', 0, 130, 'notable', 'Colostrum', 'health', 'First feeding for immune transfer.', ['Passive immunity'], '0-6 hours'),
  N('g_disbud', 40, 130, 'minor', 'Disbudding', 'management', 'Horn bud removal for safety.', ['Horn growth prevented'], '3-10 days'),
  N('g_navel', 320, 130, 'minor', 'Navel Care', 'health', 'Iodine dip.', ['Infection prevented'], '0-12 hours'),
  N('g_creep', 350, 260, 'minor', 'Creep Feeding', 'nutrition', 'Introduce solid feed.', ['Growth supported'], '2-4 weeks'),
  N('g_sex_decide', 180, 260, 'keystone', 'Sex Classification', 'genetics', 'Doeling, wether, or buckling path.', ['Path determined'], '2-4 weeks'),
  N('g_weaning', 0, 270, 'notable', 'Weaning', 'management', 'Separation from dam.', ['Independence'], '8-12 weeks'),
  N('g_vacc', 50, 260, 'minor', 'CDT Vaccination', 'health', 'Core vaccination.', ['Disease prevention'], '4-8 weeks'),
  N('g_handling', 300, 260, 'minor', 'Halter Training', 'training', 'Teach kid to lead and stand.', ['Lead trained'], '4-8 weeks'),
  // Paths
  N('g_doe_id', 280, 400, 'notable', 'Doeling Selection', 'genetics', 'Select for breed character and structure.', ['Breeding merit assessed'], '2-4 months'),
  N('g_doe_diet', 260, 410, 'minor', 'Doeling Diet', 'nutrition', 'Balanced growth for breeding.', ['Growth managed'], '2-4 months'),
  N('g_wether_id', 80, 400, 'notable', 'Wether Show Prep', 'training', 'Market goat conditioning.', ['Show conditioning'], '2-4 months'),
  N('g_wether_feed', 100, 410, 'minor', 'Finishing Ration', 'nutrition', 'Muscle development diet.', ['Finishing program'], '2-4 months'),
  N('g_buck_eval', 180, 400, 'notable', 'Buckling Evaluation', 'genetics', 'Herd sire potential assessment.', ['Sire potential'], '2-4 months'),
  // Show prep
  N('g_fitting', 0, 540, 'notable', 'Fitting & Clipping', 'conformation', 'Clip and prepare for show ring.', ['Show appearance prepared'], '3-5 months'),
  N('g_bracing', 30, 540, 'notable', 'Bracing Training', 'training', 'Goats brace against handler.', ['Bracing technique'], '3-5 months'),
  N('g_exercise', 330, 540, 'minor', 'Exercise Program', 'training', 'Build muscle tone through walking.', ['Condition improved'], '3-5 months'),
  N('g_condition', 60, 550, 'minor', 'Show Conditioning', 'nutrition', 'Target weight management.', ['Show weight targeted'], '4-6 months'),
  // Show season
  N('g_county', 350, 680, 'notable', 'County Fair', 'training', 'First competition.', ['Show experience'], '4-7 months'),
  N('g_showmanship', 0, 700, 'notable', 'Showmanship', 'training', 'Handler evaluation.', ['Showmanship mastered'], '4-8 months'),
  N('g_state_q', 50, 690, 'notable', 'State Qualification', 'management', 'Qualify for state fair.', ['State qualification'], '5-9 months'),
  // Peak
  N('g_state', 0, 830, 'keystone', 'State Fair', 'training', 'Premier state competition.', ['State-level showing'], '6-10 months'),
  N('g_national', 40, 840, 'keystone', 'National Show', 'training', 'NAILE, National Western, etc.', ['National competition'], '8-12 months'),
  N('g_champion', 320, 830, 'notable', 'Champion Pursuit', 'training', 'Top honors.', ['Championship pursuit'], '6-12 months'),
  // Outcomes
  N('g_doe_breed', 270, 1000, 'keystone', 'Doe Retained', 'genetics', 'Doe enters breeding herd.', ['Herd contribution'], '8-14 months'),
  N('g_wether_market', 80, 1000, 'keystone', 'Wether Market', 'management', 'Show career concludes with sale.', ['Market value realized'], '6-12 months'),
  N('g_buck_service', 180, 1000, 'keystone', 'Buck Enters Service', 'genetics', 'Herd sire.', ['Genetic influence'], '8-14 months'),
  // Legacy
  N('g_herd', 0, 1100, 'keystone', 'Herd Program', 'genetics', 'Breeding herd management.', ['Herd established'], '1-2 years'),
  N('g_mentor', 180, 1100, 'notable', 'Mentor', 'training', 'Teach the next generation.', ['Knowledge passed on'], '1+ years'),
];

const GOAT_EDGES = [
  E('g_birth','g_colostrum'), E('g_birth','g_disbud'), E('g_birth','g_navel'),
  E('g_colostrum','g_creep'), E('g_colostrum','g_vacc'), E('g_navel','g_vacc'),
  E('g_disbud','g_handling'), E('g_creep','g_weaning'), E('g_creep','g_sex_decide'),
  E('g_handling','g_sex_decide'), E('g_vacc','g_weaning'), E('g_weaning','g_sex_decide'),
  E('g_sex_decide','g_doe_id'), E('g_sex_decide','g_wether_id'), E('g_sex_decide','g_buck_eval'),
  E('g_doe_id','g_doe_diet'), E('g_doe_diet','g_fitting'),
  E('g_wether_id','g_wether_feed'), E('g_wether_feed','g_condition'),
  E('g_buck_eval','g_fitting'),
  E('g_doe_id','g_fitting'), E('g_wether_id','g_bracing'),
  E('g_fitting','g_exercise'), E('g_fitting','g_bracing'),
  E('g_bracing','g_county'), E('g_exercise','g_county'), E('g_condition','g_county'),
  E('g_county','g_showmanship'), E('g_county','g_state_q'),
  E('g_showmanship','g_state_q'),
  E('g_state_q','g_state'), E('g_state_q','g_national'),
  E('g_state','g_champion'), E('g_state','g_national'),
  E('g_champion','g_doe_breed'), E('g_champion','g_wether_market'), E('g_champion','g_buck_service'),
  E('g_national','g_doe_breed'), E('g_national','g_buck_service'),
  E('g_wether_market','g_herd'), E('g_doe_breed','g_herd'), E('g_buck_service','g_herd'),
  E('g_herd','g_mentor'),
];

/* ============================================
   HORSE TREE
   Filly path = left
   Gelding path = right
   Stallion path = bottom
   ============================================ */
const HORSE_NODES = [
  N('h_birth', 0, 0, 'keystone', 'Birth (Foal)', 'genetics', 'A foal is born. Breed, bloodline, and conformation potential are set.', ['Genetic blueprint established'], '0 days'),
  N('h_colostrum', 0, 120, 'notable', 'Colostrum', 'health', 'IgG transfer critical within first 12 hours.', ['Passive immunity'], '0-12 hours'),
  N('h_imprint', 40, 120, 'notable', 'Imprint Training', 'training', 'Early desensitization to touch, handling, and human presence.', ['Trust foundation', 'Handling acceptance'], '0-3 days'),
  N('h_navel', 310, 120, 'minor', 'Navel Care', 'health', 'Dip navel to prevent joint ill.', ['Infection prevented'], '0-12 hours'),
  N('h_foal_id', 270, 130, 'minor', 'Registration & ID', 'management', 'Register with breed association.', ['Identity documented'], '0-30 days'),

  // Ring 2
  N('h_halter_intro', 0, 240, 'notable', 'Halter Introduction', 'training', 'First halter and lead training. Foundation for all future handling.', ['Halter acceptance', 'Lead basics'], '1-3 months'),
  N('h_vacc', 60, 240, 'minor', 'Vaccination & Deworming', 'health', 'Core vaccines and parasite control program.', ['Disease prevention'], '2-4 months'),
  N('h_wean', 330, 250, 'notable', 'Weaning', 'management', 'Separation from mare at 4-6 months.', ['Independence'], '4-6 months'),
  N('h_sex_decide', 180, 250, 'keystone', 'Sex Classification', 'genetics', 'Filly, gelding (castrated), or colt/stallion prospect path.', ['Filly / Gelding / Stallion path'], '4-8 months'),
  N('h_foot_care', 300, 240, 'minor', 'Hoof Care Basics', 'health', 'Regular trimming and hoof handling training.', ['Hoof health foundation'], '2-6 months'),

  // Ring 3
  N('h_filly_id', 280, 370, 'notable', 'Filly Selection', 'genetics', 'Evaluate conformation, movement, and bloodline for broodmare potential.', ['Mare potential assessed'], '6-12 months'),
  N('h_filly_dev', 250, 380, 'minor', 'Filly Development', 'nutrition', 'Balanced nutrition for skeletal growth.', ['Growth managed'], '6-12 months'),
  N('h_gelding_id', 80, 370, 'notable', 'Gelding Training Path', 'training', 'Geldings enter the performance/show training pipeline.', ['Performance training started'], '6-12 months'),
  N('h_gelding_ground', 100, 390, 'minor', 'Groundwork', 'training', 'Lunging, round pen, yielding, and respect exercises.', ['Ground manners established'], '8-12 months'),
  N('h_stallion_eval', 180, 370, 'notable', 'Stallion Prospect Eval', 'genetics', 'Only exceptional colts are kept intact. Evaluate conformation, movement, and pedigree.', ['Sire potential assessed'], '6-12 months'),

  // Ring 4
  N('h_groundwork', 0, 500, 'notable', 'Advanced Groundwork', 'training', 'Desensitization, flexion, and yielding. Building communication before riding.', ['Communication foundation'], '1-2 years'),
  N('h_halter_show', 330, 500, 'notable', 'Halter Show Prep', 'conformation', 'Condition, fitting, and presentation for halter classes.', ['Halter presentation'], '1-2 years'),
  N('h_nutrition', 60, 510, 'minor', 'Growth Nutrition', 'nutrition', 'Balanced ration for bone and muscle development.', ['Skeletal maturity supported'], '1-2 years'),
  N('h_farrier', 270, 510, 'minor', 'Farrier Program', 'health', 'Regular trimming/shoeing for soundness.', ['Hoof health maintained'], '1-2 years'),

  // Ring 5
  N('h_saddle', 0, 640, 'keystone', 'First Saddle / Backing', 'training', 'The foal becomes a riding horse. Careful, patient introduction to saddle and rider.', ['Under-saddle training begins'], '2-3 years'),
  N('h_western', 300, 650, 'notable', 'Western Discipline', 'training', 'Western pleasure, reining, trail, or ranch classes.', ['Western discipline chosen'], '2-3 years'),
  N('h_english', 60, 650, 'notable', 'English Discipline', 'training', 'Hunter, jumper, dressage, or equitation classes.', ['English discipline chosen'], '2-3 years'),
  N('h_halter_comp', 330, 640, 'minor', 'Halter Competition', 'conformation', 'Compete in breed halter classes.', ['Halter competition'], '2-3 years'),
  N('h_showmanship_h', 30, 640, 'notable', 'Showmanship at Halter', 'training', 'Handler evaluated on presentation and control.', ['Showmanship skills'], '2-3 years'),

  // Ring 6
  N('h_county', 350, 790, 'notable', 'County / Local Shows', 'training', 'First show ring experience.', ['Show career launched'], '2-4 years'),
  N('h_circuit', 30, 790, 'minor', 'Show Circuit', 'training', 'Regional circuit shows build experience.', ['Competition experience'], '3-5 years'),
  N('h_state', 0, 810, 'keystone', 'State / Regional Championship', 'training', 'Premier state-level competition.', ['State-level competition'], '3-5 years'),
  N('h_breed_show', 280, 800, 'minor', 'Breed Shows', 'training', 'AQHA, APHA, ApHC World Shows.', ['Breed-level competition'], '3-5 years'),

  // Ring 7
  N('h_national', 0, 940, 'keystone', 'National / World Show', 'training', 'Congress, AQHA World, etc. The pinnacle of show horse competition.', ['National/World competition'], '3-8 years'),
  N('h_champion', 330, 940, 'notable', 'Championship Title', 'training', 'World Champion, Congress Champion, or Reserve.', ['Championship pursuit'], '3-8 years'),
  N('h_filly_breed', 260, 950, 'keystone', 'Mare Retained for Breeding', 'genetics', 'Proven mare enters the broodmare band.', ['Broodmare career'], '4-10 years'),
  N('h_gelding_career', 80, 950, 'keystone', 'Performance Career', 'training', 'Long-term show and performance career.', ['Performance legacy'], '3-15 years'),
  N('h_stallion_stand', 180, 950, 'keystone', 'Stallion Stands at Stud', 'genetics', 'Proven stallion begins breeding career.', ['Genetic influence multiplied'], '3-8 years'),

  // Ring 8
  N('h_breeding_program', 0, 1100, 'keystone', 'Breeding Program', 'genetics', 'Multi-generational breeding decisions. Building a program.', ['Program established'], '5+ years'),
  N('h_next_gen', 300, 1100, 'notable', 'Next Generation', 'genetics', 'Select from own production.', ['Genetic improvement'], '5+ years'),
  N('h_mentor', 180, 1100, 'notable', 'Mentor Next Horseman', 'training', 'Pass knowledge forward.', ['Legacy contribution'], '5+ years'),
  N('h_retire', 60, 1100, 'minor', 'Retirement / Lesson Horse', 'management', 'Older horses transition to teaching or leisure.', ['Continued contribution'], '10+ years'),
];

const HORSE_EDGES = [
  E('h_birth','h_colostrum'), E('h_birth','h_imprint'), E('h_birth','h_navel'), E('h_birth','h_foal_id'),
  E('h_colostrum','h_halter_intro'), E('h_colostrum','h_vacc'),
  E('h_imprint','h_halter_intro'), E('h_navel','h_vacc'),
  E('h_foal_id','h_halter_intro'), E('h_vacc','h_wean'),
  E('h_halter_intro','h_wean'), E('h_halter_intro','h_sex_decide'),
  E('h_wean','h_sex_decide'), E('h_foot_care','h_wean'), E('h_foot_care','h_farrier'),
  E('h_sex_decide','h_filly_id'), E('h_sex_decide','h_gelding_id'), E('h_sex_decide','h_stallion_eval'),
  E('h_filly_id','h_filly_dev'), E('h_filly_dev','h_halter_show'),
  E('h_gelding_id','h_gelding_ground'), E('h_gelding_ground','h_groundwork'),
  E('h_stallion_eval','h_groundwork'),
  E('h_filly_id','h_halter_show'), E('h_gelding_id','h_groundwork'),
  E('h_groundwork','h_saddle'), E('h_groundwork','h_halter_show'),
  E('h_halter_show','h_halter_comp'), E('h_halter_show','h_showmanship_h'),
  E('h_nutrition','h_groundwork'), E('h_farrier','h_groundwork'),
  E('h_saddle','h_western'), E('h_saddle','h_english'),
  E('h_showmanship_h','h_county'), E('h_halter_comp','h_county'),
  E('h_western','h_county'), E('h_english','h_county'),
  E('h_county','h_circuit'), E('h_county','h_state'), E('h_county','h_breed_show'),
  E('h_circuit','h_state'), E('h_breed_show','h_state'),
  E('h_state','h_national'), E('h_state','h_champion'),
  E('h_national','h_champion'),
  E('h_champion','h_filly_breed'), E('h_champion','h_gelding_career'), E('h_champion','h_stallion_stand'),
  E('h_national','h_filly_breed'), E('h_national','h_stallion_stand'),
  E('h_filly_breed','h_breeding_program'), E('h_stallion_stand','h_breeding_program'),
  E('h_gelding_career','h_retire'),
  E('h_breeding_program','h_next_gen'), E('h_breeding_program','h_mentor'),
  E('h_next_gen','h_mentor'), E('h_retire','h_mentor'),
];

/* ============================================
   ASSEMBLED TREE MAP
   ============================================ */
const SPECIES_TREES = {
  pig:    { nodes: PIG_NODES,    edges: PIG_EDGES },
  cattle: { nodes: CATTLE_NODES, edges: CATTLE_EDGES },
  sheep:  { nodes: SHEEP_NODES,  edges: SHEEP_EDGES },
  goat:   { nodes: GOAT_NODES,   edges: GOAT_EDGES },
  horse:  { nodes: HORSE_NODES,  edges: HORSE_EDGES }
};
