"use client";

import { useEffect, useRef, useState } from "react";
import type { SchoolSummary } from "@/lib/types";

// ── Exact GPS overrides (slug → [lat, lng]) ─────────────────
// Hard-coded so pins are always at the right spot regardless of DB state.
const GPS_OVERRIDES: Record<string, [number, number]> = {
  "treamis-world-school-electronic-city":             [12.816995, 77.651050],
  "greenwood-high-international-sarjapur-road":       [12.900917, 77.753180],
  "ryan-international-school-bannerghatta":           [12.819944, 77.583607],
  "ebenezer-international-school-sarjapur":           [12.840958, 77.707406],
  "christ-university-junior-college-hosur-road":      [12.939877, 77.605382],
  "primus-public-school-sarjapur-road":               [12.888342, 77.697007],
  "paradise-academy-electronic-city":                 [12.865990, 77.645387],
  "new-oxford-international-anekal":                  [12.769414, 77.653927],
  "stonehill-international-school-north-bangalore":   [13.171300, 77.596270],
  "millennium-world-school-north-bangalore":          [13.104543, 77.620341],
  "podar-global-school-yelahanka":                    [13.120993, 77.606855],
  "ryan-international-school-yelahanka":              [13.124150, 77.601381],
  "presidency-school-bangalore-north":                [13.133391, 77.558576],
  "vishwa-vidyapeeth-yelahanka":                      [13.142598, 77.568720],
  "orchids-international-yelahanka":                  [13.094396, 77.578706],
  "federal-public-school-yelahanka":                  [13.087858, 77.634705],
  "harrow-international-school-devanahalli":          [13.290318, 77.617508],
  "kesar-international-school-bagalur":               [13.147174, 77.644361],
  "new-age-world-school-yelahanka":                   [13.141047, 77.539952],
  "canadian-international-school-yelahanka":          [13.119913, 77.594983],
  "delhi-public-school-north-yelahanka":              [13.118028, 77.641709],
};

// ── Area centre coords ──────────────────────────────────────
const AREA_COORDS: Record<string, [number, number]> = {
  "Whitefield":        [12.978, 77.750],
  "Koramangala":       [12.935, 77.625],
  "Indiranagar":       [12.978, 77.645],
  "Jayanagar":         [12.931, 77.584],
  "JP Nagar":          [12.908, 77.584],
  "Hebbal":            [13.038, 77.597],
  "Yelahanka":         [13.100, 77.595],
  "Sarjapur":          [12.898, 77.700],
  "Electronic City":   [12.845, 77.670],
  "HSR Layout":        [12.912, 77.637],
  "Marathahalli":      [12.957, 77.705],
  "Malleswaram":       [13.005, 77.568],
  "Sadashivanagar":    [12.996, 77.573],
  "Bannerghatta Road": [12.882, 77.599],
  "BTM Layout":        [12.918, 77.611],
  "Rajajinagar":       [12.992, 77.550],
  "Vijayanagar":       [12.972, 77.527],
  "Basavanagudi":      [12.946, 77.573],
  "Nagarbhavi":        [12.971, 77.497],
  "Kengeri":           [12.917, 77.480],
  "Jigani":            [12.842, 77.612],
  "Attibele":          [12.783, 77.792],
  "Anekal":            [12.710, 77.697],
};

// ── Colour palette ──────────────────────────────────────────
const ZONE_COLORS: Record<string, string> = {
  north:    "#C8D8B0",  // sage green
  east:     "#B0C8D8",  // steel blue
  south_e:  "#D8B0B8",  // dusty rose
  south_w:  "#D8C8A0",  // warm straw
  west:     "#C8B8D8",  // lavender
  central:  "#D8C0A8",  // milk tea
};

// ── Area polygon definitions ────────────────────────────────
// Each polygon: [lat,lng] pairs forming a closed ring
const AREA_POLYGONS: Array<{
  name: string; zone: keyof typeof ZONE_COLORS; coords: [number, number][];
}> = [
  // ── NORTH ──
  { name: "Yelahanka", zone: "north", coords: [
    [13.085,77.575],[13.085,77.615],[13.115,77.615],[13.115,77.575],
  ]},
  { name: "Hebbal", zone: "north", coords: [
    [13.020,77.575],[13.020,77.615],[13.055,77.615],[13.055,77.575],
  ]},
  { name: "Sadashivanagar", zone: "north", coords: [
    [12.990,77.560],[12.990,77.585],[13.012,77.585],[13.012,77.560],
  ]},
  { name: "Malleswaram", zone: "north", coords: [
    [12.995,77.555],[12.995,77.580],[13.020,77.580],[13.020,77.555],
  ]},
  // ── EAST ──
  { name: "Whitefield", zone: "east", coords: [
    [12.960,77.720],[12.960,77.780],[13.000,77.780],[13.000,77.720],
  ]},
  { name: "Marathahalli", zone: "east", coords: [
    [12.940,77.695],[12.940,77.725],[12.970,77.725],[12.970,77.695],
  ]},
  { name: "Indiranagar", zone: "east", coords: [
    [12.960,77.630],[12.960,77.665],[12.990,77.665],[12.990,77.630],
  ]},
  // ── SOUTH-EAST ──
  { name: "Koramangala", zone: "south_e", coords: [
    [12.920,77.610],[12.920,77.645],[12.945,77.645],[12.945,77.610],
  ]},
  { name: "HSR Layout", zone: "south_e", coords: [
    [12.900,77.630],[12.900,77.655],[12.925,77.655],[12.925,77.630],
  ]},
  { name: "BTM Layout", zone: "south_e", coords: [
    [12.905,77.600],[12.905,77.625],[12.928,77.625],[12.928,77.600],
  ]},
  { name: "Sarjapur", zone: "south_e", coords: [
    [12.870,77.680],[12.870,77.730],[12.910,77.730],[12.910,77.680],
  ]},
  { name: "Electronic City", zone: "south_e", coords: [
    [12.820,77.648],[12.820,77.690],[12.858,77.690],[12.858,77.648],
  ]},
  { name: "Jigani", zone: "south_e", coords: [
    [12.825,77.590],[12.825,77.635],[12.860,77.635],[12.860,77.590],
  ]},
  { name: "Attibele", zone: "south_e", coords: [
    [12.765,77.772],[12.765,77.812],[12.800,77.812],[12.800,77.772],
  ]},
  { name: "Anekal", zone: "south_e", coords: [
    [12.692,77.668],[12.692,77.722],[12.728,77.722],[12.728,77.668],
  ]},
  { name: "Bannerghatta Road", zone: "south_e", coords: [
    [12.875,77.580],[12.875,77.610],[12.910,77.610],[12.910,77.580],
  ]},
  // ── SOUTH-WEST ──
  { name: "Jayanagar", zone: "south_w", coords: [
    [12.920,77.568],[12.920,77.598],[12.948,77.598],[12.948,77.568],
  ]},
  { name: "JP Nagar", zone: "south_w", coords: [
    [12.890,77.568],[12.890,77.598],[12.922,77.598],[12.922,77.568],
  ]},
  { name: "Basavanagudi", zone: "south_w", coords: [
    [12.937,77.563],[12.937,77.585],[12.958,77.585],[12.958,77.563],
  ]},
  { name: "Rajajinagar", zone: "south_w", coords: [
    [12.978,77.538],[12.978,77.565],[13.002,77.565],[13.002,77.538],
  ]},
  // ── WEST ──
  { name: "Vijayanagar", zone: "west", coords: [
    [12.960,77.515],[12.960,77.545],[12.985,77.545],[12.985,77.515],
  ]},
  { name: "Nagarbhavi", zone: "west", coords: [
    [12.955,77.485],[12.955,77.520],[12.985,77.520],[12.985,77.485],
  ]},
  { name: "Kengeri", zone: "west", coords: [
    [12.905,77.465],[12.905,77.500],[12.935,77.500],[12.935,77.465],
  ]},
];

// ── Bangalore Urban District boundary ────────────────────────
// Real boundary from OpenStreetMap (Nominatim, 134 points).
// Coordinates converted from [lon,lat] → [lat,lon] for Leaflet.
// Note: actual district ends ~13.23°N; Harrow (13.29°N) is in
// Bangalore Rural district and will appear just north of the line.
const CITY_BOUNDARY: [number, number][] = [
  [12.9760,77.3255],[12.9336,77.3403],[12.8888,77.3436],[12.8871,77.3321],
  [12.8769,77.3366],[12.8702,77.3661],[12.8569,77.3698],[12.8552,77.3794],
  [12.8756,77.4082],[12.8749,77.4313],[12.8693,77.4188],[12.8510,77.4275],
  [12.8497,77.4377],[12.8262,77.4199],[12.8234,77.4335],[12.8067,77.4440],
  [12.8187,77.4492],[12.8073,77.4611],[12.8115,77.4788],[12.8023,77.4831],
  [12.7939,77.4700],[12.7805,77.4785],[12.7573,77.4738],[12.7428,77.4864],
  [12.7356,77.5028],[12.7468,77.5128],[12.7317,77.5218],[12.7559,77.5347],
  [12.7481,77.5410],[12.7724,77.5517],[12.7758,77.5438],[12.8014,77.5475],
  [12.7996,77.5560],[12.7897,77.5529],[12.7881,77.5636],[12.7773,77.5562],
  [12.7600,77.5648],[12.7878,77.5797],[12.7798,77.5921],[12.7515,77.5953],
  [12.7512,77.5765],[12.7310,77.5719],[12.7275,77.5571],[12.7012,77.5681],
  [12.7209,77.5947],[12.7120,77.6142],[12.6925,77.6037],[12.6668,77.5946],
  [12.6642,77.5963],[12.6833,77.6633],[12.6793,77.6771],[12.6634,77.6761],
  [12.6585,77.6896],[12.6664,77.7109],[12.6834,77.7120],[12.6794,77.7232],
  [12.6708,77.7248],[12.6737,77.7410],[12.6984,77.7376],[12.6970,77.7626],
  [12.7245,77.7744],[12.7273,77.7611],[12.7364,77.7630],[12.7467,77.7920],
  [12.7582,77.7950],[12.7680,77.7789],[12.7917,77.7947],[12.7968,77.8090],
  [12.8054,77.7999],[12.8171,77.8022],[12.8158,77.8098],[12.8310,77.8101],
  [12.8348,77.7956],[12.8434,77.7926],[12.8519,77.7990],[12.8477,77.8079],
  [12.8620,77.8331],[12.8704,77.8370],[12.9149,77.8166],[12.9217,77.8168],
  [12.9197,77.8297],[12.9256,77.8318],[12.9263,77.8060],[12.9184,77.7966],
  [12.9423,77.7653],[12.9595,77.7646],[12.9668,77.7842],[12.9750,77.7762],
  [13.0151,77.7715],[13.0333,77.7816],[13.0737,77.7583],[13.0815,77.7656],
  [13.1076,77.7665],[13.1121,77.7372],[13.1233,77.7336],[13.1254,77.7241],
  [13.1429,77.7338],[13.1925,77.7273],[13.1903,77.6999],[13.2031,77.6870],
  [13.1938,77.6869],[13.1845,77.6614],[13.1902,77.6505],[13.1993,77.6572],
  [13.2048,77.6378],[13.2056,77.6139],[13.1941,77.5996],[13.1983,77.5750],
  [13.2016,77.5677],[13.2160,77.5695],[13.2199,77.5574],[13.2320,77.5596],
  [13.2347,77.5517],[13.2331,77.5433],[13.2191,77.5372],[13.2217,77.5265],
  [13.2069,77.5213],[13.2261,77.5120],[13.2242,77.4792],[13.1623,77.4690],
  [13.1651,77.4318],[13.1237,77.4086],[13.1176,77.3929],[13.1049,77.4179],
  [13.0932,77.4160],[13.0865,77.4288],[13.0703,77.4237],[13.0679,77.3841],
  [13.0572,77.3830],[13.0529,77.3940],[13.0265,77.3891],[13.0288,77.3756],
  [13.0133,77.3699],[12.9922,77.3720],[12.9856,77.3552],[12.9743,77.3499],
  [12.9760,77.3255],
];

// ── Pin sizing by zoom level ─────────────────────────────────
const PIN_MIN_ZOOM = 9;   // stop shrinking below this zoom
const PIN_MAX_ZOOM = 15;  // stop growing above this zoom
const PIN_MIN_W   = 13;   // px at minimum zoom
const PIN_MAX_W   = 34;   // px at maximum zoom

function getPinDims(zoom: number): [number, number] {
  const z = Math.min(Math.max(zoom, PIN_MIN_ZOOM), PIN_MAX_ZOOM);
  const t = (z - PIN_MIN_ZOOM) / (PIN_MAX_ZOOM - PIN_MIN_ZOOM);
  const w = Math.round(PIN_MIN_W + t * (PIN_MAX_W - PIN_MIN_W));
  const h = Math.round(w * (28 / 22));
  return [w, h];
}

interface Props { schools: SchoolSummary[]; }

export default function SchoolsMapInner({ schools }: Props) {
  const [MC, setMC] = useState<any>(null);
  const [L, setL]   = useState<any>(null);
  const [zoom, setZoom] = useState(11);
  const [expanded, setExpanded] = useState(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")]).then(([rl, leaflet]) => {
      setMC(rl);
      setL(leaflet.default);
    });
  }, []);

  // Invalidate map size after expand/collapse so tiles fill the new container
  useEffect(() => {
    const t = setTimeout(() => mapRef.current?.invalidateSize(), 50);
    return () => clearTimeout(t);
  }, [expanded]);

  // Close on Escape + lock body scroll + lift map-box above page when expanded
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(false); };
    if (expanded) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("map-expanded");
      window.addEventListener("keydown", handler);
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("map-expanded");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("map-expanded");
      window.removeEventListener("keydown", handler);
    };
  }, [expanded]);

  if (!MC || !L) {
    return (
      <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--beige-300)" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:28, height:28, border:"2px solid var(--brown-dark)", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 8px" }} />
          <p style={{ color:"var(--muted)", fontSize:12 }}>Loading map…</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Polygon, Marker, Popup, useMapEvents } = MC;

  // Tracks zoom and stores map instance for invalidateSize
  function ZoomTracker() {
    const map = useMapEvents({ zoom: (e: any) => setZoom(e.target.getZoom()) });
    useEffect(() => { mapRef.current = map; }, [map]);
    return null;
  }

  const [pinW, pinH] = getPinDims(zoom);

  const schoolIcon = L.divIcon({
    html: `<div style="width:${pinW}px;height:${pinH}px;display:flex;align-items:flex-start;justify-content:center;">
      <svg width="${pinW}" height="${pinH}" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 0C4.925 0 0 4.925 0 11c0 7.667 11 17 11 17s11-9.333 11-17C22 4.925 17.075 0 11 0z" fill="#FFB3C6" stroke="#e05c80" stroke-width="1.5"/>
        <circle cx="11" cy="11" r="4" fill="white" opacity="0.85"/>
      </svg>
    </div>`,
    iconSize: [pinW, pinH], iconAnchor: [pinW / 2, pinH], className: "",
  });

  // Deduplicate stacked markers
  const placed: Record<string, number> = {};

  return (
    // Outer wrapper: handles fixed/relative positioning — NO overflow:hidden so buttons aren't clipped
    <div style={{
      position: expanded ? "fixed" : "relative",
      inset: expanded ? 0 : "auto",
      width: expanded ? "100vw" : "100%",
      height: expanded ? "100vh" : "100%",
      zIndex: expanded ? 99999 : "auto",
      background: "var(--beige-300)",
    }}>
      {/* Inner wrapper: clips Leaflet tiles to rounded corners */}
      <div style={{ width: "100%", height: "100%", overflow: "hidden",
        borderRadius: expanded ? 0 : "inherit" }}>
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={11}
        style={{ height:"100%", width:"100%" }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <ZoomTracker />
        {/* Original light grey/white/green base tile */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {/* City boundary — dark brown, slightly thinner */}
        <Polygon
          positions={CITY_BOUNDARY}
          pathOptions={{
            color:       "#5C2E0A",
            weight:      1.5,
            opacity:     1,
            fillColor:   "transparent",
            fillOpacity: 0,
            lineCap:     "round",
            lineJoin:    "round",
          }}
        />

        {/* Label tile on top */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
          attribution=""
        />

        {/* School markers — golden-angle phyllotaxis spread per area */}
        {schools.map((school) => {
          const area  = school.area || "";
          const base  = AREA_COORDS[area] || [12.9716, 77.5946];
          const idx   = placed[area] || 0;
          placed[area] = idx + 1;
          // Priority: hardcoded override → DB coords → area centre spread
          let pos: [number, number];
          const override = GPS_OVERRIDES[school.slug];
          if (override) {
            pos = override;
          } else if (school.latitude && school.longitude) {
            pos = [school.latitude, school.longitude];
          } else if (idx === 0) {
            pos = [base[0], base[1]];
          } else {
            // Golden angle spiral so markers fan out naturally, not in a line
            const angle  = idx * 2.3999632; // ~137.5° in radians
            const radius = 0.004 * Math.sqrt(idx);
            pos = [base[0] + radius * Math.sin(angle), base[1] + radius * Math.cos(angle)];
          }
          return (
            <Marker key={school.id} position={pos} icon={schoolIcon}>
              <Popup>
                <div style={{ minWidth:160 }}>
                  <p style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{school.name}</p>
                  <p style={{ color:"#7a6a5a", fontSize:12, marginBottom:8 }}>{school.area}</p>
                  <a href={`/schools/${school.slug}`} style={{
                    display:"block", background:"#2C1810", color:"white",
                    borderRadius:8, padding:"5px 10px", fontSize:12,
                    textAlign:"center", textDecoration:"none", fontWeight:600,
                  }}>View Profile</a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      </div>{/* end inner clip wrapper */}

      {/* Expand button (normal view) */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          title="Expand map"
          style={{
            position: "absolute", top: 12, right: 12, zIndex: 1000,
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 12px",
            background: "white", border: "1px solid #d4c5b0",
            borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
            color: "#5C2E0A", boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 15 15" fill="none" stroke="#5C2E0A" strokeWidth="1.8" strokeLinecap="round">
            <path d="M1 5V1h4M10 1h4v4M14 10v4h-4M5 14H1v-4" />
          </svg>
          Expand
        </button>
      )}

      {/* Close button (expanded view) */}
      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          title="Exit fullscreen (Esc)"
          style={{
            position: "absolute", top: 16, right: 16, zIndex: 10000,
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px",
            background: "white", border: "1px solid #d4c5b0",
            borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
            color: "#5C2E0A", boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 15 15" fill="none" stroke="#5C2E0A" strokeWidth="1.8" strokeLinecap="round">
            <path d="M2 6h3V3M10 3v3h3M13 9h-3v3M5 12V9H2" />
          </svg>
          Exit fullscreen
        </button>
      )}

      {/* Legend overlay */}
      <div className="map-legend">
        <div className="leg-title">Map Legend</div>
        <div className="leg-item">
          <div className="leg-dot" style={{ background:"#FFB3C6", border:"1.5px solid #e05c80" }} />
          School
        </div>
        <div style={{ height:1, background:"#e5e5e5", margin:"6px 0" }} />
        <div className="leg-item">
          <svg width="18" height="10"><line x1="0" y1="5" x2="18" y2="5" stroke="#5C2E0A" strokeWidth="1.5"/></svg>
          City boundary
        </div>
      </div>
    </div>
  );
}
