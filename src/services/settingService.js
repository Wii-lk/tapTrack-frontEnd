/**
 * Settings Service
 * Manages System Configuration and Salary Rules
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
// const API_BASE_URL = "http://localhost:8000/api";
export const USE_MOCK_DATA = false; // Toggle for backend integration

// --- MOCK DATA ---
const MOCK_SETTINGS = {
  "settings": [
    {
      "key": "school_start_time",
      "value": "08:00:00",
      "description": "Official school start time",
      "data_type": "time"
    },
    {
      "key": "late_threshold_minutes",
      "value": "15",
      "description": "Grace period before marking late",
      "data_type": "int"
    },
    {
      "key": "late_penalty_per_minute",
      "value": "50.00",
      "description": "Deduction per minute late (LKR)",
      "data_type": "decimal"
    }
  ]
};

const MOCK_SALARY_RULES = {
  "rules": [
    {
      "id": 1,
      "name": "Late Penalty",
      "rule_type": "late_penalty",
      "calculation_type": "per_minute",
      "value": 50.00,
      "is_active": true
    },
    {
      "id": 2,
      "name": "Absence Deduction",
      "rule_type": "absence",
      "calculation_type": "per_day",
      "value": 2000.00,
      "is_active": true
    },
    {
      "id": 3,
      "name": "EPF Contribution",
      "rule_type": "tax",
      "calculation_type": "percentage",
      "value": 8.00,
      "is_active": true
    }
  ]
};

export const settingsService = {

  // --- System Settings Endpoints ---

  /**
   * GET /api/settings
   */
  getAllSettings: async () => {
    if (USE_MOCK_DATA) {
      return new Promise(res => setTimeout(() => res({ success: true, data: MOCK_SETTINGS }), 500));
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'GET',
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch settings');
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * PUT /api/settings/{key}
   * @param {string} key 
   * @param {string} value 
   */
  updateSetting: async (key, value) => {
    if (USE_MOCK_DATA) {
      console.log(`Mock Update Setting [${key}]:`, value);
      return new Promise(res => setTimeout(() => res({
        success: true,
        message: "Setting updated successfully",
        data: { key, value, updated_at: new Date().toISOString() }
      }), 600));
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update setting');
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // --- Salary Rules Endpoints ---

  /**
   * GET /api/salary-rules
   */
  getAllSalaryRules: async () => {
    if (USE_MOCK_DATA) {
      return new Promise(res => setTimeout(() => res({ success: true, data: MOCK_SALARY_RULES }), 500));
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/salary-rules`, {
        method: 'GET',
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch rules');
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * PUT /api/salary-rules/{id}
   * @param {number} id 
   * @param {Object} payload { value: number, is_active: boolean }
   */
  updateSalaryRule: async (id, payload) => {
    if (USE_MOCK_DATA) {
      console.log(`Mock Update Rule ID [${id}]:`, payload);
      return new Promise(res => setTimeout(() => res({
        success: true,
        message: "Salary rule updated successfully",
        data: { id, ...payload, updated_at: new Date().toISOString() }
      }), 600));
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/salary-rules/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update rule');
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};