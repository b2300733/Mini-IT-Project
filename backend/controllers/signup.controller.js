const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
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

// Function to send welcome email
const sendWelcomeEmail = async (email, username) => {
  try {
    await transporter.sendMail({
      from: `"L&B Pet Service" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to L&B Pet Service!",
      html: `
        <p>Dear <strong>${username}</strong>,</p>
        <p>Welcome to L&B Pet Service! 🐾</p>
        <p>We are thrilled to have you onboard. Explore our platform for pet sitting services, pet accessories marketplace, and more.</p>
        <p>Have fun and enjoy your time with us! ❤️</p>
        <p>Best regards,</p>
        <p><strong>L&B Pet Service Team</strong></p>
      `,
    });
    console.log("✅ Welcome email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
};

const addUser = async (req, res) => {
  try {
    const { username, email, password, gender, contactNumber, address } =
      req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      gender,
      contactNumber,
      address,
      createdAt: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
      updatedAt: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
    });

    // Send Welcome Email
    await sendWelcomeEmail(email, username);

    res
      .status(200)
      .json({ message: "User registered successfully, welcome email sent!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const checkUserExists = async (req, res) => {
  try {
    const { username, email } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists.",
      });
    }

    res.status(200).json({ message: "Username and email are available." });
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again." });
  }
};

module.exports = {
  addUser,
  checkUserExists,
};
