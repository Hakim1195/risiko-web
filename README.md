**Rôle :** Tu es un Architecte Logiciel Full-Stack Expert en Python. Ta mission est d'implémenter la "Phase 4 : Mouvement Stratégique" (Fortification) dans le Game Engine en utilisant une architecture de "Budget d'Action" pour faciliter l'ajout futur de cartes à pouvoirs spéciaux.

**Contraintes Techniques Absolues :**
1. Architecture par Budget : On n'utilise pas de booléen bloquant, mais un compteur `strategic_moves_left`.
2. Règles de base : Le joueur reçoit 1 mouvement par tour. Les territoires source et cible doivent lui appartenir et être adjacents. Il faut laisser au moins 1 troupe sur le territoire source.
3. Ergonomie intelligente : Si le solde de mouvements tombe à 0 après l'action, le moteur passe automatiquement à la Phase 5.

**Instructions de Livraison (Étape 11 - Phase 4 Mouvement Dynamique) :**
Fournis uniquement le code mis à jour pour ces 2 fichiers :

**1. Le fichier `backend/api/game/state_schemas.py` devant inclure :**
* L'ajout de `strategic_moves_left: int = 0` dans la classe `PlayerState` (en remplacement de toute idée de booléen `has_moved`).

**2. Le fichier `backend/api/game/engine.py` devant inclure :**
* Dans `_end_turn`, ajoute la réinitialisation du budget pour le prochain joueur : `state.players[next_player_id].strategic_moves_left = 1`.
* L'ajout de `"move_units": GameEngine._handle_move_units` dans `action_handlers`.
* La création de la méthode asynchrone `_handle_move_units(state: GameState, payload: dict) -> dict` qui doit :
  - Extraire `source_territory_id`, `target_territory_id`, et `amount`.
  - Vérifier : `state.phase == 4`.
  - Vérifier : `state.players[state.current_player_id].strategic_moves_left > 0` (Sinon lever ValueError "Plus de mouvements disponibles").
  - Vérifier : `amount > 0`.
  - Vérifier : `target_territory_id` est dans `ADJACENCY.get(source_territory_id, [])`.
  - Vérifier : Le joueur possède bien les DEUX territoires.
  - Vérifier : `state.territories[source_territory_id].garrison > amount` (minimum 1 troupe restante à la source).
  - Si valide : Soustraire `amount` de la source, l'ajouter à la cible.
  - Décrémenter le budget : `state.players[state.current_player_id].strategic_moves_left -= 1`.
  - SI (et seulement si) `strategic_moves_left == 0`, alors appeler `await GameEngine._advance_phase(state)` pour passer à la Phase 5.
  - Retourner l'événement `"units_moved"`.