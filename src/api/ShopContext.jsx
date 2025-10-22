// src/api/ShopContext.js
import React, { createContext, useState, useEffect, useMemo, useRef } from "react";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [currency, setCurrency] = useState("Rs");
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : {};
  });
  const [checkoutValue, setCheckoutValue] = useState([]);
  const [shippingFee, setShippingFee] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // 🔹 Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const allProducts = data.products || data.Products || data;
        setProducts(allProducts || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // 🔹 Filter and sort logic
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    const term = searchTerm.toLowerCase().trim();

    if (term)
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term)
      );

    if (filterCategory && filterCategory !== "all") {
      const cleanFilter = filterCategory.toLowerCase().trim();
      filtered = filtered.filter(
        (p) => p.category && p.category.toLowerCase().trim() === cleanFilter
      );
    }

    const sorted = [...filtered];
    if (sortOrder === "price_asc") {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === "price_desc") {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return sorted;
  }, [products, searchTerm, filterCategory, sortOrder]);

  const lastAddedRef = useRef({ id: null, size: null, color: null, timestamp: 0 });

  // ✅ Updated: color is now truly optional (null if not chosen)
  const addToCart = (productId, size, qty = 1, color = null) => {
    if (!productId || !size) return;

    // use "none" in localStorage key to avoid clashes but send `null` to backend
    const key = `${size}_${color || "none"}`;
    const now = Date.now();
    const last = lastAddedRef.current;

    if (
      last.id === productId &&
      last.size === size &&
      last.color === color &&
      now - last.timestamp < 400
    )
      return;

    lastAddedRef.current = { id: productId, size, color, timestamp: now };

    setCartItems((prev) => {
      const newCart = { ...prev };
      if (!newCart[productId]) newCart[productId] = {};

      const existingQty = newCart[productId][key] || 0;
      newCart[productId][key] = existingQty + qty;

      return newCart;
    });
  };

  const updateQuantity = (productId, size, color = null, quantity) => {
    if (!productId || !size) return;
    const key = `${size}_${color || "none"}`;
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      const productGroup = updatedCart[productId] || {};

      if (quantity <= 0) {
        delete productGroup[key];
      } else {
        productGroup[key] = quantity;
      }

      if (Object.keys(productGroup).length > 0) {
        updatedCart[productId] = productGroup;
      } else {
        delete updatedCart[productId];
      }

      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
  };

  const getCartTotal = useMemo(() => {
    let total = 0;
    for (const productId in cartItems) {
      const product = products.find((p) => p._id === productId);
      if (!product) continue;

      for (const key in cartItems[productId]) {
        const qty = cartItems[productId][key];
        total += (product.price || 0) * qty;
      }
    }
    return total;
  }, [cartItems, products]);

  const value = {
    products,
    filteredProducts,
    currency,
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkoutValue,
    setCheckoutValue,
    shippingFee,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    sortOrder,
    setSortOrder,
    getCartTotal,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContext;
