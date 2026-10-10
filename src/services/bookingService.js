import { initialAppointments } from '../data/mockAppointments';
import { getFromStorage, saveToStorage } from '../utils/storage';
import { generateBookingId, generateTokenNumber } from '../utils/helpers';

const STORAGE_KEY = 'mediqueue_appointments';

export const bookingService = {
  getAppointments: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = getFromStorage(STORAGE_KEY, initialAppointments);
        resolve(stored);
      }, 200);
    });
  },

  bookToken: async (bookingData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentList = getFromStorage(STORAGE_KEY, initialAppointments);
        const deptCode = (bookingData.department || 'G').charAt(0);
        const nextCount = currentList.length + 29;
        const tokenNumber = generateTokenNumber(deptCode, nextCount);
        const bookingId = generateBookingId('TKN');

        const newAppointment = {
          id: bookingId,
          tokenNumber,
          hospitalId: bookingData.hospitalId,
          hospitalName: bookingData.hospitalName,
          department: bookingData.department || 'General Medicine',
          doctor: bookingData.doctor || 'On-Duty Specialist',
          room: bookingData.room || 'OPD Room 1',
          patientName: bookingData.patientName,
          patientAge: bookingData.patientAge || 30,
          patientGender: bookingData.patientGender || 'Other',
          patientMobile: bookingData.patientMobile,
          disease: bookingData.disease,
          bookedDate: bookingData.bookedDate || new Date().toISOString().split('T')[0],
          timeSlot: bookingData.timeSlot || '10:00 AM - 11:00 AM',
          status: 'In Queue',
          currentTokenServing: `${deptCode.toUpperCase()}-0${Math.max(1, nextCount - 5)}`,
          tokensAhead: Math.floor(Math.random() * 5) + 3,
          estimatedWaitMins: Math.floor(Math.random() * 15) + 10,
          type: bookingData.type || 'Government',
          isPriority: bookingData.isPriority || false,
          notes: bookingData.notes || '',
          bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedList = [newAppointment, ...currentList];
        saveToStorage(STORAGE_KEY, updatedList);
        resolve(newAppointment);
      }, 400);
    });
  },

  cancelToken: async (tokenId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentList = getFromStorage(STORAGE_KEY, initialAppointments);
        const updatedList = currentList.map(item =>
          item.id === tokenId ? { ...item, status: 'Cancelled' } : item
        );
        saveToStorage(STORAGE_KEY, updatedList);
        resolve({ success: true, tokenId });
      }, 250);
    });
  },

  getLiveQueueStatus: async (tokenId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentList = getFromStorage(STORAGE_KEY, initialAppointments);
        const found = currentList.find(i => i.id === tokenId);
        if (found) {
          resolve(found);
        } else {
          reject(new Error('Token not found'));
        }
      }, 150);
    });
  }
};
