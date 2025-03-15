const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cart.controller");

// Get cart items
router.get("/:email", getCart);

// Add item to cart
router.post("/:email/add", addToCart);

// Update entire cart
router.put("/:email", updateCart);

// Remove item from cart
router.delete("/:email/item/:index", removeFromCart);

// Clear cart
router.delete("/:email", clearCart);

module.exports = router;
