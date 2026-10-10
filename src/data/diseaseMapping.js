export const diseaseMapping = {
  'Fever': 'General Medicine',
  'Cold': 'General Medicine',
  'Cough': 'General Medicine',
  'Fever & Body Ache': 'General Medicine',
  'Severe Cough & Breathing Issue': 'Pulmonology',
  'Skin Problem': 'Dermatology',
  'Skin Allergy': 'Dermatology',
  'Acne / Hair Fall / Eczema': 'Dermatology',
  'Eye Problem': 'Ophthalmology',
  'Eye Redness & Vision Blur': 'Ophthalmology',
  'Ear Problem': 'ENT',
  'Ear Pain / Hearing Loss': 'ENT',
  'Nose Problem': 'ENT',
  'Throat Problem': 'ENT',
  'Dental Problem': 'Dentistry',
  'Heart Problem': 'Cardiology',
  'Chest Pain': 'Cardiology',
  'High Blood Pressure / Palpitations': 'Cardiology',
  'Cancer': 'Oncology',
  'Breast-related Concern': 'Oncology',
  'Bone Problem': 'Orthopedics',
  'Joint Pain': 'Orthopedics',
  'Back Pain': 'Orthopedics',
  'Kidney Problem': 'Nephrology',
  'Urinary Problem': 'Urology',
  'Stomach Problem': 'Gastroenterology',
  'Liver Problem': 'Gastroenterology',
  'Lung / Breathing Problem': 'Pulmonology',
  'Headache': 'General Medicine',
  'Brain / Nerve Problem': 'Neurology',
  'Pregnancy': 'Obstetrics & Gynecology',
  "Women's Health": 'Gynecology',
  'Child Health': 'Pediatrics',
  'Mental Health': 'Psychiatry',
  'Diabetes': 'Diabetology',
  'Thyroid Problem': 'Endocrinology',
  'Blood Problem': 'Hematology',
  'Emergency': 'Emergency Medicine',
  'General Health': 'General Medicine'
};

export const diseaseCategories = [
  {
    category: 'General & Preventive',
    icon: 'Activity',
    items: ['Fever', 'Cold', 'Cough', 'Fever & Body Ache', 'Headache', 'General Health']
  },
  {
    category: 'Heart & Lungs',
    icon: 'Heart',
    items: ['Heart Problem', 'Chest Pain', 'High Blood Pressure / Palpitations', 'Lung / Breathing Problem', 'Severe Cough & Breathing Issue']
  },
  {
    category: 'Bones & Joints',
    icon: 'Bone',
    items: ['Bone Problem', 'Joint Pain', 'Back Pain']
  },
  {
    category: 'Skin, Eye & ENT',
    icon: 'Eye',
    items: ['Skin Problem', 'Skin Allergy', 'Acne / Hair Fall / Eczema', 'Eye Problem', 'Eye Redness & Vision Blur', 'Ear Problem', 'Throat Problem', 'Dental Problem']
  },
  {
    category: "Women & Child Care",
    icon: 'Users',
    items: ['Pregnancy', "Women's Health", 'Child Health']
  },
  {
    category: 'Digestive & Kidney',
    icon: 'Shield',
    items: ['Stomach Problem', 'Liver Problem', 'Kidney Problem', 'Urinary Problem']
  },
  {
    category: 'Specialized & Emergency',
    icon: 'AlertTriangle',
    items: ['Brain / Nerve Problem', 'Mental Health', 'Diabetes', 'Thyroid Problem', 'Cancer', 'Emergency']
  }
];

export const specialtyDetails = {
  'General Medicine': {
    description: 'Diagnoses and treats adult acute illnesses, viral infections, general malaise, and non-surgical conditions.',
    commonConditions: ['Viral Fever', 'Body Pain', 'Seasonal Flu', 'Mild Infections'],
    urgency: 'Normal'
  },
  'Cardiology': {
    description: 'Comprehensive heart care, hypertension management, ECG, echocardiograms, and cardiac emergencies.',
    commonConditions: ['Chest Pain', 'High BP', 'Arrhythmia', 'Heart Blockage'],
    urgency: 'High'
  },
  'Dermatology': {
    description: 'Specialized skin, hair, and nail health, addressing rashes, infections, eczema, and allergies.',
    commonConditions: ['Skin Rash', 'Fungal Infection', 'Psoriasis', 'Acne'],
    urgency: 'Normal'
  },
  'Ophthalmology': {
    description: 'Eye examinations, vision corrections, cataract evaluations, and acute ocular treatment.',
    commonConditions: ['Vision Blur', 'Eye Redness', 'Cataract', 'Eye Strain'],
    urgency: 'Normal'
  },
  'ENT': {
    description: 'Ear, nose, and throat evaluations, sinusitis, hearing loss, and tonsillitis care.',
    commonConditions: ['Ear Infection', 'Sinusitis', 'Tonsils', 'Vertigo'],
    urgency: 'Normal'
  },
  'Orthopedics': {
    description: 'Bone, joint, ligament, and spine diagnostics, fracture management, and joint arthritis care.',
    commonConditions: ['Knee Pain', 'Bone Fracture', 'Lumbar Strain', 'Arthritis'],
    urgency: 'Normal'
  },
  'Pediatrics': {
    description: 'Dedicated healthcare, vaccinations, fever management, and growth monitoring for infants and children.',
    commonConditions: ['Childhood Fever', 'Vaccination', 'Pediatric Asthma', 'Growth Check'],
    urgency: 'High'
  },
  'Obstetrics & Gynecology': {
    description: "Women's reproductive health, prenatal checkups, maternity care, and hormonal health.",
    commonConditions: ['Antenatal Care', 'PCOD / PCOS', 'Maternity Checkup', 'Pelvic Pain'],
    urgency: 'Normal'
  },
  'Neurology': {
    description: 'Brain, spinal cord, nerve disorder diagnostics, migraine therapy, and neurological consultations.',
    commonConditions: ['Migraine', 'Nerve Pain', 'Seizures', 'Vertigo'],
    urgency: 'High'
  },
  'Gastroenterology': {
    description: 'Digestive system, stomach ulcers, liver health, and gastrointestinal diagnostics.',
    commonConditions: ['GERD / Acidity', 'Jaundice', 'Stomach Ulcers', 'IBS'],
    urgency: 'Normal'
  },
  'Emergency Medicine': {
    description: 'Immediate 24/7 medical response for critical trauma, severe injuries, and acute emergencies.',
    commonConditions: ['Accidents', 'Severe Breathing Distress', 'Sudden Collapse'],
    urgency: 'Emergency'
  }
};
