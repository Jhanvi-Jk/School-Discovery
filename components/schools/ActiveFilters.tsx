"use client";

import { X } from "lucide-react";
import { useFilterStore } from "@/store/filterStore";
import { CURRICULUM_LABELS, SCHOOL_TYPE_LABELS, GENDER_LABELS } from "@/lib/types";
import { formatFees } from "@/lib/utils";

export function ActiveFilters() {
  const { filters, setFilter, toggleArrayFilter, resetFilters, activeFilterCount } =
    useFilterStore();
  const count = activeFilterCount();

  if (count === 0) return null;

  const chips: { label: string; onRemove: () => void }[] = [];

  filters.areas.forEach((a) =>
    chips.push({ label: a, onRemove: () => toggleArrayFilter("areas", a) })
  );
  filters.curricula.forEach((c) =>
    chips.push({
      label: CURRICULUM_LABELS[c],
      onRemove: () => toggleArrayFilter("curricula", c),
    })
  );
  filters.types.forEach((t) =>
    chips.push({
      label: SCHOOL_TYPE_LABELS[t],
      onRemove: () => toggleArrayFilter("types", t),
    })
  );
  filters.gender.forEach((g) =>
    chips.push({
      label: GENDER_LABELS[g],
      onRemove: () => toggleArrayFilter("gender", g),
    })
  );
  filters.grades.forEach((g) =>
    chips.push({ label: g, onRemove: () => toggleArrayFilter("grades", g) })
  );
  if (filters.fees_min > 0 || filters.fees_max < 1000000) {
    chips.push({
      label: `${formatFees(filters.fees_min)} – ${
        filters.fees_max >= 1000000 ? "No limit" : formatFees(filters.fees_max)
      }`,
      onRemove: () => {
        setFilter("fees_min", 0);
        setFilter("fees_max", 1000000);
      },
    });
  }
  if (filters.admissions_open) {
    chips.push({
      label: "Admissions open",
      onRemove: () => setFilter("admissions_open", null),
    });
  }
  if (filters.mid_year) {
    chips.push({
      label: "Mid-year",
      onRemove: () => setFilter("mid_year", null),
    });
  }
  if (filters.has_transport) {
    chips.push({
      label: "Transport",
      onRemove: () => setFilter("has_transport", null),
    });
  }
  filters.sports.forEach((s) =>
    chips.push({ label: s, onRemove: () => toggleArrayFilter("sports", s) })
  );
  filters.extracurriculars.forEach((e) =>
    chips.push({
      label: e,
      onRemove: () => toggleArrayFilter("extracurriculars", e),
    })
  );
  filters.languages.forEach((l) =>
    chips.push({
      label: l,
      onRemove: () => toggleArrayFilter("languages", l),
    })
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-500 font-medium">Active:</span>
      {chips.map((chip, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200 font-medium"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="hover:text-blue-900 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        onClick={resetFilters}
        className="text-xs text-gray-500 hover:text-red-600 underline transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}
