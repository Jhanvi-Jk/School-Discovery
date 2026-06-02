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

          {/* Schools by City */}
          <div>
            <p className="footer-heading">Schools by City</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/schools/bengaluru" className="footer-link">Schools in Bengaluru</Link>
              <Link href="/schools/delhi"     className="footer-link">Schools in Delhi</Link>
              <Link href="/schools/chennai"   className="footer-link">Schools in Chennai</Link>
              <Link href="/schools/mumbai"    className="footer-link">Schools in Mumbai</Link>
            </div>
          </div>

          {/* Schools by Board */}
          <div>
            <p className="footer-heading">Schools by Board</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/schools?curriculum=cbse"        className="footer-link">CBSE Schools</Link>
              <Link href="/schools?curriculum=icse"        className="footer-link">ICSE Schools</Link>
              <Link href="/schools?curriculum=ib"          className="footer-link">IB Schools</Link>
              <Link href="/schools?curriculum=igcse"       className="footer-link">IGCSE Schools</Link>
              <Link href="/schools?curriculum=state_board" className="footer-link">State Board Schools</Link>
            </div>
          </div>
        </div>

        {/* ── HTML directory — crawlable city×board links ── */}
        <div style={{
          marginTop: 40,
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", marginBottom: 14 }}>
            Browse Schools
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
            {[
              { href: "/schools/bengaluru/whitefield",         label: "Schools in Whitefield" },
            { href: "/schools/bengaluru/koramangala",        label: "Schools in Koramangala" },
            { href: "/schools/bengaluru/hsr-layout",         label: "Schools in HSR Layout" },
            { href: "/schools/delhi/south-delhi",            label: "Schools in South Delhi" },
            { href: "/schools/mumbai/andheri",               label: "Schools in Andheri" },
            { href: "/schools/bengaluru?curriculum=cbse",   label: "CBSE Schools in Bengaluru" },
              { href: "/schools/bengaluru?curriculum=icse",   label: "ICSE Schools in Bengaluru" },
              { href: "/schools/bengaluru?curriculum=ib",     label: "IB Schools in Bengaluru"   },
              { href: "/schools/bengaluru?curriculum=igcse",  label: "IGCSE Schools in Bengaluru"},
              { href: "/schools/delhi?curriculum=cbse",       label: "CBSE Schools in Delhi"     },
              { href: "/schools/delhi?curriculum=ib",         label: "IB Schools in Delhi"       },
              { href: "/schools/chennai?curriculum=cbse",     label: "CBSE Schools in Chennai"   },
              { href: "/schools/mumbai?curriculum=cbse",      label: "CBSE Schools in Mumbai"    },
              { href: "/schools/mumbai?curriculum=icse",      label: "ICSE Schools in Mumbai"    },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="footer-link-sm">{label}</Link>
            ))}
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
