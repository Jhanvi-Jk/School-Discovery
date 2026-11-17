import { test, expect } from "@playwright/test";

// Audit 1.1: for every area listed on every city page, the area page must list exactly
// the number of schools the city page shows next to it.
const CITIES = (process.env.E2E_CITIES || "bengaluru,delhi,chennai").split(",");

for (const city of CITIES) {
  test(`area pages match city page counts: ${city}`, async ({ request }) => {
    const res = await request.get(`/schools/${city}`);
    expect(res.status()).toBe(200);
    const html = await res.text();
    const links = [...html.matchAll(/href="(\/schools\/[a-z-]+\/[a-z0-9-]+)" data-area-count="(\d+)"/g)]
      .map((m) => ({ href: m[1], count: Number(m[2]) }));
    expect(links.length, "city page lists areas").toBeGreaterThan(5);

    const failures: string[] = [];
    for (const l of links) {
      const page = await request.get(l.href);
      if (page.status() !== 200) { failures.push(`${l.href} → HTTP ${page.status()}`); continue; }
      const body = await page.text();
      const cards = (body.match(/class="school-card/g) || []).length;
      if (cards !== l.count) failures.push(`${l.href}: city page says ${l.count}, area page lists ${cards}`);
      if (/No schools listed/i.test(body)) failures.push(`${l.href}: shows "No schools listed"`);
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
}
