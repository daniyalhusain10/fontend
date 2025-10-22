// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const clearAuth = useCallback(() => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsLoggedIn(true);
        setUserId(data.user.id);
        localStorage.setItem("userId", data.user.id);
        return { success: true, user: data.user };
      } else {
        clearAuth();
        toast.error(data.message || "Login failed");
        return { success: false, message: data.message };
      }
    } catch (err) {
      clearAuth();
      toast.error("⚠️ Network error");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      // intentionally empty — no change to logic
    } finally {
      clearAuth();
      toast.info("👋 Logged out successfully!");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const validateSession = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/validate`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.loggedIn) {
          setIsLoggedIn(true);
          setUserId(data.userId);
          localStorage.setItem("userId", data.userId);
        } else {
          clearAuth();
        }
      } catch (err) {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [clearAuth]);

  const value = { 
    isLoggedIn, 
    isLoading, 
    userId, 
    login, 
    logout 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
