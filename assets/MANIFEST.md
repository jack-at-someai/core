# JOURNEY Asset Archive — Manifest

The JOURNEY archive is the visual evidence of the temporal torus: the convex hull journey from Lake Forest to Charlotte. Every photo, video, and screenshot documents a vertex of the story — the people, systems, and ideas that converged into Charlotte.

This manifest maps the archive's structure to the narrative it tells.

---

## Root Artifacts

These live at `assets/` root. They are top-level narrative anchors, not part of any folder.

| File | Description |
|------|-------------|
| `NORTHWESTERN_CAPSTONE.pptx` | The capstone presentation — where the convex hull was first articulated |
| `SERENGETI_DRAFT_7.pdf` | Serengeti Enterprises operational draft (v7) |
| `SERENGETI_DRAFT_8.pdf` | Serengeti Enterprises operational draft (v8) |
| `ATLAS_KNOWLEDGE_PRIMITIVES.png` | The Atlas diagram — Charlotte's knowledge primitive taxonomy |
| `GRANDAD_BOOK/` | Generational artifact — Almquist family history |

---

## Folder Taxonomy

### `01_ORIGIN/` — Family, Childhood, Generational Roots

The starting point. Family photos, education milestones, the Lake Forest years. Everything before the convex hull vertices were conscious.

- `family/` — Family photos, generational portraits
- `education/` — School, early milestones

### `02_LINELEAP/` — Convex Hull Vertex: Human Behavior

The first venture. LineLeap taught signal processing on human crowds — demand, attention, willingness to pay. The behavioral economics laboratory.

- `product/` — App screenshots, UI iterations, product milestones
- `team/` — Team photos, events
- `milestones/` — Launch events, press, achievements

### `03_SOUNDER/` — Convex Hull Vertex: Biological Systems

Sounder and Trogdon. Livestock intelligence — where biological signals (weight, genetics, health) became the language. The bridge from human behavior to natural systems.

- `livestock/` — Animals, herds, facilities
- `fieldwork/` — On-site work, farm visits

### `04_ISG/` — Convex Hull Vertex: Mechanical Systems

Industrial Services Group. Machine telemetry, operational monitoring, mechanical signal processing. The vertex where Charlotte learned to listen to things that don't breathe.

- `operations/` — Equipment, facilities, industrial operations
- `richard-enterprises/` — Richard Enterprises context and history

### `05_PRIER/` — Convex Hull Vertex: Cultural Artifacts

Prier Violins. Where instruments became nodes with centuries of provenance. Cultural signal processing — the vertex that proved Charlotte works on objects with souls.

- `violins/` — Instruments, workshops, provenance artifacts

### `06_CHARLOTTE/` — The Convergence

Charlotte herself. Product screenshots, architecture diagrams, paper drafts, the moment the convex hull closed.

- `product/` — UI, dashboards, demos
- `architecture/` — System diagrams, data model visualizations
- `papers/` — Research paper figures and supporting visuals

### `07_ADVISORY/` — Intellectual Lineage

The advisors and institutions that shaped the thinking. Northwestern, SomeAI, the intellectual scaffolding.

- `northwestern/` — Northwestern University, Farley Center, capstone
- `someai/` — SomeAI advisory context

### `08_TORUS/` — The Generational Thread

The temporal torus itself. The people whose timelines weave through the story — Almquist lineage, Jim Richard, Joseph Richard, Jack Richard. This is the human topology.

- `almquist/` — Almquist family, Donald Almquist legacy
- `jim-richard/` — Jim Richard
- `joseph-richard/` — Joseph Richard
- `jack-richard/` — Jack Richard personal

### `09_CREATIVE/` — AI Art, Branding, Reference

Generated imagery, brand assets, and reference materials. The visual language of the project.

- `ai-art/` — Midjourney, DALL-E, and other AI-generated art
- `branding/` — Logos, brand kits, identity assets
- `reference/` — Data visualizations, infographics, reference images

### `10_SOCIAL/` — Platform Captures

Screenshots from social platforms. The digital footprint — conversations, posts, shares that document the journey as it happened.

- `instagram/` — Instagram screenshots
- `snapchat/` — Snapchat captures
- `facebook/` — Facebook shares and screenshots
- `spotify/` — Spotify screenshots
- `misc/` — Chrome, Slack, Messages, Pinterest, and other platforms

### `11_LIFE/` — Personal Moments

Everything that isn't a vertex but matters. Travel, friends, the life that happened between the milestones.

- `travel/` — Travel photos
- `friends/` — Friends, social events
- `misc/` — Uncategorized personal moments

### `_incoming/` — Drop Zone

New files land here first. Run the sort script, then manually curate what it can't classify.

### `_unsorted/` — Awaiting Manual Curation

Files the sort script could classify by type but not by content. These need human eyes.

- `IMG_opaque/` — IMG_xxxx files with no content signal (date-prefixed when possible)
- `numbered_opaque/` — 1000000xxx numbered files
- `hash_named/` — Hash/UUID filenames (no content signal at all)
- `live_photos/` — Live Photo pairs (HEIC+MP4) kept together

---

## Curation Progress

| Folder | Auto-sorted | Manually curated | Total | Status |
|--------|------------|-----------------|-------|--------|
| `01_ORIGIN` | 0 | — | 0 | Awaiting curation |
| `02_LINELEAP` | 0 | — | 0 | Awaiting curation |
| `03_SOUNDER` | 0 | — | 0 | Awaiting curation |
| `04_ISG` | 0 | — | 0 | Awaiting curation |
| `05_PRIER` | 0 | — | 0 | Awaiting curation |
| `06_CHARLOTTE` | 0 | — | 0 | Awaiting curation |
| `07_ADVISORY` | 0 | — | 0 | Awaiting curation |
| `08_TORUS` | 3 | — | 3 | Auto-sorted |
| `09_CREATIVE` | 20 | — | 20 | Auto-sorted |
| `10_SOCIAL` | 122 | — | 122 | Auto-sorted |
| `11_LIFE` | 0 | — | 0 | Awaiting curation |
| `_unsorted/IMG_opaque` | 968 | — | 968 | Needs human eyes |
| `_unsorted/live_photos` | 524 | — | 524 | Needs human eyes |
| `_unsorted/numbered_opaque` | 90 | — | 90 | Needs human eyes |
| `_unsorted/hash_named` | 14 | — | 14 | Needs human eyes |
| **Total** | **1,741** | **0** | **1,741** | **First sort complete** |

*Last sorted: 2026-02-09. See `sort_report.json` for detailed action log.*
