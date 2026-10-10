import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecentActivity } from '../../context/RecentActivityContext';
import { useLanguage } from '../../context/LanguageContext';
import { FaHistory, FaHospital, FaSearch } from 'react-icons/fa';

const RecentlyViewed = () => {
  const navigate = useNavigate();
  const { recentHospitals, recentSearches, clearRecentHospitals, clearRecentSearches } = useRecentActivity();
  const { isTamil } = useLanguage();

  if (recentHospitals.length === 0 && recentSearches.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs text-left transition-colors">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
            <FaHistory size={16} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {isTamil ? 'சமீபத்தில் பார்த்தவை' : 'Recently Accessed & Searches'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {isTamil ? 'விரைவு அணுகல் பலகை' : 'Quick access shortcuts from your session'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Recent Hospitals */}
        {recentHospitals.length > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider mb-2.5">
              <span>{isTamil ? 'மருத்துவமனைகள்' : 'Recent Hospitals'}</span>
              <button 
                onClick={clearRecentHospitals}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                {isTamil ? 'அழி' : 'Clear'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {recentHospitals.map((h) => (
                <button
                  key={h.id}
                  onClick={() => navigate(`/hospital/${h.id}`)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200 dark:border-slate-700 hover:border-sky-300 text-slate-800 dark:text-slate-200 text-sm sm:text-base font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:scale-102"
                >
                  <FaHospital className="text-sky-600 dark:text-sky-400" size={14} />
                  <span>{h.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider mb-2.5">
              <span>{isTamil ? 'தேடப்பட்ட அறிகுறிகள்' : 'Recent Symptoms Searched'}</span>
              <button 
                onClick={clearRecentSearches}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                {isTamil ? 'அழி' : 'Clear'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/book?problem=${encodeURIComponent(term)}`)}
                  className="px-4 py-2 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700 hover:border-teal-300 text-slate-700 dark:text-slate-300 text-sm sm:text-base font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:scale-102"
                >
                  <FaSearch className="text-teal-600 dark:text-teal-400" size={13} />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyViewed;
