import Link from "next/link";
import type { Block } from "@/lib/blog/types";

// Renders [label](/path) inline links
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return <span key={i}>{part}</span>;
        return m[2].startsWith("http")
          ? <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer">{m[1]}</a>
          : <Link key={i} href={m[2]}>{m[1]}</Link>;
      })}
    </>
  );
}

export function BlogBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2": return <h2 key={i}>{b.text}</h2>;
          case "h3": return <h3 key={i}>{b.text}</h3>;
          case "p": return <p key={i}><Inline text={b.text} /></p>;
          case "note": return <div key={i} className="note"><Inline text={b.text} /></div>;
          case "ul": return <ul key={i}>{b.items.map((t, j) => <li key={j}><Inline text={t} /></li>)}</ul>;
          case "ol": return <ol key={i}>{b.items.map((t, j) => <li key={j}><Inline text={t} /></li>)}</ol>;
          case "table":
            return (
              <div key={i} style={{ overflowX: "auto" }}>
                <table>
                  <thead><tr>{b.head.map((h, j) => <th key={j}>{h}</th>)}</tr></thead>
                  <tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}><Inline text={c} /></td>)}</tr>)}</tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}
