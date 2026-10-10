import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockHospitals } from '../data/mockHospitals';
import { mockAppointments as mockInitialAppointments } from '../data/mockData';

const QueueContext = createContext();

const APPOINTMENTS_KEY = 'mediqueue_appointments_v1';
const HOSPITALS_KEY = 'mediqueue_hospitals_v1';

const isKarthik = (name) => {
  if (!name) return false;
  const n = String(name).toLowerCase().trim();
  return n.includes('karthik raja') || n === 'karthik' || n.includes('karthikraja');
};

export const QueueProvider = ({ children }) => {
  const [hospitals, setHospitals] = useState(() => {
    try {
      const saved = localStorage.getItem(HOSPITALS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load hospitals from storage', e);
    }
    return mockHospitals;
  });

  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(APPOINTMENTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const cleaned = parsed.filter(a => !isKarthik(a.patientName));
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(cleaned));
        return cleaned;
      }
    } catch (e) {
      console.error('Failed to load appointments from storage', e);
    }
    return mockInitialAppointments.filter(a => !isKarthik(a.patientName));
  });

  const [selectedHealthProblem, setSelectedHealthProblem] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [activeHospitalForBooking, setActiveHospitalForBooking] = useState(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HOSPITALS_KEY, JSON.stringify(hospitals));
    } catch (e) {
      console.error(e);
    }
  }, [hospitals]);

  useEffect(() => {
    try {
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    } catch (e) {
      console.error(e);
    }
  }, [appointments]);

  // Real-time Queue Simulation: slight dynamic token updates every 45s
  useEffect(() => {
    const interval = setInterval(() => {
      setHospitals(prev =>
        prev.map(h => {
          // randomly increment 1 hospital's current token
          if (Math.random() > 0.6 && h.availableTokens > 0) {
            const nextTok = h.currentToken + 1;
            const remainingTokens = Math.max(0, h.availableTokens - 1);
            return {
              ...h,
              currentToken: nextTok,
              availableTokens: remainingTokens,
              waitingTime: Math.max(5, h.waitingTime + (Math.random() > 0.5 ? -1 : 1))
            };
          }
          return h;
        })
      );
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // Book a new Token
  const bookToken = (bookingData) => {
    const hospital = hospitals.find(h => h.id === bookingData.hospitalId) || hospitals[0];
    
    // Generate Token Format e.g. T-043
    const prefix = hospital.type === 'Government' ? 'T' : 'P';
    const nextTokenNum = hospital.currentToken + Math.floor(Math.random() * 8 + 3);
    const tokenString = `${prefix}-0${nextTokenNum}`;

    const newAppointment = {
      id: `TKN-${Date.now().toString(36).toUpperCase()}`,
      token: tokenString,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      disease: bookingData.disease || selectedHealthProblem || 'General Consultation',
      department: bookingData.department || selectedSpecialty || 'General Medicine',
      doctor: bookingData.doctor || (hospital.doctors[0] ? hospital.doctors[0].name : 'Duty Medical Officer'),
      room: bookingData.room || (hospital.doctors[0] ? hospital.doctors[0].room : 'OPD Room 101'),
      patientName: bookingData.patientName || 'Patient',
      patientAge: bookingData.patientAge || 30,
      patientGender: bookingData.patientGender || 'Not Specified',
      patientPhone: bookingData.patientPhone || '+91 98765 43210',
      symptomsNote: bookingData.symptomsNote || '',
      date: bookingData.date || new Date().toISOString().split('T')[0],
      timeSlot: bookingData.timeSlot || 'Morning Slot (09:00 AM - 12:00 PM)',
      status: 'In Queue',
      currentTokenServing: hospital.currentToken,
      estimatedWaitMins: hospital.waitingTime + 8,
      bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPriority: !!bookingData.isPriority,
      priorityReason: bookingData.priorityReason || '',
      type: hospital.type
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Update hospital stats
    setHospitals(prev =>
      prev.map(h =>
        h.id === hospital.id
          ? {
              ...h,
              availableTokens: Math.max(0, h.availableTokens - 1),
              waitingTime: h.waitingTime + 3
            }
          : h
      )
    );

    return newAppointment;
  };

  // Cancel Appointment
  const cancelAppointment = (appointmentId) => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === appointmentId ? { ...app, status: 'Cancelled' } : app
      )
    );
  };

  // Admin Queue Operations
  const callNextToken = (hospitalId) => {
    setHospitals(prev =>
      prev.map(h => {
        if (h.id === hospitalId) {
          const nextVal = h.currentToken + 1;
          return {
            ...h,
            currentToken: nextVal,
            waitingTime: Math.max(3, h.waitingTime - 2)
          };
        }
        return h;
      })
    );

    // Update matching appointment status if currentToken reached it
    setAppointments(prev =>
      prev.map(app => {
        if (app.hospitalId === hospitalId && app.status === 'In Queue') {
          return {
            ...app,
            currentTokenServing: app.currentTokenServing + 1,
            estimatedWaitMins: Math.max(0, app.estimatedWaitMins - 4)
          };
        }
        return app;
      })
    );
  };

  const updateHospitalStatus = (hospitalId, updates) => {
    setHospitals(prev =>
      prev.map(h => (h.id === hospitalId ? { ...h, ...updates } : h))
    );
  };

  const resetQueueData = () => {
    setHospitals(mockHospitals);
    setAppointments(mockInitialAppointments);
  };

  return (
    <QueueContext.Provider
      value={{
        hospitals,
        appointments,
        selectedHealthProblem,
        setSelectedHealthProblem,
        selectedSpecialty,
        setSelectedSpecialty,
        activeHospitalForBooking,
        setActiveHospitalForBooking,
        bookToken,
        cancelAppointment,
        callNextToken,
        updateHospitalStatus,
        resetQueueData
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
