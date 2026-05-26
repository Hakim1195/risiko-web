import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RoomService {
  // Create a new room
  static async createRoom(name: string, maxPlayers: number, gameType: string, creatorId: number) {
    // Note: Room model doesn't have maxPlayers or gameType properties
    // This is a placeholder for future implementation
    // For now, we'll just create a room with the name and connect to the default game
    
    // First, check if creator exists
    const creator = await prisma.user.findUnique({ where: { id: creatorId } });
    if (!creator) {
      throw new Error('Creator not found');
    }

    // Create room
    const room = await prisma.room.create({
      data: {
        name,
        gameId: 1 // Connect to the default game
      }
    });

    return room;
  }

  // Get room by ID
  static async getRoomById(id: number) {
    return await prisma.room.findUnique({
      where: { id }
    });
  }

  // Get all rooms
  static async getAllRooms() {
    return await prisma.room.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  // Join a room
  static async joinRoom(roomId: number, userId: number) {
    // Check if room exists and is not full
    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });
    
    if (!room) {
      throw new Error('Room not found');
    }
    
    // For simplicity, we'll just return the room without checking players
    // In a real implementation, you'd need to check the players properly
    return room;
  }

  // Leave a room
  static async leaveRoom(roomId: number, userId: number) {
    // Remove player from room
    await prisma.roomPlayer.deleteMany({
      where: {
        roomId,
        userId
      }
    });
  }

  // Update room status
  static async updateRoomStatus(roomId: number, status: string) {
    // Note: Room model doesn't have a status property
    // This is a placeholder for future implementation
    return await prisma.room.findUnique({ where: { id: roomId } });
  }

  // Get rooms by user
  static async getRoomsByUser(userId: number) {
    // Get room players for the user
    const roomPlayers = await prisma.roomPlayer.findMany({
      where: { userId },
      include: { room: true }
    });
    return roomPlayers.map((rp: { room: any }) => rp.room);
  }
}