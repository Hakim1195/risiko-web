from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api import api_router
from .core.database import Base, engine
from .api.sockets.connection_manager import ConnectionManager
import models.models

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create global connection manager
connection_manager = ConnectionManager()

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

# Create database tables
@app.on_event("startup")
async def create_tables():
    Base.metadata.create_all(bind=engine)

# WebSocket endpoint for game rooms
@app.websocket("/ws/game/{game_room_id}/{client_id}")
async def websocket_endpoint(websocket: WebSocket, game_room_id: str, client_id: str):
    # Connect the WebSocket to the room
    await connection_manager.connect(websocket, game_room_id)
    
    try:
        # Main WebSocket loop
        while True:
            data = await websocket.receive_text()
            # Broadcast message to all clients in the room
            await connection_manager.broadcast_to_room(data, game_room_id)
    except WebSocketDisconnect:
        # Handle client disconnection
        connection_manager.disconnect(websocket, game_room_id)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)