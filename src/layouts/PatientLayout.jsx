import React, { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LiveQueueTicker from '../components/LiveQueueTicker';
import { AuthContext } from '../context/AuthContext';
import { DEFAULT_LOCATION } from '../utils/constants';

const PatientLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <LiveQueueTicker />
      <Navbar location={DEFAULT_LOCATION} onLogout={handleLogout} />
      <main className="main-content flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PatientLayout;
