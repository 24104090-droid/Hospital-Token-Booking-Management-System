import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  UserRoundCheck,
  Users,
  Ticket,
  MessageSquare,
  BarChart3,
  LogOut,
  HeartPulse,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ isCollapsed, onCloseMobile }) => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Control Center' },
    { to: '/admin/hospitals', icon: Building2, label: 'Hospital Management', badge: 'Fig 8.7.4' },
    { to: '/admin/doctors', icon: UserRoundCheck, label: 'Doctor Rosters & Quotas', badge: 'Fig 8.7.4' },
    { to: '/admin/reports', icon: BarChart3, label: 'District Booking Reports', badge: 'Fig 8.7.5' },
    { to: '/admin/feedback', icon: MessageSquare, label: 'Ratings & Feedback', badge: 'Fig 8.7.5' },
    { to: '/admin/tokens', icon: Ticket, label: 'Live OPD Tokens' },
    { to: '/admin/patients', icon: Users, label: 'Patient Directory' }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800 transition-all flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold shadow-md">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-sm tracking-tight block text-white leading-tight">
              Medi<span className="text-sky-400">Admin</span>
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400 block">
              District OPD Command
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 mb-2">
          Management Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all no-underline ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge ? (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-sky-950 text-sky-300 border border-sky-700/50 flex-shrink-0">
                  {item.badge}
                </span>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-50 flex-shrink-0" />
              )}
            </NavLink>
          );
        })}

        {/* Quick Link to Citizen Portal */}
        <div className="pt-4 mt-4 border-t border-slate-800">
          <Link
            to="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all no-underline"
          >
            <div className="flex items-center gap-2.5">
              <ArrowLeft className="w-4 h-4 text-sky-400" />
              <span>Citizen Patient Portal</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Exit</span>
          </Link>
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
