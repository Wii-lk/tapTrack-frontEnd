const API_BASE_URL = "http://phoenixedubackend.dpdns.org/api";
//  const API_BASE_URL = "http://localhost:8000/api";


// Set to true for mock data
const USE_MOCK_DATA = false;

// Mock Students Data
const MOCK_STUDENTS = [
  {
    id: 1,
    user_id: 101,
    first_name: "Kasun",
    last_name: "Perera",
    unique_no: "STU001",
    date_of_birth: "2010-05-15",
    gender: "Male",
    username: "kasun.perera",
    address: "123, Galle Road, Colombo 03",
    parent_name: "Mr. Perera",
    parent_nic: "851234567V",
    parent_phone: "+94771234568",
    grade_id: 10,
    grade: { id: 10, name: "Grade 10-A" },
    is_active: false,
    enrollment_date: "2020-01-10",
    // Mock data for frontend list (camelCase)
    firstName: "Kasun",
    lastName: "Perera",
    fullName: "Kasun Perera",
    admissionNo: "STU001",
    guardianName: "Mr. Perera",
    class: "Grade 10-A",
    gradeId: 10,
    status: "active",
  },
  {
    id: 2,
    user_id: 102,
    first_name: "Nimal",
    last_name: "Silva",
    unique_no: "STU002",
    date_of_birth: "2010-08-22",
    gender: "Male",
    username: "nimal.silva",
    address: "456, Kandy Road, Colombo 07",
    parent_name: "Mrs. Silva",
    parent_nic: "881234567V",
    parent_phone: "+94772234568",
    grade_id: 10,
    grade: { id: 10, name: "Grade 10-A" },
    is_active: true,
    enrollment_date: "2020-01-11",
    // Mock data for frontend list (camelCase)
    firstName: "Nimal",
    lastName: "Silva",
    fullName: "Nimal Silva",
    admissionNo: "STU002",
    guardianName: "Mrs. Silva",
    class: "Grade 10-A",
    gradeId: 10,
    status: "active",
  },
];

// Mock Fee/Attendance Records
const MOCK_FEE_RECORDS = { 1: [], 2: [] };
const MOCK_ATTENDANCE_RECORDS = { 1: [], 2: [] };

/**
 * Normalization function for students
 * Maps API snake_case (e.g., first_name) to frontend camelCase (e.g., firstName)
 * AND passes through the original snake_case fields for the edit form.
 */
const normalizeStudent = (student) => {
  if (!student) return null;

  // Data for Tables (camelCase)
  const normalized = {
    id: student.id,
    index_no: student.index_no,
    userId: student.user_id,
    firstName: student.first_name,
    lastName: student.last_name,
    fullName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
    admissionNo: student.unique_no,
    dateOfBirth: student.date_of_birth, // Used by form
    guardianName: student.parent_name, // Used by form
    gradeId: student.grade_id, // Used by form
    class: student.grade ? student.grade.name : "N/A",
    status: student.is_active ? "active" : "inactive",
    photoUrl: student.photo_url,

    // *** CORRECTION: Pass through ALL original API fields for the edit form ***
    first_name: student.first_name,
    last_name: student.last_name,
    unique_no: student.unique_no,
    date_of_birth: student.date_of_birth,
    gender: student.gender,
    address: student.address,
    parent_name: student.parent_name,
    parent_nic: student.parent_nic,
    parent_phone: student.parent_phone,
    grade_id: student.grade_id,
    is_active: student.is_active,
    enrollment_date: student.enrollment_date,
    username: student.username, // Assuming API sends this
    guardianNic: student.parent_nic, // Duplicating for form
    guardianPhone: student.parent_phone, // Duplicating for form
    enrollmentDate: student.enrollment_date, // Duplicating for form
  };

  return normalized;
};

const studentService = {
  // Get all students with filters and pagination
  getStudents: async (page = 1, perPage = 10, filters = {}) => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let filteredStudents = [...MOCK_STUDENTS];

          // Apply filters
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredStudents = filteredStudents.filter(
              (s) =>
                s.fullName.toLowerCase().includes(searchLower) ||
                s.admissionNo.toLowerCase().includes(searchLower),
            );
          }
          if (filters.grade_id) {
            filteredStudents = filteredStudents.filter(
              (s) => s.gradeId === parseInt(filters.grade_id),
            );
          }
          if (filters.is_active !== undefined && filters.is_active !== "") {
            const isActive = filters.is_active === "true";
            const status = isActive ? "active" : "inactive";
            filteredStudents = filteredStudents.filter(
              (s) => s.status === status,
            );
          }

          // Pagination
          const total = filteredStudents.length;
          const start = (page - 1) * perPage;
          const end = start + perPage;
          // Normalize for the table view
          const paginatedStudents = filteredStudents
            .slice(start, end)
            .map(normalizeStudent);

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
      const queryParams = new URLSearchParams({ page, per_page: perPage });
      if (filters.grade_id) queryParams.append("grade_id", filters.grade_id);
      if (filters.is_active !== undefined && filters.is_active !== "")
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
      console.log(data);
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch students");

      // Normalize data for table
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
            // *** CORRECTED: Normalize the mock data to match the real API flow ***
            resolve({ success: true, data: normalizeStudent(student) });
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
      console.log(data);
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch student");

      // Normalize data for the edit form
      data.data = normalizeStudent(data.data);
      return data;
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  },

  // Create new student (Admin only)
  createStudent: async (studentData) => {
    // *** This function now expects a plain JS object (for JSON) ***
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newStudent = {
            id: MOCK_STUDENTS.length + 1,
            first_name: studentData.first_name,
            last_name: studentData.last_name,
            unique_no:
              studentData.unique_no ||
              `STU${String(MOCK_STUDENTS.length + 1).padStart(3, "0")}`,
            parent_name: studentData.parent_name,
            grade_id: parseInt(studentData.grade_id),
            is_active: true,
            // ... add other fields from studentData
          };
          MOCK_STUDENTS.push(newStudent);
          resolve({
            success: true,
            message: "Student created successfully",
            data: normalizeStudent(newStudent),
          });
        }, 800);
      });
    }

    // *** CORRECTED: Real API Call sends JSON (as per API docs) ***
    try {
      const token = localStorage.getItem("token");

      const apiData = { ...studentData };
      if (apiData.photo === null) {
        delete apiData.photo; // Remove null photo field
      }

      const response = await fetch(`${API_BASE_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Send as JSON
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData), // Send stringified JSON
      });
      console.log(apiData);
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 422) {
          const errorMessages = Object.values(data.errors).flat().join(" ");
          throw new Error(errorMessages || "Validation failed");
        }
        throw new Error(data.message || "Failed to create student");
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  },

  // Update student (Admin only, multipart/form-data)
  updateStudent: async (id, studentData) => {
    // This function correctly expects studentData to be FormData.
    if (USE_MOCK_DATA) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = MOCK_STUDENTS.findIndex((s) => s.id === parseInt(id));
          if (index !== -1) {
            MOCK_STUDENTS[index] = {
              ...MOCK_STUDENTS[index],
              firstName:
                studentData.get("first_name") || MOCK_STUDENTS[index].firstName,
              lastName:
                studentData.get("last_name") || MOCK_STUDENTS[index].lastName,
              fullName: `${studentData.get("first_name") || MOCK_STUDENTS[index].firstName} ${studentData.get("last_name") || MOCK_STUDENTS[index].lastName}`,
              guardianName:
                studentData.get("parent_name") ||
                MOCK_STUDENTS[index].guardianName,
              status:
                studentData.get("is_active") === "true"
                  ? "active"
                  : studentData.get("is_active") === "false"
                    ? "inactive"
                    : MOCK_STUDENTS[index].status,
            };
            resolve({
              success: true,
              message: "Student updated successfully",
              data: normalizeStudent(MOCK_STUDENTS[index]),
            });
          } else {
            reject(new Error("Student not found"));
          }
        }, 800);
      });
    }
    // This part is correct as per your API docs
    try {
      const token = localStorage.getItem("token");
      // studentData.append('_method', 'PUT');
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: studentData,
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        if (response.status === 422) {
          const errorMessages = Object.values(data.errors).flat().join(" ");
          throw new Error(errorMessages || "Validation failed");
        }
        throw new Error(data.message || "Failed to update student");
      }
      // Normalize the response data before sending to component
      data.data = normalizeStudent(data.data);
      return data;
    } catch (error) {
      throw new Error(error.message || "Network error occurred");
    }
  },

  // Delete student
  deleteStudent: async (id) => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = MOCK_STUDENTS.findIndex((s) => s.id === parseInt(id));
          if (index > -1) {
            MOCK_STUDENTS.splice(index, 1);
            resolve({ success: true, message: "Student deleted (mock)" });
          } else {
            reject(new Error("Student not found (mock)"));
          }
        }, 500);
      });
    }

    // 🔥 Real API call
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete student: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Delete student error:", error);
      throw error;
    }
  },

  // --- MOCK FUNCTIONS FOR DETAIL PAGE (from mock data) ---
  getStudentFeeRecords: async (studentId) => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: MOCK_FEE_RECORDS[studentId] || [],
          });
        }, 300);
      });
    }
    throw new Error("Fee records API not implemented");
  },

  getStudentAttendance: async (studentId) => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: MOCK_ATTENDANCE_RECORDS[studentId] || [],
          });
        }, 300);
      });
    }
    throw new Error("Attendance records API not implemented");
  },
};

export default studentService;
