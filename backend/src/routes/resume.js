const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const protect = require('../middleware/auth');

router.get('/master', resumeController.getMasterResume);
router.post('/analyze-jd', resumeController.analyzeJobDescription);
router.post('/save', resumeController.saveGeneratedResume);
router.get('/saved', resumeController.getGeneratedResumes);

module.exports = router;
