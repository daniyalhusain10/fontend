// ./components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { IoBagHandleOutline, IoSearchOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { motion } from "framer-motion";
import { useNavbarLogic } from "../hooks/useNavbarLogic.js";

const links = [
  { to: "/home", label: "Home" },
  { to: "/allproducts", label: "Products" },
  { to: "/about", label: "About" },
];

const Navbar = () => {
  const {
    location,
    searchTerm,              // <-- added
    handleLinkClick,
    handleLogout,
    handleSearchChange,
    totalCartCount,
    isSearchOpen,
    setIsSearchOpen,
    menuOpen,
    setMenuOpen,
    navRefs,
    searchRef,
    userRef,
    cartRef,
  } = useNavbarLogic();

  return (
    <div className="py-[15px] shadow-md z-30 bg-white">
      <div className="px-6 py-0 max-w-8xl mx-auto flex items-center justify-between relative">
        {/* Left Section */}
        <div className="flex items-center gap-4 z-20">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden"
          >
            {menuOpen ? (
              <RxCross1 className="w-7 h-7" />
            ) : (
              <RxHamburgerMenu className="w-7 h-7" />
            )}
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 items-center relative">
            {links.map((link, idx) => (
              <a
                key={link.to}
                data-nav
                ref={(el) => (navRefs.current[idx] = el)}
                href={link.to}
                onClick={(e) => handleLinkClick(e, link.to)}
                className={`relative mx-4 flex items-center py-2 px-6 z-10 ${
                  location.pathname === link.to
                    ? "text-white font-medium"
                    : "text-gray-800 hover:text-[#262626]"
                }`}
              >
                <p className="text-sm uppercase tracking-wide">{link.label}</p>
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="navbar-slider"
                    className="absolute inset-0 bg-black rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Center Logo */}
        <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
          <p
            id="desktop-logo"
            onClick={(e) => handleLinkClick(e, "/home")}
            className="text-2xl font-bold cursor-pointer pointer-events-auto"
          >
            Logo
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6 z-20">
          <IoSearchOutline
            ref={searchRef}
            className="w-9 h-9 cursor-pointer text-gray-800 hover:text-[#262626] transition-colors"
            onClick={() => setIsSearchOpen((prev) => !prev)}
          />

          <div className="group relative hidden md:block" ref={userRef}>
            <CiUser className="w-[36px] h-[36px] cursor-pointer text-gray-800 hover:text-[#262626] transition-colors" />
            <div className="dropdown-menu group-hover:block hidden flex-col absolute top-4 right-0 z-50 pt-2">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-white border border-gray-200 shadow-lg text-gray-500 rounded-lg">
                <p
                  onClick={() => handleLinkClick({ preventDefault: () => {} }, "/my-orders")}
                  className="cursor-pointer hover:text-[#262626] transition-colors"
                >
                  My Orders
                </p>
                <p
                  className="cursor-pointer text-red-600 font-semibold hover:text-red-800 transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </p>
              </div>
            </div>
          </div>

          <NavLink to="/cart" ref={cartRef}>
            <span className="relative bg-[#262626] rounded-full p-3 flex items-center justify-center">
              <IoBagHandleOutline className="w-6 h-6 text-white" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {totalCartCount}
                </span>
              )}
            </span>
          </NavLink>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-80 py-4 border-t border-gray-100" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-3 px-6">
          {links.map((link) => (
            <a
              key={`mobile-${link.to}`}
              href={link.to}
              onClick={(e) => {
                setMenuOpen(false);
                handleLinkClick(e, link.to);
              }}
              className={`text-base py-1 ${
                location.pathname === link.to
                  ? "text-[#262626] font-medium"
                  : "text-gray-600"
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="border-t mt-2 pt-2 border-gray-100 flex flex-col gap-3">
            <p
              className="cursor-pointer text-base text-gray-600"
              onClick={() => {
                setMenuOpen(false);
                handleLinkClick({ preventDefault: () => {} }, "/my-orders");
              }}
            >
              My Orders
            </p>
            <p
              className="cursor-pointer text-base text-red-600 font-medium"
              onClick={handleLogout}
            >
              Logout
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isSearchOpen ? "max-h-20 py-4 border-t border-gray-200" : "max-h-0"
        }`}
      >
        <div className="flex items-center gap-3 px-6 max-w-7xl mx-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#262626] outline-none"
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus={isSearchOpen}
          />
          <IoSearchOutline className="w-6 h-6 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
