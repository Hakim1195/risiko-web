from fastapi import APIRouter

from backend.api.v1.endpoints import auth, lobby

# Main API router
api_router = APIRouter()

# Include sub-routers
api_router.include_router(auth.router)
api_router.include_router(lobby.router)