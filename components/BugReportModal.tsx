"use client";

import { useState } from "react";
import { X, AlertTriangle, Send, Check } from "lucide-react";

type BugType = "general" | "city" | "area" | "school" | "";

const PLACEHOLDERS: Record<string, string> = {
  general: "Which page or feature is causing the issue? (e.g., map not loading, filter sidebar)",
  city:    "Which city? (e.g., Delhi, Bengaluru)",
  area:    "Which area or locality? (e.g., Dwarka Sec-10, Whitefield)",
  school:  "Enter the exact name of the school",
};

const LABELS: Record<string, string> = {
  general: "Page / Feature details",
  city:    "City name",
  area:    "Area / Locality",
  school:  "School name",
};

export function BugReportModal() {
  const [open, setOpen]               = useState(false);
  const [bugType, setBugType]         = useState<BugType>("");
  const [context, setContext]         = useState("");
  const [description, setDescription] = useState("");
  const [wantContact, setWantContact] = useState<boolean | null>(null);
  const [email, setEmail]             = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);

  const handleTypeChange = (t: BugType) => {
    setBugType(t);
    setContext(""); // clear stale context on type switch
  };

  const reset = () => {
    setBugType(""); setContext(""); setDescription("");
    setWantContact(null); setEmail(""); setSubmitted(false);
  };

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/v1/bug-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bugType, context, description, wantContact, email }),
      });
      setSubmitted(true);
      setTimeout(() => { setOpen(false); reset(); }, 2500);
    } catch {
      // fail silently — still mark submitted
      setSubmitted(true);
      setTimeout(() => { setOpen(false); reset(); }, 2500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        title="Report an issue"
        style={{
          position: "fixed", bottom: 80, right: 20, zIndex: 999,
          width: 44, height: 44, borderRadius: "50%",
          background: "var(--beige-500)", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          cursor: "pointer", transition: "transform 0.15s, background 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--beige-600)")}
        onMouseLeave={e => (e.currentTarget.style.background = "var(--beige-500)")}
      >
        <AlertTriangle size={18} color="white" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => { setOpen(false); reset(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Modal */}
      {open && (
        <div style={{
          position: "fixed", top: "50%", left: "50%", zIndex: 1001,
          transform: "translate(-50%,-50%)",
          width: "min(460px, 95vw)",
          background: "var(--beige-100)",
          borderRadius: "var(--radius)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          border: "1px solid var(--beige-400)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "18px 20px 14px",
            borderBottom: "1px solid var(--beige-400)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <AlertTriangle size={16} color="var(--muted)" />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--dark)" }}>
                Report an Issue
              </h3>
            </div>
            <button
              onClick={() => { setOpen(false); reset(); }}
              style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}
            >
              <X size={18} />
            </button>
          </div>

          {submitted ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "#dcfce7", display: "flex",
                alignItems: "center", justifyContent: "center", margin: "0 auto 12px",
              }}>
                <Check size={22} color="#16a34a" />
              </div>
              <p style={{ fontWeight: 700, fontSize: 15, color: "var(--dark)", marginBottom: 4 }}>
                Report submitted — thank you!
              </p>
              <p style={{ fontSize: 12, color: "var(--muted)" }}>
                We'll look into it shortly.
              </p>
            </div>
          ) : (
            <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 14 }}>

              {/* 1. Bug type */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Where is the issue?
                </label>
                <select
                  value={bugType}
                  onChange={(e) => handleTypeChange(e.target.value as BugType)}
                  style={{
                    width: "100%", padding: "10px 12px",
                    border: "1.5px solid var(--beige-500)",
                    borderRadius: 10, fontSize: 13, color: "var(--dark)",
                    background: "var(--beige-200)", outline: "none",
                  }}
                >
                  <option value="">— Select —</option>
                  <option value="general">General platform issue</option>
                  <option value="city">City-specific issue</option>
                  <option value="area">Area / locality issue</option>
                  <option value="school">School-specific issue</option>
                </select>
              </div>

              {/* 2. Conditional context */}
              {bugType && (
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {LABELS[bugType]}
                  </label>
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder={PLACEHOLDERS[bugType]}
                    style={{
                      width: "100%", padding: "10px 12px",
                      border: "1.5px solid var(--beige-500)",
                      borderRadius: 10, fontSize: 13, color: "var(--dark)",
                      background: "var(--beige-200)", outline: "none",
                    }}
                  />
                </div>
              )}

              {/* 3. Description */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Describe the issue *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is broken or incorrect? (e.g., wrong fee structure, map pins not showing, incorrect school info)"
                  rows={3}
                  style={{
                    width: "100%", padding: "10px 12px",
                    border: "1.5px solid var(--beige-500)",
                    borderRadius: 10, fontSize: 13, color: "var(--dark)",
                    background: "var(--beige-200)", outline: "none",
                    resize: "vertical", fontFamily: "inherit",
                  }}
                />
              </div>

              {/* 4. Follow-up */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Notify me when fixed?
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  {[true, false].map((v) => (
                    <label key={String(v)} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                      <div
                        onClick={() => { setWantContact(v); if (!v) setEmail(""); }}
                        style={{
                          width: 16, height: 16, borderRadius: "50%",
                          border: `2px solid ${wantContact === v ? "var(--brown-dark)" : "var(--beige-500)"}`,
                          background: wantContact === v ? "var(--brown-dark)" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        {wantContact === v && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />}
                      </div>
                      <span style={{ fontSize: 13, color: "var(--dark)" }}>{v ? "Yes" : "No"}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 5. Email (conditional) */}
              {wantContact && (
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Your email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{
                      width: "100%", padding: "10px 12px",
                      border: "1.5px solid var(--beige-500)",
                      borderRadius: 10, fontSize: 13, color: "var(--dark)",
                      background: "var(--beige-200)", outline: "none",
                    }}
                  />
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
                <button
                  onClick={() => { setOpen(false); reset(); }}
                  style={{
                    padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    border: "1.5px solid var(--beige-500)", color: "var(--muted)",
                    background: "transparent", cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!description.trim() || submitting}
                  style={{
                    padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                    border: "none", cursor: description.trim() ? "pointer" : "not-allowed",
                    background: description.trim() ? "var(--dark)" : "var(--beige-400)",
                    color: "white", display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <Send size={13} />
                  {submitting ? "Sending…" : "Submit"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
