import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { loginPatient } = useAuth();

  const [email, setEmail] = useState('ramesh.patient@gmail.com');
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState('+91 98765 43210');

  const handleSubmit = (e) => {
    e.preventDefault();
    loginPatient({
      name: 'Ramesh Kumar',
      email,
      phone,
      age: 32,
      gender: 'Male',
      bloodGroup: 'B+'
    });
    navigate('/dashboard');
  };

  const handleDemoFill = () => {
    setEmail('ramesh.patient@gmail.com');
    setPassword('demoPass2026');
    setPhone('+91 98765 43210');
  };

  return (
    <div className="container" style={{ maxWidth: '460px', marginTop: '3.5rem', marginBottom: '4rem' }}>
      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            className="logo-badge"
            style={{ width: '48px', height: '48px', fontSize: '1.5rem', margin: '0 auto 0.75rem' }}
          >
            <i className="fas fa-heart-pulse"></i>
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)' }}>Patient Sign In</h2>
          <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: '0.25rem' }}>
            Access live OPD tokens, instant queue tracking & hospital history
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Phone Number</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@gmail.com or 98765..."
                style={{ paddingLeft: '2.2rem' }}
              />
              <i
                className="fas fa-envelope"
                style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
              ></i>
            </div>
          </div>

          <div className="form-group">
            <div className="flex-between">
              <label className="form-label">Password / OTP</label>
              <span style={{ fontSize: '0.78rem', color: 'var(--primary)', cursor: 'pointer' }}>Forgot?</span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: '2.2rem' }}
              />
              <i
                className="fas fa-lock"
                style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
              ></i>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '1.5rem' }}>
            <i className="fas fa-right-to-bracket"></i> Sign In to MediQueue
          </button>

          <button
            type="button"
            onClick={handleDemoFill}
            className="btn btn-outline btn-block btn-sm"
            style={{ marginTop: '0.75rem' }}
          >
            ⚡ Quick Demo Patient Credentials
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', fontSize: '0.88rem' }}>
          <p className="text-muted">
            New patient? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Register new account</Link>
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
            Are you a hospital officer? <Link to="/admin/login" style={{ color: 'var(--text-muted)' }}>Hospital Admin Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
