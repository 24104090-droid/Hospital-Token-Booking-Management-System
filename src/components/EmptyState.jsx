import React from 'react';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title = 'No Records Found',
  message = 'We could not find any matching results for your request.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="card text-center p-8 max-w-lg mx-auto my-6 border border-dashed border-slate-300 rounded-2xl bg-white">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-2xl">
        {Icon ? <Icon className="w-8 h-8" /> : '🏥'}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
