import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Phone, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { DEFAULT_LOCATION } from '../../utils/constants';

const Login = () => {
  const navigate = useNavigate();
  const { loginPatient } = useContext(AuthContext);
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mobile || !password) {
      setError('Please enter both mobile number and password.');
      return;
    }
    loginPatient({
      mobile,
      name: 'Ramesh Kumar',
      email: 'ramesh.kumar@example.com',
      age: 34,
      gender: 'Male',
      bloodGroup: 'B+',
      address: 'Palayamkottai, Tirunelveli'
    });
    navigate('/dashboard');
  };

  const handleQuickDemoLogin = () => {
    setMobile('+91 98765 43210');
    setPassword('password123');
    loginPatient({
      mobile: '+91 98765 43210',
      name: 'Ramesh Kumar',
      email: 'ramesh.kumar@example.com',
      age: 34,
      gender: 'Male',
      bloodGroup: 'B+',
      address: 'Palayamkottai, Tirunelveli'
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Patient Login</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access live OPD tokens & hospital queues in <strong>{DEFAULT_LOCATION}</strong>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Mobile Number / Health ID"
            type="text"
            placeholder="+91 98765 43210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            icon={Phone}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full">
            <span>Login to MediQueue</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Quick Demo Login Fill */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold rounded-xl border border-sky-200 flex items-center justify-center gap-2 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-sky-600" />
            1-Click Demo Patient Login
          </button>
        </div>

        {/* Links */}
        <div className="mt-6 text-center space-y-2 text-xs">
          <p className="text-slate-600">
            Don't have a digital health token ID?{' '}
            <Link to="/register" className="text-sky-600 font-bold hover:underline">
              Register here
            </Link>
          </p>
          <p>
            <Link to="/admin/login" className="text-slate-400 hover:text-slate-700 font-medium inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> OPD Hospital Staff & Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
