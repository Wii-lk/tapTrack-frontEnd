import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, DollarSign, ArrowLeft, Calendar, CreditCard, 
  User, FileText, CheckCircle, AlertCircle, ChevronRight 
} from 'lucide-react';
import { feeService } from '../../services/feeService';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const FeePaymentForm = () => {
  const { studentId: urlStudentId } = useParams();
  const navigate = useNavigate();

  // --- State Management ---
  const [studentId, setStudentId] = useState(urlStudentId || '');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [studentData, setStudentData] = useState(null);
  
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState('cash');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  
  const [allocations, setAllocations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --- Effects ---
  useEffect(() => {
    if (urlStudentId) handleSearch(urlStudentId);
  }, [urlStudentId]);

  // Recalculate allocation whenever Amount or Student Data changes
  useEffect(() => {
    if (!studentData) {
      setAllocations([]);
      return;
    }
    
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      calculateAllocation(val);
    } else {
      setAllocations([]);
    }
  }, [amount, studentData]);

  // --- Logic ---
  const handleSearch = async (idToSearch = studentId) => {
    if (!idToSearch) return;
    setLoading(true);
    setError('');
    setSuccess('');
    setStudentData(null);
    setAmount('');
    setAllocations([]);
    
    try {
      const res = await feeService.getOutstandingFees(idToSearch);
      if (res.success && res.data.students.length > 0) {
        setStudentData(res.data.students[0]);
      } else {
        setError('Student not found.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateAllocation = (totalPay) => {
    let remaining = totalPay;
    const newAllocations = [];
    
    // Sort fees: Pay oldest first (assuming ID correlates with time, otherwise sort by date)
    const sortedFees = [...studentData.fees].sort((a, b) => a.id - b.id);

    for (const fee of sortedFees) {
      if (remaining <= 0.01) break; // Stop if remaining is negligible

      // SAFETY FIX: Ensure we parse API string values to floats
      const feeOutstanding = parseFloat(fee.outstanding);
      const canPay = Math.min(remaining, feeOutstanding);
      
      if (canPay > 0) {
        newAllocations.push({
          fee_record_id: fee.id,
          amount: canPay,
          monthLabel: `${new Date(fee.year, fee.month - 1).toLocaleString('default', { month: 'short' })} ${fee.year}`,
          originalAmount: feeOutstanding,
          // Check if fully paid (using small epsilon for float safety)
          fullyPaid: canPay >= (feeOutstanding - 0.01)
        });
        remaining -= canPay;
      }
    }
    setAllocations(newAllocations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentData || !amount) return;
    setProcessing(true);
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
        allocation: allocations.map(a => ({ fee_record_id: a.fee_record_id, amount: a.amount }))
      };

      const res = await feeService.processPayment(payload);
      if (res.success) {
        setSuccess(`Payment Successful! Receipt: ${res.data.receipt_no}`);
        setTimeout(() => navigate('/fees'), 2500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(val);

  // --- Helper Calculations for UI ---
  const inputAmount = parseFloat(amount) || 0;
  const totalAllocated = allocations.reduce((sum, item) => sum + item.amount, 0);
  
  // 🟢 ROBUST CALCULATION FIX:
  // We subtract allocated from input. If input is 6000 and allocated is 5000, excess is 1000.
  const excessAmount = inputAmount - totalAllocated; 
  
  // Only show excess if it's greater than 1 rupee (filters out tiny float errors)
  const hasExcess = excessAmount > 1.0; 

  // --- Render Helpers ---
  const renderStudentCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{studentData.student_name}</h3>
            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
              <User size={14} /> <span>ID: {studentData.student_id}</span>
              <span>•</span>
              <span>{studentData.grade}</span>
            </div>
          </div>
          <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
            {studentData.student_name.charAt(0)}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-2 text-sm text-gray-500 uppercase tracking-wider font-semibold">Total Due</div>
        <div className="text-4xl font-extrabold text-orange-600">{formatCurrency(studentData.total_outstanding)}</div>
        
        {studentData.advance_balance > 0 && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center">
            <CheckCircle size={16} className="mr-2" />
            Has Advance Balance: {formatCurrency(studentData.advance_balance)}
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Pending Invoices</h4>
        {studentData.fees.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {studentData.fees.map(fee => (
              <div key={fee.id} className="flex justify-between text-sm p-2 bg-white rounded border border-gray-100 shadow-sm">
                <span className="text-gray-700">
                  {new Date(fee.year, fee.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <span className="font-medium text-orange-600">{formatCurrency(fee.outstanding)}</span>
              </div>
            ))}
          </div>
        ) : (
           <div className="text-sm text-gray-500 italic">No pending invoices.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/fees')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Collect Fee</h1>
          </div>
          {/* Quick ID search in header for Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Student ID" 
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none w-40"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button size="small" onClick={() => handleSearch()} loading={loading} disabled={!studentId}>
              Go
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile Search (Only visible on small screens) */}
        <div className="sm:hidden mb-6 flex gap-2">
          <Input 
            placeholder="Enter Student ID..." 
            value={studentId} 
            onChange={(e) => setStudentId(e.target.value)}
            className="flex-1"
          />
          <Button onClick={() => handleSearch()} loading={loading}>Search</Button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="shrink-0" size={20} />
            <p className="font-medium">{success}</p>
          </div>
        )}

        {!studentData && !loading && !error && (
          <div className="text-center py-20">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 inline-block max-w-sm">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Student Selected</h3>
              <p className="text-gray-500 mb-6">Enter a Student ID above to fetch outstanding fees and process payments.</p>
            </div>
          </div>
        )}

        {studentData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT COLUMN: Context Info */}
            <div className="lg:col-span-1 space-y-6 animate-in slide-in-from-left-4 duration-500">
              {renderStudentCard()}
            </div>

            {/* RIGHT COLUMN: Payment Form */}
            <div className="lg:col-span-2 animate-in slide-in-from-right-4 duration-500">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                    <CreditCard size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Amount to Pay</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">LKR</span>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-lg font-semibold text-gray-900 transition-shadow"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="date"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-700 bg-white"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Select 
                      label="Payment Method" 
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
                      placeholder="e.g. TRX-88592" 
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
                    <textarea
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-sm"
                      placeholder="Any additional remarks..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  {/* ALLOCATION PREVIEW */}
                  {/* Trigger condition: Either we have allocations OR we have an excess amount */}
                  {(allocations.length > 0 || (inputAmount > 0 && hasExcess)) && (
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden mt-6">
                      <div className="px-4 py-3 bg-gray-100/50 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Allocation Preview</span>
                        <span className="text-xs font-medium text-gray-400">Auto-calculated</span>
                      </div>
                      
                      <div className="divide-y divide-gray-100">
                        {allocations.map((alloc) => (
                          <div key={alloc.fee_record_id} className="px-4 py-3 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className={`p-1.5 rounded-full ${alloc.fullyPaid ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                {alloc.fullyPaid ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />} 
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{alloc.monthLabel}</p>
                                <p className="text-xs text-gray-500">Original Due: {formatCurrency(alloc.originalAmount)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900">{formatCurrency(alloc.amount)}</p>
                              <p className="text-xs text-gray-500">{alloc.fullyPaid ? 'Fully Paid' : 'Partial'}</p>
                            </div>
                          </div>
                        ))}
                        
                        {/* 🟢 EXCESS / ADVANCE ROW */}
                        {hasExcess && (
                          <div className="px-4 py-3 bg-blue-50 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-blue-700">
                              <FileText size={16} />
                              <span className="text-sm font-medium">Excess to Advance Account</span>
                            </div>
                            <span className="text-sm font-bold text-blue-700">
                              {formatCurrency(excessAmount)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
                         <span className="font-semibold text-gray-700">Total Payment</span>
                         <span className="font-bold text-lg text-gray-900">{formatCurrency(inputAmount)}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex gap-4">
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="flex-1 py-3"
                      onClick={() => navigate('/fees')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-[2] py-3 text-base shadow-lg shadow-orange-200"
                      loading={processing}
                      disabled={!amount || parseFloat(amount) <= 0}
                    >
                      Confirm Payment <ChevronRight size={18} className="ml-1 inline" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FeePaymentForm;