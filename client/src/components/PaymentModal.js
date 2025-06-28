"use client"

import { useState, useEffect } from "react"
import { useAuthStore, useCartStore } from "../store/useStore"
import axios from "axios"
import toast from "react-hot-toast"

const PaymentModal = ({ isOpen, onClose, orderData, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const { user, selectedLocation } = useAuthStore()
  const { getCartTotal, getCartItemsCount } = useCartStore()

  const subtotal = getCartTotal(selectedLocation)
  const tax = subtotal * 0.18
  const deliveryFee = subtotal > 1000 ? 0 : 50
  const total = subtotal + tax + deliveryFee

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleRazorpayPayment = async () => {
    setLoading(true)

    try {
      // Create order on backend
      const response = await axios.post("/api/payment/create-order", orderData)
      const { orderId, amount, currency, dbOrderId, key } = response.data

      const options = {
        key,
        amount,
        currency,
        name: "FreshMart",
        description: `Order for ${getCartItemsCount()} items`,
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post("/api/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId,
            })

            if (verifyResponse.data.success) {
              toast.success("Payment successful!")
              onSuccess(verifyResponse.data.order)
              onClose()
            }
          } catch (error) {
            console.error("Payment verification failed:", error)
            toast.error("Payment verification failed")

            // Record payment failure
            await axios.post("/api/payment/payment-failed", {
              dbOrderId,
              error: error.response?.data?.message || "Payment verification failed",
            })
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: orderData.phone || user?.phone,
        },
        notes: {
          address: orderData.deliveryAddress,
          location: selectedLocation,
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            toast.error("Payment cancelled")
          },
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on("payment.failed", async (response) => {
        console.error("Payment failed:", response.error)
        toast.error(`Payment failed: ${response.error.description}`)

        // Record payment failure
        await axios.post("/api/payment/payment-failed", {
          dbOrderId,
          error: response.error.description,
        })

        setLoading(false)
      })

      rzp.open()
    } catch (error) {
      console.error("Payment initiation failed:", error)
      const message = error.response?.data?.message || "Failed to initiate payment"
      toast.error(message)
      setLoading(false)
    }
  }

  const handleCODPayment = async () => {
    setLoading(true)

    try {
      const response = await axios.post("/api/orders", {
        ...orderData,
        paymentMethod: "cod",
      })

      toast.success("Order placed successfully!")
      onSuccess(response.data)
      onClose()
    } catch (error) {
      const message = error.response?.data?.message || "Failed to place order"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = () => {
    if (paymentMethod === "razorpay") {
      handleRazorpayPayment()
    } else {
      handleCODPayment()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Choose Payment Method</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium mb-3">Order Summary</h4>
            <div className="space-y-2 text-sm">
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
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-credit-card text-blue-600"></i>
                  </div>
                  <div>
                    <div className="font-medium">Online Payment</div>
                    <div className="text-sm text-gray-600">Credit/Debit Card, UPI, Net Banking</div>
                  </div>
                </div>
                <div className="ml-auto">
                  <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" className="h-6" />
                </div>
              </label>
            </div>

            <div>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-money-bill-wave text-green-600"></i>
                  </div>
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when your order arrives</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Security Info */}
          {paymentMethod === "razorpay" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <div className="flex items-center text-blue-700">
                <i className="fas fa-shield-alt mr-2"></i>
                <span className="text-sm">Your payment is secured by 256-bit SSL encryption</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors font-medium"
            >
              {loading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Processing...
                </>
              ) : paymentMethod === "razorpay" ? (
                <>
                  <i className="fas fa-credit-card mr-2"></i>
                  Pay ₹{total.toFixed(2)}
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle mr-2"></i>
                  Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
