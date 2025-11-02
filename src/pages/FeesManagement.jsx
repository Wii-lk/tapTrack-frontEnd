import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, DollarSign, ArrowUpRight, AlertTriangle, Users } from 'lucide-react';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import feeService from '../services/feeService'; 

// Summary Card Component 
const FeeSummaryCards = ({ summary }) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50">
            <DollarSign className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-sm text-gray-500">Total Outstanding Fee</p>
            <p className="text-xl font-bold text-gray-800">
                LKR {summary.totalOutstanding?.toLocaleString() || '...'}
            </p>
        </Card>
        <Card className="p-4 bg-yellow-50">
            <ArrowUpRight className="w-6 h-6 text-yellow-600 mb-2" />
            <p className="text-sm text-gray-500">Upcoming Dues (7 days)</p>
            <p className="text-xl font-bold text-gray-800">
                {summary.upcomingDues !== undefined ? summary.upcomingDues : '...'} Students
            </p>
        </Card>
        <Card className="p-4 bg-green-50">
            <DollarSign className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm text-gray-500">Collected Today</p>
            <p className="text-xl font-bold text-gray-800">
                LKR {summary.collectedToday?.toLocaleString() || '...'}
            </p>
        </Card>
        <Card className="p-4 bg-red-50">
            <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
            <p className="text-sm text-gray-500">Students with Arrears</p>
            <p className="text-xl font-bold text-gray-800">
                {summary.studentsWithArrears !== undefined ? summary.studentsWithArrears : '...'} Students
            </p>
        </Card>
    </div>
);

// --- Fee Table Component (Unchanged) ---
const FeeDueTable = ({ records, onPayClick, loading }) => {
    // This will contain the table structure based on your requirements
    if (loading) return <LoadingSpinner />;
    if (records.length === 0) return <p className="text-center text-gray-500 py-8">No fee records found.</p>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Amount</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {records.map((record) => (
                        <tr key={record.student_id + record.month} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.student_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.student_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.grade}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.month_display}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">LKR {record.total_monthly_amount.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">LKR {record.giving_amount.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    record.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                    record.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {record.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                {record.status !== 'Paid' && (
                                    <button
                                        onClick={() => onPayClick(record.student_id)}
                                        className="text-indigo-600 hover:text-indigo-900 text-xs font-semibold"
                                    >
                                        Pay
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Filter Button Component (New) ---
const FilterButton = ({ label, onClick, active }) => (
    <button
      onClick={onClick}
      className={`px-4 py-1 text-sm font-medium rounded-full transition-colors ${
        active
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
);

// --- Main Fees Management Component (Updated) ---
const FeesManagement = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState({});
    const [feeRecords, setFeeRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    
    // State for the status filter. '' means 'All'.
    const [statusFilter, setStatusFilter] = useState('');

    // 1. Fetch Summary Data (Unchanged)
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await feeService.getFeeSummary();
                setSummary(response.data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchSummary();
    }, []);

    // 2. Fetch Fee Records (Updated to use statusFilter)
    useEffect(() => {
        const fetchRecords = async () => {
            setLoading(true);
            setError('');
            try {
                // Pass both search and statusFilter to the service
                const response = await feeService.getStudentFeeRecords(search, statusFilter);
                setFeeRecords(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        const timeoutId = setTimeout(fetchRecords, 300); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [search, statusFilter]); // Re-run effect when search or statusFilter changes

    // 3. Handle Pay Action (Unchanged)
    const handlePayClick = (studentId) => {
        // Navigate to a new route for the payment form
        navigate(`/fees/pay/${studentId}`);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Student Fees Management</h2>
            <p className="text-gray-600">Overview of outstanding dues, collections, and student payment status.</p>

            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            
            {/* Summary Cards */}
            <FeeSummaryCards summary={summary} />

            {/* Fees Table and Search/Filters */}
            <Card title="Fee Payment Status" subtitle="Recent fee records and outstanding balances">
                
                {/* Filter and Search Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    {/* Filter Buttons */}
                    <div className="flex space-x-2 flex-wrap">
                        <FilterButton label="All" onClick={() => setStatusFilter('')} active={statusFilter === ''} />
                        <FilterButton label="Paid" onClick={() => setStatusFilter('Paid')} active={statusFilter === 'Paid'} />
                        <FilterButton label="Partial" onClick={() => setStatusFilter('Partial')} active={statusFilter === 'Partial'} />
                        <FilterButton label="Unpaid" onClick={() => setStatusFilter('Unpaid')} active={statusFilter === 'Unpaid'} />
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative w-full md:w-auto md:max-w-xs">
                        <input
                            type="text"
                            placeholder="Search by name or ID"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                {/* Fee Table */}
                <FeeDueTable 
                    records={feeRecords} 
                    onPayClick={handlePayClick} 
                    loading={loading} 
                />
            </Card>
        </div>
    );
};

export default FeesManagement;