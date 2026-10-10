import React from 'react';
import AppLayout from '../components/common/AppLayout';
import HospitalDetails from '../components/hospitals/HospitalDetails';

const HospitalDetailsPage = () => {
  return (
    <AppLayout>
      <div className="w-full text-left">
        <HospitalDetails />
      </div>
    </AppLayout>
  );
};

export default HospitalDetailsPage;
