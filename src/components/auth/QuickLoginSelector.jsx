import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockUsers } from '../../data/users';
import { FaUserCircle, FaShieldAlt, FaUserMd, FaBolt, FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const QuickLoginSelector = ({ onSelect, defaultOpen = false }) => {
  const { user, loginAsUser } = useAuth();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleQuickSelect = (selectedUser) => {
    loginAsUser(selectedUser);
    if (onSelect) onSelect(selectedUser);
  };

  return (
    <div className="w-full mt-5 pt-4 border-t border-slate-100 text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center text-[10px]">
            <FaBolt />
          </div>
          <span>Quick Demo Roles for Evaluation</span>
          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">
            5 Test Accounts
          </span>
        </div>
        <span className="text-slate-400 text-xs">
          {isOpen ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
        </span>
      </button>

      {isOpen && (
        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
          <p className="text-[11px] text-slate-500 mb-2.5 font-medium">
            Click any verified role profile below to instantly evaluate that experience:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {mockUsers.map((u) => {
              const isCurrent = user?.id === u.id;
              const roleBadgeColor = 
                u.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                u.role === 'hospital_staff' ? 'bg-teal-100 text-teal-800 border-teal-200' :
                'bg-sky-100 text-sky-800 border-sky-200';

              const RoleIcon = 
                u.role === 'admin' ? FaShieldAlt :
                u.role === 'hospital_staff' ? FaUserMd :
                FaUserCircle;

              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickSelect(u)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                    isCurrent
                      ? 'bg-white border-sky-600 shadow-sm ring-1 ring-sky-400'
                      : 'bg-white border-slate-200 hover:border-sky-400 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      <RoleIcon />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {u.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{u.email}</div>
                      <span className={`inline-block text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded ${roleBadgeColor}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {isCurrent && (
                    <div className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[9px] flex-shrink-0 ml-1">
                      <FaCheck />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickLoginSelector;
