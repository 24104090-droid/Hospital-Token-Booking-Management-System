import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../../context/LocationContext';
import { useHospital } from '../../context/HospitalContext';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { calculateBestMatchScore } from '../../utils/geoUtils';
import { 
  FaMapMarkerAlt, 
  FaCompass, 
  FaDirections, 
  FaTicketAlt, 
  FaHospital, 
  FaClock, 
  FaAmbulance, 
  FaStar, 
  FaCheckCircle, 
  FaArrowRight, 
  FaCar, 
  FaFilter,
  FaShieldAlt,
  FaPhoneAlt,
  FaSearch,
  FaSortAmountDown
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const NearestHospitalFinder = ({ 
  onSelectHospital = null, 
  compact = false,
  sortBy: externalSortBy,
  onSortChange: externalOnSortChange
}) => {
  const navigate = useNavigate();
  const { 
    coords, 
    locationName, 
    isLiveGPS, 
    detectLiveLocation, 
    selectPresetLocality, 
    localityPresets, 
    getDistanceTo, 
    getETATo, 
    openNavigation, 
    loading: gpsLoading,
    radiusFilter,
    setRadiusFilter
  } = useLocation();
  const { hospitals } = useHospital();
  const { updateBookingData } = useBooking();
  const { isTamil } = useLanguage();

  const [filterType, setFilterType] = useState('all'); // 'all', 'govt', 'private', 'emergency'
  const [internalSortBy, setInternalSortBy] = useState('nearest');
  const [searchFilter, setSearchFilter] = useState('');
  const [showLocalityDropdown, setShowLocalityDropdown] = useState(false);

  const activeSortBy = externalSortBy !== undefined ? externalSortBy : internalSortBy;
  const handleSortChange = (newVal) => {
    if (externalOnSortChange) {
      externalOnSortChange(newVal);
    } else {
      setInternalSortBy(newVal);
    }
  };

  // Compute sorted hospital list by active sort and radius
  const sortedHospitals = useMemo(() => {
    return hospitals
      .map(h => {
        const lat = h.location?.lat || 8.7289;
        const lng = h.location?.lng || 77.7023;
        const distance = getDistanceTo(lat, lng);
        const eta = getETATo(lat, lng);
        const waitTime = h.currentWaitTime || h.averageWaitMins || 12;
        const bestMatchScore = calculateBestMatchScore(h, distance);
        return {
          ...h,
          calculatedDistance: distance,
          calculatedETA: eta,
          currentWaitTime: waitTime,
          bestMatchScore
        };
      })
      .filter(h => {
        // Filter by type
        if (filterType === 'govt' && h.type !== 'Government') return false;
        if (filterType === 'private' && h.type !== 'Private') return false;
        if (filterType === 'emergency' && !h.emergencyAvailable) return false;
        
        // Filter by radius from LocationContext
        if (radiusFilter && radiusFilter !== 'all') {
          const maxRadius = Number(radiusFilter);
          if (h.calculatedDistance > maxRadius) return false;
        }

        // Filter by search query
        if (searchFilter) {
          const q = searchFilter.toLowerCase().trim();
          const matchName = h.name.toLowerCase().includes(q);
          const matchArea = h.area?.toLowerCase().includes(q);
          const matchDept = h.departments?.some(d => d.toLowerCase().includes(q));
          if (!matchName && !matchArea && !matchDept) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (activeSortBy === 'lowestWait') {
          return a.currentWaitTime - b.currentWaitTime;
        }
        if (activeSortBy === 'bestMatch') {
          return b.bestMatchScore - a.bestMatchScore;
        }
        if (activeSortBy === 'highestRated') {
          return b.rating - a.rating;
        }
        if (activeSortBy === 'lowestFee') {
          return a.consultationFee - b.consultationFee;
        }
        // default 'nearest'
        return a.calculatedDistance - b.calculatedDistance;
      });
  }, [hospitals, coords, filterType, radiusFilter, searchFilter, activeSortBy, getDistanceTo, getETATo]);

  const nearestHospital = sortedHospitals[0];

  const handleBookToken = (hospital) => {
    updateBookingData({
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      hospitalAddress: hospital.address,
      consultationFee: hospital.consultationFee,
      room: 'OPD Counter 101'
    });
    if (onSelectHospital) {
      onSelectHospital(hospital);
    } else {
      navigate('/book');
      toast.success(isTamil 
        ? `${hospital.name} மருத்துவமனை தேர்வு செய்யப்பட்டது!` 
        : `Selected closest hospital: ${hospital.name}`
      );
    }
  };

  const handleQuickEmergencyJump = () => {
    const closestEmergency = sortedHospitals.find(h => h.emergencyAvailable) || nearestHospital;
    if (closestEmergency) {
      navigate('/emergency');
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 text-left">
      {/* 1. Location Bar & GPS Sensor */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-sky-800/60 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[10px] font-black uppercase tracking-wider mb-2">
              <FaCompass className="animate-spin text-sky-400" style={{ animationDuration: '6s' }} />
              <span>{isTamil ? 'அருகிலுள்ள மருத்துவமனை கண்டுபிடிப்பான்' : 'GPS Nearest Hospital Finder'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{isTamil ? 'உங்களுக்கு மிக அருகிலுள்ள மருத்துவமனைகள்' : 'Closest Hospitals to Your Location'}</span>
            </h2>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-300">
              <FaMapMarkerAlt className="text-rose-400 flex-shrink-0" />
              <span>{isTamil ? 'தற்போதைய இடம்:' : 'Reference Location:'}</span>
              <strong className="text-white font-extrabold bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
                {locationName}
              </strong>
              {isLiveGPS && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Live GPS
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={detectLiveLocation}
              disabled={gpsLoading}
              className="py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
            >
              <FaCompass className={gpsLoading ? 'animate-spin' : ''} />
              <span>{gpsLoading ? 'Detecting GPS...' : isTamil ? 'நேரலை GPS கண்டறிக' : 'Use My GPS'}</span>
            </button>

            {/* Change Locality Dropdown Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLocalityDropdown(!showLocalityDropdown)}
                className="py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FaMapMarkerAlt className="text-sky-300" />
                <span>{isTamil ? 'பகுதி மாற்றுக' : 'Change Locality'}</span>
              </button>

              {showLocalityDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-fade-in">
                  <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                    Select Tirunelveli Locality:
                  </div>
                  {localityPresets.map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        selectPresetLocality(preset.id);
                        setShowLocalityDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-200 hover:bg-sky-600 hover:text-white font-semibold transition-colors flex items-center justify-between"
                    >
                      <span>{preset.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">📍 TVL</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Emergency Casualty Button */}
            <button
              type="button"
              onClick={handleQuickEmergencyJump}
              className="py-2.5 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer animate-pulse"
              title="Find nearest 24/7 Emergency Casualty"
            >
              <FaAmbulance />
              <span>{isTamil ? 'அவசர சிகிச்சை' : 'Emergency 108'}</span>
            </button>
          </div>
        </div>

        {/* Filter bar inside header */}
        <div className="mt-5 pt-4 border-t border-sky-800/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 text-[11px] font-bold">Filter:</span>
            {[
              { id: 'all', label: isTamil ? 'அனைத்தும்' : 'All' },
              { id: 'emergency', label: isTamil ? '🚨 24/7 அவசரம்' : '🚨 24/7 Emergency' },
              { id: 'govt', label: isTamil ? '🏛️ அரசு மருத்துவமனை' : '🏛️ Govt (Free)' },
              { id: 'private', label: isTamil ? '🏥 தனியார்' : '🏥 Private' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                  filterType === f.id
                    ? 'bg-sky-400 text-slate-950 font-black shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Distance Limit & Sort Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 text-slate-300 text-xs">
            {/* Radius Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold">{isTamil ? 'சுற்றளவு:' : 'Radius:'}</span>
              <select
                value={radiusFilter || 'all'}
                onChange={(e) => setRadiusFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="bg-slate-800 text-white font-bold rounded-xl border border-slate-700 px-2.5 py-1 text-xs focus:outline-none cursor-pointer"
              >
                <option value="all">{isTamil ? 'அனைத்து திருநெல்வேலி' : 'All Tirunelveli (District)'}</option>
                <option value={3}>{isTamil ? '3 கி.மீ-க்குள்' : 'Within 3 km'}</option>
                <option value={5}>{isTamil ? '5 கி.மீ-க்குள்' : 'Within 5 km'}</option>
                <option value={10}>{isTamil ? '10 கி.மீ-க்குள்' : 'Within 10 km'}</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold">{isTamil ? 'வரிசை:' : 'Sort:'}</span>
              <select
                value={activeSortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-slate-800 text-white font-bold rounded-xl border border-slate-700 px-2.5 py-1 text-xs focus:outline-none cursor-pointer"
              >
                <option value="nearest">📍 {isTamil ? 'அருகிலுள்ள தூரம்' : 'Nearest Distance (GPS)'}</option>
                <option value="lowestWait">⚡ {isTamil ? 'குறைந்த காத்திருப்பு நேரம்' : 'Shortest Queue Time'}</option>
                <option value="bestMatch">⭐ {isTamil ? 'சிறந்த பொருத்தம்' : 'Best Match'}</option>
                <option value="highestRated">🌟 {isTamil ? 'உயர்ந்த மதிப்பீடு' : 'Highest Star Rating'}</option>
                <option value="lowestFee">💵 {isTamil ? 'குறைந்த கட்டணம்' : 'Lowest Consultation Fee'}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Highlight: #1 Recommended Hospital Card */}
      {nearestHospital && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-sky-950/30 rounded-3xl p-5 sm:p-6 border-2 border-emerald-400 dark:border-emerald-600 shadow-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-md flex-shrink-0">
                #1
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="badge bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider py-0.5 px-2">
                    {activeSortBy === 'lowestWait' 
                      ? (isTamil ? '⚡ குறைந்த காத்திருப்பு நேரம்' : '⚡ SHORTEST QUEUE WAIT TIME')
                      : activeSortBy === 'bestMatch'
                      ? (isTamil ? '⭐ சிறந்த பொருத்தம்' : '⭐ #1 BEST MATCH RECOMMENDATION')
                      : activeSortBy === 'highestRated'
                      ? (isTamil ? '🌟 அதிக மதிப்பீடு பெற்ற மருத்துவமனை' : '🌟 HIGHEST STAR RATED')
                      : activeSortBy === 'lowestFee'
                      ? (isTamil ? '💵 குறைந்த கட்டண மருத்துவமனை' : '💵 LOWEST OPD CONSULTATION FEE')
                      : (isTamil ? '📍 உங்களுக்கு மிக அருகிலுள்ளது' : '📍 CLOSEST HOSPITAL TO YOU')
                    }
                  </span>
                  <span className="font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded-full text-xs">
                    📍 {nearestHospital.calculatedDistance} km away
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 text-xs font-semibold flex items-center gap-1">
                    <FaCar className="text-slate-400" /> ~{nearestHospital.calculatedETA} drive
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {nearestHospital.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                  {nearestHospital.address} · {nearestHospital.area}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <FaClock className="text-sky-600" /> Wait: <strong>~{nearestHospital.currentWaitTime} mins</strong>
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <FaTicketAlt className="text-amber-500" /> Now Serving: <strong>#{nearestHospital.currentServingToken || 14}</strong>
                  </span>
                  <span className={`font-black px-2 py-0.5 rounded-lg text-xs ${
                    nearestHospital.consultationFee === 0 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {nearestHospital.consultationFee === 0 ? 'FREE OPD (Govt)' : `₹${nearestHospital.consultationFee}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions for #1 */}
            <div className="flex flex-col sm:flex-row md:flex-col w-full md:w-auto gap-2">
              <button
                type="button"
                onClick={() => handleBookToken(nearestHospital)}
                className="py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <FaTicketAlt />
                <span>{isTamil ? 'இந்த மருத்துவமனையில் டோக்கன் பதிவு செய்க' : 'Book Token at this Hospital'}</span>
                <FaArrowRight size={11} />
              </button>

              <button
                type="button"
                onClick={() => openNavigation(nearestHospital.location.lat, nearestHospital.location.lng)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FaDirections className="text-sky-600" />
                <span>{isTamil ? 'GPS வழித்தடம் காண்க' : 'Open Google Maps Navigation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Distance/Sorted Hospitals List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isTamil 
              ? `அனைத்து மருத்துவமனைகளும் (${
                  activeSortBy === 'lowestWait' ? 'குறைந்த காத்திருப்பு நேரம் வாரியாக' :
                  activeSortBy === 'bestMatch' ? 'சிறந்த பொருத்தம் வாரியாக' :
                  activeSortBy === 'highestRated' ? 'மதிப்பீடு வாரியாக' :
                  activeSortBy === 'lowestFee' ? 'குறைந்த கட்டணம் வாரியாக' : 'தூரம் வாரியாக'
                }):`
              : `All Facilities (Sorted by ${
                  activeSortBy === 'lowestWait' ? 'Shortest Queue Time First' :
                  activeSortBy === 'bestMatch' ? 'Best Match & Score' :
                  activeSortBy === 'highestRated' ? 'Highest Star Rating' :
                  activeSortBy === 'lowestFee' ? 'Lowest Consultation Fee' : 'Distance from Nearest to Farthest'
                }):`
            }
          </span>
          <span className="text-xs font-bold text-slate-400">
            {sortedHospitals.length} {isTamil ? 'மருத்துவமனைகள்' : 'hospitals found'}
          </span>
        </div>

        {sortedHospitals.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
            <p className="text-sm font-bold text-slate-600">
              {isTamil
                ? `${radiusFilter && radiusFilter !== 'all' ? `${radiusFilter} கி.மீ-க்குள்` : ''} மருத்துவமனைகள் எதுவும் கிடைக்கவில்லை.`
                : `No hospitals found within ${radiusFilter && radiusFilter !== 'all' ? `${radiusFilter} km` : 'selected'} radius.`
              }
            </p>
            <button
              onClick={() => { setRadiusFilter('all'); setFilterType('all'); }}
              className="mt-3 text-xs font-bold text-sky-600 hover:underline cursor-pointer"
            >
              {isTamil ? 'அனைத்து திருநெல்வேலி மருத்துவமனைகளையும் காண்க (Expand to All)' : 'Expand radius to all Tirunelveli district'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedHospitals.map((hosp, idx) => {
              const isFirst = idx === 0;
              return (
                <div
                  key={hosp.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all hover:shadow-lg flex flex-col justify-between gap-4 text-left ${
                    isFirst 
                      ? 'border-emerald-400 ring-1 ring-emerald-400/40 shadow-sm' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-sky-300'
                  }`}
                >
                  <div>
                    {/* Top distance & ranking badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <span className="badge bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 font-extrabold text-xs py-1 px-2.5">
                          📍 {hosp.calculatedDistance} km away
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          ~{hosp.calculatedETA}
                        </span>
                      </div>

                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        hosp.type === 'Government' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {hosp.type}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1">
                      {hosp.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-medium">
                      {hosp.address}
                    </p>

                    {/* Operational metrics */}
                    <div className="flex flex-wrap items-center gap-2.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <FaClock className="text-sky-500" /> Wait: <strong>~{hosp.currentWaitTime}m</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FaTicketAlt className="text-amber-500" /> Serving: <strong>#{hosp.currentServingToken || 12}</strong>
                      </span>
                      <span>•</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {hosp.consultationFee === 0 ? 'FREE' : `₹${hosp.consultationFee}`}
                      </span>
                      {hosp.emergencyAvailable && (
                        <span className="ml-auto text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                          🚨 24/7 ICU
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleBookToken(hosp)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <FaTicketAlt size={11} />
                      <span>{isTamil ? 'டோக்கன் பதிவு செய்க' : 'Book Token'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openNavigation(hosp.location.lat, hosp.location.lng)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      title="Google Maps Navigation"
                    >
                      <FaDirections size={14} className="text-sky-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearestHospitalFinder;
