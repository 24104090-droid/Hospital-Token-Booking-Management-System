import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, User, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';

const Register = () => {
  const navigate = useNavigate();
  const { registerPatient } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'B+',
    address: 'Palayamkottai, Tirunelveli',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.password) {
      setError('Please fill in Name, Mobile number, and Password.');
      return;
    }

    registerPatient({
      ...formData,
      age: Number(formData.age) || 30
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200 w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white mx-auto mb-2 shadow-md">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Patient Profile</h2>
          <p className="text-xs text-slate-500 mt-1">
            Register once to book instant OPD queue tokens across Tirunelveli hospitals
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="Full Patient Name"
            placeholder="e.g. Ramesh Kumar"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            icon={User}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Mobile Number"
              placeholder="+91 98765 43210"
              value={formData.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
              icon={Phone}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="ramesh@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              icon={Mail}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Age"
              type="number"
              placeholder="34"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
            />
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]}
            />
            <Select
              label="Blood Group"
              value={formData.bloodGroup}
              onChange={(e) => handleChange('bloodGroup', e.target.value)}
              options={[
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' }
              ]}
            />
          </div>

          <Input
            label="Residential Address / City"
            placeholder="Palayamkottai, Tirunelveli"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            icon={MapPin}
          />

          <Input
            label="Create Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2">
            <span>Register & Start Token Booking</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="text-sky-600 font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
