import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar.jsx";

// ===== ICONS =====
const IconBox = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M168 424.3c-1.3-1.6-2.5-3.2-3.8-4.8L43.8 285.4c-2.4-3-4.1-6.3-5-9.8c-.8-3.5-.2-7.1 1.7-10.2l39.5-68.5c1.9-3.3 5.4-5.3 9.3-5.3H192c0-10.8 2.2-21.4 6.6-31.2l-34.1-59.2C155.6 106.6 160.2 96 170.1 96h171.8c9.9 0 14.5 10.6 9.6 19.1l-34.1 59.2c4.4 9.8 6.6 20.4 6.6 31.2h142.1c3.9 0 7.4 2 9.3 5.3l39.5 68.5c1.9 3.1 2.5 6.7 1.7 10.2c-.9 3.5-2.6 6.8-5 9.8L350.6 419.5c-1.3 1.6-2.5 3.2-3.8 4.8c-2.5 3.1-6 5.5-10.1 6.8c-4 1.3-8.4 1.4-12.5 0c-4.1-1.3-7.6-3.7-10.1-6.8l-52.9-66.1c-1.8-2.2-4.5-3.4-7.4-3.4c-2.9 0-5.6 1.2-7.4 3.4l-52.9 66.1c-2.5 3.1-6 5.5-10.1 6.8c-4 1.3-8.4 1.4-12.5 0c-4.1-1.3-7.6-3.7-10.1-6.8zM256 312c11 0 20-9 20-20V156c0-11-9-20-20-20s-20 9-20 20v136c0 11 9 20 20 20z"
    />
  </svg>
);

const IconShipping = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M304 352c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32s14.3-32 32-32H304zm-48-96a64 64 0 1 1 0-128 64 64 0 1 1 0 128zm-32 96a96 96 0 1 0 0-192 96 96 0 1 0 0 192zm336-32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H560zm-48-96a64 64 0 1 1 0-128 64 64 0 1 1 0 128zm-32 96a96 96 0 1 0 0-192 96 96 0 1 0 0 192zM64 480H576c35.3 0 64-28.7 64-64V352H512V192c0-35.3-28.7-64-64-64H256c-35.3 0-64 28.7-64 64V352H0V416c0 35.3 28.7 64 64 64z"
    />
  </svg>
);

const IconCheck = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0L143 289c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l41 41 95-95c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
    />
  </svg>
);

const IconTimes = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5">
    <path
      fill="currentColor"
      d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l48 48 48-48c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-48 48 48 48c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L256 313l-48 48c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l48-48-48-48c-9.4-9.4-9.4-24.6 0-33.9z"
    />
  </svg>
);

// ===== STATUS BADGE =====
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: { classes: "bg-yellow-500 text-white", Icon: IconBox },
    Processing: { classes: "bg-blue-500 text-white", Icon: IconShipping },
    Shipped: { classes: "bg-purple-500 text-white", Icon: IconShipping },
    Delivered: { classes: "bg-green-500 text-white", Icon: IconCheck },
    Cancelled: { classes: "bg-red-500 text-white", Icon: IconTimes },
  };

  const { classes, Icon } = statusConfig[status] || {
    classes: "bg-gray-400 text-white",
    Icon: IconBox,
  };

  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${classes}`}>
      <Icon className="mr-2" />
      {status}
    </span>
  );
};

// ✅ MERGE FUNCTION: merge same productId items
const mergeItems = (items = []) => {
  const merged = [];

  items.forEach((item) => {
    const existing = merged.find((i) => i.productId === item.productId);

    if (existing) {
      existing.quantity += item.quantity || 1;

      if (item.size && !existing.sizes.includes(item.size)) {
        existing.sizes.push(item.size);
      }

      if (item.color && !existing.colors.includes(item.color)) {
        existing.colors.push(item.color);
      }
    } else {
      merged.push({
        ...item,
        sizes: item.size ? [item.size] : [],
        colors: item.color ? [item.color] : [],
      });
    }
  });

  return merged;
};

// ===== ORDER CARD =====
const OrderCard = ({ order, index }) => {
  const mergedItems = mergeItems(order.items);
  const formatDate = (date) => new Date(date).toLocaleDateString();
  const formatCurrency = (amount) => `Rs ${amount.toFixed(2)}`;

  return (
    <motion.div
      key={order._id}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="bg-white/90 p-6 rounded-2xl shadow-lg border border-gray-100"
    >
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
        <div>
          <p className="text-xl font-bold text-gray-800">
            Order #{order._id?.slice(-8) || "N/A"}
          </p>
          <p className="text-sm text-gray-500">Placed on: {formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.orderStatus} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase">Items</p>
          <p className="text-2xl font-bold text-indigo-600">{mergedItems.length}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-500 uppercase">Total</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(order.totalAmount)}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700 mb-2">Order Items</p>
        {mergedItems.map((item, i) => (
          <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-3 w-full">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                />
              )}

              <div className="flex-1">
                <p className="font-medium text-gray-800 truncate">{item.name}</p>

                {/* Color & Size Chips */}
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {item.colors.map((c) => (
                    <span
                      key={c}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: c.toLowerCase() }}
                      title={c}
                    ></span>
                  ))}
                  {item.sizes.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-gray-200 px-2 py-0.5 rounded-md text-gray-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <span className="ml-2 text-xs font-semibold text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
              {item.quantity}x
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ===== MAIN COMPONENT =====
const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");
  const API_ORDERS_URL = `${import.meta.env.VITE_BACKEND_URL}/api/orders`;

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_ORDERS_URL}?userId=${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
      setOrders(data.orders || []);
      toast.success(`Fetched ${data.orders.length} orders`);
    } catch (err) {
      setError(err.message || "Network error");
      toast.error(err.message || "Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <Navbar />
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="max-w-6xl mx-auto p-6 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-black text-[#262626]">My Orders</h1>
          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            ↻ Refresh Orders
          </button>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : orders.length === 0 ? (
            <p>No Orders Found</p>
          ) : (
            <motion.div
              key="orders"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {orders.map((order, index) => (
                <OrderCard order={order} index={index} key={order._id} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyOrder;
