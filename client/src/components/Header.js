"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore, useCartStore } from "../store/useStore"
import toast from "react-hot-toast"

const Header = () => {
  const { user, logout, selectedLocation, updateLocation, isAuthenticated, loading } = useAuthStore()
  const { getCartItemsCount } = useCartStore()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const locations = [
    { value: "mumbai", label: "Mumbai", icon: "🏙️" },
    { value: "delhi", label: "Delhi", icon: "🏛️" },
    { value: "bangalore", label: "Bangalore", icon: "🌆" },
  ]

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    navigate("/")
    setShowUserMenu(false)
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false)
      setShowMobileMenu(false)
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const cartItemsCount = getCartItemsCount()

  if (loading) {
    return (
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-3 animate-pulse"></div>
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100" : "bg-white shadow-lg"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <i className="fas fa-store text-white text-lg"></i>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FreshMart
            </span>
          </Link>

          {/* Location Selector */}
          <div className="hidden md:flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-4 py-2 border border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-map-marker-alt text-white text-sm"></i>
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => updateLocation(e.target.value)}
              className="bg-transparent border-none focus:outline-none font-semibold text-gray-700 cursor-pointer"
            >
              {locations.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.icon} {location.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 hover:scale-105 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {user?.role !== "delivery" && (<Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 hover:scale-105 relative group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>)}
            {isAuthenticated && (
              <Link
                to="/orders"
                className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 hover:scale-105 relative group"
              >
                {user?.role === "delivery" ? "Active Orders" : "My Orders"}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 hover:scale-105 relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* Cart */}
                {user?.role !== "delivery" && (<Link
                  to="/cart"
                  className="relative p-3 text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-110 group"
                >
                  <div className="relative">
                    <i className="fas fa-shopping-cart text-xl"></i>
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
                        {cartItemsCount}
                      </span>
                    )}
                  </div>
                </Link>)}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowUserMenu(!showUserMenu)
                    }}
                    className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-4 py-2 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <i className="fas fa-user text-white text-sm"></i>
                    </div>
                    <span className="hidden md:inline font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                      {user.name}
                    </span>
                    <i className="fas fa-chevron-down text-xs text-gray-500 group-hover:text-blue-600 transition-all duration-300 group-hover:rotate-180"></i>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <i className="fas fa-user text-white"></i>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                                }`}
                            >
                              {user.role === "admin" ? "Admin Account" : "Hotel Account"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        {user.role === "admin" && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-300 group"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <i className="fas fa-cog mr-3 group-hover:rotate-90 transition-transform duration-300"></i>
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-300"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <i className="fas fa-list mr-3"></i>
                          {user?.role === "delivery" ? "Active Orders" : "My Orders"}
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-300"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <i className="fas fa-user mr-3"></i>
                          My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-300"
                        >
                          <i className="fas fa-sign-out-alt mr-3"></i>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMobileMenu(!showMobileMenu)
              }}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              <i className={`fas ${showMobileMenu ? "fa-times" : "fa-bars"} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t bg-white/95 backdrop-blur-md animate-slide-up">
            <div className="py-4 space-y-2">
              {/* Mobile Location Selector */}
              <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl mx-4 mb-4">
                <i className="fas fa-map-marker-alt text-blue-600"></i>
                <select
                  value={selectedLocation}
                  onChange={(e) => updateLocation(e.target.value)}
                  className="bg-transparent border-none focus:outline-none font-semibold text-gray-700 flex-1"
                >
                  {locations.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.icon} {location.label}
                    </option>
                  ))}
                </select>
              </div>

              <Link
                to="/"
                className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-300 font-semibold"
                onClick={() => setShowMobileMenu(false)}
              >
                <i className="fas fa-home mr-3"></i>
                Home
              </Link>
              <Link
                to="/products"
                className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-300 font-semibold"
                onClick={() => setShowMobileMenu(false)}
              >
                <i className="fas fa-box mr-3"></i>
                Products
              </Link>
              {isAuthenticated && (
                <Link
                  to="/orders"
                  className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-300 font-semibold"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <i className="fas fa-list mr-3"></i>
                  My Orders
                </Link>
              )}
              <Link
                to="/contact"
                className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-300 font-semibold"
                onClick={() => setShowMobileMenu(false)}
              >
                <i className="fas fa-envelope mr-3"></i>
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
