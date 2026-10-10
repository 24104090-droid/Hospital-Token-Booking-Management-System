import { initialFeedbackList, feedbackSummary } from '../data/mockFeedback';
import { getFromStorage, saveToStorage } from '../utils/storage';

const FEEDBACK_KEY = 'mediqueue_feedbacks_v2';

export const feedbackService = {
  getFeedbacks: async (district) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = getFromStorage(FEEDBACK_KEY, initialFeedbackList);
        if (district && district !== 'All' && district !== 'All Districts') {
          resolve(stored.filter(f => f.district?.toLowerCase() === district.toLowerCase()));
        } else {
          resolve(stored);
        }
      }, 100);
    });
  },

  getSummary: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(feedbackSummary);
      }, 100);
    });
  },

  updateFeedbackStatus: async (feedbackId, newStatus) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getFromStorage(FEEDBACK_KEY, initialFeedbackList);
        const updated = list.map(f => f.id === feedbackId ? { ...f, adminStatus: newStatus } : f);
        saveToStorage(FEEDBACK_KEY, updated);
        const saved = updated.find(f => f.id === feedbackId);
        resolve({ success: true, feedback: saved });
      }, 120);
    });
  },

  addAdminResponse: async (feedbackId, responseText) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getFromStorage(FEEDBACK_KEY, initialFeedbackList);
        const now = new Date();
        const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        const updated = list.map(f => f.id === feedbackId ? {
          ...f,
          adminStatus: 'Reviewed',
          adminResponse: responseText,
          respondedAt: timestamp
        } : f);
        saveToStorage(FEEDBACK_KEY, updated);
        const saved = updated.find(f => f.id === feedbackId);
        resolve({ success: true, feedback: saved });
      }, 150);
    });
  },

  submitFeedback: async (feedbackData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = getFromStorage(FEEDBACK_KEY, initialFeedbackList);
        const now = new Date();
        const newFb = {
          id: `fb-${Date.now()}`,
          date: now.toISOString().split('T')[0],
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          district: 'Tirunelveli',
          sentiment: feedbackData.rating >= 4 ? 'positive' : feedbackData.rating === 3 ? 'neutral' : 'critical',
          adminStatus: 'Pending Review',
          adminResponse: null,
          respondedAt: null,
          tags: ['Patient Review', 'Recent'],
          ...feedbackData
        };
        const updated = [newFb, ...list];
        saveToStorage(FEEDBACK_KEY, updated);
        resolve({ success: true, feedback: newFb });
      }, 150);
    });
  }
};
