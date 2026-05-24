import bcrypt from 'bcryptjs';

// Utility function to hash password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Utility function to compare password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Utility function for logging
export const logger = (message: string, level: string = 'info') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
};

// Type definitions for User
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  eloRating: number;
  createdAt: Date;
  updatedAt: Date;
}

// Type definitions for Room
export interface Room {
  id: number;
  name: string;
  gameId: number;
  maxPlayers: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type definitions for Match
export interface Match {
  id: number;
  name: string;
  gameState: Record<string, any>;
  players: any[];
  status: string;
  winnerId?: number;
  startedAt: Date;
  endedAt?: Date;
  turnNumber: number;
  currentPlayerId?: number;
  createdAt: Date;
  updatedAt: Date;
}