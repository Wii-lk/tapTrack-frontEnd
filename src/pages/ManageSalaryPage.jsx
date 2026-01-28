import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calculator, CheckCircle, ArrowLeft, AlertCircle, 
  Save, Loader2, Edit3, Calendar 
} from 'lucide-react';
import { salaryService } from '../services/salaryService';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import MarkPaidModal from '../components/payments/MarkPaidModal';

const ManageSalaryPage = () => {
  const { userId: urlUserId, id: urlId } = useParams();
  const navigate = useNavigate();
  const userId = parseInt(urlUserId || urlId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); 

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [salaryData, setSalaryData] = useState(null);
  const [finalizedData, setFinalizedData] = useState(null);

  const [isAdjusting, setIsAdjusting] = useState(false);
  const [editedDeductions, setEditedDeductions] = useState({});
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    if (!userId || isNaN(userId)) setError("Invalid Staff ID.");
  }, [userId]);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const res = await salaryService.calculateSalary({ user_id: userId, month, year });
      if (res.success) {
        setSalaryData(res.data);
        initializeEditState(res.data.deductions);
        setStep(2);
      }
    } catch (err) {
      setError(err.message || 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  const initializeEditState = (deductions) => {
    const editState = {};
    const entries = Array.isArray(deductions) ? deductions : Object.entries(deductions || {});
    entries.forEach((item) => {
      let key, val;
      if (Array.isArray(deductions)) {
        key = item.name || item.rule_type;
        val = item.amount;
      } else {
        [key, val] = item;
        val = typeof val === 'object' ? val.amount : val;
      }
      editState[key] = val;
    });
    setEditedDeductions(editState);
  };

  const formatDeductionsForBackend = (deductionsObject) => {
    return Object.entries(deductionsObject).map(([key, value]) => ({
      name: key,
      amount: parseFloat(value) || 0
    }));
  };

  const handleSaveAdjustment = async () => {
    setLoading(true);
    setError('');
    try {
      const deductionsArray = formatDeductionsForBackend(editedDeductions);
      const res = await salaryService.adjustSalary({
        user_id: userId, month, year, deductions: deductionsArray, notes: "Adjusted by Admin"
      });
      
      if (res.success) {
        const currentBasic = parseFloat(salaryData.basic_salary) || 0;
        const newTotalDeductions = Object.values(editedDeductions).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
        
        setSalaryData(prev => ({
          ...prev,
          deductions: editedDeductions,
          total_deductions: newTotalDeductions,
          net_salary: currentBasic - newTotalDeductions
        }));
        setIsAdjusting(false);
        setSuccess('Salary adjusted.');
      }
    } catch (err) {
      setError(err.message || 'Adjustment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (!salaryData) return;
    setLoading(true);
    try {
      let deductionsToSubmit = [];
      if (!Array.isArray(salaryData.deductions) && Object.keys(editedDeductions).length > 0) {
         deductionsToSubmit = formatDeductionsForBackend(editedDeductions);
      } else if (!Array.isArray(salaryData.deductions)) {
         deductionsToSubmit = Object.entries(salaryData.deductions || {}).map(([key, val]) => ({
            name: key, amount: typeof val === 'object' ? (val.amount || 0) : (val || 0)
         }));
      } else {
         deductionsToSubmit = salaryData.deductions;
      }

      const totalDeductions = deductionsToSubmit.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
      
      const payload = {
        user_id: userId, month, year,
        basic_salary: salaryData.basic_salary,
        deductions_json: deductionsToSubmit,
        net_salary: parseFloat(salaryData.basic_salary) - totalDeductions,
        notes: "Generated via System"
      };

      const res = await salaryService.finalizeSalary(payload);
      if (res.success) {
        setFinalizedData(res.data);
        setStep(3);
        setSuccess('Salary finalized successfully!');
      }
    } catch (err) {
      setError(err.message || 'Finalization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (paymentData) => {
    const historyId = finalizedData?.salary_history_id || finalizedData?.id;
    if (!historyId) return;
    setPayLoading(true);
    try {
      const res = await salaryService.markSalaryPaid(historyId, paymentData);
      if (res.success) {
        setFinalizedData(prev => ({ ...prev, status: 'paid', paid_at: res.data.paid_at }));
        setIsPayModalOpen(false);
        setSuccess("Salary marked as PAID successfully!");
      }
    } catch (err) {
      setError(err.message || 'Failed to mark as paid');
    } finally {
      setPayLoading(false);
    }
  };

  const formatMoney = (val) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(val || 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition"><ArrowLeft size={20} /></button>
        <div><h1 className="text-2xl font-bold text-gray-800">Process Salary</h1><p className="text-gray-500 text-sm">Staff ID: {userId}</p></div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className={`bg-white p-6 rounded-xl shadow-sm border ${step === 1 ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-200'}`}>
            <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-600 w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span> Select Period
            </h3>
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Month</label>
                  <select value={month} onChange={(e) => setMonth(e.target.value)} disabled={step > 1} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    {Array.from({ length: 12 }, (_, i) => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
                  <input type="number" value={year} onChange={(e) => setYear(e.target.value)} disabled={step > 1} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              {step === 1 && <Button type="submit" loading={loading} className="w-full justify-center"><Calculator size={18} className="mr-2" /> Calculate</Button>}
              {step > 1 && <button type="button" onClick={() => { setStep(1); setSalaryData(null); setFinalizedData(null); setIsAdjusting(false); }} className="text-sm text-blue-600 hover:underline w-full text-center mt-2">Reset</button>}
            </form>
          </div>

          {step === 3 && finalizedData && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4"><span className="bg-green-100 text-green-600 w-6 h-6 flex items-center justify-center rounded-full text-xs">3</span> Payment Status</h3>
              <div className="text-center py-4">
                {finalizedData.status === 'paid' ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle size={28} /></div>
                    <h4 className="text-lg font-bold text-green-700">PAID</h4>
                    <p className="text-xs text-gray-500">On {new Date(finalizedData.paid_at).toLocaleDateString()}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center"><AlertCircle size={28} /></div>
                    <h4 className="text-lg font-bold text-amber-700">FINALIZED</h4>
                    <Button onClick={() => setIsPayModalOpen(true)} className="w-full mt-4 bg-green-600 hover:bg-green-700">Mark as Paid</Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {salaryData ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <div><h2 className="text-lg font-bold text-gray-800">Salary Breakdown</h2><p className="text-sm text-gray-500">Draft for {salaryData.user_name}</p></div>
                {step === 2 && !isAdjusting && <Button variant="outline" size="small" onClick={() => setIsAdjusting(true)}><Edit3 size={16} className="mr-2" /> Adjust</Button>}
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-blue-900">Basic Salary</span><span className="font-bold text-blue-900">{formatMoney(salaryData.basic_salary)}</span>
                </div>
                <div className={`space-y-2 border border-gray-100 rounded-lg p-4 ${isAdjusting ? 'bg-amber-50 border-amber-200' : ''}`}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deductions</p>
                    {isAdjusting && <span className="text-xs text-amber-600 font-bold animate-pulse">Editing Mode</span>}
                  </div>
                  {renderDeductionsList(isAdjusting, editedDeductions, salaryData, setEditedDeductions, formatMoney)}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 font-semibold">
                    <span>Total Deductions</span><span className="text-red-600">- {formatMoney(salaryData.total_deductions)}</span>
                  </div>
                </div>
                <div className="border-t-2 border-gray-100 pt-4 mt-2">
                  <div className="flex justify-between items-center"><span className="text-xl font-bold text-gray-800">Net Salary</span><span className="text-2xl font-bold text-green-600">{formatMoney(salaryData.net_salary)}</span></div>
                </div>
                {step === 2 && (
                  <div className="pt-6 flex justify-end gap-3">
                    {isAdjusting ? (
                      <>
                        <Button variant="ghost" onClick={() => { setIsAdjusting(false); initializeEditState(salaryData.deductions); }}>Cancel</Button>
                        <Button onClick={handleSaveAdjustment} loading={loading} className="bg-amber-600 hover:bg-amber-700 text-white"><Save size={18} className="mr-2" /> Save & Recalculate</Button>
                      </>
                    ) : (
                      <Button onClick={handleFinalize} loading={loading} className="px-8"><CheckCircle size={18} className="mr-2" /> Finalize & Approve</Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
              <Calendar size={48} className="mb-3 opacity-20" /><p>Select a month and calculate to view details.</p>
            </div>
          )}
        </div>
      </div>
      <MarkPaidModal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} onConfirm={handleMarkPaid} loading={payLoading} />
    </div>
  );
};

const renderDeductionsList = (isAdjusting, editedDeductions, salaryData, setEditedDeductions, formatMoney) => {
  const data = isAdjusting ? editedDeductions : (salaryData.deductions || {});
  let entries = Array.isArray(data) ? data.map(item => [item.name, item.amount]) : Object.entries(data).map(([k, v]) => [k, typeof v === 'object' ? v.amount : v]);

  return entries.map(([key, amount]) => (
    <div key={key} className="flex justify-between items-center text-sm border-b border-gray-200/50 last:border-0 pb-2 last:pb-0 h-10">
      <span className="capitalize text-gray-700">{key.replace(/_/g, ' ')}</span>
      {isAdjusting ? (
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">LKR</span>
          <input type="number" value={editedDeductions[key] || 0} onChange={(e) => setEditedDeductions({...editedDeductions, [key]: parseFloat(e.target.value) || 0})} className="w-24 px-2 py-1 text-right text-sm border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 outline-none" />
        </div>
      ) : <span className="text-red-500 font-medium">- {formatMoney(amount)}</span>}
    </div>
  ));
};

export default ManageSalaryPage;