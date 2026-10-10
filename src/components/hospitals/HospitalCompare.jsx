import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital } from '../../context/HospitalContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { FaTimes, FaCheck, FaStar, FaTicketAlt, FaClock, FaHospital, FaBalanceScale } from 'react-icons/fa';

const HospitalCompare = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare, hospitals } = useHospital();

  const hospitalsToCompare = compareList.length > 0 ? compareList : hospitals.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <FaBalanceScale className="text-sky-600" /> Hospital Comparison Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare consultation fees, ICU beds, OPD wait times, facilities, and ratings side-by-side
          </p>
        </div>
        {compareList.length > 0 && (
          <Button onClick={clearCompare} variant="outline" size="sm" className="text-xs">
            Clear Selection
          </Button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-44 bg-slate-50">
                Hospital Metrics
              </th>
              {hospitalsToCompare.map((hosp) => (
                <th key={hosp.id} className="p-4 min-w-[220px] align-top">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`badge text-[9px] font-extrabold ${hosp.type === 'Government' ? 'badge-success' : 'badge-primary'} mb-1`}>
                        {hosp.type?.toUpperCase()}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{hosp.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{hosp.area} • {hosp.distance} km</p>
                    </div>
                    {compareList.some(c => c.id === hosp.id) && (
                      <button
                        onClick={() => removeFromCompare(hosp.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Remove from compare"
                      >
                        <FaTimes size={13} />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-3.5 font-bold text-slate-700 bg-slate-50 uppercase text-[11px]">Rating</td>
              {hospitalsToCompare.map((h) => (
                <td key={h.id} className="p-3.5">
                  <div className="flex items-center gap-1.5 font-black text-amber-600">
                    <FaStar className="text-amber-500" />
                    <span>{h.rating} / 5.0</span>
                    <span className="text-[10px] text-slate-400 font-normal">({h.reviews} reviews)</span>
                  </div>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3.5 font-bold text-slate-700 bg-slate-50 uppercase text-[11px]">Consultation Fee</td>
              {hospitalsToCompare.map((h) => (
                <td key={h.id} className="p-3.5">
                  <span className="font-extrabold text-slate-900">
                    {h.consultationFee === 0 ? 'FREE (Govt OPD)' : `₹${h.consultationFee}`}
                  </span>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3.5 font-bold text-slate-700 bg-slate-50 uppercase text-[11px]">ICU / General Beds</td>
              {hospitalsToCompare.map((h) => (
                <td key={h.id} className="p-3.5">
                  <span className="font-bold text-emerald-700">
                    {h.icuBedsAvailable || 10} ICU / {h.generalBedsAvailable || 40} Gen Beds
                  </span>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3.5 font-bold text-slate-700 bg-slate-50 uppercase text-[11px]">Emergency 24/7</td>
              {hospitalsToCompare.map((h) => (
                <td key={h.id} className="p-3.5">
                  {h.emergencyAvailable ? (
                    <span className="badge badge-danger text-[9px] font-bold">24/7 EMERGENCY READY</span>
                  ) : (
                    <span className="text-slate-400 text-xs">Day OPD only</span>
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3.5 font-bold text-slate-700 bg-slate-50 uppercase text-[11px]">Key Departments</td>
              {hospitalsToCompare.map((h) => (
                <td key={h.id} className="p-3.5">
                  <div className="flex flex-wrap gap-1">
                    {(h.departments || []).slice(0, 4).map((d) => (
                      <span key={d} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3.5 font-bold text-slate-700 bg-slate-50 uppercase text-[11px]">Action</td>
              {hospitalsToCompare.map((h) => (
                <td key={h.id} className="p-3.5">
                  <Button
                    onClick={() => navigate(`/book?hospitalId=${h.id}`)}
                    size="sm"
                    fullWidth
                    className="font-bold text-xs"
                  >
                    Book Token Pass
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

export default HospitalCompare;
