"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Search, X, SlidersHorizontal, ChevronRight, MapPin, ArrowLeft, Map as MapIcon, LocateFixed } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { FilterPanel, MobileFilterSheet } from "@/components/schools/FilterPanel";
import { SchoolCard } from "@/components/schools/SchoolCard";
import { Pagination } from "@/components/schools/Pagination";
import { CompareTray } from "@/components/schools/CompareTray";
import { SchoolsMapWrapper } from "@/components/map/SchoolsMapWrapper";
import { useFilterStore } from "@/store/filterStore";
import { useCityStore, CITY_LABELS, CITY_DB_NAMES, type CityKey } from "@/store/cityStore";
import { useHomeStore } from "@/store/homeStore";
import { formatCount } from "@/lib/format";
import { useSavedPrefsStore } from "@/store/savedPrefsStore";
import { CITIES } from "@/lib/cities";
import { CURRICULUM_LABELS, DEFAULT_FILTERS, type Curriculum, type SchoolFilters, type SchoolSummary, type SortOption } from "@/lib/types";

interface SchoolsClientProps {
  /** Server-rendered initial list — shown immediately to bots & first paint */
  initialSchools?: SchoolSummary[];
  initialTotal?: number;
  /** When true (set by middleware for bot UAs), never initialize the map.
   *  Saves the coordinate JSON payload being sent to crawlers that can't
   *  execute JS anyway — conserves crawl budget and response size. */
  disableMap?: boolean;
  /** City the server rendered `initialSchools` for; used when the visitor hasn't picked one */
  initialCity?: CityKey;
  /** Real listing counts per city (same source as every other number on the site) */
  cityStats?: { key: CityKey; count: number; live: boolean }[];
  totalSchools?: number;
  liveCityNames?: string;
}

const CITY_TAGLINES: Record<CityKey, string> = {
  bangalore: "India's tech capital",
  delhi:     "The national capital",
  chennai:   "Gateway to the South",
  mumbai:    "India's financial hub",
  pune:      "Oxford of the East",
  kolkata:   "City of joy",
};

const SORT_LABELS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Best match" },
  { value: "rating",    label: "Top rated" },
  { value: "fees_asc",  label: "Fees: low to high" },
  { value: "fees_desc", label: "Fees: high to low" },
  { value: "distance",  label: "Nearest to me" },
  { value: "newest",    label: "Recently added" },
];

const PAGE_SIZE = 24;
// Map pins only need a few columns, so one request can carry every match in the city
const MAP_LIMIT = 1000;

function buildQuery(
  filters: ReturnType<typeof useFilterStore.getState>["filters"],
  sort: string,
  cityDbName: string,
  extra: Record<string, string> = {},
  home: { lat: number; lng: number } | null = null,
) {
  const p = new URLSearchParams();
  if (home) { p.set("lat", String(home.lat)); p.set("lng", String(home.lng)); }
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
  Object.entries(extra).forEach(([k, v]) => p.set(k, v));
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
  open, onClose, selected, onSelect, stats,
}: {
  open: boolean; onClose: () => void; selected: CityKey | null; onSelect: (c: CityKey) => void;
  stats: { key: CityKey; count: number; live: boolean }[];
}) {
  const statFor = (key: CityKey) => stats.find((s) => s.key === key);
  const describe = (key: CityKey) => {
    const st = statFor(key);
    return st?.live ? `${CITY_TAGLINES[key]} · ${formatCount(st.count)} schools` : `${CITY_TAGLINES[key]} · coming soon`;
  };
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
            const isAvailable = !!statFor(key)?.live;
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
                      {describe(key)}
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
export function SchoolsClient({
  initialSchools = [], initialTotal = 0, disableMap = false,
  initialCity = "bangalore", cityStats = [], totalSchools = 0, liveCityNames = "",
}: SchoolsClientProps) {
  const { filters, sort, setFilter, setSort } = useFilterStore();
  const { selectedCity: storedCity, setCity, clearCity } = useCityStore();
  const { isSaved, savedCity, savedFilters } = useSavedPrefsStore();
  const { home, setHome, clearHome } = useHomeStore();
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Until the first-visit setup has run, show the city the server rendered — otherwise the
  // page would flash an "All cities" list that mixes Bengaluru, Chennai and Delhi.
  const [ready, setReady] = useState(false);
  const selectedCity: CityKey | null = ready ? storedCity : (storedCity ?? initialCity);

  const [schools, setSchools]             = useState<SchoolSummary[]>(initialSchools);
  const [totalCount, setTotalCount]       = useState(initialTotal);
  const [totalPages, setTotalPages]       = useState(Math.max(1, Math.ceil(initialTotal / PAGE_SIZE)));
  // Every school matching the filters (lightweight), so the map shows all pins, not just this page
  const [mapSchools, setMapSchools]       = useState<SchoolSummary[]>([]);
  // If SSR gave us data, don't show skeleton on first paint
  const [loading, setLoading]             = useState(initialSchools.length === 0);
  // Never show map to bots — they can't execute JS and the payload is wasted bytes
  const [showMap, setShowMap]             = useState(false);
  const [mobileView, setMobileView]       = useState<"list" | "map">("list");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [cityPanelOpen, setCityPanelOpen] = useState(false);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const [suggestions, setSuggestions]     = useState<SchoolSummary[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [softMatches, setSoftMatches]     = useState<SchoolSummary[]>([]);

  // First-session init
  useEffect(() => {
    const SESSION_KEY = "sf_session_init";
    if (typeof window !== "undefined" && !sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, "1");
      if (isSaved && savedCity) {
        setCity(savedCity);
        if (savedFilters) {
          (Object.keys(savedFilters) as (keyof SchoolFilters)[]).forEach((k) =>
            setFilter(k, savedFilters[k] as any)
          );
        }
      } else if (!useCityStore.getState().selectedCity) {
        // First visit this session: start in the visitor's (detected) city, not a mixed list
        setCity(initialCity);
      }
    }
    // Deep links from hub pages and the site search: /schools?city=…&curriculum=…&q=…
    const sp = new URLSearchParams(window.location.search);
    const cityParam = sp.get("city")?.toLowerCase();
    const linkedCity = cityParam ? CITIES.find((c) => c.slug === cityParam || c.key === cityParam || c.dbName.toLowerCase() === cityParam) : undefined;
    if (linkedCity) setCity(linkedCity.key);
    const boardParam = sp.get("curriculum");
    if (boardParam && boardParam in CURRICULUM_LABELS) setFilter("curricula", [boardParam as Curriculum]);
    const q = sp.get("q");
    if (q) setFilter("query", q.slice(0, 100));
    setReady(true);
  }, []); // eslint-disable-line

  // Show map by default on desktop — but never for bots (disableMap flag from middleware)
  useEffect(() => {
    if (!disableMap && window.innerWidth >= 1024) setShowMap(true);
  }, []); // eslint-disable-line

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

  // "Nearest to me" needs a home location; without one it quietly behaves like "Best match"
  const effectiveSort: SortOption = sort === "distance" && !home ? "relevance" : sort;

  // The query the server already rendered (default filters, best match, page 1) — no need to re-fetch it
  const initialKey = useMemo(() => buildQuery(DEFAULT_FILTERS, "relevance", CITY_DB_NAMES[initialCity]), [initialCity]);

  // The page number only means something for one particular set of filters — when the
  // filters, sort or city change we fall back to page 1 without needing an effect.
  const filterKey = buildQuery(filters, effectiveSort, cityDbName, {}, home);
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const page = pageState.key === filterKey ? pageState.page : 1;

  const goToPage = useCallback((next: number) => {
    setPageState({ key: filterKey, page: next });
    // Land back on the first card of the new page rather than mid-grid
    document.getElementById("results-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [filterKey]);

  // Once the visitor changes anything, the server-rendered list is no longer the right one
  const hasFetched = useRef(false);

  const fetchSchools = useCallback(async () => {
    hasFetched.current = true;
    setLoading(true);
    try {
      const res  = await fetch(`/api/v1/schools?${buildQuery(filters, effectiveSort, cityDbName, { page: String(page), limit: String(PAGE_SIZE) }, home)}`);
      const json = await res.json();
      if (json.success) {
        setSchools(json.data);
        setTotalCount(json.pagination.total);
        setTotalPages(Math.max(1, json.pagination.pages));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters, effectiveSort, cityDbName, page, home]);

  // Only re-fetch when filters actually change — the first paint is already the server's list
  useEffect(() => {
    if (!ready) return;
    if (!hasFetched.current && filterKey === initialKey && page === 1 && initialSchools.length > 0) return;
    const t = setTimeout(fetchSchools, 300);
    return () => clearTimeout(t);
  }, [fetchSchools, ready, filterKey, initialKey, page, initialSchools.length]);

  // Map pins for the whole result set (not just the visible page). Skipped while no
  // city is chosen — the map is covered by the "select a city" overlay then anyway.
  const mapVisible = showMap || mobileView === "map";
  useEffect(() => {
    if (!mapVisible || !selectedCity) { setMapSchools([]); return; }
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/v1/schools?${buildQuery(filters, effectiveSort === "distance" ? "relevance" : effectiveSort, cityDbName, { lean: "1", limit: String(MAP_LIMIT) })}`);
        const json = await res.json();
        if (!cancelled && json.success) setMapSchools(json.data);
      } catch {/* silent — map just keeps its previous pins */}
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [mapVisible, selectedCity, filters, effectiveSort, cityDbName]);

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
    : totalSchools > 0 ? `Compare ${formatCount(totalSchools)} schools in ${liveCityNames}` : "Find and compare schools across India";

  const introText = selectedCity
    ? boardLabel
      ? `Explore ${boardLabel} schools in ${cityLabel} — compare ${new Date().getFullYear()} fees, admissions status, and real parent reviews.`
      : `There are ${totalCount > 0 ? formatCount(totalCount) : "hundreds of"} schools listed in ${cityLabel} spanning CBSE, ICSE, IB, and more. Use the filters to narrow by area, fees, gender, and curriculum.`
    : "Search by school name, area or curriculum, or choose a city. Use the filters to narrow down what matters most to your family.";

  const exploreH2 = activeCurricula.length === 1
    ? `${boardLabelMap[activeCurricula[0]] ?? activeCurricula[0].toUpperCase()} Schools`
    : selectedCity ? `Schools in ${cityLabel}` : "All Schools";

  const noCity = !selectedCity;

  const controlStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "8px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600,
    border: "1.5px solid var(--beige-500)", background: "var(--beige-200)",
    color: "var(--dark)", cursor: "pointer", fontFamily: "inherit",
  };

  // Browser location is approximate on purpose (rounded to ~1 km) and never leaves this device except as a search parameter
  const requestLocation = (thenSortByDistance: boolean) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationError("Your browser can't share its location.");
      return;
    }
    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHome(pos.coords.latitude, pos.coords.longitude);
        if (thenSortByDistance) setSort("distance");
        setLocating(false);
      },
      () => {
        setLocationError("We couldn't get your location. Allow location access in your browser and try again.");
        setLocating(false);
      },
      { timeout: 10000, maximumAge: 600000 }
    );
  };

  const handleSortChange = (value: SortOption) => {
    if (value === "distance" && !home) requestLocation(true);
    else setSort(value);
  };

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
                  <SchoolsMapWrapper schools={noCity ? [] : mapSchools} listedSlugs={schools.map((s) => s.slug)} onSchoolClick={handleSchoolClick} />
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
                    <SchoolsMapWrapper schools={noCity ? [] : mapSchools} listedSlugs={schools.map((s) => s.slug)} onSchoolClick={handleSchoolClick} />
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
                <div id="results-top" className="explore-header" style={{ scrollMarginTop: 72 }}>
                  <div>
                    <h2>{exploreH2}</h2>
                    <p>
                      {loading ? "Finding schools for you…"
                        : totalCount === 0 ? "No schools match — try adjusting your filters"
                        : totalPages > 1
                          ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${(page - 1) * PAGE_SIZE + schools.length} of ${formatCount(totalCount)} schools`
                          : `${formatCount(totalCount)} school${totalCount !== 1 ? "s" : ""} listed`}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <label htmlFor="sort-select" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Sort schools by</label>
                    <select
                      id="sort-select"
                      value={effectiveSort}
                      onChange={(e) => handleSortChange(e.target.value as SortOption)}
                      style={controlStyle}
                    >
                      {SORT_LABELS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    {home ? (
                      <button onClick={() => { clearHome(); if (sort === "distance") setSort("relevance"); }} style={controlStyle} title="Distances are measured in a straight line from your approximate location, which stays in this browser">
                        <LocateFixed size={13} /> Home set · Clear
                      </button>
                    ) : (
                      <button onClick={() => requestLocation(false)} disabled={locating} style={controlStyle}>
                        <LocateFixed size={13} /> {locating ? "Locating…" : "Distance from home"}
                      </button>
                    )}
                    <button style={controlStyle} onClick={() => { window.location.href = "/compare"; }}>Compare</button>
                  </div>
                </div>
                {locationError && <p role="alert" style={{ fontSize: 12, color: "#dc2626", margin: "-6px 0 8px" }}>{locationError}</p>}

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

                {!loading && schools.length > 0 && (
                  <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
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
        stats={cityStats}
      />
    </>
  );
}
