import React, { useState } from "react";
import { X, User, Users, Clock, CheckCircle, XCircle } from "lucide-react";

const AttendanceDetailsModal = ({ isOpen, onClose, data, loading }) => {
  const [activeTab, setActiveTab] = useState("staff"); // 'students' | 'staff'

  if (!isOpen) return null;

  // Helper to get current list based on tab
  const getList = () => {
    if (!data) return { present: [], absent: [] };
    return activeTab === "students" ? data.students : data.staff;
  };

  const { present, absent } = getList();
  const overview = data?.overview || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Attendance Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 gap-2 bg-gray-50 border-b border-gray-100">
          <TabButton
            active={activeTab === "staff"}
            onClick={() => setActiveTab("staff")}
            icon={Users}
            label="Staff"
            count={`${overview.staff_present || 0}/${overview.staff_total || 0}`}
          />
          <TabButton
            active={activeTab === "students"}
            onClick={() => setActiveTab("students")}
            icon={User}
            label="Students"
            count={`${overview.student_present || 0}/${overview.student_total || 0}`}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="animate-spin mb-4">
                <RefreshIcon />
              </div>
              <p>Loading details...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PRESENT Column */}
              <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle size={18} />
                    <h3 className="font-bold">Present</h3>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                    {present.length}
                  </span>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                  {present.length > 0 ? (
                    present.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg group hover:bg-green-50 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.grade || item.role}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-green-600 text-xs font-mono bg-white px-2 py-1 rounded border border-green-100">
                            <Clock size={12} />
                            {item.check_in}
                          </div>
                          {item.status === "late" && (
                            <span className="text-[10px] text-orange-500 font-bold">
                              LATE CHECK-IN
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="No one checked in yet." />
                  )}
                </div>
              </div>

              {/* ABSENT Column */}
              <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle size={18} />
                    <h3 className="font-bold">Absent</h3>
                  </div>
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                    {absent.length}
                  </span>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                  {absent.length > 0 ? (
                    absent.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg group hover:bg-red-50 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.grade || item.role}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-red-400 bg-white px-2 py-1 rounded border border-red-100">
                          Not Scanned
                        </span>
                      </div>
                    ))
                  ) : (
                    <EmptyState message="Everyone is present! 🎉" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
      active
        ? "bg-white text-gray-900 shadow-sm border border-gray-200"
        : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
    }`}
  >
    <Icon size={16} className={active ? "text-blue-600" : ""} />
    {label}
    <span
      className={`text-xs px-1.5 py-0.5 rounded-md ${active ? "bg-gray-100 text-gray-900" : "bg-gray-200 text-gray-500"}`}
    >
      {count}
    </span>
  </button>
);

const EmptyState = ({ message }) => (
  <div className="py-8 text-center text-gray-400 text-sm italic">{message}</div>
);

const RefreshIcon = () => (
  <svg
    className="animate-spin h-8 w-8 text-blue-500"
    active="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default AttendanceDetailsModal;
