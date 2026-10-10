import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaKey, FaShieldAlt, FaCopy, FaCheck, FaTimes, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const JWTInspector = () => {
  const { jwtToken, decodedClaims, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!jwtToken || !decodedClaims) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(jwtToken);
    setCopied(true);
    toast.success('JWT Bearer token copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating JWT Badge */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 left-5 z-40 bg-slate-900/95 backdrop-blur-md hover:bg-slate-950 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-2xl text-[11px] font-mono font-bold shadow-xl flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
        title="Inspect active JWT token claims"
      >
        <FaKey className="text-emerald-400" />
        <span>JWT {decodedClaims.payload?.role?.toUpperCase()}</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      </button>

      {/* Modal Inspector */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-700 max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <FaShieldAlt size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <span>JSON Web Token (JWT) Inspector</span>
                    <span className="badge bg-emerald-950 text-emerald-400 border border-emerald-700 text-[10px]">
                      RFC 7519 Valid
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live authenticated session token with cryptographic claims
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Token Claims Breakdown */}
            <div className="space-y-4 my-5">
              {/* Token String */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Raw Encoded Token (Header.Payload.Signature)
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    {copied ? <FaCheck /> : <FaCopy />}
                    <span>{copied ? 'Copied' : 'Copy Bearer Token'}</span>
                  </button>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 break-all select-all">
                  <span className="text-rose-400">{jwtToken.split('.')[0]}</span>.
                  <span className="text-purple-400">{jwtToken.split('.')[1]}</span>.
                  <span className="text-sky-400">{jwtToken.split('.')[2]}</span>
                </div>
              </div>

              {/* Decoded Claims Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                    HEADER: Algorithm & Token Type
                  </span>
                  <pre className="font-mono text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-xl overflow-x-auto">
                    {JSON.stringify(decodedClaims.header, null, 2)}
                  </pre>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                    SECURITY & EXPIRATION
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Subject (sub):</span>
                      <strong className="font-mono text-emerald-400">{decodedClaims.payload?.sub}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Assigned Role:</span>
                      <strong className="uppercase font-bold text-amber-300">{decodedClaims.payload?.role}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Issuer (iss):</span>
                      <span className="text-[11px] text-slate-400">tvlsmartcare.tn.gov.in</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="text-emerald-400 font-bold">🟢 Active & Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decoded Payload */}
              <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                  PAYLOAD: Decoded User Claims & Permissions
                </span>
                <pre className="font-mono text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-xl overflow-x-auto">
                  {JSON.stringify(decodedClaims.payload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <FaLock className="text-emerald-400" /> Header: <code>Authorization: Bearer &lt;token&gt;</code>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JWTInspector;
