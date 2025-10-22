// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isLoggedIn, isLoading, hasValidUser } = useAuth();

  // Show loader while auth state is being determined
  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <LoadingScreen message="Loading ...." />
      </div>
    );

  const adminToken = localStorage.getItem("adminToken");

  
  // Admin-only route
  if (adminOnly) {
    if (!adminToken) {
      // Redirect non-admins to home
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  // Normal user route: user must have a valid userId or adminToken
  if (!hasValidUser && !adminToken) {
    // Redirect to login if not logged in
    return <Navigate to="/login" replace />;
  }

  // User is authenticated
  return children;
};

export default ProtectedRoute;
