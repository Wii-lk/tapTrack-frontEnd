/**
 * Attendance Service
 * This file manages all API requests related to student and staff attendance.
 * It includes functions for fetching today's summary, live presence,
 * attendance history, and posting manual overrides.
 * It can be toggled between (USE_MOCK_DATA = true) and (USE_MOCK_DATA = false).
 */

// Base URL for your API.
// IMPORTANT: Replace 'http://localhost:8000' with your actual API domain.
const API_BASE_URL = 'http://localhost:8000/api';

// --- SERVICE CONFIGURATION ---
// Set to true to use mock data (local) instead of real API calls.
export const USE_MOCK_DATA = true;

// --------------------------------------------------------------------------
// --- MOCK DATA (Used when USE_MOCK_DATA is true) ---
// --------------------------------------------------------------------------

// Mock list of grades, used for filtering and display
export const MOCK_GRADES = [
  { id: 10, name: 'Grade 10-A' },
  { id: 11, name: 'Grade 10-B' },
  { id: 12, name: 'Grade 11-A' },
  { id: 13, name: 'Grade 12-A' },
];

// --- MOCK "DATABASE" for getTodayAttendanceSummary ---
const MOCK_STUDENT_ATTENDANCE_RAW = [
  { id: 1, admissionNo: 'STU001', name: 'Kasun Perera', gradeId: 10, status: 'present', inTime: '07:50:00', outTime: '14:00:00' },
  { id: 2, admissionNo: 'STU002', name: 'Nimal Silva', gradeId: 10, status: 'present', inTime: '07:55:00', outTime: '14:01:00' },
  { id: 3, admissionNo: 'STU003', name: 'Sunil Fernando', gradeId: 11, status: 'absent', inTime: null, outTime: null },
  { id: 4, admissionNo: 'STU004', name: 'Amani Jayalath', gradeId: 12, status: 'late', inTime: '08:15:00', outTime: '14:00:00' },
  { id: 5, admissionNo: 'STU005', name: 'Ruwan Gamage', gradeId: 10, status: 'present', inTime: '07:45:00', outTime: '13:58:00' },
  { id: 6, admissionNo: 'STU006', name: 'Deepa Kumari', gradeId: 13, status: 'half_day', inTime: '07:58:00', outTime: '11:00:00' },
  { id: 7, admissionNo: 'STU007', name: 'Priya Rathnayake', gradeId: 11, status: 'leave', inTime: null, outTime: null },
];

const MOCK_STAFF_ATTENDANCE_RAW = [
  { id: 101, staffId: 'STF001', name: 'Mr. Anura Kumara', role: 'Teacher', status: 'present', inTime: '07:30:00', outTime: '15:00:00' },
  { id: 102, staffId: 'STF002', name: 'Mrs. Suneetha Peris', role: 'Principal', status: 'present', inTime: '07:25:00', outTime: '15:15:00' },
  { id: 103, staffId: 'STF003', name: 'Mr. Kamal Dias', role: 'Teacher', status: 'late', inTime: '08:05:00', outTime: '15:00:00' },
  { id: 104, staffId: 'STF004', name: 'Ms. Janaki Silva', role: 'Librarian', status: 'absent', inTime: null, outTime: null },
];

// --- MOCK "DATABASE" for getCurrentPresence ---
const MOCK_CURRENT_PRESENCE = {
  total_inside: 3,
  staff_inside: 1,
  students_inside: 2,
  users: [
    { user_id: 1, name: 'Kasun Perera', role: 'student', check_in_time: "07:50:00", duration: "5h 10m" },
    { user_id: 2, name: 'Nimal Silva', role: 'student', check_in_time: "07:55:00", duration: "5h 05m" },
    { user_id: 101, name: 'Mr. Anura Kumara', role: 'staff', check_in_time: "07:30:00", duration: "5h 30m" },
  ]
};

// --- MOCK "DATABASE" for getAttendanceHistory ---
const MOCK_ATTENDANCE_HISTORY = {
  attendance: [
    { id: 567, user_id: 5, user_name: "John Doe", date: "2025-10-14", check_in_time: "08:45:00", check_out_time: "16:30:00", status: "late", is_late: true, late_minutes: 30, notes: null },
    { id: 566, user_id: 5, user_name: "John Doe", date: "2025-10-13", check_in_time: "07:58:00", check_out_time: "16:00:00", status: "present", is_late: false, late_minutes: 0, notes: null },
    { id: 565, user_id: 5, user_name: "John Doe", date: "2025-10-12", check_in_time: "08:15:00", check_out_time: "16:05:00", status: "late", is_late: true, late_minutes: 15, notes: null },
    { id: 564, user_id: 5, user_name: "John Doe", date: "2025-10-11", status: "absent", notes: "Sick" },
  ],
  summary: { total_days: 14, present: 10, late: 2, absent: 2, attendance_percentage: 85.71 },
  pagination: { currentPage: 1, perPage: 10, total: 4, totalPages: 1 }
};


/**
 * Mock Helper Function
 * This function takes the raw mock data and transforms it into the 
 * exact API response structure for GET /api/attendance/today.
 * It also applies mock filtering.
 */
const generateMockData = (userType, filters) => {
  const isStudent = userType === 'student';
  const rawData = isStudent ? MOCK_STUDENT_ATTENDANCE_RAW : MOCK_STAFF_ATTENDANCE_RAW;

  // 1. Transform raw data to match the new API "attendance" array structure
  let transformedRecords = rawData.map(record => {
    if (isStudent) {
      return {
        id: record.id,
        user: {
          id: record.id,
          name: record.name,
          role: 'student',
          unique_no: record.admissionNo,
          gradeId: record.gradeId, 
        },
        date: "2025-10-14",
        check_in_time: record.inTime,
        check_out_time: record.outTime,
        status: record.status, 
        is_late: record.status === 'late',
        late_minutes: record.status === 'late' ? 15 : 0,
        notes: null
      };
    } else { // Staff
      return {
        id: record.id,
        user: {
          id: record.id,
          name: record.name,
          role: record.role,
          unique_no: record.staffId,
        },
        date: "2025-10-14",
        check_in_time: record.inTime,
        check_out_time: record.outTime,
        status: record.status,
        is_late: record.status === 'late',
        late_minutes: 20,
        notes: null
      };
    }
  });

  // 2. Apply filters (simulating what the backend would do)
  if (isStudent && filters.grade_id) {
    transformedRecords = transformedRecords.filter(
      record => record.user.gradeId === parseInt(filters.grade_id)
    );
  }

  if (filters.status) {
    transformedRecords = transformedRecords.filter(
      record => record.status === filters.status
    );
  }

  // 3. Apply sorting
  if (filters.sortBy === 'name') {
    transformedRecords.sort((a, b) => a.user.name.localeCompare(b.user.name));
  } else if (filters.sortBy === 'recent') {
    transformedRecords.sort((a, b) => {
      if (!a.check_in_time) return 1; 
      if (!b.check_in_time) return -1;
      return a.check_in_time > b.check_in_time ? 1 : -1; 
    });
  }

  // 4. Generate the summary based on ALL data (not filtered)
  const summary = {
    total_users: rawData.length,
    present: rawData.filter(r => r.status === 'present').length,
    late: rawData.filter(r => r.status === 'late').length,
    absent: rawData.filter(r => r.status === 'absent').length,
    half_day: rawData.filter(r => r.status === 'half_day').length,
    leave: rawData.filter(r => r.status === 'leave').length,
    not_marked: 0
  };

  // 5. Return the complete, new API response structure
  return {
    date: "2025-10-14",
    summary: summary,
    attendance: transformedRecords 
  };
};

// --------------------------------------------------------------------------
// --- ATTENDANCE SERVICE OBJECT ---
// --------------------------------------------------------------------------

export const attendanceService = {
  
  /**
   * Function 1: GET /api/attendance/today
   */
  getTodayAttendanceSummary: async (userType, filters = {}) => {
    
    // --- MOCK DATA PATH ---
    if (USE_MOCK_DATA) {
      console.log('Using MOCK DATA for getTodayAttendanceSummary', { userType, filters });
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockData = generateMockData(userType, filters);
          resolve({ success: true, data: mockData });
        }, 500); 
      });
    }

    // --- REAL API CALL PATH ---
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found. Please log in.");

      const queryParams = new URLSearchParams({ role: userType });
      if (filters.status) {
        queryParams.append("status", filters.status);
      }
      
      const response = await fetch(`${API_BASE_URL}/attendance/today?${queryParams}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch attendance");
      }
      
      // ✅ CORRECTED: Return the API response directly.
      // The API already returns { success: true, data: {...} }
      return data;

    } catch (error) {
      console.error("getTodayAttendanceSummary Error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  },

  /**
   * Function 2: GET /api/attendance/current-presence
   */
  getCurrentPresence: async () => {

    // --- MOCK DATA PATH ---
    if (USE_MOCK_DATA) {
      console.log('Using MOCK DATA for getCurrentPresence');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, data: MOCK_CURRENT_PRESENCE });
        }, 400);
      });
    }

    // --- REAL API CALL PATH ---
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found. Please log in.");

      const response = await fetch(`${API_BASE_URL}/attendance/current-presence`, {
        method: "GET",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch current presence");
      }

      // ✅ CORRECTED: Return the API response directly.
      return data;
    } catch (error) {
      console.error("getCurrentPresence Error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  },

  /**
   * Function 3: GET /api/attendance/history
   */
  getAttendanceHistory: async (filters = {}, page = 1) => {

    // --- MOCK DATA PATH ---
    if (USE_MOCK_DATA) {
      console.log('Using MOCK DATA for getAttendanceHistory', { filters, page });
      return new Promise((resolve) => {
        setTimeout(() => {
          let data = { ...MOCK_ATTENDANCE_HISTORY };
          if (filters.user_id) {
            data.attendance = data.attendance.filter(a => a.user_id === parseInt(filters.user_id));
            data.pagination.total = data.attendance.length;
          }
          data.pagination.currentPage = page;
          resolve({ success: true, data: data });
        }, 600);
      });
    }

    // --- REAL API CALL PATH ---
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found. Please log in.");

      const queryParams = new URLSearchParams({ page, per_page: 10 });
      Object.keys(filters).forEach(key => {
        if (filters[key]) { 
          queryParams.append(key, filters[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/attendance/history?${queryParams}`, {
        method: "GET",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch attendance history");
      }

      // ✅ CORRECTED: Return the API response directly.
      return data;
    } catch (error) {
      console.error("getAttendanceHistory Error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  },

  /**
   * Function 4: POST /api/attendance/manual
   */
  manualOverride: async (attendanceData) => {

    // --- MOCK DATA PATH ---
    if (USE_MOCK_DATA) {
      console.log('Using MOCK DATA for manualOverride', { attendanceData });
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Attendance manually created (Mock)",
            data: { id: Math.floor(Math.random() * 1000) + 700, ...attendanceData },
          });
        }, 700);
      });
    }

    // --- REAL API CALL PATH ---
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found. Please log in.");

      const response = await fetch(`${API_BASE_URL}/attendance/manual`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceData),
      });

      const data = await response.json();
      
      if (!response.ok) {
           if (response.status === 422) {
              const errorMessages = Object.values(data.errors).flat().join(' ');
              throw new Error(errorMessages || 'Validation failed');
           }
           throw new Error(data.message || 'Failed to create attendance record');
      }

      // ✅ CORRECTED: Return the API response directly.
      return data;
    } catch (error) {
      console.error("manualOverride Error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  },


  /**
   * Function 5: DELETE /api/attendance/{id}
   * NOTE: This endpoint is not in your provided documentation.
   * Please confirm it exists on your server.
   */
  deleteAttendance: async (attendanceId) => {
    
    // --- MOCK DATA PATH ---
    if (USE_MOCK_DATA) {
      console.log('Using MOCK DATA for deleteAttendance', { attendanceId });
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Attendance record deleted successfully (Mock)",
          });
        }, 500);
      });
    }

    // --- REAL API CALL PATH ---
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found. Please log in.");

      // ⚠️ WARNING: Assuming endpoint is /api/attendance/{id}
      const response = await fetch(`${API_BASE_URL}/attendance/${attendanceId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
           throw new Error(data.message || 'Failed to delete attendance record');
      }
      
      // ✅ CORRECTED: Return the API response directly.
      return data;
    } catch (error) {
      console.error("deleteAttendance Error:", error);
      throw new Error(error.message || "Network error occurred");
    }
  },

};