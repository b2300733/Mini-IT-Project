const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobs.controller");

// Get all jobs
router.get("/", jobController.getAllJobs);

// Get jobs by category
router.get("/category/:category", jobController.getJobsByCategory);

// Get jobs by location
router.get("/location", jobController.getJobsByLocation);

// Create a new job
router.post("/", jobController.createJob);

// Delete a job
router.delete("/:id", jobController.deleteJob);

// Add this route
router.put("/:id", jobController.updateJob);

module.exports = router;
