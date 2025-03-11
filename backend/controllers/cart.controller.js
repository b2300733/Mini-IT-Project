const User = require("../models/user.model");

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { email, productId, name, price, quantity, image } = req.body;

    let user = await User.findById(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity; // Update quantity if the product already exists
    } else {
      user.cart.push({ productId, name, price, quantity, image });
    }

    await user.save();
    res.status(200).json({ message: "Item added to cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user cart
const getCart = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findById(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart on logout
const clearCart = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findById(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addToCart, getCart, clearCart };
