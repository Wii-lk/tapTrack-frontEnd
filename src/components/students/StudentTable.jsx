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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* ...<thead>... */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admission No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Section
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                {/* ...<td> for Admission No... */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.admissionNo}
                </td>
                {/* ...<td> for Student Name... */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold">
                        {student.firstName.charAt(0)}
                        {student.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.email}
                      </div>
                    </div>
                  </div>
                </td>
                {/* ...<td> for Class... */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.class}
                </td>
                {/* ...<td> for Section... */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.section}
                </td>
                {/* ...<td> for Phone... */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.parent_phone}
                </td>
                {/* ...<td> for Status... */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                {/* ...<td> for Actions... */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView(student)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => handleEditClick(student.id)}
                      disabled={editingRow === student.id}
                      className="text-orange-600 hover:text-orange-900 disabled:opacity-50 disabled:cursor-wait"
                      title="Edit"
                    >
                      {editingRow === student.id ? (
                        <div
                          className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"
                          style={{ width: '18px', height: '18px' }}
                        ></div>
                      ) : (
                        <Edit2 size={18} />
                      )}
                    </button>

                    <button
                      onClick={() => onDelete(student)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;