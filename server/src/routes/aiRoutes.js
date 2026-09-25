const express = require('express');
const router = express.Router();
const {
  enhanceSummary,
  generateBullets,
  matchJob,
  getMatches,
  applyTailoring,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/enhance-summary', enhanceSummary);
router.post('/generate-bullets', generateBullets);
router.post('/match-job', matchJob);
router.get('/matches', getMatches);
router.post('/apply-tailoring/:matchId', applyTailoring);

module.exports = router;
