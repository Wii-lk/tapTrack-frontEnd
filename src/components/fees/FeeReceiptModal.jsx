import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal'; // Assuming you have this from CalculateSalaryModal
import { feeService } from '../../services/feeService';
import { Loader2, Printer } from 'lucide-react';
import Button from '../common/Button';

const FeeReceiptModal = ({ isOpen, onClose, paymentId }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isOpen && paymentId) {
      fetchReceipt();
    }
  }, [isOpen, paymentId]);

  const fetchReceipt = async () => {
    setLoading(true);
    try {
      const res = await feeService.getReceiptDetails(paymentId);
      if (res.success) setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(val);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Receipt" size="lg">
      <div className="p-1">
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-orange-600" size={32} />
          </div>
        )}

        {!loading && data && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">RECEIPT</h2>
                <p className="text-sm text-gray-500">#{data.receipt_no}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{data.date}</p>
              </div>
            </div>

            {/* Student Info */}
            <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Student</p>
                <p className="font-semibold">{data.student.name} ({data.student.id})</p>
              </div>
              <div>
                <p className="text-gray-500">Grade</p>
                <p className="font-semibold">{data.student.grade}</p>
              </div>
            </div>

            {/* Allocation Table */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Payment Allocation</h4>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2">Month</th>
                    <th className="p-2 text-right">Fee</th>
                    <th className="p-2 text-right">Paid Now</th>
                    <th className="p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.allocation.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{item.month}</td>
                      <td className="p-2 text-right text-gray-500">{formatCurrency(item.fee_amount)}</td>
                      <td className="p-2 text-right font-medium">{formatCurrency(item.this_payment)}</td>
                      <td className="p-2 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex flex-col items-end space-y-2 pt-4 border-t">
              <div className="flex justify-between w-full md:w-1/2 text-lg font-bold">
                <span>Total Paid:</span>
                <span className="text-green-600">{formatCurrency(data.amount_paid)}</span>
              </div>
              <div className="flex justify-between w-full md:w-1/2 text-sm text-gray-500">
                <span>Remaining Balance:</span>
                <span>{formatCurrency(data.outstanding_balance)}</span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-4">
               <Button variant="outline" onClick={() => window.print()}>
                 <Printer size={16} className="mr-2"/> Print
               </Button>
               <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FeeReceiptModal;