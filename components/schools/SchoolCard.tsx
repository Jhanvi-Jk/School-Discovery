"use client";

import Link from "next/link";
import { MapPin, Star, IndianRupee, Check, Plus } from "lucide-react";
import { formatFeesRange, formatRating } from "@/lib/utils";
import { CURRICULUM_LABELS, SCHOOL_TYPE_LABELS, type SchoolSummary } from "@/lib/types";
import { useCompareStore } from "@/store/compareStore";

interface SchoolCardProps {
  school: SchoolSummary;
  view?: "grid" | "list";
  isSaved?: boolean;
  onSave?: (id: string) => void;
}

export function SchoolCard({ school }: SchoolCardProps) {
  const { isInCompare, addSchool, removeSchool, canAdd } = useCompareStore();
  const inCompare = isInCompare(school.id);

  const handleCompare = () => {
    if (inCompare) removeSchool(school.id);
    else if (canAdd()) addSchool(school);
  };

  return (
    <div className="school-card">
      {/* Curriculum badge */}
      {school.curricula && school.curricula.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {school.curricula.map((c) => (
            <span key={c} className="card-badge">
              {CURRICULUM_LABELS[c]}
            </span>
          ))}
        </div>
      )}

      {/* School name */}
      <Link href={`/schools/${school.slug}`}>
        <div className="card-name">{school.name}</div>
      </Link>

      {/* Location */}
      <div className="card-meta">
        <MapPin size={12} />
        {school.area || school.city}
        <span style={{ margin: "0 4px" }}>·</span>
        {SCHOOL_TYPE_LABELS[school.type]}
      </div>

      {/* Stats */}
      <div className="card-stats">
        {school.avg_rating && (
          <div className="card-stat">
            <Star size={13} style={{ fill: "#f59e0b", color: "#f59e0b" }} />
            <strong>{formatRating(school.avg_rating)}</strong>
          </div>
        )}
        <div className="card-stat">
          <IndianRupee size={12} style={{ color: "#7a6a5a" }} />
          <span>{formatFeesRange(school.total_fees_min, school.total_fees_max) || "—"}</span>
        </div>
        {school.admissions_open && (
          <div className="card-stat">
            <span style={{
              background: "#dcfce7", color: "#166534",
              fontSize: 11, fontWeight: 600,
              padding: "2px 8px", borderRadius: 99
            }}>
              Open
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="card-actions">
        <Link href={`/schools/${school.slug}`} className="btn-view">
          View Profile
        </Link>
        <button
          onClick={handleCompare}
          disabled={!inCompare && !canAdd()}
          className={`btn-compare${inCompare ? " added" : ""}`}
        >
          {inCompare ? (
            <><Check size={13} /> Added</>
          ) : (
            <><Plus size={13} /> Compare</>
          )}
        </button>
      </div>
    </div>
  );
}
