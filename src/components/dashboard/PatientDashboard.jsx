import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { useHospital } from '../../context/HospitalContext';
import { useLanguage } from '../../context/LanguageContext';
import { useRecentActivity } from '../../context/RecentActivityContext';
import HospitalCard from '../hospitals/HospitalCard';
import RecentlyViewed from '../common/RecentlyViewed';
import { 
  FaSearch, 
  FaTicketAlt, 
  FaClock, 
  FaHospital, 
  FaArrowRight, 
  FaAmbulance, 
  FaCheckCircle,
  FaEdit,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { appointments, lastBookedToken, updateBookingData } = useBooking();
  const { hospitals } = useHospital();
  const { t, isTamil } = useLanguage();
  const { addRecentSearch } = useRecentActivity();

  const [isEditingName, setIsEditingName] = React.useState(false);
  const [tempName, setTempName] = React.useState('');

  const displayName = React.useMemo(() => {
    if (!user?.name) return isTamil ? 'நோயாளி' : 'Patient';
    let n = user.name;
    if (n.includes('(+91') || /\+91\s*\d+/.test(n) || /Patient\s*\(\+?91/i.test(n)) {
      if (user.mobile) {
        const saved = localStorage.getItem(`tvl_patient_name_${user.mobile}`);
        if (saved && !saved.includes('(+91')) return saved;
      }
      return isTamil ? 'நோயாளி' : 'Patient';
    }
    return n;
  }, [user?.name, user?.mobile, isTamil]);

  const handleSaveName = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      if (updateProfile) {
        updateProfile({ name: tempName.trim() });
      }
      setIsEditingName(false);
    }
  };

  const activeToken = appointments.find(a => a.status === 'confirmed' || a.status === 'serving') || lastBookedToken;

  const quickProblems = [
    { name: 'Fever & Chills', tamil: 'காய்ச்சல் & குளிர்', spec: 'General Medicine', icon: '🌡️', bg: 'bg-amber-50 border-amber-200 text-amber-900' },
    { name: 'Cold, Flu & Cough', tamil: 'சளி & இருமல்', spec: 'General Medicine', icon: '💨', bg: 'bg-sky-50 border-sky-200 text-sky-900' },
    { name: 'Skin Rash & Acne', tamil: 'தோல் பிரச்சனை', spec: 'Dermatology', icon: '🧴', bg: 'bg-rose-50 border-rose-200 text-rose-900' },
    { name: 'Eye Irritation', tamil: 'கண் பிரச்சனை', spec: 'Ophthalmology', icon: '👁️', bg: 'bg-teal-50 border-teal-200 text-teal-900' },
    { name: 'Chest Pain & Heart', tamil: 'இதய பிரச்சனை', spec: 'Cardiology', icon: '❤️', bg: 'bg-red-50 border-red-200 text-red-900' },
    { name: 'Bone & Joint Pain', tamil: 'மூட்டு & எலும்பு வலி', spec: 'Orthopedics', icon: '🦴', bg: 'bg-indigo-50 border-indigo-200 text-indigo-900' },
    { name: "Women's Health", tamil: 'மகப்பேறு & பெண்கள் நலம்', spec: 'Obstetrics & Gynecology', icon: '🤰', bg: 'bg-purple-50 border-purple-200 text-purple-900' },
    { name: 'Child & Infant Care', tamil: 'குழந்தைகள் நலம்', spec: 'Pediatrics', icon: '👶', bg: 'bg-cyan-50 border-cyan-200 text-cyan-900' }
  ];

  const handleSelectProblem = (problem) => {
    addRecentSearch(problem.name);
    updateBookingData({
      problem: problem.name,
      specialty: problem.spec
    });
    navigate(`/book?problem=${encodeURIComponent(problem.name)}`);
  };

  return (
    <div className="flex flex-col gap-8 w-full text-left">
      {/* Super Hero Banner */}
      <div className="gradient-hero p-6 sm:p-10 relative overflow-hidden rounded-3xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-xs font-black uppercase tracking-wider text-sky-200 mb-3 shadow-xs">
            <span className="live-pulse"></span>
            <span>{t('live_opd_badge')}</span>
          </div>

          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-2 mb-3 mt-1 flex-wrap">
              <span className="text-xl sm:text-2xl font-black text-white">{t('vanakkam')},</span>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder={isTamil ? "உங்கள் பெயர்" : "Enter your name"}
                className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-base sm:text-lg border-2 border-teal-400 focus:outline-none shadow-md"
                autoFocus
                required
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow flex items-center gap-1 cursor-pointer"
              >
                <FaCheck size={12} />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm cursor-pointer flex items-center gap-1"
              >
                <FaTimes size={12} />
                <span>Cancel</span>
              </button>
            </form>
          ) : (
            <div className="flex items-center flex-wrap gap-2.5 mb-3">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {t('vanakkam')}, <span className="text-teal-300 capitalize">{displayName}</span>!
              </h1>
              <button
                onClick={() => {
                  setTempName(displayName === 'Patient' || displayName === 'நோயாளி' ? '' : displayName);
                  setIsEditingName(true);
                }}
                title={isTamil ? "பெயர் மாற்றுக" : "Change display name"}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-teal-200 hover:text-white transition-all text-xs font-bold border border-white/20 backdrop-blur-sm cursor-pointer shadow-xs"
              >
                <FaEdit size={12} />
                <span>{isTamil ? 'பெயர் மாற்றுக' : 'Edit Name'}</span>
              </button>
            </div>
          )}

          <p className="text-sky-100 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
            {isTamil 
              ? 'திருநெல்வேலி அரசு மருத்துவக் கல்லூரி மருத்துவமனை (TVMCH), ஷிஃபா, அரவிந்த் கண் மருத்துவமனை, காவேரி ஆகியவற்றில் புறநோயாளி டோக்கன் முன்பதிவு செய்து நேரலையில் கண்காணியுங்கள்.'
              : 'Book smart OPD tokens for Tirunelveli Medical College Hospital (TVMCH), Shifa, Aravind Eye, Kauvery, and more. Track live serving counters in real-time.'}
          </p>

          <div className="flex flex-wrap gap-3.5">
            <button
              onClick={() => navigate('/book')}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-sky-50 text-slate-900 font-black text-sm sm:text-base shadow-lg transition-all flex items-center gap-2.5 cursor-pointer hover:scale-105"
            >
              <FaSearch className="text-sky-600" size={15} />
              <span>{isTamil ? 'புறநோயாளி டோக்கன் பெறுக' : 'Book OPD Token Now'}</span>
            </button>
            <button
              onClick={() => navigate('/emergency')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-sm sm:text-base shadow-lg transition-all flex items-center gap-2.5 cursor-pointer hover:scale-105"
            >
              <FaAmbulance size={16} className="animate-pulse" />
              <span>{t('emergency_108')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Live Token Banner */}
      {activeToken && (
        <div className="bg-gradient-to-r from-sky-800 via-sky-900 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-sky-500/30">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white text-slate-900 flex flex-col items-center justify-center font-mono font-black shadow-lg p-2 flex-shrink-0">
                <span className="text-xs font-black text-sky-600 uppercase tracking-widest">TOKEN</span>
                <span className="text-3xl sm:text-4xl text-slate-900 leading-none mt-1">#{activeToken.tokenNumber}</span>
              </div>

              <div>
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <span className="badge bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm px-2.5 py-1">
                    🟢 LIVE QUEUE
                  </span>
                  <span className="text-sm sm:text-base text-sky-100 font-bold">{activeToken.date} • {activeToken.timeSlot}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">{activeToken.hospitalName}</h3>
                <p className="text-sm sm:text-base text-sky-100 mt-1">
                  Doctor: <strong>{activeToken.doctorName}</strong> ({activeToken.department}) • Room: <strong>{activeToken.room}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 sm:gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-white/20">
              <div className="bg-white/10 px-4 py-2.5 rounded-xl text-center">
                <span className="text-xs uppercase font-extrabold text-sky-200 block">{t('now_serving')}</span>
                <span className="text-xl sm:text-2xl font-mono font-black text-emerald-300">
                  Token #{activeToken.currentServing || 9}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs sm:text-sm font-bold text-sky-200 block">{t('estimated_wait')}</span>
                <span className="text-xl sm:text-2xl font-black text-white">
                  ~{activeToken.estimatedWaitMinutes || 15} Mins
                </span>
              </div>

              <button
                onClick={() => navigate('/appointments')}
                className="px-5 py-3 rounded-xl bg-white hover:bg-sky-50 text-slate-950 font-black text-sm sm:text-base shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
              >
                <span>{t('track_live')}</span>
                <FaArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recently Accessed Section */}
      <RecentlyViewed />

      {/* Quick Problem Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('select_health_concern')}</h2>
              <span className="badge badge-primary font-bold text-xs">{t('fast_routing')}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {isTamil ? 'அறிகுறிகளின் அடிப்படையில் உடனடி துறை பரிந்துரை' : 'Instant hospital and doctor recommendations based on symptoms'}
            </p>
          </div>
          <Link to="/book" className="text-sm font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1.5 bg-sky-50 dark:bg-sky-950/40 px-3.5 py-2 rounded-xl border border-sky-200 dark:border-sky-800 no-underline shadow-2xs">
            <span>{t('view_all_problems')}</span>
            <FaArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickProblems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleSelectProblem(item)}
              className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between group cursor-pointer hover:shadow-md hover:-translate-y-0.5 h-full min-h-[102px] ${item.bg}`}
            >
              <div className="min-w-0 pr-2">
                <div className="text-3xl mb-1.5">{item.icon}</div>
                <div className="font-black text-sm sm:text-base text-slate-900 group-hover:text-sky-700 transition-colors truncate">
                  {isTamil ? item.tamil : item.name}
                </div>
                <div className="text-xs text-slate-600 font-semibold mt-1 truncate">{item.spec}</div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-white/80 group-hover:bg-white text-slate-400 group-hover:text-sky-600 flex items-center justify-center transition-all shadow-xs flex-shrink-0">
                <FaArrowRight size={12} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Key Live Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 h-full">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
            <FaHospital />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">{t('stat_hospitals')}</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold truncate">{t('stat_hospitals_sub')}</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 h-full">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
            <FaTicketAlt />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">{t('stat_tokens')}</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold truncate">{t('stat_tokens_sub')}</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 h-full">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
            <FaClock />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">{t('stat_wait')}</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold truncate">{t('stat_wait_sub')}</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 h-full">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
            <FaCheckCircle />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">{t('stat_free')}</div>
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold truncate">{t('stat_free_sub')}</div>
          </div>
        </div>
      </div>

      {/* Featured Hospitals Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t('featured_hospitals')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Real-time counter token availability and verified doctor schedules</p>
          </div>
          <Link to="/hospitals" className="text-sm font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs no-underline">
            <span>{t('explore_all')}</span>
            <FaArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.slice(0, 3).map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onSelect={() => navigate(`/hospital/${hospital.id}`)}
              onBook={() => {
                updateBookingData({
                  hospitalId: hospital.id,
                  hospitalName: hospital.name,
                  hospitalAddress: hospital.address,
                  consultationFee: hospital.consultationFee
                });
                navigate(`/book?hospitalId=${hospital.id}`);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
