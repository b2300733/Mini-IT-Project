const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJobsByCategory,
  getJobsByLocation,
  createJob,
  deleteJob,
  updateJob,
  getJobById,
} = require("../controllers/jobs.controller");

// Get all jobs
router.get("/", getAllJobs);

// Get jobs by category
router.get("/category/:category", getJobsByCategory);

// Get jobs by location
router.get("/location", getJobsByLocation);

// Create a new job
router.post("/", createJob);

// Delete a job
router.delete("/:id", deleteJob);

// Add this route
router.put("/:id", updateJob);

router.get("/:id", getJobById);

module.exports = router;
