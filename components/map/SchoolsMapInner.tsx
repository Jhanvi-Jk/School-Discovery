"use client";

import { useEffect, useState } from "react";
import type { SchoolSummary } from "@/lib/types";

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

// ── Bangalore city boundary (approximate BBMP outline) ─────
const CITY_BOUNDARY: [number, number][] = [
  [13.140,77.545],[13.130,77.580],[13.115,77.618],[13.095,77.645],
  [13.070,77.668],[13.045,77.690],[13.020,77.715],[13.000,77.740],
  [12.980,77.780],[12.955,77.785],[12.928,77.775],[12.902,77.755],
  [12.875,77.738],[12.848,77.715],[12.822,77.695],[12.810,77.665],
  [12.808,77.630],[12.812,77.595],[12.820,77.558],[12.830,77.525],
  [12.848,77.498],[12.872,77.475],[12.900,77.460],[12.928,77.455],
  [12.958,77.460],[12.985,77.462],[13.010,77.468],[13.035,77.480],
  [13.058,77.495],[13.078,77.512],[13.095,77.530],[13.110,77.538],
  [13.130,77.540],
];

interface Props { schools: SchoolSummary[]; }

export default function SchoolsMapInner({ schools }: Props) {
  const [MC, setMC] = useState<any>(null);   // map components
  const [L, setL]   = useState<any>(null);

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")]).then(([rl, leaflet]) => {
      setMC(rl);
      setL(leaflet.default);
    });
  }, []);

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

  const { MapContainer, TileLayer, Polygon, Tooltip, Marker, Popup } = MC;

  // Baby pink school marker pin
  const schoolIcon = L.divIcon({
    html: `<div style="
      width:22px;height:28px;
      display:flex;align-items:flex-start;justify-content:center;
    ">
      <svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 0C4.925 0 0 4.925 0 11c0 7.667 11 17 11 17s11-9.333 11-17C22 4.925 17.075 0 11 0z" fill="#FFB3C6" stroke="#e05c80" stroke-width="1.5"/>
        <circle cx="11" cy="11" r="4" fill="white" opacity="0.85"/>
      </svg>
    </div>`,
    iconSize: [22,28], iconAnchor: [11,28], className: "",
  });

  // Deduplicate stacked markers
  const placed: Record<string, number> = {};

  return (
    <div style={{ position:"relative", width:"100%", height:"100%" }}>
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={11}
        style={{ height:"100%", width:"100%" }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
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

        {/* School markers */}
        {schools.map((school) => {
          const area  = school.area || "";
          const base  = AREA_COORDS[area] || [12.9716, 77.5946];
          placed[area] = (placed[area] || 0) + 1;
          const off   = (placed[area] - 1) * 0.004;
          const pos: [number, number] = [base[0] + off, base[1] + off * 0.5];
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
