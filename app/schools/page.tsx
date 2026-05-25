"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, SlidersHorizontal, ChevronRight, MapPin, ArrowLeft, Map as MapIcon } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { FilterPanel, MobileFilterButton, MobileFilterSheet } from "@/components/schools/FilterPanel";
import { SchoolCard } from "@/components/schools/SchoolCard";
import { CompareTray } from "@/components/schools/CompareTray";
import { SchoolsMapWrapper } from "@/components/map/SchoolsMapWrapper";
import { useFilterStore } from "@/store/filterStore";
import { useCityStore, CITY_LABELS, CITY_DB_NAMES, type CityKey } from "@/store/cityStore";
import { useSavedPrefsStore } from "@/store/savedPrefsStore";
import type { SchoolFilters, SchoolSummary } from "@/lib/types";

const CITY_DESCRIPTIONS: Record<CityKey, string> = {
  bangalore: "India's tech capital · over 350 schools",
  delhi:     "The national capital · over 50 schools",
  chennai:   "Gateway to the South · coming soon",
  pune:      "Oxford of the East · coming soon",
  mumbai:    "City of dreams · coming soon",
  kolkata:   "City of joy · coming soon",
};

function buildQuery(
  filters: ReturnType<typeof useFilterStore.getState>["filters"],
  sort: string,
  cityDbName: string,
) {
  const p = new URLSearchParams();
  if (cityDbName) p.set("city", cityDbName);
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

// ── City Picker Panel ──────────────────────────────────────────────
const CITY_KEYS: CityKey[] = ["bangalore", "delhi", "chennai", "pune", "mumbai", "kolkata"];

function CityPanel({
  open,
  onClose,
  selected,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  selected: CityKey | null;
  onSelect: (c: CityKey) => void;
}) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Slide-in panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 1001,
        width: 320, maxWidth: "90vw",
        background: "var(--beige-100)",
        boxShadow: "-4px 0 32px rgba(0,0,0,0.12)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--beige-400)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 3 }}>
              Choose City
            </p>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--dark)" }}>
              Where are you looking?
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 99,
              background: "var(--beige-300)", border: "none",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={15} color="var(--muted)" />
          </button>
        </div>

        {/* City list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>
          {CITY_KEYS.map((key) => {
            const isSelected = selected === key;
            const isAvailable = key === "bangalore" || key === "delhi";
            return (
              <button
                key={key}
                onClick={() => { if (isAvailable) { onSelect(key); onClose(); } }}
                disabled={!isAvailable}
                style={{
                  width: "100%", textAlign: "left",
                  padding: "14px 16px", marginBottom: 8,
                  borderRadius: 12,
                  border: isSelected ? "2px solid var(--dark)" : "1.5px solid var(--beige-400)",
                  background: isSelected ? "var(--dark)" : isAvailable ? "var(--beige-200)" : "var(--beige-100)",
                  cursor: isAvailable ? "pointer" : "default",
                  opacity: isAvailable ? 1 : 0.45,
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <MapPin size={14} color={isSelected ? "white" : "var(--muted)"} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: isSelected ? "white" : "var(--dark)", marginBottom: 1 }}>
                      {CITY_LABELS[key]}
                    </p>
                    <p style={{ fontSize: 11, color: isSelected ? "rgba(255,255,255,0.7)" : "var(--muted)" }}>
                      {CITY_DESCRIPTIONS[key]}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* All cities option */}
        {selected && (
          <div style={{ padding: "12px 12px", borderTop: "1px solid var(--beige-400)" }}>
            <button
              onClick={() => { onSelect(null as any); onClose(); }}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                border: "1.5px solid var(--beige-400)", background: "var(--beige-200)",
                cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--muted)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <ArrowLeft size={13} /> Show all cities
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
export default function SchoolsPage() {
  const { filters, sort, setFilter } = useFilterStore();
  const { selectedCity, setCity, clearCity } = useCityStore();
  const { isSaved, savedCity, savedFilters } = useSavedPrefsStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [schools, setSchools] = useState<SchoolSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false); // lazy — user taps to load
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [cityPanelOpen, setCityPanelOpen] = useState(false);

  // ── First-session init ───────────────────────────────────────
  // Fires ONCE per page load (sessionStorage clears on Ctrl+R).
  // If the user has saved prefs, restore city + filters; otherwise start at All Cities.
  useEffect(() => {
    const SESSION_KEY = "sf_session_init";
    if (typeof window === "undefined" || sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");

    if (isSaved && savedCity) {
      setCity(savedCity);
      if (savedFilters) {
        (Object.keys(savedFilters) as (keyof SchoolFilters)[]).forEach((k) =>
          setFilter(k, savedFilters[k] as any)
        );
      }
    }
    // If not saved → city stays null (All Cities) and filters stay default
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Show map by default on desktop only (avoids hydration mismatch)
  useEffect(() => {
    if (window.innerWidth >= 1024) setShowMap(true);
  }, []);

  const cityDbName = selectedCity ? CITY_DB_NAMES[selectedCity] : "";
  const cityLabel = selectedCity ? CITY_LABELS[selectedCity] : "All Cities";

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/schools?${buildQuery(filters, sort, cityDbName)}`);
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
  }, [filters, sort, cityDbName]);

  useEffect(() => {
    const t = setTimeout(fetchSchools, 300);
    return () => clearTimeout(t);
  }, [fetchSchools]);

  const noCity = !selectedCity;

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
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>

                {/* Go back button — desktop only (mobile uses bottom bar) */}
                {selectedCity && (
                  <button
                    className="desktop-only"
                    onClick={clearCity}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                      border: "1.5px solid var(--beige-500)", color: "var(--muted)",
                      background: "var(--beige-200)", cursor: "pointer", whiteSpace: "nowrap",
                    }}
                  >
                    <ArrowLeft size={13} /> All Cities
                  </button>
                )}

                <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
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

                {/* Choose Cities button — desktop only */}
                <button
                  className="desktop-only"
                  onClick={() => setCityPanelOpen(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    border: "1.5px solid var(--beige-500)",
                    color: selectedCity ? "var(--dark)" : "var(--muted)",
                    background: selectedCity ? "var(--beige-300)" : "var(--beige-200)",
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  <MapPin size={13} />
                  {cityLabel}
                  <ChevronRight size={12} />
                </button>

                {/* Map toggle — desktop only */}
                <button className="btn-toggle-map desktop-only" onClick={() => setShowMap(!showMap)}>
                  {showMap ? "Hide Map" : "Show Map"}
                </button>
              </div>

              <style>{`
                .mob-filter-btn { display: none; }
                @media (max-width: 1024px) { .mob-filter-btn { display: block; } }
              `}</style>

              {/* Map — dimmed when no city selected */}
              {showMap && (
                <div className="map-box" style={{ position: "relative" }}>
                  <SchoolsMapWrapper schools={noCity ? [] : schools} />
                  {noCity && (
                    <div
                      onClick={() => setCityPanelOpen(true)}
                      style={{
                        position: "absolute", inset: 0, borderRadius: "inherit",
                        background: "rgba(245,240,235,0.82)", backdropFilter: "blur(3px)",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        cursor: "pointer", gap: 8,
                      }}
                    >
                      <MapPin size={28} color="var(--muted)" />
                      <p style={{ fontWeight: 700, color: "var(--dark)", fontSize: 15 }}>
                        Select a city to explore the map
                      </p>
                      <p style={{ fontSize: 12, color: "var(--muted)" }}>Tap to choose</p>
                    </div>
                  )}
                </div>
              )}

              {/* Explore header */}
              <div className="explore-header">
                <div>
                  <h2>Explore {cityLabel}</h2>
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

      {/* ── Mobile thumb-zone bottom action bar ── */}
      <div className="mob-action-bar">
        <button
          className={`mob-action-btn${mobileFilterOpen ? " active" : ""}`}
          onClick={() => setMobileFilterOpen(true)}
        >
          <SlidersHorizontal size={20} />
          Filters
        </button>
        <button
          className={`mob-action-btn${showMap ? " active" : ""}`}
          onClick={() => setShowMap((v) => !v)}
        >
          <MapIcon size={20} />
          {showMap ? "Hide Map" : "Map"}
        </button>
        <button
          className={`mob-action-btn${selectedCity ? " city-active" : ""}${cityPanelOpen ? " active" : ""}`}
          onClick={() => setCityPanelOpen(true)}
        >
          <MapPin size={20} />
          {selectedCity ? CITY_LABELS[selectedCity] : "City"}
        </button>
        {selectedCity && (
          <button
            className="mob-action-btn"
            onClick={clearCity}
          >
            <ArrowLeft size={20} />
            All Cities
          </button>
        )}
      </div>

      {/* City picker panel */}
      <CityPanel
        open={cityPanelOpen}
        onClose={() => setCityPanelOpen(false)}
        selected={selectedCity}
        onSelect={(c) => { if (c === null) clearCity(); else setCity(c); }}
      />
    </>
  );
}
