import asyncio
import random
from typing import Dict, Any
from backend.api.game.state_manager import GameStateManager
from backend.api.game.state_schemas import GameState
from backend.api.game.map_constants import CONTINENTS, ADJACENCY


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
            "attack_territory": GameEngine._handle_attack,
            "move_units": GameEngine._handle_move_units,
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
        # Manage effect timers (decrement turns left for shields and frozen status)
        for territory in state.territories.values():
            if territory.shield_turns_left > 0:
                territory.shield_turns_left -= 1
            if territory.frozen_turns_left > 0:
                territory.frozen_turns_left -= 1
        
        # Reset temporary modifiers for the player who just finished their turn
        current_player = state.players[state.current_player_id]
        current_player.bonus_attack_dice = 0
        current_player.bonus_defense_dice = 0
        current_player.guaranteed_sixes_attack = 0
        current_player.airborne_attacks_left = 0
        current_player.vampiric_attack_active = False
        current_player.vampiric_defense_active = False
        current_player.immune_to_contamination = False
        
        # Reset cards played this turn for the player who just finished
        current_player.cards_played_this_turn = 0
        
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
                # Reset the conquered flag for the next player
                state.players[next_player_id].has_conquered_this_turn = False
                # Reset strategic moves budget for next player
                state.players[next_player_id].strategic_moves_left = 1
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
    
    @staticmethod
    async def _handle_attack(state: GameState, payload: dict) -> dict:
        """
        Handle the attack territory action (Phase 3).
        
        Validates:
        - Game is in Phase 3
        - Territories are adjacent
        - Attacker owns the attacking territory
        - Defender doesn't own the defending territory
        - Attacker has enough units (at least 2, 1 must remain)
        - Valid number of dice (1-3)
        
        Executes combat and updates game state accordingly.
        """
        # Extract parameters from payload
        attacker_territory_id = payload.get("attacker_territory_id")
        defender_territory_id = payload.get("defender_territory_id")
        attacker_dice = payload.get("attacker_dice")
        
        # Validate game phase
        if state.phase != 3:
            raise ValueError("Les attaques ne peuvent se faire que pendant la Phase 3")
        
        # Check if airborne attack is allowed
        current_player = state.players[state.current_player_id]
        is_adjacent = defender_territory_id in ADJACENCY.get(attacker_territory_id, [])
        
        # If airborne attacks are available, allow non-adjacent attacks
        if not is_adjacent and current_player.airborne_attacks_left > 0:
            # This is an airborne attack, consume the attack
            current_player.airborne_attacks_left -= 1
        elif not is_adjacent:
            raise ValueError(f"Les territoires {attacker_territory_id} et {defender_territory_id} ne sont pas adjacents")

        # Validate that the defender's territory is not shielded
        if state.territories[defender_territory_id].shield_turns_left > 0:
            raise ValueError(f"Le territoire {defender_territory_id} est protégé par un bouclier !")
        
        # Validate that the attacker's territory is not frozen
        if state.territories[attacker_territory_id].frozen_turns_left > 0:
            raise ValueError("Ce territoire est gelé et ne peut pas agir")
        
        # Validate attacker owns the attacking territory
        if state.territories[attacker_territory_id].owner_id != state.current_player_id:
            raise ValueError(f"Vous ne contrôlez pas le territoire attaquant {attacker_territory_id}")
        
        # Validate defender doesn't own the defending territory
        if state.territories[defender_territory_id].owner_id == state.current_player_id:
            raise ValueError(f"Vous ne pouvez pas attaquer votre propre territoire {defender_territory_id}")
        
        # Validate attacker has enough units (at least 2, 1 must remain)
        attacker_garrison = state.territories[attacker_territory_id].garrison
        if attacker_garrison <= 1:
            raise ValueError(f"Le territoire attaquant {attacker_territory_id} doit avoir au moins 2 unités")
        
        # Validate valid number of dice
        if attacker_dice not in [1, 2, 3]:
            raise ValueError("Le nombre de dés attaquants doit être 1, 2 ou 3")
        
        # Validate attacker has enough units for the dice count
        if attacker_garrison <= attacker_dice:
            raise ValueError(f"Le territoire attaquant {attacker_territory_id} n'a pas assez d'unités pour l'attaque")
        
        # Calculate defender dice (max 3, but limited by garrison)
        defender_garrison = state.territories[defender_territory_id].garrison
        defender_dice = min(3, defender_garrison)
        
        # Roll dice for both sides
        attacker_rolls = sorted([random.randint(1, 6) for _ in range(attacker_dice)], reverse=True)
        defender_rolls = sorted([random.randint(1, 6) for _ in range(defender_dice)], reverse=True)
        
        # Compare dice (highest vs highest, etc.)
        attacker_losses = 0
        defender_losses = 0
        min_dice = min(len(attacker_rolls), len(defender_rolls))
        
        for i in range(min_dice):
            if attacker_rolls[i] > defender_rolls[i]:
                defender_losses += 1
            else:  # Defender wins on tie
                attacker_losses += 1
        
        # Apply losses to garrisons
        state.territories[attacker_territory_id].garrison -= attacker_losses
        state.territories[defender_territory_id].garrison -= defender_losses
        
        # Check if defender territory is conquered
        conquered = False
        if state.territories[defender_territory_id].garrison <= 0:
            conquered = True
            
            # SAUVEGARDE CRITIQUE : Garder l'ID du défenseur en mémoire avant écrasement
            original_defender_id = state.territories[defender_territory_id].owner_id
            
            # Transfer ownership
            state.territories[defender_territory_id].owner_id = state.current_player_id
            # Move attacker's units to the conquered territory
            state.territories[defender_territory_id].garrison = attacker_dice
            # Remove attacker's units from the attacking territory
            state.territories[attacker_territory_id].garrison -= attacker_dice
            # Mark that the player has conquered a territory this turn
            state.players[state.current_player_id].has_conquered_this_turn = True
            
            # Check if original defender has any territories left
            defender_has_territories = False
            for territory in state.territories.values():
                if territory.owner_id == original_defender_id:
                    defender_has_territories = True
                    break
            
            if not defender_has_territories:
                # Defender eliminated
                state.players[original_defender_id].status = "eliminated"
        
        # Return event with combat results
       return {
           "event_type": "attack_result",
           "attacker_territory_id": attacker_territory_id,
           "defender_territory_id": defender_territory_id,
           "attacker_dice": attacker_dice,
           "defender_dice": defender_dice,
           "attacker_rolls": attacker_rolls,
           "defender_rolls": defender_rolls,
           "attacker_losses": attacker_losses,
           "defender_losses": defender_losses,
           "conquered": conquered,
           "new_attacker_garrison": state.territories[attacker_territory_id].garrison,
           "new_defender_garrison": state.territories[defender_territory_id].garrison
       }
   
   @staticmethod
   async def _handle_move_units(state: GameState, payload: dict) -> dict:
       """
       Handle the move units action (Phase 4 - Strategic Movement).
       
       Validates:
       - Game is in Phase 4
       - Player has moves left
       - Amount > 0
       - Target territory is adjacent to source territory
       - Player owns both territories
       - Source territory has enough units (at least 1 must remain)
       
       Updates:
       - Subtracts amount from source territory
       - Adds amount to target territory
       - Decrements strategic moves budget
       - If budget reaches 0, advances to next phase
       
       Returns: Event with units_moved type
       """
       # Extract parameters from payload
       source_territory_id = payload.get("source_territory_id")
       target_territory_id = payload.get("target_territory_id")
       amount = payload.get("amount")
       
       # Validate game phase
       if state.phase != 4:
           raise ValueError("Les mouvements ne peuvent se faire que pendant la Phase 4")
       
       # Validate player has moves left
       current_player = state.players[state.current_player_id]
       if current_player.strategic_moves_left <= 0:
           raise ValueError("Plus de mouvements disponibles")
       
       # Validate amount
       if amount is None or amount <= 0:
           raise ValueError("La quantité d'unités à déplacer doit être supérieure à 0")
       
       # Validate target territory is adjacent to source territory
       if target_territory_id not in ADJACENCY.get(source_territory_id, []):
           raise ValueError(f"Les territoires {source_territory_id} et {target_territory_id} ne sont pas adjacents")
       
       # Validate that the source territory is not frozen
       if state.territories[source_territory_id].frozen_turns_left > 0:
           raise ValueError("Ce territoire est gelé et ne peut pas agir")
       
       # Validate player owns both territories
       if state.territories[source_territory_id].owner_id != state.current_player_id:
           raise ValueError(f"Vous ne contrôlez pas le territoire source {source_territory_id}")
       
       if state.territories[target_territory_id].owner_id != state.current_player_id:
           raise ValueError(f"Vous ne contrôlez pas le territoire cible {target_territory_id}")
       
       # Validate source territory has enough units (at least 1 must remain)
       source_garrison = state.territories[source_territory_id].garrison
       if source_garrison <= amount:
           raise ValueError(f"Le territoire source {source_territory_id} n'a pas assez d'unités pour le déplacement")
       
       # Apply movement
       state.territories[source_territory_id].garrison -= amount
       state.territories[target_territory_id].garrison += amount
       
       # Decrement strategic moves budget
       current_player.strategic_moves_left -= 1
       
       # If no moves left, advance to next phase
       if current_player.strategic_moves_left == 0:
           await GameEngine._advance_phase(state)
       
       # Return event
       return {
           "event_type": "units_moved",
           "source_territory_id": source_territory_id,
           "target_territory_id": target_territory_id,
           "amount": amount
       }