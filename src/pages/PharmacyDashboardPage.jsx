import React from 'react';
import AppLayout from '../components/common/AppLayout';
import PharmacyDispenseDashboard from '../components/pharmacy/PharmacyDispenseDashboard';

const PharmacyDashboardPage = () => {
  return (
    <AppLayout>
      <div className="w-full text-left">
        <PharmacyDispenseDashboard />
      </div>
    </AppLayout>
  );
};

export default PharmacyDashboardPage;
