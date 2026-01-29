const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Set to true for temporary mock data
const USE_MOCK_DATA = true;

// Mock data for testing
const MOCK_DASHBOARD_DATA = {
  todayStudentAttendance: {
    present: 450,
    absent: 50,
    total: 500,
    percentage: 90,
  },
  todayTeacherAttendance: {
    present: 45,
    total: 50,
    percentage: 90,
  },
  outstandingFees: {
    amount: 150000,
    currency: 'LKR',
  },
  totalFeesCollected: {
    amount: 850000,
    currency: 'LKR',
    year: new Date().getFullYear(),
  },
  revenueData: [
    { month: 'Jan', revenue: 80000, expenses: 45000 },
    { month: 'Feb', revenue: 85000, expenses: 48000 },
    { month: 'Mar', revenue: 90000, expenses: 50000 },
    { month: 'Apr', revenue: 88000, expenses: 52000 },
    { month: 'May', revenue: 92000, expenses: 51000 },
    { month: 'Jun', revenue: 95000, expenses: 53000 },
    { month: 'Jul', revenue: 98000, expenses: 54000 },
    { month: 'Aug', revenue: 100000, expenses: 55000 },
    { month: 'Sep', revenue: 96000, expenses: 53000 },
    { month: 'Oct', revenue: 99000, expenses: 56000 },
    { month: 'Nov', revenue: 101000, expenses: 57000 },
    { month: 'Dec', revenue: 105000, expenses: 58000 },
  ],
};

const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_DASHBOARD_DATA);
        }, 800);
      });
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard stats');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  // Get student attendance for today
  getTodayStudentAttendance: async () => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_DASHBOARD_DATA.todayStudentAttendance);
        }, 500);
      });
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/attendance/students/today`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch attendance');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  // Get teacher attendance for today
  getTodayTeacherAttendance: async () => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_DASHBOARD_DATA.todayTeacherAttendance);
        }, 500);
      });
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/attendance/teachers/today`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch attendance');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error occurred');
    }
  },
};

export default dashboardService;