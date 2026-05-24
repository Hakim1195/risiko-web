# Risk Game Mechanics Implementation Plan

## Overview
This document outlines the implementation plan for the core Risk game mechanics in the V2 version of the game. The implementation will follow the official Risk rules as specified in the reglement-jeux.txt file.

## Core Game Components

### 1. Game State Management
The game state will be managed through the Match model with JSON fields to store:
- Territory ownership and army counts
- Current turn and phase
- Player hands of cards
- Objective cards
- Game status (waiting, setup, reinforcement, attack, move, finished)

### 2. Territory Management
- 42 territories organized into 6 continents
- Territory adjacency relationships for valid attacks
- Army placement and movement rules
- Continent control bonuses

### 3. Turn-Based System
The turn will follow the 4-phase structure:
1. Reinforcement Phase
2. Attack Phase
3. Fortify Phase
4. Card Drawing Phase

### 4. Combat System
- Dice rolling mechanics (3 dice max for attacker, 3 dice max for defender)
- Battle resolution rules (highest dice vs highest dice)
- Army loss calculation
- Territory conquest logic

### 5. Card System
- Territory cards (42 cards, 3 types: Infantry, Cavalry, Artillery)
- Objective cards (14 cards, secret objectives)
- Jolly cards (2 cards, wildcards)
- Card exchange mechanics

## Implementation Steps

### Phase 1: Core Game Logic Implementation
1. **Enhance Game Service** with complete Risk game mechanics
2. **Implement Territory Management** with adjacency lists
3. **Create Turn-Based System** with all 4 phases
4. **Develop Combat Engine** with dice rolling and battle resolution
5. **Add Card System** with territory and objective cards

### Phase 2: Game State Management
1. **Design Game State Structure** for JSON storage
2. **Implement Game Initialization** with territory distribution
3. **Create Game Flow Control** for turn progression
4. **Add Game End Conditions** (victory conditions)

### Phase 3: API Endpoints
1. **Create Match Management Endpoints**
2. **Implement Game State Update Endpoints**
3. **Add Combat and Movement Endpoints**
4. **Create Card Handling Endpoints**

### Phase 4: Frontend Integration
1. **Design Game Board UI** with SVG/Canvas visualization
2. **Implement Territory Selection** and interaction
3. **Create Action Panels** for each game phase
4. **Add Real-time Updates** through WebSocket communication

## Detailed Technical Specifications

### Territory Data Structure
```json
{
  "territories": [
    {
      "id": "alaska",
      "name": "Alaska",
      "continent": "amerique_du_nord",
      "armies": 0,
      "owner": null,
      "adjacentTerritories": ["groenland", "ouest_canada", "kamchatka"]
    }
  ],
  "continents": [
    {
      "id": "amerique_du_nord",
      "name": "Amérique du Nord",
      "bonusArmies": 5,
      "territories": ["alaska", "groenland", "amazonie", "ouest_canada", "est_canada", "sud_est_usa", "sud_ouest_usa", "nord_est_usa", "nord_ouest_usa"]
    }
  ]
}
```

### Game State Structure
```json
{
  "gameId": "uuid",
  "boardState": {
    "territories": [...],
    "currentTurn": 1,
    "players": [
      {
        "id": "user_id",
        "name": "username",
        "color": "#FF0000",
        "armiesToPlace": 10,
        "isTurn": true,
        "hand": ["card1", "card2"],
        "objectives": ["objective1"]
      }
    ]
  },
  "matchStatus": "in_progress",
  "turnPhase": "reinforcement",
  "currentPlayerId": "user_id"
}
```

### Turn Phases Implementation

#### Phase 1: Reinforcement
- Calculate reinforcements based on territories controlled
- Apply continent bonuses
- Handle card exchanges
- Allow army placement

#### Phase 2: Attack
- Validate attack moves (adjacent territories, minimum 2 armies)
- Roll dice for attacker and defender
- Resolve battle outcomes
- Handle territory conquest

#### Phase 3: Fortify
- Move armies between adjacent territories
- Validate movement rules

#### Phase 4: Card Drawing
- Draw card if territory conquered
- Handle game end conditions

### Combat Rules Implementation
1. **Dice Rolling**:
   - Attacker: 1-3 dice (max 3)
   - Defender: 1-3 dice (max 3)
2. **Battle Resolution**:
   - Compare highest dice, then second highest, then third
   - Attacker wins if higher, defender wins if equal or lower
   - Loser loses one army per comparison
3. **Conquest Logic**:
   - If defender loses all armies, territory is conquered
   - Attacker must move at least 1 army to conquered territory
   - Attacker can move more armies if desired

### Card System Implementation
1. **Territory Cards**:
   - 42 cards (3 types: Infantry, Cavalry, Artillery)
   - 2 Jolly cards (wildcards)
2. **Objective Cards**:
   - 14 secret objectives
   - Win conditions (conquer territories, eliminate players, control continents)
3. **Card Exchange**:
   - 3 Infantry = 6 armies
   - 3 Cavalry = 8 armies
   - 3 Artillery = 4 armies
   - 1 Jolly + 2 identical = 12 armies
   - 1 Infantry + 1 Cavalry + 1 Artillery = 10 armies

## Database Schema Updates Required

### Match Model (Enhanced)
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

## API Endpoints to Implement

### Match Management
- POST /matches - Create new match
- GET /matches/:id - Get match details
- PUT /matches/:id - Update match state
- DELETE /matches/:id - Delete match

### Game Actions
- POST /matches/:id/reinforce - Place reinforcements
- POST /matches/:id/attack - Execute attack
- POST /matches/:id/move - Move armies
- POST /matches/:id/end-turn - End current turn
- POST /matches/:id/exchange-cards - Exchange cards

### Card Operations
- POST /matches/:id/draw-card - Draw territory card
- POST /matches/:id/exchange-card - Exchange cards for armies

## UI/UX Implementation Plan

### Game Board Visualization
- SVG-based map with territories
- Color-coded territories by owner
- Army counters on territories
- Interactive territory selection
- Visual feedback for valid moves

### Game Interface Components
- Player information panel
- Action buttons (deploy, attack, move, fortify)
- Chat functionality
- Game status indicators
- Turn phase indicators
- Card display

### Real-time Updates
- WebSocket integration for live game state updates
- Player turn notifications
- Battle result notifications
- Game event logging

## Testing Strategy

### Unit Tests
- Territory adjacency validation
- Army placement rules
- Combat resolution logic
- Card exchange calculations
- Turn progression logic

### Integration Tests
- Complete game flow testing
- Multiplayer interaction scenarios
- Game state persistence
- Real-time communication

### User Acceptance Tests
- Gameplay walkthroughs
- UI/UX validation
- Performance testing
- Cross-browser compatibility

## Implementation Timeline

### Week 1: Core Mechanics
- Implement territory management
- Create turn-based system
- Develop combat engine
- Add card system

### Week 2: Game State & API
- Design comprehensive game state structure
- Implement match management API
- Create game flow control
- Add victory condition checking

### Week 3: Frontend Integration
- Implement game board visualization
- Create interactive UI components
- Integrate real-time communication
- Add game statistics display

### Week 4: Testing & Refinement
- Comprehensive testing of all mechanics
- UI/UX refinement
- Performance optimization
- Documentation and finalization