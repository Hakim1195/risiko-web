**Rôle :** Tu es un Architecte Logiciel Full-Stack Expert en Python. Ta mission est d'implémenter la "Phase 5 : Cartes Événement" (La pioche automatique) dans le Game Engine.

**Contraintes Techniques Absolues :**
1. Table de Butin (Loot Table) : Utilise `random.choices` avec des poids (weights) pour simuler la probabilité des cartes.
2. Limite de main : Un joueur ne peut pas dépasser 5 cartes en main. S'il en a 5, il ne pioche pas.
3. Ergonomie : La Phase 5 est automatique. Dès que le moteur entre en Phase 5, il pioche la carte, l'ajoute au joueur, puis passe immédiatement au tour suivant.

**Instructions de Livraison (Étape 13 - Phase 5 Pioche Automatique) :**
Fournis uniquement le code mis à jour pour le fichier `backend/api/game/engine.py` devant inclure :

1. L'ajout d'une méthode statique asynchrone `_draw_card_for_current_player(state: GameState)` qui doit :
   - Vérifier si `len(state.players[state.current_player_id].cards_in_hand) < 5`.
   - Si oui, définir une Loot Table (dictionnaire) : `{"card_renfort_3": 60, "card_shield_1": 30, "card_airborne_1": 10}`.
   - Tirer une carte au sort en utilisant les poids de la Loot Table.
   - Ajouter l'ID de la carte tirée dans la liste `cards_in_hand` du joueur.

2. La modification de la méthode `_advance_phase(state: GameState)` :
   - Actuellement, tu as une condition `if state.phase > 5: state.phase = 0 ...`. Change cette logique.
   - Si la phase atteint `5` (Phase 5) : 
     - Appelle `await GameEngine._draw_card_for_current_player(state)`.
     - Remets `state.phase = 0`.
     - Appelle `await GameEngine._end_turn(state)`.
   - La condition `if state.phase == 1:` (Renforts) reste inchangée.