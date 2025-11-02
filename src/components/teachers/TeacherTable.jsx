import React from 'react';
import { Edit2, Trash2, Eye, User } from 'lucide-react';

const TeacherTable = ({ teachers, onEdit, onDelete, onView, loading }) => {
    // --- Loading State ---
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading teachers...</p>
            </div>
        );
    }

    // --- No Data State ---
    if (teachers.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <User size={40} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
                <p className="text-gray-600">Get started by adding a new teacher.</p>
            </div>
        );
    }

    // --- Main Table ---
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Teacher Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Designation
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
                        {teachers.map((teacher) => {
                            // Uses: firstName, lastName, designation, phone, status
                            const firstNameInitial = teacher.firstName ? teacher.firstName.charAt(0) : '';
                            const lastNameInitial = teacher.lastName ? teacher.lastName.charAt(0) : '';
                            const isActive = teacher.status === 'active';

                            return (
                                <tr key={teacher.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-semibold">
                                                    {firstNameInitial}
                                                    {lastNameInitial}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {teacher.fullName || `${teacher.firstName} ${teacher.lastName}`}
                                                </div>
                                                <div className="text-sm text-gray-500">{teacher.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {teacher.designation}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {teacher.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {teacher.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onView(teacher)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => onEdit(teacher)}
                                                className="text-orange-600 hover:text-orange-900"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(teacher)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherTable;