# Complete Project Documentation

## 1. Game Design Document (GDD.md)

### I. GAME DESIGN DOCUMENT (GDD) : La Boucle de Base
## 1. Paramètres Globaux et Mise en place
Thème & Carte : Post-apocalyptique, vue 2.5D isométrique. 43 territoires répartis en 5 continents avec bonus (Eurasia +5, Americhe +4, Afarik +3, Aurora +2, Neksis +3).

Conditions de Victoire : Contrôle total (43), élimination des autres, ou objectif secret.

Troupes Initiales : 35 unités (3 joueurs), 30 (4j), 25 (5j), 20 (6j).

Distribution : Les territoires sont distribués 1 par 1. Les joueurs n'obtenant pas de territoire au dernier tour reçoivent une bonus_compensation (unité à poser sur un territoire déjà possédé).

Déploiement Initial : Pose 3 par 3. Suivie d'une Phase de Bluff où les joueurs peuvent retirer secrètement des unités du plateau pour les placer dans leur Stock.

## 2. Le Tour de Jeu (6 Phases Strictes)
Phase 0 : La Contamination. La Zone se déplace avec une probabilité croissante : 20% (T1 & T2), 40% (T3), 60% (T4), 80% (T5), 100% (T6). Le compteur retombe à 1 dès qu'elle bouge.

Phase 1 : Renforts. Gain d'unités = (Régions possédées / 3) arrondi à l'inférieur + Bonus de continents. Pas de minimum garanti. Les unités vont dans le Stock.

Phase 2 : Déploiement. Le joueur place autant d'unités qu'il le souhaite depuis son Stock vers ses territoires (aucune limite de montant).

Phase 3 : Attaques. Illimitées. Minimum 2 unités sur le territoire attaquant (1 reste en garnison). Résolution aux dés (1 dé = 1 unité). Attaquant (max 3 dés) vs Défenseur (max 3 dés, choisit le nombre d'unités engagées pour limiter les pertes). Égalité = victoire du défenseur.

Phase 4 : Mouvement Stratégique. 1 seul déplacement autorisé en fin de tour vers un territoire adjacent contrôlé. Interdiction de faire converger plusieurs déplacements vers la même destination lors d'un même tour.

Phase 5 : Cartes Événement. Pioche d'une carte (Bonus d'unités pour le jeu de base) ajoutée au deck/main.

## 3. Les Éléments en Quarantaine (Pour plus tard)
[Sujet 1] - Factions : Pouvoirs asymétriques (Sintetici, Mutanti, Coloni, Rettiliani, Predoni).

[Sujet 2] - Économie Avancée : Cartes spéciales, boutique, collection, deckbuilding pré-match.

### II. ARCHITECTURE LOGICIELLE (Backend)
Le Langage & Framework : Python avec FastAPI.

Le Réseau : Communication en temps réel via WebSockets pour synchroniser les animations (dés, mouvements) chez tous les joueurs avec une empreinte ressource minimale.

Le Pattern de Conception : Approche par Composition et Événements (Architecture Orientée Données). Pas de classes imbriquées complexes. Un « Event Bus » reçoit les actions, un « Rules Engine » les valide, et des modules indépendants modifient l'état du jeu.

### III. INFRASTRUCTURE ET DÉPLOIEMENT
Serveur & Routage : Un VPS dédié unique pour démarrer, avec Traefik comme reverse proxy pour générer automatiquement les certificats SSL/HTTPS et router le trafic.

Conteneurisation : 100% sur Docker via docker-compose. Aucun service installé « en dur » sur l'OS pour garantir l'isolation et préparer le futur passage sous Kubernetes.

Les Bases de Données (Hybride) :

Redis (en RAM avec option AOF) : Pour gérer la partie en cours de manière ultra-rapide (déplacements, dés, état du plateau).

PostgreSQL (Relationnel) : Pour stocker les profils joueurs, historiques, inventaires et statistiques.

Sauvegardes (Backup) : Un script automatisé (Cron) exécutera un pg_dump à l'intérieur du conteneur PostgreSQL et enverra le fichier SQL propre vers un serveur de sauvegarde externe.

CI/CD (Déploiement Continu) : GitHub Actions avec un « self-hosted runner » sur le VPS. Déploiement fluide (up -d --build) et sécurisation stricte via l'injection de variables depuis les Secrets GitHub pour générer le fichier .env à la volée.

## 2. Infrastructure Implementation Summary (infrastructure-summary.md)

# Infrastructure Implementation Summary

I have successfully implemented all the required infrastructure files for your multiplayer strategy game. Here's what has been created:

## 1. Docker Compose Configuration
- **File**: `docker-compose.yml`
- **Services**: frontend, backend, postgres, redis
- **Traefik Integration**: Configured with appropriate labels for routing
- **Networks**: Connected to external `traefik_web` network as required

## 2. Environment Configuration
- **File**: `.env`
- Contains all necessary environment variables for PostgreSQL and Redis

## 3. Frontend Service
- **Dockerfile**: Nginx Alpine-based container
- **Nginx Configuration**: Properly configured for SPA routing and WebSocket proxying
- **Static Files**: Basic index.html placeholder

## 4. Backend Service
- **Dockerfile**: Python/FastAPI optimized container with non-root user
- **Requirements**: Complete list of dependencies in `requirements.txt`
- **Main Application**: Basic FastAPI application structure in `main.py`

## 5. Directory Structure
```
├── .env
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── index.html
└── backend/
    ├── Dockerfile
    ├── requirements.txt
    └── main.py
```

## Deployment Instructions

1. Ensure Traefik is running and accessible as `traefik_web` external network
2. Run `docker-compose up -d` to start all services
3. Services will be available at:
   - Frontend: https://game.example.com
   - Backend API: https://api.game.example.com

## Next Steps

The infrastructure is now ready for the game logic implementation. The Event-Driven/Composition architecture pattern can be implemented in the backend `main.py` file, with Redis handling real-time game state and PostgreSQL managing persistent data.

All constraints have been followed:
- Backend is strictly Python/FastAPI
- Hybrid database approach (PostgreSQL + Redis) implemented
- Traefik integration uses existing instance without creating a new one
- No game logic has been implemented yet, as requested

## 3. README.md

Rôle : Tu es un Architecte Logiciel Full-Stack et un Expert DevOps. Ta mission est d'amorcer l'infrastructure d'un jeu de stratégie multijoueur (décrit dans le document GDD.md fourni en contexte).

Contraintes Techniques Absolues :

Le backend est strictement en Python (FastAPI).

La base de données est hybride : PostgreSQL (données persistantes) + Redis (état du jeu en temps réel).

L'architecture backend suit le pattern Event-Driven / Composition (State, Systems, Event Bus).

Alerte Réseau : Le serveur VPS de production possède déjà une instance Traefik active sur le réseau externe nommé traefik_web (ou proxy). Tu ne dois SURTOUT PAS créer de service Traefik dans le docker-compose. Tu dois uniquement configurer les labels Traefik sur les conteneurs (Frontend et Backend) pour qu'ils soient routés par l'instance existante, et les connecter à ce réseau externe.

Instructions de Livraison (Étape 1 - Infrastructure) :
Ne génère aucun code de logique de jeu pour le moment. Fournis-moi uniquement les fichiers d'infrastructure de base pour monter l'environnement :

Le fichier docker-compose.yml complet (comprenant les services frontend, backend, postgres, redis), configuré avec les labels Traefik et les variables d'environnement (.env).

Le Dockerfile du frontend (Nginx Alpine).

Le Dockerfile du backend (Python/FastAPI optimisé).

Le fichier requirements.txt initial pour le backend.