// File: src/api/updateStock.js

export async function updateStock(items) {
  // Validate items array
  if (!Array.isArray(items) || items.length === 0) {
    console.error("Invalid items array:", items);
    throw new Error("No valid items provided for stock update");
  }

  // Validate and filter items
  const validatedItems = items.map(item => ({
    productId: item.productId,
    size: item.size || null,
    color: item.color || null,
    quantity: Number(item.quantity),
  })).filter(item => {
    const isValid =
      item.productId &&
      /^[a-fA-F0-9]{24}$/.test(item.productId) && // Validate MongoDB ObjectId
      typeof item.quantity === "number" &&
      item.quantity > 0;
    if (!isValid) {
      console.warn("Invalid item skipped:", item);
    }
    return isValid;
  });

  if (validatedItems.length === 0) {
    console.error("No valid items to update stock");
    throw new Error("No valid items to update stock");
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/standard/update-stock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: validatedItems }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      console.error(`Failed to update stock: ${data.message || "Unknown error"}`);
      throw new Error(data.message || "Stock update failed");
    }

    console.log("Stock updated successfully:", data);
    return data;
  } catch (err) {
    console.error("Error updating stock:", err);
    throw err;
  }
}