import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { admin } = useAuth();
  const { hospitals, appointments, callNextToken, updateHospitalStatus, resetQueueData } = useQueue();

  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitals[0]?.id || 1);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyPatient, setEmergencyPatient] = useState('');
  const [emergencyDept, setEmergencyDept] = useState('Emergency & Trauma Care');

  const currentHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  const hospitalAppointments = appointments.filter((a) => a.hospitalId === currentHospital.id);

  const handleCallNext = () => {
    callNextToken(currentHospital.id);
  };

  const handleCrowdChange = (newLevel) => {
    updateHospitalStatus(currentHospital.id, { crowdLevel: newLevel });
  };

  const handleWaitAdjust = (delta) => {
    const newWait = Math.max(3, currentHospital.waitingTime + delta);
    updateHospitalStatus(currentHospital.id, { waitingTime: newWait });
  };

  const handleEmergencyInsert = (e) => {
    e.preventDefault();
    if (!emergencyPatient.trim()) return;
    callNextToken(currentHospital.id);
    alert(`🚨 Emergency priority token generated for ${emergencyPatient}! Directed to ${emergencyDept}.`);
    setShowEmergencyModal(false);
    setEmergencyPatient('');
  };

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
      {/* Header */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div className="badge badge-slate" style={{ marginBottom: '0.35rem' }}>
            <i className="fas fa-shield-halved"></i> OPD Telemetry & Queue Command Center
          </div>
          <h2>Hospital Administrator Console</h2>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Managing live queues for <strong>{currentHospital.name}</strong>
          </p>
        </div>

        {/* Hospital Switcher */}
        <div className="flex" style={{ gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Hospital:</span>
          <select
            className="form-select"
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(parseInt(e.target.value))}
            style={{ minWidth: '240px' }}
          >
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            NOW SERVING TOKEN
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1, margin: '0.35rem 0' }}>
            #{currentHospital.currentToken}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#16a34a' }}>
            <i className="fas fa-circle-check"></i> Active in Doctor Cabin
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            TOKENS ISSUED TODAY
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1, margin: '0.35rem 0' }}>
            {currentHospital.currentToken + (100 - currentHospital.availableTokens)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Remaining: <strong>{currentHospital.availableTokens}</strong> tokens
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            ESTIMATED OPD WAIT
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#d97706', lineHeight: 1.1, margin: '0.35rem 0' }}>
            ~{currentHospital.waitingTime}m
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Crowd Density: <strong>{currentHospital.crowdLevel}</strong>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            ACTIVE OPD DOCTORS
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#7c3aed', lineHeight: 1.1, margin: '0.35rem 0' }}>
            {currentHospital.doctors.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Across {currentHospital.departments.length} Departments
          </div>
        </div>
      </div>

      {/* OPD Queue Command Center Panel */}
      <div className="card" style={{ background: '#0f172a', color: 'white', padding: '2rem', marginBottom: '2.5rem', borderRadius: '18px' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ color: 'white', fontSize: '1.4rem', margin: 0 }}>
              <i className="fas fa-bullhorn" style={{ color: '#38bdf8', marginRight: '0.5rem' }}></i>
              Live OPD Counter Controller
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0.25rem 0 0' }}>
              Broadcast real-time token advances to patient mobile apps and waiting hall displays.
            </p>
          </div>

          <div className="flex" style={{ gap: '0.75rem' }}>
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="btn btn-danger btn-sm"
            >
              <i className="fas fa-triangle-exclamation"></i> Emergency Fast-Track
            </button>
            <button
              onClick={resetQueueData}
              className="btn btn-outline btn-sm"
              style={{ color: '#94a3b8', borderColor: '#334155' }}
              title="Reset simulation data to default"
            >
              <i className="fas fa-rotate-left"></i> Reset Demo
            </button>
          </div>
        </div>

        <div className="grid-3" style={{ gap: '1.25rem' }}>
          {/* Main Action: Call Next */}
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '14px', textAlign: 'center', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
              ADVANCE QUEUE
            </div>
            <button
              onClick={handleCallNext}
              className="btn btn-primary btn-block btn-lg"
              style={{ fontSize: '1.15rem', padding: '1rem', fontWeight: 800, background: '#0284c7' }}
            >
              <i className="fas fa-forward-step"></i> CALL NEXT PATIENT (#{currentHospital.currentToken + 1})
            </button>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.6rem' }}>
              Sends SMS alert & advances turnstile display
            </div>
          </div>

          {/* Crowd Level Controller */}
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '14px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>
              UPDATE CROWD LEVEL
            </div>
            <div className="grid-3" style={{ gap: '0.4rem' }}>
              {['Low', 'Medium', 'High'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleCrowdChange(lvl)}
                  style={{
                    padding: '0.6rem 0.4rem',
                    borderRadius: '8px',
                    border: currentHospital.crowdLevel === lvl ? '2px solid #38bdf8' : '1px solid #475569',
                    background: currentHospital.crowdLevel === lvl ? '#0284c7' : '#0f172a',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.6rem' }}>
              Status shown on public search results
            </div>
          </div>

          {/* Wait Time Stepper */}
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '14px', border: '1px solid #334155', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
              AVERAGE OPD WAIT
            </div>
            <div className="flex" style={{ justifyContent: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => handleWaitAdjust(-2)}
                className="btn btn-outline"
                style={{ color: 'white', borderColor: '#475569', width: '40px', height: '40px', padding: 0 }}
              >
                -2m
              </button>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', minWidth: '70px' }}>
                {currentHospital.waitingTime}m
              </div>
              <button
                onClick={() => handleWaitAdjust(2)}
                className="btn btn-outline"
                style={{ color: 'white', borderColor: '#475569', width: '40px', height: '40px', padding: 0 }}
              >
                +2m
              </button>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.6rem' }}>
              Fine-tune predicted delay for incoming patients
            </div>
          </div>
        </div>
      </div>

      {/* Patient Queue Table for this hospital */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
          Today's Patient Queue Manifest ({hospitalAppointments.length} Tokens Registered)
        </h3>

        {hospitalAppointments.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Token #</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Patient Name</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Department</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Doctor & Room</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Time Slot</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {hospitalAppointments.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {app.token}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div className="font-semibold">{app.patientName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.patientPhone}</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>{app.department}</td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div>{app.doctor}</div>
                      <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>{app.room}</span>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>{app.timeSlot.split('(')[0]}</td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <span className={`badge ${app.status === 'In Queue' ? 'badge-blue' : 'badge-green'}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No tokens booked yet for this hospital today.
          </div>
        )}
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="modal-overlay" onClick={() => setShowEmergencyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ color: '#dc2626', margin: 0 }}>
                <i className="fas fa-truck-medical"></i> Emergency Priority Token Override
              </h3>
              <button onClick={() => setShowEmergencyModal(false)} className="btn btn-sm btn-outline">
                <i className="fas fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleEmergencyInsert}>
              <div className="form-group">
                <label className="form-label">Critical Patient Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={emergencyPatient}
                  onChange={(e) => setEmergencyPatient(e.target.value)}
                  placeholder="e.g. Critical Trauma Patient"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Destination Ward / Cabin</label>
                <select
                  className="form-select"
                  value={emergencyDept}
                  onChange={(e) => setEmergencyDept(e.target.value)}
                >
                  <option value="Emergency & Trauma Care">Emergency & Trauma Care (Casualty)</option>
                  <option value="Cardiology / Emergency">Cardiology (Cath Lab)</option>
                  <option value="Neurology / Emergency">Neurology (Stroke Unit)</option>
                  <option value="Pediatrics ICU">Pediatric Emergency</option>
                </select>
              </div>

              <button type="submit" className="btn btn-danger btn-block btn-lg" style={{ marginTop: '1rem' }}>
                <i className="fas fa-bolt"></i> Issue Emergency Direct Pass
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
