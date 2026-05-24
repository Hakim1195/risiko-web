# Matchmaking and Room Systems Implementation Plan

## Overview
This document outlines the implementation plan for the matchmaking and room systems that enable multiplayer gameplay in the Risk game. These systems are crucial for creating organized, fair, and engaging multiplayer experiences.

## System Architecture

### Core Components

#### 1. Room Management System
- Room creation and deletion
- Player joining and leaving
- Room state tracking
- Room configuration (max players, game type, etc.)

#### 2. Matchmaking System
- Player queue management
- Match pairing algorithm
- Game type matching
- Fair player distribution

#### 3. Game Lobby System
- Room listing and browsing
- Player status tracking
- Game start controls
- Real-time updates

## Database Schema Enhancements

### Room Model (Enhanced)
```prisma
model Room {
  id        Int      @id @default(autoincrement())
  name      String
  maxPlayers Int     @default(4)
  gameType  String   @default("risk")
  status    String   @default("waiting") // waiting, in_progress, finished
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  gameId    Int
  game      Game     @relation(fields: [gameId], references: [id])
  messages  Message[]
  players   RoomPlayer[]
}
```

### RoomPlayer Model (Enhanced)
```prisma
model RoomPlayer {
  id        Int      @id @default(autoincrement())
  roomId    Int
  userId    Int
  playerOrder Int
  isReady   Boolean  @default(false)
  createdAt DateTime @default(now())
  room      Room     @relation(fields: [roomId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}
```

### Matchmaking Queue Model (New)
```prisma
model MatchmakingQueue {
  id        Int      @id @default(autoincrement())
  userId    Int
  elo       Int      @default(1200)
  timestamp DateTime @default(now())
  preferences Json
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

## Room System Implementation

### Room Creation
- Generate unique room names
- Set room configuration (max players, game type)
- Assign creator as first player
- Store room in database

### Room Management
- Player joining/leaving with validation
- Room status updates (waiting, in_progress, finished)
- Player ready status tracking
- Room cleanup when empty or finished

### Room States
1. **Waiting**: Room is open for players to join
2. **In Progress**: Game has started, players are actively playing
3. **Finished**: Game has ended, room can be deleted or archived

## Matchmaking System

### Queue Management
- Players enter queue with ELO rating
- Queue prioritization by skill level
- Matchmaking preferences (game type, player count)
- Automatic queue cleanup

### Match Pairing Algorithm
- **Skill-based matching**: Players with similar ELO ratings
- **Player count matching**: Matchmaking based on room capacity
- **Game type matching**: Ensure compatible game types
- **Geographic proximity**: Optional for latency optimization

### Matchmaking Logic
1. **Queue Monitoring**: Continuously check for matching players
2. **Pairing**: Find compatible groups of players
3. **Room Creation**: Create room for matched players
4. **Notification**: Inform players of match success

## Lobby System

### Room Listing
- Display available rooms
- Show room status and player counts
- Filter rooms by game type or status
- Sort rooms by creation time or player count

### Player Status Tracking
- Online/offline status
- Ready status in rooms
- Current game participation
- ELO ratings display

### Lobby Features
- Room creation interface
- Room joining with validation
- Room search and filtering
- Player messaging within lobby

## API Endpoints

### Room Management Endpoints
```
POST /rooms - Create new room
GET /rooms - List available rooms
GET /rooms/:id - Get room details
PUT /rooms/:id - Update room (join/leave)
DELETE /rooms/:id - Delete room
POST /rooms/:id/start - Start game in room
```

### Matchmaking Endpoints
```
POST /queue - Add player to matchmaking queue
DELETE /queue - Remove player from queue
GET /queue/status - Check queue status
POST /queue/match - Force match (admin)
```

### Player Management Endpoints
```
POST /rooms/:id/players - Join room
DELETE /rooms/:id/players - Leave room
PUT /rooms/:id/players/:userId/ready - Set ready status
```

## Real-time Communication Integration

### WebSocket Events
- **room:joined**: Player joins room
- **room:left**: Player leaves room
- **room:updated**: Room state changes
- **queue:updated**: Queue status changes
- **game:start**: Game begins
- **game:ended**: Game ends

### Event Flow
1. **Player joins queue**: Add to matchmaking queue
2. **Match found**: Create room and assign players
3. **Room created**: Notify players in queue
4. **Game starts**: Initialize game state
5. **Game ends**: Update player stats and clean up

## Implementation Steps

### Phase 1: Room System Foundation
1. **Database Models**: Create Room and RoomPlayer models
2. **Room Controller**: Implement room CRUD operations
3. **Room Service**: Add business logic for room management
4. **Authentication**: Add player validation to room operations

### Phase 2: Matchmaking System
1. **Queue Models**: Create matchmaking queue model
2. **Queue Controller**: Implement queue management endpoints
3. **Matchmaking Service**: Develop pairing algorithm
4. **Queue Management**: Add queue monitoring and matching logic

### Phase 3: Lobby System
1. **Lobby Controller**: Create lobby management endpoints
2. **Room Listing**: Implement room browsing functionality
3. **Player Status**: Add player status tracking
4. **Real-time Updates**: Integrate WebSocket notifications

### Phase 4: Integration and Testing
1. **API Integration**: Connect room and matchmaking systems
2. **Frontend Integration**: Implement lobby UI components
3. **Testing**: Comprehensive testing of all systems
4. **Optimization**: Performance tuning and bug fixes

## Technical Implementation Details

### Room Service Implementation
```typescript
class RoomService {
  // Create a new room
  async createRoom(name: string, maxPlayers: number, gameType: string, creatorId: number) {
    // Validate creator exists
    const creator = await prisma.user.findUnique({ where: { id: creatorId } });
    if (!creator) {
      throw new Error('Creator not found');
    }
    
    // Create room
    const room = await prisma.room.create({
      data: {
        name,
        maxPlayers,
        gameType,
        status: 'waiting',
        players: {
          create: {
            userId: creatorId,
            playerOrder: 1,
            isReady: true
          }
        }
      }
    });
    
    return room;
  }
  
  // Join a room
  async joinRoom(roomId: number, userId: number) {
    // Check if room exists and is not full
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { players: true }
    });
    
    if (!room) {
      throw new Error('Room not found');
    }
    
    if (room.players.length >= room.maxPlayers) {
      throw new Error('Room is full');
    }
    
    // Add player to room
    const player = await prisma.roomPlayer.create({
      data: {
        roomId,
        userId,
        playerOrder: room.players.length + 1
      }
    });
    
    return player;
  }
}
```

### Matchmaking Service Implementation
```typescript
class MatchmakingService {
  // Add player to queue
  async addToQueue(userId: number, preferences: any) {
    // Get player ELO rating
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    
    // Add to queue
    const queueEntry = await prisma.matchmakingQueue.create({
      data: {
        userId,
        elo: user.eloRating || 1200,
        preferences,
        timestamp: new Date()
      }
    });
    
    return queueEntry;
  }
  
  // Find matches for players in queue
  async findMatches() {
    // Get players in queue
    const queueEntries = await prisma.matchmakingQueue.findMany({
      include: { user: true }
    });
    
    // Group players by preferences and ELO range
    // Find compatible groups
    // Create rooms for matched players
    
    return matchedGroups;
  }
}
```

## User Experience Considerations

### Room Creation Flow
1. Player clicks "Create Room"
2. Modal appears for room settings
3. Room created with player as host
4. Player automatically joins room
5. Room appears in lobby

### Room Joining Flow
1. Player browses available rooms
2. Clicks "Join Room" on desired room
3. Validation checks (room not full, etc.)
4. Player added to room
5. Room updated with new player count

### Matchmaking Flow
1. Player clicks "Find Match"
2. Player added to matchmaking queue
3. System searches for compatible players
4. Match found notification
5. Room created and players moved to room

### Player Status Indicators
- **Online**: Player is connected to server
- **In Lobby**: Player is browsing rooms
- **In Room**: Player is in a room
- **In Game**: Player is actively playing
- **Ready**: Player is ready to start game

## Performance and Scalability

### Database Optimization
- Indexes on frequently queried fields (room status, player IDs)
- Efficient querying for room lists
- Batch operations for player updates
- Connection pooling for database access

### Memory Management
- Room cleanup when empty or finished
- Queue cleanup for inactive players
- Cache for frequently accessed data
- Memory monitoring for long-running processes

### Scalability Features
- Horizontal scaling support
- Load balancing for matchmaking
- Database sharding for large player bases
- Caching for lobby data

## Testing Strategy

### Unit Tests
- Room creation and deletion
- Player joining/leaving validation
- Queue management operations
- Matchmaking algorithm logic

### Integration Tests
- Complete room lifecycle testing
- Matchmaking flow testing
- Lobby browsing functionality
- Real-time communication testing

### Load Testing
- Concurrent room creation
- High-volume matchmaking
- Simultaneous player connections
- Performance under stress conditions

## Implementation Timeline

### Week 1: Room System Foundation
- Implement database models
- Create room management API
- Add player validation
- Implement basic room state management

### Week 2: Matchmaking System
- Create matchmaking queue
- Implement pairing algorithm
- Add queue management
- Create match notification system

### Week 3: Lobby System
- Implement room listing
- Add player status tracking
- Create lobby UI components
- Integrate real-time updates

### Week 4: Integration and Testing
- Connect all systems
- Implement comprehensive testing
- Optimize performance
- Finalize documentation