import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockHospitals } from '../data/mockData';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const [email, setEmail] = useState('admin.tvmch@mediqueue.gov.in');
  const [password, setPassword] = useState('admin123');
  const [selectedHospital, setSelectedHospital] = useState(mockHospitals[0].name);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAdmin({
      name: 'Dr. S. Sundararajan (Chief Medical Officer)',
      email,
      hospital: selectedHospital
    });
    navigate('/admin/dashboard');
  };

  return (
    <div className="container" style={{ maxWidth: '480px', marginTop: '3.5rem', marginBottom: '4rem' }}>
      <div className="card" style={{ padding: '2.5rem 2rem', border: '1.5px solid #bae6fd' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: '#0f172a',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              margin: '0 auto 0.75rem'
            }}
          >
            <i className="fas fa-shield-halved"></i>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a' }}>Hospital OPD Administration</h2>
          <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: '0.25rem' }}>
            Authorized portal for doctors, nurses & counter superintendents
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Healthcare Facility</label>
            <select
              className="form-select"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
            >
              {mockHospitals.map((h) => (
                <option key={h.id} value={h.name}>
                  {h.name} ({h.type})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Admin Email / Officer ID</label>
            <input
              type="email"
              required
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@mediqueue.gov.in"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Security PIN / Password</label>
            <input
              type="password"
              required
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '1.5rem', background: '#0f172a', borderColor: '#0f172a' }}>
            <i className="fas fa-lock-open"></i> Login to OPD Control Center
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
          <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
            <i className="fas fa-arrow-left"></i> Switch to Patient Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
