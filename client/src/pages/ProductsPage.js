"use client"

import { useState } from "react"
import { useQuery } from "react-query"
import axios from "axios"
import { useAuthStore, useCartStore } from "../store/useStore"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const { user, selectedLocation } = useAuthStore()
  const { addToCart } = useCartStore()
  const navigate = useNavigate()

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery(["products", searchTerm, selectedCategory, sortBy, selectedLocation], async () => {
    const params = new URLSearchParams()
    if (searchTerm) params.append("search", searchTerm)
    if (selectedCategory !== "all") params.append("category", selectedCategory)
    if (sortBy) params.append("sort", sortBy)
    if (selectedLocation) params.append("location", selectedLocation)

    const response = await axios.get(`/api/products?${params}`)
    return response.data
  })

  const categories = ["all", "Vegetables", "Fruits", "Dairy", "Non-Veg", "Grains", "Spices", "Oils", "Beverages"]

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error("Please login to add items to cart")
      navigate("/login")
      return
    }

    addToCart(product, 1)
    toast.success(`${product.name} added to cart!`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">Error loading products. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg?height=200&width=200"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Low Stock
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Out of Stock
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{product.category}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{product.price[selectedLocation]}/{product.unit}
                  </span>
                  <span className={`text-sm ${product.stock > 10 ? "text-green-600" : "text-red-600"}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
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

        {products.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
