**Rôle :** Tu es un Architecte Logiciel Full-Stack Expert en Python. Ta mission est d'implémenter la "Phase 3 : Attaques" (Combat aux dés) dans le Game Engine.

**Contraintes Techniques Absolues :**
1. Résolution Automatique : Le défenseur ne choisit pas. Le serveur lance automatiquement le maximum de dés possibles pour le défenseur (min(3, garnison)).
2. Aléatoire : Utilise `random` de Python pour simuler les dés (1 à 6).
3. Adjacence : Une attaque n'est possible que si les territoires sont voisins.

**Instructions de Livraison (Étape 10 - Phase 3 Attaques) :**
Fournis uniquement le code mis à jour pour ces 3 fichiers :

**1. Le fichier `backend/api/game/map_constants.py` devant inclure :**
* L'ajout d'un dictionnaire `ADJACENCY: Dict[int, List[int]]` qui liste les voisins de chaque territoire de 1 à 43. (Invente des liaisons logiques pour l'instant, assure-toi juste que chaque territoire a au moins 2 ou 3 voisins de manière bidirectionnelle).

**2. Le fichier `backend/api/game/state_schemas.py` devant inclure :**
* Dans `PlayerState`, ajoute : `has_conquered_this_turn: bool = False`. (C'est indispensable pour savoir si le joueur aura droit de piocher une carte à la Phase 5).

**3. Le fichier `backend/api/game/engine.py` devant inclure :**
* L'import de `ADJACENCY` et de la librairie `random`.
* Dans `_end_turn`, ajoute une ligne pour réinitialiser `state.players[next_player_id].has_conquered_this_turn = False` pour le joueur qui va commencer son tour.
* L'ajout de `"attack_territory": GameEngine._handle_attack` dans `action_handlers`.
* La création de `_handle_attack(state: GameState, payload: dict) -> dict` qui doit :
  - Extraire `attacker_territory_id`, `defender_territory_id`, `attacker_dice` (1, 2, ou 3).
  - Vérifier : Phase == 3.
  - Vérifier : Les territoires sont adjacents via `ADJACENCY`.
  - Vérifier : Propriétaire attaquant == `current_player_id` ET Propriétaire défenseur != `current_player_id`.
  - Vérifier : L'attaquant a assez de troupes (garnison > `attacker_dice`, car 1 doit rester).
  - Calculer `defender_dice` = min(3, garnison défenseur).
  - Lancer les dés (random 1-6), trier les résultats par ordre décroissant pour les deux camps.
  - Comparer les dés 1 à 1 (Le plus fort vs le plus fort, etc.). En cas d'égalité, le défenseur gagne.
  - Soustraire les pertes des garnisons respectives.
  - Si la garnison du défenseur tombe à 0 : Le territoire change de propriétaire, la garnison de l'attaquant est réduite de `attacker_dice`, et le territoire conquis reçoit `attacker_dice` en garnison. Mettre `has_conquered_this_turn = True`. Vérifier si le défenseur n'a plus aucun territoire, si oui, passer son `status` à "eliminated".
  - Retourner un dictionnaire décrivant l'événement (résultats des dés, pertes, et s'il y a eu conquête).