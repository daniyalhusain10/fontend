// src/pages/ShowOrder.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../adminComponent/Sidebar.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
// 💡 Import the new logic hook
import { useOrderLogic } from '../hooks/useOrderLogic.js'; 

// --- START: PRESENTATIONAL COMPONENTS (Keep these here for UI structure) ---

// Status Icons (No Change)
const StatusIcon = ({ status }) => {
    const icons = {
        Pending: "⏳", Processing: "🔄", Shipped: "🚚", Delivered: "✅", Cancelled: "❌",
    };
    return <span className="text-lg mr-2">{icons[status] || "📦"}</span>;
};

// Status Badge / Dropdown (No Change)
const StatusBadge = ({ status, onChange, isEditing = false }) => {
    const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    const colors = {
        Pending: { bg: "#f59e0b33", border: "#f59e0b", text: "#fbbf24" },
        Processing: { bg: "#3b82f633", border: "#3b82f6", text: "#60a5fa" },
        Shipped: { bg: "#8b5cf633", border: "#8b5cf6", text: "#c084fc" },
        Delivered: { bg: "#10b98133", border: "#10b981", text: "#34d399" },
        Cancelled: { bg: "#ef444433", border: "#ef4444", text: "#f87171" },
    };
    const c = colors[status] || colors.Pending;

    if (isEditing) {
        return (
            <div className="relative">
                <select
                    value={status || "Pending"}
                    onChange={(e) => onChange({ target: { value: e.target.value } }, "orderStatus")}
                    className="appearance-none bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 pr-8 text-sm font-medium w-full"
                >
                    {statusOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        );
    }
    // ... (rest of StatusBadge UI)
    return (
        <motion.span
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 shadow-sm cursor-default"
            style={{ backgroundColor: c.bg, borderColor: c.border, color: c.text }}
            whileHover={{ scale: 1.05, y: -2 }}
        >
            <StatusIcon status={status} /> {status}
        </motion.span>
    );
};

// Format Date Time (No Change)
const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-GB", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });

// Color Map (No Change)
const colorMap = {
    black: "#000000", white: "#ffffff", red: "#ef4444", blue: "#3b82f6", green: "#22c55e", yellow: "#eab308", purple: "#8b5cf6", gray: "#9ca3af",
};

// Edit Form Component (No Change)
const EditForm = ({ editData, onInputChange, onShippingChange, onSave, onCancel }) => (
    <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="space-y-4 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-inner"
    >
        {/* ... (rest of EditForm UI, which is unchanged) ... */}
        {/* Order + Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Order Status</label>
                <StatusBadge status={editData.orderStatus} onChange={onInputChange} isEditing={true} />
                </div>
            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Payment Status</label>
                <select
                    value={editData.paymentStatus}
                    onChange={(e) => onInputChange(e, "paymentStatus")}
                    className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                </select>
            </div>
        </div>

        {/* Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["firstName", "lastName", "street", "city", "state"].map((field, idx) => (
                <div key={idx}>
                    <label className="block text-sm font-semibold text-gray-300 mb-1 capitalize">
                        {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                        type="text"
                        value={editData.shippingInfo?.[field] || ""}
                        onChange={(e) => onShippingChange(e, field)}
                        className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2"
                    />
                </div>
            ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <motion.button
                onClick={onCancel}
                className="px-4 py-2 text-gray-200 bg-gray-600 rounded-lg hover:bg-gray-500"
                whileHover={{ scale: 1.05 }}
            >
                Cancel
            </motion.button>
            <motion.button
                onClick={onSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                whileHover={{ scale: 1.05 }}
            >
                Save Changes
            </motion.button>
        </div>
    </motion.div>
);

// Order Card (No Change)
const OrderCard = ({ order, isEditing, editData, onEditClick, onInputChange, onShippingChange, onSave, onCancel, onDelete }) => {
    const formatCurrency = (amount) => `Rs ${Number(amount).toLocaleString("en-IN")}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-xl shadow-md border border-gray-700 overflow-hidden"
        >
            <div className="bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-white">Order #{order._id?.slice(-8)}</h3>
                    <p className="text-gray-400 text-sm mt-1">{formatDateTime(order.createdAt)}</p>
                </div>
                <StatusBadge status={isEditing ? editData.orderStatus : order.orderStatus} isEditing={false} />
            </div>

            <AnimatePresence initial={false}>
                {isEditing ? (
                    <EditForm
                        editData={editData}
                        onInputChange={onInputChange}
                        onShippingChange={onShippingChange}
                        onSave={() => onSave(order._id)}
                        onCancel={onCancel}
                    />
                ) : (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-300">
                        {/* ... (rest of OrderCard UI, which is unchanged) ... */}
                        {/* Customer / Total / Items */}
                        <div>
                            <p className="text-sm">Customer</p>
                            <p className="text-white">{order.userId?.email || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm">Total Amount</p>
                            <p className="text-green-400 font-bold text-lg">{formatCurrency(order.totalAmount)}</p>
                        </div>
                        <div>
                            <p className="text-sm">Items Count</p>
                            <p>{order.items?.length || 0}</p>
                        </div>

                        {/* Items List */}
                        <div className="lg:col-span-2">
                            <p className="text-sm mb-2">Items</p>
                            <div className="flex flex-wrap gap-3">
                                {order.items?.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col md:flex-row md:items-center gap-3 bg-gray-900 p-3 rounded-md border border-gray-700"
                                    >
                                        <img
                                            src={order.images?.[idx] || "https://placehold.co/80x80/333333/ffffff?text=No+Img"}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-md"
                                            onError={(e) => {
                                                e.target.src = "https://placehold.co/80x80/333333/ffffff?text=No+Img";
                                            }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">
                                            {item.name} ({item.size || "No Size"}) x{item.quantity}
                                            </span>
                                            {item.color && (
                                                <div className="flex gap-2 mt-1 items-center">
                                                    <div
                                                        title={item.color}
                                                        className="w-5 h-5 rounded-full border border-gray-600 shadow-sm"
                                                        style={{ backgroundColor: colorMap[item.color] || "#ccc" }}
                                                    ></div>
                                                    <span className="text-gray-400 capitalize">{item.color}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment / Shipping */}
                        <div>
                            <p className="text-sm">Payment Status</p>
                            <p>{order.paymentStatus}</p>
                        </div>
                        <div className="lg:col-span-2">
                            <p className="text-sm">Shipping Address</p>
                            <p>
                                {order.shippingInfo?.street}, {order.shippingInfo?.city}, {order.shippingInfo?.state}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="lg:col-span-3 flex gap-3 mt-4">
                            <motion.button
                                onClick={onEditClick}
                                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700"
                                whileHover={{ scale: 1.05 }}
                            >
                                Edit Order
                            </motion.button>
                            <motion.button
                                onClick={() => onDelete(order._id)}
                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700"
                                whileHover={{ scale: 1.05 }}
                            >
                                Delete Order
                            </motion.button>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Filter Buttons (No Change)
const FilterButtons = ({ filter, onFilterChange, loading }) => (
    <div className="flex flex-wrap gap-3 mb-8">
        {["all", "last7", "last30"].map((key) => (
            <motion.button
                key={key}
                onClick={() => onFilterChange(key)}
                className={`px-6 py-2 rounded-lg font-medium ${
                    filter === key ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 border border-gray-600"
                }`}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
            >
                {key === "all" ? "All Orders" : key === "last7" ? "Last 7 Days" : "Last 30 Days"}
            </motion.button>
        ))}
    </div>
);

// --- END: PRESENTATIONAL COMPONENTS ---

// Main Component (Logic is now minimal)
const ShowOrder = () => {
    // 💡 Logic is now imported from the hook
    const {
        loading,
        error,
        filteredOrders,
        filter,
        editingOrderId,
        editData,
        setFilter,
        handleEditClick,
        handleInputChange,
        handleShippingChange,
        handleSave,
        handleCancelEdit,
        handleDelete,
    } = useOrderLogic();

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
                <LoadingScreen message="Loading orders..." />
            </div>
        );

    if (error)
        return <div className="text-center mt-20 text-red-500">{error}</div>;

    return (
        <div className="flex min-h-screen bg-gray-900 text-gray-300">
            <Sidebar />
            <div className="flex-1 max-w-7xl mx-auto mt-8 w-full px-6">
                <h1 className="text-3xl font-bold mb-2 text-white">Order Management</h1>
                <p className="text-gray-400 mb-6">View and manage all customer orders</p>
                <FilterButtons filter={filter} onFilterChange={setFilter} loading={loading} />

                <AnimatePresence>
                    <div className="space-y-6">
                        {filteredOrders.length === 0 ? (
                            <motion.div 
                                key="empty" 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                className="text-center py-12 text-gray-400"
                            >
                                No Orders Found
                            </motion.div>
                        ) : (
                            filteredOrders.map((order) => (
                                <OrderCard
                                    key={order._id}
                                    order={order}
                                    isEditing={editingOrderId === order._id}
                                    editData={editData}
                                    onEditClick={() => handleEditClick(order)}
                                    onInputChange={handleInputChange}
                                    onShippingChange={handleShippingChange}
                                    onSave={handleSave}
                                    onCancel={handleCancelEdit}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ShowOrder;