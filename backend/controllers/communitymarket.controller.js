const Market = require("../models/communitymarket.model");
const User = require("../models/user.model");

const addProduct = async (req, res) => {
  try {
    const productImg = req.files.map((file) => `/marketImgs/${file.filename}`);

    const user = await User.findOne({ email: req.body.userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const market = new Market({
      ...req.body,
      productImg,
      createdAt: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
      updatedAt: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
    });

    await market.save();

    res.status(201).json({ message: "Product added successfully!", market });
  } catch (error) {
    console.error("Product Upload Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Market.find().sort({ createdAt: -1 });

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

module.exports = { addProduct, getAllProducts };
