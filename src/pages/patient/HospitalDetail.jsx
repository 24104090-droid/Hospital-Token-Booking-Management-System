import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Phone,
  PhoneCall,
  Clock,
  Star,
  ShieldCheck,
  Users,
  Ticket,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  GitCompare,
  Stethoscope,
  HeartPulse
} from 'lucide-react';
import { getHospitalById } from '../../services/hospitalService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import { useHospital } from '../../context/HospitalContext';

const HospitalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { compareList, addToCompare, removeFromCompare } = useHospital();

  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHospital = async () => {
      setLoading(true);
      try {
        const data = await getHospitalById(id);
        setHospital(data);
      } catch (err) {
        setError('Hospital details not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchHospital();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading hospital overview..." />;
  if (error || !hospital) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <p className="text-red-600 font-semibold mb-4">{error || 'Hospital not found.'}</p>
        <Button variant="outline" onClick={() => navigate('/hospitals')}>
          Back to Hospitals
        </Button>
      </div>
    );
  }

  const isCompared = compareList.some((h) => h.id === hospital.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back button */}
      <button
        onClick={() => navigate('/hospitals')}
        className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-sky-700 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Hospital Directory
      </button>

      {/* Main Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                  hospital.type === 'Government'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-sky-50 text-sky-700 border-sky-300'
                }`}
              >
                {hospital.type} Hospital
              </span>

              {hospital.freeOPD ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Free OPD Consultation
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800">
                  OPD Fee: ₹{hospital.consultationFee || 250}
                </span>
              )}

              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {hospital.rating} ({hospital.reviewsCount || 1200} patient reviews)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-2">
              {hospital.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                {hospital.address}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4 text-slate-400" />
                {hospital.phone}
              </span>
              <span className="flex items-center gap-1 text-red-600 font-bold">
                <PhoneCall className="w-4 h-4" />
                Emergency: {hospital.emergencyPhone}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (isCompared) removeFromCompare(hospital.id);
                else addToCompare(hospital);
              }}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 ${
                isCompared
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              {isCompared ? 'In Compare List' : 'Compare Hospital'}
            </button>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/book-token?hospitalId=${hospital.id}`)}
              disabled={hospital.availableTokens === 0}
            >
              <Ticket className="w-4 h-4 mr-1.5" />
              {hospital.availableTokens > 0 ? 'Book OPD Token' : 'Tokens Full'}
            </Button>
          </div>
        </div>

        {/* Live OPD Queue Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 text-center">
            <span className="text-xs text-sky-700 font-semibold uppercase tracking-wider block mb-1">
              Available Tokens
            </span>
            <span className="text-2xl font-black text-sky-900">
              {hospital.availableTokens}
            </span>
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-center">
            <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider block mb-1">
              Current Serving
            </span>
            <span className="text-2xl font-black text-amber-900">
              {hospital.currentToken}
            </span>
          </div>

          <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100 text-center">
            <span className="text-xs text-teal-700 font-semibold uppercase tracking-wider block mb-1">
              Avg Wait Time
            </span>
            <span className="text-2xl font-black text-teal-900">
              ~{hospital.waitingTime} min
            </span>
          </div>

          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-center">
            <span className="text-xs text-purple-700 font-semibold uppercase tracking-wider block mb-1">
              Available ICU Beds
            </span>
            <span className="text-2xl font-black text-purple-900">
              {hospital.icuAvailable || 8}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Doctors, Specialties & Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Col 1 & 2: Doctors on Duty */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">
                  On-Duty OPD Doctors & Rooms
                </h3>
              </div>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ● Live Consultation Active
              </span>
            </div>

            <div className="space-y-3">
              {hospital.doctors && hospital.doctors.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      Dr
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                      <p className="text-xs text-slate-500">{doc.dept} • {doc.experience} exp</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-white text-slate-700 rounded-lg border border-slate-200">
                      📍 Room: {doc.room}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/book-token?hospitalId=${hospital.id}&doctor=${encodeURIComponent(doc.name)}&dept=${encodeURIComponent(doc.dept)}`)}
                    >
                      Select Doctor
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              Available OPD Departments
            </h3>
            <div className="flex flex-wrap gap-2">
              {hospital.departments && hospital.departments.map((dept, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3: Facilities, Timings, Schemes */}
        <div className="space-y-6">
          {/* OPD Timing & Hours */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" />
              OPD Operational Hours
            </h3>
            <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-100 text-xs text-sky-900 font-semibold mb-2">
              {hospital.opdHours || '08:00 AM - 01:00 PM & 03:00 PM - 07:00 PM'}
            </div>
            <p className="text-[11px] text-slate-500">
              Tokens are issued until 1 hour prior to session closure. Emergency Casualty operates 24/7.
            </p>
          </div>

          {/* Hospital Facilities */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Facilities & Diagnostic Tech
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {hospital.facilities && hospital.facilities.map((fac, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{fac}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDetail;
