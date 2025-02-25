const mongoose = require("mongoose");

const marketSchema = new mongoose.Schema(
  {
    productTitle: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    productImg: { type: String, required: true },
    condition: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    user: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Market", marketSchema);
