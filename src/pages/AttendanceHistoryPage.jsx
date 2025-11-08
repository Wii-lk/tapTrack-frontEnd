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
    // (Your existing export logic here)
    if (historyRecords.length === 0) {
      alert('No data to export.');
      return;
    }
    const headers = ['UserID', 'UserName', 'Date', 'Status', 'CheckInTime', 'CheckOutTime', 'Notes'];
    const csvRows = historyRecords.map(r => [r.user_id, `"${r.user_name}"`, r.date, r.status, r.check_in_time || '', r.check_out_time || '', `"${r.notes || ''}"`].join(','));
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-IS-8859-1;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'attendance_history.csv');
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
        <HistoryFilters 
          onSearch={handleSearch} 
          loading={loading} 
          onExport={handleExport} 
        />
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