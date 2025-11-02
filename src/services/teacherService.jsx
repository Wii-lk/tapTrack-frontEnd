const API_BASE_URL = 'http://localhost:8000/api';

// Set to true to use mock data instead of real API
const USE_MOCK_DATA = true;

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
    },
];


/**
 * Helper function to normalize API staff data fields to frontend teacher fields.
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
        unique_no: staff.unique_no,
        basic_salary: staff.basic_salary,
        date_of_birth: staff.date_of_birth,
        qualification: staff.qualification,
        hire_date: staff.hire_date,
        parent_staff_id: staff.parent_staff_id,
        parent_staff: staff.parent_staff,
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
            if (!response.ok) throw new Error(data.message || 'Failed to fetch teacher');
            
            data.data = normalizeStaffToTeacher(data.data);
            return data;
        } catch (error) {
            throw new Error(error.message || 'Network error occurred');
        }
    },

    // Create new teacher/staff
    createTeacher: async (teacherData) => {
        // teacherData is expected to be a plain JavaScript object from the form
        if (USE_MOCK_DATA) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newStaff = {
                        id: MOCK_TEACHERS.length + 1,
                        user_id: 200 + MOCK_TEACHERS.length,
                        unique_no: teacherData.unique_no || `RFID${MOCK_TEACHERS.length + 1}`,
                        basic_salary: teacherData.basic_salary || 40000.00,
                        is_active: true,
                        // Map frontend fields (camelCase) to mock fields (snake_case)
                        first_name: teacherData.firstName,
                        last_name: teacherData.lastName,
                        position: teacherData.designation,
                        phone_no: teacherData.phone,
                        email: teacherData.email,
                        ...teacherData, // Pass other fields like gender, address, etc.
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
            
            // Map frontend fields (camelCase) to API fields (snake_case)
            // as required by the POST /api/staff documentation
            const apiData = {
                // User fields
                unique_no: teacherData.unique_no,
                first_name: teacherData.firstName,
                last_name: teacherData.lastName,
                username: teacherData.username,
                password: teacherData.password,
                gender: teacherData.gender,
                date_of_birth: teacherData.date_of_birth,
                address: teacherData.address,
                
                // Staff fields
                email: teacherData.email,
                phone_no: teacherData.phone,
                position: teacherData.designation,
                qualification: teacherData.qualification,
                basic_salary: teacherData.basic_salary,
                parent_staff_id: teacherData.parent_staff_id,
                hire_date: teacherData.hire_date
            };

            const response = await fetch(`${API_BASE_URL}/staff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Send as JSON
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(apiData), // Stringify the JSON object
            });

            const data = await response.json();
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
        // teacherData is expected to be a FormData object
        if (USE_MOCK_DATA) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const index = MOCK_TEACHERS.findIndex((t) => t.id === parseInt(id));
                    if (index !== -1) {
                        // Mock reading from FormData
                        const updatedStaff = {
                            ...MOCK_TEACHERS[index],
                            first_name: teacherData.get('first_name') || MOCK_TEACHERS[index].first_name,
                            last_name: teacherData.get('last_name') || MOCK_TEACHERS[index].last_name,
                            position: teacherData.get('position') || MOCK_TEACHERS[index].position,
                            phone_no: teacherData.get('phone_no') || MOCK_TEACHERS[index].phone_no,
                            is_active: teacherData.get('is_active') === 'true' ? true : (teacherData.get('is_active') === 'false' ? false : MOCK_TEACHERS[index].is_active),
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

        // Real API Call using PUT /api/staff/{id} (multipart/form-data)
        try {
            const token = localStorage.getItem('token');
            
            // Add the PUT method override for Laravel
            // This assumes teacherData is already a FormData object
            teacherData.append('_method', 'PUT');

            const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
                method: 'POST', // Use POST for multipart/form-data updates
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
// No 'Content-Type' header needed
                },
                body: teacherData,
            });

            const data = await response.json();
            if (!response.ok) {
                 if (response.status === 422) {
                    const errorMessages = Object.values(data.errors).flat().join(' ');
                    throw new Error(errorMessages || 'Validation failed');
                 }
                 throw new Error(data.message || 'Failed to update staff member');
            }
            
            data.data = normalizeStaffToTeacher(data.data);
            return data;
        } catch (error) {
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

            // Handle 204 No Content (success, but no JSON body)
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