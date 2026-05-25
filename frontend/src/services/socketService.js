// Socket.io Service for Real-time Game Communication
import io from 'socket.io-client';
import config from '../config';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.gameId = null;
    this.playerId = null;
    this.listeners = {};
  }

  // Connect to the Socket.io server
  connect(gameId, playerId, username) {
    if (this.socket && this.isConnected) {
      this.disconnect();
    }

    this.gameId = gameId;
    this.playerId = playerId;

    this.socket = io(config.API_BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
      
      // Join the game room
      this.socket.emit('joinGame', {
        gameId,
        playerId,
        username
      });
      
      this.emit('connected', { socketId: this.socket.id });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
      this.emit('disconnected', { reason });
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('error', { error });
    });

    // Listen for game events
    this.socket.on('gameStateUpdate', (data) => {
      console.log('Game state update:', data);
      this.emit('gameStateUpdate', data);
    });

    this.socket.on('turnChange', (data) => {
      console.log('Turn change:', data);
      this.emit('turnChange', data);
    });

    this.socket.on('attackResult', (data) => {
      console.log('Attack result:', data);
      this.emit('attackResult', data);
    });

    this.socket.on('playerJoined', (data) => {
      console.log('Player joined:', data);
      this.emit('playerJoined', data);
    });

    this.socket.on('playerLeft', (data) => {
      console.log('Player left:', data);
      this.emit('playerLeft', data);
    });

    this.socket.on('gameStarted', (data) => {
      console.log('Game started:', data);
      this.emit('gameStarted', data);
    });

    this.socket.on('gameEnded', (data) => {
      console.log('Game ended:', data);
      this.emit('gameEnded', data);
    });

    this.socket.on('chatMessage', (data) => {
      console.log('Chat message:', data);
      this.emit('chatMessage', data);
    });

    this.socket.on('reinforcementPhase', (data) => {
      console.log('Reinforcement phase:', data);
      this.emit('reinforcementPhase', data);
    });

    this.socket.on('attackPhase', (data) => {
      console.log('Attack phase:', data);
      this.emit('attackPhase', data);
    });

    this.socket.on('movementPhase', (data) => {
      console.log('Movement phase:', data);
      this.emit('movementPhase', data);
    });
  }

  // Disconnect from the Socket.io server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.gameId = null;
    this.playerId = null;
    this.listeners = {};
  }

  // Check if socket is connected
  isSocketConnected() {
    return this.socket && this.isConnected;
  }

  // Emit events to the server
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  // Listen for events from the server
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // If socket is already connected, return immediately
    if (this.socket && this.isConnected) {
      return;
    }

    // If socket is not connected yet, set up the listener
    if (!this.socket) {
      // Will be set up when connect is called
      return;
    }

    this.socket.on(event, (data) => {
      this.listeners[event].forEach(callback => callback(data));
    });
  }

  // Remove event listener
  off(event, callback) {
    if (!this.listeners[event]) return;

    if (callback) {
      this.listeners[event] = this.listeners[event].filter(
        listener => listener !== callback
      );
    } else {
      delete this.listeners[event];
    }
  }

  // Join a game room
  joinGame(gameId, playerId, username) {
    this.emit('joinGame', { gameId, playerId, username });
  }

  // Leave a game room
  leaveGame() {
    this.emit('leaveGame', { gameId: this.gameId, playerId: this.playerId });
  }

  // Start a game
  startGame(gameId) {
    this.emit('startGame', { gameId });
  }

  // Place reinforcement armies
  placeReinforcements(gameId, playerId, territoryId, armies) {
    this.emit('placeReinforcements', { gameId, playerId, territoryId, armies });
  }

  // Request an attack
  requestAttack(gameId, attackerId, attackerTerritory, defenderTerritory, diceCount) {
    this.emit('attackRequest', {
      gameId,
      attackerId,
      attackerTerritory,
      defenderTerritory,
      diceCount
    });
  }

  // Move armies
  moveArmies(gameId, playerId, fromTerritory, toTerritory, armies) {
    this.emit('moveArmies', {
      gameId,
      playerId,
      fromTerritory,
      toTerritory,
      armies
    });
  }

  // End turn
  endTurn(gameId) {
    this.emit('endTurn', { gameId });
  }

  // Send chat message
  sendChatMessage(gameId, playerId, message) {
    this.emit('chatMessage', { gameId, playerId, message });
  }

  // Draw a card
  drawCard(gameId, playerId) {
    this.emit('drawCard', { gameId, playerId });
  }

  // Exchange cards
  exchangeCards(gameId, playerId, cardIds) {
    this.emit('exchangeCards', { gameId, playerId, cardIds });
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
