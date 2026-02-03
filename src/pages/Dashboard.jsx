import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Alert from "../components/common/Alert";
import { dashboardService } from "../services/dashboardService";
import {
  Users,
  TrendingUp,
  UserPlus,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
  ShieldCheck,
  BookOpen, // For Staff
} from "lucide-react";
import AttendanceDetailsModal from "../components/dashboard/AttendanceDetailsModal";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [attendanceDetails, setAttendanceDetails] = useState(null); // New State
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false); // Modal State

  const navigate = useNavigate();

  // --- Dynamic Greeting ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const [statsRes, detailsRes] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getAttendanceDetails(),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (detailsRes.success) setAttendanceDetails(detailsRes.data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error)
    return (
      <div className="p-6">
        <Alert type="error" message={error} onClose={() => setError("")} />
      </div>
    );

  const revenue = stats?.financial?.fees_collected_this_month || 0;
  const outstanding = stats?.financial?.outstanding_fees || 0;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8 font-sans text-gray-800">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
            <Calendar size={14} />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {getGreeting()}, <span className="text-blue-600">Admin</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Here is what's happening on campus today.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-50 transition">
            Export Reports
          </button>
          <button
            onClick={() => navigate("/students/new")}
            className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:bg-gray-800 transition flex items-center gap-2"
          >
            <UserPlus size={16} />
            New Admission
          </button>
        </div>
      </div>

      {/* --- BENTO GRID LAYOUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {/* 1. HERO CARD: Revenue (Red & White Theme) */}
        <div className="md:col-span-2 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[220px]">
          {/* Decorative gradients: Changed to White/Orange for warmth on Red */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>

          <div className="relative z-10 flex justify-between items-start">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/10">
              <TrendingUp className="text-white" size={24} />
            </div>
            <button className="text-red-100 hover:text-white transition">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="relative z-10 mt-6">
            <p className="text-red-100 text-sm font-medium mb-1">
              Total Revenue (This Month)
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-white">
              LKR {revenue.toLocaleString()}
            </h2>
            {/* <div className="flex items-center gap-2 mt-4 text-sm">
              
              <span className="bg-white text-red-700 px-2 py-1 rounded-lg flex items-center gap-1 font-bold shadow-sm">
                <ArrowUpRight size={14} /> +12.5%
              </span>
              <span className="text-red-100">vs last month</span>
            </div> */}
          </div>
        </div>

        {/* 2. ATTENDANCE SECTION - Spans 1 col */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative group">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-500 text-sm font-semibold">Attendance</p>
              <p className="text-xs text-gray-400">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => setIsAttendanceModalOpen(true)}
              className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
              title="View Details"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Split Stats */}
          <div className="space-y-4">
            {/* Staff Stat */}
            <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white text-purple-600 rounded-xl shadow-sm">
                  <BookOpen size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    Staff
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {attendanceDetails?.overview?.staff_present || 0}
                    <span className="text-gray-400 text-xs font-normal">
                      {" "}
                      / {attendanceDetails?.overview?.staff_total || 0}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Student Stat */}
            <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white text-blue-600 rounded-xl shadow-sm">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    Students
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {attendanceDetails?.overview?.student_present || 0}
                    <span className="text-gray-400 text-xs font-normal">
                      {" "}
                      / {attendanceDetails?.overview?.student_total || 0}
                    </span>
                  </p>
                </div>
              </div>
              {/* Mini Pie or Ring could go here */}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <button
              onClick={() => setIsAttendanceModalOpen(true)}
              className="text-xs font-bold text-gray-400 hover:text-blue-600 flex items-center justify-center gap-1 transition-colors w-full"
            >
              View Full Report <MoreHorizontal size={14} />
            </button>
          </div>
        </div>

        {/* 3. STATS STACK - Spans 1 col */}
        <div className="flex flex-col gap-6">
          {/* Outstanding Fees */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col justify-center group hover:border-red-100 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-50 text-red-500 rounded-lg group-hover:bg-red-100 transition-colors">
                <CreditCard size={20} />
              </div>
              <span className="text-sm font-semibold text-gray-500">
                Outstanding
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {outstanding > 100000
                ? `${(outstanding / 100000).toFixed(1)}L`
                : outstanding.toLocaleString()}
            </h3>
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-medium">
              <ArrowDownRight size={14} /> Pending Collection
            </p>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col justify-center group hover:border-blue-100 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Users size={20} />
              </div>
              <span className="text-sm font-semibold text-gray-500">
                Active Users
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {stats?.today?.total_users}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {stats?.quick_stats?.total_students} Students •{" "}
              {stats?.quick_stats?.total_staff} Staff
            </p>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: CHART & ACTIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FEE STATUS & RECENT TRANSACTIONS */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fee Overview Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Fee Collection Overview
              </h3>
              <span className="text-xs font-semibold bg-green-50 text-green-600 px-2 py-1 rounded-lg">
                {new Date().toLocaleString("default", { month: "long" })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-500 mb-1">Collected Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  LKR{" "}
                  {(
                    stats?.financial?.fees_collected_today || 0
                  ).toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-2xl">
                <p className="text-sm text-red-500 mb-1">Students with Dues</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats?.financial?.students_with_dues || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Scans / Payments List */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Recent Transactions
              </h3>
              <button
                onClick={() => navigate("/fees")}
                className="text-sm text-blue-600 font-semibold hover:text-blue-700"
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              {stats?.financial?.recent_payments?.length > 0 ? (
                stats.financial.recent_payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">
                        {payment.amount > 0 ? "+" : ""}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {payment.student_name}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">
                          {payment.method} •{" "}
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      +LKR {parseFloat(payment.amount).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No recent payments
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS - 1 Col */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="text-gray-900" size={20} />
            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
          </div>

          <div className="space-y-3">
            <ActionTile
              icon={Wallet}
              title="Process Salary"
              subtitle="Payroll & Slips"
              color="bg-amber-50 text-amber-600"
              onClick={() => navigate("/salary/manage")}
            />
            <ActionTile
              icon={TrendingUp}
              title="Fee Collection"
              subtitle="Record Payments"
              color="bg-emerald-50 text-emerald-600"
              onClick={() => navigate("/fees")}
            />
            <ActionTile
              icon={Users}
              title="Manage Staff"
              subtitle="Profiles & Roles"
              color="bg-purple-50 text-purple-600"
              onClick={() => navigate("/teachers")}
            />
            {/* <ActionTile 
                icon={CreditCard} 
                title="Expenses" 
                subtitle="Log Petty Cash" 
                color="bg-pink-50 text-pink-600"
                onClick={() => navigate('/expenses')}
              /> */}
          </div>
        </div>
      </div>
      <AttendanceDetailsModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        data={attendanceDetails}
        loading={loading}
      />
    </div>
  );
};

// --- Sub-components for cleaner code ---

const ActionTile = ({ icon: Icon, title, subtitle, color, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group text-left"
  >
    <div
      className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform`}
    >
      <Icon size={20} />
    </div>
    <div>
      <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
    <div className="ml-auto text-gray-300 group-hover:text-gray-600 transition-colors">
      <ArrowUpRight size={18} />
    </div>
  </button>
);

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-8 space-y-8">
    <div className="h-12 w-1/3 bg-gray-200 rounded-xl animate-pulse"></div>
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-2 h-64 bg-gray-200 rounded-3xl animate-pulse"></div>
      <div className="h-64 bg-gray-200 rounded-3xl animate-pulse"></div>
      <div className="h-64 bg-gray-200 rounded-3xl animate-pulse"></div>
    </div>
  </div>
);

export default Dashboard;
