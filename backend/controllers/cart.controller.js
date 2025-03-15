const User = require("../models/user.model");

// Get cart items for a user
const getCart = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ cart: user.cart || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const email = req.params.email;
    const cartItem = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize cart if it doesn't exist
    if (!user.cart) {
      user.cart = [];
    }

    // Add item to cart
    user.cart.push(cartItem);
    await user.save();

    res.status(200).json({ message: "Item added to cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart (replace entire cart)
const updateCart = async (req, res) => {
  try {
    const email = req.params.email;
    const { cart } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = cart;
    await user.save();

    res.status(200).json({ message: "Cart updated", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const email = req.params.email;
    const { index } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cart || user.cart.length <= index) {
      return res.status(400).json({ message: "Invalid cart item index" });
    }

    user.cart.splice(index, 1);
    await user.save();

    res
      .status(200)
      .json({ message: "Item removed from cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const email = req.params.email;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
};
