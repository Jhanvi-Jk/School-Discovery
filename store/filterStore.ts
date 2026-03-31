import { create } from "zustand";
import { DEFAULT_FILTERS, SchoolFilters, SortOption } from "@/lib/types";

interface FilterState {
  filters: SchoolFilters;
  sort: SortOption;
  viewMode: "grid" | "list";
  setFilter: <K extends keyof SchoolFilters>(key: K, value: SchoolFilters[K]) => void;
  setSort: (sort: SortOption) => void;
  setViewMode: (mode: "grid" | "list") => void;
  toggleArrayFilter: <K extends keyof SchoolFilters>(
    key: K,
    value: SchoolFilters[K] extends Array<infer T> ? T : never
  ) => void;
  resetFilters: () => void;
  resetFilter: (key: keyof SchoolFilters) => void;
  activeFilterCount: () => number;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: { ...DEFAULT_FILTERS },
  sort: "relevance",
  viewMode: "grid",

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  setSort: (sort) => set({ sort }),

  setViewMode: (mode) => set({ viewMode: mode }),

  toggleArrayFilter: (key, value) =>
    set((state) => {
      const current = state.filters[key] as string[];
      const updated = current.includes(value as string)
        ? current.filter((v) => v !== value)
        : [...current, value as string];
      return { filters: { ...state.filters, [key]: updated } };
    }),

  resetFilters: () =>
    set({ filters: { ...DEFAULT_FILTERS } }),

  resetFilter: (key) =>
    set((state) => ({
      filters: { ...state.filters, [key]: DEFAULT_FILTERS[key] },
    })),

  activeFilterCount: () => {
    const { filters } = get();
    let count = 0;
    if (filters.query) count++;
    if (filters.areas.length) count++;
    if (filters.curricula.length) count++;
    if (filters.grades.length) count++;
    if (filters.gender.length) count++;
    if (filters.types.length) count++;
    if (filters.fees_min > 0 || filters.fees_max < 1000000) count++;
    if (filters.has_transport !== null) count++;
    if (filters.sports.length) count++;
    if (filters.extracurriculars.length) count++;
    if (filters.languages.length) count++;
    if (filters.admissions_open !== null) count++;
    if (filters.mid_year !== null) count++;
    if (filters.str_max !== null) count++;
    return count;
  },
}));
