"use client"

import { useState } from "react"
import {
    User,
    Mail,
    Phone,
    Building,
    Truck,
    Shield,
    Calendar,
    Clock,
    Star,
    Edit,
    Camera,
    MapPin,
    Award,
    Settings,
    Bell,
    Globe,
    X,
    Check,
    ChevronDown,
} from "lucide-react"

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)
    const [activeTab, setActiveTab] = useState("personal")
    const [dropdownOpen, setDropdownOpen] = useState({})

    const [profileData, setProfileData] = useState({
        name: "Abhinav Singh",
        email: "abhisar@freshmart.com",
        phone: "+91 98765 43210",
        role: "hotel",
        address: "123 Business District, Mumbai, Maharashtra 400001",
        businessName: "Singh's Restaurant",
        gstNumber: "27ABCDE1234F1Z5",
        licenseNumber: "FSSAI-12345678901234",
        joinDate: "2023-01-15",
        lastActive: "2024-01-15 10:30 AM",
        rating: 4.8,
        totalOrders: 156,
        status: "active",
        businessType: "restaurant",
        vehicleType: "bike",
        vehicleNumber: "MH 01 AB 1234",
        drivingLicense: "MH1234567890",
        deliveryZone: "Andheri, Bandra, Juhu",
        language: "english",
        timezone: "ist",
        emailNotifications: true,
        smsNotifications: true,
        orderUpdates: true,
        marketingEmails: false,
    })

    const [originalData, setOriginalData] = useState({ ...profileData })

    const handleSave = () => {
        setIsEditing(false)
        setHasChanges(false)
        setOriginalData({ ...profileData })
        console.log("Profile saved:", profileData)
    }

    const handleCancel = () => {
        setProfileData({ ...originalData })
        setIsEditing(false)
        setHasChanges(false)
    }

    const handleInputChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }))
        setHasChanges(true)
    }

    const toggleDropdown = (name) => {
        setDropdownOpen((prev) => ({
            ...prev,
            [name]: !prev[name],
        }))
    }

    const selectOption = (field, value, dropdownName) => {
        handleInputChange(field, value)
        setDropdownOpen((prev) => ({
            ...prev,
            [dropdownName]: false,
        }))
    }

    const getRoleColor = (role) => {
        switch (role) {
            case "admin":
                return "bg-red-50 text-red-700 border-red-200"
            case "hotel":
                return "bg-blue-50 text-blue-700 border-blue-200"
            case "delivery":
                return "bg-green-50 text-green-700 border-green-200"
            default:
                return "bg-gray-50 text-gray-700 border-gray-200"
        }
    }

    const getRoleIcon = (role) => {
        switch (role) {
            case "admin":
                return <Shield className="w-4 h-4" />
            case "hotel":
                return <Building className="w-4 h-4" />
            case "delivery":
                return <Truck className="w-4 h-4" />
            default:
                return <User className="w-4 h-4" />
        }
    }

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    const getDisplayValue = (field) => {
        const values = {
            role: { admin: "Admin", hotel: "Hotel/Restaurant", delivery: "Delivery Agent" },
            businessType: {
                restaurant: "Restaurant",
                hotel: "Hotel",
                cafe: "Cafe",
                catering: "Catering Service",
                "cloud-kitchen": "Cloud Kitchen",
            },
            vehicleType: { bike: "Motorcycle", scooter: "Scooter", bicycle: "Bicycle", van: "Van" },
            language: { english: "English", hindi: "Hindi", marathi: "Marathi", gujarati: "Gujarati" },
            timezone: { ist: "IST (UTC+5:30)", utc: "UTC" },
        }
        return values[field]?.[profileData[field]] || profileData[field]
    }

    // Custom Components
    const Button = ({ children, onClick, variant = "primary", disabled = false, className = "" }) => {
        const baseClasses =
            "px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
        const variants = {
            primary: "bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300",
            secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:bg-gray-100",
            success: "bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300",
            outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent disabled:bg-gray-50",
        }

        return (
            <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]} ${className}`}>
                {children}
            </button>
        )
    }

    const Input = ({ value, onChange, disabled = false, type = "text", placeholder = "", className = "" }) => {
        return (
            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full h-12 px-4 border rounded-lg transition-colors duration-200 ${disabled
                        ? "bg-gray-50 border-gray-200 text-gray-500"
                        : "bg-white border-purple-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    } ${className}`}
            />
        )
    }

    const Textarea = ({ value, onChange, disabled = false, placeholder = "", className = "" }) => {
        return (
            <textarea
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 resize-none ${disabled
                        ? "bg-gray-50 border-gray-200 text-gray-500"
                        : "bg-white border-purple-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    } ${className}`}
            />
        )
    }

    const Select = ({ value, onChange, options, disabled = false, placeholder = "Select option", name }) => {
        const isOpen = dropdownOpen[name]

        return (
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && toggleDropdown(name)}
                    disabled={disabled}
                    className={`w-full h-12 px-4 border rounded-lg flex items-center justify-between transition-colors duration-200 ${disabled
                            ? "bg-gray-50 border-gray-200 text-gray-500"
                            : "bg-white border-purple-300 hover:border-purple-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        }`}
                >
                    <span>{getDisplayValue(name) || placeholder}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && !disabled && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => selectOption(name, option.value, name)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    const Switch = ({ checked, onChange, disabled = false }) => {
        return (
            <button
                type="button"
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${checked ? "bg-purple-600" : "bg-gray-200"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-1"
                        }`}
                />
            </button>
        )
    }

    const Badge = ({ children, className = "" }) => {
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${className}`}>
                {children}
            </span>
        )
    }

    const Avatar = ({ src, alt, size = "w-32 h-32", children }) => {
        return (
            <div
                className={`${size} rounded-full overflow-hidden border-4 border-purple-100 bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center`}
            >
                {src ? (
                    <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-white text-3xl font-bold">{children}</span>
                )}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="">
                        {/* <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">FM</span>
                            </div>
                            <div>
                                <span className="text-gray-900 font-bold text-xl">FreshMart</span>
                                <p className="text-gray-500 text-sm">Profile Management</p>
                            </div>
                        </div> */}

                        
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Profile Header Card */}
                    <div className="mb-8 bg-white rounded-xl shadow-lg border-0 p-8">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                            <div className="relative">
                                <Avatar src="/placeholder.svg?height=128&width=128" alt={profileData.name}>
                                    {getInitials(profileData.name)}
                                </Avatar>
                                {isEditing && (
                                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 w-full">
                                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between mb-6">
                                    <div className="mb-4 xl:mb-0">
                                        {isEditing ? (
                                            <Input
                                                value={profileData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                className="text-3xl font-bold border-0 p-0 h-auto bg-transparent focus:ring-0"
                                            />
                                        ) : (
                                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData.name}</h1>
                                        )}

                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <Badge className={`${getRoleColor(profileData.role)} flex items-center space-x-1`}>
                                                {getRoleIcon(profileData.role)}
                                                <span className="capitalize font-medium">{getDisplayValue("role")}</span>
                                            </Badge>
                                            <Badge className="text-green-600 border-green-200 bg-green-50">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                Active
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-6">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center space-x-1 mb-1">
                                                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                                <span className="text-2xl font-bold text-gray-900">{profileData.rating}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">Rating</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center justify-center space-x-1 mb-1">
                                                <Award className="w-5 h-5 text-purple-600" />
                                                <span className="text-2xl font-bold text-gray-900">{profileData.totalOrders}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">Orders</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <Mail className="w-5 h-5 text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium text-gray-900">{profileData.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <Phone className="w-5 h-5 text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium text-gray-900">{profileData.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Member Since</p>
                                            <p className="font-medium text-gray-900">{new Date(profileData.joinDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <Clock className="w-5 h-5 text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Last Active</p>
                                            <p className="font-medium text-gray-900">{profileData.lastActive}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 p-1 rounded-lg grid grid-cols-3">
                            {[
                                { id: "personal", label: "Personal Info", icon: User },
                                { id: "business", label: "Business Details", icon: Building },
                                { id: "preferences", label: "Preferences", icon: Settings },
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`py-3 px-6 rounded-md font-medium transition-colors duration-200 flex items-center justify-center ${activeTab === id ? "bg-purple-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Personal Info Tab */}
                        {activeTab === "personal" && (
                            <div className="bg-white rounded-xl shadow-lg border-0">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <User className="w-6 h-6 mr-3 text-purple-600" />
                                        Personal Information
                                    </h2>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                            <Input
                                                value={profileData.name}
                                                disabled={!isEditing}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700">Role</label>
                                            <Select
                                                value={profileData.role}
                                                disabled={!isEditing}
                                                name="role"
                                                options={[
                                                    { value: "admin", label: "Admin" },
                                                    { value: "hotel", label: "Hotel/Restaurant" },
                                                    { value: "delivery", label: "Delivery Agent" },
                                                ]}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                            <Input
                                                type="email"
                                                value={profileData.email}
                                                disabled={!isEditing}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                                            <Input
                                                value={profileData.phone}
                                                disabled={!isEditing}
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            Address
                                        </label>
                                        <Textarea
                                            value={profileData.address}
                                            disabled={!isEditing}
                                            onChange={(e) => handleInputChange("address", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Business Details Tab */}
                        {activeTab === "business" && (
                            <div className="bg-white rounded-xl shadow-lg border-0">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <Building className="w-6 h-6 mr-3 text-purple-600" />
                                        Business Information
                                    </h2>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700">Business Name</label>
                                            <Input
                                                value={profileData.businessName}
                                                disabled={!isEditing}
                                                onChange={(e) => handleInputChange("businessName", e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700">Business Type</label>
                                            <Select
                                                value={profileData.businessType}
                                                disabled={!isEditing}
                                                name="businessType"
                                                options={[
                                                    { value: "restaurant", label: "Restaurant" },
                                                    { value: "hotel", label: "Hotel" },
                                                    { value: "cafe", label: "Cafe" },
                                                    { value: "catering", label: "Catering Service" },
                                                    { value: "cloud-kitchen", label: "Cloud Kitchen" },
                                                ]}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700">GST Number</label>
                                            <Input
                                                value={profileData.gstNumber}
                                                disabled={!isEditing}
                                                onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700">License Number</label>
                                            <Input
                                                value={profileData.licenseNumber}
                                                disabled={!isEditing}
                                                onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {profileData.role === "delivery" && (
                                        <div className="pt-6 border-t border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                                <Truck className="w-5 h-5 mr-2 text-purple-600" />
                                                Delivery Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">Vehicle Type</label>
                                                    <Select
                                                        value={profileData.vehicleType}
                                                        disabled={!isEditing}
                                                        name="vehicleType"
                                                        options={[
                                                            { value: "bike", label: "Motorcycle" },
                                                            { value: "scooter", label: "Scooter" },
                                                            { value: "bicycle", label: "Bicycle" },
                                                            { value: "van", label: "Van" },
                                                        ]}
                                                    />
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">Vehicle Number</label>
                                                    <Input
                                                        value={profileData.vehicleNumber}
                                                        disabled={!isEditing}
                                                        onChange={(e) => handleInputChange("vehicleNumber", e.target.value)}
                                                    />
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">Driving License</label>
                                                    <Input
                                                        value={profileData.drivingLicense}
                                                        disabled={!isEditing}
                                                        onChange={(e) => handleInputChange("drivingLicense", e.target.value)}
                                                    />
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-sm font-semibold text-gray-700">Delivery Zone</label>
                                                    <Input
                                                        value={profileData.deliveryZone}
                                                        disabled={!isEditing}
                                                        onChange={(e) => handleInputChange("deliveryZone", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === "preferences" && (
                            <div className="bg-white rounded-xl shadow-lg border-0">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <Settings className="w-6 h-6 mr-3 text-purple-600" />
                                        Account Preferences
                                    </h2>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center">
                                                <Globe className="w-4 h-4 mr-2" />
                                                Preferred Language
                                            </label>
                                            <Select
                                                value={profileData.language}
                                                disabled={!isEditing}
                                                name="language"
                                                options={[
                                                    { value: "english", label: "English" },
                                                    { value: "hindi", label: "Hindi" },
                                                    { value: "marathi", label: "Marathi" },
                                                    { value: "gujarati", label: "Gujarati" },
                                                ]}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center">
                                                <Clock className="w-4 h-4 mr-2" />
                                                Timezone
                                            </label>
                                            <Select
                                                value={profileData.timezone}
                                                disabled={!isEditing}
                                                name="timezone"
                                                options={[
                                                    { value: "ist", label: "IST (UTC+5:30)" },
                                                    { value: "utc", label: "UTC" },
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                            <Bell className="w-5 h-5 mr-2 text-purple-600" />
                                            Notification Settings
                                        </h3>
                                        <div className="space-y-6">
                                            {[
                                                {
                                                    key: "emailNotifications",
                                                    label: "Email Notifications",
                                                    desc: "Receive notifications via email",
                                                },
                                                { key: "smsNotifications", label: "SMS Notifications", desc: "Receive notifications via SMS" },
                                                {
                                                    key: "orderUpdates",
                                                    label: "Order Updates",
                                                    desc: "Get notified about order status changes",
                                                },
                                                {
                                                    key: "marketingEmails",
                                                    label: "Marketing Emails",
                                                    desc: "Receive promotional offers and updates",
                                                },
                                            ].map(({ key, label, desc }) => (
                                                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-900">{label}</label>
                                                        <p className="text-sm text-gray-500">{desc}</p>
                                                    </div>
                                                    <Switch
                                                        checked={profileData[key]}
                                                        disabled={!isEditing}
                                                        onChange={(checked) => handleInputChange(key, checked)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-3">
                            {isEditing && hasChanges && (
                                <Button variant="outline" onClick={handleCancel}>
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                            )}
                            <Button
                                variant={isEditing ? "success" : "primary"}
                                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                            >
                                {isEditing ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                ) : (
                                    <>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </>
                                )}
                            </Button>
                        </div>
                </div>
            </div>
        </div>
    )
}
