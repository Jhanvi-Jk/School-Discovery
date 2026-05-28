import Link from "next/link";

const YEAR = new Date().getFullYear();

export function Footer() {
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
              Helping families across India find the right school — verified data, intuitive search.
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

          {/* For Schools */}
          <div>
            <p className="footer-heading">For Schools</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/schools/claim"    className="footer-link">Claim Your Profile</Link>
              <Link href="/manage/profile"   className="footer-link">School Portal</Link>
            </div>
          </div>

          {/* Curricula */}
          <div>
            <p className="footer-heading">Curricula</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["CBSE", "ICSE", "IB", "IGCSE", "State Board"].map((c) => (
                <Link key={c}
                  href={`/schools?curriculum=${c.toLowerCase().replace(" ", "-")}`}
                  className="footer-link">
                  {c} Schools
                </Link>
              ))}
            </div>
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
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/privacy" className="footer-link-sm">Privacy Policy</Link>
            <Link href="/terms"   className="footer-link-sm">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
