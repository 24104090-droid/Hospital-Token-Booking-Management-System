import React from 'react';
import Header from '../components/common/Header';
import SpecialtyResult from '../components/booking/SpecialtyResult';

const SpecialtyResultPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pt-16">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <SpecialtyResult />
      </main>
    </div>
  );
};

export default SpecialtyResultPage;
