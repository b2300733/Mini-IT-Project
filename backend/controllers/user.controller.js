const User = require("../models/user.model");
const bcrypt = require("bcrypt");

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

    res.status(200).json(user);
  } catch (error) {
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
