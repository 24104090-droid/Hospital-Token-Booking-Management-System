export const healthProblems = [
  {
    id: 'p1',
    name: 'Fever & Chills',
    tamil: 'காய்ச்சல் & குளிர்',
    category: 'General Medicine',
    specialty: 'General Medicine',
    icon: 'Thermometer',
    severity: 'normal',
    description: 'High temperature, body aches, shivering, viral infection symptoms',
    commonSymptoms: ['High temperature', 'Body ache', 'Fatigue', 'Sweating', 'Headache']
  },
  {
    id: 'p2',
    name: 'Cold, Flu & Cough',
    tamil: 'இருமல் & சளி',
    category: 'Respiratory',
    specialty: 'General Medicine',
    icon: 'Wind',
    severity: 'normal',
    description: 'Runny nose, persistent coughing, sore throat, sneezing',
    commonSymptoms: ['Dry or wet cough', 'Sore throat', 'Runny nose', 'Congestion']
  },
  {
    id: 'p3',
    name: 'Breathing Difficulty & Asthma',
    tamil: 'சுவாசக் கோளாறு & ஆஸ்துமா',
    category: 'Respiratory',
    specialty: 'Pulmonology',
    icon: 'Activity',
    severity: 'priority',
    description: 'Wheezing, shortness of breath, chest tightness, allergic bronchitis',
    commonSymptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness', 'Night cough']
  },
  {
    id: 'p4',
    name: 'Chest Pain & Heart Issues',
    tamil: 'நெஞ்சு வலி & இதய பிரச்சனை',
    category: 'Cardiac',
    specialty: 'Cardiology',
    icon: 'Heart',
    severity: 'emergency',
    description: 'Acute chest pain, palpitation, angina, left arm numbness',
    commonSymptoms: ['Chest pressure', 'Palpitations', 'Sweating', 'Shortness of breath']
  },
  {
    id: 'p5',
    name: 'High Blood Pressure (BP)',
    tamil: 'உயர் இரத்த அழுத்தம்',
    category: 'Cardiac',
    specialty: 'Cardiology',
    icon: 'HeartPulse',
    severity: 'priority',
    description: 'Dizziness, severe headache, blurred vision, abnormal BP readings',
    commonSymptoms: ['Dizziness', 'Morning headache', 'Blurred vision', 'Pounding heart']
  },
  {
    id: 'p6',
    name: 'Diabetes & Blood Sugar',
    tamil: 'சர்க்கரை நோய் / நீரிழிவு',
    category: 'Metabolic',
    specialty: 'General Medicine',
    icon: 'Droplet',
    severity: 'normal',
    description: 'Frequent urination, excessive thirst, sudden weight loss, fatigue',
    commonSymptoms: ['Excessive thirst', 'Frequent urination', 'Slow healing cuts', 'Fatigue']
  },
  {
    id: 'p7',
    name: 'Bone Fracture & Joint Pain',
    tamil: 'எலும்பு முறிவு & மூட்டு வலி',
    category: 'Orthopedics',
    specialty: 'Orthopedics',
    icon: 'Bone',
    severity: 'priority',
    description: 'Knee arthritis, hip pain, sports injury, back sprain, fractures',
    commonSymptoms: ['Joint swelling', 'Stiffness', 'Inability to bear weight', 'Sharp back pain']
  },
  {
    id: 'p8',
    name: 'Eye Irritation & Cataract',
    tamil: 'கண் பார்வை பிரச்சனை & கண்புரை',
    category: 'Ophthalmology',
    specialty: 'Ophthalmology',
    icon: 'Eye',
    severity: 'normal',
    description: 'Blurry eyesight, red eye, watering, cataract evaluation, eye pain',
    commonSymptoms: ['Blurry vision', 'Double vision', 'Redness/itchiness', 'Light sensitivity']
  },
  {
    id: 'p9',
    name: 'Ear, Nose & Throat (ENT)',
    tamil: 'காது, மூக்கு & தொண்டை',
    category: 'ENT',
    specialty: 'ENT',
    icon: 'Ear',
    severity: 'normal',
    description: 'Ear pain/discharge, sinus congestion, tonsillitis, hearing loss',
    commonSymptoms: ['Earache', 'Sinus pressure', 'Swallowing pain', 'Ringing in ears']
  },
  {
    id: 'p10',
    name: 'Skin Rash, Allergy & Acne',
    tamil: 'தோல் பிரச்சனை & ஒவ்வாமை',
    category: 'Dermatology',
    specialty: 'Dermatology',
    icon: 'Sparkles',
    severity: 'normal',
    description: 'Eczema, psoriasis, fungal infection, urticaria, severe acne',
    commonSymptoms: ['Itching', 'Red patches', 'Blisters', 'Flaking skin']
  },
  {
    id: 'p11',
    name: "Women's Health & Pregnancy",
    tamil: 'மகப்பேறு & பெண்கள் நலம்',
    category: 'Gynecology',
    specialty: 'Obstetrics & Gynecology',
    icon: 'Baby',
    severity: 'normal',
    description: 'Prenatal care, irregular cycles, pelvic pain, maternity checkups',
    commonSymptoms: ['Menstrual cramps', 'Morning sickness', 'Pelvic pain', 'Hormonal imbalance']
  },
  {
    id: 'p12',
    name: "Child & Infant Health",
    tamil: 'குழந்தைகள் நலம் & தடுப்பூசி',
    category: 'Pediatrics',
    specialty: 'Pediatrics',
    icon: 'Smile',
    severity: 'priority',
    description: 'Child vaccination, pediatric fever, tummy ache, growth consultation',
    commonSymptoms: ['Child crying/fussiness', 'Poor feeding', 'High fever', 'Vomiting']
  },
  {
    id: 'p13',
    name: 'Digestive & Stomach Pain',
    tamil: 'வயிற்று வலி & செரிமானக் கோளாறு',
    category: 'Gastroenterology',
    specialty: 'Gastroenterology',
    icon: 'Layers',
    severity: 'normal',
    description: 'Acidity, gastritis, bloating, diarrhea, severe abdominal cramps',
    commonSymptoms: ['Abdominal cramps', 'Heartburn', 'Nausea/vomiting', 'Indigestion']
  },
  {
    id: 'p14',
    name: 'Kidney Stones & Urinary Issues',
    tamil: 'சிறுநீரகக் கல் & சிறுநீர் கோளாறு',
    category: 'Nephrology & Urology',
    specialty: 'Urology',
    icon: 'Shield',
    severity: 'priority',
    description: 'Flank pain, painful urination, blood in urine, renal stones',
    commonSymptoms: ['Sharp flank pain', 'Burning sensation', 'Cloudy urine', 'Frequent urge']
  },
  {
    id: 'p15',
    name: 'Headache, Migraine & Nerves',
    tamil: 'தலைவலி, மைக்ரேன் & நரம்பு பிரச்சனை',
    category: 'Neurology',
    specialty: 'Neurology',
    icon: 'Zap',
    severity: 'normal',
    description: 'Severe throbbing migraine, tremors, tingling sensations, numbness',
    commonSymptoms: ['Throbbing headache', 'Nausea with light', 'Tingling fingers', 'Dizziness']
  },
  {
    id: 'p16',
    name: 'Severe Accident & Trauma',
    tamil: 'விபத்து & அவசர சிகிச்சை',
    category: 'Emergency',
    specialty: 'Emergency Medicine',
    icon: 'AlertTriangle',
    severity: 'emergency',
    description: 'Road traffic accidents, heavy bleeding, loss of consciousness, burns',
    commonSymptoms: ['Heavy bleeding', 'Unconsciousness', 'Multiple injuries', 'Severe pain']
  }
];

export const problemSpecialtyMap = healthProblems.reduce((acc, p) => {
  acc[p.name] = p.specialty;
  return acc;
}, {
  'Fever': 'General Medicine',
  'Cold': 'General Medicine',
  'Cough': 'General Medicine',
  'Skin Problem': 'Dermatology',
  'Skin Allergy': 'Dermatology',
  'Skin Rash': 'Dermatology',
  'Allergy': 'Dermatology',
  'Skin allegy': 'Dermatology',
  'Eye Problem': 'Ophthalmology',
  'Ear Problem': 'ENT',
  'Nose Problem': 'ENT',
  'Throat Problem': 'ENT',
  'Dental Problem': 'Dentistry',
  'Heart Problem': 'Cardiology',
  'Chest Pain': 'Cardiology',
  'Cartilogy': 'Cardiology',
  'Cartiology': 'Cardiology',
  'Cancer': 'Oncology',
  'Bone Problem': 'Orthopedics',
  'Joint Pain': 'Orthopedics',
  'Back Pain': 'Orthopedics',
  'Kidney Problem': 'Nephrology',
  'Urinary Problem': 'Urology',
  'Stomach Problem': 'Gastroenterology',
  'Liver Problem': 'Gastroenterology',
  'Lung / Breathing Problem': 'Pulmonology',
  'Headache': 'Neurology',
  'Brain / Nerve Problem': 'Neurology',
  'Pregnancy': 'Obstetrics & Gynecology',
  "Women's Health": 'Obstetrics & Gynecology',
  'Child Health': 'Pediatrics',
  'Mental Health': 'Psychiatry',
  'Diabetes': 'General Medicine',
  'Thyroid Problem': 'General Medicine',
  'Blood Problem': 'General Medicine',
  'Emergency': 'Emergency Medicine',
  'General Health': 'General Medicine'
});

export const getSpecialtyForProblem = (problemName) => {
  if (!problemName) return 'General Medicine';
  const query = problemName.toLowerCase().trim();

  // 1. Direct match in healthProblems by name, id, specialty, or tamil
  const found = healthProblems.find(
    p => p.name.toLowerCase() === query ||
         p.id.toLowerCase() === query ||
         p.specialty.toLowerCase() === query ||
         p.tamil.toLowerCase().includes(query)
  );
  if (found) return found.specialty;

  // 2. Case-insensitive matching in problemSpecialtyMap
  for (const [key, spec] of Object.entries(problemSpecialtyMap)) {
    if (key.toLowerCase() === query || query.includes(key.toLowerCase()) || key.toLowerCase().includes(query)) {
      return spec;
    }
  }

  // 3. Keyword / symptom fuzzy detection (including user typos like 'cartilogy', 'allegy')
  if (query.includes('skin') || query.includes('allegy') || query.includes('allergy') || query.includes('alerg') || query.includes('acne') || query.includes('rash') || query.includes('dermat') || query.includes('தோல்') || query.includes('அரிப்பு') || query.includes('ஒவ்வாமை')) {
    return 'Dermatology';
  }
  if (query.includes('chest') || query.includes('heart') || query.includes('cardio') || query.includes('cartilo') || query.includes('cartio') || query.includes('மாரடைப்பு') || query.includes('நெஞ்சு')) {
    return 'Cardiology';
  }
  if (query.includes('eye') || query.includes('vision') || query.includes('cataract') || query.includes('ophthal') || query.includes('கண்')) {
    return 'Ophthalmology';
  }
  if (query.includes('ear') || query.includes('nose') || query.includes('throat') || query.includes('ent') || query.includes('காது') || query.includes('தொண்டை')) {
    return 'ENT';
  }
  if (query.includes('bone') || query.includes('fracture') || query.includes('joint') || query.includes('knee') || query.includes('ortho') || query.includes('spine') || query.includes('back pain') || query.includes('எலும்பு') || query.includes('மூட்டு')) {
    return 'Orthopedics';
  }
  if (query.includes('pregnan') || query.includes('maternity') || query.includes('women') || query.includes('gynae') || query.includes('obstet') || query.includes('கர்ப்பம்') || query.includes('மகப்பேறு')) {
    return 'Obstetrics & Gynecology';
  }
  if (query.includes('child') || query.includes('infant') || query.includes('pediatric') || query.includes('baby') || query.includes('குழந்தை') || query.includes('தடுப்பூசி')) {
    return 'Pediatrics';
  }
  if (query.includes('stomach') || query.includes('digest') || query.includes('acidity') || query.includes('gastro') || query.includes('liver') || query.includes('abdominal') || query.includes('வயிறு')) {
    return 'Gastroenterology';
  }
  if (query.includes('kidney') || query.includes('urine') || query.includes('urolog') || query.includes('renal') || query.includes('stone') || query.includes('சிறுநீரக')) {
    return 'Urology';
  }
  if (query.includes('headache') || query.includes('migraine') || query.includes('neuro') || query.includes('brain') || query.includes('nerve') || query.includes('தலைவலி') || query.includes('நரம்பு')) {
    return 'Neurology';
  }
  if (query.includes('breath') || query.includes('asthma') || query.includes('lung') || query.includes('pulmon') || query.includes('சுவாச')) {
    return 'Pulmonology';
  }
  if (query.includes('dental') || query.includes('tooth') || query.includes('teeth') || query.includes('dentist') || query.includes('பல்')) {
    return 'Dentistry';
  }
  if (query.includes('fever') || query.includes('cold') || query.includes('cough') || query.includes('flu') || query.includes('viral') || query.includes('infection') || query.includes('காய்ச்சல்') || query.includes('சளி')) {
    return 'General Medicine';
  }

  return 'General Medicine';
};

export const getCategories = () => {
  const categories = new Set(healthProblems.map(p => p.category));
  return Array.from(categories);
};

export const searchProblems = (query) => {
  if (!query) return healthProblems;
  const q = query.toLowerCase().trim();
  
  // Direct match first
  const directMatches = healthProblems.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.tamil.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.specialty.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.commonSymptoms.some(s => s.toLowerCase().includes(q))
  );
  if (directMatches.length > 0) return directMatches;

  // Word-tokenized match for natural language Tamil & English sentences
  const stopWords = new Set([
    'எனக்கு', 'உங்களுக்கு', 'இருக்கிறது', 'இருக்கு', 'இருக்குது', 'உள்ளது', 
    'அதிகமாக', 'கடுமையான', 'நான்', 'ரொம்ப', 'ஒரு', 'வேண்டும்', 'டாக்டர்',
    'i', 'have', 'severe', 'acute', 'very', 'a', 'an', 'the', 'is', 'in', 'and', 'with', 'for', 'my', 'problem', 'issues', 'pain'
  ]);
  const tokens = q.split(/[\s,;.?!]+/).filter(w => w.length > 1 && !stopWords.has(w));
  
  if (tokens.length === 0) return [];

  // Score each problem based on matching tokens
  const scored = healthProblems.map(p => {
    let score = 0;
    const pTamil = p.tamil.toLowerCase();
    const pName = p.name.toLowerCase();
    const pDesc = p.description.toLowerCase();
    const pSymptoms = p.commonSymptoms.map(s => s.toLowerCase()).join(' ');

    tokens.forEach(token => {
      if (pTamil.includes(token)) score += 3;
      if (pName.includes(token)) score += 3;
      if (pSymptoms.includes(token)) score += 2;
      if (pDesc.includes(token)) score += 1;
    });

    return { problem: p, score };
  }).filter(item => item.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.map(item => item.problem);
};
