const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');

// Không yêu cầu verifyToken
router.post('/', chatbotController.chat);

module.exports = router;
