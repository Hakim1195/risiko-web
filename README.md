**Rôle :** Tu es un Architecte Logiciel Full-Stack Expert en Python. Ta mission est d'implémenter l'action "play_card" dans le Game Engine en utilisant un design pattern robuste et évolutif (Dictionnaire de routage/Dispatch).

**Règles du Jeu pour les Cartes :**
1. Un joueur ne peut jouer qu'une seule carte par tour (`cards_played_this_turn < 1`).
2. Les cartes ne peuvent être jouées que pendant les phases actives (Phases 1, 2, 3, ou 4). Jamais en Phase 0 ou 5.
3. Le joueur doit posséder la carte dans sa liste `cards_in_hand`. Une fois jouée, elle est retirée de sa main.

**Instructions d'implémentation (Étape 15 - Décodeur de Cartes) :**

1. Ajoute l'action `"play_card": GameEngine._handle_play_card` dans le dictionnaire `action_handlers` de la méthode `process_action`.
2. Crée la méthode principale `_handle_play_card(state: GameState, payload: dict) -> dict` qui gère les validations (phase, limite par tour, possession de la carte).
3. Dans `_handle_play_card`, utilise un dictionnaire de routage pour lier l'ID de la carte à une méthode spécifique.
4. Implémente ces 3 sous-méthodes spécifiques :
   - `_play_card_renfort_3(state, player, payload)` : Ajoute immédiatement 3 à `units_in_stock` du joueur.
   - `_play_card_shield_1(state, player, payload)` : Nécessite un `target_territory_id` dans le payload. Le territoire doit appartenir au joueur. Met `shield_turns_left = 1` sur ce territoire.
   - `_play_card_airborne_1(state, player, payload)` : Ajoute 1 à `airborne_attacks_left` du joueur (lui permettant une attaque non-adjacente en Phase 3).
5. Fournis le code complet et mis à jour de `engine.py`. Fais très attention à l'indentation (pas de mélange espaces/tabulations).