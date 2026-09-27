import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { POSTS } from "@/lib/blog/posts";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "School Guides — Boards, Admissions, Fees and Choosing a School",
  description: "Practical guides for Indian parents: CBSE vs ICSE vs IB, the admission calendar, how to read a fee structure and what to ask on a campus visit.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default async function BlogIndexPage() {
  const posts = [...POSTS].sort((a, b) => b.published.localeCompare(a.published));
  return (
    <ContentPage wide eyebrow="School guides" title="Guides for choosing and applying to schools" lead="Plain-language answers to the questions parents ask most — written to stay useful, and linked to live data on the site.">
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16 }}>
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="content-card" style={{ marginBottom: 0, display: "block", textDecoration: "none" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>{p.category} · {p.readingMinutes} min read</p>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--dark)", lineHeight: 1.3, marginBottom: 8 }}>{p.title}</h2>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{p.description}</p>
          </Link>
        ))}
      </div>
    </ContentPage>
  );
}
