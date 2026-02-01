import React, { useEffect, useState, useRef } from 'react';
import Modal from '../common/Modal';
import { feeService } from '../../services/feeService';
import { Loader2, Printer, FileDown } from 'lucide-react';
import Button from '../common/Button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FeeReceiptModal = ({ isOpen, onClose, paymentId }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  
  // Create a reference to the receipt content for PDF capture
  const receiptRef = useRef(null);

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

  const handleDownloadPDF = async () => {
    const element = receiptRef.current;
    if (!element) return;

    try {
      // Capture the element as a canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better text quality
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Initialize PDF (A4 size)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Save the file
      pdf.save(`Receipt_${data.receipt_no}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
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
            {/* 🟢 Ref attached here to wrap only the content to be printed */}
            <div ref={receiptRef} className="bg-white p-4">
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
              <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4 text-sm mt-4">
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
              <div className="mt-6">
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
              <div className="flex flex-col items-end space-y-2 pt-4 border-t mt-4">
                <div className="flex justify-between w-full md:w-1/2 text-lg font-bold">
                  <span>Total Paid:</span>
                  <span className="text-green-600">{formatCurrency(data.amount_paid)}</span>
                </div>
                <div className="flex justify-between w-full md:w-1/2 text-sm text-gray-500">
                  <span>Remaining Balance:</span>
                  <span>{formatCurrency(data.outstanding_balance)}</span>
                </div>
              </div>
            </div>

            {/* Footer Actions - NOT included in the receiptRef */}
            <div className="flex justify-end gap-3 pt-4 border-t">
               <Button variant="outline" onClick={handleDownloadPDF} className="text-blue-600 border-blue-600 hover:bg-blue-50">
                 <FileDown size={16} className="mr-2"/> Download PDF
               </Button>
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