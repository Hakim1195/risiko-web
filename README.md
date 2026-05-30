**Rôle :** Tu es un Architecte Backend Expert en FastAPI.
**Mission :** Créer le routeur WebSocket qui relie les joueurs, le `ConnectionManager`, et le `GameEngine`.

**Spécifications Techniques :**
1. **Fichier cible :** `backend/api/sockets/router.py` (crée le fichier s'il n'existe pas).
2. **Imports nécessaires :**
   - `APIRouter`, `WebSocket`, `WebSocketDisconnect` de `fastapi`.
   - `manager` depuis `.connection_manager`.
   - `GameEngine` depuis `api.game.engine`.
   - `GameStateManager` depuis `api.game.state_manager`.
3. **Routeur :** Initialise `router = APIRouter()`.
4. **Endpoint WebSocket :** Crée la route `@router.websocket("/ws/{room_id}/{player_id}")`.
5. **Logique de la connexion (async def) :**
   - **Connexion :** Appelle `await manager.connect(websocket, room_id)`.
   - **Boucle d'écoute :** Ouvre un bloc `try: while True:` et écoute les messages entrants avec `data = await websocket.receive_json()`.
   - **Traitement :** - Récupère `action_type = data.get("action")` et `payload = data.get("payload", {})`.
     - Fais appel à `event = await GameEngine.process_action(int(room_id), int(player_id), action_type, payload)`.
     - Récupère le nouvel état du jeu avec `state = await GameStateManager.get_game_state(int(room_id))`.
   - **Broadcast :** Envoie à toute la room (via `manager.broadcast_to_room`) un objet JSON contenant : `{"type": "action_result", "event": event, "state": state.model_dump()}`.
   - **Gestion d'erreurs :** - Capture `ValueError` (erreurs de jeu, ex: "Pas votre tour") et renvoie l'erreur *uniquement* au joueur fautif via `manager.send_personal_message`.
     - Capture `WebSocketDisconnect` pour gérer la déconnexion proprement avec `manager.disconnect(websocket, room_id)` et broadcast un message `{"type": "player_disconnected", "player_id": player_id}`.

**Livrable :**
Fournis uniquement le code complet, sécurisé et commenté de `router.py`.