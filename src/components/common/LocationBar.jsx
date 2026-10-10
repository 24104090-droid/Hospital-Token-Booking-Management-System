import React, { useState } from 'react';
import { useLocation } from '../../context/LocationContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  FaMapMarkerAlt, 
  FaCrosshairs, 
  FaCompass, 
  FaFilter, 
  FaCheck, 
  FaChevronDown 
} from 'react-icons/fa';

const LocationBar = ({ 
  showRadiusFilter = true, 
  title = null, 
  compact = false,
  className = "" 
}) => {
  const { 
    coords, 
    locationName, 
    isLiveGPS, 
    loading, 
    radiusFilter, 
    setRadiusFilter, 
    detectLiveLocation, 
    selectPresetLocality, 
    localityPresets 
  } = useLocation();

  const { isTamil } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const radiusOptions = [
    { label: 'All', value: 'all', tamil: 'அனைத்தும்' },
    { label: 'Within 3 km', value: 3, tamil: '3 கி.மீ-க்குள்' },
    { label: 'Within 5 km', value: 5, tamil: '5 கி.மீ-க்குள்' },
    { label: 'Within 10 km', value: 10, tamil: '10 கி.மீ-க்குள்' }
  ];

  return (
    <div className={`bg-gradient-to-r from-sky-50 via-white to-indigo-50/50 p-4 sm:p-5 rounded-3xl border border-sky-100 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${className}`}>
      {/* Left: Current Location Status & GPS Button */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold text-base shadow-sm shadow-sky-500/30 flex-shrink-0">
            <FaMapMarkerAlt className={isLiveGPS ? 'animate-bounce' : ''} />
          </div>
          {isLiveGPS && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
              {isTamil ? 'உங்களுடைய தற்போதைய இருப்பிடம்' : 'Your Detected Location'}
            </span>
            {isLiveGPS ? (
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-black tracking-wide uppercase">
                ● Live GPS
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[9px] font-bold tracking-wide uppercase">
                Preset Area
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
              {locationName}
            </span>

            {/* Quick Locality Selector Dropdown */}
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-xs text-sky-600 hover:text-sky-800 font-bold flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-sky-100/70 transition-colors cursor-pointer"
              >
                <span>{isTamil ? 'மாற்று' : 'Change'}</span>
                <FaChevronDown size={9} />
              </button>

              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setDropdownOpen(false)} 
                  />
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40 text-left animate-fadeIn">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 mb-1">
                      {isTamil ? 'திருநெல்வேலி பகுதிகள்' : 'Select Tirunelveli Area'}
                    </div>
                    {localityPresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          selectPresetLocality(preset.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          locationName === preset.name
                            ? 'bg-sky-50 text-sky-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{preset.name}</span>
                        {locationName === preset.name && <FaCheck size={11} className="text-sky-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls: Auto GPS Button + Radius Filter Chips */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Detect Live GPS Button */}
        <button
          type="button"
          onClick={detectLiveLocation}
          disabled={loading}
          className="px-3.5 py-2 rounded-2xl bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 hover:text-sky-900 text-xs font-black shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          title="Detect my exact device GPS location"
        >
          <FaCrosshairs className={`${loading ? 'animate-spin' : 'text-sky-600'}`} />
          <span>{loading ? (isTamil ? 'கண்டறியப்படுகிறது...' : 'Detecting GPS...') : (isTamil ? 'நேரலை GPS' : 'Auto Detect GPS')}</span>
        </button>

        {/* Radius Filter Pills */}
        {showRadiusFilter && (
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xs p-1 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase px-2 hidden sm:inline">
              <FaFilter size={9} className="inline mr-1 text-slate-400" />
              Radius:
            </span>
            {radiusOptions.map((opt) => {
              const isSelected = String(radiusFilter) === String(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRadiusFilter(opt.value)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {isTamil ? opt.tamil : opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationBar;
