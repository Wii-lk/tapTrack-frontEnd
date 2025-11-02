import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Card from '../common/Card';

const TeacherFilters = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Card className="p-3 md:p-4">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Input
              label="Search"
              type="text"
              name="search"
              placeholder="Search by name, email, phone..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              icon={Search}
            />
          </div>

          {/* Position */}
          <div>
            <Select
              label="Position"
              value={filters.position}
              onChange={(e) => handleChange('position', e.target.value)}
            >
              <option value="">All Positions</option>
              <option value="Principal">Principal</option>
              <option value="Vice Principal">Vice Principal</option>
              <option value="Senior Teacher">Senior Teacher</option>
              <option value="Teacher">Teacher</option>
              <option value="Assistant Teacher">Assistant Teacher</option>
            </Select>
          </div>

          {/* Status */}
          <div>
            <Select
              label="Status"
              value={filters.is_active}
              onChange={(e) => handleChange('is_active', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center justify-center gap-2 order-2 sm:order-1"
          >
            <X size={16} />
            Reset
          </Button>
          <Button className="flex items-center justify-center gap-2 order-1 sm:order-2">
            <Filter size={16} />
            Filter
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TeacherFilters;