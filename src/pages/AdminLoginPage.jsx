import React from 'react';
import AppLayout from '../components/common/AppLayout';
import AdminLogin from '../components/auth/AdminLogin';

const AdminLoginPage = () => {
  return (
    <AppLayout noSidebar={true}>
      <div className="relative w-full flex-1 flex flex-col items-center justify-center py-8 sm:py-12 px-4 overflow-hidden">
        {/* Ambient decorative background glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <AdminLogin />
      </div>
    </AppLayout>
  );
};

export default AdminLoginPage;
