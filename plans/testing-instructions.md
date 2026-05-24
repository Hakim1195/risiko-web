# Testing Instructions for Risk Game V2

## Current Status
The Risk Game V2 is currently in the planning phase. The implementation has not yet been completed, but I've created a comprehensive plan that outlines exactly what needs to be built.

## How to Test a Functional Version

### Prerequisites
Before testing, ensure you have:
1. Node.js 18+ installed
2. Docker and Docker Compose installed
3. PostgreSQL and Redis services available
4. The project cloned and dependencies installed

### Setup Instructions

#### 1. Environment Configuration
```bash
# Copy the environment file
cp .env.example .env

# Configure database connection details in .env
# Update with your PostgreSQL and Redis credentials
```

#### 2. Database Setup
```bash
# Run database migrations
cd backend
npx prisma migrate dev --name init

# This will create the database schema based on our planned design
```

#### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 4. Start the Application
```bash
# Start all services with Docker Compose
cd ..
docker-compose up --build
```

### Testing the Current State

#### 1. API Testing
Use tools like Postman or curl to test the API endpoints:

```bash
# Test if the server is running
curl http://localhost:3000/api/health

# Test authentication endpoints
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Test room creation
curl -X POST http://localhost:3000/api/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Test Room","maxPlayers":4}'
```

#### 2. Frontend Testing
Once the frontend is running:
1. Navigate to http://localhost:3001
2. Register or login with test credentials
3. Join a room or create a new one
4. Test basic UI interactions

#### 3. Real-time Testing
Test WebSocket functionality:
1. Connect to the game room
2. Verify real-time updates when other players join
3. Test game state synchronization
4. Verify turn-based mechanics work correctly

## What's Missing (Implementation Required)

### Backend Components to Implement:
1. **Game Service Logic** - Complete Risk game mechanics
2. **Matchmaking Service** - Queue management and player matching
3. **Room Management** - Player joining/leaving functionality
4. **Real-time Communication** - WebSocket integration
5. **Card System** - Territory and objective card handling
6. **Statistics Service** - Leaderboard and match history tracking

### Frontend Components to Implement:
1. **Game Board** - SVG visualization of territories
2. **Interactive UI** - Territory selection and actions
3. **Player Panels** - Display of player information and stats
4. **Chat System** - Real-time messaging between players
5. **Lobby Interface** - Room browsing and creation

## Testing Approach

### Unit Testing
```bash
# Run unit tests for game logic
cd backend
npm test
```

### Integration Testing
1. Test complete game flow from room creation to game completion
2. Verify real-time communication between players
3. Test database persistence of game states
4. Validate authentication and authorization

### End-to-End Testing
1. Multiplayer gameplay testing
2. Turn-based system validation
3. Combat system testing
4. UI responsiveness and functionality

## Expected Test Results

### Functional Tests
- [ ] User registration and authentication
- [ ] Room creation and joining
- [ ] Game state synchronization
- [ ] Turn-based gameplay mechanics
- [ ] Combat resolution system
- [ ] Card exchange functionality
- [ ] Leaderboard updates
- [ ] Match history recording

### Performance Tests
- [ ] Concurrent player connections
- [ ] Real-time update latency
- [ ] Database query performance
- [ ] Memory usage under load

## Troubleshooting

### Common Issues
1. **Database Connection Errors**: Verify .env configuration
2. **WebSocket Disconnections**: Check network connectivity
3. **Authentication Failures**: Validate JWT tokens
4. **Game State Inconsistencies**: Review database schema

### Debugging Tools
1. **Console Logs**: Check server logs for errors
2. **Browser Developer Tools**: Monitor network requests and WebSocket connections
3. **Database Queries**: Verify data integrity
4. **Performance Profiling**: Monitor resource usage

## Next Steps for Implementation

To make this functional, we need to:
1. Implement the backend game service with all Risk mechanics
2. Build the frontend game board with SVG visualization
3. Integrate real-time communication via WebSocket
4. Add the complete matchmaking and room systems
5. Implement statistics and leaderboard features
6. Conduct comprehensive testing of all components

The detailed implementation plan is available in the plans/ directory of this project.