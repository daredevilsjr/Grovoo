const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { default: orders } = require("razorpay/dist/types/orders");

const deliveryAgentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ordersAccepted: [
    {
      orders: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        default: [],
      },
      acceptedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  ordersDelivered: [
    {
      orders: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        default: [],
      },
      deliveredAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  pincode: {
    type: String,
    minlength: 6,
    maxlength: 6,
    required: true,
  },
  vehicleDetails: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
});
const DeliveryAgent = mongoose.model("DeliveryAgent", deliveryAgentSchema);
