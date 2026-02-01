// src/components/payments/MarkPaidModal.jsx
import React, { useState } from 'react';
import { X, CheckCircle, Calendar } from 'lucide-react';
import Button from '../common/Button';
import { jsPDF } from 'jspdf';

const MarkPaidModal = ({ isOpen, onClose, onConfirm, loading, staff }) => {
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header Background
    doc.setFillColor(31, 41, 55); 
    doc.rect(0, 0, pageWidth, 40, 'F');

    // School Name/Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("SALARY PAYMENT RECEIPT", 105, 25, { align: "center" });

    // Reset Text for body
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    // Employee Details Box
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 50, 190, 50); 
    
    doc.setFont("helvetica", "bold");
    doc.text("EMPLOYEE INFORMATION", 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${staff?.name || 'Staff Member'}`, 20, 70);
    doc.text(`Staff ID: ${staff?.employee_no || 'N/A'}`, 20, 78);
    doc.text(`Designation: ${staff?.role || 'Teacher'}`, 20, 86);

    // Payment Details Box
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT DETAILS", 120, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${paymentDate}`, 120, 70);
    doc.text(`Status: PAID`, 120, 78);

    // Amount Section
    doc.setFillColor(243, 244, 246);
    doc.rect(20, 100, 170, 30, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TOTAL NET SALARY PAID", 30, 118);
    doc.text(`LKR ${staff?.basic_salary?.toLocaleString() || 0}.00`, 180, 118, { align: "right" });

    // Notes
    if (notes) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("Notes:", 20, 145);
      doc.text(notes, 20, 152, { maxWidth: 170 });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("This is a computer generated receipt.", 105, 280, { align: "center" });

    doc.save(`Receipt_${staff?.name}_${paymentDate}.pdf`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ payment_date: paymentDate, notes });
    generatePDF();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            Confirm Payment
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
            <p className="text-xs text-blue-600 font-semibold uppercase">Paying To</p>
            <p className="font-bold text-gray-800">{staff?.name}</p>
            <p className="text-sm text-gray-600">Amount: LKR {staff?.basic_salary?.toLocaleString()}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <input 
              type="date" 
              required 
              value={paymentDate} 
              onChange={(e) => setPaymentDate(e.target.value)} 
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Bank transfer, Cash, etc."
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={loading} className="bg-green-600 text-white hover:bg-green-700">
              Confirm & Download Receipt
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkPaidModal;