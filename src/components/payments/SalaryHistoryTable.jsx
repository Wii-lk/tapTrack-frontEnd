import React from 'react';
import { Loader2, CheckCircle, CreditCard } from 'lucide-react';
import Button from '../common/Button';

/**
 * Renders the table of past salary records.
 */
const SalaryHistoryTable = ({ salaries, loading, onMarkAsPaid, processingIds = new Set() }) => {
  const headers = ['Staff', 'Period', 'Net Salary', 'Status', 'Paid On', 'Actions'];

  const formatCurrency = (amount) => (
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount)
  );

  const formatMonthYear = (month, year) => (
    new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
            {loading && (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center">
                  <Loader2 size={24} className="mx-auto animate-spin text-orange-600" />
                  <p className="mt-2 text-sm text-gray-500">Loading history...</p>
                </td>
              </tr>
            )}
            {!loading && salaries.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-sm text-gray-500">
                  No salary history found.
                </td>
              </tr>
            )}
            {!loading && salaries.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.user_name}
                  <span className="text-gray-500 ml-1">(ID: {record.user_id})</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatMonthYear(record.month, record.year)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                  {formatCurrency(record.net_salary)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {record.status === 'paid' ? (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  ) : (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Finalized
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(record.paid_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {record.status === 'finalized' ? (
                    <Button 
                      variant="outline" 
                      size="small"
                      onClick={() => onMarkAsPaid(record.id)}
                      loading={processingIds.has(record.id)}
                      disabled={processingIds.has(record.id)}
                      aria-label={`Mark salary for ${record.user_name} as paid`}
                    >
                      <CreditCard size={14} className="mr-2" />
                      Mark as Paid
                    </Button>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={14} className="mr-2" />
                      <span>Paid</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryHistoryTable;