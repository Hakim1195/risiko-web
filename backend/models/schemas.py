"""
Pydantic schemas for the Wasteland Warfare game data layer.
This file contains all the Pydantic models for data validation and serialization.
"""

from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

# Base schemas (for shared fields)
class UserBase(BaseModel):
    username: str
    email: str

class ContinentBase(BaseModel):
    nom: str
    bonus_renfort: int

class TerritoryBase(BaseModel):
    nom: str
    continent_id: int

class GameRoomBase(BaseModel):
    status: str = "waiting"
    created_at: Optional[datetime] = None

class GameRoomPlayerBase(BaseModel):
    user_id: int
    game_room_id: int
    faction: str = ""

# Create schemas (for request bodies)
class UserCreate(UserBase):
    hashed_password: str

class ContinentCreate(ContinentBase):
    pass

class TerritoryCreate(TerritoryBase):
    pass

class GameRoomCreate(GameRoomBase):
    pass

class GameRoomPlayerCreate(GameRoomPlayerBase):
    pass

# Response schemas (for API responses)
class UserResponse(UserBase):
    id: int
    stats_victoires: int
    stats_parties_jouees: int
    
    model_config = ConfigDict(from_attributes=True)

class ContinentResponse(ContinentBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

class TerritoryResponse(TerritoryBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

class GameRoomResponse(GameRoomBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

class GameRoomPlayerResponse(GameRoomPlayerBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

# Additional schemas for nested relationships
class GameRoomPlayerWithUser(GameRoomPlayerResponse):
    user: UserResponse
    
    model_config = ConfigDict(from_attributes=True)

class GameRoomWithPlayers(GameRoomResponse):
    players: List[GameRoomPlayerWithUser]
    
    model_config = ConfigDict(from_attributes=True)