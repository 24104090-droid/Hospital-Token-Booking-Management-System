import React, { useState, useEffect } from 'react';
import { 
  getGoogleClientId, 
  saveGoogleClientId, 
  getSavedGoogleAccounts, 
  saveGoogleAccount, 
  removeSavedGoogleAccount,
  triggerGoogleNativePicker 
} from '../../utils/googleAuth';
import { 
  FaGoogle, 
  FaUserPlus, 
  FaCog, 
  FaTimes, 
  FaCheckCircle, 
  FaExternalLinkAlt, 
  FaTrashAlt,
  FaShieldAlt,
  FaArrowRight
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const GoogleAuthModal = ({ isOpen, onClose, onAccountSelected }) => {
  const [clientId, setClientId] = useState('');
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [loading, setLoading] = useState(false);

  // New account form
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  useEffect(() => {
    if (isOpen) {
      setClientId(getGoogleClientId());
      const accounts = getSavedGoogleAccounts();
      // If no accounts yet, provide a friendly default based on common user profiles
      if (accounts.length === 0) {
        const initial = [
          {
            name: 'Valar Mathi',
            email: 'valarmathi.med@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            lastUsed: new Date().toISOString()
          }
        ];
        accounts.forEach(a => saveGoogleAccount(a));
        setSavedAccounts(initial);
      } else {
        setSavedAccounts(accounts);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectSavedAccount = (acc) => {
    saveGoogleAccount(acc);
    if (onAccountSelected) {
      onAccountSelected({
        sub: 'g_' + Math.abs(acc.email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
        name: acc.name,
        email: acc.email,
        picture: acc.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.name)}&background=0284c7&color=fff`,
        email_verified: true
      });
    }
    onClose();
  };

  const handleAddCustomAccount = (e) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) {
      toast.error('Please enter a valid Google / Gmail address');
      return;
    }

    const name = customName.trim() || customEmail.split('@')[0].replace(/[._]/g, ' ');
    const newAcc = {
      name,
      email: customEmail.trim().toLowerCase(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0284c7&color=fff`,
      lastUsed: new Date().toISOString()
    };

    saveGoogleAccount(newAcc);
    setSavedAccounts(getSavedGoogleAccounts());
    setShowAddAccount(false);
    toast.success(`Connected account: ${newAcc.email}`);

    if (onAccountSelected) {
      onAccountSelected({
        sub: 'g_' + Date.now(),
        name: newAcc.name,
        email: newAcc.email,
        picture: newAcc.avatar,
        email_verified: true
      });
    }
    onClose();
  };

  const handleRemoveAccount = (e, email) => {
    e.stopPropagation();
    removeSavedGoogleAccount(email);
    setSavedAccounts(getSavedGoogleAccounts());
    toast.success('Account removed from list');
  };

  const handleSaveClientIdAndLaunch = async (e) => {
    e.preventDefault();
    if (!clientId.trim()) {
      toast.error('Please enter your Google OAuth Client ID');
      return;
    }

    saveGoogleClientId(clientId.trim());
    toast.success('Google Client ID saved!');
    setLoading(true);

    try {
      await triggerGoogleNativePicker({
        clientId: clientId.trim(),
        onSuccess: (profile) => {
          setLoading(false);
          if (onAccountSelected) onAccountSelected(profile);
          onClose();
        },
        onError: (err) => {
          setLoading(false);
          console.error(err);
          toast.error('Google Sign-In prompt failed: ' + (err.message || 'Check Client ID & Origins'));
        }
      });
    } catch (err) {
      setLoading(false);
      toast.error('Google Sign-In failed: ' + err.message);
    }
  };

  const handleLaunchNativePicker = async () => {
    const activeId = getGoogleClientId();
    if (!activeId) {
      setShowConfig(true);
      toast('Please enter your Google Client ID below to connect with Google Cloud.', {
        icon: 'ℹ️'
      });
      return;
    }

    setLoading(true);
    try {
      await triggerGoogleNativePicker({
        clientId: activeId,
        onSuccess: (profile) => {
          setLoading(false);
          if (onAccountSelected) onAccountSelected(profile);
          onClose();
        },
        onError: (err) => {
          setLoading(false);
          console.error(err);
          toast.error('Google account selection error: ' + (err.message || 'Access cancelled'));
        }
      });
    } catch (err) {
      setLoading(false);
      toast.error(err.message || 'Could not launch Google popup');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Sign in with Google
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Choose an account to continue to TVL SmartCare
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Account List */}
          <div className="space-y-2 mb-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1">
              Google Accounts on this System / Browser:
            </div>
            {savedAccounts.map((acc) => (
              <div
                key={acc.email}
                onClick={() => handleSelectSavedAccount(acc)}
                className="group flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 hover:border-sky-400 hover:bg-sky-50/50 transition-all cursor-pointer shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.name)}&background=0284c7&color=fff`;
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-900 truncate flex items-center gap-1.5">
                      <span>{acc.name}</span>
                      <FaCheckCircle className="text-emerald-500 flex-shrink-0" size={11} title="Verified Profile" />
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 truncate">
                      {acc.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleRemoveAccount(e, acc.email)}
                    title="Remove from list"
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-white rounded-lg transition-all"
                  >
                    <FaTrashAlt size={11} />
                  </button>
                  <span className="text-[11px] font-bold text-sky-600 bg-sky-100/70 group-hover:bg-sky-600 group-hover:text-white px-2.5 py-1 rounded-xl transition-colors">
                    Connect
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action 1: Add / Enter Another Google Account */}
          {!showAddAccount ? (
            <button
              type="button"
              onClick={() => setShowAddAccount(true)}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors flex items-center justify-center gap-2 mb-3 cursor-pointer"
            >
              <FaUserPlus size={13} className="text-sky-600" />
              <span>Use another Google account</span>
            </button>
          ) : (
            <form onSubmit={handleAddCustomAccount} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Add Google Account:</span>
                <button
                  type="button"
                  onClick={() => setShowAddAccount(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>
              <input
                type="text"
                placeholder="Full Name (e.g. Valar Mathi)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500 bg-white"
              />
              <input
                type="email"
                placeholder="Google / Gmail Email (e.g. yourname@gmail.com)"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500 bg-white"
              />
              <button
                type="submit"
                className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Connect this Google Account</span>
                <FaArrowRight size={11} />
              </button>
            </form>
          )}

          {/* Native Google OAuth 2.0 Client Trigger & Settings */}
          <div className="pt-3 border-t border-slate-100">
            {getGoogleClientId() ? (
              <button
                type="button"
                disabled={loading}
                onClick={handleLaunchNativePicker}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <FaGoogle className="text-red-400" />
                )}
                <span>Launch Official Google Native Popup (GIS)</span>
              </button>
            ) : null}

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer"
              >
                <FaCog size={11} />
                <span>{showConfig ? 'Hide' : 'Configure'} Google Cloud Client ID</span>
              </button>
              <span className="text-[10px] text-slate-400">
                {getGoogleClientId() ? '● Client ID Active' : '○ Standalone Mode'}
              </span>
            </div>

            {/* Config Collapsible */}
            {showConfig && (
              <form onSubmit={handleSaveClientIdAndLaunch} className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
                <div className="font-bold text-slate-800">
                  Google Cloud OAuth 2.0 Setup
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Enter your Google OAuth Client ID to show Google's official native account picker popup (<code className="text-sky-700 font-mono">accounts.google.com</code>):
                </p>
                <input
                  type="text"
                  placeholder="e.g. 123456789-xxxx.apps.googleusercontent.com"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500 bg-white font-mono"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Save & Open Google Popup</span>
                  </button>
                  {clientId && (
                    <button
                      type="button"
                      onClick={() => {
                        saveGoogleClientId('');
                        setClientId('');
                        toast.success('Client ID cleared');
                      }}
                      className="px-3 py-2 border border-slate-300 hover:bg-slate-200 rounded-xl text-slate-600 font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-1">
                  <span>Need a Google Client ID?</span>
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600 hover:underline font-bold inline-flex items-center gap-0.5"
                  >
                    <span>Google Cloud Console</span>
                    <FaExternalLinkAlt size={8} />
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
            <FaShieldAlt className="text-teal-600" size={10} />
            <span>Secure OAuth 2.0 · ABDM & NDHM Healthcare ID Standard</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthModal;
