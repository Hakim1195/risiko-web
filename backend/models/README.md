# Data Layer Models

This directory contains the SQLAlchemy models and Pydantic schemas for the Wasteland Warfare game backend.

## Files

### `models.py`
Contains all SQLAlchemy ORM models:
- `User`: Represents game players
- `Continent`: Represents static game continents
- `Territory`: Represents static game territories
- `GameRoom`: Represents game instances
- `GameRoomPlayer`: Association table for users and game rooms

### `schemas.py`
Contains all Pydantic models for data validation and serialization:
- Base schemas for shared fields
- Create schemas for request bodies
- Response schemas for API responses
- Nested relationship schemas

### `__init__.py`
Exports all models and schemas for easy importing

### `database.py`
Database configuration and initialization

## Database Schema

The database schema is designed with the following relationships:
- Users can participate in multiple GameRooms (many-to-many)
- GameRooms contain multiple GameRoomPlayers
- Continents contain multiple Territories (one-to-many)
- Territories belong to one Continent

## Usage

To use these models in your application:

```python
from backend.models import User, Continent, Territory, GameRoom, GameRoomPlayer
from backend.models.schemas import UserCreate, UserResponse