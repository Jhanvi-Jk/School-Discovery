"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Send, CheckCircle2 } from "lucide-react";
import { useFormSubmit } from "@/components/forms/useFormSubmit";

const GRADE_OPTIONS = ["Nursery", "LKG", "UKG", ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)];

interface Props {
  schoolSlug: string;
  schoolName: string;
  /** "campus_visit" adds a preferred-date field and changes the wording */
  kind?: "admission" | "campus_visit";
  onClose: () => void;
}

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export function EnquiryForm({ schoolSlug, schoolName, kind = "admission", onClose }: Props) {
  const { status, error, submit } = useFormSubmit(`/api/v1/schools/${schoolSlug}/enquiry`);
  const [mode, setMode] = useState(kind);
  const [form, setForm] = useState({ name: "", email: "", phone: "", grade: "", message: "", visit_date: "" });
  const [consent, setConsent] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const tomorrow = new Date(Date.now() + 86400000);
  const visit = mode === "campus_visit";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} role="dialog" aria-modal="true" aria-label={visit ? "Book a campus visit" : "Enquire about admission"}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }} />
      <div style={{ position: "relative", background: "var(--beige-100)", borderRadius: 16, width: "100%", maxWidth: 460, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", border: "1px solid var(--beige-400)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "18px 20px", borderBottom: "1px solid var(--beige-400)" }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--dark)" }}>{visit ? "Book a campus visit" : "Enquire about admission"}</h3>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{schoolName}</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}><X size={18} /></button>
        </div>

        {status === "done" ? (
          <div style={{ padding: "32px 24px", textAlign: "center" }}>
            <CheckCircle2 size={44} color="#16a34a" style={{ margin: "0 auto 10px" }} />
            <h4 style={{ fontWeight: 800, color: "var(--dark)", marginBottom: 4 }}>{visit ? "Visit request sent" : "Enquiry sent"}</h4>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              We&apos;ve passed your details to {schoolName}. They usually reply within a few working days — replies come to {form.email}.
            </p>
            <button className="btn-primary" onClick={onClose} style={{ marginTop: 16 }}>Done</button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit({
                name: form.name, email: form.email, kind: mode, consent,
                phone: form.phone || undefined, grade: form.grade || undefined, message: form.message || undefined,
                visit_date: visit && form.visit_date ? form.visit_date : undefined,
              });
            }}
            style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {([["campus_visit", "Book a campus visit"], ["admission", "General enquiry"]] as const).map(([v, label]) => (
                <button key={v} type="button" onClick={() => setMode(v)} style={{
                  flex: 1, padding: "8px 10px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  border: `1.5px solid ${mode === v ? "var(--dark)" : "var(--beige-500)"}`,
                  background: mode === v ? "var(--dark)" : "transparent", color: mode === v ? "white" : "var(--dark)",
                }}>{label}</button>
              ))}
            </div>
            <div className="grid grid-cols-2" style={{ gap: 10 }}>
              <div>
                <label className="field-label" htmlFor="eq-name">Your name *</label>
                <input id="eq-name" className="field-input" required minLength={2} value={form.name} onChange={set("name")} autoComplete="name" />
              </div>
              <div>
                <label className="field-label" htmlFor="eq-grade">Grade</label>
                <select id="eq-grade" className="field-input" value={form.grade} onChange={set("grade")}>
                  <option value="">Select</option>
                  {GRADE_OPTIONS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="field-label" htmlFor="eq-email">Email *</label>
              <input id="eq-email" className="field-input" type="email" required value={form.email} onChange={set("email")} autoComplete="email" />
            </div>
            <div>
              <label className="field-label" htmlFor="eq-phone">Phone</label>
              <input id="eq-phone" className="field-input" type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" />
            </div>
            {visit && (
              <div>
                <label className="field-label" htmlFor="eq-date">Preferred visit date</label>
                <input id="eq-date" className="field-input" type="date" min={isoDate(tomorrow)} value={form.visit_date} onChange={set("visit_date")} />
              </div>
            )}
            <div>
              <label className="field-label" htmlFor="eq-msg">Message</label>
              <textarea id="eq-msg" className="field-input" rows={3} value={form.message} onChange={set("message")} placeholder={visit ? "Anything you'd like to see or ask about on the visit…" : "Any specific questions about the school…"} />
            </div>
            <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, color: "var(--muted)", lineHeight: 1.5, cursor: "pointer" }}>
              <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 3 }} />
              <span>I agree that SchoolFind360 may share these details with {schoolName} so they can respond. See the <Link href="/privacy" style={{ textDecoration: "underline" }}>Privacy Policy</Link>.</span>
            </label>
            {error && <p role="alert" style={{ color: "#dc2626", fontSize: 12 }}>{error}</p>}
            <button className="btn-primary" type="submit" disabled={!consent || status === "sending"}>
              <Send size={14} /> {status === "sending" ? "Sending…" : visit ? "Request visit" : "Send enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
