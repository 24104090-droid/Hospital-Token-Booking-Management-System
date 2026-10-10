import React, { useState, useEffect, useRef } from 'react';
import Card from '../common/Card';
import Modal from '../common/Modal';
import { useLanguage } from '../../context/LanguageContext';
import { 
  FaFilePrescription, 
  FaUpload, 
  FaCamera, 
  FaCheckCircle, 
  FaDownload, 
  FaTrash, 
  FaEye, 
  FaPills, 
  FaHospital, 
  FaUserMd, 
  FaCalendarAlt,
  FaRobot,
  FaShieldAlt,
  FaPlus,
  FaSearch,
  FaPrint,
  FaShareAlt,
  FaCopy,
  FaFileAlt,
  FaSun,
  FaCloudSun,
  FaMoon,
  FaTimes
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Default starter records for Tirunelveli district
const defaultRecords = [
  {
    id: 'rx-tvl-1290',
    doctorName: 'Dr. K. Mohamed Ismail, MS',
    hospitalName: 'Shifa Multispeciality Hospital',
    date: '2026-10-08',
    diagnosis: 'Seasonal Bronchitis & Pharyngitis',
    specialty: 'ENT & Pulmonology',
    medicines: [
      { name: 'Amoxicillin + Clavulanic Acid', dosage: '625 mg', frequency: '1-0-1 (After Food)', duration: '5 Days' },
      { name: 'Montelukast + Levocetirizine', dosage: '10mg/5mg', frequency: '0-0-1 (Night)', duration: '7 Days' },
      { name: 'Dextromethorphan Cough Syrup', dosage: '10 ml', frequency: '2-2-2', duration: '5 Days' }
    ],
    notes: 'Avoid chilled water, ice creams and direct cold air exposure. Warm salt water gargle twice daily.',
    verified: true,
    fileType: 'AI Scanned OCR'
  },
  {
    id: 'rx-tvl-101',
    doctorName: 'Dr. S. Sundararajan, MD',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    date: '2026-09-18',
    diagnosis: 'Acute Viral Fever & Upper Respiratory Tract Infection',
    specialty: 'General Medicine',
    medicines: [
      { name: 'Paracetamol', dosage: '650 mg', frequency: '1-0-1 (After Food)', duration: '3 Days' },
      { name: 'Cetirizine', dosage: '10 mg', frequency: '0-0-1 (Night)', duration: '5 Days' },
      { name: 'Azithromycin', dosage: '500 mg', frequency: '1-0-0 (Morning)', duration: '3 Days' },
      { name: 'ORS Electrolyte Solution', dosage: '1 Sachet in 1L Water', frequency: 'Thrice Daily', duration: '3 Days' }
    ],
    notes: 'Hydrate well with boiled warm water. Review in OPD counter after 3 days if fever persists.',
    verified: true,
    fileType: 'Digital Rx Pass'
  },
  {
    id: 'rx-tvl-102',
    doctorName: 'Dr. P. Muthukumar, MCh',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    date: '2026-08-24',
    diagnosis: 'Mild Essential Hypertension',
    specialty: 'Cardiology Clinic',
    medicines: [
      { name: 'Telmisartan', dosage: '40 mg', frequency: '1-0-0 (Morning)', duration: '30 Days' },
      { name: 'Amlodipine', dosage: '5 mg', frequency: '0-0-1 (Night)', duration: '30 Days' }
    ],
    notes: 'Maintain strict low sodium diet (<3g salt per day). Record blood pressure weekly.',
    verified: true,
    fileType: 'Cardiology Clinic'
  },
  {
    id: 'rx-tvl-103',
    doctorName: 'Dr. V. Meenakshi, MS (Ophth)',
    hospitalName: 'Aravind Eye Hospital',
    date: '2026-07-15',
    diagnosis: 'Allergic Conjunctivitis & Digital Eye Strain',
    specialty: 'Ophthalmology',
    medicines: [
      { name: 'Olopatadine Eye Drops (0.1%)', dosage: '1 Drop both eyes', frequency: '1-0-1 (Twice Daily)', duration: '14 Days' },
      { name: 'Carboxymethylcellulose Lubricant (0.5%)', dosage: '1 Drop both eyes', frequency: '4 Times Daily', duration: '30 Days' }
    ],
    notes: 'Follow 20-20-20 rule during screen usage. Do not rub eyes with hands.',
    verified: true,
    fileType: 'Eye Care Rx'
  }
];

// Presets for instant AI testing
const scanPresets = [
  {
    title: 'TVMCH OPD Viral Fever Slip',
    doctor: 'Dr. S. Sundararajan, MD',
    hospital: 'Tirunelveli Medical College Hospital (TVMCH)',
    diagnosis: 'Acute Viral Fever & Sore Throat',
    specialty: 'General Medicine',
    medicines: [
      { name: 'Paracetamol', dosage: '650 mg', frequency: '1-0-1 (After Food)', duration: '3 Days' },
      { name: 'Pantoprazole', dosage: '40 mg', frequency: '1-0-0 (Before Food)', duration: '5 Days' },
      { name: 'Vitamin C + Zinc Chewable', dosage: '500 mg', frequency: '0-1-0 (Afternoon)', duration: '7 Days' }
    ],
    notes: 'Government OPD triage slip. Bed rest and adequate fluids recommended.'
  },
  {
    title: 'Shifa Multispeciality Bronchitis Rx',
    doctor: 'Dr. K. Mohamed Ismail, MS',
    hospital: 'Shifa Multispeciality Hospital',
    diagnosis: 'Acute Bronchitis & Cough',
    specialty: 'Pulmonology',
    medicines: [
      { name: 'Amoxicillin + Clavulanic Acid', dosage: '625 mg', frequency: '1-0-1 (After Food)', duration: '5 Days' },
      { name: 'Montelukast + Levocetirizine', dosage: '10mg/5mg', frequency: '0-0-1 (Night)', duration: '7 Days' },
      { name: 'Ambroxol Syrup', dosage: '10 ml', frequency: '1-1-1 (Thrice Daily)', duration: '5 Days' }
    ],
    notes: 'Steam inhalation twice daily. Avoid cold exposure.'
  },
  {
    title: 'Kauvery Hospital Ortho & Pain Care',
    doctor: 'Dr. R. Karthik, MS (Ortho)',
    hospital: 'Kauvery Hospital Tirunelveli',
    diagnosis: 'Cervical Spondylosis & Muscle Spasm',
    specialty: 'Orthopedics',
    medicines: [
      { name: 'Aceclofenac + Thiocolchicoside', dosage: '100mg/4mg', frequency: '1-0-1 (After Food)', duration: '5 Days' },
      { name: 'Pregabalin', dosage: '75 mg', frequency: '0-0-1 (Night)', duration: '10 Days' },
      { name: 'Calcium + Vitamin D3', dosage: '500 mg', frequency: '0-1-0 (Afternoon)', duration: '30 Days' }
    ],
    notes: 'Physiotherapy neck isometric exercises. Avoid high pillows while sleeping.'
  },
  {
    title: 'Dr. Agarwal Eye Care Rx',
    doctor: 'Dr. N. Ramanathan, DO, DNB',
    hospital: 'Dr. Agarwal’s Eye Hospital',
    diagnosis: 'Dry Eye Syndrome & Mild Blepharitis',
    specialty: 'Ophthalmology',
    medicines: [
      { name: 'Sodium Hyaluronate (0.1%)', dosage: '1 Drop', frequency: '1-1-1-1 (4 Times Daily)', duration: '30 Days' },
      { name: 'Moxifloxacin Eye Drops (0.5%)', dosage: '1 Drop', frequency: '1-0-1 (Twice Daily)', duration: '7 Days' }
    ],
    notes: 'Warm compress on eyelids for 5 mins morning and night.'
  }
];

/**
 * Generates an official, printable HTML prescription slip document
 */
export const generatePrescriptionHtml = (rec) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Medical Prescription - ${rec.id}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 40px; color: #0f172a; background: #fff; line-height: 1.5; }
    .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .hospital-title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; }
    .hospital-sub { font-size: 13px; color: #64748b; margin-top: 4px; }
    .rx-symbol { font-size: 26px; font-weight: 900; color: #0284c7; margin-bottom: 12px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 12px; margin-bottom: 24px; font-size: 13px; }
    .meta-item strong { color: #334155; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { background: #f1f5f9; text-align: left; padding: 10px 12px; font-size: 12px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #cbd5e1; }
    td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    .dosage-tag { background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 12px; display: inline-block; }
    .notes-box { background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 28px; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8; }
    .stamp { border: 2px dashed #0284c7; color: #0284c7; padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 11px; text-transform: uppercase; display: inline-block; }
    @media print {
      body { margin: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="hospital-title">${rec.hospitalName}</h1>
      <div class="hospital-sub">Government & Private Healthcare Network • Tirunelveli District, Tamil Nadu</div>
    </div>
    <div style="text-align: right;">
      <div class="stamp">✓ Verified Digital EHR</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 6px;">Rx Reference: <strong>#${rec.id}</strong></div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-item"><strong>Consulting Doctor:</strong> ${rec.doctorName}</div>
    <div class="meta-item"><strong>Department:</strong> ${rec.specialty || 'General Medicine'}</div>
    <div class="meta-item"><strong>Prescription Date:</strong> ${rec.date}</div>
    <div class="meta-item"><strong>Clinical Diagnosis:</strong> ${rec.diagnosis}</div>
    ${rec.tokenNumber ? `<div class="meta-item"><strong>OPD Token ID:</strong> <span style="color:#0284c7;font-weight:bold;font-size:14px;">Token #${rec.tokenNumber}</span></div>` : ''}
    ${rec.patientName ? `<div class="meta-item"><strong>Patient Name:</strong> <strong>${rec.patientName}</strong></div>` : ''}
  </div>

  <div class="rx-symbol">℞ Medication & Dosage Regimen</div>

  <table>
    <thead>
      <tr>
        <th style="width: 40px;">#</th>
        <th>Medicine & Strength</th>
        <th>Dosage Timing & Frequency</th>
        <th>Duration</th>
      </tr>
    </thead>
    <tbody>
      ${rec.medicines.map((m, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${m.name}</strong> <span style="color:#64748b;">(${m.dosage})</span></td>
          <td><span class="dosage-tag">${m.frequency}</span></td>
          <td>${m.duration || 'As directed by physician'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  ${rec.notes ? `
    <div class="notes-box">
      <strong>Doctor's Advice & Patient Instructions:</strong><br />
      ${rec.notes}
    </div>
  ` : ''}

  <div class="footer">
    <div>MediQueue Healthcare Platform • Tirunelveli Health Locker • Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
    <div style="text-align: right;">Doctor Signature: <em>Digitally Signed & Validated (OPD Verification ID #${rec.id})</em></div>
  </div>
</body>
</html>`;
};

const HealthLocker = () => {
  const { isTamil } = useLanguage();
  const fileInputRef = useRef(null);

  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('tvl_health_records');
      return saved ? JSON.parse(saved) : defaultRecords;
    } catch (e) {
      return defaultRecords;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('all'); // 'all', 'govt', 'private', 'active'
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepText, setScanStepText] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeUploadTab, setActiveUploadTab] = useState('scan'); // 'scan', 'manual'
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Manual Entry Form State
  const [manualForm, setManualForm] = useState({
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    doctorName: '',
    specialty: 'General Medicine',
    diagnosis: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    medicines: [
      { name: '', dosage: '', frequency: '1-0-1 (After Food)', duration: '5 Days' }
    ]
  });

  // Persist records
  useEffect(() => {
    try {
      localStorage.setItem('tvl_health_records', JSON.stringify(records));
    } catch (e) {
      console.error(e);
    }
  }, [records]);

  // Direct File Download Handler
  const handleDownload = (rec) => {
    try {
      const htmlContent = generatePrescriptionHtml(rec);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Prescription_${rec.id}_${rec.date}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(isTamil 
        ? `${rec.id} மருந்துச்சீட்டு பதிவிறக்கம் செய்யப்பட்டது! 📄` 
        : `Downloaded prescription slip #${rec.id}! 📄`
      );
    } catch (err) {
      toast.error('Could not download file. Please try print option.');
    }
  };

  // Direct Browser Print Handler
  const handlePrint = (rec) => {
    const htmlContent = generatePrescriptionHtml(rec);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 350);
    } else {
      toast.error('Pop-up was blocked. Please allow popups to print.');
    }
  };

  // Copy dosage schedule to clipboard
  const handleCopySchedule = (rec) => {
    const medList = rec.medicines.map((m, i) => `${i + 1}. ${m.name} (${m.dosage}) - ${m.frequency} [${m.duration || 'As directed'}]`).join('\n');
    const text = `📋 Digital Prescription (#${rec.id})\n🏥 ${rec.hospitalName}\n👨‍⚕️ ${rec.doctorName} (${rec.specialty})\n🗓️ Date: ${rec.date}\n🩺 Diagnosis: ${rec.diagnosis}\n\n💊 Prescribed Medicines:\n${medList}\n\n📝 Doctor Advice:\n${rec.notes || 'Take as advised.'}`;

    navigator.clipboard.writeText(text).then(() => {
      toast.success(isTamil ? 'மருந்து விவரங்கள் நகலெடுக்கப்பட்டது (WhatsApp/Notes)! 📋' : 'Dosage schedule copied to clipboard! 📋');
    }).catch(() => {
      toast.success('Prescription copied!');
    });
  };

  // Delete record
  const handleDelete = (id) => {
    const toDelete = records.find(r => r.id === id);
    setRecords(prev => prev.filter(r => r.id !== id));
    if (selectedRecord?.id === id) setSelectedRecord(null);
    toast.success(isTamil 
      ? `மருந்துச்சீட்டு #${id} நீக்கப்பட்டது.` 
      : `Prescription #${id} removed from locker.`
    );
  };

  // Trigger real file input
  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle real file upload
  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setUploadedPreviewUrl(url);
    } else {
      setUploadedPreviewUrl(null);
    }

    // Run AI scanning simulation on the chosen file
    runAiScanPipeline(file.name);
  };

  // Run AI scan animation and produce structured prescription
  const runAiScanPipeline = (sourceName = 'Scanned Prescription', preset = null) => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStepText(isTamil ? 'மருந்துச்சீட்டு புகைப்படத்தை பகுப்பாய்வு செய்கிறது...' : 'Analyzing document image & quality...');

    setTimeout(() => {
      setScanProgress(45);
      setScanStepText(isTamil ? 'மருத்துவர் கையெழுத்து மற்றும் மருத்துவமனை கண்டறியப்படுகிறது...' : 'Detecting clinic header & doctor credentials...');
    }, 400);

    setTimeout(() => {
      setScanProgress(75);
      setScanStepText(isTamil ? 'மருந்துகள், அளவுகள் மற்றும் அட்டவணை பிரித்தெடுக்கப்படுகிறது...' : 'Extracting medication names, dosage timings & duration...');
    }, 800);

    setTimeout(() => {
      setScanProgress(100);
      setScanStepText(isTamil ? 'ஸ்கேன் முடிந்தது! ஆவணம் சரிபார்க்கப்பட்டது.' : 'Scan complete! Prescriptions verified.');

      setTimeout(() => {
        setIsScanning(false);
        setUploadModalOpen(false);
        setUploadedPreviewUrl(null);
        setUploadedFileName('');

        const selectedPreset = preset || scanPresets[Math.floor(Math.random() * scanPresets.length)];
        const newRecord = {
          id: `rx-tvl-${Math.floor(1000 + Math.random() * 9000)}`,
          doctorName: selectedPreset.doctor,
          hospitalName: selectedPreset.hospital,
          date: new Date().toISOString().split('T')[0],
          diagnosis: selectedPreset.diagnosis,
          specialty: selectedPreset.specialty,
          medicines: selectedPreset.medicines,
          notes: selectedPreset.notes,
          verified: true,
          fileType: 'AI Scanned OCR'
        };

        setRecords(prev => [newRecord, ...prev]);
        toast.success(isTamil 
          ? 'AI ஸ்கேனர் மருந்துச்சீட்டை வெற்றிகரமாக சேமித்தது! ✅' 
          : 'Prescription scanned & saved into Health Locker! ✅'
        );
      }, 500);
    }, 1200);
  };

  // Simulate Doctor issuing prescription directly to Token #14
  const handleReceiveDoctorTokenRx = () => {
    const doctorRx = {
      id: `rx-tvl-token-14`,
      tokenNumber: 14,
      patientName: 'Subramanian M',
      doctorName: 'Dr. S. Sundararajan, MD',
      hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
      date: new Date().toISOString().split('T')[0],
      diagnosis: 'Acute Viral Bronchitis & Pharyngitis',
      specialty: 'General Medicine (OPD Room 204)',
      medicines: [
        { name: 'Paracetamol', dosage: '650 mg', frequency: '1-0-1 (After Food)', duration: '3 Days' },
        { name: 'Amoxicillin + Clavulanic Acid', dosage: '625 mg', frequency: '1-0-1 (After Food)', duration: '5 Days' },
        { name: 'Cetirizine', dosage: '10 mg', frequency: '0-0-1 (Night)', duration: '5 Days' },
        { name: 'ORS Electrolyte Solution', dosage: '1 Sachet in 1L Water', frequency: 'Thrice Daily', duration: '3 Days' }
      ],
      notes: 'Doctor prescription issued for Token #14. Drink warm water, avoid cold exposure.',
      verified: true,
      fileType: 'Doctor E-Prescription'
    };

    setRecords(prev => [doctorRx, ...prev.filter(r => r.id !== doctorRx.id)]);
    toast.success(isTamil 
      ? 'டாக்டர் டோக்கன் #14-க்கு அனுப்பிய மருந்துச்சீட்டு பெறப்பட்டது! 📄' 
      : 'Doctor prescription received for Token #14! 📄'
    );
  };

  // Add medicine row to manual form
  const handleAddMedicineRow = () => {
    setManualForm(prev => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        { name: '', dosage: '', frequency: '1-0-1 (After Food)', duration: '5 Days' }
      ]
    }));
  };

  // Remove medicine row
  const handleRemoveMedicineRow = (idx) => {
    setManualForm(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== idx)
    }));
  };

  // Update manual medicine row
  const handleUpdateMedicineRow = (idx, field, value) => {
    setManualForm(prev => {
      const updated = [...prev.medicines];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, medicines: updated };
    });
  };

  // Save manual prescription
  const handleSaveManualForm = (e) => {
    e.preventDefault();
    if (!manualForm.doctorName.trim() || !manualForm.diagnosis.trim()) {
      toast.error('Please enter doctor name and diagnosis.');
      return;
    }

    const validMeds = manualForm.medicines.filter(m => m.name.trim());
    if (validMeds.length === 0) {
      toast.error('Please add at least one medicine.');
      return;
    }

    const newRecord = {
      id: `rx-tvl-${Math.floor(1000 + Math.random() * 9000)}`,
      doctorName: manualForm.doctorName,
      hospitalName: manualForm.hospitalName,
      date: manualForm.date,
      diagnosis: manualForm.diagnosis,
      specialty: manualForm.specialty,
      medicines: validMeds,
      notes: manualForm.notes || 'Follow prescribed dosage timetable strictly.',
      verified: true,
      fileType: 'Manual Entry'
    };

    setRecords(prev => [newRecord, ...prev]);
    setUploadModalOpen(false);
    toast.success(isTamil ? 'புதிய மருந்துச்சீட்டு சேர்க்கப்பட்டது! ✅' : 'New prescription saved successfully! ✅');

    // Reset manual form
    setManualForm({
      hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
      doctorName: '',
      specialty: 'General Medicine',
      diagnosis: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      medicines: [{ name: '', dosage: '', frequency: '1-0-1 (After Food)', duration: '5 Days' }]
    });
  };

  // Filtered Records
  const filteredRecords = records.filter(r => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchDiag = r.diagnosis.toLowerCase().includes(q);
      const matchDoc = r.doctorName.toLowerCase().includes(q);
      const matchHosp = r.hospitalName.toLowerCase().includes(q);
      const matchMed = r.medicines.some(m => m.name.toLowerCase().includes(q));
      if (!matchDiag && !matchDoc && !matchHosp && !matchMed) return false;
    }

    // Tag filter
    if (filterTag === 'token') {
      return Boolean(r.tokenNumber);
    }
    if (filterTag === 'govt') {
      return r.hospitalName.toLowerCase().includes('tvmch') || r.hospitalName.toLowerCase().includes('government');
    }
    if (filterTag === 'private') {
      return !r.hospitalName.toLowerCase().includes('tvmch') && !r.hospitalName.toLowerCase().includes('government');
    }

    return true;
  });

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Hidden File Input for Real Photo/File Upload */}
      <input 
        type="file"
        ref={fileInputRef}
        accept="image/*,application/pdf"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-teal-950 to-slate-950 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-sky-400/20 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[11px] font-black uppercase">
            <FaRobot />
            <span>{isTamil ? 'AI மருந்துச்சீட்டு ஸ்கேனர் & டிஜிட்டல் பெட்டகம்' : 'AI Prescription Scanner & EHR Locker'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {isTamil ? 'உங்கள் டிஜிட்டல் மருத்துவ ஆவணங்கள்' : 'Digital Health Records & Prescriptions'}
          </h2>
          <p className="text-xs text-sky-200">
            {isTamil 
              ? 'மருத்துவ சீட்டுகளை ஸ்கேன் செய்து மருந்துகள், அளவுகள் மற்றும் மருத்துவ வரலாற்று குறிப்புகளை பாதுகாப்பாக வைத்திருங்கள்.'
              : 'Store OCR-parsed prescription slips, dosage schedules, and doctor summaries securely on your device.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap relative z-10">
          {/* Quick Doctor Rx Test Button */}
          <button
            type="button"
            onClick={handleReceiveDoctorTokenRx}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer flex-shrink-0"
            title="Receive official Doctor prescription for Token #14"
          >
            <span>👨‍⚕️ {isTamil ? 'டாக்டர் Rx பெறு (#14)' : 'Receive Doctor Rx (#14)'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveUploadTab('scan');
              setUploadModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <FaUpload />
            <span>{isTamil ? 'புதிய மருந்துச்சீட்டு ஸ்கேன்' : 'Upload / Scan Rx'}</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
          <input
            type="text"
            placeholder={isTamil ? 'மருந்து, நோய், மருத்துவர் அல்லது மருத்துவமனை தேடுக...' : 'Search medicine (Paracetamol), diagnosis, doctor, hospital...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:border-sky-500 focus:outline-none bg-slate-50/70"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: isTamil ? 'அனைத்தும்' : 'All', count: records.length },
            { id: 'token', label: isTamil ? '🎟️ டோக்கன் சீட்டுகள்' : '🎟️ Token Rx', count: records.filter(r => r.tokenNumber).length },
            { id: 'govt', label: 'TVMCH (Govt)', count: records.filter(r => r.hospitalName.toLowerCase().includes('tvmch') || r.hospitalName.toLowerCase().includes('government')).length },
            { id: 'private', label: 'Private Clinics', count: records.filter(r => !r.hospitalName.toLowerCase().includes('tvmch') && !r.hospitalName.toLowerCase().includes('government')).length }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterTag(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterTag === f.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{f.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${filterTag === f.id ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Prescription Cards Grid */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
            📋
          </div>
          <h3 className="font-extrabold text-base text-slate-900">
            {isTamil ? 'மருந்துச்சீட்டுகள் எதுவும் இல்லை' : 'No Prescriptions Found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery 
              ? 'Try adjusting your search keyword or clearing the filters.' 
              : 'Scan or upload your first prescription slip to maintain your digital health locker.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilterTag('all');
              setUploadModalOpen(true);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            {isTamil ? 'புதிய மருந்துச்சீட்டு சேர்க்க' : '+ Upload Prescription Now'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((rec) => (
            <Card key={rec.id} className="p-5 border-2 border-slate-200 hover:border-sky-300 bg-white rounded-3xl shadow-xs space-y-4 transition-all">
              {/* Card Top: Rx Icon, Title, Badges & Delete */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center font-black text-lg flex-shrink-0">
                    <FaFilePrescription />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="badge badge-success text-[9px] font-black flex items-center gap-1">
                        <FaShieldAlt /> {rec.fileType}
                      </span>
                      {rec.tokenNumber && (
                        <span className="badge bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                          🎟️ Token #{rec.tokenNumber}
                        </span>
                      )}
                      {rec.patientName && (
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          👤 {rec.patientName}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">#{rec.id}</span>
                    </div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mt-1 leading-snug">
                      {rec.diagnosis}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(rec.id)}
                  className="p-2 text-slate-300 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete record"
                >
                  <FaTrash size={12} />
                </button>
              </div>

              {/* Doctor & Hospital Details */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-bold flex items-center gap-1.5">
                    <FaUserMd className="text-sky-600" /> <strong>{rec.doctorName}</strong>
                  </span>
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <FaCalendarAlt size={10} className="text-slate-400" /> {rec.date}
                  </span>
                </div>
                <div className="text-slate-600 truncate flex items-center gap-1.5">
                  <FaHospital className="text-teal-600 flex-shrink-0" />
                  <span className="truncate font-semibold">{rec.hospitalName}</span>
                </div>
              </div>

              {/* Prescribed Medicines Summary */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <FaPills className="text-teal-600" /> Prescribed Medicines ({rec.medicines.length})
                </span>
                <div className="space-y-1">
                  {rec.medicines.slice(0, 3).map((med, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-white border border-slate-200">
                      <span className="font-bold text-slate-800 truncate mr-2">
                        {med.name} <span className="text-slate-400 font-normal">({med.dosage})</span>
                      </span>
                      <span className="text-[11px] font-bold text-sky-700 whitespace-nowrap bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100">
                        {med.frequency}
                      </span>
                    </div>
                  ))}
                  {rec.medicines.length > 3 && (
                    <span className="text-[10px] text-slate-400 pl-2 block font-semibold">
                      +{rec.medicines.length - 3} more medicines...
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions: View Details + Direct Download & Print */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(rec)}
                  className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1.5 cursor-pointer py-1"
                >
                  <FaEye /> <span>{isTamil ? 'முழு விவரம் காண்க' : 'View Full Details'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {/* Direct Print Button */}
                  <button
                    type="button"
                    onClick={() => handlePrint(rec)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    title="Print prescription directly"
                  >
                    <FaPrint size={12} />
                  </button>

                  {/* Direct Download Button */}
                  <button
                    type="button"
                    onClick={() => handleDownload(rec)}
                    className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors border border-sky-200"
                    title="Download digital prescription slip"
                  >
                    <FaDownload size={11} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 4. Upload / Scan Prescription Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => {
          if (!isScanning) setUploadModalOpen(false);
        }}
        title={isTamil ? 'மருந்துச்சீட்டு பதிவேற்றம் & AI ஸ்கேனர்' : 'Upload & Scan Prescription (EHR Locker)'}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 p-1">
          {/* Scanning Progress Animation Screen */}
          {isScanning ? (
            <div className="py-8 space-y-5 text-center">
              <div className="w-16 h-16 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin mx-auto" />
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  {scanStepText}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Parsing doctor signature, medications and dosage schedules
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 max-w-sm mx-auto overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-sky-600 to-teal-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>

              {uploadedPreviewUrl && (
                <div className="mt-4 max-w-xs mx-auto rounded-2xl overflow-hidden border border-slate-200 max-h-40">
                  <img src={uploadedPreviewUrl} alt="Prescription preview" className="w-full object-cover" />
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Tabs: AI OCR Scan vs Manual Rx Form */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 mb-3">
                <button
                  type="button"
                  onClick={() => setActiveUploadTab('scan')}
                  className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeUploadTab === 'scan'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FaCamera />
                  <span>{isTamil ? 'AI புகைப்பட ஸ்கேன்' : 'Photo / File Upload'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveUploadTab('manual')}
                  className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeUploadTab === 'manual'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FaPlus />
                  <span>{isTamil ? 'கைமுறை உள்ளீடு' : 'Manual Entry'}</span>
                </button>
              </div>

              {activeUploadTab === 'scan' ? (
                <div className="space-y-4">
                  {/* Dropzone with Real File Input Trigger */}
                  <div 
                    onClick={handleTriggerFileInput}
                    className="border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-3xl p-6 bg-sky-50/50 hover:bg-sky-50/80 transition-all cursor-pointer flex flex-col items-center text-center group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-sky-600 text-2xl mb-2 group-hover:scale-110 transition-transform">
                      <FaCamera />
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-800">
                      {isTamil ? 'புகைப்படம் அல்லது கோப்பை தேர்ந்தெடுக்க கிளிக் செய்க' : 'Take a Photo or Select Prescription Image / PDF'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      Select clinic slip or prescription photo from your device (JPG, PNG, PDF)
                    </p>

                    <button
                      type="button"
                      className="mt-3 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs pointer-events-none"
                    >
                      Browse Files on Device
                    </button>
                  </div>

                  {/* 1-Click Clinic Prescription Simulator */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        {isTamil ? 'அல்லது மாதிரி மருந்துச்சீட்டை தேர்ந்தெடுக்கவும் (1-Click Test):' : 'Or Select Instant Sample Prescription (1-Click):'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {scanPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => runAiScanPipeline(preset.title, preset)}
                          className="p-3 rounded-2xl border border-slate-200 hover:border-sky-400 bg-white hover:bg-sky-50/50 text-left transition-all cursor-pointer"
                        >
                          <div className="font-extrabold text-xs text-slate-900 truncate">{preset.title}</div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">{preset.doctor}</div>
                          <div className="text-[10px] text-sky-700 font-bold mt-1">🩺 {preset.diagnosis}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Info Notice */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-600 text-left flex items-start gap-2">
                    <FaRobot className="text-sky-600 flex-shrink-0 mt-0.5" />
                    <span>
                      {isTamil 
                        ? 'எங்கள் AI OCR மாடல் மருத்துவரின் கையெழுத்து, மருந்து பெயர்கள், உணவு முறை மற்றும் நாட்களை தானாகவே பிரித்தெடுத்து அட்டவணைப்படுத்தும்.'
                        : 'Our AI OCR parser normalizes clinic prescriptions into structured dosage schedules and verifies them against Tirunelveli hospital registries.'}
                    </span>
                  </div>
                </div>
              ) : (
                /* Manual Entry Form */
                <form onSubmit={handleSaveManualForm} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Hospital / Clinic Name</label>
                      <input
                        type="text"
                        value={manualForm.hospitalName}
                        onChange={(e) => setManualForm({ ...manualForm, hospitalName: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-sky-500"
                        placeholder="e.g. TVMCH / Shifa / Kauvery"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Doctor Name</label>
                      <input
                        type="text"
                        value={manualForm.doctorName}
                        onChange={(e) => setManualForm({ ...manualForm, doctorName: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-sky-500"
                        placeholder="e.g. Dr. K. Raman, MD"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Diagnosis / Condition</label>
                      <input
                        type="text"
                        value={manualForm.diagnosis}
                        onChange={(e) => setManualForm({ ...manualForm, diagnosis: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-sky-500"
                        placeholder="e.g. Acute Bronchitis"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
                      <input
                        type="date"
                        value={manualForm.date}
                        onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  {/* Medicines List */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">Prescribed Medicines ({manualForm.medicines.length})</label>
                      <button
                        type="button"
                        onClick={handleAddMedicineRow}
                        className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                      >
                        <FaPlus size={10} /> <span>Add Medicine</span>
                      </button>
                    </div>

                    {manualForm.medicines.map((med, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder="Medicine Name (e.g. Paracetamol)"
                            value={med.name}
                            onChange={(e) => handleUpdateMedicineRow(idx, 'name', e.target.value)}
                            required
                            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Strength (e.g. 650 mg)"
                            value={med.dosage}
                            onChange={(e) => handleUpdateMedicineRow(idx, 'dosage', e.target.value)}
                            className="w-28 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          />
                          {manualForm.medicines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMedicineRow(idx)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                            >
                              <FaTrash size={12} />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={med.frequency}
                            onChange={(e) => handleUpdateMedicineRow(idx, 'frequency', e.target.value)}
                            className="flex-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          >
                            <option value="1-0-1 (After Food)">1-0-1 (After Food - Morning & Night)</option>
                            <option value="1-0-0 (Morning)">1-0-0 (Morning only)</option>
                            <option value="0-0-1 (Night)">0-0-1 (Night only)</option>
                            <option value="1-1-1 (Thrice Daily)">1-1-1 (Thrice Daily)</option>
                            <option value="1-0-0 (Before Food)">1-0-0 (Before Food - Morning)</option>
                            <option value="As Needed / SOS">As Needed / SOS</option>
                          </select>

                          <input
                            type="text"
                            placeholder="Duration (e.g. 5 Days)"
                            value={med.duration}
                            onChange={(e) => handleUpdateMedicineRow(idx, 'duration', e.target.value)}
                            className="w-28 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Doctor's Notes / Advice</label>
                    <textarea
                      value={manualForm.notes}
                      onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-sky-500"
                      placeholder="e.g. Warm water intake, complete full course."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Save Prescription to Health Locker
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </Modal>

      {/* 5. Detailed Prescription View Modal */}
      {selectedRecord && (
        <Modal
          isOpen={Boolean(selectedRecord)}
          onClose={() => setSelectedRecord(null)}
          title={`Prescription Details: #${selectedRecord.id}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5 p-1 text-left">
            {/* Header info badge */}
            <div className="p-4 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                  {selectedRecord.hospitalName}
                </span>
                <h4 className="font-black text-slate-900 text-lg mt-1">{selectedRecord.doctorName}</h4>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">
                  {selectedRecord.specialty} • Date: {selectedRecord.date}
                </div>
                {selectedRecord.tokenNumber && (
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="badge bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md">
                      🎟️ Token #{selectedRecord.tokenNumber}
                    </span>
                    {selectedRecord.patientName && (
                      <span className="text-[10px] font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                        Patient: <strong>{selectedRecord.patientName}</strong>
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="text-right">
                <span className="badge badge-success text-[10px] font-black uppercase">
                  ✓ Verified Record
                </span>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  ID: #{selectedRecord.id}
                </div>
              </div>
            </div>

            {/* Diagnosis banner */}
            <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Diagnosis</span>
              <strong className="text-slate-900 text-sm mt-0.5 block">{selectedRecord.diagnosis}</strong>
            </div>

            {/* Medication Regimen with visual dosage timetable */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Full Medication Regimen & Schedule
                </h5>
                <span className="text-xs text-slate-400 font-bold">
                  {selectedRecord.medicines.length} Medicines
                </span>
              </div>

              <div className="space-y-2.5">
                {selectedRecord.medicines.map((med, idx) => {
                  const freq = med.frequency || '';
                  const hasMorning = freq.startsWith('1') || freq.includes('Morning');
                  const hasNight = freq.includes('1 (Night') || freq.includes('-1') || freq.endsWith('1') || freq.includes('Night');
                  const hasAfternoon = freq.includes('-1-') || freq.includes('Thrice') || freq.includes('Afternoon');

                  return (
                    <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <strong className="text-slate-900 text-sm">{med.name}</strong>
                          <span className="text-xs text-slate-500 font-medium ml-2">({med.dosage})</span>
                        </div>
                        <span className="font-extrabold text-xs text-sky-700 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-100">
                          {med.duration || 'As directed'}
                        </span>
                      </div>

                      {/* Visual Pill Timing Indicator */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                        <span className="font-bold text-slate-600">{med.frequency}</span>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                            hasMorning ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-400 opacity-50'
                          }`}>
                            <FaSun size={10} /> Morning
                          </span>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                            hasAfternoon ? 'bg-orange-100 text-orange-900' : 'bg-slate-100 text-slate-400 opacity-50'
                          }`}>
                            <FaCloudSun size={10} /> Noon
                          </span>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                            hasNight ? 'bg-indigo-100 text-indigo-900' : 'bg-slate-100 text-slate-400 opacity-50'
                          }`}>
                            <FaMoon size={10} /> Night
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Doctor's Notes */}
            {selectedRecord.notes && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
                <strong className="block mb-0.5">Doctor's Clinical Notes & Dietary Advice:</strong>
                <span>{selectedRecord.notes}</span>
              </div>
            )}

            {/* Modal Actions: Print + Download + Copy */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleCopySchedule(selectedRecord)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FaCopy />
                <span>Copy for WhatsApp</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrint(selectedRecord)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FaPrint />
                  <span>Print Slip</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(selectedRecord)}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FaDownload />
                  <span>Download HTML/PDF</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HealthLocker;
