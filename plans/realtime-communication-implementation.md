# Real-time Communication Implementation Plan

## Overview
This document outlines the implementation plan for the real-time communication system that will enable seamless multiplayer gameplay in the Risk game. The system will use WebSocket technology to provide live updates between players and the server.

## System Architecture

### Core Components

#### 1. WebSocket Server
- Real-time message handling
- Connection management
- Room-based message routing
- Authentication and authorization

#### 2. Message Broker
- Message queuing and distribution
- Event broadcasting
- Message persistence (optional)
- Load balancing support

#### 3. Client-Side Integration
- WebSocket client implementation
- Message handling and parsing
- UI update synchronization
- Error handling and reconnection

## Technology Stack

### Backend
- **Socket.IO**: Primary WebSocket library for Node.js
- **Redis**: For message queuing and pub/sub capabilities
- **Express.js**: Web server framework
- **Prisma**: Database ORM for session management

### Frontend
- **Socket.IO Client**: For connecting to WebSocket server
- **React Hooks**: For state management
- **Redux**: For global state management (if needed)
- **TypeScript**: For type safety

## Communication Protocol

### Message Structure
```json
{
  "event": "room:joined",
  "data": {
    "roomId": "123",
    "playerId": "456",
    "playerName": "Player1",
    "timestamp": "2023-01-01T00:00:00Z"
  },
  "meta": {
    "version": "1.0",
    "source": "server"
  }
}
```

### Event Types

#### Room Events
- `room:joined` - Player joins room
- `room:left` - Player leaves room
- `room:updated` - Room state changes
- `room:player-ready` - Player ready status changes
- `room:game-started` - Game begins in room

#### Game Events
- `game:state-update` - Complete game state update
- `game:turn-changed` - Current player or turn changes
- `game:action` - Player action (attack, move, etc.)
- `game:combat-result` - Battle outcome
- `game:card-drawn` - Card drawn from deck
- `game:player-defeated` - Player eliminated
- `game:game-ended` - Game concludes

#### Chat Events
- `chat:message` - New chat message
- `chat:typing` - Player typing indicator
- `chat:notification` - System notifications

#### Matchmaking Events
- `queue:joined` - Player added to queue
- `queue:left` - Player removed from queue
- `queue:matched` - Match found
- `queue:updated` - Queue status changes

## Implementation Approach

### Phase 1: WebSocket Server Setup
1. **Install Socket.IO**: Integrate Socket.IO into existing Express server
2. **Connection Management**: Handle client connections and disconnections
3. **Authentication**: Verify client identity using JWT tokens
4. **Room Management**: Implement room-based communication channels

### Phase 2: Event System Implementation
1. **Event Registration**: Register event handlers for different message types
2. **Message Routing**: Route messages to appropriate rooms/players
3. **Broadcasting**: Implement room-wide and targeted message broadcasting
4. **Error Handling**: Add comprehensive error handling and logging

### Phase 3: Integration with Game Logic
1. **State Synchronization**: Push game state updates to clients
2. **Action Processing**: Handle player actions and broadcast results
3. **Real-time Updates**: Ensure UI reflects game state changes instantly
4. **Performance Optimization**: Optimize message delivery and processing

### Phase 4: Client-Side Implementation
1. **WebSocket Client**: Create client-side connection to server
2. **Event Listeners**: Register handlers for different event types
3. **UI Integration**: Update UI components based on received events
4. **Reconnection Logic**: Handle network interruptions gracefully

## Detailed Implementation Steps

### Step 1: Socket.IO Server Integration

#### Server Setup
```typescript
// backend/src/server.js
import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Handle authentication
  socket.on('authenticate', (token) => {
    // Verify JWT token and associate with socket
  });
  
  // Handle room joining
  socket.on('join-room', (roomId, playerId) => {
    socket.join(roomId);
    // Broadcast to room that player joined
  });
  
  // Handle room leaving
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

export { io, server };
```

#### Authentication Middleware
```typescript
// backend/src/middleware/socketAuth.js
import jwt from 'jsonwebtoken';

export const socketAuth = (socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};
```

### Step 2: Room-Based Communication

#### Room Management Service
```typescript
// backend/src/services/room.service.js
class RoomService {
  constructor() {
    this.rooms = new Map(); // roomId -> room data
    this.roomUsers = new Map(); // roomId -> Set of user IDs
  }
  
  createRoom(roomId, roomData) {
    this.rooms.set(roomId, {
      ...roomData,
      players: new Set(),
      createdAt: new Date()
    });
  }
  
  joinRoom(roomId, userId) {
    if (!this.rooms.has(roomId)) {
      throw new Error('Room not found');
    }
    
    const room = this.rooms.get(roomId);
    room.players.add(userId);
    this.roomUsers.set(roomId, room.players);
  }
  
  leaveRoom(roomId, userId) {
    if (!this.rooms.has(roomId)) {
      return;
    }
    
    const room = this.rooms.get(roomId);
    room.players.delete(userId);
    
    if (room.players.size === 0) {
      this.rooms.delete(roomId);
    }
  }
  
  broadcastToRoom(roomId, event, data) {
    io.to(roomId).emit(event, data);
  }
}
```

### Step 3: Game State Synchronization

#### Game State Management
```typescript
// backend/src/services/gameState.service.js
class GameStateService {
  // Store game states by room ID
  gameStates = new Map();
  
  // Update game state and broadcast to room
  updateGameState(roomId, newState) {
    this.gameStates.set(roomId, newState);
    
    // Broadcast to all players in room
    io.to(roomId).emit('game:state-update', {
      roomId,
      state: newState,
      timestamp: new Date()
    });
  }
  
  // Handle player actions
  handlePlayerAction(roomId, action, playerId) {
    // Process action
    const result = this.processAction(roomId, action, playerId);
    
    // Broadcast result
    io.to(roomId).emit('game:action-result', {
      action,
      result,
      playerId,
      timestamp: new Date()
    });
    
    return result;
  }
}
```

### Step 4: Client-Side Integration

#### React Hook for WebSocket Connection
```typescript
// frontend/src/hooks/useSocket.js
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = (serverUrl) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const newSocket = io(serverUrl, {
      auth: {
        token: localStorage.getItem('authToken')
      }
    });
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      setSocket(newSocket);
    });
    
    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });
    
    return () => {
      newSocket.close();
    };
  }, [serverUrl]);
  
  return { socket, isConnected };
};
```

#### Game State Subscription Hook
```typescript
// frontend/src/hooks/useGameSubscription.js
import { useEffect } from 'react';
import { useSocket } from './useSocket';

export const useGameSubscription = (roomId, onGameStateUpdate) => {
  const { socket } = useSocket();
  
  useEffect(() => {
    if (!socket || !roomId) return;
    
    // Subscribe to game state updates
    socket.on('game:state-update', (data) => {
      if (data.roomId === roomId) {
        onGameStateUpdate(data.state);
      }
    });
    
    // Subscribe to action results
    socket.on('game:action-result', (data) => {
      onGameStateUpdate(data.result);
    });
    
    // Join room
    socket.emit('join-room', roomId);
    
    return () => {
      socket.emit('leave-room', roomId);
      socket.off('game:state-update');
      socket.off('game:action-result');
    };
  }, [socket, roomId, onGameStateUpdate]);
};
```

## Security Considerations

### Authentication
- JWT-based authentication for WebSocket connections
- Token validation on each connection
- Session management for active connections

### Authorization
- Room access control
- Action validation (can player perform this action?)
- Message filtering and sanitization

### Data Protection
- Secure WebSocket connections (wss://)
- Input validation for all messages
- Rate limiting to prevent abuse
- Encryption of sensitive data

## Performance Optimization

### Connection Management
- Efficient connection pooling
- Automatic cleanup of inactive connections
- Connection limits per user
- Heartbeat mechanism for connection health

### Message Optimization
- Compression of large game state updates
- Delta updates for partial state changes
- Batch processing of multiple events
- Prioritization of critical messages

### Scalability Features
- Load balancing support
- Redis pub/sub for distributed messaging
- Horizontal scaling capabilities
- Database connection pooling

## Error Handling and Recovery

### Connection Errors
- Automatic reconnection attempts
- Exponential backoff strategy
- User notifications for connection loss
- Queueing of messages during disconnection

### Message Errors
- Validation of incoming messages
- Error propagation to clients
- Logging of failed operations
- Retry mechanisms for critical operations

### Graceful Degradation
- Fallback to polling for clients with limited WebSocket support
- Offline state management
- Local state caching
- Synchronization on reconnection

## Testing Strategy

### Unit Tests
- Socket connection handling
- Message parsing and validation
- Room management operations
- Authentication middleware

### Integration Tests
- End-to-end WebSocket communication
- Multi-player room interactions
- Game state synchronization
- Real-time event broadcasting

### Performance Tests
- Concurrent connection handling
- Message throughput testing
- Latency measurement
- Load testing with multiple users

## Implementation Timeline

### Week 1: WebSocket Foundation
- Implement Socket.IO integration
- Create authentication middleware
- Set up basic connection handling
- Add room management capabilities

### Week 2: Event System
- Implement event broadcasting
- Create message routing system
- Add error handling and logging
- Test basic communication flow

### Week 3: Game Integration
- Integrate with game state management
- Implement real-time action processing
- Add game-specific events
- Test with existing game logic

### Week 4: Client Integration
- Implement client-side WebSocket connection
- Create React hooks for real-time data
- Add UI synchronization
- Test full end-to-end functionality

## Monitoring and Debugging

### Logging
- Connection events
- Message traffic
- Error conditions
- Performance metrics

### Monitoring
- Active connection count
- Message throughput
- Response times
- Error rates

### Debugging Tools
- WebSocket inspector
- Message replay capabilities
- Connection status dashboard
- Performance profiling tools