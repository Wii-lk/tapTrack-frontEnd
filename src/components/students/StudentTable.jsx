import React, { useState } from "react";
import { Edit2, Trash2, Users } from "lucide-react";
// 1. Import your service
import studentService from "../../services/studentService"; // <-- Adjust path if needed

const StudentTable = ({ students, onEdit, onDelete, onView, loading }) => {
  const [editingRow, setEditingRow] = useState(null);

  // Mobile Card Component
  const StudentCard = ({ student }) => (
    <div
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
      onClick={() => onView(student)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-primary-50 rounded-full flex items-center justify-center border border-primary-100">
            <span className="text-primary-700 font-bold">
              {student.firstName.charAt(0)}
              {student.lastName.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-bold text-gray-900">
              {student.fullName}
            </h4>
            <span
              className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                student.status === "active"
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}
            >
              {student.status}
            </span>
          </div>
        </div>
        <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
          {/* Eye Button Removed for Mobile too - consistent UX, tap card to view */}
          <button
            onClick={() => handleEditClick(student.id)}
            disabled={editingRow === student.id}
            className="p-2 text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 disabled:opacity-50 transition-colors"
            title="Edit"
          >
            {editingRow === student.id ? (
              <div className="animate-spin h-4 w-4 border-b-2 border-primary-600 rounded-full"></div>
            ) : (
              <Edit2 size={16} />
            )}
          </button>
          <button
            onClick={() => onDelete(student)}
            className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-2 text-xs text-secondary-600 border-t border-gray-100 pt-3 mt-2">
        <div>
          <span className="block text-secondary-400 font-medium mb-0.5">
            Class
          </span>
          {student.class}
        </div>
        <div>
          <span className="block text-secondary-400 font-medium mb-0.5">
            Admission No
          </span>
          {student.index_no || student.admissionNo}
        </div>
        <div className="col-span-2">
          <span className="block text-secondary-400 font-medium mb-0.5">
            Email
          </span>
          {student.email || "N/A"}
        </div>
        <div className="col-span-2">
          <span className="block text-secondary-400 font-medium mb-0.5">
            Phone
          </span>
          {student.parent_phone}
        </div>
      </div>
    </div>
  );

  const handleEditClick = async (studentId) => {
    setEditingRow(studentId);
    try {
      const result = await studentService.getStudentById(studentId);
      if (result.success && result.data) {
        onEdit(result.data);
      } else {
        console.error("API call failed or data was missing:", result);
      }
    } catch (error) {
      console.error("Failed to fetch student details:", error);
    } finally {
      setEditingRow(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-secondary-500 font-medium">
          Loading students...
        </p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="mx-auto h-12 w-12 text-gray-300 bg-gray-50 rounded-full flex items-center justify-center mb-3">
          <Users size={24} className="opacity-50" />
        </div>
        <h3 className="text-gray-900 font-medium text-lg">No students found</h3>
        <p className="text-gray-500 text-sm mt-1">
          Try adjusting your filters or add a new student.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile View (Cards) */}
      <div className="block md:hidden">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Admission No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-primary-50/30 transition-colors cursor-pointer group"
                  onClick={() => onView(student)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.index_no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold border border-primary-200 shadow-sm">
                        {student.firstName.charAt(0)}
                        {student.lastName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {student.fullName}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {student.email || "No email"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-md text-gray-700 border border-gray-200">
                      {student.class}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.parent_phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                        student.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div
                      className="flex space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Removed Eye Button */}

                      <button
                        onClick={() => handleEditClick(student.id)}
                        disabled={editingRow === student.id}
                        className="p-1.5 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Edit"
                      >
                        {editingRow === student.id ? (
                          <div
                            className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"
                            style={{ width: "16px", height: "16px" }}
                          ></div>
                        ) : (
                          <Edit2 size={18} />
                        )}
                      </button>

                      <button
                        onClick={() => onDelete(student)}
                        className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
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
    </div>
  );
};

export default StudentTable;
