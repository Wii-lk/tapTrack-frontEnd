import React from 'react';
import { Calendar, CheckSquare, Square, Save, Loader2 } from 'lucide-react';

const LeaveTable = ({ 
  staffList, 
  loading, 
  selectedDate, 
  onDateChange, 
  selectedStaff, 
  onSelectionChange,
  onSubmit,
  submitLoading,
  leaveTypes = [], 
  selectedLeaveType, 
  onLeaveTypeChange 
}) => {

  const isAllSelected = staffList.length > 0 && selectedStaff.size === staffList.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-200px)]">
      
      {/* --- TOP BAR: FILTERS & ACTIONS --- */}
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-end md:items-center bg-gray-50/50 rounded-t-xl">
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Date Picker */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm w-full sm:w-48"
              />
            </div>
          </div>

          {/* Leave Type Dropdown */}
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason / Type</label>
            <select
              value={selectedLeaveType}
              onChange={(e) => onLeaveTypeChange(e.target.value)}
              className="px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm w-full sm:w-64 appearance-none"
            >
              <option value="" className="text-gray-500">-- Select Reason --</option>
              {leaveTypes.map((type) => (
                // 🟢 FIX: Value is ID, but we display description/name
                <option key={type.id} value={type.id} className="text-gray-900">
                  {type.description || type.name || `Type #${type.id}`} 
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={submitLoading || selectedStaff.size === 0}
          className="flex items-center gap-2 bg-[#800000] text-white px-6 py-2.5 rounded-lg hover:bg-[#600000] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
        >
          {submitLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>Mark Selected ({selectedStaff.size})</span>
        </button>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10 text-xs uppercase text-gray-500 font-semibold tracking-wider">
            <tr>
              <th className="p-4 border-b border-gray-200 w-16 text-center">
                <button 
                  onClick={() => onSelectionChange('batch', !isAllSelected, staffList.map(s => s.user_id))}
                  className="hover:text-blue-600 transition-colors"
                >
                  {isAllSelected ? <CheckSquare size={20} className="text-blue-600" /> : <Square size={20} />}
                </button>
              </th>
              <th className="p-4 border-b border-gray-200">Staff Member</th>
              <th className="p-4 border-b border-gray-200">Role</th>
              <th className="p-4 border-b border-gray-200">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-[#800000]" size={24} />
                    <span>Loading staff list...</span>
                  </div>
                </td>
              </tr>
            ) : staffList.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">No staff found.</td>
              </tr>
            ) : (
              staffList.map((staff) => {
                const isSelected = selectedStaff.has(staff.user_id);
                return (
                  <tr 
                    key={staff.user_id} 
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/60' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onSelectionChange(staff.user_id, !isSelected)}
                  >
                    <td className="p-4 text-center">
                      <div className={`transition-colors ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                        {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                          {(staff.name || 'U').charAt(0)}
                        </div>
                        <div>
                          <p className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                            {staff.name}
                          </p>
                          <p className="text-xs text-gray-500">{staff.email || 'No Email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium border border-gray-200">
                        {staff.role || staff.position || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isSelected ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isSelected ? 'Selected' : 'Available'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveTable;