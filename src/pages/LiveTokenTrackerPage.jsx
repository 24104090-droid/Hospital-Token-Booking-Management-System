import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useQueue } from '../context/QueueContext';
import { useLanguage } from '../context/LanguageContext';
import AppLayout from '../components/common/AppLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import QRScannerModal from '../components/queue/QRScannerModal';
import QueueAlertModal from '../components/queue/QueueAlertModal';
import TokenSwapDelayModal from '../components/queue/TokenSwapDelayModal';
import MessageCommunicationModal from '../components/communication/MessageCommunicationModal';
import MultiLinkModal from '../components/common/MultiLinkModal';
import { generatePrescriptionHtml } from '../components/records/HealthLocker';
import { QRCodeCanvas } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { speakTokenAnnouncement, playHospitalChime } from '../utils/hospitalAudio';
import { 
  FaHospital, 
  FaClock, 
  FaUserMd, 
  FaCheckCircle, 
  FaHourglassHalf, 
  FaExclamationTriangle,
  FaVolumeUp,
  FaShareAlt,
  FaWhatsapp,
  FaDoorOpen,
  FaMapMarkerAlt,
  FaQrcode,
  FaSyncAlt,
  FaPlay,
  FaPause,
  FaArrowLeft,
  FaPhoneAlt,
  FaCalendarAlt,
  FaTicketAlt,
  FaExchangeAlt,
  FaFilePrescription,
  FaPrint,
  FaDownload,
  FaPills,
  FaEye,
  FaRupeeSign,
  FaFileInvoiceDollar,
  FaCreditCard,
  FaMoneyBillWave,
  FaShieldAlt,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const LiveTokenTrackerPage = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { appointments: bookingAppointments, codeRedActive, codeRedDetails } = useBooking();
  const { appointments: queueAppointments } = useQueue();
  const { t, isTamil } = useLanguage();

  const [scannerOpen, setScannerOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMultiLinkModal, setShowMultiLinkModal] = useState(false);
  const [autoSimulate, setAutoSimulate] = useState(true);
  const [lastAnnouncedToken, setLastAnnouncedToken] = useState(null);

  // Combine and look for appointment
  const allAppointments = useMemo(() => {
    return [...(bookingAppointments || []), ...(queueAppointments || [])];
  }, [bookingAppointments, queueAppointments]);

  // Match by id or token number, or create realistic fallback for demo/scanned ID
  const matchedAppointment = useMemo(() => {
    if (!tokenId) {
      return allAppointments[0] || null;
    }
    const cleanId = decodeURIComponent(tokenId).trim();
    const found = allAppointments.find(
      a => a.id === cleanId || a.tokenNumber === parseInt(cleanId, 10) || a.id.toLowerCase().includes(cleanId.toLowerCase())
    );

    if (found) return found;

    // Realistic fallback for scanned ID (like TVL-TKN-5407 in user screenshot)
    const tokenNum = cleanId.includes('5407') ? 40 : (parseInt(cleanId.replace(/\D/g, '').slice(-2), 10) || 40);
    const servingNum = Math.max(1, tokenNum - 5);

    return {
      id: cleanId.startsWith('TVL-') ? cleanId : `TVL-TKN-${cleanId}`,
      tokenNumber: tokenNum,
      currentServing: servingNum,
      estimatedWaitMinutes: (tokenNum - servingNum) * 5,
      hospitalName: 'Tirunelveli Medical College Hospital (TVMCH)',
      hospitalAddress: 'High Grounds, Palayamkottai, Tirunelveli - 627011',
      doctorName: 'Dr. S. Sundararajan, MD (Gen Med)',
      room: 'OPD Block A - Room 102',
      department: 'General Medicine',
      patientName: 'Patient (Self)',
      patientAge: 32,
      patientGender: 'Male',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '10:00 AM - 10:20 AM',
      status: 'confirmed',
      consultationFee: 0
    };
  }, [tokenId, allAppointments]);

  // Dynamic live serving token state (starts at matched or default)
  const [currentServing, setCurrentServing] = useState(() => {
    return matchedAppointment?.currentServing || Math.max(1, (matchedAppointment?.tokenNumber || 40) - 5);
  });

  const myToken = matchedAppointment?.tokenNumber || 40;
  const patientsAhead = Math.max(0, myToken - currentServing);
  const isNowServing = currentServing === myToken;
  const isNextInLine = currentServing === myToken - 1;
  const isCompleted = currentServing > myToken;
  const isWaiting = currentServing < myToken - 1;

  // Live Token Doctor E-Prescription State
  const [tokenPrescription, setTokenPrescription] = useState(null);
  const [rxDetailsModalOpen, setRxDetailsModalOpen] = useState(false);

  // Billing & Payment States
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi_qr');
  const [selectedScheme, setSelectedScheme] = useState('jan_aushadhi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Helper for computing billing
  const calculateBilling = (medicines = [], scheme = 'jan_aushadhi') => {
    const getPrice = (name = '') => {
      const l = name.toLowerCase();
      if (l.includes('paracetamol')) return 25;
      if (l.includes('amoxicillin')) return 85;
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
      const price = m.unitPrice || getPrice(m.name);
      return {
        name: m.name,
        dosage: m.dosage || 'Standard',
        batch: m.batch || `LOT-2026-B${30 + i * 14}`,
        itemNumber: i + 1,
        hsnCode: '3004',
        unitPrice: price,
        qty: 1,
        total: price
      };
    });

    const subtotal = items.reduce((acc, curr) => acc + curr.total, 0);
    const gst = Math.round(subtotal * 0.05);
    const grossTotal = subtotal + gst;

    let discount = 0;
    let netPayable = grossTotal;
    let schemeLabel = 'Standard Retail Billing';

    if (scheme === 'govt_free') {
      discount = grossTotal;
      netPayable = 0;
      schemeLabel = 'TNMSC 100% Free Govt Scheme';
    } else if (scheme === 'jan_aushadhi') {
      discount = Math.round(grossTotal * 0.70);
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
      schemeLabel,
      scheme
    };
  };

  // Memoized current billing object
  const currentBilling = useMemo(() => {
    if (!tokenPrescription) return null;
    if (tokenPrescription.billing) {
      return tokenPrescription.billing;
    }
    const calculated = calculateBilling(tokenPrescription.medicines || [], 'jan_aushadhi');
    return {
      scheme: 'jan_aushadhi',
      schemeLabel: calculated.schemeLabel,
      grossTotal: calculated.grossTotal,
      discount: calculated.discount,
      netPayable: calculated.netPayable,
      paymentStatus: 'unpaid',
      paymentMethod: null,
      transactionId: null,
      paidAt: null,
      items: calculated.items,
      subtotal: calculated.subtotal,
      gst: calculated.gst
    };
  }, [tokenPrescription]);

  // Poll / check local health records for this token
  useEffect(() => {
    const checkTokenPrescription = () => {
      try {
        const records = JSON.parse(localStorage.getItem('tvl_health_records') || '[]');
        const found = records.find(r => 
          r.tokenNumber === myToken || 
          r.tokenNumber === parseInt(myToken, 10) ||
          r.id === `rx-tvl-token-${myToken}` ||
          (tokenId && (r.id?.includes(tokenId) || String(r.tokenNumber) === String(tokenId)))
        );
        setTokenPrescription(found || null);
      } catch (err) {
        console.error(err);
      }
    };

    checkTokenPrescription();
    const interval = setInterval(checkTokenPrescription, 2000);
    return () => clearInterval(interval);
  }, [myToken, tokenId]);

  // Simulate Doctor issuing prescription directly to this token
  const handleSimulateDoctorSendRx = () => {
    const rxMeds = [
      { name: 'Paracetamol', dosage: '650 mg', frequency: '1-0-1 (After Food)', duration: '3 Days' },
      { name: 'Amoxicillin + Clavulanic Acid', dosage: '625 mg', frequency: '1-0-1 (After Food)', duration: '5 Days' },
      { name: 'Montelukast + Levocetirizine', dosage: '10mg/5mg', frequency: '0-0-1 (Night)', duration: '7 Days' },
      { name: 'Pantoprazole', dosage: '40 mg', frequency: '1-0-0 (Before Food)', duration: '5 Days' }
    ];
    const billCalc = calculateBilling(rxMeds, 'jan_aushadhi');

    const rx = {
      id: `rx-tvl-token-${myToken}`,
      tokenNumber: myToken,
      patientName: matchedAppointment?.patientName || 'Patient (Self)',
      doctorName: matchedAppointment?.doctorName || 'Dr. S. Sundararajan, MD',
      hospitalName: matchedAppointment?.hospitalName || 'Tirunelveli Medical College Hospital (TVMCH)',
      date: new Date().toISOString().split('T')[0],
      diagnosis: 'Acute Viral Bronchitis & Pharyngitis',
      specialty: matchedAppointment?.department || 'General Medicine (OPD)',
      medicines: rxMeds,
      billing: {
        scheme: 'jan_aushadhi',
        schemeLabel: billCalc.schemeLabel,
        grossTotal: billCalc.grossTotal,
        discount: billCalc.discount,
        netPayable: billCalc.netPayable,
        paymentStatus: 'unpaid',
        paymentMethod: null,
        transactionId: null,
        paidAt: null,
        items: billCalc.items,
        subtotal: billCalc.subtotal,
        gst: billCalc.gst
      },
      notes: `Official E-Prescription issued for Token #${myToken}. Follow dosage timetable strictly. Avoid ice water and direct cold wind.`,
      verified: true,
      fileType: `Doctor E-Prescription (Token #${myToken})`,
      pharmacyStatus: 'packing',
      pharmacyCounter: 'Counter 4 (Express OPD Dispenser)',
      binNumber: `B-${myToken}`,
      pickupOtp: `${Math.floor(1000 + Math.random() * 9000)}`,
      receivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      const existing = JSON.parse(localStorage.getItem('tvl_health_records') || '[]');
      const filtered = existing.filter(r => r.id !== rx.id);
      localStorage.setItem('tvl_health_records', JSON.stringify([rx, ...filtered]));
      window.dispatchEvent(new Event('storage'));
      setTokenPrescription(rx);
      toast.success(isTamil 
        ? `டாக்டர் டோக்கன் #${myToken}-க்கு மருந்துச்சீட்டு அனுப்பியுள்ளார்! ✅` 
        : `Doctor has sent E-Prescription to Token #${myToken}! ✅`
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Process Patient Online Payment (UPI / GPay / PhonePe / Free Exemption)
  const handleProcessPatientPayment = (methodName = 'UPI QR (GPay / PhonePe)') => {
    if (!tokenPrescription || !currentBilling) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      const isFree = selectedScheme === 'govt_free';
      const recalculated = calculateBilling(tokenPrescription.medicines || [], selectedScheme);
      const payableAmount = isFree ? 0 : recalculated.netPayable;
      const txnId = isFree 
        ? `TNMSC-FREE-${Math.floor(100000 + Math.random() * 899999)}`
        : `UPI-TVM-${Math.floor(100000 + Math.random() * 899999)}`;
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const updatedBilling = {
        ...currentBilling,
        scheme: selectedScheme,
        schemeLabel: recalculated.schemeLabel,
        grossTotal: recalculated.grossTotal,
        discount: recalculated.discount,
        netPayable: payableAmount,
        items: recalculated.items,
        subtotal: recalculated.subtotal,
        gst: recalculated.gst,
        paymentStatus: isFree ? 'govt_free' : 'paid',
        paymentMethod: isFree ? 'TNMSC 100% Free Scheme' : methodName,
        transactionId: txnId,
        paidAt: nowTime
      };

      const updatedRx = {
        ...tokenPrescription,
        billing: updatedBilling,
        pharmacyStatus: tokenPrescription.pharmacyStatus === 'queued' ? 'packing' : tokenPrescription.pharmacyStatus
      };

      try {
        const records = JSON.parse(localStorage.getItem('tvl_health_records') || '[]');
        const filtered = records.filter(r => r.id !== updatedRx.id);
        const newRecords = [updatedRx, ...filtered];
        localStorage.setItem('tvl_health_records', JSON.stringify(newRecords));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error(e);
      }

      setTokenPrescription(updatedRx);
      setIsProcessingPayment(false);
      setPaymentModalOpen(false);

      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });

      toast.success(
        isFree 
          ? `🛡️ ${isTamil ? 'அரசு திட்டத்தின் கீழ் 100% இலவச மருந்து உறுதி செய்யப்பட்டது!' : '100% Free Govt Healthcare Verified!'}`
          : `🎉 ${isTamil ? `₹${payableAmount} கட்டணம் வெற்றிகரமாக செலுத்தப்பட்டது!` : `Payment of ₹${payableAmount} via ${methodName} successful!`}`,
        { duration: 5000 }
      );
    }, 1200);
  };

  const handleDownloadPrescription = (rec) => {
    if (!rec) return;
    try {
      const htmlContent = generatePrescriptionHtml(rec);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Prescription_Token_${rec.tokenNumber || myToken}_${rec.id}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(isTamil ? 'மருந்துச்சீட்டு பதிவிறக்கம் செய்யப்பட்டது! 📄' : 'Prescription downloaded! 📄');
    } catch (e) {
      toast.error('Download failed.');
    }
  };

  const handlePrintPrescription = (rec) => {
    if (!rec) return;
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
      toast.error('Pop-up was blocked. Please allow popups.');
    }
  };

  // Generate Tax Invoice HTML
  const generateInvoiceHtml = (rx, billing) => {
    const items = billing?.items && billing.items.length > 0 ? billing.items : (rx.medicines || []).map((m, i) => ({
      name: m.name,
      dosage: m.dosage || 'Standard',
      batch: m.batch || `TNMSC-B${20 + i}`,
      hsnCode: '3004',
      qty: 1,
      unitPrice: 35,
      total: 35
    }));

    const itemsRows = items.map((it, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 13px;">
        <td style="padding: 10px; text-align: center;">${idx + 1}</td>
        <td style="padding: 10px;"><strong>${it.name}</strong> <span style="color:#64748b;">(${it.dosage})</span></td>
        <td style="padding: 10px; text-align: center; font-family: monospace;">${it.hsnCode || '3004'}</td>
        <td style="padding: 10px; text-align: center; font-family: monospace;">${it.batch || 'TNMSC-LOT'}</td>
        <td style="padding: 10px; text-align: center;">${it.qty || 1}</td>
        <td style="padding: 10px; text-align: right;">₹${it.unitPrice || 35}.00</td>
        <td style="padding: 10px; text-align: right; font-weight: bold;">₹${it.total || 35}.00</td>
      </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>GST Medical Tax Invoice - Token #${rx.tokenNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 24px; color: #0f172a; background: #fff; }
    .header { border-bottom: 2px solid #0f766e; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; }
    .title { font-size: 20px; font-weight: 800; color: #0f766e; margin: 0; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .badge-paid { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .badge-free { background: #ecfdf5; color: #065f46; border: 1px solid #6ee7b7; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { background: #f1f5f9; padding: 10px; font-size: 12px; text-transform: uppercase; color: #475569; text-align: left; }
    .total-box { margin-top: 20px; margin-left: auto; width: 320px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; background: #f8fafc; }
    .total-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
    .stamp { border: 2px dashed #0f766e; color: #0f766e; border-radius: 8px; padding: 10px 16px; display: inline-block; font-weight: 900; font-size: 12px; text-align: center; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div style="font-size: 11px; font-weight: bold; color: #0f766e; text-transform: uppercase; letter-spacing: 1px;">Government of Tamil Nadu · Health & Family Welfare</div>
      <h1 class="title">${rx.hospitalName || 'Tirunelveli Medical College Hospital'}</h1>
      <div style="font-size: 12px; color: #64748b; margin-top: 2px;">OPD Central Pharmacy Dispense Unit · Counter 04 · High Grounds, Palayamkottai</div>
      <div style="font-size: 11px; color: #334155; margin-top: 4px;"><strong>GSTIN:</strong> 33AAAGT0194P1Z3 | <strong>Drug Lic:</strong> DL-TN-TVL-2024-8849</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 16px; font-weight: 900; color: #0f172a;">TAX INVOICE / CASH BILL</div>
      <div style="font-size: 12px; font-family: monospace; color: #64748b; margin-top: 2px;">Bill No: INV-TVM-2026-${rx.tokenNumber}</div>
      <div style="font-size: 12px; color: #64748b;">Date: ${rx.date || new Date().toISOString().split('T')[0]} | Time: ${billing?.paidAt || '10:00 AM'}</div>
      <div style="margin-top: 6px;">
        <span class="badge ${billing?.paymentStatus === 'govt_free' ? 'badge-free' : 'badge-paid'}">
          ${billing?.paymentStatus === 'govt_free' ? '100% Free Govt Subsidy (Exempt)' : 'Paid Online (UPI Settlement)'}
        </span>
      </div>
    </div>
  </div>

  <div style="display: flex; justify-content: space-between; background: #f8fafc; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 13px;">
    <div>
      <div>Patient Name: <strong>${rx.patientName || 'Patient (Self)'}</strong></div>
      <div>Assigned Doctor: <strong>${rx.doctorName || 'Dr. S. Sundararajan, MD'}</strong> (${rx.specialty || 'General Medicine'})</div>
    </div>
    <div style="text-align: right;">
      <div>OPD Token: <strong style="font-size: 15px; color: #0f766e;">#${rx.tokenNumber}</strong></div>
      <div>Dispense Bin: <strong>${rx.binNumber || 'Bin #B-' + rx.tokenNumber}</strong> | Counter: <strong>Counter 04</strong></div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="text-align: center; width: 40px;">#</th>
        <th>Particulars / Medicine Name</th>
        <th style="text-align: center; width: 70px;">HSN</th>
        <th style="text-align: center; width: 100px;">Batch</th>
        <th style="text-align: center; width: 50px;">Qty</th>
        <th style="text-align: right; width: 80px;">Rate</th>
        <th style="text-align: right; width: 90px;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows}
    </tbody>
  </table>

  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24px;">
    <div>
      <div class="stamp">
        ✓ TVMCH OPD PHARMACY<br/>
        DIGITALLY VERIFIED & DISPENSED<br/>
        <span style="font-size: 10px; font-weight: normal;">Ref: ${billing?.transactionId || 'TXN-TVM-ONLINE'}</span>
      </div>
      <div style="font-size: 11px; color: #64748b; margin-top: 8px;">
        Payment Mode: <strong>${billing?.paymentMethod || 'UPI QR / Online'}</strong> | Status: <strong>Settled</strong>
      </div>
    </div>

    <div class="total-box">
      <div class="total-row"><span>Sub Total:</span><span>₹${billing?.subtotal || 140}.00</span></div>
      <div class="total-row"><span>CGST (2.5%):</span><span>₹${Math.round((billing?.gst || 7) / 2)}.00</span></div>
      <div class="total-row"><span>SGST (2.5%):</span><span>₹${Math.round((billing?.gst || 7) / 2)}.00</span></div>
      <div class="total-row" style="border-top: 1px dashed #cbd5e1; padding-top: 4px;"><span>Gross Amount:</span><span>₹${billing?.grossTotal || 147}.00</span></div>
      <div class="total-row" style="color: #0f766e; font-weight: bold;"><span>Scheme Subsidy / Discount:</span><span>-₹${billing?.discount || 0}.00</span></div>
      <div class="total-row" style="border-top: 2px solid #0f766e; padding-top: 6px; font-size: 16px; font-weight: 900; color: #0f766e;">
        <span>Net Amount Paid:</span><span>₹${billing?.netPayable || 0}.00</span>
      </div>
    </div>
  </div>

  <div style="margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center;">
    This is an official computer-generated digital tax invoice issued by Tirunelveli Medical College Hospital OPD Express Pharmacy. No physical signature required.
  </div>
</body>
</html>
    `;
  };

  const handlePrintInvoice = (rx, billing) => {
    if (!rx || !billing) return;
    const htmlContent = generateInvoiceHtml(rx, billing);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 350);
    } else {
      toast.error('Pop-up was blocked. Please allow popups.');
    }
  };

  const handleDownloadInvoice = (rx, billing) => {
    if (!rx || !billing) return;
    try {
      const htmlContent = generateInvoiceHtml(rx, billing);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Medical_Tax_Invoice_Token_${rx.tokenNumber || myToken}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(isTamil ? 'மருத்துவ ரசீது பதிவிறக்கம் செய்யப்பட்டது! 📄' : 'Medical Invoice downloaded! 📄');
    } catch (e) {
      toast.error('Download failed.');
    }
  };

  // Trigger celebration when myToken is called
  useEffect(() => {
    if (isNowServing) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      playVoiceAnnouncement(myToken, true);
    }
  }, [isNowServing, myToken]);

  // Voice Announcement using Web Audio Melodic Chime & Web Speech API (Tamil / English)
  const playVoiceAnnouncement = (tokenNumToAnnounce, isUrgent = false) => {
    const doctorRoom = matchedAppointment?.room || 'Room 102';
    const doctorName = matchedAppointment?.doctorName || 'Dr. Sundararajan';
    const patientName = matchedAppointment?.patientName || '';

    // Trigger hospital melodic chime + bilingual announcement
    speakTokenAnnouncement({
      tokenNumber: tokenNumToAnnounce,
      patientName: tokenNumToAnnounce === myToken ? patientName : '',
      room: doctorRoom,
      doctorName,
      lang: isTamil ? 'ta' : 'both'
    });

    const displayMsg = isTamil
      ? `டோக்கன் எண் ${tokenNumToAnnounce}, அறை ${doctorRoom}-க்கு வரவும்`
      : `Token #${tokenNumToAnnounce}, please proceed to ${doctorRoom}`;

    toast.success(`📢 ${isTamil ? 'அறிவிப்பு:' : 'Announcement:'} "${displayMsg}"`, {
      icon: '🔔',
      duration: 4000
    });
  };

  // Auto-simulation of queue movement every 16 seconds
  useEffect(() => {
    if (!autoSimulate) return;
    const interval = setInterval(() => {
      setCurrentServing(prev => {
        if (prev < myToken + 3) {
          const next = prev + 1;
          playVoiceAnnouncement(next, next === myToken);
          return next;
        }
        return prev;
      });
    }, 16000);
    return () => clearInterval(interval);
  }, [autoSimulate, myToken]);

  // Manual next token control
  const handleAdvanceQueue = () => {
    const next = currentServing + 1;
    setCurrentServing(next);
    playVoiceAnnouncement(next, next === myToken);
  };

  // Fast forward to "My Token"
  const handleCallMyToken = () => {
    setCurrentServing(myToken);
    playVoiceAnnouncement(myToken, true);
  };

  // Reset Queue
  const handleResetQueue = () => {
    const initial = Math.max(1, myToken - 5);
    setCurrentServing(initial);
    toast.success(isTamil ? 'வரிசை ஆரம்ப நிலைக்கு மீட்டமைக்கப்பட்டது' : 'Queue reset to initial position');
  };

  // Copy shareable link
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success(isTamil ? 'நேரடி கண்காணிப்பு இணைப்பு நகலெடுக்கப்பட்டது!' : 'Live Tracking Link Copied!');
    }
  };

  const estimatedMinutes = isCompleted ? 0 : isNowServing ? 0 : patientsAhead * 5;

  return (
    <AppLayout>
      <div className="w-full max-w-5xl lg:max-w-6xl mx-auto space-y-6 text-left animate-fadeIn pb-12">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Go Back"
            >
              <FaArrowLeft size={14} />
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 block">
                {isTamil ? 'நிகழ்நேர OPD வரிசை கண்காணிப்பகம்' : 'REAL-TIME OPD QUEUE TRACKER'}
              </span>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                {matchedAppointment?.hospitalName || 'Tirunelveli Medical College Hospital'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScannerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <FaQrcode size={13} className="text-sky-600" />
              <span>{isTamil ? 'மற்றொரு QR ஸ்கேன்' : 'Scan Other QR'}</span>
            </button>

            <Link
              to="/opd-display"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-teal-300 text-xs font-bold transition-all border border-slate-700 cursor-pointer shadow-2xs hover:bg-slate-800"
              title="View Waiting Hall Smart TV Display"
            >
              <span>📺 {isTamil ? 'டிவி திரை' : 'TV Screen'}</span>
            </Link>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-all border border-sky-200 cursor-pointer shadow-2xs"
            >
              <FaShareAlt size={12} />
              <span>{isTamil ? 'பகிர்' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* 🚨 Code Red Emergency Active Alert */}
        {codeRedActive && (
          <div className="rounded-2xl bg-gradient-to-r from-red-950 via-rose-900 to-red-950 border-2 border-red-500 shadow-xl p-4 text-white animate-pulse flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center text-xl shrink-0">
              <FaExclamationTriangle />
            </div>
            <div>
              <div className="text-[11px] font-black tracking-widest uppercase text-yellow-300">
                🚨 {isTamil ? 'அவசர சிகிச்சை முன்னுரிமை (CODE RED)' : 'EMERGENCY TRAUMA OVERRIDE (CODE RED)'}
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-white">
                {isTamil 
                  ? 'அவசர சிகிச்சை காரணமாக வரிசை 15 நிமிடம் நிறுத்தி வைக்கப்பட்டுள்ளது. தயவுசெய்து காத்திருக்கவும்.' 
                  : 'Consultations are temporarily held for 15 minutes due to Code Red trauma triage in Room 102.'}
              </div>
            </div>
          </div>
        )}

        {/* Live Status Hero Banner (Hospital Electronic LED Board Theme) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white p-6 sm:p-8 shadow-2xl border border-sky-500/30">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <FaHospital size={160} />
          </div>

          {/* Hospital Header & Live Pulse */}
          <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                {isTamil ? 'நேரலை OPD கவுண்டர் இயங்குகிறது' : 'LIVE OPD COUNTER ONLINE'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-sky-300 bg-sky-950/80 px-3 py-1 rounded-xl border border-sky-800">
              <FaTicketAlt size={12} />
              <span>PASS ID: <strong>{matchedAppointment?.id}</strong></span>
            </div>
          </div>

          {/* Hero Counter Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 relative z-10">
            {/* Left Box: Your Token */}
            <div className="bg-slate-900/80 border border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-center text-center backdrop-blur-xs">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                {isTamil ? 'உங்களுடைய டோக்கன் எண்' : 'YOUR OPD TOKEN'}
              </span>
              <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-white drop-shadow-md my-1">
                #{myToken}
              </div>
              {matchedAppointment?.isDelayed && (
                <div className="mb-1">
                  <span className="badge bg-amber-400 text-amber-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                    ⏱️ +{matchedAppointment.delayMinutes || 15}m Delayed
                  </span>
                </div>
              )}
              {matchedAppointment?.isSwapped && (
                <div className="mb-1">
                  <span className="badge bg-purple-400 text-purple-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                    🔄 Swapped Token
                  </span>
                </div>
              )}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-sky-200 mt-2">
                <span>{matchedAppointment?.patientName}</span>
                <span>•</span>
                <span>{matchedAppointment?.room}</span>
              </div>
            </div>

            {/* Right Box: Current Serving */}
            <div className={`rounded-3xl p-6 flex flex-col items-center justify-center text-center border-2 transition-all ${
              isNowServing 
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-400 text-white shadow-lg ring-4 ring-emerald-400/30 animate-pulse'
                : isNextInLine
                ? 'bg-gradient-to-br from-amber-600 to-orange-700 border-amber-400 text-white shadow-lg ring-4 ring-amber-400/30'
                : 'bg-slate-900/80 border-sky-500/50 text-white backdrop-blur-xs'
            }`}>
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-200 block mb-1">
                {isTamil ? 'தற்போது அழைக்கப்படும் எண்' : 'NOW CALLING AT COUNTER'}
              </span>
              <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight my-1">
                #{currentServing}
              </div>
              <div className="text-xs font-bold mt-2">
                {isNowServing ? (
                  <span className="bg-white text-emerald-900 px-3 py-1 rounded-full font-black flex items-center gap-1">
                    <FaCheckCircle /> {isTamil ? 'தற்போது உங்கள் முறை! அறைக்குள் செல்லவும்' : 'NOW SERVING! Please Enter Room 102'}
                  </span>
                ) : isNextInLine ? (
                  <span className="bg-white text-amber-900 px-3 py-1 rounded-full font-black flex items-center gap-1">
                    <FaExclamationTriangle /> {isTamil ? 'அடுத்து உங்கள் முறை! தயாராக இருக்கவும்' : 'NEXT IN LINE! Please Stand Near Room 102'}
                  </span>
                ) : isCompleted ? (
                  <span className="bg-emerald-400/20 text-emerald-300 px-3 py-1 rounded-full">
                    ✓ {isTamil ? 'மருத்துவ ஆலோசனை முடிந்தது' : 'Consultation Completed'}
                  </span>
                ) : (
                  <span className="text-sky-300">
                    {patientsAhead} {isTamil ? 'நபர்கள் உங்களுக்கு முன் உள்ளனர்' : 'Patients Ahead in Queue'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Proximity Strip */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <FaClock size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  {isTamil ? 'தோராய காத்திருப்பு நேரம்' : 'Estimated Wait Time'}
                </span>
                <span className="text-base font-black text-white">
                  {isNowServing ? (
                    <strong className="text-emerald-400">{isTamil ? '0 நிமிடம் (உடனடி)' : '0 Mins (Immediate)'}</strong>
                  ) : isCompleted ? (
                    <strong className="text-slate-400">{isTamil ? 'முடிந்தது' : 'Completed'}</strong>
                  ) : (
                    `~${estimatedMinutes} ${isTamil ? 'நிமிடங்கள்' : 'Minutes'}`
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSwapModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black transition-all cursor-pointer shadow-sm text-xs"
                title={isTamil ? 'டிராஃபிக் அல்லது பஸ் தாமதம்? 15 நிமிட அவகாசம் அல்லது டோக்கன் இடமாற்றம்' : 'Traffic or bus delay? Request 15-minute buffer delay or swap token'}
              >
                <FaExchangeAlt />
                <span>{isTamil ? 'டிராஃபிக் தாமதம்? 15m தாமதம் / இடமாற்றம்' : 'Delay 15m / Swap Token'}</span>
              </button>

              <button
                type="button"
                onClick={() => playVoiceAnnouncement(currentServing)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer border border-white/10"
              >
                <FaVolumeUp className="text-sky-300" />
                <span>{isTamil ? 'அறிவிப்பு ஒலி' : 'Voice Audio'}</span>
              </button>

              <button
                type="button"
                onClick={() => setAlertModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer shadow-sm"
              >
                <FaWhatsapp />
                <span>{isTamil ? 'WhatsApp எச்சரிக்கை' : 'WhatsApp Alert'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMessageModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer shadow-sm"
                title="Send Token Pass via WhatsApp, SMS, or Email"
              >
                <span>📨 {isTamil ? 'அனுமதிச்சீட்டு அனுப்பு' : 'Pass (WA/SMS/Email)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMultiLinkModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold transition-all cursor-pointer shadow-sm"
                title="Open Multi-Links Portal Hub"
              >
                <span>🔗 {isTamil ? 'மல்டி-லிங்க்ஸ்' : 'Multi-Links'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Simulation Control Panel (For Demo & Verification) */}
        <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <span className="text-sky-700 font-black flex items-center gap-1">
              <FaSyncAlt className={autoSimulate ? 'animate-spin' : ''} />
              {isTamil ? 'நிகழ்நேர வரிசை சிமுலேஷன்:' : 'Live Queue Simulator:'}
            </span>
            <span className="text-slate-600 text-[11px]">
              {autoSimulate 
                ? (isTamil ? 'தானாக வரிசை நகர்கிறது (16 வினாடிகளுக்கு ஒரு முறை)' : 'Auto-advancing every 16 seconds') 
                : (isTamil ? 'நிறுத்தப்பட்டுள்ளது' : 'Paused')}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setAutoSimulate(!autoSimulate)}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                autoSimulate
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {autoSimulate ? <FaPause size={10} /> : <FaPlay size={10} />}
              <span>{autoSimulate ? (isTamil ? 'நிறுத்து' : 'Pause Auto') : (isTamil ? 'இயக்கு' : 'Resume Auto')}</span>
            </button>

            <button
              type="button"
              onClick={handleAdvanceQueue}
              className="px-3 py-1 rounded-xl text-xs font-black bg-white hover:bg-sky-50 text-sky-800 border border-sky-300 shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <span>+1 {isTamil ? 'அடுத்த டோக்கன்' : 'Next Token'}</span>
            </button>

            <button
              type="button"
              onClick={handleCallMyToken}
              className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
            >
              <span>{isTamil ? `என் டோக்கனை அழை (#${myToken})` : `Call My Token (#${myToken})`}</span>
            </button>

            <button
              type="button"
              onClick={handleResetQueue}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
            >
              {isTamil ? 'மீட்டமை' : 'Reset'}
            </button>
          </div>
        </div>

        {/* Step-by-Step OPD Journey Timeline */}
        <Card className="p-6">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2">
            <FaHourglassHalf className="text-sky-600" />
            <span>{isTamil ? 'OPD ஆலோசனை வரிசை படிகள்' : 'OPD Consultation Progress Timeline'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {/* Step 1: Token Pass Issued */}
            <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-2 shadow-xs">
                ✓
              </div>
              <span className="text-xs font-black text-slate-900">{isTamil ? 'டோக்கன் பதிவு' : 'Token Issued'}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">{isTamil ? 'QR சரிபார்க்கப்பட்டது' : 'QR Verified'}</span>
            </div>

            {/* Step 2: Waiting in Hall */}
            <div className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
              isWaiting || isNextInLine
                ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-200'
                : isNowServing || isCompleted
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 shadow-xs ${
                isWaiting || isNextInLine
                  ? 'bg-sky-600 text-white animate-pulse'
                  : isNowServing || isCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-300 text-slate-600'
              }`}>
                {isNowServing || isCompleted ? '✓' : '2'}
              </div>
              <span className="text-xs font-black text-slate-900">{isTamil ? 'காத்திருப்பு கூடம்' : 'Waiting Lobby'}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                {isNextInLine ? (isTamil ? 'அடுத்து உங்கள் முறை!' : 'Next in Line!') : (isTamil ? 'தற்போது இங்குள்ளீர்கள்' : 'Current Stage')}
              </span>
            </div>

            {/* Step 3: In Consultation Room */}
            <div className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
              isNowServing
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 animate-pulse'
                : isCompleted
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 shadow-xs ${
                isNowServing
                  ? 'bg-emerald-600 text-white'
                  : isCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-300 text-slate-600'
              }`}>
                {isCompleted ? '✓' : '3'}
              </div>
              <span className="text-xs font-black text-slate-900">{isTamil ? 'மருத்துவ ஆலோசனை' : 'In Consultation'}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">{matchedAppointment?.room || 'Room 102'}</span>
            </div>

            {/* Step 4: Pharmacy / Prescription Delivery */}
            <div className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
              tokenPrescription
                ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300'
                : isCompleted
                ? 'bg-sky-50 border-sky-300'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 shadow-xs ${
                tokenPrescription
                  ? 'bg-emerald-600 text-white'
                  : isCompleted
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-300 text-slate-600'
              }`}>
                {tokenPrescription ? '✓' : '4'}
              </div>
              <span className="text-xs font-black text-slate-900">
                {tokenPrescription 
                  ? (isTamil ? 'மருந்துச்சீட்டு தயார்' : 'Rx Ready on Token') 
                  : (isTamil ? 'மருந்தகம் / Rx' : 'Pharmacy / Rx')}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                {tokenPrescription 
                  ? (isTamil ? `டோக்கன் #${myToken}` : `Sent to Token #${myToken}`) 
                  : (isTamil ? 'கவுண்டர் 6' : 'Counter 6')}
              </span>
            </div>
          </div>
        </Card>

        {/* Doctor Token E-Prescription Card */}
        {tokenPrescription ? (
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-6 text-white border-2 border-emerald-400/40 shadow-xl space-y-4 text-left relative overflow-hidden animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-black uppercase">
                  <FaCheckCircle className="text-emerald-400" />
                  <span>{isTamil ? `டோக்கன் #${myToken}-க்கு மருத்துவர் மருந்துச்சீட்டு அனுப்பியுள்ளார்!` : `Official E-Prescription Issued for Token #${myToken}`}</span>
                </div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <FaFilePrescription className="text-emerald-400" />
                  <span>{tokenPrescription.diagnosis}</span>
                </h3>
                <p className="text-xs text-sky-200">
                  {tokenPrescription.hospitalName} · <strong>{tokenPrescription.doctorName}</strong> · Date: {tokenPrescription.date}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setRxDetailsModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FaEye />
                  <span>{isTamil ? 'முழு விவரம்' : 'View Regimen'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePrintPrescription(tokenPrescription)}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FaPrint />
                  <span>{isTamil ? 'அச்சு' : 'Print Slip'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadPrescription(tokenPrescription)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FaDownload />
                  <span>{isTamil ? 'பதிவிறக்கம்' : 'Download Rx'}</span>
                </button>
              </div>
            </div>

            {/* Prescribed Medicines Summary Pills */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-teal-300">
                  <FaPills /> {isTamil ? 'பரிந்துரைக்கப்பட்ட மருந்துகள்' : 'Prescribed Medicines'} ({tokenPrescription.medicines?.length || 0})
                </span>
                <Link to="/records" className="text-sky-300 hover:text-sky-200 font-bold underline">
                  {isTamil ? 'பெட்டகத்தில் காண்க →' : 'Health Locker →'}
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {tokenPrescription.medicines?.map((m, idx) => (
                  <div key={idx} className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-xs">
                    <strong className="text-white block truncate">{m.name} <span className="text-slate-400 font-normal">({m.dosage})</span></strong>
                    <div className="text-[11px] text-emerald-300 mt-0.5">{m.frequency} · {m.duration}</div>
                  </div>
                ))}
              </div>

              {tokenPrescription.notes && (
                <div className="text-[11px] text-amber-200 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/40 mt-2">
                  <strong>Advice:</strong> {tokenPrescription.notes}
                </div>
              )}
            </div>

            {/* Live Pharmacy Billing & Payment Status Card */}
            {currentBilling && (
              <div className={`p-4 rounded-2xl border transition-all text-xs ${
                currentBilling.paymentStatus === 'paid'
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-white'
                  : currentBilling.paymentStatus === 'govt_free'
                  ? 'bg-teal-950/70 border-teal-500/50 text-white'
                  : 'bg-amber-950/60 border-amber-500/50 text-white shadow-lg'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-sky-300">
                        <FaRupeeSign /> {isTamil ? 'மருந்தக பில்லிங் & கட்டணம்:' : 'Pharmacy Billing & Payment:'}
                      </span>
                      
                      {currentBilling.paymentStatus === 'paid' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase flex items-center gap-1">
                          <FaCheckCircle /> {isTamil ? `செலுத்தப்பட்டது: ₹${currentBilling.netPayable}` : `Paid Online: ₹${currentBilling.netPayable}`}
                        </span>
                      ) : currentBilling.paymentStatus === 'govt_free' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 text-[10px] font-black uppercase flex items-center gap-1">
                          <FaShieldAlt /> {isTamil ? '100% அரசு இலவசம் (விலக்கு)' : '100% Free Govt Healthcare'}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase flex items-center gap-1 animate-pulse">
                          <FaRupeeSign /> {isTamil ? `நிலுவைத் தொகை: ₹${currentBilling.netPayable}` : `Bill Due: ₹${currentBilling.netPayable}`}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-300 flex items-center gap-2 flex-wrap">
                      <span>Scheme: <strong>{currentBilling.schemeLabel || 'Jan Aushadhi Generic'}</strong></span>
                      <span>·</span>
                      <span>Total: <strong className="line-through text-slate-400">₹{currentBilling.grossTotal}</strong></span>
                      <span>·</span>
                      <span className="text-emerald-400 font-bold">Subsidy: -₹{currentBilling.discount}</span>
                      <span>·</span>
                      <span className="text-white font-extrabold text-xs">Net: ₹{currentBilling.netPayable}</span>
                    </div>

                    {currentBilling.paymentStatus === 'paid' && (
                      <p className="text-[10px] text-emerald-300">
                        ✓ Settled via <strong>{currentBilling.paymentMethod || 'UPI QR'}</strong> (Txn: {currentBilling.transactionId}) · Express pickup active!
                      </p>
                    )}
                    {currentBilling.paymentStatus === 'govt_free' && (
                      <p className="text-[10px] text-teal-300">
                        ✓ Covered 100% by Chief Minister's Comprehensive Health Scheme (CMCHIS / TNMSC Free Stock).
                      </p>
                    )}
                    {currentBilling.paymentStatus === 'unpaid' && (
                      <p className="text-[10px] text-amber-200">
                        ⚡ {isTamil 
                          ? 'பார்மசி கவுண்டரில் வரிசையில் நிற்பதை தவிர்க்க உடனே ஆன்லைனில் UPI மூலம் செலுத்தவும்!' 
                          : 'Pre-pay via UPI now to skip the billing line and collect your medicines in 10 seconds!'}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {currentBilling.paymentStatus === 'unpaid' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedScheme(currentBilling.scheme || 'jan_aushadhi');
                            setPaymentModalOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95"
                        >
                          <FaRupeeSign />
                          <span>{isTamil ? `₹${currentBilling.netPayable} UPI மூலம் செலுத்து` : `Pay ₹${currentBilling.netPayable} via UPI`}</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setInvoiceModalOpen(true)}
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <FaFileInvoiceDollar />
                          <span>{isTamil ? 'ரசீது' : 'Bill'}</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setInvoiceModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <FaFileInvoiceDollar />
                        <span>{isTamil ? 'அதிகாரப்பூர்வ GST ரசீது' : 'Official Tax Invoice'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Live Zero-Wait Pharmacy Pre-Packing Progress Bar */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FaPills /> {isTamil ? 'பார்மசி நேரலை தயாரிப்பு நிலை:' : 'Live Pharmacy Prep Status:'}
                </span>
                <span className="text-[11px] font-mono text-slate-300">
                  {tokenPrescription.pharmacyCounter || 'Counter 4 (Express Dispenser)'} · Assigned: <strong>{tokenPrescription.binNumber || `Bin #B-${myToken}`}</strong>
                </span>
              </div>

              {/* Progress Stepper */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className={`p-2 rounded-xl border ${
                  tokenPrescription.pharmacyStatus === 'queued' || tokenPrescription.pharmacyStatus === 'packing' || tokenPrescription.pharmacyStatus === 'ready' || tokenPrescription.pharmacyStatus === 'dispensed'
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200 font-bold'
                    : 'bg-slate-800/40 border-slate-700 text-slate-500'
                }`}>
                  <span className="block text-xs font-black">1. Rx Sent</span>
                  <span className="text-[10px] text-slate-400">Auto-routed</span>
                </div>

                <div className={`p-2 rounded-xl border ${
                  tokenPrescription.pharmacyStatus === 'packing' || tokenPrescription.pharmacyStatus === 'ready' || tokenPrescription.pharmacyStatus === 'dispensed'
                    ? 'bg-sky-950/80 border-sky-400/60 text-sky-200 font-bold'
                    : 'bg-slate-800/40 border-slate-700 text-slate-500'
                }`}>
                  <span className="block text-xs font-black">2. Pre-Packing</span>
                  <span className="text-[10px] text-slate-400">{tokenPrescription.binNumber || `Bin #B-${myToken}`}</span>
                </div>

                <div className={`p-2 rounded-xl border ${
                  tokenPrescription.pharmacyStatus === 'ready' || tokenPrescription.pharmacyStatus === 'dispensed'
                    ? 'bg-emerald-500/30 border-emerald-400 text-white font-black animate-pulse'
                    : 'bg-slate-800/40 border-slate-700 text-slate-500'
                }`}>
                  <span className="block text-xs font-black">3. Ready for Handover!</span>
                  <span className="text-[10px] text-emerald-300">10-Sec Fast Track</span>
                </div>
              </div>

              {/* Status Alert Banner with Express Pickup Boarding Pass */}
              {tokenPrescription.pharmacyStatus === 'ready' ? (
                <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-emerald-400">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase">
                      <FaCheckCircle /> <span>Zero-Wait Express Fast-Track Ready</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      {isTamil ? 'உங்கள் மருந்துகள் பேக் செய்யப்பட்டு தயாராக உள்ளன!' : 'Your Medicines are Packed & Ready!'}
                    </h4>
                    <p className="text-xs text-emerald-100">
                      {isTamil 
                        ? `நேரடியாக கவுண்டர் 04-க்கு செல்லவும். தட்டு எண்: ${tokenPrescription.binNumber || `Bin #B-${myToken}`}` 
                        : `Proceed to Counter 04. Collected from ${tokenPrescription.binNumber || `Bin #B-${myToken}`} in 10 seconds.`}
                    </p>
                    <div className="text-[11px] font-mono text-emerald-200">
                      Fast-Track PIN: <strong className="text-white text-sm bg-black/30 px-2 py-0.5 rounded">{tokenPrescription.pickupOtp || '5414'}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white rounded-xl shadow-md text-slate-900 text-center">
                      <QRCodeCanvas value={`TOKEN-${myToken}-${tokenPrescription.id}`} size={62} />
                      <span className="text-[8px] font-black uppercase block tracking-wider mt-0.5">Express QR</span>
                    </div>

                    <Link 
                      to="/pharmacy"
                      className="px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-black text-xs whitespace-nowrap shadow-md hover:bg-emerald-50 transition-all cursor-pointer"
                    >
                      {isTamil ? 'பார்மசி கன்சோல் →' : 'Pharmacy View →'}
                    </Link>
                  </div>
                </div>
              ) : tokenPrescription.pharmacyStatus === 'dispensed' ? (
                <div className="p-2.5 bg-teal-950/60 border border-teal-500/40 rounded-xl text-xs text-teal-300 flex items-center gap-2">
                  <FaCheckCircle className="text-teal-400" />
                  <span>{isTamil ? 'மருந்துகள் பெற்றுக்கொள்ளப்பட்டது. நலம் பெற வாழ்த்துகள்!' : 'Medicines dispensed & handed over. Get well soon!'}</span>
                </div>
              ) : (
                <div className="p-2.5 bg-sky-950/40 border border-sky-500/30 rounded-xl text-xs text-sky-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                    <span>{isTamil ? `பார்மசிஸ்ட் உங்கள் மருந்துகளை ${tokenPrescription.binNumber || `Bin #B-${myToken}`}-ல் பேக் செய்கிறார்...` : `Pharmacist is pre-packing your medicines in ${tokenPrescription.binNumber || `Bin #B-${myToken}`}...`}</span>
                  </div>
                  <Link 
                    to="/pharmacy"
                    className="text-[10px] text-sky-300 hover:text-white underline font-bold"
                  >
                    Track in Pharmacy →
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FaFilePrescription className="text-sky-600" />
                <span>{isTamil ? `டோக்கன் #${myToken}-க்கான மருத்துவ ஆலோசனை மருந்துச்சீட்டு` : `Doctor E-Prescription for Token #${myToken}`}</span>
              </span>
              <p className="text-[11px] text-slate-500">
                {isTamil 
                  ? 'ஆலோசனை முடிந்ததும் மருத்துவர் அல்லது பணியாளர் உங்கள் டோக்கன் எண்ணுக்கு அதிகாரப்பூர்வ மருந்துச்சீட்டை நேரடியாக அனுப்புவார்.' 
                  : 'Once consultation concludes, the doctor will dispatch your official digital prescription directly to this Token ID.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSimulateDoctorSendRx}
              className="px-3.5 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-xs"
              title="Test: Simulate Doctor issuing prescription to this Token"
            >
              <span>👨‍⚕️ {isTamil ? `டாக்டர் Rx அனுப்புவதை சோதிக்க (#${myToken})` : `Simulate Doctor Rx (Token #${myToken})`}</span>
            </button>
          </div>
        )}

        {/* Doctor & Hospital Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-sm flex-shrink-0">
              <FaUserMd size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 block">
                {isTamil ? 'பணியிலுள்ள மருத்துவர்' : 'Assigned Consulting Doctor'}
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                {matchedAppointment?.doctorName || 'Dr. S. Sundararajan, MD'}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {matchedAppointment?.department} • <strong>{matchedAppointment?.room}</strong>
              </p>
              <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-1.5">
                <FaDoorOpen className="text-sky-600" />
                <span>{isTamil ? 'இடம்: தரைத்தளம், OPD பிரதான கட்டிடம்' : 'Location: Ground Floor, Main OPD Block'}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm flex-shrink-0">
              <FaHospital size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 block">
                {isTamil ? 'மருத்துவமனை விவரங்கள்' : 'Hospital & Helpdesk'}
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                {matchedAppointment?.hospitalName}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {matchedAppointment?.hospitalAddress}
              </p>
              <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-1 font-bold text-sky-700">
                  <FaPhoneAlt size={10} /> 0462-2572711
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {isTamil ? 'உதவி மையம் திறந்துள்ளது' : 'Help Desk Open'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Link
            to="/appointments"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition-all shadow-2xs flex items-center gap-2"
          >
            <FaArrowLeft size={11} />
            <span>{isTamil ? 'என் டோக்கன்கள் பக்கத்திற்கு' : 'Back to My Tokens'}</span>
          </Link>

          <Link
            to="/dashboard"
            className="text-xs font-black text-white bg-sky-600 hover:bg-sky-700 px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>{isTamil ? 'முகப்புக்கு செல்ல' : 'Go to Dashboard'}</span>
          </Link>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />

      {/* Queue Alert Modal */}
      <QueueAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        tokenData={matchedAppointment}
      />

      {/* Smart Token Swap / 15-Min Buffer Delay Modal */}
      <TokenSwapDelayModal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        appointment={matchedAppointment}
      />

      {/* Message Communication Suite (WhatsApp / SMS / Email) */}
      <MessageCommunicationModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        tokenData={matchedAppointment}
      />

      {/* Multi-Links Deep Portal Hub */}
      <MultiLinkModal
        isOpen={showMultiLinkModal}
        onClose={() => setShowMultiLinkModal(false)}
      />

      {/* Doctor E-Prescription Details Modal */}
      {tokenPrescription && (
        <Modal
          isOpen={rxDetailsModalOpen}
          onClose={() => setRxDetailsModalOpen(false)}
          title={`Doctor E-Prescription: Token #${myToken}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 p-1 text-left">
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                  {tokenPrescription.hospitalName}
                </span>
                <h4 className="font-black text-slate-900 text-lg mt-1">{tokenPrescription.doctorName}</h4>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">
                  {tokenPrescription.specialty} · Date: {tokenPrescription.date}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="badge bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md">
                    🎟️ Token #{myToken}
                  </span>
                  <span className="text-[10px] font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                    Patient: <strong>{tokenPrescription.patientName}</strong>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="badge badge-success text-[10px] font-black uppercase">
                  ✓ Verified EHR
                </span>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  ID: #{tokenPrescription.id}
                </div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Diagnosis</span>
              <strong className="text-slate-900 text-sm mt-0.5 block">{tokenPrescription.diagnosis}</strong>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                Prescribed Medicines ({tokenPrescription.medicines?.length || 0})
              </h5>
              <div className="space-y-2">
                {tokenPrescription.medicines?.map((med, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-slate-900">{med.name}</strong>
                      <span className="text-slate-500 ml-2">({med.dosage})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-sky-50 text-sky-800 font-bold px-2 py-0.5 rounded-md border border-sky-100 text-[11px]">
                        {med.frequency}
                      </span>
                      <span className="text-slate-500 font-medium">{med.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {tokenPrescription.notes && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <strong>Doctor's Advice:</strong>
                <p className="mt-0.5">{tokenPrescription.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200">
              <Link
                to="/records"
                className="text-xs font-bold text-sky-600 hover:text-sky-800"
              >
                Open Health Locker →
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintPrescription(tokenPrescription)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FaPrint /> <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadPrescription(tokenPrescription)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FaDownload /> <span>Download Slip</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Patient Interactive Mobile UPI Payment Modal */}
      {tokenPrescription && currentBilling && (
        <Modal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          title={`Central Pharmacy UPI Settlement: Token #${myToken}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 p-1 text-left">
            {/* Header / Hospital Badge */}
            <div className="p-4 bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl flex items-center justify-between gap-3 shadow-md">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-300 tracking-wider block">
                  Tirunelveli Medical College Hospital (TVMCH)
                </span>
                <h4 className="text-base font-black text-white mt-0.5">
                  OPD Pharmacy Counter 04 Express Pay
                </h4>
                <div className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                  <span>Token: <strong className="text-teal-300">#{myToken}</strong></span>
                  <span>·</span>
                  <span>Patient: <strong>{tokenPrescription.patientName || 'Self'}</strong></span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-teal-200 block">Fast-Track Bin</span>
                <strong className="text-lg font-black text-white">{tokenPrescription.binNumber || `Bin #B-${myToken}`}</strong>
              </div>
            </div>

            {/* Healthcare Subsidy Scheme Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Select Billing / Government Healthcare Scheme:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  onClick={() => setSelectedScheme('jan_aushadhi')}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedScheme === 'jan_aushadhi'
                      ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-400/30'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs">🟡 Jan Aushadhi (70% Off)</span>
                    <span className="text-xs font-extrabold text-amber-900">
                      ₹{calculateBilling(tokenPrescription.medicines || [], 'jan_aushadhi').netPayable}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-normal">
                    Quality generic medicines at 70% subsidized rates. Instant UPI settlement.
                  </p>
                </div>

                <div
                  onClick={() => setSelectedScheme('govt_free')}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedScheme === 'govt_free'
                      ? 'bg-teal-50 border-teal-500 text-teal-950 font-bold ring-2 ring-teal-400/30'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs">🟢 TNMSC 100% Free Scheme</span>
                    <span className="text-xs font-extrabold text-teal-700">₹0.00</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-normal">
                    Tamil Nadu Medical Services Corporation 100% Free OPD dispensation.
                  </p>
                </div>
              </div>
            </div>

            {/* Bill Summary Table */}
            {(() => {
              const activeCalc = calculateBilling(tokenPrescription.medicines || [], selectedScheme);
              const isFree = selectedScheme === 'govt_free';
              const payable = isFree ? 0 : activeCalc.netPayable;
              const upiPayUrl = `upi://pay?pa=tvmch.pharmacy@sbi&pn=TVMCH%20Express%20Pharmacy&am=${payable}&tn=Token-${myToken}&cu=INR`;

              return (
                <>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-600 font-bold text-[11px] border-b border-slate-200 pb-1.5">
                      <span>Prescribed Medicines ({tokenPrescription.medicines?.length || 0})</span>
                      <span>MRP Rate</span>
                    </div>

                    <div className="space-y-1">
                      {activeCalc.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px] text-slate-700">
                          <span className="truncate pr-2">{it.name} <span className="text-slate-400">({it.dosage})</span></span>
                          <span className="font-semibold text-slate-900">₹{it.unitPrice}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-500">
                        <span>Gross MRP Total:</span>
                        <span>₹{activeCalc.grossTotal}</span>
                      </div>
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Scheme Subsidy / Discount:</span>
                        <span>-₹{activeCalc.discount}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-1 border-t border-dashed border-slate-300">
                        <span>Net Payable Amount:</span>
                        <span className="text-teal-700 font-black text-base">₹{payable}.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Section */}
                  {isFree ? (
                    <div className="p-4 bg-teal-50 border border-teal-300 rounded-2xl text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto text-xl">
                        <FaShieldAlt />
                      </div>
                      <div>
                        <h4 className="font-black text-teal-950 text-sm">100% Free Government OPD Dispensation</h4>
                        <p className="text-xs text-teal-800 mt-0.5">
                          Under Tamil Nadu Government TNMSC Free Healthcare Scheme, your medicines are 100% subsidized (Net Payable: ₹0.00).
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={isProcessingPayment}
                        onClick={() => handleProcessPatientPayment('TNMSC 100% Free Scheme')}
                        className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Verifying Free Govt Exemption...</span>
                          </>
                        ) : (
                          <>
                            <FaCheck />
                            <span>Confirm 100% Free Exemption & Fast-Track Handover</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Live UPI QR Box */}
                      <div className="p-4 bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl border border-teal-500/40 flex flex-col sm:flex-row items-center gap-4">
                        <div className="bg-white p-2 rounded-xl shadow-lg flex-shrink-0 text-center">
                          <QRCodeCanvas value={upiPayUrl} size={110} />
                          <span className="text-[9px] font-black text-slate-900 block mt-1 uppercase tracking-wider">
                            SBI e-Pay QR
                          </span>
                        </div>

                        <div className="space-y-1.5 text-center sm:text-left flex-1">
                          <span className="px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 text-[10px] font-bold uppercase inline-block">
                            Instant UPI QR Payment
                          </span>
                          <h5 className="text-sm font-black text-white">Scan with any UPI App</h5>
                          <p className="text-[11px] text-slate-300">
                            Scan with GPay, PhonePe, Paytm, CRED or any BHIM UPI app to pay <strong className="text-teal-300 text-xs">₹{payable}.00</strong> directly.
                          </p>
                          <div className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-1 rounded inline-block">
                            UPI ID: <strong className="text-white">tvmch.pharmacy@sbi</strong>
                          </div>
                        </div>
                      </div>

                      {/* 1-Click Pay Simulators for Mobile & Instant Demo */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                          Or Pay Directly via Installed UPI Apps:
                        </span>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button
                            type="button"
                            disabled={isProcessingPayment}
                            onClick={() => handleProcessPatientPayment('Google Pay (GPay)')}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-black text-xs text-slate-800 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-2xs hover:border-teal-500 active:scale-95"
                          >
                            <span className="text-base">🟢</span>
                            <span>Google Pay</span>
                          </button>

                          <button
                            type="button"
                            disabled={isProcessingPayment}
                            onClick={() => handleProcessPatientPayment('PhonePe UPI')}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-black text-xs text-slate-800 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-2xs hover:border-purple-500 active:scale-95"
                          >
                            <span className="text-base">🟣</span>
                            <span>PhonePe</span>
                          </button>

                          <button
                            type="button"
                            disabled={isProcessingPayment}
                            onClick={() => handleProcessPatientPayment('Paytm UPI')}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-black text-xs text-slate-800 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-2xs hover:border-sky-500 active:scale-95"
                          >
                            <span className="text-base">🔵</span>
                            <span>Paytm</span>
                          </button>

                          <button
                            type="button"
                            disabled={isProcessingPayment}
                            onClick={() => handleProcessPatientPayment('Cash at Counter 04')}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-black text-xs text-slate-800 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-2xs hover:border-emerald-500 active:scale-95"
                          >
                            <span className="text-base">💵</span>
                            <span>Cash (Counter)</span>
                          </button>
                        </div>

                        {isProcessingPayment && (
                          <div className="p-3 bg-teal-50 border border-teal-300 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-teal-900 animate-pulse">
                            <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                            <span>Processing UPI Payment via SBI e-Pay Gateway...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200 text-xs">
              <span className="text-slate-500 text-[11px]">
                🔒 256-Bit Encrypted Hospital UPI Gateway
              </span>
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Official Medical Tax Invoice / GST Bill Modal */}
      {tokenPrescription && currentBilling && (
        <Modal
          isOpen={invoiceModalOpen}
          onClose={() => setInvoiceModalOpen(false)}
          title={`Hospital GST Tax Invoice: Token #${myToken}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 p-2 text-left">
            {/* Invoice Paper Card Container */}
            <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-md space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-teal-700 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-widest block">
                    Government of Tamil Nadu · Health & Family Welfare
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    {tokenPrescription.hospitalName || 'Tirunelveli Medical College Hospital'}
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    OPD Central Express Pharmacy · Counter 04 · High Grounds, Palayamkottai
                  </div>
                  <div className="text-[10px] text-slate-700 mt-0.5">
                    <strong>GSTIN:</strong> 33AAAGT0194P1Z3 | <strong>Drug Lic:</strong> DL-TN-TVL-2024-8849
                  </div>
                </div>

                <div className="text-right sm:self-start">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-100 text-teal-800 border border-teal-300">
                    TAX INVOICE / CASH BILL
                  </span>
                  <div className="text-xs font-mono font-bold text-slate-800 mt-1">
                    INV-TVM-2026-{tokenPrescription.tokenNumber}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Date: {tokenPrescription.date} · {currentBilling.paidAt || '10:00 AM'}
                  </div>
                </div>
              </div>

              {/* Patient & Prescription Details Row */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <div>Patient Name: <strong className="text-slate-900">{tokenPrescription.patientName || 'Self'}</strong></div>
                  <div>Assigned Doctor: <strong className="text-slate-900">{tokenPrescription.doctorName}</strong></div>
                  <div className="text-[11px] text-slate-500">Diagnosis: {tokenPrescription.diagnosis}</div>
                </div>
                <div className="sm:text-right">
                  <div>OPD Token: <strong className="text-teal-700 font-extrabold text-sm">#{myToken}</strong></div>
                  <div>Counter: <strong>Counter 04 (Express Dispenser)</strong></div>
                  <div className="text-[11px] text-slate-500">Dispense Bin: <strong>{tokenPrescription.binNumber || `Bin #B-${myToken}`}</strong></div>
                </div>
              </div>

              {/* Itemized Medicine Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-[10px] uppercase font-black border-b border-slate-300">
                      <th className="p-2 text-center w-8">#</th>
                      <th className="p-2">Medicine Particulars</th>
                      <th className="p-2 text-center">HSN</th>
                      <th className="p-2 text-center">Batch</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Rate</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    {(currentBilling.items || (tokenPrescription.medicines || [])).map((it, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 text-center text-slate-500">{idx + 1}</td>
                        <td className="p-2 font-bold text-slate-900">
                          {it.name} <span className="font-normal text-slate-500">({it.dosage || '1 Tab'})</span>
                        </td>
                        <td className="p-2 text-center font-mono text-slate-500">{it.hsnCode || '3004'}</td>
                        <td className="p-2 text-center font-mono text-slate-500">{it.batch || `TNMSC-B${20 + idx}`}</td>
                        <td className="p-2 text-center">{it.qty || 1}</td>
                        <td className="p-2 text-right font-medium text-slate-700">₹{it.unitPrice || 35}.00</td>
                        <td className="p-2 text-right font-bold text-slate-900">₹{it.total || 35}.00</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bill Totals & Official Stamp */}
              <div className="flex flex-col sm:flex-row items-end justify-between gap-4 pt-2 border-t border-slate-200">
                <div className="space-y-1.5 self-start text-left">
                  <div className="p-2.5 rounded-xl border border-dashed border-teal-600 bg-teal-50/50 inline-block text-center text-[10px] font-black text-teal-900 uppercase">
                    ✓ TVMCH OPD CENTRAL PHARMACY<br />
                    DIGITALLY CERTIFIED & VERIFIED<br />
                    <span className="font-mono font-normal text-[9px] text-teal-700">
                      Txn: {currentBilling.transactionId || 'TXN-TVM-ONLINE'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Payment Method: <strong className="text-slate-900">{currentBilling.paymentMethod || 'UPI QR / Govt Scheme'}</strong>
                  </div>
                </div>

                <div className="w-full sm:w-64 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Gross MRP Amount:</span>
                    <span>₹{currentBilling.grossTotal || 140}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>CGST (2.5%):</span>
                    <span>₹{Math.round((currentBilling.gst || 7) / 2)}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>SGST (2.5%):</span>
                    <span>₹{Math.round((currentBilling.gst || 7) / 2)}.00</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold text-[11px]">
                    <span>Govt Subsidy / Discount:</span>
                    <span>-₹{currentBilling.discount || 0}.00</span>
                  </div>
                  <div className="flex justify-between text-teal-950 font-black text-sm pt-1.5 border-t-2 border-teal-700">
                    <span>Net Paid Amount:</span>
                    <span className="text-base text-teal-700">₹{currentBilling.netPayable || 0}.00</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-center border-t border-slate-200 pt-2">
                This is an authentic computer-generated digital GST tax invoice for hospital pharmacy OPD dispensation.
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setInvoiceModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintInvoice(tokenPrescription, currentBilling)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FaPrint /> <span>Print Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(tokenPrescription, currentBilling)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FaDownload /> <span>Download Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
};

export default LiveTokenTrackerPage;
