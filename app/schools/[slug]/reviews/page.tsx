"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Send, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";

const RELATION_LABELS: Record<string, string> = {
  current_parent:  "Current Parent",
  former_parent:   "Former Parent",
  current_student: "Current Student",
  alumnus:         "Alumnus / Alumna",
};

const RATING_FIELDS = [
  { key: "rating_overall",    label: "Overall" },
  { key: "rating_academics",  label: "Academics" },
  { key: "rating_facilities", label: "Facilities" },
  { key: "rating_faculty",    label: "Faculty" },
  { key: "rating_value",      label: "Value for Money" },
];

function StarRow({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
          style={{
            background: "none", border: "none", padding: 1, cursor: onChange ? "pointer" : "default",
          }}
        >
          <Star
            size={onChange ? 22 : 16}
            style={{
              fill: n <= (hover || value) ? "#f59e0b" : "none",
              color: n <= (hover || value) ? "#f59e0b" : "#d4c5b5",
              transition: "fill 0.1s",
            }}
          />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ label, value }: { label: string; value: string | null }) {
  const pct = value ? (parseFloat(value) / 5) * 100 : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
        <span style={{ color: "var(--dark)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontWeight: 700, color: "var(--brown-dark)" }}>{value ?? "—"}</span>
      </div>
      <div style={{ height: 6, background: "var(--beige-400)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#f59e0b", borderRadius: 99, transition: "width 0.4s" }} />
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [form, setForm] = useState({
    rating_overall: 0, rating_academics: 0,
    rating_facilities: 0, rating_faculty: 0, rating_value: 0,
    title: "", review_body: "", relation: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    fetch(`/api/v1/schools/${slug}/reviews`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user) { router.push("/login"); return; }
    const ratings = [form.rating_overall, form.rating_academics, form.rating_facilities, form.rating_faculty, form.rating_value];
    if (ratings.some((r) => r === 0)) { setError("Please fill in all star ratings"); return; }
    if (!form.relation) { setError("Please select your relation to the school"); return; }
    setSubmitting(true);
    const res = await fetch(`/api/v1/schools/${slug}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (json.success) {
      setSubmitted(true);
      fetch(`/api/v1/schools/${slug}/reviews`).then((r) => r.json()).then(setData);
    } else {
      setError(json.error || "Something went wrong");
    }
    setSubmitting(false);
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: "calc(100vh - 56px)", background: "var(--beige-300)", padding: "20px 16px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          {/* Back link */}
          <Link href={`/schools/${slug}`} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "var(--muted)", marginBottom: 16, textDecoration: "none",
          }}>
            <ArrowLeft size={14} /> Back to school
          </Link>

          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}>Loading reviews…</div>
          ) : (
            <>
              {/* Header */}
              <div style={{
                background: "var(--beige-200)", border: "1px solid var(--beige-500)",
                borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: 16,
              }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 2 }}>
                  Reviews — {data?.school?.name}
                </h1>
                <p style={{ fontSize: 13, color: "var(--muted)" }}>
                  {data?.count || 0} review{data?.count !== 1 ? "s" : ""}
                </p>

                {/* Average ratings */}
                {data?.count > 0 && (
                  <div style={{ marginTop: 16, maxWidth: 340 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <span style={{ fontSize: 36, fontWeight: 800, color: "var(--dark)" }}>
                        {data.averages.overall}
                      </span>
                      <div>
                        <StarRow value={Math.round(parseFloat(data.averages.overall))} />
                        <span style={{ fontSize: 12, color: "var(--muted)" }}>Overall average</span>
                      </div>
                    </div>
                    <RatingBar label="Academics"  value={data.averages.academics} />
                    <RatingBar label="Facilities" value={data.averages.facilities} />
                    <RatingBar label="Faculty"    value={data.averages.faculty} />
                    <RatingBar label="Value for Money" value={data.averages.value} />
                  </div>
                )}
              </div>

              {/* Write a review */}
              <div style={{
                background: "var(--beige-200)", border: "1px solid var(--beige-500)",
                borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: 16,
              }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Write a Review</h2>

                {!user ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <p style={{ color: "var(--muted)", marginBottom: 12, fontSize: 14 }}>
                      You need to sign in to write a review
                    </p>
                    <Link href="/login" style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "var(--dark)", color: "white", padding: "10px 20px",
                      borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none",
                    }}>
                      <LogIn size={14} /> Sign in to Review
                    </Link>
                  </div>
                ) : submitted ? (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "var(--dark)" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                    <p style={{ fontWeight: 700 }}>Thank you for your review!</p>
                    <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>It has been posted below.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Star ratings */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", marginBottom: 16 }}>
                      {RATING_FIELDS.map((f) => (
                        <div key={f.key}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>{f.label}</p>
                          <StarRow
                            value={(form as any)[f.key]}
                            onChange={(v) => setForm((prev) => ({ ...prev, [f.key]: v }))}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Relation */}
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 4 }}>
                        Your relation to the school
                      </label>
                      <select
                        value={form.relation}
                        onChange={(e) => setForm((p) => ({ ...p, relation: e.target.value }))}
                        style={{
                          width: "100%", padding: "9px 12px", borderRadius: 10,
                          border: "1px solid var(--beige-500)", background: "var(--beige-100)",
                          fontSize: 13, color: "var(--dark)", outline: "none",
                        }}
                      >
                        <option value="">Select…</option>
                        {Object.entries(RELATION_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </div>

                    {/* Title */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 4 }}>
                        Review title (optional)
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Great school, excellent faculty"
                        style={{
                          width: "100%", padding: "9px 12px", borderRadius: 10,
                          border: "1px solid var(--beige-500)", background: "var(--beige-100)",
                          fontSize: 13, color: "var(--dark)", outline: "none",
                        }}
                      />
                    </div>

                    {/* Body */}
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 4 }}>
                        Your review (optional)
                      </label>
                      <textarea
                        value={form.review_body}
                        onChange={(e) => setForm((p) => ({ ...p, review_body: e.target.value }))}
                        rows={4}
                        placeholder="Share your experience with this school…"
                        style={{
                          width: "100%", padding: "9px 12px", borderRadius: 10,
                          border: "1px solid var(--beige-500)", background: "var(--beige-100)",
                          fontSize: 13, color: "var(--dark)", outline: "none", resize: "vertical",
                        }}
                      />
                    </div>

                    {error && (
                      <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 10 }}>{error}</p>
                    )}

                    <button type="submit" disabled={submitting} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: "var(--dark)", color: "white",
                      padding: "10px 20px", borderRadius: 10,
                      fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
                      opacity: submitting ? 0.6 : 1,
                    }}>
                      <Send size={14} /> {submitting ? "Submitting…" : "Submit Review"}
                    </button>
                  </form>
                )}
              </div>

              {/* All reviews */}
              {(data?.data || []).length === 0 ? (
                <div style={{
                  background: "var(--beige-200)", border: "1px solid var(--beige-500)",
                  borderRadius: "var(--radius)", padding: "40px 24px", textAlign: "center",
                }}>
                  <p style={{ fontSize: 32, marginBottom: 8 }}>💬</p>
                  <p style={{ fontWeight: 700, color: "var(--dark)" }}>No reviews yet</p>
                  <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Be the first to share your experience!</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {(data.data || []).map((review: any) => (
                    <div key={review.id} style={{
                      background: "var(--beige-200)", border: "1px solid var(--beige-500)",
                      borderRadius: "var(--radius)", padding: "18px 20px",
                    }}>
                      {/* Review header */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <StarRow value={review.rating_overall} />
                            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--dark)" }}>
                              {review.rating_overall}/5
                            </span>
                          </div>
                          {review.title && (
                            <p style={{ fontWeight: 600, fontSize: 15, color: "var(--dark)", marginTop: 4 }}>
                              {review.title}
                            </p>
                          )}
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--dark)" }}>
                            {review.users?.full_name || "Anonymous"}
                          </p>
                          <p style={{ fontSize: 11, color: "var(--muted)" }}>
                            {RELATION_LABELS[review.relation] || review.relation}
                          </p>
                          <p style={{ fontSize: 11, color: "var(--muted)" }}>
                            {new Date(review.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>

                      {/* Body */}
                      {review.body && (
                        <p style={{ fontSize: 13, color: "var(--dark)", lineHeight: 1.6, marginBottom: 12 }}>
                          {review.body}
                        </p>
                      )}

                      {/* Sub-ratings */}
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {[
                          { label: "Academics",  val: review.rating_academics },
                          { label: "Facilities", val: review.rating_facilities },
                          { label: "Faculty",    val: review.rating_faculty },
                          { label: "Value",      val: review.rating_value },
                        ].map((r) => (
                          <div key={r.label} style={{
                            background: "var(--beige-300)", borderRadius: 8,
                            padding: "4px 10px", fontSize: 12,
                          }}>
                            <span style={{ color: "var(--muted)" }}>{r.label}: </span>
                            <span style={{ fontWeight: 700, color: "var(--dark)" }}>{r.val}/5</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
