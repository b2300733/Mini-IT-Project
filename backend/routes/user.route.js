const express = require("express");
const router = express.Router();
const { addUser, checkUserExists } = require("../controllers/user.controller");

router.post("/", addUser);
router.post("/check", checkUserExists);

module.exports = router;
