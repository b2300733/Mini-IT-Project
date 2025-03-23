const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
  checkout,
} = require("../controllers/cart.controller");

router.get("/:email", getCart);
router.post("/:email/add", addToCart);
router.put("/:email", updateCart);
router.delete("/:email/item/:index", removeFromCart);
router.delete("/:email", clearCart);
router.post("/:email/checkout", checkout);

module.exports = router;
