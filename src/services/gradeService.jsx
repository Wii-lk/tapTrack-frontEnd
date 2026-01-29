const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const USE_MOCK_DATA = false; // Toggle this for backend integration

// MOCK DATA

const MOCK_GRADES = {
    "grades" : [
        {
            "id": 1,
            "name" : "Grade 6",
            "description": "Main Grade 6",
            "parent_grade_id" : null,
            "monthly_fee" : 3000.00,
            "is_active": true,
            "students_count" : 120
        },
        {
            "id": 2,
            "name" : "Grade 6-A",
            "description": "Section A ",
            "parent_grade_id" : 1,
            "monthly_fee" : 3000.00,
            "is_active": true,
            "students_count" : 60
        },
        {
            "id": 3,
            "name" : "Grade 6-B",
            "description": "Section B",
            "parent_grade_id" : 1,
            "monthly_fee" : 3000.00,
            "is_active": true,
            "students_count" : 60
        },
        {
            "id" : 4,
            "name": "Grade 7",
            "description": "Main Grade 7",
            "parent_grade_id": null,
            "monthly_fee": 3500.00,
            "is_active": true,
            "students_count": 100
        },
        {
            "id" : 5,
            "name": "Grade 7-A",
            "description": "Section A",
            "parent_grade_id": 4,
            "monthly_fee": 3500.00,
            "is_active": true,
            "students_count": 50
        },
    ]

    
};

const MOCK_SUBJECTS = {
  "subjects": [
    {
      "id": 1,
      "name": "Mathematics",
      "description": "Core Mathematics",
      "is_active": true
    },
    {
      "id": 2,
      "name": "Science",
      "description": "General Science",
      "is_active": true
    },
    {
      "id": 3,
      "name": "English Literature",
      "description": "Language and Literature",
      "is_active": true
    },
    {
      "id": 4,
      "name": "History",
      "description": "World History",
      "is_active": false
    }
  ]
};


export const gradeService = {
    
    getAllGrades: async (params = {}) => {
        if(USE_MOCK_DATA) {
            let data = { ...MOCK_GRADES} ;
            if(params.hasOwnProperty('is_active')) {
                data.grades = data.grades.filter(g => g.is_active === params.is_active);
            }

            return new Promise(res => setTimeout(() => res({ success: true, data}), 500));
          }
            try {
                const token = localStorage.getItem("token");
                const queryParams = new URLSearchParams(params).toString();
                const url = `${API_BASE_URL}/grades${queryParams ? `?${queryParams}` : ''}`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },

                });

                const data = await response.json();
                if(!response.ok) throw new Error(data.message || 'Failed to fetch grades');
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        
    },


    createGrade: async (gradePayload) => {
        if(USE_MOCK_DATA) {
            console.log("MOCK Grade Created:", gradePayload);
            const newId = Math.floor(Math.random() * 1000) + 10;
            return new Promise(res => setTimeout(() => res({
                success: true,
                message: "Grade created successfully",
                data: { id: newId, ...gradePayload}
            }), 800));
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/grades`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gradePayload)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to create grade');
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    updateGrade: async (id, gradePayload) => {
        if(USE_MOCK_DATA) {
            console.log("MOCK Grade Updated:", id, gradePayload);
            return new Promise(res => setTimeout(() => res({
                success: true,
                message: "Grade updated successfully",
                data: { id, ...gradePayload}
            }), 600));
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/grades/${id}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify(gradePayload)
        });

        const data = await response.json();
        if(!response.ok) throw new Error(data.message || 'Failed to update grade');
        return data;
        } catch (error) {
            throw new Error(error.message);
        }
    },


getAllSubjects: async () => {
    if (USE_MOCK_DATA) {
      return new Promise(res => setTimeout(() => res({ success: true, data: MOCK_SUBJECTS }), 500));
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'GET',
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to fetch subjects');

      // --- FIX STARTS HERE ---
      // If the API returns a raw array (e.g., [{id:1...}, {id:2...}])
      // We wrap it manually to match the structure expected by ClassManagement.jsx
      if (Array.isArray(data)) {
        return {
          success: true,
          data: {
            subjects: data
          }
        };
      }
      
      // If API returns { success: true, data: { ... } }, just return it
      return data;
      // --- FIX ENDS HERE ---

    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * POST /api/subjects
   * Create new subject
   */
  createSubject: async (subjectPayload) => {
    if (USE_MOCK_DATA) {
      console.log("Mock Create Subject:", subjectPayload);
      const newId = Math.floor(Math.random() * 1000) + 10;
      return new Promise(res => setTimeout(() => res({
        success: true,
        message: "Subject created successfully",
        data: { id: newId, ...subjectPayload }
      }), 800));
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subjectPayload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create subject');
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}