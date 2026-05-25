/**
 * savedPrefsStore — explicit user saves, persisted to localStorage.
 *
 * Lifecycle:
 *  - User clicks "Save filters & city" → writes selectedCity + filters here.
 *  - On fresh page load (Ctrl+R / new tab) the schools page reads this store
 *    and restores the saved city + filters (see sf_session_init pattern in page.tsx).
 *  - cityStore / filterStore both use sessionStorage, so they reset on reload
 *    and are re-populated from here on demand.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SchoolFilters } from "@/lib/types";
import type { CityKey } from "./cityStore";

interface SavedPrefsState {
  isSaved: boolean;
  savedCity: CityKey | null;
  savedFilters: SchoolFilters | null;
  savedAt: string | null;
  savePrefs: (city: CityKey | null, filters: SchoolFilters) => void;
  clearPrefs: () => void;
}

export const useSavedPrefsStore = create<SavedPrefsState>()(
  persist(
    (set) => ({
      isSaved: false,
      savedCity: null,
      savedFilters: null,
      savedAt: null,

      savePrefs: (city, filters) =>
        set({
          isSaved: true,
          savedCity: city,
          savedFilters: filters,
          savedAt: new Date().toISOString(),
        }),

      clearPrefs: () =>
        set({ isSaved: false, savedCity: null, savedFilters: null, savedAt: null }),
    }),
    { name: "schoolfinder-prefs" } // localStorage (survives reload)
  )
);
