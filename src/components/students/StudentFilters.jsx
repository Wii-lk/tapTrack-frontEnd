import React, { useState, useEffect } from "react";
import { Search, Filter, RefreshCcw } from "lucide-react";
import { gradeService } from "../../services/gradeService";

const StudentFilters = ({ filters, onFilterChange, onReset }) => {
  const [grades, setGrades] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(true);

  // Fetch Grades on Mount
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await gradeService.getAllGrades({ is_active: true });
        if (response.success) {
          // Adjust based on your API response structure for grades
          const gradeList = response.data.grades || response.data || [];
          setGrades(gradeList);
        }
      } catch (error) {
        console.error("Failed to fetch grades for filter", error);
      } finally {
        setLoadingGrades(false);
      }
    };

    fetchGrades();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
            <Filter size={18} />
          </div>
          <h3 className="text-base font-bold text-gray-800">Filter Students</h3>
        </div>

        {/* Reset Button */}
        {(filters.search ||
          filters.grade_id ||
          filters.is_active ||
          filters.fee_status) && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-gray-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
          >
            <RefreshCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search (Spans 1 on mobile, 1 on desktop) */}
        <div className="relative md:col-span-1">
          <input
            type="text"
            name="search"
            value={filters.search || ""}
            onChange={handleChange}
            placeholder="Search student..."
            className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
        </div>

        {/* Grade Filter (Dynamic) */}
        <div className="relative">
          <select
            name="grade_id"
            value={filters.grade_id || ""}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none cursor-pointer"
          >
            <option value="">All Grades</option>
            {loadingGrades ? (
              <option disabled>Loading...</option>
            ) : (
              grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))
            )}
          </select>
          {/* Custom Arrow for select */}
          <div className="absolute right-3 top-3 pointer-events-none text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>

        {/* Fee Status Filter (New) */}
        <div className="relative">
          <select
            name="fee_status"
            value={filters.fee_status || ""}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none cursor-pointer"
          >
            <option value="">All Fee Status</option>
            <option value="outstanding">Has Outstanding Fees</option>
            <option value="clear">No Outstanding Fees</option>
          </select>
          <div className="absolute right-3 top-3 pointer-events-none text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>

        {/* Account Status Filter */}
        <div className="relative">
          <select
            name="is_active"
            value={filters.is_active || ""}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 appearance-none cursor-pointer"
          >
            <option value="">All Account Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <div className="absolute right-3 top-3 pointer-events-none text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFilters;
