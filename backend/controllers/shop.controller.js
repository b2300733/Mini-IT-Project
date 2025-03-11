const Shop = require("../models/shop.model");
const User = require("../models/user.model");

const addProduct = async (req, res) => {
  try {
    const productImg = req.files.map((file) => `/shopImgs/${file.filename}`);

    const user = await User.findOne({ email: req.body.userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const shop = new Shop({
      ...req.body,
      productImg,
      createdAt: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
      updatedAt: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
    });

    await shop.save();

    res.status(201).json({ message: "Product added successfully!", shop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Shop.find().sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addProduct, getAllProducts };
