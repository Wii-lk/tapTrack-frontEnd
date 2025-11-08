import React from 'react';

export const SimpleButton = ({ onClick, children, className = '', variant = 'primary', ...props }) => {
  const baseStyle = 'px-4 py-2 rounded-lg font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 w-full sm:w-auto';
  const variants = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-orange-500',
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
