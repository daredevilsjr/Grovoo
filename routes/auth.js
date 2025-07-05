const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const sendEmail = require("../scripts/sendEmail");
const bcrypt = require("bcryptjs");
const { randomBytes } = require("crypto");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, address, location } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role: role || "hotel",
      phone,
      address,
      location: location || "mumbai",
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    // Find user
    // console.log("Login attempt with email:", email, "and phone:", phone);
    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone is required" });
    }
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    }
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log("User found:", user);
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    return res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        location: req.user.location,
        isEmailVerified: req.user.isEmailVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }
    const user = await User.findOne({ email }).select(
      "+passwordResetToken +passwordResetExpires"
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${token}`;
    const referer = req.headers.referer;
    let origin;

    if (referer && referer.startsWith("http://localhost:3000")) {
      origin = referer.replace(/\/forgot-password.*/, "");
    } else if (
      req.headers.origin &&
      req.headers.origin !== "http://localhost:5000"
    ) {
      origin = req.headers.origin;
    } else {
      origin = `${req.protocol}://${req.get("host")}`;
    }
    const resetUrl = `${origin}/reset-password/${token}`;
    console.log("Password: ", origin, resetUrl);
    // Send email with resetUrl
    await sendEmail(
      email,
      "Reset Your Password",
      `<p>You requested to reset your password. Click the link below:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>`
    );

    return res.status(200).json({
      success: true,
      message: `Password reset link sent to ${email}`,
      resetUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Please provide a token and a new password" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let profile = {};
    profile.name = user.name;
    profile.email = user.email;
    profile.role = user.role;
    profile.phone = user.phone;
    profile.address = user.address;
    profile.location = user.location;
    profile.gstin = user.gstin;
    profile.isEmailVerified = user.isEmailVerified;
    profile.joined = user.createdAt;
    return res.json({ profile: profile });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching profile" });
  }
});

function generateSecureString(length = 8) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(length);
  return Array.from(bytes, b => alphabet[b % alphabet.length]).join('');
}

router.get("/send-otp", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if( user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate OTP
    const otp = generateSecureString(6);
    user.otp = otp;
    await user.save();
    await sendEmail(
      user.email,
      "Your OTP Code",
      `<p>Your OTP code is: <strong>${otp}</strong></p>`
    );

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Server error while sending OTP" });
  }
});

router.post("/verify-otp", auth, async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    return res.status(400).json({ message: "OTP code is required" });
  }
  // Verify the authentication code
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const verifyCode = user.otp;
    if (!verifyCode || verifyCode === "" || verifyCode === undefined) {
      return res.status(400).json({ message: "Not Verified. TRY AGAIN." });
    }
    if (otp == verifyCode) {
      user.isEmailVerified = true;
      user.otp = undefined; // Clear OTP after successful verification
      await user.save();
      return res.status(200).json({ success: true, message: "OTP verified successfully" });
    }
    return res.status(400).json({ message: "Invalid or expired otp code" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired otp code" });
  }
});

module.exports = router;
