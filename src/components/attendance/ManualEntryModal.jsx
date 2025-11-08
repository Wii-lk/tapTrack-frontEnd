import React, { useState, useEffect } from 'react'; // Import useEffect
import Modal from '../common/Modal'; 
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { attendanceService } from '../../services/attendanceService';
import Alert from '../common/Alert';

const getInitialState = () => ({
  user_id: '',
  date: new Date().toISOString().split('T')[0], // Prefill today
  status: 'present',
  check_in_time: '',
  check_out_time: '',
  notes: '',
});

// Helper to format "HH:MM:SS" to "HH:MM" for time input
const formatTimeForInput = (timeString) => {
  if (!timeString) return '';
  const parts = timeString.split(':');
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return '';
};

/**
 * Modal for Manual Attendance Override
 * (Now supports editing)
 */
// Add recordToEdit prop
const ManualEntryModal = ({ isOpen, onClose, onSave, recordToEdit }) => {
  const [formData, setFormData] = useState(getInitialState());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if we are in "Edit" mode
  const isEditMode = Boolean(recordToEdit);

  // UseEffect to pre-fill the form when recordToEdit changes
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        user_id: recordToEdit.user_id || '',
        date: recordToEdit.date || new Date().toISOString().split('T')[0],
        status: recordToEdit.status || 'present',
        check_in_time: formatTimeForInput(recordToEdit.check_in_time),
        check_out_time: formatTimeForInput(recordToEdit.check_out_time),
        notes: recordToEdit.notes || '',
      });
    } else {
      // Reset to initial state when in "Add New" mode
      setFormData(getInitialState());
    }
  }, [recordToEdit, isOpen]); // Rerun when modal opens or record changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Format times to include seconds (HH:MM:SS) if entered
    const dataToSend = { ...formData };
    if (dataToSend.check_in_time) dataToSend.check_in_time += ':00';
    if (dataToSend.check_out_time) dataToSend.check_out_time += ':00';
    
    try {
      // Re-use the same function for create and update
      const res = await attendanceService.manualOverride(dataToSend);
      if (res.success) {
        setSuccess(isEditMode ? 'Record updated successfully!' : 'Record created successfully!');
        onSave(res.data); // Pass back the new/updated record
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setFormData(getInitialState());
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={isEditMode ? 'Edit Attendance Record' : 'Manual Attendance Entry'} 
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="User ID *"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            type="number"
            // Disable User ID and Date in edit mode, as they are the identifiers
            disabled={isEditMode}
          />
          <Input
            label="Date *"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            disabled={isEditMode}
          />
          <Select
            label="Status *"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="half_day">Half Day</option>
            <option value="leave">Leave</option>
            <option value="holiday">Holiday</option>
          </Select>
          <Input
            label="Check-In Time"
            name="check_in_time"
            type="time"
            value={formData.check_in_time}
            onChange={handleChange}
          />
          <Input
            label="Check-Out Time"
            name="check_out_time"
            type="time"
            value={formData.check_out_time}
            onChange={handleChange}
          />
          <div className="md:col-span-2">
            <Input
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g., Manually marked by admin"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {isEditMode ? 'Update Record' : 'Save Record'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ManualEntryModal;