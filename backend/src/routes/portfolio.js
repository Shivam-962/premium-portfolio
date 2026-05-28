const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const protect = require('../middleware/auth');

// Projects routes
router.get('/projects', portfolioController.getProjects);
router.post('/projects', protect, portfolioController.addProject);
router.put('/projects/:id', protect, portfolioController.updateProject);
router.delete('/projects/:id', protect, portfolioController.deleteProject);

// Skills routes
router.get('/skills', portfolioController.getSkills);
router.post('/skills', protect, portfolioController.addSkill);
router.delete('/skills/:id', protect, portfolioController.deleteSkill);

// Experiences routes
router.get('/experiences', portfolioController.getExperiences);
router.post('/experiences', protect, portfolioController.addExperience);
router.delete('/experiences/:id', protect, portfolioController.deleteExperience);

// Certifications routes
router.get('/certifications', portfolioController.getCertifications);
router.post('/certifications', protect, portfolioController.addCertification);

module.exports = router;
