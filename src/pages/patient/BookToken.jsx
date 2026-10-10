import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Ticket,
  Building2,
  Stethoscope,
  User,
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle,
  Users2,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { HospitalContext } from '../../context/HospitalContext';
import { BookingContext } from '../../context/BookingContext';
import { FamilyContext } from '../../context/FamilyContext';
import { AuthContext } from '../../context/AuthContext';
import { mockHospitals } from '../../data/mockHospitals';
import { diseaseMapping } from '../../data/diseaseMapping';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';

const BookToken = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramHospitalId = searchParams.get('hospitalId');
  const paramDoctor = searchParams.get('doctor');
  const paramDept = searchParams.get('dept');

  const { patient } = useContext(AuthContext);
  const { selectedDisease, specialty } = useContext(HospitalContext);
  const { bookToken } = useContext(BookingContext);
  const { familyMembers } = useContext(FamilyContext);

  const [selectedHospId, setSelectedHospId] = useState(paramHospitalId || 'h1');
  const [patientChoice, setPatientChoice] = useState('self'); // 'self' or familyId
  const [department, setDepartment] = useState(paramDept || specialty || 'General Medicine');
  const [doctor, setDoctor] = useState(paramDoctor || '');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [symptoms, setSymptoms] = useState(selectedDisease || '');
  const [isPriority, setIsPriority] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentHospital = mockHospitals.find(h => String(h.id) === String(selectedHospId)) || mockHospitals[0];

  // Update doctor options based on selected hospital & department
  const availableDoctors = currentHospital.doctors || [];

  const timeSlots = [
    '08:30 AM - 09:30 AM',
    '09:30 AM - 10:30 AM',
    '10:30 AM - 11:30 AM',
    '11:30 AM - 12:30 PM',
    '03:30 PM - 04:30 PM',
    '04:30 PM - 05:30 PM',
    '05:30 PM - 06:30 PM'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      let patientName = patient?.name || 'Patient';
      let patientAge = patient?.age || 30;
      let patientGender = patient?.gender || 'Male';
      let patientMobile = patient?.mobile || '+91 98765 43210';

      if (patientChoice !== 'self') {
        const familyMember = familyMembers.find(f => f.id === patientChoice);
        if (familyMember) {
          patientName = familyMember.name;
          patientAge = familyMember.age;
          patientGender = familyMember.gender;
        }
      }

      const booked = await bookToken({
        hospitalId: currentHospital.id,
        hospitalName: currentHospital.name,
        type: currentHospital.type,
        department,
        doctor: doctor || (availableDoctors[0] ? availableDoctors[0].name : 'On-Duty Specialist'),
        room: availableDoctors[0] ? availableDoctors[0].room : 'OPD Room 1',
        patientName,
        patientAge,
        patientGender,
        patientMobile,
        disease: symptoms || 'General OPD',
        timeSlot,
        isPriority,
        notes
      });

      navigate('/confirmation', { state: { token: booked } });
    } catch (err) {
      console.error(err);
      setError('Could not complete token booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-sky-700 mb-4 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Ticket className="w-4 h-4" /> Fast-Track OPD Pass
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Book Hospital OPD Token
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Instant digital token reservation with real-time queue position
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-xs font-bold rounded-2xl border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1 & 2: Form Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Hospital & Department */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-600" />
                1. Select Hospital & Department
              </h3>

              <div className="space-y-3">
                <Select
                  label="Hospital"
                  value={selectedHospId}
                  onChange={(e) => setSelectedHospId(e.target.value)}
                  options={mockHospitals.map(h => ({
                    value: h.id,
                    label: `${h.name} (${h.type} • ${h.availableTokens} tokens left)`
                  }))}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Select
                    label="OPD Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    options={currentHospital.departments.map(d => ({
                      value: d,
                      label: d
                    }))}
                    required
                  />

                  <Select
                    label="Doctor (Optional)"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    options={[
                      { value: '', label: 'Next Available OPD Specialist' },
                      ...availableDoctors.map(d => ({
                        value: d.name,
                        label: `${d.name} (${d.room})`
                      }))
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Patient Selection */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" />
                2. Patient Information
              </h3>

              <div className="mb-4">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Booking For:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPatientChoice('self')}
                    className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all ${
                      patientChoice === 'self'
                        ? 'bg-sky-50 border-sky-400 text-sky-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block">{patient?.name || 'Self'} (Primary)</span>
                    <span className="text-[10px] text-slate-500 font-normal">{patient?.age}y, {patient?.gender}</span>
                  </button>

                  {familyMembers.map((fam) => (
                    <button
                      key={fam.id}
                      type="button"
                      onClick={() => setPatientChoice(fam.id)}
                      className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all ${
                        patientChoice === fam.id
                          ? 'bg-sky-50 border-sky-400 text-sky-900 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block">{fam.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{fam.relationship} • {fam.age}y</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Input
                  label="Health Problem / Symptoms Description"
                  placeholder="e.g. High fever for 2 days, body chills"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  required
                />

                <Input
                  label="Additional Notes for Doctor (Optional)"
                  placeholder="Any allergies or past prescriptions"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Step 3: Date & Slot */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                3. Consultation Slot
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <Select
                  label="Preferred OPD Time Window"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  options={timeSlots.map(t => ({ value: t, label: t }))}
                  required
                />

                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                    Priority Queue Check
                  </label>
                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer text-xs font-medium text-slate-800 hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={isPriority}
                      onChange={(e) => setIsPriority(e.target.checked)}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    Senior Citizen / Pregnancy / Acute Urgent
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Live Token Summary Pass */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-3xl p-6 shadow-xl sticky top-24 border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
                  OPD Booking Preview
                </span>
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Live Queue
                </span>
              </div>

              <div className="space-y-3 text-xs mb-6">
                <div>
                  <span className="text-slate-400 block text-[11px]">Hospital</span>
                  <span className="font-bold text-sm text-white">{currentHospital.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Department</span>
                    <span className="font-bold text-slate-200">{department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Consultation Fee</span>
                    <span className="font-bold text-emerald-400">
                      {currentHospital.freeOPD ? 'FREE (Govt)' : `₹${currentHospital.consultationFee || 250}`}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Current Serving</span>
                    <span className="font-mono font-bold text-amber-300 text-sm">
                      {currentHospital.currentToken}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Est. Wait</span>
                    <span className="font-bold text-sky-300 text-sm">
                      ~{currentHospital.waitingTime} mins
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-black hover:from-sky-400 hover:to-teal-300 shadow-lg"
                disabled={submitting || currentHospital.availableTokens === 0}
              >
                {submitting ? 'Generating Token...' : 'Confirm & Get Digital Token'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <div className="mt-4 text-center">
                <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Instant QR code issued upon confirmation
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookToken;
