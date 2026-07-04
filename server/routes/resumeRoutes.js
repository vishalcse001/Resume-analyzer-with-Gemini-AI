const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadResume, getHistory, getResumeById } = require('../controllers/resumeController');
const rateLimiter = require('../middleware/rateLimiter');

router.post('/upload', protect, rateLimiter, upload.single('resume'), uploadResume);
router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getResumeById);

module.exports = router;