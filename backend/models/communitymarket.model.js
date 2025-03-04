const mongoose = require("mongoose");

const marketSchema = new mongoose.Schema(
  {
    productTitle: { type: String, required: true },
    productDesc: {
      type: String,
      required: false,
      default: "No description available",
      trim: true,
    },
    productPrice: { type: String, required: true },
    productImg: { type: [String], required: false },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    condition: { type: String, required: true },
    deliveryOpt: { type: [String], required: true },
    userEmail: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Market", marketSchema);
