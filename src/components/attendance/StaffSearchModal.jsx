import React, { useState, useEffect } from "react";
import teacherService from "../../services/teacherService";
import { Search, X, Loader2 } from "lucide-react";

const StaffSearchModal = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // 1. Auto-load list when opened
  useEffect(() => {
    if (isOpen) {
      setQuery(""); // Reset query
      performSearch(""); // Load all staff initially
    }
  }, [isOpen]);

  // 2. Search Logic
  const performSearch = async (searchTerm) => {
    setSearching(true);
    try {
      // Fetch teachers/staff (active only)
      // Using teacherService.getTeachers which maps to /api/staff
      const response = await teacherService.getTeachers(1, 10, {
        search: searchTerm,
        is_active: true,
      });

      if (response.success) {
        setResults(response.data.teachers); // teacherService normalizes 'staff' to 'teachers'
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
            placeholder="Search staff name, ID, or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[400px] overflow-y-auto">
          {searching && (
            <div className="p-8 text-center text-gray-400 flex flex-col items-center">
              <Loader2 className="animate-spin mb-2" />
              <span>Loading staff...</span>
            </div>
          )}

          {!searching && results.length === 0 && (
            <div className="p-8 text-center text-gray-400">No staff found.</div>
          )}

          {!searching &&
            results.map((staff) => (
              <button
                key={staff.id}
                onClick={() => onSelect(staff)}
                className="w-full text-left p-4 hover:bg-blue-50 border-b border-gray-50 transition-colors flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {staff.fullName?.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {staff.fullName}
                  </h4>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                      ID: {staff.user_id}
                    </span>
                    {staff.designation && <span>• {staff.designation}</span>}
                  </p>
                </div>
              </button>
            ))}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-gray-50 text-xs text-center text-gray-400 border-t border-gray-100">
          Showing top results. Type to search more specific staff.
        </div>
      </div>
      {/* Backdrop click to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default StaffSearchModal;
