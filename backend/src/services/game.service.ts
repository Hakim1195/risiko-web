import prisma from './database.service';
import { Game } from '@prisma/client';

class GameService {
  // Créer un nouveau jeu
  async createGame(name: string, description?: string, userId?: number): Promise<Game> {
    const data: any = {
      name,
      description,
    };
    
    if (userId !== undefined) {
      data.userId = userId;
    }
    
    return await prisma.game.create({
      data,
    });
  }

  // Trouver un jeu par ID
  async findGameById(id: number): Promise<Game | null> {
    return await prisma.game.findUnique({
      where: { id },
    });
  }

  // Trouver tous les jeux
  async findAllGames(): Promise<Game[]> {
    return await prisma.game.findMany();
  }

  // Trouver les jeux par utilisateur
  async findGamesByUserId(userId: number): Promise<Game[]> {
    return await prisma.game.findMany({
      where: { userId },
    });
  }

  // Mettre à jour un jeu
  async updateGame(id: number, data: Partial<Game>): Promise<Game> {
    return await prisma.game.update({
      where: { id },
      data,
    });
  }

  // Supprimer un jeu
  async deleteGame(id: number): Promise<Game> {
    return await prisma.game.delete({
      where: { id },
    });
  }
  
  // Méthodes spécifiques pour le jeu Risiko!
  // Créer un plateau de jeu avec territoires et continents
  async createGameBoard(gameId: number) {
    // Données des territoires et continents selon les règles de Risiko!
    const territories = [
      // Amérique du Nord
      { id: 'alaska', name: 'Alaska', continent: 'amerique_du_nord', armies: 0, owner: null },
      { id: 'groenland', name: 'Groenland', continent: 'amerique_du_nord', armies: 0, owner: null },
      { id: 'amazonie', name: 'Amazone', continent: 'amerique_du_nord', armies: 0, owner: null },
      { id: 'ouest_canada', name: 'Ouest Canada', continent: 'amerique_du_nord', armies: 0, owner: null },
      { id: 'est_canada', name: 'Est Canada', continent: 'amerique_du_nord', armies: 0, owner: null },
      { id: 'sud_est_usa', name: 'Sud-Est USA', continent: 'amerique_du_nord', armies: 0, owner: null },
      { id: 'sud_ouest_usa', name: 'Sud-Ouest USA', continent: 'amerique_du_nord', armies: 0, owner: null },
      { id: 'nord_est_usa', name: 'Nord-Est USA', continent: 'amerique_du_nord', armies: 0, owner: null },
      { id: 'nord_ouest_usa', name: 'Nord-Ouest USA', continent: 'amerique_du_nord', armies: 0, owner: null },
      
      // Amérique du Sud
      { id: 'venezuela', name: 'Venezuela', continent: 'amerique_du_sud', armies: 0, owner: null },
      { id: 'guiana', name: 'Guyane', continent: 'amerique_du_sud', armies: 0, owner: null },
      { id: 'brasil', name: 'Brésil', continent: 'amerique_du_sud', armies: 0, owner: null },
      { id: 'argentine', name: 'Argentine', continent: 'amerique_du_sud', armies: 0, owner: null },
      
      // Europe
      { id: 'islande', name: 'Islande', continent: 'europe', armies: 0, owner: null },
      { id: 'grande_bretagne', name: 'Grande Bretagne', continent: 'europe', armies: 0, owner: null },
      { id: 'europe_nord', name: 'Europe Nord', continent: 'europe', armies: 0, owner: null },
      { id: 'europe_sud', name: 'Europe Sud', continent: 'europe', armies: 0, owner: null },
      { id: 'espagne_portugal', name: 'Espagne/Portugal', continent: 'europe', armies: 0, owner: null },
      { id: 'italie', name: 'Italie', continent: 'europe', armies: 0, owner: null },
      { id: 'france', name: 'France', continent: 'europe', armies: 0, owner: null },
      
      // Afrique
      { id: 'maroc', name: 'Maroc', continent: 'afrique', armies: 0, owner: null },
      { id: 'egypte', name: 'Égypte', continent: 'afrique', armies: 0, owner: null },
      { id: 'soudan', name: 'Soudan', continent: 'afrique', armies: 0, owner: null },
      { id: 'afrique_est', name: 'Afrique Est', continent: 'afrique', armies: 0, owner: null },
      { id: 'afrique_sud', name: 'Afrique Sud', continent: 'afrique', armies: 0, owner: null },
      { id: 'madagascar', name: 'Madagascar', continent: 'afrique', armies: 0, owner: null },
      
      // Asie
      { id: 'sibérie', name: 'Sibérie', continent: 'asie', armies: 0, owner: null },
      { id: 'yakoutie', name: 'Yakoutie', continent: 'asie', armies: 0, owner: null },
      { id: 'mongolie', name: 'Mongolie', continent: 'asie', armies: 0, owner: null },
      { id: 'chine', name: 'Chine', continent: 'asie', armies: 0, owner: null },
      { id: 'siam', name: 'Siam', continent: 'asie', armies: 0, owner: null },
      { id: 'indochine', name: 'Indochine', continent: 'asie', armies: 0, owner: null },
      { id: 'japon', name: 'Japon', continent: 'asie', armies: 0, owner: null },
      { id: 'ouest_siberie', name: 'Ouest Sibérie', continent: 'asie', armies: 0, owner: null },
      { id: 'afghanistan', name: 'Afghanistan', continent: 'asie', armies: 0, owner: null },
      { id: 'kamchatka', name: 'Kamchatka', continent: 'asie', armies: 0, owner: null },
      { id: 'tchita', name: 'Tchita', continent: 'asie', armies: 0, owner: null },
      { id: 'irkutsk', name: 'Irkutsk', continent: 'asie', armies: 0, owner: null },
      
      // Océanie
      { id: 'australie', name: 'Australie', continent: 'oceanie', armies: 0, owner: null },
      { id: 'nouvelle_guinee', name: 'Nouvelle-Guinée', continent: 'oceanie', armies: 0, owner: null },
      { id: 'indonesie', name: 'Indonésie', continent: 'oceanie', armies: 0, owner: null },
      { id: 'papouasie', name: 'Papouasie', continent: 'oceanie', armies: 0, owner: null },
    ];
    
    // Données des continents
    const continents = [
      { id: 'amerique_du_nord', name: 'Amérique du Nord', bonusArmies: 5, territories: ['alaska', 'groenland', 'amazonie', 'ouest_canada', 'est_canada', 'sud_est_usa', 'sud_ouest_usa', 'nord_est_usa', 'nord_ouest_usa'] },
      { id: 'amerique_du_sud', name: 'Amérique du Sud', bonusArmies: 2, territories: ['venezuela', 'guiana', 'brasil', 'argentine'] },
      { id: 'europe', name: 'Europe', bonusArmies: 5, territories: ['islande', 'grande_bretagne', 'europe_nord', 'europe_sud', 'espagne_portugal', 'italie', 'france'] },
      { id: 'afrique', name: 'Afrique', bonusArmies: 3, territories: ['maroc', 'egypte', 'soudan', 'afrique_est', 'afrique_sud', 'madagascar'] },
      { id: 'asie', name: 'Asie', bonusArmies: 7, territories: ['sibérie', 'yakoutie', 'mongolie', 'chine', 'siam', 'indochine', 'japon', 'ouest_siberie', 'afghanistan', 'kamchatka', 'tchita', 'irkutsk'] },
      { id: 'oceanie', name: 'Océanie', bonusArmies: 2, territories: ['australie', 'nouvelle_guinee', 'indonesie', 'papouasie'] }
    ];
    
    // Créer le plateau de jeu
    const gameBoard = {
      territories,
      continents,
      gameId
    };
    
    return gameBoard;
  }
  
  // Distribuer les territoires aux joueurs
  async distributeTerritories(gameId: number, players: any[]) {
    // Pour l'instant, on simule une distribution simple
    // En réalité, cela devrait être plus complexe selon les règles
    const territories = [
      'alaska', 'groenland', 'amazonie', 'ouest_canada', 'est_canada',
      'sud_est_usa', 'sud_ouest_usa', 'nord_est_usa', 'nord_ouest_usa',
      'venezuela', 'guiana', 'brasil', 'argentine',
      'islande', 'grande_bretagne', 'europe_nord', 'europe_sud',
      'espagne_portugal', 'italie', 'france',
      'maroc', 'egypte', 'soudan', 'afrique_est', 'afrique_sud', 'madagascar',
      'sibérie', 'yakoutie', 'mongolie', 'chine', 'siam', 'indochine', 'japon',
      'ouest_siberie', 'afghanistan', 'kamchatka', 'tchita', 'irkutsk',
      'australie', 'nouvelle_guinee', 'indonesie', 'papouasie'
    ];
    
    // Mélange aléatoire des territoires
    const shuffledTerritories = [...territories].sort(() => Math.random() - 0.5);
    
    // Distribution des territoires aux joueurs
    const distribution = players.map(player => ({
      playerId: player.id,
      territories: [] as string[]
    }));
    
    // Distribuer les territoires un par un
    shuffledTerritories.forEach((territory, index) => {
      const playerIndex = index % players.length;
      distribution[playerIndex].territories.push(territory);
    });
    
    return distribution;
  }
  
  // Calculer les renforts pour un joueur
  async calculateReinforcements(playerId: number, territoriesCount: number, continentsControlled: string[], hasJolly: boolean = false) {
    // Bonus de territoires : nombre total de territoires / 3 (arrondi inférieur)
    let baseReinforcements = Math.floor(territoriesCount / 3);
    
    // Minimum de 3 renforts
    if (baseReinforcements < 3) {
      baseReinforcements = 3;
    }
    
    // Bonus de continents
    let continentBonus = 0;
    const continentBonuses: { [key: string]: number } = {
      'asie': 7,
      'amerique_du_nord': 5,
      'europe': 5,
      'afrique': 3,
      'amerique_du_sud': 2,
      'oceanie': 2
    };
    
    continentsControlled.forEach(continent => {
      if (continentBonuses[continent]) {
        continentBonus += continentBonuses[continent];
      }
    });
    
    // Combinaisons de cartes (simplifié pour l'instant)
    let cardBonus = 0;
    
    return baseReinforcements + continentBonus + cardBonus;
  }
  
  // Simuler un combat entre deux joueurs
  async simulateBattle(attackerPlayerId: number, defenderPlayerId: number, attackingTerritory: string, defendingTerritory: string, attackingArmies: number, defendingArmies: number) {
    // Vérifier les conditions d'attaque
    if (attackingArmies < 2) {
      throw new Error('Il faut au moins 2 armées pour attaquer');
    }
    
    // Calculer le nombre de dés à lancer
    const attackerDice = Math.min(attackingArmies - 1, 3); // Laisser au moins 1 armée
    const defenderDice = Math.min(defendingArmies, 3);
    
    // Lancer les dés
    const attackerRolls = Array.from({ length: attackerDice }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);
    const defenderRolls = Array.from({ length: defenderDice }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => b - a);
    
    // Calculer les pertes
    let attackerLosses = 0;
    let defenderLosses = 0;
    
    const maxRolls = Math.min(attackerDice, defenderDice);
    for (let i = 0; i < maxRolls; i++) {
      if (attackerRolls[i] > defenderRolls[i]) {
        defenderLosses++; // Défenseur perd une armée
      } else {
        attackerLosses++; // Attaquant perd une armée
      }
    }
    
    // Mettre à jour les armées
    const newAttackingArmies = attackingArmies - attackerLosses;
    const newDefendingArmies = defendingArmies - defenderLosses;
    
    // Vérifier si le territoire a été conquis
    let conquered = false;
    let movedArmies = 0;
    
    if (newDefendingArmies <= 0) {
      conquered = true;
      movedArmies = attackerDice; // Le nombre de dés lancés lors de la dernière attaque
    }
    
    return {
      attackerLosses,
      defenderLosses,
      newAttackingArmies,
      newDefendingArmies,
      conquered,
      movedArmies
    };
  }
  
  // Méthode pour vérifier si un joueur a gagné
  async checkWinCondition(gameState: any, playerId: number): Promise<boolean> {
    // Vérifier si le joueur a atteint son objectif secret
    // Pour l'instant, on vérifie simplement la conquête de tous les territoires
    // En réalité, cela dépend des objectifs spécifiques
    const playerTerritories = gameState.territories.filter((t: any) => t.owner === playerId);
    return playerTerritories.length === 42; // Tous les territoires
  }
  
  // Méthode pour vérifier si un joueur a gagné par objectif
  async checkObjectiveWinCondition(gameState: any, playerId: number, objective: string): Promise<boolean> {
    // Implémentation simplifiée - en réalité, cela dépend de l'objectif spécifique
    switch(objective) {
      case 'conquer_all_territories':
        return gameState.territories.filter((t: any) => t.owner === playerId).length === 42;
      case 'conquer_continent':
        // Vérifier si le joueur contrôle un continent entier
        return false; // À implémenter selon les règles
      case 'destroy_color':
        // Vérifier si le joueur a détruit une couleur spécifique
        return false; // À implémenter selon les règles
      default:
        return false;
    }
  }
  
  // Méthode pour créer les cartes territoires
  async createTerritoryCards() {
    const territoryCards = [
      // 12 Canons
      ...Array(12).fill({ type: 'cannon', symbol: 'Cannone' }),
      // 14 Fantassins
      ...Array(14).fill({ type: 'infantry', symbol: 'Fante' }),
      // 12 Cavaliers
      ...Array(12).fill({ type: 'cavalry', symbol: 'Cavaliere' }),
      // 2 Jolly
      ...Array(2).fill({ type: 'jolly', symbol: 'Jolly' })
    ];
    
    // Mélanger les cartes
    return territoryCards.sort(() => Math.random() - 0.5);
  }
  
  // Méthode pour échanger des cartes
  async exchangeCards(playerId: number, cardCombination: string[], gameState: any): Promise<number> {
    // Vérifier la combinaison de cartes
    let armies = 0;
    
    switch(cardCombination.length) {
      case 3:
        // Vérifier les combinaisons valides
        if (cardCombination.every(c => c === 'cannon')) {
          armies = 4; // 3 Canons = 4 armées
        } else if (cardCombination.every(c => c === 'infantry')) {
          armies = 6; // 3 Fantassins = 6 armées
        } else if (cardCombination.every(c => c === 'cavalry')) {
          armies = 8; // 3 Cavaliers = 8 armées
        } else if (cardCombination.includes('jolly') && cardCombination.filter(c => c !== 'jolly').length === 2 &&
                   cardCombination.filter(c => c !== 'jolly')[0] === cardCombination.filter(c => c !== 'jolly')[1]) {
          armies = 12; // 1 Jolly + 2 cartes identiques = 12 armées
        } else if (cardCombination.includes('jolly') && cardCombination.filter(c => c !== 'jolly').length === 2) {
          // 1 Jolly + 2 cartes différentes = 10 armées
          armies = 10;
        } else {
          // Combinaison mixte
          armies = 10;
        }
        break;
      default:
        throw new Error('Combinaison de cartes invalide');
    }
    
    // Vérifier si le joueur contrôle les territoires concernés
    // Pour simplifier, on ne vérifie pas les territoires ici
    
    return armies;
  }
  
  // Méthode pour vérifier si un territoire est adjacent à un autre
  async isAdjacent(territory1: string, territory2: string, gameState: any): Promise<boolean> {
    // Pour simplifier, on utilise une liste prédéfinie d'adjacences
    const adjacencyList: { [key: string]: string[] } = {
      'alaska': ['ouest_canada', 'nord_ouest_usa', 'kamchatka'],
      'ouest_canada': ['alaska', 'nord_ouest_usa', 'est_canada', 'groenland'],
      'nord_ouest_usa': ['alaska', 'ouest_canada', 'sud_ouest_usa', 'nord_est_usa'],
      'sud_ouest_usa': ['nord_ouest_usa', 'sud_est_usa', 'nord_est_usa'],
      'sud_est_usa': ['sud_ouest_usa', 'nord_est_usa', 'est_canada'],
      'est_canada': ['ouest_canada', 'sud_est_usa', 'groenland'],
      'groenland': ['ouest_canada', 'est_canada', 'islande', 'france'],
      'amazonie': ['venezuela', 'guiana', 'brasil'],
      'guiana': ['amazonie', 'brasil'],
      'venezuela': ['amazonie', 'brasil', 'sud_est_usa'],
      'brasil': ['amazonie', 'guiana', 'venezuela', 'argentine'],
      'argentine': ['brasil', 'chile'],
      'islande': ['groenland', 'france', 'grande_bretagne'],
      'grande_bretagne': ['islande', 'france', 'espagne_portugal'],
      'france': ['groenland', 'grande_bretagne', 'espagne_portugal', 'italie'],
      'espagne_portugal': ['france', 'italie', 'grande_bretagne'],
      'italie': ['france', 'espagne_portugal', 'afghanistan', 'sibérie'],
      'europe_nord': ['france', 'europe_sud', 'grande_bretagne'],
      'europe_sud': ['france', 'europe_nord', 'afghanistan'],
      'maroc': ['egypte', 'soudan', 'afrique_sud'],
      'egypte': ['maroc', 'soudan', 'afrique_est'],
      'soudan': ['maroc', 'egypte', 'afrique_est', 'afrique_sud'],
      'afrique_est': ['egypte', 'soudan', 'afrique_sud'],
      'afrique_sud': ['maroc', 'soudan', 'afrique_est', 'madagascar'],
      'madagascar': ['afrique_sud', 'afrique_est'],
      'sibérie': ['afghanistan', 'mongolie', 'yakoutie', 'ouest_siberie', 'irkutsk', 'tchita'],
      'yakoutie': ['sibérie', 'mongolie', 'kamchatka'],
      'mongolie': ['sibérie', 'yakoutie', 'chine', 'afghanistan'],
      'chine': ['mongolie', 'afghanistan', 'indochine', 'siam'],
      'siam': ['chine', 'indochine', 'indonesie'],
      'indochine': ['siam', 'indonesie', 'chine'],
      'japon': ['kamchatka', 'sibérie'],
      'ouest_siberie': ['sibérie', 'afghanistan', 'kamchatka'],
      'afghanistan': ['italie', 'sibérie', 'mongolie', 'chine', 'europe_sud', 'irak'],
      'kamchatka': ['yakoutie', 'japon', 'ouest_siberie', 'alaska'],
      'tchita': ['sibérie', 'irkutsk'],
      'irkutsk': ['sibérie', 'tchita', 'kamchatka'],
      'australie': ['indonesie', 'papouasie', 'nouvelle_guinee'],
      'nouvelle_guinee': ['australie', 'papouasie', 'indonesie'],
      'indonesie': ['siam', 'indochine', 'nouvelle_guinee', 'australie'],
      'papouasie': ['nouvelle_guinee', 'australie']
    };
    
    return adjacencyList[territory1]?.includes(territory2) || false;
  }
  
  // Méthode pour vérifier si un joueur peut attaquer
  async canAttack(playerId: number, fromTerritory: string, toTerritory: string, gameState: any): Promise<boolean> {
    // Vérifier que le territoire d'attaque appartient au joueur
    const attackingTerritory = gameState.territories.find((t: any) => t.id === fromTerritory);
    if (!attackingTerritory || attackingTerritory.owner !== playerId) {
      return false;
    }
    
    // Vérifier qu'il y a au moins 2 armées sur le territoire d'attaque
    if (attackingTerritory.armies < 2) {
      return false;
    }
    
    // Vérifier que le territoire cible appartient à un adversaire
    const defendingTerritory = gameState.territories.find((t: any) => t.id === toTerritory);
    if (!defendingTerritory || defendingTerritory.owner === playerId) {
      return false;
    }
    
    // Vérifier que les territoires sont adjacents
    return await this.isAdjacent(fromTerritory, toTerritory, gameState);
  }
  
  // Méthode pour vérifier si un joueur peut se déplacer
  async canFortify(playerId: number, fromTerritory: string, toTerritory: string, gameState: any): Promise<boolean> {
    // Vérifier que le territoire d'origine appartient au joueur
    const sourceTerritory = gameState.territories.find((t: any) => t.id === fromTerritory);
    if (!sourceTerritory || sourceTerritory.owner !== playerId) {
      return false;
    }
    
    // Vérifier que le territoire de destination appartient au joueur
    const targetTerritory = gameState.territories.find((t: any) => t.id === toTerritory);
    if (!targetTerritory || targetTerritory.owner !== playerId) {
      return false;
    }
    
    // Vérifier que les territoires sont adjacents
    return await this.isAdjacent(fromTerritory, toTerritory, gameState);
  }
  
  // Méthode pour vérifier si un joueur peut piocher une carte
  async canDrawCard(playerId: number, gameState: any): Promise<boolean> {
    // Vérifier si le joueur a conquis au moins un territoire ce tour
    // Pour simplifier, on suppose que c'est le cas si le joueur a attaqué
    return true; // À implémenter selon le vrai état du jeu
  }
  
  // Méthode pour gérer la phase de renforts
  async handleReinforcementPhase(playerId: number, gameState: any): Promise<any> {
    // Calculer les renforts disponibles
    const playerTerritories = gameState.territories.filter((t: any) => t.owner === playerId);
    const territoriesCount = playerTerritories.length;
    
    // Bonus de territoires
    let baseReinforcements = Math.floor(territoriesCount / 3);
    if (baseReinforcements < 3) {
      baseReinforcements = 3;
    }
    
    // Bonus de continents
    let continentBonus = 0;
    const continentBonuses: { [key: string]: number } = {
      'asie': 7,
      'amerique_du_nord': 5,
      'europe': 5,
      'afrique': 3,
      'amerique_du_sud': 2,
      'oceanie': 2
    };
    
    // Vérifier quels continents sont contrôlés
    const controlledContinents = gameState.continents.filter((c: any) => {
      const continentTerritories = c.territories.filter((t: string) =>
        playerTerritories.some((pt: any) => pt.id === t)
      );
      return continentTerritories.length === c.territories.length;
    });
    
    controlledContinents.forEach((continent: any) => {
      continentBonus += continent.bonusArmies;
    });
    
    const totalReinforcements = baseReinforcements + continentBonus;
    
    return {
      reinforcements: totalReinforcements,
      territories: playerTerritories,
      continents: controlledContinents
    };
  }
  
  // Méthode pour gérer la phase d'attaque
  async handleAttackPhase(playerId: number, fromTerritory: string, toTerritory: string, armies: number, gameState: any): Promise<any> {
    // Vérifier si l'attaque est valide
    const canAttack = await this.canAttack(playerId, fromTerritory, toTerritory, gameState);
    if (!canAttack) {
      throw new Error('Attaque invalide');
    }
    
    // Récupérer les territoires
    const attackingTerritory = gameState.territories.find((t: any) => t.id === fromTerritory);
    const defendingTerritory = gameState.territories.find((t: any) => t.id === toTerritory);
    
    // Simuler le combat
    const battleResult = await this.simulateBattle(
      playerId,
      defendingTerritory.owner,
      fromTerritory,
      toTerritory,
      armies,
      defendingTerritory.armies
    );
    
    // Mettre à jour l'état du jeu
    const updatedTerritories = gameState.territories.map((t: any) => {
      if (t.id === fromTerritory) {
        return { ...t, armies: battleResult.newAttackingArmies };
      }
      if (t.id === toTerritory) {
        return { ...t, armies: battleResult.newDefendingArmies };
      }
      return t;
    });
    
    // Si le territoire est conquis
    if (battleResult.conquered) {
      // Changer le propriétaire du territoire
      const updatedTerritoriesWithConquest = updatedTerritories.map((t: any) => {
        if (t.id === toTerritory) {
          return { ...t, owner: playerId, armies: battleResult.movedArmies };
        }
        return t;
      });
      
      return {
        ...gameState,
        territories: updatedTerritoriesWithConquest,
        battleResult
      };
    }
    
    return {
      ...gameState,
      territories: updatedTerritories,
      battleResult
    };
  }
  
  // Méthode pour gérer la phase de fortification
  async handleFortifyPhase(playerId: number, fromTerritory: string, toTerritory: string, armies: number, gameState: any): Promise<any> {
    // Vérifier si le déplacement est valide
    const canFortify = await this.canFortify(playerId, fromTerritory, toTerritory, gameState);
    if (!canFortify) {
      throw new Error('Déplacement invalide');
    }
    
    // Récupérer les territoires
    const sourceTerritory = gameState.territories.find((t: any) => t.id === fromTerritory);
    const targetTerritory = gameState.territories.find((t: any) => t.id === toTerritory);
    
    // Vérifier qu'il y a suffisamment d'armées
    if (sourceTerritory.armies <= armies) {
      throw new Error('Pas assez d\'armées pour se déplacer');
    }
    
    // Mettre à jour l'état du jeu
    const updatedTerritories = gameState.territories.map((t: any) => {
      if (t.id === fromTerritory) {
        return { ...t, armies: t.armies - armies };
      }
      if (t.id === toTerritory) {
        return { ...t, armies: t.armies + armies };
      }
      return t;
    });
    
    return {
      ...gameState,
      territories: updatedTerritories
    };
  }
  
  // Méthode pour gérer la phase de pioche de carte
  async handleCardDrawPhase(playerId: number, gameState: any): Promise<any> {
    // Vérifier si le joueur peut piocher une carte
    const canDraw = await this.canDrawCard(playerId, gameState);
    if (!canDraw) {
      throw new Error('Impossible de piocher une carte');
    }
    
    // Pour l'instant, on ne fait rien de spécifique
    // En réalité, cela impliquerait de piocher une carte du paquet
    
    return gameState;
  }
  
  // Méthode pour gérer la fin du tour
  async endTurn(gameState: any, currentPlayerId: number, nextPlayerId: number): Promise<any> {
    // Mettre à jour le joueur actuel
    return {
      ...gameState,
      currentPlayerId: nextPlayerId,
      turnNumber: gameState.turnNumber + 1
    };
  }
  
  // Méthode pour initialiser une partie Risk
  async initializeGame(players: any[], numberOfPlayers: number): Promise<any> {
    // Créer le plateau de jeu
    const gameBoard = await this.createGameBoard(1); // ID temporaire
    
    // Distribuer les territoires aux joueurs
    const territoryDistribution = await this.distributeTerritories(1, players);
    
    // Créer les cartes territoires
    const territoryCards = await this.createTerritoryCards();
    
    // Initialiser les territoires avec les joueurs
    const territoriesWithPlayers = gameBoard.territories.map((territory: any) => {
      // Trouver le joueur qui a ce territoire
      const distribution = territoryDistribution.find((dist: any) =>
        dist.territories.includes(territory.id)
      );
      
      if (distribution) {
        return {
          ...territory,
          owner: distribution.playerId,
          armies: 1 // Chaque territoire commence avec 1 armée
        };
      }
      
      return territory;
    });
    
    // Calculer les renforts initiaux selon le nombre de joueurs
    let initialArmies = 0;
    switch(numberOfPlayers) {
      case 3: initialArmies = 35; break;
      case 4: initialArmies = 30; break;
      case 5: initialArmies = 25; break;
      case 6: initialArmies = 20; break;
      default: initialArmies = 30;
    }
    
    // Distribuer les renforts initiaux
    const updatedTerritories = territoriesWithPlayers.map((territory: any) => {
      if (territory.owner !== null) {
        // Chaque joueur reçoit ses renforts initiaux
        return {
          ...territory,
          armies: territory.armies + Math.floor(initialArmies / numberOfPlayers)
        };
      }
      return territory;
    });
    
    // Créer l'état initial du jeu
    const gameState = {
      territories: updatedTerritories,
      continents: gameBoard.continents,
      players: players,
      currentPlayerId: players[0].id, // Le premier joueur commence
      turnNumber: 1,
      deck: territoryCards,
      phase: 'reinforcement', // Phase initiale
      conqueredTerritories: [] as string[], // Territoires conquis durant le tour
      lastAction: null // Dernière action effectuée
    };
    
    return gameState;
  }
  
  // Méthode pour gérer l'élimination d'un joueur
  async handlePlayerElimination(gameState: any, eliminatedPlayerId: number): Promise<any> {
    // Retirer le joueur éliminé de la liste des joueurs
    const updatedPlayers = gameState.players.filter((player: any) => player.id !== eliminatedPlayerId);
    
    // Transférer toutes les cartes du joueur éliminé aux autres joueurs
    // Pour simplifier, on ne fait rien ici
    
    // Mettre à jour l'état du jeu
    return {
      ...gameState,
      players: updatedPlayers
    };
  }
}

export default new GameService();