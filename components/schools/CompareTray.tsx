"use client";

import Link from "next/link";
import { X, GitCompare, Plus, ArrowRight } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";

export function CompareTray() {
  const { schools, removeSchool, clearAll } = useCompareStore();

  if (schools.length === 0) return null;

  return (
    <div className="compare-tray">
      <div className="tray-inner">
        {/* Label */}
        <div className="tray-label">
          <GitCompare size={16} />
          {schools.length}/4
        </div>

        {/* School chips */}
        <div className="tray-chips scrollbar-none">
          {schools.map((school) => (
            <div key={school.id} className="tray-chip">
              <span>{school.name}</span>
              <button onClick={() => removeSchool(school.id)}>
                <X size={13} />
              </button>
            </div>
          ))}
          {Array.from({ length: Math.max(0, 2 - schools.length) }).map((_, i) => (
            <div key={i} className="tray-empty-slot">
              <Plus size={13} /> Add school
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button
            onClick={clearAll}
            style={{ background: "none", border: "none", color: "#7a7a7a", fontSize: 12, cursor: "pointer" }}
          >
            Clear
          </button>
          {schools.length >= 2 ? (
            <Link href="/compare" className="btn-compare-now ready">
              Compare Data <ArrowRight size={14} />
            </Link>
          ) : (
            <span className="btn-compare-now disabled">
              Compare Data
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
