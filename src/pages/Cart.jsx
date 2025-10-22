import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import ShopContext from "../api/ShopContext.jsx";
import { MdDelete } from "react-icons/md";
import Navbar from "../components/Navbar.jsx";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    setCheckoutValue,
    shippingFee,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // --- Process Cart Data ---
  useEffect(() => {
    const tempData = [];
    let totalQty = 0;
    let totalPrice = 0;

    for (const productId in cartItems) {
      for (const key in cartItems[productId]) {
        const quantity = cartItems[productId][key];
        if (quantity > 0) {
          const [size, color] = key.split("_");
          const product = products.find((p) => p._id === productId);
          if (product) {
            const finalImage =
              (Array.isArray(product.images) && product.images.length > 0
                ? product.images[0]?.url || product.images[0]
                : null) || product.imageUrl;

            tempData.push({
              _id: productId,
              size,
              color,
              quantity,
              price: product.price,
              name: product.name,
              image: finalImage,
            });

            totalQty += quantity;
            totalPrice += product.price * quantity;
          }
        }
      }
    }

    setCartData(tempData);
    setTotalItems(totalQty);
    setTotalAmount(totalPrice);

    setCheckoutValue((prev) => {
      const isEqual = JSON.stringify(prev) === JSON.stringify(tempData);
      return isEqual ? prev : tempData;
    });
  }, [cartItems, products, setCheckoutValue]);

  const grandTotal = totalAmount + shippingFee;

  // ✅ Determine proper border for color circles
  const getColorBorder = (color) => {
    const darkColors = ["black", "blue", "purple"];
    const lightColors = ["white", "yellow", "gray"];
    if (darkColors.includes(color?.toLowerCase())) return "2px solid #fff";
    if (lightColors.includes(color?.toLowerCase())) return "2px solid #ccc";
    return "1px solid #ddd";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-800">
            🛒 Your Shopping Cart
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-2xl shadow-lg divide-y divide-gray-200">
          {cartData.length === 0 ? (
            <div className="p-10 text-center text-gray-500 text-lg">
              Your cart is empty. Please add some items!
            </div>
          ) : (
            cartData.map((item) => (
              <div
                key={`${item._id}-${item.size}-${item.color}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-6 hover:bg-gray-50 transition duration-150"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                  {/* Image */}
                  <div className="shrink-0">
                    {item.image ? (
                      <img
                        className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm"
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/100x100/cccccc/333333?text=No+Img";
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-xl text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-900 text-lg">
                      {item.name}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="px-2 py-1 bg-gray-200 rounded-lg text-sm font-medium text-gray-700">
                        Size: {item.size}
                      </span>

                      {item.color && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Color:</span>
                          <span
                            className="w-5 h-5 rounded-full shadow-sm"
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
                    </div>

                    <p className="font-semibold text-green-600 mt-2">
                      {currency} {item.price?.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Quantity + Delete */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-300 rounded-xl shadow-sm bg-white">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.size,
                          item.color,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-100 active:scale-95 transition disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span className="px-6 py-2 text-lg font-semibold text-gray-900 text-center min-w-[50px] select-none">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.size,
                          item.color,
                          item.quantity + 1
                        )
                      }
                      className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-100 active:scale-95 transition"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() =>
                      updateQuantity(item._id, item.size, item.color, 0)
                    }
                    className="p-3 rounded-full hover:bg-red-100 transition"
                    aria-label={`Remove ${item.name}`}
                  >
                    <MdDelete className="text-red-500 text-2xl" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals Section */}
        {cartData.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-end mt-10 items-stretch sm:items-center gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-inner text-right w-full sm:w-auto">
              <p className="text-gray-700 text-sm mb-1">
                Subtotal:{" "}
                <span className="font-medium">
                  {currency} {totalAmount.toFixed(2)}
                </span>
              </p>
              <p className="text-gray-700 text-sm mb-1">
                Shipping Fee:{" "}
                <span className="font-medium">
                  {currency} {shippingFee.toFixed(2)}
                </span>
              </p>
              <p className="font-bold text-lg mt-3 border-t pt-2 text-black">
                Grand Total:{" "}
                <span>
                  {currency} {grandTotal.toFixed(2)}
                </span>
              </p>
            </div>

            <NavLink
              to="/place-order"
              className="bg-red-400 hover:bg-red-400 text-white font-semibold px-8 py-3 rounded-xl shadow-md text-center transition active:scale-95 w-full sm:w-auto"
            >
              PROCEED TO CHECKOUT
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
