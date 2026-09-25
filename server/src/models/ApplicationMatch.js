const mongoose = require('mongoose');

const applicationMatchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    jobTitle: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: '',
    },
    jobDescription: {
      type: String,
      default: '',
    },
    overallMatchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    skillsMatchScore: {
      type: Number,
      default: 0,
    },
    experienceMatchScore: {
      type: Number,
      default: 0,
    },
    educationMatchScore: {
      type: Number,
      default: 0,
    },
    matchingSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    keywordDensity: {
      type: Map,
      of: Number,
    },
    keyStrengths: [{ type: String }],
    criticalGaps: [{ type: String }],
    tailoringRecommendations: [{ type: String }],
    atsPassedRate: {
      type: Number,
      default: 85,
    },
    status: {
      type: String,
      enum: ['Saved', 'Tailored', 'Applied', 'Interviewing', 'Offered', 'Archived'],
      default: 'Saved',
    },
    tailoredSummary: {
      type: String,
      default: '',
    },
    tailoredBullets: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ApplicationMatch', applicationMatchSchema);
