# WASTELAND WARFARE - GAME DESIGN DOCUMENT (GDD)

## I. LA BOUCLE DE JEU DE BASE (GAMEPLAY)

### 1. Paramètres Globaux et Mise en place
* **Thème & Carte :** Univers post-apocalyptique, vue 2.5D isométrique. Le plateau est composé de 43 territoires répartis en 5 continents.
* **Bonus de Continents :**
  * Eurasia : +5 troupes
  * Americhe : +4 troupes
  * Afarik : +3 troupes
  * Aurora : +2 troupes
  * Neksis : +3 troupes
* **Conditions de Victoire :** Contrôle total du plateau (43 territoires), élimination totale des autres joueurs, ou accomplissement d'un objectif secret (implémentation future).
* **Troupes Initiales :** 35 unités (3 joueurs), 30 (4 joueurs), 25 (5 joueurs), 20 (6 joueurs).
* **Distribution des territoires :** Les territoires sont distribués aléatoirement 1 par 1. Les joueurs n'obtenant pas de territoire au dernier tour de distribution reçoivent une `bonus_compensation` (1 unité gratuite à poser sur un territoire déjà possédé).
* **Déploiement Initial :** Les joueurs posent leurs troupes initiales 3 par 3 à tour de rôle. Ce déploiement est suivi d'une **Phase de Bluff** où les joueurs peuvent retirer secrètement des unités du plateau pour les remettre dans leur Stock privé.

---

### 2. Le Tour de Jeu (6 Phases Strictes)
L'ordre des phases est immuable. Un joueur doit terminer ces 6 phases avant que la main ne passe au joueur suivant.

#### Phase 0 : La Contamination
La Zone de Contamination (événement environnemental) se déplace avec une probabilité croissante à chaque début de tour global : 
* Tour 1 & 2 : 20%
* Tour 3 : 40%
* Tour 4 : 60%
* Tour 5 : 80%
* Tour 6+ : 100% 
*Dès que la zone se déplace d'un territoire, le compteur de probabilité retombe à sa valeur initiale.*

#### Phase 1 : Attribution des Renforts
L'économie de guerre est brutale. Le joueur reçoit de nouvelles troupes selon un calcul strict :
* **Calcul de base :** `(Nombre de territoires possédés / 3)` arrondi à l'entier inférieur.
* **Règle absolue :** Il n'y a **AUCUN minimum garanti**. Un joueur possédant 2 territoires ne reçoit *zéro* troupe de base (2/3 = 0.66 -> 0).
* **Bonus :** Si le joueur contrôle 100% des territoires d'un ou plusieurs continents, on ajoute les bonus de continents au total.
* *Les unités gagnées ne vont pas sur le plateau, elles sont placées dans l'inventaire virtuel du joueur (`Stock`).*

#### Phase 2 : Déploiement et Utilisation des Cartes
* **Déploiement :** Le joueur place autant d'unités qu'il le souhaite depuis son `Stock` vers les territoires qu'il contrôle. Il n'y a aucune limite de montant.
* **Pouvoirs (Cartes) :** C'est durant cette phase (et la phase 3) que le joueur peut jouer des cartes Tactiques. **Limite stricte : Un joueur ne peut jouer qu'un maximum de 2 cartes par tour.** *(Voir section détaillée "Système de Cartes Tactiques").*

#### Phase 3 : Attaques
* Les attaques sont **illimitées** dans un même tour.
* **Condition :** Le territoire attaquant doit posséder au minimum 2 unités (1 unité doit obligatoirement rester en garnison).
* **Résolution :** Combat aux dés (1 dé = 1 unité). 
  * Attaquant : Lance au maximum 3 dés.
  * Défenseur : Lance au maximum 3 dés, mais peut choisir le nombre d'unités engagées pour limiter ses pertes potentielles.
  * *En cas d'égalité sur les dés, la victoire revient au défenseur.*

#### Phase 4 : Mouvement Stratégique
* **1 seul déplacement autorisé** en fin de tour, depuis un territoire contrôlé vers un territoire adjacent également contrôlé. 
* **Interdiction :** Il est interdit de faire converger plusieurs déplacements de troupes venant de territoires différents vers la même destination lors d'un même tour.

#### Phase 5 : Récompense (Fin de tour)
* Si le joueur a conquis au moins 1 territoire ennemi durant sa phase d'attaque, il gagne le droit de **piocher une carte Tactique** (ajoutée à sa main).
* *Note : On ne pioche qu'une seule carte maximum par tour, peu importe le nombre de territoires conquis.*

---

### 3. Système de Cartes Tactiques (Pouvoirs)
Les joueurs peuvent conserver des cartes dans leur main pour renverser le cours de la partie.
* **Limite d'utilisation :** 2 cartes jouables maximum par tour.
* **Taille de la main :** Un joueur peut conserver un maximum de 5 cartes en main (au-delà, il doit en défausser à la fin de son tour).
* **Types de cartes de base :**
  1. **Renforts Immédiats :** Ajoute instantanément +X unités dans le Stock du joueur (X peut varier selon la rareté de la carte).
  2. **Bouclier Énergétique :** Le joueur cible l'un de ses territoires. Ce territoire devient immunisé à toute attaque ennemie ou effet de zone jusqu'au début du prochain tour du joueur actif.
  3. **Frappe Nucléaire Tactique :** Le joueur cible un continent. Sur le territoire le plus peuplé de ce continent, TOUS les joueurs adverses présents perdent instantanément 1 troupe (ne détruit jamais la dernière troupe d'un territoire).

---

### 4. Les Éléments en Quarantaine (Évolutions Futures)
* **[Sujet 1] - Factions :** Pouvoirs asymétriques pour chaque clan (Sintetici, Mutanti, Coloni, Rettiliani, Predoni).
* **[Sujet 2] - Économie Avancée :** Création d'une devise "Scrap" (ferraille), boutique in-game, collection de cartes, et système de deckbuilding pré-match permettant aux joueurs de personnaliser leurs probabilités de pioche.

---
---

## II. ARCHITECTURE LOGICIELLE (Backend)

* **Langage & Framework :** Python avec **FastAPI**.
* **Réseau (Temps Réel) :** Communication via **WebSockets** pour synchroniser instantanément l'état du jeu et les animations (dés, mouvements, cartes jouées) chez tous les joueurs, garantissant une empreinte ressource minimale.
* **Pattern de Conception :** Approche par Composition et Événements. Architecture modulaire stricte. 
  * Un « State Manager » lit/écrit en base.
  * Un « Game Engine » (Cœur logique pur) valide les règles de manière asynchrone (sans jamais toucher aux WebSockets).
  * Pas de classes imbriquées tentaculaires.

---

## III. INFRASTRUCTURE ET DÉPLOIEMENT CI/CD

* **Serveur & Routage :** Hébergement sur un VPS unique. Utilisation de **Traefik** comme reverse proxy pour la gestion dynamique du routage et la génération automatique des certificats SSL/HTTPS (Let's Encrypt).
* **Conteneurisation :** Isolation totale sous **Docker** via `docker-compose`. Aucun service installé « en dur » sur l'OS hôte, garantissant la portabilité vers Kubernetes à l'avenir.
* **Bases de Données (Architecture Hybride) :**
  * **Redis (Données Chaudes) :** Stockage du "Plateau de jeu" en RAM pour une exécution ultra-rapide des règles et déplacements. Sérialisation stricte via Pydantic V2.
  * **PostgreSQL (Données Froides) :** Base relationnelle pour le Lobby, les profils des utilisateurs, la gestion des mots de passe (hachage bcrypt), les historiques et l'inventaire persistant.
* **Sauvegardes (Backup) :** Script automatisé (Cron) exécutant un `pg_dump` directement dans le conteneur PostgreSQL, avec externalisation du fichier SQL généré vers un serveur distant.
* **Déploiement Continu (CI/CD) :** Automatisation via **GitHub Actions** utilisant un `self-hosted runner` configuré directement sur le VPS. Injection dynamique et sécurisée des secrets d'environnement (`.env`) à la volée.