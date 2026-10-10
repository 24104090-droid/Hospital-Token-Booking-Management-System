import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Clock,
  Ticket,
  MapPin,
  QrCode,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Building2
} from 'lucide-react';
import { BookingContext } from '../../context/BookingContext';
import QRModal from '../../components/QRModal';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const Appointments = () => {
  const navigate = useNavigate();
  const { appointments, loading, cancelToken, refreshAppointments } = useContext(BookingContext);

  const [selectedTokenForQR, setSelectedTokenForQR] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this OPD token?')) {
      setCancellingId(id);
      await cancelToken(id);
      setCancellingId(null);
    }
  };

  const activeTokens = appointments.filter(a => a.status === 'In Queue' || a.status === 'In-Consultation');
  const pastTokens = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled' || a.status === 'Skipped');

  const displayedTokens = activeTab === 'active' ? activeTokens : pastTokens;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My OPD Tokens & Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track real-time queue position and doctor consultation status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshAppointments}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh Queues"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link to="/disease">
            <Button variant="primary" size="md">
              <Plus className="w-4 h-4 mr-1.5" /> Book New Token
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'active'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Active Live Queues</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'active' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'}`}>
            {activeTokens.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Past Consultations</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'history' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'}`}>
            {pastTokens.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Fetching your token records..." />
      ) : displayedTokens.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title={activeTab === 'active' ? 'No Active Tokens' : 'No Past Consultation History'}
          message={
            activeTab === 'active'
              ? 'You do not have any active tokens in queue right now. You can book an OPD token anytime.'
              : 'Completed consultations and cancelled tokens will be archived here.'
          }
          actionLabel={activeTab === 'active' ? 'Book an OPD Token' : undefined}
          onAction={activeTab === 'active' ? () => navigate('/disease') : undefined}
        />
      ) : (
        <div className="space-y-4">
          {displayedTokens.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Details */}
              <div className="flex items-start gap-4">
                {/* Hero Token Badge */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex flex-col items-center justify-center font-mono font-black flex-shrink-0 shadow-md">
                  <span className="text-lg leading-tight">{item.tokenNumber}</span>
                  <span className="text-[9px] uppercase tracking-wider font-sans font-semibold opacity-80">Token</span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        item.status === 'In-Consultation'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse'
                          : item.status === 'In Queue'
                          ? 'bg-sky-50 text-sky-700 border-sky-300'
                          : item.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700 border-slate-300'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      ● {item.status}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-500">
                      Pass ID: {item.id}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{item.hospitalName}</h3>
                  <p className="text-xs text-slate-500 mb-2">
                    {item.department} • {item.doctor} ({item.room})
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span>Patient: <strong>{item.patientName}</strong> ({item.patientAge}y)</span>
                    <span>•</span>
                    <span>Date: <strong>{item.bookedDate}</strong> ({item.timeSlot})</span>
                  </div>
                </div>
              </div>

              {/* Center Live Queue Stats (For Active Tokens) */}
              {item.status === 'In Queue' && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-4 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Serving</span>
                    <span className="text-sm font-black text-slate-800">{item.currentTokenServing}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Ahead of You</span>
                    <span className="text-sm font-black text-amber-600">{item.tokensAhead}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Wait</span>
                    <span className="text-sm font-black text-emerald-600">~{item.estimatedWaitMins}m</span>
                  </div>
                </div>
              )}

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTokenForQR(item)}
                >
                  <QrCode className="w-4 h-4 mr-1" /> QR Pass
                </Button>

                {item.status === 'In Queue' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:bg-rose-50"
                    onClick={() => handleCancel(item.id)}
                    disabled={cancellingId === item.id}
                  >
                    {cancellingId === item.id ? 'Cancelling...' : 'Cancel'}
                  </Button>
                )}

                {item.status === 'Completed' && (
                  <Link to="/feedback">
                    <Button variant="ghost" size="sm" className="text-sky-600 hover:bg-sky-50">
                      Rate Doctor
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Pass Modal */}
      <QRModal
        isOpen={Boolean(selectedTokenForQR)}
        onClose={() => setSelectedTokenForQR(null)}
        tokenData={selectedTokenForQR}
      />
    </div>
  );
};

export default Appointments;
