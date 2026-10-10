import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  DEFAULT_COORDINATES, 
  LOCALITY_PRESETS, 
  calculateDistance, 
  calculateETA, 
  getDirectionsUrl 
} from '../utils/geoUtils';
import { hospitals } from '../data/hospitals';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  // Load saved location preference if any
  const [coords, setCoords] = useState(() => {
    try {
      const saved = localStorage.getItem('mediqueue_user_coords');
      return saved ? JSON.parse(saved) : DEFAULT_COORDINATES;
    } catch {
      return DEFAULT_COORDINATES;
    }
  });

  const [locationName, setLocationName] = useState(() => {
    return localStorage.getItem('mediqueue_location_name') || DEFAULT_COORDINATES.name;
  });

  const [isLiveGPS, setIsLiveGPS] = useState(() => {
    return localStorage.getItem('mediqueue_is_live_gps') === 'true';
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [radiusFilter, setRadiusFilter] = useState('all'); // 'all', 3, 5, 10 km

  // Persist coordinates
  useEffect(() => {
    try {
      localStorage.setItem('mediqueue_user_coords', JSON.stringify(coords));
      localStorage.setItem('mediqueue_location_name', locationName);
      localStorage.setItem('mediqueue_is_live_gps', isLiveGPS ? 'true' : 'false');
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [coords, locationName, isLiveGPS]);

  /**
   * Request live GPS from Browser
   */
  const detectLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);
    toast.loading('Detecting your GPS location...', { id: 'gps-toast' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newCoords = {
          lat: Math.round(latitude * 10000) / 10000,
          lng: Math.round(longitude * 10000) / 10000
        };

        setCoords(newCoords);
        setLocationName(`Current Location (±${Math.round(accuracy)}m)`);
        setIsLiveGPS(true);
        setLoading(false);

        const distFromTvl = calculateDistance(newCoords.lat, newCoords.lng, DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng);
        if (distFromTvl > 35) {
          toast.success('Live GPS detected! Showing nearest Tirunelveli facilities.', { id: 'gps-toast' });
        } else {
          toast.success('Live location updated! Showing nearest healthcare facilities.', { id: 'gps-toast' });
        }
      },
      (err) => {
        setLoading(false);
        let errorMsg = 'Could not access location.';
        if (err.code === 1) {
          errorMsg = 'Location permission denied. You can select your area manually.';
        } else if (err.code === 2) {
          errorMsg = 'Location unavailable. Please select your locality.';
        } else if (err.code === 3) {
          errorMsg = 'Location request timed out. Please try again.';
        }
        setError(errorMsg);
        toast.error(errorMsg, { id: 'gps-toast' });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  /**
   * Set one of the preset Tirunelveli localities
   */
  const selectPresetLocality = (presetId) => {
    const preset = LOCALITY_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setCoords({ lat: preset.lat, lng: preset.lng });
      setLocationName(preset.name);
      setIsLiveGPS(false);
      setError(null);
      toast.success(`Location set to ${preset.name}`);
    }
  };

  /**
   * Calculate distance from user coords to a target lat/lng
   */
  const getDistanceTo = (targetLat, targetLng) => {
    if (!targetLat || !targetLng) return 2.5;

    // Check how far current user coords are from Tirunelveli center
    const distFromTvl = calculateDistance(coords.lat, coords.lng, DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng);
    const isOutsideDistrict = distFromTvl > 35;

    // When GPS is detected outside Tirunelveli district (e.g. testing from Chennai, Bangalore, etc.):
    // Use Tirunelveli Junction as reference point and match with verified road distance
    if (isOutsideDistrict) {
      const matched = hospitals.find(h => 
        Math.abs(h.location?.lat - targetLat) < 0.005 && 
        Math.abs(h.location?.lng - targetLng) < 0.005
      );
      if (matched && matched.distance) {
        return matched.distance;
      }
      return calculateDistance(DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng, targetLat, targetLng);
    }

    return calculateDistance(coords.lat, coords.lng, targetLat, targetLng);
  };

  /**
   * Calculate estimated drive ETA
   */
  const getETATo = (targetLat, targetLng) => {
    const dist = getDistanceTo(targetLat, targetLng);
    return calculateETA(dist);
  };

  /**
   * Open Google Maps navigation to destination
   */
  const openNavigation = (targetLat, targetLng) => {
    const url = getDirectionsUrl(targetLat, targetLng, coords.lat, coords.lng);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const value = {
    coords,
    locationName,
    isLiveGPS,
    loading,
    error,
    radiusFilter,
    setRadiusFilter,
    detectLiveLocation,
    selectPresetLocality,
    localityPresets: LOCALITY_PRESETS,
    getDistanceTo,
    getETATo,
    openNavigation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export default LocationContext;
