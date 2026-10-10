import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockAppointments as initialAppointments } from '../data/mockData';
import { TokenAPI, SmsAPI, HealthAPI } from '../services/api';
import toast from 'react-hot-toast';
import { speakCodeRedAnnouncement, speakCodeGreenAnnouncement } from '../utils/hospitalAudio';

const BookingContext = createContext();

const isKarthik = (name) => {
  if (!name) return false;
  const n = String(name).toLowerCase().trim();
  return n.includes('karthik raja') || n === 'karthik' || n.includes('karthikraja');
};

const filterOutKarthik = (list) => {
  if (!Array.isArray(list)) return [];
  return list.filter(item => !isKarthik(item?.patientName));
};

export const BookingProvider = ({ children }) => {
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem('tvl_appointments');
      if (saved) {
        const parsed = JSON.parse(saved);
        const cleaned = filterOutKarthik(parsed);
        localStorage.setItem('tvl_appointments', JSON.stringify(cleaned));
        return cleaned;
      }
      const initialCleaned = filterOutKarthik(initialAppointments);
      localStorage.setItem('tvl_appointments', JSON.stringify(initialCleaned));
      return initialCleaned;
    } catch {
      return filterOutKarthik(initialAppointments);
    }
  });

  // Current Booking Wizard State
  const [bookingData, setBookingData] = useState({
    problem: '',
    specialty: 'General Medicine',
    hospitalId: '',
    hospitalName: '',
    hospitalAddress: '',
    doctorId: '',
    doctorName: '',
    doctorRoom: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '',
    patientName: '',
    patientAge: 30,
    patientGender: 'Male',
    patientPhone: '',
    familyMemberId: 'custom',
    consultationFee: 0,
    isEmergency: false
  });

  const [lastBookedToken, setLastBookedToken] = useState(() => {
    try {
      const saved = localStorage.getItem('tvl_last_token');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (isKarthik(parsed?.patientName)) {
          localStorage.removeItem('tvl_last_token');
          return null;
        }
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Code Red Emergency Pre-emption State
  const [codeRedActive, setCodeRedActive] = useState(() => {
    try {
      return localStorage.getItem('tvl_code_red_active') === 'true';
    } catch {
      return false;
    }
  });

  const [codeRedDetails, setCodeRedDetails] = useState(() => {
    try {
      const saved = localStorage.getItem('tvl_code_red_details');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      severity: 'Level 1 Trauma Alert',
      room: 'OPD Room 102 & ICU Bay 1',
      doctor: 'Dr. S. Sundararajan (Assigned to Trauma Resuscitation)',
      reason: 'Mass Casualty / Cardiac Arrest Emergency Response',
      delayedMinutes: 15,
      timestamp: Date.now()
    };
  });

  const triggerCodeRed = ({
    room = 'OPD Room 102',
    reason = 'Trauma Resuscitation & Emergency Triage',
    doctor = 'Dr. S. Sundararajan',
    delayedMinutes = 15
  } = {}) => {
    const details = {
      severity: 'Level 1 Trauma Alert',
      room,
      doctor,
      reason,
      delayedMinutes,
      timestamp: Date.now()
    };
    setCodeRedActive(true);
    setCodeRedDetails(details);
    try {
      localStorage.setItem('tvl_code_red_active', 'true');
      localStorage.setItem('tvl_code_red_details', JSON.stringify(details));
    } catch (e) {}

    // Audio Siren + Bilingual Public Broadcast
    speakCodeRedAnnouncement({ room, reason });

    toast.error(`🚨 CODE RED EMERGENCY ACTIVATED! Consultations held for ${delayedMinutes} mins.`, {
      icon: '🚨',
      duration: 6000
    });
  };

  const clearCodeRed = () => {
    setCodeRedActive(false);
    try {
      localStorage.setItem('tvl_code_red_active', 'false');
    } catch (e) {}

    // Audio Chime + Broadcast Clearance
    speakCodeGreenAnnouncement();

    toast.success('✅ CODE RED CLEARED! Regular OPD consultations resumed.', {
      icon: '🔔',
      duration: 5000
    });
  };

  // Sync with Express backend on mount
  useEffect(() => {
    HealthAPI.check()
      .then(() => {
        setIsBackendConnected(true);
        return TokenAPI.getAllTokens();
      })
      .then(res => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const remoteCleaned = filterOutKarthik(res.data);
          setAppointments(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const toAdd = remoteCleaned.filter(r => !existingIds.has(r.id));
            const merged = [...toAdd, ...prev];
            try {
              localStorage.setItem('tvl_appointments', JSON.stringify(merged));
            } catch (e) {
              console.error(e);
            }
            return merged;
          });
        }
      })
      .catch(() => {
        setIsBackendConnected(false);
      });
  }, []);

  useEffect(() => {
    try {
      const cleaned = filterOutKarthik(appointments);
      localStorage.setItem('tvl_appointments', JSON.stringify(cleaned));
    } catch (e) {
      console.error(e);
    }
  }, [appointments]);

  useEffect(() => {
    if (lastBookedToken) {
      try {
        if (isKarthik(lastBookedToken?.patientName)) {
          localStorage.removeItem('tvl_last_token');
        } else {
          localStorage.setItem('tvl_last_token', JSON.stringify(lastBookedToken));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [lastBookedToken]);

  const updateBookingData = (fields) => {
    setBookingData(prev => ({
      ...prev,
      ...fields
    }));
  };

  const resetBookingData = () => {
    setBookingData({
      problem: '',
      specialty: 'General Medicine',
      hospitalId: '',
      hospitalName: '',
      hospitalAddress: '',
      doctorId: '',
      doctorName: '',
      doctorRoom: '',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '',
      patientName: '',
      patientAge: 30,
      patientGender: 'Male',
      patientPhone: '',
      familyMemberId: 'custom',
      consultationFee: 0,
      isEmergency: false
    });
  };

  const confirmBooking = async (overrideData = {}) => {
    const finalData = { ...bookingData, ...overrideData };
    const randomTokenNum = Math.floor(Math.random() * 30) + 12;
    const currentServing = Math.max(1, randomTokenNum - (Math.floor(Math.random() * 6) + 4));
    const tokenUuid = 'TVL-TKN-' + Math.floor(1000 + Math.random() * 9000);

    const newAppointment = {
      id: tokenUuid,
      tokenNumber: randomTokenNum,
      currentServing,
      estimatedWaitMinutes: (randomTokenNum - currentServing) * 6,
      patientName: finalData.patientName || 'Patient',
      patientAge: finalData.patientAge || 30,
      patientGender: finalData.patientGender || 'Male',
      patientPhone: finalData.patientPhone || '9876543210',
      hospitalId: finalData.hospitalId,
      hospitalName: finalData.hospitalName || 'Tirunelveli Hospital',
      hospitalAddress: finalData.hospitalAddress || 'Tirunelveli',
      department: finalData.specialty || 'General Medicine',
      doctorId: finalData.doctorId,
      doctorName: finalData.doctorName || 'Consulting Physician',
      room: finalData.doctorRoom || 'OPD Room 1',
      problem: finalData.problem || 'General Consultation',
      date: finalData.date || new Date().toISOString().split('T')[0],
      timeSlot: finalData.timeSlot || '10:00 AM',
      status: 'confirmed',
      type: finalData.isEmergency ? 'emergency' : 'normal',
      consultationFee: finalData.consultationFee || 0,
      qrCodeData: `TVL-SMARTCARE:${tokenUuid}:${finalData.hospitalId}:${finalData.timeSlot}`,
      bookedAt: new Date().toISOString()
    };

    setAppointments(prev => [newAppointment, ...prev]);
    setLastBookedToken(newAppointment);

    // Save to real Express backend on port 5000
    TokenAPI.createToken(newAppointment).catch(e => console.warn('Backend sync failed:', e.message));

    toast.success(`Token #${newAppointment.tokenNumber} Confirmed! ID: ${newAppointment.id}`);
    return newAppointment;
  };

  const bookEmergency = async (emergencyData) => {
    const tokenUuid = 'TVL-EMG-' + Math.floor(1000 + Math.random() * 9000);
    const newEmergencyToken = {
      id: tokenUuid,
      tokenNumber: 1, // immediate priority
      currentServing: 1,
      estimatedWaitMinutes: 0,
      patientName: emergencyData.patientName || 'Emergency Patient',
      patientAge: emergencyData.patientAge || 30,
      patientGender: emergencyData.patientGender || 'Not Specified',
      patientPhone: emergencyData.patientPhone || '9876543210',
      hospitalId: emergencyData.hospitalId || 'h1',
      hospitalName: emergencyData.hospitalName || 'Tirunelveli Medical College Hospital (TVMCH)',
      hospitalAddress: emergencyData.hospitalAddress || 'High Grounds, Palayamkottai, Tirunelveli',
      department: 'Emergency Medicine & Trauma',
      doctorId: 'doc-emg',
      doctorName: 'Emergency Duty Medical Officer (Casualty)',
      room: 'Red Trauma Bay / Emergency Casualty',
      problem: emergencyData.emergencyType || 'Emergency Trauma',
      date: new Date().toISOString().split('T')[0],
      timeSlot: 'IMMEDIATE',
      status: 'serving',
      type: 'emergency',
      ambulanceDispatched: emergencyData.ambulanceNeeded || false,
      ambulanceEtaMinutes: emergencyData.ambulanceNeeded ? 8 : null,
      consultationFee: 0,
      qrCodeData: `TVL-EMERGENCY-PRIORITY:${tokenUuid}`,
      bookedAt: new Date().toISOString()
    };

    setAppointments(prev => [newEmergencyToken, ...prev]);
    setLastBookedToken(newEmergencyToken);

    // Save emergency token to backend
    TokenAPI.createToken(newEmergencyToken).catch(e => console.warn('Backend emergency sync failed:', e.message));

    toast.error(`🚨 Emergency Token #${newEmergencyToken.tokenNumber} Dispatched! Priority Active.`);
    return newEmergencyToken;
  };

  const cancelAppointment = (appointmentId) => {
    setAppointments(prev => prev.map(item => {
      if (item.id === appointmentId) {
        return { ...item, status: 'cancelled' };
      }
      return item;
    }));

    // Sync cancellation to backend
    TokenAPI.cancelToken(appointmentId).catch(e => console.warn('Backend cancel sync failed:', e.message));

    toast.success('Appointment cancelled successfully.');
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setAppointments(prev => {
      const updated = prev.map(item => {
        if (item.id === appointmentId || String(item.tokenNumber) === String(appointmentId)) {
          return { ...item, status: newStatus };
        }
        return item;
      });
      try {
        localStorage.setItem('tvl_appointments', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const deleteAppointment = (appointmentId) => {
    setAppointments(prev => {
      const updated = prev.filter(item => item.id !== appointmentId);
      try {
        localStorage.setItem('tvl_appointments', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // Sync deletion to backend
    TokenAPI.deleteToken(appointmentId).catch(e => console.warn('Backend delete sync failed:', e.message));

    toast.success('Token pass deleted successfully.');
  };

  const clearKarthikBookings = () => {
    setAppointments(prev => {
      const cleaned = filterOutKarthik(prev);
      try {
        localStorage.setItem('tvl_appointments', JSON.stringify(cleaned));
      } catch (e) {
        console.error(e);
      }
      return cleaned;
    });
    toast.success('All Karthik Raja bookings removed.');
  };

  const delayAppointment = (appointmentId, delayMinutes = 15, reason = 'Traffic / Travel Delay') => {
    let updatedAppt = null;
    setAppointments(prev => {
      const updated = prev.map(item => {
        if (item.id === appointmentId) {
          const currentToken = item.tokenNumber || 14;
          const slotsToAdd = delayMinutes === 30 ? 6 : 3;
          const newToken = currentToken + slotsToAdd;
          const currentWait = item.estimatedWaitMinutes || 10;
          const newWait = currentWait + delayMinutes;
          
          let newSlot = item.timeSlot;
          try {
            const parts = item.timeSlot.split(' ');
            if (parts.length >= 2) {
              const [hours, mins] = parts[0].split(':').map(Number);
              const isPM = parts[1] === 'PM';
              let totalMins = (hours % 12 + (isPM ? 12 : 0)) * 60 + mins + delayMinutes;
              let newH = Math.floor(totalMins / 60) % 24;
              let newM = totalMins % 60;
              let period = newH >= 12 ? 'PM' : 'AM';
              newH = newH % 12 || 12;
              newSlot = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')} ${period}`;
            }
          } catch {
            newSlot = `${item.timeSlot} (+${delayMinutes}m)`;
          }

          updatedAppt = {
            ...item,
            tokenNumber: newToken,
            timeSlot: newSlot,
            estimatedWaitMinutes: newWait,
            isDelayed: true,
            delayMinutes,
            delayReason: reason,
            delayedAt: new Date().toISOString()
          };
          return updatedAppt;
        }
        return item;
      });

      try {
        localStorage.setItem('tvl_appointments', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    if (updatedAppt) {
      setLastBookedToken(updatedAppt);

      // Sync delay to backend
      TokenAPI.delayToken(appointmentId, delayMinutes, reason).catch(e => console.warn('Backend delay sync failed:', e.message));

      toast.success(`⏱️ 15-Min Buffer Delay Applied! New Token: #${updatedAppt.tokenNumber} (${updatedAppt.timeSlot})`);
    }
    return updatedAppt;
  };

  const swapAppointment = (appointmentId, targetTokenNumber, swapPartnerName = 'Patient') => {
    let updatedAppt = null;
    setAppointments(prev => {
      const updated = prev.map(item => {
        if (item.id === appointmentId) {
          const oldToken = item.tokenNumber;
          const diff = Math.abs(targetTokenNumber - oldToken) || 2;
          const extraWait = diff * 5;
          const newWait = (item.estimatedWaitMinutes || 10) + extraWait;

          let newSlot = item.timeSlot;
          try {
            const parts = item.timeSlot.split(' ');
            if (parts.length >= 2) {
              const [hours, mins] = parts[0].split(':').map(Number);
              const isPM = parts[1] === 'PM';
              let totalMins = (hours % 12 + (isPM ? 12 : 0)) * 60 + mins + extraWait;
              let newH = Math.floor(totalMins / 60) % 24;
              let newM = totalMins % 60;
              let period = newH >= 12 ? 'PM' : 'AM';
              newH = newH % 12 || 12;
              newSlot = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')} ${period}`;
            }
          } catch {
            newSlot = `${item.timeSlot} (Swapped)`;
          }

          updatedAppt = {
            ...item,
            tokenNumber: targetTokenNumber,
            originalTokenNumber: oldToken,
            timeSlot: newSlot,
            estimatedWaitMinutes: newWait,
            isSwapped: true,
            swappedWith: swapPartnerName,
            swappedAt: new Date().toISOString()
          };
          return updatedAppt;
        }
        return item;
      });

      try {
        localStorage.setItem('tvl_appointments', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    if (updatedAppt) {
      setLastBookedToken(updatedAppt);

      // Sync swap to backend
      TokenAPI.swapToken(appointmentId, targetTokenNumber, swapPartnerName).catch(e => console.warn('Backend swap sync failed:', e.message));

      toast.success(`🔄 Token Swapped! You are now Token #${updatedAppt.tokenNumber} (Swapped with ${swapPartnerName})`);
    }
    return updatedAppt;
  };

  const bookViaSMS = async ({ hospitalCode = 'TVMC', deptCode = 'GENERAL', mobileNumber = '9876543210', patientName = 'Sundar M' }) => {
    const hospMap = {
      TVMC: { id: 'h1', name: 'Tirunelveli Medical College Hospital (TVMCH)', address: 'High Grounds, Palayamkottai, Tirunelveli', fee: 0 },
      TVMCH: { id: 'h1', name: 'Tirunelveli Medical College Hospital (TVMCH)', address: 'High Grounds, Palayamkottai, Tirunelveli', fee: 0 },
      SHIFA: { id: 'h2', name: 'Shifa Hospital', address: 'Vannarpettai, Tirunelveli', fee: 350 },
      ARVD: { id: 'h3', name: 'Aravind Eye Hospital', address: 'S.N. High Road, Vannarpettai, Tirunelveli', fee: 200 },
      ARAVIND: { id: 'h3', name: 'Aravind Eye Hospital', address: 'S.N. High Road, Vannarpettai, Tirunelveli', fee: 200 },
      KAUV: { id: 'h4', name: 'Kauvery Hospital', address: 'Palayamkottai Road, Tirunelveli', fee: 400 },
      PORN: { id: 'h5', name: 'Porunai Hospital', address: 'Tiruchendur Road, Palayamkottai', fee: 300 },
      SUGH: { id: 'h8', name: 'Sugham Hospital', address: 'Perumalpuram, V.M. Chatram, Tirunelveli', fee: 250 }
    };

    const deptMap = {
      GENERAL: { name: 'General Medicine', doctor: 'Dr. S. Sundararajan, MD', room: 'OPD Block A - Room 102' },
      GEN: { name: 'General Medicine', doctor: 'Dr. S. Sundararajan, MD', room: 'OPD Block A - Room 102' },
      CARDIO: { name: 'Cardiology', doctor: 'Dr. P. Muthukumar, DM', room: 'Cardiac Wing - Room 201' },
      CARD: { name: 'Cardiology', doctor: 'Dr. P. Muthukumar, DM', room: 'Cardiac Wing - Room 201' },
      DERMA: { name: 'Dermatology', doctor: 'Dr. K. Revathi, MD (DVL)', room: 'Skin Clinic - Room 108' },
      DERM: { name: 'Dermatology', doctor: 'Dr. K. Revathi, MD (DVL)', room: 'Skin Clinic - Room 108' },
      PEDI: { name: 'Pediatrics', doctor: 'Dr. G. Sivakumar, MD', room: 'Child Health - Room 105' },
      PED: { name: 'Pediatrics', doctor: 'Dr. G. Sivakumar, MD', room: 'Child Health - Room 105' },
      ORTHO: { name: 'Orthopedics', doctor: 'Dr. M. Senthil Nathan, MS', room: 'Bone & Joint - Room 112' },
      ORTH: { name: 'Orthopedics', doctor: 'Dr. M. Senthil Nathan, MS', room: 'Bone & Joint - Room 112' },
      GYNAEC: { name: 'Obstetrics & Gynecology', doctor: 'Dr. J. Meenakshi, MS', room: 'Maternity Wing - Room 114' },
      OG: { name: 'Obstetrics & Gynecology', doctor: 'Dr. J. Meenakshi, MS', room: 'Maternity Wing - Room 114' },
      ENT: { name: 'ENT', doctor: 'Dr. Deepa Senthil, MS', room: 'ENT Clinic - Room 202' }
    };

    const hKey = (hospitalCode || 'TVMC').toUpperCase().trim();
    const dKey = (deptCode || 'GENERAL').toUpperCase().trim();

    const hosp = hospMap[hKey] || hospMap['TVMC'];
    const dept = deptMap[dKey] || deptMap['GENERAL'];

    const randomTokenNum = Math.floor(Math.random() * 25) + 16;
    const currentServing = Math.max(1, randomTokenNum - 6);
    const tokenUuid = 'TVL-SMS-' + Math.floor(1000 + Math.random() * 9000);
    const timeSlot = '10:45 AM';

    const newAppointment = {
      id: tokenUuid,
      tokenNumber: randomTokenNum,
      currentServing,
      estimatedWaitMinutes: (randomTokenNum - currentServing) * 5,
      patientName: patientName || 'SMS Patient',
      patientAge: 32,
      patientGender: 'Male',
      patientPhone: mobileNumber || '9876543210',
      hospitalId: hosp.id,
      hospitalName: hosp.name,
      hospitalAddress: hosp.address,
      department: dept.name,
      doctorId: 'doc-sms',
      doctorName: dept.doctor,
      room: dept.room,
      problem: `${dept.name} Consultation (via Offline SMS)`,
      date: new Date().toISOString().split('T')[0],
      timeSlot,
      status: 'confirmed',
      type: 'sms',
      bookingMethod: 'OFFLINE_SMS',
      consultationFee: hosp.fee,
      qrCodeData: `${window.location.origin}/track/${tokenUuid}`,
      bookedAt: new Date().toISOString()
    };

    setAppointments(prev => [newAppointment, ...prev]);
    setLastBookedToken(newAppointment);

    // Sync SMS booking to backend
    SmsAPI.bookViaSMS({ hospitalCode, deptCode, mobileNumber, patientName }).catch(e => console.warn('Backend SMS booking sync failed:', e.message));

    const smsReplyText = `[TVL SmartCare OPD Pass] Token #${newAppointment.tokenNumber} allocated! Hospital: ${hosp.name}. Room: ${dept.room}. Time: ${timeSlot}. Ref: ${tokenUuid}. Track Live: ${window.location.origin}/track/${tokenUuid}`;

    try {
      localStorage.setItem('tvl_appointments', JSON.stringify([newAppointment, ...appointments]));
    } catch (e) {
      console.error(e);
    }

    toast.success(`📴 SMS Token #${newAppointment.tokenNumber} Allocated! Confirmation SMS received.`);
    return { appointment: newAppointment, smsReplyText };
  };

  const getAppointmentById = (id) => {
    return appointments.find(a => a.id === id);
  };

  const value = {
    appointments,
    bookingData,
    updateBookingData,
    resetBookingData,
    confirmBooking,
    bookEmergency,
    cancelAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    clearKarthikBookings,
    delayAppointment,
    swapAppointment,
    bookViaSMS,
    lastBookedToken,
    setLastBookedToken,
    getAppointmentById,
    isBackendConnected,
    codeRedActive,
    codeRedDetails,
    triggerCodeRed,
    clearCodeRed
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
