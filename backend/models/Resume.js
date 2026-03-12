const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Resume' },
  templateId: { type: String, default: 'template1' },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    website: String,
  },
  summary: String,
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String,
  }],
  education: [{
    school: String,
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
    gpa: String,
  }],
  skills: [String],
  projects: [{
    name: String,
    description: String,
    link: String,
    technologies: String,
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);