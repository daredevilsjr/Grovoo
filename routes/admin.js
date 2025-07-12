const express = require("express")
const Order = require("../models/Order")
const Product = require("../models/Product")
const User = require("../models/User")
const { adminAuth } = require("../middleware/auth")
const DeliveryAgent = require("../models/DeliveryAgent")
const sendEmail = require("../scripts/sendEmail");
const { randomBytes } = require("crypto");

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
      .populate([{ path: "user", select: "name email phone address gstin " }, { path: "items.product", select: "name" }, {
        path: "deliveryAgent",
        select: "user vehicleDetails.vehicleNumber agentVerified",
        populate: {
          path: "user",
          select: "name phone"
        }
      }])
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
      .populate("user", "name email phone address gstin")
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
function generateSecureString(length = 8) {
  const alphabet =
    "0123456789";
  const bytes = randomBytes(length);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}
// Update order status
router.patch("/orders/:id/confirm", adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    const otp = generateSecureString(6);
    order.confirmationOtp = otp;
    order.status = "confirmed";
    await order.save();
    return res.status(200).json({ success: true, order: order });
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
});
async function initiateRefund(id) {
  console.log(`Refund initiated for order id: ${id}`);
}
router.patch("/orders/:id/cancel", adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }
    if (order.paymentStatus == "completed") {
      initiateRefund(order._id);
    }
    order.status = "cancelled";
    order.cancellation.reason = req.body.message || "Customer Unavailable";
    await order.save();
    return res.status(200).json({ success: true, order: order });
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/agents/cancel-requests", adminAuth, async (req, res) => {
  const requests = await Order.find({ "cancellation.requested": true });
  res.status(200).json({ message: "sent", success: true, orders: requests });
});
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: "hotel" }).select("-password").sort({ createdAt: -1 })

    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

router.get("/agents", adminAuth, async (req, res) => {
  try {
    const agents = await DeliveryAgent.find().populate("user").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, agents: agents });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" })
  }
})

router.patch("/agents/:id/verify", adminAuth, async (req, res) => {
  try {
    const agent = await DeliveryAgent.findById(req.params.id).populate("user");
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    agent.agentVerified = true;
    agent.vehicleDetails.isVehicleVerified = true;
    const emailId = agent.user.email;
    await agent.save();
    await sendEmail(emailId, "Agent Verified", "Congratulations .Your Delivery Agent application has been Verified");
    return res.status(200).json({ success: true, message: "Agent verified successfully" });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/agents/:id/reject", adminAuth, async (req, res) => {
  try {
    const agent = await DeliveryAgent.findById(req.params.id).populate("user");
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    const user = agent.user;
    const emailId = user.email;
    await sendEmail(emailId, "Agent Rejected", "Your agent application has been rejected. Try again later with Valid Details.");
    await DeliveryAgent.findByIdAndDelete(req.params.id);
    await User.findByIdAndDelete(user._id);
    return res.status(200).json({ success: true, message: "Agent rejected successfully" });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router
