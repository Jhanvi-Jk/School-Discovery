import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// The visitor's home location, used for "Nearest to me" and the distance shown on cards.
// It lives only in this browser; coordinates are rounded to ~1 km before they are stored or sent.
export const roundCoord = (n: number) => Math.round(n * 100) / 100;

interface HomeState {
  home: { lat: number; lng: number } | null;
  setHome: (lat: number, lng: number) => void;
  clearHome: () => void;
}

export const useHomeStore = create<HomeState>()(
  persist(
    (set) => ({
      home: null,
      setHome: (lat, lng) => set({ home: { lat: roundCoord(lat), lng: roundCoord(lng) } }),
      clearHome: () => set({ home: null }),
    }),
    {
      name: "schoolfind360-home",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : sessionStorage)),
    }
  )
);
