import React from 'react';
import AppLayout from '../components/common/AppLayout';
import PatientDashboard from '../components/dashboard/PatientDashboard';

const DashboardPage = () => {
  return (
    <AppLayout>
      <PatientDashboard />
    </AppLayout>
  );
};

export default DashboardPage;
