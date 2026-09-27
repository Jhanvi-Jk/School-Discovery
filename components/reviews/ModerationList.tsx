"use client";

import { useState } from "react";
import { BadgeCheck, Check, X } from "lucide-react";

interface Item {
  id: string; school: string; slug: string; relation: string; created_at: string;
  rating_overall: number; title: string | null; body: string | null; email: string | null;
}

export function ModerationList({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function act(id: string, action: "approve" | "approve_verified" | "reject") {
    setBusy(id); setError("");
    const res = await fetch("/api/v1/admin/reviews", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }),
    });
    setBusy(null);
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
    else setError("That didn't work — check you're signed in as an admin and try again.");
  }

  if (items.length === 0) return <p style={{ color: "var(--muted)", fontSize: 14 }}>No reviews are waiting. 🎉</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {error && <p role="alert" style={{ color: "#dc2626", fontSize: 13 }}>{error}</p>}
      {items.map((r) => (
        <div key={r.id} className="content-card" style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
            <a href={`/schools/${r.slug}`} style={{ fontWeight: 700, color: "var(--dark)" }}>{r.school}</a>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{r.rating_overall}/5 · {r.relation.replace(/_/g, " ")} · {new Date(r.created_at).toLocaleDateString("en-IN")}</span>
          </div>
          {r.title && <p style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</p>}
          {r.body && <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--dark)", margin: "4px 0 8px", whiteSpace: "pre-wrap" }}>{r.body}</p>}
          <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>Reviewer account: {r.email ?? "unknown"} (never shown publicly)</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn-primary" disabled={busy === r.id} onClick={() => act(r.id, "approve")} style={{ padding: "7px 14px", fontSize: 13 }}><Check size={13} /> Approve</button>
            <button className="btn-secondary" disabled={busy === r.id} onClick={() => act(r.id, "approve_verified")} style={{ padding: "7px 14px", fontSize: 13 }}><BadgeCheck size={13} /> Approve as verified parent</button>
            <button className="btn-secondary" disabled={busy === r.id} onClick={() => act(r.id, "reject")} style={{ padding: "7px 14px", fontSize: 13, color: "#b91c1c" }}><X size={13} /> Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
