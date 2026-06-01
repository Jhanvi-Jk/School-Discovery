"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShortlistStore } from "@/store/shortlistStore";
import { useCompareStore } from "@/store/compareStore";
import { Heart, MapPin, IndianRupee, Star, X, ExternalLink, GitCompare } from "lucide-react";
import { formatFeesRange, formatRating } from "@/lib/utils";
import { CURRICULUM_LABELS, SCHOOL_TYPE_LABELS } from "@/lib/types";

export default function ShortlistPage() {
  const { schools, remove, clear } = useShortlistStore();
  const compareCount = useCompareStore((s) => s.schools.length);
  const shortlistCount = schools.length;
  const pathname = usePathname();

  const tabStyle = (active: boolean) => ({
    display: "flex", alignItems: "center", gap: 6,
    padding: "10px 20px", borderRadius: 10,
    fontSize: 13, fontWeight: active ? 700 : 500,
    color: active ? "var(--dark)" : "var(--muted)",
    background: active ? "white" : "transparent",
    boxShadow: active ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
    textDecoration: "none",
    border: "none", cursor: "pointer",
    transition: "all 0.15s",
  } as React.CSSProperties);

  const badgeStyle = (color: string, textColor: string) => ({
    width: 18, height: 18,
    background: color, color: textColor,
    borderRadius: "50%", fontSize: 10, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  } as React.CSSProperties);

  return (
    <main style={{ minHeight: "100vh", background: "var(--beige-100)" }}>

      {/* ── Page header ── */}
      <div style={{ background: "var(--dark)", color: "white", padding: "36px 20px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Heart size={20} style={{ fill: "var(--beige-400)", color: "var(--beige-400)" }} />
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>Your Saved Schools</h1>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 20 }}>
            {shortlistCount === 0
              ? "Schools you save will appear here."
              : `${shortlistCount} school${shortlistCount !== 1 ? "s" : ""} saved — review and compare at your own pace.`}
          </p>

          {/* ── Sticky tab bar ── */}
          <div style={{
            display: "flex", gap: 4,
            background: "rgba(255,255,255,0.08)",
            borderRadius: "12px 12px 0 0",
            padding: "6px 6px 0",
          }}>
            <Link href="/shortlist" style={tabStyle(pathname === "/shortlist")}>
              <Heart size={13} />
              Shortlist
              {shortlistCount > 0 && (
                <span style={badgeStyle("#f59e0b", "white")}>{shortlistCount}</span>
              )}
            </Link>
            <Link href="/compare" style={tabStyle(pathname === "/compare")}>
              <GitCompare size={13} />
              Compare
              {compareCount > 0 && (
                <span style={badgeStyle("var(--beige-400)", "var(--dark)")}>{compareCount}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Sticky sub-nav bar that follows on scroll ── */}
      <div style={{
        position: "sticky", top: 56, zIndex: 40,
        background: "var(--beige-200)",
        borderBottom: "1px solid var(--beige-500)",
        boxShadow: "0 1px 0 var(--beige-400)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", gap: 4, padding: "6px 0" }}>
            <Link href="/shortlist" style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "7px 16px", borderRadius: 8,
              fontSize: 13, fontWeight: pathname === "/shortlist" ? 700 : 500,
              color: pathname === "/shortlist" ? "var(--dark)" : "var(--muted)",
              background: pathname === "/shortlist" ? "white" : "transparent",
              boxShadow: pathname === "/shortlist" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              textDecoration: "none", transition: "all 0.15s",
            }}>
              <Heart size={12} />
              Shortlist
              {shortlistCount > 0 && (
                <span style={{
                  background: "#f59e0b", color: "white",
                  borderRadius: "50%", width: 16, height: 16,
                  fontSize: 9, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{shortlistCount}</span>
              )}
            </Link>
            <Link href="/compare" style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "7px 16px", borderRadius: 8,
              fontSize: 13, fontWeight: 500,
              color: "var(--muted)",
              background: "transparent",
              textDecoration: "none", transition: "all 0.15s",
            }}>
              <GitCompare size={12} />
              Compare
              {compareCount > 0 && (
                <span style={{
                  background: "var(--beige-500)", color: "var(--dark)",
                  borderRadius: "50%", width: 16, height: 16,
                  fontSize: 9, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{compareCount}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 80px" }}>

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
            <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 360, margin: "0 auto 24px", lineHeight: 1.6 }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {schools.map((school) => (
                <div key={school.id} style={{
                  background: "white",
                  border: "1px solid var(--beige-400)",
                  borderRadius: 16,
                  padding: "18px 20px",
                  display: "flex",
                  gap: 18,
                  alignItems: "flex-start",
                  position: "relative",
                }}>
                  {/* Remove button */}
                  <button
                    onClick={() => remove(school.id)}
                    title="Remove from shortlist"
                    style={{
                      position: "absolute", top: 12, right: 12,
                      background: "none", border: "none",
                      color: "var(--muted)", cursor: "pointer",
                      padding: 4, borderRadius: 6,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <X size={15} />
                  </button>

                  {/* Cover image / Coming Soon placeholder */}
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
                      position: "relative", overflow: "hidden",
                      border: "1px solid var(--beige-300)",
                    }}>
                      {/* Animated sheen base */}
                      <div className="sheen" style={{ position: "absolute", inset: 0, borderRadius: 12 }} />
                      {/* White overlay with label */}
                      <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 4,
                        background: "rgba(255,255,255,0.62)",
                        backdropFilter: "blur(2px)",
                        WebkitBackdropFilter: "blur(2px)",
                        borderRadius: 12,
                      }}>
                        <span style={{
                          fontSize: 9, fontWeight: 700, color: "var(--muted)",
                          textTransform: "uppercase", letterSpacing: "0.06em",
                          textAlign: "center", lineHeight: 1.3,
                        }}>Photo<br/>coming<br/>soon</span>
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>

                    {/* Curricula — always shown */}
                    <div style={{ marginBottom: 5, display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {school.curricula && school.curricula.length > 0 ? (
                        school.curricula.map((c) => (
                          <span key={c} className="card-badge">{CURRICULUM_LABELS[c] ?? c}</span>
                        ))
                      ) : (
                        <span style={{
                          fontSize: 10, fontWeight: 600, color: "var(--muted)",
                          background: "var(--beige-200)", border: "1px solid var(--beige-400)",
                          borderRadius: 99, padding: "2px 8px",
                        }}>Curriculum not listed</span>
                      )}
                    </div>

                    {/* Name */}
                    <Link href={`/schools/${school.slug}`} style={{
                      fontSize: 16, fontWeight: 700, color: "var(--dark)",
                      textDecoration: "none", display: "block", marginBottom: 3,
                      paddingRight: 24,
                    }}>
                      {school.name}
                    </Link>

                    {/* Location + type */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 4,
                      fontSize: 12, color: "var(--muted)", marginBottom: 8, flexWrap: "wrap",
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

                    {/* Fees — always shown */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--dark)" }}>
                        <IndianRupee size={11} style={{ color: "var(--muted)" }} />
                        {(school.total_fees_min || school.total_fees_max)
                          ? formatFeesRange(school.total_fees_min, school.total_fees_max)
                          : <span style={{ color: "var(--muted)" }}>Fee details coming</span>
                        }
                      </div>
                      {school.avg_rating && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--dark)" }}>
                          <Star size={11} style={{ fill: "#f59e0b", color: "#f59e0b" }} />
                          {formatRating(school.avg_rating)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, flexShrink: 0 }} className="shortlist-actions">
                    <Link href={`/schools/${school.slug}`} style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "9px 16px", borderRadius: 10,
                      background: "var(--brown-dark)", color: "white",
                      fontSize: 12, fontWeight: 700, textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}>
                      View Profile
                    </Link>
                    {school.website && (
                      <a href={school.website} target="_blank" rel="noopener noreferrer" style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
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
                  padding: "9px 20px", fontSize: 13, cursor: "pointer", fontWeight: 500,
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
