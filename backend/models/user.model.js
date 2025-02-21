const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    gender: { type: String, required: false },
    contactNumber: { type: Number, required: false },
    address: { type: String, required: false },
    profilePicture: { type: String, default: "/profilePics/default_user.png" },
    oauthProvider: { type: String, required: false },
    oauthId: { type: String, required: false, unique: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
