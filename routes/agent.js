const Order = require("../models/Order");
const DeliveryAgent = require("../models/DeliveryAgent");
const User = require("../models/User");
const express = require("express")
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/my-orders", auth, async (req, res) => {
    try {
        const orders = await Order.find({ deliveryAgent: req.user._id })
            .populate({
                path: "items.product",
                select: "name image unit",
            })
            .populate({
                path: "user",
                select: "name address phone",
            });
        return res.status(200).json({ success: true, orders: orders });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
});
router.patch("/:id/accept", auth, async (req, res) => {
    const orderId = req.params.id;
    try {
        const order = await Order.findById(orderId);
        const result = await DeliveryAgent.updateOne(
            { user: req.user._id },
            {
                $push: {
                    ordersAccepted: {
                        order: orderId,
                        acceptedAt: new Date()
                    }
                }
            }
        );

        // console.log("Update Result:", result);
        order.deliveryAgent = req.user._id;
        await order.save();
        const acceptedOrders = await DeliveryAgent.find({ user : req.user._id })
            .populate({
                path: "ordersAccepted.order",
                select: "subtotal tax deliveryFee total location estimatedDelivery address",
            })
            .populate({
                path: "ordersAccepted.order.user",
                select: "name address phone",
            })
            .populate({
                path: "ordersAccepted.order.items.product",
                select: "name image unit",
            });
        return res.status(200).json({ success: true, acceptedOrders });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
})

module.exports = router;