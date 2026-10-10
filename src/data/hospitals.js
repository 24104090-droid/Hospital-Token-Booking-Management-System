export const hospitals = [
  {
    id: 'h1',
    name: 'Tirunelveli Medical College Hospital (TVMCH)',
    type: 'Government',
    district: 'Tirunelveli',
    area: 'High Grounds',
    address: 'High Grounds, Palayamkottai, Tirunelveli - 627011',
    phone: '+91 462 2572733',
    emergencyPhone: '108 / +91 462 2572735',
    location: { lat: 8.7289, lng: 77.7023 },
    rating: 4.6,
    reviews: 1420,
    distance: 2.5,
    currentWaitTime: 25,
    averageWaitMins: 25,
    currentServingToken: 48,
    tokensAvailable: 42,
    openNow: true,
    openHours: '24 Hours Open',
    emergencyAvailable: true,
    ambulanceAvailable: true,
    bloodBank: true,
    pharmacy: true,
    laboratory: true,
    icuBedsAvailable: 14,
    generalBedsAvailable: 85,
    consultationFee: 0,
    facilities: ['24/7 Emergency', 'Multi-Specialty ICU', 'Central Blood Bank', 'Free Pharmacy', 'Diagnostic CT & MRI', 'Free Dialysis Unit', 'Trauma Center', 'Oxygen Plant'],
    departments: ['General Medicine', 'Cardiology', 'Obstetrics & Gynecology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Ophthalmology', 'ENT', 'Pulmonology', 'Neurology', 'Urology', 'Emergency Medicine'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    description: 'Premier tertiary care government referral teaching hospital for Southern Tamil Nadu with comprehensive super-specialty departments and zero-cost OPD.'
  },
  {
    id: 'h2',
    name: 'Shifa Hospital',
    type: 'Private',
    district: 'Tirunelveli',
    area: 'Sankar Nagar / Vannarpettai',
    address: '82, Kailasapuram, Vannarpettai, Tirunelveli - 627003',
    phone: '+91 462 2501234',
    emergencyPhone: '+91 462 2501999',
    location: { lat: 8.7350, lng: 77.7070 },
    rating: 4.8,
    reviews: 980,
    distance: 3.2,
    currentWaitTime: 15,
    averageWaitMins: 15,
    currentServingToken: 19,
    tokensAvailable: 16,
    openNow: true,
    openHours: '24 Hours Open',
    emergencyAvailable: true,
    ambulanceAvailable: true,
    bloodBank: true,
    pharmacy: true,
    laboratory: true,
    icuBedsAvailable: 8,
    generalBedsAvailable: 34,
    consultationFee: 350,
    facilities: ['Advanced ICU/CCU', 'Cardiac Catheterization Lab', 'Automated Pathology Lab', '24x7 Ambulance', 'Ultrasound & X-Ray', 'Comprehensive Dialysis Center', 'Physiotherapy'],
    departments: ['General Medicine', 'Cardiology', 'Obstetrics & Gynecology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Ophthalmology', 'ENT', 'Pulmonology', 'Neurology', 'Urology', 'Gastroenterology'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    description: 'Leading multi-specialty tertiary private healthcare center offering cutting edge minimally invasive surgeries and dedicated cardiac care in Tirunelveli.'
  },
  {
    id: 'h3',
    name: 'Aravind Eye Hospital',
    type: 'Private',
    district: 'Tirunelveli',
    area: 'Vannarpettai',
    address: 'S.N. High Road, Vannarpettai, Tirunelveli - 627003',
    phone: '+91 462 4356100',
    emergencyPhone: '+91 462 4356111',
    location: { lat: 8.7230, lng: 77.6940 },
    rating: 4.9,
    reviews: 2150,
    distance: 4.0,
    currentWaitTime: 11,
    averageWaitMins: 11,
    currentServingToken: 24,
    tokensAvailable: 28,
    openNow: true,
    openHours: '07:30 AM - 07:00 PM',
    emergencyAvailable: true,
    ambulanceAvailable: true,
    bloodBank: false,
    pharmacy: true,
    laboratory: true,
    icuBedsAvailable: 0,
    generalBedsAvailable: 50,
    consultationFee: 200,
    facilities: ['Retina Laser Suite', 'Advanced Cataract OT', 'Pediatric Ophthalmology', 'Glaucoma Clinic', 'Contact Lens & Optical Wing', 'Cornea Bank'],
    departments: ['Ophthalmology'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    description: 'World-renowned eye care institute providing high-quality, compassionate and affordable ophthalmic care with top cataract and retinal specialists.'
  },
  {
    id: 'h4',
    name: 'Kauvery Hospital Tirunelveli',
    type: 'Private',
    district: 'Tirunelveli',
    area: 'Palayamkottai',
    address: '45-A, Trivandrum Road, Palayamkottai, Tirunelveli - 627002',
    phone: '+91 462 4001000',
    emergencyPhone: '+91 462 4001999',
    location: { lat: 8.7400, lng: 77.7100 },
    rating: 4.7,
    reviews: 730,
    distance: 4.8,
    currentWaitTime: 18,
    averageWaitMins: 18,
    currentServingToken: 22,
    tokensAvailable: 14,
    openNow: true,
    openHours: '24 Hours Open',
    emergencyAvailable: true,
    ambulanceAvailable: true,
    bloodBank: true,
    pharmacy: true,
    laboratory: true,
    icuBedsAvailable: 12,
    generalBedsAvailable: 40,
    consultationFee: 400,
    facilities: ['Advanced Critical Care (ICU)', 'Interventional Cardiology', 'Modern Orthopedic Suite', 'Chemotherapy Day Care', '24x7 Emergency Trauma Unit'],
    departments: ['General Medicine', 'Cardiology', 'Orthopedics', 'Neurology', 'Pulmonology', 'Pediatrics', 'Obstetrics & Gynecology', 'Gastroenterology'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    description: 'State-of-the-art super-specialty hospital known for high clinical excellence in cardiology, trauma, and laparoscopic surgery.'
  },
  {
    id: 'h5',
    name: 'Porunai Hospitals',
    type: 'Private',
    district: 'Tirunelveli',
    area: 'Melapalayam',
    address: 'Hameedpuram, Melapalayam, Tirunelveli - 627005',
    phone: '+91 462 2351234',
    emergencyPhone: '+91 462 2351999',
    location: { lat: 8.7180, lng: 77.7180 },
    rating: 4.4,
    reviews: 310,
    distance: 5.5,
    currentWaitTime: 20,
    averageWaitMins: 20,
    currentServingToken: 10,
    tokensAvailable: 12,
    openNow: true,
    openHours: '08:00 AM - 09:00 PM',
    emergencyAvailable: true,
    ambulanceAvailable: true,
    bloodBank: false,
    pharmacy: true,
    laboratory: true,
    icuBedsAvailable: 4,
    generalBedsAvailable: 22,
    consultationFee: 250,
    facilities: ['Emergency Unit', 'Pharmacy', 'Digital X-Ray', 'Ultrasound Color Doppler', 'Modern Minor OT', 'Ambulance Support'],
    departments: ['General Medicine', 'Dermatology', 'ENT', 'Orthopedics', 'Pediatrics', 'Obstetrics & Gynecology'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    description: 'Trusted neighborhood healthcare hub in Melapalayam providing patient-centric outpatient and inpatient care at accessible costs.'
  },
  {
    id: 'h6',
    name: 'Dr. Agarwal’s Eye Hospital',
    type: 'Private',
    district: 'Tirunelveli',
    area: 'High Grounds',
    address: 'Near V.O.C Ground, North High Grounds, Tirunelveli - 627001',
    phone: '+91 462 2575454',
    emergencyPhone: '+91 462 2575400',
    location: { lat: 8.7270, lng: 77.7010 },
    rating: 4.8,
    reviews: 640,
    distance: 2.1,
    currentWaitTime: 8,
    averageWaitMins: 8,
    currentServingToken: 12,
    tokensAvailable: 15,
    openNow: true,
    openHours: '09:00 AM - 07:00 PM',
    emergencyAvailable: true,
    ambulanceAvailable: false,
    bloodBank: false,
    pharmacy: true,
    laboratory: true,
    icuBedsAvailable: 0,
    generalBedsAvailable: 20,
    consultationFee: 300,
    facilities: ['PDEK Cornea Transplant', 'Micro-Coaxial Cataract Surgery', 'Glaucoma Lab', 'Pediatric Vision Wing', 'LASIK Suite'],
    departments: ['Ophthalmology'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
    description: 'Pioneering eye hospital known worldwide for breakthrough ophthalmic procedures, corneal treatments, and blade-free laser vision correction.'
  },
  {
    id: 'h7',
    name: 'Arul Mission Hospital',
    type: 'Private',
    district: 'Tirunelveli',
    area: 'Palayamkottai',
    address: 'St. Xavier’s College Road, Palayamkottai, Tirunelveli - 627002',
    phone: '+91 462 2560800',
    emergencyPhone: '+91 462 2560911',
    location: { lat: 8.7360, lng: 77.7080 },
    rating: 4.5,
    reviews: 420,
    distance: 3.4,
    currentWaitTime: 13,
    averageWaitMins: 13,
    currentServingToken: 15,
    tokensAvailable: 18,
    openNow: true,
    openHours: '24 Hours Open',
    emergencyAvailable: true,
    ambulanceAvailable: true,
    bloodBank: true,
    pharmacy: true,
    laboratory: true,
    icuBedsAvailable: 6,
    generalBedsAvailable: 28,
    consultationFee: 300,
    facilities: ['24-Hour Emergency', 'Maternity Wing & NICU', 'Modular OT', 'Digital Radiology', 'In-house Pharmacy', 'Blood Storage Unit'],
    departments: ['General Medicine', 'Obstetrics & Gynecology', 'Pediatrics', 'Orthopedics', 'ENT', 'General Surgery'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
    description: 'Community-oriented multi-specialty care hospital delivering maternity, pediatric, and general health services with warmth.'
  },
  {
    id: 'h8',
    name: 'Sugham Health Centre',
    type: 'Private',
    district: 'Tirunelveli',
    area: 'Tirunelveli Junction',
    address: 'Madurai Road, Junction, Tirunelveli - 627001',
    phone: '+91 462 2334455',
    emergencyPhone: '+91 462 2334400',
    location: { lat: 8.7180, lng: 77.6880 },
    rating: 4.3,
    reviews: 285,
    distance: 1.8,
    currentWaitTime: 5,
    averageWaitMins: 5,
    currentServingToken: 8,
    tokensAvailable: 20,
    openNow: true,
    openHours: '07:00 AM - 10:00 PM',
    emergencyAvailable: true,
    ambulanceAvailable: true,
    bloodBank: false,
    pharmacy: true,
    laboratory: true,
    icuBedsAvailable: 2,
    generalBedsAvailable: 15,
    consultationFee: 200,
    facilities: ['Fast OPD Triage', 'Direct Medicine Counter', 'Quick Blood & Urine Testing', 'ECG & Nebulization'],
    departments: ['General Medicine', 'Dermatology', 'ENT', 'Pediatrics'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    description: 'Centrally located health clinic right next to Tirunelveli Junction railway station providing rapid token appointments for busy commuters.'
  },
  {
    id: 'h9',
    name: 'Peace Health Centre',
    type: 'Private',
    district: 'Tirunelveli',
    area: 'Sivalaperi Road',
    address: 'Sivalaperi Road, Palayamkottai, Tirunelveli - 627002',
    phone: '+91 462 2580120',
    emergencyPhone: '+91 462 2580199',
    location: { lat: 8.7320, lng: 77.6990 },
    rating: 4.1,
    reviews: 190,
    distance: 2.8,
    currentWaitTime: 7,
    averageWaitMins: 7,
    currentServingToken: 6,
    tokensAvailable: 14,
    openNow: true,
    openHours: '08:00 AM - 08:00 PM',
    emergencyAvailable: false,
    ambulanceAvailable: false,
    bloodBank: false,
    pharmacy: true,
    laboratory: true,
    icuBedsAvailable: 0,
    generalBedsAvailable: 12,
    consultationFee: 150,
    facilities: ['Pharmacy', 'Clinical Lab', 'Digital X-Ray', 'Health Checkup Packages'],
    departments: ['General Medicine', 'Orthopedics', 'Pediatrics'],
    verified: false,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    description: 'Affordable outpatient clinic focused on preventive wellness, chronic condition monitoring, and family health.'
  },
  {
    id: 'h10',
    name: 'Annai Velankanni Hospital',
    type: 'Private',
    district: 'Tirunelveli',
    area: 'Palayamkottai',
    address: 'Rahmath Nagar, Palayamkottai, Tirunelveli - 627002',
    phone: '+91 462 2578910',
    emergencyPhone: '+91 462 2578999',
    location: { lat: 8.7420, lng: 77.7120 },
    rating: 4.2,
    reviews: 210,
    distance: 4.2,
    currentWaitTime: 9,
    averageWaitMins: 9,
    currentServingToken: 11,
    tokensAvailable: 16,
    openNow: true,
    openHours: '08:00 AM - 09:00 PM',
    emergencyAvailable: true,
    ambulanceAvailable: true,
    bloodBank: false,
    pharmacy: true,
    laboratory: true,
    icuBedsAvailable: 3,
    generalBedsAvailable: 18,
    consultationFee: 250,
    facilities: ['Emergency Room', 'Obstetrics Ward', 'Neonatal Unit', 'Pharmacy', 'Lab Services'],
    departments: ['General Medicine', 'Obstetrics & Gynecology', 'Pediatrics', 'General Surgery'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    description: 'Dedicated maternal and pediatric hospital providing attentive prenatal, delivery, and post-natal care.'
  }
];

export const getHospitalsByDistrict = (district = 'Tirunelveli') => {
  return hospitals.filter(h => h.district.toLowerCase() === district.toLowerCase());
};

import { getSpecialtyForProblem } from './problems.js';

export const getHospitalsByDepartment = (department) => {
  if (!department) return hospitals;
  const canonicalSpec = getSpecialtyForProblem(department) || department;
  const targetSpec = canonicalSpec.toLowerCase().trim();

  return hospitals.filter(h => 
    h.departments.some(d => {
      const dLower = d.toLowerCase().trim();
      return dLower === targetSpec || (getSpecialtyForProblem(dLower).toLowerCase() === targetSpec);
    })
  );
};

export const getHospitalsByType = (type) => {
  if (!type || type === 'all') return hospitals;
  return hospitals.filter(h => h.type.toLowerCase() === type.toLowerCase());
};

export const getHospitalById = (id) => {
  if (!id) return null;
  return hospitals.find(h => 
    h.id.toLowerCase() === id.toLowerCase() || 
    h.name.toLowerCase().includes(id.toLowerCase())
  );
};

// Strict isolation: ONLY returns hospitals that explicitly offer this canonical department
export const getDepartmentHospitals = (department, date) => {
  if (!department) return hospitals;

  const canonicalSpec = getSpecialtyForProblem(department) || department;
  const targetSpec = canonicalSpec.toLowerCase().trim();

  // Strict match: Hospital's departments array MUST have this exact specialty
  const matched = hospitals.filter(h => 
    h.departments.some(d => {
      const dLower = d.toLowerCase().trim();
      return dLower === targetSpec || (getSpecialtyForProblem(dLower).toLowerCase() === targetSpec);
    })
  );

  return matched.map(h => {
    // Dynamic token and queue simulation based on hospital properties
    const isGovt = h.type.toLowerCase() === 'government';
    const baseTokens = isGovt ? 45 : 25;
    const issuedTokens = Math.min(baseTokens - 2, Math.floor(Math.random() * (baseTokens - 5)) + 5);
    const tokensAvailable = Math.max(3, baseTokens - issuedTokens);
    const waitingTime = Math.floor(Math.random() * 20) + (isGovt ? 25 : 12);
    
    return {
      ...h,
      matchedSpecialty: canonicalSpec,
      doctorsAvailable: isGovt ? 4 : (Math.floor(Math.random() * 2) + 1),
      todayTokensMax: baseTokens,
      tokensIssued: issuedTokens,
      tokensAvailable,
      waitingTime,
      nextSlot: getRandomTimeSlot()
    };
  });
};

export const getRandomTimeSlot = () => {
  const slots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM',
    '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM', '05:30 PM'
  ];
  return slots[Math.floor(Math.random() * slots.length)];
};
