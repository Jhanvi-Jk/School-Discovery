import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  MapPin, Phone, Globe, Mail, CheckCircle2, Star,
  Users, Bus, Clock, Calendar, IndianRupee, BookOpen,
  Building2, Trophy, Music, Languages, ChevronRight,
  ExternalLink, AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnquiryForm } from "@/components/schools/EnquiryForm";
import { SchoolActionsSidebar } from "@/components/schools/SchoolActionsSidebar";
import {
  formatFeesRange, formatRating, formatSchoolHours,
  getVerificationBadge, cn
} from "@/lib/utils";
import { CURRICULUM_LABELS, SCHOOL_TYPE_LABELS, GENDER_LABELS } from "@/lib/types";

// Dynamic rendering — no static params needed at build time
export const dynamic = "force-dynamic";

// ── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("schools")
    .select("name, description, area, city")
    .eq("slug", params.slug)
    .single();

  if (!data) return { title: "School Not Found" };

  return {
    title: `${data.name} — ${data.area || data.city}`,
    description: data.description || `Explore ${data.name} in ${data.area || data.city}.`,
    openGraph: {
      title: data.name,
      description: data.description || "",
    },
  };
}

// ── Stat box ─────────────────────────────────────────────────────────────────
function StatBox({ icon: Icon, label, value, sub, color = "text-gray-700" }: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={cn("font-bold text-sm", color)}>{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

// ── Rating bar ───────────────────────────────────────────────────────────────
function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-6">{value}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function SchoolProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();

  const { data: school, error } = await supabase
    .from("schools")
    .select(`
      *,
      school_details(*),
      school_curricula(curriculum),
      school_grades(grade_from, grade_to),
      school_languages(language, type),
      school_sports(sports(id, name)),
      school_extracurriculars(extracurriculars(id, name, category)),
      admission_windows(*),
      reviews(
        id, rating_academics, rating_facilities,
        rating_faculty, rating_value, rating_overall,
        title, body, relation, is_verified, created_at,
        users(full_name)
      )
    `)
    .eq("slug", params.slug)
    .single();

  if (error || !school) notFound();

  const details = school.school_details;
  const curricula = (school.school_curricula || []).map((c: any) => c.curriculum);
  const sports = (school.school_sports || []).map((s: any) => s.sports?.name).filter(Boolean);
  const extras = (school.school_extracurriculars || []).map((e: any) => e.extracurriculars?.name).filter(Boolean);
  const languages = school.school_languages || [];
  const admissions = school.admission_windows || [];
  const reviews = school.reviews || [];

  const avgRating = reviews.length
    ? reviews.reduce((s: number, r: any) => s + r.rating_overall, 0) / reviews.length
    : null;
  const avgBreakdown = reviews.length
    ? {
        academics: reviews.reduce((s: number, r: any) => s + r.rating_academics, 0) / reviews.length,
        facilities: reviews.reduce((s: number, r: any) => s + r.rating_facilities, 0) / reviews.length,
        faculty: reviews.reduce((s: number, r: any) => s + r.rating_faculty, 0) / reviews.length,
        value: reviews.reduce((s: number, r: any) => s + r.rating_value, 0) / reviews.length,
      }
    : null;

  const openAdmissions = admissions.filter((a: any) => a.status === "open");
  const badge = getVerificationBadge(school.verified);

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen pb-24">
        {/* Hero */}
        <div className="relative h-56 sm:h-72 bg-gray-200 overflow-hidden">
          {school.cover_image_url ? (
            <Image
              src={school.cover_image_url}
              alt={school.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <div className="flex items-end gap-3">
              {school.logo_url && (
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-white flex-shrink-0">
                  <Image src={school.logo_url} alt="" width={64} height={64} className="object-cover" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", badge.color)}>
                    {badge.verified && <CheckCircle2 className="inline w-3 h-3 mr-1" />}
                    {badge.label}
                  </span>
                  {openAdmissions.length > 0 && (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-medium">
                      Admissions Open
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {school.name}
                </h1>
                <p className="text-white/80 text-sm mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {school.address_line1 ? `${school.address_line1}, ` : ""}
                  {school.area || ""} · {school.city}
                  {school.pincode && ` – ${school.pincode}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-1 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/schools" className="hover:text-blue-600">Schools</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900">{school.name}</span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatBox
                  icon={IndianRupee}
                  label="Annual Fees"
                  value={formatFeesRange(details?.total_fees_min, details?.total_fees_max)}
                />
                {avgRating && (
                  <StatBox
                    icon={Star}
                    label="Overall Rating"
                    value={`${formatRating(avgRating)} / 5`}
                    sub={`${reviews.length} reviews`}
                    color="text-amber-600"
                  />
                )}
                {details?.student_count && (
                  <StatBox
                    icon={Users}
                    label="Students"
                    value={details.student_count.toLocaleString()}
                  />
                )}
                {details?.student_teacher_ratio && (
                  <StatBox
                    icon={Users}
                    label="Student:Teacher"
                    value={`${details.student_teacher_ratio}:1`}
                  />
                )}
              </div>

              {/* About */}
              {school.description && (
                <section className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
                  <p className="text-gray-600 leading-relaxed">{school.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {SCHOOL_TYPE_LABELS[school.type as keyof typeof SCHOOL_TYPE_LABELS]}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {GENDER_LABELS[school.gender as keyof typeof GENDER_LABELS]}
                    </span>
                    {school.established_year && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        Est. {school.established_year}
                      </span>
                    )}
                    {curricula.map((c: string) => (
                      <span key={c} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                        {CURRICULUM_LABELS[c as keyof typeof CURRICULUM_LABELS] || c}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Fees breakdown */}
              {details && (
                <section className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-blue-600" />
                    Fee Breakdown
                  </h2>
                  <div className="space-y-3">
                    {[
                      { label: "Annual Tuition", min: details.annual_tuition_fees_min, max: details.annual_tuition_fees_max },
                      { label: "Development Fee", min: details.development_fees, max: null },
                      { label: "Transport Fee", min: details.transport_fees, max: null },
                      { label: "Activity Fee", min: details.activity_fees, max: null },
                      { label: "Admission Fee (one-time)", min: details.admission_fees, max: null },
                    ]
                      .filter((f) => f.min)
                      .map((fee) => (
                        <div key={fee.label} className="flex justify-between items-center py-2 border-b border-gray-50">
                          <span className="text-sm text-gray-600">{fee.label}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatFeesRange(fee.min, fee.max)}
                          </span>
                        </div>
                      ))}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-bold text-gray-900">Total Annual</span>
                      <span className="text-base font-bold text-blue-700">
                        {formatFeesRange(details.total_fees_min, details.total_fees_max)}
                      </span>
                    </div>
                  </div>
                </section>
              )}

              {/* School info */}
              <section className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">School Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {details?.school_hours_start && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">School Hours</p>
                        <p className="text-sm font-medium text-gray-800">
                          {formatSchoolHours(details.school_hours_start, details.school_hours_end)}
                        </p>
                      </div>
                    </div>
                  )}
                  {details?.has_transport && (
                    <div className="flex items-start gap-3">
                      <Bus className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Transport</p>
                        <p className="text-sm font-medium text-gray-800">Available</p>
                        {details.transport_description && (
                          <p className="text-xs text-gray-500 mt-0.5">{details.transport_description}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {school.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Website</p>
                        <a
                          href={school.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                        >
                          Visit website <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                  {school.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <a href={`tel:${school.phone}`} className="text-sm font-medium text-gray-800 hover:text-blue-600">
                          {school.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Languages */}
                {languages.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <Languages className="w-3.5 h-3.5" /> Languages
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((l: any) => (
                        <span
                          key={`${l.language}-${l.type}`}
                          className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-600"
                        >
                          {l.language}
                          {l.type === "medium_of_instruction" && (
                            <span className="text-blue-500 ml-1">(medium)</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Sports & Extracurriculars */}
              {(sports.length > 0 || extras.length > 0) && (
                <section className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Sports & Extracurriculars</h2>
                  {sports.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" /> Sports
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {sports.map((s: string) => (
                          <span key={s} className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {extras.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Music className="w-4 h-4 text-purple-500" /> Activities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {extras.map((e: string) => (
                          <span key={e} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Admissions */}
              {admissions.length > 0 && (
                <section className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" /> Admissions
                  </h2>
                  <div className="space-y-3">
                    {admissions.map((a: any) => (
                      <div
                        key={a.id}
                        className={cn(
                          "border rounded-xl p-4",
                          a.status === "open" ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-gray-800">
                            {a.academic_year} · {a.grade_from} – {a.grade_to}
                          </span>
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full font-medium",
                              a.status === "open" ? "bg-green-500 text-white" :
                              a.status === "upcoming" ? "bg-blue-100 text-blue-700" :
                              a.status === "waitlist" ? "bg-orange-100 text-orange-700" :
                              "bg-gray-200 text-gray-600"
                            )}
                          >
                            {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                          </span>
                        </div>
                        {a.is_mid_year && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full mr-2">
                            Mid-year
                          </span>
                        )}
                        {(a.opens_at || a.closes_at) && (
                          <p className="text-xs text-gray-500 mt-1">
                            {a.opens_at && `Opens: ${new Date(a.opens_at).toLocaleDateString("en-IN")}`}
                            {a.opens_at && a.closes_at && " · "}
                            {a.closes_at && `Closes: ${new Date(a.closes_at).toLocaleDateString("en-IN")}`}
                          </p>
                        )}
                        {a.notes && <p className="text-xs text-gray-500 mt-1">{a.notes}</p>}
                        {a.application_url && (
                          <a
                            href={a.application_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline mt-2 inline-flex items-center gap-1"
                          >
                            Apply online <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Reviews */}
              <section className="bg-white rounded-2xl p-6 shadow-sm" id="reviews">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" /> Reviews & Ratings
                  {reviews.length > 0 && (
                    <span className="text-sm font-normal text-gray-500">({reviews.length})</span>
                  )}
                </h2>

                {avgBreakdown && (
                  <div className="mb-6 p-4 bg-amber-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl font-bold text-amber-600">
                        {formatRating(avgRating)}
                      </span>
                      <div>
                        <div className="flex gap-0.5 mb-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={cn("w-4 h-4", s <= Math.round(avgRating || 0) ? "fill-amber-400 text-amber-400" : "text-gray-300")}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{reviews.length} reviews</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <RatingBar label="Academics" value={parseFloat(avgBreakdown.academics.toFixed(1))} />
                      <RatingBar label="Facilities" value={parseFloat(avgBreakdown.facilities.toFixed(1))} />
                      <RatingBar label="Faculty" value={parseFloat(avgBreakdown.faculty.toFixed(1))} />
                      <RatingBar label="Value" value={parseFloat(avgBreakdown.value.toFixed(1))} />
                    </div>
                  </div>
                )}

                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">
                    No reviews yet. Be the first to review!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map((r: any) => (
                      <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                              {r.users?.full_name?.[0] || "?"}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {r.users?.full_name || "Anonymous"}
                              </p>
                              <p className="text-xs text-gray-400 capitalize">{r.relation.replace(/_/g, " ")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-semibold text-gray-700">{r.rating_overall}</span>
                          </div>
                        </div>
                        {r.title && <p className="text-sm font-semibold text-gray-800 mb-1">{r.title}</p>}
                        {r.body && <p className="text-sm text-gray-600">{r.body}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Sticky sidebar */}
            <aside className="lg:col-span-1">
              <SchoolActionsSidebar school={school} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
