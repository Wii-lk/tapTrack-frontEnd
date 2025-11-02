import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import QuickActionCard from '../components/dashboard/QuickActionCard';
import AttendanceCard from '../components/dashboard/AttendanceCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import {
  Users,
  GraduationCap,
  AlertCircle,
  TrendingUp,
  UserPlus,
  DollarSign,
  Wallet,
} from 'lucide-react';
import dashboardService from '../services/dashboardService';
import Alert from '../components/common/Alert';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardStats();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} onClose={() => setError('')} />;
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-full overflow-x-hidden">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Student Attendance"
          value={`${dashboardData?.todayStudentAttendance?.percentage}%`}
          subtitle={`${dashboardData?.todayStudentAttendance?.present} / ${dashboardData?.todayStudentAttendance?.total} present`}
          icon={Users}
          iconColor="bg-green-500"
        />

        <StatCard
          title="Today's Teacher Attendance"
          value={`${dashboardData?.todayTeacherAttendance?.percentage}%`}
          subtitle={`${dashboardData?.todayTeacherAttendance?.present} / ${dashboardData?.todayTeacherAttendance?.total} present`}
          icon={GraduationCap}
          iconColor="bg-[#800000]"
        />

        <StatCard
          title="Outstanding Fees"
          value={`LKR ${dashboardData?.outstandingFees?.amount?.toLocaleString()}`}
          subtitle="Pending collection"
          icon={AlertCircle}
          iconColor="bg-red-500"
        />

        <StatCard
          title={`Total Fees (${dashboardData?.totalFeesCollected?.year})`}
          value={`LKR ${dashboardData?.totalFeesCollected?.amount?.toLocaleString()}`}
          subtitle="Collected this year"
          icon={TrendingUp}
          iconColor="bg-[#800000]"
        />
      </div>

      {/* Attendance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AttendanceCard
          title="Today's Student Attendance"
          present={dashboardData?.todayStudentAttendance?.present || 0}
          total={dashboardData?.todayStudentAttendance?.total || 0}
          type="student"
        />

        <AttendanceCard
          title="Today's Teacher Attendance"
          present={dashboardData?.todayTeacherAttendance?.present || 0}
          total={dashboardData?.todayTeacherAttendance?.total || 0}
          type="teacher"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            title="Add New Student"
            description="Register a new student to the system"
            icon={UserPlus}
            color="maroon"
            onClick={() => navigate('/students')}
          />

          <QuickActionCard
            title="Process Fee Payments"
            description="Collect and process student fees"
            icon={DollarSign}
            color="maroon"
            onClick={() => navigate('/fees')}
          />

          <QuickActionCard
            title="Process Salary Payments"
            description="Generate and process teacher salary slips"
            icon={Wallet}
            color="maroon"
            onClick={() => navigate('/payments')}
          />
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="w-full overflow-hidden">
        <RevenueChart data={dashboardData?.revenueData || []} />
      </div>
    </div>
  );
};

export default Dashboard;
