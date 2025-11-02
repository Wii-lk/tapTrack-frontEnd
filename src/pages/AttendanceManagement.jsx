import React from 'react';
import Card from '../components/common/Card';

const AttendanceManagement = () => {
  return (
    <div>
      <Card title="Attendance Management" subtitle="Manage student and teacher attendance">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Attendance Management Module</p>
          <p className="text-sm text-gray-500">This page will contain attendance tracking functionality</p>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceManagement;