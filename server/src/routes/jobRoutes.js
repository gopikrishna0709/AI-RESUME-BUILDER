const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', protect, createJob);

module.exports = router;
