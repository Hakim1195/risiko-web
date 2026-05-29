**Rôle :** Tu es un Architecte Logiciel Full-Stack Expert en Python. Ta mission est de préparer les schémas de données et les cycles de nettoyage du Game Engine pour accueillir un système évolutif de 15 effets de base (cartes et pouvoirs), selon une architecture pilotée par les données (Data-Driven).

**Contraintes Techniques Absolues :**
1. Flexibilité : Remplacer les verrous stricts par des compteurs (budgets d'actions) ou des états numériques.
2. Cycle de vie : Le moteur doit automatiquement décrémenter les compteurs de fin de tour (durée des effets) lors du changement de joueur.

**Instructions de Livraison (Étape 12 - Infrastructure des Modificateurs globaux) :**
Fournis uniquement le code complet et mis à jour pour ces 2 fichiers :

**1. Le fichier `backend/api/game/state_schemas.py` devant inclure :**
Dans `PlayerState`, ajoute ces variables d'état (conserve les existantes) :
* `max_cards_playable_this_turn: int = 2` (Budget de base)
* `bonus_attack_dice: int = 0` (Modificateur de combat)
* `bonus_defense_dice: int = 0` (Modificateur de combat)
* `guaranteed_sixes_attack: int = 0` (Nombre de dés forcés à 6)
* `airborne_attacks_left: int = 0` (Attaques non adjacentes autorisées)
* `vampiric_attack_active: bool = False` (Inversion des pertes en attaque)
* `vampiric_defense_active: bool = False` (Inversion des pertes en défense)
* `immune_to_contamination: bool = False` (Protection environnementale)

Dans `TerritoryState`, ajoute ces variables d'état (conserve les existantes) :
* `shield_turns_left: int = 0` (Immunité aux attaques)
* `frozen_turns_left: int = 0` (Incapacité d'attaquer depuis ce territoire)

**2. Le fichier `backend/api/game/engine.py` devant inclure :**
* Dans les méthodes de validation existantes (`_handle_attack` et `_handle_move_units`), ajoute la vérification du gel : si le territoire source a `frozen_turns_left > 0`, lever une `ValueError` ("Ce territoire est gelé et ne peut pas agir").
* Dans `_handle_attack`, adapte la vérification d'adjacence : si `current_player.airborne_attacks_left > 0`, l'attaque est valide même si les territoires ne sont pas adjacents. Si l'attaque non adjacente est consommée, faire `airborne_attacks_left -= 1`.
* Dans `_end_turn`, juste avant de passer la main au joueur suivant, implémente la gestion du temps (le "Tick" des effets) :
  - Parcourir TOUS les territoires du plateau. Si `shield_turns_left > 0`, faire `-1`. Si `frozen_turns_left > 0`, faire `-1`.
  - Réinitialiser les modificateurs temporaires du joueur qui vient de finir son tour (`bonus_attack_dice = 0`, `bonus_defense_dice = 0`, `guaranteed_sixes_attack = 0`, `vampiric_attack_active = False`, etc.).
  - Remettre `cards_played_this_turn = 0` pour le joueur qui termine.