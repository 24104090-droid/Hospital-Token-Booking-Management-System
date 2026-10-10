import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History as HistoryIcon,
  Calendar,
  Building2,
  Stethoscope,
  FileText,
  Download,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { BookingContext } from '../../context/BookingContext';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';

const History = () => {
  const navigate = useNavigate();
  const { appointments } = useContext(BookingContext);

  const pastVisits = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <HistoryIcon className="w-3.5 h-3.5" /> Consultation Archive
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            OPD Medical Visit History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your past hospital consultations, doctor prescriptions, and health records
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => navigate('/disease')}>
          Book New OPD Visit
        </Button>
      </div>

      {pastVisits.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No Past Medical Visits"
          message="Once your OPD consultations are marked completed by hospital doctors, your records and prescription summaries will appear here."
        />
      ) : (
        <div className="space-y-4">
          {pastVisits.map((visit) => (
            <div
              key={visit.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{visit.hospitalName}</h3>
                    <p className="text-xs text-slate-500">{visit.department} • {visit.doctor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      visit.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    ● {visit.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {visit.bookedDate}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient</span>
                  <span className="font-bold text-slate-800">{visit.patientName} ({visit.patientAge}y)</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Diagnosed Issue</span>
                  <span className="font-bold text-slate-800">{visit.disease}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Token & Room</span>
                  <span className="font-bold text-slate-800">{visit.tokenNumber} ({visit.room})</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-slate-500 text-[11px] font-mono">
                  Ref: {visit.id}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Digital prescription for token ${visit.tokenNumber} downloaded.`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Prescription Summary</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
