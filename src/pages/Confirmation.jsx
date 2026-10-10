import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { QRModal } from '../components/QRModal';

export const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('id');
  const { appointments } = useQueue();
  const [showQR, setShowQR] = useState(false);

  const appointment = appointments.find((a) => a.id === appointmentId) || appointments[0];

  if (!appointment) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>No booking found</h2>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const tokensAhead = Math.max(0, parseInt(appointment.token.replace(/\D/g, '')) - appointment.currentTokenServing);

  return (
    <div className="container" style={{ marginTop: '2.5rem', marginBottom: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            margin: '0 auto 0.75rem'
          }}
        >
          <i className="fas fa-check"></i>
        </div>
        <h1 style={{ fontSize: '2rem', color: '#065f46', marginBottom: '0.25rem' }}>
          OPD Token Confirmed!
        </h1>
        <p className="text-muted" style={{ fontSize: '0.95rem' }}>
          Your digital appointment pass has been registered in the hospital OPD queue system.
        </p>
      </div>

      {/* Printable Digital Token Pass */}
      <div className="token-pass">
        <div className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
          <i className="fas fa-hospital"></i> {appointment.type} OPD Queue Pass
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {appointment.hospitalName}
        </div>

        {/* Large Token Display */}
        <div className="token-number-hero">{appointment.token}</div>

        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
          {appointment.department}
        </div>

        <div
          style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #e2e8f0',
            textAlign: 'left',
            marginBottom: '1.5rem'
          }}
        >
          <div className="grid-2" style={{ gap: '0.75rem', fontSize: '0.88rem' }}>
            <div>
              <span className="text-muted">Patient Name:</span>
              <div className="font-semibold">{appointment.patientName} ({appointment.patientAge}y, {appointment.patientGender})</div>
            </div>
            <div>
              <span className="text-muted">Assigned Doctor:</span>
              <div className="font-semibold">{appointment.doctor}</div>
            </div>
            <div>
              <span className="text-muted">OPD Room:</span>
              <div className="font-semibold" style={{ color: 'var(--primary)' }}>{appointment.room}</div>
            </div>
            <div>
              <span className="text-muted">Timing Slot:</span>
              <div className="font-semibold">{appointment.timeSlot}</div>
            </div>
          </div>

          {appointment.isPriority && (
            <div style={{ marginTop: '0.75rem', padding: '0.4rem 0.75rem', background: '#fef3c7', borderRadius: '8px', color: '#92400e', fontSize: '0.8rem', fontWeight: 600 }}>
              <i className="fas fa-star"></i> Priority Pass: {appointment.priorityReason}
            </div>
          )}
        </div>

        {/* Live Queue Status Banner */}
        <div style={{ background: '#e0f2fe', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #bae6fd' }}>
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
            <div className="flex">
              <div className="pulse-dot"></div>
              <span style={{ fontSize: '0.88rem', color: '#0369a1' }}>
                Currently Serving: <strong>Token #{appointment.currentTokenServing}</strong>
              </span>
            </div>
            <div style={{ fontSize: '0.88rem', color: '#0369a1', fontWeight: 600 }}>
              {tokensAhead} tokens ahead (~{appointment.estimatedWaitMins}m wait)
            </div>
          </div>
        </div>

        {/* Action Buttons inside Card */}
        <div className="flex" style={{ justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setShowQR(true)} className="btn btn-outline-primary">
            <i className="fas fa-qrcode"></i> Show Check-In QR
          </button>
          <Link to="/tracker" className="btn btn-primary">
            <i className="fas fa-gauge-high"></i> Track Live Queue
          </Link>
          <button onClick={() => window.print()} className="btn btn-outline no-print">
            <i className="fas fa-print"></i> Print Pass
          </button>
        </div>
      </div>

      {/* Navigation shortcuts */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/appointments" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', marginRight: '1.5rem' }}>
          <i className="fas fa-ticket-simple"></i> View All My Tokens
        </Link>
        <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
          <i className="fas fa-house"></i> Return to Dashboard
        </Link>
      </div>

      {showQR && (
        <QRModal appointment={appointment} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
};
