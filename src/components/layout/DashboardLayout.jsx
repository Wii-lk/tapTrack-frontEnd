import React from "react";
import Sidebar from "../dashboard/Sidebar";
// import Topbar from '../dashboard/Topbar'; // Topbar is usually inside the page or handled differently now

const DashboardLayout = ({ children, currentPage, onNavigate }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-72 h-full transition-all duration-300 relative">
        {/* Background blobs or texture could act here as a fixed layer if we wanted, but keeping it clean for now */}

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
