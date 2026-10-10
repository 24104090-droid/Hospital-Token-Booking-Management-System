import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FaLanguage, FaChevronDown, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const LanguageToggle = ({ compact = false, className = '' }) => {
  const { lang, setLanguage, languages, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code, nativeName) => {
    setLanguage(code);
    setIsOpen(false);
    const msg = code === 'ta' 
      ? 'மொழி முழுமையாக தமிழுக்கு மாற்றப்பட்டது!' 
      : code === 'hi' 
      ? 'भाषा पूरी तरह से हिन्दी में बदल दी गई!'
      : code === 'ml'
      ? 'ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി!'
      : code === 'te'
      ? 'భాష తెలుగులోకి మార్చబడింది!'
      : `Language switched to ${nativeName}`;
    toast.success(msg, {
      icon: '🌐',
      duration: 2500
    });
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-slate-200/90 dark:border-slate-700/80 hover:border-sky-400 dark:hover:border-sky-500 bg-white/95 dark:bg-slate-900/95 hover:bg-sky-50/70 dark:hover:bg-sky-950/40 text-slate-700 dark:text-slate-200 text-sm sm:text-base font-bold transition-all shadow-2xs hover:shadow-sm cursor-pointer select-none active:scale-[0.98]"
        title="Select Language (English, தமிழ், हिन्दी, മലയാളம், తెలుగు)"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none">{currentLanguage.flag}</span>
        {!compact ? (
          <span className="font-black text-slate-800 dark:text-slate-100 text-sm sm:text-base">
            {currentLanguage.nativeName}
          </span>
        ) : (
          <span className="font-black text-slate-800 dark:text-slate-100 uppercase text-xs">
            {currentLanguage.code}
          </span>
        )}
        <FaChevronDown 
          size={12} 
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-sky-600' : ''}`} 
        />
      </button>

      {/* Floating Language Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fade-in text-left">
          <div className="px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span>🌐 Select Language</span>
            <span className="text-sky-600 font-mono text-xs font-bold">{languages.length} options</span>
          </div>

          <div className="py-1 space-y-1">
            {languages.map((l) => {
              const isSelected = l.code === lang;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleSelect(l.code, l.nativeName)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 font-black border border-sky-200 dark:border-sky-800/80 shadow-2xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{l.flag}</span>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-black leading-tight">{l.nativeName}</span>
                      <span className="text-xs text-slate-400 font-semibold leading-tight">{l.name}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center flex-shrink-0 text-xs">
                      <FaCheck size={11} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
