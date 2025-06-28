"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore, useCartStore } from "../store/useStore"
import PaymentModal from "../components/PaymentModal"
import toast from "react-hot-toast"

const CheckoutPage = () => {
  const { cart, clearCart, getCartTotal, getCartItemsCount } = useCartStore()
  const { selectedLocation, user } = useAuthStore()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [orderData, setOrderData] = useState({
    deliveryAddress: user?.address || "",
    phone: user?.phone || "",
    notes: "",
  })
  const navigate = useNavigate()

  const subtotal = getCartTotal(selectedLocation)
  const tax = subtotal * 0.18
  const deliveryFee = subtotal > 1000 ? 0 : 50
  const total = subtotal + tax + deliveryFee

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    })
  }

  const handleProceedToPayment = (e) => {
    e.preventDefault()

    if (!orderData.deliveryAddress.trim()) {
      toast.error("Please enter delivery address")
      return
    }

    if (!orderData.phone.trim()) {
      toast.error("Please enter phone number")
      return
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty")
      navigate("/products")
      return
    }

    // Prepare order data for payment
    const paymentOrderData = {
      items: cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
      location: selectedLocation,
      deliveryAddress: orderData.deliveryAddress.trim(),
      phone: orderData.phone.trim(),
      notes: orderData.notes.trim(),
    }

    setOrderData(paymentOrderData)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (order) => {
    clearCart()
    console.log("orfder")
    navigate(`/order-confirmation/${order._id}`)
  }

  // if (cart.length === 0) {
  //   navigate("/products")
  //   return null
  // }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>

              <form onSubmit={handleProceedToPayment} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={orderData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                  <textarea
                    name="deliveryAddress"
                    required
                    value={orderData.deliveryAddress}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter complete delivery address with landmarks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Location</label>
                  <input
                    type="text"
                    value={selectedLocation.charAt(0).toUpperCase() + selectedLocation.slice(1)}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={orderData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                >
                  <i className="fas fa-arrow-right mr-2"></i>
                  Proceed to Payment
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3">
                    <img
                      src={item.image || "/placeholder.svg?height=50&width=50"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-gray-600 text-xs">
                        ₹{item.price[selectedLocation]}/{item.unit} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-sm">
                      ₹{(item.price[selectedLocation] * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="mb-4" />

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({getCartItemsCount()} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods Preview */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-blue-800 mb-2">Payment Options Available</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex items-center">
                    <i className="fas fa-credit-card mr-2"></i>
                    <span>Credit/Debit Cards, UPI, Net Banking</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-money-bill-wave mr-2"></i>
                    <span>Cash on Delivery</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center text-green-700">
                  <i className="fas fa-truck mr-2"></i>
                  <span className="text-sm font-medium">Estimated delivery: Tomorrow by 6 PM</span>
                </div>
              </div>

              {subtotal < 1000 && (
                <div className="bg-orange-50 p-4 rounded-lg mt-4">
                  <div className="flex items-center text-orange-700">
                    <i className="fas fa-info-circle mr-2"></i>
                    <span className="text-sm">Add ₹{(1000 - subtotal).toFixed(2)} more for free delivery!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderData={orderData}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}

export default CheckoutPage
