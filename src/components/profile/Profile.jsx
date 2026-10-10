import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeartbeat, FaShieldAlt, FaSave } from 'react-icons/fa';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const getCleanName = (rawName, mobile) => {
    if (!rawName) return 'Patient';
    if (rawName.includes('(+91') || /\+91\s*\d+/.test(rawName)) {
      if (mobile) {
        const saved = localStorage.getItem(`tvl_patient_name_${mobile}`);
        if (saved && !saved.includes('(+91')) return saved;
      }
      return 'Patient';
    }
    return rawName;
  };

  const [profileData, setProfileData] = useState({
    name: getCleanName(user?.name, user?.mobile),
    email: user?.email || 'patient@tvlcare.in',
    mobile: user?.mobile || '9876543210',
    age: user?.age || 32,
    gender: user?.gender || 'Male',
    bloodGroup: user?.bloodGroup || 'O+',
    area: user?.area || 'Palayamkottai',
    district: user?.district || 'Tirunelveli',
    emergencyContact: '9876543211'
  });

  React.useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: getCleanName(user.name, user.mobile),
        email: user.email || prev.email,
        mobile: user.mobile || prev.mobile,
        age: user.age || prev.age,
        gender: user.gender || prev.gender,
        bloodGroup: user.bloodGroup || prev.bloodGroup,
        area: user.area || prev.area,
        district: user.district || prev.district
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (updateProfile) {
      updateProfile(profileData);
    } else {
      toast.success('Patient profile updated successfully!');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-sky-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-teal-300 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg">
          {profileData.name[0]?.toUpperCase() || 'P'}
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black">{profileData.name}</h2>
          <p className="text-xs text-sky-200 mt-0.5">
            Tirunelveli Health ID: <strong>TVL-PID-{profileData.mobile.slice(-4)}</strong>
          </p>
          <span className="badge badge-success text-[10px] font-bold mt-1.5 inline-block">
            VERIFIED CITIZEN ACCOUNT
          </span>
        </div>
      </div>

      {/* Edit Profile Form */}
      <Card className="p-6">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            name="name"
            value={profileData.name}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              icon={FaEnvelope}
              required
            />
            <Input
              label="Mobile Number"
              type="tel"
              name="mobile"
              value={profileData.mobile}
              onChange={handleChange}
              icon={FaPhone}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={profileData.age}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Gender</label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Blood Group</label>
              <select
                name="bloodGroup"
                value={profileData.bloodGroup}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs bg-white"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Residential Locality / Area"
              name="area"
              value={profileData.area}
              onChange={handleChange}
              icon={FaMapMarkerAlt}
            />
            <Input
              label="District"
              name="district"
              value={profileData.district}
              disabled
              icon={FaMapMarkerAlt}
            />
          </div>

          <Button type="submit" size="lg" className="mt-2 font-bold text-xs" icon={FaSave}>
            Save Profile Updates
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
