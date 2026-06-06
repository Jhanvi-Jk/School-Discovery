"""
03_scrape_gmaps_photos.py
─────────────────────────────────────────────────────────────────────────────
Scrapes cover photos for schools from multiple free sources (in priority order):
  1. School's own website  → og:image / twitter:image meta tag
  2. EzySchooling          → ezyschooling.com school listings
  3. The Curious Parent    → thecuriousparent.com school listings

Then uploads to Supabase Storage and updates cover_image_url in the DB.

Usage:
    python3 scripts/03_scrape_gmaps_photos.py

Env vars (in .env.local):
    NEXT_PUBLIC_SUPABASE_URL
    SUPABASE_SERVICE_ROLE_KEY
    CITY_FILTER=Bengaluru     (optional, default = all cities)
    LIMIT=50                  (optional, default = 50)
    SKIP_EXISTING=true        (optional, default = true)
"""

from __future__ import annotations

import asyncio
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

SUPABASE_URL   = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY   = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
CITY_FILTER    = os.getenv("CITY_FILTER", "")
LIMIT          = int(os.getenv("LIMIT", "50"))
SKIP_EXISTING  = os.getenv("SKIP_EXISTING", "true").lower() == "true"
BUCKET         = "school-photos"
PHOTO_DIR      = Path("scripts/downloaded_photos")
PHOTO_DIR.mkdir(parents=True, exist_ok=True)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── Supabase helpers ────────────────────────────────────────────────────────

def fetch_schools() -> list[dict]:
    q = supabase.table("schools").select(
        "id, name, city, area, slug, website, cover_image_url"
    )
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


# ── Image download ──────────────────────────────────────────────────────────

def download_image(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        if len(data) < 5000:          # skip tiny placeholder images
            return False
        dest.write_bytes(data)
        return True
    except Exception as e:
        print(f"    ✗ Download error: {e}")
        return False


# ── Source 1: School's own website (og:image) ───────────────────────────────

async def try_school_website(page: Page, website: Optional[str]) -> Optional[str]:
    if not website:
        return None
    if not website.startswith("http"):
        website = "https://" + website
    try:
        await page.goto(website, wait_until="domcontentloaded", timeout=20_000)
        await page.wait_for_timeout(1500)
        for prop in ["og:image", "twitter:image", "og:image:url"]:
            el = page.locator(f'meta[property="{prop}"], meta[name="{prop}"]').first
            if await el.count() > 0:
                src = await el.get_attribute("content")
                if src and src.startswith("http") and not src.endswith(".svg"):
                    print(f"    → Found og:image on school website")
                    return src
    except Exception:
        pass
    return None


# ── Source 2: EzySchooling ──────────────────────────────────────────────────

async def try_ezyschooling(page: Page, name: str, city: str) -> Optional[str]:
    try:
        query = urllib.parse.quote(f"{name} {city}")
        await page.goto(
            f"https://www.ezyschooling.com/schools/search?q={query}",
            wait_until="domcontentloaded", timeout=20_000
        )
        await page.wait_for_timeout(2000)

        # Click first school result
        first = page.locator("a[href*='/school/']").first
        if await first.count() == 0:
            return None
        href = await first.get_attribute("href")
        if not href:
            return None
        if not href.startswith("http"):
            href = "https://www.ezyschooling.com" + href

        await page.goto(href, wait_until="domcontentloaded", timeout=20_000)
        await page.wait_for_timeout(2000)

        # Try cover/banner image
        for sel in [
            'img[class*="cover"]',
            'img[class*="banner"]',
            'img[class*="hero"]',
            '.school-cover img',
            'meta[property="og:image"]',
        ]:
            el = page.locator(sel).first
            if await el.count() > 0:
                src = await el.get_attribute("src") or await el.get_attribute("content")
                if src and src.startswith("http") and "placeholder" not in src:
                    print(f"    → Found image on EzySchooling")
                    return src
    except Exception as e:
        print(f"    EzySchooling error: {e}")
    return None


# ── Source 3: The Curious Parent ────────────────────────────────────────────

async def try_curious_parent(page: Page, name: str, city: str) -> Optional[str]:
    try:
        query = urllib.parse.quote(f"{name} {city}")
        await page.goto(
            f"https://www.thecuriousparent.com/schools?q={query}",
            wait_until="domcontentloaded", timeout=20_000
        )
        await page.wait_for_timeout(2000)

        # Click first result
        first = page.locator("a[href*='/schools/']").first
        if await first.count() == 0:
            return None
        href = await first.get_attribute("href")
        if not href:
            return None
        if not href.startswith("http"):
            href = "https://www.thecuriousparent.com" + href

        await page.goto(href, wait_until="domcontentloaded", timeout=20_000)
        await page.wait_for_timeout(2000)

        # Try og:image first (most reliable)
        el = page.locator('meta[property="og:image"]').first
        if await el.count() > 0:
            src = await el.get_attribute("content")
            if src and src.startswith("http"):
                print(f"    → Found image on The Curious Parent")
                return src

        # Try hero/cover image
        for sel in ['img[class*="cover"]', 'img[class*="hero"]', 'img[class*="school"]']:
            el = page.locator(sel).first
            if await el.count() > 0:
                src = await el.get_attribute("src")
                if src and src.startswith("http"):
                    print(f"    → Found image on The Curious Parent")
                    return src
    except Exception as e:
        print(f"    Curious Parent error: {e}")
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

    print(f"📋 Processing {len(schools)} school(s) — trying website → EzySchooling → The Curious Parent\n")

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
            name    = school["name"]
            city    = school.get("city", "India")
            sid     = school["id"]
            slug    = school.get("slug", sid)
            website = school.get("website")

            print(f"[{i}/{len(schools)}] {name} ({city})")

            # Try each source in order
            photo_url = None
            for source_fn, label in [
                (lambda: try_school_website(page, website), "own website"),
                (lambda: try_ezyschooling(page, name, city), "EzySchooling"),
                (lambda: try_curious_parent(page, name, city), "Curious Parent"),
            ]:
                photo_url = await source_fn()
                if photo_url:
                    break
                await asyncio.sleep(random.uniform(1, 2))

            if not photo_url:
                print(f"    ✗ No photo found in any source — skipping\n")
                fail += 1
                await asyncio.sleep(random.uniform(2, 4))
                continue

            # Download locally
            local_file = PHOTO_DIR / f"{slug}.jpg"
            if not download_image(photo_url, local_file):
                print(f"    ✗ Download failed\n")
                fail += 1
                continue

            # Upload to Supabase Storage
            public_url = upload_to_supabase(sid, local_file)
            if public_url:
                update_school_photo(sid, public_url)
                print(f"    ✓ Saved → {public_url[:80]}...\n")
                ok += 1
            else:
                print(f"    ✗ Upload failed\n")
                fail += 1

            await asyncio.sleep(random.uniform(2, 5))

        await browser.close()

    print(f"\n{'─'*50}")
    print(f"✓ Done: {ok} uploaded, {fail} failed out of {len(schools)} schools")
    print(f"Local copies in: {PHOTO_DIR.resolve()}")


if __name__ == "__main__":
    asyncio.run(main())
