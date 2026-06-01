"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ArrowLeft, Heart, MapPin, IndianRupee, Star, MessageSquare, ExternalLink } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useShortlistStore } from "@/store/shortlistStore";
import { formatFeesRange, formatRating } from "@/lib/utils";
import { CURRICULUM_LABELS, SCHOOL_TYPE_LABELS } from "@/lib/types";
import type { ShortlistedSchool } from "@/store/shortlistStore";

export default function ShortlistPage() {
  const { schools: stored, remove, clear } = useShortlistStore();
  const [schools, setSchools] = useState<ShortlistedSchool[]>(stored);

  // Re-fetch fresh data (curricula + fees) from the API for each saved school
  useEffect(() => {
    if (stored.length === 0) { setSchools([]); return; }
    Promise.all(
      stored.map((s) =>
        fetch(`/api/v1/schools/${s.slug}`)
          .then((r) => r.json())
          .then((json) => {
            if (!json.success) return s;
            const d = json.data;
            const sd = (Array.isArray(d.school_details) ? d.school_details[0] : d.school_details) || {};
            return {
              ...s,
              curricula: (d.school_curricula || []).map((c: any) => c.curriculum),
              total_fees_min: sd.total_fees_min ?? s.total_fees_min,
              total_fees_max: sd.total_fees_max ?? s.total_fees_max,
              avg_rating: d.avg_rating ?? s.avg_rating,
              cover_image_url: d.cover_image_url ?? s.cover_image_url,
            } as ShortlistedSchool;
          })
          .catch(() => s)
      )
    ).then(setSchools);
  }, [stored.length]);

  return (
    <>
      <Header />
      <div className="compare-page">
        <div className="compare-inner">

          {/* Heading */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link href="/schools" style={{
                width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--beige-200)", border: "1px solid var(--beige-500)", borderRadius: 10,
                textDecoration: "none", color: "var(--dark)",
              }}>
                <ArrowLeft size={16} />
              </Link>
              <div>
                <h1 className="compare-heading">Your Shortlist</h1>
                <p className="compare-sub">
                  {schools.length === 0
                    ? "No schools saved yet"
                    : `${schools.length} school${schools.length !== 1 ? "s" : ""} saved`}
                </p>
              </div>
            </div>
            {schools.length > 0 && (
              <button onClick={clear} style={{
                background: "none", border: "none", color: "var(--muted)",
                fontSize: 13, textDecoration: "underline", cursor: "pointer",
              }}>
                Clear all
              </button>
            )}
          </div>

          {/* Empty state */}
          {schools.length === 0 ? (
            <div className="empty-compare">
              <div className="icon">❤️</div>
              <h3>No schools saved yet</h3>
              <p>Tap "Save to shortlist" on any school profile to save it here</p>
              <Link href="/schools" className="btn-primary">Browse Schools</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {schools.map((school) => (
                <div key={school.id} className="school-card" style={{ marginBottom: 14 }}>

                  {/* Curriculum badges */}
                  {school.curricula && school.curricula.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      {school.curricula.map((c) => (
                        <span key={c} className="card-badge" style={{ marginRight: 4 }}>
                          {CURRICULUM_LABELS[c] ?? c}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Name */}
                  <Link href={`/schools/${school.slug}`} className="card-name">
                    {school.name}
                  </Link>

                  {/* Location · Type */}
                  <div className="card-meta">
                    <MapPin size={12} />
                    {[school.area, school.city].filter(Boolean).join(", ")}
                    {school.type && (
                      <>
                        <span style={{ margin: "0 4px" }}>·</span>
                        {SCHOOL_TYPE_LABELS[school.type] ?? school.type}
                      </>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="card-stats">
                    <div className="card-stat">
                      <IndianRupee size={12} style={{ color: "#7a6a5a" }} />
                      {(school.total_fees_min || school.total_fees_max)
                        ? <span>{formatFeesRange(school.total_fees_min, school.total_fees_max)}</span>
                        : <span style={{ color: "#b0a090", fontSize: 11 }}>Fee details coming</span>
                      }
                    </div>
                    {school.avg_rating && (
                      <div className="card-stat">
                        <Star size={12} style={{ fill: "#f59e0b", color: "#f59e0b" }} />
                        <span>{formatRating(school.avg_rating)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="card-actions" style={{ flexWrap: "wrap", gap: 6 }}>
                    <Link href={`/schools/${school.slug}`} className="btn-view" style={{ flex: 1, minWidth: 90 }}>
                      Explore School →
                    </Link>
                    {school.website && (
                      <a href={school.website} target="_blank" rel="noopener noreferrer" style={{
                        display: "flex", alignItems: "center", gap: 5,
                        padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                        border: "1.5px solid var(--beige-500)", color: "var(--muted)",
                        background: "transparent", textDecoration: "none",
                      }}>
                        <ExternalLink size={13} /> Website
                      </a>
                    )}
                    <button
                      onClick={() => remove(school.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 5,
                        padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                        border: "1.5px solid var(--beige-500)", color: "var(--muted)",
                        background: "transparent", cursor: "pointer",
                      }}
                    >
                      <X size={13} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
