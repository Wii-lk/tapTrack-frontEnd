import React from 'react';

export const SimpleCard = ({ title, value, icon, bgColor = 'bg-blue-100', textColor = 'text-blue-600' }) => (
  <div className="bg-white p-5 rounded-lg shadow-md flex items-center space-x-4">
    <div className={`p-3 rounded-full ${bgColor} ${textColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);