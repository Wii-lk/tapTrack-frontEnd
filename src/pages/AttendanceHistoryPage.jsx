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
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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
  const [summary, setSummary] = useState(null);
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
        setSummary(res.data.summary); // 🟢 NEW: Save the summary data
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

  const handleExport = async () => {
    if (!teacherReport || teacherReport.length === 0) {
      alert('No data to export. Please try searching again.');
      return;
    }

    const fromDate = summary?.date_range?.from || 'Start';
    const toDate = summary?.date_range?.to || 'End';

    // 1. Initialize Workbook and Worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance Summary');

    // 2. Add and Style the Title Row
    worksheet.mergeCells('A1:G1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `Attendance Summary Report: ${fromDate} to ${toDate}`;
    titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } }; // White text
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } }; // Tailwind Blue-600
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 30;

    // 3. Empty Row for spacing
    worksheet.addRow([]);

    // 4. Add and Style Headers
    const headers = ['Employee ID', 'Name', 'Total Days', 'Days Present', 'Days Absent', 'Days Late', 'Half Days'];
    const headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF475569' } }; // Tailwind Slate-600
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    });

    // 5. Map and Add Data Rows
    teacherReport.forEach((r) => {
      const row = worksheet.addRow([
        r.employee_id || r.unique_no || r.user_id,
        r.teacher_name,
        r.total_days,
        r.present_days,
        r.absent_days,
        r.late_days,
        r.half_days
      ]);

      // Add borders and alignment to data cells
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
          left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
          bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
          right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
        };
        // Align numbers to center, names to left
        cell.alignment = { vertical: 'middle', horizontal: colNumber === 2 ? 'left' : 'center' };
      });
    });

    // 6. Set Column Widths so data isn't squished
    worksheet.columns = [
      { width: 25 }, // Employee ID
      { width: 35 }, // Name
      { width: 15 }, // Total Days
      { width: 15 }, // Days Present
      { width: 15 }, // Days Absent
      { width: 15 }, // Days Late
      { width: 15 }, // Half Days
    ];

    // 7. Generate Excel File and Trigger Download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = `attendance_summary_${fromDate}_to_${toDate}.xlsx`; // Note the .xlsx extension!

    saveAs(blob, fileName);
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
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            Search and view past attendance records.
            {/* 🟢 NEW: Date Range Display Chip */}
            {summary?.date_range?.from && summary?.date_range?.to && (
              <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                Data found from: {summary.date_range.from} to {summary.date_range.to}
              </span>
            )}
          </p>
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