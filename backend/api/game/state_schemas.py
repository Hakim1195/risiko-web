from pydantic import BaseModel
from typing import Dict, List, Optional

class PlayerState(BaseModel):
    """État d'un joueur dans la partie."""
    player_id: int
    faction: str  # Ex: "Sintetici", "Mutanti", etc. (à définir dans GDD)
    units_in_stock: int  # Unités en réserve
    status: str  # "alive" ou "eliminated"
    cards_in_hand: List[str] = []
    cards_played_this_turn: int = 0
    has_conquered_this_turn: bool = False
    strategic_moves_left: int = 0
    max_cards_playable_this_turn: int = 2  # Budget de base
    bonus_attack_dice: int = 0  # Modificateur de combat
    bonus_defense_dice: int = 0  # Modificateur de combat
    guaranteed_sixes_attack: int = 0  # Nombre de dés forcés à 6
    airborne_attacks_left: int = 0  # Attaques non adjacentes autorisées
    vampiric_attack_active: bool = False  # Inversion des pertes en attaque
    vampiric_defense_active: bool = False  # Inversion des pertes en défense
    immune_to_contamination: bool = False  # Protection environnementale

class TerritoryState(BaseModel):
    """État d'un territoire dans la partie."""
    territory_id: int  # ID du territoire (1 à 43)
    owner_id: Optional[int]  # ID du joueur propriétaire, None si neutre
    garrison: int  # Nombre de troupes en garnison
    shield_turns_left: int = 0  # Immunité aux attaques
    frozen_turns_left: int = 0  # Incapacité d'attaquer depuis ce territoire

class GameState(BaseModel):
    """État global de la partie en cours."""
    room_id: int
    players: Dict[int, PlayerState]  # Dict[player_id -> PlayerState]
    territories: Dict[int, TerritoryState]  # Dict[territory_id -> TerritoryState]
    current_turn: int  # Numéro du tour actuel (commence à 1)
    current_player_id: int  # ID du joueur dont c'est le tour
    phase: int  # Phase actuelle (0 à 5, correspondant aux 6 phases du GDD)
    contamination_zone: Dict[str, float]  # Position et probabilité de la Zone de Contamination
    # Ex: {"position": 15, "probability": 0.2} - position = ID du territoire (1-43)"""
