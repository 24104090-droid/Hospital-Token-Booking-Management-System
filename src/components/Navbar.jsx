import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  MapPin,
  ChevronDown,
  Stethoscope,
  Building2,
  CalendarCheck,
  Users2,
  GitCompare,
  Sparkles,
  User,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  History,
  MessageSquareHeart,
  Pill,
  Tv
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHospital } from '../context/HospitalContext';
import { AVAILABLE_CITIES } from '../utils/constants';
import Button from './Button';

const Navbar = ({ onLogout }) => {
  const { patient, isPatient, admin, isAdmin, logout } = useAuth();
  const { selectedCity, setSelectedCity, compareList } = useHospital();
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="navbar sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & City Picker */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2 text-decoration-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                  Medi<span className="text-sky-600">Queue</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Smart Hospital OPD
                </span>
              </div>
            </Link>

            {/* City Dropdown */}
            <div className="relative hidden sm:block ml-2">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-full text-xs font-semibold border border-sky-200 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-sky-500" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                    Select City
                  </div>
                  {AVAILABLE_CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-sky-50 hover:text-sky-700 transition-colors flex items-center justify-between ${
                        selectedCity === city ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {city}
                      {selectedCity === city && <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink
              to="/disease"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-bold'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`
              }
            >
              <Stethoscope className="w-4 h-4 text-sky-600" />
              Find Care
            </NavLink>

            <NavLink
              to="/hospitals"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-bold'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`
              }
            >
              <Building2 className="w-4 h-4 text-teal-600" />
              Hospitals
            </NavLink>

            <NavLink
              to="/compare"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-bold'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`
              }
            >
              <GitCompare className="w-4 h-4 text-indigo-600" />
              Compare
              {compareList.length > 0 && (
                <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {compareList.length}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/recommendation"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-bold'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`
              }
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Match
            </NavLink>

            <NavLink
              to="/appointments"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-bold'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`
              }
            >
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              My Tokens
            </NavLink>

            <NavLink
              to="/family"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-bold'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`
              }
            >
              <Users2 className="w-4 h-4 text-rose-500" />
              Family
            </NavLink>

            <NavLink
              to="/pharmacy"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`
              }
            >
              <Pill className="w-4 h-4 text-emerald-600" />
              Pharmacy
            </NavLink>

            <NavLink
              to="/opd-display"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-teal-300 font-bold'
                    : 'text-slate-700 hover:text-teal-600 hover:bg-teal-50'
                }`
              }
              title="Waiting Hall Smart TV Display"
            >
              <Tv className="w-4 h-4 text-teal-600" />
              OPD TV
            </NavLink>
          </nav>

          {/* Right User & Actions */}
          <div className="flex items-center gap-2.5">
            {isPatient ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                    {patient?.name ? patient.name.charAt(0) : 'P'}
                  </div>
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[120px] truncate">
                    {patient?.name || 'Patient'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{patient?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{patient?.mobile}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                    >
                      <User className="w-4 h-4 text-slate-400" /> My Health Profile
                    </Link>
                    <Link
                      to="/appointments"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                    >
                      <CalendarCheck className="w-4 h-4 text-slate-400" /> Active Tokens
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                    >
                      <History className="w-4 h-4 text-slate-400" /> Visit History
                    </Link>
                    <Link
                      to="/feedback"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                    >
                      <MessageSquareHeart className="w-4 h-4 text-slate-400" /> Hospital Feedback
                    </Link>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogoutClick}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="primary" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/admin/login" className="hidden sm:inline-block">
                  <Button variant="ghost" size="sm">
                    Admin
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Link
                to="/disease"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800"
              >
                <Stethoscope className="w-4 h-4 text-sky-600" /> Find Care
              </Link>
              <Link
                to="/hospitals"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800"
              >
                <Building2 className="w-4 h-4 text-teal-600" /> Hospitals
              </Link>
              <Link
                to="/compare"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800"
              >
                <GitCompare className="w-4 h-4 text-indigo-600" /> Compare ({compareList.length})
              </Link>
              <Link
                to="/recommendation"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800"
              >
                <Sparkles className="w-4 h-4 text-amber-500" /> AI Match
              </Link>
              <Link
                to="/appointments"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800"
              >
                <CalendarCheck className="w-4 h-4 text-emerald-600" /> My Tokens
              </Link>
              <Link
                to="/family"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800"
              >
                <Users2 className="w-4 h-4 text-rose-500" /> Family
              </Link>
              <Link
                to="/pharmacy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-xs font-bold text-emerald-900 border border-emerald-200"
              >
                <Pill className="w-4 h-4 text-emerald-600" /> Pharmacy Hub
              </Link>
              <Link
                to="/opd-display"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 text-xs font-bold text-teal-300 border border-slate-800"
              >
                <Tv className="w-4 h-4 text-teal-400" /> 📺 Waiting Hall TV Display
              </Link>
            </div>
            {isPatient && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleLogoutClick}
              >
                <LogOut className="w-4 h-4 mr-1.5" /> Logout
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
