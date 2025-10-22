import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Mail } from 'lucide-react';

const Fpassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forget-password`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      let mainres = await res.json();

      if (mainres.success === true) {
        toast.success('🎯 Account Verified Successfully!', { position: "top-right", autoClose: 2000, theme: "light" });
        navigate('/reset-password');
      } 
      else if (mainres.noToken === true) {
        toast.error('❌ Please Sign Up First');
        navigate('/signup');
      } 
      else if (mainres.noExist === false) {
        toast.error('❌ User Does Not Exist!', { position: "top-right", autoClose: 2000, theme: "light", transition: Bounce });
      } 
      else if (mainres.codeSend === true) {
        toast.success('🎯 Code Sent Successfully!', { position: "top-right", autoClose: 2000, theme: "light", transition: Bounce });
        navigate('/reset-password');
      } 
      else {
        toast.error('❌ Please Enter Valid Information!', { position: "top-right", autoClose: 2000, theme: "light", transition: Bounce });
      }
    } catch (error) {
      console.error("Forget password error:", error);
      toast.error('⚠️ Server not responding. Please check backend connection.', { position: "top-right", autoClose: 2000, theme: "light", transition: Bounce });
    }
  };

  return (
    <div className='flex justify-center items-center w-full min-h-screen bg-gray-100 p-4'>
      <div className='w-full max-w-sm bg-white p-8 sm:p-10 rounded-xl shadow-2xl border-t-8 border-blue-500'>
        <div className="text-center mb-8">
          <Mail className="w-10 h-10 mx-auto text-blue-500 mb-3" />
          <h1 className='text-3xl font-extrabold text-gray-900'>Forget Password</h1>
          <p className="text-gray-500 mt-1">Enter your registered email to verify your account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

          {/* Email Field */}
          <div className='relative'>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              {...register("email", {
                required: "Email is required",
                minLength: { value: 8, message: "Minimum email length is 8 characters" },
              })}
            />
            <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-12 flex items-center justify-center rounded-lg font-bold text-lg transition duration-300 transform hover:scale-[1.01] ${
              isSubmitting ? "bg-blue-300 text-white cursor-wait" : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
            }`}
          >
            {isSubmitting ? "Verifying..." : "Verify"}
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

export default Fpassword;
