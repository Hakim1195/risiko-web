#!/bin/bash

echo "Démarrage du projet Game Board Strategy..."

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "Erreur: Docker n'est pas installé."
    exit 1
fi

# Vérifier que Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "Erreur: Docker Compose n'est pas installé."
    exit 1
fi

echo "Démarrage des services avec Docker Compose..."
docker-compose up -d

echo "Services démarrés :"
echo "- Backend sur http://localhost:3000"
echo "- Frontend sur http://localhost:3001"
echo "- Base de données PostgreSQL sur port 5432"
echo "- Redis sur port 6379"

echo ""
echo "Pour voir les logs des services :"
echo "docker-compose logs -f"