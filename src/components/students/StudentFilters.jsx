import React from 'react';
import { Search, Filter } from 'lucide-react';
import Input from '../common/Input';

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            name="search"
            value={filters.search || ''}
            onChange={handleChange}
            placeholder="Search by name, admission no..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Search
            size={20}
            className="absolute left-3 top-2.5 text-gray-400"
          />
        </div>

        {/* Class Filter */}
        <select
          name="class"
          value={filters.class || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Classes</option>
          <option value="Grade 8">Grade 8</option>
          <option value="Grade 9">Grade 9</option>
          <option value="Grade 10">Grade 10</option>
          <option value="Grade 11">Grade 11</option>
        </select>

        {/* Section Filter */}
        <select
          name="section"
          value={filters.section || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Sections</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
          <option value="C">Section C</option>
        </select>

        {/* Status Filter */}
        <select
          name="status"
          value={filters.status || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
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