**Rôle :** Tu es un Architecte Logiciel Full-Stack Expert en Python. Ta mission est de développer la couche "Données" (Data Layer) du backend d'un jeu de stratégie multijoueur (décrit dans le document GDD.md fourni en contexte).

**Contraintes Techniques Absolues :**
1. Frameworks exigés : **SQLAlchemy** (pour les modèles de base de données PostgreSQL) et **Pydantic** (pour la validation des données FastAPI).
2. Architecture : Tu dois séparer strictement les modèles ORM (`models.py`) des schémas de validation (`schemas.py`).
3. Règle d'invention : N'invente AUCUN nom de territoire pour le moment. Concentre-toi uniquement sur la structure relationnelle.

**Instructions de Livraison (Étape 2 - Modèles et Schémas) :**
Génère le code complet et commenté pour les fichiers suivants, à placer dans le dossier `backend/api/core/` (ou équivalent selon l'arborescence standard FastAPI) :

**1. Le fichier `models.py` (SQLAlchemy) devant inclure :**
* `User` : L'entité joueur (id, username, email, hashed_password, stats_victoires, stats_parties_jouees).
* `Continent` : L'entité statique (id, nom, bonus_renfort).
* `Territory` : L'entité statique (id, nom, continent_id en clé étrangère).
* `GameRoom` : L'instance de la partie (id, status [waiting, in_progress, finished], created_at).
* `GameRoomPlayer` : Table de liaison pour savoir quels utilisateurs sont dans quelle GameRoom, et quelle faction (string vide par défaut) ils ont choisie.

**2. Le fichier `schemas.py` (Pydantic) devant inclure :**
* Les schémas de base (BaseModel) pour toutes les entités ci-dessus.
* Les schémas de création (Create) pour recevoir les données POST (ex: `UserCreate`, `GameRoomCreate`).
* Les schémas de réponse (Response) avec `orm_mode = True` (ou `model_config = ConfigDict(from_attributes=True)` si Pydantic V2) pour renvoyer les données propres à l'API.

**Ne génère aucune route (endpoints) ni logique de jeu pour le moment.** Fournis uniquement ces deux fichiers structurés et prêts pour la production.