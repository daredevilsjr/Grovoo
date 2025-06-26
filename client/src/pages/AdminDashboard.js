"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import axios from "axios"
import toast from "react-hot-toast"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Vegetables",
    description: "",
    stock: 0,
    unit: "kg",
    price: { mumbai: 0, delhi: 0, bangalore: 0 },
  })

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
        setShowAddProduct(false)
        setNewProduct({
          name: "",
          category: "Vegetables",
          description: "",
          stock: 0,
          unit: "kg",
          price: { mumbai: 0, delhi: 0, bangalore: 0 },
        })
        queryClient.invalidateQueries("admin-products")
      },
      onError: (error) => {
        const message = error.response?.data?.message || "Failed to add product"
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

  const handleAddProduct = (e) => {
    e.preventDefault()
    addProductMutation.mutate(newProduct)
  }

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId)
    }
  }

  const handleUpdateOrderStatus = (orderId, status) => {
    updateOrderStatusMutation.mutate({ orderId, status })
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
                    onClick={() => setShowAddProduct(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add Product
                  </button>
                </div>

                {productsLoading ? (
                  <div className="text-center py-8">
                    <div className="loading-spinner mx-auto mb-4"></div>
                    <p>Loading products...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price (Mumbai)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={product.image || "/placeholder.svg?height=40&width=40"}
                                  alt={product.name}
                                  className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.stock} {product.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{product.price.mumbai}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="text-red-600 hover:text-red-900"
                                disabled={deleteProductMutation.isLoading}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                    <option value="piece">piece</option>
                    <option value="gram">gram</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prices by City</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-600">Mumbai</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price.mumbai}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: { ...newProduct.price, mumbai: Number.parseFloat(e.target.value) },
                        })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Delhi</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price.delhi}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: { ...newProduct.price, delhi: Number.parseFloat(e.target.value) },
                        })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Bangalore</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price.bangalore}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: { ...newProduct.price, bangalore: Number.parseFloat(e.target.value) },
                        })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={addProductMutation.isLoading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {addProductMutation.isLoading ? <div className="loading-spinner"></div> : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
