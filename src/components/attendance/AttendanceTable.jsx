import React from 'react';
import { Loader2 } from 'lucide-react';
import { MOCK_GRADES } from '../../services/attendanceService'; // Import grades for table

/**
 * AttendanceTable Component
 * (Updated for new API 'attendance' array structure)
 */
const AttendanceTable = ({ records, loading, userType }) => {
  const getStatusChip = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'half_day':
        return 'bg-purple-100 text-purple-800';
       case 'leave':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Helper to format time strings (e.g., "07:50:00" -> "07:50 AM")
  const formatTime = (timeString) => {
    if (!timeString) return '--';
    try {
      const [hours, minutes] = timeString.split(':');
      let h = parseInt(hours);
      const m = parseInt(minutes);
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12; // '0' hour should be '12'
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
    } catch (e) {
      return timeString; // Return original if format is unexpected
    }
  };

  const studentHeaders = ['User ID', 'Name', 'Class', 'Status', 'In Time', 'Out Time'];
  const staffHeaders = ['User ID', 'Name', 'Role', 'Status', 'In Time', 'Out Time'];
  
  const headers = userType === 'student' ? studentHeaders : staffHeaders;

  const renderRow = (record) => {
    const { user, status, check_in_time, check_out_time } = record;

    if (userType === 'student') {
      const grade = MOCK_GRADES.find(g => g.id === user.gradeId);
      return (
        <tr key={record.id} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.unique_no}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade ? grade.name : 'N/A'}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusChip(status)}`}>
              {status.replace('_', ' ')}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(check_in_time)}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(check_out_time)}</td>
        </tr>
      );
    }
    
    // Staff Row
    return (
      <tr key={record.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.unique_no}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusChip(status)}`}>
            {status.replace('_', ' ')}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(check_in_time)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(check_out_time)}</td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map(header => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center">
                  <Loader2 size={24} className="mx-auto animate-spin text-orange-600" />
                  <p className="mt-2 text-sm text-gray-500">Loading records...</p>
                </td>
              </tr>
            )}
            {!loading && records.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-sm text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            )}
            {!loading && records.map(renderRow)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;