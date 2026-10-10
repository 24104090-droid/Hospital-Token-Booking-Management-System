import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { Link } from 'react-router-dom';
import { QRModal } from '../components/QRModal';

export const Appointments = () => {
  const { appointments, cancelAppointment } = useQueue();
  const [selectedQRAppointment, setSelectedQRAppointment] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter === 'All') return true;
    return app.status === statusFilter;
  });

  const handleCancel = (id, token) => {
    if (window.confirm(`Are you sure you want to cancel token pass ${token}? This will free up the slot for other patients.`)) {
      cancelAppointment(id);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Queue':
        return <span className="badge badge-blue"><i className="fas fa-spinner fa-spin"></i> In Queue</span>;
      case 'In-Consultation':
        return <span className="badge badge-amber"><i className="fas fa-user-doctor"></i> In Consultation</span>;
      case 'Completed':
        return <span className="badge badge-green"><i className="fas fa-check"></i> Completed</span>;
      case 'Cancelled':
        return <span className="badge badge-red"><i className="fas fa-ban"></i> Cancelled</span>;
      default:
        return <span className="badge badge-slate">{status}</span>;
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
      {/* Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2>🎫 My OPD Tokens & Passes</h2>
          <p className="text-muted" style={{ fontSize: '0.92rem' }}>
            Manage active tokens, download official check-in QR passes, and view consultation history.
          </p>
        </div>

        <Link to="/hospitals" className="btn btn-primary">
          <i className="fas fa-plus"></i> Book New Token
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex" style={{ gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'In Queue', 'Completed', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-outline'}`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="grid-1" style={{ gap: '1.25rem' }}>
          {filteredAppointments.map((app) => (
            <div key={app.id} className="card" style={{ padding: '1.5rem' }}>
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div className="flex" style={{ gap: '1rem' }}>
                  {/* Token Box */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                      borderRadius: '12px',
                      padding: '0.75rem 1.25rem',
                      textAlign: 'center',
                      border: '1px solid #7dd3fc'
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase' }}>TOKEN</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7', lineHeight: 1.1 }}>
                      {app.token}
                    </div>
                  </div>

                  <div>
                    <div className="flex" style={{ gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{app.hospitalName}</h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      Specialty: <strong>{app.department}</strong> • Doctor: <strong>{app.doctor}</strong> • Room: <strong style={{ color: 'var(--primary)' }}>{app.room}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex" style={{ gap: '0.5rem' }}>
                  {app.status === 'In Queue' && (
                    <Link to="/tracker" className="btn btn-sm btn-primary">
                      <i className="fas fa-gauge-high"></i> Live Track
                    </Link>
                  )}
                  <button onClick={() => setSelectedQRAppointment(app)} className="btn btn-sm btn-outline-primary">
                    <i className="fas fa-qrcode"></i> View QR Pass
                  </button>
                  {app.status === 'In Queue' && (
                    <button onClick={() => handleCancel(app.id, app.token)} className="btn btn-sm btn-outline" style={{ color: 'var(--danger)', borderColor: '#fecaca' }}>
                      <i className="fas fa-trash"></i> Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Token Details Grid */}
              <div className="grid-4" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <div>
                  <span>Patient Name:</span>
                  <div className="font-semibold" style={{ color: 'var(--text-main)' }}>{app.patientName}</div>
                </div>
                <div>
                  <span>Date & Slot:</span>
                  <div className="font-semibold" style={{ color: 'var(--text-main)' }}>{app.date} • {app.timeSlot.split('(')[0]}</div>
                </div>
                <div>
                  <span>Booking Reference:</span>
                  <div className="font-semibold" style={{ color: 'var(--text-main)' }}>{app.id}</div>
                </div>
                <div>
                  <span>Current Queue Status:</span>
                  <div className="font-semibold" style={{ color: app.status === 'In Queue' ? '#0284c7' : 'inherit' }}>
                    {app.status === 'In Queue' ? `Serving #${app.currentTokenServing} (~${app.estimatedWaitMins}m wait)` : app.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <i className="fas fa-ticket-simple" style={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }}></i>
          <h3>No Tokens in this Category</h3>
          <p className="text-muted" style={{ margin: '0.5rem auto 1.5rem', maxWidth: '400px' }}>
            You have no appointments matching "{statusFilter}".
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            Find Health Care & Book Token
          </Link>
        </div>
      )}

      {selectedQRAppointment && (
        <QRModal
          appointment={selectedQRAppointment}
          onClose={() => setSelectedQRAppointment(null)}
        />
      )}
    </div>
  );
};
