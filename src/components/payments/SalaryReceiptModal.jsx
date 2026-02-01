import React, { useRef } from 'react';
import Modal from '../common/Modal';
import { FileDown, Printer } from 'lucide-react';
import Button from '../common/Button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// 🟢 Change prop: 'salaryId' becomes 'data'
const SalaryReceiptModal = ({ isOpen, onClose, data }) => {
  const receiptRef = useRef(null);

  const handleDownloadPDF = async () => {
    const element = receiptRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`SalarySlip_${data.employee_name}_${data.month}.pdf`);
  };

  // 🟢 We no longer need 'loading' state because the data is already there
  if (!isOpen || !data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Salary Slip" size="lg">
      <div className="p-4">
        <div ref={receiptRef} className="bg-white p-6 border shadow-sm">
          <div className="text-center mb-4">
            <h2 className="font-bold text-2xl text-gray-800">SALARY SLIP</h2>
            <p className="text-gray-500 uppercase text-xs tracking-widest">Official Record</p>
          </div>
          
          <hr className="my-4 border-gray-200" />
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <p className="text-gray-500">Employee Name</p>
              <p className="font-bold text-gray-800">{data.employee_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Salary Period</p>
              <p className="font-bold text-gray-800">{data.month} {data.year}</p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-gray-500">Basic Salary</p>
              <p className="font-semibold text-gray-800">LKR {data.basic_salary}</p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-gray-500">Net Paid Amount</p>
              <p className="font-bold text-green-600 text-lg">LKR {data.net_salary}</p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-dashed text-center text-xs text-gray-400">
            This is a computer-generated document. No signature required.
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center gap-2">
            <FileDown size={16} /> Download PDF
          </Button>
          <Button onClick={() => window.print()} variant="outline" className="flex items-center gap-2">
            <Printer size={16} /> Print
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default SalaryReceiptModal;