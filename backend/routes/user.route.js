const express = require("express");
const router = express.Router();
const { addUser } = require("../controllers/user.controller");

router.post("/", addUser);

module.exports = router;
