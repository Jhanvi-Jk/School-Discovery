"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ArrowLeft, Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useCompareStore } from "@/store/compareStore";
import { formatFeesRange, formatRating, formatSchoolHours } from "@/lib/utils";
import { admissionLabel, summarizeAdmissions } from "@/lib/admissions";
import { profileCompleteness } from "@/lib/completeness";
import { commuteEstimate, haversineKm } from "@/lib/geo";
import { createClient } from "@/lib/supabase/client";
import { useHomeStore } from "@/store/homeStore";
import { CURRICULUM_LABELS, SCHOOL_TYPE_LABELS } from "@/lib/types";
import type { SchoolSummary } from "@/lib/types";

const ROWS: { label: string; fn: (s: SchoolSummary) => string }[] = [
  { label: "Area",            fn: (s: SchoolSummary) => s.area || s.city },
  { label: "Type",            fn: (s: SchoolSummary) => SCHOOL_TYPE_LABELS[s.type] },
  { label: "Curriculum",      fn: (s: SchoolSummary) => s.curricula?.map(c => CURRICULUM_LABELS[c]).join(", ") || "—" },
  { label: "Gender",          fn: (s: SchoolSummary) => s.gender === "coed" ? "Co-ed" : s.gender === "boys" ? "Boys Only" : "Girls Only" },
  { label: "Annual Fees",     fn: (s: SchoolSummary) => formatFeesRange(s.total_fees_min, s.total_fees_max) || "—" },
  { label: "Profile completeness", fn: (s: SchoolSummary) => `${profileCompleteness(s, s.verified).score}%` },
  { label: "Rating",          fn: (s: SchoolSummary) => s.avg_rating ? `${formatRating(s.avg_rating)} / 5` : "No reviews" },
  { label: "Transport",       fn: (s: SchoolSummary) => s.has_transport ? "Available" : "Not available" },
  { label: "Student:Teacher", fn: (s: SchoolSummary) => s.student_teacher_ratio ? `${s.student_teacher_ratio}:1` : "—" },
  { label: "Hours",           fn: (s: SchoolSummary) => (s.school_hours_start && s.school_hours_end) ? formatSchoolHours(s.school_hours_start, s.school_hours_end) : "—" },
  // Wording comes from the same date-aware logic as the listing cards and the profile page
  { label: "Admissions",      fn: (s: SchoolSummary) => s.admission_label ?? "—" },
];

interface FeeRow { school_id: string; academic_year: string; grade_label: string; sort_order: number; tuition_fee: number | null; other_fees: number | null }
interface ResultRow { school_id: string; exam: string; exam_year: number; pass_percentage: number | null }

const rupees = (n: number | null) => (n ? formatFeesRange(n, n) : "—");

export default function ComparePage() {
  const { schools: storedSchools, removeSchool, clearAll } = useCompareStore();
  const [schools, setSchools] = useState<SchoolSummary[]>(storedSchools);
  const [feeRows, setFeeRows] = useState<FeeRow[]>([]);
  const [resultRows, setResultRows] = useState<ResultRow[]>([]);
  const home = useHomeStore((s) => s.home);

  // Fees by grade and board results: optional tables, so a failure just leaves the sections out
  useEffect(() => {
    if (schools.length === 0) { setFeeRows([]); setResultRows([]); return; }
    const ids = schools.map((s) => s.id);
    const supabase = createClient();
    Promise.resolve(supabase.from("school_fee_structure").select("school_id, academic_year, grade_label, sort_order, tuition_fee, other_fees").in("school_id", ids))
      .then(({ data }) => setFeeRows((data as FeeRow[]) ?? [])).catch(() => setFeeRows([]));
    Promise.resolve(supabase.from("school_board_results").select("school_id, exam, exam_year, pass_percentage").in("school_id", ids))
      .then(({ data }) => setResultRows((data as ResultRow[]) ?? [])).catch(() => setResultRows([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schools.map((s) => s.id).join(",")]);

  // Latest year's fees per school, keyed by grade label
  const latestFees = (schoolId: string) => {
    const rows = feeRows.filter((r) => r.school_id === schoolId);
    const year = rows.map((r) => r.academic_year).sort().pop();
    return new Map(rows.filter((r) => r.academic_year === year).map((r) => [r.grade_label, r]));
  };
  const gradeLabels = [...new Map(feeRows.map((r) => [r.grade_label, r.sort_order])).entries()]
    .sort((a, b) => a[1] - b[1]).map(([label]) => label);
  const latestResult = (schoolId: string) =>
    resultRows.filter((r) => r.school_id === schoolId && r.pass_percentage != null).sort((a, b) => b.exam_year - a.exam_year)[0];

  // Re-fetch fresh data for each school to get latest ratio/hours/fees from DB
  useEffect(() => {
    if (storedSchools.length === 0) { setSchools([]); return; }
    Promise.all(
      storedSchools.map((s) =>
        fetch(`/api/v1/schools/${s.slug}`)
          .then((r) => r.json())
          .then((json) => {
            if (!json.success) return s;
            const d = json.data;
            const sd = (Array.isArray(d.school_details) ? d.school_details[0] : d.school_details) || {};
            return {
              ...s,
              student_teacher_ratio: sd.student_teacher_ratio ?? s.student_teacher_ratio,
              school_hours_start: sd.school_hours_start ?? s.school_hours_start,
              school_hours_end: sd.school_hours_end ?? s.school_hours_end,
              total_fees_min: sd.total_fees_min ?? s.total_fees_min,
              total_fees_max: sd.total_fees_max ?? s.total_fees_max,
              has_transport: sd.has_transport ?? s.has_transport,
              annual_tuition_fees_min: sd.annual_tuition_fees_min ?? s.annual_tuition_fees_min,
              student_count: sd.student_count ?? s.student_count,
              description: d.description ?? s.description,
              cover_image_url: d.cover_image_url ?? s.cover_image_url,
              phone: d.phone ?? s.phone, email: d.email ?? s.email, website: d.website ?? s.website,
              latitude: d.latitude ?? s.latitude, longitude: d.longitude ?? s.longitude,
              established_year: d.established_year ?? s.established_year,
              verified: d.verified ?? s.verified,
              avg_rating: d.avg_rating ?? s.avg_rating,
              review_count: d.review_count ?? s.review_count,
              curricula: (d.school_curricula || []).map((c: any) => c.curriculum),
              admission_label: admissionLabel(summarizeAdmissions(d.admission_windows)),
            } as SchoolSummary;
          })
          .catch(() => s)
      )
    ).then(setSchools);
  }, [storedSchools.length]);

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
                  {home && (
                    <tr>
                      <td className="label-col">Distance from home</td>
                      {schools.map((school) => {
                        if (school.latitude == null || school.longitude == null) return <td key={school.id}>—</td>;
                        const km = haversineKm(home.lat, home.lng, Number(school.latitude), Number(school.longitude));
                        const c = commuteEstimate(km);
                        return <td key={school.id} title="Straight-line distance; drive time is a rough range for city traffic">{km.toFixed(1)} km · ~{c.min}–{c.max} min</td>;
                      })}
                      {schools.length < 4 && <td />}
                    </tr>
                  )}
                  <tr>
                    <td className="label-col">Latest board result</td>
                    {schools.map((school) => {
                      const r = latestResult(school.id);
                      return <td key={school.id}>{r ? `${r.pass_percentage}% pass · ${r.exam} ${r.exam_year}` : "Not published"}</td>;
                    })}
                    {schools.length < 4 && <td />}
                  </tr>
                  {gradeLabels.length > 0 && (
                    <>
                      <tr><td className="label-col" colSpan={schools.length + 2} style={{ background: "var(--beige-300)", fontWeight: 800, textTransform: "uppercase", fontSize: 11, letterSpacing: "0.06em" }}>Annual tuition by grade</td></tr>
                      {gradeLabels.map((g) => (
                        <tr key={g}>
                          <td className="label-col">{g}</td>
                          {schools.map((school) => <td key={school.id}>{rupees(latestFees(school.id).get(g)?.tuition_fee ?? null)}</td>)}
                          {schools.length < 4 && <td />}
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
              {gradeLabels.length === 0 && (
                <p style={{ fontSize: 12, color: "var(--muted)", padding: "10px 4px" }}>
                  Fees by grade appear here when the schools have published them. Until then, ask each school for its fee schedule — see <Link href="/blog/how-to-read-school-fee-structure" style={{ textDecoration: "underline" }}>how to read a fee structure</Link>.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
