import React, { useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import Topbar from '../dashboard/Topbar';

const DashboardLayout = ({ children, title, currentPage, onNavigate }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <Topbar title={title} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;