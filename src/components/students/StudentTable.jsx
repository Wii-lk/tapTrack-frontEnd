import React, { useState } from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';
// 1. Import your service
import studentService from '../../services/studentService'; // <-- Adjust path if needed

const StudentTable = ({ students, onEdit, onDelete, onView, loading }) => {
  const [editingRow, setEditingRow] = useState(null);

  const handleEditClick = async (studentId) => {
    setEditingRow(studentId);
    try {
      // 2. --- MODIFIED API CALL ---
      // Call the service file instead of using fetch directly
      const result = await studentService.getStudentById(studentId);
      // ----------------------------

      if (result.success && result.data) {
        // Pass the detailed data from the API (result.data) to the parent
        onEdit(result.data);
      } else {
        console.error("API call failed or data was missing:", result);
        alert("Could not fetch student details. Please try again.");
      }
    } catch (error) {
      console.error("Failed to fetch student details:", error);
      alert(`Failed to fetch student details: ${error.message}`);
    } finally {
      setEditingRow(null); // Reset loading state
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading students...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">No students found</p>
      </div>
    );
  }

return (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="overflow-x-auto"> {/* This enables horizontal swipe on mobile */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* Use whitespace-nowrap to prevent headers from stacking */}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Student Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Class
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
           {/* Apply px-4 (smaller than 6) for tighter mobile fit */}
           {students.map((student) => (
             <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm">{student.index_no}</td>
                {/* ... rest of your tds ... */}
             </tr>
           ))}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default StudentTable;