import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CityKey = "bangalore" | "delhi" | "chennai" | "pune" | "mumbai" | "kolkata";

export const CITY_LABELS: Record<CityKey, string> = {
  bangalore: "Bengaluru",
  delhi:     "Delhi",
  chennai:   "Chennai",
  pune:      "Pune",
  mumbai:    "Mumbai",
  kolkata:   "Kolkata",
};

// Maps city key → exact value stored in the `city` column of the DB
export const CITY_DB_NAMES: Record<CityKey, string> = {
  bangalore: "Bengaluru",
  delhi:     "Delhi",
  chennai:   "Chennai",
  pune:      "Pune",
  mumbai:    "Mumbai",
  kolkata:   "Kolkata",
};

export const CITY_CENTERS: Record<CityKey, [number, number, number]> = {
  // [lat, lng, zoom]
  bangalore: [12.9716, 77.5946, 11],
  delhi:     [28.6280, 77.0900, 10],
  chennai:   [13.0827, 80.2707, 11],
  pune:      [18.5204, 73.8567, 11],
  mumbai:    [19.0760, 72.8777, 11],
  kolkata:   [22.5726, 88.3639, 11],
};

interface CityState {
  selectedCity: CityKey | null;
  setCity: (city: CityKey) => void;
  clearCity: () => void;
}

export const useCityStore = create<CityState>()(
  persist(
    (set) => ({
      selectedCity: null,
      setCity:  (city) => set({ selectedCity: city }),
      clearCity: ()   => set({ selectedCity: null }),
    }),
    { name: "schoolfinder-city" }
  )
);
