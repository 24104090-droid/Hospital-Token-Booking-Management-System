import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGoogleClientId, triggerGoogleNativePicker } from '../../utils/googleAuth';
import GoogleAuthModal from './GoogleAuthModal';
import toast from 'react-hot-toast';

const GoogleLogin = ({ onComplete, text = 'Continue with Google', className = '' }) => {
  const { googleLogin, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPickerActive, setIsPickerActive] = useState(false);

  const handleAccountAuthenticated = async (profile) => {
    try {
      const res = await googleLogin(profile);
      if (res?.success && onComplete) {
        onComplete(res.user);
      }
    } catch (err) {
      toast.error('Failed to log in with Google account: ' + err.message);
    }
  };

  const handleGoogleClick = async () => {
    const clientId = getGoogleClientId();

    // If client ID is present, try native Google Account Chooser popup directly
    if (clientId) {
      setIsPickerActive(true);
      try {
        await triggerGoogleNativePicker({
          clientId,
          onSuccess: (profile) => {
            setIsPickerActive(false);
            handleAccountAuthenticated(profile);
          },
          onError: (err) => {
            setIsPickerActive(false);
            console.warn('Native Google prompt error, opening account chooser fallback:', err);
            // Open interactive chooser modal on error or cancelled
            setIsModalOpen(true);
          }
        });
      } catch (err) {
        setIsPickerActive(false);
        setIsModalOpen(true);
      }
    } else {
      // If no Client ID configured yet, open the interactive Google Account Chooser modal
      setIsModalOpen(true);
    }
  };

  const isBusy = loading || isPickerActive;

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={isBusy}
        className={`w-full py-3 px-4 rounded-2xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-black shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer group active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      >
        {isBusy ? (
          <div className="w-4 h-4 rounded-full border-2 border-sky-600/30 border-t-sky-600 animate-spin" />
        ) : (
          <svg className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span className="truncate">{isBusy ? 'Connecting to Google...' : text}</span>
      </button>

      {/* Account Selector & Connect Modal */}
      <GoogleAuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccountSelected={handleAccountAuthenticated}
      />
    </>
  );
};

export default GoogleLogin;
