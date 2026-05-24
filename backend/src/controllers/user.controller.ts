import { Request, Response } from 'express';
import userService from '../services/user.service';

// Définition des types pour les requêtes
interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

interface UpdateUserRequest {
  username?: string;
  email?: string;
}

// Contrôleur d'utilisateur
class UserController {
  // Créer un nouvel utilisateur
  async createUser(req: Request, res: Response) {
    try {
      const { username, email, password }: CreateUserRequest = req.body;

      // Validation des données
      if (!username || !email || !password) {
        return res.status(400).json({ 
          message: 'Tous les champs sont requis' 
        });
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Cet email est déjà utilisé' 
        });
      }

      // Créer l'utilisateur avec le service
      const user = await userService.createUser(username, email, password);

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la création de l\'utilisateur' 
      });
    }
  }

  // Récupérer un utilisateur par ID
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.findUserById(parseInt(id));

      if (!user) {
        return res.status(404).json({ 
          message: 'Utilisateur non trouvé' 
        });
      }

      res.json({ user });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération de l\'utilisateur' 
      });
    }
  }

  // Récupérer tous les utilisateurs
  async getAllUsers(req: Request, res: Response) {
    try {
      // Pour l'instant, on ne va pas implémenter cette fonctionnalité
      // car cela pourrait exposer trop d'informations sensibles
      // Si nécessaire, on pourrait ajouter une logique de pagination ou de filtrage
      res.status(501).json({ 
        message: 'Cette fonctionnalité n\'est pas encore implémentée' 
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des utilisateurs' 
      });
    }
  }

  // Mettre à jour un utilisateur
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { username, email }: UpdateUserRequest = req.body;

      // Validation des données
      if (!username && !email) {
        return res.status(400).json({ 
          message: 'Au moins un champ à mettre à jour est requis' 
        });
      }

      // Vérifier si l'utilisateur existe
      const existingUser = await userService.findUserById(parseInt(id));
      if (!existingUser) {
        return res.status(404).json({ 
          message: 'Utilisateur non trouvé' 
        });
      }

      // Mettre à jour l'utilisateur avec le service
      const updatedUser = await userService.updateUser(parseInt(id), { username, email });

      res.json({
        message: 'Utilisateur mis à jour avec succès',
        user: updatedUser
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la mise à jour de l\'utilisateur' 
      });
    }
  }

  // Supprimer un utilisateur
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Vérifier si l'utilisateur existe
      const existingUser = await userService.findUserById(parseInt(id));
      if (!existingUser) {
        return res.status(404).json({ 
          message: 'Utilisateur non trouvé' 
        });
      }

      // Supprimer l'utilisateur avec le service
      const deletedUser = await userService.deleteUser(parseInt(id));

      res.json({
        message: 'Utilisateur supprimé avec succès',
        user: deletedUser
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la suppression de l\'utilisateur' 
      });
    }
  }
}

export default new UserController();