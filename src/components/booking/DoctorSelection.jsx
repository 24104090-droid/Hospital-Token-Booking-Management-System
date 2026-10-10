import React, { useState, useEffect } from 'react';
import { getDoctorsByHospitalAndSpecialty, doctors as allDoctors } from '../../data/doctors.js';
import { getSpecialtyForProblem } from '../../data/problems.js';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../common/Card';
import Button from '../common/Button';
import {
  FaUserMd,
  FaStar,
  FaClock,
  FaDoorOpen,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaGraduationCap,
  FaHospital,
  FaAward
} from 'react-icons/fa';

const DoctorSelection = ({
  hospitalId,
  hospitalName,
  specialty,
  selectedDoctor,
  onSelectDoctor,
  onNext,
  onBack
}) => {
  const { isTamil } = useLanguage();

  // Resolve canonical specialty (e.g., 'Skin Allergy' -> 'Dermatology', 'Chest Pain' -> 'Cardiology')
  const canonicalSpec = React.useMemo(() => {
    return specialty ? (getSpecialtyForProblem(specialty) || specialty) : '';
  }, [specialty]);

  // 1. Strictly get doctors matching this hospital and canonical specialty ONLY
  const specialtyDoctors = React.useMemo(() => {
    return getDoctorsByHospitalAndSpecialty(hospitalId, canonicalSpec);
  }, [hospitalId, canonicalSpec]);

  // 2. If specialty is specified, strictly show ONLY matching specialty doctors
  const displayedDoctors = React.useMemo(() => {
    if (canonicalSpec) {
      return specialtyDoctors;
    }
    return allDoctors.filter(d => d.hospitalId === hospitalId);
  }, [canonicalSpec, specialtyDoctors, hospitalId]);

  // Maintain local active selected doctor ID (defaults to passed selectedDoctor or first doctor)
  const [activeDoctorId, setActiveDoctorId] = useState(
    selectedDoctor?.id || (displayedDoctors[0]?.id || '')
  );

  // Synchronize or pre-select the first doctor so selection is never empty
  useEffect(() => {
    if (displayedDoctors.length > 0) {
      const match = displayedDoctors.find(d => d.id === (selectedDoctor?.id || activeDoctorId));
      if (match) {
        if (activeDoctorId !== match.id) {
          setActiveDoctorId(match.id);
        }
        if (!selectedDoctor?.id && onSelectDoctor) {
          onSelectDoctor(match, false);
        }
      } else {
        const defaultDoc = displayedDoctors[0];
        setActiveDoctorId(defaultDoc.id);
        if (onSelectDoctor) {
          onSelectDoctor(defaultDoc, false);
        }
      }
    }
  }, [displayedDoctors, selectedDoctor?.id, activeDoctorId, onSelectDoctor]);

  // Click on card to select
  const handleCardSelect = (doc) => {
    setActiveDoctorId(doc.id);
    if (onSelectDoctor) {
      onSelectDoctor(doc, false);
    }
  };

  // Click on "Select Doctor" button to select and advance immediately
  const handleSelectAndProceed = (doc, e) => {
    if (e) e.stopPropagation();
    setActiveDoctorId(doc.id);
    if (onSelectDoctor) {
      onSelectDoctor(doc, false);
    }
    if (onNext) {
      onNext(doc);
    }
  };

  // Click on bottom "Proceed to Time Slot & Token" button
  const handleProceedClick = () => {
    const docToUse = displayedDoctors.find(d => d.id === activeDoctorId) || displayedDoctors[0];
    if (docToUse && onSelectDoctor) {
      onSelectDoctor(docToUse, false);
    }
    if (onNext) {
      onNext(docToUse);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-fadeIn">
      {/* Step Header */}
      <div className="text-center">
        <span className="badge badge-primary uppercase tracking-wider mb-2 inline-flex items-center gap-1.5">
          <FaUserMd /> {isTamil ? `படி 4: ${canonicalSpec || 'மருத்துவர்'} தேர்வு` : `Step 4: Select ${canonicalSpec || 'Consulting'} Doctor`}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          {canonicalSpec
            ? (isTamil
              ? `உங்களுக்கு விருப்பமான மருத்துவரைத் தேர்ந்தெடுக்கவும் (${displayedDoctors.length} மருத்துவர்கள்)`
              : `Choose Your Preferred Doctor (${displayedDoctors.length} Specialists Available)`)
            : (isTamil ? 'மருத்துவரைத் தேர்ந்தெடுக்கவும்' : 'Choose Available Specialist Doctor')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
          {canonicalSpec
            ? (isTamil
              ? `${hospitalName}-ல் உள்ள அனைத்து ${canonicalSpec} சிறப்பு மருத்துவர்களின் விவரங்கள் கீழே உள்ளன. உங்களுக்குப் பிடித்த மருத்துவரைத் தேர்வு செய்து டோக்கன் பெறலாம்.`
              : `All certified ${canonicalSpec} specialists at ${hospitalName} are listed below. Click on any doctor to select them and proceed to time slots.`)
            : (isTamil
              ? 'தேர்வு செய்யப்பட்ட மருத்துவமனையில் உள்ள மருத்துவர்களின் விவரங்கள்.'
              : 'Select from certified on-duty specialists and medical officers available at this hospital.')}
        </p>
      </div>

      {/* Selected Hospital Info Card */}
      <div className="bg-gradient-to-r from-sky-50 via-teal-50 to-indigo-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-sm flex-shrink-0">
            <FaHospital size={18} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-sky-700">
              {isTamil ? 'தேர்வு செய்யப்பட்ட மருத்துவமனை' : 'Selected Hospital'}
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
              {hospitalName || 'Tirunelveli Hospital'}
            </h3>
            {canonicalSpec && (
              <span className="text-[11px] text-slate-600 font-semibold mt-0.5 inline-block">
                {isTamil ? 'துறை / பிரிவு:' : 'Department / Specialty:'} <strong className="text-sky-700">{canonicalSpec}</strong>
              </span>
            )}
          </div>
        </div>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 bg-white hover:bg-sky-100/60 border border-sky-200 px-3 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center gap-1"
          >
            <FaArrowLeft size={10} /> {isTamil ? 'மருத்துவமனை மாற்று' : 'Change Hospital'}
          </button>
        )}
      </div>

      {/* Strict Specialty Filter Banner */}
      {canonicalSpec && (
        <div className="flex items-center justify-between bg-sky-50/80 border border-sky-200 px-4 py-2.5 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-black text-sky-900">
            <FaUserMd className="text-sky-600" />
            <span>
              {isTamil
                ? `${canonicalSpec} பிரிவு சிறப்பு மருத்துவர்கள் (${displayedDoctors.length})`
                : `Certified ${canonicalSpec} Specialists Available (${displayedDoctors.length})`}
            </span>
          </div>
          <span className="text-[11px] text-sky-700 font-bold bg-white px-2.5 py-0.5 rounded-lg border border-sky-100 shadow-2xs">
            {hospitalName}
          </span>
        </div>
      )}

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedDoctors.map((doc) => {
          const isSelected = activeDoctorId === doc.id || selectedDoctor?.id === doc.id;
          const tokensRemaining = Math.max(0, (doc.tokensMax || 40) - (doc.tokensIssuedToday || 15));

          return (
            <Card
              key={doc.id}
              onClick={() => handleCardSelect(doc)}
              className={`cursor-pointer transition-all border-2 relative p-5 ${isSelected
                ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-300 shadow-lg scale-[1.01]'
                : 'border-slate-200 hover:border-sky-300 hover:shadow-md bg-white'
                }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <FaCheckCircle size={10} />
                  <span>{isTamil ? 'தேர்வு செய்யப்பட்டது' : 'Selected'}</span>
                </div>
              )}

              {/* Top Row: Avatar & Basic Info */}
              <div className="flex items-start gap-3.5">
                <img
                  src={doc.image}
                  alt={doc.name}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
                  }}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
                />

                <div className="flex-1 min-w-0 pr-16 sm:pr-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                      {doc.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="badge badge-primary text-[10px] font-bold">
                      {doc.specialty}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <FaAward size={10} className="text-teal-600" /> {doc.experience}
                    </span>
                    <div className="flex items-center gap-1 text-amber-700 text-[10px] font-bold bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                      <FaStar className="text-amber-500" size={9} />
                      <span>{doc.rating || 4.8}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-1">
                    <FaGraduationCap size={11} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate">{doc.qualification}</span>
                  </p>
                </div>
              </div>

              {/* Doctor Specialization Summary */}
              {doc.about && (
                <p className="text-[11px] text-slate-600 mt-2.5 line-clamp-2 leading-relaxed bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  {doc.about}
                </p>
              )}

              {/* Consultation Details Box */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <FaDoorOpen className="text-sky-600 flex-shrink-0" />
                  <span className="truncate font-semibold">{doc.room}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <FaClock className="text-teal-600 flex-shrink-0" />
                  <span className="truncate font-semibold">{doc.timing}</span>
                </div>
              </div>

              {/* Fee & Selection Bar */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Consultation Fee</span>
                  <span className="text-xs font-black text-slate-900">
                    {doc.consultationFee === 0 ? (
                      <span className="text-emerald-600">FREE OPD (₹0)</span>
                    ) : (
                      `₹${doc.consultationFee}`
                    )}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Tokens Left</span>
                  <span className="text-xs font-black text-emerald-600">
                    {tokensRemaining} Available
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleSelectAndProceed(doc, e)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${isSelected
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                    : 'bg-sky-600 hover:bg-sky-700 text-white'
                    }`}
                >
                  {isSelected ? (isTamil ? '✓ தேர்வு செய்யப்பட்டது (தொடரவும்)' : '✓ Selected (Proceed)') : (isTamil ? 'மருத்துவரைத் தேர்வு செய்' : 'Select Doctor')}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        {onBack && (
          <Button onClick={onBack} variant="outline" size="md" icon={FaArrowLeft}>
            {isTamil ? 'மருத்துவமனைக்கு திரும்ப' : 'Back to Hospitals'}
          </Button>
        )}
        <Button
          id="proceed-to-timeslot-btn"
          onClick={handleProceedClick}
          size="lg"
          className="font-black text-xs ml-auto shadow-md hover:shadow-lg bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
          icon={FaArrowRight}
        >
          {isTamil ? 'நேரம் & முன்பதிவுக்கு செல்ல' : 'Proceed to Time Slot & Token'}
        </Button>
      </div>
    </div>
  );
};

export default DoctorSelection;

