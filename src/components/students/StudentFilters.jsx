import React from 'react';
import { Search, Filter } from 'lucide-react';
import Input from '../common/Input'; // This import isn't used by the inputs, but kept for context

// In a real app, you would fetch this from '/api/grades'
// Using the grades from your API docs and form for consistency
const GRADES_LIST = [
  { id: 1, name: 'Grade 1' },
  { id: 2, name: 'Grade 2' },
  { id: 3, name: 'Grade 3' },
  { id: 5, name: 'Grade 4' },
  { id: 6, name: 'Grade 5' },
  { id: 9, name: 'Grade 6' },
  { id: 10, name: 'Grade 10-A' },
  // Add other grades as needed
];

const StudentFilters = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex items-center mb-4">
        <Filter size={20} className="text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
      </div>

      {/* Grid is 4 columns. Search spans 2, others span 1. */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Search (Spans 2 columns) */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            name="search" // This name is correct
            value={filters.search || ''}
            onChange={handleChange}
            placeholder="Search by name, parent name..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Search
            size={20}
            className="absolute left-3 top-2.5 text-gray-400"
          />
        </div>

        {/* Grade Filter (Was Class) */}
        <select
          name="grade_id" // 1. CORRECTED: Name now 'grade_id'
          value={filters.grade_id || ''} // 2. CORRECTED: State property is 'grade_id'
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Grades</option>
          {/* 3. CORRECTED: Value is now the grade ID (integer) */}
          {GRADES_LIST.map(grade => (
            <option key={grade.id} value={grade.id}>
              {grade.name}
            </option>
          ))}
        </select>

        {/* Status Filter (Was Status) */}
        <select
          name="is_active" // 4. CORRECTED: Name now 'is_active'
          value={filters.is_active || ''} // 5. CORRECTED: State property is 'is_active'
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Status</option>
          {/* 6. CORRECTED: Values are now 'true' and 'false' strings */}
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="mt-4">
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default StudentFilters;
