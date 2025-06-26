const express = require("express")
const Order = require("../models/Order")
const Product = require("../models/Product")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Create order
router.post("/", auth, async (req, res) => {
  try {
    const { items, location, deliveryAddress, notes } = req.body

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId} not found` })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        })
      }

      const itemTotal = product.price[location] * item.quantity
      subtotal += itemTotal

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price[location],
        total: itemTotal,
      })

      // Update product stock
      product.stock -= item.quantity
      await product.save()
    }

    const tax = subtotal * 0.18 // 18% GST
    const deliveryFee = subtotal > 1000 ? 0 : 50
    const total = subtotal + tax + deliveryFee

    // Set estimated delivery (next day)
    const estimatedDelivery = new Date()
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 1)

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      total,
      location,
      deliveryAddress: deliveryAddress || req.user.address,
      estimatedDelivery,
      notes,
    })

    await order.save()
    await order.populate("items.product", "name image unit")

    res.status(201).json(order)
  } catch (error) {
    console.error("Create order error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user orders
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name image unit")
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get single order
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name image unit")
      .populate("user", "name email")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Cancel order
router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" })
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Order cannot be cancelled" })
    }

    order.status = "cancelled"
    await order.save()

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product)
      if (product) {
        product.stock += item.quantity
        await product.save()
      }
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
