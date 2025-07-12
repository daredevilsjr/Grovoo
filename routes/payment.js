const express = require("express")
const crypto = require("crypto")
const razorpay = require("../config/razorpay")
const Order = require("../models/Order")
const Product = require("../models/Product")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Create Razorpay order
router.post("/create-order", auth, async (req, res) => {
  try {
    const { items, location, deliveryAddress, notes } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

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
    }

    const tax = 0
    const deliveryFee = subtotal > 1000 ? 0 : 0
    const total = subtotal + deliveryFee

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // Amount in paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        location,
        itemCount: items.length,
      },
    })

    // Create order in database with pending payment status
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      total,
      location,
      deliveryAddress: deliveryAddress || req.user.address,
      notes,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "pending",
      status: "pending",
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
    })

    await order.save()

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: order._id,
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error("Create order error:", error)
    res.status(500).json({ message: "Failed to create order" })
  }
})

// Verify payment and update order
router.post("/verify-payment", auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" })
    }

    // Find and update order
    const order = await Order.findById(dbOrderId)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" })
    }

    // Update order with payment details
    order.paymentStatus = "completed"
    order.status = "confirmed"
    order.razorpayPaymentId = razorpay_payment_id
    order.razorpaySignature = razorpay_signature
    order.paidAt = new Date()

    await order.save()

    // Update product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product)
      if (product) {
        product.stock -= item.quantity
        await product.save()
      }
    }

    await order.populate("items.product", "name image unit")

    res.json({
      success: true,
      message: "Payment verified successfully",
      order,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    res.status(500).json({ message: "Payment verification failed" })
  }
})

// Handle payment failure
router.post("/payment-failed", auth, async (req, res) => {
  try {
    const { dbOrderId, error } = req.body

    const order = await Order.findById(dbOrderId)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" })
    }

    // Update order status
    order.paymentStatus = "failed"
    order.status = "cancelled"
    order.paymentError = error

    await order.save()

    res.json({
      success: true,
      message: "Payment failure recorded",
    })
  } catch (error) {
    console.error("Payment failure handling error:", error)
    res.status(500).json({ message: "Failed to handle payment failure" })
  }
})

// Get payment status
router.get("/status/:orderId", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("items.product", "name image unit")
      .populate("user", "name email")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json(order)
  } catch (error) {
    console.error("Get payment status error:", error)
    res.status(500).json({ message: "Failed to get payment status" })
  }
})

module.exports = router
