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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.oauthProvider === "Google") {
      return res.status(403).json({
        message:
          "Cannot reset password for Google-linked accounts. Please use Google login.",
      });
    }

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

const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (verificationCodes[email] !== parseInt(code)) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    res.status(200).json({ message: "Code verified successfully" });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ message: "Error verifying code" });
  }
};

const checkAccountType = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if it's a Google account
    const isGoogleAccount = user.oauthProvider === "Google";

    res.status(200).json({
      isGoogleAccount,
      message: isGoogleAccount
        ? "This account uses Google authentication"
        : "Standard account",
    });
  } catch (error) {
    console.error("Error checking account type:", error);
    res.status(500).json({ message: "Error processing request" });
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

const getUserHistory = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the history array in reverse order (newest first)
    res.status(200).json(user.history || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user pets
const getUserPets = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.pets || []);
  } catch (error) {
    console.error("Error fetching user pets:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add a new pet
const addPet = async (req, res) => {
  try {
    const { email } = req.params;
    const petData = req.body;

    if (!petData.name || !petData.breed || !petData.gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.pets.push(petData);
    await user.save();

    res.status(201).json({
      message: "Pet added successfully",
      pet: user.pets[user.pets.length - 1],
    });
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update a pet
const updatePet = async (req, res) => {
  try {
    const { email, petId } = req.params;
    const updatedPetData = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const petIndex = user.pets.findIndex((pet) => pet._id.toString() === petId);
    if (petIndex === -1) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Update pet fields
    user.pets[petIndex].name = updatedPetData.name || user.pets[petIndex].name;
    user.pets[petIndex].breed =
      updatedPetData.breed || user.pets[petIndex].breed;
    user.pets[petIndex].gender =
      updatedPetData.gender || user.pets[petIndex].gender;

    await user.save();

    res.status(200).json({
      message: "Pet updated successfully",
      pet: user.pets[petIndex],
    });
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ message: error.message });
  }
};

// Remove a pet
const removePet = async (req, res) => {
  try {
    const { email, petId } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const petIndex = user.pets.findIndex((pet) => pet._id.toString() === petId);
    if (petIndex === -1) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Remove the pet from the array
    user.pets.splice(petIndex, 1);
    await user.save();

    res.status(200).json({ message: "Pet removed successfully" });
  } catch (error) {
    console.error("Error removing pet:", error);
    res.status(500).json({ message: error.message });
  }
};

const getUserSales = async (req, res) => {
  try {
    const email = req.params.email;

    // First, find all products created by this user
    const userProducts = await Market.find({ userEmail: email });

    if (!userProducts || userProducts.length === 0) {
      return res.status(200).json([]);
    }

    const productIds = userProducts.map((product) => product._id.toString());

    // Find all users who have purchased these products
    const usersWithPurchases = await User.find({
      "history.items": {
        $elemMatch: {
          productId: { $in: productIds },
        },
      },
    });

    // Extract relevant sales data
    const salesData = [];

    usersWithPurchases.forEach((user) => {
      user.history.forEach((purchase) => {
        const relevantItems = purchase.items.filter(
          (item) =>
            item.productId && productIds.includes(item.productId.toString())
        );

        if (relevantItems.length > 0) {
          relevantItems.forEach((item) => {
            // Find the original product for additional details
            const originalProduct = userProducts.find(
              (p) => p._id.toString() === item.productId.toString()
            );

            salesData.push({
              productId: item.productId,
              productTitle: item.productTitle,
              productImg: item.productImg,
              quantity: item.quantity,
              price: item.price,
              purchaseDate: purchase.purchaseDate,
              status: purchase.status,
              buyer: {
                email: user.email,
                contactNo:
                  purchase.userDetails?.contactNo || user.contactNo || "",
                address: purchase.userDetails?.address || "",
              },
            });
          });
        }
      });
    });

    // Sort by most recent
    salesData.sort(
      (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
    );

    res.status(200).json(salesData);
  } catch (error) {
    console.error("Error getting user sales:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  requestPasswordReset,
  resetPassword,
  verifyCode,
  checkAccountType,
  updateProfile,
  getlistings,
  getUserHistory,
  getUserPets,
  addPet,
  updatePet,
  removePet,
  getUserSales,
};
