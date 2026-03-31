import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SchoolSummary } from "@/lib/types";

const MAX_COMPARE = 3;

interface CompareState {
  schools: SchoolSummary[];
  addSchool: (school: SchoolSummary) => void;
  removeSchool: (id: string) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
  canAdd: () => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      schools: [],

      addSchool: (school) =>
        set((state) => {
          if (state.schools.length >= MAX_COMPARE) return state;
          if (state.schools.find((s) => s.id === school.id)) return state;
          return { schools: [...state.schools, school] };
        }),

      removeSchool: (id) =>
        set((state) => ({
          schools: state.schools.filter((s) => s.id !== id),
        })),

      clearAll: () => set({ schools: [] }),

      isInCompare: (id) => get().schools.some((s) => s.id === id),

      canAdd: () => get().schools.length < MAX_COMPARE,
    }),
    {
      name: "school-compare",
    }
  )
);
