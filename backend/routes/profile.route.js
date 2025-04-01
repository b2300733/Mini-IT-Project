const express = require("express");
const {
  requestPasswordReset,
  resetPassword,
  updateProfile,
  getlistings,
  getUserHistory,
  getUserPets,
  addPet,
  updatePet,
  removePet,
  getUserSales,
} = require("../controllers/profile.controller");

const router = express.Router();

router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.put("/update-profile", updateProfile);
router.get("/listings/:userEmail", getlistings);
router.get("/:email/history", getUserHistory);
router.get("/:email/pets", getUserPets);
router.post("/:email/pets", addPet);
router.put("/:email/pets/:petId", updatePet);
router.delete("/:email/pets/:petId", removePet);
router.get("/sales/:email", getUserSales);

module.exports = router;
