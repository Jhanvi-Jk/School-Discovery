"use client";

import Link from "next/link";
import { MapPin, IndianRupee, Check, Plus, MessageSquare, Heart, BadgeCheck, Navigation, Star } from "lucide-react";
import { formatFeesRange } from "@/lib/utils";
import { commuteEstimate } from "@/lib/geo";
import { curriculumLabel, gradeRangeLabel, type CatalogSchool } from "@/lib/schools/core";
import { SCHOOL_TYPE_LABELS, GENDER_LABELS, type SchoolType, type SchoolGender } from "@/lib/types";
import { useCompareStore, MAX_COMPARE } from "@/store/compareStore";
import { useShortlistStore } from "@/store/shortlistStore";

interface SchoolCardProps {
  school: CatalogSchool;
  highlighted?: boolean;
  /** Show the city next to the area (used when results span several cities) */
  showCity?: boolean;
  distanceKm?: number | null;
  onHover?: (id: string | null) => void;
}

const ADMISSION_STYLE: Record<string, { bg: string; fg: string }> = {
  open: { bg: "#dcfce7", fg: "#166534" },
  upcoming: { bg: "#fef3c7", fg: "#92400e" },
  waitlist: { bg: "#e0e7ff", fg: "#3730a3" },
  closed: { bg: "var(--beige-300)", fg: "var(--muted)" },
};

export function SchoolCard({ school, highlighted, showCity, distanceKm, onHover }: SchoolCardProps) {
  const inCompare = useCompareStore((s) => s.schools.some((x) => x.id === school.id));
  const compareFull = useCompareStore((s) => s.schools.length >= MAX_COMPARE);
  const { addSchool, removeSchool } = useCompareStore.getState();
  const saved = useShortlistStore((s) => s.schools.some((x) => x.id === school.id));

  const commute = distanceKm != null ? commuteEstimate(distanceKm) : null;
  const where = [school.area, showCity ? school.city : null].filter(Boolean).join(", ") || school.city;
  const badge = ADMISSION_STYLE[school.admission.state];
  const gradeSpan = gradeRangeLabel(school.grades);

  const toggleShortlist = () => {
    const store = useShortlistStore.getState();
    if (saved) store.remove(school.id);
    else store.add({
      id: school.id, slug: school.slug, name: school.name,
      area: school.area ?? undefined, city: school.city, type: school.type,
      total_fees_min: school.feesMin ?? undefined, total_fees_max: school.feesMax ?? undefined,
      curricula: school.curricula, avg_rating: school.rating ?? undefined, savedAt: Date.now(),
    });
  };

  return (
    <article
      id={`card-${school.slug}`}
      className={`school-card${highlighted ? " is-highlighted" : ""}`}
      onMouseEnter={() => onHover?.(school.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <button
        type="button"
        onClick={toggleShortlist}
        className={`card-heart${saved ? " on" : ""}`}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${school.name} from shortlist` : `Save ${school.name} to shortlist`}
        title={saved ? "Remove from shortlist" : "Save to shortlist"}
      >
        <Heart size={16} />
      </button>

      <div className="card-badges">
        {school.curricula.length > 0
          ? school.curricula.map((c) => <span key={c} className="card-badge">{curriculumLabel(c)}</span>)
          : <span className="card-badge card-badge-muted" title="We haven't confirmed this school's board yet">Board not listed</span>}
        {gradeSpan && <span className="card-badge card-badge-grade">{gradeSpan}</span>}
      </div>

      <h3 className="card-name"><Link prefetch={false} href={`/schools/${school.slug}`}>{school.name}</Link></h3>

      <div className="card-meta">
        <MapPin size={12} aria-hidden="true" />
        <span>{where}</span>
        <span aria-hidden="true">·</span>
        <span>{SCHOOL_TYPE_LABELS[school.type as SchoolType] ?? school.type}</span>
        {school.gender && school.gender !== "coed" && (
          <><span aria-hidden="true">·</span><span>{GENDER_LABELS[school.gender as SchoolGender] ?? school.gender}</span></>
        )}
      </div>

      <div className="card-trust">
        {school.completeness.showVerified ? (
          <span className="pill pill-green"><BadgeCheck size={12} /> Verified</span>
        ) : (
          <span
            className="card-completeness"
            title={school.completeness.missing.length ? `Missing: ${school.completeness.missing.slice(0, 5).join(", ")}` : undefined}
          >
            <span aria-hidden="true" className="bar"><span style={{ width: `${school.completeness.score}%` }} /></span>
            Profile {school.completeness.score}% complete
          </span>
        )}
        {distanceKm != null && commute && (
          <span className="card-distance" title="Straight-line distance from your location; drive time is a rough range">
            <Navigation size={11} /> {distanceKm} km · ~{commute.min}–{commute.max} min
          </span>
        )}
      </div>

      <div className="card-stats">
        {(school.feesMin || school.feesMax) ? (
          <span className="card-stat"><IndianRupee size={12} aria-hidden="true" />{formatFeesRange(school.feesMin, school.feesMax)}<span className="sr-only"> per year</span></span>
        ) : null}
        {school.reviewCount > 0 && school.rating != null && (
          <span className="card-stat"><Star size={12} className="star" aria-hidden="true" />{school.rating.toFixed(1)} ({school.reviewCount})</span>
        )}
        {badge && school.admission.label && (
          <span className="pill" style={{ background: badge.bg, color: badge.fg }}>{school.admission.label}</span>
        )}
      </div>

      {school.about && <p className="card-about">{school.about}</p>}

      <div className="card-actions">
        <Link prefetch={false} href={`/schools/${school.slug}`} className="btn-view">View school →</Link>
        <Link prefetch={false} href={`/schools/${school.slug}/reviews`} className="btn-ghost" aria-label={`Reviews of ${school.name}`}>
          <MessageSquare size={13} /> Reviews
        </Link>
        <button
          type="button"
          onClick={() => (inCompare ? removeSchool(school.id) : addSchool(school))}
          disabled={!inCompare && compareFull}
          title={!inCompare && compareFull ? `You can compare up to ${MAX_COMPARE} schools` : undefined}
          className={`btn-compare${inCompare ? " added" : ""}`}
        >
          {inCompare ? <><Check size={13} /> Added</> : <><Plus size={13} /> Compare</>}
        </button>
      </div>
    </article>
  );
}
