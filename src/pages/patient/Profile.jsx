import React, { useState, useContext } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  ShieldCheck,
  QrCode,
  Download,
  Save,
  CheckCircle2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { DEFAULT_LOCATION } from '../../utils/constants';

const Profile = () => {
  const { patient, updateProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: patient?.name || 'Ramesh Kumar',
    mobile: patient?.mobile || '+91 98765 43210',
    email: patient?.email || 'ramesh.kumar@example.com',
    age: patient?.age || 34,
    gender: patient?.gender || 'Male',
    bloodGroup: patient?.bloodGroup || 'B+',
    address: patient?.address || 'Palayamkottai, Tirunelveli',
    emergencyContact: patient?.emergencyContact || '+91 98765 11111'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setSuccessMsg('Health profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const healthCardPayload = JSON.stringify({
    healthId: patient?.id || 'TN-MED-9942',
    name: formData.name,
    mobile: formData.mobile,
    bloodGroup: formData.bloodGroup,
    city: DEFAULT_LOCATION
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Patient Health Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your universal digital OPD token credentials and emergency contacts
        </p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Digital Health ID Card Hero */}
      <div className="bg-gradient-to-br from-sky-700 via-sky-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-sky-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-sky-200">
                TAMIL NADU DIGITAL OPD HEALTH CARD
              </span>
            </div>
            <h2 className="text-2xl font-black">{formData.name}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-sky-100 mt-1">
              <span>Age: <strong>{formData.age} yrs</strong></span>
              <span>•</span>
              <span>Gender: <strong>{formData.gender}</strong></span>
              <span>•</span>
              <span>Blood Group: <strong className="text-white font-extrabold bg-red-600/60 px-2 py-0.5 rounded">{formData.bloodGroup}</strong></span>
            </div>
            <p className="text-xs text-sky-200/80 mt-2 font-mono">
              Health ID: {patient?.id || 'TN-MED-9942'}
            </p>
          </div>

          <div className="bg-white p-2.5 rounded-2xl shadow-md self-start sm:self-center">
            <QRCodeSVG value={healthCardPayload} size={85} level="M" />
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <h3 className="text-base font-bold text-slate-900">Personal & Medical Details</h3>
          <Button
            variant={isEditing ? 'ghost' : 'outline'}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </Button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={!isEditing}
              icon={User}
              required
            />
            <Input
              label="Mobile Number"
              value={formData.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
              disabled={!isEditing}
              icon={Phone}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={!isEditing}
              icon={Mail}
            />
            <Input
              label="Emergency Contact Phone"
              value={formData.emergencyContact}
              onChange={(e) => handleChange('emergencyContact', e.target.value)}
              disabled={!isEditing}
              icon={Phone}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              disabled={!isEditing}
            />
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              disabled={!isEditing}
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
              disabled={!isEditing}
              options={[
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' },
                { value: 'AB+', label: 'AB+' }
              ]}
            />
          </div>

          <Input
            label="Residential Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            disabled={!isEditing}
            icon={MapPin}
          />

          {isEditing && (
            <div className="pt-4">
              <Button type="submit" variant="primary" size="md">
                <Save className="w-4 h-4 mr-1.5" /> Save Changes
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
