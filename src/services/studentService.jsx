const API_BASE_URL = 'http://localhost:8000/api';

// Set to true for mock data
const USE_MOCK_DATA = true;

// Mock Students Data (Using frontend camelCase format)
const MOCK_STUDENTS = [
  {
    id: 1,
    admissionNo: 'STU001',
    firstName: 'Kasun',
    lastName: 'Perera',
    fullName: 'Kasun Perera',
    dateOfBirth: '2010-05-15',
    gender: 'Male',
    email: 'kasun.perera@student.school.com',
    phone: '+94771234567',
    address: '123, Galle Road, Colombo 03',
    guardianName: 'Mr. Perera',
    guardianPhone: '+94771234568',
    guardianEmail: 'perera@gmail.com',
    class: 'Grade 10-A', // Combined grade and section
    gradeId: 10,
    status: 'active',
    profileImage: null,
  },
  {
    id: 2,
    admissionNo: 'STU002',
    firstName: 'Nimal',
    lastName: 'Silva',
    fullName: 'Nimal Silva',
    dateOfBirth: '2010-08-22',
    gender: 'Male',
    email: 'nimal.silva@student.school.com',
    phone: '+94772234567',
    address: '456, Kandy Road, Colombo 07',
    guardianName: 'Mrs. Silva',
    guardianPhone: '+94772234568',
    guardianEmail: 'silva@gmail.com',
    class: 'Grade 10-A',
    gradeId: 10,
    status: 'active',
    profileImage: null,
  },
  {
    id: 3,
    admissionNo: 'STU003',
    firstName: 'Saman',
    lastName: 'Fernando',
    fullName: 'Saman Fernando',
    dateOfBirth: '2011-03-10',
    gender: 'Male',
    email: 'saman.fernando@student.school.com',
    phone: '+94773234567',
    address: '789, Negombo Road, Wattala',
    guardianName: 'Mr. Fernando',
    guardianPhone: '+94773234568',
    guardianEmail: 'fernando@gmail.com',
    class: 'Grade 9-B',
    gradeId: 9,
    status: 'active',
    profileImage: null,
  },
];

// Mock Fee Records
const MOCK_FEE_RECORDS = {
  1: [
    {
      id: 1,
      feeType: 'Tuition Fee',
      amount: 25000,
      paidAmount: 25000,
      dueDate: '2025-01-31',
      paidDate: '2025-01-15',
      status: 'paid',
    },
    {
      id: 2,
      feeType: 'Activity Fee',
      amount: 10000,
      paidAmount: 10000,
      dueDate: '2025-01-31',
      paidDate: '2025-01-20',
      status: 'paid',
    },
    {
      id: 3,
      feeType: 'Library Fee',
      amount: 5000,
      paidAmount: 0,
      dueDate: '2025-02-28',
      paidDate: null,
      status: 'pending',
    },
  ],
  // ... other student fee records
};

// Mock Attendance Records
const MOCK_ATTENDANCE_RECORDS = {
  1: [
    { date: '2025-10-01', status: 'present' },
    { date: '2025-10-02', status: 'present' },
    { date: '2025-10-03', status: 'absent' },
    // ... other attendance records
  ],
};


/**
 * Normalization function for students
 * Maps API snake_case (e.g., first_name) to frontend camelCase (e.g., firstName)
 */
const normalizeStudent = (student) => {
  if (!student) return null;
  return {
    id: student.id,
    userId: student.user_id,
    firstName: student.first_name,
    lastName: student.last_name,
    fullName: `${student.first_name || ''} ${student.last_name || ''}`.trim(),
    admissionNo: student.unique_no,
    dateOfBirth: student.date_of_birth,
    gender: student.gender,
    address: student.address,
    guardianName: student.parent_name,
    guardianNic: student.parent_nic,
    guardianPhone: student.parent_phone,
    gradeId: student.grade_id,
    class: student.grade ? student.grade.name : 'N/A', // Use grade object
    status: student.is_active ? 'active' : 'inactive',
    enrollmentDate: student.enrollment_date,
    outstandingFees: student.outstanding_fees,
    photoUrl: student.photo_url,
    // Add any other fields you need from the API response
  };
};

const studentService = {
  // Get all students with filters and pagination
  getStudents: async (page = 1, perPage = 10, filters = {}) => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let filteredStudents = [...MOCK_STUDENTS];

          // Apply filters (using mock fields)
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredStudents = filteredStudents.filter(
              (s) =>
                s.fullName.toLowerCase().includes(searchLower) ||
                s.admissionNo.toLowerCase().includes(searchLower)
            );
          }
          if (filters.grade_id) {
            filteredStudents = filteredStudents.filter(
              (s) => s.gradeId === filters.grade_id
            );
          }
          if (filters.is_active !== undefined && filters.is_active !== '') {
             const isActive = filters.is_active === 'true' || filters.is_active === true;
             const status = isActive ? 'active' : 'inactive';
             filteredStudents = filteredStudents.filter(
              (s) => s.status === status
            );
          }

          // Pagination
          const total = filteredStudents.length;
          const start = (page - 1) * perPage;
          const end = start + perPage;
          const paginatedStudents = filteredStudents.slice(start, end);

          resolve({
            success: true,
            data: {
              students: paginatedStudents,
              pagination: {
                currentPage: page,
                perPage: perPage,
                total: total,
                totalPages: Math.ceil(total / perPage),
              },
            },
          });
        }, 800);
      });
    }

    // Real API call
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page,
        per_page: perPage,
      });

      // Use API query param names
      if (filters.grade_id) queryParams.append("grade_id", filters.grade_id);
      if (filters.is_active !== undefined && filters.is_active !== '')
        queryParams.append("is_active", filters.is_active);
      if (filters.search) queryParams.append("search", filters.search);

      const response = await fetch(`${API_BASE_URL}/students?${queryParams}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch students");
      
      // Normalize the API data before sending it to the component
      data.data.students = data.data.students.map(normalizeStudent);

      return data;
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  },

  // Get single student by ID
  getStudentById: async (id) => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const student = MOCK_STUDENTS.find((s) => s.id === parseInt(id));
          if (student) {
            // Mock data is already in frontend format
            resolve({ success: true, data: student });
          } else {
            reject(new Error("Student not found"));
          }
        }, 500);
      });
    }

    // Real API Call
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch student");

      // Normalize the single student data
      data.data = normalizeStudent(data.data);
      return data;
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  },

  // Create new student (Admin only)
  createStudent: async (studentData) => {
    // studentData is expected to be a FormData object
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mocking FormData.get()
          const newStudent = {
            id: MOCK_STUDENTS.length + 1,
            admissionNo: studentData.get('unique_no') || `STU${String(MOCK_STUDENTS.length + 1).padStart(3, "0")}`,
            firstName: studentData.get('first_name'),
            lastName: studentData.get('last_name'),
            fullName: `${studentData.get('first_name')} ${studentData.get('last_name')}`,
            guardianName: studentData.get('parent_name'),
            gradeId: parseInt(studentData.get('grade_id')),
            class: 'Mock Grade', // In a real app, you might fetch this
            status: "active",
          };
          MOCK_STUDENTS.push(newStudent);
          resolve({
            success: true,
            message: "Student created successfully",
            data: normalizeStudent(newStudent), // Normalize mock data for consistency
          });
        }, 800);
      });
    }

    // Real API Call using FormData
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/students`, {
        method: "POST",
        headers: {
          // No 'Content-Type' header; browser sets it for FormData
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: studentData, // Send FormData directly
      });

      const data = await response.json();
      if (!response.ok) {
           if (response.status === 422) { // Handle validation errors
              const errorMessages = Object.values(data.errors).flat().join(' ');
              throw new Error(errorMessages || 'Validation failed');
           }
           throw new Error(data.message || 'Failed to create student');
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  },

  // Update student (Admin only, multipart/form-data)
  updateStudent: async (id, studentData) => {
    // studentData is expected to be a FormData object
    if (USE_MOCK_DATA) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = MOCK_STUDENTS.findIndex((s) => s.id === parseInt(id));
          if (index !== -1) {
            // Mocking FormData.get()
            MOCK_STUDENTS[index] = {
              ...MOCK_STUDENTS[index],
              firstName: studentData.get('first_name') || MOCK_STUDENTS[index].firstName,
              lastName: studentData.get('last_name') || MOCK_STUDENTS[index].lastName,
              fullName: `${studentData.get('first_name') || MOCK_STUDENTS[index].firstName} ${studentData.get('last_name') || MOCK_STUDENTS[index].lastName}`,
              guardianName: studentData.get('parent_name') || MOCK_STUDENTS[index].guardianName,
              status: studentData.get('is_active') === 'true' ? 'active' : (studentData.get('is_active') === 'false' ? 'inactive' : MOCK_STUDENTS[index].status),
            };
            resolve({
              success: true,
              message: "Student updated successfully",
              data: MOCK_STUDENTS[index],
            });
          } else {
            reject(new Error("Student not found"));
          }
        }, 800);
      });
    }

    // Real API Call
    try {
      const token = localStorage.getItem("token");

      // Add _method: 'PUT' for Laravel/PHP frameworks
      studentData.append('_method', 'PUT');

      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: "POST", // Use POST for FormData updates
        headers: {
          // No 'Content-Type' header
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: studentData,
      });

      const data = await response.json();
      if (!response.ok) {
           if (response.status === 422) { // Handle validation errors
              const errorMessages = Object.values(data.errors).flat().join(' ');
              throw new Error(errorMessages || 'Validation failed');
           }
           throw new Error(data.message || 'Failed to update student');
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  },

  // Delete student
  deleteStudent: async (id) => {
    // Your API docs don't show a DELETE endpoint, so we'll block it.
    if (USE_MOCK_DATA) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = MOCK_STUDENTS.findIndex(s => s.id === parseInt(id));
                if (index > -1) {
                    MOCK_STUDENTS.splice(index, 1);
                    resolve({ success: true, message: "Student deleted (mock)"});
                } else {
                    reject(new Error("Student not found (mock)"));
                }
            }, 500);
        });
    }
    // If you HAD a real API endpoint:
    // return fetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE', ... });
    throw new Error("Delete student functionality is not supported by the API.");
  },

  // --- MOCK FUNCTIONS FOR DETAIL PAGE (from mock data) ---
  // You can move these to a separate service if you prefer
  getStudentFeeRecords: async (studentId) => {
     if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: MOCK_FEE_RECORDS[studentId] || []
                });
            }, 300);
        });
     }
     // Real API: return fetch(`${API_BASE_URL}/students/${studentId}/fees` ... )
     throw new Error("Fee records API not implemented");
  },

  getStudentAttendance: async (studentId) => {
     if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: MOCK_ATTENDANCE_RECORDS[studentId] || []
                });
            }, 300);
        });
     }
     // Real API: return fetch(`${API_BASE_URL}/students/${studentId}/attendance` ... )
     throw new Error("Attendance records API not implemented");
  }
};

export default studentService;