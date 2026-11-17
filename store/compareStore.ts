import { create } from "zustand";
import { persist } from "zustand/middleware";

/** The one compare limit — the tray label, card buttons and /compare page all read it. */
export const MAX_COMPARE = 4;

export interface CompareItem {
  id: string;
  slug: string;
  name: string;
}

interface CompareState {
  schools: CompareItem[];
  addSchool: (school: CompareItem) => void;
  removeSchool: (id: string) => void;
  setSchools: (schools: CompareItem[]) => void;
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
          return { schools: [...state.schools, { id: school.id, slug: school.slug, name: school.name }] };
        }),

      removeSchool: (id) =>
        set((state) => ({
          schools: state.schools.filter((s) => s.id !== id),
        })),

      setSchools: (schools) => set({ schools: schools.slice(0, MAX_COMPARE) }),

      clearAll: () => set({ schools: [] }),

      isInCompare: (id) => get().schools.some((s) => s.id === id),

      canAdd: () => get().schools.length < MAX_COMPARE,
    }),
    {
      name: "school-compare",
      // Rehydrated after mount (see Providers) so server and first client render match
      skipHydration: true,
    }
  )
);
