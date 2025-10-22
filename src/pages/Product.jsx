import React from "react";
import Navbar from "../components/Navbar";
import { FaExclamationTriangle } from "react-icons/fa";
import { IoBagHandleOutline } from "react-icons/io5";
import { useProductPageLogic } from "../hooks/useProductPageLogic.js";

const Product = () => {
    const {
        productData,
        mainImage,
        size,
        color,
        quantity,
        error,
        handleSizeClick,
        handleColorClick,
        handleImageClick,
        handleIncrement,
        handleDecrement,
        handleAddToCart,
    } = useProductPageLogic();

    if (error || !productData)
        return (
            <div className="min-h-screen flex items-center justify-center flex-col bg-gray-50 p-6">
                
            </div>
        );

    return (
        <section className="bg-gray-50 min-h-screen pb-12 capitalize">
            <Navbar />
            <div className="container px-4 py-12 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Images Section */}
                    <div className="flex flex-col-reverse md:flex-row gap-6 justify-center">
                        {productData.images?.length > 0 && (
                            <div className="flex md:flex-col gap-3 items-center md:items-start justify-center md:justify-start pb-2 md:w-20 w-full">
                                {productData.images.map((img, i) => {
                                    const imageUrl = img.url || img;
                                    return (
                                        <img
                                            key={i}
                                            src={imageUrl}
                                            alt={`thumb-${i}`}
                                            onClick={() => handleImageClick(imageUrl)}
                                            className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 transform hover:scale-105 active:scale-90 ${
                                                mainImage === imageUrl
                                                    ? "border-[#FF5349] ring-2 ring-red-300 shadow-md"
                                                    : "border-gray-200 hover:border-[#FF5349]"
                                            }`}
                                            onError={(e) =>
                                                (e.target.src =
                                                    "https://via.placeholder.com/60x60/6b7280/ffffff?text=X")
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}
                        <div className="flex-1 shadow-2xl rounded-xl overflow-hidden">
                            <img
                                src={mainImage}
                                alt={productData.name}
                                className="w-full h-full object-cover rounded-xl"
                                onError={(e) =>
                                    (e.target.src =
                                        "https://via.placeholder.com/500x500/6b7280/ffffff?text=Product+Image")
                                }
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-4 mt-4 lg:p-0">
                        <h2 className="text-sm tracking-tighter text-[#FF5349] font-bold uppercase mb-1">
                            {productData.category || "General"}
                        </h2>
                        <h1 className="text-xl tracking-tighter text-[#262626] py-5 uppercase">
                            {productData.name}
                        </h1>

                        <div className="flex items-baseline mb-4">
                            <span className="text-3xl font-semibold tracking-tighter text-[#262626]">
                                PKR {parseFloat(productData.price || 0).toFixed(2)}
                            </span>
                            <span
                                className={`ml-4 px-3 py-1 text-xs font-semibold rounded-full ${
                                    productData.stock > 0
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                            >
                                {productData.stock > 0
                                    ? `${productData.stock} In Stock`
                                    : "Out of Stock"}
                            </span>
                        </div>

                        <p className="text-gray-600 mb-8 border-t border-b border-gray-200 py-6">
                            {productData.description ||
                                "A high-quality, durable product with a refined finish. Order yours today!"}
                        </p>

                        {/* Size Selection */}
                        {Array.isArray(productData.sizes) && productData.sizes.length > 0 && (
                            <div className="mb-6">
                                <label className="block mb-3 text-lg font-semibold text-gray-800">
                                    Select Size:{" "}
                                    {size && (
                                        <span className="text-[#FF5349] font-bold ml-1">
                                            ({size.toUpperCase()})
                                        </span>
                                    )}
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {productData.sizes.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleSizeClick(s)}
                                            disabled={productData.stock === 0}
                                            className={`px-5 py-2 rounded-xl border-2 font-medium transition-all duration-200 transform hover:scale-[1.05] active:scale-95 ${
                                                size === s
                                                    ? "bg-[#FF5349] text-white border-[#FF5349] ring-4 ring-red-200 shadow-lg"
                                                    : "bg-white border-gray-300 text-gray-700 hover:border-red-200 hover:bg-red-50"
                                            } ${
                                                productData.stock === 0
                                                    ? "opacity-40 cursor-not-allowed hover:scale-100"
                                                    : ""
                                            }`}
                                        >
                                            {s.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ✅ Color + Quantity Section Combined */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-8">
                            {/* Optional Color Selector */}
                            {Array.isArray(productData.colors) &&
                                productData.colors.length > 0 && (
                                    <div className="flex-1">
                                        <label className="block mb-3 text-lg font-semibold text-gray-800">
                                            Select Color:{" "}
                                            {color && (
                                                <span className="text-[#FF5349] font-bold ml-1">
                                                    ({color})
                                                </span>
                                            )}
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {productData.colors.map((c, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleColorClick(c)}
                                                    className={`w-10 h-10 rounded-full border-4 shadow-md transition-all duration-200 transform hover:scale-110 active:scale-90 ${
                                                        color === c
                                                            ? "border-black ring-4 ring-offset-2 ring-[#FF5349]"
                                                            : "border-gray-300 hover:border-black"
                                                    }`}
                                                    style={{ backgroundColor: c }}
                                                    aria-label={`Select color ${c}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                            {/* Quantity Selector */}
                            <div className="w-full md:w-60">
                                <label className="block mb-3 text-lg font-semibold text-gray-800">
                                    Quantity:
                                </label>
                                <div className="flex items-center rounded-xl">
                                    <button
                                        onClick={handleDecrement}
                                        disabled={quantity <= 1 || productData.stock === 0}
                                        className={`w-10 h-10 flex items-center justify-center cursor-pointer border-gray-400 border rounded-lg text-xl font-bold text-gray-700 hover:bg-gray-100 active:scale-95 transition disabled:opacity-40 ${
                                            productData.stock === 0 ? "cursor-not-allowed" : ""
                                        }`}
                                    >
                                        −
                                    </button>

                                    <span
                                        className={`px-6 py-2 text-lg font-semibold text-center min-w-[50px] select-none ${
                                            productData.stock === 0
                                                ? "text-gray-500"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        {quantity}
                                    </span>

                                    <button
                                        onClick={handleIncrement}
                                        disabled={
                                            quantity >= productData.stock ||
                                            productData.stock === 0
                                        }
                                        className={`w-10 h-10 flex items-center cursor-pointer border-gray-400 border rounded-lg justify-center text-xl font-bold text-gray-700 hover:bg-gray-100 active:scale-95 transition ${
                                            productData.stock === 0
                                                ? "cursor-not-allowed opacity-40"
                                                : ""
                                        }`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!size || productData.stock === 0 || quantity < 1}
                            className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 transform ${
                                size && productData.stock > 0 && quantity >= 1
                                    ? "bg-black text-white hover:scale-[1.01] active:scale-90 focus:ring-4 focus:ring-red-300"
                                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                        >
                            <IoBagHandleOutline className="text-xl" />
                            {productData.stock === 0
                                ? "Out of Stock"
                                : !size
                                ? "Select Size to Continue"
                                : quantity < 1
                                ? "Enter Quantity"
                                : "Add to Bag"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Product;
