import { getSpecialtyForProblem } from './problems.js';

export const doctors = [
  // --- TVMCH (h1) Doctors ---
  {
    id: 'doc-1',
    name: 'Dr. S. Sundararajan, MD (Gen Med)',
    specialty: 'General Medicine',
    hospitalId: 'h1',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    qualification: 'MBBS, MD (General Medicine)',
    experience: '19 Years',
    rating: 4.8,
    reviewsCount: 310,
    room: 'OPD Block A - Room 102',
    consultationFee: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '08:30 AM - 01:30 PM',
    tokensMax: 50,
    tokensIssuedToday: 32,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    about: 'Senior Professor of Medicine at TVMCH with two decades of experience treating complex viral fevers, diabetes, hypertension, and metabolic diseases.'
  },
  {
    id: 'doc-tvmch-derma',
    name: 'Dr. K. Revathi, MD (DVL)',
    specialty: 'Dermatology',
    hospitalId: 'h1',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    qualification: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    experience: '16 Years',
    rating: 4.9,
    reviewsCount: 390,
    room: 'Dermatology OPD - Block C Room 106',
    consultationFee: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '08:30 AM - 01:30 PM',
    tokensMax: 45,
    tokensIssuedToday: 22,
    image: 'https://images.unsplash.com/photo-1594824813620-6d9b049d5a9d?auto=format&fit=crop&w=400&q=80',
    about: 'Professor & Head of Dermatology at TVMCH specializing in acute skin allergies, hives/urticaria, severe eczema, psoriasis, and cosmetic dermatology.'
  },
  {
    id: 'doc-tvmch-derma-2',
    name: 'Dr. M. Senthil Arumugam, MD (DVL)',
    specialty: 'Dermatology',
    hospitalId: 'h1',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    qualification: 'MBBS, MD (Dermatology & Leprosy)',
    experience: '13 Years',
    rating: 4.8,
    reviewsCount: 280,
    room: 'Dermatology OPD - Block C Room 108',
    consultationFee: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:00 AM - 02:00 PM',
    tokensMax: 40,
    tokensIssuedToday: 21,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    about: 'Associate Professor of Dermatology at TVMCH specializing in severe contact dermatitis, occupational skin allergies, and drug allergy reactions.'
  },
  {
    id: 'doc-tvmch-derma-3',
    name: 'Dr. T. Priya Dharshini, DNB (Dermatology)',
    specialty: 'Dermatology',
    hospitalId: 'h1',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    qualification: 'MBBS, DNB (Dermatology), Fellow in Pediatric Dermatology',
    experience: '9 Years',
    rating: 4.7,
    reviewsCount: 215,
    room: 'Dermatology OPD - Block C Room 110',
    consultationFee: 0,
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    timing: '08:30 AM - 01:00 PM',
    tokensMax: 35,
    tokensIssuedToday: 18,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    about: 'Assistant Professor at TVMCH with focused clinical expertise in childhood eczema, stubborn acne, and widespread fungal allergy rashes.'
  },
  {
    id: 'doc-2',
    name: 'Dr. M. Kalaiselvi, MS, DGO',
    specialty: 'Obstetrics & Gynecology',
    hospitalId: 'h1',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    qualification: 'MBBS, MS (OG), Fellowship in High Risk Pregnancy',
    experience: '15 Years',
    rating: 4.9,
    reviewsCount: 420,
    room: 'Maternity Block - OPD 204',
    consultationFee: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timing: '09:00 AM - 02:00 PM',
    tokensMax: 45,
    tokensIssuedToday: 28,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80',
    about: 'Dedicated obstetrician known for managing high-risk pregnancies, maternal care, and laparoscopic gynecological procedures.'
  },
  {
    id: 'doc-3',
    name: 'Dr. P. Muthukumar, MCh (Cardio)',
    specialty: 'Cardiology',
    hospitalId: 'h1',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    qualification: 'MBBS, MD, MCh (Cardiology)',
    experience: '14 Years',
    rating: 4.7,
    reviewsCount: 260,
    room: 'Cardiology Super-Specialty OPD - Room 201',
    consultationFee: 0,
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    timing: '09:30 AM - 01:30 PM',
    tokensMax: 35,
    tokensIssuedToday: 25,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    about: 'Specialist in interventional cardiology, coronary angiograms, pacemaker implantation, and acute coronary syndrome management.'
  },
  {
    id: 'doc-tvmch-cardio-2',
    name: 'Dr. V. Ramalingam, MD, DM (Cardio)',
    specialty: 'Cardiology',
    hospitalId: 'h1',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    qualification: 'MBBS, MD, DM (Cardiology)',
    experience: '17 Years',
    rating: 4.9,
    reviewsCount: 340,
    room: 'Cardiology Super-Specialty OPD - Room 203',
    consultationFee: 0,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    timing: '08:30 AM - 01:00 PM',
    tokensMax: 35,
    tokensIssuedToday: 20,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    about: 'Senior Professor of Cardiology managing complex heart failure, hypertension, angina pectoris, and preventive cardiology.'
  },
  {
    id: 'doc-tvmch-cardio-3',
    name: 'Dr. S. Anitha, MD, DM (Cardiology)',
    specialty: 'Cardiology',
    hospitalId: 'h1',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    qualification: 'MBBS, MD (Gen Med), DM (Cardiology)',
    experience: '11 Years',
    rating: 4.8,
    reviewsCount: 220,
    room: 'Cardiology Super-Specialty OPD - Room 205',
    consultationFee: 0,
    availableDays: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    timing: '09:00 AM - 02:00 PM',
    tokensMax: 30,
    tokensIssuedToday: 17,
    image: 'https://images.unsplash.com/photo-1594824813620-6d9b049d5a9d?auto=format&fit=crop&w=400&q=80',
    about: 'Associate Professor specializing in non-invasive cardiac evaluation, echocardiography, arrhythmia, and emergency chest pain triage.'
  },
  {
    id: 'doc-101',
    name: 'Dr. C. Balasubramanian, MD (Pediatrics)',
    specialty: 'Pediatrics',
    hospitalId: 'h1',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: '12 Years',
    rating: 4.8,
    reviewsCount: 310,
    room: 'Child Health OPD Block B - Room 108',
    consultationFee: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '08:30 AM - 01:30 PM',
    tokensMax: 40,
    tokensIssuedToday: 29,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    about: 'Senior pediatrician managing child infections, neonatal care, and immunization at TVMCH.'
  },
  {
    id: 'doc-tvmch-ortho',
    name: 'Dr. R. Murugan, MS (Ortho)',
    specialty: 'Orthopedics',
    hospitalId: 'h1',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    qualification: 'MBBS, MS (Orthopedics)',
    experience: '15 Years',
    rating: 4.8,
    reviewsCount: 290,
    room: 'Orthopedics OPD - Block A Room 104',
    consultationFee: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timing: '08:30 AM - 01:30 PM',
    tokensMax: 40,
    tokensIssuedToday: 26,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    about: 'Chief orthopedic surgeon managing complex bone fractures, joint arthritis, and trauma reconstruction at TVMCH.'
  },
  {
    id: 'doc-tvmch-pulmo',
    name: 'Dr. A. Sivakumar, MD (Pulmonology)',
    specialty: 'Pulmonology',
    hospitalId: 'h1',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    qualification: 'MBBS, MD (Chest Diseases & Pulmonology)',
    experience: '13 Years',
    rating: 4.8,
    reviewsCount: 240,
    room: 'Pulmonology OPD - Room 107',
    consultationFee: 0,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    timing: '09:00 AM - 01:30 PM',
    tokensMax: 35,
    tokensIssuedToday: 19,
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=400&q=80',
    about: 'Chest physician specializing in bronchial asthma, COPD, chronic bronchitis, and allergy-induced wheezing.'
  },
  {
    id: 'doc-tvmch-ent',
    name: 'Dr. T. Ramaswamy, MS (ENT)',
    specialty: 'ENT',
    hospitalId: 'h1',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    qualification: 'MBBS, MS (ENT)',
    experience: '14 Years',
    rating: 4.7,
    reviewsCount: 220,
    room: 'ENT OPD Block C - Room 105',
    consultationFee: 0,
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    timing: '08:30 AM - 01:30 PM',
    tokensMax: 35,
    tokensIssuedToday: 20,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    about: 'ENT specialist offering diagnostics and therapies for ear infections, sinus pain, tonsillitis, and vertigo.'
  },

  // --- Shifa Hospital (h2) Doctors ---
  {
    id: 'doc-4',
    name: 'Dr. R. Venkatraman, DM (Cardio)',
    specialty: 'Cardiology',
    hospitalId: 'h2',
    hospitalName: 'Shifa Hospital',
    qualification: 'MBBS, MD, DM (Cardiology), FACC',
    experience: '17 Years',
    rating: 4.9,
    reviewsCount: 380,
    room: 'Cardiac Wing - Suite 301',
    consultationFee: 400,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '10:00 AM - 04:00 PM',
    tokensMax: 30,
    tokensIssuedToday: 18,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    about: 'Chief of Interventional Cardiology at Shifa Hospital with extensive expertise in complex angioplasties and heart failure therapies.'
  },
  {
    id: 'doc-shifa-cardio-2',
    name: 'Dr. M. Nizamudeen, MD, DM (Cardio)',
    specialty: 'Cardiology',
    hospitalId: 'h2',
    hospitalName: 'Shifa Hospital',
    qualification: 'MBBS, MD (Internal Medicine), DM (Cardiology)',
    experience: '14 Years',
    rating: 4.8,
    reviewsCount: 295,
    room: 'Cardiac Wing - Suite 304',
    consultationFee: 350,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    timing: '09:00 AM - 01:30 PM, 05:00 PM - 07:30 PM',
    tokensMax: 35,
    tokensIssuedToday: 19,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    about: 'Senior Consultant Cardiologist specializing in coronary angiography, acute angina management, and echocardiographic evaluation.'
  },
  {
    id: 'doc-shifa-cardio-3',
    name: 'Dr. K. Jayashree, DNB (Cardiology)',
    specialty: 'Cardiology',
    hospitalId: 'h2',
    hospitalName: 'Shifa Hospital',
    qualification: 'MBBS, DNB (General Medicine), DNB (Cardiology)',
    experience: '10 Years',
    rating: 4.7,
    reviewsCount: 210,
    room: 'Cardiac Wing - Suite 306',
    consultationFee: 350,
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    timing: '10:30 AM - 03:00 PM',
    tokensMax: 30,
    tokensIssuedToday: 15,
    image: 'https://images.unsplash.com/photo-1594824813620-6d9b049d5a9d?auto=format&fit=crop&w=400&q=80',
    about: 'Consultant Cardiologist focusing on non-invasive cardiac imaging, chest pain triage, lipid clinic, and hypertension control.'
  },
  {
    id: 'doc-shifa-derma',
    name: 'Dr. A. Shamim Banu, MD (DVL), DNB',
    specialty: 'Dermatology',
    hospitalId: 'h2',
    hospitalName: 'Shifa Hospital',
    qualification: 'MBBS, MD (DVL), DNB (Dermatology)',
    experience: '13 Years',
    rating: 4.8,
    reviewsCount: 320,
    room: 'Dermatology Suite 208',
    consultationFee: 350,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:30 AM - 02:00 PM, 05:00 PM - 07:30 PM',
    tokensMax: 35,
    tokensIssuedToday: 19,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    about: 'Senior consultant dermatologist specializing in contact dermatitis, eczema, chronic skin allergy, laser therapy, and cosmetic dermatology.'
  },
  {
    id: 'doc-shifa-derma-2',
    name: 'Dr. R. Syed Ibrahim, MD (DVL), FAAD',
    specialty: 'Dermatology',
    hospitalId: 'h2',
    hospitalName: 'Shifa Hospital',
    qualification: 'MBBS, MD (DVL), Fellowship of American Academy of Dermatology',
    experience: '18 Years',
    rating: 4.9,
    reviewsCount: 440,
    room: 'Dermatology Suite 210',
    consultationFee: 400,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timing: '10:00 AM - 03:30 PM',
    tokensMax: 30,
    tokensIssuedToday: 16,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    about: 'Chief Dermatologist at Shifa Hospital specializing in acute urticaria, severe itching, skin allergy patch tests, and immunodermatology.'
  },
  {
    id: 'doc-shifa-derma-3',
    name: 'Dr. N. Kavitha, MD (DVL)',
    specialty: 'Dermatology',
    hospitalId: 'h2',
    hospitalName: 'Shifa Hospital',
    qualification: 'MBBS, MD (DVL), Fellowship in Aesthetic & Laser Dermatology',
    experience: '10 Years',
    rating: 4.7,
    reviewsCount: 195,
    room: 'Dermatology Suite 205',
    consultationFee: 300,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:00 AM - 01:00 PM, 04:30 PM - 07:00 PM',
    tokensMax: 35,
    tokensIssuedToday: 17,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80',
    about: 'Consultant dermatologist skilled in holistic management of chronic skin rashes, food & seasonal allergies, and hair disorders.'
  },
  {
    id: 'doc-shifa-pulmo',
    name: 'Dr. K. Peer Mohamed, MD (Pulmonology)',
    specialty: 'Pulmonology',
    hospitalId: 'h2',
    hospitalName: 'Shifa Hospital',
    qualification: 'MBBS, MD (Pulmonology)',
    experience: '12 Years',
    rating: 4.7,
    reviewsCount: 210,
    room: 'Chest Clinic Room 204',
    consultationFee: 350,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    timing: '10:00 AM - 02:00 PM',
    tokensMax: 30,
    tokensIssuedToday: 16,
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=400&q=80',
    about: 'Specialist in chronic respiratory care, asthma treatment, and allergic bronchitis management.'
  },
  {
    id: 'doc-shifa-og',
    name: 'Dr. F. Jasmine, MS, DGO',
    specialty: 'Obstetrics & Gynecology',
    hospitalId: 'h2',
    hospitalName: 'Shifa Hospital',
    qualification: 'MBBS, MS (OG), DGO',
    experience: '14 Years',
    rating: 4.9,
    reviewsCount: 360,
    room: 'Maternity Clinic Suite 102',
    consultationFee: 350,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:30 AM - 01:30 PM, 04:30 PM - 07:00 PM',
    tokensMax: 35,
    tokensIssuedToday: 21,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80',
    about: 'Consultant gynecologist and obstetrician specializing in safe deliveries, antenatal checkups, and womens wellness.'
  },
  {
    id: 'doc-5',
    name: 'Dr. Deepa Senthil, MS (ENT)',
    specialty: 'ENT',
    hospitalId: 'h2',
    hospitalName: 'Shifa Hospital',
    qualification: 'MBBS, MS (ENT), DLO',
    experience: '12 Years',
    rating: 4.7,
    reviewsCount: 195,
    room: 'ENT Suite 202',
    consultationFee: 350,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '10:30 AM - 03:30 PM',
    tokensMax: 30,
    tokensIssuedToday: 15,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    about: 'Specialist in endoscopic sinus surgeries, hearing loss diagnostics, micro-ear surgery, and pediatric ENT ailments.'
  },
  {
    id: 'doc-6',
    name: 'Dr. K. Annamalai, MS (Ortho)',
    specialty: 'Orthopedics',
    hospitalId: 'h2',
    hospitalName: 'Shifa Hospital',
    qualification: 'MBBS, MS (Orthopedics), Fellowship in Joint Replacement',
    experience: '16 Years',
    rating: 4.8,
    reviewsCount: 340,
    room: 'Orthopedics Clinic Suite 105',
    consultationFee: 350,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timing: '09:00 AM - 02:00 PM',
    tokensMax: 35,
    tokensIssuedToday: 21,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    about: 'Experienced orthopedic surgeon specializing in robotic total knee replacements, arthroscopy, and complex trauma fractures.'
  },
  {
    id: 'doc-102',
    name: 'Dr. S. Abdul Majeed, MD (Gen Med)',
    specialty: 'General Medicine',
    hospitalId: 'h2',
    hospitalName: 'Shifa Hospital',
    qualification: 'MBBS, MD (General Medicine)',
    experience: '14 Years',
    rating: 4.8,
    reviewsCount: 275,
    room: 'Consultation Room 101',
    consultationFee: 300,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:30 AM - 01:30 PM, 05:00 PM - 08:00 PM',
    tokensMax: 35,
    tokensIssuedToday: 20,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    about: 'Chief physician at Shifa Hospital specializing in infectious diseases, hypertension, and diabetes management.'
  },

  // --- Aravind Eye Hospital (h3) Doctors ---
  {
    id: 'doc-7',
    name: 'Dr. M. Selvi, MS (Ophthalmology)',
    specialty: 'Ophthalmology',
    hospitalId: 'h3',
    hospitalName: 'Aravind Eye Hospital',
    qualification: 'MBBS, MS (Ophthalmology), Fellow in Cornea',
    experience: '16 Years',
    rating: 4.9,
    reviewsCount: 580,
    room: 'Vision Suite 1',
    consultationFee: 200,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '08:00 AM - 03:00 PM',
    tokensMax: 50,
    tokensIssuedToday: 35,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80',
    about: 'Chief cataract surgeon at Aravind Eye Hospital Tirunelveli with thousands of successful refractive and lens replacement surgeries.'
  },
  {
    id: 'doc-8',
    name: 'Dr. S. Thangaraj, DO, DNB',
    specialty: 'Ophthalmology',
    hospitalId: 'h3',
    hospitalName: 'Aravind Eye Hospital',
    qualification: 'MBBS, DO, DNB (Ophthalmology)',
    experience: '11 Years',
    rating: 4.8,
    reviewsCount: 310,
    room: 'Glaucoma Clinic - Suite 4',
    consultationFee: 200,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timing: '08:30 AM - 02:30 PM',
    tokensMax: 40,
    tokensIssuedToday: 24,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    about: 'Glaucoma and retinal specialist focusing on early optic nerve damage detection and laser trabeculoplasty.'
  },

  // --- Kauvery Hospital (h4) Doctors ---
  {
    id: 'doc-kauvery-cardio',
    name: 'Dr. S. Premkumar, DM (Cardio), FACC',
    specialty: 'Cardiology',
    hospitalId: 'h4',
    hospitalName: 'Kauvery Hospital Tirunelveli',
    qualification: 'MBBS, MD (Gen Med), DM (Cardiology), Fellowship in Interventional Cardiology',
    experience: '16 Years',
    rating: 4.9,
    reviewsCount: 450,
    room: 'Kauvery Heart Centre - OPD 302',
    consultationFee: 500,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:00 AM - 03:00 PM',
    tokensMax: 30,
    tokensIssuedToday: 20,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    about: 'Lead interventional cardiologist at Kauvery Heart Institute specializing in emergency coronary angioplasty, chest pain evaluation, and heart rhythm disorders.'
  },
  {
    id: 'doc-kauvery-cardio-2',
    name: 'Dr. G. Arunachalam, MD, DM (Cardio)',
    specialty: 'Cardiology',
    hospitalId: 'h4',
    hospitalName: 'Kauvery Hospital Tirunelveli',
    qualification: 'MBBS, MD (General Medicine), DM (Cardiology)',
    experience: '13 Years',
    rating: 4.8,
    reviewsCount: 310,
    room: 'Kauvery Heart Centre - OPD 305',
    consultationFee: 450,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timing: '10:00 AM - 03:30 PM',
    tokensMax: 30,
    tokensIssuedToday: 17,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    about: 'Senior Consultant Cardiologist focusing on coronary artery disease, heart attack triage, clinical cardiology, and hypertension.'
  },
  {
    id: 'doc-kauvery-cardio-3',
    name: 'Dr. H. Divya Bharathi, MD, DM (Cardio)',
    specialty: 'Cardiology',
    hospitalId: 'h4',
    hospitalName: 'Kauvery Hospital Tirunelveli',
    qualification: 'MBBS, MD (Internal Medicine), DM (Cardiology)',
    experience: '9 Years',
    rating: 4.7,
    reviewsCount: 190,
    room: 'Kauvery Heart Centre - OPD 308',
    consultationFee: 400,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:00 AM - 01:30 PM, 04:30 PM - 07:00 PM',
    tokensMax: 35,
    tokensIssuedToday: 18,
    image: 'https://images.unsplash.com/photo-1594824813620-6d9b049d5a9d?auto=format&fit=crop&w=400&q=80',
    about: 'Consultant Cardiologist specializing in echocardiography, preventive cardiac wellness, and chest pain monitoring.'
  },
  {
    id: 'doc-kauvery-ortho',
    name: 'Dr. R. Harish, MS (Ortho), MCh',
    specialty: 'Orthopedics',
    hospitalId: 'h4',
    hospitalName: 'Kauvery Hospital Tirunelveli',
    qualification: 'MBBS, MS (Orthopedics), MCh (Ortho)',
    experience: '15 Years',
    rating: 4.8,
    reviewsCount: 330,
    room: 'Bone & Joint Clinic 104',
    consultationFee: 450,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timing: '10:00 AM - 02:00 PM',
    tokensMax: 30,
    tokensIssuedToday: 17,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    about: 'Consultant orthopedic and joint reconstruction surgeon specializing in minimally invasive knee and hip surgeries.'
  },
  {
    id: 'doc-9',
    name: 'Dr. A. Venkatesh, DM (Neuro)',
    specialty: 'Neurology',
    hospitalId: 'h4',
    hospitalName: 'Kauvery Hospital Tirunelveli',
    qualification: 'MBBS, MD, DM (Neurology)',
    experience: '18 Years',
    rating: 4.9,
    reviewsCount: 410,
    room: 'Neurosciences OPD 401',
    consultationFee: 500,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timing: '10:00 AM - 03:00 PM',
    tokensMax: 25,
    tokensIssuedToday: 16,
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=400&q=80',
    about: 'Senior neurologist known for stroke rehabilitation, epilepsy management, migraine cures, and movement disorder treatments.'
  },
  {
    id: 'doc-10',
    name: 'Dr. N. Karthikeyan, MD (Pediatrics)',
    specialty: 'Pediatrics',
    hospitalId: 'h4',
    hospitalName: 'Kauvery Hospital Tirunelveli',
    qualification: 'MBBS, MD (Pediatrics), DCH',
    experience: '13 Years',
    rating: 4.8,
    reviewsCount: 290,
    room: 'Pediatric Care OPD 103',
    consultationFee: 400,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:00 AM - 01:00 PM, 05:00 PM - 07:30 PM',
    tokensMax: 35,
    tokensIssuedToday: 22,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    about: 'Compassionate child specialist skilled in newborn resuscitation, immunization scheduling, child nutrition, and pediatric asthma.'
  },
  {
    id: 'doc-103',
    name: 'Dr. G. Subbulakshmi, MD (Gen Med)',
    specialty: 'General Medicine',
    hospitalId: 'h4',
    hospitalName: 'Kauvery Hospital Tirunelveli',
    qualification: 'MBBS, MD (Internal Medicine)',
    experience: '15 Years',
    rating: 4.8,
    reviewsCount: 215,
    room: 'Executive Clinic 201',
    consultationFee: 450,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timing: '09:00 AM - 03:00 PM',
    tokensMax: 30,
    tokensIssuedToday: 18,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    about: 'Consultant physician offering preventative health checkups and chronic illness management.'
  },
  {
    id: 'doc-kauvery-genmed-2',
    name: 'Dr. M. Sridhar, MD, DNB (Gen Med)',
    specialty: 'General Medicine',
    hospitalId: 'h4',
    hospitalName: 'Kauvery Hospital Tirunelveli',
    qualification: 'MBBS, MD (General Medicine), DNB',
    experience: '17 Years',
    rating: 4.9,
    reviewsCount: 380,
    room: 'Executive Clinic 203',
    consultationFee: 450,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '08:30 AM - 01:30 PM, 05:00 PM - 08:00 PM',
    tokensMax: 35,
    tokensIssuedToday: 21,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    about: 'Senior Consultant Physician specializing in adult medicine, hypertension, diabetic complications, and infectious diseases.'
  },
  {
    id: 'doc-kauvery-genmed-3',
    name: 'Dr. K. Vigneshwaran, MD (Internal Med)',
    specialty: 'General Medicine',
    hospitalId: 'h4',
    hospitalName: 'Kauvery Hospital Tirunelveli',
    qualification: 'MBBS, MD (Internal Medicine), Dip. Diabetology',
    experience: '12 Years',
    rating: 4.8,
    reviewsCount: 260,
    room: 'Executive Clinic 205',
    consultationFee: 400,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:30 AM - 02:30 PM',
    tokensMax: 30,
    tokensIssuedToday: 15,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    about: 'Consultant physician specializing in acute fever evaluation, lifestyle disorders, and metabolic health management.'
  },
  {
    id: 'doc-kauvery-genmed-4',
    name: 'Dr. Priya Sankaran, MD (Gen Med)',
    specialty: 'General Medicine',
    hospitalId: 'h4',
    hospitalName: 'Kauvery Hospital Tirunelveli',
    qualification: 'MBBS, MD (General Medicine)',
    experience: '11 Years',
    rating: 4.7,
    reviewsCount: 195,
    room: 'Executive Clinic 207',
    consultationFee: 400,
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    timing: '10:00 AM - 04:00 PM',
    tokensMax: 28,
    tokensIssuedToday: 14,
    image: 'https://images.unsplash.com/photo-1594824813620-6d9b049d5a9d?auto=format&fit=crop&w=400&q=80',
    about: 'Consultant physician focusing on comprehensive women health, geriatric care, and preventive health screenings.'
  },

  // --- Porunai Hospitals (h5) Doctors ---
  {
    id: 'doc-11',
    name: 'Dr. J. Meenakshi, MD (DVL)',
    specialty: 'Dermatology',
    hospitalId: 'h5',
    hospitalName: 'Porunai Hospitals',
    qualification: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    experience: '10 Years',
    rating: 4.6,
    reviewsCount: 175,
    room: 'Skin & Cosmetology Room 2',
    consultationFee: 250,
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    timing: '10:00 AM - 02:00 PM',
    tokensMax: 30,
    tokensIssuedToday: 19,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    about: 'Dermatologist offering tailored clinical therapies for chronic eczema, acne vulgaris, hair loss disorders, and skin allergies.'
  },
  {
    id: 'doc-porunai-derma-2',
    name: 'Dr. K. Mohamed Farooq, DVD, MD',
    specialty: 'Dermatology',
    hospitalId: 'h5',
    hospitalName: 'Porunai Hospitals',
    qualification: 'MBBS, DVD, MD (Dermatology)',
    experience: '14 Years',
    rating: 4.7,
    reviewsCount: 230,
    room: 'Skin Clinic Room 5',
    consultationFee: 250,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:30 AM - 01:30 PM, 05:30 PM - 08:00 PM',
    tokensMax: 35,
    tokensIssuedToday: 18,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    about: 'Senior skin & allergy physician in Melapalayam providing proven remedies for intense pruritus, allergic dermatitis, and seasonal hives.'
  },
  {
    id: 'doc-porunai-ent',
    name: 'Dr. N. Vijayalakshmi, DLO, MS (ENT)',
    specialty: 'ENT',
    hospitalId: 'h5',
    hospitalName: 'Porunai Hospitals',
    qualification: 'MBBS, DLO, MS (ENT)',
    experience: '11 Years',
    rating: 4.7,
    reviewsCount: 160,
    room: 'ENT Suite 3',
    consultationFee: 250,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    timing: '10:00 AM - 01:30 PM',
    tokensMax: 30,
    tokensIssuedToday: 14,
    image: 'https://images.unsplash.com/photo-1594824813620-6d9b049d5a9d?auto=format&fit=crop&w=400&q=80',
    about: 'ENT specialist treating sinus infections, nasal polyps, allergic rhinitis, and throat problems.'
  },
  {
    id: 'doc-104',
    name: 'Dr. P. Senthil Nathan, MD (Gen Med)',
    specialty: 'General Medicine',
    hospitalId: 'h5',
    hospitalName: 'Porunai Hospitals',
    qualification: 'MBBS, MD (Gen Med)',
    experience: '11 Years',
    rating: 4.7,
    reviewsCount: 190,
    room: 'OPD Chamber 1',
    consultationFee: 250,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:00 AM - 01:00 PM, 05:00 PM - 08:00 PM',
    tokensMax: 35,
    tokensIssuedToday: 21,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    about: 'Experienced general physician serving the Melapalayam community for viral fevers, diabetes, and geriatrics.'
  },

  // --- Dr. Agarwal\'s Eye Hospital (h6) Doctors ---
  {
    id: 'doc-105',
    name: 'Dr. S. Soundaram, MS (Ophth)',
    specialty: 'Ophthalmology',
    hospitalId: 'h6',
    hospitalName: "Dr. Agarwal's Eye Hospital",
    qualification: 'MBBS, MS (Ophthalmology), Fellow in Vitreo-Retina',
    experience: '14 Years',
    rating: 4.8,
    reviewsCount: 280,
    room: 'Laser Eye Suite A',
    consultationFee: 300,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:00 AM - 04:00 PM',
    tokensMax: 35,
    tokensIssuedToday: 22,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80',
    about: 'Retina specialist and ophthalmic surgeon at Dr. Agarwals High Grounds branch.'
  },

  // --- Arul Mission Hospital (h7) Doctors ---
  {
    id: 'doc-12',
    name: 'Dr. T. Joseph Arul, MS (General Surgery)',
    specialty: 'General Medicine',
    hospitalId: 'h7',
    hospitalName: 'Arul Mission Hospital',
    qualification: 'MBBS, MS (General Surgery), FMAS',
    experience: '20 Years',
    rating: 4.7,
    reviewsCount: 350,
    room: 'OPD Chamber 1',
    consultationFee: 300,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:00 AM - 02:00 PM',
    tokensMax: 40,
    tokensIssuedToday: 26,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    about: 'Veteran physician and surgeon providing general consultations, laparoscopic surgical care, and trauma management.'
  },

  // --- Sugham Health Centre (h8) Doctors ---
  {
    id: 'doc-sugham-derma',
    name: 'Dr. S. Meena, MD (DVL)',
    specialty: 'Dermatology',
    hospitalId: 'h8',
    hospitalName: 'Sugham Health Centre',
    qualification: 'MBBS, MD (DVL)',
    experience: '11 Years',
    rating: 4.7,
    reviewsCount: 165,
    room: 'Skin & Allergy Clinic Room B',
    consultationFee: 200,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:00 AM - 01:00 PM, 05:30 PM - 08:30 PM',
    tokensMax: 30,
    tokensIssuedToday: 14,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80',
    about: 'Specialist in rapid diagnosis and relief for skin allergies, fungal rashes, itching, and adolescent acne near Tirunelveli Junction.'
  },
  {
    id: 'doc-sugham-derma-2',
    name: 'Dr. P. Karthikeyan, DDVL',
    specialty: 'Dermatology',
    hospitalId: 'h8',
    hospitalName: 'Sugham Health Centre',
    qualification: 'MBBS, DDVL (Dermatology & Venereology)',
    experience: '8 Years',
    rating: 4.6,
    reviewsCount: 150,
    room: 'Skin Clinic Room D',
    consultationFee: 200,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '08:30 AM - 12:30 PM, 04:30 PM - 07:30 PM',
    tokensMax: 35,
    tokensIssuedToday: 15,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    about: 'Junction clinic skin specialist offering quick token consultations for acute allergic rashes, insect bite reactions, and redness.'
  },
  {
    id: 'doc-sugham-ent',
    name: 'Dr. M. Subha, MS (ENT)',
    specialty: 'ENT',
    hospitalId: 'h8',
    hospitalName: 'Sugham Health Centre',
    qualification: 'MBBS, MS (ENT)',
    experience: '10 Years',
    rating: 4.6,
    reviewsCount: 135,
    room: 'ENT Care Room C',
    consultationFee: 200,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
    timing: '10:00 AM - 01:00 PM, 05:00 PM - 07:30 PM',
    tokensMax: 30,
    tokensIssuedToday: 12,
    image: 'https://images.unsplash.com/photo-1594824813620-6d9b049d5a9d?auto=format&fit=crop&w=400&q=80',
    about: 'Consultant in ear infections, allergic sinusitis, throat irritation, and routine ENT triage.'
  },
  {
    id: 'doc-13',
    name: 'Dr. B. Radha, MD (Gen Med)',
    specialty: 'General Medicine',
    hospitalId: 'h8',
    hospitalName: 'Sugham Health Centre',
    qualification: 'MBBS, MD (Internal Medicine)',
    experience: '9 Years',
    rating: 4.5,
    reviewsCount: 140,
    room: 'Junction Clinic Room A',
    consultationFee: 200,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '08:00 AM - 01:00 PM, 05:00 PM - 08:30 PM',
    tokensMax: 40,
    tokensIssuedToday: 20,
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=400&q=80',
    about: 'Family physician with fast token processing, diagnosing acute illnesses, lifestyle disorders, and routine seasonal infections.'
  },

  // --- Peace Health Centre (h9) Doctors ---
  {
    id: 'doc-106',
    name: 'Dr. A. Mohamed Ismail, MD',
    specialty: 'General Medicine',
    hospitalId: 'h9',
    hospitalName: 'Peace Health Centre',
    qualification: 'MBBS, MD (Family Medicine)',
    experience: '10 Years',
    rating: 4.6,
    reviewsCount: 130,
    room: 'OPD Consultation Room 1',
    consultationFee: 200,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:00 AM - 01:00 PM, 04:30 PM - 08:00 PM',
    tokensMax: 35,
    tokensIssuedToday: 17,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    about: 'Community physician providing quality outpatient care, health screenings, and fever triage.'
  },

  // --- Annai Velankanni Hospital (h10) Doctors ---
  {
    id: 'doc-107',
    name: 'Dr. S. Gnana Prakasam, MBBS, DNB',
    specialty: 'General Medicine',
    hospitalId: 'h10',
    hospitalName: 'Annai Velankanni Hospital',
    qualification: 'MBBS, DNB (Internal Medicine)',
    experience: '13 Years',
    rating: 4.7,
    reviewsCount: 185,
    room: 'Palayamkottai Wing - OPD 2',
    consultationFee: 250,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timing: '09:00 AM - 02:00 PM',
    tokensMax: 35,
    tokensIssuedToday: 19,
    image: 'https://images.unsplash.com/photo-1637059824899-a441006a6875?auto=format&fit=crop&w=400&q=80',
    about: 'Consultant general physician in Palayamkottai providing compassionate care for outpatient treatments.'
  }
];

// Strictly get doctors belonging ONLY to the specified hospital
export const getDoctorsByHospital = (hospitalId) => {
  if (!hospitalId) return doctors;
  return doctors.filter(d => d.hospitalId === hospitalId);
};

export const getDoctorsBySpecialty = (specialty) => {
  if (!specialty) return doctors;
  return doctors.filter(d => d.specialty.toLowerCase() === specialty.toLowerCase());
};

export const getDoctorById = (id) => {
  return doctors.find(d => d.id === id);
};

// Strict isolation: ONLY returns doctors that belong to the requested hospitalId AND this exact specialty
export const getDoctorsByHospitalAndSpecialty = (hospitalId, specialty) => {
  const canonicalSpec = specialty ? (getSpecialtyForProblem(specialty) || specialty) : '';
  const targetSpec = canonicalSpec.toLowerCase().trim();

  if (!hospitalId) {
    if (!targetSpec) return doctors;
    return doctors.filter(d => {
      const dSpec = (getSpecialtyForProblem(d.specialty) || d.specialty).toLowerCase().trim();
      return dSpec === targetSpec || dSpec.includes(targetSpec) || targetSpec.includes(dSpec);
    });
  }

  // 1. Strict filter by hospitalId first - never cross hospital boundaries
  const hospitalDoctors = doctors.filter(d => d.hospitalId === hospitalId);
  if (!targetSpec) return hospitalDoctors;

  // 2. Filter strictly by specialty within that hospital only
  const specMatched = hospitalDoctors.filter(d => {
    const dSpec = (getSpecialtyForProblem(d.specialty) || d.specialty).toLowerCase().trim();
    return dSpec === targetSpec || dSpec.includes(targetSpec) || targetSpec.includes(dSpec);
  });

  const isGovt = hospitalId === 'h1';
  const hosp = hospitalDoctors[0] || {};
  const hospName = hosp.hospitalName || 'Tirunelveli Hospital';
  const fee = isGovt ? 0 : (hosp.consultationFee !== undefined ? hosp.consultationFee : 350);

  const additionalPanel = [
    {
      idSuffix: 'panel-1',
      name: isGovt ? `Dr. K. Senthil Nathan, MD (${canonicalSpec})` : `Dr. M. Sridhar, MD, DNB (${canonicalSpec})`,
      qualification: `MBBS, MD (${canonicalSpec}), DNB`,
      experience: '16 Years',
      rating: 4.8,
      reviewsCount: 310,
      room: `${canonicalSpec} OPD - Chamber 202`,
      timing: '09:00 AM - 01:30 PM, 05:00 PM - 07:30 PM',
      tokensMax: 35,
      tokensIssuedToday: 19,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      about: `Senior Consultant ${canonicalSpec} specialist with extensive clinical expertise in outpatient evaluation and chronic disease management.`
    },
    {
      idSuffix: 'panel-2',
      name: isGovt ? `Dr. S. Anitha, MD (${canonicalSpec})` : `Dr. K. Vigneshwaran, MD (${canonicalSpec})`,
      qualification: `MBBS, MD (${canonicalSpec})`,
      experience: '13 Years',
      rating: 4.9,
      reviewsCount: 280,
      room: `${canonicalSpec} OPD - Chamber 204`,
      timing: '10:00 AM - 03:00 PM',
      tokensMax: 30,
      tokensIssuedToday: 16,
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
      about: `Associate Professor and specialist in ${canonicalSpec} offering evidence-based outpatient diagnosis and personalized treatment regimens.`
    },
    {
      idSuffix: 'panel-3',
      name: isGovt ? `Dr. R. Meenakshi Sundaram, MD (${canonicalSpec})` : `Dr. Priya Sankaran, MD (${canonicalSpec})`,
      qualification: `MBBS, MD (${canonicalSpec}), Fellowship`,
      experience: '11 Years',
      rating: 4.7,
      reviewsCount: 215,
      room: `${canonicalSpec} OPD - Chamber 206`,
      timing: '08:30 AM - 02:00 PM',
      tokensMax: 30,
      tokensIssuedToday: 14,
      image: 'https://images.unsplash.com/photo-1594824813620-6d9b049d5a9d?auto=format&fit=crop&w=400&q=80',
      about: `Consultant ${canonicalSpec} physician with specialized focus on preventive health checkups, follow-up care, and patient wellness.`
    },
    {
      idSuffix: 'panel-4',
      name: isGovt ? `Dr. V. Ramalingam, MD (${canonicalSpec})` : `Dr. T. Murugesan, MD (${canonicalSpec})`,
      qualification: `MBBS, MD (${canonicalSpec})`,
      experience: '15 Years',
      rating: 4.8,
      reviewsCount: 230,
      room: `${canonicalSpec} OPD - Chamber 208`,
      timing: '09:30 AM - 02:30 PM',
      tokensMax: 32,
      tokensIssuedToday: 17,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
      about: `Dedicated specialist in ${canonicalSpec} with comprehensive experience in patient triage, diagnostic workup, and outpatient therapy.`
    }
  ];

  const results = [...specMatched];
  let panelIdx = 0;
  while (results.length < 3 && panelIdx < additionalPanel.length) {
    const p = additionalPanel[panelIdx];
    panelIdx++;
    if (!results.some(r => r.name.toLowerCase().includes(p.name.slice(0, 10).toLowerCase()))) {
      results.push({
        id: `doc-${hospitalId}-${targetSpec.replace(/[^a-z0-9]/gi, '-')}-${p.idSuffix}`,
        name: p.name,
        specialty: canonicalSpec,
        hospitalId: hospitalId,
        hospitalName: hospName,
        qualification: p.qualification,
        experience: p.experience,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        room: p.room,
        consultationFee: fee,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        timing: p.timing,
        tokensMax: p.tokensMax,
        tokensIssuedToday: p.tokensIssuedToday,
        image: p.image,
        about: p.about
      });
    }
  }

  return results;
};

export const getAvailableSlots = (doctorId, selectedDate) => {
  const morningSlots = [
    '09:00 AM', '09:20 AM', '09:40 AM',
    '10:00 AM', '10:20 AM', '10:40 AM',
    '11:00 AM', '11:20 AM', '11:40 AM',
    '12:00 PM', '12:20 PM'
  ];
  const afternoonSlots = [
    '02:00 PM', '02:20 PM', '02:40 PM',
    '03:00 PM', '03:20 PM', '03:40 PM',
    '04:00 PM', '04:20 PM', '04:40 PM',
    '05:00 PM', '05:20 PM'
  ];

  // Retrieve user's booked appointments from localStorage
  const bookedSlotsSet = new Set();
  try {
    const saved = localStorage.getItem('tvl_appointments');
    if (saved) {
      const appointments = JSON.parse(saved);
      if (Array.isArray(appointments)) {
        appointments.forEach(a => {
          if ((!doctorId || a.doctorId === doctorId) && (!selectedDate || a.date === selectedDate)) {
            if (a.timeSlot) {
              const matched = a.timeSlot.match(/\d{2}:\d{2}\s*(?:AM|PM)/i);
              if (matched) bookedSlotsSet.add(matched[0].toUpperCase());
              else bookedSlotsSet.add(a.timeSlot.trim());
            }
          }
        });
      }
    }
  } catch (e) {
    console.error(e);
  }

  // Deterministic seed for consistent availability per doctor/date
  const seedString = `${doctorId || 'doc'}-${selectedDate || 'today'}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const getPseudo = (idx) => {
    const x = Math.sin(hash + idx * 13) * 10000;
    return x - Math.floor(x);
  };

  // Pre-configured booked slots (e.g. 09:20 AM, 10:00 AM, 10:40 AM, 11:40 AM booked/full)
  const morningUnavailableIndices = new Set([1, 3, 5, 8]); 
  // Afternoon pre-configured booked slots (02:20 PM, 03:00 PM, 04:00 PM, 04:40 PM)
  const afternoonUnavailableIndices = new Set([1, 3, 6, 8]);

  const morningTokenNums = [15, 4, 12, 9, 13, 12, 13, 11, 11, 13, 12];
  const afternoonTokenNums = [20, 29, 18, 25, 28, 18, 25, 25, 16, 22, 25];

  return {
    morning: morningSlots.map((time, idx) => {
      const isBooked = bookedSlotsSet.has(time) || (morningUnavailableIndices.has(idx) && getPseudo(idx) >= 0.1);
      return {
        time,
        available: !isBooked,
        tokenNumber: morningTokenNums[idx] || (idx + 1)
      };
    }),
    afternoon: afternoonSlots.map((time, idx) => {
      const isBooked = bookedSlotsSet.has(time) || (afternoonUnavailableIndices.has(idx) && getPseudo(idx + 15) >= 0.1);
      return {
        time,
        available: !isBooked,
        tokenNumber: afternoonTokenNums[idx] || (idx + 16)
      };
    })
  };
};

export const fallbackDoctorAvatar = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
