const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If login is successful
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        gender: user.gender,
        contactNo: user.contactNo,
        address1: user.address1,
        address2: user.address2,
        city: user.city,
        state: user.state,
        country: user.country,
        zip: user.zip,
        cart: user.cart || [],
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
};
