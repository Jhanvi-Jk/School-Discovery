"use client";

import { useEffect, useRef } from "react";

interface Props {
  latitude: number;
  longitude: number;
  name: string;
}

// Same pin artwork as the explore map so the two feel like one product
const PIN_SVG = `<svg width="30" height="38" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11 0C4.925 0 0 4.925 0 11c0 7.667 11 17 11 17s11-9.333 11-17C22 4.925 17.075 0 11 0z" fill="#FFB3C6" stroke="#e05c80" stroke-width="1.5"/>
  <circle cx="11" cy="11" r="4" fill="white" opacity="0.85"/>
</svg>`;

// Leaflet touches `window`, so it is loaded inside the effect (never during SSR).
export function SchoolLocationMap({ latitude, longitude, name }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let map: import("leaflet").Map | undefined;

    import("leaflet").then((mod) => {
      const L = mod.default;
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, { scrollWheelZoom: false }).setView([latitude, longitude], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: "abc",
        maxZoom: 19,
      }).addTo(map);
      L.marker([latitude, longitude], {
        title: name,
        icon: L.divIcon({ html: PIN_SVG, className: "", iconSize: [30, 38], iconAnchor: [15, 38] }),
      }).addTo(map);
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [latitude, longitude, name]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`Map showing the location of ${name}`}
      style={{
        height: 240, width: "100%", borderRadius: 12, overflow: "hidden",
        border: "1px solid var(--beige-500)", background: "var(--beige-300)",
      }}
    />
  );
}
