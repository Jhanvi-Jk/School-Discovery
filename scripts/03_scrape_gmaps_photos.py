"""
03_scrape_gmaps_photos.py
─────────────────────────────────────────────────────────────────────────────
Scrapes cover photos for schools from Google Maps using Playwright (free,
no API key needed), then uploads them to Supabase Storage and updates the
cover_image_url column in the schools table.

Usage:
    pip install playwright supabase python-dotenv
    playwright install firefox
    python scripts/03_scrape_gmaps_photos.py

Env vars needed in .env.local:
    NEXT_PUBLIC_SUPABASE_URL
    SUPABASE_SERVICE_ROLE_KEY   ← needs service role (not anon) to write storage

Optional:
    CITY_FILTER=Bengaluru       ← only process schools in this city
    LIMIT=50                    ← max schools to process in one run
    SKIP_EXISTING=true          ← skip schools that already have cover_image_url
"""

import asyncio
import os
import random
import re
import time
import urllib.request
from pathlib import Path

from dotenv import load_dotenv
from playwright.async_api import async_playwright
from supabase import create_client

# ── Config ────────────────────────────────────────────────────────────────────
load_dotenv(".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
CITY_FILTER  = os.getenv("CITY_FILTER", "")          # e.g. "Bengaluru"
LIMIT        = int(os.getenv("LIMIT", "50"))
SKIP_EXISTING = os.getenv("SKIP_EXISTING", "true").lower() == "true"
BUCKET       = "school-photos"                        # Supabase storage bucket name
PHOTO_DIR    = Path("scripts/downloaded_photos")
PHOTO_DIR.mkdir(parents=True, exist_ok=True)

# ── Supabase client ───────────────────────────────────────────────────────────
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_schools() -> list[dict]:
    """Pull schools that need a cover photo from Supabase."""
    q = supabase.table("schools").select("id, name, city, area, slug, cover_image_url")

    if CITY_FILTER:
        q = q.eq("city", CITY_FILTER)
    if SKIP_EXISTING:
        q = q.is_("cover_image_url", "null")

    q = q.limit(LIMIT)
    result = q.execute()
    return result.data or []


def upload_to_supabase(school_id: str, local_path: Path) -> str | None:
    """Upload image file to Supabase Storage, return public URL."""
    ext = local_path.suffix.lower() or ".jpg"
    storage_path = f"{school_id}{ext}"

    with open(local_path, "rb") as f:
        data = f.read()

    mime = "image/jpeg" if ext in (".jpg", ".jpeg") else "image/png" if ext == ".png" else "image/webp"

    try:
        # Remove existing file if present (upsert workaround)
        supabase.storage.from_(BUCKET).remove([storage_path])
    except Exception:
        pass

    res = supabase.storage.from_(BUCKET).upload(
        path=storage_path,
        file=data,
        file_options={"content-type": mime},
    )

    if hasattr(res, "error") and res.error:
        print(f"    ✗ Upload error: {res.error}")
        return None

    public_url = supabase.storage.from_(BUCKET).get_public_url(storage_path)
    return public_url


def update_school_photo(school_id: str, url: str) -> None:
    """Write the public URL back to schools.cover_image_url."""
    supabase.table("schools").update({"cover_image_url": url}).eq("id", school_id).execute()


async def scrape_photo(page, school_name: str, city: str) -> str | None:
    """
    Search Google Maps for a school and return the cover photo URL.
    Returns None if no photo found.
    """
    query = f"{school_name} {city} school"
    search_url = f"https://www.google.com/maps/search/{urllib.parse.quote(query)}"

    try:
        await page.goto(search_url, wait_until="domcontentloaded", timeout=30_000)
        await page.wait_for_timeout(random.randint(2000, 4000))

        # If multiple results appear, click the first one
        first_result = page.locator('[data-result-index="1"] a, .hfpxzc').first
        if await first_result.count() > 0:
            await first_result.click()
            await page.wait_for_timeout(random.randint(2000, 3500))

        # Try several CSS selectors Google Maps uses for the hero/cover image
        selectors = [
            'button[jsaction*="pane.heroHeaderImage"] img',
            'img.gallery-cell-container',
            '.section-hero-header-image img',
            'img[src*="googleusercontent.com"][width]',
            'img[data-photo-index="0"]',
            '.x3AX1-LfntMc-header-title-ij8cu img',
        ]

        for sel in selectors:
            el = page.locator(sel).first
            if await el.count() > 0:
                src = await el.get_attribute("src")
                if src and "googleusercontent.com" in src:
                    # Request a larger version by bumping the size param
                    src = re.sub(r"=w\d+-h\d+", "=w1200-h800", src)
                    return src

        # Fallback: grab any large googleusercontent image on the page
        imgs = await page.locator('img[src*="googleusercontent.com"]').all()
        for img in imgs:
            src = await img.get_attribute("src")
            w   = await img.get_attribute("width")
            if src and w and int(w) >= 200:
                src = re.sub(r"=w\d+-h\d+", "=w1200-h800", src)
                return src

    except Exception as e:
        print(f"    ✗ Playwright error: {e}")

    return None


async def download_image(url: str, dest: Path) -> bool:
    """Download image from URL to local file."""
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            dest.write_bytes(resp.read())
        return True
    except Exception as e:
        print(f"    ✗ Download error: {e}")
        return False


async def main():
    import urllib.parse  # noqa: needed inside async context too

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
        return

    schools = fetch_schools()
    if not schools:
        print("✓ No schools to process (all already have photos, or none found).")
        return

    print(f"📋 Processing {len(schools)} school(s)...\n")

    async with async_playwright() as pw:
        browser = await pw.firefox.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
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

            photo_url = await scrape_photo(page, name, city)

            if not photo_url:
                print("    ✗ No photo found — skipping\n")
                fail += 1
                await asyncio.sleep(random.uniform(2, 4))
                continue

            # Download locally
            ext = ".jpg"
            local_file = PHOTO_DIR / f"{slug}{ext}"
            downloaded = await download_image(photo_url, local_file)

            if not downloaded:
                fail += 1
                await asyncio.sleep(random.uniform(2, 4))
                continue

            # Upload to Supabase Storage
            print(f"    ↑ Uploading to Supabase storage...")
            public_url = upload_to_supabase(sid, local_file)

            if public_url:
                update_school_photo(sid, public_url)
                print(f"    ✓ Done → {public_url[:80]}...\n")
                ok += 1
            else:
                print("    ✗ Upload failed\n")
                fail += 1

            # Random delay to avoid Google blocks
            delay = random.uniform(3, 7)
            print(f"    ⏱  Waiting {delay:.1f}s...")
            await asyncio.sleep(delay)

        await browser.close()

    print(f"\n{'─'*50}")
    print(f"✓ Done: {ok} uploaded, {fail} failed out of {len(schools)} schools")
    print(f"Photos saved locally in: {PHOTO_DIR.resolve()}")


if __name__ == "__main__":
    import urllib.parse
    asyncio.run(main())
