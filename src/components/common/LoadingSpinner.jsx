import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading hospital live data...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div 
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-sky-200 border-t-sky-600 animate-spin`}
        style={{ borderTopColor: '#0284c7' }}
      ></div>
      {text && <p className="text-xs font-semibold text-slate-500 animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
