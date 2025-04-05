const express = require("express");
const {
  requestPasswordReset,
  resetPassword,
  verifyCode,
  updateProfile,
  checkAccountType,
  getlistings,
  getUserHistory,
  getUserPets,
  addPet,
  updatePet,
  removePet,
  getUserSales,
  getUserServices,
} = require("../controllers/profile.controller");

const router = express.Router();

router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/verify-code", verifyCode);
router.get("/check-account/:email", checkAccountType);
router.put("/update-profile", updateProfile);
router.get("/listings/:userEmail", getlistings);
router.get("/:email/history", getUserHistory);
router.get("/:email/pets", getUserPets);
router.post("/:email/pets", addPet);
router.put("/:email/pets/:petId", updatePet);
router.delete("/:email/pets/:petId", removePet);
router.get("/sales/:email", getUserSales);
router.get("/:email/services", getUserServices);

module.exports = router;
