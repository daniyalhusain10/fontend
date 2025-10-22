// src/hooks/useOrderLogic.js
import { useState, useEffect, useCallback } from "react";
// 💡 Import the custom hook for confirmation
import { useConfirm } from '../api/ConfirmationContext.jsx'; 

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/show-orders`;

export const useOrderLogic = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [editData, setEditData] = useState({});

    // 💡 Initialize the custom confirm hook
    const { myConfirm } = useConfirm();

    // 1. Fetch Orders Logic (Separated)
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(API_URL);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch orders");

            const sortedOrders = [...data.orders].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            setOrders(sortedOrders);
        } catch (err) {
            setError(err.message || "Network error");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial Fetch
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Filtering Logic
    useEffect(() => {
        const now = new Date();
        let filtered = [...orders];

        if (filter === "last7") {
            const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
            filtered = orders.filter((o) => new Date(o.createdAt) >= sevenDaysAgo);
        }
        if (filter === "last30") {
            const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
            filtered = orders.filter((o) => new Date(o.createdAt) >= thirtyDaysAgo);
        }
        setFilteredOrders(filtered);
    }, [filter, orders]);

    // 2. Edit Handlers
    const handleEditClick = (order) => {
        setEditingOrderId(order._id);
        // Deep copy of shippingInfo to prevent direct mutation
        setEditData({
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            shippingInfo: { ...order.shippingInfo },
        });
    };

    const handleInputChange = (e, key) => {
        setEditData((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const handleShippingChange = (e, field) => {
        setEditData((prev) => ({ 
            ...prev, 
            shippingInfo: { ...prev.shippingInfo, [field]: e.target.value } 
        }));
    };

    const handleCancelEdit = () => {
        setEditingOrderId(null);
        setEditData({});
    };

    // 3. API Action Handlers (Update/Delete)
    const handleSave = async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update failed");

            // Refresh data and close edit mode
            await fetchOrders();
            setEditingOrderId(null);
            // Success alert removed as requested.
        } catch (err) {
            alert(err.message || "Update failed");
        }
    };

    const handleDelete = async (id) => {
        // 💡 Use the external myConfirm function
        const isConfirmed = await myConfirm(
            "Are you sure you want to delete this order? This action cannot be undone.",
            "Permanently Delete Order"
        );
        
        if (!isConfirmed) return;
        
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");
            
            alert("Order deleted successfully! (Contextual success feedback is good)");
            fetchOrders();
        } catch (err) {
            alert(err.message || "Delete failed");
        }
    };

    // Return everything the component needs
    return {
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
    };
};