import React from 'react';
import { Loader2, Hash, User } from 'lucide-react'; 

const formatTime = (timeString) => {
  if (!timeString) return '--';
  try {
    const [hours, minutes] = timeString.split(':');
    let h = parseInt(hours); 
    const m = parseInt(minutes); 
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12; 
    h = h ? h : 12;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  } catch (e) { return timeString; }
};

const getStatusChip = (status) => {
  switch (status) {
    case 'present': return 'bg-green-100 text-green-800';
    case 'absent': return 'bg-red-100 text-red-800';
    case 'late': return 'bg-yellow-100 text-yellow-800';
    case 'half_day': return 'bg-purple-100 text-purple-800';
    case 'leave': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const HistoryTable = ({ records, loading, onEdit, onDelete }) => {
  const headers = ['User', 'Employee ID', 'Date', 'Status', 'Check-In', 'Check-Out', 'Notes'];

  // Mobile History Card
  const HistoryCard = ({ record }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-3">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    {record.user_name}
                </h4>
                <div className="text-xs text-gray-500 font-mono mt-0.5 ml-5">
                    {record.employee_no || record.unique_no || record.user_id || 'N/A'}
                </div>
            </div>
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusChip(record.status)}`}>
                {record.status}
            </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 border-t border-gray-50 pt-2">
            <div>
                <span className="block text-gray-400">Date</span>
                {record.date}
            </div>
            <div>
                <span className="block text-gray-400">Check-In</span>
                {formatTime(record.check_in_time)}
            </div>
            <div>
                <span className="block text-gray-400">Check-Out</span>
                {formatTime(record.check_out_time)}
            </div>
             <div className="col-span-2">
                <span className="block text-gray-400">Notes</span>
                {record.notes || '--'}
            </div>
        </div>
    </div>
  );

  return (
    <div>
        {/* Mobile View */}
        <div className="block md:hidden">
            {loading && (
                <div className="text-center py-8">
                    <Loader2 size={24} className="mx-auto animate-spin text-orange-600" />
                    <p className="mt-2 text-sm text-gray-500">Loading history...</p>
                </div>
            )}
            {!loading && records.length === 0 && (
                <div className="text-center py-8 text-sm text-gray-500">No history found.</div>
            )}
            {!loading && records.map((record) => (
                <HistoryCard key={record.id} record={record} />
            ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            
            {loading && (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center">
                  <Loader2 size={24} className="mx-auto animate-spin text-orange-600" />
                  <p className="mt-2 text-sm text-gray-500">Loading history...</p>
                </td>
              </tr>
            )}

            {!loading && records.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-sm text-gray-500">
                  No history found for these filters.
                </td>
              </tr>
            )}

            {!loading && records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                
                {/* 1. User Name */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <User size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{record.user_name}</span>
                  </div>
                </td>

                {/* 2. 🟢 NEW: Employee ID Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded w-fit border border-gray-100">
                    <Hash size={13} className="mr-1 text-gray-400" />
                    {record.employee_no || record.unique_no || record.user_id || 'N/A'}
                  </div>
                </td>

                {/* 3. Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.date}
                </td>

                {/* 4. Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusChip(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                
                {/* 5. Check-In */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTime(record.check_in_time)}
                </td>
                
                {/* 6. Check-Out */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTime(record.check_out_time)}
                </td>

                {/* 7. Notes */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                  {record.notes || '--'}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default HistoryTable;