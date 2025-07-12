const Order = require("../models/Order");
const DeliveryAgent = require("../models/DeliveryAgent");
const User = require("../models/User");
const express = require("express")
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/my-orders", auth, async (req, res) => {
    try {
        const profile = await DeliveryAgent.findOne({ user: req.user._id })
            .populate({
                path: "ordersAccepted.order",
                populate: [
                    {
                        path: "user",
                        select: "name address phone"
                    },
                    {
                        path: "items.product",
                        select: "name image unit"
                    }
                ]
            })
            .populate({
                path: "ordersDelivered.order",
                populate: [
                    {
                        path: "user",
                        select: "name address phone"
                    },
                    {
                        path: "items.product",
                        select: "name image unit"
                    }
                ]
            });
        let ordersAccepted = [], ordersDelivered = [];
        profile.ordersAccepted.forEach(acceptedOrder => {
            ordersAccepted.push(acceptedOrder.order); // Your complete order object
            console.log(acceptedOrder.acceptedAt); // When it was accepted
        });

        // Access delivered orders
        profile.ordersDelivered.forEach(deliveredOrder => {
            ordersDelivered.push(deliveredOrder.order);
            console.log(deliveredOrder.deliveredAt); // When it was delivered
        });
        return res.status(200).json({ success: true, ordersAccepted, ordersDelivered });
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
        const agent = await DeliveryAgent.findOne({ user: req.user._id });
        console.log(agent);
        order.deliveryAgent = agent._id;
        await order.save();
        console.log(order);
        const acceptedOrders = await DeliveryAgent.find({ user: req.user._id })
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

router.post("/:id/deliver", auth, async (req, res) => {
    const orderId = req.params.id;
    try {
        const order = await Order.findById(orderId);
        const result = await DeliveryAgent.updateOne(
            {
                user: req.user._id,
                "ordersAccepted.order": orderId,        // Order must exist in accepted
                "ordersDelivered.order": { $ne: orderId } // Order must NOT exist in delivered
            },
            {
                $pull: {
                    ordersAccepted: {
                        order: orderId
                    }
                },
                $push: {
                    ordersDelivered: {
                        order: orderId,
                        deliveredAt: new Date()
                    }
                }
            }
        );

        order.deliveryAgent = req.user._id;
        order.status = "delivered";
        order.estimatedDelivery = null;
        await order.save();
        console.log(order);
        const acceptedOrders = await DeliveryAgent.find({ user: req.user._id })
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
        const deliveredOrders = await DeliveryAgent.find({ user: req.user._id })
            .populate({
                path: "ordersDelivered.order",
                select: "subtotal tax deliveryFee total location estimatedDelivery address",
            })
            .populate({
                path: "ordersDelivered.order.user",
                select: "name address phone",
            })
            .populate({
                path: "ordersDelivered.order.items.product",
                select: "name image unit",
            });
        return res.status(200).json({ success: true, acceptedOrders, deliveredOrders });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
})

router.post("/:id/request-cancel", auth, async (req, res) => {
    const orderId = req.params.id;
    try {
        const order = await Order.findById(orderId);
        console.log(order);
        const result = await DeliveryAgent.updateOne(
            {
                user: req.user._id,
                "ordersDelivered.order": { $ne: orderId }
            },
            {
                $pull: {
                    ordersAccepted: {
                        order: orderId
                    }
                },
                $push: {
                    cancellationRequets: {
                        order: orderId,
                        cancelledAt: new Date(),
                        message: req.body.message || "Customer Unavailable",
                    }
                }
            }
        );
        // console.log(result);

        order.deliveryAgent = req.user._id;
        order.status = "pending";
        order.cancellation = {
            requested: true,
            message: req.body.message || "Customer Unavailable",
            requestedAt: new Date(),
        };
        order.estimatedDelivery = null;
        await order.save();
        console.log(order);
        const acceptedOrders = await DeliveryAgent.find({ user: req.user._id })
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
        const deliveredOrders = await DeliveryAgent.find({ user: req.user._id })
            .populate({
                path: "ordersDelivered.order",
                select: "subtotal tax deliveryFee total location estimatedDelivery address",
            })
            .populate({
                path: "ordersDelivered.order.user",
                select: "name address phone",
            })
            .populate({
                path: "ordersDelivered.order.items.product",
                select: "name image unit",
            });

        return res.status(200).json({ success: true, acceptedOrders, deliveredOrders });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    }
})

module.exports = router;
// router.get("/my-orders", auth, async (req, res) => {
//     try {
//         const acceptedOrders = await DeliveryAgent.find({ user: req.user._id })
//             .populate({
//                 path: "ordersAccepted.order",
//                 select: "subtotal tax deliveryFee total location estimatedDelivery address",
//             })
//             .populate({
//                 path: "ordersAccepted.order.user",
//                 select: "name address phone",
//             })
//             .populate({
//                 path: "ordersAccepted.order.items.product",
//                 select: "name image unit",
//             });
//         const deliveredOrders = await DeliveryAgent.find({ user: req.user._id })
//             .populate({
//                 path: "ordersDelivered.order",
//                 select: "subtotal tax deliveryFee total location estimatedDelivery address",
//             })
//             .populate({
//                 path: "ordersDelivered.order.user",
//                 select: "name address phone",
//             })
//             .populate({
//                 path: "ordersDelivered.order.items.product",
//                 select: "name image unit",
//             });
//         return res.status(200).json({ success: true, acceptedOrders, deliveredOrders });
//     }
//     catch (err) {
//         console.log(err);
//         return res.status(500).json({ message: "Server Error" });
//     }
// });