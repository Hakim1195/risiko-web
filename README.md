**Rôle :** Tu es un Architecte Logiciel Full-Stack Expert en Python. Ta mission est de développer le "Déclencheur de Partie" (Match Initialization) qui fait le pont entre PostgreSQL (Lobby) et Redis (Game State).

**Contraintes Techniques Absolues :**
1. Framework : FastAPI.
2. Éviter les imports circulaires : L'instance du `ConnectionManager` doit être créée dans son propre fichier, et non dans `main.py`.
3. Logique de jeu : Le nombre d'unités initiales par joueur dépend du nombre de participants (3 joueurs = 35 unités, 4 = 30, 5 = 25, 6 = 20).
4. Synchronisation : Tu dois utiliser `GameStateManager.initialize_game` (Pydantic V2) pour créer l'état dans Redis, puis diffuser un message WebSocket pour prévenir les clients.

**Instructions de Livraison (Étape 6 - Match Initialization) :**

**1. Modification de `backend/api/sockets/connection_manager.py` :**
* À la toute fin du fichier, crée une instance globale : `manager = ConnectionManager()`.
* *(Note : Tu devras ensuite corriger `main.py` pour importer cette instance précise au lieu de la recréer).*

**2. Le fichier `backend/api/v1/endpoints/game.py` (NOUVEAU) devant inclure :**
* Un endpoint `POST /rooms/{room_id}/start`.
* Vérifier que la salle existe dans PostgreSQL, qu'elle est en status `"waiting"`, et qu'elle contient au moins 3 joueurs (et max 6).
* Mettre à jour le status de la `GameRoom` à `"in_progress"` dans la base de données PostgreSQL.
* Calculer le nombre d'unités initiales selon les règles ci-dessus.
* Formater les données des joueurs et appeler `await GameStateManager.initialize_game(room_id, players_data)`.
* Importer le `manager` depuis `connection_manager` et appeler `await manager.broadcast_to_room(json.dumps({"type": "game_started", "room_id": room_id}), str(room_id))`.

**3. Modification de `backend/api/v1/api.py` :**
* Importer le nouveau routeur `game` et l'inclure dans l'`api_router` (ex: `prefix="/game"`).

**Objectif :** Fournir uniquement le code de ces fichiers mis à jour ou créés. Assure-toi que la transition entre la base de données relationnelle et la mémoire vive soit parfaitement fluide et asynchrone.