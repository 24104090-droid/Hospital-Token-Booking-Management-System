import React, { useState, useEffect } from 'react';
import { Radio, AlertCircle, PhoneCall, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEFAULT_LOCATION } from '../utils/constants';

const LiveQueueTicker = () => {
  const [tickerItems, setTickerItems] = useState([
    { hospital: 'TVMCH Tirunelveli', dept: 'General Medicine', token: 'D-028', wait: '15m' },
    { hospital: 'Sree Mookambika', dept: 'Cardiology', token: 'C-112', wait: '20m' },
    { hospital: 'Eye Care Center', dept: 'Ophthalmology', token: 'E-045', wait: '10m' },
    { hospital: 'District GH', dept: 'Pediatrics', token: 'G-208', wait: '12m' },
    { hospital: 'Apollo Specialty', dept: 'Neurology', token: 'A-019', wait: '14m' }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [tickerItems.length]);

  const current = tickerItems[currentIndex];

  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Left Live Indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-extrabold uppercase tracking-wider text-emerald-400 text-[11px] hidden sm:inline">
            LIVE OPD QUEUE
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-300 font-medium">📍 {DEFAULT_LOCATION}</span>
        </div>

        {/* Center Animated Ticker Item */}
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <span className="font-bold text-sky-300">{current.hospital}:</span>
          <span className="text-slate-300 hidden md:inline">{current.dept}</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono font-bold text-amber-300">
            Serving: {current.token}
          </span>
          <span className="text-emerald-400 hidden sm:inline font-medium">(Wait: {current.wait})</span>
        </div>

        {/* Right Emergency Quick Link */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="tel:108"
            className="flex items-center gap-1.5 bg-red-600/90 hover:bg-red-600 text-white px-2.5 py-0.5 rounded-full font-bold text-[11px] transition-colors"
          >
            <PhoneCall className="w-3 h-3" />
            <span>108 Emergency</span>
          </a>
          <Link
            to="/appointments"
            className="text-slate-400 hover:text-sky-300 hidden lg:flex items-center gap-0.5 font-medium"
          >
            <span>My Tokens</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LiveQueueTicker;
