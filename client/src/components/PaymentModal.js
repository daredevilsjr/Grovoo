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
  const tax = 0
  const deliveryFee = subtotal > 1000 ? 0 : 0
  const total = subtotal +tax+ deliveryFee

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
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
        name: "1StopMandi",
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
              toast.success(
                <div className="flex items-center">
                  <span>Payment successful!</span>
                </div>,
              )
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
          color: "#3b82f6",
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

      toast.success(
        <div className="flex items-center">
          <span>Order placed successfully!</span>
        </div>,
      )
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-screen overflow-y-auto shadow-2xl border border-gray-100 animate-slide-up">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Choose Payment Method
            </h3>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <i className="fas fa-times text-gray-600"></i>
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
              <i className="fas fa-receipt mr-2 text-blue-600"></i>
              Order Summary
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal ({getCartItemsCount()} items)</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                
                <span className="font-semibold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
              </div>
              <hr className="border-blue-200" />
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-gray-800">Total Amount</span>
                <span className="font-bold text-blue-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4 mb-8">
            <div>
              <label
                className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  paymentMethod === "razorpay"
                    ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4 w-5 h-5 text-blue-600"
                />
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                    <i className="fas fa-credit-card text-white text-lg"></i>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">Online Payment</div>
                    <div className="text-sm text-gray-600">Credit/Debit Card, UPI, Net Banking</div>
                  </div>
                  <div className="ml-4">
                    <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" className="h-8" />
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label
                className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  paymentMethod === "cod"
                    ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4 w-5 h-5 text-green-600"
                />
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                    <i className="fas fa-money-bill-wave text-white text-lg"></i>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when your order arrives</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Security Info */}
          {paymentMethod === "razorpay" && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-8">
              <div className="flex items-center text-blue-700">
                <i className="fas fa-shield-alt mr-3 text-lg"></i>
                <div>
                  <div className="font-semibold">Secure Payment</div>
                  <div className="text-sm">Your payment is secured by 256-bit SSL encryption</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl font-bold hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center ${
                paymentMethod === "razorpay" ? "btn-primary" : "btn-success"
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {loading ? (
                <>
                  <div className="loading-spinner mr-3"></div>
                  Processing...
                </>
              ) : paymentMethod === "razorpay" ? (
                <>
                  <i className="fas fa-credit-card mr-3"></i>
                  Pay ₹{total.toFixed(2)}
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle mr-3"></i>
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
