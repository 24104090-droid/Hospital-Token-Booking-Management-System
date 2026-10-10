import React, { useState, useMemo, useEffect } from 'react';
import { getAvailableSlots } from '../../data/doctors';
import { mockFamilyMembers } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { FaClock, FaUser, FaPhone, FaArrowLeft, FaArrowRight, FaUsers, FaSun, FaMoon, FaCheckCircle, FaUserMd, FaHospital, FaLock } from 'react-icons/fa';

const TimeSlotSelection = ({ 
  doctorId, 
  selectedDate, 
  selectedTimeSlot, 
  onSelectTimeSlot, 
  patientDetails, 
  onUpdatePatientDetails, 
  onConfirmBooking, 
  onBack, 
  loading 
}) => {
  const { isTamil } = useLanguage();
  const slots = useMemo(() => getAvailableSlots(doctorId, selectedDate), [doctorId, selectedDate]);
  const [selectedFamilyId, setSelectedFamilyId] = useState('custom');

  const morningAvailableCount = useMemo(() => slots.morning.filter(s => s.available).length, [slots.morning]);
  const afternoonAvailableCount = useMemo(() => slots.afternoon.filter(s => s.available).length, [slots.afternoon]);

  // Pre-select first available time slot if empty or if current selected slot is booked/unavailable
  useEffect(() => {
    const allSlots = [...slots.morning, ...slots.afternoon];
    const isCurrentValid = selectedTimeSlot && allSlots.some(s => s.time === selectedTimeSlot && s.available);
    if (!isCurrentValid) {
      const firstAvailable = slots.morning.find(s => s.available)?.time || slots.afternoon.find(s => s.available)?.time;
      if (firstAvailable && onSelectTimeSlot) {
        onSelectTimeSlot(firstAvailable);
      }
    }
  }, [slots, selectedTimeSlot, onSelectTimeSlot]);

  const handleFamilyChange = (famId) => {
    setSelectedFamilyId(famId);
    if (famId === 'custom') {
      return;
    }
    const member = mockFamilyMembers.find(f => f.id === famId);
    if (member && onUpdatePatientDetails) {
      onUpdatePatientDetails({
        patientName: member.name,
        patientAge: member.age,
        patientGender: member.gender,
        patientPhone: member.mobile.replace(/\D/g, '').slice(-10),
        familyMemberId: member.id
      });
    }
  };

  const handleConfirmClick = () => {
    const allSlots = [...slots.morning, ...slots.afternoon];
    const targetSlot = allSlots.find(s => s.time === selectedTimeSlot);
    if (targetSlot && !targetSlot.available) {
      return;
    }
    const slotToUse = selectedTimeSlot || slots.morning.find(s => s.available)?.time || '09:00 AM';
    if (!selectedTimeSlot && onSelectTimeSlot) {
      onSelectTimeSlot(slotToUse);
    }
    if (onConfirmBooking) {
      onConfirmBooking();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto text-left animate-fadeIn">
      {/* Header */}
      <div className="text-center">
        <span className="badge badge-primary uppercase tracking-wider mb-2 inline-flex items-center gap-1.5">
          <FaClock /> {isTamil ? 'படி 5: நேரம் & நோயாளி விவரங்கள்' : 'Step 5: Time Slot & Patient Details'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isTamil ? 'மருத்துவ ஆலோசனை நேரத்தை தேர்வு செய்யவும்' : 'Choose Consultation Time Slot'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isTamil 
            ? 'கிடைக்கும் நேரத்தை தேர்வு செய்து, டோக்கன் பாஸிற்கான நோயாளி விவரங்களை சரிபார்க்கவும்'
            : 'Select an available counter window and verify patient information for the token pass'}
        </p>
      </div>

      {/* Selected Doctor & Hospital Summary Banner */}
      <div className="bg-gradient-to-r from-sky-50 via-teal-50 to-indigo-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-sm flex-shrink-0">
            <FaUserMd size={20} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-sky-700">
              {isTamil ? 'தேர்வு செய்யப்பட்ட மருத்துவர் & அறை' : 'Selected Consulting Doctor & Chamber'}
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
              {patientDetails?.doctorName || 'Assigned Duty Medical Officer'}
            </h4>
            <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
              {patientDetails?.hospitalName} • <strong>{patientDetails?.doctorRoom || 'OPD Room'}</strong>
            </p>
          </div>
        </div>
        <div className="text-right sm:text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">
            {isTamil ? 'ஆலோசனை கட்டணம்' : 'Consultation Fee'}
          </span>
          <span className="badge badge-success text-xs font-black">
            {patientDetails?.consultationFee === 0 ? 'FREE OPD (₹0)' : `₹${patientDetails?.consultationFee}`}
          </span>
        </div>
      </div>

      {/* Slots Section */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              {isTamil ? 'டோக்கன் நேரம் தேர்ந்தெடுப்பு' : 'Select OPD Counter Window'}
            </h3>
            <p className="text-[11px] text-slate-500">
              {isTamil ? 'கிடைக்கும் டோக்கன்களை மட்டுமே பதிவு செய்ய முடியும் (நிரம்பியவை மங்கலாக இருக்கும்)' : 'Only available counter slots can be booked. Booked slots are blurred.'}
            </p>
          </div>
          {/* Status Legend */}
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-xs"></span>
              <span className="text-[11px] font-bold text-slate-600">{isTamil ? 'கிடைக்கும் டோக்கன்' : 'Available'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block shadow-xs"></span>
              <span className="text-[11px] font-bold text-slate-600">{isTamil ? 'தேர்வு செய்யப்பட்டது' : 'Selected'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 opacity-60 filter blur-[0.5px] inline-block"></span>
              <span className="text-[11px] font-bold text-slate-400">{isTamil ? 'நிரம்பியது (Full)' : 'Booked (Full)'}</span>
            </div>
          </div>
        </div>

        {/* Morning OPD Batches */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <FaSun className="text-amber-500" /> {isTamil ? 'காலை OPD நேரம் (08:30 AM – 01:00 PM)' : 'Morning OPD Batches (08:30 AM – 01:00 PM)'}
          </h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {morningAvailableCount} / {slots.morning.length} {isTamil ? 'கிடைக்கிறது' : 'Available'}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-6">
          {slots.morning.map((slot) => {
            const isSelected = selectedTimeSlot === slot.time;
            return (
              <button
                key={slot.time}
                type="button"
                id={`slot-morning-${slot.time.replace(/[: ]/g, '-')}`}
                disabled={!slot.available}
                onClick={() => slot.available && onSelectTimeSlot(slot.time)}
                title={slot.available ? slot.time : (isTamil ? 'இந்த நேரம் முன்பதிவாகிவிட்டது' : 'Slot already booked (Full)')}
                className={`relative py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center overflow-hidden ${
                  !slot.available
                    ? 'bg-slate-100/80 text-slate-400 border-slate-200 cursor-not-allowed select-none filter blur-[1.5px] opacity-40 grayscale pointer-events-none'
                    : isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300 scale-105 cursor-pointer z-10 font-black'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-sky-400 hover:bg-sky-50 cursor-pointer hover:shadow-xs'
                }`}
              >
                <span>{slot.time}</span>
                <span className={`text-[9px] font-semibold mt-0.5 flex items-center gap-1 ${
                  !slot.available
                    ? 'text-rose-500 font-bold'
                    : isSelected
                    ? 'text-sky-200 font-bold'
                    : 'text-emerald-600'
                }`}>
                  {slot.available ? (
                    isTamil ? 'டோக்கன் #' + slot.tokenNumber : 'Token #' + slot.tokenNumber
                  ) : (
                    <>
                      <FaLock size={8} />
                      <span>{isTamil ? 'நிரம்பியது' : 'Full'}</span>
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Afternoon Super-Specialty */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <FaMoon className="text-indigo-500" /> {isTamil ? 'மாலை சிறப்பு OPD (02:00 PM – 05:30 PM)' : 'Afternoon Super-Specialty (02:00 PM – 05:30 PM)'}
          </h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {afternoonAvailableCount} / {slots.afternoon.length} {isTamil ? 'கிடைக்கிறது' : 'Available'}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {slots.afternoon.map((slot) => {
            const isSelected = selectedTimeSlot === slot.time;
            return (
              <button
                key={slot.time}
                type="button"
                id={`slot-afternoon-${slot.time.replace(/[: ]/g, '-')}`}
                disabled={!slot.available}
                onClick={() => slot.available && onSelectTimeSlot(slot.time)}
                title={slot.available ? slot.time : (isTamil ? 'இந்த நேரம் முன்பதிவாகிவிட்டது' : 'Slot already booked (Full)')}
                className={`relative py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center overflow-hidden ${
                  !slot.available
                    ? 'bg-slate-100/80 text-slate-400 border-slate-200 cursor-not-allowed select-none filter blur-[1.5px] opacity-40 grayscale pointer-events-none'
                    : isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300 scale-105 cursor-pointer z-10 font-black'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-sky-400 hover:bg-sky-50 cursor-pointer hover:shadow-xs'
                }`}
              >
                <span>{slot.time}</span>
                <span className={`text-[9px] font-semibold mt-0.5 flex items-center gap-1 ${
                  !slot.available
                    ? 'text-rose-500 font-bold'
                    : isSelected
                    ? 'text-sky-200 font-bold'
                    : 'text-emerald-600'
                }`}>
                  {slot.available ? (
                    isTamil ? 'டோக்கன் #' + slot.tokenNumber : 'Token #' + slot.tokenNumber
                  ) : (
                    <>
                      <FaLock size={8} />
                      <span>{isTamil ? 'நிரம்பியது' : 'Full'}</span>
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Patient Details Form */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <FaUser className="text-sky-600" /> {isTamil ? 'டோக்கன் பாஸிற்கான நோயாளி விவரங்கள்' : 'Patient Details for Token Pass'}
          </h3>
          <div className="flex items-center gap-1.5">
            <FaUsers className="text-slate-400" size={13} />
            <select
              value={selectedFamilyId}
              onChange={(e) => handleFamilyChange(e.target.value)}
              className="text-xs font-bold rounded-xl border border-slate-300 py-1.5 px-2.5 bg-slate-50 text-slate-800 cursor-pointer"
            >
              {mockFamilyMembers.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.relationship})
                </option>
              ))}
              <option value="custom">{isTamil ? '+ பிறர் / புதிய பெயர்' : '+ Other / Enter New Name'}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label={isTamil ? 'நோயாளி பெயர்' : 'Patient Name'}
            value={patientDetails?.patientName || ''}
            onChange={(e) => onUpdatePatientDetails({ patientName: e.target.value })}
            placeholder={isTamil ? "எ.கா. சுந்தர் / பிரியா" : "e.g. Sundar / Priya"}
            required
          />

          <Input
            label={isTamil ? 'தொடர்பு தொலைபேசி' : 'Contact Mobile'}
            type="tel"
            value={patientDetails?.patientPhone || ''}
            onChange={(e) => onUpdatePatientDetails({ patientPhone: e.target.value })}
            placeholder="9876543210"
            icon={FaPhone}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                {isTamil ? 'வயது' : 'Age'}
              </label>
              <input
                type="number"
                value={patientDetails?.patientAge || 30}
                onChange={(e) => onUpdatePatientDetails({ patientAge: parseInt(e.target.value, 10) || '' })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                min="1"
                max="120"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                {isTamil ? 'பாலினம்' : 'Gender'}
              </label>
              <select
                value={patientDetails?.patientGender || 'Male'}
                onChange={(e) => onUpdatePatientDetails({ patientGender: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="Male">{isTamil ? 'ஆண் (Male)' : 'Male'}</option>
                <option value="Female">{isTamil ? 'பெண் (Female)' : 'Female'}</option>
                <option value="Other">{isTamil ? 'மற்றவை (Other)' : 'Other'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
              {isTamil ? 'உடல்நல பிரச்சனை சுருக்கம்' : 'Health Concern Summary'}
            </label>
            <input
              type="text"
              value={patientDetails?.problem || 'General Consultation'}
              onChange={(e) => onUpdatePatientDetails({ problem: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g. Fever with body ache"
            />
          </div>
        </div>
      </Card>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
        {onBack && (
          <Button onClick={onBack} variant="outline" size="md" icon={FaArrowLeft}>
            {isTamil ? 'மருத்துவர் தேர்வுக்கு திரும்ப' : 'Back to Doctors'}
          </Button>
        )}
        <Button 
          id="confirm-token-booking-btn"
          onClick={handleConfirmClick}
          disabled={loading}
          size="lg"
          className="font-black text-xs ml-auto shadow-lg bg-sky-600 hover:bg-sky-700 cursor-pointer text-white"
          icon={FaCheckCircle}
        >
          {loading 
            ? (isTamil ? 'டோக்கன் பெறப்படுகிறது...' : 'Generating Token...') 
            : (isTamil ? 'டோக்கன் முன்பதிவை உறுதி செய் →' : 'Confirm Token Booking →')}
        </Button>
      </div>
    </div>
  );
};

export default TimeSlotSelection;
