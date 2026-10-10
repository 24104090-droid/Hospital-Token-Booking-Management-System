import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import { 
  FaShieldAlt, 
  FaEnvelope, 
  FaLock, 
  FaUserMd, 
  FaEye, 
  FaEyeSlash,
  FaArrowRight,
  FaHospital
} from 'react-icons/fa';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [roleType, setRoleType] = useState('admin'); // 'admin' or 'hospital_staff'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (role) => {
    setRoleType(role);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your administrator / staff email or ID');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setError('');

    const res = await login(email.trim(), password, roleType);
    if (res.success) {
      if (roleType === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/hospital/staff');
      }
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-9 text-left relative overflow-hidden">
      {/* Decorative top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${
        roleType === 'admin' 
          ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-slate-900' 
          : 'bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-700'
      }`} />

      {/* Header */}
      <div className="text-center mb-6 pt-1">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm transition-colors ${
          roleType === 'admin' 
            ? 'bg-purple-50 text-purple-700 border border-purple-200/70' 
            : 'bg-teal-50 text-teal-700 border border-teal-200/70'
        }`}>
          {roleType === 'admin' ? <FaShieldAlt size={26} /> : <FaUserMd size={26} />}
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {roleType === 'admin' ? 'District Health Administration' : 'Hospital Staff & OPD Triage'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Tirunelveli District Public Health Portal & OPD Management
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="flex bg-slate-100/90 p-1 rounded-2xl mb-6 border border-slate-200/70">
        <button
          type="button"
          onClick={() => handleRoleChange('admin')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            roleType === 'admin'
              ? 'bg-slate-900 text-white shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FaShieldAlt size={12} className={roleType === 'admin' ? 'text-teal-400' : 'text-slate-400'} />
          <span>District Admin</span>
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange('hospital_staff')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            roleType === 'hospital_staff'
              ? 'bg-teal-700 text-white shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FaHospital size={12} className={roleType === 'hospital_staff' ? 'text-teal-200' : 'text-slate-400'} />
          <span>Hospital Staff / OPD</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 mb-5 bg-rose-50/90 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium text-center shadow-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={roleType === 'admin' ? 'District Admin Email / ID' : 'Hospital Staff Email / ID'}
          type="email"
          placeholder={roleType === 'admin' ? 'Enter admin email or official ID' : 'Enter hospital staff email or ID'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={FaEnvelope}
          required
          autoComplete="username"
        />

        <Input
          label="Passcode / Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={FaLock}
          required
          autoComplete="current-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
            </button>
          }
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-white ${
            roleType === 'admin'
              ? 'bg-slate-900 hover:bg-slate-800'
              : 'bg-teal-700 hover:bg-teal-800'
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>{roleType === 'admin' ? 'Access District Admin Console' : 'Open Hospital OPD Triage'}</span>
              <FaArrowRight size={13} />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Quick Fill */}
      <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-left">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
          ⚡ One-Click Demo Credentials:
        </span>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => {
              setRoleType('admin');
              setEmail('admin@tvlhealth.gov.in');
              setPassword('Admin@123');
              setError('');
            }}
            className="flex-1 py-1.5 px-2.5 bg-white hover:bg-sky-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-800 hover:text-sky-700 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
          >
            <span>👤 District Admin</span>
            <span className="text-[10px] text-sky-600 font-mono">Fill & Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleType('hospital_staff');
              setEmail('nurse.tvmch@tvlcare.in');
              setPassword('Staff@123');
              setError('');
            }}
            className="flex-1 py-1.5 px-2.5 bg-white hover:bg-teal-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-800 hover:text-teal-700 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
          >
            <span>🏥 Hospital Staff</span>
            <span className="text-[10px] text-teal-600 font-mono">Fill & Login</span>
          </button>
        </div>
      </div>

      <div className="text-center mt-5 pt-4 border-t border-slate-100">
        <Link 
          to="/login" 
          className="text-xs text-sky-600 hover:text-sky-700 font-bold inline-flex items-center justify-center gap-1 hover:underline"
        >
          ← Return to Citizen Patient Sign In
        </Link>
      </div>

      <div className="mt-4 text-center">
        <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <span>🔒 Restricted Access</span>
          <span>•</span>
          <span>Authorized Government & Hospital Personnel Only</span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
