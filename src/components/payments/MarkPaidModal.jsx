import React, { useState } from 'react';
import { X, CheckCircle, Calendar } from 'lucide-react';
import Button from '../common/Button';
import { jsPDF } from 'jspdf';

const MarkPaidModal = ({ isOpen, onClose, onConfirm, loading, staff }) => {
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // --- 1. Header & Title ---
    doc.setFillColor(240, 240, 240); // Light gray background for header
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(31, 41, 55); // Dark gray
    doc.text("PHOENIX SYSTEM", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("SALARY PAYMENT RECEIPT", 105, 30, { align: "center" });

    // --- 2. Employee Info Section ---
    doc.setFont("helvetica", "bold");
    doc.text("EMPLOYEE DETAILS", 20, 55);
    doc.line(20, 57, 80, 57); // Underline

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const detailsY = 65;
    doc.text(`Name:`, 20, detailsY);
    doc.text(`${staff?.name || 'N/A'}`, 60, detailsY);
    
    doc.text(`Employee ID:`, 20, detailsY + 8);
    doc.text(`${staff?.employee_no || staff?.unique_no || 'N/A'}`, 60, detailsY + 8);
    
    doc.text(`Designation:`, 20, detailsY + 16);
    doc.text(`${staff?.role || 'Staff Member'}`, 60, detailsY + 16);

    // --- 3. Payment Info Section ---
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT SUMMARY", 120, 55);
    doc.line(120, 57, 180, 57);

    doc.setFont("helvetica", "normal");
    doc.text(`Date:`, 120, detailsY);
    doc.text(`${paymentDate}`, 150, detailsY);
    
    doc.text(`Status:`, 120, detailsY + 8);
    doc.setTextColor(22, 163, 74); // Green for "PAID"
    doc.text(`PAID`, 150, detailsY + 8);
    doc.setTextColor(0, 0, 0);

    // --- 4. Amount Table-like Structure ---
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, 95, 170, 40); // Main Box
    doc.line(20, 105, 190, 105); // Header line
    
    doc.setFont("helvetica", "bold");
    doc.text("Description", 25, 101);
    doc.text("Total (LKR)", 160, 101);
    
    doc.setFont("helvetica", "normal");
    doc.text("Basic Salary Payment", 25, 115);
    doc.text(`${staff?.basic_salary?.toLocaleString() || 0}.00`, 160, 115);

    // Total Row
    doc.setFillColor(249, 250, 251);
    doc.rect(20, 125, 170, 10, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("NET PAID", 25, 131);
    doc.text(`${staff?.basic_salary?.toLocaleString() || 0}.00`, 160, 131);

    // --- 5. Notes ---
    if (notes) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      doc.text("Notes:", 20, 150);
      doc.text(notes, 20, 155, { maxWidth: 170 });
    }

    // --- 6. Footer ---
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    const footerY = 280;
    doc.text("This is a computer-generated document and does not require a signature.", pageWidth / 2, footerY, { align: "center" });
    doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 5, { align: "center" });

    // Save PDF
    doc.save(`Salary_Slip_${staff?.name?.replace(/\s+/g, '_')}_${paymentDate}.pdf`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1️⃣ Call your existing confirm handler
    onConfirm({ payment_date: paymentDate, notes });

    // 2️⃣ Generate PDF immediately
    generatePDF();

    // Optional: close modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            Mark Salary as Paid
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid via Bank Transfer (Ref: #1234)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Confirm & Download PDF
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkPaidModal;
