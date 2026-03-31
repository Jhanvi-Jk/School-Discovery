"use client";

import Link from "next/link";
import { X, ArrowLeft, Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useCompareStore } from "@/store/compareStore";
import { formatFeesRange, formatRating } from "@/lib/utils";
import { CURRICULUM_LABELS, SCHOOL_TYPE_LABELS } from "@/lib/types";
import type { SchoolSummary } from "@/lib/types";

const ROWS = [
  { label: "Area",            fn: (s: SchoolSummary) => s.area || s.city },
  { label: "Type",            fn: (s: SchoolSummary) => SCHOOL_TYPE_LABELS[s.type] },
  { label: "Curriculum",      fn: (s: SchoolSummary) => s.curricula?.map(c => CURRICULUM_LABELS[c]).join(", ") || "—" },
  { label: "Gender",          fn: (s: SchoolSummary) => s.gender === "coed" ? "Co-ed" : s.gender === "boys" ? "Boys Only" : "Girls Only" },
  { label: "Annual Fees",     fn: (s: SchoolSummary) => formatFeesRange(s.total_fees_min, s.total_fees_max) || "—" },
  { label: "Rating",          fn: (s: SchoolSummary) => s.avg_rating ? `${formatRating(s.avg_rating)} / 5` : "No reviews" },
  { label: "Transport",       fn: (s: SchoolSummary) => s.has_transport ? "Available" : "Not available" },
  { label: "Student:Teacher", fn: (s: SchoolSummary) => s.student_teacher_ratio ? `${s.student_teacher_ratio}:1` : "—" },
  { label: "Hours",           fn: (s: SchoolSummary) => (s.school_hours_start && s.school_hours_end) ? `${s.school_hours_start} – ${s.school_hours_end}` : "—" },
  { label: "Admissions",      fn: (s: SchoolSummary) => s.admissions_open ? "Open now" : "Closed" },
];

export default function ComparePage() {
  const { schools, removeSchool, clearAll } = useCompareStore();

  return (
    <>
      <Header />
      <div className="compare-page">
        <div className="compare-inner">

          {/* Heading */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link href="/schools" style={{
                width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--beige-200)", border: "1px solid var(--beige-500)", borderRadius: 10
              }}>
                <ArrowLeft size={16} />
              </Link>
              <div>
                <h1 className="compare-heading">Compare Data</h1>
                <p className="compare-sub">{schools.length} school{schools.length !== 1 ? "s" : ""} selected</p>
              </div>
            </div>
            {schools.length > 0 && (
              <button onClick={clearAll} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>
                Clear all
              </button>
            )}
          </div>

          {/* Empty state */}
          {schools.length === 0 ? (
            <div className="empty-compare">
              <div className="icon">📊</div>
              <h3>No schools selected yet</h3>
              <p>Add schools from the Explore page using the Compare button</p>
              <Link href="/schools" className="btn-primary">Browse Schools</Link>
            </div>
          ) : (
            <div className="compare-table-wrap">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th className="label-col">School</th>
                    {schools.map((school) => (
                      <th key={school.id}>
                        <div className="school-col-head">
                          <div>
                            <div className="name">{school.name}</div>
                            <div className="area">{school.area}</div>
                          </div>
                          <div className="school-col-actions">
                            <Link href={`/schools/${school.slug}`} className="btn-col-view">View</Link>
                            <button className="btn-col-remove" onClick={() => removeSchool(school.id)}>
                              <X size={13} />
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                    {schools.length < 4 && (
                      <th>
                        <Link href="/schools" className="add-school-slot">
                          <Plus size={18} />
                          Add School
                        </Link>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.label}>
                      <td className="label-col">{row.label}</td>
                      {schools.map((school) => (
                        <td key={school.id}>{row.fn(school)}</td>
                      ))}
                      {schools.length < 4 && <td />}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
