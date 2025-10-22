import React, { useContext, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ShopContext from "../api/ShopContext";

const AllProduct = () => {
  const {
    filteredProducts,
    filterCategory,
    setFilterCategory,
    sortOrder,
    setSortOrder,
    searchTerm,
  } = useContext(ShopContext);

  // Force the category to 'women' on initial render and maintain it.
  useEffect(() => {
    if (filterCategory !== "women") {
      setFilterCategory("women");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFilterCategory]); 

  // Handlers for sorting are kept as they are still needed.
  const handleSortClick = useCallback((order) => {
    setSortOrder(currentOrder =>
      currentOrder === order ? "default" : order
    );
  }, [setSortOrder]);

  // Handler for category click is no longer needed but we keep it unused 
  // to avoid deleting the line in a way that might break the original logic of context provider.
  // const handleCategoryClick = useCallback((category) => { ... }, [setFilterCategory]);

  // Styling
  const ACTIVE_COLOR_HEX = "#FF5349";
  const selectClasses =
    "py-2 px-4 rounded-lg bg-white border border-gray-300 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer w-full transition duration-300";
  const buttonClasses =
    "py-2 px-4 border text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 cursor-pointer transition duration-300 ease-in-out font-medium text-sm lg:text-base whitespace-nowrap w-full text-left";
  const activeButtonClasses = `text-white border-transparent bg-[${ACTIVE_COLOR_HEX}] hover:bg-[${ACTIVE_COLOR_HEX}]/90 shadow-md`;
  const inactiveButtonClasses = "bg-white border-gray-200 hover:bg-gray-100";
  const actionButtonClasses =
    "w-full text-sm font-bold tracking-widest uppercase py-3 rounded-none text-center border transition duration-300";
  const defaultActionStyle =
    "border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white";
    
  // Categories array is no longer needed since we are removing the filter section.

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <Navbar />

      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 w-full max-w-screen-2xl mx-auto">
        {/* Title and Search Term */}
        <h2 className="text-5xl font-semibold text-left mb-6 text-gray-900 tracking-tighter">
          Discover Women's Products
        </h2>
        {searchTerm && (
          <p className="text-left text-lg text-gray-600 mb-8">
            Results for:{" "}
            <span className="font-semibold text-gray-800 italic">
              "{searchTerm}"
            </span>
          </p>
        )}

        {/* MAIN FLEX CONTAINER */}
        <div className="lg:flex lg:gap-10">
          {/* Sidebar */}
          <aside className="mb-10 lg:mb-0 lg:w-64 lg:shrink-0">
            {/* Mobile Filters (Only show Sorting) */}
            <div className="flex flex-col gap-4 md:hidden">
              {/* Removed category select dropdown entirely */}
              
              <select
                value={sortOrder}
                onChange={(e) => handleSortClick(e.target.value)}
                className={selectClasses}
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Desktop Sidebar (Only show Sorting) */}
            <div className="hidden md:block bg-white p-6 rounded-xl shadow-lg border border-gray-100 lg:sticky lg:top-8">
              {/* Removed "Filter By Category" section entirely */}

              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                Sort By Price
              </h3>
              <div className="flex flex-col gap-2">
                {[{ label: "Price: Low to High", value: "price_asc" },
                  { label: "Price: High to Low", value: "price_desc" }].map(
                    ({ label, value }) => (
                      <button
                        key={value}
                        onClick={() => handleSortClick(value)}
                        className={`${buttonClasses} ${
                          sortOrder === value
                            ? activeButtonClasses
                            : inactiveButtonClasses
                        }`}
                      >
                        {label}
                      </button>
                    )
                  )}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <p className="text-center text-2xl text-gray-500 p-10 font-medium bg-white rounded-xl shadow-lg">
                😔 No products match your search or filter.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => {
                  const primaryImageUrl =
                    (product.images &&
                      product.images.length > 0 &&
                      product.images[0]?.url) ||
                    product.imageUrl;
                  const actionText = "VIEW PRODUCT";

                  return (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="block"
                    >
                      <div className="relative transition-transform duration-300 hover:scale-[1.02] flex flex-col h-full group overflow-hidden">
                        {/* Discount badge */}
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <span className="absolute z-10 top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                              {Math.round(
                                ((product.originalPrice - product.price) /
                                  product.originalPrice) *
                                  100
                              )}
                              % OFF
                            </span>
                          )}

                        {/* Optimized image container */}
                        <div className="w-full aspect-[3/4] overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
                          {primaryImageUrl ? (
                            <img
                              src={primaryImageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              srcSet={`
                                ${primaryImageUrl}?w=300 300w,
                                ${primaryImageUrl}?w=600 600w,
                                ${primaryImageUrl}?w=900 900w
                              `}
                              sizes="(max-width: 640px) 300px, (max-width: 1024px) 600px, 900px"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://placehold.co/384x512/f3f4f6/9ca3af?text=${product.name.substring(
                                  0,
                                  10
                                )}`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                              <span className="text-gray-400 font-medium">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col flex-1 justify-between p-4 bg-white border-t border-gray-100">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                              {product.category || "Uncategorized"}
                            </p>
                            <h3
                              className="text-lg font-semibold text-gray-900 truncate"
                              title={product.name}
                            >
                              {product.name}
                            </h3>
                          </div>

                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              {product.originalPrice &&
                                product.originalPrice > product.price && (
                                  <span className="text-base text-gray-400 line-through">
                                    PKR {product.originalPrice?.toFixed(2)}
                                  </span>
                                )}
                              <span className="text-2xl font-extrabold text-gray-900">
                                PKR {product.price?.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`${actionButtonClasses} ${defaultActionStyle} mt-4`}
                          >
                            {actionText}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
};

export default AllProduct;