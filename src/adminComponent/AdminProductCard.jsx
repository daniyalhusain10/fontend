// src/components/ProductCard.jsx

import React from "react";
import { Edit2, Trash2, Check } from "lucide-react";

// The array of available colors should ideally be imported from the hook/context/constants file
// For this example, we'll assume it's passed or available.
// NOTE: It is better to pass AVAILABLE_COLORS as a prop if it's dynamic.
const AVAILABLE_COLORS = [
    { name: "red", hex: "#ef4444" },
    { name: "blue", hex: "#3b82f6" },
    { name: "green", hex: "#10b981" },
    { name: "yellow", hex: "#f59e0b" },
    { name: "black", hex: "#000000" },
    { name: "white", hex: "#ffffff" },
];

/**
 * Renders a single product card with edit and delete functionality.
 * The update/edit/delete logic handlers are passed down as props from the parent.
 *
 * @param {object} product The product object to display.
 * @param {function} onEdit Handler for initiating the product edit (sets the form data).
 * @param {function} onDelete Handler for initiating the product delete confirmation.
 */
const ProductCard = ({ product, onEdit, onDelete }) => {
    // Determine the main image URL
    const imageUrl = Array.isArray(product.images)
        ? typeof product.images[0] === "string"
            ? product.images[0]
            : product.images[0]?.url || product.images[0]?.imageUrl
        : product.imageUrl || "/placeholder.png";

    return (
        <div
            className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-green-600/30 transition relative group"
            key={product._id} // Using product._id as key here
        >
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                    onError={(e) => (e.target.src = "/placeholder.png")}
                />

                {/* Action Buttons (Edit and Delete) */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                        onClick={() => onEdit(product)}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
                        title="Edit"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(product._id)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Product Details */}
            <div className="p-4">
                <h4 className="text-lg font-bold text-white truncate">
                    {product.name}
                </h4>

                <p className="text-gray-400 text-sm">
                    {product.category?.toUpperCase()}
                </p>

                {/* Colors Display */}
                {product.colors?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {product.colors.map((clr) => {
                            const colorObj = AVAILABLE_COLORS.find((c) => c.name === clr);
                            return (
                                <div
                                    key={clr}
                                    className="w-4 h-4 rounded-full border border-gray-400"
                                    style={{
                                        backgroundColor: colorObj?.hex || clr,
                                    }}
                                    title={clr}
                                ></div>
                            );
                        })}
                    </div>
                )}
                
                {/* Price Display */}
                <p className="text-green-400 pt-2 font-semibold">
                    PKR {product.price.toFixed(2)}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;