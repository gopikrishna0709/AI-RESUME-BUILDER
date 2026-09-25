const express = require('express');
const router = express.Router();
const {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getResumes).post(createResume);
router.route('/:id').get(getResumeById).put(updateResume).delete(deleteResume);
router.post('/:id/duplicate', duplicateResume);

module.exports = router;
