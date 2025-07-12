"use client"

import { useEffect, useState } from "react"
import { Package, MapPin, Clock, DollarSign, User, Phone, CheckCircle, X } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [refetch, setRefetch] = useState(0);
  const [acceptedOrders, setAcceptedOrders] = useState([])
  const [deliveredOrders, setDeliveredOrders] = useState([])
  const [activeTab, setActiveTab] = useState("active")

  const handleAcceptOrder = async (orderId) => {
    const orderToAccept = orders.find((order) => order._id === orderId)
    if (orderToAccept) {
      const response = await axios.patch(`/api/agent/${orderId}/accept`);
      if (response.data.success) {
        setRefetch(1);
        toast.success("Order accepted successfully!")
        return;
      }
      toast.error("Some error occured");
    }
  }
  const [otp, setOtp] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const handleMarkAsDelivered = async (orderId) => {
    setIsVerifying(true);
    const orderToDeliver = acceptedOrders.find((order) => order._id === orderId)
    const deliveryOtp = otp;
    if (orderToDeliver && deliveryOtp) {
      const response = await axios.post(`/api/agent/${orderId}/deliver`, { deliveryOtp });
      if (response.data.success) {
        setRefetch(1);
        toast.success("Order marked as delivered successfully!")
        return;
      }
      toast.error("Some error occured");
    }
    setIsVerifying(false);
  }
  const handleRequestCancellation = async (orderId) => {
    setIsVerifying(true);
    const orderToDeliver = acceptedOrders.find((order) => order._id === orderId)
    if (orderToDeliver) {
      const response = await axios.post(`/api/agent/${orderId}/request-cancel`, { message: cancellationReason });
      if (response.data.success) {
        setRefetch(1);
        toast.success("Requested Order Cancellation")
        return;
      }
      toast.error("Some error occured");
    }
    setIsVerifying(false);
  }

  useEffect(() => {
    const getAvailableOrders = async () => {
      try {
        const response = await axios.post("/api/orders/available-orders/")
        if (response.data.success) {
          setOrders(response.data.orders)
          return
        }
      } catch (err) {
        console.log(err)
        toast.error("Error fetching orders. Please refresh.")
      }
      return
    }
    getAvailableOrders()
  }, [refetch])

  useEffect(() => {
    const getAvailableOrders = async () => {
      try {
        const response = await axios.get("/api/agent/my-orders/")
        if (response.data.success) {
          setAcceptedOrders(response.data.ordersAccepted)
          setDeliveredOrders(response.data.ordersDelivered)
          return
        }
      } catch (err) {
        console.log(err)
        toast.error("Error fetching orders. Please refresh.")
      }
      return
    }
    getAvailableOrders()
  }, [refetch])

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  // useEffect(() => {
  //   console.log(orders, typeof orders);
  //   console.log(acceptedOrders, typeof acceptedOrders);
  // }, [orders, acceptedOrders]);
  const getTimeAgo = (date) => {
    const minutes = Math.floor((Date.now() - new Date(date)) / (1000 * 60))
    if (minutes < 1) return "Just now"
    if (minutes === 1) return "1 minute ago"
    return `${minutes} minutes ago`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentMethodColor = (method) => {
    return method === "cod" ? "bg-orange-100 text-orange-800" : "bg-purple-100 text-purple-800"
  }

  const renderOrderCard = (order, status = "active") => (

    <div
      key={order?._id}
      className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">Order #{order?._id}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 text-sm text-gray-600 space-y-1 sm:space-y-0">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{getTimeAgo(order?.createdAt)}</span>
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{order?.location}</span>
              </span>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col lg:flex-row space-x-2 sm:space-x-0 sm:space-y-2 lg:space-y-0 lg:space-x-2 flex-shrink-0">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(status === "active" ? order?.status : "accepted")}`}
            >
              {status === "active" ? order?.status : "Accepted"}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPaymentMethodColor(order?.paymentMethod)}`}
            >
              {order?.paymentMethod}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        {/* Customer Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <User className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{order?.user.name}</p>
              <p className="text-sm text-gray-500 flex items-center">
                <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{order?.user.phone}</span>
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right flex-shrink-0">
            <p className="text-sm text-gray-500">Estimated Delivery</p>
            <p className="font-medium">{order.estimatedDelivery ? formatTime(order?.estimatedDelivery) : "Delivered"}</p>
          </div>
        </div>
        {/* Delivery Address */}
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium">Delivery Address</p>
            <p className="text-gray-600 break-words">{order?.deliveryAddress}</p>
            {order?.notes && <p className="text-sm text-blue-600 mt-1 break-words">Note: {order?.notes}</p>}
          </div>
        </div>
        {/* Order Items */}
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
        <div className="border-t border-gray-200 pt-4">
          {/* Order Summary */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order?.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{order?.tax}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{order?.deliveryFee}</span>
            </div>
            <div className="border-t border-gray-200 pt-1">
              <div className="flex justify-between font-medium text-base">
                <span>Total</span>
                <span className="flex items-center">
                  <p className="h-4 w-4 mr-1" >₹{order?.total}</p>
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Accept Button */}
        {status === "active" && (
          <button
            onClick={() => handleAcceptOrder(order?._id)}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Accept Order
          </button>
        )}
        {status === "accepted" && (
          <div>
            {/* First row: OTP and Mark As Delivered */}
            <div className="flex space-x-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter verification OTP sent to Customer
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isVerifying}
                  required
                  placeholder="Enter OTP Code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                />
              </div>
              <button
                onClick={() => handleMarkAsDelivered(order?._id)}
                className="bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark As Delivered
              </button>
            </div>

            {/* Second row: Request Cancellation and Cancellation Reason */}
            <div className="flex space-x-4">
              <button
                onClick={() => handleRequestCancellation(order?._id)}
                className="bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
              >
                <X className="h-4 w-4 mr-2" />
                Request Cancellation
              </button>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cancellation Reason
                </label>
                <input
                  type="text"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Enter cancellation reason"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  )

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1 text-sm">Manage your delivery orders</p>
          </div>
          <div className="flex space-x-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{orders.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Accepted</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{acceptedOrders?.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-4 sm:px-6">
              <button
                onClick={() => setActiveTab("active")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "active"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Active Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab("accepted")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "accepted"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Accepted Orders ({acceptedOrders.length})
              </button>
              <button
                onClick={() => setActiveTab("delivered")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "delivered"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                Delivered Orders ({deliveredOrders.length})
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "active" && (
              // Active Orders Tab
              <>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No active orders</h3>
                    <p className="text-gray-500">Check back later for new delivery opportunities</p>
                  </div>
                ) : (
                  <div className="space-y-4">{orders.map((order) => renderOrderCard(order, "active"))}</div>
                )}
              </>
            )}
            {activeTab === "accepted" &&
              (
                // Accepted Orders Tab
                <>
                  {acceptedOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No accepted orders</h3>
                      <p className="text-gray-500">Accept orders from the active tab to see them here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">{acceptedOrders.map((order) => renderOrderCard(order, "accepted"))}</div>
                  )}
                </>
              )}
            {
              activeTab === "delivered" &&
              (
                // Accepted Orders Tab
                <>
                  {deliveredOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No delivered orders</h3>
                      <p className="text-gray-500">Accept orders from the active tab to see them here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">{deliveredOrders.map((order) => renderOrderCard(order, "delivered"))}</div>
                  )}
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
