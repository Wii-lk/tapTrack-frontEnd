import React, { useState, useEffect } from 'react';
import { salaryService } from '../../services/salaryService';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Alert from '../common/Alert';

// Helper to get current month and year
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1; // 1-12

/**
 * This is the 3-step modal for calculating salary.
 * Step 1: Select User/Month
 * Step 2: Review & Adjust
 * Step 3: Finalize
 */
const CalculateSalaryModal = ({ isOpen, onClose, onSalaryFinalized }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  // Step 1 State
  const [staffList, setStaffList] = useState([]);
  const [userId, setUserId] = useState('');
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  // Step 2 State
  const [calculatedData, setCalculatedData] = useState(null);
  const [adjustedDeductions, setAdjustedDeductions] = useState({});
  const [notes, setNotes] = useState('');

  // Step 3 State
  const [finalizedData, setFinalizedData] = useState(null);

  // --- Step 1: Load Staff List ---
  useEffect(() => {
    if (isOpen) {
      // Reset all state when modal opens
      resetModalState();
      
      const fetchStaff = async () => {
        setLoading(true);
        try {
          const res = await salaryService.getStaffList();
          if (res.success) {
            setStaffList(res.data);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchStaff();
    }
  }, [isOpen]);

  const resetModalState = () => {
    setStep(1);
    setLoading(false);
    setError('');
    setValidationError('');
    setUserId('');
    setMonth(currentMonth);
    setYear(currentYear);
    setCalculatedData(null);
    setAdjustedDeductions({});
    setNotes('');
    setFinalizedData(null);
  };

  // --- Step 2: Handle Salary Calculation ---
  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    setValidationError('');
    try {
      const res = await salaryService.calculateSalary({ user_id: userId, month, year });
      if (res.success) {
        setCalculatedData(res.data);
        // Pre-fill the adjustment form with the calculated amounts
        const initialDeductions = {};
        for (const key in res.data.deductions) {
          initialDeductions[key] = res.data.deductions[key].amount;
        }
        setAdjustedDeductions(initialDeductions);
        setStep(2); // Move to Step 2
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeductionChange = (key, value) => {
    const numValue = parseFloat(value);
    
    // Validation
    if (isNaN(numValue)) {
      setValidationError(`Please enter a valid number for ${formatDeductionName(key)}`);
      return;
    }
    
    if (numValue < 0) {
      setValidationError(`${formatDeductionName(key)} cannot be negative`);
      return;
    }
    
    setValidationError('');
    setAdjustedDeductions(prev => ({
      ...prev,
      [key]: numValue,
    }));
  };

  // --- Step 3: Handle Adjustment & Finalization ---
  const handleAdjustAndFinalize = async () => {
    // Final validation before submission
    const newTotalDeductions = Object.values(adjustedDeductions).reduce((sum, val) => sum + val, 0);
    if (newTotalDeductions > calculatedData.basic_salary) {
      setValidationError('Total deductions cannot exceed basic salary');
      return;
    }

    setLoading(true);
    setError('');
    setValidationError('');
    try {
      // 1. Send the adjusted amounts
      const adjustmentRequest = {
        user_id: userId,
        month,
        year,
        deductions: {}, // API expects an object of objects
        notes: notes,
      };
      
      // Format the deductions object as per the API spec
      for(const key in adjustedDeductions) {
        adjustmentRequest.deductions[key] = { amount: adjustedDeductions[key] };
      }

      const adjustRes = await salaryService.adjustSalary(adjustmentRequest);
      if (!adjustRes.success) throw new Error(adjustRes.message);

      // 2. Use the adjusted data to finalize
      const finalizeRequest = {
        user_id: userId,
        month,
        year,
        basic_salary: calculatedData.basic_salary,
        deductions_json: adjustmentRequest.deductions, // ✓ FIXED: Send adjusted deductions
        net_salary: adjustRes.data.net_salary, // Send the new net salary
        notes: notes
      };

      const finalizeRes = await salaryService.finalizeSalary(finalizeRequest);
      if (finalizeRes.success) {
        setFinalizedData(finalizeRes.data);
        setStep(3); // Move to final step
      } else {
        throw new Error(finalizeRes.message || 'Failed to finalize salary');
      }
    } catch (err) {
      setError(`Failed to complete salary processing: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to format currency
  const formatCurrency = (amount) => (
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount)
  );

  // Helper to format deduction names
  const formatDeductionName = (key) => {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle month input with validation
  const handleMonthChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= 12) {
      setMonth(val);
    }
  };

  // Handle year input with validation
  const handleYearChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 2020 && val <= 2100) {
      setYear(val);
    }
  };
  
  // --- RENDER FUNCTIONS ---

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Step 1: Calculate Salary</h3>
      <p className="text-sm text-gray-500">Select a staff member and the pay period to calculate a draft salary slip.</p>
      
      {staffList.length === 0 && !loading ? (
        <Alert type="warning" message="No staff members found. Please add staff members first." />
      ) : (
        <>
          <Select 
            label="Select Staff Member" 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
            required
            aria-label="Select staff member for salary calculation"
          >
            <option value="" disabled>-- Select Staff --</option>
            {staffList.map(staff => (
              <option key={staff.user_id} value={staff.user_id}>
                {staff.name} (ID: {staff.user_id})
              </option>
            ))}
          </Select>
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Month" 
              type="number" 
              min="1" 
              max="12" 
              value={month} 
              onChange={handleMonthChange}
              required
              aria-label="Salary month"
            />
            <Input 
              label="Year" 
              type="number" 
              min="2020" 
              max="2100"
              value={year} 
              onChange={handleYearChange}
              required
              aria-label="Salary year"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={handleCalculate} loading={loading} disabled={!userId || loading}>
              Calculate
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderStep2 = () => {
    if (!calculatedData) return null;

    // Calculate the new totals based on admin adjustments
    const originalTotalDeductions = calculatedData.total_deductions;
    const newTotalDeductions = Object.values(adjustedDeductions).reduce((sum, val) => sum + val, 0);
    const newNetSalary = calculatedData.basic_salary - newTotalDeductions;
    const hasExcessiveDeductions = newTotalDeductions > calculatedData.basic_salary;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Step 2: Review & Adjust Deductions</h3>
        <p className="text-sm text-gray-500">
          Review the system-calculated deductions for <strong>{calculatedData.user_name}</strong>. You can override any amount before finalizing.
        </p>
        
        {validationError && (
          <Alert type="error" message={validationError} onClose={() => setValidationError('')} />
        )}

        {hasExcessiveDeductions && (
          <Alert 
            type="warning" 
            message="Warning: Total deductions exceed basic salary. Please adjust the amounts." 
          />
        )}
        
        {/* Render editable deduction fields */}
        <div className="space-y-3 rounded-lg border p-4">
          {Object.keys(calculatedData.deductions).map(key => {
            const item = calculatedData.deductions[key];
            const formattedName = formatDeductionName(key);
            return (
              <Input
                key={key}
                label={`${formattedName} (System: ${formatCurrency(item.amount)})`}
                type="number"
                step="0.01"
                min="0"
                value={adjustedDeductions[key]}
                onChange={(e) => handleDeductionChange(key, e.target.value)}
                aria-label={`Adjust ${formattedName}`}
              />
            );
          })}
        </div>

        {/* Summary of changes */}
        <div className="space-y-2 rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Basic Salary:</span>
            <span className="font-medium">{formatCurrency(calculatedData.basic_salary)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Original Total Deductions:</span>
            <span className="font-medium text-gray-700">{formatCurrency(originalTotalDeductions)}</span>
          </div>
          <div className={`flex justify-between text-md font-semibold ${hasExcessiveDeductions ? 'text-red-600' : 'text-orange-600'}`}>
            <span>New Total Deductions:</span>
            <span>{formatCurrency(newTotalDeductions)}</span>
          </div>
          <hr className="my-2"/>
          <div className={`flex justify-between text-lg font-bold ${hasExcessiveDeductions ? 'text-red-600' : 'text-green-700'}`}>
            <span>New Net Salary:</span>
            <span>{formatCurrency(newNetSalary)}</span>
          </div>
        </div>
        
        <Input 
          label="Notes (Optional)" 
          placeholder="e.g., First-time late, giving some relief" 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)}
          aria-label="Add notes for salary adjustment"
        />
        
        <div className="pt-4 flex justify-between">
          <Button variant="outline" onClick={() => setStep(1)} disabled={loading}>
            Back
          </Button>
          <Button 
            onClick={handleAdjustAndFinalize} 
            loading={loading}
            disabled={loading || hasExcessiveDeductions}
          >
            Save & Finalize Salary
          </Button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-4 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">Salary Finalized!</h3>
      <p className="text-sm text-gray-500">
        Salary slip (ID: {finalizedData.salary_history_id}) has been successfully created for <strong>{calculatedData.user_name}</strong> with a net pay of <strong>{formatCurrency(finalizedData.net_salary)}</strong>.
      </p>
      <div className="pt-4 flex justify-end">
        <Button onClick={onSalaryFinalized}>
          Close
        </Button>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Calculate New Salary" size="lg">
      <div className="p-1">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        
        {/* Full modal loading (e.g., when loading staff list) */}
        {loading && step === 1 && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <Loader2 size={32} className="animate-spin text-orange-600" />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CalculateSalaryModal;