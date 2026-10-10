import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import SettingsModal from './SettingsModal';
import MultiLinkModal from './MultiLinkModal';
import OfflineSMSBookingModal from '../booking/OfflineSMSBookingModal';
import VoiceBookingModal from '../voice/VoiceBookingModal';
import QRScannerModal from '../queue/QRScannerModal';
import toast from 'react-hot-toast';
import { 
  FaHeartbeat, 
  FaTicketAlt, 
  FaCalendarCheck, 
  FaHospital, 
  FaBalanceScale, 
  FaMagic, 
  FaAmbulance, 
  FaCode, 
  FaShieldAlt, 
  FaUserMd, 
  FaUserCircle,
  FaSignOutAlt,
  FaCheckCircle,
  FaClock,
  FaTint,
  FaFilePrescription,
  FaQrcode,
  FaSms,
  FaCompass,
  FaFire,
  FaCog,
  FaMicrophone,
  FaLink,
  FaSlidersH,
  FaVolumeUp,
  FaWhatsapp,
  FaBell,
  FaChartBar,
  FaStar,
  FaBuilding
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { t, isTamil } = useLanguage();

  const displayUserName = React.useMemo(() => {
    if (!user?.name) return 'Patient';
    if (user.name.includes('(+91') || /\+91\s*\d+/.test(user.name)) {
      if (user.mobile) {
        const saved = localStorage.getItem(`tvl_patient_name_${user.mobile}`);
        if (saved && !saved.includes('(+91')) return saved;
      }
      return 'Patient';
    }
    return user.name;
  }, [user?.name, user?.mobile]);

  // App Modal States
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [multiLinkOpen, setMultiLinkOpen] = useState(false);

  // Audio Chime Player
  const playTestChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
      toast.success(isTamil ? '🔔 OPD மணி ஒலி சோதிக்கப்பட்டது!' : '🔔 OPD Audio chime tested!');
    } catch (e) {
      console.warn('Audio error:', e);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Interactive Tools / Apps
  const smartApps = [
    {
      id: 'settings',
      name: isTamil ? 'அமைப்புகள் செயலி (Settings)' : 'Settings App',
      icon: FaSlidersH,
      badge: 'App',
      badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-700',
      action: () => setSettingsOpen(true)
    },
    {
      id: 'voice',
      name: isTamil ? 'குரல் வழி OPD முன்பதிவு' : 'Voice OPD Assistant',
      icon: FaMicrophone,
      badge: 'AI Voice',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-700',
      action: () => setVoiceOpen(true)
    },
    {
      id: 'scanner',
      name: isTamil ? 'நேரலை டோக்கன் QR ஸ்கேனர்' : 'Scan Token QR',
      icon: FaQrcode,
      badge: 'Scanner',
      badgeColor: 'bg-teal-950 text-teal-300 border-teal-700',
      action: () => setScannerOpen(true)
    },
    {
      id: 'sms',
      name: isTamil ? 'இணையமற்ற ஆஃப்லைன் SMS' : 'Offline SMS Booking',
      icon: FaSms,
      badge: 'No Net',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-700',
      action: () => setSmsOpen(true)
    },
    {
      id: 'multilink',
      name: isTamil ? 'விரைவு சுகாதார இணைப்புகள்' : 'Multi-Links Health Hub',
      icon: FaLink,
      badge: 'Hub',
      badgeColor: 'bg-sky-950 text-sky-300 border-sky-700',
      action: () => setMultiLinkOpen(true)
    }
  ];

  const navSections = [
    {
      title: isTamil ? 'நோயாளி சேவைகள்' : 'PATIENT SERVICES',
      links: [
        { name: t('nav_dashboard'), path: '/dashboard', icon: FaHeartbeat, badge: 'Live' },
        { name: isTamil ? 'டோக்கன் முன்பதிவு' : 'Book OPD Token', path: '/book', icon: FaTicketAlt },
        { name: t('nav_my_tokens'), path: '/appointments', icon: FaCalendarCheck },
        { name: isTamil ? 'நேரலை டோக்கன் (Live)' : 'Live Token & QR', path: '/track', icon: FaQrcode, badge: 'Live' },
        { name: isTamil ? 'மருத்துவ ஆவணங்கள்' : 'Health Records (Rx)', path: '/records', icon: FaFilePrescription, badge: 'AI' },
        { name: isTamil ? 'அருகிலுள்ள மருத்துவமனைகள்' : 'Nearest Hospitals (GPS)', path: '/hospitals', icon: FaCompass, badge: 'GPS' },
        { name: t('nav_compare'), path: '/compare', icon: FaBalanceScale },
        { name: isTamil ? 'பரிந்துரைகள்' : 'Smart Recommend', path: '/recommendations', icon: FaMagic }
      ]
    },
    {
      title: isTamil ? 'அவசர சிகிச்சை 24/7' : '24/7 EMERGENCY',
      links: [
        { 
          name: isTamil ? '108 அவசர பிரிவு' : 'Emergency 108 Desk', 
          path: '/emergency', 
          icon: FaAmbulance,
          highlight: true 
        },
        {
          name: isTamil ? 'இரத்த வங்கி & கொடையாளர்கள்' : 'Blood Bank & Donors',
          path: '/blood-bank',
          icon: FaTint,
          badge: 'Live'
        }
      ]
    },
    {
      title: isTamil ? 'டெவலப்பர் & தரவுகள்' : 'DEVELOPER & API',
      links: [
        { name: 'Open Health API Hub', path: '/api', icon: FaCode, badge: 'v1' }
      ]
    },
    {
      title: isTamil ? 'நிர்வாக கட்டுப்பாட்டு அறை' : 'ADMIN & STAFF CONSOLE',
      links: [
        { name: 'District Admin Console', path: '/admin/dashboard', icon: FaShieldAlt },
        { name: isTamil ? 'மருத்துவமனை மேலாண்மை' : 'Hospital Management', path: '/admin/hospitals', icon: FaHospital, badge: 'Fig 8.7.4' },
        { name: isTamil ? 'மருத்துவர் மேலாண்மை' : 'Doctor Management', path: '/admin/doctors', icon: FaUserMd, badge: 'Fig 8.7.4' },
        { name: isTamil ? 'முன்பதிவு அறிக்கைகள்' : 'Booking Reports', path: '/admin/reports', icon: FaChartBar, badge: 'Fig 8.7.5' },
        { name: isTamil ? 'நோயாளி கருத்துக்கள்' : 'Ratings & Feedback', path: '/admin/feedback', icon: FaStar, badge: 'Fig 8.7.5' },
        { name: isTamil ? 'நோயாளி Booking Heatmap' : 'Patient Booking Heatmap', path: '/admin/dashboard?tab=heatmap', icon: FaFire, badge: 'Hotspot' },
        { name: 'Hospital Staff Console', path: '/hospital/staff', icon: FaUserMd, staffOnly: true }
      ]
    },
    {
      title: isTamil ? 'கணக்கு மேலாண்மை' : 'USER ACCOUNT',
      links: [
        { name: t('my_profile'), path: '/profile', icon: FaUserCircle }
      ]
    }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 text-slate-200 select-none">
      {/* Scrollable Navigation Area */}
      <div className="space-y-5 overflow-y-auto pr-1.5 no-scrollbar">
        {/* Language Selector in Sidebar */}
        <div className="bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between shadow-xs">
          <div className="text-sm font-black text-slate-200 uppercase tracking-wider pl-1 flex items-center gap-2">
            <span className="text-base">🌐</span>
            <span>{isTamil ? 'மொழி' : 'Language'}</span>
          </div>
          <LanguageToggle />
        </div>

        {/* Location Banner */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
            📍
          </div>
          <div>
            <div className="text-base font-black text-white">Tirunelveli District</div>
            <div className="text-xs sm:text-sm text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>10 OPD Counters Online</span>
            </div>
          </div>
        </div>

        {/* DEDICATED SEPARATE AUDIO & NOTIFICATIONS CARD ON SIDEBAR */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 rounded-2xl p-4 border border-emerald-500/30 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-base">
                <FaVolumeUp />
              </div>
              <span className="text-base font-black text-white tracking-tight">
                {isTamil ? 'ஒலி & அறிவிப்புகள்' : 'Audio & Alerts'}
              </span>
            </div>
            <span className="text-xs font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          {/* Test OPD Audio Chime Button */}
          <button
            onClick={playTestChime}
            className="w-full py-3 px-3.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-200 hover:text-white text-sm font-black flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-102 active:scale-98 shadow-xs"
            title={isTamil ? 'OPD டோக்கன் மணி ஒலியை சோதிக்க கிளிக் செய்யவும்' : 'Click to test OPD Token Audio Chime'}
          >
            <FaVolumeUp size={16} className="animate-pulse text-emerald-400 flex-shrink-0" />
            <span>{isTamil ? '🔔 OPD மணி ஒலி சோதி' : '🔔 Test OPD Audio Chime'}</span>
          </button>

          {/* Connected Notification Channels Status */}
          <div className="space-y-2.5 pt-1.5 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-sm text-slate-200 font-bold px-1">
              <span className="flex items-center gap-2.5">
                <FaWhatsapp className="text-emerald-400" size={17} />
                <span>WhatsApp Alerts</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs sm:text-sm text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>ON</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-200 font-bold px-1">
              <span className="flex items-center gap-2.5">
                <FaSms className="text-teal-400" size={17} />
                <span>SMS Token Pass</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs sm:text-sm text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>ON</span>
              </span>
            </div>
          </div>
        </div>

        {/* SMART HEALTH APPS & TOOLS Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 mb-1">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-sky-400 m-0">
              ⚡ {isTamil ? 'செயலிகள் & கருவிகள்' : 'HEALTH APPS & TOOLS'}
            </h4>
            <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">5 Apps</span>
          </div>
          <div className="space-y-1.5">
            {smartApps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={app.action}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm sm:text-base font-bold transition-all text-slate-200 hover:text-white bg-slate-950/60 hover:bg-slate-800 border border-slate-800/90 hover:border-slate-700 cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Icon size={18} className="text-sky-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="truncate">{app.name}</span>
                  </div>
                  {app.badge && (
                    <span className={`text-xs font-black py-0.5 px-2 rounded-md border flex-shrink-0 ml-2 ${app.badgeColor}`}>
                      {app.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Groups */}
        {navSections.map((sec, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="px-3 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400 mb-2">
              {sec.title}
            </h4>
            <div className="space-y-1.5">
              {sec.links.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm sm:text-base font-bold transition-all no-underline ${
                      link.highlight
                        ? active
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40'
                        : active
                        ? 'bg-sky-600 text-white shadow-sm font-black'
                        : 'text-slate-200 hover:text-white hover:bg-slate-800/90'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Icon
                        size={18}
                        className={`flex-shrink-0 ${
                          link.highlight
                            ? 'text-rose-400'
                            : active
                            ? 'text-white'
                            : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{link.name}</span>
                    </div>

                    {link.badge && (
                      <span className="badge bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-black py-0.5 px-2 flex-shrink-0 ml-2">
                        {link.badge}
                      </span>
                    )}

                    {link.count && (
                      <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md flex-shrink-0 ml-2">
                        {link.count}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Extra item under User Account to directly open Settings App */}
              {sec.title.includes('USER ACCOUNT') || sec.title.includes('கணக்கு மேலாண்மை') ? (
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm sm:text-base font-bold transition-all text-slate-200 hover:text-white hover:bg-slate-800/90 cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3 truncate">
                    <FaCog size={18} className="text-slate-400" />
                    <span className="truncate">{isTamil ? 'அமைப்புகள் & விருப்பங்கள்' : 'Settings & Preferences'}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">⚙️</span>
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom User Card / Logout */}
      <div className="pt-4 mt-3 border-t border-slate-800">
        {isAuthenticated ? (
          <div className="flex items-center justify-between bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 shadow-xs">
            <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover border border-sky-400 flex-shrink-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-base flex-shrink-0">
                  {displayUserName ? displayUserName[0].toUpperCase() : 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1 truncate">
                <div className="text-base font-black text-white truncate">{displayUserName}</div>
                <div className="text-xs sm:text-sm text-slate-400 uppercase font-bold tracking-wider truncate">
                  {user?.role}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-3 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0"
              title="Logout"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-base text-center flex items-center justify-center gap-3 no-underline shadow-md"
          >
            <FaUserCircle size={18} />
            <span>Sign In to Account</span>
          </Link>
        )}
      </div>

      {/* Render All Connected Modals */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <VoiceBookingModal
        isOpen={voiceOpen}
        onClose={() => setVoiceOpen(false)}
      />
      <QRScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />
      <OfflineSMSBookingModal
        isOpen={smsOpen}
        onClose={() => setSmsOpen(false)}
      />
      <MultiLinkModal
        isOpen={multiLinkOpen}
        onClose={() => setMultiLinkOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
