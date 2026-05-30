import asyncio
from typing import List, Dict, Optional
from pydantic import ValidationError
from api.game.state_schemas import GameState, PlayerState, TerritoryState
from api.core.redis import redis_pool
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GameStateManager:
    """Gère l'état du jeu en mémoire via Redis."""
    
    @staticmethod
    async def initialize_game(room_id: int, players: List[dict]) -> None:
        """Crée l'état initial neutre et le sauvegarde dans Redis."""
        
        # Initialisation des territoires (43 territoires, neutres)
        territories = {}
        for territory_id in range(1, 44):  # 1 à 43 inclus
            territories[territory_id] = TerritoryState(
                territory_id=territory_id,
                owner_id=None,
                garrison=0
            )
        
        # Initialisation des joueurs
        players_dict = {}
        for player_data in players:
            player_id = player_data["player_id"]
            players_dict[player_id] = PlayerState(
                player_id=player_id,
                faction=player_data.get("faction", ""),
                units_in_stock=player_data.get("initial_units", 0),
                status="alive"
            )
        
        # État initial du jeu
        game_state = GameState(
            room_id=room_id,
            players=players_dict,
            territories=territories,
            current_turn=1,
            current_player_id=players[0]["player_id"],  # Premier joueur commence
            phase=0,  # Phase 0: La Contamination
            contamination_zone={"position": 1, "probability": 0.2}  # Position initiale arbitraire, probabilité T1
        )
        
        # Sauvegarde dans Redis (Pydantic V2)
        key = f"game_state:{room_id}"
        await redis_pool.set(key, game_state.model_dump_json())
        logger.info(f"État initial de la partie {room_id} créé et sauvegardé dans Redis.")
    
    @staticmethod
    async def get_game_state(room_id: int) -> GameState:
        """Récupère, désérialise et valide l'état du jeu depuis Redis."""
        key = f"game_state:{room_id}"
        serialized_state = await redis_pool.get(key)
        
        if serialized_state is None:
            raise ValueError(f"Aucun état de partie trouvé pour room_id {room_id}")
        
        try:
            # Désérialisation stricte (Pydantic V2)
            game_state = GameState.model_validate_json(serialized_state)
            return game_state
        except ValidationError as e:
            logger.error(f"Validation échouée pour l'état de la partie {room_id}: {e}")
            raise ValueError(f"État corrompu pour la partie {room_id}") from e
    
    @staticmethod
    async def save_game_state(room_id: int, state: GameState) -> None:
        """Sérialise et sauvegarde l'état dans Redis."""
        key = f"game_state:{room_id}"
        # Sérialisation (Pydantic V2)
        await redis_pool.set(key, state.model_dump_json())
        logger.info(f"État de la partie {room_id} sauvegardé dans Redis.")
    
    @staticmethod
    async def delete_game_state(room_id: int) -> None:
        """Nettoie la mémoire une fois la partie terminée."""
        key = f"game_state:{room_id}"
        await redis_pool.delete(key)
        logger.info(f"État de la partie {room_id} supprimé de Redis.")