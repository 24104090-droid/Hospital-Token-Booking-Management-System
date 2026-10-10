import React, { useState } from 'react';
import AppLayout from '../components/common/AppLayout';
import History from '../components/profile/History';
import LiveQueue from '../components/queue/LiveQueue';
import { FaTicketAlt, FaTv, FaHistory } from 'react-icons/fa';

const AppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'live'

  return (
    <AppLayout>
      <div className="w-full space-y-6 text-left">
        {/* Tab Toggle */}
        <div className="flex items-center justify-between gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaTicketAlt />
            <span>My Tokens & Passes</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'live'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FaTv />
            <span>Live OPD Counter Display</span>
          </button>
        </div>

        <div className="w-full max-w-6xl mx-auto animate-fadeIn">
          {activeTab === 'history' ? <History /> : <LiveQueue />}
        </div>
      </div>
    </AppLayout>
  );
};

export default AppointmentsPage;
