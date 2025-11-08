import React from 'react';
import { Filter, Download } from 'lucide-react';
import { SimpleButton } from '../common/SimpleButton';
import { SimpleSelect } from '../common/SimpleSelect';
import { MOCK_GRADES } from '../../services/attendanceService';

export const AttendanceFilters = ({ filters, onFilterChange, userType, onExport }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          <div className="flex-shrink-0 flex items-center">
            <Filter size={20} className="text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>
          
          {userType === 'student' && (
            <SimpleSelect
              name="grade_id"
              value={filters.grade_id}
              onChange={handleChange}
              className="md:w-64"
            >
              <option value="">All Classes</option>
              {MOCK_GRADES.map(grade => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </SimpleSelect>
          )}

          <SimpleSelect
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="md:w-64"
          >
            <option value="recent">Sort by Recent In</option>
            <option value="name">Sort by Name (A-Z)</option>
          </SimpleSelect>
        </div>
        
        <div className="flex-shrink-0">
          {/* <SimpleButton onClick={onExport} variant="outline">
            <Download size={18} className="mr-2 inline" />
            Export Data
          </SimpleButton> */}
        </div>
      </div>
    </div>
  );
};

export default AttendanceFilters;