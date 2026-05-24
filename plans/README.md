# Game Board Strategy - Multiplayer Turn-Based Strategy Game

A browser-based turn-based strategy game similar to Risk/Risiko with real-time multiplayer capabilities.

## Architecture Overview

This project follows a microservices architecture with:
- Frontend (React) for the user interface
- Backend (Node.js) for game logic and API
- PostgreSQL for persistent data storage
- Redis for real-time game state management
- Traefik as reverse proxy

## Project Structure

```
game-board-strategy/
├── frontend/        # React frontend application
├── backend/         # Node.js backend with REST API and WebSocket server
├── nginx/           # Nginx configuration
└── traefik/         # Traefik configuration
```

## Features

- Real-time multiplayer gameplay
- Turn-based strategy mechanics
- Player profiles with statistics
- Competitive ranking system
- Matchmaking system
- Interactive world map visualization

## Technical Architecture

### Network Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Web    │    │   Client Web    │    │   Client Web    │
│   (Browser)     │    │   (Browser)     │    │   (Browser)     │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Traefik Reverse       │
                    │      Proxy              │
                    │  (Load Balancer + SSL)  │
                    └─────────┬───────────────┘
                                │
                    ┌────────────▼────────────┐
                    │   Docker Compose        │
                    │   Orchestration         │
                    └─────────┬───────────────┘
                                │
    ┌────────────────────────────▼────────────────────────────┐
    │                     Services                              │
    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
    │  │   Frontend  │  │   Backend   │  │   Database  │     │
    │  │   (React)   │  │  (Node.js)  │  │  (PostgreSQL)│     │
    │  └─────────────┘  └─────────────┘  └─────────────┘     │
    │      │               │              │                │
    │      │               │              │                │
    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
    │  │   Redis     │  │  WebSocket  │  │   API       │     │
    │  │ (Cache)     │  │  Server     │  │  REST       │     │
    │  └─────────────┘  └─────────────┘  └─────────────┘     │
    └─────────────────────────────────────────────────────────┘
```

### Communication Flow

1. **Client → Traefik**: HTTP/HTTPS requests routed to appropriate services
2. **Traefik → Frontend**: HTTP traffic to React application (port 3001)
3. **Traefik → Backend**: HTTP/WS traffic to Node.js backend (port 3000)
4. **Frontend → Backend**: REST API calls for data operations
5. **Frontend ↔ Backend**: WebSocket connections for real-time updates
6. **Backend → Database**: PostgreSQL queries for persistent storage
7. **Backend → Redis**: Cache operations for game state and matchmaking
8. **Backend ↔ Frontend**: Real-time events through Socket.IO

## Technology Stack

### Frontend (React)
- React 18+ with Hooks
- Redux Toolkit for state management
- Socket.IO Client for real-time communication
- Axios for HTTP requests
- Canvas/WebGL/SVG for map rendering
- Tailwind CSS or Material UI for styling

### Backend (Node.js)
- Node.js 18+ LTS
- Express.js for REST API
- Socket.IO for WebSocket communication
- Prisma ORM for database operations
- JWT for authentication
- Bcrypt for password hashing
- Redis client for caching

### Database Layer
- PostgreSQL 15+ for persistent data storage
- Redis 7+ for in-memory cache and real-time state

### Infrastructure
- Docker & Docker Compose for containerization
- Traefik v2.9 as reverse proxy and load balancer
- Nginx (optional) for additional static file serving

## Data Modeling

### PostgreSQL Tables

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    elo_rating INTEGER DEFAULT 1200
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

#### Matches Table
```sql
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_state JSONB NOT NULL,
    players JSONB NOT NULL, -- Array of player IDs and roles
    status VARCHAR(20) NOT NULL DEFAULT 'waiting', -- waiting, in_progress, finished
    winner_id UUID REFERENCES users(id),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    turn_number INTEGER DEFAULT 1,
    current_player_id UUID REFERENCES users(id)
);

CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_started_at ON matches(started_at);
```

#### Match History Table
```sql
CREATE TABLE match_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id),
    player_id UUID REFERENCES users(id),
    result VARCHAR(10) NOT NULL, -- win, loss, draw
    elo_change INTEGER,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Leaderboard Table
```sql
CREATE TABLE leaderboard (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    total_matches INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0.00,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Redis Data Structures

#### Game State Cache
```json
{
  "gameId": "uuid",
  "boardState": {
    "territories": [
      {
        "id": "territory_id",
        "owner": "user_id",
        "armies": 5,
        "connections": ["adjacent_territory_1", "adjacent_territory_2"]
      }
    ],
    "currentTurn": 1,
    "players": [
      {
        "id": "user_id",
        "name": "username",
        "color": "#FF0000",
        "armiesToPlace": 10,
        "isTurn": true
      }
    ]
  },
  "matchStatus": "in_progress",
  "turnPhase": "reinforcement"
}
```

#### Matchmaking Queue
```json
{
  "queue": [
    {
      "userId": "user_id",
      "elo": 1200,
      "timestamp": "ISO timestamp",
      "preferences": {
        "maxPlayers": 4,
        "mapType": "world"
      }
    }
  ]
}
```

#### Active Games
```json
{
  "activeGames": {
    "gameId": {
      "players": ["user1", "user2", "user3"],
      "status": "waiting",
      "turn": 1,
      "createdAt": "timestamp"
    }
  }
}
```

## Project Structure (Monorepo)

```
game-board-strategy/
├── backend/                    # Node.js backend
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/             # Database models
│   │   ├── routes/             # API endpoints
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Custom middlewares
│   │   ├── utils/              # Utility functions
│   │   ├── config/             # Configuration files
│   │   └── server.js           # Main server entry point
│   ├── package.json
│   └── Dockerfile
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service layer
│   │   ├── store/              # Redux store configuration
│   │   ├── pages/              # Page components
│   │   └── App.jsx             # Main application component
│   ├── package.json
│   └── Dockerfile
├── nginx/                      # Nginx configuration
│   └── nginx.conf
├── traefik/                    # Traefik configuration
│   ├── traefik.yml
│   └── acme.json
├── docker-compose.yml          # Docker orchestration
├── config.js                   # Centralized configuration
├── .env.example                # Environment variables template
├── README.md                   # Project documentation
└── start.sh                    # Startup script
```

## Configuration

### Environnement de Développement

Pour configurer l'environnement de développement :

1. Copiez le fichier `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```

2. Remplissez les variables d'environnement sensibles dans le fichier `.env` :
   ```
   MYSQL_ROOT_PASSWORD=your_root_password
   MYSQL_PASSWORD=your_database_password
   ```

3. Démarrez l'application avec Docker Compose :
   ```bash
   docker-compose up --build
   ```

## Development Plan (5 Phases)

### Phase 1: Foundation & Authentication System
- Core project structure setup
- User authentication system (JWT)
- Database schema design and implementation
- Basic REST API endpoints for users
- Frontend user profile components

### Phase 2: Game State Management & Matchmaking
- Core game state management in Redis
- Matchmaking system with queue management
- Basic match creation and joining logic
- Turn-based game flow implementation
- Real-time communication setup with Socket.IO

### Phase 3: Core Gameplay Mechanics
- Territory-based gameplay implementation
- Army movement and combat system
- Dice rolling and battle resolution
- Game board visualization (canvas/SVG)
- Player turn management

### Phase 4: Advanced Features & UI
- Complete player profiles with stats
- Leaderboard and ranking system
- Match history and statistics
- Enhanced UI with interactive map
- Mobile-responsive design

### Phase 5: Production Ready & Optimization
- Performance optimization and caching
- Security hardening
- Comprehensive testing suite
- Production deployment configuration
- Monitoring and logging setup

## Roadmap du Projet

### V0.1 - Base Fonctionnelle (Complétée)
- [x] Structure de base du projet
- [x] Configuration du backend avec Express.js
- [x] Configuration du frontend avec React
- [x] Routes et controllers pour authentification, jeux et salles
- [x] Intégration de Socket.IO
- [x] Documentation complète
- [x] Script de démarrage

### V0.2 - Améliorations et Optimisations (En cours)
- [x] Intégration de la base de données avec Prisma
- [ ] Tests unitaires et d'intégration
- [x] Configuration complète de Docker Compose
- [x] Amélioration de la sécurité (middlewares, validations)
- [x] Refactoring des controllers vers services
- [ ] Développement des composants frontend
- [x] Gestion avancée des salles et des parties

### V0.3 - Fonctionnalités Avancées
- [ ] Système de chat en temps réel dans les salles
- [ ] Système de notifications
- [ ] Système de sauvegarde et de restauration de parties
- [ ] Interface d'administration
- [ ] Système de classement et de statistiques

### V0.4 - Déploiement et Production
- [ ] Configuration de déploiement sur serveur
- [ ] Gestion des environnements (dev, staging, prod)
- [ ] Monitoring et logs
- [ ] Sécurité avancée
- [ ] Optimisation des performances

## Backend Improvements and Fixes

### Key Backend Changes Made:

1. **Authentication System**:
   - Fixed import/export issues in authentication controller
   - Installed required dependencies: jsonwebtoken, bcryptjs, and their type definitions
   - Properly implemented JWT authentication with password hashing

2. **Room Management**:
   - Removed non-existent `maxPlayers` and `status` fields that don't exist in database schema
   - Updated all room operations to work with valid fields only (`name`, `gameId`)

3. **Game Management**:
   - Implemented proper user ID association for game creation
   - Enhanced type safety with TypeScript interfaces
   - Fixed database schema compliance issues

4. **TypeScript Configuration**:
   - Resolved all compilation errors
   - Ensured proper type checking throughout the codebase
   - Maintained full functionality while fixing bugs

### Prochaines Étapes Possibles :

1. **Développement des composants frontend** - Création des interfaces utilisateur pour les pages principales
2. **Configuration de la base de données avec Prisma** - Finalisation de l'intégration et des modèles de données
3. **Tests unitaires et d'intégration** - Mise en place des tests pour garantir la qualité du code
4. **Configuration complète de Docker Compose** - Optimisation et validation de l'orchestration des services
5. **Développement du système de matchmaking** - Implémentation du système qui associe les joueurs
6. **Implémentation du système de jeu principal** - Mise en place des règles de base du jeu
7. **Système de chat et notifications** - Ajout de fonctionnalités sociales
8. **Optimisation des performances** - Amélioration de la vitesse et de l'expérience utilisateur
9. **Configuration de déploiement** - Préparation pour le déploiement en production
10. **Sécurité avancée** - Mise en place de mesures de sécurité supplémentaires