const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  company: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  bullets: [{ type: String }],
});

const educationSchema = new mongoose.Schema({
  degree: { type: String, default: '' },
  fieldOfStudy: { type: String, default: '' },
  institution: { type: String, default: '' },
  location: { type: String, default: '' },
  graduationYear: { type: String, default: '' },
  gpa: { type: String, default: '' },
  honors: [{ type: String }],
});

const projectSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  url: { type: String, default: '' },
  github: { type: String, default: '' },
  techStack: [{ type: String }],
  description: { type: String, default: '' },
  bullets: [{ type: String }],
});

const certificationSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  issueDate: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
});

const skillGroupSchema = new mongoose.Schema({
  category: { type: String, default: 'Technical Skills' },
  items: [{ type: String }],
});

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'My Professional Resume',
      trim: true,
    },
    targetJobTitle: {
      type: String,
      default: '',
    },
    template: {
      type: String,
      enum: ['modern-tech', 'executive-minimal', 'creative-nordic', 'compact-ats'],
      default: 'modern-tech',
    },
    theme: {
      primaryColor: { type: String, default: '#3b82f6' },
      fontFamily: { type: String, default: 'Inter' },
      fontSize: { type: String, default: 'normal' }, // small, normal, large
      spacing: { type: String, default: 'normal' }, // compact, normal, relaxed
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      headline: { type: String, default: '' },
      portfolioUrl: { type: String, default: '' },
      linkedinUrl: { type: String, default: '' },
      githubUrl: { type: String, default: '' },
    },
    summary: {
      type: String,
      default: '',
    },
    experience: [experienceSchema],
    education: [educationSchema],
    skillGroups: [skillGroupSchema],
    projects: [projectSchema],
    certifications: [certificationSchema],
    languages: [{ type: String }],
    interests: [{ type: String }],
    isDefault: {
      type: Boolean,
      default: false,
    },
    atsScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
