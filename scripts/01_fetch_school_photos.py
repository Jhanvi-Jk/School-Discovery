#!/usr/bin/env python3
"""
SCRIPT 1 — Fetch School Photos
================================
Reads every school from your SchoolFind360 Supabase database (name, fees, area),
runs a Google Places API lookup for each one, pulls down up to 3 photo references,
and writes a clean JSON file: school_photos_raw.json

Run BEFORE 02_inject_photos.py.

Usage:
    pip install supabase requests python-dotenv
    GOOGLE_PLACES_API_KEY=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... python 01_fetch_school_photos.py

    OR with a .env file (recommended):
    python 01_fetch_school_photos.py
"""

import os
import json
import time
import logging
from typing import Optional
from pathlib import Path

import requests
from dotenv import load_dotenv
from supabase import create_client, Client

# ── Config ────────────────────────────────────────────────────
load_dotenv()

GOOGLE_API_KEY         = os.environ["GOOGLE_PLACES_API_KEY"]
SUPABASE_URL           = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY   = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

PHOTOS_PER_SCHOOL      = 3          # max photos to fetch per school
MAX_PHOTO_WIDTH        = 1200       # px — Google Places maxwidth param
RATE_LIMIT_DELAY       = 0.22       # seconds between API calls (~4.5 req/s, well within free tier)
OUTPUT_FILE            = Path(__file__).parent / "school_photos_raw.json"

# ── Logging ───────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)


# ── Google Places helpers ─────────────────────────────────────

def find_place_id(school_name: str, area: str, city: str) -> Optional[str]:
    """
    Step 1: Text search → place_id
    Uses 'Find Place from Text' — 1 API call per school.
    """
    query = f"{school_name} school {area} {city} India"
    resp = requests.get(
        "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
        params={
            "input":     query,
            "inputtype": "textquery",
            "fields":    "place_id,name",
            "key":       GOOGLE_API_KEY,
        },
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()

    if data.get("status") not in ("OK", "ZERO_RESULTS"):
        log.warning(f"Places API status {data.get('status')} for: {school_name}")

    candidates = data.get("candidates", [])
    if not candidates:
        return None

    return candidates[0]["place_id"]


def get_photo_references(place_id: str) -> list[str]:
    """
    Step 2: Place Details → list of photo_reference tokens.
    1 API call per school.
    """
    resp = requests.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        params={
            "place_id": place_id,
            "fields":   "photos",
            "key":      GOOGLE_API_KEY,
        },
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()

    photos = data.get("result", {}).get("photos", [])
    return [p["photo_reference"] for p in photos[:PHOTOS_PER_SCHOOL]]


def build_photo_url(photo_reference: str) -> str:
    """
    Builds a proxied Google Places photo URL.
    Note: these URLs contain your API key — serve them through your own
    proxy (see 02_inject_photos.py) if you want to keep the key private.
    """
    return (
        f"https://maps.googleapis.com/maps/api/place/photo"
        f"?maxwidth={MAX_PHOTO_WIDTH}"
        f"&photo_reference={photo_reference}"
        f"&key={GOOGLE_API_KEY}"
    )


def fetch_photos(name: str, area: str, city: str) -> dict:
    """
    Full pipeline for one school → returns a photo result dict.
    Returns {'photos': [...urls], 'photo_references': [...refs], 'place_id': '...'}
    Empty photos list means no results — frontend Sheen fallback handles this.
    """
    try:
        place_id = find_place_id(name, area, city)
        if not place_id:
            log.info(f"  ↳ No place found")
            return {"place_id": None, "photo_references": [], "photos": []}

        time.sleep(RATE_LIMIT_DELAY)   # respect rate limit between the 2 calls

        refs = get_photo_references(place_id)
        if not refs:
            log.info(f"  ↳ Place found ({place_id[:20]}…) but 0 photos")
            return {"place_id": place_id, "photo_references": [], "photos": []}

        urls = [build_photo_url(r) for r in refs]
        log.info(f"  ↳ ✓ {len(urls)} photo(s)  [place_id: {place_id[:20]}…]")
        return {"place_id": place_id, "photo_references": refs, "photos": urls}

    except requests.RequestException as exc:
        log.error(f"  ↳ API error: {exc}")
        return {"place_id": None, "photo_references": [], "photos": []}


# ── Main ──────────────────────────────────────────────────────

def main():
    log.info("SchoolFind360 — Photo Fetch Pipeline  (Script 1/2)")
    log.info("=" * 60)

    # 1. Connect to Supabase
    log.info("Connecting to Supabase…")
    sb: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    # 2. Read schools: name, area, city, fees
    log.info("Fetching school list…")
    resp = sb.table("schools").select(
        "id, slug, name, area, city, total_fees_min, total_fees_max"
    ).execute()
    schools = resp.data or []
    log.info(f"Found {len(schools)} schools\n")

    results = []
    success_count = 0

    for idx, school in enumerate(schools, start=1):
        name  = school.get("name", "")
        area  = school.get("area") or ""
        city  = school.get("city") or "Bengaluru"
        slug  = school.get("slug", "")
        fees  = school.get("total_fees_min")

        log.info(f"[{idx:>3}/{len(schools)}]  {name}  ({area}, {city})")

        photo_data = fetch_photos(name, area, city)

        results.append({
            # — Identifiers (matches your DB schema) —
            "id":                school["id"],
            "slug":              slug,
            # — Source metadata —
            "name":              name,
            "area":              area,
            "city":              city,
            "total_fees_min":    fees,
            # — Photo data —
            "place_id":          photo_data["place_id"],
            "photo_references":  photo_data["photo_references"],   # raw refs (API-key-free, safe to store)
            "photos":            photo_data["photos"],              # ready-to-use URLs (include key)
            "photo_count":       len(photo_data["photos"]),
        })

        if photo_data["photos"]:
            success_count += 1

        # Rate limit: ~4.5 schools/sec (2 API calls each, so ~9 calls/sec total — free tier OK)
        time.sleep(RATE_LIMIT_DELAY)

    # 3. Write output JSON
    OUTPUT_FILE.write_text(json.dumps(results, indent=2, ensure_ascii=False))

    log.info("\n" + "=" * 60)
    log.info(f"✓ Done.  {success_count}/{len(schools)} schools have photos.")
    log.info(f"✓ Output: {OUTPUT_FILE.resolve()}")
    log.info("Next step: run  python 02_inject_photos.py")


if __name__ == "__main__":
    main()
