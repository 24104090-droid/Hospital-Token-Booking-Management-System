import React from 'react';
import AppLayout from '../components/common/AppLayout';
import HospitalStaffDashboard from '../components/dashboard/HospitalStaffDashboard';

const HospitalStaffPage = () => {
  return (
    <AppLayout>
      <div className="w-full text-left">
        <HospitalStaffDashboard />
      </div>
    </AppLayout>
  );
};

export default HospitalStaffPage;
