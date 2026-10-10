import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import Select from './Select';
import { useHospital } from '../context/HospitalContext';

const FilterPanel = ({ onFilterChange }) => {
  const { filters, setFilters } = useHospital();

  const handleCheckboxChange = (key, checked) => {
    const updated = { ...filters, [key]: checked };
    setFilters(updated);
    if (onFilterChange) onFilterChange(updated);
  };

  const handleSelectChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    if (onFilterChange) onFilterChange(updated);
  };

  return (
    <div className="filter-panel bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Filter Options */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter By:
          </div>

          {/* Type dropdown */}
          <select
            value={filters.type || ''}
            onChange={(e) => handleSelectChange('type', e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All Hospital Types</option>
            <option value="Government">Government (Free OPD)</option>
            <option value="Private">Private Hospitals</option>
          </select>

          {/* Quick Checkboxes */}
          <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={Boolean(filters.tokenAvailable)}
              onChange={(e) => handleCheckboxChange('tokenAvailable', e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            Token Available
          </label>

          <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={Boolean(filters.lowWaiting)}
              onChange={(e) => handleCheckboxChange('lowWaiting', e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            Low Wait (&le;15 min)
          </label>

          <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={Boolean(filters.highRating)}
              onChange={(e) => handleCheckboxChange('highRating', e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            ⭐ 4.5+ Rating
          </label>

          <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={Boolean(filters.lowCrowd)}
              onChange={(e) => handleCheckboxChange('lowCrowd', e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            Low Crowd
          </label>
        </div>

        {/* Right Sort dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
          </span>
          <select
            value={filters.sortBy || 'best'}
            onChange={(e) => handleSelectChange('sortBy', e.target.value)}
            className="text-xs font-bold px-3 py-1.5 bg-sky-50 border border-sky-200 text-sky-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="best">🎯 Best Match</option>
            <option value="waiting">⏱ Lowest Waiting Time</option>
            <option value="distance">📍 Nearest Distance</option>
            <option value="rating">⭐ Highest Rated</option>
            <option value="tokens">🎫 Most Tokens Left</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
