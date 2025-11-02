import React from 'react';
import Card from '../common/Card';

const StatCard = ({ title, value, subtitle, icon: Icon, iconColor, trend }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div className="mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.value}
              </span>
              <span className="text-sm text-gray-500 ml-1">{trend.label}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={`p-3 rounded-full ${iconColor || 'bg-orange-100'}`}
          >
            <Icon size={24} className={iconColor ? 'text-white' : 'text-orange-500'} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;