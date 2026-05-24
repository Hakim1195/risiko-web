# Statistics and Leaderboard Implementation Plan

## Overview
This document outlines the implementation plan for the statistics and leaderboard features that will enhance the competitive aspect of the Risk game. These features will track player performance and provide meaningful insights into gameplay.

## System Architecture

### Core Components

#### 1. Player Statistics Tracking
- Game participation metrics
- Victory/defeat records
- Performance indicators
- Historical data storage

#### 2. Leaderboard System
- Real-time ranking updates
- Multiple ranking categories
- Seasonal and all-time rankings
- Player comparison features

#### 3. Match History Management
- Complete game records
- Performance analysis
- Replay capability
- Statistical trend tracking

## Database Schema Enhancements

### Leaderboard Model (Enhanced)
```prisma
model Leaderboard {
  userId    Int    @id
  totalMatches Int
  wins      Int      @default(0)
  losses    Int      @default(0)
  draws     Int      @default(0)
  winRate   Float    @default(0.0)
  lastUpdated DateTime @default(now())
  user      User   @relation(fields: [userId], references: [id])
}
```

### MatchHistory Model (Enhanced)
```prisma
model MatchHistory {
  id         Int      @id @default(autoincrement())
  matchId    Int
  playerId   Int
  result     String   // win, loss, draw
  eloChange  Int?
  playedAt   DateTime @default(now())
  match      Match    @relation(fields: [matchId], references: [id])
  player     User     @relation(fields: [playerId], references: [id])
}
```

## Statistics Tracking

### Player Metrics to Track
1. **Game Participation**
   - Total matches played
   - Matches won/lost/drawn
   - Win rate percentage

2. **Performance Indicators**
   - Average armies deployed
   - Successful attacks
   - Territory conquest rate
   - Card exchange efficiency

3. **Advanced Metrics**
   - ELO rating system
   - Peak performance indicators
   - Consistency scores
   - Strategic effectiveness

### Match Statistics
1. **Per-Match Data**
   - Turn count
   - Time to victory/defeat
   - Territory distribution
   - Army usage patterns

2. **Player Contributions**
   - Territories controlled
   - Armies deployed
   - Combat effectiveness
   - Objective completion

## Leaderboard System

### Ranking Categories
1. **All-Time Leaderboard**
   - Total wins across all time
   - Overall performance ranking

2. **Seasonal Leaderboard**
   - Performance in current season
   - Time-based rankings

3. **Recent Activity Leaderboard**
   - Active players with recent games
   - Short-term performance

4. **Specialty Leaderboards**
   - Fastest victories
   - Most territories conquered
   - Best combat record
   - Card exchange mastery

### Ranking Algorithm
1. **Primary Ranking**: Total wins
2. **Secondary Ranking**: Win rate percentage
3. **Tertiary Ranking**: ELO rating (if implemented)
4. **Tie-Breakers**: Recent activity, total matches

## Implementation Approach

### Phase 1: Data Collection and Storage
1. **Database Models**: Implement leaderboard and match history models
2. **Statistics Collection**: Add data collection to game flow
3. **Historical Tracking**: Store match results and player performance
4. **ELO System**: Implement rating calculation (optional)

### Phase 2: Leaderboard Generation
1. **Ranking Algorithms**: Implement ranking logic
2. **Real-time Updates**: Update rankings as games complete
3. **Filtering Options**: Support different ranking categories
4. **Pagination**: Handle large player bases efficiently

### Phase 3: UI Integration
1. **Player Profile Pages**: Display personal statistics
2. **Leaderboard Views**: Show rankings in various formats
3. **Performance Charts**: Visualize trends and improvements
4. **Comparison Tools**: Compare player performance

### Phase 4: Advanced Features
1. **Seasonal Tracking**: Track performance over time
2. **Achievement System**: Unlock badges for milestones
3. **Export Functionality**: Allow data export for analysis
4. **Privacy Controls**: Player data visibility settings

## Detailed Implementation Steps

### Step 1: Database Schema Implementation

#### Leaderboard Service
```typescript
// backend/src/services/leaderboard.service.js
class LeaderboardService {
  // Update player statistics after match
  async updatePlayerStats(matchResult) {
    const { playerId, result, eloChange } = matchResult;
    
    // Get current stats
    let leaderboard = await prisma.leaderboard.findUnique({
      where: { userId: playerId }
    });
    
    // Initialize if not exists
    if (!leaderboard) {
      leaderboard = await prisma.leaderboard.create({
        data: {
          userId: playerId,
          totalMatches: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          winRate: 0.0
        }
      });
    }
    
    // Update statistics
    const updates = {
      totalMatches: leaderboard.totalMatches + 1
    };
    
    switch (result) {
      case 'win':
        updates.wins = leaderboard.wins + 1;
        break;
      case 'loss':
        updates.losses = leaderboard.losses + 1;
        break;
      case 'draw':
        updates.draws = leaderboard.draws + 1;
        break;
    }
    
    // Calculate new win rate
    updates.winRate = updates.wins / updates.totalMatches * 100;
    
    // Update ELO if provided
    if (eloChange !== undefined) {
      // ELO calculation logic
    }
    
    // Update database
    const updated = await prisma.leaderboard.update({
      where: { userId: playerId },
      data: {
        ...updates,
        lastUpdated: new Date()
      }
    });
    
    return updated;
  }
  
  // Get leaderboard rankings
  async getLeaderboard(category = 'all-time', limit = 100) {
    const rankings = await prisma.leaderboard.findMany({
      orderBy: {
        wins: 'desc'
      },
      take: limit
    });
    
    return rankings;
  }
}
```

### Step 2: Match History Management

#### Match History Service
```typescript
// backend/src/services/matchHistory.service.js
class MatchHistoryService {
  // Record match result
  async recordMatchResult(matchId, playerId, result, eloChange = null) {
    const matchHistory = await prisma.matchHistory.create({
      data: {
        matchId,
        playerId,
        result,
        eloChange
      }
    });
    
    return matchHistory;
  }
  
  // Get player match history
  async getPlayerMatchHistory(playerId, limit = 50) {
    const history = await prisma.matchHistory.findMany({
      where: { playerId },
      include: { match: true },
      orderBy: { playedAt: 'desc' },
      take: limit
    });
    
    return history;
  }
  
  // Get match statistics
  async getMatchStatistics(matchId) {
    const history = await prisma.matchHistory.findMany({
      where: { matchId },
      include: { player: true }
    });
    
    return history;
  }
}
```

### Step 3: ELO Rating System (Optional Advanced Feature)

#### ELO Calculation
```typescript
// backend/src/utils/elo.js
class ELOCalculator {
  static calculateRatingChange(playerRating, opponentRating, result) {
    // result: 1 for win, 0.5 for draw, 0 for loss
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    const actualScore = result;
    const kFactor = 32; // Can be adjusted based on player skill level
    
    return Math.round(kFactor * (actualScore - expectedScore));
  }
  
  static updatePlayerRating(playerId, opponentId, result) {
    // Get current ratings
    const playerRating = getPlayerRating(playerId);
    const opponentRating = getPlayerRating(opponentId);
    
    // Calculate new ratings
    const ratingChange = this.calculateRatingChange(playerRating, opponentRating, result);
    
    // Update player ratings
    updatePlayerRating(playerId, playerRating + ratingChange);
    
    return ratingChange;
  }
}
```

## API Endpoints

### Statistics Endpoints
```
GET /stats/player/:id - Get player statistics
GET /stats/match/:id - Get match statistics
GET /stats/history/:id - Get player match history
GET /stats/leaderboard - Get leaderboard rankings
GET /stats/leaderboard/:category - Get specific category leaderboard
```

### Player Profile Endpoints
```
GET /players/:id/profile - Get player profile with stats
GET /players/:id/achievements - Get player achievements
GET /players/:id/trends - Get performance trends
```

## UI/UX Implementation

### Player Profile Page
```
┌─────────────────────────────────────────────────────────┐
│  Player Profile                                         │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ [Avatar] Player Name | ELO: 1450                   │ │
│  └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  Statistics Overview                                    │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Wins: 124 | Losses: 86 | Win Rate: 59.2%           │ │
│  │ Total Matches: 210 | Avg. Turns: 24.5              │ │
│  │ Cards Exchanged: 42 | Territories: 18.3           │ │
│  └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  Recent Activity                                        │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ [Recent Match 1]                                    │ │
│  │ [Recent Match 2]                                    │ │
│  │ [Recent Match 3]                                    │ │
│  └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  Leaderboard Position                                   │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ #12 Overall | #8 Regional | #5 Seasonal             │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Leaderboard Page
```
┌─────────────────────────────────────────────────────────┐
│  Leaderboard                                            │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ [Filter: All-Time | Seasonal | Recent]              │ │
│  └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  Rankings                                               │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ 1. Player1 (ELO: 1650) | 142 wins | 5.2% draw rate  │ │
│  │ 2. Player2 (ELO: 1580) | 138 wins | 4.1% draw rate  │ │
│  │ 3. Player3 (ELO: 1520) | 135 wins | 6.8% draw rate  │ │
│  │ ...                                                 │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Data Analysis and Visualization

### Performance Charts
1. **Win Rate Trend**: Line chart showing win rate over time
2. **Match Duration**: Histogram of game lengths
3. **Territory Growth**: Line chart of territory control
4. **Army Usage**: Bar chart of army deployment patterns

### Statistical Reports
1. **Seasonal Performance**: Compare performance across seasons
2. **Player Comparison**: Side-by-side comparison of players
3. **Strategy Analysis**: Battle effectiveness metrics
4. **Trend Analysis**: Long-term performance improvements

## Implementation Timeline

### Week 1: Data Collection and Storage
- Implement leaderboard and match history database models
- Add statistics collection to game flow
- Create data storage for match results
- Implement basic ELO rating system

### Week 2: Leaderboard Generation
- Implement ranking algorithms
- Create leaderboard API endpoints
- Add filtering and sorting capabilities
- Implement pagination for large datasets

### Week 3: UI Integration
- Create player profile pages
- Implement leaderboard views
- Add performance charts and visualizations
- Create match history displays

### Week 4: Advanced Features
- Implement seasonal tracking
- Add achievement system
- Create data export functionality
- Add privacy controls for player data

## Testing Strategy

### Unit Tests
- Statistics calculation accuracy
- Leaderboard ranking algorithms
- Data persistence and retrieval
- ELO rating calculations

### Integration Tests
- End-to-end statistics tracking
- Leaderboard update processes
- Player profile data consistency
- API endpoint functionality

### Performance Tests
- Large dataset handling
- Concurrent leaderboard updates
- Real-time statistics processing
- Database query optimization

## Privacy and Data Protection

### Data Handling
- Player privacy settings
- Data retention policies
- GDPR compliance
- User consent for statistics collection

### Access Controls
- Public vs private profile settings
- Anonymous statistics options
- Data export permissions
- Account deletion procedures

## Future Enhancements

### Advanced Analytics
- Machine learning for performance prediction
- Strategic pattern recognition
- Player behavior analysis
- Competitive intelligence tools

### Social Features
- Friend comparison systems
- Team-based statistics
- Tournament tracking
- Community challenges

### Mobile Integration
- Mobile-friendly statistics views
- Push notifications for rankings
- Offline statistics caching
- Mobile-specific analytics