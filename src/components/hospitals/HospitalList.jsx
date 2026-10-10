import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useLocation } from '../../context/LocationContext';
import { useLanguage } from '../../context/LanguageContext';
import HospitalCard from './HospitalCard';
import LocationBar from '../common/LocationBar';
import HospitalInteractiveMap from '../map/HospitalInteractiveMap';
import NearestHospitalFinder from './NearestHospitalFinder';
import { 
  FaSearch, 
  FaFilter, 
  FaHospital, 
  FaBuilding, 
  FaLandmark, 
  FaSortAmountDown, 
  FaThLarge, 
  FaMapMarkedAlt,
  FaCompass 
} from 'react-icons/fa';

import { calculateBestMatchScore } from '../../utils/geoUtils';

const HospitalList = () => {
  const { 
    getFilteredHospitals, 
    filterType, 
    setFilterType, 
    searchQuery, 
    setSearchQuery 
  } = useHospital();

  const { radiusFilter, getDistanceTo, coords } = useLocation();
  const { isTamil } = useLanguage();

  const [sortBy, setSortBy] = useState('nearest');
  const [viewMode, setViewMode] = useState('nearest'); // 'nearest', 'grid', 'map'

  let list = getFilteredHospitals();

  // Apply Real Radius Filter based on user GPS / chosen locality
  if (radiusFilter && radiusFilter !== 'all') {
    const maxRadius = Number(radiusFilter);
    list = list.filter((h) => {
      if (!h.location?.lat || !h.location?.lng) return true;
      const dist = getDistanceTo(h.location.lat, h.location.lng);
      return dist <= maxRadius;
    });
  }

  // Apply sorting with dynamic distance computation
  if (sortBy === 'lowestWait') {
    list = [...list].sort((a, b) => (a.currentWaitTime || a.averageWaitMins || 15) - (b.currentWaitTime || b.averageWaitMins || 15));
  } else if (sortBy === 'bestMatch') {
    list = [...list].sort((a, b) => {
      const distA = a.location?.lat ? getDistanceTo(a.location.lat, a.location.lng) : (a.distance || 2.5);
      const distB = b.location?.lat ? getDistanceTo(b.location.lat, b.location.lng) : (b.distance || 2.5);
      const scoreA = calculateBestMatchScore(a, distA);
      const scoreB = calculateBestMatchScore(b, distB);
      return scoreB - scoreA;
    });
  } else if (sortBy === 'highestRated') {
    list = [...list].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'nearest') {
    list = [...list].sort((a, b) => {
      const distA = a.location?.lat ? getDistanceTo(a.location.lat, a.location.lng) : (a.distance || 2.5);
      const distB = b.location?.lat ? getDistanceTo(b.location.lat, b.location.lng) : (b.distance || 2.5);
      return distA - distB;
    });
  } else if (sortBy === 'lowestFee') {
    list = [...list].sort((a, b) => a.consultationFee - b.consultationFee);
  }

  const govtCount = list.filter(h => h.type === 'Government').length;
  const privateCount = list.filter(h => h.type === 'Private').length;

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* 1. Location Bar: Live GPS Detection, Locality Selector & Radius Chips */}
      <LocationBar showRadiusFilter={true} />

      {/* 2. Top Filter, Search & View Toggle Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={isTamil ? 'மருத்துவமனை, பகுதி, மருத்துவர் தேடுக...' : 'Search hospital, locality (Palayamkottai, Vannarpettai), specialty...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-medium focus:border-sky-500 focus:outline-none bg-slate-50/60"
          />
        </div>

        {/* Right Controls: Govt/Private Tabs, Sort, and Grid/Map Toggle */}
        <div className="flex flex-wrap items-center gap-3 justify-between lg:justify-end">
          {/* Government vs Private Segmented Control */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                filterType.toLowerCase() === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({list.length})
            </button>

            <button
              onClick={() => setFilterType('Government')}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                filterType.toLowerCase() === 'government'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <FaLandmark size={11} />
              <span>Govt OPD</span>
            </button>

            <button
              onClick={() => setFilterType('Private')}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                filterType.toLowerCase() === 'private'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-indigo-800 hover:bg-indigo-50'
              }`}
            >
              <FaBuilding size={11} />
              <span>Private</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200">
            <FaSortAmountDown className="text-slate-400" size={12} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-black text-slate-700 focus:outline-none cursor-pointer py-1"
            >
              <option value="nearest">📍 Nearest Distance (GPS)</option>
              <option value="lowestWait">⚡ Shortest Queue Time</option>
              <option value="bestMatch">⭐ Best Match</option>
              <option value="highestRated">🌟 Highest Star Rating</option>
              <option value="lowestFee">💵 Lowest Consultation Fee</option>
            </select>
          </div>

          {/* View Mode Toggle: Nearest First vs Grid vs Interactive Map */}
          <div className="flex bg-sky-50 p-1 rounded-2xl border border-sky-200">
            <button
              type="button"
              onClick={() => setViewMode('nearest')}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'nearest'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-sky-800 hover:bg-sky-100'
              }`}
              title="Sort Nearest by Distance"
            >
              <FaCompass size={11} />
              <span>{isTamil ? 'அருகில் உள்ளவை' : '📍 Nearest First'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-sky-800 hover:bg-sky-100'
              }`}
              title="Card Grid View"
            >
              <FaThLarge size={11} />
              <span>Grid</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-sky-800 hover:bg-sky-100'
              }`}
              title="Interactive GPS Map View"
            >
              <FaMapMarkedAlt size={12} />
              <span>Live Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Nearest Finder vs Map vs Grid */}
      {viewMode === 'nearest' ? (
        <NearestHospitalFinder 
          sortBy={sortBy} 
          onSortChange={setSortBy} 
        />
      ) : viewMode === 'map' ? (
        <div className="space-y-4">
          <HospitalInteractiveMap hospitals={list} height="580px" />
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
            🏥
          </div>
          <h3 className="font-extrabold text-base text-slate-900">No Hospitals Found in this Radius</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try expanding your distance radius (e.g. 10 km or All) or clear your search keyword.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {list.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalList;
