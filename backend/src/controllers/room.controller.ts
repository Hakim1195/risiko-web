import { Request, Response } from 'express';
import { RoomService } from '../services/room.service';
import { MatchService } from '../services/match.service';

export class RoomController {
  // Create a new room
  static async createRoom(req: Request, res: Response) {
    try {
      const { name, maxPlayers, gameType } = req.body;
      const userId = (req as any).user.id;

      // Create room
      const room = await RoomService.createRoom(name, maxPlayers || 4, gameType || 'risk', userId);
      
      res.status(201).json({
        message: 'Room created successfully',
        room
      });
    } catch (error: any) {
      console.error('Room creation error:', error);
      res.status(500).json({
        error: 'Internal server error creating room'
      });
    }
  }

  // Get all rooms
  static async getAllRooms(req: Request, res: Response) {
    try {
      const rooms = await RoomService.getAllRooms();
      res.json({ rooms });
    } catch (error: any) {
      console.error('Get rooms error:', error);
      res.status(500).json({
        error: 'Internal server error retrieving rooms'
      });
    }
  }

  // Get room by ID
  static async getRoomById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const room = await RoomService.getRoomById(parseInt(id));
      
      if (!room) {
        return res.status(404).json({
          error: 'Room not found'
        });
      }
      
      res.json({ room });
    } catch (error: any) {
      console.error('Get room error:', error);
      res.status(500).json({
        error: 'Internal server error retrieving room'
      });
    }
  }

  // Join a room
  static async joinRoom(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      const room = await RoomService.joinRoom(parseInt(id), userId);
      
      res.json({
        message: 'Successfully joined room',
        room
      });
    } catch (error: any) {
      console.error('Join room error:', error);
      if (error.message === 'Room is full') {
        return res.status(400).json({
          error: 'Room is full'
        });
      }
      res.status(500).json({
        error: 'Internal server error joining room'
      });
    }
  }

  // Leave a room
  static async leaveRoom(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      await RoomService.leaveRoom(parseInt(id), userId);
      
      res.json({
        message: 'Successfully left room'
      });
    } catch (error: any) {
      console.error('Leave room error:', error);
      res.status(500).json({
        error: 'Internal server error leaving room'
      });
    }
  }

  // Start a game in a room
  static async startGame(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Check if user is in the room and is the creator
      const room = await RoomService.getRoomById(parseInt(id));
      if (!room) {
        return res.status(404).json({
          error: 'Room not found'
        });
      }
      
      // In a real implementation, we would check if user is the room creator
      // For now, we'll just allow any user to start the game
      
      // Create match for the room (simplified approach)
      const players = [
        { id: userId, username: 'Player1', color: '#FF0000' } // This would be properly populated in a real implementation
      ];
      
      const match = await MatchService.createMatch(
        `Match in ${room.name}`,
        players,
        room.gameId || 1
      );
      
      // Update room status
      await RoomService.updateRoomStatus(parseInt(id), 'in_progress');
      
      res.json({
        message: 'Game started successfully',
        match,
        room
      });
    } catch (error: any) {
      console.error('Start game error:', error);
      res.status(500).json({
        error: 'Internal server error starting game'
      });
    }
  }
}