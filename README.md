**Rôle :** Tu es un Architecte Logiciel Full-Stack Expert en Python et Base de Données en Mémoire. Ta mission est de développer la couche "Temps Réel" (State Management) du jeu en utilisant Redis, tel que décrit dans le document GDD.md fourni en contexte.

**Contraintes Techniques Absolues :**
1. Outil : Utilisation de **Redis** (via la librairie asynchrone `redis.asyncio` en Python).
2. Validation : L'état du jeu stocké dans Redis doit obligatoirement être sérialisé en JSON et validé par des modèles **Pydantic** stricts avant écriture et après lecture.
3. Séparation des concepts : Ne mélange surtout pas les modèles SQLAlchemy (PostgreSQL, persistants) avec les schémas Pydantic du jeu en cours (Redis, éphémères).
4. Respect du GDD : La structure de l'état du jeu doit refléter parfaitement les règles : 43 territoires, 6 phases strictes de tour, et la position de la Zone de Contamination.

**Instructions de Livraison (Étape 5 - Redis & State Manager) :**
Génère le code modulaire, propre et commenté pour les 3 fichiers suivants :

**1. Le fichier `backend/api/core/redis.py` devant inclure :**
* La récupération des variables d'environnement (`REDIS_HOST`, `REDIS_PORT`).
* La création d'un pool de connexion asynchrone à Redis.
* Une fonction dépendance `get_redis()` pour injecter la connexion dans le reste de l'application.

**2. Le fichier `backend/api/game/state_schemas.py` devant inclure :**
* Les modèles Pydantic définissant l'état d'une partie *en cours* :
  * `PlayerState` : id du joueur, faction, unités en stock (réserve), statut (vivant/éliminé).
  * `TerritoryState` : id du territoire, propriétaire actuel, nombre de troupes en garnison.
  * `GameState` : L'objet global contenant `room_id`, le dictionnaire des `PlayerState`, le dictionnaire des 43 `TerritoryState`, le numéro du `current_turn`, l'ID du joueur dont c'est le tour (`current_player_id`), la phase actuelle (int de 0 à 5, représentant les 6 phases du GDD), et la position/probabilité de la Zone de Contamination.

**3. Le fichier `backend/api/game/state_manager.py` devant inclure :**
* Une classe `GameStateManager` avec les méthodes asynchrones suivantes :
  * `initialize_game(room_id: int, players: List[dict])` : Crée l'état initial neutre et le sauvegarde dans Redis avec une clé formatée (ex: `game_state:{room_id}`).
  * `get_game_state(room_id: int) -> GameState` : Récupère, désérialise et valide l'état du jeu depuis Redis.
  * `save_game_state(room_id: int, state: GameState)` : Sérialise et sauvegarde l'état dans Redis.
  * `delete_game_state(room_id: int)` : Nettoie la mémoire une fois la partie terminée.

**Ne code aucune logique de règle de jeu (pas de calcul de dés ou de mouvements pour l'instant).** Fournis uniquement l'interface de connexion et les structures de données en mémoire vive qui permettront au futur moteur de règles de manipuler le plateau instantanément.