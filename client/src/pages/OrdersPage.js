"use client"

import { useQuery } from "react-query"
import axios from "axios"
import { useAuthStore } from "../store/useStore"
import toast from "react-hot-toast"
import { useEffect } from "react"

const OrdersPage = () => {
  const { user } = useAuthStore()

  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useQuery("user-orders", async () => {
    const response = await axios.get("/api/orders/my-orders")
    return response.data
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "shipped":
        return "bg-indigo-100 text-indigo-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return
    }

    try {
      await axios.patch(`/api/orders/${orderId}/cancel`)
      toast.success("Order cancelled successfully")
      refetch()
    } catch (error) {
      const message = error.response?.data?.message || "Failed to cancel order"
      toast.error(message)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">Error loading orders. Please try again.</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <i className="fas fa-clipboard-list text-6xl text-gray-400 mb-4"></i>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">No orders yet</h2>
          <p className="text-gray-500 mb-8">Your order history will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order._id.slice(-8)}</h3>
                  <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-600">
                    Location: {order.location.charAt(0).toUpperCase() + order.location.slice(1)}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  {order.estimatedDelivery && (
                    <p className="text-sm text-gray-600 mt-2">
                      Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product?.image || "/placeholder.svg?height=40&width=40"}
                          alt={item.product?.name || "Product"}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <span className="font-medium">{item.product?.name || "Product"}</span>
                          <span className="text-gray-600 ml-2">x {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-semibold">₹{item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-4 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>{order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {order.deliveryAddress && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <h5 className="font-medium text-sm text-gray-700">Delivery Address:</h5>
                  <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                </div>
              )}

              {order.notes && (
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <h5 className="font-medium text-sm text-blue-700">Order Notes:</h5>
                  <p className="text-sm text-blue-600">{order.notes}</p>
                </div>
              )}

              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">Order ID: {order._id}</span>
                {order.status === "pending" && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
