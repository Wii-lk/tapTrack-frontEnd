import React from "react";
import { Bell, Search } from "lucide-react";

const Topbar = ({ title }) => {
  return (
    <div className="h-20 flex items-center justify-between px-8 mb-6 mt-4">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h2>
        {/* Optional: Breadcrumb or subtitle could go here */}
        <p className="text-sm text-gray-400 font-medium mt-1">
          Overview & Statistics
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Placeholder for future Search */}
        {/* 
        <div className="relative hidden md:block group">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 w-64 shadow-sm transition-all text-sm group-hover:shadow-md"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 group-hover:text-primary-500 transition-colors" size={18} />
        </div> 
        */}

        {/* Placeholder for Notifications */}
        {/* 
        <button className="relative p-2.5 text-gray-500 hover:text-primary-600 hover:bg-white bg-white/50 rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button> 
        */}
      </div>
    </div>
  );
};

export default Topbar;
