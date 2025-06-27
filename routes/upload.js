const express = require("express")
const { upload } = require("../config/cloudinary")
const { adminAuth } = require("../middleware/auth")

const router = express.Router()

// Upload single image
router.post("/image", adminAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" })
    }

    res.json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path,
      publicId: req.file.filename,
    })
  } catch (error) {
    console.error("Image upload error:", error)
    res.status(500).json({ message: "Failed to upload image" })
  }
})

// Delete image
router.delete("/image/:publicId", adminAuth, async (req, res) => {
  try {
    const { cloudinary } = require("../config/cloudinary")
    const result = await cloudinary.uploader.destroy(req.params.publicId)

    if (result.result === "ok") {
      res.json({ message: "Image deleted successfully" })
    } else {
      res.status(400).json({ message: "Failed to delete image" })
    }
  } catch (error) {
    console.error("Image delete error:", error)
    res.status(500).json({ message: "Failed to delete image" })
  }
})

module.exports = router
