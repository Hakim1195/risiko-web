// Routes de gestion des salles
const express = require('express');
const router = express.Router();

// Controllers
const roomsController = require('../controllers/rooms.controller');

// Routes de salles
router.get('/', roomsController.getAllRooms);
router.get('/:id', roomsController.getRoomById);
router.post('/', roomsController.createRoom);
router.put('/:id', roomsController.updateRoom);
router.delete('/:id', roomsController.deleteRoom);
router.post('/:id/join', roomsController.joinRoom);
router.post('/:id/leave', roomsController.leaveRoom);

module.exports = router;