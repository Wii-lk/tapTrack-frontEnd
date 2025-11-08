import React from 'react';
import { Loader2, Edit2, Trash2 } from 'lucide-react'; // Import icons

// (formatTime and getStatusChip helpers remain the same)
const formatTime = (timeString) => {
  if (!timeString) return '--';
  try {
    const [hours, minutes] = timeString.split(':');
    let h = parseInt(hours); const m = parseInt(minutes); const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12; h = h ? h : 12;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  } catch (e) { return timeString; }
};

const getStatusChip = (status) => {
  switch (status) {
    case 'present': return 'bg-green-100 text-green-800';
    case 'absent': return 'bg-red-100 text-red-800';
    case 'late': return 'bg-yellow-100 text-yellow-800';
    case 'half_day': return 'bg-purple-100 text-purple-800';
    case 'leave': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Table for "History & Reports" view
 */
// Add onEdit and onDelete as props
const HistoryTable = ({ records, loading, onEdit, onDelete }) => {
  // Add 'Actions' to headers
  const headers = ['User', 'Date', 'Status', 'Check-In', 'Check-Out', 'Notes'];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>{headers.map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}</tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && (
              <tr><td colSpan={headers.length} className="px-6 py-12 text-center"><Loader2 size={24} className="mx-auto animate-spin text-orange-600" /><p className="mt-2 text-sm text-gray-500">Loading history...</p></td></tr>
            )}
            {!loading && records.length === 0 && (
              <tr><td colSpan={headers.length} className="px-6 py-12 text-center text-sm text-gray-500">No history found for these filters.</td></tr>
            )}
            {!loading && records.map((record) => (
               <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.user_name} (ID: {record.user_id})</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusChip(record.status)}`}>{record.status}</span></td>
                
                {/* ✅ FIX: Removed the stray underscore "_" from this line */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(record.check_in_time)}</td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(record.check_out_time)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.notes || '--'}</td>
                {/* Add Actions cell */}
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(record)}
                      className="text-orange-600 hover:text-orange-900"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(record)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;