# Risk Game Database Schema Design

## Overview
This document outlines the enhanced database schema for the Risk game implementation, extending the existing structure to support the complete official Risk game rules.

## Updated Schema

### User Model (Enhanced)
```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  messages  Message[]
  games     Game[]
  matches   Match[]
  matchHistory MatchHistory[]
  leaderboard Leaderboard?
}
```

### Game Model (Enhanced)
```prisma
model Game {
  id         Int      @id @default(autoincrement())
  name       String
  description String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  userId     Int
  user       User     @relation(fields: [userId], references: [id])
  rooms      Room[]
  matches    Match[]
}
```

### Room Model (Enhanced)
```prisma
model Room {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  gameId    Int
  game      Game     @relation(fields: [gameId], references: [id])
  messages  Message[]
  players   RoomPlayer[]
}
```

### RoomPlayer Model (New)
```prisma
model RoomPlayer {
  id        Int      @id @default(autoincrement())
  roomId    Int
  userId    Int
  playerOrder Int
  createdAt DateTime @default(now())
  room      Room     @relation(fields: [roomId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}
```

### Match Model (New - Core Game State)
```prisma
model Match {
  id         Int      @id @default(autoincrement())
  name       String
  gameState  Json
  players    Json
  status     String   @default("waiting")
  winnerId   Int?
  startedAt  DateTime @default(now())
  endedAt    DateTime?
  turnNumber Int      @default(1)
  currentPlayerId Int?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  user       User     @relation(fields: [winnerId], references: [id])
  playersRef User[]   @relation("MatchPlayer")
}
```

### MatchHistory Model (New)
```prisma
model MatchHistory {
  id         Int      @id @default(autoincrement())
  matchId    Int
  playerId   Int
  result     String
  eloChange  Int?
  playedAt   DateTime @default(now())
  match      Match    @relation(fields: [matchId], references: [id])
  player     User     @relation(fields: [playerId], references: [id])
}
```

### Leaderboard Model (New)
```prisma
model Leaderboard {
  userId    Int    @id
  totalMatches Int
  wins      Int
  losses    Int
  draws     Int
  winRate   Float
  lastUpdated DateTime @default(now())
  user      User   @relation(fields: [userId], references: [id])
}
```

### Message Model (Unchanged)
```prisma
model Message {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())
  userId    Int
  roomId    Int
  user      User     @relation(fields: [userId], references: [id])
  room      Room     @relation(fields: [roomId], references: [id])
}
```

## Key Additions

1. **Match Model**: Central model for game state, replacing the simpler Game model for actual gameplay
2. **RoomPlayer Model**: Tracks player order in rooms for turn-based gameplay
3. **MatchHistory Model**: Records game results and Elo changes
4. **Leaderboard Model**: Maintains player statistics
5. **Json Fields**: gameState and players fields to store complex game state data

## Implementation Notes

- The `gameState` field in Match model will store the complete game state including:
  - Territory ownership and army counts
  - Current turn and phase
  - Player hand of cards
  - Objective cards
  - Game status (waiting, in_progress, finished)
- The `players` field will store player information including their assigned colors and order
- The `status` field will track game phases: waiting, setup, reinforcement, attack, move, finished
- The `turnNumber` field will track the current turn
- The `currentPlayerId` field will indicate whose turn it is

This schema provides the foundation for implementing the complete Risk game mechanics with proper state management and persistence.