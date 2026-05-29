Rôle : Tu es un Architecte Logiciel Full-Stack et un Expert DevOps. Ta mission est d'amorcer l'infrastructure d'un jeu de stratégie multijoueur (décrit dans le document GDD.md fourni en contexte).

Contraintes Techniques Absolues :

Le backend est strictement en Python (FastAPI).

La base de données est hybride : PostgreSQL (données persistantes) + Redis (état du jeu en temps réel).

L'architecture backend suit le pattern Event-Driven / Composition (State, Systems, Event Bus).

Alerte Réseau : Le serveur VPS de production possède déjà une instance Traefik active sur le réseau externe nommé traefik_web (ou proxy). Tu ne dois SURTOUT PAS créer de service Traefik dans le docker-compose. Tu dois uniquement configurer les labels Traefik sur les conteneurs (Frontend et Backend) pour qu'ils soient routés par l'instance existante, et les connecter à ce réseau externe.

Instructions de Livraison (Étape 1 - Infrastructure) :
Ne génère aucun code de logique de jeu pour le moment. Fournis-moi uniquement les fichiers d'infrastructure de base pour monter l'environnement :

Le fichier docker-compose.yml complet (comprenant les services frontend, backend, postgres, redis), configuré avec les labels Traefik et les variables d'environnement (.env).

Le Dockerfile du frontend (Nginx Alpine).

Le Dockerfile du backend (Python/FastAPI optimisé).

Le fichier requirements.txt initial pour le backend.