import React from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

/**
 * Renders the table of staff members for the salary list page.
 */
const StaffSalaryTable = ({ staffList, loading }) => {
  const navigate = useNavigate();
  const headers = ['Staff Name', 'Role', 'Base Salary', 'Actions'];

  // Handle click to navigate to the detailed slip page
  const handleGenerateClick = (userId) => {
    // Navigate to the dynamic route we created in App.js
    navigate(`/salary/slip/${userId}`);
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR', // Change to your currency
      minimumFractionDigits: 2,
    }).format(amount);
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
              <tr><td colSpan={headers.length} className="px-6 py-12 text-center"><Loader2 size={24} className="mx-auto animate-spin text-orange-600" /><p className="mt-2 text-sm text-gray-500">Loading staff...</p></td></tr>
            )}
            {!loading && staffList.length === 0 && (
              <tr><td colSpan={headers.length} className="px-6 py-12 text-center text-sm text-gray-500">No staff members found.</td></tr>
            )}
            {!loading && staffList.map((staff) => (
              <tr key={staff.user_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{staff.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{formatCurrency(staff.base_salary)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button 
                    variant="outline" 
                    size="small"
                    onClick={() => handleGenerateClick(staff.user_id)}
                  >
                    Generate Salary
                    <ArrowRight size={14} className="ml-2" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffSalaryTable;