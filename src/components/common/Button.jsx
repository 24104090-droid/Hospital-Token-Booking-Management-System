import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  icon: Icon = null,
  fullWidth = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border';

  const variants = {
    primary: 'bg-sky-600 hover:bg-sky-700 text-white border-transparent shadow-sm hover:shadow active:scale-[0.99]',
    secondary: 'bg-slate-800 hover:bg-slate-900 text-white border-transparent shadow-sm',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white border-transparent shadow-sm',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-sm',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 border-transparent'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5 font-bold'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={{
        borderRadius: size === 'sm' ? '8px' : '12px',
        padding: size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '10px 18px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;
