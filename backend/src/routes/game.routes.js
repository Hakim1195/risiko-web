const express = require('express');
const router = express.Router();
const { 
  createGame, 
  getGameState, 
  placeArmies, 
  attack, 
  moveArmies, 
  drawCard, 
  endTurn 
} = require('../controllers/game.controller');

// Game routes
router.post('/create', createGame);
router.get('/state/:gameId', getGameState);
router.post('/place-armies', placeArmies);
router.post('/attack', attack);
router.post('/move-armies', moveArmies);
router.post('/draw-card', drawCard);
router.post('/end-turn', endTurn);

module.exports = router;