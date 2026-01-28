import React, { useState, useEffect, useCallback } from 'react';
import { UserMinus } from 'lucide-react';

import { attendanceService } from '../services/attendanceService';
import Alert from '../components/common/Alert';
import LeaveTable from '../components/attendance/LeaveTable';

const LeaveManagementPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLeaveType, setSelectedLeaveType] = useState(''); 
  const [selectedStaff, setSelectedStaff] = useState(new Set());

  // --- DATA FETCHING ---

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await attendanceService.getStaffList();
      if (res.success) {
        setStaffList(res.data || []);
      }
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  const fetchLeaveTypes = useCallback(async () => {
    try {
      const res = await attendanceService.getLeaveTypes();
      if (res.success) {
        const types = res.data?.exceptions || res.data?.leave_types || [];
        setLeaveTypes(types);
      }
    } catch (err) { 
      console.error('Failed to fetch leave types:', err);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
    fetchLeaveTypes();
  }, [fetchStaff, fetchLeaveTypes]);

  // --- HANDLERS ---

  const handleSelectionChange = (staffIdOrAction, isChecked, filteredIds = []) => {
    const newSelection = new Set(selectedStaff); 
    if (staffIdOrAction === 'batch') {
      if (isChecked) {
        filteredIds.forEach(id => newSelection.add(id));
      } else {
        filteredIds.forEach(id => newSelection.delete(id));
      }
    } else {
      const staffId = staffIdOrAction;
      if (isChecked) {
        newSelection.add(staffId);
      } else {
        newSelection.delete(staffId);
      }
    }
    setSelectedStaff(newSelection);
  };

  // ✅ UPDATED: Matching the PHP Validation Rules Exactly
  const handleSubmit = async () => {
    if (selectedStaff.size === 0) {
      setError('Please select at least one staff member.');
      return;
    }

    if (!selectedLeaveType) {
      setError('Please select a leave type.');
      return;
    }

    setSubmitLoading(true);
    setError('');
    setSuccess('');

    // 1. Find the leave type object to get a description text
    const leaveTypeObj = leaveTypes.find(t => String(t.id) === String(selectedLeaveType));
    
    // Default description if none found (e.g. "Medical Leave")
    const descriptionText = leaveTypeObj 
      ? (leaveTypeObj.description || leaveTypeObj.name || 'Leave Assigned') 
      : 'Leave Assignment';

    // 🟢 CONSTRUCT PAYLOAD BASED ON YOUR PHP VALIDATION
    /* $validated = $request->validate([
           'date' => 'required|date',
           'leave_type_id' => 'required|exists:leave_types,id',
           'applies_to' => 'required|in:all,staff_only,specific_users',
           'description' => 'required|string|max:255',
           'user_ids' => 'required_if:applies_to,specific_users|array',
       ]);
    */
    const payload = {
      date: selectedDate,
      leave_type_id: parseInt(selectedLeaveType), // Matches 'leave_type_id'
      applies_to: 'specific_users',               // Matches 'applies_to'
      description: descriptionText,               // Matches 'description'
      user_ids: Array.from(selectedStaff)         // Matches 'user_ids' array
    };

    console.log('🚀 Sending Validated Payload:', payload);

    try {
      const response = await attendanceService.createLeave(payload);
      
      console.log('✅ Success:', response);
      
      setSuccess(
        `${selectedStaff.size} staff member(s) marked as on leave for ${selectedDate}.`
      );
      setSelectedStaff(new Set());
    } catch (err) {
      console.error('❌ Error creating leave records:', err.message);
      setError(`Failed to create leave records. ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };
  
  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3">
        <UserMinus size={28} className="text-gray-700" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leave Management</h2>
          <p className="text-gray-600 mt-1">Select a date, leave type, and mark staff members as on leave.</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      
      <LeaveTable 
        staffList={staffList}
        loading={loading}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedStaff={selectedStaff}
        onSelectionChange={handleSelectionChange}
        onSubmit={handleSubmit}
        submitLoading={submitLoading}
        leaveTypes={leaveTypes}              
        selectedLeaveType={selectedLeaveType} 
        onLeaveTypeChange={setSelectedLeaveType} 
      />
    </div>
  );
};

export default LeaveManagementPage;