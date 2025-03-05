const mongoose = require("mongoose");

const shopScheme = new mongoose.Schema(
  {
    productTitle: { type: "string", required: true },
    productDesc: {
      type: String,
      required: true,
    },
    productPrice: { type: String, required: true },
    productImg: { type: [String], required: false },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", shopScheme);
