import { Link } from "react-router-dom"

const HomePage = () => {
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
          <Link
            to="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={index} to="/products" className="bg-white rounded-lg p-6 text-center shadow-md card-hover">
                <div
                  className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <i className={`${category.icon} text-2xl`}></i>
                </div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FreshMart?</h2>
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

export default HomePage
