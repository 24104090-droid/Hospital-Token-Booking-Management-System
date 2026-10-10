import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import Modal from '../common/Modal';
import { 
  FaExchangeAlt, 
  FaClock, 
  FaBus, 
  FaCar, 
  FaFlask, 
  FaUserFriends, 
  FaCheckCircle, 
  FaHourglassHalf, 
  FaHospital, 
  FaUserMd,
  FaShieldAlt,
  FaArrowRight
} from 'react-icons/fa';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

const DELAY_REASONS = [
  { id: 'traffic', icon: FaCar, labelEn: 'Stuck in Traffic (Tirunelveli Town / Bypass)', labelTa: 'டிராஃபிக் நெரிசல் (டவுன் / பைபாஸ்)' },
  { id: 'bus', icon: FaBus, labelEn: 'Bus / Public Transit Delayed', labelTa: 'பேருந்து தாமதம் / போக்குவரத்து நெரிசல்' },
  { id: 'lab', icon: FaFlask, labelEn: 'Diagnostic Blood/Scan Lab Test Waiting', labelTa: 'மருத்துவ பரிசோதனை முடிவுக்காக காத்திருப்பு' },
  { id: 'personal', icon: FaUserFriends, labelEn: 'Personal / Family Urgent Delay', labelTa: 'குடும்ப அல்லது தனிப்பட்ட அவசர தாமதம்' }
];

const TokenSwapDelayModal = ({ isOpen, onClose, appointment }) => {
  const { isTamil } = useLanguage();
  const { delayAppointment, swapAppointment } = useBooking();

  const [activeTab, setActiveTab] = useState('buffer'); // 'buffer' or 'swap'
  const [delayMinutes, setDelayMinutes] = useState(15);
  const [selectedReason, setSelectedReason] = useState('traffic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [swapHandshakePeer, setSwapHandshakePeer] = useState(null);
  const [swapSuccess, setSwapSuccess] = useState(null);

  if (!appointment) return null;

  const currentToken = appointment.tokenNumber || 12;

  // Realistic peers waiting behind this patient in queue who would love an earlier token!
  const swapPeers = [
    {
      tokenNumber: currentToken + 3,
      name: 'Muruganandam P.',
      tamilName: 'முருகானந்தம் பா.',
      age: 44,
      gender: 'Male',
      status: isTamil ? 'காத்திருப்பு கூடத்தில் உள்ளார் (முன்கூட்டியே வந்தவர்)' : 'In Waiting Lobby (Arrived early)',
      timeSlotOffset: '+15 mins',
      readyToSwap: true
    },
    {
      tokenNumber: currentToken + 5,
      name: 'Anandhi Subramanian',
      tamilName: 'ஆனந்தி சுப்பிரமணியன்',
      age: 38,
      gender: 'Female',
      status: isTamil ? 'மருத்துவமனை OPD கவுண்டரில் தயார்' : 'At OPD Reception Desk',
      timeSlotOffset: '+25 mins',
      readyToSwap: true
    },
    {
      tokenNumber: currentToken + 7,
      name: 'Selva Kumar R.',
      tamilName: 'செல்வக்குமார் ரா.',
      age: 51,
      gender: 'Male',
      status: isTamil ? 'OPD இருக்கையில் அமர்ந்துள்ளார்' : 'Seated in Main Waiting Hall',
      timeSlotOffset: '+35 mins',
      readyToSwap: true
    }
  ];

  // Handle 15-min or 30-min buffer delay
  const handleApplyDelay = async () => {
    setIsProcessing(true);
    const reasonObj = DELAY_REASONS.find(r => r.id === selectedReason);
    const reasonLabel = isTamil ? reasonObj?.labelTa : reasonObj?.labelEn;

    try {
      const updated = delayAppointment(appointment.id, delayMinutes, reasonLabel);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });

      toast.success(
        isTamil
          ? `⏱️ 15-நிமிட அவகாசம் ஒதுக்கப்பட்டது! புதிய டோக்கன்: #${updated?.tokenNumber} (${updated?.timeSlot})`
          : `⏱️ 15-Minute Buffer Delay Applied! New Token: #${updated?.tokenNumber}`
      );

      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 700);
    } catch {
      setIsProcessing(false);
    }
  };

  // Handle peer swap
  const handleRequestSwap = async (peer) => {
    setSwapHandshakePeer(peer);
    setIsProcessing(true);

    // Realistic peer handshake simulation
    setTimeout(() => {
      const updated = swapAppointment(appointment.id, peer.tokenNumber, peer.name);
      setIsProcessing(false);
      setSwapSuccess({
        oldToken: currentToken,
        newToken: peer.tokenNumber,
        partner: peer.name,
        newSlot: updated?.timeSlot
      });

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.5 }
      });

      toast.success(
        isTamil
          ? `🔄 டோக்கன் வெற்றிகரமாக மாற்றப்பட்டது! உங்கள் புதிய டோக்கன் #${peer.tokenNumber}`
          : `🔄 Token Swapped! You are now Token #${peer.tokenNumber} (Swapped with ${peer.name})`
      );
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isTamil ? '🔄 ஸ்மார்ட் டோக்கன் இடமாற்றம் / 15-நிமிட தாமத அவகாசம்' : '🔄 Smart Token Swap / 15-Min Buffer Delay'}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5 text-left">
        {/* Current Active Token Strip */}
        <div className="bg-slate-900 rounded-2xl p-4 text-white flex flex-wrap items-center justify-between gap-4 border border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-600/30 text-sky-400 flex flex-col items-center justify-center font-mono font-black border border-sky-500/40">
              <span className="text-[8px] font-bold text-slate-400">TOKEN</span>
              <span className="text-xl leading-none">#{currentToken}</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-sky-400 block">
                {isTamil ? 'தற்போது உங்களிடம் உள்ள டோக்கன்' : 'Current Active Token'}
              </span>
              <h4 className="text-sm font-extrabold text-white mt-0.5">{appointment.hospitalName}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {appointment.doctorName} • {appointment.room} • <strong>{appointment.timeSlot}</strong>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              {isTamil ? 'பதிவு செய்யப்பட்டவர்' : 'Patient'}
            </span>
            <span className="text-xs font-black text-white">{appointment.patientName}</span>
          </div>
        </div>

        {/* Why this is Unique Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
            <FaShieldAlt size={15} />
          </div>
          <div>
            <strong className="block font-black text-amber-950">
              {isTamil ? 'நோயாளிக்கு டோக்கன் வீணாகாது! (No Appointment Cancellation)' : 'Zero Cancellation Guarantee'}
            </strong>
            <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
              {isTamil
                ? 'டிராஃபிக் அல்லது பஸ் லேட்டானால் முன்பதிவை ரத்து செய்துவிட்டு மீண்டும் வரிசையில் நிற்க வேண்டிய அவசியமில்லை. இந்த வசதி மூலம் உங்கள் டோக்கனை 15 நிமிடங்கள் பின்னோக்கி நகர்த்தலாம் அல்லது காத்திருக்கும் சக நோயாளியுடன் நேரத்தை மாற்றிக் கொள்ளலாம்.'
                : 'Traffic or bus delayed? Don’t cancel and lose your spot. Smoothly request a 15-minute buffer delay or swap with waiting patients already at the OPD.'}
            </p>
          </div>
        </div>

        {/* Tabs: Buffer Delay vs Peer Swap */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('buffer');
              setSwapSuccess(null);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'buffer'
                ? 'bg-white text-amber-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaClock />
            <span>{isTamil ? '1. 15-நிமிடம் அவகாசம் (+15m Delay)' : '1. 15-Min Buffer Delay'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('swap')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'swap'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaExchangeAlt />
            <span>{isTamil ? '2. டோக்கன் இடமாற்றம் (Smart Peer Swap)' : '2. Smart Peer Swap'}</span>
          </button>
        </div>

        {/* TAB 1: 15-MIN BUFFER DELAY */}
        {activeTab === 'buffer' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Delay Duration Selector */}
            <div>
              <label className="text-[11px] font-black uppercase text-slate-500 block mb-2">
                {isTamil ? 'எவ்வளவு நேரம் அவகாசம் தேவை?' : 'Select Buffer Delay Time'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDelayMinutes(15)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    delayMinutes === 15
                      ? 'border-amber-500 bg-amber-50/70 text-amber-950 shadow-sm ring-2 ring-amber-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-black text-sm">
                    <span>+15 {isTamil ? 'நிமிடங்கள்' : 'Minutes'}</span>
                    <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                      {isTamil ? '~3 டோக்கன் தள்ளி' : '~3 slots later'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isTamil ? 'சிறிய டிராஃபிக் அல்லது பஸ் தாமதத்திற்கு சிறந்தது' : 'Ideal for normal traffic or bus delays'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDelayMinutes(30)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    delayMinutes === 30
                      ? 'border-amber-500 bg-amber-50/70 text-amber-950 shadow-sm ring-2 ring-amber-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-black text-sm">
                    <span>+30 {isTamil ? 'நிமிடங்கள்' : 'Minutes'}</span>
                    <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                      {isTamil ? '~6 டோக்கன் தள்ளி' : '~6 slots later'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isTamil ? 'வெளியூர் பேருந்து அல்லது ஆய்வுக்கூட பரிசோதனைக்கு' : 'For rural buses or diagnostics'}
                  </p>
                </button>
              </div>
            </div>

            {/* Delay Reason Selector */}
            <div>
              <label className="text-[11px] font-black uppercase text-slate-500 block mb-2">
                {isTamil ? 'தாமதத்திற்கான காரணம்' : 'Reason for Delay'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DELAY_REASONS.map(r => {
                  const Icon = r.icon;
                  const isSelected = selectedReason === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedReason(r.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 text-amber-950 font-black shadow-2xs ring-1 ring-amber-300'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={isSelected ? 'text-amber-600' : 'text-slate-400'} size={15} />
                      <span className="text-xs">{isTamil ? r.labelTa : r.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Buffer summary */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {isTamil ? 'புதிய உத்தேச டோக்கன் எண்' : 'Estimated New Token'}
                </span>
                <strong className="text-slate-900 text-sm font-mono">
                  #{currentToken + (delayMinutes === 15 ? 3 : 6)}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {isTamil ? 'புதிய ஆலோசனை நேரம்' : 'New Consultation Slot'}
                </span>
                <strong className="text-emerald-700 text-xs font-bold">
                  {appointment.timeSlot} (+{delayMinutes}m)
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyDelay}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FaClock />
              <span>
                {isProcessing
                  ? (isTamil ? 'அவகாசம் செயலாக்கப்படுகிறது...' : 'Applying Buffer Delay...')
                  : (isTamil ? `இந்த ${delayMinutes}-நிமிட அவகாசத்தை உறுதி செய் (Confirm Delay)` : `Confirm ${delayMinutes}-Minute Buffer Delay`)}
              </span>
            </button>
          </div>
        )}

        {/* TAB 2: SMART PEER SWAP */}
        {activeTab === 'swap' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Swap Peer Handshake Simulation state */}
            {isProcessing && swapHandshakePeer && (
              <div className="bg-sky-50 border-2 border-sky-300 rounded-2xl p-6 text-center space-y-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-sky-600 text-white mx-auto flex items-center justify-center font-bold text-lg animate-spin">
                  <FaExchangeAlt />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {isTamil
                    ? `நோயாளி ${swapHandshakePeer.name} (டோக்கன் #${swapHandshakePeer.tokenNumber})-க்கு இடமாற்ற கோரிக்கை அனுப்பப்படுகிறது...`
                    : `Sending peer swap handshake to Patient ${swapHandshakePeer.name} (Token #${swapHandshakePeer.tokenNumber})...`}
                </h4>
                <p className="text-xs text-sky-700">
                  {isTamil
                    ? 'சக நோயாளி சம்மதம் தெரிவிக்கிறார்... டோக்கன் மற்றும் நேரம் பரிமாறப்படுகிறது!'
                    : 'Peer accepted! Re-allocating doctor consultation slot without cancellation.'}
                </p>
              </div>
            )}

            {/* Swap Success Screen */}
            {swapSuccess && (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center font-bold text-lg">
                  <FaCheckCircle />
                </div>
                <h4 className="font-extrabold text-emerald-950 text-base">
                  {isTamil ? '🎉 டோக்கன் வெற்றிகரமாக மாற்றப்பட்டது!' : '🎉 Token Swap Completed Successfully!'}
                </h4>
                <div className="bg-white p-3 rounded-xl border border-emerald-200 inline-flex items-center gap-4 text-xs font-mono font-bold">
                  <div>
                    <span className="text-[10px] text-slate-400 block">PREVIOUS</span>
                    <span className="line-through text-slate-400">#{swapSuccess.oldToken}</span>
                  </div>
                  <FaArrowRight className="text-emerald-600" />
                  <div>
                    <span className="text-[10px] text-emerald-700 block">NEW TOKEN</span>
                    <span className="text-emerald-800 text-lg font-black">#{swapSuccess.newToken}</span>
                  </div>
                  <div className="border-l border-slate-200 pl-3 text-left">
                    <span className="text-[10px] text-slate-400 block">SWAPPED WITH</span>
                    <span className="text-slate-800">{swapSuccess.partner}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md cursor-pointer"
                  >
                    {isTamil ? 'சரி, டோக்கனை காண்க' : 'Great, Done!'}
                  </button>
                </div>
              </div>
            )}

            {!isProcessing && !swapSuccess && (
              <>
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>
                    {isTamil
                      ? 'காத்திருப்பு கூடத்தில் உங்களுக்கு பின்னால் இருக்கும் நோயாளிகள்:'
                      : 'Patients currently waiting in queue who are ready to swap with an earlier slot:'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    {swapPeers.length} {isTamil ? 'நோயாளிகள் தயார்' : 'Ready to Swap'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {swapPeers.map(peer => (
                    <div
                      key={peer.tokenNumber}
                      className="bg-white border border-slate-200 hover:border-sky-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs transition-all hover:bg-sky-50/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-800 flex flex-col items-center justify-center font-mono font-black border border-sky-200 flex-shrink-0">
                          <span className="text-[8px] font-bold text-slate-400">TOKEN</span>
                          <span className="text-base">#{peer.tokenNumber}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-extrabold text-slate-900 text-xs">
                              {isTamil ? peer.tamilName : peer.name}
                            </h5>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({peer.age}y, {peer.gender})
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>{peer.status}</span>
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {isTamil ? 'உங்களுக்கு கிடைக்கும் கூடுதல் அவகாசம்:' : 'Gives you buffer of:'} <strong>{peer.timeSlotOffset}</strong>
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRequestSwap(peer)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-black text-xs shadow-sm hover:scale-102 transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                      >
                        <FaExchangeAlt size={11} />
                        <span>{isTamil ? `டோக்கன் #${peer.tokenNumber} உடன் மாற்று` : `Swap with #${peer.tokenNumber}`}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Modal footer */}
        <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <FaShieldAlt className="text-sky-600" />
            <span>{isTamil ? 'மருத்துவர் அறை மாற்றப்படாது, நேரம் மட்டுமே சரிசெய்யப்படும்' : 'Doctor & OPD room remain unchanged'}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            {isTamil ? 'ரத்து செய்க' : 'Dismiss'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TokenSwapDelayModal;
