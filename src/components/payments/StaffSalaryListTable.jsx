import React from 'react';
import { Loader2, Calculator, Hash } from 'lucide-react';
import Button from '../common/Button'; 

/**
 * Renders the table of staff members for salary management.
 */
const StaffSalaryListTable = ({ staffList = [], loading, onGenerateClick }) => {
  // 🟢 UPDATED Header: 'Employee ID' instead of 'Staff ID'
  const headers = ['Employee ID', 'Name', 'Role', 'Basic Salary', 'Actions'];

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount);
  };

  const safeStaffList = Array.isArray(staffList) ? staffList : [];

  // Mobile Staff Card
  const StaffCard = ({ staff }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-3">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h4 className="text-sm font-semibold text-gray-900">{staff.first_name} {staff.last_name}</h4>
                <div className="text-xs text-gray-500 font-mono mt-0.5">
                    {staff.employee_no || staff.unique_no || staff.user_id}
                </div>
            </div>
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-100">
                {staff.email || 'N/A'}
            </span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-t border-b border-gray-50 my-2">
             <span className="text-xs text-gray-500">Basic Salary</span>
             <span className="text-sm font-bold text-gray-800 font-mono">
                {formatCurrency(staff.basic_salary)}
             </span>
        </div>

        <Button 
            variant="outline" 
            size="small"
            className="w-full justify-center hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-colors"
            onClick={() => onGenerateClick(staff.user_id)}
        >
            <Calculator size={14} className="mr-2" />
            Process Salary
        </Button>
    </div>
  );

  return (
    <div>
        {/* Mobile View */}
        <div className="block md:hidden">
            {loading && (
                <div className="text-center py-8">
                    <Loader2 size={24} className="mx-auto animate-spin text-orange-600" />
                    <p className="mt-2 text-sm text-gray-500">Loading staff list...</p>
                </div>
            )}
            {!loading && safeStaffList.length === 0 && (
                <div className="text-center py-8 text-sm text-gray-500">No staff members found.</div>
            )}
            {!loading && safeStaffList.map((staff) => (
                <StaffCard key={staff.user_id} staff={staff} />
            ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map(header => (
                <th 
                  key={header} 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            
            {/* 1. LOADING STATE */}
            {loading && (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 size={24} className="animate-spin text-orange-600" />
                    <p className="text-sm text-gray-500">Loading staff list...</p>
                  </div>
                </td>
              </tr>
            )}

            {/* 2. EMPTY STATE */}
            {!loading && safeStaffList.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-sm text-gray-500">
                  No staff members found.
                </td>
              </tr>
            )}

            {/* 3. DATA ROWS */}
            {!loading && safeStaffList.map((staff) => (
              <tr key={staff.user_id} className="hover:bg-gray-50 transition-colors">
                
                {/* 🟢 UPDATED: Employee ID Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-700 font-mono bg-gray-50 px-2.5 py-1 rounded w-fit border border-gray-200">
                    <Hash size={13} className="mr-1.5 text-gray-400" />
                    {/* Shows Employee No -> Unique No -> User ID (fallback) */}
                    {staff.employee_no || staff.unique_no || staff.user_id}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{staff.first_name} {staff.last_name}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-100">
                    {staff.role || 'Staff'}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 font-mono">
                  {formatCurrency(staff.basic_salary)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => onGenerateClick(staff.user_id)}
                    aria-label={`Generate salary for ${staff.name}`}
                    className="hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                  >
                    <Calculator size={14} className="mr-2" />
                    Process Salary
                  </Button>
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

export default StaffSalaryListTable;