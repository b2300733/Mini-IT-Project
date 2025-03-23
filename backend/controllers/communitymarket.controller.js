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

const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Market.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.body.productId;

    //Find the product to update
    const product = await Market.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //Verify the user
    if (product.userEmail !== req.body.userEmail) {
      return res
        .status(403)
        .json({ message: "You don't have permission to update this product" });
    }

    //Handle images
    let productImages = [];

    //Keep existing images that didnt remove
    if (req.body.existingImages) {
      const existingImages = JSON.parse(req.body.existingImages);
      productImages = [...existingImages];
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/marketImgs/${file.filename}`);
      productImages = [...productImages, ...newImages];
    }

    // Parse delivery options
    const deliveryOpt = req.body.deliveryOpt.split(",");

    // Update the product
    const updatedProduct = await Market.findByIdAndUpdate(
      productId,
      {
        productTitle: req.body.productTitle,
        productDesc: req.body.productDesc || "No description available",
        productPrice: req.body.productPrice,
        productQuantity: req.body.productQuantity,
        productImg: productImages,
        category: req.body.category,
        subCategory: req.body.subCategory,
        condition: req.body.condition,
        deliveryOpt: deliveryOpt,
        updatedAt: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
      },
      { new: true }
    );

    res.status(200).json({
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
};
