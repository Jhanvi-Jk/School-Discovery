"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { useFormSubmit } from "@/components/forms/useFormSubmit";

const TOPICS = [
  { value: "general", label: "General question" },
  { value: "data-correction", label: "Correct a school's information" },
  { value: "school-listing", label: "I represent a school" },
  { value: "partnership", label: "Partnership / advertising" },
  { value: "privacy", label: "Privacy request (access, correction, erasure)" },
  { value: "press", label: "Press" },
];

export function ContactForm({ defaultTopic = "general" }: { defaultTopic?: string }) {
  const { status, error, submit } = useFormSubmit("/api/v1/contact");
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS.some((t) => t.value === defaultTopic) ? defaultTopic : "general", message: "", website: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (status === "done") {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <CheckCircle2 size={40} color="#16a34a" style={{ margin: "0 auto 10px" }} />
        <p style={{ fontWeight: 700, fontSize: 16, color: "var(--dark)" }}>Message sent — thank you.</p>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>We&apos;ll reply to {form.email}.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submit(form); }}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 14 }}>
        <div>
          <label className="field-label" htmlFor="c-name">Your name</label>
          <input id="c-name" className="field-input" required minLength={2} value={form.name} onChange={set("name")} autoComplete="name" />
        </div>
        <div>
          <label className="field-label" htmlFor="c-email">Email</label>
          <input id="c-email" className="field-input" type="email" required value={form.email} onChange={set("email")} autoComplete="email" />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="c-topic">Topic</label>
        <select id="c-topic" className="field-input" value={form.topic} onChange={set("topic")}>
          {TOPICS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="c-message">Message</label>
        <textarea id="c-message" className="field-input" rows={6} required minLength={10} value={form.message} onChange={set("message")} />
      </div>
      {/* Honeypot — hidden from people, tempting to bots */}
      <input
        type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set("website")}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      {error && <p role="alert" style={{ color: "#dc2626", fontSize: 13 }}>{error}</p>}
      <div>
        <button className="btn-primary" type="submit" disabled={status === "sending"}>
          <Send size={14} /> {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
