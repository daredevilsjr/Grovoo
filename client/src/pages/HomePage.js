"use client";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    {
      name: "Vegetables",
      icon: "fas fa-carrot",
      color: "from-green-400 to-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      iconColor: "text-green-600",
      count: "50+ items",
    },
    {
      name: "Fruits",
      icon: "fas fa-apple-alt",
      color: "from-red-400 to-red-600",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
      iconColor: "text-red-600",
      count: "30+ items",
    },
    {
      name: "Dairy",
      icon: "fas fa-cheese",
      color: "from-yellow-400 to-yellow-600",
      bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      iconColor: "text-yellow-600",
      count: "25+ items",
    },
    {
      name: "Non-Veg",
      icon: "fas fa-drumstick-bite",
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
      count: "20+ items",
    },
    {
      name: "Grains",
      icon: "fas fa-seedling",
      color: "from-amber-400 to-amber-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      iconColor: "text-amber-600",
      count: "15+ items",
    },
    {
      name: "Spices",
      icon: "fas fa-pepper-hot",
      color: "from-red-500 to-red-700",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
      iconColor: "text-red-700",
      count: "40+ items",
    },
    {
      name: "Oils",
      icon: "fas fa-tint",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
      count: "12+ items",
    },
    {
      name: "Beverages",
      icon: "fas fa-coffee",
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
      count: "18+ items",
    },
  ];

  const features = [
    {
      icon: "fas fa-truck",
      title: "Lightning Fast Delivery",
      description:
        "Get your orders delivered within 12 hours across major cities with real-time tracking.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    },
    {
      icon: "fas fa-leaf",
      title: "Farm Fresh Quality",
      description:
        "Premium quality ingredients sourced directly from farms with quality assurance.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
    },
    {
      icon: "fas fa-tags",
      title: "Wholesale Prices",
      description:
        "Competitive wholesale prices for bulk orders with special discounted price for regular customers.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    },
  ];

  const stats = [
    { number: "100+", label: "Happy Customers", icon: "fas fa-users" },
    { number: "500+", label: "Products", icon: "fas fa-box" },
    { number: "5+", label: "Cities", icon: "fas fa-map-marker-alt" },
    { number: "99.9%", label: "Uptime", icon: "fas fa-clock" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative gradient-bg text-white py-24 lg:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-2 mb-8 animate-slide-up">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium">
                Trusted by 100+ Restaurants
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Fresh Ingredients for Your
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Restaurant & Outlet
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed opacity-90">
              Get premium quality ingredients delivered fresh to your doorstep.
              <span className="block mt-2 font-semibold">
                Officially Funded by Bihar Government's Startup Initiative
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/products"
                className="group bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl flex items-center"
              >
                <span>Start Shopping</span>
                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
              </Link>

              <button className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-2 flex items-center">
                <i className="fas fa-play mr-2"></i>
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center float">
            <i className="fas fa-carrot text-2xl text-green-600"></i>
          </div>
        </div>
        <div className="absolute top-40 right-20 opacity-20">
          <div
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center float"
            style={{ animationDelay: "1s" }}
          >
            <i className="fas fa-apple-alt text-xl text-red-600"></i>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className={`text-center stagger-item`}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <i className={`${stat.icon} text-2xl text-white`}></i>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Shop by{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Category
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our wide range of fresh ingredients, carefully
              categorized for your convenience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/products"
                state={{ category: category.name }}
                className={`group ${category.bgColor} rounded-3xl p-6 text-center card-hover border border-gray-100 stagger-item`}
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                >
                  <i className={`${category.icon} text-3xl text-white`}></i>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  {category.count}
                </p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className="inline-flex items-center text-blue-600 font-semibold text-sm">
                    Explore <i className="fas fa-arrow-right ml-1"></i>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                1StopMandi?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best service and quality for your
              business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.bgColor} rounded-3xl p-8 text-center card-hover border border-gray-100 stagger-item`}
              >
                <div
                  className={`w-24 h-24 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}
                >
                  <i className={`${feature.icon} text-3xl text-white`}></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="py-20 bg-gradient-to-r from-indigo-200 via-purple-200 to-blue-200 text-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-30"></div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white opacity-20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to Transform Your Kitchen?
          </h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-700">
            Join hundreds of restaurants who trust{" "}
            <span className="font-semibold text-indigo-600">1StopMandi</span> for
            their daily ingredient needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-600 hover:text-white transition-all duration-300"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
