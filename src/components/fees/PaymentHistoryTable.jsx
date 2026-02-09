import React from "react";
import { Loader2, FileText } from "lucide-react";
import Button from "../common/Button";

const PaymentHistoryTable = ({ history, loading, onViewReceipt }) => {
  const headers = [
    "Date",
    "Receipt No",
    "Student",
    "Method",
    "Amount",
    "Received By",
    "Actions",
  ];

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(val);

  // Mobile Payment Card
  const PaymentCard = ({ payment }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">
            {new Date(payment.payment_date).toLocaleDateString()}
          </span>
          <div className="text-sm font-semibold text-gray-900">
            {payment.student_name.length > 30
              ? `${payment.student_name.substring(0, 30)}...`
              : payment.student_name}
          </div>
        </div>
        <div className="text-sm font-semibold text-green-600">
          {formatCurrency(payment.amount)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 border-t border-gray-50 pt-2 mb-2">
        <div>
          <span className="block text-gray-400">Receipt No</span>
          <span className="font-mono">{payment.id}</span>
        </div>
        <div>
          <span className="block text-gray-400">Method</span>
          <span className="capitalize">
            {payment.payment_method.replace("_", " ")}
          </span>
        </div>
        <div className="col-span-2">
          <span className="block text-gray-400">Received By</span>
          {payment.received_by}
        </div>
      </div>

      <Button
        variant="outline"
        size="small"
        className="w-full justify-center"
        onClick={() => onViewReceipt(payment.id)}
      >
        <FileText size={14} className="mr-2" />
        View Receipt
      </Button>
    </div>
  );

  return (
    <div>
      {/* Mobile View */}
      <div className="block md:hidden">
        {loading && (
          <div className="text-center py-8">
            <Loader2
              size={24}
              className="mx-auto animate-spin text-orange-600"
            />
          </div>
        )}
        {!loading &&
          history.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="px-6 py-12 text-center"
                  >
                    <Loader2
                      size={24}
                      className="mx-auto animate-spin text-orange-600"
                    />
                  </td>
                </tr>
              )}

              {!loading &&
                history.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.payment_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.student_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {payment.payment_method.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.received_by}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => onViewReceipt(payment.id)}
                      >
                        <FileText size={14} className="mr-2" />
                        Receipt
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

export default PaymentHistoryTable;
