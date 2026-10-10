import React, { useState } from 'react';
import AppLayout from '../components/common/AppLayout';
import Profile from '../components/profile/Profile';
import FamilyMembers from '../components/profile/FamilyMembers';
import Favorites from '../components/profile/Favorites';
import HealthLocker from '../components/records/HealthLocker';
import { FaUser, FaUsers, FaHeart, FaShieldAlt, FaFilePrescription } from 'react-icons/fa';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'family', 'favorites', 'records'

  return (
    <AppLayout>
      <div className="w-full space-y-6 text-left">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FaUser size={12} />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('family')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'family'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FaUsers size={14} />
            <span>Family Circle</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FaHeart size={12} className={activeTab === 'favorites' ? 'text-white' : 'text-rose-500'} />
            <span>Saved Hospitals</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'records'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FaFilePrescription size={12} />
            <span>Rx Locker</span>
          </button>
        </div>

        <div className="w-full max-w-5xl mx-auto animate-fadeIn">
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'family' && <FamilyMembers />}
          {activeTab === 'favorites' && <Favorites />}
          {activeTab === 'records' && <HealthLocker />}
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
