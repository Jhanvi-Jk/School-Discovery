"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin, IndianRupee, Sparkles } from "lucide-react";
import { formatFeesRange } from "@/lib/utils";
import { useCityStore } from "@/store/cityStore";
import { useFilterStore } from "@/store/filterStore";
import { CURRICULUM_LABELS, type Curriculum, type SchoolSummary } from "@/lib/types";

interface QuizCity { dbName: string; label: string; key: "bangalore" | "delhi" | "chennai" | "mumbai" }

const GRADES = ["Nursery", "LKG", "UKG", ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)];
const BOARDS: { value: Curriculum | ""; label: string; hint: string }[] = [
  { value: "", label: "Not sure yet", hint: "Show every board" },
  { value: "cbse", label: "CBSE", hint: "Most common; national entrance exams" },
  { value: "icse", label: "ICSE / ISC", hint: "English-heavy, broad syllabus" },
  { value: "ib", label: "IB", hint: "Inquiry-based, international" },
  { value: "igcse", label: "IGCSE", hint: "Cambridge, flexible subjects" },
  { value: "state_board", label: "State Board", hint: "State syllabus, usually lower fees" },
];
const BUDGETS = [
  { value: 100000, label: "Up to ₹1L a year" },
  { value: 200000, label: "Up to ₹2L a year" },
  { value: 400000, label: "Up to ₹4L a year" },
  { value: 1000000, label: "No limit" },
];
const NEEDS = [
  { id: "transport", label: "School bus / transport" },
  { id: "admissions", label: "Admissions open now" },
];

export function QuizClient({ cities }: { cities: QuizCity[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [city, setCity] = useState<QuizCity | null>(cities.length === 1 ? cities[0] : null);
  const [grade, setGrade] = useState("");
  const [board, setBoard] = useState<Curriculum | "">("");
  const [budget, setBudget] = useState(1000000);
  const [needs, setNeeds] = useState<string[]>([]);
  const [results, setResults] = useState<{ total: number; schools: SchoolSummary[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setCityStore = useCityStore((s) => s.setCity);
  const setFilter = useFilterStore((s) => s.setFilter);
  const resetFilters = useFilterStore((s) => s.resetFilters);

  const steps = ["City", "Grade", "Board", "Budget", "Must-haves"];
  const canNext = (step === 0 && !!city) || (step === 1 && !!grade) || step >= 2;

  function params() {
    const p = new URLSearchParams({ city: city!.dbName, sort: "rating", limit: "6" });
    if (grade) p.set("grade", grade);
    if (board) p.append("curriculum", board);
    if (budget < 1000000) p.set("fees_max", String(budget));
    if (needs.includes("transport")) p.set("has_transport", "true");
    if (needs.includes("admissions")) p.set("admissions_open", "true");
    return p.toString();
  }

  async function finish() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/schools?${params()}`);
      const json = await res.json();
      if (!json.success) throw new Error();
      setResults({ total: json.pagination.total, schools: json.data });
      setStep(5);
    } catch {
      setError("We couldn't load matches just now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Hand the answers to the main listing so the parent can keep refining
  function openFullList() {
    if (!city) return;
    resetFilters();
    setCityStore(city.key);
    if (grade) setFilter("grades", [grade]);
    if (board) setFilter("curricula", [board]);
    if (budget < 1000000) setFilter("fees_max", budget);
    if (needs.includes("transport")) setFilter("has_transport", true);
    if (needs.includes("admissions")) setFilter("admissions_open", true);
    router.push("/schools");
  }

  const chip = (active: boolean): React.CSSProperties => ({
    padding: "10px 16px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer",
    border: `1.5px solid ${active ? "var(--dark)" : "var(--beige-500)"}`,
    background: active ? "var(--dark)" : "var(--beige-200)", color: active ? "white" : "var(--dark)",
  });

  if (step === 5 && results) {
    return (
      <div>
        <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 4 }}>
          {city!.label} · {grade || "any grade"}{board ? ` · ${CURRICULUM_LABELS[board]}` : ""}
        </p>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--dark)", marginBottom: 14 }}>
          {results.total === 0 ? "No exact matches" : `${results.total} school${results.total === 1 ? "" : "s"} match${results.total === 1 ? "es" : ""}`}
        </h2>
        {results.total === 0 ? (
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, marginBottom: 16 }}>
            Nothing fits every answer. Try a higher budget or &quot;Not sure yet&quot; for the board.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {results.schools.map((s) => (
              <Link key={s.id} href={`/schools/${s.slug}`} style={{ background: "var(--beige-200)", border: "1px solid var(--beige-500)", borderRadius: 14, padding: "14px 16px", display: "block" }}>
                <p style={{ fontWeight: 700, color: "var(--dark)" }}>{s.name}</p>
                <p style={{ fontSize: 12, color: "var(--muted)", display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><MapPin size={11} />{s.area || s.city}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><IndianRupee size={11} />{formatFeesRange(s.total_fees_min, s.total_fees_max)}</span>
                  {s.curricula?.length ? <span>{s.curricula.map((c) => CURRICULUM_LABELS[c]).join(", ")}</span> : null}
                </p>
              </Link>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {results.total > 0 && <button className="btn-primary" onClick={openFullList}>See all {results.total} in the explorer <ArrowRight size={14} /></button>}
          <button className="btn-secondary" onClick={() => { setResults(null); setStep(0); }}>Start again</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }} aria-label={`Step ${step + 1} of ${steps.length}`}>
        {steps.map((s, i) => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 99, background: i <= step ? "var(--dark)" : "var(--beige-400)" }} />
        ))}
      </div>

      {step === 0 && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Which city are you looking in?</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {cities.map((c) => <button key={c.dbName} style={chip(city?.dbName === c.dbName)} onClick={() => setCity(c)}>{c.label}</button>)}
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Which grade is your child joining?</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {GRADES.map((g) => <button key={g} style={chip(grade === g)} onClick={() => setGrade(g)}>{g}</button>)}
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Any board in mind?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {BOARDS.map((b) => (
              <button key={b.label} style={{ ...chip(board === b.value), textAlign: "left" }} onClick={() => setBoard(b.value)}>
                {b.label} <span style={{ fontWeight: 400, opacity: 0.7, fontSize: 12 }}>— {b.hint}</span>
              </button>
            ))}
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>What&apos;s your yearly fee budget?</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {BUDGETS.map((b) => <button key={b.value} style={chip(budget === b.value)} onClick={() => setBudget(b.value)}>{b.label}</button>)}
          </div>
        </>
      )}
      {step === 4 && (
        <>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Anything that&apos;s a must-have?</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {NEEDS.map((n) => (
              <button key={n.id} style={chip(needs.includes(n.id))} onClick={() => setNeeds((prev) => prev.includes(n.id) ? prev.filter((x) => x !== n.id) : [...prev, n.id])}>{n.label}</button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>Optional — skip if nothing is essential.</p>
        </>
      )}

      {error && <p role="alert" style={{ color: "#dc2626", fontSize: 13, marginTop: 12 }}>{error}</p>}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
        <button className="btn-secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} style={{ visibility: step === 0 ? "hidden" : "visible" }}>
          <ArrowLeft size={14} /> Back
        </button>
        {step < 4 ? (
          <button className="btn-primary" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>Next <ArrowRight size={14} /></button>
        ) : (
          <button className="btn-primary" onClick={finish} disabled={loading}>
            <Sparkles size={14} /> {loading ? "Finding schools…" : "Show my matches"}
          </button>
        )}
      </div>
    </div>
  );
}
