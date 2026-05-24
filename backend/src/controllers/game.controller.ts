import { Request, Response } from 'express';
import gameService from '../services/game.service';

// Définition des types pour les requêtes
interface CreateGameRequest {
  name: string;
  description?: string;
}

interface UpdateGameRequest {
  name?: string;
  description?: string;
}

// Contrôleur de jeu
class GameController {
  // Créer un nouveau jeu
  async createGame(req: Request, res: Response) {
    try {
      const { name, description }: CreateGameRequest = req.body;
      const userId = (req as any).user?.id; // Assuming user ID is attached by auth middleware

      // Validation des données
      if (!name) {
        return res.status(400).json({ 
          message: 'Le nom du jeu est requis' 
        });
      }

      // Créer le jeu avec le service
      const game = await gameService.createGame(name, description, userId);

      res.status(201).json({
        message: 'Jeu créé avec succès',
        game
      });
    } catch (error) {
      console.error('Erreur lors de la création du jeu:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la création du jeu' 
      });
    }
  }

  // Récupérer tous les jeux
  async getAllGames(req: Request, res: Response) {
    try {
      const games = await gameService.findAllGames();

      res.json({
        games,
        count: games.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des jeux:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des jeux' 
      });
    }
  }

  // Récupérer un jeu par ID
  async getGameById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const game = await gameService.findGameById(parseInt(id));

      if (!game) {
        return res.status(404).json({ 
          message: 'Jeu non trouvé' 
        });
      }

      res.json({ game });
    } catch (error) {
      console.error('Erreur lors de la récupération du jeu:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération du jeu' 
      });
    }
  }

  // Mettre à jour un jeu
  async updateGame(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description }: UpdateGameRequest = req.body;

      // Validation des données
      if (!name && !description) {
        return res.status(400).json({ 
          message: 'Au moins un champ à mettre à jour est requis' 
        });
      }

      // Vérifier si le jeu existe
      const existingGame = await gameService.findGameById(parseInt(id));
      if (!existingGame) {
        return res.status(404).json({ 
          message: 'Jeu non trouvé' 
        });
      }

      // Mettre à jour le jeu avec le service
      const updatedGame = await gameService.updateGame(parseInt(id), { name, description });

      res.json({
        message: 'Jeu mis à jour avec succès',
        game: updatedGame
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du jeu:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la mise à jour du jeu' 
      });
    }
  }

  // Supprimer un jeu
  async deleteGame(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Vérifier si le jeu existe
      const existingGame = await gameService.findGameById(parseInt(id));
      if (!existingGame) {
        return res.status(404).json({ 
          message: 'Jeu non trouvé' 
        });
      }

      // Supprimer le jeu avec le service
      const deletedGame = await gameService.deleteGame(parseInt(id));

      res.json({
        message: 'Jeu supprimé avec succès',
        game: deletedGame
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du jeu:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la suppression du jeu' 
      });
    }
  }
  
  // Créer un plateau de jeu pour Risiko!
  async createGameBoard(req: Request, res: Response) {
    try {
      const { gameId } = req.params;
      
      // Vérifier si le jeu existe
      const existingGame = await gameService.findGameById(parseInt(gameId));
      if (!existingGame) {
        return res.status(404).json({ 
          message: 'Jeu non trouvé' 
        });
      }
      
      // Créer le plateau de jeu avec les méthodes du service
      const gameBoard = await gameService.createGameBoard(parseInt(gameId));
      
      res.json({
        message: 'Plateau de jeu créé avec succès',
        gameBoard
      });
    } catch (error) {
      console.error('Erreur lors de la création du plateau de jeu:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la création du plateau de jeu' 
      });
    }
  }
  
  // Distribuer les territoires aux joueurs
  async distributeTerritories(req: Request, res: Response) {
    try {
      const { gameId } = req.params;
      const { players } = req.body;
      
      // Vérifier si le jeu existe
      const existingGame = await gameService.findGameById(parseInt(gameId));
      if (!existingGame) {
        return res.status(404).json({ 
          message: 'Jeu non trouvé' 
        });
      }
      
      // Distribuer les territoires aux joueurs
      const distribution = await gameService.distributeTerritories(parseInt(gameId), players);
      
      res.json({
        message: 'Territoires distribués avec succès',
        distribution
      });
    } catch (error) {
      console.error('Erreur lors de la distribution des territoires:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la distribution des territoires' 
      });
    }
  }
  
  // Calculer les renforts pour un joueur
  async calculateReinforcements(req: Request, res: Response) {
    try {
      const { playerId, territoriesCount, continentsControlled, hasJolly } = req.body;
      
      // Calculer les renforts
      const reinforcements = await gameService.calculateReinforcements(
        playerId, 
        territoriesCount, 
        continentsControlled, 
        hasJolly
      );
      
      res.json({
        message: 'Renforts calculés avec succès',
        reinforcements
      });
    } catch (error) {
      console.error('Erreur lors du calcul des renforts:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors du calcul des renforts' 
      });
    }
  }
  
  // Simuler un combat entre deux joueurs
  async simulateBattle(req: Request, res: Response) {
    try {
      const { attackerPlayerId, defenderPlayerId, attackingTerritory, defendingTerritory, attackingArmies, defendingArmies } = req.body;
      
      // Simuler le combat
      const battleResult = await gameService.simulateBattle(
        attackerPlayerId,
        defenderPlayerId,
        attackingTerritory,
        defendingTerritory,
        attackingArmies,
        defendingArmies
      );
      
      res.json({
        message: 'Combat simulé avec succès',
        battleResult
      });
    } catch (error) {
      console.error('Erreur lors de la simulation du combat:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la simulation du combat' 
      });
    }
  }
}

export default new GameController();