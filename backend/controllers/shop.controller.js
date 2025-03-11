const Shop = require("../models/shop.model");
const User = require("../models/user.model");

const { v4: uuidv4 } = require("uuid");

const addProduct = async (req, res) => {
  try {
    const productImg = req.files.map((file) => `/shopImgs/${file.filename}`);

    const user = await User.findOne({ email: req.body.userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const shop = new Shop({
      product_id: uuidv4(),
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

    const formattedProducts = products.map((product) => ({
      productId: product.product_id,
      title: product.title,
      price: product.price,
      images: product.productImg,
      brand: product.brand,
      description: product.description,
      specification: product.specification,
      quantity: product.quantity,
      category: product.category,
      subcategory: product.subcategory,
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addProduct, getAllProducts };
