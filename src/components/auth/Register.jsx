import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import GoogleLogin from './GoogleLogin';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEye, 
  FaEyeSlash,
  FaUserPlus,
  FaArrowRight
} from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
    age: '',
    bloodGroup: 'O+',
    area: 'Palayamkottai',
    district: 'Tirunelveli'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (formData.mobile.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.password) {
      setError('Please enter a password');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const res = await register(formData);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-9 text-left relative overflow-hidden">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-teal-500 to-indigo-500" />

      {/* Header */}
      <div className="text-center mb-6 pt-1">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-3 border border-teal-200/70 shadow-sm">
          <FaUserPlus size={24} className="text-teal-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Create Patient Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Register to book digital OPD passes & track live hospital queues
        </p>
      </div>

      {error && (
        <div className="p-3.5 mb-5 bg-rose-50/90 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium text-center shadow-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Full Name */}
        <Input
          label="Full Name (as per Aadhaar / ID)"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          icon={FaUser}
          required
          autoComplete="name"
        />

        {/* Mobile & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Mobile Number"
            name="mobile"
            type="tel"
            placeholder="Enter your mobile number"
            value={formData.mobile}
            onChange={handleChange}
            icon={FaPhone}
            required
            autoComplete="tel"
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            icon={FaEnvelope}
            required
            autoComplete="email"
          />
        </div>

        {/* Gender, Age, Blood Group */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 hover:border-slate-400 px-3 py-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 text-slate-800 font-medium transition-all"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Age <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              placeholder="Enter age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="120"
              required
              className="w-full rounded-xl border border-slate-300 hover:border-slate-400 px-3 py-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 text-slate-800 font-medium transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Blood Group
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 hover:border-slate-400 px-3 py-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 text-slate-800 font-medium transition-all"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Location Area & District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Residential Area
            </label>
            <select
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 hover:border-slate-400 px-3 py-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 text-slate-800 font-medium transition-all"
            >
              {['Palayamkottai', 'High Grounds', 'Vannarpettai', 'Melapalayam', 'Tirunelveli Junction', 'Town', 'Sankar Nagar', 'Sivalaperi'].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <Input
            label="District"
            name="district"
            value="Tirunelveli"
            disabled
            icon={FaMapMarkerAlt}
          />
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            icon={FaLock}
            required
            autoComplete="new-password"
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

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            icon={FaLock}
            required
            autoComplete="new-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            }
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Patient Account</span>
              <FaArrowRight size={13} />
            </>
          )}
        </button>
      </form>

      {/* Social / Google Quick Register */}
      <div className="my-5">
        <GoogleLogin onComplete={() => navigate('/dashboard')} />
      </div>

      {/* Footer link */}
      <div className="text-center pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-600 font-medium">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-sky-600 hover:text-sky-700 hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>

      {/* Security note */}
      <div className="mt-4 text-center">
        <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <span>🔒 256-bit SSL Secure</span>
          <span>•</span>
          <span>National Digital Health Mission (NDHM) Compliant</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
