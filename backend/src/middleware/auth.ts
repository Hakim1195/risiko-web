import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { verifyAccessToken, verifyRefreshToken, JwtPayload } from '../utils/jwt';

const prisma = new PrismaClient();

// Rate limiting storage (in production, use Redis)
const rateLimitStore: Record<string, { count: number; resetTime: number }> = {};

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 5;

// Check rate limit
export const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const record = rateLimitStore[ip];

  if (!record || now > record.resetTime) {
    rateLimitStore[ip] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false;
  }

  record.count++;
  return true;
};

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const ip in rateLimitStore) {
    if (now > rateLimitStore[ip].resetTime) {
      delete rateLimitStore[ip];
    }
  }
}, RATE_LIMIT_WINDOW);

// Email validation regex
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins une majuscule' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins une minuscule' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins un chiffre' };
  }
  return { valid: true };
};

// User type with eloRating
interface UserWithElo {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  eloRating: number;
}

// Auth middleware with enhanced security
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token d\'authentification requis' });
    }

    const token = authHeader.substring(7);

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    // Add user info to request object
    (req as any).user = {
      id: user.id,
      username: user.username,
      email: user.email,
      eloRating: (user as UserWithElo).eloRating
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

// Refresh token middleware
export const refreshMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Token de rafraîchissement requis' });
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({ error: 'Token de rafraîchissement invalide' });
    }

    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error('Refresh middleware error:', error);
    return res.status(401).json({ error: 'Token de rafraîchissement invalide' });
  }
};

// Rate limiter middleware
export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ 
      error: 'Trop de tentatives. Veuillez réessayer plus tard.' 
    });
  }

  next();
};
