"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useFormSubmit } from "@/components/forms/useFormSubmit";

interface Match { id: string; slug: string; name: string; area: string | null; city: string }

export function ClaimForm({ defaultName = "", defaultEmail = "" }: { defaultName?: string; defaultEmail?: string }) {
  const { status, error, submit } = useFormSubmit("/api/v1/claims");
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [school, setSchool] = useState<Match | null>(null);
  const [form, setForm] = useState({ claimant_name: defaultName, role_title: "", official_email: defaultEmail, phone: "", message: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    if (school || query.trim().length < 2) { setMatches([]); return; }
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/schools?lean=1&limit=8&q=${encodeURIComponent(query.trim())}`);
        const json = await res.json();
        if (!cancelled && json.success) setMatches(json.data);
      } catch { /* suggestions are optional */ }
    }, 200);
    return () => { cancelled = true; clearTimeout(t); };
  }, [query, school]);

  if (status === "done") {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <CheckCircle2 size={40} color="#16a34a" style={{ margin: "0 auto 10px" }} />
        <p style={{ fontWeight: 700, fontSize: 16, color: "var(--dark)" }}>Claim submitted for {school?.name}</p>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, lineHeight: 1.6 }}>
          We&apos;ll check it against the school&apos;s official contact before giving access. You can follow its status in the <a href="/manage/profile" style={{ fontWeight: 600, color: "var(--brown-dark)" }}>School Portal</a>.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (school) submit({ school_slug: school.slug, ...form, role_title: form.role_title || undefined, phone: form.phone || undefined, message: form.message || undefined }); }}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div style={{ position: "relative" }}>
        <label className="field-label" htmlFor="cl-school">Your school</label>
        {school ? (
          <div className="field-input" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span><strong>{school.name}</strong> · {[school.area, school.city].filter(Boolean).join(", ")}</span>
            <button type="button" onClick={() => { setSchool(null); setQuery(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 12, fontWeight: 600 }}>Change</button>
          </div>
        ) : (
          <>
            <input id="cl-school" className="field-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Start typing the school's name…" autoComplete="off" />
            {matches.length > 0 && (
              <ul role="listbox" style={{ position: "absolute", zIndex: 10, left: 0, right: 0, top: "100%", marginTop: 4, background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 10, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                {matches.map((m) => (
                  <li key={m.id}>
                    <button type="button" onClick={() => { setSchool(m); setMatches([]); }} style={{ width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--dark)" }}>
                      <strong>{m.name}</strong> <span style={{ color: "var(--muted)" }}>· {[m.area, m.city].filter(Boolean).join(", ")}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 14 }}>
        <div>
          <label className="field-label" htmlFor="cl-name">Your name</label>
          <input id="cl-name" className="field-input" required minLength={2} value={form.claimant_name} onChange={set("claimant_name")} autoComplete="name" />
        </div>
        <div>
          <label className="field-label" htmlFor="cl-role">Your role</label>
          <input id="cl-role" className="field-input" value={form.role_title} onChange={set("role_title")} placeholder="Principal, admissions head…" />
        </div>
        <div>
          <label className="field-label" htmlFor="cl-email">Official school email</label>
          <input id="cl-email" className="field-input" type="email" required value={form.official_email} onChange={set("official_email")} placeholder="you@yourschool.edu.in" />
        </div>
        <div>
          <label className="field-label" htmlFor="cl-phone">Phone</label>
          <input id="cl-phone" className="field-input" type="tel" value={form.phone} onChange={set("phone")} />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="cl-msg">Anything else we should know? (optional)</label>
        <textarea id="cl-msg" className="field-input" rows={3} value={form.message} onChange={set("message")} />
      </div>
      {error && <p role="alert" style={{ color: "#dc2626", fontSize: 13 }}>{error}</p>}
      <div>
        <button className="btn-primary" type="submit" disabled={!school || status === "sending"}>
          <ShieldCheck size={14} /> {status === "sending" ? "Submitting…" : "Submit claim"}
        </button>
      </div>
    </form>
  );
}
