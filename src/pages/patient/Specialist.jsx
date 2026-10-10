import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  ChevronLeft,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { HospitalContext } from '../../context/HospitalContext';
import { diseaseMapping, specialtyDetails } from '../../data/diseaseMapping';
import Button from '../../components/Button';
import { DEFAULT_LOCATION } from '../../utils/constants';

const Specialist = () => {
  const navigate = useNavigate();
  const { selectedDisease, selectedCity } = useContext(HospitalContext);

  const specialty = selectedDisease ? diseaseMapping[selectedDisease] : '';
  const details = specialty && specialtyDetails[specialty] ? specialtyDetails[specialty] : {
    description: 'General outpatient medical evaluation and treatment for identified clinical conditions.',
    commonConditions: ['General OPD', 'Routine Consultation'],
    urgency: 'Normal'
  };

  if (!selectedDisease) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">No Health Problem Selected</h2>
        <p className="text-xs text-slate-500 mb-6">
          Please select your symptom or health concern first so we can determine the right medical specialty.
        </p>
        <Button variant="primary" onClick={() => navigate('/disease')}>
          Select Health Problem
        </Button>
      </div>
    );
  }

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'Emergency':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Normal':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
      <button
        onClick={() => navigate('/disease')}
        className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-sky-700 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Change Health Problem
      </button>

      {/* Main Specialist Recommendation Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg relative overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Stethoscope className="w-9 h-9" />
            </div>
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-1">
                AI Triage Result
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {specialty}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span>Selected Symptom: <strong className="text-slate-800">{selectedDisease}</strong></span>
                <span>•</span>
                <span>📍 {selectedCity || DEFAULT_LOCATION}</span>
              </div>
            </div>
          </div>

          <div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getUrgencyBadge(details.urgency)}`}>
              <AlertTriangle className="w-3.5 h-3.5" />
              Urgency: {details.urgency}
            </span>
          </div>
        </div>

        {/* Specialty Description & Scope */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              About This Specialty
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {details.description}
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Common Addressed Conditions
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {details.commonConditions.map((cond, i) => (
                <span
                  key={i}
                  className="text-xs font-medium px-2.5 py-1 bg-white text-slate-700 rounded-lg border border-slate-200"
                >
                  {cond}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-sky-50 to-indigo-50 p-5 rounded-2xl border border-sky-200">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Ready to consult a {specialty} specialist?</h4>
            <p className="text-xs text-slate-500">View real-time token queues and OPD clinics near you.</p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/hospitals')}
            className="w-full sm:w-auto"
          >
            <span>Find Matching Hospitals</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Specialist;
