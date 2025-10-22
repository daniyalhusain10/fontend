// src/pages/UpdateProduct.jsx

import React from "react";
import { ToastContainer } from "react-toastify";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { useProductManagementLogic } from "../hooks/useProductManagmentLogic.js"; 

import ProductCard from "../adminComponent/AdminProductCard.jsx"; // 💡 IMPORT THE NEW COMPONENT

import {
    Edit2,
    Trash2,
    PlusCircle,
    LogOut,
    X,
    Package,
    AlertTriangle,
    Loader2,
    Check,
} from "lucide-react";
import Sidebar from "./Sidebar";
import ImageUploader from "./ImageUploader.jsx"; 

const UpdateProduct = () => {
    // 💡 Hook Call: All logic is here now
    const {
        products,
        loading,
        isSubmitting,
        editingId,
        updatingId,
        confirmDeleteId,
        isFormVisible,
        newProduct,
        imagePreviews,
        AVAILABLE_SIZES,
        AVAILABLE_COLORS, // 💡 Pass this to ProductCard if it's needed there (or define it in ProductCard)
        setIsFormVisible,
        setConfirmDeleteId,
        resetForm,
        handleImagesChange,
        handleInputChange,
        handleSizeChange,
        handleColorToggle,
        handleEdit, // 💡 Passed to ProductCard
        handleAdd,
        handleDelete, // 💡 Passed to ProductCard
        executeDelete,
    } = useProductManagementLogic();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
                <LoadingScreen message="Loading products..." />
            </div>
        );
    }

    const inputStyle =
        "border border-gray-700 p-3 rounded-xl bg-gray-900 text-white placeholder-gray-500 focus:ring-green-500 focus:border-green-500 transition duration-150 shadow-inner w-full";
    const labelStyle = "block text-sm font-medium text-gray-400 mb-1";

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 font-sans">
            <Sidebar />
            <div className="p-4 md:p-8 w-full md:w-[85%] overflow-y-auto relative">
                <ToastContainer position="top-right" autoClose={4000} theme="dark" />

                {(isSubmitting || updatingId) && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="text-white text-2xl font-bold flex items-center p-4 bg-gray-900 rounded-xl shadow-2xl">
                            <Loader2
                                className="animate-spin mr-3 text-green-400"
                                size={32}
                            />
                            {isSubmitting && !updatingId
                                ? "New product is adding..."
                                : "Product is updating..."}
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-between border-b border-gray-700 pb-4 mb-8">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                        Product Inventory Management
                    </h2>
                    <button
                        onClick={() => {
                            const logoutConfirmed = window.confirm("Logout karna chahte hain?");
                            if (logoutConfirmed) {
                                localStorage.clear();
                                window.location.href = "/login";
                            }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 font-semibold transition duration-150 flex items-center gap-2 mt-4 md:mt-0 shadow-lg"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>

                {/* Product Form */}
                <div className="mb-10">
                    <button
                        onClick={() => {
                            setIsFormVisible(!isFormVisible);
                            if (isFormVisible) resetForm();
                        }}
                        className="flex items-center gap-2 bg-green-600 text-white py-2 px-5 rounded-xl font-bold hover:bg-green-700 transition duration-300 shadow-md mb-6"
                        disabled={isSubmitting}
                    >
                        {isFormVisible ? <X size={20} /> : <PlusCircle size={20} />}
                        {isFormVisible ? "Close The Form" : "Add A New Product"}
                    </button>

                    <div
                        className={`bg-gray-800 shadow-2xl rounded-2xl p-6 transition-all duration-500 overflow-hidden ${
                            isFormVisible ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 p-0"
                        }`}
                    >
                        <h3 className="text-2xl font-bold mb-6 text-green-400 border-b border-gray-700 pb-2">
                            {editingId ? "🔄 Product Edit Kariye" : "✨ Add A New Product"}
                        </h3>
                        <form onSubmit={handleAdd} className="flex flex-col gap-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                <div>
                                    <label htmlFor="name" className={labelStyle}>
                                        Product Name *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="T-Shirt, Monitor, etc."
                                        className={inputStyle}
                                        value={newProduct.name}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="price" className={labelStyle}>
                                        Price (Rs) *
                                    </label>
                                    <input
                                        id="price"
                                        type="number"
                                        name="price"
                                        placeholder="Price"
                                        className={inputStyle}
                                        value={newProduct.price}
                                        onChange={handleInputChange}
                                        required
                                        min="0.01"
                                        step="0.01"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="category" className={labelStyle}>
                                        Category *
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={newProduct.category}
                                        onChange={handleInputChange}
                                        required
                                        className={inputStyle + " appearance-none cursor-pointer"}
                                        disabled={isSubmitting}
                                    >
                                        <option value="" disabled>Category</option>
                                        <option value="men">Men's Wear</option>
                                        <option value="women">Women's Wear</option>
                                        <option value="accessories">Accessories</option>
                                        <option value="electronics">Electronics</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className={labelStyle}>
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Product ka detailed description"
                                    value={newProduct.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className={inputStyle + " w-full"}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <ImageUploader
                                key={editingId || "new"}
                                initialImages={imagePreviews}
                                onImagesChange={handleImagesChange}
                                isUploading={isSubmitting}
                                maxImages={5}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                                <div>
                                    <label htmlFor="stock" className={labelStyle}>
                                        Stock Quantity *
                                    </label>
                                    <input
                                        id="stock"
                                        type="number"
                                        name="stock"
                                        placeholder="Stock Quantity"
                                        value={newProduct.stock}
                                        onChange={handleInputChange}
                                        className={inputStyle}
                                        required
                                        min="0"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="p-3 rounded-xl border border-gray-700 bg-gray-900 shadow-inner">
                                    <label className={labelStyle}>Available Sizes</label>
                                    <div className="flex flex-wrap gap-4 pt-1">
                                        {AVAILABLE_SIZES.map((sz) => (
                                            <label
                                                key={sz}
                                                className="flex items-center gap-2 cursor-pointer text-white"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={sz}
                                                    checked={newProduct.sizes.includes(sz)}
                                                    onChange={handleSizeChange}
                                                    className="accent-green-500 w-4 h-4"
                                                    disabled={isSubmitting}
                                                />
                                                <span className="capitalize text-sm">
                                                    {sz.toUpperCase()}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl border border-gray-700 bg-gray-900 shadow-inner">
                                    <label className={labelStyle}>Available Colors</label>
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        {AVAILABLE_COLORS.map((color) => {
                                            const isSelected = newProduct.colors.includes(color.name);
                                            return (
                                                <button
                                                    type="button"
                                                    key={color.name}
                                                    onClick={() => handleColorToggle(color.name)}
                                                    disabled={isSubmitting}
                                                    title={color.name.toUpperCase()}
                                                    className={`w-8 h-8 rounded-full border-2 transition transform hover:scale-110 shadow-md flex items-center justify-center ${
                                                        isSelected
                                                            ? "ring-2 ring-purple-500 scale-110"
                                                            : ""
                                                    }`}
                                                    style={{
                                                        backgroundColor: color.hex,
                                                        borderColor:
                                                            color.name === "white" ? "#d1d5db" : color.hex,
                                                    }}
                                                >
                                                    {isSelected && (
                                                        <Check
                                                            size={16}
                                                            className={`${
                                                                color.name === "white"
                                                                    ? "text-black"
                                                                    : "text-white"
                                                            }`}
                                                        />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-green-700 transition duration-300 shadow-lg disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : editingId ? (
                                    <Edit2 size={20} />
                                ) : (
                                    <PlusCircle size={20} />
                                )}
                                {isSubmitting
                                    ? editingId
                                        ? "Update ..."
                                        : "Add ..."
                                    : editingId
                                        ? "Product Update "
                                        : "Product Add "}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="w-full mt-2 text-sm text-gray-400 hover:text-gray-100 transition disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    Edit Cancel
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* Product List */}
                <h3 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2">
                    <Package size={24} className="text-green-400" />
                    Current Products ({products.length})
                </h3>

                {products.length === 0 ? (
                    <p className="text-gray-400 col-span-full p-4 bg-gray-800 rounded-xl text-center">
                        Don't have any product to display
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* 💡 REPLACED THE INLINE RENDERING WITH ProductCard COMPONENT */}
                        {products.map((p) => (
                            <ProductCard
                                key={p._id}
                                product={p}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                // Optionally, pass AVAILABLE_COLORS if ProductCard needs it
                                // to find the hex code for display (already hardcoded for simplicity above)
                                // availableColors={AVAILABLE_COLORS} 
                            />
                        ))}
                    </div>
                )}

                {confirmDeleteId && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl text-center text-white max-w-sm">
                            <AlertTriangle
                                size={48}
                                className="text-yellow-400 mx-auto mb-3"
                            />
                            <h4 className="text-xl font-semibold mb-3">
                                Confirm delete this product?
                            </h4>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => executeDelete(confirmDeleteId)}
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-semibold"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-xl font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateProduct;