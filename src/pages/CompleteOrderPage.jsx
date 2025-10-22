import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react"; 
import Navbar from "../components/Navbar";

const CompleteOrderPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white px-4">
        {/* Success Icon */}
        <div className="bg-green-100 rounded-full p-6 mb-6 animate-bounce">
          <CheckCircle2 className="text-green-600 w-16 h-16" />
        </div>

        {/* Success Text */}
        <h1 className="text-3xl font-bold text-green-700 mb-3">
          Order Placed Successfully!
        </h1>

        {/* Thank you message */}
        <p className="text-gray-600 text-center max-w-md">
          Thank you for your purchase 🎉 Your order has been confirmed and is being
          processed. You’ll receive an email with order details shortly.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate("/my-orders")}
            className="bg-green-600 cursor-pointer text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/home")}
            className="border  border-green-600 text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteOrderPage;
