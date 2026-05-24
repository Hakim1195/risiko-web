// Routes de gestion des messages
import express from 'express';
const router = express.Router();

// Controllers
import messageController from '../controllers/message.controller';

// Routes de messages
router.get('/room/:roomId', messageController.getMessagesByRoomId);
router.get('/:id', messageController.getMessageById);
router.post('/', messageController.createMessage);
router.delete('/:id', messageController.deleteMessage);

export default router;