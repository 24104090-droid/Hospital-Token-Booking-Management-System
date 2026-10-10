import React from 'react';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  className = '',
  error,
  required = false,
  ...props
}) => {
  return (
    <div className="form-group mb-3">
      {label && (
        <label className="form-label block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={`form-select w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${
          error ? 'border-red-500 focus:ring-red-400' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </div>
  );
};

export default Select;
