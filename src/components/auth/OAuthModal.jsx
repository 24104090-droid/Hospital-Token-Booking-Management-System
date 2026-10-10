import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaGithub, FaIdCard } from 'react-icons/fa';
import GoogleLogin from './GoogleLogin';

const OAuthModal = ({ onSuccess }) => {
  const { loginWithOAuth, loading } = useAuth();

  const handleOAuth = async (provider) => {
    const res = await loginWithOAuth(provider);
    if (res?.success && onSuccess) {
      onSuccess(res.user);
    }
  };

  return (
    <div className="flex flex-col gap-3 my-4">
      {/* Google OAuth with Native System Chooser */}
      <GoogleLogin 
        onComplete={onSuccess} 
        text="Sign in with Google OAuth 2.0" 
      />

      {/* GitHub OAuth */}
      <button
        type="button"
        disabled={loading}
        onClick={() => handleOAuth('github')}
        className="w-full py-3 px-4 rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold transition-all flex items-center justify-between shadow-sm cursor-pointer hover:shadow"
      >
        <div className="flex items-center gap-3">
          <FaGithub size={18} className="text-white" />
          <span className="font-extrabold text-white">Sign in with GitHub OAuth</span>
        </div>
        <span className="text-slate-400 text-xs">Developer SSO</span>
      </button>

      {/* Tamil Nadu Health ID (ABDM) OAuth */}
      <button
        type="button"
        disabled={loading}
        onClick={() => handleOAuth('tn_health')}
        className="w-full py-3 px-4 rounded-2xl border border-teal-300 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 text-slate-900 text-xs font-bold transition-all flex items-center justify-between shadow-sm cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md bg-teal-600 text-white flex items-center justify-center font-bold text-[10px]">
            <FaIdCard />
          </div>
          <span className="font-extrabold text-teal-950">
            TN Digital Health ID (ABHA / ABDM)
          </span>
        </div>
        <span className="badge bg-teal-200 text-teal-900 text-[9px] font-bold">Govt SSO</span>
      </button>
    </div>
  );
};

export default OAuthModal;
