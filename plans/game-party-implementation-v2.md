# Game Party Implementation Plan - V2

## Overview
This document outlines the implementation plan for creating playable Risk game parties that can be started, joined, and played with multiple players in real-time, building upon the existing infrastructure.

## Current State Analysis

Based on the existing codebase, we have:
- Game service with complete Risk rules implementation
- Match service with basic match management
- Database schema with Match model
- Frontend GameBoard component
- Authentication and user systems

## Implementation Requirements

### 1. Match Creation and Management
- Create match endpoint with proper validation
- Join/leave match functionality
- Match status management (waiting, in_progress, finished)
- Player assignment and turn order

### 2. Game Session Flow
- Match initialization with proper game setup
- Turn-based gameplay with phase management
- Real-time state synchronization
- Win condition detection

### 3. Real-time Communication
- WebSocket integration for live updates
- Room-based communication channels
- Action validation and processing
- Player action broadcasting

## Detailed Implementation Steps

### Phase 1: Match Controller and Routes

#### Create Match Controller
Create a new match controller to handle match-specific operations:

```typescript
// backend/src/controllers/match.controller.ts
import { Request, Response } from 'express';
import matchService from '../services/match.service';
import gameService from '../services/game.service';

class MatchController {
  // Create a new match
  async createMatch(req: Request, res: Response) {
    try {
      const { name, players, gameId } = req.body;
      const match = await matchService.createMatch(name, players, gameId);
      res.status(201).json({ match });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create match' });
    }
  }

  // Get match details
  async getMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const match = await matchService.getMatchById(parseInt(id));
      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }
      res.json({ match });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get match' });
    }
  }

  // Start a match
  async startMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const match = await matchService.startMatch(parseInt(id));
      
      // Initialize game state
      const gameState = await gameService.initializeGame(match.players, match.players.length);
      
      // Update match with game state
      const updatedMatch = await matchService.updateMatchState(parseInt(id), gameState);
      
      res.json({ match: updatedMatch });
    } catch (error) {
      res.status(500).json({ error: 'Failed to start match' });
    }
  }

  // Execute game action
  async executeAction(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { action, data } = req.body;
      
      // Get current match state
      const match = await matchService.getMatchById(parseInt(id));
      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }
      
      let updatedState = match.gameState;
      
      // Process different actions
      switch(action) {
        case 'reinforcement':
          updatedState = await gameService.handleReinforcementPhase(
            data.playerId, 
            match.gameState
          );
          break;
        case 'attack':
          updatedState = await gameService.handleAttackPhase(
            data.playerId,
            data.fromTerritory,
            data.toTerritory,
            data.armies,
            match.gameState
          );
          break;
        case 'fortify':
          updatedState = await gameService.handleFortifyPhase(
            data.playerId,
            data.fromTerritory,
            data.toTerritory,
            data.armies,
            match.gameState
          );
          break;
        case 'end-turn':
          updatedState = await gameService.endTurn(
            match.gameState,
            data.currentPlayerId,
            data.nextPlayerId
          );
          break;
        default:
          throw new Error('Invalid action');
      }
      
      // Update match state
      const updatedMatch = await matchService.updateMatchState(parseInt(id), updatedState);
      
      res.json({ match: updatedMatch });
    } catch (error) {
      res.status(500).json({ error: 'Failed to execute action' });
    }
  }
}

export default new MatchController();
```

### Phase 2: Match Routes

#### Create Match Routes
```typescript
// backend/src/routes/match.routes.ts
import express from 'express';
const router = express.Router();

import matchController from '../controllers/match.controller';

// Match routes
router.post('/', matchController.createMatch);
router.get('/:id', matchController.getMatch);
router.post('/:id/start', matchController.startMatch);
router.post('/:id/actions', matchController.executeAction);

export default router;
```

### Phase 3: Integration with Existing Game Service

#### Enhance Game Service for Party Flow
```typescript
// Add to backend/src/services/game.service.ts
// Method to validate and process game actions
async validateAndProcessAction(matchId: number, action: string, data: any) {
  // Get current match state
  const match = await matchService.getMatchById(matchId);
  if (!match) {
    throw new Error('Match not found');
  }
  
  // Validate action based on current phase and player
  // This would include all the validation logic from the Risk rules
  switch(action) {
    case 'attack':
      // Validate attack conditions
      return await this.handleAttackPhase(
        data.playerId,
        data.fromTerritory,
        data.toTerritory,
        data.armies,
        match.gameState
      );
    case 'fortify':
      // Validate fortify conditions
      return await this.handleFortifyPhase(
        data.playerId,
        data.fromTerritory,
        data.toTerritory,
        data.armies,
        match.gameState
      );
    // ... other actions
  }
}
```

### Phase 4: Real-time Communication Setup

#### Integrate Socket.IO for Real-time Updates
```typescript
// backend/src/server.ts (or similar)
import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join match room
  socket.on('join-match', (matchId) => {
    socket.join(`match-${matchId}`);
  });
  
  // Leave match room
  socket.on('leave-match', (matchId) => {
    socket.leave(`match-${matchId}`);
  });
  
  // Handle game actions
  socket.on('game-action', async (data) => {
    try {
      // Process action through match controller
      const result = await matchController.executeAction(
        { params: { id: data.matchId }, body: data }
      );
      
      // Broadcast updated state to all players in the match
      io.to(`match-${data.matchId}`).emit('match-updated', result.match);
    } catch (error) {
      socket.emit('error', { message: 'Action failed' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Export io instance for use in controllers
export { io };
```

### Phase 5: Frontend Integration

#### Update Game Page Component
```jsx
// frontend/src/pages/Game.jsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const GamePage = () => {
  const [gameState, setGameState] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [socket, setSocket] = useState(null);
  const [matchId, setMatchId] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3000'); // Adjust URL as needed
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };
  }, []);

  // Join match when component mounts
  useEffect(() => {
    if (socket && matchId) {
      socket.emit('join-match', matchId);
      
      // Listen for match updates
      socket.on('match-updated', (updatedState) => {
        setGameState(updatedState);
      });
    }
  }, [socket, matchId]);

  // Handle game actions
  const handleAction = (action, data) => {
    if (socket) {
      socket.emit('game-action', {
        matchId,
        action,
        data
      });
    }
  };

  return (
    <div className="game-page">
      {gameState ? (
        <GameBoard 
          gameState={gameState}
          onAction={handleAction}
          currentPlayer={currentPlayer}
        />
      ) : (
        <div>Loading game...</div>
      )}
    </div>
  );
};

export default GamePage;
```

### Phase 6: Complete Game Flow Implementation

#### Match Lifecycle Management
1. **Match Creation**: Players create a match with name and player list
2. **Match Waiting**: Players join the match, wait for start
3. **Match Start**: Host starts the match, initialize game state
4. **Game Play**: Players take turns executing actions
5. **Match End**: Win condition detected, record results

#### Win Condition Detection
```typescript
// Add to game.service.ts
async checkWinCondition(gameState: any, playerId: number): Promise<boolean> {
  // Check for territory conquest win condition
  const playerTerritories = gameState.territories.filter((t: any) => t.owner === playerId);
  if (playerTerritories.length === 42) {
    return true;
  }
  
  // Check for objective win condition (if implemented)
  // This would check if player has completed their objective card
  
  return false;
}
```

### Phase 7: Testing and Validation

#### Unit Tests for Match Flow
```typescript
// Test match creation and start
test('should create and start match', async () => {
  const match = await matchService.createMatch('Test Match', players, 1);
  expect(match.status).toBe('waiting');
  
  const startedMatch = await matchService.startMatch(match.id);
  expect(startedMatch.status).toBe('in_progress');
});

// Test game action processing
test('should process attack action', async () => {
  const result = await gameService.handleAttackPhase(
    1, 'alaska', 'groenland', 3, gameState
  );
  expect(result.battleResult).toBeDefined();
});
```

## Technical Implementation Details

### Database Schema Enhancements
The Match model already supports game state storage via the `gameState` JSON field, which is sufficient for our needs.

### API Endpoints
- POST /matches - Create new match
- GET /matches/:id - Get match details
- POST /matches/:id/start - Start match
- POST /matches/:id/actions - Execute game action

### Real-time Communication
- Socket.IO rooms for match isolation
- Broadcast game state updates to all players
- Action validation before processing
- Error handling for invalid actions

## Security Considerations

### Action Validation
- All actions must be validated server-side
- Player ownership verification
- Turn order enforcement
- Game state consistency checks

### Authentication
- Player authentication for all match actions
- Match ownership verification
- Prevent unauthorized access to matches

## Deployment Considerations

### Scalability
- Redis for caching active matches
- Database connection pooling
- WebSocket connection management
- Load balancing for multiple matches

### Monitoring
- Match activity tracking
- Performance metrics
- Error logging
- Player session monitoring

## Timeline Estimate
- Match controller and routes: 2 days
- Real-time communication integration: 2 days  
- Frontend integration: 2 days
- Testing and validation: 2 days
- Documentation and finalization: 1 day