import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { hospitals } from '../../data/hospitals';
import { searchProblems } from '../../data/problems';
import { 
  FaMicrophone, 
  FaTimes, 
  FaVolumeUp, 
  FaCheckCircle, 
  FaHospital, 
  FaArrowRight, 
  FaHeartbeat,
  FaRedo
} from 'react-icons/fa';

const VoiceBookingModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isTamil: globalIsTamil } = useLanguage();
  const { updateBookingData } = useBooking();

  const [voiceLang, setVoiceLang] = useState(globalIsTamil ? 'ta' : 'en');
  const isTa = voiceLang === 'ta';

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [detectedData, setDetectedData] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setDetectedData(null);
      setStatusMessage(
        isTa 
          ? 'மைக் பொத்தானை அழுத்தி உங்கள் பிரச்சனையை கூறுங்கள் (எ.கா: "எனக்கு 2 நாட்களாக கடுமையான காய்ச்சல் உள்ளது")'
          : 'Tap microphone and speak symptoms (e.g. "I have severe fever and cough for 2 days")'
      );
    } else {
      stopListening();
    }
  }, [isOpen, voiceLang]);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isTa ? 'உங்கள் உலாவியில் குரல் அறிதல் ஆதரிக்கப்படவில்லை.' : 'Speech recognition not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isTa ? 'ta-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage(isTa ? 'கேட்கிறது... தயவுசெய்து பேசுங்கள் 🎙️' : 'Listening... Please speak your concern 🎙️');
      };

      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map(r => r[0].transcript)
          .join('');
        setTranscript(text);
      };

      recognition.onerror = (event) => {
        console.warn('Speech error:', event.error);
        setIsListening(false);
        setStatusMessage(isTa ? 'குரல் தெளிவாக கேட்கவில்லை. மீண்டும் முயற்சி செய்யவும்.' : 'Could not detect voice clearly. Please try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  // Analyze recognized text and match department & hospital
  useEffect(() => {
    if (transcript.trim() && !isListening) {
      analyzeVoiceIntent(transcript);
    }
  }, [transcript, isListening]);

  const analyzeVoiceIntent = (text) => {
    const tLower = text.toLowerCase();

    // 1. Detect specialty or problem
    let matchedSpec = 'General Medicine';
    let matchedProb = text;

    if (tLower.includes('கண்') || tLower.includes('eye') || tLower.includes('பார்வை') || tLower.includes('vision')) {
      matchedSpec = 'Ophthalmology';
      matchedProb = 'Eye Strain & Vision Issues';
    } else if (tLower.includes('நெஞ்சு') || tLower.includes('heart') || tLower.includes('மாரடைப்பு') || tLower.includes('cardio')) {
      matchedSpec = 'Cardiology';
      matchedProb = 'Chest Pain & Hypertension';
    } else if (tLower.includes('பிரசவம்') || tLower.includes('கர்ப்பம்') || tLower.includes('pregnancy') || tLower.includes('gynec')) {
      matchedSpec = 'Obstetrics & Gynecology';
      matchedProb = 'Maternal Checkup';
    } else if (tLower.includes('எலும்பு') || tLower.includes('மூட்டு') || tLower.includes('bone') || tLower.includes('ortho') || tLower.includes('fracture')) {
      matchedSpec = 'Orthopedics';
      matchedProb = 'Joint & Bone Pain';
    } else if (tLower.includes('குழந்தை') || tLower.includes('child') || tLower.includes('pediatric')) {
      matchedSpec = 'Pediatrics';
      matchedProb = 'Child Care & Viral Infection';
    } else if (tLower.includes('தோல்') || tLower.includes('skin') || tLower.includes('அரிப்பு') || tLower.includes('derma')) {
      matchedSpec = 'Dermatology';
      matchedProb = 'Skin Rash & Allergies';
    } else {
      const probMatches = searchProblems(tLower);
      if (probMatches.length > 0) {
        matchedSpec = probMatches[0].specialty;
        matchedProb = probMatches[0].name;
      }
    }

    // 2. Detect Hospital match or default to TVMCH
    let matchedHosp = hospitals.find(h => h.id === 'h1'); // default to TVMCH
    if (tLower.includes('அரவிந்த்') || tLower.includes('aravind') || matchedSpec === 'Ophthalmology') {
      matchedHosp = hospitals.find(h => h.id === 'h3') || matchedHosp;
    } else if (tLower.includes('ஷிஃபா') || tLower.includes('shifa')) {
      matchedHosp = hospitals.find(h => h.id === 'h2') || matchedHosp;
    } else if (tLower.includes('கேலக்ஸி') || tLower.includes('galaxy')) {
      matchedHosp = hospitals.find(h => h.id === 'h4') || matchedHosp;
    }

    const result = {
      problem: matchedProb,
      specialty: matchedSpec,
      hospital: matchedHosp
    };

    setDetectedData(result);
    setStatusMessage(isTa ? 'அறிகுறி பகுப்பாய்வு நிறைவடைந்தது! ✅' : 'Symptoms analyzed successfully! ✅');

    // Voice feedback
    speakConfirmation(result);
  };

  const speakConfirmation = (result) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const message = isTa
        ? `உங்கள் அறிகுறிகளுக்கு ${result.hospital.name} மருத்துவமனையின் ${result.specialty} பிரிவு தேர்ந்தெடுக்கப்பட்டுள்ளது. டோக்கன் பதிவு செய்யவா?`
        : `Matched ${result.specialty} department at ${result.hospital.name}. Would you like to proceed with token booking?`;
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = isTa ? 'ta-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleProceedBooking = () => {
    if (!detectedData) return;

    updateBookingData({
      problem: detectedData.problem,
      specialty: detectedData.specialty,
      hospitalId: detectedData.hospital.id,
      hospitalName: detectedData.hospital.name,
      hospitalAddress: detectedData.hospital.address,
      consultationFee: detectedData.hospital.consultationFee,
      date: new Date().toISOString().split('T')[0]
    });

    onClose();
    navigate(`/book?problem=${encodeURIComponent(detectedData.problem)}&hospitalId=${detectedData.hospital.id}&department=${encodeURIComponent(detectedData.specialty)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center font-black">
              <FaMicrophone size={18} className={isListening ? 'animate-pulse text-rose-400' : ''} />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                {isTa ? 'குரல் வழி OPD முன்பதிவு' : 'Voice-Assisted OPD Booking'}
              </h3>
              <p className="text-xs text-sky-200">
                {isTa ? 'தமிழ் & ஆங்கிலத்தில் பேசி டோக்கன் பெறுங்கள்' : 'AI Speech Triage for Tirunelveli Hospitals'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <div className="flex items-center bg-white/10 rounded-xl p-0.5 text-xs font-bold border border-white/15">
              <button
                type="button"
                onClick={() => setVoiceLang('ta')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  voiceLang === 'ta'
                    ? 'bg-sky-500 text-white font-black shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                தமிழ்
              </button>
              <button
                type="button"
                onClick={() => setVoiceLang('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  voiceLang === 'en'
                    ? 'bg-sky-500 text-white font-black shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center text-center space-y-5">
          {/* Animated Microphone Trigger */}
          <div className="relative flex items-center justify-center my-2">
            {isListening && (
              <>
                <div className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-ping"></div>
                <div className="absolute w-24 h-24 rounded-full bg-rose-500/30 animate-pulse"></div>
              </>
            )}

            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white ring-4 ring-rose-200 scale-105'
                  : 'bg-gradient-to-tr from-sky-600 to-teal-500 hover:from-sky-700 hover:to-teal-600 text-white hover:scale-105'
              }`}
            >
              <FaMicrophone size={28} />
            </button>
          </div>

          <div>
            <p className="font-bold text-xs text-slate-700 tracking-wide uppercase">
              {isListening 
                ? (isTa ? 'குரல் பதிவு செய்யப்படுகிறது...' : 'Listening to speech...')
                : (isTa ? 'மைக் பட்டனை தட்டி பேசவும்' : 'Tap to start speaking')}
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              {statusMessage}
            </p>
          </div>

          {/* Real-time transcript box */}
          {transcript && (
            <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                {isTa ? 'உரையாடல் பகுதி' : 'Detected Speech'}:
              </span>
              <p className="text-sm font-semibold text-slate-800 italic">
                "{transcript}"
              </p>
            </div>
          )}

          {/* Matched Booking Recommendation Card */}
          {detectedData && (
            <div className="w-full bg-sky-50/80 border-2 border-sky-200 rounded-2xl p-4 text-left space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="badge badge-success text-[10px] font-black flex items-center gap-1">
                  <FaCheckCircle /> {isTa ? 'பரிந்துரைக்கப்பட்டது' : 'AI Match Found'}
                </span>
                <span className="text-xs font-black text-sky-900">
                  {detectedData.hospital.consultationFee === 0 ? 'FREE OPD (₹0)' : `₹${detectedData.hospital.consultationFee}`}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <FaHospital className="text-sky-600" />
                  {detectedData.hospital.name}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isTa ? 'சிறப்பு பிரிவு:' : 'Department:'} <strong className="text-sky-800">{detectedData.specialty}</strong>
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-sky-200/60 text-xs">
                <span className="text-slate-500">
                  {isTa ? 'டோக்கன் காத்திருப்பு நேரம்:' : 'Approx. Wait:'} <strong>~{detectedData.hospital.waitingTime} mins</strong>
                </span>

                <button
                  type="button"
                  onClick={() => speakConfirmation(detectedData)}
                  className="text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <FaVolumeUp size={12} /> {isTa ? 'மீண்டும் கேட்க' : 'Replay Audio'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleProceedBooking}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <span>{isTa ? 'நேரலை டோக்கன் முன்பதிவு செய்க' : 'Proceed with Instant OPD Booking'}</span>
                <FaArrowRight size={12} />
              </button>
            </div>
          )}

          {/* Quick Voice Prompt Hints */}
          {!detectedData && (
            <div className="w-full pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {isTa ? 'மாதிரி வாக்கியங்கள்' : 'Sample Phrases You Can Say'}:
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {(isTa ? [
                  'எனக்கு நெஞ்சு வலி உள்ளது',
                  'கண் பார்வை மங்கலாக தெரிகிறது',
                  'குழந்தைக்கு சளி மற்றும் இருமல்',
                  'அரசு மருத்துவமனை பொது மருத்துவர்'
                ] : [
                  'I have fever and body pain',
                  'Need an eye specialist at Aravind',
                  'Severe knee bone pain',
                  'Free OPD at TVMCH hospital'
                ]).map((hint, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTranscript(hint);
                      analyzeVoiceIntent(hint);
                    }}
                    className="text-[10px] bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-semibold px-2.5 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
                  >
                    "{hint}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceBookingModal;
