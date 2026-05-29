import asyncio
from typing import Dict, Any
from backend.api.game.state_manager import GameStateManager
from backend.api.game.state_schemas import GameState
from backend.api.game.map_constants import CONTINENTS


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
            "deploy_units": GameEngine._handle_deploy_units,
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
    async def _calculate_reinforcements(state: GameState):
        """
        Calculate reinforcements for the current player based on:
        1. Number of territories owned (territories // 3, floor)
        2. Continent bonuses (if 100% control of a continent)
        """
        current_player = state.players[state.current_player_id]
        
        # Count territories owned by current player
        owned_territories = 0
        for territory_id, territory in state.territories.items():
            if territory.owner_id == state.current_player_id:
                owned_territories += 1
        
        # Base reinforcement calculation: territories // 3 (floor)
        base_reinforcements = owned_territories // 3
        
        # Check continent bonuses
        continent_bonus = 0
        for continent_name, continent_data in CONTINENTS.items():
            # Check if player controls all territories in this continent
            continent_territories = set(continent_data["territory_ids"])
            player_territories = set()
            for territory_id, territory in state.territories.items():
                if territory.owner_id == state.current_player_id and territory_id in continent_territories:
                    player_territories.add(territory_id)
            
            # If player controls all territories in continent, add bonus
            if player_territories == continent_territories:
                continent_bonus += continent_data["bonus"]
        
        # Total reinforcements = base + continent bonuses
        total_reinforcements = base_reinforcements + continent_bonus
        
        # Add to player's stock
        current_player.units_in_stock += total_reinforcements
        
        return total_reinforcements
    
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
        
        # Phase 1: Attribution des Renforts - Calculate reinforcements
        if state.phase == 1:
            await GameEngine._calculate_reinforcements(state)
    
    @staticmethod
    async def _handle_deploy_units(state: GameState, payload: dict) -> dict:
        """
        Handle the deploy units action (Phase 2).
        
        Validates:
        - Game is in Phase 2
        - Amount > 0
        - Territory belongs to current player
        - Player has enough units in stock
        
        Updates:
        - Subtracts amount from player's units_in_stock
        - Adds amount to territory's garrison
        
        Returns: Event with units_deployed type
        """
        # Extract parameters from payload
        territory_id = payload.get("territory_id")
        amount = payload.get("amount")
        
        # Validate game phase
        if state.phase != 2:
            raise ValueError("Le déploiement ne peut se faire que pendant la Phase 2")
        
        # Validate amount
        if amount is None or amount <= 0:
            raise ValueError("La quantité d'unités à déployer doit être supérieure à 0")
        
        # Validate territory ownership
        if territory_id not in state.territories:
            raise ValueError(f"Territoire {territory_id} inconnu")
        
        if state.territories[territory_id].owner_id != state.current_player_id:
            raise ValueError(f"Vous ne contrôlez pas le territoire {territory_id}")
        
        # Validate units in stock
        current_player = state.players[state.current_player_id]
        if current_player.units_in_stock < amount:
            raise ValueError(f"Vous n'avez pas assez d'unités en stock (disponibles: {current_player.units_in_stock}, demandées: {amount})")
        
        # Apply deployment
        current_player.units_in_stock -= amount
        state.territories[territory_id].garrison += amount
        
        # Return event
        return {
            "event_type": "units_deployed",
            "territory_id": territory_id,
            "amount": amount
        }