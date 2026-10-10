/**
 * 5 Verified Pre-configured Accounts for TVL SmartCare
 * Covers: Patients, Hospital OPD Nurse/Doctor, and District Health Administrator.
 */

export const mockUsers = [
  {
    id: 'usr_pat_01',
    name: 'Karthik Raja',
    email: 'karthik.raja@tvlcare.in',
    password: 'Patient@123',
    role: 'patient',
    mobile: '9842154320',
    bloodGroup: 'O+',
    age: 34,
    gender: 'Male',
    area: 'Palayamkottai',
    district: 'Tirunelveli',
    pincode: '627002',
    healthId: 'TVL-TN-8492-2024',
    emergencyContact: '9842154321',
    medicalHistory: ['Mild Hypertension', 'Dust Allergy'],
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    description: 'Registered citizen patient account with active tokens at TVMCH'
  },
  {
    id: 'usr_pat_02',
    name: 'Meenakshi Sundaram',
    email: 'meenakshi.s@tvlcare.in',
    password: 'Patient@123',
    role: 'patient',
    mobile: '9443187650',
    bloodGroup: 'B+',
    age: 29,
    gender: 'Female',
    area: 'Vannarpettai',
    district: 'Tirunelveli',
    pincode: '627003',
    healthId: 'TVL-TN-5109-2024',
    emergencyContact: '9443187651',
    medicalHistory: ['Prenatal Care (Trimester 2)', 'Thyroid Normal'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    description: 'Maternal & Child Health registered patient account'
  },
  {
    id: 'usr_stf_01',
    name: 'Sister Revathi S.',
    email: 'nurse.tvmch@tvlcare.in',
    password: 'Staff@123',
    role: 'hospital_staff',
    designation: 'Senior OPD Triage Officer',
    department: 'General Medicine & Triage',
    hospitalId: 'tvmch',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    room: 'OPD Block A - Counter 102',
    mobile: '9442112233',
    staffId: 'TVMCH-NUR-042',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    description: 'OPD triage station nurse for TVMCH High Grounds'
  },
  {
    id: 'usr_stf_02',
    name: 'Dr. M. Abdul Rahman',
    email: 'dr.abdul@shifahospital.in',
    password: 'Doctor@123',
    role: 'hospital_staff',
    designation: 'Chief Consultant Cardiologist',
    department: 'Cardiology & Intensive Care',
    hospitalId: 'shifa',
    hospitalName: 'Shifa Hospital',
    room: 'Chamber 204 - 2nd Floor Cardiology Wing',
    mobile: '9843224455',
    staffId: 'SHIFA-DOC-018',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    description: 'On-duty cardiologist with live token caller controls'
  },
  {
    id: 'usr_adm_01',
    name: 'Dr. V. Shanmuga Priya, MD',
    email: 'admin@tvlhealth.gov.in',
    password: 'Admin@123',
    role: 'admin',
    designation: 'District Public Health Officer & OPD Commissioner',
    department: 'Directorate of Public Health & Preventive Medicine',
    hospitalId: 'all',
    hospitalName: 'Tirunelveli District Public Health Network',
    mobile: '0462-2572735',
    staffId: 'TN-GOV-DHO-001',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    description: 'District administrator with hospital vacancy & emergency broadcaster rights'
  }
];

export const getUserByEmail = (email) => {
  return mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const getUserById = (id) => {
  return mockUsers.find(u => u.id === id);
};
