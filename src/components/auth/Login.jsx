import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Input from '../common/Input';
import OAuthModal from './OAuthModal';
import GoogleLogin from './GoogleLogin';
import QuickLoginSelector from './QuickLoginSelector';
import LanguageToggle from '../common/LanguageToggle';
import { 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaKey, 
  FaHospital, 
  FaShieldAlt, 
  FaEye, 
  FaEyeSlash,
  FaArrowRight,
  FaCheckCircle,
  FaUser
} from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithOTP, verifyOTPAndLogin, loading } = useAuth();
  const { t, isTamil } = useLanguage();
  const [authMode, setAuthMode] = useState('password'); // 'password', 'otp', 'oauth'
  
  // Clean empty initial inputs - no hardcoded demo credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [patientName, setPatientName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setError('');
    const res = await login(email.trim(), password, 'patient');
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid email or password');
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!mobile || mobile.trim().length < 10) {
      setError(isTamil ? 'சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    const res = await loginWithOTP(mobile.trim());
    if (res.success) {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 4) {
      setError(isTamil ? 'மொபைலுக்கு வந்த சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்' : 'Please enter the verification code sent to your phone');
      return;
    }
    setError('');
    const res = await verifyOTPAndLogin(mobile.trim(), otp.trim(), patientName.trim());
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid OTP code');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-9 text-left relative overflow-hidden">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-teal-500 to-indigo-500" />

      {/* Language Selector at Top-Right */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageToggle compact={false} />
      </div>

      {/* Header */}
      <div className="text-center mb-6 pt-1">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3 border border-sky-200/70 shadow-sm">
          <FaHospital size={26} className="text-sky-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t('patient_sign_in')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Tirunelveli Digital OPD Tokens & Live Queue Network
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-100/90 p-1 rounded-2xl mb-6 border border-slate-200/70">
        <button
          type="button"
          onClick={() => {
            setAuthMode('password');
            setError('');
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            authMode === 'password'
              ? 'bg-white text-sky-700 shadow-sm border border-slate-200/60 font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FaLock size={12} className={authMode === 'password' ? 'text-sky-600' : 'text-slate-400'} />
          <span>Email & Password</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode('otp');
            setError('');
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            authMode === 'otp'
              ? 'bg-white text-sky-700 shadow-sm border border-slate-200/60 font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FaPhone size={12} className={authMode === 'otp' ? 'text-sky-600' : 'text-slate-400'} />
          <span>Mobile OTP</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode('oauth');
            setError('');
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            authMode === 'oauth'
              ? 'bg-white text-sky-700 shadow-sm border border-slate-200/60 font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FaShieldAlt size={12} className={authMode === 'oauth' ? 'text-sky-600' : 'text-slate-400'} />
          <span>OAuth / ABHA</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 mb-5 bg-rose-50/90 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium text-center shadow-xs flex items-center justify-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Tab 1: Email & Password */}
      {authMode === 'password' && (
        <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
          <Input
            label={t('email_label')}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={FaEnvelope}
            required
            autoComplete="email"
          />

          <Input
            label={t('password_label')}
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
                className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            }
          />

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer"
              />
              <span className="font-medium text-slate-600">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setError('Password reset instructions will be sent to your registered email.')}
              className="font-semibold text-sky-600 hover:text-sky-700 cursor-pointer bg-transparent border-none p-0 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <FaArrowRight size={13} />
              </>
            )}
          </button>
        </form>
      )}

      {/* Tab 2: Mobile OTP */}
      {authMode === 'otp' && (
        <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="flex flex-col gap-4">
          <Input
            label={isTamil ? "நோயாளி முழு பெயர் (Patient Name)" : "Patient Full Name"}
            type="text"
            placeholder={isTamil ? "உங்கள் பெயர் (எ.கா. ராஜா, கண்ணன்)" : "Enter your full name (e.g. Ramesh Kumar)"}
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            icon={FaUser}
            disabled={otpSent}
            autoComplete="name"
          />

          <Input
            label={t('mobile_label')}
            type="tel"
            placeholder="Enter your 10-digit mobile number"
            value={mobile}
            onChange={(e) => {
              const val = e.target.value;
              setMobile(val);
              const cleanMobile = val.trim();
              if (cleanMobile.length === 10 && !patientName) {
                const saved = localStorage.getItem(`tvl_patient_name_${cleanMobile}`);
                if (saved && !saved.includes('(+91')) {
                  setPatientName(saved);
                }
              }
            }}
            icon={FaPhone}
            disabled={otpSent}
            required
            autoComplete="tel"
          />

          {otpSent && (
            <div className="space-y-3">
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-sky-600 flex-shrink-0" />
                  <span>
                    {isTamil
                      ? `${patientName || 'நோயாளி'} (+91 ${mobile}) எண்ணிற்கு OTP அனுப்பப்பட்டது.`
                      : `OTP sent to +91 ${mobile} for ${patientName || 'Patient'}.`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-sky-600 font-bold hover:underline cursor-pointer ml-2 flex-shrink-0"
                >
                  {isTamil ? 'மாற்றுக' : 'Edit'}
                </button>
              </div>
              <Input
                label="Enter Verification Code"
                type="text"
                placeholder="Enter 6-digit OTP code (e.g. 1234)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                icon={FaKey}
                required
                autoFocus
              />
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="text-xs text-sky-600 hover:text-sky-700 font-semibold cursor-pointer bg-transparent border-none p-0"
                >
                  Resend OTP Code
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{otpSent ? 'Verify OTP & Continue' : 'Send Verification Code'}</span>
                <FaArrowRight size={13} />
              </>
            )}
          </button>
        </form>
      )}

      {/* Quick Google Sign-In on main screen */}
      {authMode !== 'oauth' && (
        <div className="mt-4">
          <div className="relative my-4 flex items-center justify-center">
            <div className="border-t border-slate-200/90 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              or continue with
            </span>
            <div className="border-t border-slate-200/90 w-full" />
          </div>

          <GoogleLogin 
            onComplete={() => navigate('/dashboard')} 
            text="Sign in with Google" 
          />
        </div>
      )}

      {/* Tab 3: OAuth SSO */}
      {authMode === 'oauth' && (
        <div className="py-2">
          <p className="text-xs text-slate-500 text-center mb-4 font-medium">
            Sign in securely using your existing verified healthcare or digital identity:
          </p>
          <OAuthModal onSuccess={() => navigate('/dashboard')} />
        </div>
      )}

      {/* Footer Navigation */}
      <div className="text-center mt-7 pt-5 border-t border-slate-100">
        <p className="text-xs text-slate-600 font-medium">
          New citizen patient?{' '}
          <Link to="/register" className="font-bold text-sky-600 hover:text-sky-700 hover:underline">
            Register Health Profile
          </Link>
        </p>
        <div className="mt-3">
          <Link 
            to="/admin/login" 
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            <FaShieldAlt size={12} className="text-slate-400" />
            <span>{t('admin_sign_in')} →</span>
          </Link>
        </div>
      </div>

      {/* Collapsible Demo Switcher for Evaluation / Viva (Neat & Non-intrusive) */}
      <QuickLoginSelector onSelect={() => navigate('/dashboard')} defaultOpen={false} />

      {/* Security badge note */}
      <div className="mt-5 text-center">
        <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <span>🔒 256-bit SSL Secure</span>
          <span>•</span>
          <span>ABDM & NDHM Healthcare Standard</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
