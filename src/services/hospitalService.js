import { mockHospitals } from '../data/mockHospitals';
import { diseaseMapping } from '../data/diseaseMapping';
import { DEFAULT_LOCATION } from '../utils/constants';

export const getHospitals = async ({ disease, filters = {}, search = '' } = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockHospitals];

      // Location filter default
      if (filters.location) {
        filtered = filtered.filter(h => h.location.toLowerCase() === filters.location.toLowerCase());
      } else {
        filtered = filtered.filter(h => h.location === DEFAULT_LOCATION);
      }

      // Disease / Specialty filter
      if (disease) {
        const targetSpecialty = diseaseMapping[disease] || disease;
        filtered = filtered.filter(h =>
          h.availableSpecialties.some(s => s.toLowerCase() === targetSpecialty.toLowerCase() || s.toLowerCase().includes(targetSpecialty.toLowerCase()))
        );
      }

      // Search keyword filter (name, address, departments)
      if (search && search.trim() !== '') {
        const query = search.toLowerCase().trim();
        filtered = filtered.filter(h =>
          h.name.toLowerCase().includes(query) ||
          h.address.toLowerCase().includes(query) ||
          h.availableSpecialties.some(s => s.toLowerCase().includes(query)) ||
          h.departments.some(d => d.toLowerCase().includes(query))
        );
      }

      // Type Filter (Government vs Private)
      if (filters.type && filters.type !== 'All') {
        filtered = filtered.filter(h => h.type.toLowerCase() === filters.type.toLowerCase());
      }

      // Additional Filters
      if (filters.tokenAvailable) {
        filtered = filtered.filter(h => h.availableTokens > 0);
      }
      if (filters.lowWaiting) {
        filtered = filtered.filter(h => h.waitingTime <= 15);
      }
      if (filters.highRating) {
        filtered = filtered.filter(h => h.rating >= 4.5);
      }
      if (filters.lowCrowd) {
        filtered = filtered.filter(h => h.crowdLevel === 'Low');
      }
      if (filters.freeOPD) {
        filtered = filtered.filter(h => h.freeOPD === true);
      }

      // Sorting
      if (filters.sortBy === 'waiting') {
        filtered.sort((a, b) => a.waitingTime - b.waitingTime);
      } else if (filters.sortBy === 'distance') {
        filtered.sort((a, b) => a.distance - b.distance);
      } else if (filters.sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (filters.sortBy === 'tokens') {
        filtered.sort((a, b) => b.availableTokens - a.availableTokens);
      } else {
        // Default best match: higher rating, lower wait time
        filtered.sort((a, b) => (b.rating / (b.waitingTime || 1)) - (a.rating / (a.waitingTime || 1)));
      }

      resolve(filtered);
    }, 250);
  });
};

export const getHospitalById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const hospital = mockHospitals.find(h => String(h.id) === String(id));
      if (hospital) {
        resolve(hospital);
      } else {
        reject(new Error(`Hospital not found with id ${id}`));
      }
    }, 200);
  });
};

export const compareHospitals = async (hospitalIds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = mockHospitals.filter(h => hospitalIds.includes(String(h.id)));
      resolve(results);
    }, 200);
  });
};

export const getRecommendedHospitals = async (disease, { preferType, maxWait } = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockHospitals];
      const specialty = disease ? diseaseMapping[disease] : null;

      if (specialty) {
        filtered = filtered.filter(h =>
          h.availableSpecialties.some(s => s.toLowerCase() === specialty.toLowerCase() || s.toLowerCase().includes(specialty.toLowerCase()))
        );
      }

      if (preferType && preferType !== 'Any') {
        filtered = filtered.filter(h => h.type.toLowerCase() === preferType.toLowerCase());
      }

      if (maxWait) {
        filtered = filtered.filter(h => h.waitingTime <= Number(maxWait));
      }

      // Rank by algorithm: high rating, low wait time, high available tokens
      const scored = filtered.map(h => {
        let score = (h.rating * 20) - (h.waitingTime * 1.5) - (h.distance * 3) + (h.availableTokens * 0.5);
        if (h.crowdLevel === 'Low') score += 15;
        if (h.crowdLevel === 'High') score -= 10;
        return { ...h, matchScore: Math.round(Math.min(99, Math.max(70, score))) };
      });

      scored.sort((a, b) => b.matchScore - a.matchScore);
      resolve(scored);
    }, 300);
  });
};
