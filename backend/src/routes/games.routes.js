// Routes de gestion des jeux
const express = require('express');
const router = express.Router();

// Controllers
const gamesController = require('../controllers/games.controller');

// Routes de jeux
router.get('/', gamesController.getAllGames);
router.get('/:id', gamesController.getGameById);
router.post('/', gamesController.createGame);
router.put('/:id', gamesController.updateGame);
router.delete('/:id', gamesController.deleteGame);

module.exports = router;