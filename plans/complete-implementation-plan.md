# Plan d'Implémentation Complet - Risiko! Game Board Strategy

## Vue d'Ensemble

Ce document décrit le plan complet d'implémentation pour transformer le jeu en une application multijoueurs complète et jouable.

---

## 1. Authentification Complète

### 1.1 Backend - Amélioration de l'authentification
- [ ] Ajouter validation des emails avec regex
- [ ] Implémenter refresh tokens pour une session plus sécurisée
- [ ] Ajouter gestion des sessions actives
- [ ] Implémenter protection contre les attaques par force brute (rate limiting)
- [ ] Ajouter confirmation d'email lors de l'inscription
- [ ] Implémenter "mot de passe oublié" avec reset token

### 1.2 Frontend - Interface d'authentification
- [ ] Créer formulaire d'inscription complet avec validation
- [ ] Créer formulaire de connexion avec "se souvenir de moi"
- [ ] Ajouter gestion des erreurs d'authentification
- [ ] Implémenter redirection automatique après connexion
- [ ] Ajouter affichage du token JWT dans le localStorage

---

## 2. Page d'Accueil Dynamique

### 2.1 Contenu Dynamique
- [ ] Afficher le nom d'utilisateur connecté
- [ ] Afficher le profil utilisateur avec avatar
- [ ] Afficher le classement des joueurs (top 10)
- [ ] Afficher les statistiques du joueur (parties jouées, victoires, défaites)
- [ ] Liens vers le lobby et le profil utilisateur

### 2.2 Design
- [ ] Créer un design responsive et moderne
- [ ] Ajouter animations et transitions fluides
- [ ] Intégrer la carte du monde comme background

---

## 3. Amélioration des Interfaces Utilisateurs

### 3.1 Page Lobby
- [ ] Liste dynamique des parties créées
- [ ] Création de partie avec paramètres (nombre de joueurs, nom)
- [ ] Rejoindre une partie existante
- [ ] Afficher l'état des parties (en attente, en cours, terminée)
- [ ] Chat de discussion dans le lobby

### 3.2 Page Profil
- [ ] Informations du joueur (pseudo, email, elo rating)
- [ ] Statistiques détaillées (parties jouées, victoires, défaites, taux de victoire)
- [ ] Historique des parties récentes
- [ ] Configuration du compte (avatar, mot de passe)

### 3.3 Page Classement
- [ ] Classement global des joueurs par ELO
- [ ] Classement par victoires
- [ ] Classement par taux de victoire
- [ ] Filtres par période (semaine, mois, année, tout)

---

## 4. Système de Création et Listing des Parties

### 4.1 Backend - Game Rooms
- [ ] Créer modèle RoomPlayer pour gérer les joueurs dans une partie
- [ ] Implémenter logique de création de partie
- [ ] Ajouter gestion des slots de joueurs (max 6)
- [ ] Créer endpoint pour lister les parties disponibles
- [ ] Implémenter matchmaking automatique

### 4.2 Frontend - Interface de Lobby
- [ ] Liste dynamique des parties avec filtres
- [ ] Formulaire de création de partie
- [ ] Bouton "Rejoindre" pour chaque partie disponible
- [ ] Affichage du nombre de joueurs actuel/max
- [ ] Indicateur d'état de la partie

---

## 5. Écran de Jeu Dynamique en Temps Réel

### 5.1 Backend - WebSocket/Socket.io
- [ ] Implémenter Socket.io pour communication en temps réel
- [ ] Créer rooms Socket.io pour chaque partie
- [ ] Gérer les événements: tour, attaque, défense, fin de partie
- [ ] Synchroniser l'état du jeu entre tous les joueurs

### 5.2 Frontend - Game Screen
- [ ] Carte interactive avec territoires cliquables
- [ ] Affichage des armées sur chaque territoire
- [ ] Indicateur du joueur actuel
- [ ] Historique des actions (logs)
- [ ] Panneau d'actions (déploiement, attaque, déplacement)
- [ ] Chat de jeu en temps réel

---

## 6. Mécaniques de Jeu Complètes (Risiko!)

### 6.1 Phase 1: Renforcement (Obligatoire)
- [ ] Calculer renforts basés sur territoires contrôlés (min 3)
- [ ] Calculer bonus continents (Asie: 7, AmNord: 5, Europe: 5, Afrique: 3, AmSud: 2, Océanie: 2)
- [ ] Implémenter échange de cartes (3 fantassins: 6, 3 cavaliers: 8, 3 canons: 4, mixte: 10, jolly: 12)
- [ ] Placer armées sur la carte

### 6.2 Phase 2: Attaque (Facultative)
- [ ] Vérifier conditions d'attaque (2+ armées sur territoire attaquant)
- [ ] Système de dés (max 3 dés attaquants, max 3 dés défenseurs)
- [ ] Résolution des pertes (avantage défensif: égalité = défenseur gagne)
- [ ] Conquête et occupation (déplacer armées après victoire)
- [ ] Élimination des joueurs (capture de toutes les cartes)

### 6.3 Phase 3: Déplacement Stratégique (Facultatif)
- [ ] Déplacer armées entre territoires adjacents contrôlés
- [ ] Laisser au moins 1 armée sur territoire d'origine

### 6.4 Phase 4: Pioche de Carte
- [ ] Piocher une carte si territoire conquis durant le tour
- [ ] Ajouter carte à la main du joueur
- [ ] Gérer dépassement (max 6 cartes, obligé d'échanger)

---

## 7. Gestion des Scores et Points

### 7.1 Backend - Score System
- [ ] Créer modèle pour stocker les scores de chaque partie
- [ ] Calculer ELO change après chaque partie
- [ ] Mettre à jour le classement global
- [ ] Stocker l'historique des parties

### 7.2 Frontend - Score Display
- [ ] Afficher le score actuel du joueur
- [ ] Afficher les gains/pertes d'ELO après chaque partie
- [ ] Afficher le classement en temps réel
- [ ] Afficher les récompenses (badges, trophées)

---

## 8. Carte Officielle du Jeu

### 8.1 Intégration de la Carte
- [ ] Intégrer l'image Mappe.jpg comme fond de la carte
- [ ] Créer des zones cliquables pour chaque territoire
- [ ] Positionner les territoires sur la carte (coordinates)
- [ ] Afficher les armées sur chaque territoire
- [ ] Animations pour les attaques (lignes entre territoires)

### 8.2 Interactivité
- [ ] Sélectionner territoire attaquant
- [ ] Sélectionner territoire cible (adjacent)
- [ ] Afficher les armées disponibles
- [ ] Confirmer l'attaque avec les dés

---

## 9. Store du Jeu

### 9.1 Backend - Store System
- [ ] Créer modèle pour les articles du store
- [ ] Créer modèle pour les "season passes"
- [ ] Implémenter système de points de jeu (gold, gems)
- [ ] Ajouter endpoint pour acheter des articles

### 9.2 Frontend - Store Interface
- [ ] Afficher les articles disponibles (armées bonus, dés spéciaux, etc.)
- [ ] Afficher les season passes (avantages, prix)
- [ ] Interface d'achat avec confirmation
- [ ] Afficher les articles achetés récemment

### 9.3 Articles du Store
- [ ] Bonus de renforcement (armées supplémentaires)
- [ ] Dés spéciaux (avantage au combat)
- [ ] Cartes territoires supplémentaires
- [ ] Season Pass (avantages permanents, badges exclusifs)

---

## 10. Amélioration Globale du Style

### 10.1 Design System
- [ ] Créer variables CSS pour la palette de couleurs
- [ ] Définir typographie cohérente
- [ ] Créer composants réutilisables (buttons, cards, inputs)
- [ ] Implémenter dark/light mode

### 10.2 Animations
- [ ] Animations de chargement
- [ ] Animations de transition entre pages
- [ ] Animations de combat (dés qui roulent)
- [ ] Animations de victoire/défaite

### 10.3 Responsive Design
- [ ] Optimiser pour mobile
- [ ] Optimiser pour tablette
- [ ] Optimiser pour desktop
- [ ] Test sur plusieurs résolutions

---

## Architecture Technique Recommandée

### Backend
```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── game.controller.ts
│   │   ├── room.controller.ts
│   │   ├── store.controller.ts
│   │   └── leaderboard.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── game.service.ts
│   │   ├── room.service.ts
│   │   ├── store.service.ts
│   │   └── leaderboard.service.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── game.routes.ts
│   │   ├── room.routes.ts
│   │   ├── store.routes.ts
│   │   └── leaderboard.routes.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── rateLimiter.ts
│   │   └── validation.ts
│   └── utils/
│       ├── socket.io.ts
│       └── gameLogic.ts
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── GameBoard.tsx
│   │   ├── Map/
│   │   │   ├── Territory.tsx
│   │   │   └── Map.tsx
│   │   ├── Store/
│   │   │   ├── StoreItem.tsx
│   │   │   └── SeasonPass.tsx
│   │   └── Leaderboard/
│   │       ├── LeaderboardRow.tsx
│   │       └── Leaderboard.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Lobby.tsx
│   │   ├── Game.tsx
│   │   ├── Profile.tsx
│   │   ├── Leaderboard.tsx
│   │   └── Store.tsx
│   ├── services/
│   │   ├── gameApi.ts
│   │   ├── socket.ts
│   │   └── storeApi.ts
│   └── store/
│       ├── slices/
│       │   ├── gameSlice.ts
│       │   ├── authSlice.ts
│       │   └── storeSlice.ts
│       └── store.ts
```

---

## Ordre d'Implémentation Recommandé

1. **Phase 1: Authentification** (Semaine 1)
   - Améliorer l'authentification backend
   - Créer les interfaces frontend

2. **Phase 2: UI/UX** (Semaine 2)
   - Améliorer les pages Home, Lobby, Profile
   - Créer la page Leaderboard

3. **Phase 3: Système de Parties** (Semaine 3)
   - Créer le système de rooms
   - Implémenter le matchmaking

4. **Phase 4: Temps Réel** (Semaine 4)
   - Intégrer Socket.io
   - Créer l'écran de jeu dynamique

5. **Phase 5: Mécaniques de Jeu** (Semaine 5-6)
   - Implémenter les 3 phases du jeu
   - Système de combat avec dés
   - Gestion des tours

6. **Phase 6: Score et Store** (Semaine 7)
   - Implémenter le système de score
   - Créer le store

7. **Phase 7: Carte et Style** (Semaine 8)
   - Intégrer la carte officielle
   - Améliorer le style global

---

## Conclusion

Ce plan fournit une feuille de route complète pour transformer le jeu en une application multijoueurs complète et jouable. Chaque phase peut être implémentée indépendamment, permettant des livraisons incrémentales.
