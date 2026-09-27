"use client";

import { useState } from "react";
import { CheckCircle2, Flag } from "lucide-react";
import { useFormSubmit } from "@/components/forms/useFormSubmit";

const ISSUES = [
  "Fees are wrong or out of date",
  "Admission dates are wrong",
  "Phone, email or website is wrong",
  "School has closed or doesn't exist",
  "Duplicate listing",
  "Wrong board / curriculum",
  "Wrong location or area",
  "Offensive or inappropriate text",
  "Something else",
];

export function ReportForm({ schoolName = "", schoolSlug = "" }: { schoolName?: string; schoolSlug?: string }) {
  const { status, error, submit } = useFormSubmit("/api/v1/bug-report");
  const [school, setSchool] = useState(schoolName);
  const [issue, setIssue] = useState(ISSUES[0]);
  const [details, setDetails] = useState("");
  const [source, setSource] = useState("");
  const [email, setEmail] = useState("");

  if (status === "done") {
    return (
      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <CheckCircle2 size={40} color="#16a34a" style={{ margin: "0 auto 10px" }} />
        <p style={{ fontWeight: 700, fontSize: 16, color: "var(--dark)" }}>Report received — thank you.</p>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>We check every report against the school&apos;s official sources.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit({
          bugType: "school",
          context: [school, schoolSlug && `/schools/${schoolSlug}`].filter(Boolean).join(" — "),
          description: `${issue}\n\n${details}${source ? `\n\nSource: ${source}` : ""}`,
          wantContact: !!email,
          email,
        });
      }}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div>
        <label className="field-label" htmlFor="r-school">School</label>
        <input id="r-school" className="field-input" required value={school} onChange={(e) => setSchool(e.target.value)} placeholder="School name (and area, if there are several branches)" />
      </div>
      <div>
        <label className="field-label" htmlFor="r-issue">What&apos;s wrong?</label>
        <select id="r-issue" className="field-input" value={issue} onChange={(e) => setIssue(e.target.value)}>
          {ISSUES.map((i) => <option key={i}>{i}</option>)}
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="r-details">What should it say?</label>
        <textarea id="r-details" className="field-input" rows={4} required value={details} onChange={(e) => setDetails(e.target.value)} placeholder="The correct fee, date, phone number…" />
      </div>
      <div>
        <label className="field-label" htmlFor="r-source">Where can we confirm it? (optional)</label>
        <input id="r-source" className="field-input" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Link to the school's page, a circular, a fee sheet…" />
      </div>
      <div>
        <label className="field-label" htmlFor="r-email">Your email — only if you want to hear back (optional)</label>
        <input id="r-email" className="field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </div>
      {error && <p role="alert" style={{ color: "#dc2626", fontSize: 13 }}>{error}</p>}
      <div>
        <button className="btn-primary" type="submit" disabled={status === "sending"}>
          <Flag size={14} /> {status === "sending" ? "Sending…" : "Send report"}
        </button>
      </div>
    </form>
  );
}
