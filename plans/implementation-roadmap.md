# Roadmap d'Implémentation - Risiko! Game Board Strategy

## Phase 1: Authentification Complète (Priorité: Critique)

### Semaine 1: Backend - Authentification

#### Jour 1-2: Amélioration de l'authentification
- [ ] Ajouter validation des emails avec regex (backend/src/utils/helpers.ts)
- [ ] Implémenter refresh tokens (backend/src/utils/jwt.ts)
- [ ] Ajouter gestion des sessions actives (backend/src/services/session.service.ts)
- [ ] Implémenter rate limiting pour protection (backend/src/middleware/rateLimiter.ts)
- [ ] Ajouter confirmation d'email (backend/src/services/email.service.ts)

#### Jour 3-4: Endpoints d'authentification
- [ ] Créer endpoint GET /api/auth/profile (backend/src/controllers/auth.controller.ts)
- [ ] Créer endpoint PUT /api/auth/profile (backend/src/controllers/auth.controller.ts)
- [ ] Créer endpoint POST /api/auth/forgot-password (backend/src/controllers/auth.controller.ts)
- [ ] Créer endpoint POST /api/auth/reset-password (backend/src/controllers/auth.controller.ts)
- [ ] Créer endpoint POST /api/auth/logout (backend/src/controllers/auth.controller.ts)

#### Jour 5: Tests et documentation
- [ ] Tester tous les endpoints d'authentification
- [ ] Documenter l'API d'authentification
- [ ] Ajouter tests unitaires

### Semaine 2: Frontend - Interface d'authentification

#### Jour 1-2: Création des pages
- [ ] Créer page Login complète (frontend/src/pages/Login.jsx)
- [ ] Créer page Register complète (frontend/src/pages/Register.jsx)
- [ ] Ajouter validation des formulaires
- [ ] Ajouter gestion des erreurs

#### Jour 3-4: Intégration
- [ ] Intégrer JWT dans le localStorage
- [ ] Créer protected routes
- [ ] Ajouter redirection automatique
- [ ] Créer composant ProtectedRoute

#### Jour 5: Tests et améliorations
- [ ] Tester l'authentification complète
- [ ] Améliorer l'UX des erreurs
- [ ] Ajouter "se souvenir de moi"

---

## Phase 2: UI/UX et Pages Principales (Priorité: Haute)

### Semaine 3: Page d'Accueil Dynamique

#### Jour 1-2: Contenu dynamique
- [ ] Afficher le nom d'utilisateur connecté (frontend/src/components/common/Navbar.jsx)
- [ ] Afficher le profil utilisateur avec avatar (frontend/src/pages/Home.jsx)
- [ ] Afficher le classement des joueurs (frontend/src/components/Leaderboard/Leaderboard.jsx)
- [ ] Afficher les statistiques du joueur (frontend/src/pages/Home.jsx)

#### Jour 3-4: Design
- [ ] Créer design responsive (frontend/src/App.css)
- [ ] Ajouter animations fluides
- [ ] Intégrer carte du monde comme background
- [ ] Optimiser pour mobile

#### Jour 5: Tests
- [ ] Tester la page d'accueil
- [ ] Optimiser les performances

### Semaine 4: Page Lobby Améliorée

#### Jour 1-2: Liste des parties
- [ ] Liste dynamique des parties créées (frontend/src/pages/Lobby.jsx)
- [ ] Création de partie avec paramètres (frontend/src/pages/Lobby.jsx)
- [ ] Rejoindre une partie existante (frontend/src/pages/Lobby.jsx)
- [ ] Afficher l'état des parties (frontend/src/pages/Lobby.jsx)

#### Jour 3-4: Chat et interactions
- [ ] Chat de discussion dans le lobby (frontend/src/components/Chat/LobbyChat.jsx)
- [ ] Afficher les joueurs connectés
- [ ] Notifications en temps réel

#### Jour 5: Tests
- [ ] Tester le lobby complet
- [ ] Optimiser la liste des parties

### Semaine 5: Page Profil et Classement

#### Jour 1-2: Page Profil
- [ ] Informations du joueur (frontend/src/pages/Profile.jsx)
- [ ] Statistiques détaillées (frontend/src/pages/Profile.jsx)
- [ ] Historique des parties récentes (frontend/src/pages/Profile.jsx)
- [ ] Configuration du compte (frontend/src/pages/Profile.jsx)

#### Jour 3-4: Page Classement
- [ ] Classement global des joueurs par ELO (frontend/src/pages/Leaderboard.jsx)
- [ ] Classement par victoires (frontend/src/pages/Leaderboard.jsx)
- [ ] Classement par taux de victoire (frontend/src/pages/Leaderboard.jsx)
- [ ] Filtres par période (frontend/src/pages/Leaderboard.jsx)

#### Jour 5: Tests
- [ ] Tester les pages profil et classement
- [ ] Optimiser les performances

---

## Phase 3: Système de Création et Listing des Parties (Priorité: Critique)

### Semaine 6: Backend - Game Rooms

#### Jour 1-2: Modèles et services
- [ ] Créer modèle RoomPlayer (backend/prisma/schema.prisma)
- [ ] Créer service RoomService (backend/src/services/room.service.ts)
- [ ] Créer endpoint POST /api/rooms/create (backend/src/controllers/room.controller.ts)
- [ ] Créer endpoint GET /api/rooms (backend/src/controllers/room.controller.ts)
- [ ] Créer endpoint POST /api/rooms/:id/join (backend/src/controllers/room.controller.ts)

#### Jour 3-4: Matchmaking
- [ ] Implémenter matchmaking automatique (backend/src/services/matchmaking.service.ts)
- [ ] Gestion des slots de joueurs (max 6)
- [ ] Créer endpoint GET /api/rooms/available (backend/src/controllers/room.controller.ts)

#### Jour 5: Tests
- [ ] Tester la création de parties
- [ ] Tester le matchmaking
- [ ] Documenter l'API

### Semaine 7: Frontend - Interface de Lobby

#### Jour 1-2: Liste des parties
- [ ] Liste dynamique des parties avec filtres (frontend/src/components/Games/GameList.jsx)
- [ ] Formulaire de création de partie (frontend/src/components/Games/CreateGameForm.jsx)
- [ ] Bouton "Rejoindre" pour chaque partie (frontend/src/components/Games/GameList.jsx)
- [ ] Affichage du nombre de joueurs actuel/max (frontend/src/components/Games/GameList.jsx)

#### Jour 3-4: État des parties
- [ ] Indicateur d'état de la partie (frontend/src/components/Games/GameStatus.jsx)
- [ ] Mise à jour en temps réel (frontend/src/components/Games/GameList.jsx)
- [ ] Notifications de nouvelles parties

#### Jour 5: Tests
- [ ] Tester le lobby complet
- [ ] Optimiser la liste des parties

---

## Phase 4: Temps Réel avec Socket.io (Priorité: Critique)

### Semaine 8: Backend - WebSocket

#### Jour 1-2: Configuration
- [ ] Intégrer Socket.io (backend/src/services/socket.service.ts)
- [ ] Créer rooms Socket.io pour chaque partie (backend/src/services/socket.service.ts)
- [ ] Gérer les événements de connexion/déconnexion (backend/src/services/socket.service.ts)

#### Jour 3-4: Événements
- [ ] Créer événement: turn_start (backend/src/services/socket.service.ts)
- [ ] Créer événement: attack_request (backend/src/services/socket.service.ts)
- [ ] Créer événement: attack_result (backend/src/services/socket.service.ts)
- [ ] Créer événement: move_request (backend/src/services/socket.service.ts)
- [ ] Créer événement: turn_end (backend/src/services/socket.service.ts)
- [ ] Créer événement: game_state_update (backend/src/services/socket.service.ts)

#### Jour 5: Tests
- [ ] Tester Socket.io
- [ ] Optimiser les performances

### Semaine 9: Frontend - Game Screen

#### Jour 1-2: Carte interactive
- [ ] Carte interactive avec territoires cliquables (frontend/src/components/GameBoard.jsx)
- [ ] Affichage des armées sur chaque territoire (frontend/src/components/GameBoard.jsx)
- [ ] Indicateur du joueur actuel (frontend/src/components/GameBoard.jsx)

#### Jour 3-4: Historique et actions
- [ ] Historique des actions (logs) (frontend/src/components/GameLog.jsx)
- [ ] Panneau d'actions (frontend/src/components/GameActions.jsx)
- [ ] Chat de jeu en temps réel (frontend/src/components/GameChat.jsx)

#### Jour 5: Tests
- [ ] Tester le jeu en temps réel
- [ ] Optimiser les performances

---

## Phase 5: Mécaniques de Jeu Complètes (Priorité: Critique)

### Semaine 10: Phase 1 - Renforcement

#### Jour 1-2: Calcul des renforts
- [ ] Calculer renforts basés sur territoires contrôlés (backend/src/services/game.service.ts)
- [ ] Calculer bonus continents (backend/src/services/game.service.ts)
- [ ] Implémenter échange de cartes (backend/src/services/game.service.ts)

#### Jour 3-4: Placement des armées
- [ ] Placer armées sur la carte (backend/src/controllers/game.controller.ts)
- [ ] Valider le placement (backend/src/controllers/game.controller.ts)
- [ ] Broadcast de l'état mis à jour (backend/src/services/socket.service.ts)

#### Jour 5: Tests
- [ ] Tester la phase de renforcement
- [ ] Optimiser les calculs

### Semaine 11: Phase 2 - Attaque

#### Jour 1-2: Conditions d'attaque
- [ ] Vérifier conditions d'attaque (backend/src/services/game.service.ts)
- [ ] Système de dés (backend/src/services/game.service.ts)
- [ ] Résolution des pertes (backend/src/services/game.service.ts)

#### Jour 3-4: Conquête
- [ ] Conquête et occupation (backend/src/services/game.service.ts)
- [ ] Élimination des joueurs (backend/src/services/game.service.ts)
- [ ] Pioche de carte (backend/src/services/game.service.ts)

#### Jour 5: Tests
- [ ] Tester la phase d'attaque
- [ ] Optimiser les simulations de combat

### Semaine 12: Phase 3 - Déplacement

#### Jour 1-2: Déplacement stratégique
- [ ] Déplacer armées entre territoires adjacents (backend/src/services/game.service.ts)
- [ ] Valider le déplacement (backend/src/services/game.service.ts)
- [ ] Laisser au moins 1 armée sur territoire d'origine (backend/src/services/game.service.ts)

#### Jour 3-4: Fin de tour
- [ ] Phase 4: Pioche de carte (backend/src/services/game.service.ts)
- [ ] Passer au joueur suivant (backend/src/services/game.service.ts)
- [ ] Broadcast de l'état mis à jour (backend/src/services/socket.service.ts)

#### Jour 5: Tests
- [ ] Tester la phase de déplacement
- [ ] Tester le tour complet

---

## Phase 6: Score et Points (Priorité: Moyenne)

### Semaine 13: Backend - Score System

#### Jour 1-2: Modèles
- [ ] Créer modèle pour stocker les scores (backend/prisma/schema.prisma)
- [ ] Calculer ELO change après chaque partie (backend/src/services/leaderboard.service.ts)
- [ ] Mettre à jour le classement global (backend/src/services/leaderboard.service.ts)

#### Jour 3-4: Historique
- [ ] Stocker l'historique des parties (backend/src/services/leaderboard.service.ts)
- [ ] Créer endpoint GET /api/leaderboard (backend/src/controllers/leaderboard.controller.ts)
- [ ] Créer endpoint GET /api/leaderboard/history (backend/src/controllers/leaderboard.controller.ts)

#### Jour 5: Tests
- [ ] Tester le système de score
- [ ] Optimiser les calculs ELO

### Semaine 14: Frontend - Score Display

#### Jour 1-2: Affichage
- [ ] Afficher le score actuel du joueur (frontend/src/components/PlayerScore.jsx)
- [ ] Afficher les gains/pertes d'ELO (frontend/src/components/PlayerScore.jsx)
- [ ] Afficher le classement en temps réel (frontend/src/components/Leaderboard.jsx)

#### Jour 3-4: Récompenses
- [ ] Afficher les récompenses (badges, trophées) (frontend/src/components/Rewards.jsx)
- [ ] Créer page de récompenses (frontend/src/pages/Rewards.jsx)

#### Jour 5: Tests
- [ ] Tester l'affichage des scores
- [ ] Optimiser les performances

---

## Phase 7: Carte Officielle (Priorité: Haute)

### Semaine 15: Intégration de la Carte

#### Jour 1-2: Carte de base
- [ ] Intégrer l'image Mappe.jpg (frontend/src/components/Map/Map.jsx)
- [ ] Créer des zones cliquables pour chaque territoire (frontend/src/components/Map/Territory.jsx)
- [ ] Positionner les territoires sur la carte (frontend/src/components/Map/Territory.jsx)

#### Jour 3-4: Interactivité
- [ ] Afficher les armées sur chaque territoire (frontend/src/components/Map/Territory.jsx)
- [ ] Animations pour les attaques (frontend/src/components/Map/AttackAnimation.jsx)
- [ ] Sélectionner territoire attaquant (frontend/src/components/Map/Map.jsx)

#### Jour 5: Tests
- [ ] Tester la carte interactive
- [ ] Optimiser les performances

---

## Phase 8: Store du Jeu (Priorité: Moyenne)

### Semaine 16: Backend - Store System

#### Jour 1-2: Modèles
- [ ] Créer modèle pour les articles du store (backend/prisma/schema.prisma)
- [ ] Créer modèle pour les "season passes" (backend/prisma/schema.prisma)
- [ ] Implémenter système de points de jeu (backend/src/services/store.service.ts)

#### Jour 3-4: Endpoints
- [ ] Créer endpoint GET /api/store (backend/src/controllers/store.controller.ts)
- [ ] Créer endpoint POST /api/store/buy (backend/src/controllers/store.controller.ts)
- [ ] Créer endpoint GET /api/store/season-passes (backend/src/controllers/store.controller.ts)

#### Jour 5: Tests
- [ ] Tester le store
- [ ] Optimiser les transactions

### Semaine 17: Frontend - Store Interface

#### Jour 1-2: Interface
- [ ] Afficher les articles disponibles (frontend/src/pages/Store.jsx)
- [ ] Afficher les season passes (frontend/src/pages/Store.jsx)
- [ ] Interface d'achat avec confirmation (frontend/src/pages/Store.jsx)

#### Jour 3-4: Articles
- [ ] Afficher les articles achetés récemment (frontend/src/components/Store/PurchasedItems.jsx)
- [ ] Créer composant StoreItem (frontend/src/components/Store/StoreItem.jsx)
- [ ] Créer composant SeasonPass (frontend/src/components/Store/SeasonPass.jsx)

#### Jour 5: Tests
- [ ] Tester le store complet
- [ ] Optimiser les performances

---

## Phase 9: Amélioration Globale du Style (Priorité: Moyenne)

### Semaine 18: Design System

#### Jour 1-2: Variables CSS
- [ ] Créer variables CSS pour la palette de couleurs (frontend/src/index.css)
- [ ] Définir typographie cohérente (frontend/src/index.css)
- [ ] Créer composants réutilisables (frontend/src/components/common/)

#### Jour 3-4: Composants
- [ ] Créer composant Button (frontend/src/components/common/Button.jsx)
- [ ] Créer composant Card (frontend/src/components/common/Card.jsx)
- [ ] Créer composant Input (frontend/src/components/common/Input.jsx)
- [ ] Créer composant Modal (frontend/src/components/common/Modal.jsx)

#### Jour 5: Tests
- [ ] Tester le design system
- [ ] Optimiser les performances

### Semaine 19: Animations

#### Jour 1-2: Animations de base
- [ ] Animations de chargement (frontend/src/components/common/Loading.jsx)
- [ ] Animations de transition entre pages (frontend/src/App.css)

#### Jour 3-4: Animations de jeu
- [ ] Animations de combat (dés qui roulent) (frontend/src/components/Combat/CombatAnimation.jsx)
- [ ] Animations de victoire/défaite (frontend/src/components/Combat/ResultAnimation.jsx)

#### Jour 5: Tests
- [ ] Tester les animations
- [ ] Optimiser les performances

### Semaine 20: Responsive Design

#### Jour 1-2: Mobile
- [ ] Optimiser pour mobile (frontend/src/index.css)
- [ ] Optimiser pour tablette (frontend/src/index.css)

#### Jour 3-4: Desktop
- [ ] Optimiser pour desktop (frontend/src/index.css)
- [ ] Test sur plusieurs résolutions

#### Jour 5: Tests
- [ ] Tester le responsive design
- [ ] Optimiser les performances

---

## Ordre d'Implémentation Recommandé

1. **Phase 1: Authentification** (Semaine 1-2)
   - Critique pour la sécurité
   - Base pour toutes les autres fonctionnalités

2. **Phase 2: UI/UX** (Semaine 3-5)
   - Haute priorité pour l'expérience utilisateur
   - Page d'accueil, lobby, profil, classement

3. **Phase 3: Système de Parties** (Semaine 6-7)
   - Critique pour la jouabilité
   - Création et listing des parties

4. **Phase 4: Temps Réel** (Semaine 8-9)
   - Critique pour le gameplay
   - Socket.io et écran de jeu

5. **Phase 5: Mécaniques de Jeu** (Semaine 10-12)
   - Critique pour le gameplay
   - Les 3 phases du jeu

6. **Phase 6: Score et Points** (Semaine 13-14)
   - Moyenne priorité
   - Score et classement

7. **Phase 7: Carte Officielle** (Semaine 15)
   - Haute priorité
   - Carte interactive

8. **Phase 8: Store du Jeu** (Semaine 16-17)
   - Moyenne priorité
   - Store et season passes

9. **Phase 9: Amélioration Globale du Style** (Semaine 18-20)
   - Moyenne priorité
   - Design system et animations

---

## Conclusion

Cette roadmap fournit un plan détaillé pour l'implémentation du jeu Risiko! avec des délais réalistes et des priorités claires. Chaque phase peut être ajustée en fonction des besoins spécifiques du projet.
