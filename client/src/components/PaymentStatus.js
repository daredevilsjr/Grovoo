"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

const PaymentStatus = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await axios.get(`/api/payment/status/${orderId}`)
        setOrder(response.data)
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch payment status")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchPaymentStatus()
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Checking payment status...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/orders")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getStatusIcon = (paymentStatus) => {
    switch (paymentStatus) {
      case "completed":
        return <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
      case "failed":
        return <i className="fas fa-times-circle text-6xl text-red-500 mb-4"></i>
      case "pending":
        return <i className="fas fa-clock text-6xl text-yellow-500 mb-4"></i>
      default:
        return <i className="fas fa-question-circle text-6xl text-gray-500 mb-4"></i>
    }
  }

  const getStatusMessage = (paymentStatus) => {
    switch (paymentStatus) {
      case "completed":
        return {
          title: "Payment Successful!",
          message: "Your payment has been processed successfully.",
          color: "text-green-600",
        }
      case "failed":
        return {
          title: "Payment Failed",
          message: "Your payment could not be processed. Please try again.",
          color: "text-red-600",
        }
      case "pending":
        return {
          title: "Payment Pending",
          message: "Your payment is being processed. Please wait.",
          color: "text-yellow-600",
        }
      default:
        return {
          title: "Unknown Status",
          message: "Payment status is unknown.",
          color: "text-gray-600",
        }
    }
  }

  const statusInfo = getStatusMessage(order.paymentStatus)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
            {getStatusIcon(order.paymentStatus)}
            <h1 className={`text-3xl font-bold mb-2 ${statusInfo.color}`}>{statusInfo.title}</h1>
            <p className="text-gray-600 text-lg mb-6">{statusInfo.message}</p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Order ID:</span>
                  <p className="text-gray-600">#{order._id.slice(-8)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Amount:</span>
                  <p className="text-gray-600">₹{order.total.toFixed(2)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Payment Method:</span>
                  <p className="text-gray-600 capitalize">{order.paymentMethod}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <p className={`capitalize font-medium ${statusInfo.color}`}>{order.paymentStatus}</p>
                </div>
              </div>
            </div>

            {order.razorpayPaymentId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <span className="font-medium">Payment ID:</span> {order.razorpayPaymentId}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/orders")}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <i className="fas fa-list mr-2"></i>
                View All Orders
              </button>
              <button
                onClick={() => navigate("/products")}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <i className="fas fa-shopping-bag mr-2"></i>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentStatus
