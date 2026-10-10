import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = null,
  helperText = null,
  required = false,
  disabled = false,
  icon: Icon = null,
  rightElement = null,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      {label && (
        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center w-5 h-5 z-10">
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 py-2.5 ${
            Icon ? 'pl-11' : 'pl-3.5'
          } ${
            rightElement ? 'pr-11' : 'pr-3.5'
          } ${
            error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
          }`}
          style={{
            paddingLeft: Icon ? '2.75rem' : '0.875rem',
            paddingRight: rightElement ? '2.75rem' : '0.875rem'
          }}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center z-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            {rightElement}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-rose-500 font-semibold mt-0.5">{error}</span>}
      {helperText && !error && <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{helperText}</span>}
    </div>
  );
};

export default Input;
