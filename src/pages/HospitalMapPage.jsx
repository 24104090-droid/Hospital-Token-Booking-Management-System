import React from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/common/AppLayout';
import HospitalIndoorMap from '../components/hospital/HospitalIndoorMap';

const HospitalMapPage = () => {
  const { id } = useParams();

  return (
    <AppLayout>
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <HospitalIndoorMap hospitalId={id || 'h1'} />
      </div>
    </AppLayout>
  );
};

export default HospitalMapPage;
