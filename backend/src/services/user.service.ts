import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/helpers';

const prisma = new PrismaClient();

export class UserService {
  // Get user by ID
  static async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  // Get user by username
  static async getUserByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username }
    });
  }

  // Get user by email
  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  // Create new user
  static async createUser(username: string, email: string, password: string) {
    const hashedPassword = await hashPassword(password);
    
    return await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });
  }

  // Update user profile
  static async updateUserProfile(userId: number, data: any) {
    return await prisma.user.update({
      where: { id: userId },
      data
    });
  }

  // Get user leaderboard stats - temporarily disabled to avoid 'leaderboard' property error
  static async getUserLeaderboardStats(userId: number) {
    // Temporarily return null to avoid the leaderboard error
    return null;
  }

  // Get all users with leaderboard stats - temporarily simplified
  static async getAllUsersWithStats() {
    return await prisma.user.findMany();
  }

  // Update user ELO rating
  static async updateUserElo(userId: number, elo: number) {
    return await prisma.user.update({
      where: { id: userId },
      data: { eloRating: elo }
    });
  }

  // Verify password
  static async verifyPassword(user: any, password: string) {
    return await comparePassword(password, user.password);
  }
}