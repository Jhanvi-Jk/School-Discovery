import Link from "next/link";
import { BOARD_SLUGS } from "@/lib/cities";
import { getSiteStats } from "@/lib/siteStats";

const YEAR = new Date().getFullYear();

// Server component: the city links come from the same cached stats as the rest of the
// site, so a city with no listings never appears here as if it were live.
export async function Footer() {
  const stats = await getSiteStats();
  // If the stats lookup failed we'd rather show every configured city than none
  const cities = stats.liveCities.length > 0 ? stats.liveCities : stats.cities;
  const primary = cities[0];

  return (
    <footer style={{ background: "var(--dark)", color: "rgba(255,255,255,0.65)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 20px 0" }}>

        {/* ── Top grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "36px 24px",
        }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: "white", letterSpacing: -0.5 }}>
                SchoolFind<span style={{ color: "var(--beige-500)" }}>360</span>
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.4)", maxWidth: 220 }}>
              Helping families across India find the right school — sourced data, honest completeness scores, intuitive search.
            </p>
          </div>

          {/* Discover */}
          <div>
            <p className="footer-heading">Discover</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/schools"  className="footer-link">Find Schools</Link>
              <Link href="/compare"  className="footer-link">Compare Schools</Link>
              <Link href="/quiz"     className="footer-link">Get Matched</Link>
              <Link href="/blog"     className="footer-link">School Guides</Link>
            </div>
          </div>

          {/* Admission tools */}
          <div>
            <p className="footer-heading">Admission Tools</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/admission-calendar"        className="footer-link">Admission Calendar</Link>
              <Link href="/tools/age-calculator"      className="footer-link">Age Cut-off Calculator</Link>
              <Link href="/tools/documents-checklist" className="footer-link">Document Checklist</Link>
            </div>
          </div>

          {/* For Schools */}
          <div>
            <p className="footer-heading">For Schools</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/schools/claim"  className="footer-link">Claim Your Profile</Link>
              <Link href="/manage/profile" className="footer-link">School Portal</Link>
            </div>
          </div>

          {/* Schools by City */}
          <div>
            <p className="footer-heading">Schools by City</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cities.map((c) => (
                <Link key={c.slug} href={`/schools/${c.slug}`} className="footer-link">Schools in {c.label}</Link>
              ))}
            </div>
          </div>

          {/* Schools by Board */}
          <div>
            <p className="footer-heading">Schools by Board{primary ? ` in ${primary.label}` : ""}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {primary && Object.entries(BOARD_SLUGS).map(([slug, b]) => (
                <Link key={slug} href={`/schools/${primary.slug}/${slug}`} className="footer-link">{b.label} Schools</Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── HTML directory — crawlable city × board links ── */}
        <div style={{
          marginTop: 40,
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", marginBottom: 14 }}>
            Browse Schools
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
            {cities.flatMap((c) =>
              c.boards.slice(0, 4).map((b) => (
                <Link key={`${c.slug}-${b}`} href={`/schools/${c.slug}/${b}`} className="footer-link-sm">
                  {BOARD_SLUGS[b].label} Schools in {c.label}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          marginTop: 40,
          paddingTop: 20,
          paddingBottom: 24,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            © {YEAR} SchoolFind360. All rights reserved.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
            <Link href="/about"         className="footer-link-sm">About</Link>
            <Link href="/how-we-verify" className="footer-link-sm">How we verify data</Link>
            <Link href="/report"        className="footer-link-sm">Report wrong data</Link>
            <Link href="/contact"       className="footer-link-sm">Contact</Link>
            <Link href="/privacy"       className="footer-link-sm">Privacy Policy</Link>
            <Link href="/terms"         className="footer-link-sm">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
