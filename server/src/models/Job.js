const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Remote',
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'],
      default: 'Full-time',
    },
    level: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior', 'Lead / Staff', 'Manager'],
      default: 'Mid Level',
    },
    salaryRange: {
      type: String,
      default: '$120,000 - $160,000',
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    requiredSkills: [{ type: String }],
    preferredSkills: [{ type: String }],
    department: {
      type: String,
      default: 'Engineering',
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: 'Curated',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
