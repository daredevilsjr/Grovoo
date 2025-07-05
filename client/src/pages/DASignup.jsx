// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { User, Mail, Phone, MapPin, Car, Lock } from "lucide-react"

// export default function DeliveryAgentSignup({ onSignupSuccess }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",
//     address: "",
//     location: "",
//     pincode: "",
//     vehicleDetails: "",
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const [errors, setErrors] = useState({})

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }))
//     }
//   }

//   const handleSelectChange = (name, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }))
//     }
//   }

//   const validateForm = () => {
//     const newErrors = {}

//     if (!formData.name.trim()) newErrors.name = "Name is required"
//     if (!formData.email.trim()) newErrors.email = "Email is required"
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
//     if (!formData.password) newErrors.password = "Password is required"
//     else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
//     if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
//     if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
//     else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) newErrors.phone = "Phone number must be 10 digits"
//     if (!formData.address.trim()) newErrors.address = "Address is required"
//     if (!formData.location) newErrors.location = "Location is required"
//     if (!formData.pincode.trim()) newErrors.pincode = "Current location is required"
//     if (!formData.vehicleDetails.trim()) newErrors.vehicleDetails = "Vehicle details are required"

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!validateForm()) return

//     setIsLoading(true)

//     // Simulate API call
//     setTimeout(() => {
//       console.log("Delivery agent signup data:", formData)
//       setIsLoading(false)
//       onSignupSuccess()
//     }, 2000)
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <Card className="w-full max-w-2xl">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-bold">Delivery Agent Signup</CardTitle>
//           <CardDescription>Join our delivery network and start earning today</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="name"
//                     name="name"
//                     type="text"
//                     placeholder="Enter your full name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
//                   />
//                 </div>
//                 {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="Enter your email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
//                   />
//                 </div>
//                 {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="password"
//                     name="password"
//                     type="password"
//                     placeholder="Enter password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
//                   />
//                 </div>
//                 {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type="password"
//                     placeholder="Confirm password"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
//                   />
//                 </div>
//                 {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone Number</Label>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   placeholder="Enter your phone number"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
//                 />
//               </div>
//               {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="address">Address</Label>
//               <div className="relative">
//                 <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Textarea
//                   id="address"
//                   name="address"
//                   placeholder="Enter your full address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   className={`pl-10 min-h-[80px] ${errors.address ? "border-red-500" : ""}`}
//                 />
//               </div>
//               {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="location">Service Location</Label>
//                 <Select onValueChange={(value) => handleSelectChange("location", value)}>
//                   <SelectTrigger className={errors.location ? "border-red-500" : ""}>
//                     <SelectValue placeholder="Select your service location" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="mumbai">Mumbai</SelectItem>
//                     <SelectItem value="delhi">Delhi</SelectItem>
//                     <SelectItem value="bangalore">Bangalore</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="pincode">Current Location</Label>
//                 <Input
//                   id="pincode"
//                   name="pincode"
//                   type="text"
//                   placeholder="Enter your current location"
//                   value={formData.pincode}
//                   onChange={handleInputChange}
//                   className={errors.pincode ? "border-red-500" : ""}
//                 />
//                 {errors.pincode && <p className="text-sm text-red-500">{errors.pincode}</p>}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="vehicleDetails">Vehicle Details</Label>
//               <div className="relative">
//                 <Car className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="vehicleDetails"
//                   name="vehicleDetails"
//                   type="text"
//                   placeholder="e.g., Honda Activa, MH12AB1234"
//                   value={formData.vehicleDetails}
//                   onChange={handleInputChange}
//                   className={`pl-10 ${errors.vehicleDetails ? "border-red-500" : ""}`}
//                 />
//               </div>
//               {errors.vehicleDetails && <p className="text-sm text-red-500">{errors.vehicleDetails}</p>}
//             </div>

//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? "Creating Account..." : "Sign Up as Delivery Agent"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import { User, Mail, Phone, MapPin, Car, Lock } from "lucide-react"

export default function DeliveryAgentSignup({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    location: "",
    pincode: "",
    vehicleDetails: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) newErrors.phone = "Phone number must be 10 digits"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.location) newErrors.location = "Location is required"
    if (!formData.pincode.trim()) newErrors.pincode = "Current location is required"
    if (!formData.vehicleDetails.trim()) newErrors.vehicleDetails = "Vehicle details are required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Delivery agent signup data:", formData)
      setIsLoading(false)
      onSignupSuccess()
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-6 text-center border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Delivery Agent Signup</h2>
          <p className="text-gray-600 mt-2">Join our delivery network and start earning today</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
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
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
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
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Service Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={(e) => handleSelectChange("location", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select your service location</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="bangalore">Bangalore</option>
                </select>
                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                  Current Location
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  placeholder="Enter your current location"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.pincode ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.pincode && <p className="text-sm text-red-500">{errors.pincode}</p>}
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
                  type="text"
                  placeholder="e.g., Honda Activa, MH12AB1234"
                  value={formData.vehicleDetails}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.vehicleDetails ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.vehicleDetails && <p className="text-sm text-red-500">{errors.vehicleDetails}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Creating Account..." : "Sign Up as Delivery Agent"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
