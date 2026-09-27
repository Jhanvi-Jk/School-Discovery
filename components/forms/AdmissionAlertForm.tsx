"use client";

import { useState } from "react";
import Link from "next/link";
import { BellRing, CheckCircle2 } from "lucide-react";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { CITIES } from "@/lib/cities";

const GRADES = ["Nursery", "LKG", "UKG", ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)];

interface Props {
  /** Alert for one school… */
  schoolSlug?: string;
  schoolName?: string;
  /** …or for a whole city (calendar page) */
  compact?: boolean;
}

export function AdmissionAlertForm({ schoolSlug, schoolName, compact }: Props) {
  const { status, error, submit } = useFormSubmit("/api/v1/alerts");
  const [channel, setChannel] = useState<"email" | "whatsapp" | "both">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState("");
  const [city, setCity] = useState(CITIES[0].dbName);
  const [consent, setConsent] = useState(false);

  if (status === "done") {
    return (
      <div style={{ textAlign: "center", padding: "12px 0" }}>
        <CheckCircle2 size={30} color="#16a34a" style={{ margin: "0 auto 8px" }} />
        <p style={{ fontWeight: 700, fontSize: 14, color: "var(--dark)" }}>You&apos;re on the list.</p>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
          We&apos;ll message you when {schoolName ? `${schoolName} opens` : `admissions open in ${city}`}. You can unsubscribe from any message.
        </p>
      </div>
    );
  }

  const needsEmail = channel !== "whatsapp";
  const needsPhone = channel !== "email";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit({
          ...(schoolSlug ? { school_slug: schoolSlug } : { city }),
          grade: grade || undefined,
          channel,
          email: needsEmail ? email : undefined,
          phone: needsPhone ? phone : undefined,
          consent,
        });
      }}
      style={{ display: "flex", flexDirection: "column", gap: compact ? 10 : 12 }}
    >
      {!schoolSlug && (
        <div>
          <label className="field-label" htmlFor="al-city">City</label>
          <select id="al-city" className="field-input" value={city} onChange={(e) => setCity(e.target.value)}>
            {CITIES.map((c) => <option key={c.slug} value={c.dbName}>{c.label}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="field-label" htmlFor="al-grade">Grade (optional)</label>
        <select id="al-grade" className="field-input" value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option value="">Any grade</option>
          {GRADES.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>
      <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
        <legend className="field-label">Alert me by</legend>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 13 }}>
          {([["email", "Email"], ["whatsapp", "WhatsApp"], ["both", "Both"]] as const).map(([v, label]) => (
            <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input type="radio" name="al-channel" checked={channel === v} onChange={() => setChannel(v)} /> {label}
            </label>
          ))}
        </div>
      </fieldset>
      {needsEmail && (
        <div>
          <label className="field-label" htmlFor="al-email">Email</label>
          <input id="al-email" className="field-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
      )}
      {needsPhone && (
        <div>
          <label className="field-label" htmlFor="al-phone">WhatsApp number</label>
          <input id="al-phone" className="field-input" type="tel" inputMode="numeric" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" autoComplete="tel" />
        </div>
      )}
      <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, color: "var(--muted)", lineHeight: 1.5, cursor: "pointer" }}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required style={{ marginTop: 3 }} />
        <span>
          I agree to receive admission alerts{schoolName ? ` for ${schoolName}` : ""} on the channel(s) I chose, and to SchoolFind360 storing my contact details for this purpose. I can withdraw consent any time. See the <Link href="/privacy" style={{ textDecoration: "underline" }}>Privacy Policy</Link>.
        </span>
      </label>
      {error && <p role="alert" style={{ color: "#dc2626", fontSize: 12 }}>{error}</p>}
      <button className="btn-primary" type="submit" disabled={!consent || status === "sending"} style={{ padding: "10px 16px", fontSize: 13 }}>
        <BellRing size={14} /> {status === "sending" ? "Saving…" : "Alert me"}
      </button>
    </form>
  );
}
