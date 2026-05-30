"""
WebSocket router for handling multiplayer connections in the Wasteland Warfare game.
This file contains the WebSocket endpoint that manages player connections and game actions.
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from .connection_manager import manager
from api.game.engine import GameEngine
from api.game.state_manager import GameStateManager

router = APIRouter()

@router.websocket("/ws/{room_id}/{player_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, player_id: str):
    """
    WebSocket endpoint for handling player connections and game actions.
    """
    # 1. Accept the WebSocket connection
    await manager.connect(websocket, room_id)
    
    try:
        # La boucle d'écoute infinie
        while True:
            try:
                # 2. On attend le message du joueur
                data = await websocket.receive_json()
                
                action_type = data.get("action")
                payload = data.get("payload", {})
                
                # 3. On envoie au cerveau (Game Engine)
                event = await GameEngine.process_action(
                    int(room_id), 
                    int(player_id), 
                    action_type, 
                    payload
                )
                
                # 4. On récupère le nouveau plateau à jour
                state = await GameStateManager.get_game_state(int(room_id))
                
                # 5. On diffuse le résultat et le nouveau plateau à tout le monde
                await manager.broadcast_to_room(
                    room_id,
                    {
                        "type": "action_result",
                        "event": event,
                        "state": state.model_dump()
                    }
                )
                
            except ValueError as e:
                # Géré À L'INTÉRIEUR de la boucle : on prévient le joueur de son erreur
                # sans le déconnecter du serveur ! (Attention à l'ordre des arguments)
                await manager.send_personal_message(
                    {
                        "type": "error",
                        "message": str(e)
                    },
                    websocket
                )
                
    except WebSocketDisconnect:
        # Géré À L'EXTÉRIEUR : Le joueur a fermé son navigateur ou perdu sa co
        manager.disconnect(websocket, room_id) # Pas de await ici, la fonction est synchrone
        
        # On prévient les autres qu'il a quitté la partie
        await manager.broadcast_to_room(
            room_id,
            {
                "type": "player_disconnected",
                "player_id": player_id
            }
        )