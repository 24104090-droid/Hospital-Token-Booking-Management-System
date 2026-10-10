import React from 'react';
import AppLayout from '../components/common/AppLayout';
import HealthLocker from '../components/records/HealthLocker';

const RecordsPage = () => {
  return (
    <AppLayout>
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <HealthLocker />
      </div>
    </AppLayout>
  );
};

export default RecordsPage;
