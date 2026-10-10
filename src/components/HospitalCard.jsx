import React from 'react';
import { MapPin, Clock, Ticket, Star, Users, CheckCircle, Plus, Check } from 'lucide-react';
import Button from './Button';
import { useHospital } from '../context/HospitalContext';

const HospitalCard = ({ hospital, onViewDetails, onBookToken, highlightedSpecialty }) => {
  const {
    id,
    name,
    type,
    location,
    address,
    availableSpecialties = [],
    availableTokens,
    currentToken,
    waitingTime,
    distance,
    rating,
    reviewsCount,
    crowdLevel,
    openStatus,
    freeOPD,
    consultationFee
  } = hospital;

  const { compareList, addToCompare, removeFromCompare } = useHospital();
  const isCompared = compareList.some(h => h.id === id);

  const getCrowdBadgeClass = (level) => {
    switch (level) {
      case 'Low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'High':
      default:
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  const handleCompareToggle = (e) => {
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(id);
    } else {
      addToCompare(hospital);
    }
  };

  return (
    <div className="card hospital-card bg-white rounded-2xl border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all p-5 flex flex-col justify-between relative overflow-hidden">
      {/* Top badges */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              type === 'Government'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-sky-50 text-sky-700 border-sky-300'
            }`}
          >
            {type} {freeOPD ? '• Free OPD' : `• ₹${consultationFee || 200}`}
          </span>

          <div className="flex items-center gap-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${getCrowdBadgeClass(crowdLevel)}`}>
              <Users className="w-3 h-3 inline mr-1" />
              {crowdLevel} Crowd
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                openStatus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {openStatus ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1 hover:text-sky-700 cursor-pointer" onClick={onViewDetails}>
          {name}
        </h3>

        <div className="flex items-center text-xs text-slate-500 gap-2 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {address || location} ({distance} km)
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            {rating} <span className="text-slate-400 font-normal">({reviewsCount || 420})</span>
          </span>
        </div>

        {/* Live OPD Queue Matrix */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-3 text-center">
          <div className="bg-white p-2 rounded-lg border border-slate-100">
            <span className="text-slate-400 text-xs block font-medium">Available</span>
            <span className={`text-sm font-extrabold ${availableTokens > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {availableTokens} Tokens
            </span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-100">
            <span className="text-slate-400 text-xs block font-medium">Current Now</span>
            <span className="text-sm font-extrabold text-sky-700">{currentToken}</span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-100">
            <span className="text-slate-400 text-xs block font-medium">Avg Wait</span>
            <span className="text-sm font-extrabold text-slate-800">{waitingTime} min</span>
          </div>
        </div>

        {/* Specialties tags */}
        <div className="mb-4">
          <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block mb-1.5">
            Key Specialties
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
            {availableSpecialties.slice(0, 4).map((spec, i) => {
              const isMatch = highlightedSpecialty && spec.toLowerCase().includes(highlightedSpecialty.toLowerCase());
              return (
                <span
                  key={i}
                  className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                    isMatch
                      ? 'bg-sky-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {spec}
                </span>
              );
            })}
            {availableSpecialties.length > 4 && (
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-semibold">
                +{availableSpecialties.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 mt-2">
        <button
          onClick={handleCompareToggle}
          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${
            isCompared
              ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
              : 'border-slate-300 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {isCompared ? <Check className="w-3.5 h-3.5 text-indigo-600" /> : <Plus className="w-3.5 h-3.5" />}
          {isCompared ? 'Comparing' : 'Compare'}
        </button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onBookToken}
            disabled={availableTokens === 0}
          >
            {availableTokens > 0 ? 'Book Token' : 'Full'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;
