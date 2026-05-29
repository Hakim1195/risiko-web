**Rôle :** Tu es un Architecte Logiciel Full-Stack Expert en Python et WebSockets. Ta mission est de développer le "Cœur Réseau" (Network Core) et l'initialisation de la base de données du jeu (décrit dans le document GDD.md fourni en contexte).

**Contraintes Techniques Absolues :**
1. Framework : **FastAPI**.
2. Réseau : Utilisation native des **WebSockets** de FastAPI pour le temps réel.
3. Sécurité : Configuration stricte des **CORS** en lisant la variable d'environnement `DOMAIN_NAME` pour autoriser le frontend à communiquer avec l'API.
4. Base de données : Utilisation de **SQLAlchemy** pour configurer la connexion à PostgreSQL via les variables d'environnement.

**Instructions de Livraison (Étape 3 - Cœur Réseau et Base de Données) :**
Génère le code complet, modulaire et commenté pour les 3 fichiers suivants :

**1. Le fichier `backend/api/core/database.py` devant inclure :**
* La récupération des variables d'environnement (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`).
* La construction sécurisée de l'URL de connexion PostgreSQL.
* La création de l'`engine` et de la `SessionLocal`.
* La fonction dépendance `get_db()` pour injecter la session de base de données dans les futures routes.

**2. Le fichier `backend/api/sockets/connection_manager.py` devant inclure :**
* Une classe `ConnectionManager` optimisée pour le multijoueur.
* Une structure de données en mémoire pour stocker les connexions actives (par exemple, un dictionnaire regroupant les `WebSocket` par `game_room_id`).
* Les méthodes asynchrones essentielles : `connect(websocket, room_id)`, `disconnect(websocket, room_id)`, `broadcast_to_room(message, room_id)`, et `send_personal_message(message, websocket)`.

**3. Le fichier `backend/main.py` devant inclure :**
* L'initialisation de l'application FastAPI.
* La configuration du `CORSMiddleware` (autorisant les requêtes venant de `http(s)://{DOMAIN_NAME}` et `http(s)://www.{DOMAIN_NAME}`).
* L'instanciation globale du `ConnectionManager`.
* La création automatique des tables dans la base de données au démarrage (via l'import de tes `models` et `Base.metadata.create_all(bind=engine)`).
* Un endpoint WebSocket d'amorçage : `@app.websocket("/ws/game/{game_room_id}/{client_id}")` qui utilise le manager pour accepter la connexion, gérer la boucle d'écoute `while True`, et gérer les déconnexions (WebSocketDisconnect).

**Ne génère aucune mécanique de jeu spécifique ni de routes REST pour l'instant.** L'objectif est d'obtenir une infrastructure réseau saine, capable d'isoler les connexions simultanées par "salle de jeu" et une connexion certifiée à la base de données.