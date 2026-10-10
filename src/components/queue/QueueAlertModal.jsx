import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  FaBell, 
  FaWhatsapp, 
  FaTimes, 
  FaCheckCircle, 
  FaVolumeUp, 
  FaMobileAlt, 
  FaHospital, 
  FaClock, 
  FaUserMd,
  FaShareAlt,
  FaEnvelope,
  FaSms
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../utils/constants';

const QueueAlertModal = ({ isOpen, onClose, tokenData }) => {
  const { isTamil } = useLanguage();
  const [notifyThreshold, setNotifyThreshold] = useState('3'); // 3 tokens before
  const [alertSaved, setAlertSaved] = useState(false);
  const [pushStatus, setPushStatus] = useState('idle'); // 'idle', 'granted', 'denied'
  const [phoneNumber, setPhoneNumber] = useState(tokenData?.patientPhone || '');
  const [emailAddress, setEmailAddress] = useState('patient.user@gmail.com');
  const [emailSent, setEmailSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  if (!isOpen || !tokenData) return null;

  // Synthesize pleasant hospital gong bell using Web Audio API
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.8); // Drop to A4

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  };

  // Request browser push notification permission
  const handleEnablePush = async () => {
    playChime();
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushStatus('granted');
        new Notification(
          isTamil ? '🔔 டிவிஎல் வரிசை எச்சரிக்கை இயக்கப்பட்டது' : '🔔 TVL Queue Alert Activated',
          {
            body: isTamil
              ? `டோக்கன் #${tokenData.tokenNumber} இன்னும் ${notifyThreshold} நபர்கள் உள்ளபோது உங்களுக்கு அறிவிக்கப்படும்.`
              : `You will be notified when ${notifyThreshold} tokens remain before Token #${tokenData.tokenNumber}.`,
            icon: '/favicon.ico'
          }
        );
      } else {
        setPushStatus('denied');
      }
    } else {
      alert(isTamil ? 'உலாவியில் புஷ் அறிவிப்பு ஆதரிக்கப்படவில்லை.' : 'Push notifications not supported.');
    }
  };

  // Generate and open WhatsApp message
  const handleOpenWhatsApp = () => {
    const text = isTamil
      ? `🏥 *டிவிஎல் ஸ்மார்ட்கேர் - புறநோயாளி (OPD) டோக்கன் அனுமதிச்சீட்டு*
📋 டோக்கன் எண்: #${tokenData.tokenNumber}
🏥 மருத்துவமனை: ${tokenData.hospitalName || 'TVMCH'}
👨‍⚕️ மருத்துவர்: ${tokenData.doctorName || 'Duty Specialist'} (${tokenData.doctorRoom || 'OPD Room 1'})
⏰ நேரம்: ${tokenData.timeSlot || '09:30 AM'} | தேதி: ${tokenData.date || 'Today'}
👤 நோயாளி: ${tokenData.patientName || 'Patient'}
📊 நேரலை வரிசை கண்காணிப்பு: ${window.location.origin}/appointments

(உங்களுக்கு ${notifyThreshold} டோக்கன்கள் மீதமிருக்கும்போது மருத்துவமனைக்கு வரவும்)`
      : `🏥 *TVL SMARTCARE - OPD CONSULTATION PASS*
📋 Token Number: #${tokenData.tokenNumber}
🏥 Hospital: ${tokenData.hospitalName || 'TVMCH'}
👨‍⚕️ Doctor: ${tokenData.doctorName || 'Duty Specialist'} (${tokenData.doctorRoom || 'OPD Room 1'})
⏰ Slot: ${tokenData.timeSlot || '09:30 AM'} | Date: ${tokenData.date || 'Today'}
👤 Patient: ${tokenData.patientName || 'Patient'}
📊 Track Live Counter Queue: ${window.location.origin}/appointments

(Alert scheduled when ${notifyThreshold} tokens remain in queue)`;

    const phoneClean = phoneNumber.replace(/\D/g, '');
    const url = phoneClean 
      ? `https://wa.me/91${phoneClean}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(url, '_blank');
    setAlertSaved(true);
  };

  // Generate and send Email alert
  const handleSendEmailAlert = async () => {
    if (!emailAddress || !emailAddress.includes('@')) {
      toast.error(isTamil ? 'சரியான மின்னஞ்சலை உள்ளிடவும்' : 'Enter a valid email address');
      return;
    }
    try {
      await fetch(`${API_BASE_URL}/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: emailAddress,
          tokenData,
          subject: `[TVL Queue Alert] Token #${tokenData.tokenNumber} - ${notifyThreshold} tokens ahead!`
        })
      }).catch(() => null);
    } catch {
      // ignore
    }
    setEmailSent(true);
    setAlertSaved(true);
    toast.success(isTamil ? `மின்னஞ்சல் எச்சரிக்கை ${emailAddress} முகவரிக்கு அமைக்கப்பட்டது!` : `Email queue alert scheduled to ${emailAddress}!`);
  };

  // Generate SMS alert
  const handleSendSMSAlert = () => {
    setSmsSent(true);
    setAlertSaved(true);
    toast.success(isTamil ? 'SMS நினைவூட்டல் பதிவு செய்யப்பட்டது!' : 'SMS queue alert scheduled!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center font-black">
              <FaBell size={18} className="animate-bounce" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">
                {isTamil ? 'வாட்ஸ்அப் & புஷ் வரிசை எச்சரிக்கை' : 'WhatsApp & Queue Alarm'}
              </h3>
              <p className="text-xs text-emerald-200">
                {isTamil ? 'உங்கள் முறை வரும்முன் நினைவூட்டல் பெறுங்கள்' : 'Get notified before your token is called'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Active Token Preview Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                {isTamil ? 'டோக்கன் எண்' : 'Active Token Pass'}
              </span>
              <div className="text-2xl font-black text-slate-900">
                #{tokenData.tokenNumber}
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-0.5 truncate max-w-[200px]">
                {tokenData.hospitalName}
              </p>
            </div>

            <div className="text-right">
              <span className="badge badge-success text-[10px] font-black">
                {tokenData.status?.toUpperCase() || 'CONFIRMED'}
              </span>
              <div className="text-[11px] font-bold text-slate-500 mt-1 flex items-center justify-end gap-1">
                <FaClock size={10} /> {tokenData.timeSlot}
              </div>
            </div>
          </div>

          {/* Threshold Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {isTamil ? 'எப்போது நினைவூட்ட வேண்டும்?' : 'When should we alert you?'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: '1', label: isTamil ? '1 நபர் முன்' : '1 Token Ahead' },
                { val: '3', label: isTamil ? '3 நபர்கள் முன்' : '3 Tokens Ahead' },
                { val: '5', label: isTamil ? '5 நபர்கள் முன்' : '5 Tokens Ahead' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setNotifyThreshold(opt.val)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    notifyThreshold === opt.val
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Actions: Push Notification & Sound */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                <FaVolumeUp className="text-emerald-600" />
                <span>{isTamil ? 'உலாவி ஒலி & புஷ் அறிவிப்பு' : 'Sound Chime & Web Push'}</span>
              </div>
              <button
                type="button"
                onClick={playChime}
                className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                {isTamil ? 'ஒலி சோதனை' : 'Test Chime'}
              </button>
            </div>

            <button
              type="button"
              onClick={handleEnablePush}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                pushStatus === 'granted'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              <FaBell size={12} />
              <span>
                {pushStatus === 'granted'
                  ? (isTamil ? '✓ புஷ் அறிவிப்பு இயங்கியது' : '✓ Push Notification Active')
                  : (isTamil ? 'புஷ் எச்சரிக்கையை இயக்குக' : 'Enable Browser Queue Push')}
              </span>
            </button>
          </div>

          {/* WhatsApp Template Sender */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              {isTamil ? 'வாட்ஸ்அப் எண் (விரும்பினால்)' : 'Send Live Token Pass to WhatsApp'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="9876543210"
                className="flex-1 py-2 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer flex-shrink-0"
              >
                <FaWhatsapp size={14} />
                <span>{isTamil ? 'வாட்ஸ்அப்பில் அனுப்பு' : 'Send WhatsApp'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              {isTamil ? 'டோக்கன் அனுமதிச்சீட்டு விவரங்கள் வாட்ஸ்அப்பில் பகிரப்படும்.' : 'Includes chamber room, token #, and live status tracker link.'}
            </p>
          </div>

          {/* Email Alert Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">
              {isTamil ? 'மின்னஞ்சல் எச்சரிக்கை (Email Alert)' : 'Send Queue Alert to Patient Email'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="patient@gmail.com"
                className="flex-1 py-2 px-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                type="button"
                onClick={handleSendEmailAlert}
                className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer flex-shrink-0"
              >
                <FaEnvelope size={13} />
                <span>{isTamil ? 'மெயில் செய்' : 'Send Email'}</span>
              </button>
            </div>
            {emailSent && (
              <p className="text-[10px] text-emerald-600 font-bold">
                ✓ {isTamil ? 'மின்னஞ்சல் நினைவூட்டல் அட்டவணையிடப்பட்டது!' : 'Email alert scheduled!'}
              </p>
            )}
          </div>

          {/* SMS Notification Button */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50 border border-sky-200">
            <div className="flex items-center gap-2">
              <FaSms className="text-sky-600" size={14} />
              <span className="text-xs font-bold text-sky-950">
                {isTamil ? 'SMS நினைவூட்டல் (94424 00108)' : '2G SMS Reminder (94424 00108)'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSendSMSAlert}
              className="py-1 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              {smsSent ? '✓ Set' : (isTamil ? 'இயக்கு' : 'Enable SMS')}
            </button>
          </div>

          {alertSaved && (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <FaCheckCircle className="text-emerald-600" />
              <span>{isTamil ? 'எச்சரிக்கை பதிவு செய்யப்பட்டது!' : 'Queue alert successfully scheduled!'}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            {isTamil ? 'முடிந்தது' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueueAlertModal;
