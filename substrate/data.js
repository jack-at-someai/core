// Charlotte Substrate - Knowledge Graph Data
// Everything is a FACT document with register-based structure.
// FACT types: NODE, EDGE, METRIC, SIGNAL, PROTOCOL

const FACTS = [

  // ============================================================
  // TEMPORAL SPINE - DATE nodes (1-1-2026 through 1-30-2026)
  // ============================================================
  { ":ID": "DATE:1-1-2026",  ":TYPE": "NODE", ":CREATED": "DATE:1-1-2026",  "P0": "DATE" },
  { ":ID": "DATE:1-2-2026",  ":TYPE": "NODE", ":CREATED": "DATE:1-2-2026",  "P0": "DATE" },
  { ":ID": "DATE:1-3-2026",  ":TYPE": "NODE", ":CREATED": "DATE:1-3-2026",  "P0": "DATE" },
  { ":ID": "DATE:1-4-2026",  ":TYPE": "NODE", ":CREATED": "DATE:1-4-2026",  "P0": "DATE" },
  { ":ID": "DATE:1-5-2026",  ":TYPE": "NODE", ":CREATED": "DATE:1-5-2026",  "P0": "DATE" },
  { ":ID": "DATE:1-6-2026",  ":TYPE": "NODE", ":CREATED": "DATE:1-6-2026",  "P0": "DATE" },
  { ":ID": "DATE:1-7-2026",  ":TYPE": "NODE", ":CREATED": "DATE:1-7-2026",  "P0": "DATE" },
  { ":ID": "DATE:1-8-2026",  ":TYPE": "NODE", ":CREATED": "DATE:1-8-2026",  "P0": "DATE" },
  { ":ID": "DATE:1-9-2026",  ":TYPE": "NODE", ":CREATED": "DATE:1-9-2026",  "P0": "DATE" },
  { ":ID": "DATE:1-10-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-10-2026", "P0": "DATE" },
  { ":ID": "DATE:1-11-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-11-2026", "P0": "DATE" },
  { ":ID": "DATE:1-12-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-12-2026", "P0": "DATE" },
  { ":ID": "DATE:1-13-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-13-2026", "P0": "DATE" },
  { ":ID": "DATE:1-14-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-14-2026", "P0": "DATE" },
  { ":ID": "DATE:1-15-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-15-2026", "P0": "DATE" },
  { ":ID": "DATE:1-16-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-16-2026", "P0": "DATE" },
  { ":ID": "DATE:1-17-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-17-2026", "P0": "DATE" },
  { ":ID": "DATE:1-18-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-18-2026", "P0": "DATE" },
  { ":ID": "DATE:1-19-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-19-2026", "P0": "DATE" },
  { ":ID": "DATE:1-20-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-20-2026", "P0": "DATE" },
  { ":ID": "DATE:1-21-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-21-2026", "P0": "DATE" },
  { ":ID": "DATE:1-22-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-22-2026", "P0": "DATE" },
  { ":ID": "DATE:1-23-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-23-2026", "P0": "DATE" },
  { ":ID": "DATE:1-24-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-24-2026", "P0": "DATE" },
  { ":ID": "DATE:1-25-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-25-2026", "P0": "DATE" },
  { ":ID": "DATE:1-26-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-26-2026", "P0": "DATE" },
  { ":ID": "DATE:1-27-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-27-2026", "P0": "DATE" },
  { ":ID": "DATE:1-28-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-28-2026", "P0": "DATE" },
  { ":ID": "DATE:1-29-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-29-2026", "P0": "DATE" },
  { ":ID": "DATE:1-30-2026", ":TYPE": "NODE", ":CREATED": "DATE:1-30-2026", "P0": "DATE" },

  // TEMPORAL SPINE - NEXT edges linking dates in sequence
  { ":ID": "EDGE:date_next_1",  ":TYPE": "EDGE", ":CREATED": "DATE:1-1-2026",  "P0": "DATE:1-1-2026",  "P1": "DATE:1-2-2026",  "P2": "NEXT" },
  { ":ID": "EDGE:date_next_2",  ":TYPE": "EDGE", ":CREATED": "DATE:1-2-2026",  "P0": "DATE:1-2-2026",  "P1": "DATE:1-3-2026",  "P2": "NEXT" },
  { ":ID": "EDGE:date_next_3",  ":TYPE": "EDGE", ":CREATED": "DATE:1-3-2026",  "P0": "DATE:1-3-2026",  "P1": "DATE:1-4-2026",  "P2": "NEXT" },
  { ":ID": "EDGE:date_next_4",  ":TYPE": "EDGE", ":CREATED": "DATE:1-4-2026",  "P0": "DATE:1-4-2026",  "P1": "DATE:1-5-2026",  "P2": "NEXT" },
  { ":ID": "EDGE:date_next_5",  ":TYPE": "EDGE", ":CREATED": "DATE:1-5-2026",  "P0": "DATE:1-5-2026",  "P1": "DATE:1-6-2026",  "P2": "NEXT" },
  { ":ID": "EDGE:date_next_6",  ":TYPE": "EDGE", ":CREATED": "DATE:1-6-2026",  "P0": "DATE:1-6-2026",  "P1": "DATE:1-7-2026",  "P2": "NEXT" },
  { ":ID": "EDGE:date_next_7",  ":TYPE": "EDGE", ":CREATED": "DATE:1-7-2026",  "P0": "DATE:1-7-2026",  "P1": "DATE:1-8-2026",  "P2": "NEXT" },
  { ":ID": "EDGE:date_next_8",  ":TYPE": "EDGE", ":CREATED": "DATE:1-8-2026",  "P0": "DATE:1-8-2026",  "P1": "DATE:1-9-2026",  "P2": "NEXT" },
  { ":ID": "EDGE:date_next_9",  ":TYPE": "EDGE", ":CREATED": "DATE:1-9-2026",  "P0": "DATE:1-9-2026",  "P1": "DATE:1-10-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_10", ":TYPE": "EDGE", ":CREATED": "DATE:1-10-2026", "P0": "DATE:1-10-2026", "P1": "DATE:1-11-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_11", ":TYPE": "EDGE", ":CREATED": "DATE:1-11-2026", "P0": "DATE:1-11-2026", "P1": "DATE:1-12-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_12", ":TYPE": "EDGE", ":CREATED": "DATE:1-12-2026", "P0": "DATE:1-12-2026", "P1": "DATE:1-13-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_13", ":TYPE": "EDGE", ":CREATED": "DATE:1-13-2026", "P0": "DATE:1-13-2026", "P1": "DATE:1-14-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_14", ":TYPE": "EDGE", ":CREATED": "DATE:1-14-2026", "P0": "DATE:1-14-2026", "P1": "DATE:1-15-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_15", ":TYPE": "EDGE", ":CREATED": "DATE:1-15-2026", "P0": "DATE:1-15-2026", "P1": "DATE:1-16-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_16", ":TYPE": "EDGE", ":CREATED": "DATE:1-16-2026", "P0": "DATE:1-16-2026", "P1": "DATE:1-17-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_17", ":TYPE": "EDGE", ":CREATED": "DATE:1-17-2026", "P0": "DATE:1-17-2026", "P1": "DATE:1-18-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_18", ":TYPE": "EDGE", ":CREATED": "DATE:1-18-2026", "P0": "DATE:1-18-2026", "P1": "DATE:1-19-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_19", ":TYPE": "EDGE", ":CREATED": "DATE:1-19-2026", "P0": "DATE:1-19-2026", "P1": "DATE:1-20-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_20", ":TYPE": "EDGE", ":CREATED": "DATE:1-20-2026", "P0": "DATE:1-20-2026", "P1": "DATE:1-21-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_21", ":TYPE": "EDGE", ":CREATED": "DATE:1-21-2026", "P0": "DATE:1-21-2026", "P1": "DATE:1-22-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_22", ":TYPE": "EDGE", ":CREATED": "DATE:1-22-2026", "P0": "DATE:1-22-2026", "P1": "DATE:1-23-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_23", ":TYPE": "EDGE", ":CREATED": "DATE:1-23-2026", "P0": "DATE:1-23-2026", "P1": "DATE:1-24-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_24", ":TYPE": "EDGE", ":CREATED": "DATE:1-24-2026", "P0": "DATE:1-24-2026", "P1": "DATE:1-25-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_25", ":TYPE": "EDGE", ":CREATED": "DATE:1-25-2026", "P0": "DATE:1-25-2026", "P1": "DATE:1-26-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_26", ":TYPE": "EDGE", ":CREATED": "DATE:1-26-2026", "P0": "DATE:1-26-2026", "P1": "DATE:1-27-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_27", ":TYPE": "EDGE", ":CREATED": "DATE:1-27-2026", "P0": "DATE:1-27-2026", "P1": "DATE:1-28-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_28", ":TYPE": "EDGE", ":CREATED": "DATE:1-28-2026", "P0": "DATE:1-28-2026", "P1": "DATE:1-29-2026", "P2": "NEXT" },
  { ":ID": "EDGE:date_next_29", ":TYPE": "EDGE", ":CREATED": "DATE:1-29-2026", "P0": "DATE:1-29-2026", "P1": "DATE:1-30-2026", "P2": "NEXT" },

  // ============================================================
  // SPATIAL LAYER - Geography nodes
  // ============================================================
  { ":ID": "COUNTRY:USA",      ":TYPE": "NODE", ":CREATED": "DATE:1-1-2026", "P0": "COUNTRY" },
  { ":ID": "STATE:MO",         ":TYPE": "NODE", ":CREATED": "DATE:1-1-2026", "P0": "STATE" },
  { ":ID": "CITY:TAYLOR_MO",   ":TYPE": "NODE", ":CREATED": "DATE:1-1-2026", "P0": "CITY" },

  // SPATIAL LAYER - LOCATED_IN edges
  { ":ID": "EDGE:state_in_country", ":TYPE": "EDGE", ":CREATED": "DATE:1-1-2026", "P0": "STATE:MO",       "P1": "COUNTRY:USA",    "P2": "LOCATED_IN" },
  { ":ID": "EDGE:city_in_state",    ":TYPE": "EDGE", ":CREATED": "DATE:1-1-2026", "P0": "CITY:TAYLOR_MO", "P1": "STATE:MO",       "P2": "LOCATED_IN" },

  // ============================================================
  // OPERATION
  // ============================================================
  { ":ID": "OP:trogdon_showpigs", ":TYPE": "NODE", ":CREATED": "DATE:1-1-2026", "P0": "OPERATION" },

  // Operation location
  { ":ID": "EDGE:op_location", ":TYPE": "EDGE", ":CREATED": "DATE:1-1-2026", "P0": "OP:trogdon_showpigs", "P1": "CITY:TAYLOR_MO", "P2": "LOCATED_IN" },

  // ============================================================
  // SOWS
  // ============================================================
  { ":ID": "SOW:bella",   ":TYPE": "NODE", ":CREATED": "DATE:1-1-2026", "P0": "SOW" },
  { ":ID": "SOW:ruby",    ":TYPE": "NODE", ":CREATED": "DATE:1-1-2026", "P0": "SOW" },
  { ":ID": "SOW:diamond", ":TYPE": "NODE", ":CREATED": "DATE:1-1-2026", "P0": "SOW" },

  // OWNS edges - operation owns sows
  { ":ID": "EDGE:owns_bella",   ":TYPE": "EDGE", ":CREATED": "DATE:1-1-2026", "P0": "OP:trogdon_showpigs", "P1": "SOW:bella",   "P2": "OWNS" },
  { ":ID": "EDGE:owns_ruby",    ":TYPE": "EDGE", ":CREATED": "DATE:1-1-2026", "P0": "OP:trogdon_showpigs", "P1": "SOW:ruby",    "P2": "OWNS" },
  { ":ID": "EDGE:owns_diamond", ":TYPE": "EDGE", ":CREATED": "DATE:1-1-2026", "P0": "OP:trogdon_showpigs", "P1": "SOW:diamond", "P2": "OWNS" },

  // ============================================================
  // BOAR
  // ============================================================
  { ":ID": "BOAR:titan", ":TYPE": "NODE", ":CREATED": "DATE:1-1-2026", "P0": "BOAR" },

  // OWNS edge - operation owns boar
  { ":ID": "EDGE:owns_titan", ":TYPE": "EDGE", ":CREATED": "DATE:1-1-2026", "P0": "OP:trogdon_showpigs", "P1": "BOAR:titan", "P2": "OWNS" },

  // ============================================================
  // BREEDING GROUPS
  // ============================================================
  { ":ID": "BG:bella_jan26", ":TYPE": "NODE", ":CREATED": "DATE:1-3-2026", "P0": "BREEDING_GROUP" },
  { ":ID": "BG:ruby_jan26",  ":TYPE": "NODE", ":CREATED": "DATE:1-5-2026", "P0": "BREEDING_GROUP" },

  // MEMBER_OF edges - sows and boar into breeding groups
  { ":ID": "EDGE:bella_bg_member",     ":TYPE": "EDGE", ":CREATED": "DATE:1-3-2026", "P0": "SOW:bella",   "P1": "BG:bella_jan26", "P2": "MEMBER_OF" },
  { ":ID": "EDGE:titan_bg_bella",      ":TYPE": "EDGE", ":CREATED": "DATE:1-3-2026", "P0": "BOAR:titan",  "P1": "BG:bella_jan26", "P2": "MEMBER_OF" },
  { ":ID": "EDGE:ruby_bg_member",      ":TYPE": "EDGE", ":CREATED": "DATE:1-5-2026", "P0": "SOW:ruby",    "P1": "BG:ruby_jan26",  "P2": "MEMBER_OF" },
  { ":ID": "EDGE:titan_bg_ruby",       ":TYPE": "EDGE", ":CREATED": "DATE:1-5-2026", "P0": "BOAR:titan",  "P1": "BG:ruby_jan26",  "P2": "MEMBER_OF" },

  // ============================================================
  // LITTER
  // ============================================================
  { ":ID": "LITTER:ruby_jan26", ":TYPE": "NODE", ":CREATED": "DATE:1-22-2026", "P0": "LITTER" },

  // PARENT_OF edge - breeding group produced litter
  { ":ID": "EDGE:bg_parent_litter", ":TYPE": "EDGE", ":CREATED": "DATE:1-22-2026", "P0": "BG:ruby_jan26", "P1": "LITTER:ruby_jan26", "P2": "PARENT_OF" },

  // BORN_ON edge - litter born on date
  { ":ID": "EDGE:litter_born", ":TYPE": "EDGE", ":CREATED": "DATE:1-22-2026", "P0": "LITTER:ruby_jan26", "P1": "DATE:1-22-2026", "P2": "BORN_ON" },

  // ============================================================
  // METRICS - Measurable dimensions on sows / litter / boar
  // ============================================================
  { ":ID": "METRIC:name",       ":TYPE": "METRIC", ":CREATED": "DATE:1-1-2026", "P0": "SOW:bella",   "P1": "STRING", "P2": "name" },
  { ":ID": "METRIC:weight",     ":TYPE": "METRIC", ":CREATED": "DATE:1-1-2026", "P0": "SOW:bella",   "P1": "NUMBER", "P2": "weight" },
  { ":ID": "METRIC:status",     ":TYPE": "METRIC", ":CREATED": "DATE:1-1-2026", "P0": "SOW:bella",   "P1": "STRING", "P2": "status" },
  { ":ID": "METRIC:breed",      ":TYPE": "METRIC", ":CREATED": "DATE:1-1-2026", "P0": "SOW:bella",   "P1": "STRING", "P2": "breed" },

  { ":ID": "METRIC:ruby_name",   ":TYPE": "METRIC", ":CREATED": "DATE:1-1-2026", "P0": "SOW:ruby",   "P1": "STRING", "P2": "name" },
  { ":ID": "METRIC:ruby_weight", ":TYPE": "METRIC", ":CREATED": "DATE:1-1-2026", "P0": "SOW:ruby",   "P1": "NUMBER", "P2": "weight" },
  { ":ID": "METRIC:ruby_status", ":TYPE": "METRIC", ":CREATED": "DATE:1-1-2026", "P0": "SOW:ruby",   "P1": "STRING", "P2": "status" },
  { ":ID": "METRIC:ruby_breed",  ":TYPE": "METRIC", ":CREATED": "DATE:1-1-2026", "P0": "SOW:ruby",   "P1": "STRING", "P2": "breed" },

  { ":ID": "METRIC:diamond_name",   ":TYPE": "METRIC", ":CREATED": "DATE:1-1-2026", "P0": "SOW:diamond", "P1": "STRING", "P2": "name" },
  { ":ID": "METRIC:diamond_weight", ":TYPE": "METRIC", ":CREATED": "DATE:1-1-2026", "P0": "SOW:diamond", "P1": "NUMBER", "P2": "weight" },
  { ":ID": "METRIC:diamond_status", ":TYPE": "METRIC", ":CREATED": "DATE:1-1-2026", "P0": "SOW:diamond", "P1": "STRING", "P2": "status" },
  { ":ID": "METRIC:diamond_breed",  ":TYPE": "METRIC", ":CREATED": "DATE:1-1-2026", "P0": "SOW:diamond", "P1": "STRING", "P2": "breed" },

  { ":ID": "METRIC:titan_name",   ":TYPE": "METRIC", ":CREATED": "DATE:1-1-2026", "P0": "BOAR:titan", "P1": "STRING", "P2": "name" },
  { ":ID": "METRIC:titan_weight", ":TYPE": "METRIC", ":CREATED": "DATE:1-1-2026", "P0": "BOAR:titan", "P1": "NUMBER", "P2": "weight" },
  { ":ID": "METRIC:titan_breed",  ":TYPE": "METRIC", ":CREATED": "DATE:1-1-2026", "P0": "BOAR:titan", "P1": "STRING", "P2": "breed" },

  { ":ID": "METRIC:litter_size",  ":TYPE": "METRIC", ":CREATED": "DATE:1-22-2026", "P0": "LITTER:ruby_jan26", "P1": "NUMBER", "P2": "litter_size" },
  { ":ID": "METRIC:born_alive",   ":TYPE": "METRIC", ":CREATED": "DATE:1-22-2026", "P0": "LITTER:ruby_jan26", "P1": "NUMBER", "P2": "born_alive" },

  // ============================================================
  // SIGNALS - Time-indexed observations
  // ============================================================

  // --- Bella: name ---
  { ":ID": "SIG:bella_name_1",    ":TYPE": "SIGNAL", ":CREATED": "DATE:1-1-2026",  "P0": "SOW:bella", "P1": "METRIC:name",   "P2": "Bella" },

  // --- Bella: breed ---
  { ":ID": "SIG:bella_breed_1",   ":TYPE": "SIGNAL", ":CREATED": "DATE:1-1-2026",  "P0": "SOW:bella", "P1": "METRIC:breed",  "P2": "Hampshire" },

  // --- Bella: weight over time ---
  { ":ID": "SIG:bella_wt_1",      ":TYPE": "SIGNAL", ":CREATED": "DATE:1-1-2026",  "P0": "SOW:bella", "P1": "METRIC:weight", "P2": "485" },
  { ":ID": "SIG:bella_wt_2",      ":TYPE": "SIGNAL", ":CREATED": "DATE:1-7-2026",  "P0": "SOW:bella", "P1": "METRIC:weight", "P2": "490" },
  { ":ID": "SIG:bella_wt_3",      ":TYPE": "SIGNAL", ":CREATED": "DATE:1-14-2026", "P0": "SOW:bella", "P1": "METRIC:weight", "P2": "498" },
  { ":ID": "SIG:bella_wt_4",      ":TYPE": "SIGNAL", ":CREATED": "DATE:1-21-2026", "P0": "SOW:bella", "P1": "METRIC:weight", "P2": "505" },
  { ":ID": "SIG:bella_wt_5",      ":TYPE": "SIGNAL", ":CREATED": "DATE:1-28-2026", "P0": "SOW:bella", "P1": "METRIC:weight", "P2": "512" },

  // --- Bella: status over time ---
  { ":ID": "SIG:bella_status_1",  ":TYPE": "SIGNAL", ":CREATED": "DATE:1-1-2026",  "P0": "SOW:bella", "P1": "METRIC:status", "P2": "open" },
  { ":ID": "SIG:bella_status_2",  ":TYPE": "SIGNAL", ":CREATED": "DATE:1-3-2026",  "P0": "SOW:bella", "P1": "METRIC:status", "P2": "bred" },
  { ":ID": "SIG:bella_status_3",  ":TYPE": "SIGNAL", ":CREATED": "DATE:1-10-2026", "P0": "SOW:bella", "P1": "METRIC:status", "P2": "gestating" },

  // --- Ruby: name ---
  { ":ID": "SIG:ruby_name_1",     ":TYPE": "SIGNAL", ":CREATED": "DATE:1-1-2026",  "P0": "SOW:ruby", "P1": "METRIC:ruby_name",   "P2": "Ruby" },

  // --- Ruby: breed ---
  { ":ID": "SIG:ruby_breed_1",    ":TYPE": "SIGNAL", ":CREATED": "DATE:1-1-2026",  "P0": "SOW:ruby", "P1": "METRIC:ruby_breed",  "P2": "Duroc" },

  // --- Ruby: weight over time ---
  { ":ID": "SIG:ruby_wt_1",       ":TYPE": "SIGNAL", ":CREATED": "DATE:1-1-2026",  "P0": "SOW:ruby", "P1": "METRIC:ruby_weight", "P2": "510" },
  { ":ID": "SIG:ruby_wt_2",       ":TYPE": "SIGNAL", ":CREATED": "DATE:1-7-2026",  "P0": "SOW:ruby", "P1": "METRIC:ruby_weight", "P2": "518" },
  { ":ID": "SIG:ruby_wt_3",       ":TYPE": "SIGNAL", ":CREATED": "DATE:1-14-2026", "P0": "SOW:ruby", "P1": "METRIC:ruby_weight", "P2": "525" },
  { ":ID": "SIG:ruby_wt_4",       ":TYPE": "SIGNAL", ":CREATED": "DATE:1-21-2026", "P0": "SOW:ruby", "P1": "METRIC:ruby_weight", "P2": "530" },
  { ":ID": "SIG:ruby_wt_5",       ":TYPE": "SIGNAL", ":CREATED": "DATE:1-28-2026", "P0": "SOW:ruby", "P1": "METRIC:ruby_weight", "P2": "495" },

  // --- Ruby: status over time ---
  { ":ID": "SIG:ruby_status_1",   ":TYPE": "SIGNAL", ":CREATED": "DATE:1-1-2026",  "P0": "SOW:ruby", "P1": "METRIC:ruby_status", "P2": "open" },
  { ":ID": "SIG:ruby_status_2",   ":TYPE": "SIGNAL", ":CREATED": "DATE:1-5-2026",  "P0": "SOW:ruby", "P1": "METRIC:ruby_status", "P2": "bred" },
  { ":ID": "SIG:ruby_status_3",   ":TYPE": "SIGNAL", ":CREATED": "DATE:1-12-2026", "P0": "SOW:ruby", "P1": "METRIC:ruby_status", "P2": "gestating" },
  { ":ID": "SIG:ruby_status_4",   ":TYPE": "SIGNAL", ":CREATED": "DATE:1-22-2026", "P0": "SOW:ruby", "P1": "METRIC:ruby_status", "P2": "farrowed" },
  { ":ID": "SIG:ruby_status_5",   ":TYPE": "SIGNAL", ":CREATED": "DATE:1-28-2026", "P0": "SOW:ruby", "P1": "METRIC:ruby_status", "P2": "nursing" },

  // --- Diamond: name ---
  { ":ID": "SIG:diamond_name_1",  ":TYPE": "SIGNAL", ":CREATED": "DATE:1-1-2026",  "P0": "SOW:diamond", "P1": "METRIC:diamond_name",   "P2": "Diamond" },

  // --- Diamond: breed ---
  { ":ID": "SIG:diamond_breed_1", ":TYPE": "SIGNAL", ":CREATED": "DATE:1-1-2026",  "P0": "SOW:diamond", "P1": "METRIC:diamond_breed",  "P2": "Yorkshire" },

  // --- Diamond: weight over time ---
  { ":ID": "SIG:diamond_wt_1",    ":TYPE": "SIGNAL", ":CREATED": "DATE:1-1-2026",  "P0": "SOW:diamond", "P1": "METRIC:diamond_weight", "P2": "470" },
  { ":ID": "SIG:diamond_wt_2",    ":TYPE": "SIGNAL", ":CREATED": "DATE:1-7-2026",  "P0": "SOW:diamond", "P1": "METRIC:diamond_weight", "P2": "475" },
  { ":ID": "SIG:diamond_wt_3",    ":TYPE": "SIGNAL", ":CREATED": "DATE:1-14-2026", "P0": "SOW:diamond", "P1": "METRIC:diamond_weight", "P2": "478" },
  { ":ID": "SIG:diamond_wt_4",    ":TYPE": "SIGNAL", ":CREATED": "DATE:1-21-2026", "P0": "SOW:diamond", "P1": "METRIC:diamond_weight", "P2": "482" },
  { ":ID": "SIG:diamond_wt_5",    ":TYPE": "SIGNAL", ":CREATED": "DATE:1-28-2026", "P0": "SOW:diamond", "P1": "METRIC:diamond_weight", "P2": "486" },

  // --- Diamond: status over time ---
  { ":ID": "SIG:diamond_status_1", ":TYPE": "SIGNAL", ":CREATED": "DATE:1-1-2026",  "P0": "SOW:diamond", "P1": "METRIC:diamond_status", "P2": "open" },
  { ":ID": "SIG:diamond_status_2", ":TYPE": "SIGNAL", ":CREATED": "DATE:1-15-2026", "P0": "SOW:diamond", "P1": "METRIC:diamond_status", "P2": "heat_detected" },
  { ":ID": "SIG:diamond_status_3", ":TYPE": "SIGNAL", ":CREATED": "DATE:1-20-2026", "P0": "SOW:diamond", "P1": "METRIC:diamond_status", "P2": "open" },

  // --- Titan (boar): name, breed, weight ---
  { ":ID": "SIG:titan_name_1",    ":TYPE": "SIGNAL", ":CREATED": "DATE:1-1-2026",  "P0": "BOAR:titan", "P1": "METRIC:titan_name",   "P2": "Titan" },
  { ":ID": "SIG:titan_breed_1",   ":TYPE": "SIGNAL", ":CREATED": "DATE:1-1-2026",  "P0": "BOAR:titan", "P1": "METRIC:titan_breed",  "P2": "Hampshire" },
  { ":ID": "SIG:titan_wt_1",      ":TYPE": "SIGNAL", ":CREATED": "DATE:1-1-2026",  "P0": "BOAR:titan", "P1": "METRIC:titan_weight", "P2": "620" },
  { ":ID": "SIG:titan_wt_2",      ":TYPE": "SIGNAL", ":CREATED": "DATE:1-14-2026", "P0": "BOAR:titan", "P1": "METRIC:titan_weight", "P2": "625" },
  { ":ID": "SIG:titan_wt_3",      ":TYPE": "SIGNAL", ":CREATED": "DATE:1-28-2026", "P0": "BOAR:titan", "P1": "METRIC:titan_weight", "P2": "628" },

  // --- Litter: size and born alive ---
  { ":ID": "SIG:litter_size_1",   ":TYPE": "SIGNAL", ":CREATED": "DATE:1-22-2026", "P0": "LITTER:ruby_jan26", "P1": "METRIC:litter_size", "P2": "12" },
  { ":ID": "SIG:born_alive_1",    ":TYPE": "SIGNAL", ":CREATED": "DATE:1-22-2026", "P0": "LITTER:ruby_jan26", "P1": "METRIC:born_alive",  "P2": "11" },

  // ============================================================
  // PROTOCOL - Ruby's gestation tracking
  // ============================================================
  { ":ID": "PROTOCOL:ruby_gestation", ":TYPE": "PROTOCOL", ":CREATED": "DATE:1-5-2026", "P0": "SOW:ruby", "P1": "EVERY:7d|FROM:DATE:1-5-2026|UNTIL:DATE:5-1-2026", "P2": "weight>=400;status!=deceased;temp<104" },

  // ============================================================
  // CHAT - Demonstrating chat-as-graph
  // ============================================================
  { ":ID": "CHAT:main",   ":TYPE": "NODE", ":CREATED": "DATE:1-22-2026", "P0": "CHAT" },
  { ":ID": "MSG:1",       ":TYPE": "NODE", ":CREATED": "DATE:1-22-2026", "P0": "MESSAGE" },
  { ":ID": "MSG:2",       ":TYPE": "NODE", ":CREATED": "DATE:1-22-2026", "P0": "MESSAGE" },

  // MSG:1 belongs to CHAT:main
  { ":ID": "EDGE:msg1_belongs", ":TYPE": "EDGE", ":CREATED": "DATE:1-22-2026", "P0": "MSG:1", "P1": "CHAT:main", "P2": "BELONGS_TO" },

  // MSG:2 belongs to CHAT:main
  { ":ID": "EDGE:msg2_belongs", ":TYPE": "EDGE", ":CREATED": "DATE:1-22-2026", "P0": "MSG:2", "P1": "CHAT:main", "P2": "BELONGS_TO" },

  // MSG:1 -> MSG:2 (conversation sequence)
  { ":ID": "EDGE:msg_next_1", ":TYPE": "EDGE", ":CREATED": "DATE:1-22-2026", "P0": "MSG:1", "P1": "MSG:2", "P2": "NEXT" },

  // Message content as METRIC + SIGNAL
  { ":ID": "METRIC:msg_content_1", ":TYPE": "METRIC", ":CREATED": "DATE:1-22-2026", "P0": "MSG:1", "P1": "STRING", "P2": "content" },
  { ":ID": "METRIC:msg_content_2", ":TYPE": "METRIC", ":CREATED": "DATE:1-22-2026", "P0": "MSG:2", "P1": "STRING", "P2": "content" },

  { ":ID": "SIG:msg1_text", ":TYPE": "SIGNAL", ":CREATED": "DATE:1-22-2026", "P0": "MSG:1", "P1": "METRIC:msg_content_1", "P2": "Ruby farrowed this morning. 12 piglets, 11 born alive." },
  { ":ID": "SIG:msg2_text", ":TYPE": "SIGNAL", ":CREATED": "DATE:1-22-2026", "P0": "MSG:2", "P1": "METRIC:msg_content_2", "P2": "Great news! Updating the litter record now." },

  // MSG:2 references the litter
  { ":ID": "EDGE:msg2_ref_litter", ":TYPE": "EDGE", ":CREATED": "DATE:1-22-2026", "P0": "MSG:2", "P1": "LITTER:ruby_jan26", "P2": "REFERENCES" },
];

// ============================================================
// VISUALIZATION HELPERS
// ============================================================

const TYPE_COLORS = {
  NODE:     '#22d3ee',
  EDGE:     '#94a3b8',
  METRIC:   '#6366f1',
  SIGNAL:   '#f59e0b',
  PROTOCOL: '#ec4899'
};

const CATEGORY_COLORS = {
  DATE:           '#334155',
  TIME:           '#334155',
  OPERATION:      '#22c55e',
  SOW:            '#ec4899',
  BOAR:           '#6366f1',
  BREEDING_GROUP: '#f59e0b',
  LITTER:         '#22d3ee',
  COUNTRY:        '#475569',
  STATE:          '#475569',
  CITY:           '#475569',
  CHAT:           '#818cf8',
  MESSAGE:        '#818cf8',
  METRIC:         '#6366f1',
  DEFAULT:        '#64748b'
};
