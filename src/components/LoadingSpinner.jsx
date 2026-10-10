import React from 'react';

const LoadingSpinner = ({ message = 'Loading live OPD token data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="spinner mb-4 border-4 border-slate-200 border-t-sky-600 rounded-full w-10 h-10 animate-spin"></div>
      <p className="text-slate-600 font-medium text-sm">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
