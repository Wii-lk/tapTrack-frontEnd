/**
 * Salary Service
 * Manages all API requests for the new Salary Management workflow.
 * (Calculate, Adjust, Finalize, Mark Paid, History)
 */

// Base URL for your API
const API_BASE_URL = "https://phoenixedubackend.dpdns.org/api";
// const API_BASE_URL = "http://localhost:8000/api";

// Set to true to use mock data
export const USE_MOCK_DATA = false;

// --------------------------------------------------------------------------
// --- MOCK DATA ---
// --------------------------------------------------------------------------

const MOCK_STAFF_LIST = [
  { user_id: 5, name: 'John Doe', role: 'Teacher', basic_salary: 50000.00 },
  { user_id: 102, name: 'Mrs. Suneetha Peris', role: 'Principal', basic_salary: 80000.00 },
  { user_id: 103, name: 'Mr. Kamal Dias', role: 'Teacher', basic_salary: 50000.00 },
];

const MOCK_CALCULATED_SALARY = {
  "user_id": 5,
  "user_name": "John Doe",
  "month": 10,
  "year": 2025,
  "basic_salary": 50000.00,
  "deductions": {
    "late_penalty": { "days": 3, "total_minutes": 95, "amount": 4750.00 },
    "absence_deduction": { "days": 0, "amount": 0.00, "note": "1 day was approved sick leave" },
    "half_day_deduction": { "days": 1, "amount": 833.33 },
    "leave_deduction": { "days": 1, "leave_type": "Unpaid Leave", "amount": 1666.67 }
  },
  "total_deductions": 7250.00,
  "net_salary": 42750.00,
  "attendance_summary": {
    "total_working_days": 25, "present": 22, "late": 3, "absent": 1, "half_day": 1, "leave": 1, "attendance_percentage": 96.00
  }
};

const MOCK_ADJUSTED_SALARY = {
  "total_deductions": 4833.33,
  "net_salary": 45166.67
};

const MOCK_FINALIZED_SALARY = {
  "salary_history_id": 123,
  "user_id": 5,
  "month": 10,
  "year": 2025,
  "net_salary": 45166.67,
  "status": "finalized",
  "created_at": "2025-10-14T18:00:00Z"
};

const MOCK_SALARY_HISTORY = {
  "salaries": [
    {
      "id": 123, "user_id": 5, "user_name": "John Doe", "month": 10, "year": 2025,
      "basic_salary": 50000.00, "total_deductions": 4833.33, "net_salary": 45166.67,
      "status": "paid", "created_at": "2025-10-14T18:00:00Z", "paid_at": "2025-10-30T10:00:00Z"
    },
    {
      "id": 115, "user_id": 5, "user_name": "John Doe", "month": 9, "year": 2025,
      "basic_salary": 50000.00, "total_deductions": 1500.00, "net_salary": 48500.00,
      "status": "finalized", "created_at": "2025-09-15T18:00:00Z", "paid_at": null
    }
  ],
  "pagination": { "currentPage": 1, "totalPages": 1 }
};

const MOCK_PAID_SALARY = {
  "id": 123,
  "status": "paid",
  "paid_at": "2025-10-30T10:00:00Z",
  "paid_by": 1
};

// --------------------------------------------------------------------------
// --- SALARY SERVICE OBJECT ---
// --------------------------------------------------------------------------

export const salaryService = {
  getStaffList: async () => {
    if (USE_MOCK_DATA) {
      return new Promise(res => setTimeout(() => res({ success: true, data: MOCK_STAFF_LIST }), 300));
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/staff`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
      });

      const res = await response.json();
      console.log("🔹 API RESPONSE:", res);

      if (!response.ok) throw new Error(res.message || 'Failed to fetch staff list');

      let rawList = [];

      if (res.data && Array.isArray(res.data.staff)) {
        rawList = res.data.staff;
      }
      else if (res.data && Array.isArray(res.data.data)) {
        rawList = res.data.data;
      }
      else if (Array.isArray(res.data)) {
        rawList = res.data;
      }

      const adaptedList = rawList.map(item => {
        const firstName = item.first_name || item.user?.first_name || '';
        const lastName = item.last_name || item.user?.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();

        return {
          user_id: item.user_id || item.id,
          employee_no: item.employee_no || item.unique_no,
          first_name: firstName,
          last_name: lastName,
          name: fullName || item.user?.name || item.name || 'N/A',
          email: item.email || item.user?.email || 'N/A',
          role: item.position || item.role || 'N/A',
          basic_salary: parseFloat(item.basic_salary || 0)
        };
      });

      return { success: true, data: adaptedList };

    } catch (error) {
      console.error("getStaffList Error:", error);
      return { success: false, data: [] };
    }
  },


  /**
   * 1. POST /api/salary/calculate
   * Calculates a draft salary for a user.
   */
  calculateSalary: async (calculationRequest) => {
    // calculationRequest = { user_id, month, year }
    if (USE_MOCK_DATA) {
      console.log('MOCK: POST /api/salary/calculate', calculationRequest);
      return new Promise(res => setTimeout(() => res({ success: true, data: MOCK_CALCULATED_SALARY }), 800));
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/salary/calculate`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(calculationRequest),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to calculate salary');
      return data;
    } catch (error) {
      console.error("calculateSalary Error:", error);
      throw new Error(error.message);
    }
  },

  /**
   * 2. POST /api/salary/adjust
   * Sends the admin-edited deduction amounts.
   */
  adjustSalary: async (adjustmentRequest) => {
    // adjustmentRequest = { user_id, month, year, deductions, notes }
    if (USE_MOCK_DATA) {
      console.log('MOCK: POST /api/salary/adjust', adjustmentRequest);
      // We update the mock calculated salary with the new totals
      MOCK_CALCULATED_SALARY.total_deductions = MOCK_ADJUSTED_SALARY.total_deductions;
      MOCK_CALCULATED_SALARY.net_salary = MOCK_ADJUSTED_SALARY.net_salary;
      return new Promise(res => setTimeout(() => res({
        success: true,
        message: 'Salary adjusted (Mock)',
        data: MOCK_ADJUSTED_SALARY
      }), 600));
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/salary/adjust`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adjustmentRequest),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to adjust salary');
      return data;
    } catch (error) {
      console.error("adjustSalary Error:", error);
      throw new Error(error.message);
    }
  },

  /**
   * 3. POST /api/salary/finalize
   * Finalizes the salary calculation.
   */
  finalizeSalary: async (finalizeRequest) => {
    // finalizeRequest = { user_id, month, year, basic_salary, deductions_json, net_salary, notes }
    if (USE_MOCK_DATA) {
      console.log('MOCK: POST /api/salary/finalize', finalizeRequest);
      return new Promise(res => setTimeout(() => res({
        success: true,
        message: 'Salary finalized (Mock)',
        data: MOCK_FINALIZED_SALARY
      }), 600));
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/salary/finalize`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalizeRequest),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to finalize salary');
      return data;
    } catch (error) {
      console.error("finalizeSalary Error:", error);
      throw new Error(error.message);
    }
  },

  /**
   * 4. PUT /api/salary/{id}/mark-paid
   * Marks a finalized salary as paid.
   */
  markSalaryPaid: async (salaryHistoryId, paymentData) => {
    // paymentData = { payment_date, notes }
    if (USE_MOCK_DATA) {
      console.log('MOCK: PUT /api/salary/{id}/mark-paid', { salaryHistoryId, paymentData });
      return new Promise(res => setTimeout(() => res({
        success: true,
        message: 'Salary marked as paid (Mock)',
        data: MOCK_PAID_SALARY
      }), 500));
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/salary/${salaryHistoryId}/mark-paid`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to mark as paid');
      return data;
    } catch (error) {
      console.error("markSalaryPaid Error:", error);
      throw new Error(error.message);
    }
  },

  /**
   * 5. GET /api/salary/history
   * Gets the list of past salary records.
   */
  getSalaryHistory: async (filters = {}, page = 1) => {
    if (USE_MOCK_DATA) {
      console.log('MOCK: GET /api/salary/history', { filters, page });
      return new Promise(res => setTimeout(() => res({
        success: true,
        data: MOCK_SALARY_HISTORY
      }), 700));
    }

    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page,
        per_page: 10,
        ...filters
      });
      const response = await fetch(`${API_BASE_URL}/salary/history?${queryParams}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to get salary history');
      return data;
    } catch (error) {
      console.error("getSalaryHistory Error:", error);
      throw new Error(error.message);
    }
  },
  getStaffSalaryList: async () => {
    return salaryService.getStaffList();
  },
};