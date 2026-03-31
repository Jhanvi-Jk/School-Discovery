"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Bangalore areas with approximate polygon coordinates and metadata
const BANGALORE_AREAS = [
  {
    name: "Whitefield",
    color: "#3B82F6",
    fillOpacity: 0.15,
    coords: [
      [12.940, 77.720], [12.940, 77.780],
      [13.000, 77.780], [13.000, 77.720],
    ] as [number, number][],
    center: [12.970, 77.750] as [number, number],
  },
  {
    name: "Koramangala",
    color: "#8B5CF6",
    fillOpacity: 0.15,
    coords: [
      [12.920, 77.605], [12.920, 77.645],
      [12.950, 77.645], [12.950, 77.605],
    ] as [number, number][],
    center: [12.935, 77.625] as [number, number],
  },
  {
    name: "Indiranagar",
    color: "#10B981",
    fillOpacity: 0.15,
    coords: [
      [12.965, 77.630], [12.965, 77.660],
      [12.992, 77.660], [12.992, 77.630],
    ] as [number, number][],
    center: [12.978, 77.645] as [number, number],
  },
  {
    name: "Jayanagar",
    color: "#F59E0B",
    fillOpacity: 0.15,
    coords: [
      [12.918, 77.568], [12.918, 77.600],
      [12.945, 77.600], [12.945, 77.568],
    ] as [number, number][],
    center: [12.931, 77.584] as [number, number],
  },
  {
    name: "JP Nagar",
    color: "#EF4444",
    fillOpacity: 0.15,
    coords: [
      [12.895, 77.568], [12.895, 77.600],
      [12.922, 77.600], [12.922, 77.568],
    ] as [number, number][],
    center: [12.908, 77.584] as [number, number],
  },
  {
    name: "Hebbal",
    color: "#06B6D4",
    fillOpacity: 0.15,
    coords: [
      [13.020, 77.570], [13.020, 77.620],
      [13.055, 77.620], [13.055, 77.570],
    ] as [number, number][],
    center: [13.038, 77.595] as [number, number],
  },
  {
    name: "Yelahanka",
    color: "#84CC16",
    fillOpacity: 0.15,
    coords: [
      [13.075, 77.560], [13.075, 77.620],
      [13.130, 77.620], [13.130, 77.560],
    ] as [number, number][],
    center: [13.100, 77.590] as [number, number],
  },
  {
    name: "Sarjapur",
    color: "#F97316",
    fillOpacity: 0.15,
    coords: [
      [12.870, 77.670], [12.870, 77.730],
      [12.925, 77.730], [12.925, 77.670],
    ] as [number, number][],
    center: [12.898, 77.700] as [number, number],
  },
  {
    name: "Electronic City",
    color: "#EC4899",
    fillOpacity: 0.15,
    coords: [
      [12.820, 77.645], [12.820, 77.695],
      [12.870, 77.695], [12.870, 77.645],
    ] as [number, number][],
    center: [12.845, 77.670] as [number, number],
  },
  {
    name: "HSR Layout",
    color: "#A855F7",
    fillOpacity: 0.15,
    coords: [
      [12.900, 77.620], [12.900, 77.655],
      [12.925, 77.655], [12.925, 77.620],
    ] as [number, number][],
    center: [12.912, 77.637] as [number, number],
  },
  {
    name: "Marathahalli",
    color: "#14B8A6",
    fillOpacity: 0.15,
    coords: [
      [12.945, 77.690], [12.945, 77.720],
      [12.968, 77.720], [12.968, 77.690],
    ] as [number, number][],
    center: [12.957, 77.705] as [number, number],
  },
  {
    name: "Malleswaram",
    color: "#6366F1",
    fillOpacity: 0.15,
    coords: [
      [12.995, 77.555], [12.995, 77.582],
      [13.015, 77.582], [13.015, 77.555],
    ] as [number, number][],
    center: [13.005, 77.568] as [number, number],
  },
  {
    name: "Sadashivanagar",
    color: "#0EA5E9",
    fillOpacity: 0.15,
    coords: [
      [12.988, 77.558], [12.988, 77.585],
      [13.004, 77.585], [13.004, 77.558],
    ] as [number, number][],
    center: [12.996, 77.571] as [number, number],
  },
  {
    name: "Bannerghatta Road",
    color: "#22C55E",
    fillOpacity: 0.15,
    coords: [
      [12.860, 77.580], [12.860, 77.618],
      [12.905, 77.618], [12.905, 77.580],
    ] as [number, number][],
    center: [12.882, 77.599] as [number, number],
  },
  {
    name: "BTM Layout",
    color: "#EAB308",
    fillOpacity: 0.15,
    coords: [
      [12.908, 77.598], [12.908, 77.625],
      [12.928, 77.625], [12.928, 77.598],
    ] as [number, number][],
    center: [12.918, 77.611] as [number, number],
  },
  {
    name: "Rajajinagar",
    color: "#F43F5E",
    fillOpacity: 0.15,
    coords: [
      [12.980, 77.535], [12.980, 77.565],
      [13.005, 77.565], [13.005, 77.535],
    ] as [number, number][],
    center: [12.992, 77.550] as [number, number],
  },
  {
    name: "Vijayanagar",
    color: "#7C3AED",
    fillOpacity: 0.15,
    coords: [
      [12.960, 77.510], [12.960, 77.545],
      [12.985, 77.545], [12.985, 77.510],
    ] as [number, number][],
    center: [12.972, 77.527] as [number, number],
  },
  {
    name: "Nagarbhavi",
    color: "#059669",
    fillOpacity: 0.15,
    coords: [
      [12.958, 77.480], [12.958, 77.515],
      [12.985, 77.515], [12.985, 77.480],
    ] as [number, number][],
    center: [12.971, 77.497] as [number, number],
  },
  {
    name: "Kengeri",
    color: "#D97706",
    fillOpacity: 0.15,
    coords: [
      [12.900, 77.460], [12.900, 77.500],
      [12.935, 77.500], [12.935, 77.460],
    ] as [number, number][],
    center: [12.917, 77.480] as [number, number],
  },
  {
    name: "Basavanagudi",
    color: "#DC2626",
    fillOpacity: 0.15,
    coords: [
      [12.935, 77.558], [12.935, 77.588],
      [12.958, 77.588], [12.958, 77.558],
    ] as [number, number][],
    center: [12.946, 77.573] as [number, number],
  },
];

export default function BangaloreMap() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import("react-leaflet")["MapContainer"];
    TileLayer: typeof import("react-leaflet")["TileLayer"];
    Polygon: typeof import("react-leaflet")["Polygon"];
    Tooltip: typeof import("react-leaflet")["Tooltip"];
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    import("react-leaflet").then((rl) => {
      setMapComponents({
        MapContainer: rl.MapContainer,
        TileLayer: rl.TileLayer,
        Polygon: rl.Polygon,
        Tooltip: rl.Tooltip,
      });
    });
  }, []);

  if (!mounted || !MapComponents) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-2xl">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#1e3a5f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading map…</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Polygon, Tooltip } = MapComponents;

  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={11}
      style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {BANGALORE_AREAS.map((area) => (
        <Polygon
          key={area.name}
          positions={area.coords}
          pathOptions={{
            color: area.color,
            fillColor: area.color,
            fillOpacity: area.fillOpacity,
            weight: 2,
          }}
          eventHandlers={{
            click: () => router.push(`/schools?area=${encodeURIComponent(area.name)}`),
            mouseover: (e) => {
              e.target.setStyle({ fillOpacity: 0.35, weight: 3 });
            },
            mouseout: (e) => {
              e.target.setStyle({ fillOpacity: area.fillOpacity, weight: 2 });
            },
          }}
        >
          <Tooltip permanent direction="center" className="area-tooltip">
            <span className="text-xs font-semibold">{area.name}</span>
          </Tooltip>
        </Polygon>
      ))}
    </MapContainer>
  );
}
