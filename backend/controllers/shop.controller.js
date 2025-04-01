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

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    // Find the existing product
    const product = await Shop.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle existing images - parse them from JSON string
    const existingImages = JSON.parse(req.body.existingImages || "[]");

    // New uploaded images
    const newImages = req.files.map((file) => `/shopImgs/${file.filename}`);

    // Combine existing and new images
    const productImg = [...existingImages, ...newImages];

    // Update product with new values
    product.productBrand = req.body.productBrand;
    product.productTitle = req.body.productTitle;
    product.productDesc = req.body.productDesc;
    product.productSpec = req.body.productSpec;
    product.productPrice = req.body.productPrice;
    product.productQuantity = req.body.productQuantity;
    product.category = req.body.category;
    product.subCategory = req.body.subCategory;
    product.productImg = productImg;
    product.updatedAt = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);

    await product.save();

    res.status(200).json({
      message: "Product updated successfully!",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addProduct, getAllProducts, updateProduct };
