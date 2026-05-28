const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const protect = require('../middleware/auth');

router.post('/', analyticsController.trackEvent);
router.get('/stats', protect, analyticsController.getAnalyticsStats);

module.exports = router;
