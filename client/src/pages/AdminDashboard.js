"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import axios from "axios"
import toast from "react-hot-toast"
import { useUIStore } from "../store/useStore"
import ImageUpload from "../components/ImageUpload"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Vegetables",
    description: "",
    stock: 0,
    unit: "kg",
    price: { mumbai: 0, delhi: 0, bangalore: 0 },
    image: "",
    imagePublicId: "",
  })

  const { showAddProductModal, setShowAddProductModal } = useUIStore()
  const queryClient = useQueryClient()

  // Fetch dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery("admin-dashboard", async () => {
    const response = await axios.get("/api/admin/dashboard")
    return response.data
  })

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery("admin-products", async () => {
    const response = await axios.get("/api/products")
    return response.data
  })

  // Fetch orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery("admin-orders", async () => {
    const response = await axios.get("/api/admin/orders")
    return response.data
  })

  // Add product mutation
  const addProductMutation = useMutation(
    async (productData) => {
      const response = await axios.post("/api/products", productData)
      return response.data
    },
    {
      onSuccess: () => {
        toast.success("Product added successfully!")
        setShowAddProductModal(false)
        resetProductForm()
        queryClient.invalidateQueries("admin-products")
      },
      onError: (error) => {
        const message = error.response?.data?.message || "Failed to add product"
        toast.error(message)
      },
    },
  )

  // Update product mutation
  const updateProductMutation = useMutation(
    async ({ productId, productData }) => {
      const response = await axios.put(`/api/products/${productId}`, productData)
      return response.data
    },
    {
      onSuccess: () => {
        toast.success("Product updated successfully!")
        setEditingProduct(null)
        resetProductForm()
        queryClient.invalidateQueries("admin-products")
      },
      onError: (error) => {
        const message = error.response?.data?.message || "Failed to update product"
        toast.error(message)
      },
    },
  )

  // Delete product mutation
  const deleteProductMutation = useMutation(
    async (productId) => {
      await axios.delete(`/api/products/${productId}`)
    },
    {
      onSuccess: () => {
        toast.success("Product deleted successfully!")
        queryClient.invalidateQueries("admin-products")
      },
      onError: (error) => {
        const message = error.response?.data?.message || "Failed to delete product"
        toast.error(message)
      },
    },
  )

  // Update order status mutation
  const updateOrderStatusMutation = useMutation(
    async ({ orderId, status }) => {
      const response = await axios.patch(`/api/admin/orders/${orderId}/status`, { status })
      return response.data
    },
    {
      onSuccess: () => {
        toast.success("Order status updated!")
        queryClient.invalidateQueries("admin-orders")
      },
      onError: (error) => {
        const message = error.response?.data?.message || "Failed to update order status"
        toast.error(message)
      },
    },
  )

  const resetProductForm = () => {
    setNewProduct({
      name: "",
      category: "Vegetables",
      description: "",
      stock: 0,
      unit: "kg",
      price: { mumbai: 0, delhi: 0, bangalore: 0 },
      image: "",
      imagePublicId: "",
    })
  }

  const handleAddProduct = (e) => {
    e.preventDefault()

    if (!newProduct.image) {
      toast.error("Please upload a product image")
      return
    }

    addProductMutation.mutate(newProduct)
  }

  const handleUpdateProduct = (e) => {
    e.preventDefault()

    if (!newProduct.image) {
      toast.error("Please upload a product image")
      return
    }

    updateProductMutation.mutate({
      productId: editingProduct._id,
      productData: newProduct,
    })
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.name,
      category: product.category,
      description: product.description,
      stock: product.stock,
      unit: product.unit,
      price: { ...product.price },
      image: product.image,
      imagePublicId: product.imagePublicId || "",
    })
    setShowAddProductModal(true)
  }

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId)
    }
  }

  const handleUpdateOrderStatus = (orderId, status) => {
    updateOrderStatusMutation.mutate({ orderId, status })
  }

  const handleImageUpload = (imageUrl, publicId) => {
    setNewProduct({
      ...newProduct,
      image: imageUrl || "",
      imagePublicId: publicId || "",
    })
  }

  const handleCloseModal = () => {
    setShowAddProductModal(false)
    setEditingProduct(null)
    resetProductForm()
  }

  const categories = ["Vegetables", "Fruits", "Dairy", "Non-Veg", "Grains", "Spices", "Oils", "Beverages"]
  const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]

  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        {dashboardData && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-rupee-sign text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{dashboardData.stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-shopping-bag text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{dashboardData.stats.totalOrders}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-box text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold">{dashboardData.stats.totalProducts}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{dashboardData.stats.totalUsers}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "dashboard"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "products"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "orders"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Orders
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "dashboard" && dashboardData && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
                <div className="space-y-4">
                  {dashboardData.recentOrders.map((order) => (
                    <div key={order._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Order #{order._id.slice(-8)}</h3>
                          <p className="text-gray-600">Customer: {order.user?.name}</p>
                          <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-gray-600">Location: {order.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "products" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Product Management</h2>
                  <button
                    onClick={() => {
                      setEditingProduct(null)
                      resetProductForm()
                      setShowAddProductModal(true)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add Product
                  </button>
                </div>

                {productsLoading ? (
                  <div className="text-center py-8">
                    <div className="loading-spinner mx-auto mb-4"></div>
                    <p>Loading products...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <div key={product._id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
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
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {product.category}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-lg font-bold text-green-600">₹{product.price.mumbai}</span>
                            <span className={`text-sm ${product.stock > 10 ? "text-green-600" : "text-red-600"}`}>
                              {product.stock} {product.unit}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-medium py-2 px-3 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                              disabled={updateProductMutation.isLoading}
                            >
                              <i className="fas fa-edit mr-1"></i>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="flex-1 text-red-600 hover:text-red-800 text-sm font-medium py-2 px-3 border border-red-600 rounded hover:bg-red-50 transition-colors"
                              disabled={deleteProductMutation.isLoading}
                            >
                              <i className="fas fa-trash mr-1"></i>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Order Management</h2>
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="loading-spinner mx-auto mb-4"></div>
                    <p>Loading orders...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ordersData?.orders?.map((order) => (
                      <div key={order._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold">Order #{order._id.slice(-8)}</h3>
                            <p className="text-gray-600">Customer: {order.user?.name}</p>
                            <p className="text-gray-600">Email: {order.user?.email}</p>
                            <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p className="text-gray-600">Location: {order.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className="mt-2 px-2 py-1 border rounded text-sm"
                              disabled={updateOrderStatusMutation.isLoading}
                            >
                              {orderStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Items: {order.items?.length || 0}</p>
                          {order.deliveryAddress && <p>Address: {order.deliveryAddress}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-6">
                {/* Image Upload */}
                <ImageUpload onImageUpload={handleImageUpload} currentImage={newProduct.image} />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter product description"
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter stock quantity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                    <select
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="liter">Liter</option>
                      <option value="piece">Piece</option>
                      <option value="gram">Gram</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prices by City *</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Mumbai (₹)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={newProduct.price.mumbai}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: { ...newProduct.price, mumbai: Number.parseFloat(e.target.value) },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Delhi (₹)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={newProduct.price.delhi}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: { ...newProduct.price, delhi: Number.parseFloat(e.target.value) },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Bangalore (₹)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={newProduct.price.bangalore}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: { ...newProduct.price, bangalore: Number.parseFloat(e.target.value) },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={
                      (editingProduct ? updateProductMutation.isLoading : addProductMutation.isLoading) ||
                      !newProduct.image
                    }
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
                  >
                    {editingProduct ? (
                      updateProductMutation.isLoading ? (
                        <>
                          <div className="loading-spinner mr-2"></div>
                          Updating Product...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          Update Product
                        </>
                      )
                    ) : addProductMutation.isLoading ? (
                      <>
                        <div className="loading-spinner mr-2"></div>
                        Adding Product...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus mr-2"></i>
                        Add Product
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
