"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { FilterPanel, MobileFilterButton, MobileFilterSheet } from "@/components/schools/FilterPanel";
import { SchoolCard } from "@/components/schools/SchoolCard";
import { CompareTray } from "@/components/schools/CompareTray";
import { SchoolsMapWrapper } from "@/components/map/SchoolsMapWrapper";
import { useFilterStore } from "@/store/filterStore";
import type { SchoolSummary } from "@/lib/types";

function buildQuery(filters: ReturnType<typeof useFilterStore.getState>["filters"], sort: string) {
  const p = new URLSearchParams();
  if (filters.query) p.set("q", filters.query);
  filters.areas.forEach((a) => p.append("area", a));
  filters.curricula.forEach((c) => p.append("curriculum", c));
  filters.types.forEach((t) => p.append("type", t));
  filters.gender.forEach((g) => p.append("gender", g));
  filters.grades.forEach((g) => p.append("grade", g));
  filters.sports.forEach((s) => p.append("sport", s));
  filters.extracurriculars.forEach((e) => p.append("extracurricular", e));
  filters.languages.forEach((l) => p.append("language", l));
  if (filters.fees_min > 0) p.set("fees_min", String(filters.fees_min));
  if (filters.fees_max < 1000000) p.set("fees_max", String(filters.fees_max));
  if (filters.has_transport) p.set("has_transport", "true");
  if (filters.admissions_open) p.set("admissions_open", "true");
  if (filters.mid_year) p.set("mid_year", "true");
  p.set("sort", sort);
  return p.toString();
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skel h10" style={{ width: "40%", marginBottom: 10, height: 12 }} />
      <div className="skel h20" style={{ width: "80%", marginBottom: 8, height: 18 }} />
      <div className="skel" style={{ width: "55%", marginBottom: 12 }} />
      <div className="skel" style={{ width: "65%", marginBottom: 16 }} />
      <div className="skel" style={{ height: 36, borderRadius: 10 }} />
    </div>
  );
}

export default function SchoolsPage() {
  const { filters, sort, setFilter } = useFilterStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [schools, setSchools] = useState<SchoolSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/schools?${buildQuery(filters, sort)}`);
      const json = await res.json();
      if (json.success) {
        setSchools(json.data);
        setTotalCount(json.pagination.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    const t = setTimeout(fetchSchools, 300);
    return () => clearTimeout(t);
  }, [fetchSchools]);

  return (
    <>
      <Header />

      <div className="page">
        <div className="page-inner">
          <div className="layout-split">

            {/* ── Left Sidebar ── */}
            <aside className="sidebar">
              <div className="sidebar-box">
                <div className="sidebar-header">
                  <SlidersHorizontal size={14} color="#7a6a5a" />
                  Filters
                </div>
                <FilterPanel />
              </div>
            </aside>

            {/* ── Right Content ── */}
            <div className="content-area">

              {/* Welcome */}
              <div className="welcome-box">
                <p className="label">Welcome</p>
                <h1>Do you want to find the right school for your child?</h1>
                <p>Use the filters on the left to narrow down by curriculum, fees, area, and more.</p>
              </div>

              {/* Search row */}
              <div className="search-row">
                {/* Mobile filter button — hidden on desktop, shown on mobile via CSS */}
                <div className="mobile-filter-trigger">
                  <MobileFilterButton onOpen={() => setMobileFilterOpen(true)} />
                </div>

                <div className="search-wrap">
                  <Search size={16} />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by school name, area or curriculum…"
                    value={filters.query}
                    onChange={(e) => setFilter("query", e.target.value)}
                  />
                  {filters.query && (
                    <button className="search-clear" onClick={() => setFilter("query", "")}>
                      <X size={15} />
                    </button>
                  )}
                </div>

                <button className="btn-toggle-map" onClick={() => setShowMap(!showMap)}>
                  {showMap ? "Hide Map" : "Show Map"}
                </button>
              </div>

              {/* Map */}
              {showMap && (
                <div className="map-box">
                  <SchoolsMapWrapper schools={schools} />
                </div>
              )}

              {/* Explore header */}
              <div className="explore-header">
                <div>
                  <h2>Explore Bangalore</h2>
                  <p>
                    {loading
                      ? "Loading schools…"
                      : `${totalCount} school${totalCount !== 1 ? "s" : ""} found`}
                  </p>
                </div>
                <div className="view-toggle">
                  <button
                    className={`view-btn${viewMode === "grid" ? " active" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >
                    Grid View
                  </button>
                  <button
                    className={`view-btn${viewMode === "list" ? " active" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    Compare Data
                  </button>
                </div>
              </div>

              {/* Results */}
              {loading ? (
                <div className="school-grid">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : schools.length === 0 ? (
                <div style={{
                  background: "var(--beige-200)", border: "1px solid var(--beige-500)",
                  borderRadius: "var(--radius)", padding: "60px 24px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🏫</div>
                  <p style={{ fontWeight: 700, color: "var(--dark)", marginBottom: 6 }}>No schools found</p>
                  <p style={{ color: "var(--muted)", fontSize: 13 }}>Try adjusting your filters</p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="school-grid">
                  {schools.map((school) => (
                    <SchoolCard key={school.id} school={school} />
                  ))}
                </div>
              ) : (
                /* Compare Data table */
                <div style={{
                  overflowX: "auto", borderRadius: "var(--radius)",
                  border: "1px solid var(--beige-500)", paddingBottom: 80
                }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--beige-200)" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--beige-500)" }}>
                        <td style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", width: 130 }}>
                          Attribute
                        </td>
                        {schools.slice(0, 6).map((s) => (
                          <td key={s.id} style={{ padding: "12px 16px", fontWeight: 700, color: "var(--dark)", minWidth: 160 }}>
                            {s.name}
                          </td>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Area", fn: (s: SchoolSummary) => s.area || s.city },
                        { label: "Curriculum", fn: (s: SchoolSummary) => s.curricula?.map(c => c.toUpperCase()).join(", ") || "—" },
                        { label: "Annual Fees", fn: (s: SchoolSummary) => s.total_fees_min ? `₹${(s.total_fees_min / 100000).toFixed(1)}L – ₹${(s.total_fees_max! / 100000).toFixed(1)}L` : "—" },
                        { label: "Rating", fn: (s: SchoolSummary) => s.avg_rating ? `⭐ ${s.avg_rating}` : "—" },
                        { label: "Gender", fn: (s: SchoolSummary) => s.gender === "coed" ? "Co-ed" : s.gender === "boys" ? "Boys" : "Girls" },
                        { label: "Transport", fn: (s: SchoolSummary) => s.has_transport ? "✓ Yes" : "—" },
                      ].map((row, i) => (
                        <tr key={row.label} style={{ borderBottom: "1px solid var(--beige-500)", background: i % 2 === 1 ? "rgba(0,0,0,0.02)" : "transparent" }}>
                          <td style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", background: "var(--beige-300)" }}>
                            {row.label}
                          </td>
                          {schools.slice(0, 6).map((s) => (
                            <td key={s.id} style={{ padding: "12px 16px", fontSize: 13, color: "var(--dark)" }}>
                              {row.fn(s)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MobileFilterSheet open={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)} />
      <CompareTray />
    </>
  );
}
