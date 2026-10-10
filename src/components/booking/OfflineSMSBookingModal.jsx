import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import Modal from '../common/Modal';
import { 
  FaSms, 
  FaMobileAlt, 
  FaCheckCircle, 
  FaCopy, 
  FaPaperPlane, 
  FaHospital, 
  FaUserMd, 
  FaClock, 
  FaSignal, 
  FaWifi, 
  FaExclamationCircle,
  FaTv
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const GATEWAY_NUMBER = '9442400108';
const FORMATTED_GATEWAY = '94424 00108';

const HOSPITALS = [
  { code: 'TVMC', name: 'Tirunelveli Medical College Hospital (TVMCH)', fee: 'Free (Govt)' },
  { code: 'SHIFA', name: 'Shifa Hospital, Vannarpettai', fee: '₹350' },
  { code: 'ARVD', name: 'Aravind Eye Hospital, Vannarpettai', fee: '₹200' },
  { code: 'KAUV', name: 'Kauvery Hospital, Palayamkottai Road', fee: '₹400' },
  { code: 'PORN', name: 'Porunai Hospital, Palayamkottai', fee: '₹300' },
  { code: 'SUGH', name: 'Sugham Hospital, Perumalpuram', fee: '₹250' }
];

const DEPARTMENTS = [
  { code: 'GENERAL', name: 'General Medicine (பொது மருத்துவம்)', room: 'OPD Block A - Room 102' },
  { code: 'CARDIO', name: 'Cardiology (இதய சிகிச்சை)', room: 'Cardiac Wing - Room 201' },
  { code: 'DERMA', name: 'Dermatology (தோல் நோய் பிரிவு)', room: 'Skin Clinic - Room 108' },
  { code: 'PEDI', name: 'Pediatrics (குழந்தைகள் நலம்)', room: 'Child Health - Room 105' },
  { code: 'ORTHO', name: 'Orthopedics (எலும்பு சிகிச்சை)', room: 'Bone & Joint - Room 112' },
  { code: 'GYNAEC', name: 'Gynecology (மகப்பேறு மருத்துவம்)', room: 'Maternity Wing - Room 114' },
  { code: 'ENT', name: 'ENT (காது, மூக்கு, தொண்டை)', room: 'ENT Clinic - Room 202' }
];

const OfflineSMSBookingModal = ({ isOpen, onClose }) => {
  const { isTamil } = useLanguage();
  const { bookViaSMS } = useBooking();
  const navigate = useNavigate();

  const [selectedHospital, setSelectedHospital] = useState('TVMC');
  const [selectedDept, setSelectedDept] = useState('GENERAL');
  const [mobileNumber, setMobileNumber] = useState('9442412345');
  const [patientName, setPatientName] = useState('Murugan S');
  const [activeTab, setActiveTab] = useState('builder'); // 'builder' or 'simulator'

  // Simulator state
  const [simSending, setSimSending] = useState(false);
  const [simDelivered, setSimDelivered] = useState(false);
  const [simResponse, setSimResponse] = useState(null);

  const smsCommand = `TVL ${selectedHospital} ${selectedDept}`;
  const nativeSmsHref = `sms:${GATEWAY_NUMBER}?body=${encodeURIComponent(smsCommand)}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(isTamil ? 'SMS வாசகம் நகலெடுக்கப்பட்டது!' : 'Copied to clipboard!');
  };

  // Play synthetic SMS notification beep
  const playSmsBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // Fallback
    }
  };

  const handleSimulateSend = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      toast.error(isTamil ? 'சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்' : 'Please enter a valid 10-digit mobile number');
      return;
    }

    setSimSending(true);
    setSimDelivered(false);
    setSimResponse(null);

    // Simulate SMS network delivery delay
    setTimeout(async () => {
      const result = await bookViaSMS({
        hospitalCode: selectedHospital,
        deptCode: selectedDept,
        mobileNumber,
        patientName: patientName || 'SMS Patient'
      });

      playSmsBeep();
      setSimSending(false);
      setSimDelivered(true);
      setSimResponse(result);
    }, 1400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isTamil ? '📴 ஆஃப்லைன் SMS டோக்கன் முன்பதிவு (No Internet Needed)' : '📴 Offline SMS OPD Token Booking (No Internet Needed)'}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5 text-left">
        {/* Banner with Unique Feature explanation */}
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 p-4 rounded-2xl border border-sky-500/30 text-white shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black flex-shrink-0 border border-sky-400/20">
              <FaSms size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-sky-400">
                  {isTamil ? 'கிராமப்புற மற்றும் டேட்டா இல்லாத பயனர்களுக்கான சேவை' : 'Rural & Low-Connectivity Patient Support'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  {isTamil ? 'இன்டர்நெட் தேவையில்லை' : 'Zero Mobile Data'}
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-white mt-1 leading-snug">
                {isTamil 
                  ? 'ஒரு சாதாரண SMS அனுப்பி உங்கள் OPD டோக்கன் & உத்தேச நேரத்தை உடனடியாகப் பெறுங்கள்!'
                  : 'Send a simple SMS to get an instant OPD Token & estimated doctor consultation time!'}
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {isTamil
                  ? `எடுத்துக்காட்டு: "TVL TVMC GENERAL" என எழுதி ${FORMATTED_GATEWAY} எண்ணிற்கு SMS அனுப்பினால் போதும்.`
                  : `Just SMS: "TVL TVMC GENERAL" to ${FORMATTED_GATEWAY}. System instantly allocates OPD token & replies via SMS.`}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher: SMS Code Builder vs Live SMS Simulator */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-white text-sky-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaMobileAlt />
            <span>{isTamil ? '1. SMS வாசகம் உருவாக்குதல்' : '1. SMS Format & Phone Link'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaPaperPlane />
            <span>{isTamil ? '2. நேரலை SMS சிமுலேட்டர் (Live Demo)' : '2. Live SMS Gateway Simulator'}</span>
          </button>
        </div>

        {/* TAB 1: SMS CODE BUILDER */}
        {activeTab === 'builder' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Form to choose hospital and dept */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 block mb-1.5">
                  {isTamil ? 'மருத்துவமனை குறியீடு (Hospital Code)' : 'Select Hospital Code'}
                </label>
                <select
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                >
                  {HOSPITALS.map(h => (
                    <option key={h.code} value={h.code}>
                      {h.code} - {h.name} ({h.fee})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 block mb-1.5">
                  {isTamil ? 'சிகிச்சை பிரிவு (Department Code)' : 'Select Department Code'}
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d.code} value={d.code}>
                      {d.code} - {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generated Command Box */}
            <div className="bg-sky-50/70 border-2 border-sky-300 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-800">
                  {isTamil ? 'உருவாக்கப்பட்ட SMS வாசகம் (Generated SMS Text)' : 'Ready-to-Send SMS Command'}
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  {isTamil ? 'பெறுநர்:' : 'Recipient:'} <strong className="text-slate-900 font-mono">{FORMATTED_GATEWAY}</strong>
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-sky-200 flex items-center justify-between shadow-2xs font-mono font-black text-slate-900 text-lg">
                <span className="tracking-widest text-sky-900">{smsCommand}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(smsCommand)}
                  className="p-2 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
                  title="Copy SMS command"
                >
                  <FaCopy size={13} />
                  <span>{isTamil ? 'நகல்' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                {/* Native mobile SMS app trigger */}
                <a
                  href={nativeSmsHref}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 no-underline text-center cursor-pointer"
                >
                  <FaMobileAlt size={15} />
                  <span>{isTamil ? 'மொபைல் SMS செயலியில் திறக்கவும் (Send via Phone SMS)' : 'Open in Phone SMS App →'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setActiveTab('simulator')}
                  className="py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-black text-xs border border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <FaPaperPlane size={12} className="text-sky-600" />
                  <span>{isTamil ? 'ஆன்லைன் சிமுலேட்டரில் சோதிக்கவும்' : 'Test in Live Simulator'}</span>
                </button>
              </div>
            </div>

            {/* Quick Reference Code Cheatsheet */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                {isTamil ? 'அனைத்து மருத்துவமனை & சிகிச்சை குறியீடுகள் (Cheatsheet)' : 'Quick SMS Syntax Codes Cheatsheet'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="font-mono font-bold text-sky-700">TVL TVMC GENERAL</div>
                  <div className="text-[10px] text-slate-500">TVMC General OPD (Free)</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="font-mono font-bold text-sky-700">TVL TVMC DERMA</div>
                  <div className="text-[10px] text-slate-500">TVMC Skin OPD (Free)</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="font-mono font-bold text-sky-700">TVL ARVD EYE</div>
                  <div className="text-[10px] text-slate-500">Aravind Eye Hospital</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="font-mono font-bold text-sky-700">TVL SHIFA CARDIO</div>
                  <div className="text-[10px] text-slate-500">Shifa Heart Clinic</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="font-mono font-bold text-sky-700">TVL KAUV ORTHO</div>
                  <div className="text-[10px] text-slate-500">Kauvery Bone & Joint</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="font-mono font-bold text-sky-700">TVL PORN PEDI</div>
                  <div className="text-[10px] text-slate-500">Porunai Child Clinic</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE IN-BROWSER SMS SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 text-white shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <FaSignal size={12} className="text-emerald-400" />
                  <span>BSNL / Jio 2G/4G Cell Tower</span>
                </span>
                <span className="font-mono font-black text-sky-400">Gateway: +91 {FORMATTED_GATEWAY}</span>
              </div>

              {/* Input details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    {isTamil ? 'உங்கள் மொபைல் எண்' : 'Your Mobile Number (SIM)'}
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    maxLength={10}
                    className="w-full text-xs font-mono font-bold bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    placeholder="94424XXXXX"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    {isTamil ? 'நோயாளி பெயர்' : 'Patient Name'}
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full text-xs font-bold bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    placeholder="Sundar M"
                  />
                </div>
              </div>

              {/* Outgoing Message Bubble */}
              <div className="space-y-3">
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-sky-600 text-white p-3 rounded-2xl rounded-tr-xs text-xs font-mono shadow-sm">
                    <div className="text-[9px] text-sky-200 font-bold mb-1 flex items-center justify-between">
                      <span>SMS TO: {FORMATTED_GATEWAY}</span>
                      <span>Now</span>
                    </div>
                    <div className="font-black text-sm">{smsCommand}</div>
                  </div>
                </div>

                {/* Simulated Reply Bubble */}
                {simSending && (
                  <div className="flex justify-start items-center gap-2 text-slate-400 text-xs py-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                    <span>{isTamil ? 'SMS அனுப்பப்படுகிறது... டோக்கன் ஒதுக்கப்படுகிறது...' : 'Transmitting SMS to Hospital OPD Gateway...'}</span>
                  </div>
                )}

                {simDelivered && simResponse && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="max-w-[90%] bg-slate-800 text-emerald-300 p-3.5 rounded-2xl rounded-tl-xs text-xs border border-emerald-500/40 shadow-md">
                      <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold mb-1">
                        <span className="flex items-center gap-1">
                          <FaCheckCircle /> [TVL SmartCare OPD Pass Confirmed]
                        </span>
                        <span className="text-slate-400">Just Now</span>
                      </div>
                      <div className="text-white font-mono text-xs leading-relaxed">
                        {simResponse.smsReplyText}
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-700 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-300">
                          Token: <strong className="text-white">#{simResponse.appointment.tokenNumber}</strong> • Room: <strong className="text-white">{simResponse.appointment.room}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            navigate(`/track/${simResponse.appointment.id}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <FaTv size={11} />
                          <span>{isTamil ? 'நேரலை நிலை காண்க' : 'Open Live Tracker →'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button to simulate */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleSimulateSend}
                  disabled={simSending}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <FaPaperPlane size={13} />
                  <span>
                    {simSending
                      ? (isTamil ? 'SMS அனுப்பப்படுகிறது...' : 'Allocating Token via SMS...')
                      : (isTamil ? `சிமுலேட் SMS அனுப்புக ("${smsCommand}" to ${FORMATTED_GATEWAY})` : `Simulate Sending SMS ("${smsCommand}")`)}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <FaSignal className="text-emerald-600" />
            <span>{isTamil ? '2G / பீச்சர் போன்களிலும் 100% வேலை செய்யும்' : 'Works on all basic 2G feature phones'}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            {isTamil ? 'மூடுக' : 'Close'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OfflineSMSBookingModal;
