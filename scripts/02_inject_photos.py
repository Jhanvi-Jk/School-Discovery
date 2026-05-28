#!/usr/bin/env python3
"""
SCRIPT 2 — Inject Photos into Supabase
=========================================
Reads school_photos_raw.json (produced by Script 1) and injects the photo data
into your Supabase database.

Strategy:
  • If school has photos  → upsert rows into school_photos table (run migration 024 first)
                           AND set cover_image_url on the school if it's currently NULL
  • If school has no photos → skip silently; frontend Sheen fallback handles it safely

Run AFTER 01_fetch_school_photos.py and AFTER applying supabase/migrations/024_school_photos.sql

Usage:
    pip install supabase requests python-dotenv
    SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... python 02_inject_photos.py

Output:
    inject_report.json  — summary of what was written / skipped
"""

import os
import json
import logging
from pathlib import Path
from datetime import datetime, timezone

from dotenv import load_dotenv
from supabase import create_client, Client

# ── Config ────────────────────────────────────────────────────
load_dotenv()

SUPABASE_URL         = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

INPUT_FILE    = Path(__file__).parent / "school_photos_raw.json"
REPORT_FILE   = Path(__file__).parent / "inject_report.json"
BATCH_SIZE    = 50   # rows per upsert batch

# ── Logging ───────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)


# ── Schema: school_photos table row ──────────────────────────
#
# Matches migration: supabase/migrations/024_school_photos.sql
#
#   school_id    uuid   references schools(id)
#   sort_order   int    0-indexed (0 = primary/cover)
#   url          text   full photo URL
#   photo_ref    text   raw Places photo_reference token (no API key)
#   place_id     text   Google Places place_id
#   source       text   'google_places'
#   width        int    null (unknown until fetched)
#   height       int    null
#   is_cover     bool   sort_order == 0
#   created_at   timestamptz
#

def build_photo_rows(school: dict) -> list[dict]:
    """Convert one school's photo data into DB row dicts."""
    rows = []
    for order, (url, ref) in enumerate(
        zip(school["photos"], school["photo_references"])
    ):
        rows.append({
            "school_id":   school["id"],
            "sort_order":  order,
            "url":         url,
            "photo_ref":   ref,
            "place_id":    school.get("place_id"),
            "source":      "google_places",
            "is_cover":    order == 0,
            "created_at":  datetime.now(timezone.utc).isoformat(),
        })
    return rows


def chunked(lst: list, n: int):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i : i + n]


# ── Main ──────────────────────────────────────────────────────

def main():
    log.info("SchoolFind360 — Photo Inject Pipeline  (Script 2/2)")
    log.info("=" * 60)

    # 1. Load raw data from Script 1
    if not INPUT_FILE.exists():
        log.error(f"Input file not found: {INPUT_FILE}")
        log.error("Run Script 1 first:  python 01_fetch_school_photos.py")
        raise SystemExit(1)

    schools = json.loads(INPUT_FILE.read_text())
    log.info(f"Loaded {len(schools)} schools from {INPUT_FILE.name}")

    has_photos   = [s for s in schools if s.get("photos")]
    no_photos    = [s for s in schools if not s.get("photos")]
    log.info(f"  → {len(has_photos)} schools with photos  |  {len(no_photos)} schools skipped (no photos)")
    log.info("")

    if not has_photos:
        log.warning("No schools have photos — nothing to inject.")
        return

    # 2. Connect to Supabase
    log.info("Connecting to Supabase…")
    sb: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    # 3. Build all photo rows
    all_photo_rows: list[dict] = []
    cover_updates: list[dict] = []   # schools where cover_image_url should be set

    for school in has_photos:
        rows = build_photo_rows(school)
        all_photo_rows.extend(rows)

        # Queue a cover image update only if school doesn't already have one
        cover_updates.append({
            "id":              school["id"],
            "cover_photo_url": school["photos"][0],   # first photo = cover
        })

    log.info(f"Prepared {len(all_photo_rows)} photo rows  ({len(has_photos)} schools)")

    # 4. Upsert photo rows in batches (avoids payload size limits)
    injected_count = 0
    for batch in chunked(all_photo_rows, BATCH_SIZE):
        try:
            sb.table("school_photos").upsert(
                batch,
                on_conflict="school_id,sort_order",  # idempotent re-runs
            ).execute()
            injected_count += len(batch)
            log.info(f"  ↳ Upserted batch of {len(batch)} rows  (total: {injected_count})")
        except Exception as exc:
            log.error(f"  ↳ Batch upsert failed: {exc}")

    # 5. Update cover_image_url on schools that currently have NULL
    updated_covers = 0
    for item in cover_updates:
        try:
            # Only set if null — never overwrite a manually-curated image
            sb.table("schools").update(
                {"cover_image_url": item["cover_photo_url"]}
            ).eq("id", item["id"]).is_("cover_image_url", "null").execute()
            updated_covers += 1
        except Exception as exc:
            log.warning(f"  Cover update failed for {item['id']}: {exc}")

    # 6. Write inject report
    report = {
        "run_at":            datetime.now(timezone.utc).isoformat(),
        "total_schools":     len(schools),
        "schools_with_photos": len(has_photos),
        "schools_skipped":   len(no_photos),
        "photo_rows_injected": injected_count,
        "cover_images_updated": updated_covers,
        "schools": [
            {
                "slug":         s["slug"],
                "name":         s["name"],
                "photo_count":  s["photo_count"],
                "status":       "injected" if s in has_photos else "skipped_no_photos",
            }
            for s in schools
        ],
    }
    REPORT_FILE.write_text(json.dumps(report, indent=2, ensure_ascii=False))

    log.info("")
    log.info("=" * 60)
    log.info(f"✓ Injected {injected_count} photo rows into school_photos table")
    log.info(f"✓ Updated {updated_covers} school cover images")
    log.info(f"✓ Report:  {REPORT_FILE.resolve()}")


if __name__ == "__main__":
    main()
