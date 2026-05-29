from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated

from backend.models.models import GameRoom, GameRoomPlayer, User
from backend.models.schemas import GameRoomCreate, GameRoomResponse
from backend.api.v1.endpoints.auth import get_current_user
from backend.core.database import get_db

# Router initialization
router = APIRouter(prefix="/lobby", tags=["lobby"])

@router.get("/rooms", response_model=List[GameRoomResponse])
def get_waiting_rooms(db: Session = Depends(get_db)):
    """Get all game rooms with status 'waiting'"""
    rooms = db.query(GameRoom).filter(GameRoom.status == "waiting").all()
    return rooms

@router.post("/rooms", response_model=GameRoomResponse)
def create_room(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create a new game room (only authenticated users)"""
    db_room = GameRoom(
        status="waiting"
    )
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    
    # Auto-join the creator to the room
    db_room_player = GameRoomPlayer(
        game_room_id=db_room.id,
        user_id=current_user.id
    )
    db.add(db_room_player)
    db.commit()
    
    return db_room

@router.post("/rooms/{room_id}/join")
def join_room(room_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Join a game room"""
    # Check if room exists and is waiting
    room = db.query(GameRoom).filter(GameRoom.id == room_id, GameRoom.status == "waiting").first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found or not waiting")
    
    # Check if user is already in this room
    existing_entry = db.query(GameRoomPlayer).filter(
        GameRoomPlayer.game_room_id == room_id,
        GameRoomPlayer.user_id == current_user.id
    ).first()
    
    if existing_entry:
        raise HTTPException(status_code=400, detail="User already in this room")
    
    # Add user to room
    db_room_player = GameRoomPlayer(
        game_room_id=room_id,
        user_id=current_user.id
    )
    db.add(db_room_player)
    db.commit()
    
    return {"message": f"Successfully joined room {room_id}"}