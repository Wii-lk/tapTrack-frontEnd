import React from 'react';
import { Edit2, Trash2, Eye, User, Hash } from 'lucide-react'; // Added Hash icon

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

    // --- Mobile Card Component ---
    const TeacherCard = ({ teacher }) => (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-3">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                        <span className="text-blue-600 font-bold text-sm">
                            {teacher.firstName ? teacher.firstName.charAt(0) : ''}
                            {teacher.lastName ? teacher.lastName.charAt(0) : ''}
                        </span>
                    </div>
                    <div className="ml-3">
                        <h4 className="text-sm font-semibold text-gray-900">{teacher.fullName}</h4>
                        <span
                            className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                teacher.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {teacher.status}
                        </span>
                    </div>
                </div>
                <div className="flex space-x-1">
                    <button
                        onClick={() => onView(teacher)}
                        className="p-1.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => onEdit(teacher)}
                        className="p-1.5 text-orange-600 bg-orange-50 rounded hover:bg-orange-100"
                        title="Edit"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(teacher)}
                        className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-600 border-t border-gray-100 pt-3">
                <div className="col-span-2">
                    <span className="block text-gray-400">Designation</span>
                    {teacher.designation}
                </div>
                <div>
                     <span className="block text-gray-400">Employee ID</span>
                     {teacher.employee_no || teacher.unique_no || 'N/A'}
                </div>
                 <div>
                     <span className="block text-gray-400">Phone</span>
                     {teacher.phone}
                </div>
                 <div className="col-span-2">
                     <span className="block text-gray-400">Email</span>
                     {teacher.email}
                </div>
            </div>
        </div>
    );

    // --- Main Table ---
    return (
        <div>
            {/* Mobile View (Cards) */}
            <div className="block md:hidden">
                {teachers.map((teacher) => (
                    <TeacherCard key={teacher.id} teacher={teacher} />
                ))}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Teacher Name
                            </th>
                            
                            {/* NEW COLUMN: Employee ID */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Employee ID
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
                            const firstNameInitial = teacher.firstName ? teacher.firstName.charAt(0) : '';
                            const lastNameInitial = teacher.lastName ? teacher.lastName.charAt(0) : '';
                            const isActive = teacher.status === 'active';

                            return (
                                <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                                                <span className="text-blue-600 font-bold text-sm">
                                                    {firstNameInitial}{lastNameInitial}
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

                                    {/* NEW DATA CELL: Employee ID */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded w-fit border border-gray-100">
                                            <Hash size={14} className="mr-1 text-gray-400" />
                                            {/* Display employee_no if available, fallback to unique_no */}
                                            {teacher.employee_no || teacher.unique_no || 'N/A'}
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
                                                className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded hover:bg-blue-100 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => onEdit(teacher)}
                                                className="text-orange-600 hover:text-orange-900 bg-orange-50 p-1.5 rounded hover:bg-orange-100 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(teacher)}
                                                className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded hover:bg-red-100 transition-colors"
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
        </div>
    );
};

export default TeacherTable;