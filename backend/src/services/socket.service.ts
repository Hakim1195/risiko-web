import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GameRoom {
  id: string;
  gameId: number;
  players: Array<{
    userId: number;
    username: string;
    color: string;
    armies: number;
    territories: string[];
  }>;
  gameState: {
    phase: 'REINFORCEMENT' | 'ATTACK' | 'MOVEMENT' | 'CARD_DRAW';
    turnNumber: number;
    currentPlayerIndex: number;
    territories: Record<string, {
      id: string;
      name: string;
      continent: string;
      owner: number | null;
      armies: number;
    }>;
    playersTurnOrder: number[];
  };
  chatMessages: Array<{
    userId: number;
    username: string;
    text: string;
    timestamp: string;
  }>;
}

const gameRooms: Record<string, GameRoom> = {};

// Colors for players
const playerColors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF', '#00FFFF'];

export const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a game room
    socket.on('joinGame', async ({ gameId, userId, username }) => {
      try {
        // Check if room exists
        let room = gameRooms[gameId];
        
        if (!room) {
          // Create new room
          const game = await prisma.game.findUnique({
            where: { id: gameId }
          });

          if (!game) {
            socket.emit('error', { message: 'Game not found' });
            return;
          }

          // Get existing players in room
          const roomPlayers = await (prisma as any).roomPlayer.findMany({
            where: { roomId: gameId },
            include: { user: true }
          });

          room = {
            id: gameId,
            gameId,
            players: roomPlayers.map((rp: any, index: number) => ({
              userId: rp.userId,
              username: rp.user.username,
              color: playerColors[index % playerColors.length],
              armies: 0,
              territories: []
            })),
            gameState: {
              phase: 'REINFORCEMENT',
              turnNumber: 1,
              currentPlayerIndex: 0,
              territories: {},
              playersTurnOrder: roomPlayers.map((rp: any) => rp.userId)
            },
            chatMessages: []
          };

          gameRooms[gameId] = room;
        }

        // Add player to room if not already in it
        const playerExists = room.players.some(p => p.userId === userId);
        if (!playerExists) {
          room.players.push({
            userId,
            username,
            color: playerColors[room.players.length % playerColors.length],
            armies: 0,
            territories: []
          });
        }

        socket.join(gameId);
        
        // Emit room updated to all players in the room
        io.to(gameId).emit('roomUpdated', {
          players: room.players,
          gameState: room.gameState
        });

        // Emit connection success
        socket.emit('connected', {
          roomId: gameId,
          playerId: userId,
          username,
          color: playerColors[room.players.length % playerColors.length]
        });

        console.log(`Player ${username} joined room ${gameId}`);
      } catch (error) {
        console.error('Error joining game:', error);
        socket.emit('error', { message: 'Error joining game' });
      }
    });

    // Leave a game room
    socket.on('leaveGame', ({ gameId, userId }) => {
      const room = gameRooms[gameId];
      
      if (room) {
        room.players = room.players.filter(p => p.userId !== userId);
        
        if (room.players.length === 0) {
          delete gameRooms[gameId];
        } else {
          // Update turn order
          room.gameState.playersTurnOrder = room.players.map(p => p.userId);
          room.gameState.currentPlayerIndex = 0;
          
          io.to(gameId).emit('roomUpdated', {
            players: room.players,
            gameState: room.gameState
          });
        }
      }

      socket.leave(gameId);
      console.log(`Player ${userId} left room ${gameId}`);
    });

    // Send chat message
    socket.on('sendMessage', async ({ gameId, userId, username, text }) => {
      const room = gameRooms[gameId];
      
      if (room) {
        const message = {
          userId,
          username,
          text,
          timestamp: new Date().toISOString()
        };
        
        room.chatMessages.push(message);
        
        io.to(gameId).emit('messageReceived', message);
      }
    });

    // Start game
    socket.on('startGame', async ({ gameId }) => {
      const room = gameRooms[gameId];
      
      if (room) {
        // Initialize territories with random owners and armies
        const territories = [
          { id: 'ALASKA', name: 'Alaska', continent: 'NORTH_AMERICA', owner: null, armies: 0 },
          { id: 'NORTHWEST_TERRITORY', name: 'Territoire du Nord-Ouest', continent: 'NORTH_AMERICA', owner: null, armies: 0 },
          { id: 'GREENLAND', name: 'Groenland', continent: 'NORTH_AMERICA', owner: null, armies: 0 },
          { id: 'ONTARIO', name: 'Ontario', continent: 'NORTH_AMERICA', owner: null, armies: 0 },
          { id: 'QUEBEC', name: 'Québec', continent: 'NORTH_AMERICA', owner: null, armies: 0 },
          { id: 'ALBERTA', name: 'Alberta', continent: 'NORTH_AMERICA', owner: null, armies: 0 },
          { id: 'WESTERN_UNITED_STATES', name: 'États-Unis Occidentaux', continent: 'NORTH_AMERICA', owner: null, armies: 0 },
          { id: 'EASTERN_UNITED_STATES', name: 'États-Unis Orientaux', continent: 'NORTH_AMERICA', owner: null, armies: 0 },
          { id: 'MEXICO', name: 'Mexique', continent: 'NORTH_AMERICA', owner: null, armies: 0 },
          { id: 'VENEZUELA', name: 'Venezuela', continent: 'SOUTH_AMERICA', owner: null, armies: 0 },
          { id: 'BRAZIL', name: 'Brésil', continent: 'SOUTH_AMERICA', owner: null, armies: 0 },
          { id: 'ARGENTINA', name: 'Argentine', continent: 'SOUTH_AMERICA', owner: null, armies: 0 },
          { id: 'PERU', name: 'Pérou', continent: 'SOUTH_AMERICA', owner: null, armies: 0 },
          { id: 'ICELAND', name: 'Islande', continent: 'EUROPE', owner: null, armies: 0 },
          { id: 'UNITED_KINGDOM', name: 'Royaume-Uni', continent: 'EUROPE', owner: null, armies: 0 },
          { id: 'SCANDINAVIA', name: 'Scandinavie', continent: 'EUROPE', owner: null, armies: 0 },
          { id: 'NORTHERN_EUROPE', name: 'Europe du Nord', continent: 'EUROPE', owner: null, armies: 0 },
          { id: 'WESTERN_EUROPE', name: 'Europe de l\'Ouest', continent: 'EUROPE', owner: null, armies: 0 },
          { id: 'SOUTHERN_EUROPE', name: 'Europe du Sud', continent: 'EUROPE', owner: null, armies: 0 },
          { id: 'EGYPT', name: 'Égypte', continent: 'AFRICA', owner: null, armies: 0 },
          { id: 'NORTH_AFRICA', name: 'Afrique du Nord', continent: 'AFRICA', owner: null, armies: 0 },
          { id: 'MIDDLE_EAST', name: 'Moyen-Orient', continent: 'ASIA', owner: null, armies: 0 },
          { id: 'INDIA', name: 'Inde', continent: 'ASIA', owner: null, armies: 0 },
          { id: 'CHINA', name: 'Chine', continent: 'ASIA', owner: null, armies: 0 },
          { id: 'SIBERIA', name: 'Sibérie', continent: 'ASIA', owner: null, armies: 0 },
          { id: 'URAL', name: 'Ural', continent: 'ASIA', owner: null, armies: 0 },
          { id: 'MONGOLIA', name: 'Mongolie', continent: 'ASIA', owner: null, armies: 0 },
          { id: 'SIAM', name: 'Siam', continent: 'ASIA', owner: null, armies: 0 },
          { id: 'INDONESIA', name: 'Indonésie', continent: 'ASIA', owner: null, armies: 0 },
          { id: 'KAMCHATKA', name: 'Kamchatka', continent: 'ASIA', owner: null, armies: 0 },
          { id: 'JAPAN', name: 'Japon', continent: 'ASIA', owner: null, armies: 0 },
          { id: 'AFGHANISTAN', name: 'Afghanistan', continent: 'ASIA', owner: null, armies: 0 },
          { id: 'USSR', name: 'URSS', continent: 'ASIA', owner: null, armies: 0 },
          { id: 'CENTRAL_AFRICA', name: 'Afrique Centrale', continent: 'AFRICA', owner: null, armies: 0 },
          { id: 'EAST_AFRICA', name: 'Afrique de l\'Est', continent: 'AFRICA', owner: null, armies: 0 },
          { id: 'SOUTH_AFRICA', name: 'Afrique du Sud', continent: 'AFRICA', owner: null, armies: 0 },
          { id: 'MADAGASCAR', name: 'Madagascar', continent: 'AFRICA', owner: null, armies: 0 },
          { id: 'WEST_AFRICA', name: 'Afrique de l\'Ouest', continent: 'AFRICA', owner: null, armies: 0 },
          { id: 'NEW_GUINEA', name: 'Nouvelle-Guinée', continent: 'OCEANIA', owner: null, armies: 0 },
          { id: 'EASTERN_AUSTRALIA', name: 'Australie Orientale', continent: 'OCEANIA', owner: null, armies: 0 },
          { id: 'WESTERN_AUSTRALIA', name: 'Australie Occidentale', continent: 'OCEANIA', owner: null, armies: 0 },
          { id: 'NEW_ZEALAND', name: 'Nouvelle-Zélande', continent: 'OCEANIA', owner: null, armies: 0 }
        ];

        // Distribute territories randomly among players
        room.players.forEach((player: any, index: number) => {
          player.territories = territories
            .filter((_: any, i: number) => i % room.players.length === index)
            .map((t: any) => t.id);
          
          // Give each player 1 army per territory
          player.armies = player.territories.length;
        });

        // Set initial territory owners
        room.gameState.territories = territories.reduce((acc: any, t: any) => {
          acc[t.id] = {
            id: t.id,
            name: t.name,
            continent: t.continent,
            owner: null,
            armies: 0
          };
          return acc;
        }, {});

        // Assign initial territories to players
        room.players.forEach((player: any, playerIndex: number) => {
          player.territories.forEach((territoryId: string) => {
            room.gameState.territories[territoryId].owner = player.userId;
            room.gameState.territories[territoryId].armies = 1;
          });
        });

        room.gameState.phase = 'REINFORCEMENT';
        room.gameState.turnNumber = 1;
        room.gameState.currentPlayerIndex = 0;

        io.to(gameId).emit('gameStarted', {
          gameState: room.gameState,
          players: room.players,
          currentPlayerId: room.players[0].userId
        });

        // Emit reinforcement phase to current player
        io.to(gameId).emit('phaseChanged', {
          phase: 'REINFORCEMENT',
          currentPlayerId: room.players[0].userId
        });

        console.log(`Game ${gameId} started`);
      }
    });

    // Place armies during reinforcement phase
    socket.on('placeArmies', async ({ gameId, playerId, territoryId, armies }) => {
      const room = gameRooms[gameId];
      
      if (room && room.gameState.phase === 'REINFORCEMENT') {
        const currentPlayer = room.players[room.gameState.currentPlayerIndex];
        
        if (currentPlayer.userId === playerId) {
          // Update territory
          if (room.gameState.territories[territoryId]) {
            room.gameState.territories[territoryId].armies += armies;
            
            // Update player armies
            const player = room.players.find((p: any) => p.userId === playerId);
            if (player) {
              player.armies -= armies;
            }

            io.to(gameId).emit('armiesPlaced', {
              territoryId,
              armies,
              gameState: room.gameState
            });
          }
        }
      }
    });

    // Request attack
    socket.on('attackRequest', async ({ gameId, attackerId, attackerTerritory, defenderTerritory, diceCount }) => {
      const room = gameRooms[gameId];
      
      if (room && room.gameState.phase === 'ATTACK') {
        const currentPlayer = room.players[room.gameState.currentPlayerIndex];
        
        if (currentPlayer.userId === attackerId) {
          const attackerTerritoryData = room.gameState.territories[attackerTerritory];
          const defenderTerritoryData = room.gameState.territories[defenderTerritory];
          
          // Roll dice
          const attackerDice = [];
          const defenderDice = [];
          
          for (let i = 0; i < diceCount; i++) {
            attackerDice.push(Math.floor(Math.random() * 6) + 1);
          }
          
          const defenderDiceCount = Math.min(defenderTerritoryData.armies, 3);
          for (let i = 0; i < defenderDiceCount; i++) {
            defenderDice.push(Math.floor(Math.random() * 6) + 1);
          }
          
          // Sort dice in descending order
          attackerDice.sort((a, b) => b - a);
          defenderDice.sort((a, b) => b - a);
          
          // Compare dice and calculate losses
          let attackerLosses = 0;
          let defenderLosses = 0;
          
          const comparisonCount = Math.min(attackerDice.length, defenderDice.length);
          for (let i = 0; i < comparisonCount; i++) {
            if (attackerDice[i] > defenderDice[i]) {
              defenderLosses++;
            } else {
              attackerLosses++;
            }
          }
          
          // Apply losses
          defenderTerritoryData.armies -= defenderLosses;
          attackerTerritoryData.armies -= attackerLosses;
          
          // Check if territory was conquered
          let conquered = false;
          if (defenderTerritoryData.armies <= 0) {
            conquered = true;
            defenderTerritoryData.armies = 0;
            defenderTerritoryData.owner = attackerId;
            
            // Move armies to conquered territory
            const moveCount = Math.max(1, diceCount - 1);
            attackerTerritoryData.armies -= moveCount;
            defenderTerritoryData.armies += moveCount;
            
            // Update player territories
            const attacker = room.players.find((p: any) => p.userId === attackerId);
            const defender = room.players.find((p: any) => p.userId === defenderTerritoryData.owner);
            
            if (attacker) {
              if (!attacker.territories.includes(defenderTerritory)) {
                attacker.territories.push(defenderTerritory);
              }
            }
            
            if (defender) {
              defender.territories = defender.territories.filter((t: string) => t !== defenderTerritory);
            }
          }

          io.to(gameId).emit('attackResult', {
            attackerTerritory,
            defenderTerritory,
            attackerDice,
            defenderDice,
            attackerLosses,
            defenderLosses,
            conquered,
            gameState: room.gameState
          });
        }
      }
    });

    // Request move
    socket.on('moveRequest', async ({ gameId, playerId, fromTerritory, toTerritory, armies }) => {
      const room = gameRooms[gameId];
      
      if (room && room.gameState.phase === 'MOVEMENT') {
        const currentPlayer = room.players[room.gameState.currentPlayerIndex];
        
        if (currentPlayer.userId === playerId) {
          const fromTerritoryData = room.gameState.territories[fromTerritory];
          const toTerritoryData = room.gameState.territories[toTerritory];
          
          if (fromTerritoryData.owner === playerId && toTerritoryData.owner === playerId) {
            fromTerritoryData.armies -= armies;
            toTerritoryData.armies += armies;
            
            io.to(gameId).emit('moveResult', {
              fromTerritory,
              toTerritory,
              armies,
              gameState: room.gameState
            });
          }
        }
      }
    });

    // End turn
    socket.on('endTurn', async ({ gameId }) => {
      const room = gameRooms[gameId];
      
      if (room) {
        // Move to next player
        room.gameState.currentPlayerIndex = (room.gameState.currentPlayerIndex + 1) % room.players.length;
        
        // Calculate reinforcements for new player
        const currentPlayer = room.players[room.gameState.currentPlayerIndex];
        const territoryCount = currentPlayer.territories.length;
        const baseReinforcements = Math.max(3, Math.floor(territoryCount / 3));
        
        // Calculate continent bonuses
        let continentBonus = 0;
        const continents: any = {
          NORTH_AMERICA: ['ALASKA', 'NORTHWEST_TERRITORY', 'GREENLAND', 'ONTARIO', 'QUEBEC', 'ALBERTA', 'WESTERN_UNITED_STATES', 'EASTERN_UNITED_STATES', 'MEXICO'],
          SOUTH_AMERICA: ['VENEZUELA', 'BRAZIL', 'ARGENTINA', 'PERU'],
          EUROPE: ['ICELAND', 'UNITED_KINGDOM', 'SCANDINAVIA', 'NORTHERN_EUROPE', 'WESTERN_EUROPE', 'SOUTHERN_EUROPE'],
          AFRICA: ['EGYPT', 'NORTH_AFRICA', 'MIDDLE_EAST', 'INDIA', 'CHINA', 'SIBERIA', 'URAL', 'MONGOLIA', 'SIAM', 'INDONESIA', 'KAMCHATKA', 'JAPAN'],
          ASIA: ['AFGHANISTAN', 'USSR', 'CENTRAL_AFRICA', 'EAST_AFRICA', 'SOUTH_AFRICA', 'MADAGASCAR', 'WEST_AFRICA'],
          OCEANIA: ['NEW_GUINEA', 'EASTERN_AUSTRALIA', 'WESTERN_AUSTRALIA', 'NEW_ZEALAND']
        };
        
        // Check continent control
        Object.entries(continents).forEach(([continent, territories]: any) => {
          const allControlled = territories.every((t: string) => 
            room.gameState.territories[t]?.owner === currentPlayer.userId
          );
          
          if (allControlled) {
            switch (continent) {
              case 'NORTH_AMERICA': continentBonus += 5; break;
              case 'SOUTH_AMERICA': continentBonus += 2; break;
              case 'EUROPE': continentBonus += 5; break;
              case 'AFRICA': continentBonus += 3; break;
              case 'ASIA': continentBonus += 7; break;
              case 'OCEANIA': continentBonus += 2; break;
            }
          }
        });
        
        const totalReinforcements = baseReinforcements + continentBonus;
        
        io.to(gameId).emit('turnEnded', {
          currentPlayerId: currentPlayer.userId,
          reinforcements: totalReinforcements,
          phase: 'REINFORCEMENT',
          turnNumber: room.gameState.turnNumber
        });
        
        // Update phase
        room.gameState.phase = 'REINFORCEMENT';
        
        io.to(gameId).emit('phaseChanged', {
          phase: 'REINFORCEMENT',
          currentPlayerId: currentPlayer.userId,
          reinforcements: totalReinforcements
        });
        
        console.log(`Turn ${room.gameState.turnNumber} ended, next player: ${currentPlayer.username}`);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getGameRoom = (gameId: string): GameRoom | undefined => {
  return gameRooms[gameId];
};

export const updateGameRoom = (gameId: string, room: GameRoom): void => {
  gameRooms[gameId] = room;
};
