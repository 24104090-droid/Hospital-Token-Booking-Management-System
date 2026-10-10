import { mockHospitals } from '../data/mockHospitals';
import { mockDoctorsList } from '../data/mockDoctors';
import { mockReportsData } from '../data/mockReports';
import { initialAppointments } from '../data/mockAppointments';
import { getFromStorage, saveToStorage } from '../utils/storage';

const ADMIN_HOSPITALS_KEY = 'mediqueue_admin_hospitals_v2';
const ADMIN_DOCTORS_KEY = 'mediqueue_admin_doctors_v2';
const ADMIN_TOKENS_KEY = 'mediqueue_appointments';

export const adminService = {
  // Fig 8.7.5: Reports and Booking Activity for the district
  getStats: async (district = 'Tirunelveli District', period = 'Today') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return structured reports data with district label
        const data = {
          ...mockReportsData,
          summary: {
            ...mockReportsData.summary,
            district: district || 'Tirunelveli District',
            activePeriod: period
          }
        };
        resolve(data);
      }, 100);
    });
  },

  // Fig 8.7.4: Hospital Management
  getHospitalsSync: (district = 'Tirunelveli') => {
    const data = getFromStorage(ADMIN_HOSPITALS_KEY, mockHospitals);
    const validList = (Array.isArray(data) && data.length > 0) ? data : mockHospitals;
    if (district && district !== 'All' && district !== 'All Districts') {
      const filtered = validList.filter(h => h.district?.toLowerCase() === district.toLowerCase());
      return filtered.length > 0 ? filtered : validList;
    }
    return validList;
  },

  getHospitals: async (district) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getFromStorage(ADMIN_HOSPITALS_KEY, mockHospitals);
        const validList = (Array.isArray(data) && data.length > 0) ? data : mockHospitals;
        if (district && district !== 'All' && district !== 'All Districts') {
          const filtered = validList.filter(h => h.district?.toLowerCase() === district.toLowerCase());
          resolve(filtered.length > 0 ? filtered : validList);
        } else {
          resolve(validList);
        }
      }, 50);
    });
  },

  updateHospital: async (id, updateFields) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getFromStorage(ADMIN_HOSPITALS_KEY, mockHospitals);
        const updated = list.map(h => h.id === id ? { ...h, ...updateFields } : h);
        saveToStorage(ADMIN_HOSPITALS_KEY, updated);
        const savedHospital = updated.find(h => h.id === id);
        resolve({ success: true, hospital: savedHospital });
      }, 100);
    });
  },

  addHospital: async (hospitalData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getFromStorage(ADMIN_HOSPITALS_KEY, mockHospitals);
        const newHospital = {
          id: `h-${Date.now()}`,
          district: 'Tirunelveli',
          area: 'District Center',
          openStatus: true,
          rating: 4.5,
          reviewsCount: 120,
          queueLoad: 'Low',
          availableTokens: 30,
          currentServingToken: 1,
          todayTokensMax: 40,
          tokensIssued: 12,
          waitingCount: 5,
          waitingTime: 10,
          icuAvailable: 10,
          image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=60',
          ...hospitalData
        };
        const updated = [newHospital, ...list];
        saveToStorage(ADMIN_HOSPITALS_KEY, updated);
        resolve({ success: true, hospital: newHospital });
      }, 100);
    });
  },

  // Fig 8.7.4: Doctor Management
  getDoctorsSync: (district = 'Tirunelveli', hospitalId = 'All') => {
    let list = getFromStorage(ADMIN_DOCTORS_KEY, mockDoctorsList);
    const validList = (Array.isArray(list) && list.length > 0) ? list : mockDoctorsList;
    let result = validList;
    if (district && district !== 'All' && district !== 'All Districts') {
      const filtered = result.filter(d => d.district?.toLowerCase() === district.toLowerCase());
      if (filtered.length > 0) result = filtered;
    }
    if (hospitalId && hospitalId !== 'All' && hospitalId !== 'all') {
      const filtered = result.filter(d => d.hospitalId === hospitalId);
      if (filtered.length > 0) result = filtered;
    }
    return result;
  },

  getDoctors: async (district, hospitalId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = getFromStorage(ADMIN_DOCTORS_KEY, mockDoctorsList);
        const validList = (Array.isArray(list) && list.length > 0) ? list : mockDoctorsList;
        let result = validList;
        if (district && district !== 'All' && district !== 'All Districts') {
          const filtered = result.filter(d => d.district?.toLowerCase() === district.toLowerCase());
          if (filtered.length > 0) result = filtered;
        }
        if (hospitalId && hospitalId !== 'All' && hospitalId !== 'all') {
          const filtered = result.filter(d => d.hospitalId === hospitalId);
          if (filtered.length > 0) result = filtered;
        }
        resolve(result);
      }, 50);
    });
  },

  updateDoctorStatus: async (docId, statusUpdates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getFromStorage(ADMIN_DOCTORS_KEY, mockDoctorsList);
        const updated = list.map(d => d.id === docId ? { ...d, ...statusUpdates } : d);
        saveToStorage(ADMIN_DOCTORS_KEY, updated);
        const savedDoc = updated.find(d => d.id === docId);
        resolve({ success: true, doctor: savedDoc });
      }, 150);
    });
  },

  addDoctor: async (doctorData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getFromStorage(ADMIN_DOCTORS_KEY, mockDoctorsList);
        const newDoc = {
          id: `doc-${Date.now()}`,
          district: 'Tirunelveli',
          rating: 4.8,
          currentServingToken: 1,
          todayTokensMax: 40,
          tokensIssued: 1,
          waitingCount: 1,
          avgWaitMins: 12,
          dutyStatus: 'On Duty',
          availableToday: true,
          timing: '09:00 AM - 02:00 PM',
          image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
          ...doctorData
        };
        const updated = [newDoc, ...list];
        saveToStorage(ADMIN_DOCTORS_KEY, updated);
        resolve({ success: true, doctor: newDoc });
      }, 150);
    });
  },

  callDoctorNextToken: async (docId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getFromStorage(ADMIN_DOCTORS_KEY, mockDoctorsList);
        const doc = list.find(d => d.id === docId);
        if (doc) {
          const nextToken = (Number(doc.currentServingToken) || 1) + 1;
          const waiting = Math.max(0, (doc.waitingCount || 1) - 1);
          const updatedDoc = {
            ...doc,
            currentServingToken: nextToken,
            waitingCount: waiting,
            tokensIssued: Math.max(doc.tokensIssued || 1, nextToken + waiting)
          };
          const updatedList = list.map(d => d.id === docId ? updatedDoc : d);
          saveToStorage(ADMIN_DOCTORS_KEY, updatedList);
          resolve({ success: true, doctor: updatedDoc, calledToken: nextToken });
        } else {
          resolve({ success: false, message: 'Doctor not found' });
        }
      }, 150);
    });
  },

  // Token management
  getTokens: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tokens = getFromStorage(ADMIN_TOKENS_KEY, initialAppointments);
        resolve(tokens);
      }, 100);
    });
  },

  updateTokenStatus: async (tokenId, newStatus) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tokens = getFromStorage(ADMIN_TOKENS_KEY, initialAppointments);
        const updated = tokens.map(t => t.id === tokenId ? { ...t, status: newStatus } : t);
        saveToStorage(ADMIN_TOKENS_KEY, updated);
        resolve({ success: true, tokenId, newStatus });
      }, 100);
    });
  },

  callNextToken: async (deptCode = 'D') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tokens = getFromStorage(ADMIN_TOKENS_KEY, initialAppointments);
        const pending = tokens.find(t => t.status === 'In Queue' || t.status === 'queued' || t.status === 'waiting');
        if (pending) {
          const updated = tokens.map(t => t.id === pending.id ? { ...t, status: 'In-Consultation' } : t);
          saveToStorage(ADMIN_TOKENS_KEY, updated);
          resolve({ success: true, token: pending });
        } else {
          resolve({ success: false, message: 'No more tokens in queue' });
        }
      }, 150);
    });
  }
};
