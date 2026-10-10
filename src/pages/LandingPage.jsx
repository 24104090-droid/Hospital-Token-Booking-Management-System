import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { 
  FaHospital, 
  FaTicketAlt, 
  FaClock, 
  FaShieldAlt, 
  FaMobileAlt, 
  FaCheckCircle, 
  FaArrowRight, 
  FaAmbulance, 
  FaUser,
  FaUserMd,
  FaQrcode,
  FaHeartbeat,
  FaSearch,
  FaCode
} from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t, isTamil } = useLanguage();
  const [showGetStartedModal, setShowGetStartedModal] = useState(false);

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-16 transition-colors duration-200">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full pt-8 sm:pt-12 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[360px] bg-gradient-to-tr from-sky-400/20 via-teal-300/15 to-indigo-400/10 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 rounded-full text-xs font-black uppercase tracking-wider text-sky-800 dark:text-sky-300 mb-6 shadow-xs">
              <span className="live-pulse"></span>
              <span>{t('landing_pill')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.12] mb-5 text-slate-900 dark:text-white">
              <span className="text-sky-600 dark:text-sky-400">TVL</span> <span className="text-teal-600 dark:text-teal-400">SmartCare</span>
            </h1>

            <p className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-200 mb-4">
              {isTamil ? 'திருநெல்வேலி மருத்துவமனை டோக்கன் முன்பதிவு & நேரலை வரிசை முறைமை' : 'Tirunelveli Hospital Token Booking & Live Queue System'}
            </p>

            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
              {t('landing_desc')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setShowGetStartedModal(true)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-black text-base shadow-xl shadow-sky-600/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>{t('btn_get_started')}</span>
                <FaArrowRight size={14} />
              </button>

              <Link
                to="/emergency"
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105 no-underline"
              >
                <FaAmbulance size={18} className="animate-pulse" />
                <span>{t('btn_emergency')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width Metrics Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 -mt-6 relative z-20 mb-12">
        <div className="w-full max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 p-5 sm:p-6 rounded-3xl bg-white shadow-xl border border-slate-200/80">
          <div className="text-center p-3 border-r border-slate-100 last:border-none">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-2.5 font-bold text-xl">
              <FaHospital />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{t('stat_hospitals')}</div>
            <div className="text-xs font-bold text-slate-500 uppercase mt-1">{t('stat_hospitals_sub')}</div>
          </div>

          <div className="text-center p-3 border-r border-slate-100 last:border-none">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2.5 font-bold text-xl">
              <FaTicketAlt />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-teal-600">{t('stat_tokens')}</div>
            <div className="text-xs font-bold text-slate-500 uppercase mt-1">{t('stat_tokens_sub')}</div>
          </div>

          <div className="text-center p-3 border-r border-slate-100 last:border-none">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2.5 font-bold text-xl">
              <FaClock />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">{t('stat_wait')}</div>
            <div className="text-xs font-bold text-slate-500 uppercase mt-1">{t('stat_wait_sub')}</div>
          </div>

          <div className="text-center p-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2.5 font-bold text-xl">
              <FaCheckCircle />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{t('stat_free')}</div>
            <div className="text-xs font-bold text-slate-500 uppercase mt-1">{t('stat_free_sub')}</div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-10">
        <div className="w-full max-w-[1440px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="badge badge-primary uppercase mb-2">
              4-Step Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{t('how_it_works')}</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{t('how_it_works_sub')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white font-black text-base flex items-center justify-center mb-4 shadow-md shadow-sky-600/20">
                1
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">{t('step_1_title')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {t('step_1_desc')}
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black text-base flex items-center justify-center mb-4 shadow-md shadow-teal-600/20">
                2
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">{t('step_2_title')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {t('step_2_desc')}
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-base flex items-center justify-center mb-4 shadow-md shadow-indigo-600/20">
                3
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">{t('step_3_title')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {t('step_3_desc')}
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center mb-4 shadow-md shadow-emerald-600/20">
                4
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">{t('step_4_title')}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {t('step_4_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Selection Modal */}
      <Modal
        isOpen={showGetStartedModal}
        onClose={() => setShowGetStartedModal(false)}
        title="Welcome to TVL SmartCare — Choose Portal"
      >
        <div className="flex flex-col gap-4 py-2 text-left">
          <p className="text-xs text-slate-500 text-center mb-2">
            Please choose how you would like to access the Tirunelveli Hospital Token Booking System:
          </p>

          {/* Option 1: Patient Login */}
          <div
            onClick={() => {
              setShowGetStartedModal(false);
              navigate('/login');
            }}
            className="p-4 rounded-2xl border-2 border-sky-200 hover:border-sky-500 bg-sky-50/50 hover:bg-sky-50 transition-all cursor-pointer flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                <FaUser />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
                  Patient Portal Login
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Book OPD tokens, track live waiting queues, view passes
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white text-sky-600 flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-xs">
              <FaArrowRight size={12} />
            </div>
          </div>

          {/* Option 2: Admin & Staff Login */}
          <div
            onClick={() => {
              setShowGetStartedModal(false);
              navigate('/admin/login');
            }}
            className="p-4 rounded-2xl border-2 border-slate-200 hover:border-slate-800 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-xl shadow-md">
                <FaShieldAlt />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-slate-950 transition-colors">
                  Hospital Admin & Staff Console
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  OPD counter dispatch, doctor chamber status, district controls
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white text-slate-700 flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-xs">
              <FaArrowRight size={12} />
            </div>
          </div>

          <div className="text-center pt-3 border-t border-slate-100 mt-2">
            <span className="text-xs text-slate-400">
              New patient? You can also{' '}
              <Link to="/register" onClick={() => setShowGetStartedModal(false)} className="text-sky-600 font-bold hover:underline">
                Create an account
              </Link>
            </span>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default LandingPage;
