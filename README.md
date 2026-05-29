**Rôle :** Tu es un Architecte Logiciel Expert en Python. Ta mission est de développer le "Cœur Logique" (Game Engine) du jeu, qui manipulera l'état stocké dans Redis selon les règles du GDD fourni en contexte.

**Contraintes Techniques Absolues :**
1. Indépendance : Le Game Engine ne doit faire aucun appel WebSocket ni API REST. Il ne fait que de la logique pure et communique uniquement avec le `GameStateManager`.
2. Asynchronisme : Les méthodes doivent être asynchrones pour interagir avec Redis.
3. Sécurité de l'état : Chaque action doit commencer par vérifier si c'est bien le tour du joueur (`current_player_id`) et s'il est toujours en vie (`status == "alive"`).

**Instructions de Livraison (Étape 7 - Game Engine Base) :**
Génère le code modulaire, propre et commenté pour le nouveau fichier suivant :

**1. Le fichier `backend/api/game/engine.py` devant inclure :**
* Une classe statique ou un singleton `GameEngine`.
* Une méthode principale `process_action(room_id: int, player_id: int, action_type: str, payload: dict) -> dict`. Cette méthode doit :
  - Récupérer l'état via `GameStateManager.get_game_state(room_id)`.
  - Vérifier que c'est bien le tour du `player_id` (sinon lever une ValueError "Ce n'est pas votre tour").
  - Rediriger vers des sous-méthodes spécifiques selon l'`action_type` (ex: utiliser un `match/case` ou un dictionnaire de routage).
  - Sauvegarder le nouvel état via `GameStateManager.save_game_state`.
  - Retourner un dictionnaire décrivant l'événement qui vient de se produire (pour que les WebSockets puissent le diffuser plus tard).
* Une méthode `_end_turn(state: GameState)` qui calcule à qui est le prochain tour (en sautant les joueurs éliminés) et incrémente le `current_turn`.
* Une méthode `_advance_phase(state: GameState)` qui passe à la phase suivante (0 à 5) et appelle `_end_turn` si on dépasse la phase 5.
* Une action de test simple : implémente l'action `action_type = "pass_turn"` qui appelle simplement `_advance_phase`.

**Ne code pas encore les logiques complexes d'attaque ou de déplacement.** L'objectif est d'obtenir l'orchestrateur de base (le "cerveau") capable de faire tourner les tours et les phases de manière sécurisée.