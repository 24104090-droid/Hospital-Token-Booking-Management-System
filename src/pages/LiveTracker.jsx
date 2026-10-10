import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { Link } from 'react-router-dom';

export const LiveTracker = () => {
  const { appointments, hospitals } = useQueue();
  const [selectedAppId, setSelectedAppId] = useState(appointments[0]?.id || '');
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [simulatedElapsed, setSimulatedElapsed] = useState(0);

  const activeAppointment = appointments.find((a) => a.id === selectedAppId) || appointments[0];
  const matchedHospital = activeAppointment ? hospitals.find((h) => h.id === activeAppointment.hospitalId) : null;

  // Use live hospital currentToken if available
  const currentTokenServing = matchedHospital ? matchedHospital.currentToken : activeAppointment?.currentTokenServing || 28;
  const myTokenNumber = activeAppointment ? parseInt(activeAppointment.token.replace(/\D/g, '')) : 42;
  const tokensAhead = Math.max(0, myTokenNumber - currentTokenServing);

  const isMyTurn = tokensAhead === 0;
  const isNext = tokensAhead === 1;

  // Simulated countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleAlert = () => {
    setAlertEnabled(!alertEnabled);
    if (!alertEnabled) {
      alert('🔔 SMS & Sound alerts activated! You will receive a high-priority alert when your token is 2 slots away.');
    }
  };

  if (!activeAppointment) {
    return (
      <div className="container" style={{ marginTop: '3rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 1.5rem' }}>
          <i className="fas fa-gauge-simple-med" style={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }}></i>
          <h2>No Active Queue Tokens</h2>
          <p className="text-muted" style={{ margin: '0.5rem 0 1.5rem' }}>
            You haven't booked any OPD tokens for today yet.
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            Find Hospital & Book Token
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '860px', marginTop: '2rem', marginBottom: '3rem' }}>
      {/* Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2>🔴 Live OPD Queue Telemetry</h2>
          <p className="text-muted" style={{ fontSize: '0.92rem' }}>
            Real-time consultation queue tracking. Avoid hospital waiting room congestion.
          </p>
        </div>

        {/* Token Switcher if multiple */}
        {appointments.length > 1 && (
          <div className="flex">
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Pass:</span>
            <select
              className="form-select"
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              style={{ padding: '0.4rem 2rem 0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.token} · {a.hospitalName.split(' ')[0]} ({a.department})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Status Board */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', border: isMyTurn ? '2px solid #16a34a' : '1px solid var(--border-color)' }}>
        {/* Top Hospital Info */}
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <span className="badge badge-blue" style={{ marginBottom: '0.35rem' }}>
              {activeAppointment.type} Healthcare
            </span>
            <h3 style={{ fontSize: '1.35rem', margin: 0 }}>{activeAppointment.hospitalName}</h3>
            <p className="text-muted" style={{ fontSize: '0.88rem', margin: '0.2rem 0 0' }}>
              Department: <strong>{activeAppointment.department}</strong> • Room: <strong style={{ color: 'var(--primary)' }}>{activeAppointment.room}</strong>
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>YOUR TOKEN</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
              {activeAppointment.token}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Patient: {activeAppointment.patientName}</div>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid-3" style={{ gap: '1rem', textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              NOW INSIDE CONSULTATION
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)', margin: '0.25rem 0' }}>
              #{currentTokenServing}
            </div>
            <div className="flex" style={{ justifyContent: 'center', fontSize: '0.8rem', color: '#16a34a' }}>
              <div className="pulse-dot"></div>
              <span>Doctor Active In Room</span>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              PATIENTS AHEAD OF YOU
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: tokensAhead === 0 ? '#16a34a' : 'var(--text-main)', margin: '0.25rem 0' }}>
              {tokensAhead === 0 ? 'YOU ARE NEXT!' : `${tokensAhead}`}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {tokensAhead === 0 ? 'Please enter doctor room' : 'Tokens in queue'}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              ESTIMATED WAIT TIME
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: tokensAhead <= 2 ? '#16a34a' : 'var(--accent)', margin: '0.25rem 0' }}>
              ~{Math.max(2, tokensAhead * 4)}m
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Approx ~4 mins per patient
            </div>
          </div>
        </div>

        {/* Progress Pipeline */}
        <div style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #bae6fd', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0369a1', marginBottom: '1rem', textTransform: 'uppercase' }}>
            Queue Progression:
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ textAlign: 'center', zIndex: 2 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#16a34a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.35rem' }}>
                <i className="fas fa-check"></i>
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>Token Booked</div>
            </div>

            <div style={{ textAlign: 'center', zIndex: 2 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: tokensAhead <= 3 ? '#16a34a' : 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.35rem' }}>
                <i className="fas fa-users-line"></i>
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>In Queue</div>
            </div>

            <div style={{ textAlign: 'center', zIndex: 2 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isNext || isMyTurn ? '#16a34a' : '#cbd5e1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.35rem' }}>
                <i className="fas fa-door-open"></i>
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>Proceed to Room</div>
            </div>

            <div style={{ textAlign: 'center', zIndex: 2 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isMyTurn ? '#16a34a' : '#cbd5e1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.35rem' }}>
                <i className="fas fa-stethoscope"></i>
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>Consultation</div>
            </div>
          </div>
        </div>

        {/* Live Alert Switcher */}
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div className="flex">
            <i className={`fas ${alertEnabled ? 'fa-bell' : 'fa-bell-slash'}`} style={{ color: alertEnabled ? 'var(--primary)' : 'var(--text-light)', fontSize: '1.25rem' }}></i>
            <div>
              <div className="font-semibold" style={{ fontSize: '0.92rem' }}>
                Proactive Turn Alert (SMS & Chime)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Receive audio notification when you are 2 tokens away from doctor consultation
              </div>
            </div>
          </div>

          <button
            onClick={toggleAlert}
            className={`btn btn-sm ${alertEnabled ? 'btn-success' : 'btn-outline-primary'}`}
          >
            {alertEnabled ? '✓ Alerts Active' : 'Enable Notification'}
          </button>
        </div>
      </div>
    </div>
  );
};
