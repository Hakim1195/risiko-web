**Rôle :** Tu es un Architecte Logiciel Full-Stack Expert en Python. Ta mission est d'implémenter la "Phase 0 : La Contamination" dans le Game Engine, avec un système de téléportation aléatoire et d'auto-résolution.

**Contraintes Techniques Absolues :**
1. Round Global : La probabilité de mouvement ne se déclenche que lorsqu'un "Round Global" commence (quand l'index du prochain joueur est inférieur ou égal à l'index du joueur actuel).
2. Randomisation : La zone se téléporte sur un ID aléatoire entre 1 et 43.
3. Dégâts : -2 troupes fixes (en gardant `max(1, garrison)`).
4. Auto-Résolution : La phase 0 s'exécute silencieusement dans `_end_turn` et passe directement la `state.phase` à 1 (en déclenchant les renforts).

**Instructions de Livraison (Étape 14 - Phase 0 Contamination) :**
Fournis uniquement le code mis à jour pour le fichier `backend/api/game/engine.py` devant inclure :

1. L'import de `random` (s'il manque).
2. La mise à jour complète de la méthode `_end_turn(state: GameState)` avec cette nouvelle logique exacte (à adapter dans ton code) :
   - Gestion des chronos des effets (Boucliers, Gel, Modificateurs temporaires) comme avant.
   - Recherche du `next_player_id` parmi les joueurs vivants.
   - **[NOUVEAU]** Vérifier si c'est un nouveau Round Global : `is_new_global_round = player_ids.index(next_player_id) <= player_ids.index(state.current_player_id)`.
   - **[NOUVEAU]** Si `is_new_global_round` est True :
     * Vérifier si `state.contamination_zone` est vide. Si oui, l'initialiser avec `{"position": random.randint(1, 43), "probability": 0.2}`.
     * Sinon, lancer un dé `random.random()`. S'il est `< state.contamination_zone["probability"]`, changer la `"position"` (random 1-43) et remettre `"probability"` à `0.2`.
     * Si le dé échoue, faire `state.contamination_zone["probability"] = min(1.0, state.contamination_zone["probability"] + 0.2)`.
   - Valider le changement de joueur (`state.current_player_id = next_player_id` et `state.current_turn += 1`).
   - **[NOUVEAU]** Appliquer les dégâts de la Phase 0 :
     * Récupérer le territoire ciblé par `contamination_zone["position"]`.
     * SI le propriétaire est le `current_player_id` ET QUE `state.players[current_player_id].immune_to_contamination` est `False` :
     * Soustraire 2 à la garnison : `territory.garrison = max(1, territory.garrison - 2)`.
   - **[NOUVEAU]** Auto-Advance vers Phase 1 :
     * Mettre `state.phase = 1`.
     * Appeler `await GameEngine._calculate_reinforcements(state)`.
     * Retourner pour finir la fonction.

*(Assure-toi que toutes les anciennes mécaniques de `_end_turn` de l'Étape 13 sont bien conservées).*