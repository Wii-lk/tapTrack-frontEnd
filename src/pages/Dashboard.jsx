import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RevenueChart from '../components/dashboard/RevenueChart';
import Alert from '../components/common/Alert';
import { dashboardService } from '../services/dashboardService';
import {
  Users,
  Clock,
  TrendingUp,
  UserPlus,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
  ShieldCheck
} from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  // --- Dynamic Greeting ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const [statsRes, chartRes] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRevenueChartData()
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (chartRes.success) setChartData(chartRes.data.daily_collection);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="p-6"><Alert type="error" message={error} onClose={() => setError('')} /></div>;

  // Calculations
  const attendancePct = stats ? Math.round((stats.today.present / stats.today.total_users) * 100) : 0;
  const revenue = stats?.financial?.fees_collected_this_month || 0;
  const outstanding = stats?.financial?.outstanding_fees || 0;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8 font-sans text-gray-800">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
            <Calendar size={14} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {getGreeting()}, <span className="text-blue-600">Admin</span>
          </h1>
          <p className="text-gray-500 mt-1">Here is what's happening on campus today.</p>
        </div>
        
        <div className="flex gap-3">
           <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:bg-gray-50 transition">
             Export Reports
           </button>
           <button 
             onClick={() => navigate('/students/new')}
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
            <p className="text-red-100 text-sm font-medium mb-1">Total Revenue (This Month)</p>
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

        {/* 2. ATTENDANCE CARD - Spans 1 col */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center relative">
          <div className="absolute top-6 left-6">
            <p className="text-gray-500 text-sm font-semibold">Attendance</p>
          </div>
          <div className="absolute top-6 right-6 p-2 bg-blue-50 text-blue-600 rounded-full">
            <Clock size={18} />
          </div>
          
          {/* Custom Circular Progress */}
          <div className="relative w-40 h-40 mt-4">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
               <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * attendancePct) / 100} className="text-blue-600 transition-all duration-1000 ease-out" strokeLinecap="round" />
             </svg>
             <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
               <span className="text-3xl font-bold text-gray-900">{attendancePct}%</span>
               <span className="text-xs text-gray-400 font-medium uppercase">Present</span>
             </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500"><span className="font-bold text-gray-900">{stats?.today?.present}</span> / {stats?.today?.total_users} checked in</p>
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
              <span className="text-sm font-semibold text-gray-500">Outstanding</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {outstanding > 100000 ? `${(outstanding/100000).toFixed(1)}L` : outstanding.toLocaleString()}
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
              <span className="text-sm font-semibold text-gray-500">Active Users</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.today?.total_users}</h3>
            <p className="text-xs text-gray-400 mt-1">
              {stats?.quick_stats?.total_students} Students • {stats?.quick_stats?.total_staff} Staff
            </p>
          </div>

        </div>
      </div>

      {/* --- SECTION 2: CHART & ACTIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* REVENUE CHART - 2 Cols */}
        {/* <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Financial Overview</h3>
              <p className="text-sm text-gray-500">Daily fee collection performance</p>
            </div>
            <select className="bg-gray-50 border-none text-sm font-semibold text-gray-600 rounded-lg py-2 px-3 outline-none cursor-pointer hover:bg-gray-100">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
        
          <div className="w-full h-[300px]">
             <RevenueChart data={chartData} />
          </div>
        </div> */}

        {/* QUICK ACTIONS - 1 Col */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
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
                onClick={() => navigate('/salary/manage')}
              />
              <ActionTile 
                icon={TrendingUp} 
                title="Fee Collection" 
                subtitle="Record Payments" 
                color="bg-emerald-50 text-emerald-600"
                onClick={() => navigate('/fees')}
              />
              <ActionTile 
                icon={Users} 
                title="Manage Staff" 
                subtitle="Profiles & Roles" 
                color="bg-purple-50 text-purple-600"
                onClick={() => navigate('/teachers')}
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
    </div>
  );
};

// --- Sub-components for cleaner code ---

const ActionTile = ({ icon: Icon, title, subtitle, color, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group text-left"
  >
    <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
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