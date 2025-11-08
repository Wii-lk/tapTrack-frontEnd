import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, User, Calendar, Clock, Target, Edit } from 'lucide-react';

import { attendanceService } from '../services/attendanceService';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';

// Tab-specific Components
import AttendanceStats from '../components/attendance/attendanceStats';
import AttendanceFilters from '../components/attendance/AttendanceFilters';
import AttendanceTable from '../components/attendance/AttendanceTable';
import PresenceStats from '../components/attendance/PresenceStats';
import PresenceTable from '../components/attendance/PresenceTable';
import HistoryFilters from '../components/attendance/HistoryFilters';
import HistoryTable from '../components/attendance/HistoryTable';
import ManualEntryModal from '../components/attendance/ManualEntryModal';

/**
 * Main AttendanceManagement Page Component
 * (Refactored with Tabbed Views)
 */
const AttendanceManagement = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState('summary',  'presence'); // 'summary', 'presence', 'history'
  const [userType, setUserType] = useState('student'); // 'student' or 'staff'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Common State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // "Today's Summary" State - FIXED: Initialize with proper default values
  const [summaryStats, setSummaryStats] = useState({ 
    total_users: 0, 
    present: 0, 
    absent: 0, 
    late: 0, 
    half_day: 0, 
    leave: 0 
  });
  const [summaryRecords, setSummaryRecords] = useState([]);
  const [summaryFilters, setSummaryFilters] = useState({ grade_id: '', sortBy: 'recent', status: '' });

  // "Who's Inside?" State
  const [presenceStats, setPresenceStats] = useState({ total_inside: 0, staff_inside: 0, students_inside: 0 });
  const [presenceUsers, setPresenceUsers] = useState([]);
  
  // "History" State
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historyPagination, setHistoryPagination] = useState(null);
  const [historyFilters, setHistoryFilters] = useState({});
  const [historyPage, setHistoryPage] = useState(1);
  

  // --- DATA FETCHING ---

  // Fetch Today's Summary - FIXED: Properly handle the response structure
  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await attendanceService.getTodayAttendanceSummary(userType, summaryFilters);
      console.log('Summary Response:', res); // Debug log
      
      if (res.success && res.data) {
        // FIXED: Make sure we're setting the stats from the correct path
        setSummaryStats(res.data.summary || {
          total_users: 0,
          present: 0,
          absent: 0,
          late: 0,
          half_day: 0,
          leave: 0
        });
        setSummaryRecords(res.data.attendance || []);
      }
    } catch (err) { 
      console.error('Fetch Summary Error:', err);
      setError(err.message); 
    } 
    finally { setLoading(false); }
  }, [userType, summaryFilters]);

  // Fetch Who's Inside
  const fetchPresence = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await attendanceService.getCurrentPresence();
      console.log('Presence Response:', res); // Debug log
      
      if (res.success && res.data) {
        setPresenceStats(res.data);
        setPresenceUsers(res.data.users || []);
      }
    } catch (err) { 
      console.error('Fetch Presence Error:', err);
      setError(err.message); 
    } 
    finally { setLoading(false); }
  }, []);

  // Fetch History
  const fetchHistory = useCallback(async (filters, page) => {
    setLoading(true);
    setError('');
    try {
      const res = await attendanceService.getAttendanceHistory(filters, page);
      console.log('History Response:', res); // Debug log
      
      if (res.success && res.data) {
        setHistoryRecords(res.data.attendance || []);
        setHistoryPagination(res.data.pagination || null);
      }
    } catch (err) { 
      console.error('Fetch History Error:', err);
      setError(err.message); 
    } 
    finally { setLoading(false); }
  }, []);

  // Effect to load data when view changes
  useEffect(() => {
    if (currentView === 'summary') {
      fetchSummary();
    } else if (currentView === 'presence') {
      fetchPresence();
    } else if (currentView === 'history') {
      fetchHistory(historyFilters, historyPage);
    }
  }, [currentView, fetchSummary, fetchPresence, fetchHistory, historyFilters, historyPage]);

  // Effect to refetch summary when userType or filters change
  useEffect(() => {
    if (currentView === 'summary') {
      fetchSummary();
    }
  }, [userType, summaryFilters, currentView, fetchSummary]);


  // --- HANDLERS ---
  const handleUserTypeChange = (type) => {
    if (type !== userType) {
      setUserType(type);
      // Reset summary filters when changing user type
      setSummaryFilters({ grade_id: '', sortBy: 'recent', status: '' });
    }
  };

  const handleModalSave = () => {
    // Refresh the view after a manual save
    if (currentView === 'summary') fetchSummary();
    if (currentView === 'presence') fetchPresence();
    if (currentView === 'history') fetchHistory(historyFilters, historyPage);
  };
  
  // --- RENDER HELPERS ---
  const renderView = () => {
    if (currentView === 'summary') {
      return (
        <div className="space-y-6">
          <AttendanceStats stats={summaryStats} userType={userType} />
          <AttendanceFilters
            filters={summaryFilters}
            onFilterChange={(name, value) => setSummaryFilters(prev => ({ ...prev, [name]: value }))}
            userType={userType}
            onExport={() => alert('Exporting summary...')}
          />
          <AttendanceTable records={summaryRecords} loading={loading} userType={userType} />
        </div>
      );
    }

    if (currentView === 'presence') {
      return (
        <div className="space-y-6">
          <PresenceStats stats={presenceStats} />
          <PresenceTable users={presenceUsers} loading={loading} />
        </div>
      );
    }

    if (currentView === 'history') {
      return (
        <div className="space-y-6">
          <HistoryFilters onSearch={(filters) => { setHistoryPage(1); setHistoryFilters(filters); }} loading={loading} />
          <HistoryTable records={historyRecords} loading={loading} />
          {historyPagination && !loading && historyRecords.length > 0 && (
            <Pagination
              currentPage={historyPagination.currentPage}
              totalPages={historyPagination.totalPages}
              onPageChange={(page) => setHistoryPage(page)}
            />
          )}
        </div>
      );
    }
    return null;
  };

  // --- TAB & HEADER COMPONENTS ---
  const ViewTab = ({ view, icon, label }) => {
    const isActive = currentView === view;
    const base = 'flex-1 md:flex-none px-4 py-2.5 text-sm font-medium transition-colors rounded-lg flex items-center justify-center gap-2';
    const active = 'bg-orange-100 text-orange-700 shadow-sm';
    const inactive = 'text-gray-600 hover:bg-gray-100';
    return <button onClick={() => setCurrentView(view)} className={`${base} ${isActive ? active : inactive}`}>{icon}{label}</button>;
  };
  
  const ActiveButton = ({ children, onClick, isActive }) => {
    const base = 'py-2 px-4 rounded-md transition-colors text-sm font-medium';
    const active = 'bg-orange-600 text-white shadow-md';
    const inactive = 'bg-white text-gray-700 hover:bg-gray-100';
    return <button onClick={onClick} className={`${base} ${isActive ? active : inactive}`}>{children}</button>;
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Attendance Management</h2>
          <p className="text-gray-600 mt-1">View attendance data, live presence, and history.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-2">
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            <Edit size={16} className="mr-2" />
            Manual Entry
          </Button>
          
          <div className="flex-shrink-0 bg-white p-1.5 rounded-lg shadow-sm border border-gray-200 flex space-x-2">
            <ActiveButton onClick={() => handleUserTypeChange('student')} isActive={userType === 'student'}>
              <User size={16} className="inline mr-1.5" />
              Students
            </ActiveButton>
            <ActiveButton onClick={() => handleUserTypeChange('staff')} isActive={userType === 'staff'}>
              <Briefcase size={16} className="inline mr-1.5" />
              Staff
            </ActiveButton>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex flex-col md:flex-row gap-2 bg-white p-2 rounded-lg shadow-sm border">
        <ViewTab view="summary" icon={<Calendar size={18} />} label="Today's Summary" />
        {/* <ViewTab view="presence" icon={<Target size={18} />} label="Who's Inside?" /> */}
        {/* <ViewTab view="history" icon={<Clock size={18} />} label="History & Reports" /> */}
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      
      {/* Render the active view */}
      {renderView()}

      {/* Manual Entry Modal */}
      <ManualEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default AttendanceManagement;
