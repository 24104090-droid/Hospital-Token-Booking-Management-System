import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const PatientRegister = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    age: '',
    gender: 'Male',
    location: 'Tirunelveli'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    const res = await register(formData);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-slate-200">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
          📝
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Create Patient Account</h2>
        <p className="text-xs text-slate-500 mt-1">
          Sign up to get instant digital OPD tokens and hospital wait time tracking
        </p>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full Legal Name"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          icon={FaUser}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Mobile Number"
            name="phone"
            type="tel"
            placeholder="Enter your mobile number"
            value={formData.phone}
            onChange={handleChange}
            icon={FaPhone}
            required
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
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Age"
            name="age"
            type="number"
            placeholder="Enter age"
            value={formData.age}
            onChange={handleChange}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <Input
            label="City"
            name="location"
            placeholder="Tirunelveli"
            value={formData.location}
            onChange={handleChange}
            icon={FaMapMarkerAlt}
          />
        </div>

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Create strong password"
          value={formData.password}
          onChange={handleChange}
          icon={FaLock}
          required
        />

        <Button type="submit" fullWidth disabled={loading} size="lg" className="mt-3">
          {loading ? 'Creating Account...' : 'Register & Start Booking'}
        </Button>
      </form>

      <div className="text-center mt-6 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-sky-600 hover:text-sky-700">
            Sign In Here
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default PatientRegister;
