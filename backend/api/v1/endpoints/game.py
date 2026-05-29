from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket
from sqlalchemy.orm import Session
from typing import Annotated
import json

from backend.models.models import GameRoom, GameRoomPlayer, User
from backend.api.v1.endpoints.auth import get_current_user
from backend.api.v1.endpoints.lobby import get_waiting_rooms
from backend.core.database import get_db
from backend.api.game.state_manager import GameStateManager
from backend.api.sockets.connection_manager import manager as connection_manager

# Router initialization
router = APIRouter(prefix="/game", tags=["game"])

@router.post("/rooms/{room_id}/start")
async def start_game(room_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Start a game in a specific room.
    
    This endpoint:
    1. Verifies the room exists and is in "waiting" status
    2. Verifies the room has between 3-6 players
    3. Updates the room status to "in_progress"
    4. Calculates initial units based on player count
    5. Initializes game state in Redis
    6. Broadcasts game started message to all room players
    """
    
    # Check if room exists and is in waiting status
    room = db.query(GameRoom).filter(GameRoom.id == room_id, GameRoom.status == "waiting").first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found or not waiting")
    
    # Get all players in the room
    players_in_room = db.query(GameRoomPlayer).filter(GameRoomPlayer.game_room_id == room_id).all()
    
    # Verify room has between 3-6 players
    player_count = len(players_in_room)
    if player_count < 3 or player_count > 6:
        raise HTTPException(status_code=400, detail="Room must have between 3 and 6 players to start a game")
    
    # Update room status to in_progress
    room.status = "in_progress"
    db.commit()
    db.refresh(room)
    
    # Calculate initial units based on player count
    initial_units = {
        3: 35,
        4: 30,
        5: 25,
        6: 20
    }[player_count]
    
    # Prepare players data
    players_data = []
    for player in players_in_room:
        player_data = {
            "player_id": player.user_id,
            "initial_units": initial_units,
            "faction": player.faction # <-- Ajout de la faction ici
        }
        players_data.append(player_data)
    
    # Initialize game state in Redis
    await GameStateManager.initialize_game(room_id, players_data)
    
    # Broadcast game started message to all room players
    await connection_manager.broadcast_to_room(
        json.dumps({"type": "game_started", "room_id": room_id}), 
        str(room_id)
    )
    
    return {"message": f"Game started successfully in room {room_id}"}