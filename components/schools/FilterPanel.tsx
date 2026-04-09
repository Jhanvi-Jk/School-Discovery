"use client";

import { useState } from "react";
import {
  MapPin, BookOpen, Users, Building2, IndianRupee,
  Bus, Trophy, Music, Languages, Calendar, Clock,
  ChevronDown, X, Search, SlidersHorizontal, FlaskConical, ExternalLink, Info,
} from "lucide-react";
import { useFilterStore } from "@/store/filterStore";
import {
  BENGALURU_AREAS, ALL_SPORTS, ALL_EXTRACURRICULARS,
  ALL_LANGUAGES, GRADE_OPTIONS,
  Curriculum, SchoolType, SchoolGender,
  CURRICULUM_LABELS, SCHOOL_TYPE_LABELS, GENDER_LABELS,
  IB_MYP_SUBJECTS, IB_DP_SUBJECTS,
  IGCSE_SUBJECTS, ICSE_ELECTIVES_9_10, ISC_ELECTIVES_11_12,
  CBSE_STREAMS, STATE_BOARD_STREAMS,
} from "@/lib/types";

// ── Section wrapper ──────────────────────────────────────────

function Section({
  icon: Icon, title, count, defaultOpen = false, children,
}: {
  icon: React.ElementType; title: string; count?: number;
  defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="fp-section">
      <button className="fp-trigger" onClick={() => setOpen(!open)}>
        <div className="fp-trigger-left">
          <Icon size={14} />
          <span className="fp-trigger-title">{title}</span>
          {!!count && count > 0 && <span className="fp-badge">{count}</span>}
        </div>
        <ChevronDown size={14} className={`fp-chevron${open ? " open" : ""}`} />
      </button>
      {open && <div className="fp-body">{children}</div>}
    </div>
  );
}

// ── Searchable list ──────────────────────────────────────────

function SearchableList({ items, selected, onToggle, placeholder }: {
  items: string[]; selected: string[]; onToggle: (v: string) => void; placeholder: string;
}) {
  const [q, setQ] = useState("");
  const filtered = items.filter((i) => i.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div className="fp-search">
        <Search size={12} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} />
      </div>
      <div className="fp-list">
        {filtered.length === 0
          ? <p className="fp-list-empty">No results</p>
          : filtered.map((item) => (
            <label key={item} className="fp-check-row" style={{ cursor: "pointer" }}>
              <div
                className={`fp-check-box${selected.includes(item) ? " on" : ""}`}
                onClick={() => onToggle(item)}
              >
                {selected.includes(item) && (
                  <svg width="9" height="9" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="fp-check-label">{item}</span>
            </label>
          ))
        }
      </div>
    </>
  );
}

// ── Toggle switch ────────────────────────────────────────────

function Toggle({ label, sub, value, onChange }: {
  label: string; sub?: string; value: boolean | null; onChange: (v: boolean | null) => void;
}) {
  return (
    <div className="fp-toggle-row">
      <div className="fp-toggle-info">
        <p>{label}</p>
        {sub && <span>{sub}</span>}
      </div>
      <button
        className={`fp-switch${value === true ? " on" : ""}`}
        onClick={() => onChange(value === true ? null : true)}
      />
    </div>
  );
}

// ── Fee slider ───────────────────────────────────────────────

function FeeSlider() {
  const { filters, setFilter } = useFilterStore();
  const MAX = 1000000;
  const fmt = (v: number) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`;
  return (
    <>
      <div className="fp-fee-labels">
        <span>{fmt(filters.fees_min)}</span>
        <span>{filters.fees_max >= MAX ? "No limit" : fmt(filters.fees_max)}</span>
      </div>
      <input type="range" className="fp-slider" min={0} max={MAX} step={10000}
        value={filters.fees_min}
        onChange={(e) => { const v = +e.target.value; if (v < filters.fees_max) setFilter("fees_min", v); }}
      />
      <input type="range" className="fp-slider" min={0} max={MAX} step={10000}
        value={filters.fees_max}
        onChange={(e) => { const v = +e.target.value; if (v > filters.fees_min) setFilter("fees_max", v); }}
      />
      <div className="fp-presets">
        {[100000, 200000, 500000].map((p) => (
          <button key={p} className={`fp-preset${filters.fees_max === p ? " on" : ""}`}
            onClick={() => setFilter("fees_max", p)}>
            Under {fmt(p)}
          </button>
        ))}
      </div>
    </>
  );
}

// ── Contextual Subject / Stream filter ──────────────────────

function SubjectStreamFilter() {
  const { filters, toggleArrayFilter, setFilter } = useFilterStore();
  const { curricula, grades, subjects, streams } = filters;

  const has910 = grades.some((g) => ["Grade 9", "Grade 10"].includes(g));
  const has1112 = grades.some((g) => ["Grade 11", "Grade 12"].includes(g));

  const hasIB         = curricula.includes("ib");
  const hasIGCSE      = curricula.includes("igcse");
  const hasICSE       = curricula.includes("icse");
  const hasCBSE       = curricula.includes("cbse");
  const hasStateBoard = curricula.includes("state_board");

  // Determine which panels to show
  const showIBMYP        = hasIB    && has910;
  const showIBDP         = hasIB    && has1112;
  const showIGCSE910     = hasIGCSE && has910;
  const showIGCSE1112    = hasIGCSE && has1112;
  const showICSE910      = hasICSE  && has910;
  const showISC1112      = hasICSE  && has1112;
  const showCBSEStream   = hasCBSE  && has1112;
  const showSBStream     = hasStateBoard && has1112;

  const anyVisible = showIBMYP || showIBDP || showIGCSE910 || showIGCSE1112 ||
                     showICSE910 || showISC1112 || showCBSEStream || showSBStream;

  if (!anyVisible) return null;

  const note = (text: string) => (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 6,
      background: "var(--beige-300)", borderRadius: 8, padding: "7px 10px", marginBottom: 10,
      fontSize: 11, color: "var(--muted)", lineHeight: 1.5,
    }}>
      <Info size={12} style={{ flexShrink: 0, marginTop: 1 }} />
      {text}
    </div>
  );

  const ibLink = (prog: string, url: string) => (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11, color: "var(--brown-dark)", fontWeight: 600,
      marginBottom: 10, textDecoration: "none",
    }}>
      <ExternalLink size={11} /> Official IB {prog} subject guide ↗
    </a>
  );

  return (
    <Section icon={FlaskConical} title="Subjects / Stream"
      count={subjects.length + streams.length}
      defaultOpen>
      <>
        {/* IB MYP (Grade 9–10) */}
        {showIBMYP && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--dark)", marginBottom: 4 }}>
              IB MYP — Grade 9–10
            </p>
            {ibLink("MYP", "https://www.ibo.org/programmes/middle-years-programme/curriculum/")}
            {note("IB MYP students study all 8 subject groups. Use this to filter schools that specialise in specific areas.")}
            <SearchableList
              items={IB_MYP_SUBJECTS}
              selected={subjects}
              onToggle={(v) => toggleArrayFilter("subjects", v)}
              placeholder="Search MYP subjects…"
            />
          </div>
        )}

        {/* IB DP (Grade 11–12) */}
        {showIBDP && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--dark)", marginBottom: 4 }}>
              IB Diploma — Grade 11–12
            </p>
            {ibLink("DP", "https://www.ibo.org/programmes/diploma-programme/curriculum/")}
            {note("Students choose 6 subjects across 6 groups — 3 at Higher Level (HL), 3 at Standard Level (SL).")}
            <SearchableList
              items={IB_DP_SUBJECTS}
              selected={subjects}
              onToggle={(v) => toggleArrayFilter("subjects", v)}
              placeholder="Search DP subjects…"
            />
          </div>
        )}

        {/* IGCSE Grade 9–10 */}
        {showIGCSE910 && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--dark)", marginBottom: 4 }}>
              IGCSE — Grade 9–10
            </p>
            {note("✦ English Language and Mathematics are compulsory in all IGCSE schools. Other subjects vary.")}
            <SearchableList
              items={IGCSE_SUBJECTS}
              selected={subjects}
              onToggle={(v) => toggleArrayFilter("subjects", v)}
              placeholder="Search IGCSE subjects…"
            />
          </div>
        )}

        {/* IGCSE Grade 11–12 (A Level / AS) */}
        {showIGCSE1112 && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--dark)", marginBottom: 4 }}>
              Cambridge A Level — Grade 11–12
            </p>
            <SearchableList
              items={IGCSE_SUBJECTS}
              selected={subjects}
              onToggle={(v) => toggleArrayFilter("subjects", v)}
              placeholder="Search A Level subjects…"
            />
          </div>
        )}

        {/* ICSE Electives Grade 9–10 */}
        {showICSE910 && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--dark)", marginBottom: 4 }}>
              ICSE Electives — Grade 9–10
            </p>
            {note("All ICSE students study English, Math, Science, Social Studies, and a language. Electives are the additional subjects they pick.")}
            <SearchableList
              items={ICSE_ELECTIVES_9_10}
              selected={subjects}
              onToggle={(v) => toggleArrayFilter("subjects", v)}
              placeholder="Search electives…"
            />
          </div>
        )}

        {/* ISC (ICSE Grade 11–12) */}
        {showISC1112 && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--dark)", marginBottom: 4 }}>
              ISC Electives — Grade 11–12
            </p>
            {note("For ISC, students choose a combination of subjects. English is compulsory.")}
            <SearchableList
              items={ISC_ELECTIVES_11_12}
              selected={subjects}
              onToggle={(v) => toggleArrayFilter("subjects", v)}
              placeholder="Search ISC subjects…"
            />
          </div>
        )}

        {/* CBSE Streams Grade 11–12 */}
        {showCBSEStream && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--dark)", marginBottom: 4 }}>
              CBSE Stream — Grade 11–12
            </p>
            {note("Choose the stream combination you are looking for. Schools may offer one or multiple streams.")}
            <div className="fp-chips" style={{ marginTop: 4 }}>
              {CBSE_STREAMS.map((s) => (
                <button
                  key={s}
                  className={`fp-chip${streams.includes(s) ? " on" : ""}`}
                  onClick={() => toggleArrayFilter("streams", s)}
                >
                  {s.split(" — ")[0]}
                </button>
              ))}
            </div>
            {streams.length > 0 && (
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
                Selected: {streams.map((s) => s.split(" — ")[0]).join(", ")}
              </p>
            )}
          </div>
        )}

        {/* State Board Streams Grade 11–12 */}
        {showSBStream && (
          <div style={{ marginBottom: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--dark)", marginBottom: 4 }}>
              State Board Stream — Grade 11–12
            </p>
            <div className="fp-chips" style={{ marginTop: 4 }}>
              {STATE_BOARD_STREAMS.map((s) => (
                <button
                  key={s}
                  className={`fp-chip${streams.includes(s) ? " on" : ""}`}
                  onClick={() => toggleArrayFilter("streams", s)}
                >
                  {s.split(" — ")[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clear subjects/streams */}
        {(subjects.length > 0 || streams.length > 0) && (
          <button
            onClick={() => { setFilter("subjects", []); setFilter("streams", []); }}
            style={{
              background: "none", border: "none", color: "var(--muted)",
              fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
              marginTop: 6,
            }}
          >
            <X size={10} /> Clear subject filters
          </button>
        )}
      </>
    </Section>
  );
}

// ── Main FilterPanel ─────────────────────────────────────────

export function FilterPanel({ className }: { className?: string }) {
  const { filters, toggleArrayFilter, setFilter, resetFilters, activeFilterCount } = useFilterStore();
  const count = activeFilterCount();

  return (
    <div className="fp-wrap">
      {/* Clear all */}
      {count > 0 && (
        <div style={{
          padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "flex-end",
          borderBottom: "1px solid var(--beige-400)", background: "var(--beige-300)"
        }}>
          <button onClick={resetFilters} style={{
            background: "none", border: "none", color: "var(--muted)",
            fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4
          }}>
            <X size={11} /> Clear all ({count})
          </button>
        </div>
      )}

      {/* 1. Area */}
      <Section icon={MapPin} title="Area / Neighbourhood" count={filters.areas.length} defaultOpen>
        <SearchableList items={BENGALURU_AREAS} selected={filters.areas}
          onToggle={(v) => toggleArrayFilter("areas", v)} placeholder="Search areas…" />
      </Section>

      {/* 2. Curriculum */}
      <Section icon={BookOpen} title="Curriculum / Board" count={filters.curricula.length} defaultOpen>
        <div className="fp-chips">
          {(Object.keys(CURRICULUM_LABELS) as Curriculum[]).map((c) => (
            <button key={c} className={`fp-chip${filters.curricula.includes(c) ? " on" : ""}`}
              onClick={() => toggleArrayFilter("curricula", c)}>
              {CURRICULUM_LABELS[c]}
            </button>
          ))}
        </div>
      </Section>

      {/* 3. School Type */}
      <Section icon={Building2} title="School Type" count={filters.types.length}>
        {(Object.keys(SCHOOL_TYPE_LABELS) as SchoolType[]).map((t) => (
          <label key={t} className="fp-check-row" style={{ cursor: "pointer" }}>
            <div className={`fp-check-box${filters.types.includes(t) ? " on" : ""}`}
              onClick={() => toggleArrayFilter("types", t)}>
              {filters.types.includes(t) && (
                <svg width="9" height="9" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="fp-check-label">{SCHOOL_TYPE_LABELS[t]}</span>
          </label>
        ))}
      </Section>

      {/* 4. Gender */}
      <Section icon={Users} title="Gender" count={filters.gender.length}>
        <div className="fp-chips">
          {(Object.keys(GENDER_LABELS) as SchoolGender[]).map((g) => (
            <button key={g} className={`fp-chip${filters.gender.includes(g) ? " on" : ""}`}
              onClick={() => toggleArrayFilter("gender", g)}>
              {GENDER_LABELS[g]}
            </button>
          ))}
        </div>
      </Section>

      {/* 5. Grade */}
      <Section icon={BookOpen} title="Grade / Class" count={filters.grades.length}>
        <div className="fp-grades">
          {GRADE_OPTIONS.map((g) => (
            <button key={g} className={`fp-grade-btn${filters.grades.includes(g) ? " on" : ""}`}
              onClick={() => toggleArrayFilter("grades", g)}>
              {g.replace("Grade ", "Gr.")}
            </button>
          ))}
        </div>
      </Section>

      {/* 5b. Contextual Subjects / Stream — appears when relevant curriculum+grade is selected */}
      <SubjectStreamFilter />

      {/* 6. Fees */}
      <Section icon={IndianRupee} title="Annual Fees"
        count={filters.fees_min > 0 || filters.fees_max < 1000000 ? 1 : 0}>
        <FeeSlider />
      </Section>

      {/* 7. Admissions */}
      <Section icon={Calendar} title="Admissions"
        count={(filters.admissions_open !== null ? 1 : 0) + (filters.mid_year !== null ? 1 : 0)}>
        <Toggle label="Admissions currently open" sub="Only schools accepting now"
          value={filters.admissions_open} onChange={(v) => setFilter("admissions_open", v)} />
        <Toggle label="Mid-year admission accepted"
          value={filters.mid_year} onChange={(v) => setFilter("mid_year", v)} />
      </Section>

      {/* 8. Transport */}
      <Section icon={Bus} title="Transport" count={filters.has_transport !== null ? 1 : 0}>
        <Toggle label="School bus available"
          value={filters.has_transport} onChange={(v) => setFilter("has_transport", v)} />
      </Section>

      {/* 9. Sports */}
      <Section icon={Trophy} title="Sports" count={filters.sports.length}>
        <SearchableList items={ALL_SPORTS} selected={filters.sports}
          onToggle={(v) => toggleArrayFilter("sports", v)} placeholder="Search sports…" />
      </Section>

      {/* 10. Extracurriculars */}
      <Section icon={Music} title="Extracurriculars" count={filters.extracurriculars.length}>
        <SearchableList items={ALL_EXTRACURRICULARS} selected={filters.extracurriculars}
          onToggle={(v) => toggleArrayFilter("extracurriculars", v)} placeholder="Search activities…" />
      </Section>

      {/* 11. Languages */}
      <Section icon={Languages} title="Languages Offered" count={filters.languages.length}>
        <SearchableList items={ALL_LANGUAGES} selected={filters.languages}
          onToggle={(v) => toggleArrayFilter("languages", v)} placeholder="Search languages…" />
      </Section>
    </div>
  );
}

// ── Mobile button / sheet ────────────────────────────────────

export function MobileFilterButton({ onOpen }: { onOpen: () => void }) {
  const count = useFilterStore((s) => s.activeFilterCount());
  return (
    <button onClick={onOpen} style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "10px 16px", borderRadius: 12,
      background: "var(--beige-200)", border: "1px solid var(--beige-500)",
      fontSize: 13, fontWeight: 600, color: "var(--dark)"
    }}>
      <SlidersHorizontal size={14} />
      Filters
      {count > 0 && (
        <span style={{
          background: "var(--brown-dark)", color: "white", borderRadius: 99,
          minWidth: 18, height: 18, fontSize: 10, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px"
        }}>{count}</span>
      )}
    </button>
  );
}

export function MobileFilterSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={onClose} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "var(--beige-200)", borderRadius: "20px 20px 0 0",
        maxHeight: "90vh", display: "flex", flexDirection: "column"
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 40, height: 4, background: "var(--beige-500)", borderRadius: 99 }} />
        </div>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 20px 12px", borderBottom: "1px solid var(--beige-400)"
        }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Filter Schools</span>
          <button onClick={onClose} style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
            <X size={18} color="var(--muted)" />
          </button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          <FilterPanel />
        </div>
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--beige-400)" }}>
          <button onClick={onClose} style={{
            width: "100%", padding: "12px", background: "var(--brown-dark)", color: "white",
            borderRadius: 12, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer"
          }}>
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
}
