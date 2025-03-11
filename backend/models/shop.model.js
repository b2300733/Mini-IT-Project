const mongoose = require("mongoose");

const shopScheme = new mongoose.Schema(
  {
    productBrand: { type: String, required: true },
    productTitle: { type: String, required: true },
    productDesc: {
      type: String,
      required: true,
    },
    productSpec: {
      type: String,
      required: true,
    },
    productPrice: { type: Number, required: true },
    productQuantity: { type: Number, required: true },
    productImg: { type: [String], required: false },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    userEmail: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", shopScheme);
