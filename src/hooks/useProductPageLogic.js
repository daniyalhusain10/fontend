import { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ShopContext from "../api/ShopContext.jsx";
import { useLoading } from "../api/LoadingContext.jsx";

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

export const useProductPageLogic = () => {
  const { id } = useParams();
  const { addToCart } = useContext(ShopContext);
  const { setLoading } = useLoading();

  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  // --- Fetch Product Data ---
  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      if (!id) return setError("Invalid Product ID");
      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/products/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const product = data.product || data.products || data;

        if (isMounted && product?._id) {
          setProductData(product);
          const firstImage =
            product.imageUrl ||
            (product.images?.length
              ? product.images[0].url || product.images[0]
              : null) ||
            "https://via.placeholder.com/400x400/6b7280/ffffff?text=No+Image";
          setMainImage(firstImage);

          setQuantity(product.stock > 0 ? 1 : 0);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Error loading product");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id, setLoading]);

  // --- Quantity Control ---
  const updateQuantityState = useCallback(
    (newQty) => {
      const maxStock = productData?.stock || 0;

      if (maxStock === 0) {
        setQuantity(0);
        return;
      }

      let finalQty = Math.max(1, newQty);
      finalQty = Math.min(maxStock, finalQty);
      setQuantity(finalQty);
    },
    [productData?.stock]
  );

  // --- Click Handlers ---
  const handleSizeClick = useCallback((selectedSize) => {
    setSize((prev) => (prev === selectedSize ? null : selectedSize));
  }, []);

  const handleColorClick = useCallback((selectedColor) => {
    setColor((prev) => (prev === selectedColor ? null : selectedColor));
  }, []);

  const handleImageClick = useCallback((img) => setMainImage(img), []);

  const handleIncrement = useCallback(() => {
    updateQuantityState(quantity + 1);
  }, [quantity, updateQuantityState]);

  const handleDecrement = useCallback(() => {
    updateQuantityState(quantity - 1);
  }, [quantity, updateQuantityState]);

  // --- Add to Cart ---
  const handleAddToCart = useCallback(() => {
    if (!size) {
      toast.warning("Please select a size first.");
      return;
    }

    if (!productData?._id) return;
    if (quantity < 1 || productData.stock < 1) {
      toast.warning("This item is out of stock or quantity is invalid.");
      return;
    }

    // ✅ Color optional — do NOT send "default"
    const selectedColor = color || null; // <--- changed from "default"

    addToCart(productData._id, size, quantity, selectedColor ?? undefined);

    toast.success(
      `${quantity} × ${productData.name} (${size.toUpperCase()}${
        color ? `, ${color}` : ""
      }) added to cart!`,
      { position: "top-center" }
    );

    setQuantity(productData.stock > 0 ? 1 : 0);
  }, [size, color, productData, quantity, addToCart]);

  return {
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
  };
};
