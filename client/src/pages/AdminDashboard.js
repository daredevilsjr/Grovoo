"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import axios from "axios"
import toast from "react-hot-toast"
import { useUIStore } from "../store/useStore"
import ImageUpload from "../components/ImageUpload"
import { User, Phone, Mail, MapPin, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { useAuthStore } from "../store/useStore"

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("dashboard")
  const [editingProduct, setEditingProduct] = useState(null)
  const [cancelRequests, setCancelRequests] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Vegetables",
    description: "",
    stock: 0,
    unit: "kg",
    price: { patna: 0 },
    image: "",
    imagePublicId: "",
  })

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.patch(`/api/admin/orders/${orderId}/cancel`);
      if (response.data.success) {
        toast.success(`Order ${orderId} Cancelled.`)
        queryClient.invalidateQueries("admin-orders")
        return;
      }
    }
    catch (err) {
      console.log(err);
      toast.error(`Some Error Occurred.`);
    }
    return;
  }
  const handleGetCancelRequests = async () => {
    try {
      const response = await axios.get("/api/admin/agents/cancel-requests");
      if (response.data.success) {
        setCancelRequests(response.data.orders);
        return;
      }
    } catch (err) {
      toast.error(`Some Error Occurred.`);
    }
    return;
  }

  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await axios.patch(`/api/admin/orders/${orderId}/confirm`);
      if (response.data.success) {
        toast.success(`Order ${orderId} Confirmed.`)
        queryClient.invalidateQueries("admin-orders")
        return;
      }
    } catch (err) {
      toast.error(`Some Error Occurred.`);
    }
    return;
  }

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
        console.log(error);
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
      price: { patna: 0 },
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
  const getStatusIcon = (status) => {
    switch (status) {
      case true:
        return <CheckCircle className="h-4 w-4" />
      case false:
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }
  const getStatusColor = (status) => {
    switch (status) {
      case true:
        return "text-green-600 bg-green-50"
      case false:
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getAgentsData = async () => {
    setAgentsLoading(true)
    const response = await axios.get("/api/admin/agents");
    if (response.data.success) {
      let Agents = [];
      console.log(response.data.agents, typeof response.data.agents)
      for (const agent of response.data.agents) {
        Agents.push({
          ...agent.user,
          id: agent._id,
          agentVerified: agent.agentVerified,
          vehicleDetails: agent.vehicleDetails,
        });
      }
      // console.log(Agents);
      setAgentsData(Agents);
      setAgentsLoading(false);
      return;
    }
    console.log(response.data.message);
    setAgentsLoading(false);
    return;
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage("");
  };
  const [adminData, setAdminData] = useState([]);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const getAdminData = async () => {
    setIsAdminLoading(true);
    try {
      const response = await axios.get('/api/auth/admin-data');
      if (response.data.success) {
        setAdminData(response.data.adminData);
        setIsAdminLoading(false);
        return;
      }
    } catch (err) {
      toast.error("Some error occurred");
    } finally {
      setIsAdminLoading(false);
    }
  }
  const handleUpdateAdminStatus = async (id, status) => {
    await axios.patch(`/api/auth/admin/${id}/status`, { status });
    getAdminData();
  }


  const handleUpdateAgentStatus = async (agentId, newStatus) => {
    setUpdateAgentStatusLoading(true)
    let response;
    if (newStatus == "verified") {
      response = await axios.patch(`/api/admin/agents/${agentId}/verify`);
    }
    else {
      response = await axios.patch(`/api/admin/agents/${agentId}/reject`);
    }
    if (response.data.success) {
      toast.success(`Agent ${agentId} ${newStatus} successfully.`)
    } else {
      toast.error(`Agent Status update failed.`);
    }
  }
  const [agentsLoading, setAgentsLoading] = useState(false)
  const [updateAgentStatusLoading, setUpdateAgentStatusLoading] = useState(false)
  const [agentsData, setAgentsData] = useState([])

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
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "dashboard"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "products"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "orders"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                Orders
              </button>
              <button
                onClick={() => {
                  handleGetCancelRequests();
                  setActiveTab("cancel");
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "cancel"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                Cancellation Requests
              </button>
              <button
                onClick={() => {
                  getAgentsData();
                  setActiveTab("Delivery Agents");
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "Delivery Agents"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                Delivery Agents
              </button>
              {user?.role === "owner" && (<button
                onClick={() => {
                  getAdminData();
                  setActiveTab("Admins");
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "Admins"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                Admins
              </button>)}
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
                          <p className="text-gray-600">Email: {order.user?.email}</p>
                          <p className="text-gray-600">Phone: {order.user?.phone}</p>
                          <p className="text-gray-600">Address: {order.user?.address}</p>
                          <p className="text-gray-600">Gstin: {order.user?.gstin}</p>
                          <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                          <p className="text-gray-600">Location: {order.location}</p>
                        </div>
                        <div>
                          <p className="font-medium mb-2">Order Items</p>
                          <div className="space-y-2">
                            {order?.items?.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="truncate pr-2">
                                  {item.product.name} × {item.quantity}
                                </span>
                                <span className="font-medium flex-shrink-0">₹{item.total}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                          <span
                            className={`px-2 py-1 rounded text-sm ${order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                              }`}
                          >
                            {order.status}
                          </span>
                          {order.status === "confirmed" && (
                            order?.confirmationOtp && (<p className="font-semibold">Confirmation Otp: {order?.confirmationOtp}</p>)
                          )}
                          {order.status === "cancelled" && (
                            <p className="font-semibold">Payment Status: {order?.paymentStatus}</p>
                          )}
                          {order.deliveryAgent && (
                            <>
                              <p>Delivery Agent Details</p>
                              <p className="font-semibold">{order?.deliveryAgent?.user.name}</p>
                              <p className="font-semibold">{order?.deliveryAgent?.user.phone}</p>
                              <p className="font-semibold">{order?.deliveryAgent?.vehicleDetails.vehicleNumber}</p>
                            </>
                          )}
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
                            <span className="text-lg font-bold text-green-600">₹{product.price.patna}</span>
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
                            <p className="text-gray-600">Phone: {order.user?.phone}</p>
                            <p className="text-gray-600">Address: {order.user?.address}</p>
                            <p className="text-gray-600">Gstin: {order.user?.gstin}</p>
                            <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                            <p className="text-gray-600">Location: {order.location}</p>
                            <p className="text-gray-600">Notes: {order.notes}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-2">Order Items</p>
                            <div className="space-y-2">
                              {order?.items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                  <span className="truncate pr-2">
                                    {item.product.name} × {item.quantity}
                                  </span>
                                  <span className="font-medium flex-shrink-0">₹{item.total}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                            {/* <select
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
                            </select> */}
                            <div className="flex gap-3 mt-4 pt-4 border-t">
                              <h3 className={`flex items-center gap-2 px-4 py-2 ${order.status === "confirmed" || order.status === "delivered" ? "bg-green-600" : "bg-red-600"} text-white rounded-lg transition-colors`}>{order.status}</h3>
                              {order.status === "pending" && (<button
                                onClick={() => handleConfirmOrder(order._id)}
                                className="flex items-center gap-2 px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                disabled={updateAgentStatusLoading}
                              >
                                <CheckCircle className="h-3 w-3" />
                                Confirm Order
                              </button>)}
                              {order.status !== "delivered" && order.status !== "cancelled" && (<button

                                onClick={() => handleCancelOrder(order._id)}
                                className="flex items-center gap-2 px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                disabled={updateAgentStatusLoading}
                              >
                                <XCircle className="h-3 w-3" />
                                Cancel Order
                              </button>)}
                            </div>
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
            {activeTab === "cancel" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Order Management</h2>
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="loading-spinner mx-auto mb-4"></div>
                    <p>Loading orders...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cancelRequests?.length > 0 && cancelRequests.map((order) => (
                      <div key={order._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold">Order #{order._id.slice(-8)}</h3>
                            <p className="text-gray-600">Customer: {order.user?.name}</p>
                            <p className="text-gray-600">Email: {order.user?.email}</p>
                            <p className="text-gray-600">Phone: {order.user?.phone}</p>
                            <p className="text-gray-600">Address: {order.user?.address}</p>
                            <p className="text-gray-600">Gstin: {order.user?.gstin}</p>
                            <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                            <p className="text-gray-600">Location: {order.location}</p>
                            <p className="text-gray-600">Notes: {order.notes}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-2">Order Items</p>
                            <div className="space-y-2">
                              {order?.items?.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                  <span className="truncate pr-2">
                                    {item.product.name} × {item.quantity}
                                  </span>
                                  <span className="font-medium flex-shrink-0">₹{item.total}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{order.total.toFixed(2)}</p>

                            <div className="flex gap-3 mt-4 pt-4 border-t">
                              <h3 className={`flex items-center gap-2 px-4 py-2 ${order.status === "confirmed" || order.status === "delivered" ? "bg-green-600" : "bg-red-600"} text-white rounded-lg transition-colors`}>{order.status}</h3>
                              <p className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg transition-colors`}>{order.cancellation.reason ? order.cancellation.reason : "User Unavailable"}</p>

                              {order.status === "pending" && (<button
                                onClick={() => handleConfirmOrder(order._id)}
                                className="flex items-center gap-2 px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                disabled={updateAgentStatusLoading}
                              >
                                <CheckCircle className="h-3 w-3" />
                                Confirm Order
                              </button>)}
                              {order.status !== "delivered" && order.status !== "cancelled" && (<button

                                onClick={() => handleCancelOrder(order._id)}
                                className="flex items-center gap-2 px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                disabled={updateAgentStatusLoading}
                              >
                                <XCircle className="h-3 w-3" />
                                Cancel Order
                              </button>)}
                            </div>
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

            {activeTab === "Delivery Agents" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Delivery Agent Management</h2>
                {agentsLoading ? (
                  <div className="text-center py-8">
                    <div className="loading-spinner mx-auto mb-4"></div>
                    <p>Loading delivery agents...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {agentsData?.map((agent) => (
                      <div key={agent._id} className="border rounded-lg p-6 bg-white shadow-sm">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Agent Profile Section */}
                          <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                              {/* <img
                                src={agent.profileImage || "/placeholder.svg"}
                                alt={`${agent.name} profile`}
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                              /> */}
                              <div className="flex-1">
                                <div className="flex items-start mb-2">
                                  <div>
                                    <h3 className="font-semibold text-lg">Agent #{agent._id}</h3>
                                    <p className="text-gray-800 font-medium">{agent.name}</p>
                                  </div>
                                  <div className="text-center pr-2 pl-2">
                                    <div
                                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.agentVerified)}`}
                                    >
                                      {getStatusIcon(agent.agentVerified)}
                                      {agent.agentVerified ? "Verified" : "Verifiaction Pending"}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>{agent.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{agent.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{agent.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>Address: {agent.address}</span>
                                  </div>
                                </div>

                                <div className="mt-3 text-sm text-gray-600">
                                  <p>Joined: {new Date(agent.createdAt).toLocaleDateString('en-GB')}</p>
                                  <p>Rating: ⭐ {agent.rating}/5</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Vehicle Information Section */}
                          <div className="lg:w-80">
                            <div className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center gap-2 mb-3">
                                <Truck className="h-5 w-5 text-gray-600" />
                                <h4 className="font-medium">Vehicle Information</h4>
                              </div>

                              <img
                                src={agent.vehicleDetails.vehicleImage || "/placeholder.svg"}
                                alt={`${agent.name}`}
                                className="w-full h-32 object-cover rounded-lg mb-3 border"
                                onClick={() => openImageModal(agent.vehicleDetails.vehicleImage)}
                              />
                              {isModalOpen && (
                                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={closeModal}>
                                  <img src={modalImage} alt="Vehicle" className="max-w-full max-h-full rounded-lg" />
                                </div>
                              )}

                              <div className="space-y-2 text-sm">
                                {/* <div className="flex justify-between">
                                  <span className="text-gray-600">Type:</span>
                                  <span className="font-medium">{agent.}</span>
                                </div> */}
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Number:</span>
                                  <span className="font-medium">{agent.vehicleDetails.vehicleNumber}</span>
                                </div>
                                {/* <div className="flex justify-between">
                                  <span className="text-gray-600">License:</span>
                                  <span className="font-medium">{agent.licenseNumber}</span>
                                </div> */}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {!agent.agentVerified && (
                          <div className="flex gap-3 mt-4 pt-4 border-t">
                            <button
                              onClick={() => handleUpdateAgentStatus(agent.id, "verified")}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              disabled={updateAgentStatusLoading}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Verify Agent
                            </button>
                            <button
                              onClick={() => handleUpdateAgentStatus(agent.id, "rejected")}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              disabled={updateAgentStatusLoading}
                            >
                              <XCircle className="h-4 w-4" />
                              Reject Agent
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {user?.role === "owner" && activeTab === "Admins" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Delivery Agent Management</h2>
                {isAdminLoading ? (
                  <div className="text-center py-8">
                    <div className="loading-spinner mx-auto mb-4"></div>
                    <p>Loading Admin data...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {adminData?.map((admin) => (
                      <div key={admin._id} className="border rounded-lg p-6 bg-white shadow-sm">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Agent Profile Section */}
                          <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                              {/* <img
                                src={agent.profileImage || "/placeholder.svg"}
                                alt={`${agent.name} profile`}
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                              /> */}
                              <div className="flex-1">
                                <div className="flex items-start mb-2">
                                  <div>
                                    <h3 className="font-semibold text-lg">Agent #{admin._id}</h3>
                                    <p className="text-gray-800 font-medium">{admin.name}</p>
                                  </div>
                                  <div className="text-center pr-2 pl-2">
                                    <div
                                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(admin.adminVerificationStatus)}`}
                                    >
                                      {getStatusIcon(admin.adminVerificationStatus)}
                                      {admin.adminVerificationStatus ? "Verified" : "Verifiaction Pending"}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>{admin.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{admin.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{admin.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>Address: {admin.address}</span>
                                  </div>
                                </div>

                                <div className="mt-3 text-sm text-gray-600">
                                  <p>Joined: {new Date(admin.createdAt).toLocaleDateString('en-GB')}</p>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {!admin.adminVerificationStatus && (
                          <div className="flex gap-3 mt-4 pt-4 border-t">
                            <button
                              onClick={() => handleUpdateAdminStatus(admin._id, true)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              disabled={updateAgentStatusLoading}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Verify Admin
                            </button>
                            <button
                              onClick={() => handleUpdateAdminStatus(admin._id, false)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              disabled={updateAgentStatusLoading}
                            >
                              <XCircle className="h-4 w-4" />
                              Reject Admin
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
            }
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
                      <option value="packet">Packet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prices by City *</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">patna (₹)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={newProduct.price.patna}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: { ...newProduct.price, patna: Number.parseFloat(e.target.value) },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    {/* <div>
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
                    </div> */}
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
