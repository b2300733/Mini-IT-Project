const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  clearCart,
} = require("../controllers/cart.controller");

router.post("/add", addToCart);
router.get("/:email", getCart);
router.post("/clear", clearCart);

module.exports = router;
