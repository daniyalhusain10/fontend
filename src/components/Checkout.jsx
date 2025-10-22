import React, { useContext, useMemo } from "react";
import ShopContext from "../api/ShopContext";

const Checkout = () => {
  const { cartItems, products, currency } = useContext(ShopContext);

  // --- Compute cart data with size & color ---
  const cartData = useMemo(() => {
    if (!products || !cartItems) return [];

    return Object.entries(cartItems).flatMap(([productId, variants]) =>
      Object.entries(variants)
        .map(([variantKey, quantity]) => {
          if (quantity <= 0) return null;

          const [size, color] = variantKey.split("_"); // ✅ Extract size & color
          const product = products.find((p) => p._id === productId);
          if (!product) return null;

          const image =
            product.imageUrl ||
            (Array.isArray(product.images) && product.images[0]?.url) ||
            "https://via.placeholder.com/150";

          return {
            productId,
            size,
            color,
            quantity,
            name: product.name,
            price: Number(product.price),
            image,
          };
        })
        .filter(Boolean)
    );
  }, [cartItems, products]);

  // --- Compute totals ---
  const totalAmount = useMemo(
    () => cartData.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartData]
  );

  // --- Helper for visible color border ---
  const getColorBorder = (color) => {
    const darkColors = ["black", "blue", "purple"];
    const lightColors = ["white", "yellow", "gray"];
    if (darkColors.includes(color?.toLowerCase())) return "2px solid #fff";
    if (lightColors.includes(color?.toLowerCase())) return "2px solid #ccc";
    return "1px solid #ddd";
  };

  return (
    <div className="bg-gray-50  p-4 ">
      {cartData.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">
          Your cart is empty 🛒
        </p>
      ) : (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            🧾 Order Summary
          </h2>

          <div className="flex flex-col gap-4">
            {cartData.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex items-center gap-4 p-3 border-b border-gray-200 last:border-none"
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/80x80/cccccc/333333?text=No+Img";
                  }}
                />

                {/* Product Info */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>

                  <div className="flex items-center gap-3 mt-1">
                    {/* Size */}
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
                      Size: {item.size}
                    </span>

                    {/* Color */}
                    {item.color && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Color:</span>
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: item.color,
                            border: getColorBorder(item.color),
                          }}
                          title={item.color}
                        ></span>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {item.color}
                        </span>
                      </div>
                    )}
                     <p className="text-sm text-gray-600 mt-1">
                    Qty: <span className="font-medium">{item.quantity}</span>
                  </p>
                  </div>

                 
                </div>

                {/* Price */}
               
              </div>
            ))}
          </div>

          {/* Total */}
          <hr className="my-4" />
          <p className="font-semibold text-right text-lg text-black">
            Total: PKR {totalAmount.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
