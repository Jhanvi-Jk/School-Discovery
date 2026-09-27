import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReviewsClient } from "@/components/reviews/ReviewsClient";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";

async function getSchool(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("schools").select("*").eq("slug", slug).single();
  return data && (data as any).is_listed !== false ? (data as { name: string; area: string | null; city: string }) : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const school = await getSchool(slug);
  if (!school) return { title: { absolute: "School not found | SchoolFind360" }, robots: { index: false, follow: false } };
  const title = `${school.name} Reviews — Parent Ratings & Feedback`;
  return {
    title,
    description: `Read moderated parent reviews of ${school.name}${school.area ? `, ${school.area}` : ""} and share your own experience.`,
    alternates: { canonical: `${SITE_URL}/schools/${slug}/reviews` },
  };
}

export default async function ReviewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = await getSchool(slug);
  if (!school) notFound();
  return (
    <>
      <Header />
      <ReviewsClient slug={slug} schoolName={school.name} />
      <Footer />
    </>
  );
}
