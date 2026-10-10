import React from 'react';
import AppLayout from '../components/common/AppLayout';
import HospitalCompare from '../components/hospitals/HospitalCompare';

const ComparePage = () => {
  return (
    <AppLayout>
      <div className="w-full text-left">
        <HospitalCompare />
      </div>
    </AppLayout>
  );
};

export default ComparePage;
