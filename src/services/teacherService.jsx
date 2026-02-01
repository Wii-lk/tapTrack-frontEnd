const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// const API_BASE_URL = "http://localhost:8000/api";

// Set to true to use mock data instead of real API
const USE_MOCK_DATA = false;

// Mock Teachers Data
const MOCK_TEACHERS = [
    {
        id: 1,
        user_id: 101, 
        first_name: 'Kamal', 
        last_name: 'Perera', 
        email: 'kamal.perera@school.com',
        phone_no: '+94771234567', 
        position: 'Math Teacher', 
        is_active: true, 
        unique_no: "RFID10001", 
        basic_salary: 50000.00, 
        date_of_birth: '1985-01-01',
        qualification: 'B.Sc Mathematics',
        gender: 'male',
        address: '123, Galle Road, Colombo 03',
    },
    {
        id: 2,
        user_id: 102,
        first_name: 'Sunethra',
        last_name: 'Jayawardena',
        email: 'sunethra.j@school.com',
        phone_no: '+94772234567',
        position: 'English Teacher',
        is_active: true,
        unique_no: "RFID10002",
        basic_salary: 55000.00,
        date_of_birth: '1988-03-12',
        qualification: 'M.A English',
        gender: 'female',
        address: '456, Kandy Road, Colombo 07',
    },
    {
        id: 3,
        user_id: 103,
        first_name: 'Nimal',
        last_name: 'Silva',
        email: 'nimal.silva@school.com',
        phone_no: '+94773234567',
        position: 'Science Teacher',
        is_active: false, 
        unique_no: "RFID10003",
        basic_salary: 48000.00,
        date_of_birth: '1990-06-20',
        qualification: 'B.Sc Chemistry',
        gender: 'male',
        address: '789, Negombo Road, Wattala',
    },
];


/**
 * Helper function to normalize API staff data fields to frontend teacher fields.
 * (API: snake_case -> FE: camelCase)
 */
const normalizeStaffToTeacher = (staff) => {
    if (!staff) return null;
    return {
        id: staff.id,
        user_id: staff.user_id,
        firstName: staff.first_name,
        lastName: staff.last_name,
        fullName: `${staff.first_name || ''} ${staff.last_name || ''}`.trim(),
        email: staff.email,
        phone: staff.phone_no, 
        designation: staff.position,
        status: staff.is_active ? 'active' : 'inactive', 
        
        // Pass through fields
        unique_no: staff.unique_no,
        employee_no: staff.employee_no, // <--- ADD THIS LINE
        basic_salary: staff.basic_salary,
        date_of_birth: staff.date_of_birth,
        qualification: staff.qualification,
        hire_date: staff.hire_date,
        parent_staff_id: staff.parent_staff_id,
        gender: staff.gender,
        address: staff.address,
        is_active: staff.is_active,
        username: staff.username,
    };
};

// Teacher Service (now uses /api/staff endpoints)
const teacherService = {
    // Get all teachers/staff
    getTeachers: async (page = 1, perPage = 10, filters = {}) => {
        if (USE_MOCK_DATA) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let filteredStaff = [...MOCK_TEACHERS];

                    // Filtering logic
                    if (filters.search) {
                        const searchLower = filters.search.toLowerCase();
                        filteredStaff = filteredStaff.filter(
                            (t) =>
                                (t.first_name && t.first_name.toLowerCase().includes(searchLower)) ||
                                (t.last_name && t.last_name.toLowerCase().includes(searchLower)) ||
                                (t.email && t.email.toLowerCase().includes(searchLower)) ||
                                (t.phone_no && t.phone_no.toLowerCase().includes(searchLower)) ||
                                (t.position && t.position.toLowerCase().includes(searchLower))
                        );
                    }

                    if (filters.is_active !== undefined && filters.is_active !== '') {
                        const isActiveBool = filters.is_active === 'true' || filters.is_active === true;
                        filteredStaff = filteredStaff.filter((t) => t.is_active === isActiveBool);
                    }

                    // Pagination
                    const total = filteredStaff.length;
                    const start = (page - 1) * perPage;
                    const end = start + perPage;
                    const paginatedStaff = filteredStaff.slice(start, end);
                    const paginatedTeachers = paginatedStaff.map(normalizeStaffToTeacher);

                    resolve({
                        success: true,
                        data: {
                            teachers: paginatedTeachers,
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

        // Real API Call
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams({ page, per_page: perPage });
            if (filters.is_active !== undefined && filters.is_active !== '') queryParams.append('is_active', filters.is_active);
            if (filters.search) queryParams.append('search', filters.search);

            const response = await fetch(`${API_BASE_URL}/staff?${queryParams}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch staff');
            
            data.data.teachers = data.data.staff.map(normalizeStaffToTeacher);
            delete data.data.staff; 
            
            return data;
        } catch (error) {
            throw new Error(error.message || 'Network error occurred');
        }
    },

    // Get teacher/staff by ID
    getTeacherById: async (id) => {
        if (USE_MOCK_DATA) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const staff = MOCK_TEACHERS.find((t) => t.id === parseInt(id));
                    if (staff) {
                        const teacher = normalizeStaffToTeacher(staff);
                        resolve({ success: true, data: teacher });
                    }
                    else reject(new Error('Teacher not found'));
                }, 500);
            });
        }

        // Real API Call
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
console.log(data);
            if (!response.ok) throw new Error(data.message || 'Failed to fetch teacher');
            
            data.data = normalizeStaffToTeacher(data.data);
            return data;
        } catch (error) {
            throw new Error(error.message || 'Network error occurred');
        }
    },

    // Create new teacher/staff
    createTeacher: async (teacherData) => {
        // teacherData is a plain JS object from the form state (snake_case)
        if (USE_MOCK_DATA) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newStaff = {
                        id: MOCK_TEACHERS.length + 1,
                        user_id: 200 + MOCK_TEACHERS.length,
                        ...teacherData, // Assumes teacherData is already snake_case
                        is_active: true,
                    };
                    MOCK_TEACHERS.push(newStaff);
                    const newTeacher = normalizeStaffToTeacher(newStaff);
                    resolve({ success: true, message: 'Teacher created successfully', data: newTeacher });
                }, 800);
            });
        }

        // *** CORRECTED: Real API Call using POST /api/staff with JSON ***
        try {
            const token = localStorage.getItem('token');
            
            // The teacherData object is already in snake_case format from the form
            // We just need to remove the 'photo' field if it's null
            const apiData = { ...teacherData };
            if (!apiData.photo) {
                delete apiData.photo;
            }
            
            const response = await fetch(`${API_BASE_URL}/staff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Send as JSON
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(apiData), // Stringify the snake_case object
            });
            
            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                 if (response.status === 422) { // Handle validation errors
                    const errorMessages = Object.values(data.errors).flat().join(' ');
                    throw new Error(errorMessages || 'Validation failed');
                 }
                 throw new Error(data.message || 'Failed to create staff member');
            }
            
            data.data = normalizeStaffToTeacher(data.data);
            return data;
        } catch (error) {
            throw new Error(error.message || 'Network error occurred');
        }
    },

    // Update teacher/staff
    updateTeacher: async (id, teacherData) => {
  // teacherData: plain JS object (snake_case) from your form
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_TEACHERS.findIndex((t) => t.id === parseInt(id));
        if (index !== -1) {
          const updatedStaff = {
            ...MOCK_TEACHERS[index],
            ...teacherData,
          };
          MOCK_TEACHERS[index] = updatedStaff;
          const updatedTeacher = normalizeStaffToTeacher(updatedStaff);
          resolve({ success: true, message: 'Teacher updated successfully', data: updatedTeacher });
        } else {
          reject(new Error('Teacher not found'));
        }
      }, 800);
    });
  }

  try {
    const token = localStorage.getItem('token');

    // Build FormData for multipart request
    const formData = new FormData();
    for (const key in teacherData) {
      const val = teacherData[key];

      // skip undefined / null fields (unless you want to explicitly send null)
      if (val === undefined || val === null) continue;

      if (key === 'photo') {
        // Only append if it's a File (new upload)
        if (val instanceof File) {
          formData.append('photo', val);
        } else {
          // If val is a string (existing URL/path) we usually skip it.
          // If your backend expects an explicit string path, append it:
          // formData.append('photo', val);
        }
      } else if (key === 'password' && !val) {
        // skip empty password on update
        continue;
      } else {
        // Convert booleans/numbers to strings for FormData
        if (typeof val === 'boolean' || typeof val === 'number') {
          formData.append(key, String(val));
        } else {
          formData.append(key, val);
        }
      }
    }

    // IMPORTANT: method spoofing for PUT
    

    // Debug: inspect FormData contents (useful during dev)
    if (process.env.NODE_ENV !== 'production') {
      for (const pair of formData.entries()) {
        // WARNING: Files log as File objects
        // eslint-disable-next-line no-console
        console.log('FormData:', pair[0], pair[1]);
      }
    }

    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'POST', // POST + _method=PUT (Laravel method spoof)
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        Accept: 'application/json',
        // DO NOT set Content-Type when using FormData
      },
      body: formData,
    });

    // Try to parse JSON safely
    let data;
    const text = await response.text();
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      // If response isn't JSON, throw raw text for easier debugging
      throw new Error(`Invalid JSON response: ${text}`);
    }

    if (!response.ok) {
      if (response.status === 422 && data.errors) {
        const errorMessages = Object.values(data.errors).flat().join(' ');
        throw new Error(errorMessages || 'Validation failed');
      }
      throw new Error(data.message || `Failed to update staff (${response.status})`);
    }

    // Normalize returned staff -> teacher shape if needed
    if (data && data.data) {
      data.data = normalizeStaffToTeacher(data.data);
    }

    return data;
  } catch (error) {
    // Helpful console logging for debugging
    // eslint-disable-next-line no-console
    console.error('updateTeacher error:', error);
    throw new Error(error.message || 'Network error occurred');
  }
},


    // Delete teacher/staff
    deleteTeacher: async (id) => {
        if (USE_MOCK_DATA) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const index = MOCK_TEACHERS.findIndex((t) => t.id === parseInt(id));
                    if (index !== -1) {
                        MOCK_TEACHERS.splice(index, 1);
                        resolve({ success: true, message: 'Teacher deleted successfully' });
                    } else reject(new Error('Teacher not found'));
                }, 500);
            });
     }

        // Real API Call (Assuming a DELETE endpoint exists)
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            if (response.status === 204) {
                 return { success: true, message: 'Teacher deleted successfully' };
            }

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to delete staff member');
            
            return data;
        } catch (error) {
            throw new Error(error.message || 'Network error occurred');
        }
    },
};

export default teacherService;