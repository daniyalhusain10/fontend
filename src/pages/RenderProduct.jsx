import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ShopContext from "../api/ShopContext.jsx";
import Button from "../components/Button.jsx";

// ... (colorMap remains the same)

const RenderProduct = () => {
    const { products } = useContext(ShopContext);

    // ✅ FINAL CORRECTED LOGIC: Check for both "women" and "womens"
    const womensProducts = products.filter((product) => {
        // Safe check and normalization (trim, lowercase)
        if (typeof product.category === 'string') {
            const normalizedCategory = product.category.toLowerCase().trim();
            
            // Check if the normalized category is "women" OR "womens" (covering potential typos/database inconsistencies)
            return normalizedCategory === "women" || normalizedCategory === "womens";
        }
        return false;
    });

    return (
        <section className="bg-white text-black py-12 px-6 min-h-screen">
            <h2 className="text-4xl font-extrabold text-center mb-12 text-black uppercase">
                All products
            </h2>

            {womensProducts.length === 0 ? (
                <p className="text-center text-gray-500">No women's products available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
                    {/* Filtered products ko map (render) kar rahe hain */}
                    {womensProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </section>
    );
};

// 🧩 Product Card (Logic remains the same)
const ProductCard = ({ product }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hovered, setHovered] = useState(false);
    const intervalRef = useRef(null);

    const images =
        Array.isArray(product.images) && product.images.length > 0
            ? product.images.map((img) => img.url || img)
            : [
                  product.imageUrl ||
                      "https://placehold.co/600x600/cccccc/333333?text=No+Image",
              ];

    // ⏱ Cycle through images every 0.7s on hover
    useEffect(() => {
        if (hovered && images.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, 700);
        } else {
            clearInterval(intervalRef.current);
            setCurrentIndex(0);
        }
        return () => clearInterval(intervalRef.current);
    }, [hovered, images.length]);

    return (
        <Link to={`/product/${product._id}`}>
            <div
                className="flex flex-col cursor-pointer transition-transform duration-300"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* 🖼 Product Image */}
                <div className="relative w-full h-96 overflow-hidden">
                    <img
                        src={images[currentIndex]}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className={`w-full h-full object-cover object-top transition-transform duration-500 ${
                            hovered ? "scale-110" : "scale-100"
                        }`}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                "https://placehold.co/600x600/cccccc/333333?text=No+Image";
                        }}
                    />
                </div>

                {/* 🏷 Product Info */}
                <div className="mt-4 text-left">
                    <h3 className="text-md tracking-tighter text-black uppercase">
                        {product.name}
                    </h3>

                    {/* 💰 Price */}
                    <p className="text-xl tracking-tighter font-bold text-black mt-1">
                        PKR {product.price}.00
                    </p>

                    {/* 📏 Sizes */}
                    {product.sizes?.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {product.sizes.map((size) => (
                                <div
                                    key={size}
                                    className="px-3 py-1 uppercase text-sm font-medium bg-gray-200 text-gray-800"
                                >
                                    {size}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm mt-2">No size options</p>
                    )}

                    {/* 🔘 View Product Button */}
                    <div className="mt-4">
                     <Button  text={"product.."}/>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RenderProduct;