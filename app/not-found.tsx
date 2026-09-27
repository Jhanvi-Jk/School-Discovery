import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

// Styled with the site's own design tokens (not utility classes) so it renders
// correctly even if the Tailwind build is missing.
export default async function NotFound() {
  return (
    <>
      <Header />
      <main style={{
        background: "var(--beige-300)", minHeight: "calc(100vh - 56px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px",
      }}>
        <div style={{ textAlign: "center", maxWidth: 460 }}>
          <p style={{ fontSize: 88, fontWeight: 800, color: "var(--beige-500)", lineHeight: 1, marginBottom: 10 }}>404</p>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--dark)", marginBottom: 8 }}>Page not found</h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, marginBottom: 26 }}>
            The page you&apos;re looking for doesn&apos;t exist or has moved. Try searching for a school instead.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            <Link href="/schools" className="btn-primary">Find schools</Link>
            <Link href="/blog" className="btn-secondary">Read our guides</Link>
            <Link href="/contact" className="btn-secondary">Contact us</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
