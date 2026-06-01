"use client";

import Link from "next/link";
import { useShortlistStore } from "@/store/shortlistStore";
import { Heart, MapPin, IndianRupee, Star, X, ExternalLink } from "lucide-react";
import { formatFeesRange, formatRating } from "@/lib/utils";
import { CURRICULUM_LABELS, SCHOOL_TYPE_LABELS } from "@/lib/types";

export default function ShortlistPage() {
  const { schools, remove, clear } = useShortlistStore();

  return (
    <main style={{ minHeight: "100vh", background: "var(--beige-100)" }}>
      {/* Header strip */}
      <div style={{
        background: "var(--dark)", color: "white",
        padding: "40px 20px 36px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Heart size={20} style={{ fill: "var(--beige-400)", color: "var(--beige-400)" }} />
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>Your Shortlist</h1>
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 0 }}>
            {schools.length === 0
              ? "Schools you save will appear here."
              : `${schools.length} school${schools.length !== 1 ? "s" : ""} saved — review and compare at your own pace.`}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* Empty state */}
        {schools.length === 0 && (
          <div style={{
            background: "white",
            border: "1px solid var(--beige-400)",
            borderRadius: 20,
            padding: "60px 32px",
            textAlign: "center",
          }}>
            <Heart size={40} style={{ color: "var(--beige-400)", margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--dark)", marginBottom: 8 }}>
              No schools saved yet
            </h2>
            <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 24, maxWidth: 360, margin: "0 auto 24px" }}>
              When you find a school you like, tap "Save to shortlist" on its profile page to keep track of it here.
            </p>
            <Link href="/schools" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "var(--brown-dark)", color: "white",
              padding: "12px 24px", borderRadius: 12,
              fontSize: 13, fontWeight: 700, textDecoration: "none",
            }}>
              Explore Schools →
            </Link>
          </div>
        )}

        {/* School cards */}
        {schools.length > 0 && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {schools.map((school) => (
                <div key={school.id} style={{
                  background: "white",
                  border: "1px solid var(--beige-400)",
                  borderRadius: 16,
                  padding: "20px 24px",
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                  position: "relative",
                }}>
                  {/* Remove button */}
                  <button
                    onClick={() => remove(school.id)}
                    title="Remove from shortlist"
                    style={{
                      position: "absolute", top: 14, right: 14,
                      background: "none", border: "none",
                      color: "var(--muted)", cursor: "pointer",
                      padding: 4, borderRadius: 6,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <X size={16} />
                  </button>

                  {/* Cover image / placeholder */}
                  {school.cover_image_url ? (
                    <img
                      src={school.cover_image_url}
                      alt={school.name}
                      style={{
                        width: 80, height: 80, borderRadius: 12,
                        objectFit: "cover", flexShrink: 0,
                        border: "1px solid var(--beige-400)",
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 80, height: 80, borderRadius: 12, flexShrink: 0,
                      background: "var(--beige-200)",
                      border: "1px solid var(--beige-400)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Heart size={24} style={{ color: "var(--beige-500)" }} />
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Curricula */}
                    {school.curricula && school.curricula.length > 0 && (
                      <div style={{ marginBottom: 4, display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {school.curricula.map((c) => (
                          <span key={c} className="card-badge">{CURRICULUM_LABELS[c] ?? c}</span>
                        ))}
                      </div>
                    )}

                    {/* Name */}
                    <Link href={`/schools/${school.slug}`} style={{
                      fontSize: 17, fontWeight: 700, color: "var(--dark)",
                      textDecoration: "none", display: "block", marginBottom: 4,
                      paddingRight: 28,
                    }}>
                      {school.name}
                    </Link>

                    {/* Location + type */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 4,
                      fontSize: 12, color: "var(--muted)", marginBottom: 8,
                    }}>
                      <MapPin size={11} />
                      {[school.area, school.city].filter(Boolean).join(", ")}
                      {school.type && (
                        <>
                          <span style={{ margin: "0 2px" }}>·</span>
                          {SCHOOL_TYPE_LABELS[school.type] ?? school.type}
                        </>
                      )}
                    </div>

                    {/* Fees + rating row */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                      {(school.total_fees_min || school.total_fees_max) && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--dark)" }}>
                          <IndianRupee size={12} style={{ color: "var(--muted)" }} />
                          {formatFeesRange(school.total_fees_min, school.total_fees_max)}
                        </div>
                      )}
                      {school.avg_rating && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--dark)" }}>
                          <Star size={12} style={{ fill: "#f59e0b", color: "#f59e0b" }} />
                          {formatRating(school.avg_rating)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }} className="shortlist-actions">
                    <Link href={`/schools/${school.slug}`} style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "9px 16px", borderRadius: 10,
                      background: "var(--brown-dark)", color: "white",
                      fontSize: 12, fontWeight: 700, textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}>
                      View Profile
                    </Link>
                    {school.website && (
                      <a href={school.website} target="_blank" rel="noopener noreferrer" style={{
                        display: "flex", alignItems: "center", gap: 5,
                        padding: "9px 16px", borderRadius: 10,
                        border: "1px solid var(--beige-400)", color: "var(--muted)",
                        fontSize: 12, fontWeight: 600, textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}>
                        Website <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Clear all */}
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <button
                onClick={clear}
                style={{
                  background: "none", border: "1px solid var(--beige-400)",
                  color: "var(--muted)", borderRadius: 10,
                  padding: "9px 20px", fontSize: 13, cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Clear shortlist
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .shortlist-actions { flex-direction: row !important; }
        }
      `}</style>
    </main>
  );
}
