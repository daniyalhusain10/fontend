// File: src/components/CheckoutForm.jsx

import React from "react";
import { useForm } from "react-hook-form";
import Checkout from "../components/Checkout.jsx";
import Navbar from "../components/Navbar.jsx";
import { Toaster } from "react-hot-toast";
import usePlaceOrderLogic from "../hooks/usePlaceOrderLogic.js"; // Import the custom hook

const CheckoutForm = () => {
  // Initialize react-hook-form
  const formMethods = useForm();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = formMethods;

  // Pull all logic from the custom hook
  const { onSubmit, handlePhoneChange, phone, items } = usePlaceOrderLogic(formMethods);

  // Styles
  const inputStyle =
    "border border-gray-300 rounded-lg py-2 px-4 w-full focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition duration-150 ease-in-out placeholder-gray-400";
  const titleStyle = "text-xl sm:text-2xl font-semibold text-gray-800 tracking-wide";

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col-reverse lg:flex-row justify-between gap-10 pt-8 sm:pt-16 pb-16 min-h-[80vh] border-t border-gray-200"
        >
          {/* DELIVERY INFO */}
          <div className="flex flex-col gap-6 h-full w-full lg:max-w-[500px] p-6 bg-white rounded-xl shadow-lg order-2 lg:order-1">
            <h2 className={titleStyle}>
              DELIVERY <span className="text-lime-500 font-bold">INFORMATION</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                {...register("firstName", { required: true, minLength: 2 })}
                className={inputStyle}
                placeholder="First Name"
              />
              <input
                {...register("lastName", { required: true, minLength: 2 })}
                className={inputStyle}
                placeholder="Last Name"
              />
            </div>

            <input
              {...register("email", { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
              className={inputStyle}
              placeholder="Email"
            />

            <input
              {...register("street", { required: true, minLength: 5 })}
              className={inputStyle}
              placeholder="Street Address"
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <input {...register("city", { required: true })} className={inputStyle} placeholder="City" />
              <input {...register("state")} className={inputStyle} placeholder="State / Province (Optional)" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <input {...register("zipcode")} className={inputStyle} placeholder="Zip / Postal Code" />
              <input {...register("country", { required: true })} className={inputStyle} placeholder="Country" />
            </div>

            <input
              {...register("phone", { required: true, minLength: 8, maxLength: 15, pattern: /^\+?\d+$/ })}
              value={phone}
              onChange={handlePhoneChange}
              className={inputStyle}
              placeholder="+92 3XX XXXXXXX"
            />
          </div>

          {/* CART SUMMARY */}
          <div className="w-full lg:max-w-[550px] p-6 rounded-xl shadow-lg order-1 lg:order-2">
            <h2 className={titleStyle}>
              CART <span className="text-orange-500 font-bold">SUMMARY</span>
            </h2>
            <Checkout />

            <div className="mt-3">
              <h2 className={titleStyle}>
                PAYMENT <span className="text-purple-500 font-bold">METHOD</span>
              </h2>

              <div className="flex items-center gap-3 p-3 mt-4 border-2 border-rose-400 rounded-lg bg-rose-50 cursor-pointer">
                <div className="min-w-4 h-4 rounded-full flex items-center justify-center border border-rose-500 bg-rose-500">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-base font-medium text-gray-700">CASH ON DELIVERY</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className={`w-full mt-8 ${
                  isSubmitting || items.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500"
                } text-white font-semibold tracking-wider uppercase px-10 py-3 rounded-lg text-base shadow-md transition duration-150 ease-in-out`}
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;