import React from 'react';
import AppLayout from '../components/common/AppLayout';
import HospitalList from '../components/hospitals/HospitalList';
import { useLanguage } from '../context/LanguageContext';

const HospitalsPage = () => {
  const { isTamil } = useLanguage();

  return (
    <AppLayout>
      <div className="space-y-6 w-full text-left">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
              📍 Tirunelveli District Healthcare Network
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {isTamil ? 'மருத்துவமனை பட்டியல் & நேரலை வரிசை நிலவரம்' : 'Hospital Directory & Live OPD Counters'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Compare 10 verified Government & Private medical institutions in Tirunelveli with real-time wait times, ICU vacancy, and on-duty doctor chambers.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs font-bold">
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 uppercase block">Total</span>
              <span className="text-lg font-black text-slate-900">10</span>
            </div>
            <div className="text-center px-2 border-l border-slate-200">
              <span className="text-[10px] text-emerald-600 uppercase block">Govt Free</span>
              <span className="text-lg font-black text-emerald-600">1</span>
            </div>
            <div className="text-center px-2 border-l border-slate-200">
              <span className="text-[10px] text-indigo-600 uppercase block">Private</span>
              <span className="text-lg font-black text-indigo-600">9</span>
            </div>
          </div>
        </div>

        <HospitalList />
      </div>
    </AppLayout>
  );
};

export default HospitalsPage;
