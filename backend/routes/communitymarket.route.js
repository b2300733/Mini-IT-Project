const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  addProduct,
  getAllProducts,
} = require("../controllers/communitymarket.controller");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/marketImgs/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer Middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per image
});

// Routes
router.post("/add", upload.array("productImg", 10), addProduct);
router.get("/all", getAllProducts);

module.exports = router;
