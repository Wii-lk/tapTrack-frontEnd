import React from 'react';
import Card from '../common/Card';

const AttendanceCard = ({ title, present, total, type = 'student' }) => {
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
  const absent = total - present;

  return (
    <Card title={title}>
      <div className="space-y-4">
        {/* Percentage Circle */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#f3f4f6"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#800000"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">{percentage}%</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Present</p>
            <p className="text-2xl font-bold text-green-600">{present}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Absent</p>
            <p className="text-2xl font-bold text-red-600">{absent}</p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-gray-600 text-center">
            Total {type === 'student' ? 'Students' : 'Teachers'}: <span className="font-semibold">{total}</span>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceCard;