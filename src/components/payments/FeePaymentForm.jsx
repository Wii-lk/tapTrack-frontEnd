import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Calculator, DollarSign, ArrowLeft } from 'lucide-react';
// ⬇️ FIXED: Using named import with curly braces
import { feeService } from '../../services/feeService';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Alert from '../common/Alert';

const FeePaymentForm = () => {
  const { studentId: urlStudentId } = useParams();
  const navigate = useNavigate();
  
  const [studentId, setStudentId] = useState(urlStudentId || '50');
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Payment Form State
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState('cash');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [allocations, setAllocations] = useState([]);

  // Auto-fetch if studentId comes from URL
  useEffect(() => {
    if (urlStudentId) {
      handleSearch(urlStudentId);
    }
  }, [urlStudentId]);

  // Fetch Student Dues
  const handleSearch = async (idToSearch = studentId) => {
    if (!idToSearch) return;
    setLoading(true);
    setError('');
    setSuccess('');
    setStudentData(null);
    setAmount('');
    
    try {
      const res = await feeService.getOutstandingFees(idToSearch);
      if (res.success && res.data.students.length > 0) {
        setStudentData(res.data.students[0]);
      } else {
        setError('Student not found or no outstanding fees.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-Calculate Allocation based on Amount Input
  useEffect(() => {
    if (!studentData || !amount) {
      setAllocations([]);
      return;
    }

    let remainingPayment = parseFloat(amount);
    const newAllocations = [];

    // Sort fees: ID ascending (oldest first)
    const sortedFees = [...studentData.fees].sort((a, b) => a.id - b.id);

    for (const fee of sortedFees) {
      if (remainingPayment <= 0) break;

      const toPay = Math.min(remainingPayment, fee.outstanding);
      
      if (toPay > 0) {
        newAllocations.push({
          fee_record_id: fee.id,
          amount: toPay,
          monthLabel: `${fee.month}/${fee.year}`
        });
        remainingPayment -= toPay;
      }
    }
    setAllocations(newAllocations);
  }, [amount, studentData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentData || !amount || allocations.length === 0) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        student_id: studentData.student_id,
        amount: parseFloat(amount),
        payment_date: paymentDate,
        payment_method: method,
        reference_no: reference,
        notes: notes,
        allocation: allocations.map(({ fee_record_id, amount }) => ({ fee_record_id, amount }))
      };

      const res = await feeService.processPayment(payload);
      if (res.success) {
        setSuccess('Payment recorded successfully!');
        setAmount('');
        setAllocations([]);
        // Optionally redirect back or clear form
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(val);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto my-6">
      
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
        </Button>
        <h3 className="text-xl font-bold flex items-center gap-2">
            <DollarSign size={24} className="text-green-600"/> Collect Payment
        </h3>
      </div>
      
      {/* 1. Search Section */}
      <div className="flex gap-2 mb-6">
        <Input 
          placeholder="Enter Student ID (Use 50)" 
          value={studentId} 
          onChange={(e) => setStudentId(e.target.value)}
        />
        <Button onClick={() => handleSearch()} loading={loading} disabled={!studentId}>
          <Search size={18} />
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')}/>}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')}/>}

      {/* 2. Outstanding Summary */}
      {studentData && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-gray-800">{studentData.student_name}</h4>
            <span className="text-sm bg-white px-2 py-1 rounded border">{studentData.grade}</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            Due: {formatCurrency(studentData.total_outstanding)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Breakdown: {studentData.fees.length} pending invoices
          </div>
        </div>
      )}

      {/* 3. Payment Form */}
      {studentData && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Payment Amount" 
              type="number" 
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Input 
              label="Date" 
              type="date" 
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              label="Method" 
              value={method} 
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="online">Online</option>
              <option value="cheque">Cheque</option>
            </Select>
            <Input 
              label="Reference / Cheque No" 
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <Input 
            label="Notes" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
          />

          {/* Allocation Preview */}
          {allocations.length > 0 && (
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-semibold text-gray-600 mb-2">Payment Allocation (Auto):</p>
              <ul className="space-y-1">
                {allocations.map(a => (
                  <li key={a.fee_record_id} className="flex justify-between text-gray-700">
                    <span>Month: {a.monthLabel}</span>
                    <span>{formatCurrency(a.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
             <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancel</Button>
             <Button type="submit" loading={loading}>
                Process Payment
             </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FeePaymentForm;