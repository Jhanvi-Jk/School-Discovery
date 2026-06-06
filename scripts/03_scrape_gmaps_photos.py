"""
03_scrape_gmaps_photos.py
─────────────────────────────────────────────────────────────────────────────
Scrapes cover photos for schools using Bing Image Search (free, no API key),
uploads to Supabase Storage, and updates cover_image_url in the schools table.

Usage:
    python3 scripts/03_scrape_gmaps_photos.py

Env vars (in .env.local):
    NEXT_PUBLIC_SUPABASE_URL
    SUPABASE_SERVICE_ROLE_KEY
    CITY_FILTER=Bengaluru     (optional)
    LIMIT=50                  (optional, default 50)
    SKIP_EXISTING=true        (optional, default true)
"""

from __future__ import annotations

import asyncio
import json
import os
import random
import re
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from playwright.async_api import async_playwright, Page
from supabase import create_client

# ── Config ─────────────────────────────────────────────────────────────────
load_dotenv(".env.local")

SUPABASE_URL  = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY  = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
CITY_FILTER   = os.getenv("CITY_FILTER", "")
LIMIT         = int(os.getenv("LIMIT", "50"))
SKIP_EXISTING = os.getenv("SKIP_EXISTING", "true").lower() == "true"
BUCKET        = "school-photos"
PHOTO_DIR     = Path("scripts/downloaded_photos")
PHOTO_DIR.mkdir(parents=True, exist_ok=True)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── Supabase helpers ────────────────────────────────────────────────────────

def fetch_schools() -> list[dict]:
    q = supabase.table("schools").select("id, name, city, area, slug, cover_image_url")
    if CITY_FILTER:
        q = q.eq("city", CITY_FILTER)
    if SKIP_EXISTING:
        q = q.is_("cover_image_url", "null")
    return (q.limit(LIMIT).execute().data) or []


def upload_to_supabase(school_id: str, local_path: Path) -> Optional[str]:
    ext          = local_path.suffix.lower() or ".jpg"
    storage_path = f"{school_id}{ext}"
    mime         = {"jpg": "image/jpeg", "jpeg": "image/jpeg",
                    "png": "image/png",  "webp": "image/webp"}.get(ext.lstrip("."), "image/jpeg")
    with open(local_path, "rb") as f:
        data = f.read()
    try:
        supabase.storage.from_(BUCKET).remove([storage_path])
    except Exception:
        pass
    res = supabase.storage.from_(BUCKET).upload(
        path=storage_path, file=data, file_options={"content-type": mime}
    )
    if hasattr(res, "error") and res.error:
        print(f"    ✗ Upload error: {res.error}")
        return None
    return supabase.storage.from_(BUCKET).get_public_url(storage_path)


def update_school_photo(school_id: str, url: str) -> None:
    supabase.table("schools").update({"cover_image_url": url}).eq("id", school_id).execute()


def download_image(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://www.bing.com/",
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        if len(data) < 8000:   # skip tiny placeholders / icons
            print(f"    ✗ Image too small ({len(data)} bytes), skipping")
            return False
        dest.write_bytes(data)
        return True
    except Exception as e:
        print(f"    ✗ Download error: {e}")
        return False


# ── Bing Image Search ───────────────────────────────────────────────────────

def score_url(url: str, school_name: str) -> int:
    """
    Score a candidate image URL for relevance. Higher = better.
    Penalise clearly wrong sources; reward Indian domains and name matches.
    """
    score = 0
    url_lower = url.lower()
    name_words = [w.lower() for w in school_name.split() if len(w) > 3]

    # Strong positive: Indian domain
    if ".in/" in url_lower or url_lower.endswith(".in"):
        score += 10
    # Positive: school/education-related domain keywords
    for kw in ["school", "edu", "academy", "vidya", "public", "international"]:
        if kw in url_lower:
            score += 3
    # Positive: school name words appear in URL
    for word in name_words:
        if word in url_lower:
            score += 5
    # Negative: clearly unrelated sources
    for bad in ["ytimg", "youtube", "wikipedia", "ameba.jp", "tohoku", "madrax",
                "visitcalifornia", "elsevierhealth", "hubspot", "shutterstock",
                "getty", "alamy", "istockphoto", "dreamstime", "chinese", "japan",
                "korea", "stat.ameba", "kikin."]:
        if bad in url_lower:
            score -= 20
    return score


async def bing_image_search(page: Page, school_name: str, city: str) -> Optional[str]:
    """
    Search Bing Images with quoted school name for exact match,
    score results by relevance, try full-res then thumbnail fallback.
    """
    # Strip apostrophes so they don't break Bing's quoted search parser
    clean_name = re.sub(r"[\"'`]", "", school_name)
    query = urllib.parse.quote(f'"{clean_name}" {city} school')
    url   = f"https://www.bing.com/images/search?q={query}&FORM=IRFLTR"

    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=25_000)
        await page.wait_for_timeout(random.randint(2000, 3000))

        cards = await page.locator("a.iusc").all()
        print(f"    Found {len(cards)} Bing image cards")

        # If quoted search returns 0-1 results, retry without quotes
        if len(cards) <= 1:
            query2 = urllib.parse.quote(f"{school_name} {city} school India")
            await page.goto(
                f"https://www.bing.com/images/search?q={query2}&FORM=IRFLTR",
                wait_until="domcontentloaded", timeout=25_000
            )
            await page.wait_for_timeout(random.randint(1500, 2500))
            cards = await page.locator("a.iusc").all()
            print(f"    Retried without quotes — {len(cards)} cards")

        # Build scored candidate list
        candidates = []
        for card in cards[:15]:
            data_m = await card.get_attribute("m")
            if not data_m:
                continue
            try:
                meta = json.loads(data_m)
                murl = meta.get("murl", "")
                turl = meta.get("turl", "")
                if murl and murl.startswith("http") and not murl.endswith((".svg", ".gif")):
                    candidates.append((score_url(murl, school_name), murl, turl))
            except Exception:
                continue

        # Sort best-scoring first
        candidates.sort(key=lambda x: x[0], reverse=True)

        test_path = PHOTO_DIR / "_test_img.jpg"
        for score, murl, turl in candidates:
            if score < 0:
                print(f"    ✗ Best candidate score {score} too low — skipping to avoid wrong image")
                break
            print(f"    → [{score:+d}] {murl[:80]}")
            if download_image(murl, test_path):
                return murl
            if turl and turl.startswith("http"):
                if download_image(turl, test_path):
                    return turl

    except Exception as e:
        print(f"    ✗ Bing search error: {e}")

    return None


# ── Main ────────────────────────────────────────────────────────────────────

async def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
        return

    schools = fetch_schools()
    if not schools:
        print("✓ No schools to process.")
        return

    print(f"📋 Processing {len(schools)} school(s) via Bing Image Search\n")

    async with async_playwright() as pw:
        browser = await pw.firefox.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
            viewport={"width": 1280, "height": 900},
            locale="en-IN",
        )
        page = await context.new_page()

        ok = 0
        fail = 0

        for i, school in enumerate(schools, 1):
            name = school["name"]
            city = school.get("city", "India")
            sid  = school["id"]
            slug = school.get("slug", sid)

            print(f"[{i}/{len(schools)}] {name} ({city})")

            photo_url = await bing_image_search(page, name, city)

            if not photo_url:
                print(f"    ✗ No image found\n")
                fail += 1
                await asyncio.sleep(random.uniform(2, 4))
                continue

            # The search fn already downloaded a test file — just rename it
            test_file  = PHOTO_DIR / "_test_img.jpg"
            local_file = PHOTO_DIR / f"{slug}.jpg"
            if test_file.exists():
                test_file.rename(local_file)
            elif not download_image(photo_url, local_file):
                fail += 1
                await asyncio.sleep(random.uniform(1, 3))
                continue

            public_url = upload_to_supabase(sid, local_file)
            if public_url:
                update_school_photo(sid, public_url)
                print(f"    ✓ Saved\n")
                ok += 1
            else:
                print(f"    ✗ Upload failed\n")
                fail += 1

            # Polite delay between searches
            await asyncio.sleep(random.uniform(3, 6))

        await browser.close()

    print(f"\n{'─'*50}")
    print(f"✓ Done: {ok} uploaded, {fail} failed out of {len(schools)} schools")
    print(f"Local copies: {PHOTO_DIR.resolve()}")


if __name__ == "__main__":
    asyncio.run(main())
