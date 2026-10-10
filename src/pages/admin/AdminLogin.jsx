import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { DEFAULT_LOCATION } from '../../utils/constants';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useContext(AuthContext);
  const [email, setEmail] = useState('admin@mediqueue.gov.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter admin credentials.');
      return;
    }
    loginAdmin({
      email,
      name: 'Dr. K. Swaminathan (Hospital Admin)',
      role: 'Chief Medical Officer / OPD Queue Director'
    });
    navigate('/admin/dashboard');
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@mediqueue.gov.in');
    setPassword('admin123');
    loginAdmin({
      email: 'admin@mediqueue.gov.in',
      name: 'Dr. K. Swaminathan (Hospital Admin)',
      role: 'Chief Medical Officer / OPD Queue Director'
    });
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-700 w-full max-w-md animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-700 to-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hospital Admin Portal</h2>
          <p className="text-xs text-slate-500 mt-1">
            OPD Live Queue Dispatch & Hospital Control Center
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Staff / Officer Email"
            type="email"
            placeholder="admin@mediqueue.gov.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
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
            <span>Login to OPD Dispatch</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Demo Fast Login */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-sky-600" />
            1-Click Demo Admin Login
          </button>
        </div>

        <div className="mt-6 text-center text-xs">
          <Link to="/login" className="text-slate-500 hover:text-slate-800 font-semibold">
            ← Switch to Patient Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
