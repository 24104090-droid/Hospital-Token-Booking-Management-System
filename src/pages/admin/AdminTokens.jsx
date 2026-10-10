import React, { useState, useEffect } from 'react';
import {
  Ticket,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RotateCcw,
  ShieldAlert,
  Search,
  Filter,
  Volume2
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchTokens = async () => {
    try {
      const data = await adminService.getTokens();
      setTokens(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleStatusChange = async (tokenId, newStatus) => {
    await adminService.updateTokenStatus(tokenId, newStatus);
    await fetchTokens();
  };

  const handleCallNext = async () => {
    const res = await adminService.callNextToken();
    if (res.success) {
      alert(`Announced next token: ${res.token.tokenNumber} -> Room ${res.token.room}`);
      await fetchTokens();
    } else {
      alert(res.message || 'No more pending tokens');
    }
  };

  const filteredTokens = tokens.filter(t => {
    const matchesDept = deptFilter === 'All' || t.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesSearch =
      t.patientName.toLowerCase().includes(search.toLowerCase()) ||
      t.tokenNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.hospitalName.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  const departments = ['All', 'General Medicine', 'Cardiology', 'Dermatology', 'Ophthalmology', 'ENT', 'Pediatrics', 'Orthopedics'];

  return (
    <div className="space-y-6">
      {/* Header & Operator Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Live OPD Dispatcher Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            OPD Token Queue Operator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control live consultation room calls, check-in verification, and priority triage
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleCallNext}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
          >
            <Volume2 className="w-4 h-4 mr-1.5" /> Call Next in Queue
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            <Filter className="w-3.5 h-3.5 inline mr-1" /> Department:
          </span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-2 mr-1">
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="In Queue">In Queue (Waiting)</option>
            <option value="In-Consultation">In-Consultation (Active)</option>
            <option value="Completed">Completed</option>
            <option value="Skipped">Skipped / No Show</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search token # or patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>
      </div>

      {/* Tokens Table */}
      {loading ? (
        <LoadingSpinner message="Fetching live queue tokens..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Token #</th>
                <th className="p-4">Patient & Contact</th>
                <th className="p-4">Department & Doctor</th>
                <th className="p-4">Room</th>
                <th className="p-4">Time Slot</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Queue Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredTokens.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <span className="font-mono font-extrabold text-sm text-sky-700 bg-sky-50 px-2 py-1 rounded border border-sky-200 block w-fit">
                      {t.tokenNumber}
                    </span>
                    {t.isPriority && (
                      <span className="text-[9px] font-bold text-red-600 uppercase mt-0.5 block">
                        ★ Emergency Priority
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{t.patientName}</span>
                    <span className="text-slate-400 text-[11px]">{t.patientAge}y, {t.patientGender} • {t.patientMobile}</span>
                  </td>

                  <td className="p-4">
                    <span className="font-semibold text-slate-800 block">{t.department}</span>
                    <span className="text-slate-400 text-[11px]">{t.doctor}</span>
                  </td>

                  <td className="p-4 font-mono font-bold text-slate-700">
                    {t.room}
                  </td>

                  <td className="p-4 text-slate-600">
                    {t.timeSlot}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1 ${
                        t.status === 'In-Consultation'
                          ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                          : t.status === 'In Queue'
                          ? 'bg-sky-100 text-sky-800'
                          : t.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      ● {t.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {t.status === 'In Queue' && (
                        <button
                          onClick={() => handleStatusChange(t.id, 'In-Consultation')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-700 transition-colors flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" /> Call In
                        </button>
                      )}

                      {t.status === 'In-Consultation' && (
                        <button
                          onClick={() => handleStatusChange(t.id, 'Completed')}
                          className="px-2.5 py-1 bg-sky-600 text-white rounded-lg font-bold text-[11px] hover:bg-sky-700 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Mark Done
                        </button>
                      )}

                      {t.status !== 'Completed' && t.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleStatusChange(t.id, 'Skipped')}
                          className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-[11px] font-semibold"
                          title="Patient No Show"
                        >
                          Skip
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTokens;
