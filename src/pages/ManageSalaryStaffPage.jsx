import React, { useState, useEffect, useCallback } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { salaryService } from '../services/salaryService';
import Alert from '../components/common/Alert';
import StaffSalaryListTable from '../components/payments/StaffSalaryListTable'; 

const ManageSalaryStaffPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 1. Fetch the list of all staff
  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await salaryService.getStaffList();
      if (res.success) {
        setStaffList(res.data);
      } else {
        setStaffList([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch staff list');
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // 2. Handle Click: Navigate to the Calculation Page for this specific user
  const handleGenerateClick = (userId) => {
    // This pushes the user to /salary/manage/5 (for example)
    navigate(`/salary/manage/${userId}`);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <FileSpreadsheet size={28} className="text-orange-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manage Staff Salary</h2>
            <p className="text-gray-600 mt-1">Select a staff member to generate or view salary.</p>
          </div>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      
      {/* Table displays staff. clicking action triggers handleGenerateClick */}
      <StaffSalaryListTable 
        staffList={staffList} 
        loading={loading} 
        onGenerateClick={handleGenerateClick} 
      />
    </div>
  );
};

export default ManageSalaryStaffPage;