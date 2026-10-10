export const mockAppointments = [
  {
    id: 'TVL-TKN-3104',
    tokenNumber: 7,
    currentServing: 7,
    estimatedWaitMinutes: 0,
    patientName: 'Selvi Karthik',
    patientAge: 29,
    patientGender: 'Female',
    patientPhone: '+91 98765 43210',
    hospitalId: 'h3',
    hospitalName: 'Aravind Eye Hospital',
    hospitalAddress: 'S.N. High Road, Vannarpettai, Tirunelveli - 627003',
    department: 'Ophthalmology',
    doctorId: 'doc-7',
    doctorName: 'Dr. M. Selvi, MS',
    room: 'Vision Suite 1',
    problem: 'Eye Irritation & Cataract',
    date: '2026-08-27',
    timeSlot: '09:40 AM',
    status: 'serving',
    type: 'normal',
    consultationFee: 200,
    qrCodeData: 'TVL-SMARTCARE:TOKEN-3104:ARAVIND:DOC-7:09-40-AM',
    bookedAt: '2026-08-27T08:00:00.000Z'
  },
  {
    id: 'TVL-TKN-1092',
    tokenNumber: 22,
    currentServing: 22,
    estimatedWaitMinutes: 0,
    patientName: 'Ramasamy (Father)',
    patientAge: 64,
    patientGender: 'Male',
    patientPhone: '+91 98765 43210',
    hospitalId: 'h2',
    hospitalName: 'Shifa Hospital',
    hospitalAddress: 'Vannarpettai, Tirunelveli - 627003',
    department: 'Cardiology',
    doctorId: 'doc-4',
    doctorName: 'Dr. R. Venkatraman, DM',
    room: 'Cardiac Wing - Suite 301',
    problem: 'High Blood Pressure (BP)',
    date: '2026-08-20',
    timeSlot: '11:00 AM',
    status: 'completed',
    type: 'normal',
    consultationFee: 400,
    qrCodeData: 'TVL-SMARTCARE:TOKEN-1092:SHIFA:DOC-4:11-00-AM',
    bookedAt: '2026-08-19T14:30:00.000Z'
  }
];

export const mockFamilyMembers = [
  {
    id: 'fam-1',
    name: 'Patient (Self)',
    relationship: 'Self',
    gender: 'Male',
    age: 32,
    bloodGroup: 'O+ Positive',
    mobile: '+91 98765 43210',
    isDefault: true
  },
  {
    id: 'fam-2',
    name: 'Selvi M.',
    relationship: 'Spouse',
    gender: 'Female',
    age: 29,
    bloodGroup: 'B+ Positive',
    mobile: '+91 98765 43211',
    isDefault: false
  },
  {
    id: 'fam-3',
    name: 'Ramasamy',
    relationship: 'Father',
    gender: 'Male',
    age: 64,
    bloodGroup: 'O+ Positive',
    mobile: '+91 98765 43212',
    isDefault: false
  },
  {
    id: 'fam-4',
    name: 'Meenakshi',
    relationship: 'Mother',
    gender: 'Female',
    age: 58,
    bloodGroup: 'A+ Positive',
    mobile: '+91 98765 43213',
    isDefault: false
  },
  {
    id: 'fam-5',
    name: 'Aarav',
    relationship: 'Child',
    gender: 'Male',
    age: 4,
    bloodGroup: 'O+ Positive',
    mobile: '+91 98765 43210',
    isDefault: false
  }
];

export const emergencyHotlines = [
  { name: 'National Emergency Ambulance', number: '108', available: '24/7 Free', icon: 'Ambulance' },
  { name: 'TVMCH Casualty & Trauma Helpline', number: '0462-2572735', available: '24/7 High Grounds', icon: 'Hospital' },
  { name: 'Tirunelveli District Health Control', number: '0462-2500828', available: '24/7 Gov Helpline', icon: 'PhoneCall' },
  { name: 'Blood Bank Tirunelveli Helpline', number: '0462-2572733', available: '24/7 Red Cross / TVMCH', icon: 'Droplet' },
  { name: 'Police Emergency Response', number: '100 / 112', available: '24/7', icon: 'Shield' },
  { name: 'Fire & Rescue Service Tirunelveli', number: '101', available: '24/7', icon: 'Flame' }
];

export const adminStats = {
  totalHospitals: 10,
  activeDoctors: 48,
  tokensIssuedToday: 684,
  tokensServedToday: 512,
  emergencyAlertsToday: 14,
  avgWaitTimeMin: 18,
  patientSatisfactionRate: 96.4
};

export { mockHospitals } from './mockHospitals';
export const mockInitialAppointments = mockAppointments;

