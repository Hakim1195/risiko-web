"""
WebSocket connection manager for the Wasteland Warfare game.
This file handles the management of WebSocket connections for multiplayer functionality.
"""
import asyncio
from typing import Dict, List
from fastapi import WebSocket

class ConnectionManager:
    """
    A connection manager for handling WebSocket connections in game rooms.
    """
    
    def __init__(self):
        # Dictionary to store active connections by room ID
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, room_id: str):
        """
        Add a WebSocket connection to a room.
        
        Args:
            websocket: The WebSocket connection
            room_id: The ID of the game room
        """
        await websocket.accept()
        
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        
        self.active_connections[room_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, room_id: str):
        """
        Remove a WebSocket connection from a room.
        
        Args:
            websocket: The WebSocket connection
            room_id: The ID of the game room
        """
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)
                
                # Clean up empty rooms
                if not self.active_connections[room_id]:
                    del self.active_connections[room_id]
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """
        Send a message to a specific WebSocket connection.
        
        Args:
            message: The message to send
            websocket: The WebSocket connection
        """
        await websocket.send_json(message)
    
    async def broadcast_to_room(self, room_id: str, message: dict):
        """
        Send a message to all connections in a specific room.
        
        Args:
            message: The message to send
            room_id: The ID of the game room
        """
        if room_id in self.active_connections:
            # Create a list of tasks for sending messages
            tasks = []
            for connection in self.active_connections[room_id]:
                tasks.append(connection.send_json(message))
            
            # Send messages concurrently and handle exceptions silently
            await asyncio.gather(*tasks, return_exceptions=True)

# Create global instance of ConnectionManager
manager = ConnectionManager()