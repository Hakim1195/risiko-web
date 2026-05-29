**Rôle :** Tu es un Architecte Logiciel Full-Stack Expert en Python. Ta mission est de développer la couche "API REST" (Endpoints) pour le Lobby et l'Authentification du jeu (décrit dans le document GDD.md fourni en contexte).

**Contraintes Techniques Absolues :**
1. Framework : **FastAPI** (utilisation de `APIRouter`).
2. Injection de dépendances : Utilisation stricte de `Depends(get_db)` depuis `core.database` pour interagir avec SQLAlchemy.
3. Sécurité : Implémentation d'une authentification standard par token JWT (OAuth2PasswordBearer) en utilisant la variable d'environnement `SECRET_KEY_FASTAPI`.
4. Cohérence : Tu dois utiliser les modèles (`models.py`) et schémas (`schemas.py`) qui ont déjà été créés.

**Instructions de Livraison (Étape 4 - API REST : Lobby et Auth) :**
Génère le code modulaire, propre et commenté pour les fichiers suivants, en respectant l'arborescence classique de FastAPI :

**1. Le fichier `backend/api/v1/endpoints/auth.py` devant inclure :**
* Un endpoint `POST /register` pour créer un `User` (avec hachage du mot de passe via `passlib`).
* Un endpoint `POST /login` (utilisant `OAuth2PasswordRequestForm`) qui vérifie les identifiants et retourne un access token JWT.
* Une dépendance `get_current_user` pour protéger les futures routes.

**2. Le fichier `backend/api/v1/endpoints/lobby.py` devant inclure :**
* Un endpoint `GET /rooms` pour lister toutes les `GameRoom` dont le status est `"waiting"`.
* Un endpoint `POST /rooms` pour créer une nouvelle `GameRoom`.
* Un endpoint `POST /rooms/{room_id}/join` permettant au `current_user` de rejoindre une salle (création d'une entrée dans `GameRoomPlayer` avec une vérification pour éviter qu'un joueur rejoigne deux fois la même salle).

**3. Le fichier `backend/api/v1/api.py` (ou le routeur principal) devant inclure :**
* L'instanciation de l'`APIRouter` principal.
* L'inclusion des routeurs `auth` (avec le préfixe `/auth` ou `/users`) et `lobby` (avec le préfixe `/lobby`).

**Ne touche pas aux WebSockets pour le moment.** Concentre-toi uniquement sur la création d'une API REST robuste permettant aux joueurs de s'inscrire, de se connecter, et de préparer des salons d'attente en base de données relationnelle.