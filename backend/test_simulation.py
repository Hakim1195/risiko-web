import asyncio
from api.game.state_schemas import GameState, PlayerState, TerritoryState
from api.game.engine import GameEngine
from api.game.state_manager import GameStateManager

async def run_simulation():
    print("\n🚀 DÉBUT DE LA SIMULATION DU GAME ENGINE 🚀\n")

    room_id = 999
    p1_id, p2_id = 1, 2

    # 1. Création d'un état de jeu factice
    # On crée d'abord nos deux territoires de test
    # 1. Création d'un état de jeu factice
    fake_territories = {
        1: TerritoryState(territory_id=1, owner_id=p1_id, garrison=3), # P1 possède T1
        2: TerritoryState(territory_id=2, owner_id=p2_id, garrison=1), # P2 possède T2
        3: TerritoryState(territory_id=3, owner_id=p2_id, garrison=1), # <-- BOUCLIER DE SURVIE POUR P2
    }
    # On remplit le reste (de 4 à 43)
    for i in range(4, 44):
        fake_territories[i] = TerritoryState(territory_id=i, owner_id=None, garrison=0)

    state = GameState(
        room_id=room_id,
        current_turn=1,
        current_player_id=p1_id,
        phase=2, # Déploiement
        contamination_zone={"position": 1, "probability": 1.0}, # La zone est sur T1
        players={
            p1_id: PlayerState(player_id=p1_id, faction="Mutanti", units_in_stock=5, status="alive"),
            p2_id: PlayerState(player_id=p2_id, faction="Sintetici", units_in_stock=0, status="alive")
        },
        territories=fake_territories
    )

    # Sauvegarde dans Redis
    await GameStateManager.save_game_state(room_id, state)
    print("✅ État initial généré et sauvegardé dans Redis.")

    # 2. Test Déploiement (Phase 2)
    print(f"\n--- 🛠️ P1 déploie 2 troupes sur le Territoire 1 ---")
    await GameEngine.process_action(room_id, p1_id, "deploy_units", {"territory_id": 1, "amount": 2})
    state = await GameStateManager.get_game_state(room_id)
    print(f"Garnison de T1 : {state.territories[1].garrison} troupes (Attendu: 5)")
    print(f"Stock de P1 : {state.players[p1_id].units_in_stock} troupes (Attendu: 3)")

    # 3. Test Attaque (Phase 3)
    state.phase = 3
    await GameStateManager.save_game_state(room_id, state)
    print(f"\n--- ⚔️ P1 attaque le Territoire 2 depuis le Territoire 1 (avec 3 dés) ---")
    event = await GameEngine.process_action(room_id, p1_id, "attack_territory", {
        "attacker_territory_id": 1,
        "defender_territory_id": 2,
        "attacker_dice": 3
    })
    print(f"Dés Attaquant : {event['attacker_rolls']}")
    print(f"Dés Défenseur : {event['defender_rolls']}")
    print(f"Pertes -> Attaquant: {event['attacker_losses']} | Défenseur: {event['defender_losses']}")
    if event['conquered']:
        print("🏆 LE TERRITOIRE 2 A ÉTÉ CONQUIS PAR P1 !")

    # 4. Test Contamination (Phase 0 du Tour Global suivant)
    print(f"\n--- ☢️ SAUT TEMPOREL : Passage au Tour Global Suivant ---")
    # On force la phase à 5 pour déclencher l'auto-advance et le changement de tour
    state = await GameStateManager.get_game_state(room_id)
    state.phase = 5
    await GameStateManager.save_game_state(room_id, state)
    
    # P1 passe son tour -> C'est au tour de P2
    await GameEngine.process_action(room_id, p1_id, "pass_turn", {})
    
    # On force la phase 5 pour P2 et il passe son tour -> Nouveau Round Global (retour à P1 !)
    state = await GameStateManager.get_game_state(room_id)
    state.phase = 5
    await GameStateManager.save_game_state(room_id, state)
    await GameEngine.process_action(room_id, p2_id, "pass_turn", {})

    state = await GameStateManager.get_game_state(room_id)
    print(f"Nouveau Round Global ! La Zone Toxique s'est déplacée sur le Territoire {state.contamination_zone['position']} (Proba remise à {state.contamination_zone['probability']})")
    print("\n🏁 FIN DE LA SIMULATION 🏁")

if __name__ == '__main__':
    asyncio.run(run_simulation())