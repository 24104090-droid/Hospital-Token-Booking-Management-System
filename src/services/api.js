/**
 * MediQueue API Service Layer
 * Configured with Axios for seamless backend integration (Node/Express, Spring Boot, FastAPI, or Django)
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (injects Bearer JWT Token if stored)
apiClient.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('mediqueue_auth_v1');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (e) {
        console.error('Error attaching auth token', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API call failed or backend offline, utilizing local fallback:', error.message);
    return Promise.reject(error);
  }
);

export const HospitalAPI = {
  getAll: () => apiClient.get('/hospitals'),
  getById: (id) => apiClient.get(`/hospitals/${id}`),
  searchBySpecialty: (specialty) => apiClient.get(`/hospitals/search?specialty=${encodeURIComponent(specialty)}`),
  updateQueue: (id, queueData) => apiClient.patch(`/hospitals/${id}/queue`, queueData),
};

export const TokenAPI = {
  getAllTokens: () => apiClient.get('/tokens'),
  createToken: (payload) => apiClient.post('/tokens/book', payload),
  getUserTokens: (userId) => apiClient.get(`/tokens/user/${userId}`),
  getTokenById: (tokenId) => apiClient.get(`/tokens/${tokenId}`),
  cancelToken: (tokenId) => apiClient.patch(`/tokens/${tokenId}/cancel`),
  delayToken: (tokenId, delayMinutes = 15, reason = 'Traffic') => apiClient.patch(`/tokens/${tokenId}/delay`, { delayMinutes, reason }),
  swapToken: (tokenId, targetTokenNumber, swapPartnerName) => apiClient.patch(`/tokens/${tokenId}/swap`, { targetTokenNumber, swapPartnerName }),
  deleteToken: (tokenId) => apiClient.delete(`/tokens/${tokenId}`)
};

export const SmsAPI = {
  bookViaSMS: (payload) => apiClient.post('/sms/book', payload)
};

export const QueueAPI = {
  getStatus: (tokenId) => apiClient.get(`/queue/${tokenId}`)
};

export const AdminAPI = {
  getStats: () => apiClient.get('/admin/stats'),
  callNextToken: (hospitalId, dept) => apiClient.post(`/admin/call-next`, { hospitalId, dept }),
  updateCrowdStatus: (hospitalId, level) => apiClient.patch(`/admin/crowd-level`, { hospitalId, level }),
};

export const HealthAPI = {
  check: () => apiClient.get('/health')
};

export const MongoAPI = {
  getStatus: () => apiClient.get('/mongo/status'),
  getUsers: () => apiClient.get('/users'),
  syncGoogleAuth: (data) => apiClient.post('/auth/google-sync', data)
};

export default apiClient;
