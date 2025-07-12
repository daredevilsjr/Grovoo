const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const { default: orders } = require("razorpay/dist/types/orders");

const deliveryAgentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  agentVerified: {
    type: Boolean,
    default: false,
  }
  ,
  ordersAccepted: {
    type: [
      {
        order: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order"
          // ❌ remove default here
        },
        acceptedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    default: []
  },
  ordersDelivered: {
    type: [
      {
        order: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order"
          // ❌ remove default here
        },
        deliveredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: []
  },
  vehicleDetails: {
    vehicleNumber: {
      type: String,
      required: true,
    },
    isVehicleVerified: {
      type: Boolean,
      default: false,
    },
    vehicleImage: {
      type: String,
      default: "",
    }
  },
  reviews: {
    rating: { type: Number, default: 0, min: 0, max: 5 },
    comment: { type: String, trim: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date, default: Date.now },
  },
  cancellationRequets: {
    type: [
      {
        order: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order"
        },
        message : {
          type: String,
          default: "Customer Unavailable"
        },
        cancelledAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    default: []
  }
});
const DeliveryAgent = mongoose.models.DeliveryAgent || mongoose.model("DeliveryAgent", deliveryAgentSchema);
module.exports = DeliveryAgent;