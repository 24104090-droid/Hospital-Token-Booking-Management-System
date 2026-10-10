import React, { useState } from 'react';
import Modal from './Modal';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  FaSun, 
  FaMoon, 
  FaDesktop, 
  FaLeaf,
  FaTint,
  FaShieldAlt,
  FaPalette,
  FaLanguage, 
  FaBell, 
  FaWhatsapp, 
  FaSms, 
  FaEnvelope, 
  FaVolumeUp, 
  FaCheck,
  FaSlidersH
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const SettingsModal = ({ isOpen, onClose }) => {
  const { theme, setTheme, isDark, availableThemes } = useTheme();
  const { lang, setLanguage, isTamil, languages } = useLanguage();

  const [commPrefs, setCommPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('tvl_comm_prefs');
      return saved ? JSON.parse(saved) : { whatsapp: true, sms: true, email: true, sound: true };
    } catch {
      return { whatsapp: true, sms: true, email: true, sound: true };
    }
  });

  const toggleCommPref = (key) => {
    setCommPrefs(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('tvl_comm_prefs', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      toast.success(
        isTamil 
          ? `${key.toUpperCase()} அமைப்புகள் புதுப்பிக்கப்பட்டது` 
          : `${key.toUpperCase()} preference updated`
      );
      return updated;
    });
  };

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
      toast.success(isTamil ? 'அறிவிப்பு ஒலி சோதிக்கப்பட்டது!' : 'Hospital chime tested!');
    } catch (e) {
      console.warn('Audio error:', e);
    }
  };

  const getThemeIcon = (themeId) => {
    switch (themeId) {
      case 'light': return FaSun;
      case 'dark': return FaMoon;
      case 'system': return FaDesktop;
      case 'emerald': return FaLeaf;
      case 'indigo': return FaShieldAlt;
      case 'ocean': return FaTint;
      default: return FaPalette;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isTamil ? '⚙️ கணினி மற்றும் இடைமுக அமைப்புகள்' : '⚙️ Preferences & System Settings'}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6 text-left">
        {/* 1. Appearance / Theme */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2 m-0">
              <FaPalette className="text-sky-600 dark:text-sky-400" />
              <span>{isTamil ? 'இடைமுக தீம் தேர்வு (Theme)' : 'Appearance & Theme Selection'}</span>
            </label>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2.5 py-1 rounded-full">
              {availableThemes.length} {isTamil ? 'தீம்கள்' : 'Themes'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {availableThemes.map(opt => {
              const Icon = getThemeIcon(opt.id);
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTheme(opt.id);
                    toast.success(
                      isTamil 
                        ? `${opt.nameTa} தீம் உடனடியாக இயக்கப்பட்டது` 
                        : `${opt.name} theme applied instantly`
                    );
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-sky-50/90 dark:bg-sky-950/60 border-sky-500 dark:border-sky-400 ring-2 ring-sky-400/40 shadow-sm'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xs'
                  }`}
                >
                  {/* Top Bar with Icon & Selected Check */}
                  <div className="flex items-center justify-between w-full">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
                      style={{ 
                        backgroundColor: opt.previewCard, 
                        color: opt.colorHex,
                        border: `1px solid ${isSelected ? opt.colorHex : 'rgba(148, 163, 184, 0.3)'}`
                      }}
                    >
                      <Icon size={15} />
                    </div>

                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs shadow-xs">
                        <FaCheck size={10} />
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                        {opt.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                      {isTamil ? opt.nameTa : opt.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {isTamil ? opt.descTa : opt.desc}
                    </div>
                  </div>

                  {/* Live Mini Preview Bar */}
                  <div className="w-full h-2 rounded-full overflow-hidden flex border border-slate-200/60 dark:border-slate-700/60">
                    <div className="w-1/2 h-full" style={{ backgroundColor: opt.previewBg }}></div>
                    <div className="w-1/4 h-full" style={{ backgroundColor: opt.previewCard }}></div>
                    <div className="w-1/4 h-full" style={{ backgroundColor: opt.previewAccent }}></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Language Selection */}
        <div>
          <label className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2.5 flex items-center gap-2">
            <FaLanguage className="text-teal-600 dark:text-teal-400" />
            <span>{isTamil ? 'மொழி தேர்வு (Language)' : 'Multi-Lingual Selection'}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {languages.map((l) => {
              const isSelected = lang === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setLanguage(l.code);
                    toast.success(`Language switched to ${l.nativeName}`);
                  }}
                  className={`p-3.5 rounded-2xl border text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-500 text-teal-800 dark:text-teal-300 ring-2 ring-teal-400/30 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{l.flag}</span>
                    <div className="flex flex-col text-left">
                      <span className="font-extrabold text-sm leading-tight">{l.nativeName}</span>
                      <span className="text-xs text-slate-400 font-medium leading-tight">{l.name}</span>
                    </div>
                  </div>
                  {isSelected && <FaCheck size={14} className="text-teal-600 dark:text-teal-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Multi-Channel Message Communication Defaults */}
        <div>
          <label className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2.5 flex items-center gap-2">
            <FaBell className="text-emerald-600 dark:text-emerald-400" />
            <span>{isTamil ? 'செய்தி அறிவிப்பு வழிகள் (Msg Communication)' : 'Default Messaging Channels'}</span>
          </label>
          <div className="space-y-2.5">
            {/* WhatsApp */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <FaWhatsapp size={17} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {isTamil ? 'வாட்ஸ்அப் டோக்கன் அனுமதிச்சீட்டு' : 'WhatsApp Token Pass'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isTamil ? 'OPD டோக்கன் வாட்ஸ்அப்பில் பகிரப்படும்' : 'Direct token alerts via WhatsApp'}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={commPrefs.whatsapp}
                onChange={() => toggleCommPref('whatsapp')}
                className="w-5 h-5 rounded text-emerald-600 cursor-pointer"
              />
            </div>

            {/* SMS */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                  <FaSms size={17} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {isTamil ? 'SMS கேட்வே & ஆஃப்லைன் முன்பதிவு' : 'SMS Gateway & 2G Offline Booking'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isTamil ? '94424 00108 SMS கேட்வே வசதி' : 'SMS syntax dispatch & confirmation'}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={commPrefs.sms}
                onChange={() => toggleCommPref('sms')}
                className="w-5 h-5 rounded text-sky-600 cursor-pointer"
              />
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope size={17} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {isTamil ? 'மின்னஞ்சல் டோக்கன் சீட்டு (Email Pass)' : 'Email Consultation Pass'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isTamil ? 'PDF ரசீது மின்னஞ்சலில் அனுப்பப்படும்' : 'Official HTML receipt to patient email'}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={commPrefs.email}
                onChange={() => toggleCommPref('email')}
                className="w-5 h-5 rounded text-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 4. Audio Chime */}
        <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
              <FaVolumeUp size={17} />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                {isTamil ? 'மருத்துவமனை அறிவிப்பு மணி ஒலி' : 'Hospital OPD Bell Chime'}
              </div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                {isTamil ? 'டோக்கன் அழைக்கப்படும்போது ஒலிக்கும்' : 'Plays gong when token is called'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={playTestChime}
            className="px-3.5 py-2 text-sm font-bold bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-700 cursor-pointer transition-colors shadow-2xs"
          >
            {isTamil ? 'ஒலி சோதனை' : 'Test Sound'}
          </button>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-base cursor-pointer transition-all shadow-md hover:shadow-lg active:scale-98"
          >
            {isTamil ? '✓ சேமித்து மூடுக (Save & Close)' : '✓ Save & Apply Settings'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
