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
    unit: {
      type: String,
      enum: ["kg", "liter", "piece", "gram"],
      default: "kg",
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      mumbai: {
        type: Number,
        required: true,
        min: 0,
      },
      delhi: {
        type: Number,
        required: true,
        min: 0,
      },
      bangalore: {
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

module.exports = mongoose.model("Product", productSchema)
