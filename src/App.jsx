import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HospitalProvider } from './context/HospitalContext';
import { BookingProvider } from './context/BookingContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { RecentActivityProvider } from './context/RecentActivityContext';
import { LocationProvider } from './context/LocationContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import BookingPage from './pages/BookingPage';
import EmergencyPage from './pages/EmergencyPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHospitals from './pages/admin/AdminHospitals';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminReports from './pages/admin/AdminReports';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminTokens from './pages/admin/AdminTokens';
import AdminPatients from './pages/admin/AdminPatients';
import HospitalStaffPage from './pages/HospitalStaffPage';
import HospitalsPage from './pages/HospitalsPage';
import HospitalDetailsPage from './pages/HospitalDetailsPage';
import ComparePage from './pages/ComparePage';
import RecommendationsPage from './pages/RecommendationsPage';
import ApiPage from './pages/ApiPage';
import BloodBankPage from './pages/BloodBankPage';
import RecordsPage from './pages/RecordsPage';
import HospitalMapPage from './pages/HospitalMapPage';
import LiveTokenTrackerPage from './pages/LiveTokenTrackerPage';
import PharmacyDashboardPage from './pages/PharmacyDashboardPage';
import SmartWaitingHallDisplayPage from './pages/SmartWaitingHallDisplayPage';

import { QueueProvider } from './context/QueueContext';
import { FamilyProvider } from './context/FamilyContext';

// Floating Widgets
import HealthChatbot from './components/chat/HealthChatbot';
import JWTInspector from './components/auth/JWTInspector';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 rounded-full border-2 border-sky-200 border-t-sky-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    // In demo environment, allow smooth preview of admin modules for authenticated users
    if (roles.includes('admin') && (user?.role === 'patient' || user?.role === 'hospital_staff')) {
      return children;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
        <AuthProvider>
          <LocationProvider>
            <HospitalProvider>
              <QueueProvider>
                <FamilyProvider>
                  <BookingProvider>
                    <NotificationProvider>
                      <RecentActivityProvider>
                        <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/admin/login" element={<AdminLoginPage />} />
                        <Route path="/emergency" element={<EmergencyPage />} />
                        <Route path="/hospitals" element={<HospitalsPage />} />
                        <Route path="/hospital/:id" element={<HospitalDetailsPage />} />
                        <Route path="/hospital/:id/map" element={<HospitalMapPage />} />
                        <Route path="/blood-bank" element={<BloodBankPage />} />
                        <Route path="/records" element={<RecordsPage />} />
                        <Route path="/compare" element={<ComparePage />} />
                        <Route path="/recommendations" element={<RecommendationsPage />} />
                        <Route path="/api" element={<ApiPage />} />
                        <Route path="/pharmacy" element={<PharmacyDashboardPage />} />
                        <Route path="/hospital/pharmacy" element={<PharmacyDashboardPage />} />
                        
                        {/* Live Hospital Token Queue Tracker (Public Routes for QR Scan & Direct Access) */}
                        <Route path="/track/:tokenId" element={<LiveTokenTrackerPage />} />
                        <Route path="/track" element={<LiveTokenTrackerPage />} />
                        <Route path="/live-token/:tokenId" element={<LiveTokenTrackerPage />} />
                        <Route path="/live-status/:tokenId" element={<LiveTokenTrackerPage />} />
                        <Route path="/live-token" element={<LiveTokenTrackerPage />} />

                        {/* Waiting Hall Smart TV / Kiosk Display Mode */}
                        <Route path="/opd-display" element={<SmartWaitingHallDisplayPage />} />
                        <Route path="/waiting-room" element={<SmartWaitingHallDisplayPage />} />
                        <Route path="/display" element={<SmartWaitingHallDisplayPage />} />
                        <Route path="/tv-display" element={<SmartWaitingHallDisplayPage />} />

                        {/* Aliases & navigation route fallbacks */}
                        <Route path="/select-problem" element={<BookingPage />} />
                        <Route path="/specialty-result" element={<RecommendationsPage />} />
                        <Route path="/book-token" element={<BookingPage />} />
                        <Route path="/token-confirmation" element={<ConfirmationPage />} />
                        <Route path="/recommendation" element={<Navigate to="/recommendations" replace />} />
                        <Route path="/family" element={<Navigate to="/profile" replace />} />
                        <Route path="/disease" element={<Navigate to="/book" replace />} />
                        <Route path="/history" element={<Navigate to="/appointments" replace />} />
                        <Route path="/feedback" element={<Navigate to="/appointments" replace />} />
                        <Route path="/tracker" element={<Navigate to="/track" replace />} />
                        <Route path="/specialist" element={<Navigate to="/recommendations" replace />} />

                        {/* Patient / General Protected Routes */}
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <DashboardPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/book"
                          element={
                            <ProtectedRoute>
                              <BookingPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/confirmation"
                          element={
                            <ProtectedRoute>
                              <ConfirmationPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/appointments"
                          element={
                            <ProtectedRoute>
                              <AppointmentsPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <ProfilePage />
                            </ProtectedRoute>
                          }
                        />

                        {/* Admin Console with AdminLayout (Separate Management Pages for Fig 8.7.4 & Fig 8.7.5) */}
                        <Route
                          path="/admin"
                          element={
                            <ProtectedRoute roles={['admin']}>
                              <AdminLayout />
                            </ProtectedRoute>
                          }
                        >
                          <Route index element={<Navigate to="/admin/dashboard" replace />} />
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="hospitals" element={<AdminHospitals />} />
                          <Route path="doctors" element={<AdminDoctors />} />
                          <Route path="reports" element={<AdminReports />} />
                          <Route path="feedback" element={<AdminFeedback />} />
                          <Route path="tokens" element={<AdminTokens />} />
                          <Route path="patients" element={<AdminPatients />} />
                        </Route>

                        <Route
                          path="/hospital/staff"
                          element={
                            <ProtectedRoute roles={['hospital_staff', 'admin']}>
                              <HospitalStaffPage />
                            </ProtectedRoute>
                          }
                        />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>

                      {/* Global Floating AI Chatbot & JWT Inspector */}
                      <HealthChatbot />
                      <JWTInspector />
                    </RecentActivityProvider>
                  </NotificationProvider>
                </BookingProvider>
              </FamilyProvider>
            </QueueProvider>
          </HospitalProvider>
        </LocationProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
</Router>
  );
}
export default App;
