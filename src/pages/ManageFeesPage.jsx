import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feeService } from '../services/feeService';
import studentService from '../services/studentService';
import Button from '../components/common/Button';
import FeeOutstandingTable from '../components/fees/FeeOutstandingTable';
import PaymentHistoryTable from '../components/fees/PaymentHistoryTable';
import FeeReceiptModal from '../components/fees/FeeReceiptModal';
import { CreditCard, History, Filter, RefreshCw, Search, Loader2, X } from 'lucide-react';

const ManageFeesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('outstanding');
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [outstandingList, setOutstandingList] = useState([]);
  const [outstandingSummary, setOutstandingSummary] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  
  // Modal States
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  
  // 🟢 NEW: Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'outstanding') {
        const res = await feeService.getOutstandingFees();
        if (res.success) {
          setOutstandingList(res.data.students);
          setOutstandingSummary(res.data.summary);
        }
      } else {
        const res = await feeService.getPaymentHistory();
        if (res.success) {
          setHistoryList(res.data.payments);
        }
      }
    } catch (error) {
      console.error("Error fetching fee data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = (id) => {
    setSelectedPaymentId(id);
    setIsReceiptOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fee Management</h1>
          <p className="text-gray-500">Track outstanding dues and view payment history.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={fetchData} title="Refresh Data">
             <RefreshCw size={18} />
           </Button>
           
           {/* 🟢 MODIFIED: Opens Search Modal instead of navigating to '50' */}
           <Button onClick={() => setIsSearchOpen(true)}>
             <CreditCard size={18} className="mr-2" />
             New Payment
           </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {activeTab === 'outstanding' && outstandingSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
            <p className="text-gray-500 text-sm">Total Outstanding</p>
            <p className="text-2xl font-bold text-orange-600">
              {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(outstandingSummary.total_outstanding)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Students with Dues</p>
            <p className="text-2xl font-bold text-gray-800">{outstandingSummary.total_students_with_dues}</p>
          </div>
        </div>
      )}

      {/* Tabs & Tables */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b flex">
          <button
            onClick={() => setActiveTab('outstanding')}
            className={`px-6 py-3 text-sm font-medium flex items-center ${
              activeTab === 'outstanding' 
                ? 'border-b-2 border-orange-600 text-orange-600 bg-orange-50' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Filter size={16} className="mr-2" />
            Outstanding Fees
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 text-sm font-medium flex items-center ${
              activeTab === 'history' 
                ? 'border-b-2 border-orange-600 text-orange-600 bg-orange-50' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <History size={16} className="mr-2" />
            Payment History
          </button>
        </div>

        <div className="p-0">
          {activeTab === 'outstanding' ? (
            <FeeOutstandingTable students={outstandingList} loading={loading} />
          ) : (
            <PaymentHistoryTable 
              history={historyList} 
              loading={loading} 
              onViewReceipt={handleViewReceipt}
            />
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      <FeeReceiptModal 
        isOpen={isReceiptOpen} 
        onClose={() => setIsReceiptOpen(false)} 
        paymentId={selectedPaymentId} 
      />

      {/* 🟢 NEW: Student Search Modal */}
      <StudentSearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(studentId) => {
            setIsSearchOpen(false);
            navigate(`/fees/collect/${studentId}`);
        }}
      />

    </div>
  );
};

// --- Sub-Component: Student Search Modal ---
const StudentSearchModal = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // 1. Auto-load list when opened
  useEffect(() => {
    if (isOpen) {
      setQuery(''); // Reset query
      performSearch(''); // Load all students initially
    }
  }, [isOpen]);

  // 2. Search Logic
  const performSearch = async (searchTerm) => {
    setSearching(true);
    try {
      // Fetch students (active only)
      const response = await studentService.getStudents(1, 10, { 
        search: searchTerm, 
        is_active: true 
      });
      
      if (response.success) {
        setResults(response.data.students);
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setSearching(false);
    }
  };

  // 3. Debounced Search Effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (isOpen) {
        performSearch(query);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 mx-4">
        
        {/* Search Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            className="flex-1 outline-none text-gray-700 text-lg placeholder-gray-400 bg-transparent"
            placeholder="Search student name or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[400px] overflow-y-auto">
          {searching && (
            <div className="p-8 text-center text-gray-400 flex flex-col items-center">
              <Loader2 className="animate-spin mb-2" />
              <span>Loading students...</span>
            </div>
          )}

          {!searching && results.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No students found.
            </div>
          )}

          {!searching && results.map((student) => (
            <button
              key={student.id}
              onClick={() => onSelect(student.id)}
              className="w-full text-left p-4 hover:bg-blue-50 border-b border-gray-50 transition-colors flex items-center gap-4 group"
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                {student.fullName?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{student.fullName}</h4>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">{student.admissionNo}</span>
                  <span>{student.class}</span>
                </p>
              </div>
            </button>
          ))}
        </div>
        
        {/* Footer Hint */}
        <div className="p-3 bg-gray-50 text-xs text-center text-gray-400 border-t border-gray-100">
           Showing top results. Type to search more specific students.
        </div>
        
      </div>
      {/* Backdrop click to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default ManageFeesPage;