const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const protect = require('../middleware/auth');

router.post('/', contactController.sendMessage);
router.get('/messages', protect, contactController.getMessages);
router.put('/messages/:id/read', protect, contactController.markAsRead);

module.exports = router;
