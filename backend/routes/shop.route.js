const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  addProduct,
  getAllProducts,
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

module.exports = router;
