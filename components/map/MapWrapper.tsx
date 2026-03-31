"use client";

import dynamic from "next/dynamic";

const BangaloreMap = dynamic(
  () => import("@/components/map/BangaloreMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full animate-spin mx-auto mb-3"
            style={{ border: "4px solid #1e3a5f", borderTopColor: "transparent" }}
          />
          <p className="text-gray-500 text-sm">Loading map…</p>
        </div>
      </div>
    ),
  }
);

export function MapWrapper() {
  return <BangaloreMap />;
}
