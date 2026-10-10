import React, { useState, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import Card from '../common/Card';
import { FaHospital, FaClock, FaTicketAlt, FaVolumeUp, FaBroadcastTower, FaUserMd } from 'react-icons/fa';
import toast from 'react-hot-toast';

const LiveQueue = () => {
  const { hospitals } = useHospital();
  const [activeHospitalId, setActiveHospitalId] = useState('h1');
  const [currentServing, setCurrentServing] = useState(14);
  const [totalTokens, setTotalTokens] = useState(42);

  const selectedHospital = hospitals.find(h => h.id === activeHospitalId) || hospitals[0];

  // Periodic simulation of queue movement
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentServing(prev => {
        const next = prev < totalTokens ? prev + 1 : prev;
        return next;
      });
    }, 45000); // changes every 45s or on manual refresh
    return () => clearInterval(timer);
  }, [totalTokens]);

  const handleTestAudio = () => {
    toast.success(`📢 Audio Announcement: "Token Number #${currentServing} please enter Room OPD-102"`);
  };

  const queueItems = Array.from({ length: 8 }, (_, i) => {
    const tokenNum = currentServing - 2 + i;
    let status = 'Waiting';
    if (tokenNum < currentServing) status = 'Completed';
    else if (tokenNum === currentServing) status = 'Serving Now';
    else if (tokenNum === currentServing + 1) status = 'Next in Line';

    return {
      tokenNum,
      status,
      room: 'Room 102',
      timeSlot: `${9 + Math.floor(i / 3)}:${(i % 3) * 20 || '00'} AM`
    };
  }).filter(item => item.tokenNum > 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Live Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
            <span className="live-pulse"></span>
            <span>Live OPD Digital Display Ticker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedHospital?.name || 'Tirunelveli Medical College Hospital (TVMCH)'}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time OPD triage display for outpatient waiting halls and mobile trackers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestAudio}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700"
          >
            <FaVolumeUp className="text-sky-400" />
            <span>Test Audio Bell</span>
          </button>
        </div>
      </div>

      {/* Hospital Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {hospitals.map(h => (
          <button
            key={h.id}
            onClick={() => setActiveHospitalId(h.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeHospitalId === h.id
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {h.name.split(' ')[0]} ({h.area})
          </button>
        ))}
      </div>

      {/* Hero Number Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 p-6 bg-gradient-to-br from-sky-600 to-teal-700 text-white flex flex-col items-center justify-center text-center rounded-3xl">
          <span className="text-xs uppercase font-extrabold tracking-widest text-sky-200 mb-1">
            CURRENTLY IN CONSULTATION ROOM
          </span>
          <div className="text-6xl sm:text-7xl font-mono font-black my-2 tracking-tight">
            #{currentServing}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white">
            <FaUserMd /> Dr. S. Sundararajan (OPD Block A - Room 102)
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">OPD Counter Stats</span>
            <div className="mt-3 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Total Issued Today:</span>
                <span className="font-extrabold text-slate-900">{totalTokens} Tokens</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Estimated Next Wait:</span>
                <span className="font-extrabold text-emerald-600">~6 Mins</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Active Counters:</span>
                <span className="font-extrabold text-sky-600">4 Rooms Open</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="badge badge-success text-[10px] font-bold">Auto-Syncing Active 🟢</span>
          </div>
        </Card>
      </div>

      {/* Queue Ticker List */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-slate-900">Live Sequence Board</h3>
          <span className="text-xs text-slate-500">Showing upcoming 8 tokens</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {queueItems.map((item) => {
            const isCurrent = item.status === 'Serving Now';
            return (
              <div
                key={item.tokenNum}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300 shadow-md font-bold'
                    : item.status === 'Next in Line'
                    ? 'bg-amber-50 border-amber-300 font-bold'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-[10px] text-slate-400 font-bold block">{item.room}</span>
                <span className={`text-2xl font-mono font-black my-1 block ${
                  isCurrent ? 'text-emerald-700' : 'text-slate-800'
                }`}>
                  #{item.tokenNum}
                </span>
                <span className={`badge text-[9px] font-bold ${
                  isCurrent ? 'badge-success' : item.status === 'Next in Line' ? 'badge-warning' : 'badge-neutral'
                }`}>
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default LiveQueue;
