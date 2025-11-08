import React from 'react';
import { Bell, Search } from 'lucide-react';

const Topbar = ({ title }) => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          {/* <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
          /> */}
          {/* <Search className="absolute left-3 top-2.5 text-gray-400" size={20} /> */}
        </div>

        {/* Notifications */}
        {/* <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button> */}
      </div>
    </div>
  );
};

export default Topbar;