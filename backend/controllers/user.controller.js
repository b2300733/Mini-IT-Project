const User = require("../models/user.model");

const addUser = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addUser,
};
