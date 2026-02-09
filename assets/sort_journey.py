#!/usr/bin/env python3
"""
JOURNEY Asset Archive — Sort Script

Classifies files in assets/JOURNEY/ by filename regex patterns and copies them
into the folder taxonomy. Philosophy: copy, never move. Append-only.

Usage:
    python assets/sort_journey.py --dry-run          # Preview only
    python assets/sort_journey.py --execute           # Copy files into taxonomy
    python assets/sort_journey.py --execute --rename   # Copy + standardize names
    python assets/sort_journey.py --execute --exif     # Use EXIF dates (requires pillow)
"""

import argparse
import json
import os
import re
import shutil
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

JOURNEY_DIR = Path(__file__).resolve().parent / "JOURNEY"
REPORT_PATH = Path(__file__).resolve().parent / "sort_report.json"

# Media extensions we care about (lowercase)
MEDIA_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".heif",
    ".mp4", ".mov", ".avi", ".mkv", ".m4v",
}

# ---------------------------------------------------------------------------
# Classification rules — order matters (first match wins)
# ---------------------------------------------------------------------------

# Each rule: (compiled_regex, destination_folder, source_tag)
# source_tag is used in renamed files: YYYY-MM-DD_SOURCE_SEQ.ext

RULES = []


def rule(pattern, dest, source_tag, flags=re.IGNORECASE):
    """Register a classification rule."""
    RULES.append((re.compile(pattern, flags), dest, source_tag))


# --- 09_CREATIVE/ai-art ---
rule(r"^jackrichard_", "09_CREATIVE/ai-art", "midjourney")
rule(r"^Jack_Richard_", "09_CREATIVE/ai-art", "midjourney")
rule(r"^miami_vice_", "09_CREATIVE/ai-art", "midjourney")
rule(r"^An_interconnected_", "09_CREATIVE/ai-art", "midjourney")

# --- 09_CREATIVE/branding ---
rule(r"^branding_.*rAIcluse", "09_CREATIVE/branding", "midjourney")

# --- 09_CREATIVE/reference ---
rule(r"^income-distributions", "09_CREATIVE/reference", "reference")
rule(r"^world-population", "09_CREATIVE/reference", "reference")

# --- 08_TORUS/jack-richard ---
rule(r"^me\.jpg$", "08_TORUS/jack-richard", "personal")
rule(r"^Jack2\.JPG$", "08_TORUS/jack-richard", "personal")
rule(r"^Facetune_", "08_TORUS/jack-richard", "facetune")

# --- 10_SOCIAL/instagram ---
rule(r"^Screenshot_\d{8}-\d{6}_Instagram", "10_SOCIAL/instagram", "ig")

# --- 10_SOCIAL/spotify ---
rule(r"^Screenshot_\d{8}-\d{6}_Spotify", "10_SOCIAL/spotify", "spotify")

# --- 10_SOCIAL/snapchat (screenshots of Snapchat) ---
rule(r"^Screenshot_\d{8}-\d{6}_Snapchat", "10_SOCIAL/snapchat", "snap")

# --- 10_SOCIAL/misc (other app screenshots) ---
rule(r"^Screenshot_\d{8}-\d{6}_(Chrome|Slack|Messages|Pinterest|Photos)",
     "10_SOCIAL/misc", "screenshot")
# Generic screenshots with no app suffix
rule(r"^Screenshot_\d{8}-\d{6}~?\d*\.", "10_SOCIAL/misc", "screenshot")
# macOS-style "Screenshot YYYY-MM-DD" format
rule(r"^Screenshot \d{4}-\d{2}-\d{2}", "10_SOCIAL/misc", "screenshot")

# --- 10_SOCIAL/facebook ---
rule(r"^FB_IMG_\d+", "10_SOCIAL/facebook", "fb")

# --- 10_SOCIAL/snapchat ---
rule(r"^Snapchat-", "10_SOCIAL/snapchat", "snap")

# --- _unsorted/numbered_opaque (1000000xxx) ---
rule(r"^1000000\d+", "_unsorted/numbered_opaque", "numbered")

# --- Files with embedded dates but opaque content ---
# PXL_ (Pixel phone): PXL_YYYYMMDD_HHMMSSmmm
rule(r"^PXL_(\d{4})(\d{2})(\d{2})_", "_unsorted/IMG_opaque", "pxl")

# IMG-YYYYMMDD-WA (WhatsApp): has date
rule(r"^IMG-(\d{4})(\d{2})(\d{2})-WA", "_unsorted/IMG_opaque", "whatsapp")

# IMG_YYYYMMDD_HHMMSS (Android-style with embedded date)
rule(r"^IMG_(\d{4})(\d{2})(\d{2})_\d{6}", "_unsorted/IMG_opaque", "android")

# Dated prefix: YYYYMMDD_HHMMSS or YYYYMMDD_HHMMSS_*
rule(r"^(\d{4})(\d{2})(\d{2})_\d{6}", "_unsorted/IMG_opaque", "dated")

# Apple Live Photo UUIDs: 64194xxxxxx__UUID
rule(r"^64194\d+__[A-F0-9\-]+\.", "_unsorted/IMG_opaque", "apple-live")

# DSC (Sony/generic camera)
rule(r"^DSC\d+\.", "_unsorted/IMG_opaque", "camera")

# Image with date in name: "Image M-D-YY at H.MM AM/PM"
rule(r"^Image \d+-\d+-\d+ at ", "_unsorted/IMG_opaque", "apple-screenshot")

# IMG_xxxx with parentheses, spaces, suffixes: IMG_4527(1).PNG, IMG_4923 2.JPG, IMG_6130-COLLAGE.jpg
rule(r"^IMG_\d{4}[^/]", "_unsorted/IMG_opaque", "img")
# IMG_xxxx opaque (4-digit, the big bucket)
rule(r"^IMG_\d{4}\.", "_unsorted/IMG_opaque", "img")
# IMG with more digits
rule(r"^IMG_?\d+\.", "_unsorted/IMG_opaque", "img")

# --- _unsorted/hash_named (UUIDs, hashes, misc) ---
rule(r"^[0-9a-f]{32}\.", "_unsorted/hash_named", "hash")
rule(r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-", "_unsorted/hash_named", "uuid")
# Facebook large photo IDs
rule(r"^\d{10,}_\d+_\d+", "_unsorted/hash_named", "fb-photo-id")
# Numeric-only names (not 1000000xxx which is caught above)
rule(r"^\d{10,}\.", "_unsorted/hash_named", "numeric")

# --- Catch-all for anything with an opaque or unrecognized name ---
rule(r"^(home_|image|0_)", "_unsorted/hash_named", "misc")


# ---------------------------------------------------------------------------
# Date extraction helpers
# ---------------------------------------------------------------------------

def extract_date_from_filename(filename):
    """Try to extract a date from the filename. Returns 'YYYY-MM-DD' or None."""
    # PXL_YYYYMMDD_HHMMSSmmm
    m = re.match(r"PXL_(\d{4})(\d{2})(\d{2})_", filename)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"

    # Screenshot_YYYYMMDD-HHMMSS
    m = re.match(r"Screenshot_(\d{4})(\d{2})(\d{2})-(\d{6})", filename)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"

    # IMG_YYYYMMDD_HHMMSS (Android-style)
    m = re.match(r"IMG_(\d{4})(\d{2})(\d{2})_(\d{6})", filename)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"

    # YYYYMMDD_HHMMSS prefix
    m = re.match(r"(\d{4})(\d{2})(\d{2})_(\d{6})", filename)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"

    # IMG-YYYYMMDD-WA
    m = re.match(r"IMG-(\d{4})(\d{2})(\d{2})-", filename)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"

    # FB_IMG_timestamp (Unix ms)
    m = re.match(r"FB_IMG_(\d{13})", filename)
    if m:
        try:
            ts = int(m.group(1)) / 1000
            dt = datetime.fromtimestamp(ts, tz=timezone.utc)
            return dt.strftime("%Y-%m-%d")
        except (ValueError, OSError):
            return None

    # Facetune_DD-MM-YYYY-HH-MM-SS
    m = re.match(r"Facetune_(\d{2})-(\d{2})-(\d{4})-", filename)
    if m:
        return f"{m.group(3)}-{m.group(2)}-{m.group(1)}"

    # Image M-D-YY at ...
    m = re.match(r"Image (\d+)-(\d+)-(\d+) at ", filename)
    if m:
        month, day, year = m.group(1), m.group(2), m.group(3)
        if len(year) == 2:
            year = f"20{year}"
        return f"{year}-{int(month):02d}-{int(day):02d}"

    return None


def extract_date_exif(filepath):
    """Try to extract date from EXIF data. Requires pillow. Returns 'YYYY-MM-DD' or None."""
    try:
        from PIL import Image
        from PIL.ExifTags import Base as ExifBase
    except ImportError:
        return None

    try:
        img = Image.open(filepath)
        exif = img.getexif()
        if not exif:
            return None
        # Try DateTimeOriginal, then DateTime
        for tag_id in (ExifBase.DateTimeOriginal, ExifBase.DateTime):
            val = exif.get(tag_id)
            if val:
                # Format: "YYYY:MM:DD HH:MM:SS"
                m = re.match(r"(\d{4}):(\d{2}):(\d{2})", val)
                if m:
                    return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    except Exception:
        pass
    return None


# ---------------------------------------------------------------------------
# Live Photo detection
# ---------------------------------------------------------------------------

def find_live_photo_pairs(files):
    """Find HEIC+MP4 pairs with the same base name (Live Photos).
    Returns a dict: {base_name: [file1, file2, ...]}"""
    by_stem = defaultdict(list)
    for f in files:
        stem = Path(f).stem
        by_stem[stem].append(f)

    pairs = {}
    for stem, group in by_stem.items():
        if len(group) > 1:
            exts = {Path(f).suffix.lower() for f in group}
            if exts & {".heic", ".heif"} and exts & {".mp4", ".mov"}:
                pairs[stem] = group
    return pairs


# ---------------------------------------------------------------------------
# Classifier
# ---------------------------------------------------------------------------

def classify_file(filename):
    """Classify a single file. Returns (dest_folder, source_tag) or (None, None)."""
    for regex, dest, tag in RULES:
        if regex.search(filename):
            return dest, tag
    return None, None


# ---------------------------------------------------------------------------
# Name standardization
# ---------------------------------------------------------------------------

def make_standard_name(filename, dest, source_tag, date_str, seq_counters):
    """Generate standardized name: YYYY-MM-DD_SOURCE_SEQ.ext"""
    ext = Path(filename).suffix.lower()

    if not date_str:
        date_str = "unknown"

    key = f"{date_str}_{source_tag}"
    seq_counters[key] = seq_counters.get(key, 0) + 1
    seq = seq_counters[key]

    return f"{date_str}_{source_tag}_{seq:03d}{ext}"


# ---------------------------------------------------------------------------
# Main sort logic
# ---------------------------------------------------------------------------

def sort_journey(dry_run=True, rename=False, use_exif=False):
    """Run the sort. Returns the report dict."""
    if not JOURNEY_DIR.exists():
        print(f"ERROR: {JOURNEY_DIR} does not exist.")
        sys.exit(1)

    # Collect all files in the flat root of JOURNEY (not in subdirectories)
    all_files = []
    for entry in JOURNEY_DIR.iterdir():
        if entry.is_file() and entry.suffix.lower() in MEDIA_EXTENSIONS:
            all_files.append(entry.name)

    all_files.sort()
    print(f"Found {len(all_files)} media files in {JOURNEY_DIR}")

    # Detect Live Photo pairs
    live_pairs = find_live_photo_pairs(all_files)
    live_pair_files = set()
    for group in live_pairs.values():
        for f in group:
            live_pair_files.add(f)
    print(f"Detected {len(live_pairs)} Live Photo pairs ({len(live_pair_files)} files)")

    # Classify
    actions = []
    unclassified = []
    dest_counts = defaultdict(int)
    seq_counters = {}

    for filename in all_files:
        dest, source_tag = classify_file(filename)

        if dest is None:
            unclassified.append(filename)
            continue

        # If this is part of a Live Photo pair, route to live_photos
        if filename in live_pair_files:
            dest = "_unsorted/live_photos"

        # Extract date
        date_str = extract_date_from_filename(filename)
        if not date_str and use_exif:
            filepath = JOURNEY_DIR / filename
            date_str = extract_date_exif(filepath)

        # Determine target name
        if rename:
            target_name = make_standard_name(filename, dest, source_tag, date_str, seq_counters)
        else:
            target_name = filename

        # Normalize extension case even without rename
        if not rename:
            stem = Path(target_name).stem
            ext = Path(target_name).suffix.lower()
            target_name = stem + ext

        target_path = dest + "/" + target_name

        actions.append({
            "source": filename,
            "dest": target_path,
            "dest_folder": dest,
            "source_tag": source_tag,
            "date": date_str,
            "is_live_photo": filename in live_pair_files,
        })
        dest_counts[dest] += 1

    # Report unclassified
    if unclassified:
        for f in unclassified:
            actions.append({
                "source": f,
                "dest": "_unsorted/hash_named/" + f,
                "dest_folder": "_unsorted/hash_named",
                "source_tag": "unclassified",
                "date": None,
                "is_live_photo": False,
            })
            dest_counts["_unsorted/hash_named"] += 1

    # Print summary
    print(f"\n{'=' * 60}")
    print(f"{'DRY RUN' if dry_run else 'EXECUTING'} — {len(actions)} files to process")
    print(f"{'=' * 60}\n")

    print("Destination breakdown:")
    for dest in sorted(dest_counts.keys()):
        print(f"  {dest:<40} {dest_counts[dest]:>5}")
    print(f"  {'TOTAL':<40} {sum(dest_counts.values()):>5}")

    if unclassified:
        print(f"\n  Unclassified (-> _unsorted/hash_named): {len(unclassified)}")

    # Execute copies
    copied = 0
    skipped = 0
    errors = []

    if not dry_run:
        print(f"\nCopying files...")
        for i, action in enumerate(actions):
            src = JOURNEY_DIR / action["source"]
            dst = JOURNEY_DIR / action["dest"]

            # Create destination directory
            dst.parent.mkdir(parents=True, exist_ok=True)

            if dst.exists():
                skipped += 1
                action["status"] = "skipped_exists"
                continue

            try:
                shutil.copy2(str(src), str(dst))
                copied += 1
                action["status"] = "copied"
            except Exception as e:
                errors.append({"file": action["source"], "error": str(e)})
                action["status"] = "error"

            if (i + 1) % 200 == 0:
                print(f"  ...{i + 1}/{len(actions)} processed")

        print(f"\nDone: {copied} copied, {skipped} skipped (already exist), {len(errors)} errors")

    # Build report
    report = {
        "timestamp": datetime.now().isoformat(),
        "mode": "dry_run" if dry_run else "execute",
        "rename": rename,
        "exif": use_exif,
        "total_source_files": len(all_files),
        "total_actions": len(actions),
        "unclassified": len(unclassified),
        "live_photo_pairs": len(live_pairs),
        "dest_counts": dict(dest_counts),
        "actions": actions,
    }
    if not dry_run:
        report["copied"] = copied
        report["skipped"] = skipped
        report["errors"] = errors

    # Write report
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    print(f"\nReport written to {REPORT_PATH}")

    return report


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="JOURNEY Asset Archive — Sort Script")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--dry-run", action="store_true", help="Preview only, no files copied")
    mode.add_argument("--execute", action="store_true", help="Copy files into taxonomy")
    parser.add_argument("--rename", action="store_true", help="Standardize filenames (YYYY-MM-DD_SOURCE_SEQ.ext)")
    parser.add_argument("--exif", action="store_true", help="Extract dates from EXIF data (requires pillow)")
    args = parser.parse_args()

    sort_journey(dry_run=args.dry_run, rename=args.rename, use_exif=args.exif)


if __name__ == "__main__":
    main()
