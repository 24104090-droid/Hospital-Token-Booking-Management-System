import React, { useState, useEffect, useMemo } from 'react';
import Card from '../common/Card';
import Modal from '../common/Modal';
import { useLanguage } from '../../context/LanguageContext';
import { QRCodeCanvas } from 'qrcode.react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import {
  FaPills,
  FaCheckCircle,
  FaClock,
  FaBoxOpen,
  FaQrcode,
  FaSearch,
  FaPrint,
  FaBell,
  FaVolumeUp,
  FaVolumeMute,
  FaArrowRight,
  FaHospital,
  FaUserMd,
  FaTicketAlt,
  FaExclamationTriangle,
  FaSyncAlt,
  FaCheck,
  FaBarcode,
  FaShieldAlt,
  FaSun,
  FaCloudSun,
  FaMoon,
  FaExchangeAlt,
  FaMapMarkerAlt,
  FaUserInjured,
  FaReceipt,
  FaTrashAlt,
  FaPlusCircle,
  FaShareSquare,
  FaCreditCard,
  FaMoneyBillWave,
  FaRupeeSign,
  FaFileInvoiceDollar
} from 'react-icons/fa';

// Helper to calculate bill
export const calculateOrderBill = (medicines = [], scheme = 'govt_free') => {
  const getPrice = (name) => {
    const l = name.toLowerCase();
    if (l.includes('paracetamol')) return 15;
    if (l.includes('amoxicillin')) return 95;
    if (l.includes('cetirizine')) return 20;
    if (l.includes('ors')) return 15;
    if (l.includes('naproxen')) return 40;
    if (l.includes('domperidone')) return 30;
    if (l.includes('multivitamin')) return 50;
    if (l.includes('montelukast')) return 75;
    if (l.includes('saline')) return 45;
    if (l.includes('pantoprazole')) return 60;
    if (l.includes('telmisartan')) return 85;
    if (l.includes('amlodipine')) return 40;
    return 35;
  };

  const items = medicines.map((m, i) => {
    const price = getPrice(m.name);
    return {
      ...m,
      itemNumber: i + 1,
      hsnCode: '3004',
      unitPrice: price,
      qty: 1,
      total: price
    };
  });

  const subtotal = items.reduce((acc, curr) => acc + curr.total, 0);
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const grossTotal = subtotal + gst;

  let discount = 0;
  let netPayable = grossTotal;
  let schemeLabel = 'Standard Retail Billing';

  if (scheme === 'govt_free') {
    discount = grossTotal;
    netPayable = 0;
    schemeLabel = 'TNMSC 100% Free Govt Scheme';
  } else if (scheme === 'jan_aushadhi') {
    discount = Math.round(grossTotal * 0.70); // 70% generic discount
    netPayable = grossTotal - discount;
    schemeLabel = 'Jan Aushadhi Generic (70% Off)';
  } else if (scheme === 'insurance') {
    discount = grossTotal;
    netPayable = 0;
    schemeLabel = 'CMCHIS / ABHA Cashless Co-Pay';
  }

  return {
    items,
    subtotal,
    gst,
    grossTotal,
    discount,
    netPayable,
    schemeLabel
  };
};

// Enterprise default demo orders with billing
const defaultPharmacyOrders = [
  {
    id: 'rx-tvl-token-14',
    tokenNumber: 14,
    patientName: 'Subramanian M',
    patientAge: 34,
    patientGender: 'M',
    doctorName: 'Dr. S. Sundararajan, MD',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    room: 'OPD Chamber 204',
    date: new Date().toISOString().split('T')[0],
    diagnosis: 'Acute Viral Bronchitis & Pharyngitis',
    pharmacyStatus: 'packing', // 'queued' | 'packing' | 'ready' | 'dispensed'
    pharmacyCounter: 'Counter 04 (Fast-Track Pre-Pack)',
    binNumber: 'B-14',
    pickupOtp: '5414',
    receivedAt: '10:14 AM',
    batchNo: 'TNMSC-2026-B84',
    medicines: [
      { name: 'Paracetamol', dosage: '650 mg', frequency: '1-0-1 (After Food)', duration: '3 Days', packed: true, stockStatus: 'TNMSC Free Stock', batch: 'PCM-65-88' },
      { name: 'Amoxicillin + Clavulanic Acid', dosage: '625 mg', frequency: '1-0-1 (After Food)', duration: '5 Days', packed: true, stockStatus: 'TNMSC Free Stock', batch: 'AMX-62-12' },
      { name: 'Cetirizine', dosage: '10 mg', frequency: '0-0-1 (Night)', duration: '5 Days', packed: false, stockStatus: 'TNMSC Free Stock', batch: 'CTZ-10-44' },
      { name: 'ORS Electrolyte Solution', dosage: '1 Sachet in 1L Water', frequency: 'Thrice Daily', duration: '3 Days', packed: false, stockStatus: 'TNMSC Free Stock', batch: 'ORS-01-90' }
    ],
    billing: {
      scheme: 'govt_free',
      schemeLabel: 'TNMSC 100% Free Govt Scheme',
      grossTotal: 152,
      discount: 152,
      netPayable: 0,
      paymentStatus: 'govt_free', // 'govt_free' | 'paid' | 'unpaid'
      paymentMethod: 'TNMSC 100% Free Scheme',
      transactionId: 'TXN-TVM-84920',
      paidAt: '10:14 AM'
    },
    notes: 'Drink boiled warm water. Complete full antibacterial course. Avoid ice cream and chilled water.',
    verified: true
  },
  {
    id: 'rx-tvl-token-15',
    tokenNumber: 15,
    patientName: 'Muruganandam P',
    patientAge: 45,
    patientGender: 'M',
    doctorName: 'Dr. S. Sundararajan, MD',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    room: 'OPD Chamber 204',
    date: new Date().toISOString().split('T')[0],
    diagnosis: 'Acute Migraine & Tension Headache',
    pharmacyStatus: 'queued',
    pharmacyCounter: 'Counter 04 (Fast-Track Pre-Pack)',
    binNumber: 'B-15',
    pickupOtp: '6715',
    receivedAt: '10:22 AM',
    batchNo: 'TNMSC-2026-B89',
    medicines: [
      { name: 'Naproxen', dosage: '500 mg', frequency: '1-0-1 (After Food)', duration: '3 Days', packed: false, stockStatus: 'TNMSC Free Stock', batch: 'NPX-50-32' },
      { name: 'Domperidone', dosage: '10 mg', frequency: '1-0-0 (Before Food)', duration: '3 Days', packed: false, stockStatus: 'TNMSC Free Stock', batch: 'DMP-10-18' },
      { name: 'Multivitamin B-Complex', dosage: '1 Tablet', frequency: '0-1-0 (Afternoon)', duration: '15 Days', packed: false, stockStatus: 'Jan Aushadhi Generic', batch: 'MVB-01-77' }
    ],
    billing: {
      scheme: 'jan_aushadhi',
      schemeLabel: 'Jan Aushadhi Generic (70% Off)',
      grossTotal: 126,
      discount: 88,
      netPayable: 38,
      paymentStatus: 'unpaid',
      paymentMethod: null,
      transactionId: null,
      paidAt: null
    },
    notes: 'Avoid prolonged sunlight exposure. Keep well-hydrated. Review if throbbing pain continues.',
    verified: true
  },
  {
    id: 'rx-tvl-token-12',
    tokenNumber: 12,
    patientName: 'Kavitha R',
    patientAge: 29,
    patientGender: 'F',
    doctorName: 'Dr. V. Meenakshi, MS',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    room: 'OPD Chamber 102',
    date: new Date().toISOString().split('T')[0],
    diagnosis: 'Seasonal Rhinitis & Allergic Sneezing',
    pharmacyStatus: 'ready',
    pharmacyCounter: 'Counter 04 (Fast-Track Pre-Pack)',
    binNumber: 'B-12',
    pickupOtp: '8112',
    receivedAt: '10:05 AM',
    readyAt: '10:09 AM',
    batchNo: 'TNMSC-2026-B72',
    medicines: [
      { name: 'Levocetirizine + Montelukast', dosage: '5mg/10mg', frequency: '0-0-1 (Night)', duration: '7 Days', packed: true, stockStatus: 'TNMSC Free Stock', batch: 'LVZ-15-56' },
      { name: 'Normal Saline Nasal Spray', dosage: '2 Puffs each nostril', frequency: 'Thrice Daily', duration: '5 Days', packed: true, stockStatus: 'TNMSC Free Stock', batch: 'NSS-20-03' }
    ],
    billing: {
      scheme: 'private',
      schemeLabel: 'Standard Retail Billing',
      grossTotal: 126,
      discount: 0,
      netPayable: 126,
      paymentStatus: 'paid',
      paymentMethod: 'UPI (Google Pay)',
      transactionId: 'TXN-UPI-98421',
      paidAt: '10:07 AM'
    },
    notes: 'Steam inhalation twice daily. Do not rub eyes with hands.',
    verified: true
  },
  {
    id: 'rx-tvl-token-10',
    tokenNumber: 10,
    patientName: 'Kalyanasundaram T',
    patientAge: 62,
    patientGender: 'M',
    doctorName: 'Dr. P. Muthukumar, MCh',
    hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
    room: 'Cardiology Clinic A',
    date: new Date().toISOString().split('T')[0],
    diagnosis: 'Essential Hypertension & Maintenance',
    pharmacyStatus: 'dispensed',
    pharmacyCounter: 'Counter 04 (Fast-Track Pre-Pack)',
    binNumber: 'B-10',
    pickupOtp: '3310',
    receivedAt: '09:45 AM',
    readyAt: '09:50 AM',
    dispensedAt: '09:55 AM',
    batchNo: 'TNMSC-2026-B61',
    medicines: [
      { name: 'Telmisartan', dosage: '40 mg', frequency: '1-0-0 (Morning)', duration: '30 Days', packed: true, stockStatus: 'TNMSC Free Stock', batch: 'TLM-40-19' },
      { name: 'Amlodipine', dosage: '5 mg', frequency: '0-0-1 (Night)', duration: '30 Days', packed: true, stockStatus: 'TNMSC Free Stock', batch: 'AMD-05-88' }
    ],
    billing: {
      scheme: 'govt_free',
      schemeLabel: 'TNMSC 100% Free Govt Scheme',
      grossTotal: 131,
      discount: 131,
      netPayable: 0,
      paymentStatus: 'govt_free',
      paymentMethod: 'TNMSC 100% Free Scheme',
      transactionId: 'TXN-TVM-77192',
      paidAt: '09:47 AM'
    },
    notes: 'Strict low salt diet. Measure BP weekly at Primary Health Centre.',
    verified: true
  }
];

const PharmacyDispenseDashboard = () => {
  const { isTamil } = useLanguage();
  const [activeCounter, setActiveCounter] = useState('Counter 04 · Fast-Track OPD Dispenser');
  const [pharmacistName, setPharmacistName] = useState('R. Selvakumar, B.Pharm (TN-PH-8492)');
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  // Modals state
  const [selectedOrderForLabel, setSelectedOrderForLabel] = useState(null);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  
  // Payment Terminal Form State
  const [paymentScheme, setPaymentScheme] = useState('govt_free'); // 'govt_free', 'jan_aushadhi', 'private', 'insurance'
  const [paymentMode, setPaymentMode] = useState('upi'); // 'upi', 'cash', 'card', 'insurance'

  const [fastTrackSearch, setFastTrackSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'queued', 'packing', 'ready', 'dispensed', 'unpaid'

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Main state with localStorage sync
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('tvl_health_records');
      if (stored) {
        const parsed = JSON.parse(stored);
        const formatted = parsed
          .filter(r => r.tokenNumber)
          .map(r => {
            const calculated = calculateOrderBill(r.medicines || [], r.billing?.scheme || 'govt_free');
            return {
              ...r,
              pharmacyStatus: r.pharmacyStatus || 'queued',
              pharmacyCounter: r.pharmacyCounter || 'Counter 04 (Fast-Track Pre-Pack)',
              binNumber: r.binNumber || `B-${r.tokenNumber}`,
              pickupOtp: r.pickupOtp || `${Math.floor(1000 + Math.random() * 9000)}`,
              receivedAt: r.receivedAt || '10:00 AM',
              batchNo: r.batchNo || `TNMSC-2026-B${Math.floor(10 + Math.random() * 89)}`,
              billing: r.billing || {
                scheme: 'govt_free',
                schemeLabel: calculated.schemeLabel,
                grossTotal: calculated.grossTotal,
                discount: calculated.discount,
                netPayable: calculated.netPayable,
                paymentStatus: 'govt_free',
                paymentMethod: 'TNMSC 100% Free Scheme',
                transactionId: `TXN-TVM-${Math.floor(10000 + Math.random() * 89999)}`,
                paidAt: '10:00 AM'
              },
              medicines: (r.medicines || []).map(m => ({
                ...m,
                packed: typeof m.packed === 'boolean' ? m.packed : (r.pharmacyStatus === 'ready' || r.pharmacyStatus === 'dispensed'),
                stockStatus: m.stockStatus || 'TNMSC Free Stock',
                batch: m.batch || `LOT-${Math.floor(100 + Math.random() * 899)}`
              }))
            };
          });

        if (formatted.length > 0) {
          const existingTokenNums = new Set(formatted.map(f => f.tokenNumber));
          const additions = defaultPharmacyOrders.filter(d => !existingTokenNums.has(d.tokenNumber));
          return [...formatted, ...additions];
        }
      }
      return defaultPharmacyOrders;
    } catch (e) {
      return defaultPharmacyOrders;
    }
  });

  // Sync state to localStorage so patient live tracker receives updates instantly
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('tvl_health_records') || '[]');
      const orderMap = new Map(orders.map(o => [o.id, o]));
      
      const merged = existing.map(item => {
        if (orderMap.has(item.id)) {
          return { ...item, ...orderMap.get(item.id) };
        }
        return item;
      });

      orders.forEach(o => {
        if (!merged.some(m => m.id === o.id)) {
          merged.push(o);
        }
      });

      localStorage.setItem('tvl_health_records', JSON.stringify(merged));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Listen for storage updates (e.g. patient paying online via UPI on Live Tracker)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('tvl_health_records');
        if (!stored) return;
        const parsed = JSON.parse(stored);
        setOrders(prev => {
          let hasDiff = false;
          const freshMap = new Map(parsed.map(p => [p.id, p]));
          const updated = prev.map(order => {
            const fresh = freshMap.get(order.id);
            if (fresh && fresh.billing && JSON.stringify(fresh.billing) !== JSON.stringify(order.billing)) {
              hasDiff = true;
              return { ...order, billing: fresh.billing };
            }
            return order;
          });
          return hasDiff ? updated : prev;
        });
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 2000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Audio speech announcements
  const playChime = (text) => {
    if (!audioAlertsEnabled) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  };

  // Actions
  const handleStartPacking = (orderId) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          pharmacyStatus: 'packing',
          medicines: o.medicines.map(m => ({ ...m, packed: m.packed || false }))
        };
      }
      return o;
    }));
    toast('📦 Order moved to active packing bench tray!', { icon: '💊' });
  };

  const handleToggleMedicinePacked = (orderId, medIndex) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedMeds = [...o.medicines];
        updatedMeds[medIndex] = {
          ...updatedMeds[medIndex],
          packed: !updatedMeds[medIndex].packed
        };
        const allPacked = updatedMeds.every(m => m.packed);
        return {
          ...o,
          medicines: updatedMeds,
          pharmacyStatus: allPacked ? 'ready' : 'packing'
        };
      }
      return o;
    }));
  };

  const handleMarkReady = (orderId) => {
    const readyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          pharmacyStatus: 'ready',
          readyAt: readyTime,
          medicines: o.medicines.map(m => ({ ...m, packed: true }))
        };
      }
      return o;
    }));

    const target = orders.find(o => o.id === orderId);
    toast.success(
      isTamil 
        ? `டோக்கன் #${target?.tokenNumber} மருந்துகள் தயார்! Bin #${target?.binNumber}` 
        : `Token #${target?.tokenNumber} pre-packed and secured in Bin #${target?.binNumber}! Ready for zero-wait pickup.`
    );
    playChime(`Token number ${target?.tokenNumber}, medicine pack ready in Bin ${target?.binNumber}.`);
  };

  // Payment Confirmation Action
  const handleConfirmPayment = (orderId, mode, scheme) => {
    const billCalc = calculateOrderBill(selectedOrderForPayment?.medicines || [], scheme);
    const txnId = scheme === 'govt_free' 
      ? `TNMSC-FREE-${Math.floor(10000 + Math.random() * 89999)}`
      : `TXN-${mode.toUpperCase()}-${Math.floor(10000 + Math.random() * 89999)}`;
    
    const paidTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          billing: {
            scheme,
            schemeLabel: billCalc.schemeLabel,
            grossTotal: billCalc.grossTotal,
            discount: billCalc.discount,
            netPayable: billCalc.netPayable,
            paymentStatus: billCalc.netPayable === 0 ? 'govt_free' : 'paid',
            paymentMethod: mode === 'upi' ? 'UPI (GPay/PhonePe)' : mode === 'cash' ? 'Cash at Counter' : mode === 'card' ? 'Credit/Debit POS' : 'Insurance Waiver',
            transactionId: txnId,
            paidAt: paidTime
          }
        };
      }
      return o;
    }));

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    toast.success(
      isTamil
        ? `கட்டணம் உறுதி செய்யப்பட்டது! ரசீது எண்: #${txnId}`
        : `Payment settled successfully! Receipt #${txnId} generated.`
    );

    setSelectedOrderForPayment(null);
  };

  const handleDispenseHandover = (orderId) => {
    const target = orders.find(o => o.id === orderId);
    
    // Check if unpaid
    if (target?.billing?.paymentStatus === 'unpaid') {
      toast.error('Cannot dispense: Payment pending! Please settle bill or apply Govt waiver first.', { icon: '⚠️' });
      setSelectedOrderForPayment(target);
      return;
    }

    const dispenseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          pharmacyStatus: 'dispensed',
          dispensedAt: dispenseTime
        };
      }
      return o;
    }));

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast.success(
      isTamil
        ? `டோக்கன் #${target?.tokenNumber} மருந்துப்பை வழங்கப்பட்டது! ⏱️ 10 நொடி ஜீரோ-வெயிட் டெலிவரி!`
        : `✔ Handed over pre-packed packet to Token #${target?.tokenNumber}! ⏱️ 10-second zero-wait delivery completed.`
    );
  };

  // Simulate incoming OPD Doctor Prescription
  const handleSimulateNewDoctorRx = () => {
    const nextToken = Math.floor(21 + Math.random() * 40);
    const names = ['Soundararajan V', 'Porkodi M', 'Alagappan K', 'Shanmuga Priya', 'Manikandan E'];
    const selectedName = names[Math.floor(Math.random() * names.length)];

    const meds = [
      { name: 'Paracetamol', dosage: '650 mg', frequency: '1-0-1 (After Food)', duration: '3 Days', packed: false, stockStatus: 'TNMSC Free Stock', batch: 'PCM-65-99' },
      { name: 'Pantoprazole', dosage: '40 mg', frequency: '1-0-0 (Before Food)', duration: '5 Days', packed: false, stockStatus: 'TNMSC Free Stock', batch: 'PAN-40-11' },
      { name: 'Cetirizine', dosage: '10 mg', frequency: '0-0-1 (Night)', duration: '5 Days', packed: false, stockStatus: 'TNMSC Free Stock', batch: 'CTZ-10-55' }
    ];

    const isGovt = Math.random() > 0.4;
    const calc = calculateOrderBill(meds, isGovt ? 'govt_free' : 'jan_aushadhi');

    const newRx = {
      id: `rx-tvl-token-${nextToken}`,
      tokenNumber: nextToken,
      patientName: selectedName,
      patientAge: Math.floor(24 + Math.random() * 45),
      patientGender: Math.random() > 0.5 ? 'M' : 'F',
      doctorName: 'Dr. S. Sundararajan, MD',
      hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
      room: 'OPD Chamber 204',
      date: new Date().toISOString().split('T')[0],
      diagnosis: 'Acute Viral Fever & Sore Throat',
      pharmacyStatus: 'queued',
      pharmacyCounter: 'Counter 04 (Fast-Track Pre-Pack)',
      binNumber: `B-${nextToken}`,
      pickupOtp: `${Math.floor(1000 + Math.random() * 9000)}`,
      receivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      batchNo: `TNMSC-2026-B${Math.floor(10 + Math.random() * 89)}`,
      medicines: meds,
      billing: {
        scheme: isGovt ? 'govt_free' : 'jan_aushadhi',
        schemeLabel: calc.schemeLabel,
        grossTotal: calc.grossTotal,
        discount: calc.discount,
        netPayable: calc.netPayable,
        paymentStatus: isGovt ? 'govt_free' : 'unpaid',
        paymentMethod: isGovt ? 'TNMSC 100% Free Scheme' : null,
        transactionId: isGovt ? `TXN-TVM-${Math.floor(10000 + Math.random() * 89999)}` : null,
        paidAt: isGovt ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
      },
      notes: 'Doctor prescription dispatched from OPD chamber directly to Pharmacy Pre-Pack Hub.',
      verified: true
    };

    setOrders(prev => [newRx, ...prev]);
    playChime(`New OPD prescription received for Token number ${nextToken}`);
    toast.success(`⚡ New Doctor prescription arrived for Token #${nextToken} (${selectedName})! Auto-allocated to Bin #B-${nextToken}.`);
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (fastTrackSearch.trim()) {
        const q = fastTrackSearch.toLowerCase().trim();
        const matchToken = String(o.tokenNumber).includes(q);
        const matchName = o.patientName.toLowerCase().includes(q);
        const matchBin = o.binNumber.toLowerCase().includes(q);
        const matchOtp = o.pickupOtp?.includes(q);
        const matchDoc = o.doctorName.toLowerCase().includes(q);
        if (!matchToken && !matchName && !matchBin && !matchOtp && !matchDoc) return false;
      }

      if (activeTab === 'all') return true;
      if (activeTab === 'unpaid') return o.billing?.paymentStatus === 'unpaid';
      return o.pharmacyStatus === activeTab;
    });
  }, [orders, fastTrackSearch, activeTab]);

  const queuedCount = orders.filter(o => o.pharmacyStatus === 'queued').length;
  const packingCount = orders.filter(o => o.pharmacyStatus === 'packing').length;
  const readyCount = orders.filter(o => o.pharmacyStatus === 'ready').length;
  const dispensedCount = orders.filter(o => o.pharmacyStatus === 'dispensed').length;
  const unpaidCount = orders.filter(o => o.billing?.paymentStatus === 'unpaid').length;

  // Active Bins List for visual tray rack
  const activeBins = orders.filter(o => o.pharmacyStatus === 'ready' || o.pharmacyStatus === 'packing');

  // Currently opened order bill calculation
  const currentModalBill = useMemo(() => {
    if (!selectedOrderForPayment) return null;
    return calculateOrderBill(selectedOrderForPayment.medicines || [], paymentScheme);
  }, [selectedOrderForPayment, paymentScheme]);

  return (
    <div className="flex flex-col gap-6 text-left pb-24 font-sans">
      {/* 1. Executive Clinical Station Header Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-500/30 relative overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>TNMSC Formularies · Zero-Wait & Digital Payment Core</span>
              </span>
              <span className="text-slate-400 text-xs font-mono">
                Station Time: <strong className="text-white">{currentTime}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Tirunelveli Medical College Hospital</span>
              <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-teal-400/20 text-teal-300 border border-teal-400/30">
                TVMCH-PHARM
              </span>
            </h1>

            <p className="text-xs text-slate-300 max-w-2xl font-medium leading-relaxed">
              {isTamil
                ? 'அரசு மத்திய மருந்தக முன்-பேக்கிங் & டிஜிட்டல் பில்லிங் மையம். இலவச மற்றும் யுபிஐ கட்டண வசதியுடன் நோயாளி வரிசையில் நிற்காமல் 10 வினாடிகளில் மருந்துகளைப் பெற்றுச் செல்லும் அமைப்பு.'
                : 'Central OPD Hospital Pharmacy & Fast-Track Pre-Packing Hub with Integrated UPI QR & Cashless Billing. Automated order routing with zero counter queue.'}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-300 pt-1 flex-wrap font-medium">
              <span className="flex items-center gap-1.5">
                <FaUserMd className="text-emerald-400" /> Pharmacist: <strong className="text-white">{pharmacistName}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FaHospital className="text-teal-400" /> Dispensing Point: <strong className="text-teal-300">{activeCounter}</strong>
              </span>
            </div>
          </div>

          {/* Right Header Station Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
              className={`px-3.5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                audioAlertsEnabled
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-white/10 border-white/15 text-slate-400 hover:bg-white/15'
              }`}
              title="Toggle audio announcements for incoming prescriptions"
            >
              {audioAlertsEnabled ? <FaVolumeUp size={14} /> : <FaVolumeMute size={14} />}
              <span>{audioAlertsEnabled ? 'Chime Active' : 'Chime Muted'}</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateNewDoctorRx}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-teal-400 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
            >
              <FaPlusCircle size={14} />
              <span>{isTamil ? '+ புதிய டாக்டர் Rx வரவழைக்க' : '+ Simulate Doctor Rx Arrival'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Enterprise Clinical Metrics Deck (KPI Command Tiles) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span className="uppercase text-[10px] tracking-wider font-black text-amber-700">Stage 1 · Incoming OPD</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-mono font-black text-slate-900">{queuedCount}</span>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Needs Packing
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium truncate">
            Auto-dispatched from OPD Room 102 & 204
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span className="uppercase text-[10px] tracking-wider font-black text-sky-700">Stage 2 · Tray Packing</span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-mono font-black text-sky-600">{packingCount}</span>
            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
              In Bench Trays
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium truncate">
            Pharmacist verifying medication barcodes
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2 ring-2 ring-emerald-300/40">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span className="uppercase text-[10px] tracking-wider font-black text-emerald-700">Stage 3 · Ready in Bins</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-mono font-black text-emerald-600">{readyCount}</span>
            <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300">
              Fast-Track Lane
            </span>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold truncate">
            Patient notified for 10-second pickup
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span className="uppercase text-[10px] tracking-wider font-black text-indigo-700">Payment & Free Subsidy</span>
            <FaRupeeSign className="text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-mono font-black text-slate-900">
              {unpaidCount > 0 ? (
                <span className="text-amber-600">{unpaidCount} Due</span>
              ) : (
                <span className="text-emerald-600">100% Settle</span>
              )}
            </span>
            <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              UPI / Govt Free
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium truncate">
            {dispensedCount} orders fulfilled today
          </div>
        </div>
      </div>

      {/* 3. Fast-Track Barcode & Express Handover Terminal */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-5 rounded-3xl border border-slate-800 shadow-xl text-white space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <FaBarcode /> Express Zero-Wait Pickup Terminal (Counter 04)
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">
              Scan Patient QR / Enter Token Number to Instant-Dispense
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Active Bins Rack:</span>
            <div className="flex items-center gap-1.5">
              {activeBins.length === 0 ? (
                <span className="text-[10px] text-slate-500 italic">No bins currently reserved</span>
              ) : (
                activeBins.slice(0, 5).map(b => (
                  <button
                    key={b.id}
                    onClick={() => setFastTrackSearch(String(b.tokenNumber))}
                    className="px-2.5 py-1 rounded-xl bg-teal-900/60 hover:bg-teal-800 border border-teal-500/40 text-teal-300 font-mono font-bold text-xs cursor-pointer transition-all"
                    title={`Click to filter Bin #${b.binNumber}`}
                  >
                    {b.binNumber}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder={isTamil ? 'நோயாளி QR ஸ்கேன் அல்லது டோக்கன் எண் உள்ளிடுக (எ.கா: 14)...' : 'Scan patient barcode QR or enter Token # / Mobile / Bin # (e.g. 14, B-14)...'}
              value={fastTrackSearch}
              onChange={(e) => setFastTrackSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-700 bg-slate-800/80 text-white placeholder:text-slate-400 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {fastTrackSearch && (
            <button
              type="button"
              onClick={() => setFastTrackSearch('')}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Clear
            </button>
          )}

          {/* Quick simulated scan button */}
          <button
            type="button"
            onClick={() => {
              setFastTrackSearch('14');
              toast.success('Simulated scanning Patient Token #14 QR Code! 📲');
            }}
            className="px-4 py-3 rounded-2xl bg-teal-600/30 hover:bg-teal-600/50 border border-teal-500/50 text-teal-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FaQrcode />
            <span>Simulate Scan (#14)</span>
          </button>
        </div>
      </div>

      {/* 4. Filter Pipeline Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: isTamil ? 'அனைத்து ஆர்டர்கள்' : 'All Prescriptions', count: orders.length },
            { id: 'queued', label: isTamil ? '📥 புதியவை' : '📥 1. Queued from OPD', count: queuedCount },
            { id: 'packing', label: isTamil ? '📦 பேக்கிங் நடக்கிறது' : '📦 2. Pre-Packing', count: packingCount },
            { id: 'ready', label: isTamil ? '🟢 தயாராக உள்ளவை' : '🟢 3. Ready in Bins', count: readyCount },
            { id: 'unpaid', label: isTamil ? '💳 கட்டணம் நிலுவை' : '💳 Unpaid Billing', count: unpaidCount },
            { id: 'dispensed', label: isTamil ? '✔️ வழங்கப்பட்டவை' : '✔️ 4. Handed Over', count: dispensedCount }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${activeTab === tab.id ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing <strong>{filteredOrders.length}</strong> active patient queues
        </span>
      </div>

      {/* 5. Enterprise Order Cards Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-14 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
            💊
          </div>
          <h3 className="font-extrabold text-base text-slate-900">
            {isTamil ? 'இந்த வரிசையில் மருந்துச்சீட்டுகள் இல்லை' : 'No Active Prescription Orders in this Pipeline'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {fastTrackSearch 
              ? 'No matching patient records found. Try adjusting your Token # search.' 
              : 'All incoming OPD doctor prescriptions have been processed and dispatched.'}
          </p>
          {fastTrackSearch && (
            <button
              onClick={() => setFastTrackSearch('')}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
            >
              Reset Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map(order => {
            const isQueued = order.pharmacyStatus === 'queued';
            const isPacking = order.pharmacyStatus === 'packing';
            const isReady = order.pharmacyStatus === 'ready';
            const isDispensed = order.pharmacyStatus === 'dispensed';

            const packedCount = order.medicines.filter(m => m.packed).length;
            const totalCount = order.medicines.length;
            const packingPct = Math.round((packedCount / Math.max(1, totalCount)) * 100);

            const isGovtFree = order.billing?.paymentStatus === 'govt_free';
            const isPaid = order.billing?.paymentStatus === 'paid';
            const isUnpaid = order.billing?.paymentStatus === 'unpaid';

            return (
              <Card
                key={order.id}
                className={`p-5 rounded-3xl border-2 transition-all space-y-4 shadow-xs relative overflow-hidden ${
                  isReady
                    ? 'border-emerald-400 bg-emerald-50/20 ring-4 ring-emerald-400/20 shadow-md'
                    : isPacking
                    ? 'border-sky-300 bg-sky-50/15'
                    : isDispensed
                    ? 'border-slate-200 bg-slate-50/70 opacity-80'
                    : 'border-amber-300 bg-amber-50/15'
                }`}
              >
                {/* Header Badge Strip: Token ID, Bin Number, Status Pill */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-black text-sm shadow-xs flex items-center gap-1.5">
                      <FaTicketAlt size={11} className="text-teal-400" />
                      <span>#{order.tokenNumber}</span>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-teal-100 text-teal-900 border border-teal-300 font-mono font-black text-xs flex items-center gap-1">
                      <FaBoxOpen size={12} className="text-teal-700" />
                      <span>{order.binNumber}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                    isReady
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 animate-pulse font-bold'
                      : isPacking
                      ? 'bg-sky-100 text-sky-900 border-sky-300'
                      : isDispensed
                      ? 'bg-slate-200 text-slate-700 border-slate-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {isReady ? '🟢 Ready in Bin' : isPacking ? '🔵 Packing in Progress' : isDispensed ? '✔️ Handed Over' : '🟡 Incoming from OPD'}
                  </span>
                </div>

                {/* Patient Demographics & Doctor Meta */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 text-sm font-black block">{order.patientName}</strong>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {order.patientAge} Yrs ({order.patientGender || 'M'}) · OTP: <span className="font-mono font-bold text-slate-700">{order.pickupOtp || '5414'}</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-slate-400 block">{order.receivedAt}</span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        {order.batchNo || 'TNMSC-B84'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-semibold flex items-center gap-1 truncate mr-2">
                      <FaUserMd className="text-teal-600 flex-shrink-0" /> {order.doctorName}
                    </span>
                    <span className="text-sky-700 font-bold whitespace-nowrap bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                      {order.room || 'Room 204'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 font-medium truncate">
                    Diagnosis: <strong className="text-slate-900">{order.diagnosis}</strong>
                  </div>
                </div>

                {/* Billing & Payment Status Pill */}
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {isGovtFree ? (
                      <span className="badge bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                        <FaShieldAlt /> 100% Free (Govt TNMSC)
                      </span>
                    ) : isPaid ? (
                      <span className="badge bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                        <FaCheckCircle /> Paid: ₹{order.billing?.netPayable} ({order.billing?.paymentMethod || 'UPI'})
                      </span>
                    ) : (
                      <span className="badge bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                        <FaClock /> Unpaid: ₹{order.billing?.netPayable}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrderForPayment(order);
                        setPaymentScheme(order.billing?.scheme || 'govt_free');
                      }}
                      className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-black transition-all cursor-pointer flex items-center gap-1"
                      title="Collect payment / change billing scheme"
                    >
                      <FaCreditCard size={10} className="text-sky-600" />
                      <span>{isUnpaid ? 'Collect Pay' : 'Bill Mode'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedOrderForInvoice(order)}
                      className="p-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 transition-all cursor-pointer"
                      title="Print Official GST Tax Invoice"
                    >
                      <FaReceipt size={11} className="text-teal-700" />
                    </button>
                  </div>
                </div>

                {/* Packing Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span>Tray Packing Checklist ({packedCount}/{totalCount})</span>
                    <span className="font-mono text-teal-700">{packingPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        packingPct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-sky-500 to-teal-400'
                      }`}
                      style={{ width: `${packingPct}%` }}
                    />
                  </div>
                </div>

                {/* Interactive Medicine Checklist */}
                <div className="space-y-1.5">
                  <div className="space-y-1">
                    {order.medicines.map((med, idx) => (
                      <div
                        key={idx}
                        onClick={() => !isDispensed && handleToggleMedicinePacked(order.id, idx)}
                        className={`p-2 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                          med.packed
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate mr-2">
                          <input
                            type="checkbox"
                            checked={Boolean(med.packed)}
                            onChange={() => {}}
                            disabled={isDispensed}
                            className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <span className="truncate">
                            {med.name} <span className="text-slate-400 text-[10px] font-normal">({med.dosage})</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="text-[10px] text-slate-500 font-semibold">{med.frequency}</span>
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-600">
                            {med.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[10px] text-amber-900 leading-snug">
                      <strong>Doctor Advice:</strong> {order.notes}
                    </div>
                  )}
                </div>

                {/* Workflow Progression Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForLabel(order)}
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-bold"
                    title="Print 2-Inch Thermal Bag Label"
                  >
                    <FaPrint size={12} className="text-teal-600" />
                    <span className="text-[11px]">Bag Label</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {isQueued && (
                      <button
                        type="button"
                        onClick={() => handleStartPacking(order.id)}
                        className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <FaBoxOpen size={12} />
                        <span>Start Packing</span>
                      </button>
                    )}

                    {isPacking && (
                      <button
                        type="button"
                        onClick={() => handleMarkReady(order.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <FaCheck size={11} />
                        <span>Ready in Tray {order.binNumber}</span>
                      </button>
                    )}

                    {isReady && (
                      <button
                        type="button"
                        onClick={() => handleDispenseHandover(order.id)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
                      >
                        <span>⚡ 10s Handover</span>
                      </button>
                    )}

                    {isDispensed && (
                      <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                        <FaCheckCircle className="text-emerald-600" /> Handed Over
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 6. Payment & Billing Terminal Modal */}
      {selectedOrderForPayment && currentModalBill && (
        <Modal
          isOpen={Boolean(selectedOrderForPayment)}
          onClose={() => setSelectedOrderForPayment(null)}
          title={`Hospital Pharmacy Billing Terminal - Token #${selectedOrderForPayment.tokenNumber}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 p-2 text-left font-sans">
            {/* Patient overview banner */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider block">
                  Token #{selectedOrderForPayment.tokenNumber} · Bin #{selectedOrderForPayment.binNumber}
                </span>
                <h4 className="text-base font-black text-white">{selectedOrderForPayment.patientName}</h4>
                <p className="text-xs text-slate-300">
                  {selectedOrderForPayment.hospitalName} · {selectedOrderForPayment.doctorName}
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-mono font-black text-emerald-400">
                  ₹{currentModalBill.netPayable}.00
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">Net Amount Due</span>
              </div>
            </div>

            {/* Scheme Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider block">
                Select Pricing Scheme / Government Subsidy:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'govt_free', label: 'TNMSC 100% Free (Govt)', desc: '100% Subsidy · ₹0.00' },
                  { id: 'jan_aushadhi', label: 'Jan Aushadhi (70% Off)', desc: 'Generic Store Subsidized' },
                  { id: 'private', label: 'Standard Retail Bill', desc: 'Full Medicine Rate' },
                  { id: 'insurance', label: 'CMCHIS / ABHA Insurance', desc: '100% Cashless Co-pay' }
                ].map(sch => (
                  <button
                    key={sch.id}
                    type="button"
                    onClick={() => setPaymentScheme(sch.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentScheme === sch.id
                        ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-300'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <strong className="block text-slate-900 text-xs">{sch.label}</strong>
                    <span className="text-[10px] text-slate-500">{sch.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Itemized pricing breakdown */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">Itemized Pricing:</span>
              <div className="space-y-1">
                {currentModalBill.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-600 text-[11px]">
                    <span>{it.name} ({it.dosage})</span>
                    <span className="font-mono font-bold text-slate-800">₹{it.unitPrice}.00</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{currentModalBill.subtotal}.00</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (5% Medicines):</span>
                  <span className="font-mono">+₹{currentModalBill.gst}.00</span>
                </div>
                {currentModalBill.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Scheme Discount ({currentModalBill.schemeLabel}):</span>
                    <span className="font-mono">-₹{currentModalBill.discount}.00</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 font-extrabold text-xs pt-1 border-t border-slate-200">
                  <span>Final Payable:</span>
                  <span className="font-mono text-emerald-700 text-sm">₹{currentModalBill.netPayable}.00</span>
                </div>
              </div>
            </div>

            {/* If amount > 0, show Payment Modes and UPI QR */}
            {currentModalBill.netPayable > 0 ? (
              <div className="space-y-3">
                <label className="text-xs font-black uppercase text-slate-500 tracking-wider block">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: '📱 UPI QR (GPay/PhonePe)', icon: FaQrcode },
                    { id: 'cash', label: '💵 Cash at Counter', icon: FaMoneyBillWave },
                    { id: 'card', label: '💳 Credit / Debit Card', icon: FaCreditCard }
                  ].map(pm => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMode(pm.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        paymentMode === pm.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <pm.icon size={14} />
                      <span className="text-[10px] font-bold">{pm.label}</span>
                    </button>
                  ))}
                </div>

                {paymentMode === 'upi' && (
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                        Scan & Pay via Any UPI App:
                      </span>
                      <div className="text-xs text-slate-700">
                        GPay · PhonePe · Paytm · BHIM
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-900">
                        VPA: <span className="text-emerald-700">tvmch.pharmacy@sbi</span>
                      </div>
                      <div className="text-xs text-slate-500 font-semibold">
                        Amount: <strong>₹{currentModalBill.netPayable}.00</strong>
                      </div>
                    </div>

                    <div className="p-2 bg-white rounded-xl shadow-md border border-slate-200">
                      <QRCodeCanvas 
                        value={`upi://pay?pa=tvmch.pharmacy@sbi&pn=TVMCH_Pharmacy&am=${currentModalBill.netPayable}&cu=INR`} 
                        size={84} 
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center gap-2">
                <FaShieldAlt className="text-emerald-600 text-lg flex-shrink-0" />
                <div>
                  <strong>Government Welfare Scheme Waiver Applied:</strong>
                  <p className="text-[11px] text-emerald-700">
                    Patient is eligible for 100% free medicines. No out-of-pocket payment required!
                  </p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedOrderForPayment(null)}
                className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleConfirmPayment(selectedOrderForPayment.id, paymentMode, paymentScheme)}
                className="flex-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FaCheck />
                <span>
                  {currentModalBill.netPayable === 0 
                    ? 'Confirm Free Waiver & Settle' 
                    : `Confirm Payment (₹${currentModalBill.netPayable}) & Issue Bill`}
                </span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 7. Official Medical Tax Invoice / GST Bill Receipt Modal */}
      {selectedOrderForInvoice && (
        <Modal
          isOpen={Boolean(selectedOrderForInvoice)}
          onClose={() => setSelectedOrderForInvoice(null)}
          title={`Hospital GST Tax Invoice - Token #${selectedOrderForInvoice.tokenNumber}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 p-2 text-left font-sans">
            {/* The printable tax invoice receipt */}
            <div id="printable-gst-invoice" className="p-5 bg-white border border-slate-300 rounded-2xl space-y-3 shadow-xs">
              {/* Receipt Header */}
              <div className="text-center border-b pb-3 space-y-0.5">
                <h3 className="text-base font-black text-slate-950 uppercase tracking-tight">
                  {selectedOrderForInvoice.hospitalName}
                </h3>
                <div className="text-[10px] text-slate-500 font-semibold">
                  Central Pharmacy & OPD Dispensary Unit · Government of Tamil Nadu
                </div>
                <div className="text-[9px] font-mono text-slate-400">
                  GSTIN: 33AAAAA0000A1Z5 · Drug Lic No: TN-TVL-20B/1490
                </div>
              </div>

              {/* Invoice Meta */}
              <div className="grid grid-cols-2 gap-2 text-[11px] border-b pb-2">
                <div>
                  <span className="text-slate-400 text-[10px] block">Patient Name:</span>
                  <strong className="text-slate-900">{selectedOrderForInvoice.patientName}</strong> ({selectedOrderForInvoice.patientAge} Yrs)
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">Invoice No:</span>
                  <strong className="font-mono text-slate-900">#INV-TVM-2026-B{selectedOrderForInvoice.tokenNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Token / Room:</span>
                  <strong className="text-slate-900">Token #{selectedOrderForInvoice.tokenNumber}</strong> ({selectedOrderForInvoice.room || 'OPD 204'})
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">Date & Time:</span>
                  <strong className="text-slate-900">{selectedOrderForInvoice.date} {selectedOrderForInvoice.billing?.paidAt || '10:14 AM'}</strong>
                </div>
              </div>

              {/* Medicine Table */}
              <div className="space-y-1 text-[11px]">
                <div className="grid grid-cols-12 font-bold text-slate-500 border-b pb-1 text-[10px] uppercase">
                  <span className="col-span-1">#</span>
                  <span className="col-span-6">Medicine Item & Dosage</span>
                  <span className="col-span-2 text-center">Batch</span>
                  <span className="col-span-3 text-right">Amount</span>
                </div>

                {selectedOrderForInvoice.medicines.map((m, i) => (
                  <div key={i} className="grid grid-cols-12 text-slate-700 py-0.5 border-b border-slate-100 text-[11px]">
                    <span className="col-span-1 text-slate-400">{i + 1}</span>
                    <span className="col-span-6 font-semibold truncate">{m.name} ({m.dosage})</span>
                    <span className="col-span-2 text-center font-mono text-[9px] text-slate-500">{m.batch || 'PCM-65'}</span>
                    <span className="col-span-3 text-right font-mono font-bold text-slate-900">
                      ₹{i === 0 ? 15 : i === 1 ? 95 : 20}.00
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-2 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Gross Total (incl. 5% GST):</span>
                  <span className="font-mono">₹{selectedOrderForInvoice.billing?.grossTotal || 152}.00</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold text-[11px]">
                  <span>Government Subsidy / Discount:</span>
                  <span className="font-mono">-₹{selectedOrderForInvoice.billing?.discount || 152}.00</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 border-t pt-1">
                  <span>Net Amount Paid:</span>
                  <span className="font-mono text-emerald-800">
                    ₹{selectedOrderForInvoice.billing?.netPayable || 0}.00
                  </span>
                </div>
              </div>

              {/* Stamp and Payment Badge */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px]">Payment Reference:</span>
                  <strong className="text-slate-800 font-mono">
                    {selectedOrderForInvoice.billing?.transactionId || 'TXN-TVM-84920'}
                  </strong>
                  <div className="text-[10px] text-slate-500">
                    Mode: {selectedOrderForInvoice.billing?.paymentMethod || 'TNMSC 100% Free Scheme'}
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-300 uppercase tracking-wider inline-block">
                    ✓ {selectedOrderForInvoice.billing?.netPayable === 0 ? 'GOVT FREE' : 'PAID'}
                  </span>
                </div>
              </div>

              <div className="text-center text-[9px] text-slate-400 pt-1">
                Computer Generated Hospital Tax Invoice · Authorized by Chief Pharmacist R. Selvakumar (B.Pharm)
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrderForInvoice(null)}
                className="flex-1 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  window.print();
                  toast.success('Official Tax Invoice sent to printer! 🖨️');
                }}
                className="flex-2 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <FaPrint /> Print Official GST Tax Invoice
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 8. Enterprise 2-Inch Thermal Label & Medication Guide Modal */}
      {selectedOrderForLabel && (
        <Modal
          isOpen={Boolean(selectedOrderForLabel)}
          onClose={() => setSelectedOrderForLabel(null)}
          title={`Hospital Pharmacy Thermal Sticker - Token #${selectedOrderForLabel.tokenNumber}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 p-2 text-left font-sans">
            {/* The printable sticker box */}
            <div 
              id="printable-pharmacy-label"
              className="p-5 bg-white border-2 border-dashed border-slate-400 rounded-2xl space-y-3 shadow-inner"
            >
              <div className="flex items-start justify-between border-b pb-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider block">
                    Tamil Nadu Medical Services Corp (TNMSC)
                  </span>
                  <div className="text-xl font-mono font-black text-slate-950">
                    TOKEN #{selectedOrderForLabel.tokenNumber}
                  </div>
                  <div className="text-xs font-black text-slate-800">
                    {selectedOrderForLabel.patientName} ({selectedOrderForLabel.patientAge} Yrs / {selectedOrderForLabel.patientGender || 'M'})
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-mono font-black text-teal-900 bg-teal-100 px-2.5 py-1 rounded-md border border-teal-300 inline-block">
                    BIN #{selectedOrderForLabel.binNumber}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    {selectedOrderForLabel.date} · Counter 04
                  </div>
                </div>
              </div>

              {/* Medicine Table */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                  Verified Packed Medications ({selectedOrderForLabel.medicines.length}):
                </span>
                {selectedOrderForLabel.medicines.map((m, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-1 text-[11px]">
                    <div>
                      <strong className="text-slate-900">{i + 1}. {m.name}</strong>
                      <span className="text-slate-500 ml-1">({m.dosage})</span>
                    </div>
                    <span className="text-teal-800 font-bold font-mono text-[10px] bg-teal-50 px-1.5 py-0.5 rounded">
                      {m.frequency}
                    </span>
                  </div>
                ))}
              </div>

              {/* Doctor Notes */}
              {selectedOrderForLabel.notes && (
                <div className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <strong>Advice:</strong> {selectedOrderForLabel.notes}
                </div>
              )}

              {/* QR and Audio dosage bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="text-[10px] text-slate-500 max-w-[200px] leading-tight">
                  Scan QR with camera for <strong>Tamil Voice Dosage Timetable (குரல் வழி விளக்கம்)</strong>
                  <div className="text-[9px] font-mono text-slate-400 mt-0.5">Dispensed by: R. Selvakumar (B.Pharm)</div>
                </div>
                <div className="p-1.5 bg-white border border-slate-300 rounded-xl shadow-2xs">
                  <QRCodeCanvas value={`https://mediqueue.tvl/rx/${selectedOrderForLabel.id}`} size={64} />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrderForLabel(null)}
                className="flex-1 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  toast.success('Thermal Label sent to bag printer! 🖨️');
                }}
                className="flex-2 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <FaPrint /> Print 2-Inch Adhesive Bag Label
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PharmacyDispenseDashboard;
