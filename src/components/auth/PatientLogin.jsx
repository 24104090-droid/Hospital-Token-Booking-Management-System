import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { FaEnvelope, FaLock, FaPhone, FaKey } from 'react-icons/fa';

const PatientLogin = () => {
  const navigate = useNavigate();
  const { login, loginWithOTP, loading } = useAuth();
  const [authMode, setAuthMode] = useState('password'); // 'password' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    const res = await loginWithOTP(mobile);
    if (res.success) {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp === '123456') {
      const res = await loginWithOTP(mobile, otp);
      if (res.success) {
        navigate('/dashboard');
      }
    } else {
      setError('Invalid OTP code. Use 123456');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-slate-200">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
          🏥
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Patient Sign In</h2>
        <p className="text-xs text-slate-500 mt-1">
          Access your digital OPD tokens and hospital queue updates
        </p>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => setAuthMode('password')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            authMode === 'password' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Email & Password
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('otp')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            authMode === 'otp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Mobile OTP
        </button>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      {authMode === 'password' ? (
        <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={FaEnvelope}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={FaLock}
            required
          />

          <Button type="submit" fullWidth disabled={loading} size="lg" className="mt-2">
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>
      ) : (
        <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="flex flex-col gap-4">
          <Input
            label="10-Digit Mobile Number"
            type="tel"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            icon={FaPhone}
            disabled={otpSent}
            required
          />

          {otpSent && (
            <Input
              label="Enter 6-Digit OTP"
              type="text"
              placeholder="Enter OTP code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              icon={FaKey}
              required
            />
          )}

          <Button type="submit" fullWidth disabled={loading} size="lg" className="mt-2">
            {otpSent ? 'Verify OTP & Continue' : 'Get Verification Code'}
          </Button>
        </form>
      )}

      <div className="text-center mt-6 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-sky-600 hover:text-sky-700">
            Register for Free
          </Link>
        </p>
        <div className="mt-2">
          <Link to="/admin/login" className="text-xs text-slate-400 hover:text-slate-600">
            Hospital Admin Portal →
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PatientLogin;
