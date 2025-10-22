import React, { useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Added icons for visual appeal
import { UserPlus, User, Mail, Lock, ArrowRight } from 'lucide-react';

export const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  // LOGIC: onSubmit function - UNCHANGED
  const onSubmit = async (data) => {
    try {
      let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      let signupresponse = await res.json();

      if (signupresponse.success === true) {
        // Logic for success toast and navigation
        toast.success('🎯 Account Created Successfully! Redirecting...', {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
          transition: Bounce,
        });
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        // Logic for error toast
        toast.error('❌ Registration Failed. Please try different credentials.', {
          position: "top-right",
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error('⚠️ Server not responding. Check backend connection.', {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
    }
  };
  // END LOGIC

  // Helper function to render validation messages consistently
  const renderErrorMessage = (field) => {
    // Handling the case where password validation returns a React component (h4)
    if (field === 'password' && errors.password?.message && typeof errors.password.message !== 'string') {
        return <p className='text-red-500 text-sm mt-1 font-medium'>{errors.password.message}</p>;
    }
    
    // Handling generic errors from react-hook-form
    const message = errors[field]?.message || (errors[field]?.type === 'required' ? `${field.charAt(0).toUpperCase() + field.slice(1)} is required` : null);
    
    if (message) {
        return <p className='text-red-500 text-sm mt-1 font-medium'>{message}</p>;
    }
    return null;
  };


  return (
    // Redesigned container: full screen, white background, centered content
    <div className='flex justify-center items-center w-full min-h-screen bg-gray-100 p-4'>
      {/* Signup Card */}
      <div 
        className='w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-2xl border-t-8 border-green-500'
      >
        
        {/* Header Section */}
        <div className="text-center mb-8">
            <UserPlus className="w-10 h-10 mx-auto text-green-600 mb-3" />
            <h1 className='text-3xl font-extrabold text-gray-900'>Create Your Account</h1>
            <p className="text-gray-500 mt-1">Join us today for free access.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <input
                type="text"
                id="username"
                placeholder="choose a unique name"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-green-500 focus:border-green-500 transition duration-150"
                // LOGIC: register and validation rules - UNCHANGED
                {...register("username", {
                  required: true,
                  minLength: {
                    value: 5,
                    message: "Minimum username length is 5 characters"
                  }
                })}
              />
              <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {renderErrorMessage('username')}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-green-500 focus:border-green-500 transition duration-150"
                // LOGIC: register and validation rules - UNCHANGED
                {...register("email", {
                  required: true,
                  minLength: {
                    value: 8,
                    message: "Minimum email length is 8 characters"
                  }
                })}
              />
              <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {renderErrorMessage('email')}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="minimum 8 characters"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-green-500 focus:border-green-500 transition duration-150"
                // LOGIC: register and validation rules - UNCHANGED (includes your h4 element logic)
                {...register("password", {
                  required: true,
                  minLength: {
                    value: 8,
                    message: <p className='text-red-500'>password must be 8 characters or longer</p> // Kept your original React element error message logic
                  }
                })}
              />
              <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {renderErrorMessage('password')}
          </div>

          {/* Submit Button - LOGIC UNCHANGED */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-12 flex items-center justify-center rounded-lg font-bold text-lg transition duration-300 transform hover:scale-[1.01] ${
              isSubmitting 
                ? "bg-green-400 text-white cursor-wait"
                : "bg-green-600 text-white hover:bg-green-700 shadow-lg"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              <>
                Sign Up <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link - LOGIC UNCHANGED */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link to="/login" className="text-sm text-gray-600 hover:text-green-600 transition duration-150">
            Already have an account? <span className='font-semibold'>Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};