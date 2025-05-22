import {
  Award,
  Book,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  Users,
  X,
} from "lucide-react";
import React, { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case "teacher":
        return [
          {
            to: "/dashboard",
            icon: <LayoutDashboard size={20} />,
            label: "Dashboard",
          },
          { to: "/profile", icon: <User size={20} />, label: "Profile" },
          {
            to: "/achievements",
            icon: <Award size={20} />,
            label: "My Achievements",
          },
        ];
      case "hod":
        return [
          {
            to: "/dashboard",
            icon: <LayoutDashboard size={20} />,
            label: "Dashboard",
          },
          { to: "/profile", icon: <User size={20} />, label: "Profile" },
          {
            to: "/achievements",
            icon: <Award size={20} />,
            label: "My Achievements",
          },
          {
            to: "/review",
            icon: <Book size={20} />,
            label: "Review Achievements",
          },
          {
            to: "/department",
            icon: <Users size={20} />,
            label: "Department Overview",
          },
        ];
      case "admin":
        return [
          {
            to: "/admin/dashboard",
            icon: <LayoutDashboard size={20} />,
            label: "Dashboard",
          },
          { to: "/users", icon: <Users size={20} />, label: "User Management" },
          { to: "/stats", icon: <Award size={20} />, label: "Statistics" },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <div className="flex items-center">
            <Book className="h-8 w-8 text-primary-500" />
            <span className="ml-2 text-lg font-semibold text-gray-800">
              Faculty System
            </span>
          </div>
          <button
            className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar navigation */}
        <nav className="mt-4 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center px-4 py-2 my-1 text-gray-700 rounded-md
                ${
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "hover:bg-gray-100"
                }
              `}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          <hr className="my-4 border-gray-200" />

          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={() => logout()}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Title */}
            <h1 className="text-xl font-semibold text-gray-800 lg:ml-0 ml-3">
              Faculty Achievements
            </h1>

            {/* User info */}
            <div className="flex items-center">
              <div className="hidden md:flex md:items-center md:ml-4">
                <span className="text-sm text-gray-700 mr-2">{user?.name}</span>
                <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user?.name.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
