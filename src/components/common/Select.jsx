import React from 'react';

const Select = ({
  label,
  value,
  onChange,
  children,
  required = false,
  disabled = false,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          block w-full rounded-md border-gray-300 shadow-sm
          focus:border-blue-500 focus:ring-blue-500
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
          py-2 pl-3 pr-10 border
        `}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;