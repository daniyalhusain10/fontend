import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./api/AuthContext.jsx";
import { ConfirmProvider } from "./api/ConfirmationContext.jsx";
import { LoadingProvider } from "./api/LoadingContext.jsx";
import { ShopProvider } from "./api/ShopContext.jsx";
import { MiniLoaderProvider, useTransition } from "./api/MiniLoaderContext.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ShowOrder from "./adminComponent/ShowOrder.jsx";

import About from "./pages/About.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import AdminLogin from "./pages/AdminLoginPage.jsx";
import AllProduct from "./pages/AllProduct.jsx";
import Cart from "./pages/Cart.jsx";
import CompleteOrderPage from "./pages/CompleteOrderPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Fpassword from "./pages/Fpassword.jsx";
import Home from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import Myorder from "./pages/Myorder.jsx";
import PlaceOrder from "./pages/PlaceOrder.jsx";
import Product from "./pages/Product.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { Signup } from "./pages/Signup.jsx";

// ✅ Transition overlay
import RevealerTransition from "./components/RevealTransition.jsx";


// ✅ Transition-aware content wrapper
const TransitionWrapper = ({ children }) => {
  const { isTransitioning } = useTransition();

  return (
    <div
      className={`transition-opacity duration-500 ease-in-out ${
        isTransitioning ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {children}
    </div>
  );
};


const App = () => {
  return (
    <MiniLoaderProvider>
      <LoadingProvider>
        <ConfirmProvider>
          <AuthProvider>
            <ShopProvider>
              <BrowserRouter>
                {/* 🔥 Global Transition Overlay */}
                <RevealerTransition />

                {/* ✅ Page wrapper (won’t render until reveal finishes) */}
                <TransitionWrapper>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forget-password" element={<Fpassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/admin-login" element={<AdminLogin />} />

                    {/* Protected Routes (Cleaned up layout) */}
                    <Route
                      path="/home"
                      element={<Home />}
                    />
                    <Route
                      path="/about"
                      element={<About />}
                    />
                    <Route
                      path="/allproducts"
                      element={<AllProduct />}
                    />
                    <Route
                      path="/product/:id"
                      element={<Product />}
                    />
                    <Route
                      path="/cart"
                      element={<Cart />}
                    />
                    <Route
                      path="/place-order"
                      element={<PlaceOrder />}
                    />
                    <Route
                      path="/complete-order"
                      element={<CompleteOrderPage />}
                    />
                    <Route
                      path="/my-orders"
                      element={<Myorder />}
                    />

                    {/* Admin Routes (Cleaned up layout) */}
                    <Route
                      path="/admin/add-products"
                      element={<ProtectedRoute adminOnly={true}><AddProduct /></ProtectedRoute>}
                    />
                    <Route
                      path="/admin/dashboard"
                      element={<ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>}
                    />
                    <Route
                      path="/admin/show-orders"
                      element={<ProtectedRoute adminOnly={true}><ShowOrder /></ProtectedRoute>}
                    />
                  </Routes>
                </TransitionWrapper>
              </BrowserRouter>

              <ToastContainer position="top-center" autoClose={3000} />
            </ShopProvider>
          </AuthProvider>
        </ConfirmProvider>
      </LoadingProvider>
    </MiniLoaderProvider>
  );
};

export default App;