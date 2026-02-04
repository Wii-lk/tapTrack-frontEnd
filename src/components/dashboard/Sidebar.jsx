import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  CreditCard,
  ClipboardCheck,
  ChevronDown,
  LogOut,
  Menu,
  X,
  UserMinus,
  Settings2,
  Activity,
  History,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const { logout, user: contextUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(contextUser || null);

  useEffect(() => {
    if (contextUser) {
      setUser(contextUser);
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse user data from storage", error);
        }
      }
    }
  }, [contextUser]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [expandedMenu, setExpandedMenu] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(true);
      else setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    { id: "students", label: "Students", icon: Users, path: "/students" },
    { id: "teachers", label: "Staff", icon: GraduationCap, path: "/teachers" },
    { id: "classes", label: "Classes", icon: BookOpen, path: "/classes" },
    { id: "fees", label: "Fees", icon: DollarSign, path: "/fees" },
    { id: "salary", label: "Salary", icon: CreditCard, path: "/salary/manage" },
    {
      id: "attendance",
      label: "Attendance",
      icon: ClipboardCheck,
      hasSubmenu: true,
      submenu: [
        {
          id: "today",
          label: "Today's Log",
          icon: Activity,
          path: "/attendance",
        },
        {
          id: "history",
          label: "History",
          icon: History,
          path: "/attendance_history",
        },
      ],
    },
    { id: "leave", label: "Leaves", icon: UserMinus, path: "/leave" },
    { id: "settings", label: "Settings", icon: Settings2, path: "/settings" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setIsOpen(false);
  };

  const toggleSubmenu = (id) => {
    if (!isOpen && !isMobile) setIsOpen(true);
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (item) =>
    item.submenu?.some((sub) => sub.path === location.pathname);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-white/90 backdrop-blur-md text-primary-700 rounded-xl shadow-lg border border-primary-100 active:scale-95 transition-all"
      >
        <Menu size={24} />
      </button>

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
          ${isOpen ? "w-72" : "w-20"} 
          ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
          bg-white lg:bg-transparent
        `}
      >
        <div className="h-full flex flex-col bg-white lg:m-4 lg:rounded-3xl lg:shadow-xl lg:border border-gray-100 overflow-hidden relative">
          {/* HEADER */}
          <div className="h-20 flex items-center justify-between px-6 bg-gradient-to-br from-primary-800 to-primary-950 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

            <div
              className={`flex items-center gap-3 transition-opacity duration-300 z-10 ${!isOpen && "opacity-0 w-0 overflow-hidden"}`}
            >
              <div className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20 shadow-inner">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg tracking-tight leading-none">
                  Phoenix
                </h1>
                <p className="text-primary-200 text-xs font-medium tracking-wide mt-0.5">
                  {user?.position || user?.role || "Admin"}
                </p>
              </div>
            </div>

            {!isMobile && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors z-10"
              >
                {isOpen ? (
                  <Menu size={20} />
                ) : (
                  <div className="mx-auto w-8 text-center">
                    <span className="font-bold text-xl">P</span>
                  </div>
                )}
              </button>
            )}

            {isMobile && (
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 z-10"
              >
                <X size={24} />
              </button>
            )}
          </div>

          {/* MENU */}
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
            {!isOpen && !isMobile && (
              <div className="mb-6 flex justify-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold shadow-md">
                  {getInitials(user?.name)}
                </div>
              </div>
            )}

            {menuItems.map((item) => {
              const active = isActive(item.path) || isParentActive(item);
              const isExpanded = expandedMenu === item.id;

              return (
                <div key={item.id}>
                  <button
                    onClick={() =>
                      item.hasSubmenu
                        ? toggleSubmenu(item.id)
                        : handleNavigation(item.path)
                    }
                    className={`
                      relative w-full flex items-center p-3 rounded-xl transition-all duration-300 group
                      ${
                        active
                          ? "bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white shadow-md shadow-primary-900/20"
                          : "text-secondary-600 hover:bg-primary-50 hover:text-primary-800"
                      }
                    `}
                  >
                    <div
                      className={`flex items-center justify-center transition-colors ${!isOpen ? "w-full" : ""}`}
                    >
                      <item.icon
                        size={22}
                        strokeWidth={active ? 2.5 : 2}
                        className={`transition-transform duration-300 ${active && !isOpen ? "scale-110" : ""}`}
                      />
                    </div>

                    <div
                      className={`flex flex-1 items-center justify-between ml-3 overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}
                    >
                      <span className="font-medium text-sm whitespace-nowrap tracking-wide">
                        {item.label}
                      </span>
                      {item.hasSubmenu && (
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-300 text-current opacity-70 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>

                    {!isOpen && !isMobile && (
                      <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl border border-gray-700">
                        {item.label}
                      </div>
                    )}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded && isOpen ? "max-h-40 opacity-100 mt-2 mb-2" : "max-h-0 opacity-0"}`}
                  >
                    <div className="bg-secondary-50/80 rounded-xl mx-2 p-1.5 border border-secondary-100 flex flex-col gap-1">
                      {item.submenu?.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleNavigation(sub.path)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold
                            transition-all duration-200
                            ${
                              isActive(sub.path)
                                ? "bg-white text-primary-700 shadow-sm border border-primary-100/50"
                                : "text-secondary-500 hover:text-primary-700 hover:bg-white/60"
                            }
                          `}
                        >
                          <sub.icon size={14} />
                          {sub.label}
                          {isActive(sub.path) && (
                            <CheckCircle2
                              size={12}
                              className="ml-auto text-primary-600"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FOOTER */}
          {isOpen && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-700 to-secondary-900 text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-white">
                  {getInitials(user?.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user?.first_name || "Administrator"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.username || "admin@system.com"}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-100"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
