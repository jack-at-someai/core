# JOURNEY Knowledge Graph — FINN Primitive Analysis

Knowledge graph built from visual analysis of **1248 photos** in the JOURNEY archive,
mapped to Charlotte's five FINN primitives (NODE, EDGE, METRIC, SIGNAL, PROTOCOL).

---

## Graph Statistics

| Primitive | Count |
|-----------|-------|
| NODEs | 119 |
| EDGEs | 27 |
| METRICs | 9 |
| SIGNALs | 6235 |
| PROTOCOLs | 3 |

## NODEs — Identity Categories

| Category | Count |
|----------|-------|
| OBJECT | 80 |
| DOMAIN | 10 |
| PERSON | 8 |
| ORGANIZATION | 8 |
| PLATFORM | 7 |
| INSTITUTION | 3 |
| CONCEPT | 3 |

## Gravitational Pull — Top Nodes by Signal Density

| Node | Category | Signals | Edges |
|------|----------|---------|-------|
| Jack Richard | PERSON | 6230 | 16 |
| Charlotte | ORGANIZATION | 0 | 8 |
| Jim Richard | PERSON | 0 | 3 |
| Donald Almquist | PERSON | 0 | 3 |
| LineLeap | ORGANIZATION | 0 | 2 |
| ISG | ORGANIZATION | 0 | 2 |
| Serengeti | ORGANIZATION | 0 | 2 |
| Infant | PERSON | 1 | 1 |
| Dj | PERSON | 1 | 1 |
| Sounder | ORGANIZATION | 0 | 1 |
| Prier Violins | ORGANIZATION | 0 | 1 |
| SomeAI | ORGANIZATION | 0 | 1 |
| 3SG | ORGANIZATION | 0 | 1 |
| Rose-Hulman | INSTITUTION | 0 | 1 |
| Northwestern | INSTITUTION | 0 | 1 |
| General Motors | INSTITUTION | 0 | 1 |
| Temporal Torus | CONCEPT | 0 | 1 |
| Convex Hull | CONCEPT | 0 | 1 |
| FINN Primitives | CONCEPT | 0 | 1 |
| Technology | DOMAIN | 0 | 1 |

## EDGEs — Relationship Types

| Type | Count |
|------|-------|
| PRACTICES | 6 |
| VALIDATES_ON | 4 |
| FOUNDED | 3 |
| IMPLEMENTS | 3 |
| ATTENDED | 2 |
| APPEARS_WITH | 2 |
| CHILD_OF | 1 |
| GRANDCHILD_OF | 1 |
| EXECUTIVE_AT | 1 |
| MEMBER_OF | 1 |
| LEADS | 1 |
| SON_IN_LAW_OF | 1 |
| ACQUIRED | 1 |

### Structural Relationships

- **Jack Richard** --[CHILD_OF]--> **Jim Richard**
- **Jack Richard** --[GRANDCHILD_OF]--> **Donald Almquist**
- **Jim Richard** --[FOUNDED]--> **Serengeti**
- **Donald Almquist** --[EXECUTIVE_AT]--> **General Motors**
- **Jack Richard** --[FOUNDED]--> **LineLeap**
- **Jack Richard** --[FOUNDED]--> **Charlotte**
- **Jack Richard** --[MEMBER_OF]--> **SomeAI**
- **Jack Richard** --[LEADS]--> **3SG**
- **Jack Richard** --[ATTENDED]--> **Rose-Hulman**
- **Jack Richard** --[ATTENDED]--> **Northwestern**
- **Charlotte** --[VALIDATES_ON]--> **LineLeap**
- **Charlotte** --[VALIDATES_ON]--> **Sounder**
- **Charlotte** --[VALIDATES_ON]--> **ISG**
- **Charlotte** --[VALIDATES_ON]--> **Prier Violins**
- **Charlotte** --[IMPLEMENTS]--> **Temporal Torus**
- **Charlotte** --[IMPLEMENTS]--> **Convex Hull**
- **Charlotte** --[IMPLEMENTS]--> **FINN Primitives**
- **Jim Richard** --[SON_IN_LAW_OF]--> **Donald Almquist**
- **Serengeti** --[ACQUIRED]--> **ISG**
- **Jack Richard** --[PRACTICES]--> **Technology**
- **Jack Richard** --[PRACTICES]--> **Creative Expression**
- **Jack Richard** --[PRACTICES]--> **Exploration**
- **Jack Richard** --[PRACTICES]--> **Social Life**
- **Jack Richard** --[PRACTICES]--> **Family & Generational**
- **Jack Richard** --[PRACTICES]--> **Academic**

### Co-Occurrence (People Who Appear with Jack)

| Person | Photos Together |
|--------|----------------|
| Infant | 5 |
| Dj | 5 |

## METRICs — Measurement Definitions

| ID | Metric | Type | Description |
|----|--------|------|-------------|
| M0001 | photo_appearance | NUMBER | Number of photos a person appears in |
| M0002 | setting_type | ENUM | Type of physical/digital setting observed |
| M0003 | mood_observed | ENUM | Perceived mood/tone in photo |
| M0004 | content_category | ENUM | Thematic category of image |
| M0005 | life_domain | ENUM | Life domain the observation maps to |
| M0006 | era_active | STRING | Time era in which entity is observed |
| M0007 | platform_activity | ENUM | Social platform where activity captured |
| M0008 | entity_present | STRING | Entity/object observed in frame |
| M0009 | visual_complexity | ENUM | Simple vs complex visual composition |

## SIGNALs — Observational Patterns

### Content Category Distribution

| Category | Count | % |
|----------|-------|---|
| reference | 330 | 26.4% |
| screenshot_app | 170 | 13.6% |
| work | 145 | 11.6% |
| screenshot_social | 126 | 10.1% |
| meme | 79 | 6.3% |
| family | 62 | 5.0% |
| travel | 60 | 4.8% |
| art_ai | 51 | 4.1% |
| event | 47 | 3.8% |
| food | 39 | 3.1% |
| social | 31 | 2.5% |
| product | 28 | 2.2% |
| friends | 21 | 1.7% |
| selfie | 17 | 1.4% |
| portrait | 13 | 1.0% |
| branding | 10 | 0.8% |
| livestock | 9 | 0.7% |
| nature | 5 | 0.4% |
| industrial | 3 | 0.2% |
| unknown | 2 | 0.2% |

### Mood Distribution

| Mood | Count | % |
|------|-------|---|
| informational | 471 | 37.7% |
| professional | 281 | 22.5% |
| casual | 155 | 12.4% |
| artistic | 85 | 6.8% |
| celebratory | 67 | 5.4% |
| serious | 67 | 5.4% |
| intimate | 49 | 3.9% |
| humorous | 35 | 2.8% |
| adventurous | 16 | 1.3% |
| nostalgic | 11 | 0.9% |
| inspirational | 7 | 0.6% |
| unknown | 2 | 0.2% |
| social | 2 | 0.2% |

### Setting Distribution

| Setting | Count | % |
|---------|-------|---|
| digital | 414 | 33.2% |
| indoor | 371 | 29.7% |
| screenshot | 307 | 24.6% |
| outdoor | 151 | 12.1% |
| screenshot_app | 3 | 0.2% |
| screenshot_social | 2 | 0.2% |

### Temporal Distribution

| Era | Count |
|-----|-------|
| 1800s | 1 |
| 1900s | 3 |
| 1950s | 1 |
| 1970s | 1 |
| 1984 | 1 |
| 1990s | 1 |
| 1996 | 1 |
| 2000s-2010s | 1 |
| 2006 | 1 |
| 2010 | 1 |
| 2010s | 9 |
| 2014 | 1 |
| 2014-2015 | 1 |
| 2014-2024 | 1 |
| 2017-2018 | 1 |
| 2018 | 7 |
| 2018-2019 | 3 |
| 2019 | 34 |
| 2020 | 4 |
| 2020-2023 | 1 |
| 2020s | 631 |
| 2021 | 17 |
| 2022 | 13 |
| 2023 | 64 |
| 2023-2024 | 5 |
| 2024 | 284 |
| 2025 | 55 |
| ancient | 17 |
| colonial | 1 |
| educational | 1 |
| historic | 3 |
| historical | 4 |
| historical_reference | 1 |
| medieval | 2 |
| modern | 63 |
| recent | 3 |
| renaissance | 1 |
| unknown | 9 |

## PROTOCOLs — Forward-Looking Expectations

### Domain focus shifts from social/personal toward technology and creative expression over time

**Node:** Jack Richard

- **early_eras:** Dominated by social, friends, events
- **middle_eras:** Increasing work, product, and reference content
- **late_eras:** AI art, architecture diagrams, technical screenshots
- **expected:** Continued deepening of technology + creative convergence
**era_distribution:**
  - 1800s: {'reference': 1}
  - 1900s: {'reference': 2, 'meme': 1}
  - 1950s: {'reference': 1}
  - 1970s: {'reference': 1}
  - 1984: {'reference': 1}
  - 1990s: {'reference': 1}
  - 1996: {'meme': 1}
  - 2000s-2010s: {'nature': 1}

### Mood profile: primarily informational and professional, with artistic expression growing

**Node:** Jack Richard

**current_distribution:**
  - informational: 471
  - professional: 281
  - casual: 155
  - artistic: 85
  - celebratory: 67
  - serious: 67
  - intimate: 49
  - humorous: 35
  - adventurous: 16
  - nostalgic: 11
  - inspirational: 7
  - unknown: 2
  - social: 2
- **trajectory:** Increasing professional + artistic, decreasing casual
- **interpretation:** The archive reflects someone who processes the world through information gathering and professional lens, with growing creative output

### Setting profile: digital-first presence — more screenshots than outdoor photos

**Node:** Jack Richard

**current_distribution:**
  - digital: 414
  - indoor: 371
  - screenshot: 307
  - outdoor: 151
  - screenshot_app: 3
  - screenshot_social: 2
- **interpretation:** Jack lives significantly in digital space — more content is captured from screens than from physical environments. This is consistent with a builder who processes reality through technology.

---

## Narrative Synthesis — What the Photos Reveal About Jack Richard

### The Digital Architect

**58% of the archive is digital content** — screenshots, app captures, saved references. Only 12% is outdoor photography. This is not someone who documents the physical world; this is someone who documents *information*. The camera roll is a knowledge capture system, not a photo album.

### The Information Gatherer

**38% informational, 23% professional** — the dominant moods. Jack processes reality through a research lens. Screenshots of articles, technical diagrams, data visualizations, code, architecture patterns. The archive reads like a research journal, not a social media feed.

### The Creative Emergence

**61 AI-generated artworks** and **330 reference images** reveal a parallel creative track. The AI art — lions, robotic insects, neural network patterns, cyberpunk aesthetics — forms a consistent visual vocabulary: intelligence, observation, controlled power. These aren't random generations; they're identity expressions.

### The Social Footprint

**225 social/friends images** and **62 family images**. Jack appears in 107 photos out of 1248 (9%). He's more often the observer than the subject. Social content clusters around events, group gatherings, and platform screenshots — the relationships are documented through digital artifacts (shared posts, DMs, stories) more than posed photographs.

### The Convex Hull in Evidence

The archive contains evidence of multiple distinct life domains converging:
- **Technology/Work**: 173 images of product screenshots, code, dashboards, architecture
- **Creative**: 61 AI artworks + 330 reference materials
- **Social**: 225 social captures across platforms
- **Travel/Exploration**: 60 travel photos
- **Family**: 62 family/generational images
- **Food**: 39 food photos (the human constant)

This distribution mirrors the Charlotte thesis: the same person, touching multiple domains, with the camera roll serving as the raw signal stream that would eventually be formalized into the FINN architecture.

### The Temporal Torus

Temporal distribution of datable content:

- **1800s**: 1 images
- **1900s**: 3 images
- **1950s**: 1 images
- **1970s**: 1 images
- **1984**: 1 images
- **1990s**: 1 images
- **1996**: 1 images
- **2000s-2010s**: 1 images
- **2006**: 1 images
- **2010**: 1 images
- **2010s**: 9 images
- **2014**: 1 images
- **2014-2015**: 1 images
- **2014-2024**: 1 images
- **2017-2018**: 1 images
- **2018**: 7 images
- **2018-2019**: 3 images
- **2019**: 34 images
- **2020**: 4 images
- **2020-2023**: 1 images
- **2020s**: 631 images
- **2021**: 17 images
- **2022**: 13 images
- **2023**: 64 images
- **2023-2024**: 5 images
- **2024**: 284 images
- **2025**: 55 images
- **ancient**: 17 images
- **colonial**: 1 images
- **educational**: 1 images
- **historic**: 3 images
- **historical**: 4 images
- **historical_reference**: 1 images
- **medieval**: 2 images
- **modern**: 63 images
- **recent**: 3 images
- **renaissance**: 1 images

The archive spans roughly 2019-2025, with density increasing over time — more screenshots, more references, more creative output. The trajectory is clear: from documenting life to documenting *knowledge*.

### Most Frequent Visual Entities

| Entity | Occurrences |
|--------|------------|
| text | 26 |
| restaurant | 25 |
| business | 25 |
| dog | 23 |
| whiteboard | 22 |
| map | 21 |
| livestock | 21 |
| baby | 21 |
| pig | 21 |
| chatgpt | 21 |
| app ui | 20 |
| architecture | 19 |
| diagram | 19 |
| sounder | 17 |
| desk | 16 |
| menu | 16 |
| ai | 15 |
| couple | 14 |
| science | 13 |
| laptop | 13 |
| agriculture | 13 |
| business plan | 12 |
| basketball | 11 |
| art | 11 |
| quote | 10 |
| statue | 10 |
| tattoo | 10 |
| woman | 10 |
| house | 9 |
| lego | 9 |
