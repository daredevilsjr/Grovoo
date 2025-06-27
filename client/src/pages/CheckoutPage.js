"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore, useCartStore } from "../store/useStore"
import axios from "axios"
import toast from "react-hot-toast"

const CheckoutPage = () => {
  const { cart, clearCart, getCartTotal, getCartItemsCount } = useCartStore()
  const { selectedLocation, user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [orderData, setOrderData] = useState({
    deliveryAddress: user?.address || "",
    phone: user?.phone || "",
    notes: "",
    paymentMethod: "cod",
  })
  const navigate = useNavigate()

  const subtotal = getCartTotal(selectedLocation)
  const tax = subtotal * 0.18 // 18% GST
  const deliveryFee = subtotal > 1000 ? 0 : 50
  const total = subtotal + tax + deliveryFee

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePlaceOrder = async (e) => {
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
      navigate("/cart")
      return
    }

    setLoading(true)

    try {
      const orderPayload = {
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        location: selectedLocation,
        deliveryAddress: orderData.deliveryAddress.trim(),
        notes: orderData.notes.trim(),
      }

      const response = await axios.post("/api/orders", orderPayload)

      clearCart()
      toast.success("Order placed successfully!")
      navigate(`/order-confirmation/${response.data._id}`)
    } catch (error) {
      const message = error.response?.data?.message || "Failed to place order"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    navigate("/cart")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>

              <form onSubmit={handlePlaceOrder} className="space-y-6">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={orderData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span>Cash on Delivery</span>
                    </label>
                    <label className="flex items-center opacity-50">
                      <input type="radio" name="paymentMethod" value="online" disabled className="mr-2" />
                      <span>Online Payment (Coming Soon)</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-4 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors text-lg font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner mr-2"></div>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle mr-2"></i>
                      Confirm Order - ₹{total.toFixed(2)}
                    </>
                  )}
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

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center text-green-700">
                  <i className="fas fa-truck mr-2"></i>
                  <span className="text-sm font-medium">Estimated delivery: Tomorrow by 6 PM</span>
                </div>
              </div>

              {subtotal < 1000 && (
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <div className="flex items-center text-blue-700">
                    <i className="fas fa-info-circle mr-2"></i>
                    <span className="text-sm">Add ₹{(1000 - subtotal).toFixed(2)} more for free delivery!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
