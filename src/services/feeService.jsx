/**
 * Fee Service
 * Manages all API requests for the Fee Management workflow.
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const USE_MOCK_DATA = false; // Toggle this for backend integration

// --- MOCK DATA ---
const MOCK_OUTSTANDING_FEES = {
  "students": [
    {
      "student_id": 50,
      "student_name": "Sarah Johnson",
      "grade": "Grade 6-A",
      "total_outstanding": 7000.00,
      "fees": [
        { "id": 234, "month": 9, "year": 2025, "total_amount": 5000.00, "paid_amount": 3000.00, "outstanding": 2000.00, "status": "partial", "due_date": "2025-09-15" },
        { "id": 235, "month": 10, "year": 2025, "total_amount": 5000.00, "paid_amount": 0.00, "outstanding": 5000.00, "status": "unpaid", "due_date": "2025-10-15" }
      ],
      "advance_balance": 0.00
    },
    {
      "student_id": 51,
      "student_name": "Mike Ross",
      "grade": "Grade 7-B",
      "total_outstanding": 5000.00,
      "fees": [
        { "id": 240, "month": 10, "year": 2025, "total_amount": 5000.00, "paid_amount": 0.00, "outstanding": 5000.00, "status": "unpaid", "due_date": "2025-10-15" }
      ],
      "advance_balance": 1500.00
    }
  ],
  "summary": { "total_students_with_dues": 2, "total_outstanding": 12000.00 }
};

const MOCK_PAYMENT_HISTORY = {
  "payments": [
    { "id": 456, "student_id": 50, "student_name": "Sarah Johnson", "amount": 6000.00, "payment_date": "2025-10-14", "payment_method": "cash", "reference_no": null, "received_by": "Admin User", "notes": "Partial payment" },
    { "id": 455, "student_id": 51, "student_name": "Mike Ross", "amount": 5000.00, "payment_date": "2025-10-10", "payment_method": "bank_transfer", "reference_no": "TRX999", "received_by": "Admin User", "notes": "Full Month" }
  ],
  "summary": { "total_payments": 125, "total_amount": 625000.00 },
  "pagination": { "currentPage": 1, "totalPages": 1 }
};

const MOCK_RECEIPT = {
  "receipt_no": "RCP-2025-456",
  "payment_id": 456,
  "date": "2025-10-14",
  "student": { "id": 50, "name": "Sarah Johnson", "grade": "Grade 6-A", "parent_name": "Robert Johnson" },
  "amount_paid": 6000.00,
  "payment_method": "Cash",
  "received_by": "Admin User",
  "allocation": [
    { "month": "September 2025", "fee_amount": 5000.00, "previous_paid": 3000.00, "this_payment": 2000.00, "new_balance": 0.00, "status": "PAID" },
    { "month": "October 2025", "fee_amount": 5000.00, "previous_paid": 0.00, "this_payment": 4000.00, "new_balance": 1000.00, "status": "PARTIAL" }
  ],
  "outstanding_balance": 1000.00
};

export const feeService = {

  /**
   * GET /api/fees/outstanding
   * Supports filtering by student_id for the Payment Form
   */
  getOutstandingFees: async (studentId = null) => {
    if (USE_MOCK_DATA) {
      // Basic mock filtering
      let data = { ...MOCK_OUTSTANDING_FEES };
      if (studentId) {
        data.students = data.students.filter(s => s.student_id.toString() === studentId.toString());
      }
      return new Promise(res => setTimeout(() => res({ success: true, data }), 500));
    }

    try {
      const token = localStorage.getItem("token");
      let url = `${API_BASE_URL}/fees/outstanding`;
      if (studentId) url += `?student_id=${studentId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch outstanding fees');
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * POST /api/fees/payment
   */
  processPayment: async (paymentPayload) => {
    if (USE_MOCK_DATA) {
      console.log("Mock Payment Processed:", paymentPayload);
      return new Promise(res => setTimeout(() => res({ 
        success: true, 
        message: "Payment recorded successfully", 
        data: { ...paymentPayload, receipt_no: "RCP-MOCK-001" } 
      }), 800));
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/fees/payment`, {
        method: 'POST',
        headers: { 
          Accept: 'application/json', 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentPayload)
      });
      console.log(response);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to record payment');
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * GET /api/fees/payment-history
   */
  getPaymentHistory: async (filters = {}, page = 1) => {
    if (USE_MOCK_DATA) {
      return new Promise(res => setTimeout(() => res({ success: true, data: MOCK_PAYMENT_HISTORY }), 600));
    }

    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({ page, per_page: 10, ...filters });
      const response = await fetch(`${API_BASE_URL}/fees/payment-history?${queryParams}`, {
        method: 'GET',
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch history');
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * GET /api/fees/receipt/{id}
   */
  getReceiptDetails: async (id) => {
    if (USE_MOCK_DATA) {
      return new Promise(res => setTimeout(() => res({ success: true, data: MOCK_RECEIPT }), 400));
    }
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/fees/receipt/${id}`, {
        method: 'GET',
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch receipt');
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};