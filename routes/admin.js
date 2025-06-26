const express = require("express")
const Order = require("../models/Order")
const Product = require("../models/Product")
const User = require("../models/User")
const { adminAuth } = require("../middleware/auth")

const router = express.Router()

// Get dashboard stats
router.get("/dashboard", adminAuth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()
    const totalProducts = await Product.countDocuments({ isActive: true })
    const totalUsers = await User.countDocuments({ role: "hotel" })

    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ])
    const totalRevenue = revenueResult[0]?.total || 0

    // Recent orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name")
      .sort({ createdAt: -1 })
      .limit(10)

    // Monthly revenue
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: { $ne: "cancelled" },
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.json({
      stats: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
      },
      recentOrders,
      monthlyRevenue,
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all orders
router.get("/orders", adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const query = {}

    if (status && status !== "all") {
      query.status = status
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.product", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Order.countDocuments(query)

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Update order status
router.patch("/orders/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate("user", "name email")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get all users
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: "hotel" }).select("-password").sort({ createdAt: -1 })

    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
