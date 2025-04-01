const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop.controller");
const multer = require("multer");
const path = require("path");

const {
  addProduct,
  getAllProducts,
  updateProduct,
} = require("../controllers/shop.controller");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/shopImgs/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer Middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB limit per image
});

router.post("/add", upload.array("productImg", 10), addProduct);
router.get("/all", getAllProducts);
router.put("/update", upload.array("productImg"), shopController.updateProduct);

module.exports = router;
