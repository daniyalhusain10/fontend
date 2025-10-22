// src/hooks/useProductManagementLogic.js

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;
const CONFIG = { withCredentials: true };
const AVAILABLE_SIZES = ["s", "m", "l", "xl"];
const AVAILABLE_COLORS = [
    { name: "black", hex: "#000000" },
    { name: "white", hex: "#ffffff" },
    { name: "red", hex: "#ef4444" },
    { name: "blue", hex: "#3b82f6" },
    { name: "green", hex: "#22c55e" },
    { name: "yellow", hex: "#eab308" },
    { name: "purple", hex: "#8b5cf6" },
    { name: "gray", hex: "#6b7280" },
];

const INITIAL_PRODUCT_STATE = {
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
    sizes: [],
    colors: [],
};

export const useProductManagementLogic = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [newProduct, setNewProduct] = useState(INITIAL_PRODUCT_STATE);

    // --- Utility Functions ---

    const resetForm = useCallback(() => {
        setNewProduct(INITIAL_PRODUCT_STATE);
        setSelectedImages([]);
        setImagePreviews([]);
        setEditingProduct(null);
        setEditingId(null);
        setIsFormVisible(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const validateForm = useCallback(() => {
        const { name, price, category, description, stock } = newProduct;
        if (!name.trim()) return "Product name zaroori hai!";
        if (!price || parseFloat(price) <= 0) return "Valid price daaliye!";
        if (!category) return "Category select kariye!";
        if (!description.trim()) return "Description likhiye!";
        if (!stock || parseInt(stock) < 0) return "Valid stock quantity daaliye!";
        if (!editingId && selectedImages.length === 0 && imagePreviews.length === 0)
            return "Product image is important!";
        return null;
    }, [newProduct, editingId, selectedImages.length, imagePreviews.length]);

    // --- API & Fetch Logic ---

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BACKEND_URL}/products`, CONFIG);
            const fetchedProducts = res.data.products || res.data || [];
            if (Array.isArray(fetchedProducts)) {
                setProducts(fetchedProducts);
            } else {
                setProducts([]);
            }
        } catch (error) {
            toast.error("Products fetch karne mein error! Server chal raha hai?");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // --- Handlers ---

    const handleImagesChange = (files, previews) => {
        setSelectedImages(files);
        setImagePreviews(previews);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSizeChange = (e) => {
        const { value, checked } = e.target;
        setNewProduct((prev) => ({
            ...prev,
            sizes: checked
                ? [...prev.sizes, value]
                : prev.sizes.filter((s) => s !== value),
        }));
    };

    const handleColorToggle = (colorName) => {
        setNewProduct((prev) => ({
            ...prev,
            colors: prev.colors.includes(colorName)
                ? prev.colors.filter((c) => c !== colorName)
                : [...prev.colors, colorName],
        }));
    };

    const handleEdit = (product) => {
        if (!product || !product._id) return;

        setEditingProduct(product);
        setNewProduct({
            name: product.name || "",
            category: product.category || "",
            description: product.description || "",
            price: (product.price ?? 0).toString(),
            stock: (product.stock ?? 0).toString(),
            sizes: Array.isArray(product.sizes) ? product.sizes : [],
            colors: Array.isArray(product.colors) ? product.colors : [],
        });

        const existingPreviews =
            product.images?.map((img) =>
                typeof img === "string" ? img : img.url
            ) || [];
        setImagePreviews(existingPreviews);
        setSelectedImages([]);
        setEditingId(product._id);
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("name", newProduct.name.trim());
        formData.append("price", newProduct.price);
        formData.append("category", newProduct.category);
        formData.append("description", newProduct.description.trim());
        formData.append("stock", newProduct.stock);
        formData.append("sizes", JSON.stringify(newProduct.sizes));
        formData.append("colors", JSON.stringify(newProduct.colors));

        selectedImages.forEach((file) => formData.append("images", file));

        if (editingId && editingProduct) {
            // Only send existing image URLs that are currently in the preview (not deleted)
            const remainingImageUrls = imagePreviews.filter(url => typeof url === 'string');

            formData.append(
                "existingImages",
                JSON.stringify(remainingImageUrls)
            );
        }

        try {
            let res;
            const url = `${BACKEND_URL}/products${
                editingId ? `/${editingId}` : ""
            }`;
            
            if (editingId) {
                setUpdatingId(editingId);
                res = await axios.put(url, formData, CONFIG);
                toast.success(`✅ Product '${newProduct.name}' updated!`);
            } else {
                res = await axios.post(url, formData, CONFIG);
                toast.success(`➕ Product '${newProduct.name}' added!`);
            }
            
            // Re-fetch to update the product list accurately
            await fetchProducts(); 
            resetForm();
            
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Product submit karne mein error!"
            );
        } finally {
            setIsSubmitting(false);
            setUpdatingId(null);
        }
    };

    const handleDelete = (id) => {
        setConfirmDeleteId(id);
    };

    const executeDelete = async (id) => {
        const productToDelete = products.find(p => p._id === id);
        if (!productToDelete) {
             setConfirmDeleteId(null);
             return;
        }
        const name = productToDelete.name;

        try {
            await axios.delete(`${BACKEND_URL}/products/${id}`, CONFIG);
            setProducts((prev) => prev.filter((p) => p._id !== id));
            toast.success(`🗑️ Product "${name}" delete ho gaya!`);
        } catch (err) {
            toast.error("Product delete karne mein error!");
        } finally {
            setConfirmDeleteId(null);
        }
    };

    // --- Return Hook State and Handlers ---
    return {
        products,
        loading,
        isSubmitting,
        editingId,
        updatingId,
        confirmDeleteId,
        isFormVisible,
        newProduct,
        selectedImages,
        imagePreviews,
        AVAILABLE_SIZES,
        AVAILABLE_COLORS,
        setIsFormVisible,
        setConfirmDeleteId,
        setEditingId, // Exposing for ImageUploader key logic
        resetForm,
        handleImagesChange,
        handleInputChange,
        handleSizeChange,
        handleColorToggle,
        handleEdit,
        handleAdd,
        handleDelete,
        executeDelete,
    };
};