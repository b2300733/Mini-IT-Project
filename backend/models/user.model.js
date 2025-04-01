const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    gender: { type: String, required: false },
    contactNo: { type: String, required: false },
    address1: { type: String, required: false },
    address2: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false },
    zip: { type: String, required: false },
    avatar: { type: String, default: "/profilePics/default_user.png" },
    oauthProvider: { type: String, required: false },
    oauthId: { type: String, required: false, unique: true, sparse: true },
    isAdmin: { type: Boolean, default: false },
    cart: [
      {
        productImg: String,
        productTitle: String,
        quantity: Number,
        price: Number,
        productId: String,
        shopProductId: String,
      },
    ],
    history: [
      {
        items: [
          {
            productImg: String,
            productTitle: String,
            quantity: Number,
            price: Number,
            productId: String,
            shopProductId: String,
          },
        ],
        totalAmount: Number,
        purchaseDate: { type: Date, default: Date.now },
        status: { type: String, default: "Completed" },
        userDetails: {
          email: String,
          contactNo: Number,
          address: String,
        },
      },
    ],
    pets: [
      {
        name: String,
        breed: String,
        gender: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
