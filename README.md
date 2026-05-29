**Rôle :** Tu es un Architecte Logiciel Full-Stack Expert en Python. Ta mission est d'implémenter l'action de déploiement des troupes (Phase 2) dans le Game Engine.

**Contraintes Techniques Absolues :**
1. Règles de validation : Le déploiement ne peut se faire que si l'état est en Phase 2. Le joueur ne peut déployer que sur un territoire qui lui appartient, et il ne peut pas déployer plus d'unités qu'il n'en possède dans son `units_in_stock`.
2. Architecture : L'action doit être ajoutée au dictionnaire de routage existant dans `GameEngine`.

**Instructions de Livraison (Étape 9 - Déploiement Phase 2) :**
Fournis uniquement le code mis à jour pour le fichier `backend/api/game/engine.py` incluant :

1. L'ajout de `"deploy_units": GameEngine._handle_deploy_units` dans le dictionnaire `action_handlers` de la méthode `process_action`.
2. La création de la méthode statique asynchrone `_handle_deploy_units(state: GameState, payload: dict) -> dict` qui doit :
   - Extraire `territory_id` (int) et `amount` (int) depuis le `payload`.
   - Lever une `ValueError` si `state.phase != 2`.
   - Lever une `ValueError` si `amount <= 0`.
   - Lever une `ValueError` si le `territory_id` n'appartient pas au joueur actuel (`state.current_player_id`).
   - Lever une `ValueError` si le joueur n'a pas assez d'`units_in_stock`.
   - Si tout est valide, soustraire `amount` de `units_in_stock` du joueur, et ajouter `amount` à la `garrison` du territoire ciblé.
   - Retourner un dictionnaire d'événement (ex: `event_type: "units_deployed"`, incluant le `territory_id` et l'`amount`).

Ne touche à aucune des autres méthodes existantes (`_calculate_reinforcements`, `_advance_phase`, etc.), assure-toi juste de conserver le fichier complet et fonctionnel.