### I. GAME DESIGN DOCUMENT (GDD) : La Boucle de Base
## 1. Paramètres Globaux et Mise en place
Thème & Carte : Post-apocalyptique, vue 2.5D isométrique. 43 territoires répartis en 5 continents avec bonus (Eurasia +5, Americhe +4, Afarik +3, Aurora +2, Neksis +3).

Conditions de Victoire : Contrôle total (43), élimination des autres, ou objectif secret.

Troupes Initiales : 35 unités (3 joueurs), 30 (4j), 25 (5j), 20 (6j).

Distribution : Les territoires sont distribués 1 par 1. Les joueurs n'obtenant pas de territoire au dernier tour reçoivent une bonus_compensation (unité à poser sur un territoire déjà possédé).

Déploiement Initial : Pose 3 par 3. Suivie d'une Phase de Bluff où les joueurs peuvent retirer secrètement des unités du plateau pour les placer dans leur Stock.

## 2. Le Tour de Jeu (6 Phases Strictes)
Phase 0 : La Contamination. La Zone se déplace avec une probabilité croissante : 20% (T1 & T2), 40% (T3), 60% (T4), 80% (T5), 100% (T6). Le compteur retombe à 1 dès qu'elle bouge.

Phase 1 : Renforts. Gain d'unités = (Régions possédées / 3) arrondi à l'inférieur + Bonus de continents. Pas de minimum garanti. Les unités vont dans le Stock.

Phase 2 : Déploiement. Le joueur place autant d'unités qu'il le souhaite depuis son Stock vers ses territoires (aucune limite de montant).

Phase 3 : Attaques. Illimitées. Minimum 2 unités sur le territoire attaquant (1 reste en garnison). Résolution aux dés (1 dé = 1 unité). Attaquant (max 3 dés) vs Défenseur (max 3 dés, choisit le nombre d'unités engagées pour limiter les pertes). Égalité = victoire du défenseur.

Phase 4 : Mouvement Stratégique. 1 seul déplacement autorisé en fin de tour vers un territoire adjacent contrôlé. Interdiction de faire converger plusieurs déplacements vers la même destination lors d'un même tour.

Phase 5 : Cartes Événement. Pioche d'une carte (Bonus d'unités pour le jeu de base) ajoutée au deck/main.

## 3. Les Éléments en Quarantaine (Pour plus tard)
[Sujet 1] - Factions : Pouvoirs asymétriques (Sintetici, Mutanti, Coloni, Rettiliani, Predoni).

[Sujet 2] - Économie Avancée : Cartes spéciales, boutique, collection, deckbuilding pré-match.

### II. ARCHITECTURE LOGICIELLE (Backend)
Le Langage & Framework : Python avec FastAPI.

Le Réseau : Communication en temps réel via WebSockets pour synchroniser les animations (dés, mouvements) chez tous les joueurs avec une empreinte ressource minimale.

Le Pattern de Conception : Approche par Composition et Événements (Architecture Orientée Données). Pas de classes imbriquées complexes. Un « Event Bus » reçoit les actions, un « Rules Engine » les valide, et des modules indépendants modifient l'état du jeu.

### III. INFRASTRUCTURE ET DÉPLOIEMENT
Serveur & Routage : Un VPS dédié unique pour démarrer, avec Traefik comme reverse proxy pour générer automatiquement les certificats SSL/HTTPS et router le trafic.

Conteneurisation : 100% sur Docker via docker-compose. Aucun service installé « en dur » sur l'OS pour garantir l'isolation et préparer le futur passage sous Kubernetes.

Les Bases de Données (Hybride) :

Redis (en RAM avec option AOF) : Pour gérer la partie en cours de manière ultra-rapide (déplacements, dés, état du plateau).

PostgreSQL (Relationnel) : Pour stocker les profils joueurs, historiques, inventaires et statistiques.

Sauvegardes (Backup) : Un script automatisé (Cron) exécutera un pg_dump à l'intérieur du conteneur PostgreSQL et enverra le fichier SQL propre vers un serveur de sauvegarde externe.

CI/CD (Déploiement Continu) : GitHub Actions avec un « self-hosted runner » sur le VPS. Déploiement fluide (up -d --build) et sécurisation stricte via l'injection de variables depuis les Secrets GitHub pour générer le fichier .env à la volée.