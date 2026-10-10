import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { QRCodeCanvas } from 'qrcode.react';
import Button from '../common/Button';
import Card from '../common/Card';
import QueueAlertModal from '../queue/QueueAlertModal';
import MessageCommunicationModal from '../communication/MessageCommunicationModal';
import MultiLinkModal from '../common/MultiLinkModal';
import { 
  FaCheckCircle, 
  FaHospital, 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaPrint, 
  FaArrowRight, 
  FaDoorOpen, 
  FaMapMarkerAlt,
  FaShieldAlt,
  FaTicketAlt,
  FaPhoneAlt,
  FaBell,
  FaWhatsapp,
  FaEnvelope,
  FaSms,
  FaLink
} from 'react-icons/fa';

const TokenConfirmation = () => {
  const navigate = useNavigate();
  const { lastBookedToken, appointments } = useBooking();
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMultiLinkModal, setShowMultiLinkModal] = useState(false);

  const token = lastBookedToken || appointments[0];

  if (!token) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-800">No token found</h2>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">Back to Dashboard</Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto py-4">
      {/* Top Banner */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto mb-3 text-3xl shadow-lg shadow-emerald-500/25">
          <FaCheckCircle />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">OPD Token Pass Confirmed!</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Your digital appointment pass for Tirunelveli hospital is ready. Show this QR at the OPD triage desk.
        </p>
      </div>

      {/* Ticket Pass Container */}
      <div className="glass-card shadow-2xl rounded-3xl border border-sky-100 overflow-hidden relative">
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 relative overflow-hidden text-center">
          <div className="flex items-center justify-between relative z-10 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <FaHospital size={16} />
              </div>
              <div className="text-left">
                <div className="font-black text-xs tracking-wide">TVL SmartCare</div>
                <div className="text-[9px] text-sky-300">Tirunelveli Health Network</div>
              </div>
            </div>

            <span className={`badge ${token.type === 'emergency' ? 'badge-danger' : 'badge-primary'} font-black text-[10px]`}>
              {token.type === 'emergency' ? 'EMERGENCY 108 PASS' : 'CONFIRMED OPD PASS'}
            </span>
          </div>

          {/* Big Number */}
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-sky-300 block mb-1">
            DIGITAL TOKEN NUMBER
          </span>
          <div className="text-5xl font-mono font-black tracking-tight text-white drop-shadow-md">
            #{token.tokenNumber}
          </div>
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-white/10 rounded-full text-xs text-sky-200">
            <span>Now Serving: <strong className="text-emerald-300">#{token.currentServing || 8}</strong></span>
            <span>•</span>
            <span>Est. Wait: <strong className="text-white">~{token.estimatedWaitMinutes || 12} mins</strong></span>
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="relative flex items-center justify-between px-2 -my-3 z-20">
          <div className="w-6 h-6 rounded-full bg-slate-100 -ml-5 border-r border-slate-200" />
          <div className="flex-1 border-t-2 border-dashed border-slate-300 mx-2" />
          <div className="w-6 h-6 rounded-full bg-slate-100 -mr-5 border-l border-slate-200" />
        </div>

        {/* Ticket Body with QR */}
        <div className="p-6 bg-white flex flex-col items-center">
          <div 
            onClick={() => navigate(`/track/${token.id}`)}
            className="p-3 bg-slate-50 hover:bg-sky-50 rounded-2xl border-2 border-sky-100 hover:border-sky-400 shadow-sm mb-2 cursor-pointer transition-all group relative"
            title="Scan or Click to open Live Queue Status"
          >
            <QRCodeCanvas
              value={`${window.location.origin}/track/${token.id}`}
              size={150}
              bgColor="#f8fafc"
              fgColor="#0f172a"
              level="H"
            />
            <div className="text-[9px] font-black text-sky-700 text-center mt-1 flex items-center justify-center gap-1">
              <span>⚡ Click to Open Live Tracker</span>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-slate-500 mb-4">
            Token Ref ID: {token.id}
          </span>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 w-full text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-5">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Hospital</span>
              <strong className="text-slate-900 text-xs leading-snug block mt-0.5">{token.hospitalName}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Department</span>
              <strong className="text-slate-900 text-xs block mt-0.5">{token.department}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Doctor & Room</span>
              <strong className="text-slate-900 text-xs block mt-0.5">{token.doctorName} ({token.room || 'OPD-102'})</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Date & Time Slot</span>
              <strong className="text-slate-900 text-xs block mt-0.5">{token.date} • {token.timeSlot}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient Name</span>
              <strong className="text-slate-900 text-xs block mt-0.5">{token.patientName} ({token.patientAge}y)</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Consultation Fee</span>
              <strong className="text-slate-900 text-xs block mt-0.5">
                {token.consultationFee === 0 ? 'FREE (Govt OPD)' : `₹${token.consultationFee}`}
              </strong>
            </div>
          </div>

          {/* Message Communication & Queue Alert Buttons */}
          <div className="grid grid-cols-2 gap-2 w-full mb-3">
            <button
              type="button"
              onClick={() => setShowMessageModal(true)}
              className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-extrabold text-xs shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-1.5 cursor-pointer"
              title="Send via WhatsApp, SMS, or Email"
            >
              <FaEnvelope size={13} />
              <span>📨 Send (WA/SMS/Email)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowMultiLinkModal(true)}
              className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-xs shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-1.5 cursor-pointer"
              title="Open Multi-Links Portal Hub"
            >
              <FaLink size={12} />
              <span>🔗 Multi-Links Hub</span>
            </button>
          </div>

          {/* Queue Alert Trigger Button */}
          <button
            type="button"
            onClick={() => setShowAlertModal(true)}
            className="w-full mb-3 py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-extrabold text-xs shadow-md border border-slate-700 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
          >
            <FaBell className="animate-bounce" size={13} />
            <span>Set WhatsApp, SMS & Push Queue Alarm</span>
          </button>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="md"
              className="flex-1 font-bold border-slate-300 text-slate-700 text-xs"
              icon={FaPrint}
            >
              Print Pass
            </Button>
            <Button
              onClick={() => navigate(`/track/${token.id}`)}
              size="md"
              className="flex-1 font-black bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-lg border-none text-xs"
              icon={FaArrowRight}
            >
              Track Live Counter →
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/dashboard" className="text-xs font-bold text-sky-600 hover:text-sky-800" style={{ textDecoration: 'none' }}>
          ← Return to Dashboard
        </Link>
      </div>

      {/* Queue Alert Modal */}
      <QueueAlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        tokenData={token}
      />

      {/* Message Communication Suite Modal (WhatsApp / SMS / Email) */}
      <MessageCommunicationModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        tokenData={token}
      />

      {/* Multi-Links Deep Access Hub Modal */}
      <MultiLinkModal
        isOpen={showMultiLinkModal}
        onClose={() => setShowMultiLinkModal(false)}
      />
    </div>
  );
};

export default TokenConfirmation;
