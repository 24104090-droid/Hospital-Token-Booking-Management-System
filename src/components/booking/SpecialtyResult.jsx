import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { getSpecialtyForProblem, getProblemsForSpecialty } from '../../data/problems';
import Card from '../common/Card';
import Button from '../common/Button';
import { FaUserMd, FaHospital, FaArrowRight, FaCheckCircle, FaStar, FaArrowLeft } from 'react-icons/fa';

const SpecialtyResult = () => {
  const navigate = useNavigate();
  const { selectedProblem, setSelectedSpecialty } = useBooking();

  const problem = selectedProblem || 'Fever';
  const specialty = getSpecialtyForProblem(problem);
  const relatedProblems = getProblemsForSpecialty(specialty);

  const handleProceedToHospitals = () => {
    setSelectedSpecialty(specialty);
    navigate(`/recommendations`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div>
        <button
          onClick={() => navigate('/select-problem')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 mb-2"
        >
          <FaArrowLeft /> Choose Different Concern
        </button>
      </div>

      {/* Match Banner */}
      <Card className="bg-gradient-to-br from-sky-900 to-slate-900 text-white p-8 text-center rounded-3xl shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center mx-auto mb-4 text-3xl">
          🩺
        </div>
        <span className="badge badge-primary uppercase tracking-widest mb-2">
          Diagnostic Match Result
        </span>
        <h1 className="text-3xl sm:text-4xl font-black mb-2">
          Recommended Specialty: <span className="text-sky-400">{specialty}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6">
          Based on your indicated condition <strong>"{problem}"</strong>, our system recommends booking an OPD token in the <strong>{specialty}</strong> department.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={handleProceedToHospitals}
            size="lg"
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black border-none"
            icon={FaHospital}
          >
            Find {specialty} Hospitals & Queues
          </Button>
        </div>
      </Card>

      {/* Specialty Information */}
      <Card className="p-6">
        <h2 className="text-lg font-black text-slate-900 mb-3">About {specialty} OPD Consultations</h2>
        <div className="flex flex-col gap-3 text-xs sm:text-sm text-slate-600">
          <div className="flex items-start gap-2">
            <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
            <span>Dedicated specialist doctors diagnose and prescribe medication directly at the OPD counter.</span>
          </div>
          <div className="flex items-start gap-2">
            <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
            <span>Digital token gives you an assigned queue time window, minimizing physical contact in crowded waiting zones.</span>
          </div>
          <div className="flex items-start gap-2">
            <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
            <span>Govt Medical College Hospital OPD visits are completely free with zero consultation fees.</span>
          </div>
        </div>

        {relatedProblems.length > 1 && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Other Conditions Handled By {specialty}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {relatedProblems.map((rp) => (
                <span key={rp} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                  {rp}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SpecialtyResult;
