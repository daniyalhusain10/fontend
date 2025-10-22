import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, Mail, Lock, LogIn } from 'lucide-react';
import Preloader from "../components/Preloader.jsx";
import { useAuth } from '../api/AuthContext.jsx'; 

export const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, login } = useAuth();

  const [showPreloader, setShowPreloader] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loginJustSucceeded, setLoginJustSucceeded] = useState(false);
  
  // Redirect already-logged-in users, but skip if login just succeeded
  useEffect(() => {
    if (!isLoading && isLoggedIn && !loginJustSucceeded) {
      navigate('/home', { replace: true });
    }
  }, [isLoggedIn, isLoading, loginJustSucceeded, navigate]);

  // Handle preloader + navigation after successful login
  useEffect(() => {
    let timer;
    if (showPreloader) {
      timer = setTimeout(() => {
        setShowPreloader(false);
        navigate('/home', { replace: true });
      }, 3000); // preloader duration in ms
    }
    return () => clearTimeout(timer);
  }, [showPreloader, navigate]);

  const onSubmit = async (data) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const result = await login(data);

    if (result.success) {
      toast.success('🎯 Logged in successfully!', { position: "top-right", autoClose: 1200, transition: Bounce });
      setLoginJustSucceeded(true);
      setShowPreloader(true); // trigger preloader
    } else {
      setIsProcessing(false);
    }
  };

  // Show preloader **only after successful login**
  if (showPreloader) return <Preloader duration={2000} />;

  // Show processing spinner while submitting
  if (isSubmitting || isProcessing) return (
    <div className='flex justify-center items-center w-full min-h-screen bg-gray-100 p-4'>
      <div className='text-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing login...</p>
      </div>
    </div>
  );

  return (
    <div className='flex justify-center items-center w-full min-h-screen bg-gray-100 p-4'>
      <div className='w-full max-w-sm bg-white p-8 sm:p-10 rounded-xl shadow-2xl border-t-8 border-indigo-600'>
        <div className="text-center mb-8 relative">
          <User className="w-10 h-10 mx-auto text-indigo-600 mb-3" />
          <span onClick={()=>navigate("/home")} className='absolute cursor-pointer -right-5 top-3 text-xs underline text-indigo-600'>SKIP FOR NOW</span>
          <h1 className='text-3xl font-extrabold text-gray-900'>Welcome Back!</h1>
          <p className="text-gray-500 mt-1">Sign in to access your account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address"
                  }
                })}
                disabled={isProcessing}
              />
              <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.email && <p className='text-red-500 text-sm mt-1 font-medium'>{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
                })}
                disabled={isProcessing}
              />
              <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.password && <p className='text-red-500 text-sm mt-1 font-medium'>{errors.password.message}</p>}
            <Link to="/forget-password" className="font-medium text-blue-500 hover:text-blue-700 ml-1 transition duration-150 block mt-1">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isProcessing}
            className={`w-full h-12 flex items-center justify-center rounded-lg font-bold text-lg transition duration-300 transform hover:scale-[1.01] ${
              isSubmitting || isProcessing
                ? "bg-indigo-400 text-white cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
            }`}
          >
            {isSubmitting || isProcessing ? (
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
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 ml-1 transition duration-150">
              Sign up
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            Are you an admin?
            <Link to="/admin-login" className="font-medium text-blue-500 hover:text-blue-700 ml-1 transition duration-150">
              Access Admin Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
