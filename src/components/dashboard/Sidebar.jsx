import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  CreditCard,
  ClipboardCheck,
  FileText,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate(); // ✅ React Router navigation
  const location = useLocation(); // ✅ get current route
  const [isOpen, setIsOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'students', label: 'Student Management', icon: Users, path: '/students' },
    { id: 'teachers', label: 'Staff Management', icon: GraduationCap, path: '/teachers' },
    {
      id: 'academics',
      label: 'Academics',
      icon: BookOpen,
      hasSubmenu: true,
      submenu: [
        { id: 'classes', label: 'Classes', path: '/classes' },
        { id: 'sections', label: 'Sections', path: '/sections' },
      ],
    },
    { id: 'fees', label: 'Fees', icon: DollarSign, path: '/fees' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/payments' },
    { 
      id: 'attendance', 
      label: 'Attendance', 
      icon: ClipboardCheck,
      hasSubmenu:true,
      submenu:[
        {id:"today_attendance",label:"Today's Attendance",path:"/attendance"},
        {id:"attendance_history", label:"Attendance History",path:"/attendance_history"},
      ], 
    },
    { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
  ];

  const toggleSubmenu = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#800000] text-white rounded-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-0 lg:w-20'
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-[#800000]">
          <h1 className={`font-bold text-white transition-all duration-300 ${isOpen ? 'text-xl' : 'text-sm'}`}>
            {isOpen ? 'Phoenix School' : 'SMS'}
          </h1>
        </div>

        {/* User Info */}
        {isOpen && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#800000] rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <div key={item.id}>
              {/* Main Menu Item */}
              <button
                onClick={() => {
                  if (item.hasSubmenu) {
                    toggleSubmenu(item.id);
                  } else {
                    handleNavigation(item.path);
                  }
                }}
                className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#f3e6e6] text-[#800000] border-r-4 border-[#800000]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {isOpen && (
                  <>
                    <span className="ml-3 flex-1">{item.label}</span>
                    {item.hasSubmenu && (
                      <span>
                        {expandedMenu === item.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Submenu Items */}
              {item.hasSubmenu && expandedMenu === item.id && isOpen && (
                <div className="bg-gray-50">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleNavigation(subItem.path)}
                      className={`w-full flex items-center px-4 py-2 pl-12 text-left text-sm transition-colors ${
                        isActive(subItem.path) ? 'bg-[#e6cccc] text-[#800000]' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-[#f3e6e6] hover:text-[#800000] transition-colors"
          >
            <LogOut size={20} />
            {isOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
