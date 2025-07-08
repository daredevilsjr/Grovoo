// "use client"

// import { useEffect, useState } from "react"
// import { Package, MapPin, Clock, DollarSign, User, Phone, CheckCircle } from "lucide-react"
// import toast from "react-hot-toast"
// import axios from 'axios'

// // Mock data for unaccepted orders


// export default function OrdersPage() {
//   const [orders, setOrders] = useState([])
//   const [acceptedOrders, setAcceptedOrders] = useState([])

//   const handleAcceptOrder = (orderId) => {
//     const orderToAccept = orders.find((order) => order._id === orderId)
//     if (orderToAccept) {
//       setAcceptedOrders((prev) => [...prev, orderId])
//       setOrders((prev) => prev.filter((order) => order._id !== orderId))
//     }
//   }



//   useEffect(() => {
//     const getAvailableOrders = async () => {
//       try {
//         const response = await axios.post("/api/orders/available-orders/");
//         // console.log(response.data);
//         if (response.data.success) {
//           setOrders(response.data.orders);
//           return;
//         }
//       }
//       catch (err) {
//         console.log(err);
//         toast.error("Error fetching orders.Please refresh.");
//       }
//       return;
//     }
//     getAvailableOrders();
//   }, []);

//   const formatTime = (date) => {
//     return new Date(date).toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   const getTimeAgo = (date) => {
//     const minutes = Math.floor((Date.now() - new Date(date)) / (1000 * 60))
//     if (minutes < 1) return "Just now"
//     if (minutes === 1) return "1 minute ago"
//     return `${minutes} minutes ago`
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "confirmed":
//         return "bg-green-100 text-green-800"
//       case "pending":
//         return "bg-yellow-100 text-yellow-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const getPaymentMethodColor = (method) => {
//     return method === "cod" ? "bg-orange-100 text-orange-800" : "bg-purple-100 text-purple-800"
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
//       <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Available Orders</h1>
//             <p className="text-gray-600 mt-1 text-sm">Accept orders to start delivering</p>
//           </div>
//           <div className="text-center sm:text-right">
//             <p className="text-sm text-gray-500">Available Orders</p>
//             <p className="text-xl sm:text-2xl font-bold text-blue-600">{orders.length}</p>
//           </div>
//         </div>

//         {/* Orders List */}
//         {orders.length === 0 ? (
//           <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
//             <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No orders available</h3>
//             <p className="text-gray-500">Check back later for new delivery opportunities</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {orders.map((order) => (
//               <div
//                 key={order._id}
//                 className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
//               >
//                 <div className="p-4 sm:p-6 border-b border-gray-200">
//                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
//                     <div className="min-w-0 flex-1">
//                       <h3 className="text-lg font-semibold text-gray-900 truncate">Order #{order._id}</h3>
//                       <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 text-sm text-gray-600 space-y-1 sm:space-y-0">
//                         <span className="flex items-center">
//                           <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
//                           <span className="truncate">{getTimeAgo(order.createdAt)}</span>
//                         </span>
//                         <span className="flex items-center">
//                           <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
//                           <span className="truncate">
//                             {order.location.charAt(0).toUpperCase() + order.location.slice(1)}
//                           </span>
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex flex-row sm:flex-col lg:flex-row space-x-2 sm:space-x-0 sm:space-y-2 lg:space-y-0 lg:space-x-2 flex-shrink-0">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(order.status)}`}
//                       >
//                         {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                       </span>
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPaymentMethodColor(order.paymentMethod)}`}
//                       >
//                         {order.paymentMethod.toUpperCase()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-4 sm:p-6 space-y-4">
//                   {/* Customer Info */}
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
//                     <div className="flex items-center space-x-3 min-w-0 flex-1">
//                       <User className="h-5 w-5 text-gray-500 flex-shrink-0" />
//                       <div className="min-w-0 flex-1">
//                         <p className="font-medium truncate">{order.user.name}</p>
//                         <p className="text-sm text-gray-500 flex items-center">
//                           <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
//                           <span className="truncate">{order.user.phone}</span>
//                         </p>
//                       </div>
//                     </div>
//                     <div className="text-center sm:text-right flex-shrink-0">
//                       <p className="text-sm text-gray-500">Estimated Delivery</p>
//                       <p className="font-medium">{formatTime(order.estimatedDelivery)}</p>
//                     </div>
//                   </div>

//                   {/* Delivery Address */}
//                   <div className="flex items-start space-x-3">
//                     <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
//                     <div className="min-w-0 flex-1">
//                       <p className="font-medium">Delivery Address</p>
//                       <p className="text-gray-600 break-words">{order.deliveryAddress}</p>
//                       {order.notes && <p className="text-sm text-blue-600 mt-1 break-words">Note: {order.notes}</p>}
//                     </div>
//                   </div>

//                   {/* Order Items */}
//                   <div>
//                     <p className="font-medium mb-2">Order Items</p>
//                     <div className="space-y-2">
//                       {order.items.map((item, index) => (
//                         <div key={index} className="flex justify-between items-center text-sm">
//                           <span className="truncate pr-2">
//                             {item.product.name} × {item.quantity}
//                           </span>
//                           <span className="font-medium flex-shrink-0">₹{item.total}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="border-t border-gray-200 pt-4">
//                     {/* Order Summary */}
//                     <div className="space-y-1 text-sm">
//                       <div className="flex justify-between">
//                         <span>Subtotal</span>
//                         <span>₹{order.subtotal}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Tax</span>
//                         <span>₹{order.tax}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Delivery Fee</span>
//                         <span>₹{order.deliveryFee}</span>
//                       </div>
//                       <div className="border-t border-gray-200 pt-1">
//                         <div className="flex justify-between font-medium text-base">
//                           <span>Total</span>
//                           <span className="flex items-center">
//                             <DollarSign className="h-4 w-4 mr-1" />₹{order.total}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Accept Button */}
//                   <button
//                     onClick={() => handleAcceptOrder(order._id)}
//                     className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
//                   >
//                     <CheckCircle className="h-4 w-4 mr-2" />
//                     Accept Order
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Accepted Orders Summary */}
//         {acceptedOrders.length > 0 && (
//           <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
//             <div className="flex items-start space-x-3">
//               <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
//               <div className="min-w-0 flex-1">
//                 <p className="font-medium text-green-900">
//                   You have accepted {acceptedOrders.length} order{acceptedOrders.length > 1 ? "s" : ""}
//                 </p>
//                 <p className="text-sm text-green-700 mt-1">
//                   Check your accepted orders in the profile section to manage deliveries
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
"use client"

import { useEffect, useState } from "react"
import { Package, MapPin, Clock, DollarSign, User, Phone, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [refetch, setRefetch] = useState(0);
  const [acceptedOrders, setAcceptedOrders] = useState([])
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
          setAcceptedOrders(response.data.orders)
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

  const renderOrderCard = (order, showAcceptButton = true) => (
    <div
      key={order._id}
      className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">Order #{order._id}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 text-sm text-gray-600 space-y-1 sm:space-y-0">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{getTimeAgo(order.createdAt)}</span>
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{order.location.charAt(0).toUpperCase() + order.location.slice(1)}</span>
              </span>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col lg:flex-row space-x-2 sm:space-x-0 sm:space-y-2 lg:space-y-0 lg:space-x-2 flex-shrink-0">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(showAcceptButton ? order.status : "accepted")}`}
            >
              {showAcceptButton ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Accepted"}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPaymentMethodColor(order.paymentMethod)}`}
            >
              {order.paymentMethod.toUpperCase()}
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
              <p className="font-medium truncate">{order.user.name}</p>
              <p className="text-sm text-gray-500 flex items-center">
                <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{order.user.phone}</span>
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right flex-shrink-0">
            <p className="text-sm text-gray-500">Estimated Delivery</p>
            <p className="font-medium">{formatTime(order.estimatedDelivery)}</p>
          </div>
        </div>
        {/* Delivery Address */}
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium">Delivery Address</p>
            <p className="text-gray-600 break-words">{order.deliveryAddress}</p>
            {order.notes && <p className="text-sm text-blue-600 mt-1 break-words">Note: {order.notes}</p>}
          </div>
        </div>
        {/* Order Items */}
        <div>
          <p className="font-medium mb-2">Order Items</p>
          <div className="space-y-2">
            {order.items.map((item, index) => (
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
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{order.tax}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{order.deliveryFee}</span>
            </div>
            <div className="border-t border-gray-200 pt-1">
              <div className="flex justify-between font-medium text-base">
                <span>Total</span>
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />₹{order.total}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Accept Button */}
        {showAcceptButton && (
          <button
            onClick={() => handleAcceptOrder(order._id)}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Accept Order
          </button>
        )}
      </div>
    </div>
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
              <p className="text-xl sm:text-2xl font-bold text-green-600">{acceptedOrders.length}</p>
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
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "active" ? (
              // Active Orders Tab
              <>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No active orders</h3>
                    <p className="text-gray-500">Check back later for new delivery opportunities</p>
                  </div>
                ) : (
                  <div className="space-y-4">{orders.map((order) => renderOrderCard(order, true))}</div>
                )}
              </>
            ) : (
              // Accepted Orders Tab
              <>
                {acceptedOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No accepted orders</h3>
                    <p className="text-gray-500">Accept orders from the active tab to see them here</p>
                  </div>
                ) : (
                  <div className="space-y-4">{acceptedOrders.map((order) => renderOrderCard(order, false))}</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
