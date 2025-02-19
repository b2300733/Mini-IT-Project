const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const addUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addUser,
};
