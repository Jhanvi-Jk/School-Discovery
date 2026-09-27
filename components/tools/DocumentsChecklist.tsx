"use client";

import { useEffect, useState } from "react";
import { Printer } from "lucide-react";

const GROUPS: { title: string; items: { id: string; text: string; hint?: string }[] }[] = [
  {
    title: "For every application",
    items: [
      { id: "birth", text: "Child's birth certificate", hint: "Municipal/hospital-issued; used to check the age cut-off." },
      { id: "photo", text: "Recent passport-size photographs of the child (usually 2–4)" },
      { id: "parent-photo", text: "Passport-size photographs of both parents" },
      { id: "parent-id", text: "Parents' photo ID (Aadhaar / PAN / passport)" },
      { id: "child-id", text: "Child's Aadhaar card (if the school asks for it)" },
      { id: "address", text: "Address proof", hint: "Aadhaar, rent agreement, utility bill or passport. Some schools use it for distance-based admission." },
      { id: "immun", text: "Immunisation / health record" },
    ],
  },
  {
    title: "If the child has studied before (Class 1 onwards)",
    items: [
      { id: "tc", text: "Transfer Certificate (TC) from the previous school", hint: "Often submitted after the seat is confirmed." },
      { id: "report", text: "Last two years' report cards / progress reports" },
      { id: "conduct", text: "Conduct certificate (some schools)" },
    ],
  },
  {
    title: "Only if applicable",
    items: [
      { id: "category", text: "Caste / category / EWS certificate", hint: "Needed for reserved or RTE (25%) seats." },
      { id: "income", text: "Income certificate (RTE / EWS)" },
      { id: "sibling", text: "Sibling's admission proof / ID card", hint: "For sibling-priority admissions." },
      { id: "transfer", text: "Parent's job-transfer letter (mid-year admissions)" },
      { id: "nri", text: "Passport, visa and previous-country school records (NRI / international transfers)" },
      { id: "special", text: "Disability / special-needs assessment reports" },
    ],
  },
];

const KEY = "sf_docs_checklist";

export function DocumentsChecklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try { setDone(JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { /* ignore corrupt storage */ }
  }, []);

  const toggle = (id: string) =>
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode */ }
      return next;
    });

  const total = GROUPS.reduce((n, g) => n + g.items.length, 0);
  const count = Object.values(done).filter(Boolean).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <p style={{ fontSize: 14, color: "var(--muted)" }}><strong style={{ color: "var(--dark)" }}>{count}</strong> of {total} ready</p>
        <button className="btn-secondary" onClick={() => window.print()} style={{ padding: "7px 14px", fontSize: 13 }}><Printer size={14} /> Print</button>
      </div>
      {GROUPS.map((g) => (
        <section key={g.title} style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--dark)", marginBottom: 8 }}>{g.title}</h2>
          <ul style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {g.items.map((it) => (
              <li key={it.id}>
                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", padding: "8px 10px", borderRadius: 10, background: done[it.id] ? "rgba(22,163,74,0.08)" : "transparent" }}>
                  <input type="checkbox" checked={!!done[it.id]} onChange={() => toggle(it.id)} style={{ marginTop: 3 }} />
                  <span>
                    <span style={{ fontSize: 14, color: "var(--dark)", textDecoration: done[it.id] ? "line-through" : "none" }}>{it.text}</span>
                    {it.hint && <span style={{ display: "block", fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{it.hint}</span>}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
        Requirements differ by school, board and state. Treat this as a starting list and confirm the exact documents with each school.
      </p>
    </div>
  );
}
