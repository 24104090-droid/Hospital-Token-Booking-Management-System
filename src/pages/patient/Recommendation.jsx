import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Award,
  Zap,
  Clock,
  Star,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { HospitalContext } from '../../context/HospitalContext';
import { diseaseMapping } from '../../data/diseaseMapping';
import { getRecommendedHospitals } from '../../services/hospitalService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { DEFAULT_LOCATION } from '../../utils/constants';

const Recommendation = () => {
  const navigate = useNavigate();
  const { selectedDisease, setSelectedDisease } = useContext(HospitalContext);

  const [preferType, setPreferType] = useState('Any');
  const [maxWait, setMaxWait] = useState('30');
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  const allDiseases = Object.keys(diseaseMapping);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const data = await getRecommendedHospitals(selectedDisease, {
          preferType,
          maxWait
        });
        setRecommended(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [selectedDisease, preferType, maxWait]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-600" /> AI Hospital Match & Triage Engine
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Smart Hospital Recommendation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Our algorithm balances doctor experience, live OPD queue length, proximity, and crowd density in <strong>{DEFAULT_LOCATION}</strong>.
        </p>
      </div>

      {/* Preferences Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Select Health Problem / Symptom
            </label>
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-sky-500"
            >
              <option value="">All Health Categories</option>
              {allDiseases.map((d) => (
                <option key={d} value={d}>
                  {d} ({diseaseMapping[d]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Hospital Preference
            </label>
            <select
              value={preferType}
              onChange={(e) => setPreferType(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-sky-500"
            >
              <option value="Any">Any Hospital (Govt & Private)</option>
              <option value="Government">Government (Free OPD)</option>
              <option value="Private">Private Specialty Centers</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Max Acceptable Wait Time
            </label>
            <select
              value={maxWait}
              onChange={(e) => setMaxWait(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-sky-500"
            >
              <option value="15">Under 15 Minutes</option>
              <option value="25">Under 25 Minutes</option>
              <option value="45">Under 45 Minutes</option>
              <option value="120">Any Wait Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      {loading ? (
        <LoadingSpinner message="Calculating optimal hospital match scores..." />
      ) : recommended.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-600 font-semibold mb-2">No matching hospitals for this specific combination.</p>
          <Button variant="outline" onClick={() => { setSelectedDisease(''); setPreferType('Any'); }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {recommended.map((hosp, idx) => (
            <div
              key={hosp.id}
              className={`bg-white rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md ${
                idx === 0
                  ? 'border-2 border-sky-400 bg-gradient-to-r from-sky-50/50 via-white to-white'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Info */}
                <div className="flex items-start gap-4">
                  {/* Rank / Match Score Badge */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-extrabold text-white flex-shrink-0 shadow-md ${
                      idx === 0
                        ? 'bg-gradient-to-tr from-sky-600 to-teal-500'
                        : 'bg-slate-800'
                    }`}
                  >
                    <span className="text-base leading-none">{hosp.matchScore || 95}%</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-90">Match</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {idx === 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                          <Award className="w-3 h-3" /> Top AI Recommendation
                        </span>
                      )}
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          hosp.type === 'Government'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-sky-50 text-sky-700 border-sky-300'
                        }`}
                      >
                        {hosp.type} {hosp.freeOPD ? '• Free' : `• ₹${hosp.consultationFee || 250}`}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{hosp.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">
                      <MapPin className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                      {hosp.address} ({hosp.distance} km)
                    </p>

                    {/* Metrics chips */}
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" /> ~{hosp.waitingTime} min wait
                      </span>
                      <span>•</span>
                      <span className="font-bold text-sky-700">
                        {hosp.availableTokens} Tokens Available
                      </span>
                      <span>•</span>
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {hosp.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2 md:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/hospitals/${hosp.id}`)}
                  >
                    Details
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate(`/book-token?hospitalId=${hosp.id}`)}
                    disabled={hosp.availableTokens === 0}
                  >
                    <span>{hosp.availableTokens > 0 ? 'Book Token' : 'Full'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendation;
