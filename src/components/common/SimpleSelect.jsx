import React from 'react';

export const SimpleSelect = ({ label, name, value, onChange, children, className = '' }) => (
  <div className={`w-full ${className}`}>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      {children}
    </select>
  </div>
);
