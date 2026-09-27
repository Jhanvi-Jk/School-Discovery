"use client";

import { useMemo, useState } from "react";

// NEP 2020 school structure: a child should be 3 for pre-school, 6 for Class 1.
// Boards, states and individual schools set their own cut-off date and sometimes their own
// minimum ages, so both the date and the table are shown for the parent to check.
const NEP_GRADES = [
  { label: "Nursery / Pre-KG", minYears: 3 },
  { label: "LKG", minYears: 4 },
  { label: "UKG", minYears: 5 },
  { label: "Class 1", minYears: 6 },
  { label: "Class 2", minYears: 7 },
  { label: "Class 3", minYears: 8 },
];

function ageOn(dob: Date, on: Date) {
  let years = on.getFullYear() - dob.getFullYear();
  let months = on.getMonth() - dob.getMonth();
  let days = on.getDate() - dob.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(on.getFullYear(), on.getMonth(), 0).getDate();
  }
  if (months < 0) { years -= 1; months += 12; }
  return { years, months, days };
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

export function AgeCalculator() {
  const now = new Date();
  // Admissions in Sep–Dec are for the next academic year (starting April)
  const admissionYear = now.getMonth() >= 8 ? now.getFullYear() + 1 : now.getFullYear();
  const [dob, setDob] = useState("");
  const [cutoff, setCutoff] = useState(`${admissionYear}-07-31`);

  const result = useMemo(() => {
    if (!dob || !cutoff) return null;
    const d = new Date(dob), c = new Date(cutoff);
    if (isNaN(d.getTime()) || isNaN(c.getTime()) || d >= c) return null;
    const age = ageOn(d, c);
    const eligible = NEP_GRADES.filter((g) => age.years >= g.minYears);
    const best = eligible[eligible.length - 1];
    const next = NEP_GRADES.find((g) => age.years < g.minYears);
    let nextDate: string | null = null;
    if (next) {
      const t = new Date(d); t.setFullYear(t.getFullYear() + next.minYears);
      nextDate = iso(t);
    }
    return { age, best, next, nextDate };
  }, [dob, cutoff]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 14, marginBottom: 18 }}>
        <div>
          <label className="field-label" htmlFor="ac-dob">Child&apos;s date of birth</label>
          <input id="ac-dob" className="field-input" type="date" value={dob} max={iso(now)} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="ac-cut">Age counted as on (school&apos;s cut-off date)</label>
          <input id="ac-cut" className="field-input" type="date" value={cutoff} onChange={(e) => setCutoff(e.target.value)} />
        </div>
      </div>

      {result ? (
        <div style={{ background: "var(--beige-200)", border: "1px solid var(--beige-500)", borderRadius: 14, padding: 18 }}>
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Age on {new Date(cutoff).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: "var(--dark)", margin: "2px 0 10px" }}>
            {result.age.years} years {result.age.months} months {result.age.days} days
          </p>
          {result.best ? (
            <p style={{ fontSize: 15, color: "var(--dark)" }}>
              Under NEP 2020 minimum ages, your child can join <strong>{result.best.label}</strong> or lower.
            </p>
          ) : (
            <p style={{ fontSize: 15, color: "var(--dark)" }}>Your child is below the NEP 2020 minimum age for Nursery on this date.</p>
          )}
          {result.next && result.nextDate && (
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
              Turns {result.next.minYears} on {new Date(result.nextDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} — the earliest date for {result.next.label}.
              If that is after the cut-off, they join the following year.
            </p>
          )}
        </div>
      ) : (
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Enter a date of birth to see the result.</p>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, marginTop: 20 }}>
        <thead>
          <tr style={{ textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>
            <th style={{ padding: "8px 8px 8px 0" }}>Class</th><th style={{ padding: 8 }}>Minimum age (NEP 2020)</th>
          </tr>
        </thead>
        <tbody>
          {NEP_GRADES.map((g) => (
            <tr key={g.label} style={{ borderTop: "1px solid var(--beige-400)" }}>
              <td style={{ padding: "8px 8px 8px 0" }}>{g.label}</td><td style={{ padding: 8 }}>{g.minYears} years</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
