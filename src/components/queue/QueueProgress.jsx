import React from 'react';
import { FaCheckCircle, FaClock, FaUserMd, FaHourglassHalf } from 'react-icons/fa';

const QueueProgress = ({ currentServing = 12, myToken = 14, estimatedWaitMinutes = 12 }) => {
  const diff = myToken - currentServing;
  const isNow = diff <= 0;
  const isNext = diff === 1;

  const percentage = Math.max(10, Math.min(100, 100 - (diff * 15)));

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Queue Proximity</span>
          <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
            {isNow ? '🎉 Your Token is In Consultation!' : isNext ? '⚠️ You are Next in Line!' : `${diff} Patients Ahead of You`}
          </h4>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Estimated Wait</span>
          <div className="text-sm font-black text-sky-700 mt-0.5">~{isNow ? '0' : estimatedWaitMinutes} Mins</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden relative">
        <div 
          className="bg-gradient-to-r from-sky-500 to-emerald-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 pt-1">
        <span className="flex items-center gap-1 text-emerald-600">
          <FaCheckCircle /> Token Issued
        </span>
        <span className={`flex items-center gap-1 ${diff <= 3 ? 'text-sky-600 font-black' : ''}`}>
          <FaHourglassHalf /> OPD Waiting Hall
        </span>
        <span className={`flex items-center gap-1 ${isNow ? 'text-emerald-600 font-black' : 'text-slate-400'}`}>
          <FaUserMd /> Doctor Consultation
        </span>
      </div>
    </div>
  );
};

export default QueueProgress;
