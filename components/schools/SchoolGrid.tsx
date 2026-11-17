"use client";

import { SchoolCard } from "@/components/schools/SchoolCard";
import { CompareTray } from "@/components/schools/CompareTray";
import type { CatalogSchool } from "@/lib/schools/core";

/** Static grid of school cards for server-rendered listing pages (area, board, city). */
export function SchoolGrid({ schools, showCity }: { schools: CatalogSchool[]; showCity?: boolean }) {
  return (
    <>
      <div className="school-grid">
        {schools.map((s) => <SchoolCard key={s.id} school={s} showCity={showCity} />)}
      </div>
      <CompareTray />
    </>
  );
}
