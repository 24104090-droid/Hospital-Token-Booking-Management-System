import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { useHospital } from '../../context/HospitalContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';
import { 
  FaHospital, 
  FaUserMd, 
  FaBell, 
  FaCheck, 
  FaTimes, 
  FaClock, 
  FaForward, 
  FaMicrophone,
  FaBed,
  FaTicketAlt,
  FaFilePrescription,
  FaPlus,
  FaTrash,
  FaPaperPlane,
  FaPills,
  FaVolumeUp
} from 'react-icons/fa';
import { speakTokenAnnouncement, testHospitalAudio } from '../../utils/hospitalAudio';

const HospitalStaffDashboard = () => {
  const { user } = useAuth();
  const { 
    appointments, 
    codeRedActive, 
    codeRedDetails, 
    triggerCodeRed, 
    clearCodeRed 
  } = useBooking();
  const { hospitals } = useHospital();

  const currentHospital = hospitals.find(h => h.id === (user?.hospitalId || 'h1')) || hospitals[0];
  
  const [currentServingToken, setCurrentServingToken] = useState(14);
  const [activeDoctorRoom, setActiveDoctorRoom] = useState('OPD-204 (Maternity)');
  const [doctorPresent, setDoctorPresent] = useState(true);
  const [currentQueue, setCurrentQueue] = useState([
    { token: 14, patient: 'Subramanian M', age: 34, dept: 'General Medicine', problem: 'Fever & Chills', status: 'In Consultation', prescriptionSent: false },
    { token: 15, patient: 'Muruganandam P', age: 45, dept: 'General Medicine', problem: 'Headache & Nausea', status: 'Waiting outside', prescriptionSent: false },
    { token: 16, patient: 'Anandhi S', age: 28, dept: 'General Medicine', problem: 'Viral Cough', status: 'Waiting outside', prescriptionSent: false },
    { token: 17, patient: 'Gopalakrishnan V', age: 52, dept: 'General Medicine', problem: 'High BP Follow-up', status: 'In Queue', prescriptionSent: false },
    { token: 18, patient: 'Devi Meenakshi', age: 36, dept: 'General Medicine', problem: 'Abdominal Cramps', status: 'In Queue', prescriptionSent: false }
  ]);

  // Doctor E-Prescription Modal State
  const [rxModalPatient, setRxModalPatient] = useState(null);
  const [rxForm, setRxForm] = useState({
    diagnosis: '',
    medicines: [
      { name: 'Paracetamol', dosage: '650 mg', frequency: '1-0-1 (After Food)', duration: '3 Days' },
      { name: 'Pantoprazole', dosage: '40 mg', frequency: '1-0-0 (Before Food)', duration: '5 Days' }
    ],
    notes: 'Drink plenty of warm fluids. Take complete rest. Review after 3 days if symptoms persist.'
  });

  const handleCallNext = () => {
    if (codeRedActive) {
      toast.error('Cannot call next token: Code Red Emergency is currently active!');
      return;
    }
    const currentInRoom = currentQueue.find(p => p.status === 'In Consultation');
    const nextPatient = currentQueue.find(p => p.status === 'Waiting outside') || 
                        currentQueue.find(p => p.status === 'In Queue');

    if (!nextPatient) {
      if (currentInRoom) {
        setCurrentQueue(prev => prev.map(p => p.token === currentInRoom.token ? { ...p, status: 'Completed' } : p));
        toast.success(`Token #${currentServingToken} marked Completed. All room patients cleared!`);
      } else {
        toast('No more patients waiting in the queue!', { icon: '🏁' });
      }
      return;
    }

    const nextToken = nextPatient.token;
    setCurrentServingToken(nextToken);

    setCurrentQueue(prev => {
      let updated = prev.map(p => {
        if (currentInRoom && p.token === currentInRoom.token) {
          return { ...p, status: 'Completed' };
        }
        if (p.token === nextToken) {
          return { ...p, status: 'In Consultation' };
        }
        return p;
      });

      // Promote first in queue to waiting outside if slot available
      const firstInQueue = updated.find(p => p.status === 'In Queue');
      if (firstInQueue) {
        updated = updated.map(p => p.token === firstInQueue.token ? { ...p, status: 'Waiting outside' } : p);
      }

      return updated;
    });

    toast.success(`📢 Announcing Token #${nextToken} (${nextPatient.patient}) into ${activeDoctorRoom}`);

    // Play Hospital Chime + Bilingual PA Voice Announcement
    speakTokenAnnouncement({
      tokenNumber: nextToken,
      patientName: nextPatient.patient,
      room: activeDoctorRoom,
      doctorName: user?.name || 'Doctor'
    });
  };

  const handleCompleteConsultation = (token) => {
    toast.success(`✔ Token #${token} consultation completed!`);
    
    const remaining = currentQueue.filter(p => p.token !== token);
    const nextPatient = remaining.find(p => p.status === 'Waiting outside') || 
                        remaining.find(p => p.status === 'In Queue');

    setCurrentQueue(prev => {
      let updated = prev.map(p => {
        if (p.token === token) return { ...p, status: 'Completed' };
        if (nextPatient && p.token === nextPatient.token) return { ...p, status: 'In Consultation' };
        return p;
      });

      const firstInQueue = updated.find(p => p.status === 'In Queue');
      if (firstInQueue) {
        updated = updated.map(p => p.token === firstInQueue.token ? { ...p, status: 'Waiting outside' } : p);
      }

      return updated;
    });

    if (nextPatient) {
      setCurrentServingToken(nextPatient.token);
    }
  };

  const handleCallIntoChamber = (token) => {
    const patient = currentQueue.find(p => p.token === token);
    if (!patient) return;

    setCurrentServingToken(token);
    setCurrentQueue(prev => {
      let updated = prev.map(p => {
        if (p.status === 'In Consultation' && p.token !== token) {
          return { ...p, status: 'Completed' };
        }
        if (p.token === token) {
          return { ...p, status: 'In Consultation' };
        }
        return p;
      });

      const firstInQueue = updated.find(p => p.status === 'In Queue');
      if (firstInQueue && !updated.some(p => p.status === 'Waiting outside')) {
        updated = updated.map(p => p.token === firstInQueue.token ? { ...p, status: 'Waiting outside' } : p);
      }

      return updated;
    });

    toast.success(`🩺 Token #${token} (${patient.patient}) admitted to Chamber`);
  };

  const handleMoveToWaitingOutside = (token) => {
    setCurrentQueue(prev => prev.map(p => p.token === token ? { ...p, status: 'Waiting outside' } : p));
    toast(`🔔 Token #${token} notified to wait outside Chamber Door`, { icon: '🚪' });
  };

  const handleSkipToken = (token) => {
    toast('Token #' + token + ' marked as Skipped / Absent', { icon: '⏭️' });
    
    const wasInConsultation = currentServingToken === token || 
      currentQueue.find(p => p.token === token)?.status === 'In Consultation';

    const remaining = currentQueue.filter(p => p.token !== token);
    const nextPatient = remaining.find(p => p.status === 'Waiting outside') || 
                        remaining.find(p => p.status === 'In Queue');

    setCurrentQueue(prev => {
      let updated = prev.map(p => {
        if (p.token === token) return { ...p, status: 'Skipped' };
        if (wasInConsultation && nextPatient && p.token === nextPatient.token) {
          return { ...p, status: 'In Consultation' };
        }
        return p;
      });
      return updated;
    });

    if (wasInConsultation && nextPatient) {
      setCurrentServingToken(nextPatient.token);
    }
  };

  const handleRequeueToken = (token) => {
    setCurrentQueue(prev => prev.map(p => p.token === token ? { ...p, status: 'Waiting outside' } : p));
    toast.success(`Token #${token} restored to Waiting list!`);
  };

  const handleResetQueue = () => {
    setCurrentServingToken(14);
    setCurrentQueue([
      { token: 14, patient: 'Subramanian M', age: 34, dept: 'General Medicine', problem: 'Fever & Chills', status: 'In Consultation' },
      { token: 15, patient: 'Muruganandam P', age: 45, dept: 'General Medicine', problem: 'Headache & Nausea', status: 'Waiting outside' },
      { token: 16, patient: 'Anandhi S', age: 28, dept: 'General Medicine', problem: 'Viral Cough', status: 'Waiting outside' },
      { token: 17, patient: 'Gopalakrishnan V', age: 52, dept: 'General Medicine', problem: 'High BP Follow-up', status: 'In Queue' },
      { token: 18, patient: 'Devi Meenakshi', age: 36, dept: 'General Medicine', problem: 'Abdominal Cramps', status: 'In Queue' }
    ]);
    toast.success('Queue reset to initial demo state!');
  };

  const handleOpenPrescriptionModal = (patient) => {
    setRxModalPatient(patient);
    setRxForm({
      diagnosis: patient.problem || 'Acute Viral Infection',
      scheme: 'govt_free',
      medicines: [
        { name: 'Paracetamol', dosage: '650 mg', frequency: '1-0-1 (After Food)', duration: '3 Days' },
        { name: 'Pantoprazole', dosage: '40 mg', frequency: '1-0-0 (Before Food)', duration: '5 Days' },
        { name: 'Cetirizine', dosage: '10 mg', frequency: '0-0-1 (Night)', duration: '5 Days' }
      ],
      notes: 'Take medicines as directed. Drink boiled warm water. Rest adequately.'
    });
  };

  const handleSendPrescription = (e) => {
    e.preventDefault();
    if (!rxModalPatient) return;

    const validMeds = rxForm.medicines.filter(m => m.name.trim());
    if (validMeds.length === 0) {
      toast.error('Please specify at least one medicine.');
      return;
    }

    const schemeChoice = rxForm.scheme || 'govt_free';
    const grossVal = 140;
    const discountVal = schemeChoice === 'govt_free' ? 140 : schemeChoice === 'jan_aushadhi' ? 98 : 0;
    const netVal = grossVal - discountVal;

    const newPrescription = {
      id: `rx-tvl-token-${rxModalPatient.token}`,
      tokenNumber: rxModalPatient.token,
      patientName: rxModalPatient.patient,
      doctorName: user?.name || 'Dr. S. Sundararajan, MD',
      hospitalName: currentHospital.name,
      date: new Date().toISOString().split('T')[0],
      diagnosis: rxForm.diagnosis || rxModalPatient.problem,
      specialty: rxModalPatient.dept || 'General Medicine',
      medicines: validMeds,
      notes: rxForm.notes,
      verified: true,
      fileType: `Doctor E-Prescription (Token #${rxModalPatient.token})`,
      pharmacyStatus: 'queued',
      pharmacyCounter: 'Counter 4 (Express OPD Dispenser)',
      binNumber: `B-${rxModalPatient.token}`,
      pickupOtp: `${Math.floor(1000 + Math.random() * 9000)}`,
      receivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      billing: {
        scheme: schemeChoice,
        schemeLabel: schemeChoice === 'govt_free' ? 'TNMSC 100% Free Govt Scheme' : schemeChoice === 'jan_aushadhi' ? 'Jan Aushadhi Generic (70% Off)' : 'Standard Retail Billing',
        grossTotal: grossVal,
        discount: discountVal,
        netPayable: netVal,
        paymentStatus: schemeChoice === 'govt_free' ? 'govt_free' : 'unpaid',
        paymentMethod: schemeChoice === 'govt_free' ? 'TNMSC 100% Free Scheme' : null,
        transactionId: schemeChoice === 'govt_free' ? `TNMSC-FREE-${Math.floor(100000 + Math.random() * 899999)}` : null,
        paidAt: schemeChoice === 'govt_free' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
      }
    };

    try {
      const existing = JSON.parse(localStorage.getItem('tvl_health_records') || '[]');
      const filtered = existing.filter(r => r.id !== newPrescription.id);
      localStorage.setItem('tvl_health_records', JSON.stringify([newPrescription, ...filtered]));
    } catch (err) {
      console.error(err);
    }

    // Mark patient as having prescription sent in queue
    setCurrentQueue(prev => prev.map(p => p.token === rxModalPatient.token ? { ...p, prescriptionSent: true } : p));
    toast.success(`🎉 E-Prescription sent to Token #${rxModalPatient.token} (${rxModalPatient.patient})! Auto-routed to Pharmacy Counter 4 (Bin #B-${rxModalPatient.token}) for express pre-packing.`);
    setRxModalPatient(null);
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* 🚨 Code Red Emergency Active Strobe Banner */}
      {codeRedActive && (
        <div className="rounded-3xl bg-gradient-to-r from-red-900 via-rose-700 to-red-900 border-4 border-red-500 shadow-2xl p-4 sm:p-5 text-white animate-pulse flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white text-rose-700 flex items-center justify-center text-2xl font-black shadow-lg animate-bounce">
              <FaAmbulance />
            </div>
            <div>
              <div className="text-xs font-black tracking-widest uppercase text-yellow-300">
                🚨 CODE RED EMERGENCY TRAUMA OVERRIDE ACTIVE
              </div>
              <div className="text-lg font-black text-white">
                Regular OPD Consultations Temporarily Suspended
              </div>
              <p className="text-xs text-rose-100">
                {codeRedDetails?.reason || 'Cardiac / Trauma Emergency'} · Room: {activeDoctorRoom}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearCodeRed}
            className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <FaCheck />
            <span>Stand-Down / Code Green (Resume Queue)</span>
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-teal-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-widest mb-1">
            <FaUserMd /> Hospital OPD Counter Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{currentHospital.name}</h1>
          <p className="text-xs text-teal-200 mt-1">
            Logged in as <strong>{user?.name || 'OPD Sister Stella'}</strong> · Room: <strong>{activeDoctorRoom}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] uppercase font-bold text-teal-200 block">Current Token</span>
            <span className="text-3xl font-mono font-black text-emerald-300">
              #{currentServingToken}
            </span>
          </div>

          <Link
            to="/opd-display"
            className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-teal-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            title="Open Waiting Hall Smart TV Display"
          >
            <span>📺 TV Display</span>
          </Link>

          {!codeRedActive ? (
            <button
              type="button"
              onClick={() => triggerCodeRed({ room: activeDoctorRoom, doctor: user?.name || 'Dr. Sundararajan' })}
              className="px-3.5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              title="Trigger Emergency Code Red Priority"
            >
              <span>🚨 Code Red</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={clearCodeRed}
              className="px-3.5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>✅ Clear Code Red</span>
            </button>
          )}

          <Link
            to="/pharmacy"
            className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            title="Open Pharmacy Pre-Packing and Dispense Console"
          >
            <span>💊 Pharmacy →</span>
          </Link>

          <button
            type="button"
            onClick={testHospitalAudio}
            className="px-3.5 py-2.5 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            title="Click to test Hospital Chime & Announcement"
          >
            <FaVolumeUp size={12} />
            <span>Voice Test</span>
          </button>

          <Button
            onClick={handleCallNext}
            size="lg"
            className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold border-none shadow-lg text-sm"
            icon={FaBell}
          >
            Call Token #{currentServingToken + 1}
          </Button>
        </div>
      </div>

      {/* OPD Room Quick Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex items-center justify-between p-4">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Doctor Status</div>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {doctorPresent ? '🟢 In OPD Chamber' : '🔴 On Round / Break'}
            </div>
          </div>
          <button
            onClick={() => {
              setDoctorPresent(!doctorPresent);
              toast.success(doctorPresent ? 'Doctor set to On Break' : 'Doctor marked Available in Room');
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-50"
          >
            Toggle Status
          </button>
        </Card>

        <Card className="flex items-center justify-between p-4">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Active Room</div>
            <select
              value={activeDoctorRoom}
              onChange={(e) => setActiveDoctorRoom(e.target.value)}
              className="text-xs font-bold rounded-lg border border-slate-300 py-1 px-2 mt-1"
            >
              <option value="OPD-204 (Maternity)">OPD-204 (Maternity)</option>
              <option value="OPD-102 (General Medicine)">OPD-102 (General Medicine)</option>
              <option value="Cardio Wing A">Cardio Wing A</option>
              <option value="Casualty Trauma Room">Casualty Trauma Room</option>
            </select>
          </div>
        </Card>

        <Card className="flex items-center justify-between p-4">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Emergency Bed Allotment</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">14 ICU Beds Available</div>
          </div>
          <span className="badge badge-success text-[10px] font-bold">READY</span>
        </Card>
      </div>

      {/* Real-time Triage Queue */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Room Waiting List ({currentQueue.length} Patients)</h2>
            <p className="text-xs text-slate-500">Live queue management for OPD consultation chamber</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetQueue}
              className="text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              title="Reset queue to demo state"
            >
              ↺ Reset Queue
            </button>
            <span className="badge badge-primary font-bold text-xs">Audio Mic Ready 🎙️</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase bg-slate-50">
                <th className="p-3">Token</th>
                <th className="p-3">Patient Name</th>
                <th className="p-3">Health Complaint</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentQueue.map((item) => {
                const isInConsultation = item.status === 'In Consultation' || item.token === currentServingToken;
                const isWaitingOutside = item.status === 'Waiting outside' && !isInConsultation;
                const isInQueue = item.status === 'In Queue' && !isInConsultation;
                const isCompleted = item.status === 'Completed';
                const isSkipped = item.status === 'Skipped';

                return (
                  <tr key={item.token} className={`hover:bg-slate-50 ${isInConsultation ? 'bg-emerald-50/50 font-semibold' : ''}`}>
                    <td className="p-3">
                      <span className={`font-mono font-black px-2 py-1 rounded-lg text-xs ${
                        isInConsultation ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-700'
                      }`}>
                        #{item.token}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{item.patient}</div>
                      <div className="text-[10px] text-slate-500">{item.age} yrs · {item.dept}</div>
                    </td>
                    <td className="p-3 text-slate-700">{item.problem}</td>
                    <td className="p-3">
                      {isInConsultation ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          IN CONSULTATION
                        </span>
                      ) : isWaitingOutside ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          ⏳ WAITING OUTSIDE
                        </span>
                      ) : isInQueue ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                          👥 IN QUEUE
                        </span>
                      ) : isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300">
                          ✔ COMPLETED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                          ⏭️ SKIPPED
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-1.5 justify-end items-center">
                        {/* 1. In Consultation Actions */}
                        {isInConsultation && (
                          <>
                            <button
                              onClick={() => handleOpenPrescriptionModal(item)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black shadow-xs flex items-center gap-1 transition-all cursor-pointer ${
                                item.prescriptionSent
                                  ? 'bg-teal-100 text-teal-800 border border-teal-300'
                                  : 'bg-teal-600 hover:bg-teal-700 text-white'
                              }`}
                              title={`Write & send E-Prescription to Token #${item.token}`}
                            >
                              <FaFilePrescription size={11} />
                              <span>{item.prescriptionSent ? '✓ Rx Sent' : '℞ Write Rx'}</span>
                            </button>
                            <button
                              onClick={() => handleCompleteConsultation(item.token)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                              title="Finish consultation and call next patient"
                            >
                              <FaCheck size={10} /> Complete
                            </button>
                            <button
                              onClick={() => handleSkipToken(item.token)}
                              className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold hover:bg-slate-200 flex items-center gap-1 transition-all cursor-pointer"
                              title="Mark as Absent/Skip"
                            >
                              <FaForward size={9} /> Skip
                            </button>
                          </>
                        )}

                        {/* 2. Waiting Outside Actions (NOT Completed!) */}
                        {isWaitingOutside && (
                          <>
                            <button
                              onClick={() => handleCallIntoChamber(item.token)}
                              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-[10px] font-bold shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                              title="Call patient into doctor chamber"
                            >
                              <FaUserMd size={10} /> Call In Chamber
                            </button>
                            <button
                              onClick={() => handleSkipToken(item.token)}
                              className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold hover:bg-slate-200 flex items-center gap-1 transition-all cursor-pointer"
                              title="Mark as Absent/Skip"
                            >
                              <FaForward size={9} /> Skip
                            </button>
                          </>
                        )}

                        {/* 3. In Queue Actions (NOT Completed!) */}
                        {isInQueue && (
                          <>
                            <button
                              onClick={() => handleMoveToWaitingOutside(item.token)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                              title="Notify patient to move outside door"
                            >
                              <FaBell size={10} /> Call to Door
                            </button>
                            <button
                              onClick={() => handleCallIntoChamber(item.token)}
                              className="px-2 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-700 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                              title="Directly admit to chamber"
                            >
                              <FaUserMd size={9} /> Fast In
                            </button>
                            <button
                              onClick={() => handleSkipToken(item.token)}
                              className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold hover:bg-slate-200 flex items-center gap-1 transition-all cursor-pointer"
                              title="Mark as Absent/Skip"
                            >
                              <FaForward size={9} /> Skip
                            </button>
                          </>
                        )}

                        {/* 4. Completed Status */}
                        {isCompleted && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenPrescriptionModal(item)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                item.prescriptionSent
                                  ? 'bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100'
                                  : 'bg-teal-600 text-white hover:bg-teal-700 border-teal-600'
                              }`}
                              title="Send or update prescription"
                            >
                              <FaFilePrescription size={10} />
                              <span>{item.prescriptionSent ? '✓ Rx Sent' : '℞ Issue Rx'}</span>
                            </button>
                            <span className="px-2 py-1 rounded-lg bg-teal-50 text-teal-700 text-[10px] font-bold border border-teal-200 flex items-center gap-1">
                              <FaCheck size={9} /> Done
                            </span>
                          </div>
                        )}

                        {/* 5. Skipped Status */}
                        {isSkipped && (
                          <button
                            onClick={() => handleRequeueToken(item.token)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200 flex items-center gap-1 cursor-pointer transition-all"
                            title="Re-add to waiting outside"
                          >
                            🔄 Recall
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Doctor E-Prescription Modal */}
      {rxModalPatient && (
        <Modal
          isOpen={Boolean(rxModalPatient)}
          onClose={() => setRxModalPatient(null)}
          title={`Doctor E-Prescription: Token #${rxModalPatient.token} (${rxModalPatient.patient})`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSendPrescription} className="space-y-4 text-left p-1">
            {/* Patient Header Banner */}
            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                  OPD Room: {activeDoctorRoom}
                </span>
                <h4 className="font-black text-slate-900 text-base mt-1">
                  {rxModalPatient.patient} ({rxModalPatient.age} yrs)
                </h4>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">
                  Dept: {rxModalPatient.dept} · Complaint: <strong>{rxModalPatient.problem}</strong>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-mono font-black text-teal-800 bg-white px-3 py-1 rounded-xl border border-teal-200 shadow-2xs">
                  TOKEN #{rxModalPatient.token}
                </span>
                <div className="text-[10px] text-slate-400 mt-1">
                  Doctor: {user?.name || 'Dr. S. Sundararajan, MD'}
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Clinical Diagnosis</label>
              <input
                type="text"
                value={rxForm.diagnosis}
                onChange={(e) => setRxForm({ ...rxForm, diagnosis: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-teal-500"
                placeholder="e.g. Acute Upper Respiratory Tract Infection & Fever"
              />
            </div>

            {/* Quick Add Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400">Quick Packs:</span>
              <button
                type="button"
                onClick={() => {
                  setRxForm(prev => ({
                    ...prev,
                    diagnosis: 'Acute Viral Fever & Body Ache',
                    medicines: [
                      { name: 'Paracetamol', dosage: '650 mg', frequency: '1-0-1 (After Food)', duration: '3 Days' },
                      { name: 'Pantoprazole', dosage: '40 mg', frequency: '1-0-0 (Before Food)', duration: '5 Days' },
                      { name: 'Vitamin C + Zinc', dosage: '500 mg', frequency: '0-1-0 (Afternoon)', duration: '5 Days' }
                    ]
                  }));
                }}
                className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[10px] font-bold border border-teal-200 transition-colors cursor-pointer"
              >
                + Fever Pack
              </button>

              <button
                type="button"
                onClick={() => {
                  setRxForm(prev => ({
                    ...prev,
                    diagnosis: 'Acute Bronchitis & Cough',
                    medicines: [
                      { name: 'Amoxicillin + Clavulanic Acid', dosage: '625 mg', frequency: '1-0-1 (After Food)', duration: '5 Days' },
                      { name: 'Montelukast + Levocetirizine', dosage: '10mg/5mg', frequency: '0-0-1 (Night)', duration: '7 Days' },
                      { name: 'Cough Expectorant Syrup', dosage: '10 ml', frequency: '1-1-1 (Thrice Daily)', duration: '5 Days' }
                    ]
                  }));
                }}
                className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[10px] font-bold border border-teal-200 transition-colors cursor-pointer"
              >
                + Cough & Cold Pack
              </button>

              <button
                type="button"
                onClick={() => {
                  setRxForm(prev => ({
                    ...prev,
                    diagnosis: 'Essential Hypertension Check',
                    medicines: [
                      { name: 'Telmisartan', dosage: '40 mg', frequency: '1-0-0 (Morning)', duration: '30 Days' },
                      { name: 'Amlodipine', dosage: '5 mg', frequency: '0-0-1 (Night)', duration: '30 Days' }
                    ]
                  }));
                }}
                className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[10px] font-bold border border-teal-200 transition-colors cursor-pointer"
              >
                + BP Follow-up Pack
              </button>
            </div>

            {/* Medicines List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Prescribed Medicines ({rxForm.medicines.length})</label>
                <button
                  type="button"
                  onClick={() => {
                    setRxForm(prev => ({
                      ...prev,
                      medicines: [
                        ...prev.medicines,
                        { name: '', dosage: '', frequency: '1-0-1 (After Food)', duration: '5 Days' }
                      ]
                    }));
                  }}
                  className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                >
                  <FaPlus size={10} /> <span>Add Medicine</span>
                </button>
              </div>

              {rxForm.medicines.map((med, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      placeholder="Medicine Name (e.g. Paracetamol)"
                      value={med.name}
                      onChange={(e) => {
                        const updated = [...rxForm.medicines];
                        updated[idx].name = e.target.value;
                        setRxForm({ ...rxForm, medicines: updated });
                      }}
                      required
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Dosage (650 mg)"
                      value={med.dosage}
                      onChange={(e) => {
                        const updated = [...rxForm.medicines];
                        updated[idx].dosage = e.target.value;
                        setRxForm({ ...rxForm, medicines: updated });
                      }}
                      className="w-28 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    />
                    {rxForm.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setRxForm({
                            ...rxForm,
                            medicines: rxForm.medicines.filter((_, i) => i !== idx)
                          });
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                      >
                        <FaTrash size={12} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={med.frequency}
                      onChange={(e) => {
                        const updated = [...rxForm.medicines];
                        updated[idx].frequency = e.target.value;
                        setRxForm({ ...rxForm, medicines: updated });
                      }}
                      className="flex-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    >
                      <option value="1-0-1 (After Food)">1-0-1 (Morning & Night - After Food)</option>
                      <option value="1-0-0 (Morning)">1-0-0 (Morning only)</option>
                      <option value="0-0-1 (Night)">0-0-1 (Night only)</option>
                      <option value="1-1-1 (Thrice Daily)">1-1-1 (Thrice Daily)</option>
                      <option value="1-0-0 (Before Food)">1-0-0 (Before Food - Morning)</option>
                      <option value="As Needed / SOS">As Needed / SOS</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Duration (3 Days)"
                      value={med.duration}
                      onChange={(e) => {
                        const updated = [...rxForm.medicines];
                        updated[idx].duration = e.target.value;
                        setRxForm({ ...rxForm, medicines: updated });
                      }}
                      className="w-28 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Doctor's Notes */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Doctor Advice / Diet Advice</label>
              <textarea
                value={rxForm.notes}
                onChange={(e) => setRxForm({ ...rxForm, notes: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-teal-500"
                placeholder="e.g. Avoid cold food. Hydrate well. Review after 3 days."
              />
            </div>

            {/* Pharmacy Subsidy & Scheme Routing */}
            <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-200 text-xs">
              <label className="font-bold text-teal-900 block mb-1.5">
                🏛️ Pharmacy Billing & Subsidy Scheme:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label className={`p-2 rounded-xl border text-left cursor-pointer transition-all flex flex-col ${
                  rxForm.scheme === 'govt_free' ? 'bg-teal-700 text-white border-teal-800 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="rxScheme"
                    value="govt_free"
                    checked={rxForm.scheme === 'govt_free'}
                    onChange={() => setRxForm({ ...rxForm, scheme: 'govt_free' })}
                    className="sr-only"
                  />
                  <span className="font-bold text-[11px]">🟢 TNMSC 100% Free</span>
                  <span className={`text-[10px] mt-0.5 ${rxForm.scheme === 'govt_free' ? 'text-teal-100' : 'text-slate-500'}`}>Govt OPD · ₹0 Pay</span>
                </label>

                <label className={`p-2 rounded-xl border text-left cursor-pointer transition-all flex flex-col ${
                  rxForm.scheme === 'jan_aushadhi' ? 'bg-teal-700 text-white border-teal-800 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="rxScheme"
                    value="jan_aushadhi"
                    checked={rxForm.scheme === 'jan_aushadhi'}
                    onChange={() => setRxForm({ ...rxForm, scheme: 'jan_aushadhi' })}
                    className="sr-only"
                  />
                  <span className="font-bold text-[11px]">🟡 Jan Aushadhi 70% Off</span>
                  <span className={`text-[10px] mt-0.5 ${rxForm.scheme === 'jan_aushadhi' ? 'text-teal-100' : 'text-slate-500'}`}>Subsidized · UPI/Cash</span>
                </label>

                <label className={`p-2 rounded-xl border text-left cursor-pointer transition-all flex flex-col ${
                  rxForm.scheme === 'private' ? 'bg-teal-700 text-white border-teal-800 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="rxScheme"
                    value="private"
                    checked={rxForm.scheme === 'private'}
                    onChange={() => setRxForm({ ...rxForm, scheme: 'private' })}
                    className="sr-only"
                  />
                  <span className="font-bold text-[11px]">🔵 Retail / Private</span>
                  <span className={`text-[10px] mt-0.5 ${rxForm.scheme === 'private' ? 'text-teal-100' : 'text-slate-500'}`}>Full MRP · Pay at Counter</span>
                </label>
              </div>
            </div>

            {/* Send Button */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRxModalPatient(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <FaPaperPlane size={11} />
                <span>Send E-Prescription to Token #{rxModalPatient.token}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default HospitalStaffDashboard;
