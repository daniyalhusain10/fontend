import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Settings,
  LogOut,
  BarChart3,
  Menu,
  X,
} from 'lucide-react';

// Base style for NavLinks
const navLinkBaseStyle =
  'flex items-center space-x-4 w-full px-4 py-3 transition-all duration-200 text-base rounded-xl group hover:shadow-md';

// Dynamic classes for NavLink based on active state
const getNavLinkClasses = ({ isActive }) => {
  const inactiveClasses = `${navLinkBaseStyle} text-gray-400 hover:bg-gray-800 hover:text-white border-l-4 border-transparent hover:border-purple-500`;
  const activeClasses = `${navLinkBaseStyle} font-semibold bg-purple-600 text-white border-l-4 border-white shadow-lg`;
  return isActive ? activeClasses : inactiveClasses;
};

const Sidebar = () => {
  // State to toggle sidebar visibility on mobile
  const [isOpen, setIsOpen] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Logout handler
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.clear();
      window.location.replace('/login');
    }
  };

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <button
        className="lg:hidden fixed top-10 right-4 z-50 p-2 bg-purple-500 text-white rounded-md"
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Container */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-gray-900 flex flex-col shadow-2xl border-r border-gray-700 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:sticky lg:w-64 w-64 z-40
        `}
      >
        {/* Sidebar Header/Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-gray-400 mt-1">Management Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation Scroll Container */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <nav className="space-y-1">
            {/* Dashboard Link */}
            <NavLink
              to="/admin/dashboard"
              className={getNavLinkClasses}
              title="Dashboard"
              onClick={() => setIsOpen(false)} // Close sidebar on link click (mobile)
            >
              {({ isActive }) => (
                <>
                  <LayoutDashboard
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'rotate-12' : 'group-hover:rotate-6'
                    }`}
                  />
                  <span className="flex-1">Dashboard</span>
                  {isActive && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                </>
              )}
            </NavLink>

            {/* Orders Link */}
            <NavLink
              to="/admin/show-orders"
              className={getNavLinkClasses}
              title="Manage Orders"
              onClick={() => setIsOpen(false)}
            >
              {({ isActive }) => (
                <>
                  <ShoppingCart
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'rotate-12' : 'group-hover:rotate-6'
                    }`}
                  />
                  <span className="flex-1">Orders</span>
                  {isActive && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                </>
              )}
            </NavLink>

            {/* Products Link */}
            <NavLink
              to="/admin/add-products"
              className={getNavLinkClasses}
              title="Product Management"
              onClick={() => setIsOpen(false)}
            >
              {({ isActive }) => (
                <>
                  <Package
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'rotate-12' : 'group-hover:rotate-6'
                    }`}
                  />
                  <span className="flex-1">Add Product</span>
                  {isActive && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                </>
              )}
            </NavLink>
            
          </nav>
        </div>

        {/* Footer with Logout */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div
            onClick={handleLogout}
            className="flex items-center space-x-4 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 group border border-red-500/20 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform" />
            <span className="font-medium">Logout</span>
          </div>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default Sidebar;