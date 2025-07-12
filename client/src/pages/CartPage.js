"use client"

import { useNavigate } from "react-router-dom"
import { useAuthStore, useCartStore } from "../store/useStore"
import toast from "react-hot-toast"
import { useEffect } from "react"

const CartPage = () => {
  // const { cart, updateQuantity, removeFromCart, getCartTotal, getCartItemsCount } = useCartStore()
  const { selectedLocation, user } = useAuthStore()
  const navigate = useNavigate()

  const { cart, updateQuantity, removeFromCart, getCartTotal, hydrated, hydrateCart  } = useCartStore();
  // const { selectedLocation } = useAuthStore();
  useEffect(() => {
    hydrateCart(selectedLocation);
  }, [hydrateCart, selectedLocation]);
  if (!hydrated) return null;

  const subtotal = getCartTotal(selectedLocation);
  const tax = 0
  const deliveryFee = subtotal > 1000 ? 0 : 0
  const total = subtotal + tax + deliveryFee

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to proceed to checkout")
      navigate("/login")
      return
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    navigate("/checkout")
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <i className="fas fa-shopping-cart text-6xl text-gray-400 mb-6"></i>
            <h2 className="text-3xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added any items to your cart yet.</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              <i className="fas fa-shopping-bag mr-2"></i>
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cart.map((item) => (
                <div key={item._id} className="p-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || "/placeholder.svg?height=80&width=80"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.category}</p>
                      <p className="text-green-600 font-semibold">
                        ₹{item.price[selectedLocation]}/{item.unit}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <i className="fas fa-minus text-xs"></i>
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{(item.price[selectedLocation] * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-600 hover:text-red-800 text-sm mt-1 transition-colors"
                      >
                        <i className="fas fa-trash mr-1"></i>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  {/* <span>Subtotal ({getCartItemsCount()} items)</span> */}
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-4 px-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
              >
                <i className="fas fa-arrow-right mr-2"></i>
                Proceed to Checkout
              </button>

              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-500 text-center">Free delivery</p>
                {subtotal < 500 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center text-blue-700">
                      <i className="fas fa-info-circle mr-2"></i>
                      <span className="text-sm">Add ₹{(500 - subtotal).toFixed(2)} more for delivery!</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default CartPage
