export const DEFAULT_LOCATION = 'Tirunelveli';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api';

export const TOKEN_STATUS = {
  IN_QUEUE: 'In Queue',
  IN_CONSULTATION: 'In-Consultation',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  SKIPPED: 'Skipped'
};

export const CROWD_LEVEL = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
};

export const URGENCY_LEVELS = {
  NORMAL: 'Normal',
  HIGH: 'High',
  EMERGENCY: 'Emergency'
};

export const AVAILABLE_CITIES = [
  'Tirunelveli',
  'Palayamkottai',
  'Tenkasi',
  'Tuticorin',
  'Madurai'
];
