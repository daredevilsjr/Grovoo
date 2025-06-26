"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery } from "react-query"
import axios from "axios"

const OrderConfirmationPage = () => {
  const { orderId } = useParams()
  const [showConfetti, setShowConfetti] = useState(true)

  const {
    data: order,
    isLoading,
    error,
  } = useQuery(
    ["order", orderId],
    async () => {
      const response = await axios.get(`/api/orders/${orderId}`)
      return response.data
    },
    {
      enabled: !!orderId,
    },
  )

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
            <Link to="/orders" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute top-1/4 left-1/4 text-6xl animate-bounce">🎉</div>
          <div className="absolute top-1/3 right-1/4 text-4xl animate-pulse">✨</div>
          <div className="absolute top-1/2 left-1/3 text-5xl animate-bounce delay-100">🎊</div>
          <div className="absolute top-1/4 right-1/3 text-3xl animate-pulse delay-200">⭐</div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check text-3xl text-green-600"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 text-lg mb-4">
              Thank you for your order. We've received it and will start preparing it soon.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">Order ID: #{order._id.slice(-8)}</p>
              <p className="text-green-700 text-sm">
                Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()} by 6 PM
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>

            <div className="space-y-4 mb-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                  <img
                    src={item.product?.image || "/placeholder.svg?height=60&width=60"}
                    alt={item.product?.name || "Product"}
                    className="w-15 h-15 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product?.name || "Product"}</h4>
                    <p className="text-gray-600 text-sm">
                      ₹{item.price}/{item.product?.unit} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold">₹{item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (GST):</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>{order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total Paid:</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Address:</span>
                <p className="text-gray-600">{order.deliveryAddress}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Location:</span>
                <p className="text-gray-600">{order.location.charAt(0).toUpperCase() + order.location.slice(1)}</p>
              </div>
              {order.notes && (
                <div>
                  <span className="font-medium text-gray-700">Notes:</span>
                  <p className="text-gray-600">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/orders"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              <i className="fas fa-list mr-2"></i>
              View All Orders
            </Link>
            <Link
              to="/products"
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors text-center font-medium"
            >
              <i className="fas fa-shopping-bag mr-2"></i>
              Continue Shopping
            </Link>
          </div>

          {/* Support Info */}
          <div className="bg-blue-50 rounded-lg p-6 mt-8 text-center">
            <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
            <p className="text-blue-700 text-sm mb-3">
              If you have any questions about your order, feel free to contact us.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <span className="text-blue-600">
                <i className="fas fa-phone mr-1"></i>
                +91 98765 43210
              </span>
              <span className="text-blue-600">
                <i className="fas fa-envelope mr-1"></i>
                support@freshmart.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage
