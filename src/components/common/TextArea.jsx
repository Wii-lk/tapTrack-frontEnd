import React from 'react';

const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  rows = 3,
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
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`
          block w-full rounded-md border-gray-300 shadow-sm
          focus:border-blue-500 focus:ring-blue-500
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
          py-2 px-3 border
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default TextArea;