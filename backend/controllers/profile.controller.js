const User = require("../models/user.model");
const Market = require("../models/communitymarket.model");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer"); //ONLY SUPPORT GMAIL

require("dotenv").config();

// Configure Nodemailer SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use `true` for 465, `false` for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generate a random 6-digit verification code
const generateVerificationCode = () =>
  Math.floor(100000 + Math.random() * 900000);

// Store codes temporarily in memory (for simplicity)
const verificationCodes = {};

// Send verification email via Resend
const sendVerificationEmail = async (email, code) => {
  try {
    await transporter.sendMail({
      from: `"L&B Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset Verification Code",
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// Request password reset (sends verification code)
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received request for password reset:", email); // Debugging

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const code = generateVerificationCode();
    verificationCodes[email] = code;
    console.log("Generated code:", code); // Debugging

    await sendVerificationEmail(email, code);

    res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    console.error("❌ Error processing request:", error);
    res.status(500).json({ message: "Error processing request" });
  }
};

// Verify the code and reset the password
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (verificationCodes[email] !== parseInt(code))
      return res.status(400).json({ message: "Invalid verification code" });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    delete verificationCodes[email];

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email, newData } = req.body; // Get user email & updated data from request body

    newData.updatedAt = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);

    const user = await User.findOneAndUpdate({ email }, newData, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

const getlistings = async (req, res) => {
  try {
    const { userEmail } = req.params;

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required." });
    }

    const products = await Market.find({ userEmail }).sort({ createdAt: -1 });

    const productsWithUserDetails = await Promise.all(
      products.map(async (product) => {
        const user = await User.findOne({ email: product.userEmail }).select(
          "username avatar"
        );

        return {
          ...product.toObject(),
          username: user ? user.username : "Unknown User",
          userAvatar: user ? user.avatar : "/profilePics/default_user.png",
        };
      })
    );

    res.status(200).json(productsWithUserDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  requestPasswordReset,
  resetPassword,
  updateProfile,
  getlistings,
};
