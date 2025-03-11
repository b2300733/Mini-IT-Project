const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    gender: { type: String, required: false },
    contactNo: { type: Number, required: false },
    address1: { type: String, required: false },
    address2: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false },
    zip: { type: Number, required: false },
    avatar: { type: String, default: "/profilePics/default_user.png" },
    oauthProvider: { type: String, required: false },
    oauthId: { type: String, required: false, unique: true, sparse: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
