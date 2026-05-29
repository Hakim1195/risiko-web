"""
Test file to verify that the SQLAlchemy models are working correctly.
"""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models.models import Base, User, Continent, Territory, GameRoom, GameRoomPlayer
from backend.core.database import engine

def test_models_creation():
    """Test that all models can be created successfully."""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Test that we can create instances of each model
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password="hashed_password"
    )
    
    continent = Continent(
        nom="Test Continent",
        bonus_renfort=5
    )
    
    territory = Territory(
        nom="Test Territory",
        continent_id=1
    )
    
    game_room = GameRoom(
        status="waiting"
    )
    
    game_room_player = GameRoomPlayer(
        user_id=1,
        game_room_id=1,
        faction="test_faction"
    )
    
    # Verify that all models have the expected attributes
    assert user.username == "testuser"
    assert user.email == "test@example.com"
    assert continent.nom == "Test Continent"
    assert continent.bonus_renfort == 5
    assert territory.nom == "Test Territory"
    assert game_room.status == "waiting"
    assert game_room_player.faction == "test_faction"
    
    print("All model tests passed!")

if __name__ == "__main__":
    test_models_creation()