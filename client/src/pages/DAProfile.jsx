"use client"

import { useEffect, useState } from "react"
import { User, Mail, Phone, MapPin, Car, Star, Package, CheckCircle, Edit, Save, X } from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"

export default function DeliveryAgentProfile() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState(null)
  const [isVerified, setIsVerified] = useState(false)
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    location: "",
    pincode: "841405",
    vehicleDetails: {},
    rating: 0,
    ordersAccepted: 0,
    ordersDelivered: 0,
    isActive: false,
    agentVerified: false,
  })

  const sendOtp = async () => {
    try {
      const response = await axios.get("/api/auth/send-otp", { withCredentials: true });
      console.log("response", response);
      if (response.data.success) {
        // setAuthenticationCode(response.data.authenticationCode);
        setIsDialogOpen(true);
        console.log("OTP sent successfully");
      }
    }
    catch (err) {
      setVerificationError("Some Error Occurred. Please try again later.");
      console.log(err);
    }
  }

  const verifyOtp = async () => {
    setIsVerifying(true)
    try {
      const response = await axios.post("/api/auth/verify-otp", { otp }, { withCredentials: true });
      if (response.data.success) {
        setOtp("")
        setIsVerified(true)
        closeDialog();
        toast.success("Email verified successfully!");
      }
    }
    catch (error) {
      console.error("Error verifying email:", error)
      setVerificationError("Invalid OTP. Please try again.")
    } finally { setIsVerifying(false); }
  }
  const [refetch, setRefetch] = useState(false);


  useEffect(() => {
    const fetchProfileData = async () => {
      const response = await axios.get("/api/auth/profile", { withCredentials: true });
      if (response.data.success) {
        // console.log(response.data);
        const profile = response.data.profile;
        setProfileData({ ...profile.user, agentVerified: profile.agentVerified, vehicleDetails: profile.vehicleDetails, ordersAccepted: profile.ordersAccepted, ordersDelivered: profile.ordersDelivered, rating: profile.rating });
        setIsVerified(profile.user.isEmailVerified);
      }
    }
    fetchProfileData();
  }, [refetch])

  const [editData, setEditData] = useState({ ...profileData })

  useEffect(() => { setEditData({ ...profileData }) }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    setIsEditing(true);
    setProfileData({ ...editData })
    const updateProfile = async () => {
      const response = await axios.put("/api/auth/profile", editData, { withCredentials: true });
      if (response.data.success) {
        toast.success("Profile updated successfully!");
      }
      else toast.error("Something went wrong!");
      setRefetch(true);
      setIsEditing(false)
    }
    updateProfile();
    setIsEditing(false)
  }
  const handleCancel = () => {
    setEditData({ ...profileData })
    setIsEditing(false)
  }

  const toggleActiveStatus = () => {
    setProfileData((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-4 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Delivery Agent Profile</h1>
          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${profileData?.agentVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-gray-800"
                }`}
            >
              {profileData.agentVerified ? "Agent Verified" : "Verifiaction Pending"}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${profileData?.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
            >
              {profileData.isActive ? "Active" : "Inactive"}
            </span>
            <button
              onClick={toggleActiveStatus}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${profileData.isActive
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
              {profileData.isActive ? "Go Offline" : "Go Online"}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Orders Accepted</p>
                <p className="text-2xl font-bold text-gray-900">{profileData.ordersAccepted?.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Orders Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{profileData.ordersDelivered?.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <div className="flex items-center space-x-1">
                  <p className="text-2xl font-bold text-gray-900">{profileData.rating}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(profileData.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                <p className="text-gray-600 mt-1">Manage your personal and professional details</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="py-2.5 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    value={isEditing ? editData.name : profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md ${isEditing
                      ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      : "border-gray-200 bg-gray-50"
                      }`}
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                {/* Flex container for label and button */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-purple-600" />
                    Email Address
                  </label>
                  <button
                    onClick={() => {
                      sendOtp();
                      setIsDialogOpen((p) => !p);
                    }}
                    disabled={isVerified || isVerifying}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isVerified
                      ? "bg-green-100 text-green-600 cursor-not-allowed"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                  >
                    {isVerified ? "Verified" : "Not Verified"}
                  </button>
                </div>
                {/* Input below */}
                <input
                  id="email"
                  name="email"
                  value={profileData.email}
                  // onChange={handleInputChange}
                  disabled
                  className={`w-full pl-10 pr-3 py-2 border rounded-md "border-gray-200 bg-gray-50"`}
                // className={`w-full pl-10 pr-3 py-2 border rounded-md ${isEditing
                //   ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                //   : "border-gray-200 bg-gray-50"
                //   }`}
                />
              </div>
              {isDialogOpen && (
                <div
                  className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
                  onClick={closeDialog}
                >
                  <div
                    className="bg-white text-gray-800 rounded-xl shadow-xl p-6 w-full max-w-sm relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={closeDialog}
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                    >
                      ✖
                    </button>

                    <h2 className="text-lg font-semibold mb-4 text-center">Verify Your Email</h2>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        verifyOtp(); // your OTP verification logic
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Enter OTP sent to {profileData?.email}
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          disabled={isVerifying}
                          required
                          placeholder="Enter OTP Code"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        />
                      </div>
                      {verificationError && <div>{JSON.stringify(verificationError)}</div>}
                      <button
                        type="submit"
                        disabled={isVerifying}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isVerifying ? "Verifying..." : "Verify Email"}
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  value={isEditing ? editData.phone : profileData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md ${isEditing
                    ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-200 bg-gray-50"
                    }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  id="address"
                  name="address"
                  value={isEditing ? editData.address : profileData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={3}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md resize-none ${isEditing
                    ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-200 bg-gray-50"
                    }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Service Location
                </label>
                {isEditing ? (
                  <select
                    value={editData.location}
                    onChange={(e) => handleSelectChange("location", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="patna">patna</option>
                    {/* <option value="delhi">Delhi</option>
                    <option value="bangalore">Bangalore</option> */}
                  </select>
                ) : (
                  <input
                    value={profileData.location.charAt(0).toUpperCase() + profileData.location.slice(1)}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                  Current Location
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  value={isEditing ? editData.pincode : profileData.pincode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${isEditing
                    ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-200 bg-gray-50"
                    }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center ">
                <label htmlFor="vehicleDetails" className="block text-sm font-medium text-gray-700 pr-4">
                  Vehicle Details
                </label>
                <span
                  className={`px-3 rounded-full text-sm font-medium ${profileData?.vehicleDetails?.isVehicleVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-gray-800"
                    }`}
                >
                  {profileData.vehicleDetails?.isVehicleVerified ? "Verified" : "Verification Pending"}
                </span>
              </div>
              <div className="relative">
                <Car className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={
                    isEditing
                      ? editData.vehicleDetails?.vehicleNumber
                      : profileData.vehicleDetails?.vehicleNumber
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md ${isEditing
                      ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      : "border-gray-200 bg-gray-50"
                    }`}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
