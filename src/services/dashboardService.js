/**
 * Dashboard Service
 * Handles Dashboard Summary and Report Data
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// const API_BASE_URL = "http://localhost:8000/api";
export const USE_MOCK_DATA = false; 

// --- MOCK DATA (Keep for fallback) ---
const MOCK_DASHBOARD_STATS = {
  "today": { "date": "2025-10-14", "total_users": 378, "present": 320, "late": 15, "absent": 30, "currently_inside": 245 },
  "financial": { "outstanding_fees": 425000.00, "fees_collected_this_month": 1200000.00, "salaries_pending": 15, "total_salary_pending": 675000.00 },
  "quick_stats": { "total_staff": 70, "total_students": 308 }
};

const MOCK_REVENUE_CHART = {
  "daily_collection": [
    { "date": "2025-10-01", "amount": 125000.00 },
    { "date": "2025-10-02", "amount": 85000.00 }
  ]
};

const MOCK_CURRENT_PRESENCE = {
  "total_inside": 245,
  "breakdown": { "students": 210, "staff": 35 },
  "recent_activity": [
    { "id": 1, "name": "Kasun Perera", "role": "Student", "time": "08:15 AM", "status": "in", "grade": "10-A" },
    { "id": 2, "name": "Mrs. Silva", "role": "Staff", "time": "08:12 AM", "status": "in", "grade": null }
  ]
};

export const dashboardService = {

  /**
   * GET /api/dashboard
   * Main summary stats
   */
  getDashboardStats: async () => {
    if (USE_MOCK_DATA) {
      return new Promise(res => setTimeout(() => res({ success: true, data: MOCK_DASHBOARD_STATS }), 600));
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: 'GET',
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      const res = await response.json();
      
      console.log("📊 DASHBOARD STATS RAW:", res);

      if (!response.ok) throw new Error(res.message || 'Failed to fetch dashboard');

      // Unpack data safely
      let statsData = res.data || res;
      
      return { success: true, data: statsData };
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
      return { success: false, message: error.message };
    }
  },

  /**
   * GET /api/reports/fee-collection
   * Used specifically for the Revenue Chart
   */
  getRevenueChartData: async () => {
    if (USE_MOCK_DATA) {
      return new Promise(res => setTimeout(() => res({ success: true, data: MOCK_REVENUE_CHART }), 800));
    }

    try {
      // 1. Calculate Date Range (Current Month)
      const today = new Date();
      // Format: YYYY-MM-DD
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('en-CA');
      const lastDay = today.toLocaleDateString('en-CA');

      console.log(`📈 Fetching Chart for: ${firstDay} to ${lastDay}`);

      const token = localStorage.getItem("token");
      const url = `${API_BASE_URL}/reports/fee-collection?from_date=${firstDay}&to_date=${lastDay}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      
      const res = await response.json();
      console.log("📈 CHART RAW RESPONSE:", res);

      if (!response.ok) throw new Error(res.message || 'Failed to fetch chart data');

      // 2. Safe Data Extraction
      // The controller returns: { success: true, data: { daily_collection: [...] } }
      let chartData = { daily_collection: [] };

      if (res.data && Array.isArray(res.data.daily_collection)) {
        chartData = res.data;
      } else if (res.daily_collection) {
        chartData = res;
      }

      // 3. Handle Empty Data (Visual Fix)
      if (chartData.daily_collection.length === 0) {
        console.warn("⚠️ Chart data is empty. Check if database has payments for THIS MONTH.");
      }

      return { success: true, data: chartData };

    } catch (error) {
      console.error("Chart Data Error:", error);
      // Return empty structure so app doesn't crash
      return { success: false, data: { daily_collection: [] } }; 
    }
  },

  getCurrentPresence: async () => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, data: MOCK_CURRENT_PRESENCE });
        }, 400);
      });
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/attendance/current-presence`, {
        method: "GET",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch current presence");
      }

      return data;
    } catch (error) {
      // Return safe fallback so dashboard doesn't crash
      return { success: false, data: MOCK_CURRENT_PRESENCE }; 
    }
  },

  /**
   * GET /api/dashboard/attendance-details
   * Fetch detailed present/absent lists for popup
   */
  getAttendanceDetails: async () => {
    if (USE_MOCK_DATA) {
        // Mock Response similar to backend structure
        return new Promise(res => setTimeout(() => res({
            success: true,
            data: {
                overview: { student_total: 100, student_present: 80, staff_total: 20, staff_present: 15 },
                students: { present: [], absent: [] },
                staff: { present: [], absent: [] }
            }
        }), 500));
    }

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/dashboard/attendance-details`, {
            method: "GET",
            headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch details");
        return data;
    } catch (error) {
        console.error("Attendance Details Error:", error);
        return { success: false, message: error.message };
    }
  }
};

export default dashboardService;