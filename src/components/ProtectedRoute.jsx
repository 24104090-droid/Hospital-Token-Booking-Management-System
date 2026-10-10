import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { patient, admin } = useContext(AuthContext);

  if (adminOnly) {
    return admin ? children : <Navigate to="/admin/login" replace />;
  }

  return patient ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
