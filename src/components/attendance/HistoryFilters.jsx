import React, { useState } from 'react';
import { Search, Download } from 'lucide-react'; // Import Download icon
import Button from '../common/Button';
import Input from '../common/Input'; // Assuming you have this

/**
 * Filters for the "History & Reports" view
 */
// Add onExport to props
const HistoryFilters = ({ onSearch, loading, onExport }) => {
  const [filters, setFilters] = useState({
    user_id: '',
    from_date: '',
    to_date: '',
    status: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          name="user_id"
          label="User ID"
          placeholder="Enter User ID (e.g., 5)"
          value={filters.user_id}
          onChange={handleChange}
        />
        <Input
          name="from_date"
          label="From Date"
          type="date"
          value={filters.from_date}
          onChange={handleChange}
        />
        <Input
          name="to_date"
          label="To Date"
          type="date"
          value={filters.to_date}
          onChange={handleChange}
        />
        <Input
          name="status"
          label="Status"
          placeholder="e.g., late, absent"
          value={filters.status}
          onChange={handleChange}
        />
      </div>
      {/* Updated this section to include the export button */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onExport} 
          disabled={loading}
          className="w-full sm:w-auto"
        >
          <Download size={18} className="mr-2" />
          Export Data
        </Button>
        <Button 
          type="submit" 
          loading={loading} 
          className="w-full sm:w-auto"
        >
          <Search size={18} className="mr-2" />
          Search History
        </Button>
      </div>
    </form>
  );
};

export default HistoryFilters;