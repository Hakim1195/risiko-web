import os
from redis.asyncio import Redis
from typing import AsyncGenerator

# Récupération des variables d'environnement
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

# Création d'un pool de connexion asynchrone à Redis
redis_pool = Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    decode_responses=True,  # Décode automatiquement les réponses en UTF-8
    encoding="utf-8"
)

async def get_redis() -> AsyncGenerator[Redis, None]:
    """Dépendance pour injecter la connexion Redis dans l'application."""
    yield redis_pool