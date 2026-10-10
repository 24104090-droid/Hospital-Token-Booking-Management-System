import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DISEASE_SPECIALTY_MAP, diseaseList, DEFAULT_LOCATION } from '../data/mockData';
import { useQueue } from '../context/QueueContext';
import { HospitalCard } from '../components/HospitalCard';

export const Dashboard = () => {
  const navigate = useNavigate();
  const {
    hospitals,
    selectedHealthProblem,
    setSelectedHealthProblem,
    selectedSpecialty,
    setSelectedSpecialty
  } = useQueue();

  const [searchFilter, setSearchFilter] = useState('');

  const handleSelectProblem = (problem) => {
    setSelectedHealthProblem(problem);
    if (problem && DISEASE_SPECIALTY_MAP[problem]) {
      setSelectedSpecialty(DISEASE_SPECIALTY_MAP[problem].specialty);
    } else {
      setSelectedSpecialty('');
    }
  };

  const handleFindHospitals = () => {
    if (!selectedHealthProblem) {
      alert('Please select or search your health concern first.');
      return;
    }
    navigate('/hospitals');
  };

  const quickSymptoms = [
    'Fever & Body Ache',
    'Severe Cough & Breathing Issue',
    'Skin Rash & Allergy',
    'Eye Redness & Vision Blur',
    'Ear Pain / Hearing Loss',
    'Chest Pain / Tightness',
    'Bone Fracture / Sprain',
    'Stomach Cramps & Acid Reflux',
    'Child Fever & Pediatric Care',
    'Pregnancy & Antenatal Checkup'
  ];

  const currentTriage = selectedHealthProblem ? DISEASE_SPECIALTY_MAP[selectedHealthProblem] : null;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Hero Interactive Triage Card */}
      <div className="card card-hero" style={{ padding: '2.5rem 2rem', marginBottom: '2.5rem' }}>
        <div style={{ maxWidth: '800px' }}>
          <div className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
            <i className="fas fa-sparkles"></i> AI Triage & OPD Token Matcher
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            What health problem are you facing today?
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
            Select your symptom or health concern below. We will instantly identify the exact medical specialty and guide you to top OPD clinics in <strong>{DEFAULT_LOCATION}</strong> with live queue tokens.
          </p>

          {/* Search & Select Selector */}
          <div className="flex" style={{ gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <div style={{ flex: '2', minWidth: '280px' }}>
              <select
                className="form-select"
                value={selectedHealthProblem}
                onChange={(e) => handleSelectProblem(e.target.value)}
                style={{
                  padding: '0.9rem 1.25rem',
                  fontSize: '1.05rem',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-sm)',
                  borderColor: selectedHealthProblem ? 'var(--primary)' : 'var(--border-color)'
                }}
              >
                <option value="">▼ Choose or search a health problem / symptom...</option>
                {diseaseList.map((disease) => (
                  <option key={disease} value={disease}>
                    {disease}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={handleFindHospitals}
              style={{ padding: '0.9rem 2rem', flexShrink: 0 }}
            >
              <i className="fas fa-magnifying-glass"></i> Find Matching Hospitals
            </button>
          </div>

          {/* Quick Symptoms Chips */}
          <div style={{ marginTop: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.5rem' }}>
              Common Symptoms:
            </span>
            <div className="flex" style={{ flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
              {quickSymptoms.map((sym) => {
                const isSelected = selectedHealthProblem === sym;
                return (
                  <button
                    key={sym}
                    onClick={() => handleSelectProblem(sym)}
                    className="pill"
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? 'var(--primary)' : 'white',
                      color: isSelected ? 'white' : 'var(--text-main)',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                      fontWeight: isSelected ? 700 : 500
                    }}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Symptom Match Result Card */}
        {currentTriage && (
          <div
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'white',
              borderRadius: '16px',
              border: '1.5px solid #bae6fd',
              boxShadow: 'var(--shadow-md)',
              animation: 'modal-appear 0.25s ease'
            }}
          >
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <div className="flex" style={{ gap: '1rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem'
                  }}
                >
                  <i className={`fas ${currentTriage.icon || 'fa-user-doctor'}`}></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>RECOMMENDED SPECIALTY</div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', margin: '0.15rem 0' }}>
                    {currentTriage.specialty}
                  </h3>
                  <div className="flex" style={{ gap: '0.75rem', fontSize: '0.85rem' }}>
                    <span>Target Condition: <strong>{selectedHealthProblem}</strong></span>
                    <span>•</span>
                    <span>
                      Urgency Level:{' '}
                      <span
                        className={`badge ${
                          currentTriage.urgency === 'Emergency'
                            ? 'badge-red'
                            : currentTriage.urgency === 'High'
                            ? 'badge-amber'
                            : 'badge-green'
                        }`}
                      >
                        {currentTriage.urgency}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex" style={{ gap: '0.75rem' }}>
                <button onClick={handleFindHospitals} className="btn btn-primary">
                  <i className="fas fa-hospital"></i> View Recommended Clinics
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Platform Metrics */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
            <i className="fas fa-hospital"></i>
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>6 Hospitals</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Govt & Private Network</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
            <i className="fas fa-ticket"></i>
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>240+ Tokens</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Issued Today</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
            <i className="fas fa-stopwatch"></i>
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>14 Mins</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg OPD Wait Time</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
            <i className="fas fa-heart-pulse"></i>
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>24/7 Live</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Emergency & Trauma</div>
          </div>
        </div>
      </div>

      {/* Featured Hospitals Section */}
      <div style={{ marginBottom: '3rem' }}>
        <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
          <div>
            <h2>Nearby Hospitals in {DEFAULT_LOCATION}</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Real-time available tokens and consultation queue status
            </p>
          </div>
          <Link to="/hospitals" className="btn btn-outline">
            Browse All ({hospitals.length}) <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className="grid-3">
          {hospitals.slice(0, 3).map((h) => (
            <HospitalCard
              key={h.id}
              hospital={h}
              highlightedDepartment={selectedSpecialty}
            />
          ))}
        </div>
      </div>

      {/* How MediQueue Works Banner */}
      <div className="card" style={{ background: '#0f172a', color: 'white', padding: '2.5rem', marginBottom: '2.5rem', borderRadius: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.5rem' }}>
          <span className="badge" style={{ background: '#38bdf8', color: '#0f172a', marginBottom: '0.5rem' }}>
            SEAMLESS EXPERIENCE
          </span>
          <h2 style={{ color: 'white', fontSize: '1.8rem' }}>How Smart OPD Token Booking Works</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Skip long crowded physical hospital queues in 4 simple steps
          </p>
        </div>

        <div className="grid-4" style={{ textAlign: 'center' }}>
          <div>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#1e293b', border: '2px solid #38bdf8', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 1rem' }}>
              1
            </div>
            <h4 style={{ color: 'white', fontSize: '1.05rem', marginBottom: '0.35rem' }}>Select Health Problem</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Pick your symptom to find the matched doctor specialty.</p>
          </div>

          <div>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#1e293b', border: '2px solid #38bdf8', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 1rem' }}>
              2
            </div>
            <h4 style={{ color: 'white', fontSize: '1.05rem', marginBottom: '0.35rem' }}>Compare Live Queues</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Check live wait times, distance, and token crowd levels.</p>
          </div>

          <div>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#1e293b', border: '2px solid #38bdf8', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 1rem' }}>
              3
            </div>
            <h4 style={{ color: 'white', fontSize: '1.05rem', marginBottom: '0.35rem' }}>Instant Digital Token</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Get your confirmed token ticket with QR code for quick check-in.</p>
          </div>

          <div>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#1e293b', border: '2px solid #38bdf8', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 1rem' }}>
              4
            </div>
            <h4 style={{ color: 'white', fontSize: '1.05rem', marginBottom: '0.35rem' }}>Arrive Just In Time</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Track live queue position on your phone and arrive stress-free.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
