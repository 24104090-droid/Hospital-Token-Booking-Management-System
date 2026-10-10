import React, { createContext, useState, useContext, useEffect } from 'react';
import { hospitals as initialHospitals, getHospitalsByDepartment, getHospitalById } from '../data/hospitals';
import { HospitalAPI } from '../services/api';
import toast from 'react-hot-toast';

const HospitalContext = createContext();

export const HospitalProvider = ({ children }) => {
  const [hospitals, setHospitals] = useState(initialHospitals);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, Government, Private
  const [searchQuery, setSearchQuery] = useState('');
  const [compareList, setCompareList] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('tvl_favorites');
      return saved ? JSON.parse(saved) : ['h1', 'h3'];
    } catch {
      return ['h1', 'h3'];
    }
  });

  // Sync with backend API on mount
  useEffect(() => {
    HospitalAPI.getAll()
      .then(res => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          // Merge backend hospitals with full local details (images/facilities)
          setHospitals(prev => {
            return prev.map(localHosp => {
              const remote = res.data.find(r => r.id === localHosp.id);
              if (remote) {
                return {
                  ...localHosp,
                  currentServingToken: remote.currentServingToken || localHosp.currentServingToken,
                  totalTokensIssuedToday: remote.totalTokensIssuedToday || localHosp.totalTokensIssuedToday,
                  crowdLevel: remote.crowdLevel || localHosp.crowdLevel,
                  averageWaitMins: remote.averageWaitMins || localHosp.averageWaitMins
                };
              }
              return localHosp;
            });
          });
        }
      })
      .catch(() => {
        // Fallback gracefully to offline mock data
      });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tvl_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const toggleFavorite = (hospitalId) => {
    setFavorites(prev => {
      const exists = prev.includes(hospitalId);
      const next = exists ? prev.filter(id => id !== hospitalId) : [...prev, hospitalId];
      toast.success(exists ? 'Removed from saved hospitals' : 'Added to saved hospitals ⭐');
      return next;
    });
  };

  const addToCompare = (hospital) => {
    if (compareList.some(h => h.id === hospital.id)) {
      toast('Hospital is already in comparison list', { icon: 'ℹ️' });
      return;
    }
    if (compareList.length >= 3) {
      toast.error('You can compare a maximum of 3 hospitals at once.');
      return;
    }
    setCompareList(prev => [...prev, hospital]);
    toast.success(`Added ${hospital.name} to compare`);
  };

  const removeFromCompare = (hospitalId) => {
    setCompareList(prev => prev.filter(h => h.id !== hospitalId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const getFilteredHospitals = () => {
    let list = [...hospitals];

    if (selectedDepartment) {
      list = list.filter(h => 
        h.departments.some(d => d.toLowerCase().includes(selectedDepartment.toLowerCase()))
      );
    }

    if (filterType !== 'all') {
      list = list.filter(h => h.type.toLowerCase() === filterType.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(h => 
        h.name.toLowerCase().includes(q) ||
        h.area.toLowerCase().includes(q) ||
        h.departments.some(d => d.toLowerCase().includes(q)) ||
        h.facilities.some(f => f.toLowerCase().includes(q))
      );
    }

    return list;
  };

  const getRecommendations = (specialty, userPreferences = {}) => {
    // Score hospitals based on ratings, distance, emergency readiness, and department match
    const matching = specialty 
      ? hospitals.filter(h => h.departments.some(d => d.toLowerCase().includes(specialty.toLowerCase())))
      : hospitals;

    const scored = matching.map(h => {
      let score = h.rating * 20; // max 100
      if (h.type === 'Government') score += 15; // zero cost / accessible
      if (h.openNow) score += 10;
      if (h.emergencyAvailable) score += 10;
      if (h.distance <= 3.0) score += 15;
      else if (h.distance <= 5.0) score += 8;

      let matchReason = 'High rating and specialized clinical wing';
      if (h.type === 'Government') matchReason = 'Zero consultation fee, premier multi-specialty government care';
      if (h.id === 'h3' || h.id === 'h6') matchReason = 'Dedicated super-specialty eye care institute';
      if (h.rating >= 4.8) matchReason = 'Top-rated patient reviews and fast OPD triage';

      return {
        ...h,
        matchScore: Math.min(99, Math.round(score)),
        matchReason
      };
    });

    return scored.sort((a, b) => b.matchScore - a.matchScore);
  };

  const [selectedCity, setSelectedCity] = useState('Tirunelveli');
  const [filters, setFilters] = useState({
    type: '',
    tokenAvailable: false,
    lowWaiting: false,
    highRating: false,
    lowCrowd: false,
    freeOPD: false,
    sortBy: 'bestMatch'
  });

  const isFavorite = (hospitalId) => {
    return favorites.includes(hospitalId);
  };

  const isInCompare = (hospitalId) => {
    return compareList.some(h => h.id === hospitalId);
  };

  const toggleCompare = (hospital) => {
    if (isInCompare(hospital.id)) {
      removeFromCompare(hospital.id);
    } else {
      addToCompare(hospital);
    }
  };

  const value = {
    hospitals,
    selectedHospital,
    setSelectedHospital,
    selectedDepartment,
    setSelectedDepartment,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    toggleCompare,
    favorites,
    isFavorite,
    toggleFavorite,
    selectedCity,
    setSelectedCity,
    filters,
    setFilters,
    getFilteredHospitals,
    getRecommendations,
    getHospitalById
  };

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
