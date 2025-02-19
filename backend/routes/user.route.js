const express = require("express");
const router = express.Router();
const { addUser } = require("../controllers/user.controller");
const bcrypt = require("bcrypt");

router.get("/", addUser);

module.exports = router;
