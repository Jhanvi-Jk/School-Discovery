import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/layout/ContentPage";
import { BlogBody } from "@/components/blog/BlogBody";
import { POSTS, getPost } from "@/lib/blog/posts";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return { robots: { index: false, follow: false } };
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: { type: "article", title: post.title, description: post.description, url, publishedTime: post.published, siteName: SITE_NAME },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const url = `${SITE_URL}/blog/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.updated ?? post.published,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };
  const faqSchema = post.faqs?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  } : null;

  const others = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <ContentPage eyebrow={post.category} title={post.title} lead={post.description}>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
          <Link href="/blog" style={{ fontWeight: 600 }}>← All guides</Link> · {post.readingMinutes} min read · Published {new Date(post.published).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <div className="content-card">
          <BlogBody blocks={post.body} />
          {post.faqs && (
            <div className="prose">
              <h2>Frequently asked questions</h2>
              {post.faqs.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--dark)", margin: "24px 0 12px" }}>More guides</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {others.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} style={{ fontSize: 14, fontWeight: 600, color: "var(--brown-dark)" }}>{p.title} →</Link>
          ))}
        </div>
      </ContentPage>
    </>
  );
}
