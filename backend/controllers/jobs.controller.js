const Job = require("../models/jobs.model");

// Get all jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: error.message });
  }
};

// Get jobs by category
const getJobsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const jobs = await Job.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs by category:", error);
    res.status(500).json({
      message: "Error fetching jobs by category",
      error: error.message,
    });
  }
};

// Get jobs by location
const getJobsByLocation = async (req, res) => {
  try {
    const { location } = req.query;
    const regex = new RegExp(location, "i");
    const jobs = await Job.find({ address: regex }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs by location:", error);
    res.status(500).json({
      message: "Error fetching jobs by location",
      error: error.message,
    });
  }
};

// Create a new job
const createJob = async (req, res) => {
  try {
    const jobData = req.body;
    const newJob = new Job(jobData);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(400).json({
      message: "Error creating job",
      error: error.message,
    });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Job.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      message: "Error deleting job",
      error: error.message,
    });
  }
};

// Add this controller method
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const jobData = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      jobData,
      { new: true } // Return the updated document
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    res
      .status(400)
      .json({ message: "Error updating job", error: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllJobs,
  getJobsByCategory,
  getJobsByLocation,
  createJob,
  deleteJob,
  updateJob,
  getJobById,
};
