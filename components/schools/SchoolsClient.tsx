"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, SlidersHorizontal, ChevronRight, MapPin, ArrowLeft, Map as MapIcon } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { FilterPanel, MobileFilterSheet } from "@/components/schools/FilterPanel";
import { SchoolCard } from "@/components/schools/SchoolCard";
import { CompareTray } from "@/components/schools/CompareTray";
import { SchoolsMapWrapper } from "@/components/map/SchoolsMapWrapper";
import { useFilterStore } from "@/store/filterStore";
import { useCityStore, CITY_LABELS, CITY_DB_NAMES, type CityKey } from "@/store/cityStore";
import { useSavedPrefsStore } from "@/store/savedPrefsStore";
import type { SchoolFilters, SchoolSummary } from "@/lib/types";

interface SchoolsClientProps {
  /** Server-rendered initial list — shown immediately to bots & first paint */
  initialSchools?: SchoolSummary[];
  initialTotal?: number;
}

const CITY_DESCRIPTIONS: Record<CityKey, string> = {
  bangalore: "India's tech capital · 350+ schools",
  delhi:     "The national capital · 50+ schools",
  chennai:   "Gateway to the South · 50+ schools",
  mumbai:    "India's financial hub · 50+ schools",
  pune:      "Oxford of the East · coming soon",
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

const CITY_KEYS: CityKey[] = ["bangalore", "delhi", "chennai", "pune", "mumbai", "kolkata"];

function CityPanel({
  open, onClose, selected, onSelect,
}: {
  open: boolean; onClose: () => void; selected: CityKey | null; onSelect: (c: CityKey) => void;
}) {
  return (
    <>
      {open && (
        <div onClick={onClose} style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)",
        }} />
      )}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 1001,
        width: 320, maxWidth: "90vw",
        background: "var(--beige-100)",
        boxShadow: "-4px 0 32px rgba(0,0,0,0.12)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          padding: "20px 20px 16px", borderBottom: "1px solid var(--beige-400)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 3 }}>
              Choose City
            </p>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--dark)" }}>Where are you looking?</h3>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 99, background: "var(--beige-300)",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={15} color="var(--muted)" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>
          {CITY_KEYS.map((key) => {
            const isSelected  = selected === key;
            const isAvailable = ["bangalore", "delhi", "chennai", "mumbai"].includes(key);
            const isComingSoon = !isAvailable;
            return (
              <button
                key={key}
                onClick={() => { if (isAvailable) { onSelect(key); onClose(); } }}
                disabled={isComingSoon}
                style={{
                  width: "100%", textAlign: "left", padding: "14px 16px", marginBottom: 8, borderRadius: 12,
                  border: isSelected ? "2px solid var(--dark)" : isComingSoon ? "1.5px solid var(--beige-500)" : "1.5px solid var(--beige-400)",
                  background: isSelected ? "var(--dark)" : isComingSoon ? "var(--beige-300)" : "var(--beige-200)",
                  cursor: isAvailable ? "pointer" : "default",
                  opacity: isComingSoon ? 0.72 : 1, transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <MapPin size={14} color={isSelected ? "white" : isComingSoon ? "var(--beige-600)" : "var(--muted)"} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 1, color: isSelected ? "white" : isComingSoon ? "var(--muted)" : "var(--dark)" }}>
                      {CITY_LABELS[key]}
                    </p>
                    <p style={{ fontSize: 11, color: isSelected ? "rgba(255,255,255,0.7)" : isComingSoon ? "var(--beige-600)" : "var(--muted)" }}>
                      {CITY_DESCRIPTIONS[key]}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
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

// ── Main Client Component ─────────────────────────────────────────────────────
export function SchoolsClient({ initialSchools = [], initialTotal = 0 }: SchoolsClientProps) {
  const { filters, sort, setFilter } = useFilterStore();
  const { selectedCity, setCity, clearCity } = useCityStore();
  const { isSaved, savedCity, savedFilters } = useSavedPrefsStore();

  const [schools, setSchools]             = useState<SchoolSummary[]>(initialSchools);
  const [totalCount, setTotalCount]       = useState(initialTotal);
  // If SSR gave us data, don't show skeleton on first paint
  const [loading, setLoading]             = useState(initialSchools.length === 0);
  const [showMap, setShowMap]             = useState(false);
  const [mobileView, setMobileView]       = useState<"list" | "map">("list");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [cityPanelOpen, setCityPanelOpen] = useState(false);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const [suggestions, setSuggestions]     = useState<SchoolSummary[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [softMatches, setSoftMatches]     = useState<SchoolSummary[]>([]);
  // Track whether any client-side filter has been applied (if so, replace SSR data)
  const [clientFiltered, setClientFiltered] = useState(false);

  // First-session init
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
  }, []); // eslint-disable-line

  // Show map by default on desktop
  useEffect(() => {
    if (window.innerWidth >= 1024) setShowMap(true);
  }, []);

  const handleSchoolClick = useCallback((slug: string) => {
    setHighlightedSlug(slug);
    setMobileView("list");
    setTimeout(() => {
      const el = document.getElementById(`card-${slug}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setHighlightedSlug(null), 2000);
    }, 120);
  }, []);

  const cityDbName = selectedCity ? CITY_DB_NAMES[selectedCity] : "";
  const cityLabel  = selectedCity ? CITY_LABELS[selectedCity] : "All Cities";

  const fetchSchools = useCallback(async () => {
    setClientFiltered(true);
    setLoading(true);
    try {
      const res  = await fetch(`/api/v1/schools?${buildQuery(filters, sort, cityDbName)}`);
      const json = await res.json();
      if (json.success) { setSchools(json.data); setTotalCount(json.pagination.total); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters, sort, cityDbName]);

  // Only re-fetch when filters actually change (not on first SSR render)
  useEffect(() => {
    const t = setTimeout(fetchSchools, 300);
    return () => clearTimeout(t);
  }, [fetchSchools]);

  // Autocomplete suggestions
  useEffect(() => {
    const q = filters.query.trim();
    if (q.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    const t = setTimeout(async () => {
      try {
        const cityParam = cityDbName ? `&city=${encodeURIComponent(cityDbName)}` : "";
        const res  = await fetch(`/api/v1/schools?q=${encodeURIComponent(q)}&limit=6${cityParam}`);
        const json = await res.json();
        if (json.success) { setSuggestions(json.data || []); setShowSuggestions(true); }
      } catch {/* silent */}
    }, 150);
    return () => clearTimeout(t);
  }, [filters.query, cityDbName]);

  // Soft-match fallback
  useEffect(() => {
    const hasActiveFilters = filters.query.trim().length > 0 || filters.areas.length > 0 || filters.curricula.length > 0 || filters.fees_max < 1000000;
    if (loading || schools.length > 0 || !hasActiveFilters) { setSoftMatches([]); return; }
    (async () => {
      try {
        const cityParam = cityDbName ? `&city=${encodeURIComponent(cityDbName)}` : "";
        const res  = await fetch(`/api/v1/schools?limit=3${cityParam}`);
        const json = await res.json();
        setSoftMatches(json.success ? (json.data || []) : []);
      } catch {/* silent */}
    })();
  }, [loading, schools.length, filters.query, filters.areas, filters.curricula, filters.fees_max, cityDbName]);

  // Dynamic board label for H1
  const boardLabelMap: Record<string, string> = { cbse: "CBSE", icse: "ICSE", ib: "IB", igcse: "IGCSE", state_board: "State Board", cambridge: "Cambridge" };
  const activeCurricula = filters.curricula;
  const boardLabel = activeCurricula.length === 1 ? (boardLabelMap[activeCurricula[0]] ?? activeCurricula[0].toUpperCase())
    : activeCurricula.length > 1 ? activeCurricula.map(c => c.toUpperCase()).join(", ") : null;

  const h1 = selectedCity
    ? boardLabel ? `Best ${boardLabel} Schools in ${cityLabel}` : `Schools in ${cityLabel}`
    : boardLabel ? `Best ${boardLabel} Schools in India`
    : "Finding the right school is one of the most important decisions you'll make.";

  const introText = selectedCity
    ? boardLabel
      ? `Explore verified ${boardLabel} schools in ${cityLabel} — compare ${new Date().getFullYear()} fees, admissions status, and real parent reviews. Updated weekly.`
      : `There are ${totalCount > 0 ? `${totalCount}+` : "hundreds of"} schools across ${cityLabel} spanning CBSE, ICSE, IB, and more. Use the filters to narrow by area, fees, gender, and curriculum.`
    : "Start by choosing a city, or search by school name, area, or curriculum. Use the filters to narrow down what matters most to your family.";

  const exploreH2 = activeCurricula.length === 1
    ? `${boardLabelMap[activeCurricula[0]] ?? activeCurricula[0].toUpperCase()} Schools`
    : selectedCity ? `Schools in ${cityLabel}` : "All Schools";

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

              {/* Dynamic SEO intro */}
              <div className="welcome-box">
                <p className="label">School Discovery</p>
                <h1>{h1}</h1>
                <p>{introText}</p>
              </div>

              {/* Search row */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {selectedCity && (
                  <button className="desktop-only" onClick={clearCity} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    border: "1.5px solid var(--beige-500)", color: "var(--muted)",
                    background: "var(--beige-200)", cursor: "pointer", whiteSpace: "nowrap",
                  }}>
                    <ArrowLeft size={13} /> All Cities
                  </button>
                )}

                <div className="search-wrap" style={{ minWidth: 200 }}
                  onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setShowSuggestions(false); }}
                >
                  <Search size={16} />
                  <input
                    type="text" className="search-input"
                    placeholder="Search school name, area or curriculum…"
                    value={filters.query} autoComplete="off"
                    onChange={(e) => { setFilter("query", e.target.value); if (!e.target.value) setShowSuggestions(false); }}
                    onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                  />
                  {filters.query && (
                    <button className="search-clear"
                      onMouseDown={(e) => { e.preventDefault(); setFilter("query", ""); setSuggestions([]); setShowSuggestions(false); }}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                      {suggestions.map((s) => (
                        <button key={s.id} className="suggestion-item"
                          onMouseDown={(e) => { e.preventDefault(); setFilter("query", s.name); setShowSuggestions(false); }}
                        >
                          <span className="suggestion-name">{s.name}</span>
                          <span className="suggestion-meta">
                            {[s.area, s.city].filter(Boolean).join(", ")}
                            {s.curricula?.length ? ` · ${s.curricula.map(c => c.toUpperCase()).join(", ")}` : ""}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button className="desktop-only" onClick={() => setCityPanelOpen(true)} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                  border: "1.5px solid var(--beige-500)",
                  color: selectedCity ? "var(--dark)" : "var(--muted)",
                  background: selectedCity ? "var(--beige-300)" : "var(--beige-200)",
                  cursor: "pointer", whiteSpace: "nowrap",
                }}>
                  <MapPin size={13} />
                  {cityLabel}
                  <ChevronRight size={12} />
                </button>

                <button className="btn-toggle-map desktop-only" onClick={() => setShowMap(!showMap)}>
                  {showMap ? "Hide Map" : "Show Map"}
                </button>
              </div>

              <style>{`
                .mob-filter-btn { display: none; }
                @media (max-width: 1024px) { .mob-filter-btn { display: block; } }
              `}</style>

              {showMap && (
                <div className="map-box desktop-only" style={{ position: "relative" }}>
                  <SchoolsMapWrapper schools={noCity ? [] : schools} onSchoolClick={handleSchoolClick} />
                  {noCity && (
                    <div onClick={() => setCityPanelOpen(true)} style={{
                      position: "absolute", inset: 0, borderRadius: "inherit",
                      background: "rgba(245,240,235,0.82)", backdropFilter: "blur(3px)",
                      display: "flex", flexDirection: "column", alignItems: "center",
                      justifyContent: "center", cursor: "pointer", gap: 8,
                    }}>
                      <MapPin size={28} color="var(--muted)" />
                      <p style={{ fontWeight: 700, color: "var(--dark)", fontSize: 15 }}>Select a city to explore the map</p>
                      <p style={{ fontSize: 12, color: "var(--muted)" }}>Tap to choose</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mob-map-fullscreen">
                {mobileView === "map" && (
                  <div style={{ position: "relative", height: "100%" }}>
                    <SchoolsMapWrapper schools={noCity ? [] : schools} onSchoolClick={handleSchoolClick} />
                    {noCity && (
                      <div onClick={() => setCityPanelOpen(true)} style={{
                        position: "absolute", inset: 0, background: "rgba(245,240,235,0.82)",
                        backdropFilter: "blur(3px)", display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
                      }}>
                        <MapPin size={28} color="var(--muted)" />
                        <p style={{ fontWeight: 700, color: "var(--dark)", fontSize: 15 }}>Select a city</p>
                        <p style={{ fontSize: 12, color: "var(--muted)" }}>Tap to choose</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className={mobileView === "map" ? "mob-hide" : ""}>

                {/* Explore header */}
                <div className="explore-header">
                  <div>
                    <h2>{exploreH2}</h2>
                    <p>
                      {loading ? "Finding schools for you…"
                        : totalCount === 0 ? "No schools match — try adjusting your filters"
                        : `${totalCount} school${totalCount !== 1 ? "s" : ""} listed · updated weekly`}
                    </p>
                  </div>
                  <div className="view-toggle">
                    <button className={`view-btn${false ? " active" : " active"}`} style={{ display: "none" }} />
                    <button className="view-btn active" style={{ pointerEvents: "none" }}>Grid View</button>
                    <button className="view-btn" onClick={() => window.location.href = "/compare"}>Compare Data</button>
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
                    borderRadius: "var(--radius)", padding: "40px 24px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
                    <p style={{ fontWeight: 700, color: "var(--dark)", marginBottom: 6, fontSize: 16 }}>
                      No schools matched those filters
                    </p>
                    <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: filters.query ? 20 : 0 }}>
                      {filters.query
                        ? `We couldn't find "${filters.query}" with your current filters. Try a nearby area, or browse all schools.`
                        : "Try removing a filter or broadening your search — we're adding schools every week."}
                    </p>
                    {softMatches.length > 0 && (
                      <div style={{ textAlign: "left", marginTop: 20 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--dark)", marginBottom: 12 }}>
                          Other schools families in this area explore:
                        </p>
                        <div className="school-grid" style={{ marginTop: 0 }}>
                          {softMatches.map((s) => (
                            <SchoolCard key={s.id} school={s} highlighted={highlightedSlug === s.slug} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="school-grid">
                    {schools.map((school) => (
                      <SchoolCard key={school.id} school={school} highlighted={highlightedSlug === school.slug} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileFilterSheet open={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)} />
      <CompareTray />

      {/* Mobile bottom action bar */}
      <div className="mob-action-bar">
        <button className={`mob-action-btn${mobileFilterOpen ? " active" : ""}`} onClick={() => setMobileFilterOpen(true)}>
          <SlidersHorizontal size={20} /> Filters
        </button>
        <button className={`mob-view-toggle${mobileView === "map" ? " map-active" : ""}`}
          onClick={() => setMobileView(v => v === "list" ? "map" : "list")}
        >
          {mobileView === "map" ? <><SlidersHorizontal size={18} /> List View</> : <><MapIcon size={18} /> Map View</>}
        </button>
        <button className={`mob-action-btn${selectedCity ? " city-active" : ""}${cityPanelOpen ? " active" : ""}`}
          onClick={() => setCityPanelOpen(true)}
        >
          <MapPin size={20} />
          {selectedCity ? CITY_LABELS[selectedCity] : "City"}
        </button>
        {selectedCity && (
          <button className="mob-action-btn" onClick={clearCity}>
            <ArrowLeft size={20} /> All Cities
          </button>
        )}
      </div>

      <CityPanel
        open={cityPanelOpen}
        onClose={() => setCityPanelOpen(false)}
        selected={selectedCity}
        onSelect={(c) => { if (c === null) clearCity(); else setCity(c); }}
      />
    </>
  );
}
