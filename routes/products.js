const express = require("express")
const Product = require("../models/Product")
const { auth, adminAuth } = require("../middleware/auth")

const router = express.Router()

// Get all products
router.get("/", async (req, res) => {
  try {
    const { category, search, sort, location } = req.query
    const query = { isActive: true }

    // Filter by category
    if (category && category !== "all") {
      query.category = category
    }

    // Search functionality
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    let products = await Product.find(query).populate("createdBy", "name")

    // Sort products
    if (sort === "price" && location) {
      products = products.sort((a, b) => a.price[location] - b.price[location])
    } else if (sort === "name") {
      products = products.sort((a, b) => a.name.localeCompare(b.name))
    }

    res.json(products)
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("createdBy", "name")

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Create product (Admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user._id,
    }

    const product = new Product(productData)
    await product.save()

    res.status(201).json(product)
  } catch (error) {
    console.error("Create product error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update product (Admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Find the product first
    const existingProduct = await Product.findById(id)
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Update the product
    const product = await Product.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("createdBy", "name")

    res.json(product)
  } catch (error) {
    console.error("Update product error:", error)
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: "Validation error", errors })
    }
    res.status(500).json({ message: "Server error" })
  }
})

// Delete product (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Bulk update products (Admin only)
router.patch("/bulk-update", adminAuth, async (req, res) => {
  try {
    const { productIds, updateData } = req.body

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "Product IDs are required" })
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds }, isActive: true },
      { ...updateData, updatedAt: new Date() },
    )

    res.json({
      message: `${result.modifiedCount} products updated successfully`,
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    console.error("Bulk update error:", error)
    res.status(500).json({ message: "Server error" })
  }
})
router.post("/bulk", async (req, res) => {
  try {
    const { ids } = req.body;

    // Validate input
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids must be a non-empty array" });
    }

    // Grab only active products whose _id is in the list
    const products = await Product.find({
      _id: { $in: ids },
      isActive: true,
    }).populate("createdBy", "name");

    res.json(products);
  } catch (err) {
    console.error("Bulk fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update product stock (Admin only)
router.patch("/:id/stock", adminAuth, async (req, res) => {
  try {
    const { stock } = req.body

    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({ message: "Valid stock quantity is required" })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock, updatedAt: new Date() },
      { new: true, runValidators: true },
    )

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error("Update stock error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
