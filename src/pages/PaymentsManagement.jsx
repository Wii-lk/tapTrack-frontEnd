import React, { useEffect, useState } from "react";
import { DollarSign } from "lucide-react";
import { salaryService } from "../services/salaryService";
import Alert from "../components/common/Alert";
import StaffSalaryTable from "../components/payments/StaffSalaryTable";

/**
 * Page to display the list of all staff for salary generation.
 */

const PayementManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch the list of staff when the page loads
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await salaryService.getStaffSalaryList();
        if (res.success) {
          setStaffList(res.data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }

    };
    fetchStaff();
  }, []);


  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <DollarSign size={28} className="text-gray-700" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Staff Salary Management</h2>
          <p className="text-gray-600 mt-1">Generate and manage salary slips for staff members</p>
        </div>
      </div>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* The Component that renders the actual tab;e */}
      <StaffSalaryTable staffList={staffList} loading={loading} />
    </div>
  );
};

export default PayementManagement;