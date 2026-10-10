import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Bell,
  Menu,
  Building2,
  UserRoundCheck,
  BarChart3,
  MessageSquare,
  Ticket,
  LayoutDashboard,
  ExternalLink,
  Volume2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEFAULT_LOCATION } from '../../utils/constants';
import { testHospitalAudio } from '../../utils/hospitalAudio';
import toast from 'react-hot-toast';

const AdminNavbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  const quickNav = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/hospitals', label: 'Hospitals', icon: Building2 },
    { to: '/admin/doctors', label: 'Doctors', icon: UserRoundCheck },
    { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { to: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
    { to: '/admin/tokens', label: 'Tokens', icon: Ticket }
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs sticky top-0 z-30 select-none">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Location & Control Center Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 hidden sm:inline-flex items-center gap-1.5">
            <span>📍 {DEFAULT_LOCATION} District Health Control</span>
          </span>
        </div>

        {/* Top Module Quick Switcher */}
        <nav className="hidden xl:flex items-center gap-1 pl-3 border-l border-slate-200">
          {quickNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all no-underline ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Hospital Audio Chime Test */}
        <button
          onClick={() => {
            testHospitalAudio();
            toast.success('🔔 OPD Audio Chime & Bilingual Voice Tested!');
          }}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer border border-slate-200"
          title="Test Hospital PA Audio Announcement"
        >
          <Volume2 className="w-3.5 h-3.5 text-sky-600" />
          <span>Audio Test (ஒலி)</span>
        </button>

        {/* Live System Operational Status */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>OPD Dispatch Engine: Live</span>
        </div>

        {/* Exit to Citizen Portal */}
        <Link
          to="/dashboard"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition-all hidden sm:flex items-center gap-1 no-underline"
        >
          <span>Patient App</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        {/* Admin Profile Details */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-black text-slate-800 block leading-tight truncate max-w-[140px]">
              {user?.role === 'admin' ? user?.name || 'Dr. Shanmuga Priya' : 'Dr. V. Shanmuga Priya, MD'}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold block leading-none">
              District Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
