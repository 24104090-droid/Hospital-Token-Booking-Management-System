import React from 'react';
import AppLayout from '../components/common/AppLayout';
import TokenConfirmation from '../components/booking/TokenConfirmation';

const ConfirmationPage = () => {
  return (
    <AppLayout>
      <div className="w-full text-left">
        <TokenConfirmation />
      </div>
    </AppLayout>
  );
};

export default ConfirmationPage;
