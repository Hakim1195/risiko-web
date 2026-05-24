import express from 'express';
import { RoomController } from '../controllers/room.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', RoomController.getAllRooms);
router.get('/:id', RoomController.getRoomById);

// Protected routes
router.post('/', authMiddleware, RoomController.createRoom);
router.post('/:id/join', authMiddleware, RoomController.joinRoom);
router.post('/:id/leave', authMiddleware, RoomController.leaveRoom);
router.post('/:id/start', authMiddleware, RoomController.startGame);

export default router;