import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MatchService {
  // Create a new match
  static async createMatch(name: string, players: any[], gameId: number) {
    try {
      return await prisma.match.create({
        data: {
          name,
          gameState: {},
          players,
          status: 'waiting',
          gameId
        }
      });
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  }

  // Get match by ID
  static async getMatchById(id: number) {
    try {
      return await prisma.match.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error('Error getting match:', error);
      throw error;
    }
  }

  // Update match state
  static async updateMatchState(matchId: number, gameState: any) {
    try {
      return await prisma.match.update({
        where: { id: matchId },
        data: {
          gameState,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error updating match state:', error);
      throw error;
    }
  }

  // Update match status
  static async updateMatchStatus(matchId: number, status: string) {
    try {
      return await prisma.match.update({
        where: { id: matchId },
        data: {
          status,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error updating match status:', error);
      throw error;
    }
  }

  // Start a match
  static async startMatch(matchId: number) {
    try {
      return await prisma.match.update({
        where: { id: matchId },
        data: {
          status: 'in_progress',
          startedAt: new Date(),
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error starting match:', error);
      throw error;
    }
  }

  // End a match
  static async endMatch(matchId: number, winnerId?: number) {
    try {
      return await prisma.match.update({
        where: { id: matchId },
        data: {
          status: 'finished',
          winnerId,
          endedAt: new Date(),
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error ending match:', error);
      throw error;
    }
  }

  // Get all matches
  static async getAllMatches() {
    try {
      return await prisma.match.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error getting all matches:', error);
      throw error;
    }
  }

  // Get matches by user
  static async getMatchesByUser(userId: number) {
    try {
      return await prisma.match.findMany({
        where: {
          playersRef: {
            some: {
              id: userId
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error getting matches by user:', error);
      throw error;
    }
  }

  // Record match result
  static async recordMatchResult(matchId: number, playerId: number, result: string, eloChange?: number) {
    try {
      return await prisma.matchHistory.create({
        data: {
          matchId,
          playerId,
          result,
          eloChange
        }
      });
    } catch (error) {
      console.error('Error recording match result:', error);
      throw error;
    }
  }

  // Get match history
  static async getMatchHistory(matchId: number) {
    try {
      return await prisma.matchHistory.findMany({
        where: { matchId },
        include: {
          player: true
        },
        orderBy: {
          playedAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error getting match history:', error);
      throw error;
    }
  }
}