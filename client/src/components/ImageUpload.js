"use client"

import { useState, useRef } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useUIStore } from "../store/useStore"

const ImageUpload = ({ onImageUpload, currentImage = null }) => {
  const [preview, setPreview] = useState(currentImage)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const { setUploadingImage } = useUIStore()

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)

    // Upload to Cloudinary
    await uploadImage(file)
  }

  const uploadImage = async (file) => {
    setUploading(true)
    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await axios.post("/api/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const { imageUrl, publicId } = response.data
      onImageUpload(imageUrl, publicId)
      toast.success("Image uploaded successfully!")
    } catch (error) {
      console.error("Upload error:", error)
      const message = error.response?.data?.message || "Failed to upload image"
      toast.error(message)
      setPreview(currentImage) // Reset preview on error
    } finally {
      setUploading(false)
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageUpload(null, null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Product Image</label>

      {preview ? (
        <div className="relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <div className="absolute top-2 right-2 space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              disabled={uploading}
            >
              <i className="fas fa-edit text-sm"></i>
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
              disabled={uploading}
            >
              <i className="fas fa-trash text-sm"></i>
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white text-center">
                <div className="loading-spinner mx-auto mb-2"></div>
                <p className="text-sm">Uploading...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
          <p className="text-gray-600 text-center">
            <span className="font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-gray-500 text-sm">PNG, JPG, WEBP up to 5MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {uploading && (
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <div className="loading-spinner"></div>
          <span className="text-sm">Uploading image...</span>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
