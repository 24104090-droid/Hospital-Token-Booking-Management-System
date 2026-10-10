import React from 'react';
import AppLayout from '../components/common/AppLayout';
import HospitalRecommendation from '../components/hospitals/HospitalRecommendation';

const RecommendationsPage = () => {
  return (
    <AppLayout>
      <div className="w-full text-left">
        <HospitalRecommendation />
      </div>
    </AppLayout>
  );
};

export default RecommendationsPage;
