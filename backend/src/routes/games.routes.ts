// Routes des jeux
import express from 'express';
const router = express.Router();

// Controllers
import gameController from '../controllers/game.controller';

// Routes des jeux
router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGameById);
router.post('/', gameController.createGame);
router.put('/:id', gameController.updateGame);
router.delete('/:id', gameController.deleteGame);

// Routes spécifiques pour Risiko!
router.post('/board/:gameId', gameController.createGameBoard);
router.post('/distribute/:gameId', gameController.distributeTerritories);
router.post('/reinforcements', gameController.calculateReinforcements);
router.post('/battle', gameController.simulateBattle);

export default router;