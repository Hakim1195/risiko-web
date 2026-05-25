# Architecture Système - Risiko! Game Board Strategy

## Diagramme d'Architecture Global

```mermaid
graph TB
    subgraph "Frontend Layer"
        F1[React App]
        F2[Home Page]
        F3[Lobby Page]
        F4[Game Page]
        F5[Profile Page]
        F6[Leaderboard Page]
        F7[Store Page]
    end

    subgraph "Communication Layer"
        HTTP[HTTP/REST API]
        WS[WebSocket/Socket.io]
    end

    subgraph "Backend Layer"
        B1[Express Server]
        B2[Auth Controller]
        B3[Game Controller]
        B4[Room Controller]
        B5[Store Controller]
        B6[Leaderboard Controller]
    end

    subgraph "Service Layer"
        S1[AuthService]
        S2[GameService]
        S3[RoomService]
        S4[StoreService]
        S5[LeaderboardService]
        S6[SocketService]
    end

    subgraph "Data Layer"
        DB[(PostgreSQL)]
        REDIS[(Redis)]
    end

    F1 --> HTTP
    F1 --> WS
    HTTP --> B1
    WS --> B1
    B1 --> B2
    B1 --> B3
    B1 --> B4
    B1 --> B5
    B1 --> B6
    B2 --> S1
    B3 --> S2
    B4 --> S3
    B5 --> S4
    B6 --> S5
    S2 --> S6
    S1 --> DB
    S2 --> DB
    S3 --> DB
    S4 --> DB
    S5 --> DB
    S6 --> REDIS
    S6 --> DB
```

## Diagramme de Séquence - Authentification

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    participant Redis

    User->>Frontend: S'inscrire / Se connecter
    Frontend->>Backend: POST /api/auth/register / login
    Backend->>Backend: Valider données
    Backend->>Database: Vérifier utilisateur existant
    Database-->>Backend: Résultat
    Backend->>Backend: Hasher mot de passe
    Backend->>Database: Créer utilisateur
    Database-->>Backend: ID utilisateur
    Backend->>Backend: Générer JWT token
    Backend->>Redis: Stocker session
    Backend-->>Frontend: Token + User info
    Frontend->>Frontend: Stocker token
    Frontend->>User: Redirection vers Home
```

## Diagramme de Séquence - Création de Partie

```mermaid
sequenceDiagram
    participant Player1
    participant Frontend
    participant Backend
    participant Database
    participant SocketIO

    Player1->>Frontend: Clique "Créer une partie"
    Frontend->>Backend: POST /api/rooms/create
    Backend->>Database: Créer room
    Database-->>Backend: Room ID
    Backend->>Backend: Créer Socket room
    Backend-->>Frontend: Room info
    Frontend->>SocketIO: Joindre room
    SocketIO-->>Frontend: Confirmation
    Frontend->>Player1: Afficher room créée
    Note over Frontend,Backend: Attente d'autres joueurs
    
    Player2->>Frontend: Clique "Rejoindre"
    Frontend->>SocketIO: Joindre room
    SocketIO->>Backend: Event: player_joined
    Backend->>Database: Ajouter joueur à room
    Backend->>SocketIO: Broadcast: room_updated
    SocketIO-->>Frontend: Update room info
    Frontend->>Player1: Afficher joueur 2 connecté
```

## Diagramme de Séquence - Tour de Jeu

```mermaid
sequenceDiagram
    participant Player1
    participant Frontend
    participant SocketIO
    participant Backend
    participant GameService
    participant Database

    Note over Player1,Database: Phase 1: Renforcement
    Backend->>GameService: Calculer renforts
    GameService->>GameService: Territoires / 3 + bonus continents
    GameService->>Database: Mettre à jour armées
    Backend->>SocketIO: Broadcast: reinforcement_phase
    SocketIO-->>Frontend: Update game state
    
    Note over Player1,Database: Phase 2: Attaque
    Player1->>Frontend: Sélectionner territoire attaquant
    Frontend->>Frontend: Sélectionner territoire cible
    Frontend->>SocketIO: Event: attack_request
    SocketIO->>Backend: attack_request
    Backend->>GameService: Simuler combat (dés)
    GameService->>GameService: Résoudre pertes
    GameService->>Database: Mettre à jour territoires
    Backend->>SocketIO: Broadcast: attack_result
    SocketIO-->>Frontend: Update game state
    
    Note over Player1,Database: Phase 3: Déplacement
    Player1->>Frontend: Sélectionner déplacement
    Frontend->>SocketIO: Event: move_request
    SocketIO->>Backend: move_request
    Backend->>GameService: Valider déplacement
    Backend->>Database: Mettre à jour armées
    Backend->>SocketIO: Broadcast: move_result
    SocketIO-->>Frontend: Update game state
    
    Backend->>SocketIO: Broadcast: turn_end
    SocketIO-->>Frontend: Next player turn
```

## Diagramme de Classe - Modèles de Données

```mermaid
classDiagram
    class User {
        +int id
        +string username
        +string email
        +string password_hash
        +string avatar_url
        +int elo_rating
        +DateTime created_at
        +List~Game~ games
        +List~Match~ matches
    }

    class Game {
        +int id
        +string name
        +string description
        +DateTime created_at
        +int user_id
        +List~Room~ rooms
    }

    class Room {
        +int id
        +string name
        +int game_id
        +int max_players
        +int current_players
        +string status
        +List~RoomPlayer~ players
    }

    class RoomPlayer {
        +int id
        +int room_id
        +int user_id
        +int player_order
        +string status
    }

    class Match {
        +int id
        +string name
        +json game_state
        +json players
        +string status
        +int winner_id
        +int turn_number
        +DateTime started_at
        +DateTime ended_at
    }

    class Territory {
        +string id
        +string name
        +string continent
        +int armies
        +string owner_id
        +List~string~ neighbors
    }

    class StoreItem {
        +int id
        +string name
        +string description
        +int price
        +string type
        +boolean is_season_pass
    }

    class Leaderboard {
        +int user_id
        +int total_matches
        +int wins
        +int losses
        +float win_rate
        +int elo_rating
    }

    User "1" *-- "0..*" Game : creates
    User "1" *-- "0..*" Match : participates in
    User "1" *-- "1" Leaderboard : has
    Game "1" *-- "0..*" Room : has
    Room "1" *-- "0..*" RoomPlayer : has
    Match "1" *-- "1" User : won by
    Room "1" *-- "0..*" Territory : contains
```

## Diagramme de Composants - Frontend

```mermaid
graph LR
    App[App.jsx] --> Router[React Router]
    Router --> Home[Home Page]
    Router --> Auth[Auth Pages]
    Router --> Lobby[Lobby Page]
    Router --> Game[Game Page]
    Router --> Profile[Profile Page]
    Router --> Leaderboard[Leaderboard Page]
    Router --> Store[Store Page]

    Home --> Navbar[Navbar Component]
    Home --> Footer[Footer Component]
    
    Auth --> Login[Login Form]
    Auth --> Register[Register Form]
    
    Lobby --> RoomList[Room List]
    Lobby --> CreateRoom[Create Room Form]
    
    Game --> GameBoard[Game Board]
    Game --> PlayerPanel[Player Panel]
    Game --> Chat[Chat Component]
    
    GameBoard --> Map[Map Component]
    GameBoard --> Territory[Territory Component]
    
    Profile --> Stats[Stats Component]
    Profile --> History[History Component]
    
    Leaderboard --> LeaderboardList[Leaderboard List]
    
    Store --> StoreList[Store List]
    Store --> SeasonPass[Season Pass Component]
```

## Diagramme de Déploiement

```mermaid
graph TB
    subgraph "Internet"
        Users[Users]
    end

    subgraph "Load Balancer"
        LB[Nginx/traefik]
    end

    subgraph "Frontend Cluster"
        FE1[React App - Node 1]
        FE2[React App - Node 2]
        FE3[React App - Node 3]
    end

    subgraph "Backend Cluster"
        BE1[Express API - Node 1]
        BE2[Express API - Node 2]
        BE3[Express API - Node 3]
    end

    subgraph "Services"
        WS[Socket.io Server]
        CACHE[Redis Cache]
    end

    subgraph "Data Layer"
        DB[(PostgreSQL Primary)]
        REPL[(PostgreSQL Replica)]
        REDIS[(Redis Cluster)]
    end

    Users --> LB
    LB --> FE1
    LB --> FE2
    LB --> FE3
    LB --> BE1
    LB --> BE2
    LB --> BE3
    FE1 --> BE1
    FE2 --> BE2
    FE3 --> BE3
    BE1 --> DB
    BE2 --> DB
    BE3 --> DB
    BE1 --> CACHE
    BE2 --> CACHE
    BE3 --> CACHE
    DB --> REPL
    CACHE --> REDIS
```

## Schéma de Base de Données

```mermaid
erDiagram
    USERS ||--o{ GAMES : creates
    USERS ||--o{ MATCHES : participates_in
    USERS ||--o{ MATCH_HISTORY : has
    USERS ||--|| LEADERBOARD : has
    GAMES ||--o{ ROOMS : creates
    ROOMS ||--o{ ROOM_PLAYERS : contains
    ROOM_PLAYERS }o--|| USERS : player
    MATCHES ||--o{ MATCH_HISTORY : has
    MATCHES }o--|| USERS : won_by
    STORE_ITEMS ||--o{ PURCHASES : sold_in
    PURCHASES }o--|| USERS : purchased_by
    SEASON_PASSES ||--o{ SUBSCRIPTIONS : offered_in
    SUBSCRIPTIONS }o--|| USERS : subscribed_by

    USERS {
        int id PK
        string username UK
        string email UK
        string password_hash
        string avatar_url
        int elo_rating
        datetime created_at
        datetime updated_at
    }

    GAMES {
        int id PK
        string name
        string description
        datetime created_at
        int user_id FK
    }

    ROOMS {
        int id PK
        string name
        int game_id FK
        int max_players
        int current_players
        string status
        datetime created_at
    }

    ROOM_PLAYERS {
        int id PK
        int room_id FK
        int user_id FK
        int player_order
        string status
        datetime joined_at
    }

    MATCHES {
        int id PK
        string name
        json game_state
        json players
        string status
        int winner_id FK
        int turn_number
        datetime started_at
        datetime ended_at
    }

    MATCH_HISTORY {
        int id PK
        int match_id FK
        int player_id FK
        string result
        int elo_change
        datetime played_at
    }

    LEADERBOARD {
        int user_id PK FK
        int total_matches
        int wins
        int losses
        int draws
        float win_rate
        int elo_rating
        datetime last_updated
    }

    STORE_ITEMS {
        int id PK
        string name
        string description
        int price
        string type
        boolean is_season_pass
        string image_url
        datetime created_at
    }

    PURCHASES {
        int id PK
        int user_id FK
        int item_id FK
        int quantity
        int total_price
        datetime purchased_at
    }

    SEASON_PASSES {
        int id PK
        string name
        string description
        int price
        int duration_days
        json benefits
        datetime created_at
    }

    SUBSCRIPTIONS {
        int id PK
        int user_id FK
        int season_pass_id FK
        datetime started_at
        datetime ended_at
        boolean is_active
    }
```

## Conclusion

Cette architecture fournit une base solide pour le jeu Risiko! avec:
- Scalabilité horizontale possible
- Séparation claire des responsabilités
- Communication en temps réel via WebSocket
- Persistance des données avec PostgreSQL
- Cache avec Redis pour performances
- Design responsive et moderne
