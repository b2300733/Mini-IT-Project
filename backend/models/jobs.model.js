const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true,
    enum: ['Day Care', 'Pet Sitting', 'Pet Walking', 'Grooming']
  },
  title: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  phoneNumber: { 
    type: String, 
    required: true,
    match: /^[0-9]{8,}$/
  },
  ownerName: { 
    type: String, 
    required: true 
  },
  petType: { 
    type: String, 
    required: true 
  },
  note: { 
    type: String 
  },
  hourRate: { 
    type: Number, 
    required: true,
    min: 0
  },
  userEmail: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;