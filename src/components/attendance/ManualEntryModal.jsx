import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import { attendanceService } from "../../services/attendanceService";
import teacherService from "../../services/teacherService";
import Alert from "../common/Alert";
import { Search, User, Check } from "lucide-react";

const getInitialState = () => ({
  user_id: "",
  date: new Date().toISOString().split("T")[0], // Prefill today
  status: "present",
  check_in_time: "",
  check_out_time: "",
  notes: "",
});

// Helper to format "HH:MM:SS" to "HH:MM" for time input
const formatTimeForInput = (timeString) => {
  if (!timeString) return "";
  const parts = timeString.split(":");
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return "";
};

/**
 * Modal for Manual Attendance Override
 */
const ManualEntryModal = ({ isOpen, onClose, onSave, recordToEdit }) => {
  const [formData, setFormData] = useState(getInitialState());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Staff Selection States
  const [staffList, setStaffList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Check if we are in "Edit" mode
  const isEditMode = Boolean(recordToEdit);

  // UseEffect to pre-fill the form when recordToEdit changes
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        user_id: recordToEdit.user_id || "",
        date: recordToEdit.date || new Date().toISOString().split("T")[0],
        status: recordToEdit.status || "present",
        check_in_time: formatTimeForInput(recordToEdit.check_in_time),
        check_out_time: formatTimeForInput(recordToEdit.check_out_time),
        notes: recordToEdit.notes || "",
      });
    } else {
      // Reset to initial state when in "Add New" mode
      setFormData(getInitialState());
    }
  }, [recordToEdit, isOpen]);

  // Load Staff List on Mount/Open
  useEffect(() => {
    if (isOpen) {
      fetchStaffList();
    }
  }, [isOpen]);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) fetchStaffList(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchStaffList = async (query = "") => {
    setLoadingStaff(true);
    try {
      // Fetch active staff, page 1, 50 items (increase if needed)
      const res = await teacherService.getTeachers(1, 100, {
        search: query,
        is_active: true,
      });
      if (res.success) {
        setStaffList(res.data.teachers);
      }
    } catch (err) {
      console.error("Failed to load staff", err);
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStaffSelect = (staff) => {
    // If editing, maybe we don't allow changing user? Or do we?
    if (!isEditMode) {
      setFormData({ ...formData, user_id: staff.user_id });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.user_id) {
      setError("Please select a staff member.");
      setLoading(false);
      return;
    }

    // Format times to include seconds (HH:MM:SS) if entered
    const dataToSend = { ...formData };
    if (dataToSend.check_in_time) dataToSend.check_in_time += ":00";
    if (dataToSend.check_out_time) dataToSend.check_out_time += ":00";

    try {
      // Re-use the same function for create and update
      const res = await attendanceService.manualOverride(dataToSend);
      if (res.success) {
        setSuccess(
          isEditMode
            ? "Record updated successfully!"
            : "Record created successfully!",
        );
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
    setError("");
    setSuccess("");
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Attendance Record" : "Manual Attendance Entry"}
      size="xl" // Increased size for side-by-side layout
    >
      <div className="flex flex-col md:flex-row gap-6 h-[500px]">
        {/* LEFT COLUMN: User Selection List */}
        <div className="w-full md:w-1/3 flex flex-col border-r pr-4 border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-2">
            1. Select Staff Member
          </h3>

          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search name or ID..."
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isEditMode}
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto border rounded-lg bg-gray-50">
            {loadingStaff ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                Loading...
              </div>
            ) : staffList.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                No staff found.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {staffList.map((staff) => {
                  const isSelected =
                    String(formData.user_id) === String(staff.user_id);
                  return (
                    <button
                      key={staff.id}
                      type="button"
                      onClick={() => handleStaffSelect(staff)}
                      disabled={isEditMode}
                      className={`w-full text-left p-3 flex items-center gap-3 hover:bg-white transition-colors
                                        ${isSelected ? "bg-blue-50 border-l-4 border-blue-500" : ""}
                                        ${isEditMode && !isSelected ? "opacity-50 cursor-not-allowed" : ""}
                                    `}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                        ${isSelected ? "bg-blue-200 text-blue-700" : "bg-gray-200 text-gray-600"}
                                    `}
                      >
                        {staff.fullName
                          ? staff.fullName.substring(0, 2).toUpperCase()
                          : "NA"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${isSelected ? "text-blue-700" : "text-gray-700"}`}
                        >
                          {staff.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {staff.user_id}
                        </p>
                      </div>
                      {isSelected && (
                        <Check size={16} className="text-blue-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {isEditMode && (
            <p className="text-xs text-gray-400 mt-2 italic">
              User cannot be changed in edit mode.
            </p>
          )}
        </div>

        {/* RIGHT COLUMN: Form Details */}
        <div className="w-full md:w-2/3 flex flex-col">
          <h3 className="font-semibold text-gray-700 mb-4">
            2. Enter Attendance Details
          </h3>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}

            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {/* Visual confirmation of selected user */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-3">
                <User className="text-blue-500" size={20} />
                <div>
                  <p className="text-xs text-blue-500 font-bold uppercase tracking-wide">
                    Selected User ID
                  </p>
                  <p className="text-lg font-mono font-semibold text-blue-800">
                    {formData.user_id || "---"}
                  </p>
                  {!formData.user_id && (
                    <p className="text-xs text-red-400">
                      Please select a user from the list.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={!formData.user_id && !loading}
              >
                {isEditMode ? "Update Record" : "Save Record"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ManualEntryModal;
