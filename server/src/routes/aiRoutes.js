const express = require('express');
const router = express.Router();
const {
  enhanceSummary,
  generateBullets,
  matchJob,
  getMatches,
  applyTailoring,
  getInterviewQuestions,
  evaluateMock,
  getSkillRoadmap,
} = require('../controllers/aiController');
const { protect, optionalProtect } = require('../middleware/auth');

// Public / Guest-accessible AI Generative Tools
router.post('/enhance-summary', optionalProtect, enhanceSummary);
router.post('/generate-bullets', optionalProtect, generateBullets);
router.post('/match-job', optionalProtect, matchJob);
router.post('/interview-questions', optionalProtect, getInterviewQuestions);
router.post('/mock-evaluate', optionalProtect, evaluateMock);
router.post('/skill-roadmap', optionalProtect, getSkillRoadmap);

// Authenticated user-specific AI records
router.get('/matches', protect, getMatches);
router.post('/apply-tailoring/:matchId', protect, applyTailoring);

module.exports = router;
