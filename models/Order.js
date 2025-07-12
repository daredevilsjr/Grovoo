const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
})

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    confirmationOtp: {
      type: String,
      // required: true,
    },
    deliveryAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAgent",
      default: null,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    cancellation: {
      type: {
        requested: {
          type: Boolean,
          default: false,
        },
        reason: {
          type: String,
        }
      }
    }
    ,
    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod"],
      default: "razorpay",
    },
    location: {
      type: String,
      enum: ["patna"],
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    estimatedDelivery: {
      type: Date,
    },
    notes: {
      type: String,
    },
    // Razorpay specific fields
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
    paymentError: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Order", orderSchema)
