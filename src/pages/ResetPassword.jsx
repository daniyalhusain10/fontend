import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Lock } from 'lucide-react';

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        body: JSON.stringify({
          code: data.code,
          password: data.password,
        }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      let mainres = await res.json();

      if (mainres.updatedPassword === true) {
        toast.success('🎯 Password Updated Successfully!', {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
        });
        navigate('/login');
      } 
      else if (mainres.noToken === true) {
        toast.error('❌ Please SignUp First!');
        navigate('/signup');
      } 
      else if (mainres.notUpdated === false) {
        toast.error('❌ User Not Updated. Please Try Again!');
      } 
      else if (mainres.noUser === true) {
        toast.error('❌ User Not Exist!');
        navigate('/signup');
      } 
      else {
        toast.error('❌ Please Enter Valid Information!', {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error('⚠️ Server not responding. Please check your backend connection.', {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <div className='flex justify-center items-center w-full min-h-screen bg-gray-100 p-4'>
      <div className='w-full max-w-sm bg-white p-8 sm:p-10 rounded-xl shadow-2xl border-t-8 border-blue-500'>
        <div className="text-center mb-8">
          <Lock className="w-10 h-10 mx-auto text-blue-500 mb-3" />
          <h1 className='text-3xl font-extrabold text-gray-900'>Reset Password</h1>
          <p className="text-gray-500 mt-1">Enter verification code and new password.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

          {/* Verification Code */}
          <div className='relative'>
            <input
              placeholder="Enter Verification Code"
              className="w-full p-3 pl-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              {...register("code", {
                required: "Verification code is required",
                minLength: { value: 8, message: "Minimum token length is 8 characters" },
              })}
            />
            {errors.code && <p className='text-red-500 text-sm mt-1'>{errors.code.message}</p>}
          </div>

          {/* New Password */}
          <div className='relative'>
            <input
              type="password"
              placeholder="Enter New Password"
              className="w-full p-3 pl-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum password length is 8 characters" },
              })}
            />
            {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-12 flex items-center justify-center rounded-lg font-bold text-lg transition duration-300 transform hover:scale-[1.01] ${
              isSubmitting ? "bg-blue-300 text-white cursor-wait" : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account? 
          <Link to="/signup" className='font-semibold text-blue-500 hover:text-blue-700 ml-1'>
            Sign up
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
