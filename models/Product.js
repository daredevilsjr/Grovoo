const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Vegetables", "Fruits", "Dairy", "Non-Veg", "Grains", "Spices", "Oils", "Beverages"],
    },
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    unit: {
      type: String,
      enum: ["kg", "liter", "piece", "packet"],
      default: "kg",
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      patna: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for search functionality
productSchema.index({ name: "text", description: "text" })

// Virtual for checking if product is low stock
productSchema.virtual("isLowStock").get(function () {
  return this.stock <= 5 && this.stock > 0
})

// Virtual for checking if product is out of stock
productSchema.virtual("isOutOfStock").get(function () {
  return this.stock === 0
})

module.exports = mongoose.model("Product", productSchema)
