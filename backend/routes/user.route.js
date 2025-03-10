const express = require("express");
const router = express.Router();
const { getUserByEmail } = require("../controllers/user.controller");

router.get("/", getUserByEmail);

module.exports = router;
