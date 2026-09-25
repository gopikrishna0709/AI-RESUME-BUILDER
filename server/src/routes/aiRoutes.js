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
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/enhance-summary', enhanceSummary);
router.post('/generate-bullets', generateBullets);
router.post('/match-job', matchJob);
router.get('/matches', getMatches);
router.post('/apply-tailoring/:matchId', applyTailoring);

// Career AI routes
router.post('/interview-questions', getInterviewQuestions);
router.post('/mock-evaluate', evaluateMock);
router.post('/skill-roadmap', getSkillRoadmap);

module.exports = router;
