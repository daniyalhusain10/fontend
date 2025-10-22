import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Added lucide-react icons for visual appeal (assuming they are installed)
import { Shield, Mail, Lock, LogIn } from 'lucide-react'; 

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`;

const AdminLoginPage = () => {
  const navigate = useNavigate();
  // LOGIC: useForm setup - UNCHANGED
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  // LOGIC: Auto-login if token exists - UNCHANGED
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) navigate('/admin/dashboard');
  }, [navigate]);

  // LOGIC: onSubmit function - UNCHANGED
  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const mainres = await res.json();

      if (res.ok && mainres.token) {
        localStorage.setItem("adminToken", mainres.token);

        toast.success('👑 Admin Login Successful!', {
          position: "top-right",
          autoClose: 1500,
          transition: Bounce
        });

        setTimeout(() => navigate('/admin/dashboard'), 1600);
      } else {
        toast.error(`❌ ${mainres.message || 'Invalid Credentials'}`, {
          position: "top-right",
          autoClose: 3000,
          transition: Bounce
        });
      }
    } catch (err) {
      toast.error('❌ Server error, try again later', {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce
      });
      console.error(err);
    }
  };
  // END LOGIC

  return (
    <div className='flex justify-center items-center w-full min-h-screen bg-gray-900 p-4'>
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 sm:p-10 border-t-4 border-indigo-600">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 mx-auto text-indigo-600 mb-3" />
          <h1 className='text-3xl font-extrabold text-gray-900'>Admin Portal Access</h1>
          <p className="text-gray-500 mt-1">Sign in with your administrator credentials.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>

          {/* Email Field */}
          <div>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                {...register("email", { required: "Email is required" })}
              />
              <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.email && <span className="text-sm text-red-500 mt-1 block font-medium">{errors.email.message}</span>}
          </div>

          {/* Password Field */}
          <div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                {...register("password", { required: "Password is required" })}
              />
              <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.password && <span className="text-sm text-red-500 mt-1 block font-medium">{errors.password.message}</span>}
          </div>

          {/* Submit Button - LOGIC UNCHANGED */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-12 flex items-center justify-center rounded-lg font-bold text-lg transition duration-300 ${
              isSubmitting 
                ? "bg-indigo-400 text-white cursor-wait"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Admin Login
              </>
            )}
          </button>
        </form>

        {/* Footer Link - LOGIC UNCHANGED */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link to="/login" className="text-sm text-gray-600 hover:text-indigo-600 transition duration-150">
            Not an admin? <span className='font-semibold'>Go to User Login</span>
          </Link>
        </div>

      </div>

      <ToastContainer />
    </div>
  );
};

export default AdminLoginPage;