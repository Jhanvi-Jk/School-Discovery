const R = 6371; // km

/** Straight-line distance between two coordinates in kilometres. */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Rough door-to-door drive time. Straight-line distance understates real road distance, and city
 * traffic dominates, so this is a range with a stated assumption — never a promise.
 */
export function commuteEstimate(km: number): { min: number; max: number } {
  const road = km * 1.35;                 // typical road-vs-straight-line detour in Indian cities
  return {
    min: Math.max(5, Math.round((road / 25) * 60 / 5) * 5),  // ~25 km/h off-peak
    max: Math.max(10, Math.round((road / 12) * 60 / 5) * 5), // ~12 km/h school-run traffic
  };
}
