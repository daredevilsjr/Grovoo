"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useAuthStore, useCartStore, useProductsStore } from "../store/useStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ProductsPage = () => {
  const location = useLocation();
  const { category } = location.state || {};
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");

  const { user, selectedLocation } = useAuthStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();// may be undefined


  // Memoize the query key to prevent unnecessary refetches
  const queryKey = useMemo(
    () => ["products", searchTerm, selectedCategory, sortBy, selectedLocation],
    [searchTerm, selectedCategory, sortBy, selectedLocation]
  );

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery(
    queryKey,
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (sortBy) params.append("sort", sortBy);
      if (selectedLocation) params.append("location", selectedLocation);

      const response = await axios.get(`/api/products?${params}`);
      return response.data;
    },
    {
      keepPreviousData: true,
      staleTime: 1000,
    }
  );

  const categories = useMemo(
    () => [
      {
        value: "all",
        label: "All Categories",
        icon: "fas fa-th-large",
        color: "from-gray-500 to-gray-600",
      },
      {
        value: "Vegetables",
        label: "Vegetables",
        icon: "fas fa-carrot",
        color: "from-green-500 to-green-600",
      },
      {
        value: "Fruits",
        label: "Fruits",
        icon: "fas fa-apple-alt",
        color: "from-red-500 to-red-600",
      },
      {
        value: "Dairy",
        label: "Dairy",
        icon: "fas fa-cheese",
        color: "from-yellow-500 to-yellow-600",
      },
      {
        value: "Non-Veg",
        label: "Non-Veg",
        icon: "fas fa-drumstick-bite",
        color: "from-orange-500 to-orange-600",
      },
      {
        value: "Grains",
        label: "Grains",
        icon: "fas fa-seedling",
        color: "from-amber-500 to-amber-600",
      },
      {
        value: "Spices",
        label: "Spices",
        icon: "fas fa-pepper-hot",
        color: "from-red-600 to-red-700",
      },
      {
        value: "Oils",
        label: "Oils",
        icon: "fas fa-tint",
        color: "from-blue-500 to-blue-600",
      },
      {
        value: "Beverages",
        label: "Beverages",
        icon: "fas fa-coffee",
        color: "from-purple-500 to-purple-600",
      },
    ],
    []
  );

  const handleAddToCart = useCallback(
    (product) => {
      if (!user) {
        toast.error("Please login to add items to cart");
        navigate("/login");
        return;
      }

      addToCart(product, 1);
    },
    [user, addToCart, navigate]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  const getStockBadge = (stock) => {
    let baseClass = "px-3 py-1 text-sm font-semibold rounded-full";
    if (stock === 0) {
      return (
        <span className={`${baseClass} bg-red-100 text-red-800`}>
          Out of Stock
        </span>
      );
    } else if (stock <= 5) {
      return (
        <span className={`${baseClass} bg-orange-100 text-orange-800`}>
          Low Stock
        </span>
      );
    } else if (stock <= 10) {
      return (
        <span className={`${baseClass} bg-yellow-100 text-yellow-800`}>
          Limited
        </span>
      );
    } else {
      return (
        <span className={`${baseClass} bg-green-100 text-green-800`}>
          In Stock
        </span>
      );
    }
  };

  const setProducts = useProductsStore(state => state.setProducts);

  useEffect(() => {
    if (products && products.length > 0) {
      setProducts(products);
    }
  }, [products, setProducts]);

  if (isLoading && !products.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="loading-spinner-large mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Loading Products
            </h3>
            <p className="text-gray-500">
              Please wait while we fetch the latest products...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 text-center py-20">
          <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
            <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-6"></i>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't load the products. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              <i className="fas fa-refresh mr-2"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover fresh, high-quality ingredients for your restaurant
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Search Products
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="form-input pl-12 w-full"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="form-input"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price">Price (Low to High)</option>
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                View
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-300 ${viewMode === "grid"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <i className="fas fa-th mr-2"></i>
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-300 ${viewMode === "list"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  <i className="fas fa-list mr-2"></i>
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`group flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-1 ${selectedCategory === category.value
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:shadow-lg"
                  }`}
              >
                <i
                  className={`${category.icon} ${selectedCategory === category.value
                    ? "text-white"
                    : "text-gray-500"
                    }`}
                ></i>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading indicator for search */}
        {isLoading && products.length > 0 && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-6 py-3 bg-blue-50 rounded-2xl border border-blue-200">
              <div className="loading-spinner mr-3"></div>
              <span className="text-blue-600 font-semibold">
                Searching products...
              </span>
            </div>
          </div>
        )}

        {/* Products Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div
                key={product._id}
                className={`bg-white rounded-3xl shadow-lg overflow-hidden card-hover border border-gray-100 stagger-item`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={
                      product.image || "/placeholder.svg?height=250&width=250"
                    }
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  {product.stock > 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-white text-gray-800 px-6 py-3 rounded-2xl font-semibold shadow-lg transform scale-90 hover:scale-100 transition-all duration-300"
                      >
                        <i className="fas fa-cart-plus mr-2"></i>
                        Quick Add
                      </button>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* Stock & Category moved here */}
                  <div className="flex justify-between items-center mb-2">
                    <div>{getStockBadge(product.stock)}</div>
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                        ₹{product.price[selectedLocation]}
                      </span>
                      <span className="text-gray-500 text-sm">
                        /{product.unit}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-semibold ${product.stock > 10
                        ? "text-green-600"
                        : "text-orange-600"
                        }`}
                    >
                      {product.stock} {product.unit} left
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full py-3 px-4 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-1 ${product.stock === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "btn-primary"
                      }`}
                  >
                    {product.stock === 0 ? (
                      <>
                        <i className="fas fa-times-circle mr-2"></i>
                        Out of Stock
                      </>
                    ) : (
                      <>
                        <i className="fas fa-cart-plus mr-2"></i>
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <div
                key={product._id}
                className={`bg-white rounded-3xl shadow-lg p-6 card-hover border border-gray-100 stagger-item`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center space-x-6">
                  <img
                    src={
                      product.image || "/placeholder.svg?height=120&width=120"
                    }
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-2xl"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-xl text-gray-800">
                        {product.name}
                      </h3>
                      <div className="flex space-x-2">
                        {getStockBadge(product.stock)}
                        <span className="badge bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                            ₹{product.price[selectedLocation]}
                          </span>
                          <span className="text-gray-500 text-sm">
                            /{product.unit}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-semibold ${product.stock > 10
                            ? "text-green-600"
                            : "text-orange-600"
                            }`}
                        >
                          {product.stock} {product.unit} left
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`py-2 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:-translate-y-1 ${product.stock === 0
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "btn-primary"
                          }`}
                      >
                        {product.stock === 0 ? (
                          <>
                            <i className="fas fa-times-circle mr-2"></i>
                            Out of Stock
                          </>
                        ) : (
                          <>
                            <i className="fas fa-cart-plus mr-2"></i>
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Products Found */}
        {products.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <i className="fas fa-search text-6xl text-gray-400 mb-6"></i>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? `No products match "${searchTerm}". Try adjusting your search.`
                  : "Try adjusting your filters or search criteria"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="btn-primary"
                >
                  <i className="fas fa-times mr-2"></i>
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results Count */}
        {products.length > 0 && (
          <div className="text-center mt-12 py-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-bold text-blue-600">{products.length}</span>{" "}
              products
              {searchTerm && (
                <span>
                  {" "}
                  for "<span className="font-semibold">{searchTerm}</span>"
                </span>
              )}
              {selectedCategory !== "all" && (
                <span>
                  {" "}
                  in <span className="font-semibold">{selectedCategory}</span>
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
