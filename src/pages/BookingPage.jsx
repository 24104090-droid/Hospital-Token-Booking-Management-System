import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useHospital } from '../context/HospitalContext';
import { useLanguage } from '../context/LanguageContext';
import { getSpecialtyForProblem } from '../data/problems';
import { getDoctorsByHospital, getDoctorsByHospitalAndSpecialty, getDoctorById } from '../data/doctors';
import AppLayout from '../components/common/AppLayout';
import ProblemSelection from '../components/booking/ProblemSelection';
import DateSelection from '../components/booking/DateSelection';
import HospitalResults from '../components/booking/HospitalResults';
import DoctorSelection from '../components/booking/DoctorSelection';
import TimeSlotSelection from '../components/booking/TimeSlotSelection';
import Card from '../components/common/Card';
import VoiceBookingModal from '../components/voice/VoiceBookingModal';
import OfflineSMSBookingModal from '../components/booking/OfflineSMSBookingModal';
import { FaCheck, FaHeartbeat, FaCalendarAlt, FaHospital, FaClock, FaUserMd, FaShieldAlt, FaMicrophone, FaSms } from 'react-icons/fa';

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { bookingData, updateBookingData, confirmBooking } = useBooking();
  const { getHospitalById } = useHospital();
  const { t, isTamil } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);

  // Initialize from search params
  useEffect(() => {
    const hospId = searchParams.get('hospitalId');
    const prob = searchParams.get('problem');
    const dept = searchParams.get('department');
    const docId = searchParams.get('doctorId');

    if (hospId) {
      const hosp = getHospitalById(hospId);
      if (hosp) {
        updateBookingData({
          hospitalId: hosp.id,
          hospitalName: hosp.name,
          hospitalAddress: hosp.address,
          consultationFee: hosp.consultationFee
        });
        if (!prob && !dept && !docId) {
          setCurrentStep(2);
        }
      }
    }

    if (docId) {
      const doc = getDoctorById(docId);
      if (doc) {
        updateBookingData({
          doctorId: doc.id,
          doctorName: doc.name,
          doctorRoom: doc.room,
          specialty: doc.specialty,
          consultationFee: doc.consultationFee !== undefined ? doc.consultationFee : 0
        });
      }
    }

    if (prob) {
      const spec = getSpecialtyForProblem(prob);
      updateBookingData({
        problem: prob,
        specialty: spec
      });
      setCurrentStep(2);
    } else if (dept) {
      updateBookingData({
        specialty: dept
      });
      setCurrentStep(2);
    }
  }, [searchParams]);

  const steps = [
    { num: 1, title: isTamil ? 'உபாதை' : 'Health Concern', icon: FaHeartbeat },
    { num: 2, title: isTamil ? 'தேதி' : 'Date', icon: FaCalendarAlt },
    { num: 3, title: isTamil ? 'மருத்துவமனை' : 'Hospital', icon: FaHospital },
    { num: 4, title: isTamil ? 'மருத்துவர்' : 'Doctor', icon: FaUserMd },
    { num: 5, title: isTamil ? 'நேரம் & டோக்கன்' : 'Slot & Pass', icon: FaClock }
  ];

  const handleSelectProblem = (problemObj) => {
    updateBookingData({
      problem: problemObj.name,
      specialty: problemObj.specialty
    });
    setCurrentStep(2);
  };

  const handleSelectDate = (dateStr) => {
    updateBookingData({ date: dateStr });
    setCurrentStep(3);
  };

  const handleSelectHospital = (hosp) => {
    updateBookingData({
      hospitalId: hosp.id,
      hospitalName: hosp.name,
      hospitalAddress: hosp.address,
      consultationFee: hosp.consultationFee,
      // Clear previous doctor selection to let user choose fresh
      doctorId: '',
      doctorName: '',
      doctorRoom: ''
    });
    // Move to Step 4: Doctor Selection!
    setCurrentStep(4);
  };

  const handleSelectDoctor = (doc, autoAdvance = true) => {
    if (!doc) return;
    updateBookingData({
      doctorId: doc.id,
      doctorName: doc.name,
      doctorRoom: doc.room,
      specialty: doc.specialty || bookingData.specialty,
      consultationFee: doc.consultationFee !== undefined ? doc.consultationFee : bookingData.consultationFee
    });
    if (autoAdvance) {
      // Move to Step 5: Time Slot & Patient Details!
      setCurrentStep(5);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const token = await confirmBooking();
      if (token) {
        navigate('/confirmation');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="w-full max-w-5xl mx-auto space-y-6 text-left">
        {/* Quick Booking Options: Voice Booking & Offline SMS Booking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Voice-Assisted Booking Callout Banner */}
          <div className="bg-gradient-to-br from-sky-900 via-indigo-900 to-slate-900 rounded-3xl p-5 text-white shadow-md flex flex-col justify-between gap-4 border border-sky-400/20">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30 font-black shadow-inner flex-shrink-0">
                <FaMicrophone size={18} className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base leading-tight">
                  {isTamil ? 'குரல் வழி டோக்கன் முன்பதிவு' : 'AI Voice OPD Booking'}
                </h3>
                <p className="text-xs text-sky-200 mt-1 leading-relaxed">
                  {isTamil ? 'தமிழ் அல்லது ஆங்கிலத்தில் பேசி சில நொடிகளில் OPD டோக்கன் பெறுங்கள்' : 'Speak your symptoms in Tamil or English to automatically find duty doctors'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setVoiceModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-md hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaMicrophone size={12} />
              <span>{isTamil ? 'குரல் பதிவு தொடங்கு' : 'Start Voice Booking'}</span>
            </button>
          </div>

          {/* Offline SMS Booking Banner */}
          <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-5 text-white shadow-md flex flex-col justify-between gap-4 border border-emerald-400/20">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30 font-black shadow-inner flex-shrink-0">
                <FaSms size={20} className="animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm sm:text-base leading-tight">
                    {isTamil ? '📴 ஆஃப்லைன் SMS முன்பதிவு' : '📴 Offline SMS Booking'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                    No Data
                  </span>
                </div>
                <p className="text-xs text-emerald-200 mt-1 leading-relaxed">
                  {isTamil
                    ? 'இன்டர்நெட் இல்லையா? "TVL TVMC GENERAL" என 94424 00108 எண்ணிற்கு SMS அனுப்பி டோக்கன் பெறலாம்.'
                    : 'No internet? SMS "TVL TVMC GENERAL" to 94424 00108 for instant token pass & time.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSmsModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs shadow-md hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaSms size={13} />
              <span>{isTamil ? 'SMS வடிவமைப்பு & சிமுலேட்டர்' : 'SMS Code & Live Simulator'}</span>
            </button>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between relative px-2 sm:px-6">
            <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-6 h-1 bg-sky-600 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 90}%` }}
            />

            {steps.map((step) => {
              const Icon = step.icon;
              const isPassed = step.num < currentStep;
              const isCurrent = step.num === currentStep;

              return (
                <div
                  key={step.num}
                  onClick={() => {
                    if (isPassed) setCurrentStep(step.num);
                  }}
                  className={`flex flex-col items-center relative z-10 ${isPassed ? 'cursor-pointer' : ''
                    }`}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all shadow-md ${isPassed
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                        ? 'bg-sky-600 text-white ring-4 ring-sky-200'
                        : 'bg-white text-slate-400 border border-slate-300'
                      }`}
                  >
                    {isPassed ? <FaCheck size={14} /> : <Icon size={16} />}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs font-black mt-2 whitespace-nowrap ${isCurrent ? 'text-sky-700' : isPassed ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Steps */}
        <div className="w-full animate-fadeIn">
          {currentStep === 1 && (
            <ProblemSelection
              selectedProblem={bookingData.problem}
              onSelectProblem={handleSelectProblem}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <DateSelection
              selectedDate={bookingData.date}
              onSelectDate={handleSelectDate}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <HospitalResults
              specialty={bookingData.specialty}
              selectedDate={bookingData.date}
              selectedHospital={{ id: bookingData.hospitalId }}
              onSelectHospital={handleSelectHospital}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <DoctorSelection
              hospitalId={bookingData.hospitalId}
              hospitalName={bookingData.hospitalName}
              specialty={bookingData.specialty}
              selectedDoctor={{ id: bookingData.doctorId }}
              onSelectDoctor={handleSelectDoctor}
              onNext={(doc) => {
                if (doc) {
                  handleSelectDoctor(doc, false);
                }
                setCurrentStep(5);
              }}
              onBack={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 5 && (
            <TimeSlotSelection
              doctorId={bookingData.doctorId}
              selectedDate={bookingData.date}
              selectedTimeSlot={bookingData.timeSlot}
              onSelectTimeSlot={(slot) => updateBookingData({ timeSlot: slot })}
              patientDetails={bookingData}
              onUpdatePatientDetails={updateBookingData}
              onConfirmBooking={handleConfirm}
              onBack={() => setCurrentStep(4)}
              loading={loading}
            />
          )}
        </div>
      </div>

      <VoiceBookingModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />

      <OfflineSMSBookingModal
        isOpen={smsModalOpen}
        onClose={() => setSmsModalOpen(false)}
      />
    </AppLayout>
  );
};
export default BookingPage;
