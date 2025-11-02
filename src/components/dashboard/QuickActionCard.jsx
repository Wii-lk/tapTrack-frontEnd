import React from 'react';
import { ArrowRight } from 'lucide-react';

const QuickActionCard = ({ title, description, icon: Icon, onClick, color = 'orange' }) => {
  const colorClasses = {
    orange: 'bg-orange-500 hover:bg-orange-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    maroon: 'bg-[#800000] hover:bg-[#800000]-600'
  };

  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color]} text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-left w-full group`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            {Icon && <Icon size={24} className="mr-2" />}
            <h4 className="font-semibold text-lg">{title}</h4>
          </div>
          <p className="text-sm opacity-90">{description}</p>
        </div>
        <ArrowRight
          size={20}
          className="mt-1 transform group-hover:translate-x-1 transition-transform"
        />
      </div>
    </button>
  );
};

export default QuickActionCard;