import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { useLanguage } from '../../context/LanguageContext';
import { useBooking } from '../../context/BookingContext';
import { 
  FaLink, 
  FaCopy, 
  FaCheck, 
  FaExternalLinkAlt, 
  FaHospital, 
  FaUserMd, 
  FaShieldAlt, 
  FaAmbulance, 
  FaTint, 
  FaMapMarkedAlt, 
  FaCode, 
  FaFolderOpen, 
  FaTv, 
  FaWhatsapp, 
  FaSms, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaShareAlt,
  FaPills
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const MultiLinkModal = ({ isOpen, onClose }) => {
  const { isTamil } = useLanguage();
  const { appointments, lastBookedToken } = useBooking();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('portals'); // 'portals' or 'share'
  const [copiedLinkIndex, setCopiedLinkIndex] = useState(null);

  const activeToken = lastBookedToken || appointments[0];
  const tokenId = activeToken?.id || 'TVL-TKN-5407';

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedLinkIndex(idx);
    toast.success(isTamil ? 'இணைப்பு நகலெடுக்கப்பட்டது!' : 'Multi-link copied to clipboard!');
    setTimeout(() => setCopiedLinkIndex(null), 2000);
  };

  const portalLinks = [
    {
      category: isTamil ? 'பொதுமக்கள் & நோயாளிகள் போர்டல்' : 'Citizen & Patient Portals',
      items: [
        {
          name: isTamil ? 'நேரலை OPD டோக்கன் டிராக்கர்' : 'Live OPD Token Queue Tracker',
          path: `/track/${tokenId}`,
          icon: FaTv,
          badge: 'Live TV',
          color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
        },
        {
          name: isTamil ? 'மருத்துவமனை தேடல் & முன்பதிவு' : 'Find Care & OPD Appointment Booking',
          path: '/book',
          icon: FaHospital,
          badge: 'Booking',
          color: 'text-sky-600 bg-sky-50 border-sky-200'
        },
        {
          name: isTamil ? 'திருநெல்வேலி மருத்துவமனைகள் ஒப்பீடு' : 'Hospital Live Crowd & Wait Comparison',
          path: '/compare',
          icon: FaExternalLinkAlt,
          badge: 'Compare',
          color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
        },
        {
          name: isTamil ? 'ABHA டிஜிட்டல் ஹெல்த் லாக்கர்' : 'ABHA Digital Health Records & Locker',
          path: '/records',
          icon: FaFolderOpen,
          badge: 'ABDM',
          color: 'text-amber-600 bg-amber-50 border-amber-200'
        }
      ]
    },
    {
      category: isTamil ? 'மருத்துவமனை ஊழியர்கள் & கட்டுப்பாட்டு அறை' : 'Hospital Staff & Admin Command',
      items: [
        {
          name: isTamil ? 'மருத்துவர் & நர்ஸ் OPD கவுண்ட்டர் கன்சோல்' : 'Doctor & Nurse OPD Station Console',
          path: '/hospital/staff',
          icon: FaUserMd,
          badge: 'Doctor Call',
          color: 'text-teal-600 bg-teal-50 border-teal-200'
        },
        {
          name: isTamil ? 'மருந்தகம் முன்-பேக்கிங் & டிஸ்பென்ஸ் மையம்' : 'Pharmacy Pre-Packing & Dispense Hub',
          path: '/pharmacy',
          icon: FaPills,
          badge: 'Zero Wait',
          color: 'text-emerald-700 bg-emerald-50 border-emerald-300'
        },
        {
          name: isTamil ? 'மாவட்ட சுகாதார நிர்வாகி டாஷ்போர்டு' : 'District Public Health Admin Command',
          path: '/admin/dashboard',
          icon: FaShieldAlt,
          badge: 'Admin Only',
          color: 'text-purple-600 bg-purple-50 border-purple-200'
        },
        {
          name: isTamil ? 'அவசர 108 & ICU படுக்கை மேட்ரிக்ஸ்' : 'Emergency 108 Casualty & ICU Matrix',
          path: '/emergency',
          icon: FaAmbulance,
          badge: 'SOS 108',
          color: 'text-rose-600 bg-rose-50 border-rose-200'
        },
        {
          name: isTamil ? 'மாவட்ட மைய இரத்த வங்கி நிலவரம்' : 'Tirunelveli Central Blood Bank Stock',
          path: '/blood-bank',
          icon: FaTint,
          badge: 'Blood Stock',
          color: 'text-red-600 bg-red-50 border-red-200'
        },
        {
          name: isTamil ? 'உள் அரங்கு வரைபடம் (Floor Plan Guide)' : 'Indoor Hospital Floorplan & Room Map',
          path: '/hospital/h1/map',
          icon: FaMapMarkedAlt,
          badge: 'Navigation',
          color: 'text-cyan-600 bg-cyan-50 border-cyan-200'
        },
        {
          name: isTamil ? 'டெவலப்பர் REST API ஹப் & cURL' : 'Developer REST API Hub & cURL Explorer',
          path: '/api',
          icon: FaCode,
          badge: 'Swagger API',
          color: 'text-slate-700 bg-slate-100 border-slate-300'
        }
      ]
    }
  ];

  const shareableLinks = [
    {
      title: isTamil ? 'நேரலை டோக்கன் டிராக்கர் வெப் லிங்க்' : 'Live Token Tracker Web Link',
      url: `${window.location.origin}/track/${tokenId}`,
      type: 'Web URL',
      icon: FaLink,
      color: 'text-sky-600'
    },
    {
      title: isTamil ? 'வாட்ஸ்அப் பகிர்வு இணைப்பு' : 'WhatsApp Token Pass Link',
      url: `https://wa.me/?text=${encodeURIComponent(`[TVL SmartCare OPD Pass] Token #${activeToken?.tokenNumber || 40} at ${activeToken?.hospitalName || 'TVMCH'}. Track Live: ${window.location.origin}/track/${tokenId}`)}`,
      type: 'WhatsApp Protocol',
      icon: FaWhatsapp,
      color: 'text-emerald-600'
    },
    {
      title: isTamil ? 'SMS கேட்வே ஆஃப்லைன் இணைப்பு' : 'SMS Protocol Deep Link (No Internet)',
      url: `sms:9442400108?body=${encodeURIComponent(`TVL TVMC GENERAL`)}`,
      type: 'SMS Gateway',
      icon: FaSms,
      color: 'text-teal-600'
    },
    {
      title: isTamil ? 'மின்னஞ்சல் பாஸ் இணைப்பு (Mailto)' : 'Email Consultation Pass Link',
      url: `mailto:?subject=${encodeURIComponent(`[TVL SmartCare] Confirmed OPD Token Pass #${activeToken?.tokenNumber || 40}`)}&body=${encodeURIComponent(`Your token pass for ${activeToken?.hospitalName || 'TVMCH'} is confirmed. Room: ${activeToken?.room || 'OPD 102'}. Track: ${window.location.origin}/track/${tokenId}`)}`,
      type: 'Mailto Protocol',
      icon: FaEnvelope,
      color: 'text-indigo-600'
    },
    {
      title: isTamil ? 'கூகுள் மேப் GPS வழிசெலுத்தல்' : 'Google Maps GPS Directions Link',
      url: `https://www.google.com/maps/search/?api=1&query=Tirunelveli+Medical+College+Hospital+High+Grounds`,
      type: 'GPS Map Link',
      icon: FaMapMarkerAlt,
      color: 'text-red-500'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isTamil ? '🔗 மல்டி-லிங்க்ஸ் விரைவு அணுகல் போர்ட்டல் (Multi-Links Hub)' : '🔗 Multi-Links Deep Access & Portal Hub'}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4 text-left">
        {/* Banner */}
        <div className="p-4 bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white rounded-2xl border border-sky-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold flex-shrink-0">
              <FaLink size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-sky-400">
                {isTamil ? 'அனைத்து போர்டல்களுக்கான நேரடி அணுகல்' : 'Unified Deep-Linking Gateway'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {isTamil ? 'அனைத்து மருத்துவமனை சேவைகள் மற்றும் பகிர்வு இணைப்புகளை ஒரே இடத்தில் அணுகவும்.' : 'Direct access to all 10+ portals, live queues, protocols, and APIs.'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('portals')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'portals'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FaHospital size={16} />
            <span>{isTamil ? 'அனைத்து போர்டல் இணைப்புகள் (10+)' : 'Healthcare Portals (10+)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'share'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FaShareAlt size={16} />
            <span>{isTamil ? 'பகிர்வு மல்டி-லிங்க்ஸ் (WhatsApp/SMS/Email/GPS)' : 'Shareable Multi-Links (Deep Links)'}</span>
          </button>
        </div>

        {/* TAB 1: ALL PORTALS MULTI-LINKS */}
        {activeTab === 'portals' && (
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
            {portalLinks.map((cat, idx) => (
              <div key={idx}>
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider block mb-2.5">
                  {cat.category}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {cat.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={itemIdx}
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate(item.path);
                        }}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-xs text-left transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-sky-600 transition-colors">
                              {item.name}
                            </div>
                            <span className="text-xs font-mono text-slate-400 truncate block mt-0.5">
                              {item.path}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex-shrink-0 ml-1.5">
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: SHAREABLE MULTI-LINKS */}
        {activeTab === 'share' && (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            <p className="text-sm text-slate-500 mb-2.5">
              {isTamil 
                ? 'டோக்கன் அனுமதிச்சீட்டு அல்லது அவசர சேவையை பல்வேறு செயலிகளுக்கு ஒரே கிளிக்கில் பகிரலாம்:'
                : 'Direct cross-platform protocol links for instant patient sharing:'}
            </p>

            {shareableLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <Icon className={link.color} size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {link.title}
                        </span>
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {link.type}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-slate-400 truncate mt-0.5">
                        {link.url}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(link.url, idx)}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                    >
                      {copiedLinkIndex === idx ? <FaCheck className="text-emerald-600" /> : <FaCopy size={13} />}
                      <span>{copiedLinkIndex === idx ? (isTamil ? 'நகலானது' : 'Copied') : (isTamil ? 'நகல்' : 'Copy')}</span>
                    </button>

                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 no-underline"
                    >
                      <FaExternalLinkAlt size={12} />
                      <span>{isTamil ? 'திறக்க' : 'Open'}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm cursor-pointer"
          >
            {isTamil ? 'மூடுக' : 'Close'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MultiLinkModal;
