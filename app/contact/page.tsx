import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { ContactForm } from "@/components/forms/ContactForm";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with the ${SITE_NAME} team — questions, data corrections, school partnerships and privacy requests.`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  return (
    <ContentPage eyebrow="Contact" title="Talk to us" lead="Questions, corrections, school partnerships or privacy requests — we read every message.">
      <div className="content-card">
        <ContactForm defaultTopic={topic} />
        {CONTACT_EMAIL && (
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 18 }}>
            Prefer email? Write to <a href={`mailto:${CONTACT_EMAIL}`} style={{ fontWeight: 600, color: "var(--brown-dark)" }}>{CONTACT_EMAIL}</a>.
          </p>
        )}
      </div>
    </ContentPage>
  );
}
