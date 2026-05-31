import asyncio
import random
from typing import Dict, Any
from api.game.state_manager import GameStateManager
from api.game.state_schemas import GameState
from api.game.map_constants import CONTINENTS, ADJACENCY
# Potentiellement à supprimer
from api.game.state_schemas import GameState, PlayerState, TerritoryState

class GameEngine:
    """Game Engine for processing player actions and managing game state."""
    
    @staticmethod
    async def process_action(room_id: int, player_id: int, action_type: str, payload: dict) -> dict:
        """
        Process a player action and update the game state accordingly.
        """
        # INTERCEPTION CRUCIALE : Si l'action est d'initialiser, on crée le monde directement
        if action_type == "init_game":
            return await GameEngine._handle_init_game(room_id, payload)
            
        # Pour toutes les autres actions, on récupère l'état du jeu actuel
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
            "play_card": GameEngine._handle_play_card,
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
    async def _handle_init_game(room_id: int, payload: dict) -> dict:
        """
        Génère le plateau de jeu initial selon les règles du GDD.
        """
        # Configuration standard pour un test à 3 joueurs (IDs 1, 2, 3)
        player_ids = [1, 2, 3]
        initial_troops = 35  # GDD : 35 unités pour 3 joueurs
        
        # Création des profils des joueurs
        players = {}
        factions_disponibles = ["Sintetici", "Mutanti", "Coloni", "Rettiliani", "Predoni"]
        
        for i, pid in enumerate(player_ids):
            players[pid] = PlayerState(
                player_id=pid,
                faction=factions_disponibles[i % len(factions_disponibles)],
                status="alive",
                units_in_stock=initial_troops,
                cards_in_hand=[],
                strategic_moves_left=1,
                has_conquered_this_turn=False,
                airborne_attacks_left=0,
                cards_played_this_turn=0
            )
            
        # Distribution aléatoire des 43 territoires
        territories = {}
        shuffled_t_ids = list(range(1, 44))
        random.shuffle(shuffled_t_ids)
        
        for i, t_id in enumerate(shuffled_t_ids):
            owner = player_ids[i % len(player_ids)]
            territories[t_id] = TerritoryState(
                territory_id=t_id,
                owner_id=owner,
                garrison=1,  # GDD : 1 unité posée par défaut (Garnison minimum)
                shield_turns_left=0,
                frozen_turns_left=0
            )
            # On déduit l'unité déployée du stock privé du joueur
            players[owner].units_in_stock -= 1
            
        # GDD : Bonus de compensation (bonus_compensation)
        # Puisque 43 territoires % 3 joueurs = 1, le Joueur 1 a reçu un territoire de plus.
        # Les joueurs 2 et 3 reçoivent donc 1 troupe gratuite dans leur stock.
        for i in range(43 % len(player_ids), len(player_ids)):
            players[player_ids[i]].units_in_stock += 1
            
        # Création de l'état initial
        state = GameState(
            room_id=room_id,
            phase=1,
            current_turn=1,
            current_player_id=1,  # Le Joueur 1 commence
            players=players,
            territories=territories,
            contamination_zone={}
        )
        
        # Simulation du début du Tour 1 : On calcule les renforts et on passe en Phase de Déploiement
        await GameEngine._calculate_reinforcements(state)
        state.phase = 2
        
        # Sauvegarde officielle dans Redis
        await GameStateManager.save_game_state(room_id, state)
        
        return {
            "event_type": "game_initialized",
            "room_id": room_id,
            "message": "Le Wasteland a été généré avec succès ! 43 territoires distribués."
        }

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
        outgoing_player = state.players[state.current_player_id]
        outgoing_player.bonus_attack_dice = 0
        outgoing_player.bonus_defense_dice = 0
        outgoing_player.guaranteed_sixes_attack = 0
        outgoing_player.airborne_attacks_left = 0
        outgoing_player.vampiric_attack_active = False
        outgoing_player.vampiric_defense_active = False
        outgoing_player.immune_to_contamination = False
        outgoing_player.cards_played_this_turn = 0
        
        # Extraire et trier les ID de joueurs de manière sécurisée
        player_ids = sorted(list(state.players.keys()))
        current_index = player_ids.index(state.current_player_id)
        
        # Trouver le prochain joueur encore en vie
        for _ in range(len(player_ids)):
            current_index = (current_index + 1) % len(player_ids)
            next_player_id = player_ids[current_index]
            
            if state.players[next_player_id].status == "alive":
                # Check if this is a new Global Round
                is_new_global_round = player_ids.index(next_player_id) <= player_ids.index(state.current_player_id)
                
                # 1. TRANSFERT DU TOUR (Changement officiel de joueur)
                state.current_player_id = next_player_id
                state.current_turn += 1
                state.players[next_player_id].has_conquered_this_turn = False
                state.players[next_player_id].strategic_moves_left = 1
                
                # 2. PHASE 0 : CONTAMINATION
                # A. Déplacement de la zone (Uniquement au nouveau round global)
                if is_new_global_round:
                    if not state.contamination_zone:
                        state.contamination_zone = {"position": random.randint(1, 43), "probability": 0.2}
                    else:
                        if random.random() < state.contamination_zone["probability"]:
                            state.contamination_zone["position"] = random.randint(1, 43)
                            state.contamination_zone["probability"] = 0.2
                        else:
                            state.contamination_zone["probability"] = min(1.0, state.contamination_zone["probability"] + 0.2)
                
                # B. Dégâts de la zone (Pour CHAQUE joueur qui commence son tour)
                if state.contamination_zone:
                    territory = state.territories[state.contamination_zone["position"]]
                    incoming_player = state.players[next_player_id]
                    if territory.owner_id == next_player_id and not incoming_player.immune_to_contamination:
                        territory.garrison = max(1, territory.garrison - 2)
                
                # 3. AUTO-ADVANCE VERS PHASE 1 (Renforts)
                state.phase = 1
                await GameEngine._calculate_reinforcements(state)
                
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
    async def _draw_card_for_current_player(state: GameState):
        """
        Draw a card for the current player during Phase 5 (Event Cards).
        """
        current_player = state.players[state.current_player_id]
        
        # Check if player has less than 5 cards in hand
        if len(current_player.cards_in_hand) < 5:
            # Define loot table with card weights
            loot_table = {
                "card_renfort_3": 60,
                "card_shield_1": 30,
                "card_airborne_1": 10
            }
            
            # Draw a card based on weights
            drawn_card = random.choices(
                list(loot_table.keys()),
                weights=list(loot_table.values())
            )[0]
            
            # Add the drawn card to the player's hand
            current_player.cards_in_hand.append(drawn_card)
    
    @staticmethod
    async def _advance_phase(state: GameState):
        """
        Advance to the next phase, and end the turn if we've completed all phases.
        """
        state.phase += 1
        
        # If phase reaches 5 (Event Cards phase)
        if state.phase == 5:
            # Draw a card for the current player
            await GameEngine._draw_card_for_current_player(state)
            # Reset phase to 0
            state.phase = 0
            # End the turn
            await GameEngine._end_turn(state)
        # Si la phase dépasse 5 (fin de la phase d'attaque/mouvement du GDD)
        elif state.phase > 5:
            state.phase = 0
            await GameEngine._end_turn(state)
        
        # Phase 1: Attribution des Renforts - Calculate reinforcements
        if state.phase == 1:
            await GameEngine._calculate_reinforcements(state)
    
    @staticmethod
    async def _handle_deploy_units(state: GameState, payload: dict) -> dict:
        """
        Handle the deploy units action (Phase 2).
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

    @staticmethod
    async def _handle_play_card(state: GameState, payload: dict) -> dict:
        """
        Handle the play card action (Phase 2 and 3).
        """
        # Validate game phase (can only play cards during active phases)
        if state.phase not in [1, 2, 3, 4]:
            raise ValueError("Les cartes ne peuvent être jouées que pendant les phases actives (1, 2, 3, ou 4)")
        
        # Validate that player hasn't played too many cards this turn
        current_player = state.players[state.current_player_id]
        if current_player.cards_played_this_turn >= 2:
            raise ValueError("Vous avez déjà joué 2 cartes ce tour")
        
        # Extract card ID from payload
        card_id = payload.get("card_id")
        if not card_id:
            raise ValueError("L'ID de la carte est requis")
        
        # Validate that player owns the card
        if card_id not in current_player.cards_in_hand:
            raise ValueError(f"Vous ne possédez pas la carte {card_id}")
        
        # Route to appropriate card handler
        card_handlers = {
            "card_renfort_3": GameEngine._play_card_renfort_3,
            "card_shield_1": GameEngine._play_card_shield_1,
            "card_airborne_1": GameEngine._play_card_airborne_1,
        }
        
        if card_id not in card_handlers:
            raise ValueError(f"Type de carte non supporté: {card_id}")
        
        # Call the appropriate handler
        handler = card_handlers[card_id]
        event = await handler(state, current_player, payload)
        
        # Remove card from player's hand
        current_player.cards_in_hand.remove(card_id)
        
        # Increment cards played this turn
        current_player.cards_played_this_turn += 1
        
        return event

    @staticmethod
    async def _play_card_renfort_3(state: GameState, player: Any, payload: dict) -> dict:
        """
        Play a Renforts Immédiats card (adds 3 units to player's stock immediately).
        """
        # Add 3 units to player's stock
        player.units_in_stock += 3
        
        return {
            "event_type": "card_played",
            "card_id": "card_renfort_3",
            "player_id": player.player_id,
            "units_added": 3
        }

    @staticmethod
    async def _play_card_shield_1(state: GameState, player: Any, payload: dict) -> dict:
        """
        Play a Bouclier Énergétique card (protects a territory from attacks for 1 turn).
        Requires target_territory_id in payload.
        """
        # Extract target territory ID from payload
        target_territory_id = payload.get("target_territory_id")
        if not target_territory_id:
            raise ValueError("L'ID du territoire cible est requis pour la carte Bouclier Énergétique")
        
        # Validate that the territory belongs to the player
        if state.territories[target_territory_id].owner_id != player.player_id:
            raise ValueError("Vous ne contrôlez pas le territoire cible")
        
        # Apply shield to the territory
        state.territories[target_territory_id].shield_turns_left = 1
        
        return {
            "event_type": "card_played",
            "card_id": "card_shield_1",
            "player_id": player.player_id,
            "target_territory_id": target_territory_id
        }

    @staticmethod
    async def _play_card_airborne_1(state: GameState, player: Any, payload: dict) -> dict:
        """
        Play a Frappe Nucléaire Tactique card (allows one non-adjacent attack in Phase 3).
        """
        # Add 1 to airborne attacks left for the player
        player.airborne_attacks_left += 1
        
        return {
            "event_type": "card_played",
            "card_id": "card_airborne_1",
            "player_id": player.player_id,
            "airborne_attacks_added": 1
        }