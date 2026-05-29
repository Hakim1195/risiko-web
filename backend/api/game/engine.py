import asyncio
from typing import Dict, Any
from backend.api.game.state_manager import GameStateManager
from backend.api.game.state_schemas import GameState


class GameEngine:
    """Game Engine for processing player actions and managing game state."""
    
    @staticmethod
    async def process_action(room_id: int, player_id: int, action_type: str, payload: dict) -> dict:
        """
        Process a player action and update the game state accordingly.
        """
        # Get current game state
        state = await GameStateManager.get_game_state(room_id)
        
        # Verify it's the player's turn and they are alive
        if state.current_player_id != player_id:
            raise ValueError("Ce n'est pas votre tour")
        
        if state.players[player_id].status != "alive":
            raise ValueError("Vous êtes éliminé, vous ne pouvez pas jouer")
        
        # Route action to appropriate handler
        action_handlers = {
            "pass_turn": GameEngine._handle_pass_turn,
        }
        
        # Call the appropriate handler
        if action_type in action_handlers:
            handler = action_handlers[action_type]
            event = await handler(state, payload)
        else:
            raise ValueError(f"Action type '{action_type}' not supported")
        
        # Save updated game state
        await GameStateManager.save_game_state(room_id, state)
        
        return event
    
    @staticmethod
    async def _handle_pass_turn(state: GameState, payload: dict) -> dict:
        """
        Handle the pass turn action (advances to the next phase).
        """
        await GameEngine._advance_phase(state)
        
        return {
            "event_type": "turn_passed",
            "room_id": state.room_id,
            "from_player_id": state.current_player_id,
            "phase": state.phase,
            "turn": state.current_turn
        }
    
    @staticmethod
    async def _end_turn(state: GameState):
        """
        Calculate whose turn it is next (skipping eliminated players)
        and increment the current turn.
        """
        # Extraire et trier les ID de joueurs de manière sécurisée
        player_ids = sorted(list(state.players.keys()))
        current_index = player_ids.index(state.current_player_id)
        
        # Trouver le prochain joueur encore en vie
        for _ in range(len(player_ids)):
            current_index = (current_index + 1) % len(player_ids)
            next_player_id = player_ids[current_index]
            
            if state.players[next_player_id].status == "alive":
                state.current_player_id = next_player_id
                state.current_turn += 1
                return
                
        # Si on arrive ici, un seul joueur est en vie (fin de partie)
    
    @staticmethod
    async def _advance_phase(state: GameState):
        """
        Advance to the next phase, and end the turn if we've completed all phases.
        """
        state.phase += 1
        
        # Si la phase dépasse 5 (fin de la phase d'attaque/mouvement du GDD)
        if state.phase > 5:
            state.phase = 0
            await GameEngine._end_turn(state)