"""
SQLAlchemy models for the Wasteland Warfare game data layer.
This file contains all the database models using SQLAlchemy ORM.
"""

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from typing import List

Base = declarative_base()

class User(Base):
    """
    User model representing a player in the game.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    stats_victoires = Column(Integer, default=0)
    stats_parties_jouees = Column(Integer, default=0)

    # Relationships
    game_rooms = relationship("GameRoomPlayer", back_populates="user")

class Continent(Base):
    """
    Continent model representing static game continents.
    """
    __tablename__ = "continents"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, unique=True, nullable=False)
    bonus_renfort = Column(Integer, nullable=False)

    # Relationships
    territories = relationship("Territory", back_populates="continent")

class Territory(Base):
    """
    Territory model representing static game territories.
    """
    __tablename__ = "territories"

    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    continent_id = Column(Integer, ForeignKey("continents.id"), nullable=False)

    # Relationships
    continent = relationship("Continent", back_populates="territories")

class GameRoom(Base):
    """
    GameRoom model representing an instance of a game.
    """
    __tablename__ = "game_rooms"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(Enum("waiting", "in_progress", "finished", name="gameroom_status_enum"), default="waiting")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    players = relationship("GameRoomPlayer", back_populates="game_room")

class GameRoomPlayer(Base):
    """
    Association table for GameRoom and User relationships.
    This table tracks which users are in which game rooms and their chosen faction.
    """
    __tablename__ = "game_room_players"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    game_room_id = Column(Integer, ForeignKey("game_rooms.id"), nullable=False)
    faction = Column(String, default="")

    # Relationships
    user = relationship("User", back_populates="game_rooms")
    game_room = relationship("GameRoom", back_populates="players")