"use client"

import React from "react"

const { useState, useEffect, useContext, createContext } = React

// Context for global state management
const AppContext = createContext()

// App Context Provider
function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState(mockProducts)
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState(mockOrders)
  const [selectedLocation, setSelectedLocation] = useState("patna")
  const [currentPage, setCurrentPage] = useState("home")

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setCart([])
    localStorage.removeItem("user")
    localStorage.removeItem("cart")
    setCurrentPage("home")
  }

  const addToCart = (product, quantity) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)))
    } else {
      setCart([...cart, { ...product, quantity }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  const placeOrder = (orderData) => {
    const newOrder = {
      id: orders.length + 1,
      userId: user.id,
      ...orderData,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    }
    setOrders([...orders, newOrder])
    setCart([])
    return newOrder
  }

  const value = {
    user,
    products,
    cart,
    orders,
    selectedLocation,
    currentPage,
    setCurrentPage,
    setSelectedLocation,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    placeOrder,
    setProducts,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook to use context
function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}

// Header Component
function Header() {
  const { user, logout, currentPage, setCurrentPage, cart, selectedLocation, setSelectedLocation } = useApp()

  const locations = [
    { value: "patna", label: "patna" },
  ]

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage("home")}>
            <i className="fas fa-store text-2xl text-blue-600 mr-2"></i>
            <span className="text-xl font-bold text-gray-800">1StopMandi</span>
          </div>

          {/* Location Selector */}
          <div className="flex items-center space-x-2">
            <i className="fas fa-map-marker-alt text-gray-600"></i>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {locations.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setCurrentPage("home")}
              className={`hover:text-blue-600 ${currentPage === "home" ? "text-blue-600 font-semibold" : "text-gray-700"}`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage("products")}
              className={`hover:text-blue-600 ${currentPage === "products" ? "text-blue-600 font-semibold" : "text-gray-700"}`}
            >
              Products
            </button>
            {user && (
              <button
                onClick={() => setCurrentPage("orders")}
                className={`hover:text-blue-600 ${currentPage === "orders" ? "text-blue-600 font-semibold" : "text-gray-700"}`}
              >
                My Orders
              </button>
            )}
            <button
              onClick={() => setCurrentPage("contact")}
              className={`hover:text-blue-600 ${currentPage === "contact" ? "text-blue-600 font-semibold" : "text-gray-700"}`}
            >
              Contact
            </button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Cart */}
                <button
                  onClick={() => setCurrentPage("cart")}
                  className="relative p-2 text-gray-700 hover:text-blue-600"
                >
                  <i className="fas fa-shopping-cart text-xl"></i>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                    <i className="fas fa-user"></i>
                    <span className="hidden md:inline">{user.name}</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      {user.role === "admin" && (
                        <button
                          onClick={() => setCurrentPage("admin")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </button>
                      )}
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => setCurrentPage("login")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

// Home Page Component
function HomePage() {
  const { setCurrentPage } = useApp()

  const categories = [
    { name: "Vegetables", icon: "fas fa-carrot", color: "bg-green-100 text-green-600" },
    { name: "Fruits", icon: "fas fa-apple-alt", color: "bg-red-100 text-red-600" },
    { name: "Dairy", icon: "fas fa-cheese", color: "bg-yellow-100 text-yellow-600" },
    { name: "Non-Veg", icon: "fas fa-drumstick-bite", color: "bg-orange-100 text-orange-600" },
    { name: "Grains", icon: "fas fa-seedling", color: "bg-amber-100 text-amber-600" },
    { name: "Spices", icon: "fas fa-pepper-hot", color: "bg-red-100 text-red-600" },
    { name: "Oils", icon: "fas fa-tint", color: "bg-blue-100 text-blue-600" },
    { name: "Beverages", icon: "fas fa-coffee", color: "bg-brown-100 text-brown-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Fresh Ingredients for Your Restaurant</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get premium quality ingredients delivered fresh to your doorstep. Trusted by thousands of restaurants across
            India.
          </p>
          <button
            onClick={() => setCurrentPage("products")}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => setCurrentPage("products")}
                className="bg-white rounded-lg p-6 text-center shadow-md card-hover cursor-pointer"
              >
                <div
                  className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <i className={`${category.icon} text-2xl`}></i>
                </div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose 1StopMandi?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-truck text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your orders delivered within 24 hours across major cities.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-leaf text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh Quality</h3>
              <p className="text-gray-600">Premium quality ingredients sourced directly from farms.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-tags text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive wholesale prices for bulk orders.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Login Component
function LoginPage() {
  const { login, setCurrentPage } = useApp()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "hotel",
    phone: "",
    address: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        // Mock login - in real app, validate against backend
        const userData = {
          id: 1,
          name: formData.email === "admin@1StopMandi.com" ? "Admin User" : "Hotel User",
          email: formData.email,
          role: formData.email === "admin@1StopMandi.com" ? "admin" : "hotel",
        }
        login(userData)
        setCurrentPage("home")
      } else {
        // Mock registration
        const userData = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          role: formData.role,
        }
        login(userData)
        setCurrentPage("home")
      }
      setLoading(false)
    }, 1000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{isLogin ? "Sign In" : "Create Account"}</h2>
          <p className="text-gray-600 mt-2">{isLogin ? "Welcome back to 1StopMandi" : "Join 1StopMandi today"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hotel">Hotel/Restaurant</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@1StopMandi.com for admin access"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <div className="loading-spinner"></div> : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:text-blue-800">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {isLogin && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Demo Credentials:</strong>
              <br />
              Admin: admin@1StopMandi.com
              <br />
              Hotel: any other email
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Products Page Component
function ProductsPage() {
  const { products, addToCart, selectedLocation, user, setCurrentPage } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const categories = ["all", ...new Set(products.map((p) => p.category))]

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price[selectedLocation] - b.price[selectedLocation]
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const handleAddToCart = (product) => {
    if (!user) {
      setCurrentPage("login")
      return
    }
    addToCart(product, 1)
    // Show success message (you could add a toast notification here)
    alert(`${product.name} added to cart!`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{product.category}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{product.price[selectedLocation]}/{product.unit}
                  </span>
                  <span className={`text-sm ${product.stock > 10 ? "text-green-600" : "text-red-600"}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Cart Page Component
function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, selectedLocation, placeOrder, user, setCurrentPage } = useApp()
  const [loading, setLoading] = useState(false)

  const subtotal = cart.reduce((total, item) => total + item.price[selectedLocation] * item.quantity, 0)
  const tax = subtotal * 0.18 // 18% GST
  const deliveryFee = subtotal > 1000 ? 0 : 50
  const total = subtotal + tax + deliveryFee

  const handleCheckout = async () => {
    if (!user) {
      setCurrentPage("login")
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price[selectedLocation],
        })),
        total,
        location: selectedLocation,
      }

      placeOrder(orderData)
      setLoading(false)
      setCurrentPage("orders")
      alert("Order placed successfully!")
    }, 1000)
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <i className="fas fa-shopping-cart text-6xl text-gray-400 mb-4"></i>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some products to get started</p>
          <button
            onClick={() => setCurrentPage("products")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </button>
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
                <div key={item.id} className="p-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || "/placeholder.svg"}
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
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <i className="fas fa-minus text-xs"></i>
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{(item.price[selectedLocation] * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm mt-1"
                      >
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

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center transition-colors"
              >
                {loading ? <div className="loading-spinner"></div> : "Place Order"}
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">Free delivery on orders above ₹1000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Orders Page Component
function OrdersPage() {
  const { orders, user, products } = useApp()

  const userOrders = orders.filter((order) => order.userId === user?.id)

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId)
    return product ? product.name : "Unknown Product"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (userOrders.length === 0) {
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
          {userOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-gray-600">Placed on {order.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>
                        {getProductName(item.productId)} x {item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between items-center font-semibold">
                  <span>Total Amount</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Delivery Location: {order.location.charAt(0).toUpperCase() + order.location.slice(1)}
                </span>
                {order.status === "pending" && (
                  <button className="text-red-600 hover:text-red-800 text-sm">Cancel Order</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Admin Dashboard Component
function AdminDashboard() {
  const { products, setProducts, orders } = useApp()
  const [activeTab, setActiveTab] = useState("products")
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    stock: 0,
    unit: "kg",
    price: { patna: 0 },
  })

  const handleAddProduct = (e) => {
    e.preventDefault()
    const product = {
      id: products.length + 1,
      ...newProduct,
      image: "/placeholder.svg?height=200&width=200",
    }
    setProducts([...products, product])
    setNewProduct({
      name: "",
      category: "",
      description: "",
      stock: 0,
      unit: "kg",
      price: { patna: 0 },
    })
    setShowAddProduct(false)
    alert("Product added successfully!")
  }

  const handleDeleteProduct = (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId))
    }
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const totalProducts = products.length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-rupee-sign text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-shopping-bag text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-box text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("products")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "products"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "orders"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Orders
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "products" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Product Management</h2>
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add Product
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price (patna)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-10 h-10 rounded-full mr-3"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stock} {product.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{product.price.patna}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Order Management</h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-gray-600">Date: {order.date}</p>
                          <p className="text-gray-600">Location: {order.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prices by City</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-600">patna</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price.patna}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: { ...newProduct.price, patna: Number.parseFloat(e.target.value) },
                        })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {/* <div>
                    <label className="text-xs text-gray-600">delhi</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price.delhi}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: { ...newProduct.price, delhi: Number.parseFloat(e.target.value) },
                        })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div> */}
                  {/* <div>
                    <label className="text-xs text-gray-600">Bangalore</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price.bangalore}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: { ...newProduct.price, bangalore: Number.parseFloat(e.target.value) },
                        })
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div> */}
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Contact Page Component
function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      alert("Thank you for your message! We will get back to you soon.")
      setFormData({ name: "", email: "", subject: "", message: "" })
      setLoading(false)
    }, 1000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Contact & Support</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <div className="loading-spinner"></div> : "Send Message"}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <i className="fas fa-phone text-blue-600 w-6"></i>
                    <span className="ml-3">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-blue-600 w-6"></i>
                    <span className="ml-3">support@1stopmandi.com</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-blue-600 w-6"></i>
                    <span className="ml-3">123 Business Park, patna, India</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-clock text-blue-600 w-6"></i>
                    <span className="ml-3">Mon - Sat: 9:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">FAQ</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-800">What are your delivery hours?</h3>
                    <p className="text-gray-600 text-sm mt-1">We deliver between 6:00 AM - 10:00 PM on all days.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">What is the minimum order value?</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Minimum order value is ₹500. Free delivery on orders above ₹1000.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Do you accept returns?</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Yes, we accept returns within 24 hours for fresh products.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const { currentPage, user } = useApp()

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />
      case "login":
        return <LoginPage />
      case "products":
        return <ProductsPage />
      case "cart":
        return <CartPage />
      case "orders":
        return user ? <OrdersPage /> : <LoginPage />
      case "admin":
        return user && user.role === "admin" ? <AdminDashboard /> : <HomePage />
      case "contact":
        return <ContactPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="App">
      <Header />
      {renderPage()}
    </div>
  )
}

// Render the app
ReactDOM.render(
  <AppProvider>
    <App />
  </AppProvider>,
  document.getElementById("root"),
)
