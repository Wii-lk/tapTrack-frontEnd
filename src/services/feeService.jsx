const API_BASE_URL = 'http://localhost:8000/api';
const USE_MOCK_DATA = true;

// Mock Data Structures
const MOCK_FEE_ITEMS = [
    { id: 1, name: 'Tuition Fee - Grade 10', amount: 5000.00, applicable_grades: [10] },
    { id: 2, name: 'Library Fee', amount: 500.00, applicable_grades: [6, 7, 8, 9, 10, 11] },
    { id: 3, name: 'Exam Fee - April', amount: 1500.00, applicable_grades: [11] },
];

const MOCK_STUDENT_FEES = [
    {
        student_id: 101,
        student_name: 'Aisha Khan',
        grade: 10,
        month: '2025-10-01', // ISO date for Oct
        total_monthly_amount: 5500.00, // Tuition + Library
        paid_amount: 0.00,
        status: 'Unpaid',
        due_date: '2025-10-15',
        outstanding_items: [MOCK_FEE_ITEMS[0], MOCK_FEE_ITEMS[1]],
    },
    {
        student_id: 102,
        student_name: 'Bimal Silva',
        grade: 11,
        month: '2025-10-01',
        total_monthly_amount: 7000.00, // Tuition + Library + Exam
        paid_amount: 5000.00,
        status: 'Partial',
        due_date: '2025-10-15',
        outstanding_items: [MOCK_FEE_ITEMS[1], MOCK_FEE_ITEMS[2], { id: 1, name: 'Partial Tuition', amount: 2000.00 }],
    },
    {
        student_id: 103,
        student_name: 'Charith Perera',
        grade: 10,
        month: '2025-09-01', // Arrear from last month
        total_monthly_amount: 5500.00,
        paid_amount: 5500.00,
        status: 'Paid',
        due_date: '2025-09-15',
        outstanding_items: [],
    },
    {
        student_id: 104,
        student_name: 'Devi Fernando',
        grade: 8,
        month: '2025-10-01',
        total_monthly_amount: 4500.00,
        paid_amount: 4500.00,
        status: 'Paid',
        due_date: '2025-10-15',
        outstanding_items: [],
    },
];

const MOCK_PAYMENT_HISTORY = [
    { id: 201, student_id: 104, student_name: 'Devi Fernando', amount: 4500.00, date: '2025-10-29', items: 'Tuition, Library Fee' },
    { id: 202, student_id: 102, student_name: 'Bimal Silva', amount: 5000.00, date: '2025-10-28', items: 'Tuition Fee (Partial)' },
];


const feeService = {

    /**
     * Calculates summary data for the dashboard.
     */
    getFeeSummary: async () => {
        if (USE_MOCK_DATA) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const totalOutstanding = MOCK_STUDENT_FEES.reduce((sum, fee) => 
                        sum + (fee.total_monthly_amount - fee.paid_amount), 0
                    );

                    const today = new Date().toISOString().split('T')[0];
                    const collectedToday = MOCK_PAYMENT_HISTORY
                        .filter(p => p.date === today)
                        .reduce((sum, p) => sum + p.amount, 0);

                    const upcomingDueCount = MOCK_STUDENT_FEES.filter(fee => {
                        const dueDate = new Date(fee.due_date);
                        const now = new Date();
                        const nextFewDays = new Date();
                        nextFewDays.setDate(now.getDate() + 7);
                        return fee.status !== 'Paid' && dueDate >= now && dueDate <= nextFewDays;
                    }).length;

                    const studentsWithArrears = MOCK_STUDENT_FEES.filter(fee => 
                        fee.month < new Date().toISOString().slice(0, 7) && fee.status !== 'Paid'
                    ).length;

                    resolve({
                        success: true,
                        data: {
                            totalOutstanding: totalOutstanding,
                            upcomingDues: upcomingDueCount,
                            collectedToday: collectedToday,
                            studentsWithArrears: studentsWithArrears,
                        }
                    });
                }, 500);
            });
        }
        // Placeholder for real API call: GET /api/fees/summary
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/fees/summary`, {
                 headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch summary');
            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Network error');
        }
    },

    /**
     * Gets all student fee records.
     * (Updated with 'status' parameter)
     */
    getStudentFeeRecords: async (search = '', status = '') => {
        if (USE_MOCK_DATA) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let records = MOCK_STUDENT_FEES.map(fee => ({
                        ...fee,
                        // Calculate display values
                        amount_due: fee.total_monthly_amount - fee.paid_amount,
                        month_display: new Date(fee.month).toLocaleString('default', { month: 'long', year: 'numeric' }),
                        giving_amount: fee.paid_amount, // Renaming paid_amount to giving_amount for table
                    }));

                    // Apply search filter
                    if (search) {
                        const searchLower = search.toLowerCase();
                        records = records.filter(r => 
                            r.student_name.toLowerCase().includes(searchLower) || 
                            r.student_id.toString().includes(searchLower)
                        );
                    }

                    // NEW: Apply status filter
                    if (status) {
                        records = records.filter(r => r.status === status);
                    }

                    resolve({ success: true, data: records });
                }, 800);
            });
        }
        
        // Real API call: GET /api/fees/records?search={query}&status={status}
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams({ search });
            
            // Add status to query params if it's selected
            if (status) {
                queryParams.append('status', status);
            }
            
            const response = await fetch(`${API_BASE_URL}/fees/records?${queryParams}`, {
                 headers: {
                     'Authorization': `Bearer ${token}`
                 }
            });
            if (!response.ok) throw new Error('Failed to fetch records');
            
            // Assuming API returns { success: true, data: [...] }
            const data = await response.json();
            
            // You might need to normalize data here if API fields differ
            // e.g., data.data.map(record => normalizeRecord(record))
            
            return data; 

        } catch (error) {
             throw new Error(error.message || 'Network error');
        }
    },
    
    /**
     * Get details for a specific student payment.
     */
    getFeeDetailsForPayment: async (studentId) => {
        if (USE_MOCK_DATA) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const studentFees = MOCK_STUDENT_FEES.filter(f => f.student_id === parseInt(studentId));
                    if (studentFees.length > 0) {
                         // Simplify outstanding items for the payment form display
                        const outstandingItems = studentFees
                            .filter(f => f.status !== 'Paid')
                            .flatMap(f => f.outstanding_items.map(item => ({
                                id: `${f.month}-${item.id}`,
                                student_fee_record_id: f.student_id,
                                description: `${item.name} (${f.month.slice(0, 7)})`,
                                amount: item.amount,
                                is_selected: true, // Default to selected
                            })));

                        resolve({
                            success: true,
                            data: {
                                student_id: parseInt(studentId),
                                student_name: studentFees[0].student_name,
                                outstanding_items: outstandingItems,
                            }
                        });
                    } else {
                        reject(new Error('No outstanding fees found for student.'));
                    }
                }, 500);
            });
        }
        // Placeholder for real API call: GET /api/fees/pay-details/{studentId}
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/fees/pay-details/${studentId}`, {
                 headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch fee details');
            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Network error');
        }
    },

    /**
     * Submits a payment.
     */
    submitPayment: async (paymentData) => {
        if (USE_MOCK_DATA) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // In a real app, this would update MOCK_STUDENT_FEES and MOCK_PAYMENT_HISTORY
                    console.log('Simulating payment submission:', paymentData);
                    
                    // Add to payment history (example)
                    MOCK_PAYMENT_HISTORY.push({
                        id: Math.floor(Math.random() * 1000) + 300,
                        student_id: paymentData.student_id,
                        student_name: 'Mock Student', // Would fetch name in real app
                        amount: paymentData.paying_amount,
                        date: new Date().toISOString().split('T')[0],
                        items: `${paymentData.fee_items_paid.length} items`,
                    });
                    
                    resolve({
                        success: true,
                        message: `Payment of LKR ${paymentData.paying_amount.toLocaleString()} received successfully!`,
                        data: paymentData,
                    });
                }, 1000);
            });
        }
        // Placeholder for real API call: POST /api/fees/payment
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/fees/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(paymentData),
            });
            if (!response.ok) throw new Error('Payment submission failed');
            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Network error');
        }
    },
};

export default feeService;