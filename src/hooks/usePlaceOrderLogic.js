import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ShopContext from "../api/ShopContext.jsx";
import { useAuth } from "../api/AuthContext.jsx";
import { updateStock } from "../api/updateStock.js";

/**
 * Custom hook to handle the complex business logic for the CheckoutForm.
 *
 * @param {object} formMethods - The object returned from react-hook-form's useForm hook.
 * @returns {object} An object containing state, handlers, and computed values.
 */
const usePlaceOrderLogic = (formMethods) => {
  const navigate = useNavigate();
  const { cartItems, products, clearCart, shippingFee } = useContext(ShopContext);
  // This hook correctly handles guest checkout by using the conditional: userId: isLoggedIn ? userId : null,
  const { userId, isLoggedIn } = useAuth();

  const { watch, setValue } = formMethods;

  const [items, setItems] = useState([]);
  const phone = watch("phone") || "";

  // Compute total
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // --- Handlers & Effects ---

  // Format phone input
  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/[^\d+]/g, "");
    if (val.startsWith("+")) val = "+" + val.slice(1).replace(/\D/g, "");
    if (val === "+") val = "";
    if (val.length > 15) val = val.slice(0, 15);
    setValue("phone", val, { shouldValidate: true });
  };

  // Build and validate items array from cartItems
  useEffect(() => {
    if (!products || products.length === 0) return;

    const builtItems = Object.entries(cartItems).flatMap(([productId, variants]) =>
      Object.entries(variants)
        .map(([variantKey, quantity]) => {
          // Basic validation (can be expanded)
          if (!/^[a-fA-F0-9]{24}$/.test(productId)) {
            return null;
          }
          if (!quantity || typeof quantity !== "number" || quantity <= 0) {
            return null;
          }

          const [size, color] = variantKey.split("_");

          const product = products.find((p) => p._id === productId);
          if (!product) {
            return null;
          }

          return {
            productId,
            name: product.name,
            size: size || null,
            color: color || null,
            quantity: Number(quantity),
            price: Number(product.price),
          };
        })
        .filter(Boolean)
    );

    setItems(builtItems);
  }, [cartItems, products]);

  // Submit order function
  const onSubmit = async (formData) => {
    if (items.length === 0) {
      toast.error("🛒 Your cart is empty!");
      return;
    }

    try {
      const orderData = {
        // This is where guest checkout is handled: userId is null if not logged in.
        userId: isLoggedIn ? userId : null, 
        items,
        shippingInfo: {
          ...formData,
          // Clean phone and zipcode before sending to API
          phone: String(formData.phone).replace(/[^\d+]/g, ""),
          zipcode: String(formData.zipcode),
        },
        totalAmount: totalAmount + shippingFee,
        paymentStatus: "Pending",
        shippingFee,
      };

      // Extracted API URL for clarity
      const ORDERS_API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/orders`;

      // 1. Submit Order
      const orderRes = await fetch(ORDERS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const orderDataResponse = await orderRes.json();

      if (!orderRes.ok || !orderDataResponse.success) {
        toast.error(`❌ ${orderDataResponse.message || "Order failed"}`);
        return;
      }

      // 2. Update Stock
      try {
        await updateStock(items);
      } catch (stockError) {
        toast.error("Order placed, but stock update failed. Please contact support.");
      }

      // 3. Cleanup and Navigation
      clearCart();
      toast.success("✅ Order placed successfully!");
      navigate("/complete-order", { state: { order: orderDataResponse.order } });

    } catch (err) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return {
    onSubmit,
    handlePhoneChange,
    phone,
    items,
  };
};

export default usePlaceOrderLogic;
