# JOURNEY Asset Archive — Conventions

Intake protocol and naming standards for the JOURNEY archive. Follow these rules when adding new files or curating existing ones.

---

## Intake Protocol

### 1. Drop new files into `_incoming/`

All new photos, videos, and screenshots go into `JOURNEY/_incoming/` first. Never place files directly into categorized folders without running the sort script.

### 2. Run the sort script

```bash
python assets/sort_journey.py --dry-run     # Preview what will happen
python assets/sort_journey.py --execute      # Copy files into taxonomy
python assets/sort_journey.py --execute --rename  # Copy + standardize names
```

The script classifies by filename patterns and copies (never moves) files into the taxonomy. It generates `sort_report.json` with a full action log.

### 3. Manually curate `_unsorted/`

~80% of files have opaque names (IMG_xxxx) and cannot be auto-categorized. After the script runs, review `_unsorted/` subfolders and move files to their proper homes.

### 4. Update MANIFEST.md

After curation, update the curation progress table in `MANIFEST.md` with current counts.

---

## Naming Convention

### Standard format:
```
YYYY-MM-DD_SOURCE_SEQ.ext
```

| Component | Description | Example |
|-----------|-------------|---------|
| `YYYY-MM-DD` | Date (from EXIF, filename, or manual assignment) | `2024-03-15` |
| `SOURCE` | Origin platform or device | `fb`, `ig`, `snap`, `pxl`, `iphone`, `midjourney` |
| `SEQ` | Sequence number (for multiple files same day/source) | `001`, `002` |
| `.ext` | Lowercase extension | `.jpg`, `.heic`, `.mp4` |

### Examples:
```
2024-03-15_fb_001.jpg         # Facebook share from March 15, 2024
2023-07-28_pxl_001.jpg        # Pixel phone photo from July 28, 2023
2021-08-16_ig_001.jpg         # Instagram screenshot from Aug 16, 2021
2024-01-20_midjourney_001.png # Midjourney generation from Jan 20, 2024
```

### When date is unknown:
```
unknown_SOURCE_SEQ.ext        # e.g. unknown_iphone_001.heic
```

---

## Core Rules

### Append-only
Never delete files. Never rename files that have already been placed in a categorized folder. The archive only grows.

### Copy, never move (during sort)
The sort script copies files from the flat folder into the taxonomy. The original flat folder stays untouched until you verify everything landed correctly. Only after verification should you consider cleaning the source.

### Story over medium
Videos co-locate with photos. A video from a LineLeap launch event goes in `02_LINELEAP/milestones/`, not in a generic "videos" folder. Live Photo pairs (HEIC + MP4) always stay together.

### HEIC stays as HEIC
No lossy conversion. Modern tools handle HEIC natively. Converting to JPG violates the append-only principle and loses data.

### Extensions are lowercase
The sort script normalizes extensions to lowercase (`.JPG` -> `.jpg`, `.HEIC` -> `.heic`, `.MP4` -> `.mp4`). This is cosmetic, not destructive.

### No git for media
`assets/JOURNEY/` is in `.gitignore`. Only metadata files (`MANIFEST.md`, `CONVENTIONS.md`, `sort_journey.py`, `sort_report.json`) get committed. 3.7GB of media does not belong in version control.

---

## Folder Routing Quick Reference

| Content | Destination |
|---------|-------------|
| Family photos, childhood | `01_ORIGIN/family/` |
| School, education | `01_ORIGIN/education/` |
| LineLeap product/UI | `02_LINELEAP/product/` |
| LineLeap team photos | `02_LINELEAP/team/` |
| LineLeap launches/press | `02_LINELEAP/milestones/` |
| Livestock, pigs, herds | `03_SOUNDER/livestock/` |
| Farm visits, fieldwork | `03_SOUNDER/fieldwork/` |
| Industrial equipment | `04_ISG/operations/` |
| Richard Enterprises | `04_ISG/richard-enterprises/` |
| Violins, instruments | `05_PRIER/violins/` |
| Charlotte UI/dashboards | `06_CHARLOTTE/product/` |
| Architecture diagrams | `06_CHARLOTTE/architecture/` |
| Paper figures | `06_CHARLOTTE/papers/` |
| Northwestern/capstone | `07_ADVISORY/northwestern/` |
| SomeAI context | `07_ADVISORY/someai/` |
| Almquist family | `08_TORUS/almquist/` |
| Jim Richard | `08_TORUS/jim-richard/` |
| Joseph Richard | `08_TORUS/joseph-richard/` |
| Jack Richard personal | `08_TORUS/jack-richard/` |
| AI-generated art | `09_CREATIVE/ai-art/` |
| Logos, brand assets | `09_CREATIVE/branding/` |
| Infographics, data viz | `09_CREATIVE/reference/` |
| Instagram screenshots | `10_SOCIAL/instagram/` |
| Snapchat captures | `10_SOCIAL/snapchat/` |
| Facebook shares | `10_SOCIAL/facebook/` |
| Spotify screenshots | `10_SOCIAL/spotify/` |
| Other platform screenshots | `10_SOCIAL/misc/` |
| Travel photos | `11_LIFE/travel/` |
| Friends, social events | `11_LIFE/friends/` |
| Other personal | `11_LIFE/misc/` |
