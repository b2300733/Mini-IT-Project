const express = require("express");
const {
  requestPasswordReset,
  resetPassword,
  updateProfile,
  getlistings,
  getUserHistory,
} = require("../controllers/profile.controller");

const router = express.Router();

router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.put("/update-profile", updateProfile);
router.get("/listings/:userEmail", getlistings);
router.get("/:email/history", getUserHistory);

module.exports = router;
