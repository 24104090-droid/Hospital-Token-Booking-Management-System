import React from 'react';
import AppLayout from '../components/common/AppLayout';
import EmergencyBooking from '../components/booking/EmergencyBooking';

const EmergencyPage = () => {
  return (
    <AppLayout>
      <div className="w-full text-left">
        <EmergencyBooking />
      </div>
    </AppLayout>
  );
};

export default EmergencyPage;
