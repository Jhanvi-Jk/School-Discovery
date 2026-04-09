"use client";

import Link from "next/link";
import { MapPin, Star, IndianRupee, Check, Plus, MessageSquare } from "lucide-react";
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
    <div className="school-card" style={{ position: "relative" }}>

      {/* ── Rating badge — top right ── */}
      {school.avg_rating && (
        <div style={{
          position: "absolute", top: 14, right: 14,
          background: "#f59e0b", color: "white",
          borderRadius: 99, padding: "3px 9px",
          display: "flex", alignItems: "center", gap: 4,
          fontSize: 12, fontWeight: 700,
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        }}>
          <Star size={11} style={{ fill: "white", color: "white" }} />
          {formatRating(school.avg_rating)}
        </div>
      )}

      {/* Curriculum badges */}
      {school.curricula && school.curricula.length > 0 && (
        <div style={{ marginBottom: 10, paddingRight: school.avg_rating ? 60 : 0 }}>
          {school.curricula.map((c) => (
            <span key={c} className="card-badge" style={{ marginRight: 4 }}>
              {CURRICULUM_LABELS[c]}
            </span>
          ))}
        </div>
      )}

      {/* School name */}
      <Link href={`/schools/${school.slug}`}>
        <div className="card-name" style={{ paddingRight: school.avg_rating && !school.curricula?.length ? 60 : 0 }}>
          {school.name}
        </div>
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
        <div className="card-stat">
          <IndianRupee size={12} style={{ color: "#7a6a5a" }} />
          <span>{formatFeesRange(school.total_fees_min, school.total_fees_max) || "—"}</span>
        </div>
        {school.review_count != null && school.review_count > 0 && (
          <div className="card-stat">
            <MessageSquare size={12} style={{ color: "#7a6a5a" }} />
            <span>{school.review_count} review{school.review_count !== 1 ? "s" : ""}</span>
          </div>
        )}
        {school.admissions_open && (
          <div className="card-stat">
            <span style={{
              background: "#dcfce7", color: "#166534",
              fontSize: 11, fontWeight: 600,
              padding: "2px 8px", borderRadius: 99,
            }}>
              Open
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="card-actions" style={{ flexWrap: "wrap", gap: 6 }}>
        <Link href={`/schools/${school.slug}`} className="btn-view" style={{ flex: 1, minWidth: 90 }}>
          View Profile
        </Link>
        <Link
          href={`/schools/${school.slug}/reviews`}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600,
            border: "1.5px solid var(--beige-500)", color: "var(--muted)",
            background: "transparent", textDecoration: "none", transition: "all 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          <MessageSquare size={13} /> Reviews
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
