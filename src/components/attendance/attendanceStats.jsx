import React from 'react';
import { Users, UserCheck, UserX, Clock, ClipboardMinus, UserMinus } from 'lucide-react';

/**
 * AttendanceStats Component
 * (Updated for new API 'summary' object)
 * Displays the 6 summary cards with built-in Card component
 */

// Built-in StatCard component to ensure proper display
const StatCard = ({ title, value, icon, bgColor, textColor }) => {
  // console.log('StatCard rendering:', { title, value }); // Debug log
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <div className={textColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

const AttendanceStats = ({ stats, userType }) => {
  // Add default values and proper null checking
  const safeStats = {
    total_users: stats?.total_users ?? 0,
    present: stats?.present ?? 0,
    late: stats?.late ?? 0,
    absent: stats?.absent ?? 0,
    half_day: stats?.half_day ?? 0,
    leave: stats?.leave ?? 0
  };

  const userTitle = userType === 'student' ? 'Students' : 'Staff';
  
  // Debug log to check what stats are being received
  console.log('AttendanceStats - Received stats:', stats);
  console.log('AttendanceStats - Safe stats:', safeStats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard
        title={`Total ${userTitle}`}
        value={safeStats.total_users}
        icon={<Users size={24} />}
        bgColor="bg-blue-100"
        textColor="text-blue-600"
      />
      <StatCard
        title="Present"
        value={safeStats.present}
        icon={<UserCheck size={24} />}
        bgColor="bg-green-100"
        textColor="text-green-600"
      />
      <StatCard
        title="Late Arrivals"
        value={safeStats.late}
        icon={<Clock size={24} />}
        bgColor="bg-yellow-100"
        textColor="text-yellow-600"
      />
      <StatCard
        title="Absent"
        value={safeStats.absent}
        icon={<UserX size={24} />}
        bgColor="bg-red-100"
        textColor="text-red-600"
      />
      <StatCard
        title="Half Day"
        value={safeStats.half_day}
        icon={<ClipboardMinus size={24} />}
        bgColor="bg-purple-100"
        textColor="text-purple-600"
      />
      <StatCard
        title="On Leave"
        value={safeStats.leave}
        icon={<UserMinus size={24} />}
        bgColor="bg-gray-100"
        textColor="text-gray-600"
      />
    </div>
  );
};

export default AttendanceStats;