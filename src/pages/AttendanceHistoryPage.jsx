import React, { useState, useEffect, useCallback } from 'react';
import { Clock } from 'lucide-react';
import { attendanceService } from '../services/attendanceService';
import Alert from '../components/common/Alert';
import Pagination from '../components/common/Pagination';
import HistoryFilters from '../components/attendance/HistoryFilters';
import HistoryTable from '../components/attendance/HistoryTable';
// Import the modals
import ManualEntryModal from '../components/attendance/ManualEntryModal';
import DeleteAttendanceModal from '../components/attendance/DeleteAttendanceModal';

/**
 * New Standalone Page for Attendance History
 * (Now with Edit/Delete functionality)
 */
const AttendanceHistoryPage = () => {
  // Common State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // For success messages

  // "History" State
  const [historyRecords, setHistoryRecords] = useState([]);
  const [teacherReport, setTeacherReport] = useState([]); // 🟢 NEW: State for Excel export
  const [historyPagination, setHistoryPagination] = useState(null);
  const [historyFilters, setHistoryFilters] = useState({});
  const [historyPage, setHistoryPage] = useState(1);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // --- DATA FETCHING ---

  // Fetch History
  const fetchHistory = useCallback(async (filters, page) => {
    setLoading(true);
    setError('');
    try {
      const res = await attendanceService.getAttendanceHistory(filters, page);
      if (res.success) {
        setHistoryRecords(res.data.attendance);
        setHistoryPagination(res.data.pagination);
        setTeacherReport(res.data.teacher_report || []); // 🟢 NEW: Save the report data
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  // Effect to load data when filters or page change
  useEffect(() => {
    fetchHistory(historyFilters, historyPage);
  }, [fetchHistory, historyFilters, historyPage]);


  // --- HANDLERS ---
  const handleSearch = (filters) => {
    setHistoryPage(1); // Reset to first page on new search
    setHistoryFilters(filters);
  };

  const handlePageChange = (page) => {
    setHistoryPage(page);
  };

  const handleExport = () => {
    if (!teacherReport || teacherReport.length === 0) {
      alert('No data to export. Please try searching again.');
      return;
    }

    // 1. Updated headers for the summary view
    const headers = ['Employee ID', 'Name', 'Total Days', 'Days Present', 'Days Absent', 'Days Late'];

    // 2. Map the teacher report data to match the columns
    const csvRows = teacherReport.map(r => [
      r.employee_id || r.user_id, // Uses unique_no, falls back to DB id if null
      `"${r.teacher_name}"`,    // Wrapped in quotes in case a name has a comma
      r.total_days,
      r.present_days,
      r.absent_days,
      r.late_days
    ].join(','));

    // 3. Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // 4. Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);

    // Updated filename to reflect it's a summary
    link.setAttribute('download', `attendance_summary_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- New Handlers for Edit/Delete ---

  const handleEditClick = (record) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (record) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedRecord(null);
  };

  const handleEditSave = () => {
    setSuccess('Record updated successfully!');
    handleModalClose();
    // Refetch the data
    fetchHistory(historyFilters, historyPage);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRecord) return;

    setModalLoading(true);
    setError('');
    try {
      const res = await attendanceService.deleteAttendance(selectedRecord.id);
      if (res.success) {
        setSuccess(res.message);
        handleModalClose();
        // Refetch the data
        fetchHistory(historyFilters, historyPage);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Clock size={28} className="text-gray-700" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Attendance History & Reports</h2>
          <p className="text-gray-600 mt-1">Search and view past attendance records.</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Render the history view */}
      <div className="space-y-6">
        {/* 🟢 FIXED: Changed isLoading to loading */}
        <HistoryFilters onSearch={handleSearch} loading={loading} onExport={handleExport} />
        <HistoryTable
          records={historyRecords}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
        {historyPagination && !loading && historyRecords.length > 0 && (
          <Pagination
            currentPage={historyPagination.currentPage}
            totalPages={historyPagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Render the Modals */}
      <ManualEntryModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSave={handleEditSave}
        recordToEdit={selectedRecord}
      />

      <DeleteAttendanceModal
        isOpen={isDeleteModalOpen}
        onClose={handleModalClose}
        onConfirm={handleDeleteConfirm}
        recordInfo={selectedRecord}
        loading={modalLoading}
      />

    </div>
  );
};

export default AttendanceHistoryPage;