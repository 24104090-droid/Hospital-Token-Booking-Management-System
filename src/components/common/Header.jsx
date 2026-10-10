import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { useBooking } from '../../context/BookingContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  FaHospital, 
  FaUserCircle, 
  FaSignOutAlt, 
  FaAmbulance, 
  FaBars, 
  FaTimes, 
  FaShieldAlt,
  FaBell,
  FaSun,
  FaMoon,
  FaHeartbeat,
  FaSearch,
  FaBalanceScale,
  FaCalendarAlt,
  FaCode
} from 'react-icons/fa';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const { t, isTamil } = useLanguage();
  const { theme, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { isBackendConnected } = useBooking();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayUserName = React.useMemo(() => {
    if (!user?.name) return 'Account';
    if (user.name.includes('(+91') || /\+91\s*\d+/.test(user.name)) {
      if (user.mobile) {
        const saved = localStorage.getItem(`tvl_patient_name_${user.mobile}`);
        if (saved && !saved.includes('(+91')) return saved;
      }
      return 'Patient';
    }
    return user.name;
  }, [user?.name, user?.mobile]);

  const isActive = (path) => location.pathname === path;

  // Mobile drawer links only (desktop uses sidebar exclusively)
  const mobileNavLinks = [
    { name: t('nav_dashboard'), path: '/dashboard', icon: FaHeartbeat },
    { name: t('nav_find_care'), path: '/book', icon: FaSearch },
    { name: t('nav_hospitals'), path: '/hospitals', icon: FaHospital },
    { name: t('nav_compare'), path: '/compare', icon: FaBalanceScale },
    { name: t('nav_my_tokens'), path: '/appointments', icon: FaCalendarAlt },
    { name: t('nav_api'), path: '/api', icon: FaCode }
  ];

  return (
    <header className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 fixed top-0 left-0 right-0 h-16 z-50 shadow-xs transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <FaHospital size={20} />
          </div>
          <div>
            <div className="font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 leading-none">
              <span className="text-sky-600">TVL</span>
              <span className="text-teal-600">SmartCare</span>
              <span className="live-pulse" title="Live OPD Queue Online"></span>
            </div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mt-1 hidden sm:block">
              {t('app_subtitle')}
            </div>
          </div>
        </Link>

        {/* Center Live OPD Status Badge */}
        <div className="hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-black text-slate-700 dark:text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{isTamil ? 'திருநெல்வேலி நேரலை புறநோயாளி வலையமைப்பு' : 'Tirunelveli Live OPD Network'}</span>
        </div>

        {/* Right Action Items */}
        <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
          {/* Backend Status Indicator */}
          <div 
            className={`hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              isBackendConnected 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' 
                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
            }`}
            title={isBackendConnected ? "Backend Server connected on port 5000" : "Connecting to Express API..."}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>{isBackendConnected ? 'Backend Live' : 'Connecting API'}</span>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer shadow-2xs"
            title={isDark ? (isTamil ? 'வெளிச்ச முறைக்கு மாறுக' : 'Switch to Light Mode') : (isTamil ? 'இருள் முறைக்கு மாறுக' : 'Switch to Dark Mode')}
          >
            {isDark ? <FaSun className="text-amber-400" size={15} /> : <FaMoon className="text-indigo-600" size={15} />}
          </button>

          {/* Emergency Button */}
          <Link
            to="/emergency"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 text-sm font-black shadow-xs transition-transform hover:scale-102 no-underline flex-shrink-0"
          >
            <FaAmbulance size={15} className="animate-pulse" />
            <span className="hidden sm:inline">{t('emergency_108')}</span>
            <span className="sm:hidden">108</span>
          </Link>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors relative border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer shadow-2xs"
              title="Notifications"
            >
              <FaBell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-88 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-black text-slate-800 dark:text-white">{t('live_alerts')} ({unreadCount})</span>
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-bold"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto mt-2 space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-slate-400 py-4 text-center">No notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-3 rounded-xl cursor-pointer transition-colors text-sm ${
                          n.read ? 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300' : 'bg-sky-50 dark:bg-sky-950/40 text-slate-800 dark:text-slate-200 font-medium border border-sky-100 dark:border-sky-800'
                        }`}
                      >
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex justify-between">
                          <span>{n.title}</span>
                          <span className="text-xs text-slate-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Auth / Profile Area */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-700">
              <Link
                to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'hospital_staff' ? '/hospital/staff' : '/profile'}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-200 dark:border-sky-800 text-slate-800 dark:text-slate-200 text-sm font-black transition-colors no-underline"
              >
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-7 h-7 rounded-lg object-cover border border-sky-300" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                    {displayUserName ? displayUserName[0].toUpperCase() : 'U'}
                  </div>
                )}
                <span className="max-w-[140px] truncate">{displayUserName}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              >
                <FaSignOutAlt size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-black text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 no-underline"
              >
                {t('sign_in')}
              </Link>
              <Link
                to="/admin/login"
                className="px-4 py-2 text-sm font-black text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center gap-2 no-underline"
              >
                <FaShieldAlt size={14} className="text-slate-500" />
                <span>{t('admin_login')}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
          >
            {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1 shadow-lg animate-fadeIn">
          {mobileNavLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold no-underline ${
                  active
                    ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={14} className={active ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <Link
              to="/emergency"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-4 text-center text-xs font-bold bg-rose-600 text-white rounded-xl no-underline flex items-center justify-center gap-2"
            >
              <FaAmbulance /> <span>{t('emergency_108')}</span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 no-underline"
                >
                  <FaUserCircle size={15} />
                  <span>{t('my_profile')} ({displayUserName})</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 text-left cursor-pointer"
                >
                  <FaSignOutAlt size={15} />
                  <span>{t('sign_out')}</span>
                </button>
              </>
            ) : (
              <div className="flex gap-2 p-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-center text-xs font-bold bg-sky-600 text-white rounded-xl no-underline"
                >
                  {t('sign_in')}
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 text-center text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-xl no-underline"
                >
                  {t('admin_login')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
