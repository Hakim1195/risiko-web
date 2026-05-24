// Game service for Risk game logic
const { continents, territories, territoryMap } = require('../models/game-map');
const Territory = require('../models/territory.model');

class GameService {
  constructor() {
    this.games = new Map(); // Store active games
  }

  // Create a new game
  createGame(gameId, players) {
    const game = {
      id: gameId,
      players: players,
      currentPlayer: 0,
      territories: this.initializeTerritories(),
      deck: this.createDeck(),
      phase: 'REINFORCEMENT', // REINFORCEMENT, ATTACK, FORTIFY, CARD_DRAW
      gameOver: false,
      winner: null
    };

    this.games.set(gameId, game);
    return game;
  }

  // Initialize territories with owners and armies
  initializeTerritories() {
    const territoriesMap = new Map();
    
    territories.forEach(territory => {
      territoriesMap.set(territory.id, new Territory(
        territory.id,
        territory.name,
        territory.continent,
        territory.adjacent,
        0, // initial armies
        null // initial owner
      ));
    });
    
    return territoriesMap;
  }

  // Create and shuffle the territory card deck
  createDeck() {
    // Create 42 territory cards (one for each territory)
    const deck = [];
    
    territories.forEach(territory => {
      // Each territory card has a symbol (Fantassin, Cavaliere, Cannone)
      // For simplicity, we'll use a random symbol for each territory
      const symbols = ['Fante', 'Cavaliere', 'Cannone'];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      
      deck.push({
        id: territory.id,
        name: territory.name,
        symbol: symbol,
        continent: territory.continent
      });
    });
    
    // Add 2 jolly cards
    deck.push({ id: 'JOLLY1', name: 'Jolly', symbol: 'Jolly' });
    deck.push({ id: 'JOLLY2', name: 'Jolly', symbol: 'Jolly' });
    
    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
  }

  // Distribute territories to players
  distributeTerritories(gameId) {
    const game = this.games.get(gameId);
    if (!game) return false;
    
    // Shuffle territories
    const shuffledTerritories = [...game.territories.values()].sort(() => Math.random() - 0.5);
    
    // Distribute territories to players
    shuffledTerritories.forEach((territory, index) => {
      const playerIndex = index % game.players.length;
      territory.setOwner(game.players[playerIndex].id);
      territory.addArmies(1); // Place 1 army on each territory
    });
    
    return true;
  }

  // Calculate reinforcement armies for a player
  calculateReinforcements(gameId, playerId) {
    const game = this.games.get(gameId);
    if (!game) return 0;
    
    // Base reinforcement: number of territories / 3 (rounded down)
    let reinforcements = 0;
    let territoryCount = 0;
    
    game.territories.forEach(territory => {
      if (territory.owner === playerId) {
        territoryCount++;
      }
    });
    
    reinforcements = Math.max(3, Math.floor(territoryCount / 3));
    
    // Continent bonuses
    Object.values(continents).forEach(continent => {
      if (this.hasContinent(gameId, playerId, continent.id)) {
        reinforcements += continent.bonusArmies;
      }
    });
    
    return reinforcements;
  }

  // Check if a player controls an entire continent
  hasContinent(gameId, playerId, continentId) {
    const game = this.games.get(gameId);
    if (!game) return false;
    
    const continentTerritories = territories.filter(t => t.continent === continentId);
    const playerTerritories = continentTerritories.filter(t => 
      game.territories.get(t.id).owner === playerId
    );
    
    return playerTerritories.length === continentTerritories.length;
  }

  // Place armies on territories
  placeArmies(gameId, playerId, territoryId, count) {
    const game = this.games.get(gameId);
    if (!game) return false;
    
    const territory = game.territories.get(territoryId);
    if (!territory || territory.owner !== playerId) {
      return false;
    }
    
    territory.addArmies(count);
    return true;
  }

  // Check if attack is valid
  isValidAttack(gameId, attackerId, fromTerritoryId, toTerritoryId) {
    const game = this.games.get(gameId);
    if (!game) return false;
    
    const fromTerritory = game.territories.get(fromTerritoryId);
    const toTerritory = game.territories.get(toTerritoryId);
    
    // Check if territories exist
    if (!fromTerritory || !toTerritory) return false;
    
    // Check if attacker owns the from territory
    if (fromTerritory.owner !== attackerId) return false;
    
    // Check if to territory is owned by another player
    if (toTerritory.owner === attackerId) return false;
    
    // Check if territories are adjacent
    if (!fromTerritory.isAdjacentTo(toTerritoryId)) return false;
    
    // Check if attacker has at least 2 armies on the from territory
    if (fromTerritory.armies < 2) return false;
    
    return true;
  }

  // Execute attack
  executeAttack(gameId, attackerId, fromTerritoryId, toTerritoryId, attackArmies) {
    const game = this.games.get(gameId);
    if (!game) return null;
    
    const fromTerritory = game.territories.get(fromTerritoryId);
    const toTerritory = game.territories.get(toTerritoryId);
    
    // Validate attack
    if (!this.isValidAttack(gameId, attackerId, fromTerritoryId, toTerritoryId)) {
      return null;
    }
    
    // Validate attack armies
    if (attackArmies < 1 || attackArmies > 3 || attackArmies >= fromTerritory.armies) {
      return null;
    }
    
    // Roll dice for attacker and defender
    const attackerDice = this.rollDice(attackArmies);
    const defenderDice = this.rollDice(toTerritory.armies);
    
    // Resolve battle
    const results = this.resolveBattle(attackerDice, defenderDice);
    
    // Apply results
    fromTerritory.removeArmies(results.attackerLosses);
    toTerritory.removeArmies(results.defenderLosses);
    
    // Check if territory was conquered
    let conquered = false;
    let newOwner = null;
    
    if (toTerritory.armies === 0) {
      conquered = true;
      newOwner = attackerId;
      toTerritory.setOwner(newOwner);
      
      // Move armies to conquered territory
      const armiesToMove = Math.min(attackArmies, results.attackerLosses);
      toTerritory.addArmies(armiesToMove);
      fromTerritory.removeArmies(armiesToMove);
    }
    
    return {
      attackerLosses: results.attackerLosses,
      defenderLosses: results.defenderLosses,
      conquered: conquered,
      newOwner: newOwner,
      fromTerritory: fromTerritory,
      toTerritory: toTerritory
    };
  }

  // Roll dice for battle
  rollDice(count) {
    const dice = [];
    for (let i = 0; i < count; i++) {
      dice.push(Math.floor(Math.random() * 6) + 1);
    }
    return dice.sort((a, b) => b - a); // Sort descending
  }

  // Resolve battle results
  resolveBattle(attackerDice, defenderDice) {
    let attackerLosses = 0;
    let defenderLosses = 0;
    
    const maxDice = Math.min(attackerDice.length, defenderDice.length);
    
    for (let i = 0; i < maxDice; i++) {
      if (attackerDice[i] > defenderDice[i]) {
        defenderLosses++;
      } else {
        attackerLosses++;
      }
    }
    
    return { attackerLosses, defenderLosses };
  }

  // Move armies between territories
  moveArmies(gameId, playerId, fromTerritoryId, toTerritoryId, count) {
    const game = this.games.get(gameId);
    if (!game) return false;
    
    const fromTerritory = game.territories.get(fromTerritoryId);
    const toTerritory = game.territories.get(toTerritoryId);
    
    // Validate territories
    if (!fromTerritory || !toTerritory) return false;
    
    // Check if player owns both territories
    if (fromTerritory.owner !== playerId || toTerritory.owner !== playerId) {
      return false;
    }
    
    // Check if territories are adjacent
    if (!fromTerritory.isAdjacentTo(toTerritoryId)) {
      return false;
    }
    
    // Check if there are enough armies to move
    if (fromTerritory.armies <= count) {
      return false;
    }
    
    // Move armies
    fromTerritory.removeArmies(count);
    toTerritory.addArmies(count);
    
    return true;
  }

  // Draw a card from the deck
  drawCard(gameId, playerId) {
    const game = this.games.get(gameId);
    if (!game || game.deck.length === 0) return null;
    
    const card = game.deck.pop();
    return card;
  }

  // Check if a player has won
  checkWinCondition(gameId, playerId) {
    const game = this.games.get(gameId);
    if (!game) return false;
    
    // Check if player has conquered all territories (simplified)
    let territoryCount = 0;
    game.territories.forEach(territory => {
      if (territory.owner === playerId) {
        territoryCount++;
      }
    });
    
    // For now, winning condition is controlling all territories
    return territoryCount === territories.length;
  }

  // Get game state
  getGameState(gameId) {
    const game = this.games.get(gameId);
    if (!game) return null;
    
    return {
      id: game.id,
      players: game.players,
      currentPlayer: game.currentPlayer,
      territories: Array.from(game.territories.values()).map(t => ({
        id: t.id,
        name: t.name,
        continent: t.continent,
        armies: t.armies,
        owner: t.owner
      })),
      phase: game.phase,
      gameOver: game.gameOver,
      winner: game.winner
    };
  }

  // End current player's turn
  endTurn(gameId) {
    const game = this.games.get(gameId);
    if (!game) return false;
    
    game.currentPlayer = (game.currentPlayer + 1) % game.players.length;
    game.phase = 'REINFORCEMENT';
    return true;
  }
}

module.exports = new GameService();