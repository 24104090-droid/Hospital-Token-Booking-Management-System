/**
 * Utility functions for Geolocation, Haversine Distance, ETAs, and Navigation URLs
 */

// Default center coordinates (Tirunelveli Junction / District Center)
export const DEFAULT_COORDINATES = {
  lat: 8.7289,
  lng: 77.6920,
  name: 'Tirunelveli Junction (Central)'
};

// Common Tirunelveli Localities for quick manual selection (useful for desktop / privacy)
export const LOCALITY_PRESETS = [
  { id: 'tvl_jn', name: 'Tirunelveli Junction', lat: 8.7289, lng: 77.6920 },
  { id: 'palayamkottai', name: 'Palayamkottai (High Grounds)', lat: 8.7275, lng: 77.7340 },
  { id: 'vannarpettai', name: 'Vannarpettai', lat: 8.7340, lng: 77.7050 },
  { id: 'melapalayam', name: 'Melapalayam', lat: 8.7180, lng: 77.7180 },
  { id: 'nellai_town', name: 'Tirunelveli Town', lat: 8.7325, lng: 77.6890 },
  { id: 'perumalpuram', name: 'Perumalpuram', lat: 8.7050, lng: 77.7290 }
];

/**
 * Calculates distance between two GPS coordinates using the Haversine formula
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in kilometers (1 decimal place)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (
    lat1 === undefined || lat1 === null ||
    lon1 === undefined || lon1 === null ||
    lat2 === undefined || lat2 === null ||
    lon2 === undefined || lon2 === null
  ) {
    return 2.5; // safe fallback
  }

  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
};

/**
 * Estimates city drive time based on distance (average speed ~25 km/h in Tirunelveli)
 * @param {number} distanceKm 
 * @returns {string} e.g. "8 mins"
 */
export const calculateETA = (distanceKm) => {
  if (!distanceKm || distanceKm <= 0) return '3 mins';
  // ~2.5 mins per km + 2 min buffer
  const mins = Math.max(3, Math.round(distanceKm * 2.5 + 1));
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs} hr ${remMins} mins`;
  }
  return `${mins} mins`;
};

/**
 * Generates direct Google Maps Navigation / Turn-by-Turn URL
 */
export const getDirectionsUrl = (destLat, destLng, sourceLat, sourceLng) => {
  if (sourceLat && sourceLng) {
    return `https://www.google.com/maps/dir/?api=1&origin=${sourceLat},${sourceLng}&destination=${destLat},${destLng}&travelmode=driving`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
};

/**
 * Filter items by maximum radius in kilometers
 */
export const filterByRadius = (items, userCoords, maxRadiusKm, getDistanceFn = null) => {
  if (!maxRadiusKm || maxRadiusKm === 'all' || maxRadiusKm >= 999) {
    return items;
  }
  const numericRadius = Number(maxRadiusKm);
  return items.filter((item) => {
    if (getDistanceFn && item.location?.lat) {
      return getDistanceFn(item.location.lat, item.location.lng) <= numericRadius;
    }
    const itemLat = item.location?.lat;
    const itemLng = item.location?.lng;
    if (!itemLat || !itemLng) return (item.distance || 2.5) <= numericRadius;
    const dist = calculateDistance(userCoords.lat, userCoords.lng, itemLat, itemLng);
    return dist <= numericRadius;
  });
};

/**
 * Intelligent composite score for "Best Match" hospital sorting:
 * Considers Star Rating, Live Queue Wait Time, Proximity Distance,
 * 24/7 Emergency Readiness, Verified Status, and Consultation Affordability.
 */
export const calculateBestMatchScore = (hospital, distance = null) => {
  if (!hospital) return 0;
  const dist = distance !== null && distance !== undefined ? distance : (hospital.distance || 2.5);
  const wait = hospital.currentWaitTime || hospital.averageWaitMins || 15;
  const rating = hospital.rating || 4.0;
  
  // Rating points (max 100)
  const ratingScore = rating * 20;
  // Penalty for long queue wait time (-1 point per minute)
  const waitPenalty = wait * 1.0;
  // Penalty for farther distance (-2.2 points per km)
  const distPenalty = dist * 2.2;
  // Bonus for verified certification
  const verifiedBonus = hospital.verified ? 10 : 0;
  // Bonus for 24/7 Emergency casualty
  const emergencyBonus = hospital.emergencyAvailable ? 8 : 0;
  // Bonus for free or affordable OPD consultation
  const feeBonus = hospital.consultationFee === 0 ? 12 : (hospital.consultationFee <= 200 ? 6 : 0);

  return Math.round(ratingScore - waitPenalty - distPenalty + verifiedBonus + emergencyBonus + feeBonus);
};
