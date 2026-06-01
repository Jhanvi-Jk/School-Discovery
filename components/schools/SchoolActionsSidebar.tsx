"use client";

import { useState } from "react";
import { Heart, GitCompare, ExternalLink, Phone, Mail, MapPin, Globe } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";

interface Props {
  school: any;
}

export function SchoolActionsSidebar({ school }: Props) {
  const [saved, setSaved] = useState(false);
  const { isInCompare, addSchool, removeSchool, canAdd } = useCompareStore();
  const inCompare = isInCompare(school.id);

  const openAdmission = (school.admission_windows || []).find(
    (a: any) => a.status === "open"
  );

  const hasContact = school.phone || school.email || school.address_line1 || school.area;

  // Primary CTA — prefer apply URL, then website, then phone, then email
  const primaryHref =
    openAdmission?.application_url ||
    school.website ||
    (school.phone ? `tel:${school.phone}` : null) ||
    (school.email ? `mailto:${school.email}` : null);

  const primaryLabel = openAdmission?.application_url
    ? "Apply Online"
    : school.website
    ? "Visit School Website"
    : school.phone
    ? "Call School"
    : "Contact School";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 120 }}>

      {/* ── CTA card ── */}
      <div style={{
        background: "var(--beige-100)",
        border: "1px solid var(--beige-500)",
        borderRadius: 16,
        padding: 20,
      }}>
        <p style={{ fontSize: 15, fontWeight: 800, color: "var(--dark)", marginBottom: 6, lineHeight: 1.3 }}>
          {school.name}
        </p>

        {openAdmission && (
          <div style={{
            fontSize: 11, fontWeight: 700, color: "#15803d",
            background: "rgba(22,163,74,0.1)", padding: "4px 10px",
            borderRadius: 99, display: "inline-flex", alignItems: "center",
            gap: 4, marginBottom: 14,
          }}>
            ✓ Admissions Open {new Date().getFullYear()}–{(new Date().getFullYear() + 1).toString().slice(2)}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: openAdmission ? 0 : 12 }}>

          {/* Primary CTA — links directly to school */}
          {primaryHref ? (
            <a
              href={primaryHref}
              target={primaryHref.startsWith("http") ? "_blank" : undefined}
              rel={primaryHref.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, padding: "11px 0", borderRadius: 12,
                background: "var(--brown-dark)", color: "white",
                fontSize: 13, fontWeight: 700, textDecoration: "none",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Globe style={{ width: 14, height: 14 }} />
              {primaryLabel}
              <ExternalLink style={{ width: 12, height: 12, opacity: 0.7 }} />
            </a>
          ) : (
            <div style={{
              width: "100%", padding: "11px 0", borderRadius: 12, textAlign: "center",
              background: "var(--beige-300)", border: "1px solid var(--beige-500)",
              fontSize: 13, color: "var(--muted)",
            }}>
              Contact details coming soon
            </div>
          )}

          {/* Save to shortlist */}
          <button
            onClick={() => setSaved(!saved)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8, padding: "10px 0", borderRadius: 12,
              border: `1px solid ${saved ? "var(--brown-dark)" : "var(--beige-500)"}`,
              background: saved ? "rgba(44,24,16,0.06)" : "transparent",
              color: saved ? "var(--brown-dark)" : "var(--muted)",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <Heart style={{ width: 14, height: 14, fill: saved ? "var(--brown-dark)" : "none" }} />
            {saved ? "Saved to shortlist" : "Save to shortlist"}
          </button>

          {/* Add to Compare */}
          <button
            onClick={() => inCompare ? removeSchool(school.id) : canAdd() && addSchool(school)}
            disabled={!inCompare && !canAdd()}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8, padding: "10px 0", borderRadius: 12,
              border: `1px solid ${inCompare ? "var(--dark)" : "var(--beige-500)"}`,
              background: inCompare ? "var(--dark)" : "transparent",
              color: inCompare ? "white" : !canAdd() ? "var(--beige-500)" : "var(--muted)",
              fontSize: 13, fontWeight: 600,
              cursor: (!inCompare && !canAdd()) ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              opacity: (!inCompare && !canAdd()) ? 0.5 : 1,
            }}
          >
            <GitCompare style={{ width: 14, height: 14 }} />
            {inCompare ? "In compare list" : canAdd() ? "Compare with others" : "Compare full (3/3)"}
          </button>
        </div>
      </div>

      {/* ── Contact card ── */}
      {hasContact && (
        <div style={{
          background: "var(--beige-100)",
          border: "1px solid var(--beige-500)",
          borderRadius: 16,
          padding: 20,
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)",
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
            Contact
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {school.website && (
              <a href={school.website} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 13, fontWeight: 600, color: "var(--brown-dark)", textDecoration: "none",
              }}>
                <Globe style={{ width: 13, height: 13, color: "var(--muted)", flexShrink: 0 }} />
                Official website
                <ExternalLink style={{ width: 11, height: 11, opacity: 0.5 }} />
              </a>
            )}
            {school.phone && (
              <a href={`tel:${school.phone}`} style={{
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 13, fontWeight: 600, color: "var(--dark)", textDecoration: "none",
              }}>
                <Phone style={{ width: 13, height: 13, color: "var(--muted)", flexShrink: 0 }} />
                {school.phone}
              </a>
            )}
            {school.email && (
              <a href={`mailto:${school.email}`} style={{
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 13, fontWeight: 600, color: "var(--dark)", textDecoration: "none",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                <Mail style={{ width: 13, height: 13, color: "var(--muted)", flexShrink: 0 }} />
                {school.email}
              </a>
            )}
            {(school.address_line1 || school.area) && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <MapPin style={{ width: 13, height: 13, color: "var(--muted)", flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                  {school.address_line1 && <>{school.address_line1}<br /></>}
                  {school.address_line2 && <>{school.address_line2}<br /></>}
                  {[school.area, school.city, school.pincode && `– ${school.pincode}`].filter(Boolean).join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {school.last_data_updated_at && (
        <p style={{ fontSize: 11, color: "var(--muted)", textAlign: "center" }}>
          Last updated:{" "}
          {new Date(school.last_data_updated_at).toLocaleDateString("en-IN", {
            year: "numeric", month: "short", day: "numeric",
          })}
        </p>
      )}
    </div>
  );
}
