import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GitCompare,
  Trash2,
  CheckCircle2,
  XCircle,
  Building2,
  Star,
  Clock,
  Ticket,
  Users,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { mockHospitals } from '../../data/mockHospitals';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';

const Compare = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useHospital();

  // If user has no hospitals selected, offer them to load top 2 for demonstration
  const handleLoadSampleCompare = () => {
    addToCompare(mockHospitals[0]);
    addToCompare(mockHospitals[1]);
  };

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <GitCompare className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Compare Hospital Queues</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare live waiting times, OPD tokens, doctor expertise, and facilities side-by-side.
          </p>
        </div>

        <EmptyState
          icon={GitCompare}
          title="No Hospitals in Comparison List"
          message="Select up to 3 hospitals from the directory or try comparing our top government and private hospitals."
          actionLabel="Compare Sample Hospitals"
          onAction={handleLoadSampleCompare}
        />

        <div className="text-center mt-4">
          <Link to="/hospitals" className="text-xs font-bold text-sky-600 hover:underline">
            Browse Full Hospital Directory →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full mb-1">
            <GitCompare className="w-3.5 h-3.5" /> Side-by-Side OPD Matrix
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Comparing {compareList.length} Hospitals
          </h1>
          <p className="text-xs text-slate-500">
            Evaluate wait times, available tokens, and facility accreditation
          </p>
        </div>

        <div className="flex items-center gap-3">
          {compareList.length < 3 && (
            <Link to="/hospitals">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Hospital
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" onClick={clearCompare} className="text-rose-600 hover:bg-rose-50">
            <Trash2 className="w-4 h-4 mr-1" /> Clear List
          </Button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="p-4 w-1/4 font-bold text-slate-500 uppercase tracking-wider">Metric</th>
              {compareList.map((hosp) => (
                <th key={hosp.id} className="p-4 font-bold text-slate-900 border-l border-slate-200 min-w-[240px]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{hosp.name}</h4>
                      <span className="text-[11px] text-slate-500 font-normal">{hosp.address}</span>
                    </div>
                    <button
                      onClick={() => removeFromCompare(hosp.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Type & Fee */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/30">Hospital Type & Fee</td>
              {compareList.map((h) => (
                <td key={h.id} className="p-4 border-l border-slate-200">
                  <span
                    className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      h.type === 'Government'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-sky-50 text-sky-700 border-sky-300'
                    }`}
                  >
                    {h.type} {h.freeOPD ? '• Free OPD' : `• ₹${h.consultationFee || 200}`}
                  </span>
                </td>
              ))}
            </tr>

            {/* Waiting Time */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/30">Avg Wait Time</td>
              {compareList.map((h) => (
                <td key={h.id} className="p-4 border-l border-slate-200">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>~{h.waitingTime} minutes</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Available Tokens */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/30">Available Tokens</td>
              {compareList.map((h) => (
                <td key={h.id} className="p-4 border-l border-slate-200">
                  <div className="flex items-center gap-1.5 font-extrabold text-sky-700">
                    <Ticket className="w-4 h-4 text-sky-600" />
                    <span>{h.availableTokens} Tokens Left</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Current Token Serving */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/30">Current Live Token</td>
              {compareList.map((h) => (
                <td key={h.id} className="p-4 border-l border-slate-200 font-mono font-bold text-slate-800">
                  {h.currentToken}
                </td>
              ))}
            </tr>

            {/* Crowd Level */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/30">Crowd Level</td>
              {compareList.map((h) => (
                <td key={h.id} className="p-4 border-l border-slate-200">
                  <span className="font-semibold text-slate-800">{h.crowdLevel} Crowd</span>
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/30">Patient Rating</td>
              {compareList.map((h) => (
                <td key={h.id} className="p-4 border-l border-slate-200">
                  <div className="flex items-center gap-1 font-bold text-slate-800">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{h.rating} / 5.0</span>
                    <span className="text-slate-400 font-normal">({h.reviewsCount || 400})</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Distance */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/30">Distance from Center</td>
              {compareList.map((h) => (
                <td key={h.id} className="p-4 border-l border-slate-200 text-slate-700 font-medium">
                  {h.distance} km
                </td>
              ))}
            </tr>

            {/* Facilities */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/30">Key Facilities</td>
              {compareList.map((h) => (
                <td key={h.id} className="p-4 border-l border-slate-200">
                  <ul className="space-y-1">
                    {h.facilities && h.facilities.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Direct Action */}
            <tr>
              <td className="p-4 font-bold text-slate-700 bg-slate-50/30">Book Token</td>
              {compareList.map((h) => (
                <td key={h.id} className="p-4 border-l border-slate-200">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/book-token?hospitalId=${h.id}`)}
                    disabled={h.availableTokens === 0}
                  >
                    <span>{h.availableTokens > 0 ? 'Book Token' : 'Full'}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
