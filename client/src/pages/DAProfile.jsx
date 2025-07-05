// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { User, Mail, Phone, MapPin, Car, Star, Package, CheckCircle, Edit, Save, X } from "lucide-react"

// export default function DeliveryAgentProfile() {
//   const [isEditing, setIsEditing] = useState(false)
//   const [profileData, setProfileData] = useState({
//     name: "John Doe",
//     email: "john.doe@example.com",
//     phone: "+91 9876543210",
//     address: "123 Main Street, Andheri West, Mumbai, Maharashtra 400058",
//     location: "mumbai",
//     pincode: "Andheri West, Mumbai",
//     vehicleDetails: "Honda Activa, MH12AB1234",
//     rating: 4.5,
//     ordersAccepted: 45,
//     ordersDelivered: 42,
//     isActive: true,
//   })

//   const [editData, setEditData] = useState({ ...profileData })

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setEditData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleSelectChange = (name, value) => {
//     setEditData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleSave = () => {
//     setProfileData({ ...editData })
//     setIsEditing(false)
//   }

//   const handleCancel = () => {
//     setEditData({ ...profileData })
//     setIsEditing(false)
//   }

//   const toggleActiveStatus = () => {
//     setProfileData((prev) => ({
//       ...prev,
//       isActive: !prev.isActive,
//     }))
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-900">Delivery Agent Profile</h1>
//           <div className="flex items-center space-x-4">
//             <Badge variant={profileData.isActive ? "default" : "secondary"}>
//               {profileData.isActive ? "Active" : "Inactive"}
//             </Badge>
//             <Button onClick={toggleActiveStatus} variant={profileData.isActive ? "destructive" : "default"}>
//               {profileData.isActive ? "Go Offline" : "Go Online"}
//             </Button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-4">
//                 <div className="p-3 bg-blue-100 rounded-full">
//                   <Package className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Orders Accepted</p>
//                   <p className="text-2xl font-bold text-gray-900">{profileData.ordersAccepted}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-4">
//                 <div className="p-3 bg-green-100 rounded-full">
//                   <CheckCircle className="h-6 w-6 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Orders Delivered</p>
//                   <p className="text-2xl font-bold text-gray-900">{profileData.ordersDelivered}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center space-x-4">
//                 <div className="p-3 bg-yellow-100 rounded-full">
//                   <Star className="h-6 w-6 text-yellow-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Rating</p>
//                   <div className="flex items-center space-x-1">
//                     <p className="text-2xl font-bold text-gray-900">{profileData.rating}</p>
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`h-4 w-4 ${
//                             i < Math.floor(profileData.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Profile Information */}
//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <div>
//                 <CardTitle>Profile Information</CardTitle>
//                 <CardDescription>Manage your personal and professional details</CardDescription>
//               </div>
//               {!isEditing ? (
//                 <Button onClick={() => setIsEditing(true)} variant="outline">
//                   <Edit className="h-4 w-4 mr-2" />
//                   Edit Profile
//                 </Button>
//               ) : (
//                 <div className="flex space-x-2">
//                   <Button onClick={handleSave} size="sm">
//                     <Save className="h-4 w-4 mr-2" />
//                     Save
//                   </Button>
//                   <Button onClick={handleCancel} variant="outline" size="sm">
//                     <X className="h-4 w-4 mr-2" />
//                     Cancel
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="name"
//                     name="name"
//                     value={isEditing ? editData.name : profileData.name}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                     className="pl-10"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="email"
//                     name="email"
//                     value={isEditing ? editData.email : profileData.email}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                     className="pl-10"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone Number</Label>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="phone"
//                   name="phone"
//                   value={isEditing ? editData.phone : profileData.phone}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                   className="pl-10"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="address">Address</Label>
//               <div className="relative">
//                 <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Textarea
//                   id="address"
//                   name="address"
//                   value={isEditing ? editData.address : profileData.address}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                   className="pl-10 min-h-[80px]"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="location">Service Location</Label>
//                 {isEditing ? (
//                   <Select value={editData.location} onValueChange={(value) => handleSelectChange("location", value)}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="mumbai">Mumbai</SelectItem>
//                       <SelectItem value="delhi">Delhi</SelectItem>
//                       <SelectItem value="bangalore">Bangalore</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 ) : (
//                   <Input
//                     value={profileData.location.charAt(0).toUpperCase() + profileData.location.slice(1)}
//                     disabled
//                   />
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="pincode">Current Location</Label>
//                 <Input
//                   id="pincode"
//                   name="pincode"
//                   value={isEditing ? editData.pincode : profileData.pincode}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="vehicleDetails">Vehicle Details</Label>
//               <div className="relative">
//                 <Car className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="vehicleDetails"
//                   name="vehicleDetails"
//                   value={isEditing ? editData.vehicleDetails : profileData.vehicleDetails}
//                   onChange={handleInputChange}
//                   disabled={!isEditing}
//                   className="pl-10"
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { User, Mail, Phone, MapPin, Car, Star, Package, CheckCircle, Edit, Save, X } from "lucide-react"

export default function DeliveryAgentProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    address: "123 Main Street, Andheri West, Mumbai, Maharashtra 400058",
    location: "mumbai",
    pincode: "Andheri West, Mumbai",
    vehicleDetails: "Honda Activa, MH12AB1234",
    rating: 4.5,
    ordersAccepted: 45,
    ordersDelivered: 42,
    isActive: true,
  })

  const [editData, setEditData] = useState({ ...profileData })

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
    setProfileData({ ...editData })
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Delivery Agent Profile</h1>
          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                profileData.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {profileData.isActive ? "Active" : "Inactive"}
            </span>
            <button
              onClick={toggleActiveStatus}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                profileData.isActive
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
                <p className="text-2xl font-bold text-gray-900">{profileData.ordersAccepted}</p>
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
                <p className="text-2xl font-bold text-gray-900">{profileData.ordersDelivered}</p>
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
                        className={`h-4 w-4 ${
                          i < Math.floor(profileData.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                    className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                      isEditing
                        ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    value={isEditing ? editData.email : profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                      isEditing
                        ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
              </div>
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
                  className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                    isEditing
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
                  className={`w-full pl-10 pr-3 py-2 border rounded-md resize-none ${
                    isEditing
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
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="bangalore">Bangalore</option>
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
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing
                      ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="vehicleDetails" className="block text-sm font-medium text-gray-700">
                Vehicle Details
              </label>
              <div className="relative">
                <Car className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="vehicleDetails"
                  name="vehicleDetails"
                  value={isEditing ? editData.vehicleDetails : profileData.vehicleDetails}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                    isEditing
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
