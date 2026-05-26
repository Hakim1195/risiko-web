// Game controller for Risk game API endpoints
const gameService = require('../services/game.service');

const createGame = async (req, res) => {
  try {
    const { gameId, players } = req.body;

    if (!gameId || !players || !Array.isArray(players) || players.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Invalid game data: gameId and players array (minimum 2) required'
      });
    }

    const game = gameService.createGame(gameId, players);

    // Distribuer les territoires aux joueurs
    const territoriesDistributed = gameService.distributeTerritories(gameId);

    if (!territoriesDistributed) {
      return res.status(500).json({
        success: false,
        message: 'Failed to distribute territories'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      game: gameService.getGameState(gameId)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating game',
      error: error.message
    });
  }
};

const getGameState = async (req, res) => {
  try {
    const { gameId } = req.params;

    const gameState = gameService.getGameState(gameId);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.json({
      success: true,
      game: gameState
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving game state',
      error: error.message
    });
  }
};

const placeArmies = async (req, res) => {
  try {
    const { gameId, playerId, territoryId, count } = req.body;

    if (!gameId || !playerId || !territoryId || count === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: gameId, playerId, territoryId, count'
      });
    }

    const success = gameService.placeArmies(gameId, playerId, territoryId, count);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to place armies'
      });
    }

    res.json({
      success: true,
      message: 'Armies placed successfully',
      game: gameService.getGameState(gameId)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error placing armies',
      error: error.message
    });
  }
};

const attack = async (req, res) => {
  try {
    const { gameId, attackerId, fromTerritoryId, toTerritoryId, attackArmies } = req.body;

    if (!gameId || !attackerId || !fromTerritoryId || !toTerritoryId || attackArmies === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: gameId, attackerId, fromTerritoryId, toTerritoryId, attackArmies'
      });
    }

    const result = gameService.executeAttack(gameId, attackerId, fromTerritoryId, toTerritoryId, attackArmies);

    if (!result) {
      return res.status(400).json({
        success: false,
        message: 'Invalid attack'
      });
    }

    // Vérifier la condition de victoire
    const win = gameService.checkWinCondition(gameId, attackerId);

    res.json({
      success: true,
      message: result.conquered ? 'Territory conquered!' : 'Attack executed',
      result: result,
      win: win,
      game: gameService.getGameState(gameId)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error executing attack',
      error: error.message
    });
  }
};

const moveArmies = async (req, res) => {
  try {
    const { gameId, playerId, fromTerritoryId, toTerritoryId, count } = req.body;

    if (!gameId || !playerId || !fromTerritoryId || !toTerritoryId || count === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: gameId, playerId, fromTerritoryId, toTerritoryId, count'
      });
    }

    const success = gameService.moveArmies(gameId, playerId, fromTerritoryId, toTerritoryId, count);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to move armies'
      });
    }

    res.json({
      success: true,
      message: 'Armies moved successfully',
      game: gameService.getGameState(gameId)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error moving armies',
      error: error.message
    });
  }
};

const drawCard = async (req, res) => {
  try {
    const { gameId, playerId } = req.body;

    if (!gameId || !playerId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: gameId, playerId'
      });
    }

    const card = gameService.drawCard(gameId, playerId);

    if (!card) {
      return res.status(400).json({
        success: false,
        message: 'Failed to draw card or no cards left'
      });
    }

    res.json({
      success: true,
      message: 'Card drawn successfully',
      card: card,
      game: gameService.getGameState(gameId)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error drawing card',
      error: error.message
    });
  }
};

const endTurn = async (req, res) => {
  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: gameId'
      });
    }

    const success = gameService.endTurn(gameId);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to end turn'
      });
    }

    res.json({
      success: true,
      message: 'Turn ended successfully',
      game: gameService.getGameState(gameId)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error ending turn',
      error: error.message
    });
  }
};

module.exports = {
  createGame,
  getGameState,
  placeArmies,
  attack,
  moveArmies,
  drawCard,
  endTurn
};
