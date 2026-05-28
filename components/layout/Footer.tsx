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
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: "white", letterSpacing: -0.5 }}>
                SchoolFind<span style={{ color: "var(--beige-500)" }}>360</span>
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", maxWidth: 220 }}>
              Helping families across India find the right school — verified data, intuitive search.
            </p>
          </div>

          {/* Discover */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)",
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
              Discover
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Find Schools",    href: "/schools" },
                { label: "Compare Schools", href: "/compare" },
                { label: "Get Matched",     href: "/quiz" },
                { label: "School Guides",   href: "/blog" },
              ].map(({ label, href }) => (
                <Link key={href} href={href} style={{ fontSize: 13, color: "rgba(255,255,255,0.5)",
                  transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* For Schools */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)",
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
              For Schools
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Claim Your Profile", href: "/schools/claim" },
                { label: "School Portal",      href: "/manage/profile" },
              ].map(({ label, href }) => (
                <Link key={href} href={href} style={{ fontSize: 13, color: "rgba(255,255,255,0.5)",
                  transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Curricula */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)",
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
              Curricula
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["CBSE", "ICSE", "IB", "IGCSE", "State Board"].map((c) => (
                <Link key={c} href={`/schools?curriculum=${c.toLowerCase().replace(" ", "-")}`}
                  style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>
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
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Use",   href: "/terms" },
            ].map(({ label, href }) => (
              <Link key={href} href={href}
                style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
