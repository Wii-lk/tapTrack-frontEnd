import React from 'react';
import { Loader2 } from 'lucide-react';

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

/**
 * Table for "Who's Inside?" view
 */
const PresenceTable = ({ users, loading }) => {
  const headers = ['Name', 'Role', 'Check-In Time', 'Duration'];

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
                  <p className="mt-2 text-sm text-gray-500">Loading...</p>
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-sm text-gray-500">
                  No one is currently inside.
                </td>
              </tr>
            )}
            {!loading && users.map((user) => (
               <tr key={user.user_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(user.check_in_time)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PresenceTable;