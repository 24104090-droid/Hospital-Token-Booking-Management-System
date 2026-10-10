import React from 'react';
import AppLayout from '../components/common/AppLayout';
import ApiExplorer from '../components/api/ApiExplorer';

const ApiPage = () => {
  return (
    <AppLayout>
      <div className="w-full text-left">
        <ApiExplorer />
      </div>
    </AppLayout>
  );
};

export default ApiPage;
