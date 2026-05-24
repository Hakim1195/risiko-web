import { Request, Response } from 'express';
import messageService from '../services/message.service';

// Définition des types pour les requêtes
interface CreateMessageRequest {
  content: string;
  userId: number;
  roomId: number;
}

// Contrôleur de message
class MessageController {
  // Créer un nouveau message
  async createMessage(req: Request, res: Response) {
    try {
      const { content, userId, roomId }: CreateMessageRequest = req.body;

      // Validation des données
      if (!content || !userId || !roomId) {
        return res.status(400).json({ 
          message: 'Tous les champs sont requis' 
        });
      }

      // Créer le message avec le service
      const message = await messageService.createMessage(content, userId, roomId);

      res.status(201).json({
        message: 'Message créé avec succès',
        data: message
      });
    } catch (error) {
      console.error('Erreur lors de la création du message:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la création du message' 
      });
    }
  }

  // Récupérer les messages d'une salle
  async getMessagesByRoomId(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const messages = await messageService.findMessagesByRoomId(parseInt(roomId));

      res.json({
        messages,
        count: messages.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des messages' 
      });
    }
  }

  // Récupérer un message par ID
  async getMessageById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const message = await messageService.findMessageById(parseInt(id));

      if (!message) {
        return res.status(404).json({ 
          message: 'Message non trouvé' 
        });
      }

      res.json({ message });
    } catch (error) {
      console.error('Erreur lors de la récupération du message:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération du message' 
      });
    }
  }

  // Supprimer un message
  async deleteMessage(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Vérifier si le message existe
      const existingMessage = await messageService.findMessageById(parseInt(id));
      if (!existingMessage) {
        return res.status(404).json({ 
          message: 'Message non trouvé' 
        });
      }

      // Supprimer le message avec le service
      const deletedMessage = await messageService.deleteMessage(parseInt(id));

      res.json({
        message: 'Message supprimé avec succès',
        data: deletedMessage
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la suppression du message' 
      });
    }
  }
}

export default new MessageController();