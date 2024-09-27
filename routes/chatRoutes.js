const express = require('express');
const { joinChat, sendMessage, getChats, getAllMessages } = require('../controllers/chatController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/join', verifyToken, joinChat);
router.post('/send', verifyToken, sendMessage);
router.get('/', verifyToken, getChats);
router.get('/:chatId/messages', verifyToken, getAllMessages);

module.exports = router;