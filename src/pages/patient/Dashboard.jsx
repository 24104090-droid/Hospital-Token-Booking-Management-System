import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  MapPin,
  Clock,
  Ticket,
  ShieldCheck,
  Building2,
  Stethoscope,
  ArrowRight,
  Zap,
  Activity,
  Heart
} from 'lucide-react';
import { HospitalContext } from '../../context/HospitalContext';
import { diseaseMapping, diseaseCategories } from '../../data/diseaseMapping';
import { getHospitals } from '../../services/hospitalService';
import VoiceAssistant from '../../components/VoiceAssistant';
import HospitalCard from '../../components/HospitalCard';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { DEFAULT_LOCATION } from '../../utils/constants';

const Dashboard = () => {
  const navigate = useNavigate();
  const { setSelectedDisease, selectedCity } = useContext(HospitalContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [diseaseInput, setDiseaseInput] = useState('');
  const [featuredHospitals, setFeaturedHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const diseases = Object.keys(diseaseMapping);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await getHospitals({ filters: { location: selectedCity } });
        setFeaturedHospitals(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured hospitals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, [selectedCity]);

  const handleDiseaseSelect = (symptom) => {
    if (symptom) {
      setSelectedDisease(symptom);
      navigate('/specialist');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Check if search matches any disease
    const match = diseases.find(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
    if (match) {
      setSelectedDisease(match);
      navigate('/specialist');
    } else {
      navigate(`/hospitals?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const quickSymptoms = [
    'Fever',
    'Cough',
    'Skin Allergy',
    'Eye Problem',
    'Heart Problem',
    'Bone Problem',
    'Stomach Problem',
    'Pregnancy'
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-sky-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-xl relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Smart Hospital OPD Token System
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3 text-white">
            Skip the Wait. Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">Live Hospital Token</span>.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Find the right medical specialty in <strong>{selectedCity || DEFAULT_LOCATION}</strong>, check live queue waiting times, and get your digital QR token before leaving home.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search disease, symptom, specialty, or hospital name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-sky-400/40 shadow-lg"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="rounded-2xl px-6 py-3.5">
              <span>Find Care</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick Symptoms Pills */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Common Symptoms & Health Concerns:
            </span>
            <div className="flex flex-wrap gap-2">
              {quickSymptoms.map((sym) => (
                <button
                  key={sym}
                  onClick={() => handleDiseaseSelect(sym)}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/15 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  <Activity className="w-3 h-3 text-sky-400" />
                  {sym}
                </button>
              ))}
              <Link
                to="/disease"
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                + View All (35+)
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Assistant Triage Banner */}
      <div className="mb-8">
        <VoiceAssistant
          onDetected={(detected) => {
            if (detected) {
              handleDiseaseSelect(detected);
            }
          }}
        />
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">6 Hospitals</div>
            <div className="text-xs text-slate-500 font-medium">Govt & Multi-Specialty</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">240+ Tokens</div>
            <div className="text-xs text-slate-500 font-medium">Active Today</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">12 Mins</div>
            <div className="text-xs text-slate-500 font-medium">Avg OPD Consultation Wait</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">100% Free</div>
            <div className="text-xs text-slate-500 font-medium">Govt OPD Scheme (TVMCH)</div>
          </div>
        </div>
      </div>

      {/* Featured Hospitals Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Nearby Hospitals in {selectedCity || DEFAULT_LOCATION}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Live token availability and consultation queue tracking
            </p>
          </div>
          <Link
            to="/hospitals"
            className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredHospitals.map((hosp) => (
            <HospitalCard
              key={hosp.id}
              hospital={hosp}
              onViewDetails={() => navigate(`/hospitals/${hosp.id}`)}
              onBookToken={() => {
                navigate(`/book-token?hospitalId=${hosp.id}`);
              }}
            />
          ))}
        </div>
      </div>

      {/* How MediQueue Works */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 mb-10 shadow-lg">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400 mb-1 block">
            HOW IT WORKS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">4 Simple Steps to Your OPD Visit</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
            <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm mx-auto mb-3">
              1
            </div>
            <h4 className="font-bold text-base text-white mb-1">Pick Health Problem</h4>
            <p className="text-xs text-slate-400">
              Select or voice-record symptoms to automatically match doctor specialty.
            </p>
          </div>

          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm mx-auto mb-3">
              2
            </div>
            <h4 className="font-bold text-base text-white mb-1">Compare Queues</h4>
            <p className="text-xs text-slate-400">
              View real-time token counts, crowd level, and estimated wait minutes.
            </p>
          </div>

          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mx-auto mb-3">
              3
            </div>
            <h4 className="font-bold text-base text-white mb-1">Instant QR Token</h4>
            <p className="text-xs text-slate-400">
              Receive your confirmed digital token pass with instant QR code.
            </p>
          </div>

          <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mx-auto mb-3">
              4
            </div>
            <h4 className="font-bold text-base text-white mb-1">Arrive Just in Time</h4>
            <p className="text-xs text-slate-400">
              Track live tokens ahead on your phone and avoid crowded waiting halls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
