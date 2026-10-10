import { getFromStorage, saveToStorage } from '../utils/storage';

const FAMILY_KEY = 'mediqueue_family_members';

const defaultFamily = [
  {
    id: 'fam-1',
    name: 'Suresh Kumar',
    relationship: 'Father',
    age: 62,
    gender: 'Male',
    bloodGroup: 'B+',
    conditions: 'Hypertension, Diabetes'
  },
  {
    id: 'fam-2',
    name: 'Lakshmi Devi',
    relationship: 'Mother',
    age: 58,
    gender: 'Female',
    bloodGroup: 'O+',
    conditions: 'Joint Pain'
  },
  {
    id: 'fam-3',
    name: 'Priya Kumar',
    relationship: 'Spouse',
    age: 31,
    gender: 'Female',
    bloodGroup: 'A+',
    conditions: 'None'
  },
  {
    id: 'fam-4',
    name: 'Rohan Kumar',
    relationship: 'Child',
    age: 6,
    gender: 'Male',
    bloodGroup: 'B+',
    conditions: 'Seasonal Allergies'
  }
];

export const familyService = {
  getMembers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = getFromStorage(FAMILY_KEY, defaultFamily);
        resolve(stored);
      }, 150);
    });
  },

  addMember: async (memberData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getFromStorage(FAMILY_KEY, defaultFamily);
        const newMember = {
          id: `fam-${Date.now()}`,
          ...memberData
        };
        const updated = [...list, newMember];
        saveToStorage(FAMILY_KEY, updated);
        resolve(newMember);
      }, 200);
    });
  },

  updateMember: async (id, memberData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getFromStorage(FAMILY_KEY, defaultFamily);
        const updated = list.map(m => m.id === id ? { ...m, ...memberData } : m);
        saveToStorage(FAMILY_KEY, updated);
        resolve({ success: true, id });
      }, 200);
    });
  },

  deleteMember: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getFromStorage(FAMILY_KEY, defaultFamily);
        const updated = list.filter(m => m.id !== id);
        saveToStorage(FAMILY_KEY, updated);
        resolve({ success: true, id });
      }, 150);
    });
  }
};
