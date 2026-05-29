**Rôle :** Tu es un Architecte Logiciel Full-Stack Expert en Python. Ta mission est d'implémenter la logique de la "Phase 1 : Attribution des Renforts" et de préparer le terrain pour le système de cartes, en respectant scrupuleusement le GDD.md mis à jour.

**Contraintes Techniques Absolues :**
1. Performances : Aucune requête PostgreSQL ne doit être faite pendant la boucle de jeu. Les données de la carte doivent être statiques.
2. Schémas : Utilisation stricte de Pydantic V2 pour la mise à jour des états.
3. Logique GDD : Le calcul des renforts (Territoires / 3, arrondi inférieur, AUCUN minimum) + Bonus de continents doit être exact.

**Instructions de Livraison (Étape 8 - Constantes, Schémas et Phase 1) :**
Fournis le code complet pour ces 3 fichiers :

**1. Le NOUVEAU fichier `backend/api/game/map_constants.py` devant inclure :**
* Un dictionnaire `CONTINENTS` qui définit les 5 continents (Eurasia, Americhe, Afarik, Aurora, Neksis). Pour chaque continent, tu dois lister son `bonus` (voir GDD) et une liste de `territory_ids` qui lui appartiennent. (Invente la répartition des 43 IDs de territoires comme tu le souhaites pour le moment, ex: Eurasia de 1 à 12, Americhe de 13 à 21, etc., en t'assurant que tous les IDs de 1 à 43 sont répartis).

**2. La mise à jour de `backend/api/game/state_schemas.py` devant inclure :**
* Dans `PlayerState`, ajoute : `cards_in_hand: List[str] = []` (pour stocker les IDs ou noms des cartes) et `cards_played_this_turn: int = 0`.

**3. La mise à jour de `backend/api/game/engine.py` devant inclure :**
* L'import de `CONTINENTS` depuis `map_constants.py`.
* L'ajout d'une méthode `_calculate_reinforcements(state: GameState) -> int`. Cette méthode doit compter les territoires du `state.current_player_id`, appliquer la règle (Territoires // 3, sans minimum), vérifier les continents possédés à 100%, ajouter les bonus, puis créditer le `units_in_stock` du joueur.
* La modification de la méthode `_advance_phase(state: GameState)` : Juste après avoir fait `state.phase += 1`, si la nouvelle phase est `1`, le moteur doit automatiquement appeler `await GameEngine._calculate_reinforcements(state)`.

Ne touche à rien d'autre. Fournis uniquement le code modulaire pour ces trois éléments.