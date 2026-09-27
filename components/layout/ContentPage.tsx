import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface ContentPageProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  /** Widen the body for pages with cards/grids */
  wide?: boolean;
}

// Shared shell for static pages: header, dark title band, body, footer.
export async function ContentPage({ eyebrow, title, lead, children, wide }: ContentPageProps) {
  return (
    <>
      <Header />
      <main className="content-shell">
        <div className="content-hero">
          <div className="content-hero-inner" style={wide ? { maxWidth: 1040 } : undefined}>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1>{title}</h1>
            {lead && <p className="lead">{lead}</p>}
          </div>
        </div>
        <div className="content-body" style={wide ? { maxWidth: 1040 } : undefined}>{children}</div>
      </main>
      <Footer />
    </>
  );
}
