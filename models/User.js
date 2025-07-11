const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["hotel", "admin", "delivery","owner"],
      // default: "hotel",
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    otp: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      enum: ["patna"],
      default: "patna",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    adminVerificationStatus:{
      type: Boolean,
      default: false,
    },
    passwordResetToken: {
      type: String,
    },
    businessType: {
      type: String,
      default: "hotel",
    },
    businessName: {
      type: String,
      default: "1StopMandi Associated Bussiness"
    },
    licenseNumber: {
      type: String,
      default: "",
    },
    gstin: {
      type: String,
      trim: true,
    },
    passwordResetExpires: {
      type: Date,
    },
    deliveryAddresses: [
      {
        label: String, // e.g., "Home", "Work"
        address: String,
        city: String,
        pincode: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
