// Routes de gestion des messages
const express = require('express');
const router = express.Router();

// Controllers
const messageController = require('../controllers/message.controller');

// Routes de messages
router.get('/room/:roomId', messageController.getMessagesByRoomId);
router.get('/:id', messageController.getMessageById);
router.post('/', messageController.createMessage);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
