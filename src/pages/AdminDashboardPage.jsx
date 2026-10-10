import React from 'react';
import AppLayout from '../components/common/AppLayout';
import AdminDashboard from '../components/dashboard/AdminDashboard';

const AdminDashboardPage = () => {
  return (
    <AppLayout>
      <div className="w-full text-left">
        <AdminDashboard />
      </div>
    </AppLayout>
  );
};

export default AdminDashboardPage;
