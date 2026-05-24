import prisma from './database.service';
import { Message } from '@prisma/client';

class MessageService {
  // Créer un nouveau message
  async createMessage(content: string, userId: number, roomId: number): Promise<Message> {
    return await prisma.message.create({
      data: {
        content,
        userId,
        roomId,
      },
    });
  }

  // Trouver les messages par salle
  async findMessagesByRoomId(roomId: number): Promise<Message[]> {
    return await prisma.message.findMany({
      where: { roomId },
      include: {
        user: true,
        room: true
      }
    });
  }

  // Trouver un message par ID
  async findMessageById(id: number): Promise<Message | null> {
    return await prisma.message.findUnique({
      where: { id },
      include: {
        user: true,
        room: true
      }
    });
  }

  // Supprimer un message
  async deleteMessage(id: number): Promise<Message> {
    return await prisma.message.delete({
      where: { id },
    });
  }
}

export default new MessageService();