import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ShortlistedSchool {
  id: string;
  slug: string;
  name: string;
  area?: string;
  city?: string;
  type?: string;
  cover_image_url?: string;
  website?: string;
  total_fees_min?: number;
  total_fees_max?: number;
  curricula?: string[];
  avg_rating?: number;
  savedAt: number; // timestamp
}

interface ShortlistState {
  schools: ShortlistedSchool[];
  add: (school: ShortlistedSchool) => void;
  remove: (id: string) => void;
  isSaved: (id: string) => boolean;
  clear: () => void;
}

export const useShortlistStore = create<ShortlistState>()(
  persist(
    (set, get) => ({
      schools: [],

      add: (school) =>
        set((state) => {
          if (state.schools.find((s) => s.id === school.id)) return state;
          return { schools: [{ ...school, savedAt: Date.now() }, ...state.schools] };
        }),

      remove: (id) =>
        set((state) => ({
          schools: state.schools.filter((s) => s.id !== id),
        })),

      isSaved: (id) => get().schools.some((s) => s.id === id),

      clear: () => set({ schools: [] }),
    }),
    { name: "sf360-shortlist" }
  )
);
