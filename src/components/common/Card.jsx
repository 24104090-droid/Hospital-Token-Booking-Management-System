import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  border = true,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`card bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl ${
        border ? 'border border-slate-200/80 dark:border-slate-800' : ''
      } shadow-xs ${
        hover ? 'card-hover transition-all duration-200 hover:shadow-md' : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
