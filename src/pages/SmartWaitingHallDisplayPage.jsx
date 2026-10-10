import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { useBooking } from '../context/BookingContext';
import { useHospital } from '../context/HospitalContext';
import { 
  speakTokenAnnouncement, 
  playHospitalChime, 
  testHospitalAudio,
  playEmergencySiren
} from '../utils/hospitalAudio';
import {
  FaExpand,
  FaCompress,
  FaVolumeUp,
  FaVolumeMute,
  FaBell,
  FaExclamationTriangle,
  FaHospital,
  FaClock,
  FaCheckCircle,
  FaUserMd,
  FaDoorOpen,
  FaQrcode,
  FaArrowLeft,
  FaShieldAlt,
  FaAmbulance,
  FaSyncAlt,
  FaForward,
  FaHeartbeat,
  FaFire
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const SmartWaitingHallDisplayPage = () => {
  const navigate = useNavigate();
  const { 
    appointments, 
    codeRedActive, 
    codeRedDetails, 
    triggerCodeRed, 
    clearCodeRed 
  } = useBooking();
  const { hospitals } = useHospital();

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAudioVisualizing, setIsAudioVisualizing] = useState(false);
  const [selectedDept, setSelectedDept] = useState('All');

  // Real-time Clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Current Serving Token State (starts at 24 or highest active)
  const [currentServingToken, setCurrentServingToken] = useState(24);
  const [codeRedCountdown, setCodeRedCountdown] = useState(15 * 60); // 15 mins in seconds

  // Code Red Countdown ticker
  useEffect(() => {
    let interval = null;
    if (codeRedActive) {
      interval = setInterval(() => {
        setCodeRedCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      setCodeRedCountdown(15 * 60);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [codeRedActive]);

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.warn);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.warn);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Filter appointments for this OPD
  const activeQueue = useMemo(() => {
    // Generate synthetic realistic queue if empty
    const list = appointments && appointments.length > 0 
      ? appointments 
      : [
          { tokenNumber: 24, patientName: 'Selvakumar M', department: 'General Medicine', doctorName: 'Dr. S. Sundararajan', room: 'OPD-102', status: 'serving' },
          { tokenNumber: 25, patientName: 'Kavitha R', department: 'General Medicine', doctorName: 'Dr. S. Sundararajan', room: 'OPD-102', status: 'waiting' },
          { tokenNumber: 26, patientName: 'Murugan P', department: 'General Medicine', doctorName: 'Dr. S. Sundararajan', room: 'OPD-102', status: 'queued' },
          { tokenNumber: 27, patientName: 'Anitha S', department: 'General Medicine', doctorName: 'Dr. S. Sundararajan', room: 'OPD-102', status: 'queued' },
          { tokenNumber: 28, patientName: 'Gopal V', department: 'General Medicine', doctorName: 'Dr. S. Sundararajan', room: 'OPD-102', status: 'queued' },
        ];

    return list.filter(item => selectedDept === 'All' || item.department === selectedDept);
  }, [appointments, selectedDept]);

  // Current Patient
  const currentPatient = useMemo(() => {
    return activeQueue.find(a => Number(a.tokenNumber) === currentServingToken) || {
      tokenNumber: currentServingToken,
      patientName: 'Selvakumar M.',
      department: 'General Medicine',
      doctorName: 'Dr. S. Sundararajan, MD',
      room: 'OPD Room 102 (Block A)',
      status: 'serving'
    };
  }, [activeQueue, currentServingToken]);

  // Next 4 Upcoming Patients
  const upcomingPatients = useMemo(() => {
    const nextList = [];
    for (let i = 1; i <= 4; i++) {
      const num = currentServingToken + i;
      const found = activeQueue.find(a => Number(a.tokenNumber) === num);
      nextList.push({
        tokenNumber: num,
        patientName: found?.patientName || (num === 25 ? 'Kavitha R.' : num === 26 ? 'Murugan P.' : num === 27 ? 'Anitha S.' : 'Gopal V.'),
        department: found?.department || 'General Medicine',
        doctorName: found?.doctorName || 'Dr. Sundararajan',
        room: found?.room || 'OPD-102',
        estMinutes: i === 1 ? '1 - 2 mins' : `${i * 6} mins`,
        status: i === 1 ? 'Doorstep / Next' : 'In Waiting Hall'
      });
    }
    return nextList;
  }, [activeQueue, currentServingToken]);

  // Trigger Token Broadcast with Chime + Visualizer
  const announceCurrent = (tokenNum, patient = currentPatient) => {
    setIsAudioVisualizing(true);
    setTimeout(() => setIsAudioVisualizing(false), 4500);

    if (soundEnabled) {
      speakTokenAnnouncement({
        tokenNumber: tokenNum,
        patientName: patient?.patientName || '',
        room: patient?.room || 'Room 102',
        doctorName: patient?.doctorName || 'Dr. Sundararajan'
      });
    } else {
      playHospitalChime();
    }
  };

  // Advance to next token
  const handleCallNextToken = () => {
    if (codeRedActive) {
      toast.error('Cannot advance token: Code Red Emergency is currently active!');
      return;
    }
    const next = currentServingToken + 1;
    setCurrentServingToken(next);
    announceCurrent(next);
  };

  // Re-broadcast Current Token
  const handleRepeatCurrent = () => {
    announceCurrent(currentServingToken);
  };

  // Code Red Toggle Modal State
  const [codeRedModalOpen, setCodeRedModalOpen] = useState(false);

  // Format countdown mm:ss
  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Dynamic QR code URL
  const qrTargetUrl = `${window.location.origin}/track/${currentServingToken}`;

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden ${isFullscreen ? 'p-4' : 'p-3 sm:p-6'}`}>
      
      {/* 🚨 CODE RED STROBE EMERGENCY BANNER */}
      {codeRedActive && (
        <div className="mb-4 rounded-3xl bg-gradient-to-r from-red-900 via-rose-700 to-red-900 border-4 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.7)] p-4 sm:p-6 text-white animate-pulse flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white text-rose-700 flex items-center justify-center text-3xl font-black shadow-xl animate-bounce">
              <FaAmbulance />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-black tracking-widest uppercase text-yellow-300">
                <FaFire className="animate-spin" /> CODE RED EMERGENCY TRAUMA OVERRIDE IN EFFECT
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                Regular OPD Queue Temporarily Suspended · Emergency Bay 1 Active
              </h2>
              <p className="text-xs text-rose-100 mt-0.5">
                {codeRedDetails?.reason || 'Cardiac / Multiple Trauma Resuscitation in progress'} · 
                Assigned: <strong>{codeRedDetails?.doctor || 'Dr. Sundararajan + Rapid Response Team'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-red-400 text-center">
              <span className="text-[10px] font-black uppercase text-rose-300 block">Est. Delay Hold</span>
              <span className="text-2xl font-mono font-black text-yellow-300">
                {formatCountdown(codeRedCountdown)}
              </span>
            </div>

            <button
              type="button"
              onClick={clearCodeRed}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all cursor-pointer active:scale-95 flex items-center gap-2"
              title="End Code Red and Resume regular token operations"
            >
              <FaCheckCircle />
              <span>Stand-Down / Code Green (Resume Queue)</span>
            </button>
          </div>
        </div>
      )}

      {/* TOP HEADER: Hospital Brand + Clock + Controls */}
      <header className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xl backdrop-blur-md mb-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-400 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-sky-500/20">
            <FaHospital />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                LIVE OPD SYSTEM
              </span>
              <span className="text-xs font-bold text-slate-400">TVMCH Palayamkottai</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              Tirunelveli Medical College Hospital
            </h1>
            <p className="text-[11px] text-teal-400 font-semibold">
              மத்திய புறநோயாளிகள் காத்திருப்பு மண்டபம் · Central OPD Smart TV Display
            </p>
          </div>
        </div>

        {/* Center: Live Digital Clock */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-950/80 px-6 py-2.5 rounded-2xl border border-slate-800">
          <div className="text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tirunelveli Local Time</div>
            <div className="text-2xl font-mono font-black text-white tracking-widest">
              {currentTime.toLocaleTimeString('en-IN', { hour12: true })}
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</div>
            <div className="text-xs font-bold text-teal-300">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Right: Actions (Fullscreen, Audio, Code Red, Exit) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs font-bold rounded-xl px-3 py-2 text-slate-200 outline-none cursor-pointer focus:border-teal-400"
          >
            <option value="All">All Departments</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>

          {/* Audio Announce Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              soundEnabled ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
            title="Toggle Voice Announcements"
          >
            {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
            <span className="hidden sm:inline">{soundEnabled ? 'Audio ON' : 'Audio Muted'}</span>
          </button>

          {/* Test Sound */}
          <button
            type="button"
            onClick={testHospitalAudio}
            className="px-3 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black shadow-md flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
            title="Test Ding-Dong Hospital Chime"
          >
            <FaBell />
            <span>Test Bell</span>
          </button>

          {/* 🚨 Code Red Trigger Button */}
          {!codeRedActive && (
            <button
              type="button"
              onClick={() => triggerCodeRed({ room: 'OPD Room 102', reason: 'Trauma & Cardiac Arrest Priority' })}
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg shadow-rose-600/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Trigger Emergency Code Red Pre-emption"
            >
              <FaExclamationTriangle />
              <span>🚨 Code Red</span>
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm transition-all cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter TV Fullscreen Mode'}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>

          {/* Exit / Back */}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-sm transition-all cursor-pointer"
            title="Back to Dashboard"
          >
            <FaArrowLeft />
          </button>
        </div>
      </header>

      {/* MAIN SPLIT SCREEN SECTION */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        
        {/* LEFT HERO: GIANT ACTIVE SERVING TOKEN (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-teal-500/40 rounded-3xl p-6 sm:p-8 flex-1 flex flex-col justify-between shadow-[0_0_60px_rgba(20,184,166,0.15)] relative overflow-hidden">
            
            {/* Top Badge: NOW SERVING */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs sm:text-sm font-black tracking-widest text-emerald-400 uppercase">
                  NOW CALLING / தற்போது அழைக்கப்படும் டோக்கன்
                </span>
              </div>

              {/* Sound Equalizer Visualizer */}
              <div className="flex items-center gap-1">
                {[40, 70, 90, 50, 100, 60, 80, 45].map((h, idx) => (
                  <span
                    key={idx}
                    className={`w-1 rounded-full bg-teal-400 transition-all duration-150 ${
                      isAudioVisualizing ? 'animate-bounce' : 'opacity-30'
                    }`}
                    style={{
                      height: isAudioVisualizing ? `${(h / 100) * 24}px` : '6px',
                      animationDelay: `${idx * 80}ms`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* GIANT TOKEN NUMBER */}
            <div className="my-6 sm:my-8 text-center flex flex-col items-center justify-center">
              <div className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-1">
                Token Serial Number
              </div>
              <div className="inline-block relative">
                <div className="text-7xl sm:text-9xl md:text-[130px] font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-teal-100 to-teal-400 drop-shadow-[0_10px_25px_rgba(45,212,191,0.3)]">
                  #{currentServingToken}
                </div>
              </div>

              <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-sm">
                <FaCheckCircle />
                <span>Patient: {currentPatient?.patientName || 'Calling Patient'}</span>
              </div>
            </div>

            {/* DOCTOR CHAMBER & ROOM INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xl">
                  <FaUserMd />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Doctor in Attendance</span>
                  <span className="text-base sm:text-lg font-extrabold text-white">
                    {currentPatient?.doctorName || 'Dr. S. Sundararajan, MD'}
                  </span>
                  <span className="text-xs text-indigo-400 block font-medium">
                    {currentPatient?.department || 'General Medicine'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center text-xl">
                  <FaDoorOpen />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Proceed To Room</span>
                  <span className="text-base sm:text-lg font-black text-teal-300">
                    {currentPatient?.room || 'OPD Room 102 (Block A)'}
                  </span>
                  <span className="text-xs text-slate-400 block font-medium">
                    Ground Floor Consultation Chamber
                  </span>
                </div>
              </div>
            </div>

            {/* QUICK OPERATOR BUTTONS (For Demo & Display Staff) */}
            <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handleRepeatCurrent}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <FaVolumeUp className="text-teal-400" />
                <span>Re-announce Token #{currentServingToken}</span>
              </button>

              <button
                type="button"
                onClick={handleCallNextToken}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
              >
                <span>Call Next Token #{currentServingToken + 1}</span>
                <FaForward />
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: UPCOMING TOKENS + QR FOR MOBILE QUEUE (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          
          {/* UPCOMING QUEUE TABLE */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                    NEXT IN LINE / அடுத்து வருபவர்கள்
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Avg. 5 min / patient</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {upcomingPatients.map((item, index) => (
                  <div
                    key={item.tokenNumber}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      index === 0
                        ? 'bg-sky-950/40 border-sky-500/40 shadow-md shadow-sky-500/10'
                        : 'bg-slate-950/60 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-base ${
                        index === 0 ? 'bg-sky-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300'
                      }`}>
                        #{item.tokenNumber}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">
                          {item.patientName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {item.department} · {item.room}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        index === 0 
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.status}
                      </span>
                      <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                        Est: <strong className="text-teal-400">{item.estMinutes}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>🔔 Please be ready at Room 102 when called</span>
              <span className="text-teal-400 font-bold">OPD Express Triage</span>
            </div>
          </div>

          {/* DYNAMIC QR CODE CARD: SCAN TO TAKE QUEUE TO PHONE */}
          <div className="bg-gradient-to-tr from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-xl flex items-center gap-5">
            <div className="p-3 bg-white rounded-2xl shadow-xl shrink-0">
              <QRCodeCanvas
                value={qrTargetUrl}
                size={110}
                level="M"
                includeMargin={false}
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-teal-400 tracking-wider mb-1">
                <FaQrcode /> Scan & Step Out Freely
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                Take This Live Token to Your Mobile
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                வரிசையில் காத்திருக்காமல் மருத்துவமனை கேன்டீன் செல்லலாம். உங்கள் முறை வரும்போது மொபைலில் ஒலிக்கும்!
              </p>
              <div className="mt-2 text-[10px] text-indigo-300 font-mono">
                {qrTargetUrl.replace('http://', '').replace('https://', '')}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* BOTTOM MARQUEE: LIVE HOSPITAL TELEMETRY TICKER */}
      <footer className="mt-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center gap-4 text-xs font-bold overflow-hidden shadow-xl backdrop-blur-md">
        <div className="bg-teal-500 text-slate-950 px-3 py-1 rounded-xl font-black text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          <span>HOSPITAL LIVE BULLETIN</span>
        </div>

        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="inline-flex items-center gap-8 animate-marquee text-slate-300 text-xs font-semibold">
            <span>🟢 <strong>OPD Room 102:</strong> Active & Consultations Ongoing</span>
            <span>🚑 <strong>108 Ambulance Command:</strong> 4 Rapid Response Units on Standby at Palayamkottai</span>
            <span>💊 <strong>Jan Aushadhi Generic Pharmacy:</strong> Counter 2 Pre-packing Active (Average Wait: 3 mins)</span>
            <span>🛏️ <strong>Tirunelveli District Beds:</strong> 48 ICU Beds & 124 General Beds Currently Available</span>
            <span>🩸 <strong>Blood Bank:</strong> O+ve 18 Units · B+ve 24 Units · A+ve 14 Units Available</span>
            <span>🚨 <strong>Emergency Helpline:</strong> 108 / 0462-2572727 (TVMCH Emergency Triage)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SmartWaitingHallDisplayPage;
