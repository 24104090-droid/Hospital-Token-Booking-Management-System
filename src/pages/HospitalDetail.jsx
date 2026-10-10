import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';

export const HospitalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hospitals, setActiveHospitalForBooking, setSelectedSpecialty } = useQueue();

  const hospital = hospitals.find((h) => h.id === parseInt(id));
  const [activeTab, setActiveTab] = useState('departments'); // departments, doctors, facilities

  if (!hospital) {
    return (
      <div className="container" style={{ marginTop: '3rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 1.5rem' }}>
          <i className="fas fa-triangle-exclamation" style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '1rem' }}></i>
          <h2>Hospital Not Found</h2>
          <p className="text-muted" style={{ margin: '0.75rem 0 1.5rem' }}>
            The requested healthcare facility does not exist or has been relocated.
          </p>
          <Link to="/hospitals" className="btn btn-primary">
            Back to Hospitals List
          </Link>
        </div>
      </div>
    );
  }

  const handleBookDept = (dept) => {
    setSelectedSpecialty(dept);
    setActiveHospitalForBooking(hospital);
    navigate(`/book-token?hospitalId=${hospital.id}&dept=${encodeURIComponent(dept)}`);
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Back breadcrumb */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/hospitals" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
          <i className="fas fa-arrow-left"></i> Back to Hospitals Directory
        </Link>
      </div>

      {/* Hospital Hero Banner */}
      <div className="card card-hero" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="flex" style={{ gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className={`badge ${hospital.type === 'Government' ? 'badge-blue' : 'badge-slate'}`}>
                {hospital.type} Healthcare
              </span>
              {hospital.freeOPD && (
                <span className="badge badge-green">
                  <i className="fas fa-award"></i> Free OPD / CMCHS Scheme
                </span>
              )}
              <span className="badge badge-green">
                <i className="fas fa-door-open"></i> OPD Open Today
              </span>
            </div>

            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>
              {hospital.name}
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              <i className="fas fa-location-dot" style={{ color: '#0284c7' }}></i> {hospital.address}
            </p>

            <div className="flex" style={{ flexWrap: 'wrap', gap: '1rem', fontSize: '0.88rem', color: 'var(--text-main)' }}>
              <span><i className="fas fa-phone" style={{ color: '#0284c7' }}></i> {hospital.phone}</span>
              <span>•</span>
              <span style={{ color: '#dc2626', fontWeight: 600 }}>
                <i className="fas fa-phone-volume"></i> Casualty: {hospital.emergencyPhone}
              </span>
              <span>•</span>
              <span><i className="fas fa-clock" style={{ color: '#0d9488' }}></i> {hospital.opdHours}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <Link
              to={`/book-token?hospitalId=${hospital.id}`}
              onClick={() => setActiveHospitalForBooking(hospital)}
              className="btn btn-primary btn-lg"
              style={{ minWidth: '200px' }}
            >
              <i className="fas fa-ticket"></i> Book OPD Token Now
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Live Queue Box */}
      <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        {/* Left Column: Tabs */}
        <div>
          {/* Tab Navigation */}
          <div className="flex" style={{ borderBottom: '2px solid var(--border-color)', marginBottom: '1.5rem', gap: '1.5rem' }}>
            <button
              onClick={() => setActiveTab('departments')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.75rem 0.5rem',
                fontSize: '1rem',
                fontWeight: 700,
                color: activeTab === 'departments' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === 'departments' ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-stethoscope"></i> Departments ({hospital.departments.length})
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.75rem 0.5rem',
                fontSize: '1rem',
                fontWeight: 700,
                color: activeTab === 'doctors' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === 'doctors' ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-user-doctor"></i> Doctors On Duty ({hospital.doctors.length})
            </button>
            <button
              onClick={() => setActiveTab('facilities')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.75rem 0.5rem',
                fontSize: '1rem',
                fontWeight: 700,
                color: activeTab === 'facilities' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === 'facilities' ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-hospital"></i> Infrastructure & Labs
            </button>
          </div>

          {/* Departments Tab */}
          {activeTab === 'departments' && (
            <div>
              <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                Select a department below to reserve an instant token in that specific OPD wing:
              </p>
              <div className="grid-2" style={{ gap: '1rem' }}>
                {hospital.departments.map((dept) => (
                  <div
                    key={dept}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '1rem', display: 'block', color: 'var(--text-main)' }}>
                        {dept}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: '#16a34a' }}>
                        <i className="fas fa-circle-check"></i> Tokens Available
                      </span>
                    </div>
                    <button
                      onClick={() => handleBookDept(dept)}
                      className="btn btn-sm btn-primary"
                    >
                      Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <div className="grid-1" style={{ gap: '1rem' }}>
              {hospital.doctors.map((doc) => (
                <div key={doc.name} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
                  <div className="flex" style={{ gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                      <i className="fas fa-user-doctor"></i>
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>{doc.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {doc.dept} • {doc.experience}
                      </p>
                      <span className="badge badge-slate" style={{ marginTop: '0.35rem' }}>
                        Room: {doc.room}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleBookDept(doc.dept)} className="btn btn-sm btn-primary">
                    Book OPD
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Facilities Tab */}
          {activeTab === 'facilities' && (
            <div className="card">
              <h4 style={{ marginBottom: '1rem' }}>Hospital Infrastructure</h4>
              <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div className="pill" style={{ padding: '0.6rem 1rem' }}>
                  <i className="fas fa-bed" style={{ color: '#0284c7' }}></i> Total Beds: <strong>{hospital.bedCount}</strong>
                </div>
                <div className="pill" style={{ padding: '0.6rem 1rem' }}>
                  <i className="fas fa-heart-pulse" style={{ color: '#ef4444' }}></i> ICU Beds Available: <strong>{hospital.icuAvailable}</strong>
                </div>
              </div>

              <h4 style={{ marginBottom: '0.75rem' }}>Available Facilities & Amenities:</h4>
              <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                {hospital.facilities.map((fac) => (
                  <span key={fac} className="pill" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534', padding: '0.5rem 1rem' }}>
                    <i className="fas fa-circle-check" style={{ color: '#16a34a' }}></i> {fac}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live OPD Queue Monitor Card */}
        <div>
          <div className="card" style={{ border: '2px solid #bae6fd', background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)', position: 'sticky', top: '90px' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', margin: 0 }}>
                Live OPD Queue Telemetry
              </h3>
              <div className="pulse-dot"></div>
            </div>

            <div style={{ textAlign: 'center', padding: '1.25rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                CURRENT TOKEN SERVING
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1, margin: '0.4rem 0' }}>
                #{hospital.currentToken}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>
                <i className="fas fa-user-doctor"></i> Active Consultation In-Room
              </div>
            </div>

            <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '1.25rem', textAlign: 'center' }}>
              <div style={{ background: 'white', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ESTIMATED WAIT</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>~{hospital.waitingTime} mins</div>
              </div>
              <div style={{ background: 'white', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOKENS REMAINING</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--secondary)' }}>{hospital.availableTokens}</div>
              </div>
            </div>

            <Link
              to={`/book-token?hospitalId=${hospital.id}`}
              onClick={() => setActiveHospitalForBooking(hospital)}
              className="btn btn-primary btn-block"
            >
              <i className="fas fa-ticket"></i> Reserve OPD Token
            </Link>

            <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <i className="fas fa-shield-halved"></i> Verified with District Health Information Network
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
