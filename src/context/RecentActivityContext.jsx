import React, { createContext, useContext, useState, useEffect } from 'react';

const RecentActivityContext = createContext();

export const RecentActivityProvider = ({ children }) => {
  const [recentHospitals, setRecentHospitals] = useState(() => {
    try {
      const saved = localStorage.getItem('tvl_recent_hospitals');
      return saved ? JSON.parse(saved) : [
        { id: 'tvmch', name: 'TVMCH (High Grounds)', area: 'High Grounds', timestamp: Date.now() - 1000 * 60 * 30 },
        { id: 'shifa', name: 'Shifa Hospital', area: 'Vannarpettai', timestamp: Date.now() - 1000 * 60 * 90 }
      ];
    } catch {
      return [];
    }
  });

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('tvl_recent_searches');
      return saved ? JSON.parse(saved) : ['Fever & Chills', 'Chest Pain', 'Eye Irritation'];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tvl_recent_hospitals', JSON.stringify(recentHospitals));
  }, [recentHospitals]);

  useEffect(() => {
    localStorage.setItem('tvl_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addRecentHospital = (hospital) => {
    if (!hospital || !hospital.id) return;
    setRecentHospitals((prev) => {
      const filtered = prev.filter(h => h.id !== hospital.id);
      return [
        {
          id: hospital.id,
          name: hospital.name,
          area: hospital.area || hospital.address,
          image: hospital.image,
          rating: hospital.rating,
          timestamp: Date.now()
        },
        ...filtered
      ].slice(0, 5); // Keep top 5
    });
  };

  const addRecentSearch = (term) => {
    if (!term || typeof term !== 'string') return;
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter(s => s.toLowerCase() !== clean.toLowerCase());
      return [clean, ...filtered].slice(0, 6);
    });
  };

  const clearRecentHospitals = () => {
    setRecentHospitals([]);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <RecentActivityContext.Provider value={{
      recentHospitals,
      recentSearches,
      addRecentHospital,
      addRecentSearch,
      clearRecentHospitals,
      clearRecentSearches
    }}>
      {children}
    </RecentActivityContext.Provider>
  );
};

export const useRecentActivity = () => {
  const context = useContext(RecentActivityContext);
  if (!context) {
    throw new Error('useRecentActivity must be used within a RecentActivityProvider');
  }
  return context;
};
