import React from 'react';
import { Loader2, DollarSign, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const FeeOutstandingTable = ({ students, loading }) => {
  const navigate = useNavigate();
  const headers = ['Student', 'Grade', 'Breakdown', 'Total Due', 'Actions'];

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(val);

  // Mobile Card Component
  const OutstandingCard = ({ student }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-3">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h4 className="text-sm font-semibold text-gray-900">{student.student_name}</h4>
                <div className="text-xs text-gray-500">ID: {student.student_id}</div>
            </div>
            <span className="px-2 py-1 bg-gray-100 rounded text-xs border border-gray-200">
                {student.grade}
            </span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-t border-b border-gray-50 my-2">
             <div className="text-xs text-gray-500">
                <div>{student.fees.length} Pending Invoice(s)</div>
                {student.fees.length > 0 && (
                    <div className="text-orange-600">Oldest: {new Date(student.fees[0].year, student.fees[0].month - 1).toLocaleString('default', { month: 'short' })}</div>
                )}
             </div>
             <div className="text-sm font-bold text-orange-600">
                {formatCurrency(student.total_outstanding)}
             </div>
        </div>

        <Button 
            size="small" 
            className="w-full justify-center"
            onClick={() => navigate(`/fees/collect/${student.student_id}`)}
        >
            <DollarSign size={14} className="mr-2" />
            Collect Payment
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
               <p className="mt-2 text-sm text-gray-500">Loading...</p>
            </div>
        )}
        {!loading && students.length === 0 && (
            <div className="text-center py-8 text-gray-500">No outstanding fees found.</div>
        )}
        {!loading && students.map((student) => (
            <OutstandingCard key={student.student_id} student={student} />
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
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
                  <p className="mt-2 text-sm text-gray-500">Loading outstanding fees...</p>
                </td>
              </tr>
            )}
            
            {!loading && students.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-500">
                  No outstanding fees found. Good job!
                </td>
              </tr>
            )}

            {!loading && students.map((student) => (
              <tr key={student.student_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{student.student_name}</div>
                  <div className="text-xs text-gray-500">ID: {student.student_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs border border-gray-200">
                    {student.grade}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {student.fees.length} Pending Invoice(s)
                  {student.fees.length > 0 && (
                    <div className="text-xs text-orange-600 mt-1">
                      Oldest: {new Date(student.fees[0].year, student.fees[0].month - 1).toLocaleString('default', { month: 'short' })}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-600">
                  {formatCurrency(student.total_outstanding)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/fees/collect/${student.student_id}`)}
                    aria-label={`Collect payment for ${student.student_name}`}
                  >
                    <DollarSign size={14} className="mr-2" />
                    Collect Payment
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

export default FeeOutstandingTable;