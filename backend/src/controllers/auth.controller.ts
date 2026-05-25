import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { hashPassword, comparePassword } from '../utils/helpers';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt';
import { validateEmail, validatePassword, checkRateLimit } from '../middleware/auth';

// User type with optional fields
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  avatarUrl?: string | null;
  eloRating: number;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthController {
  // User registration with enhanced validation
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      // Validate email
      if (!validateEmail(email)) {
        return res.status(400).json({
          error: 'Email invalide'
        });
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({
          error: passwordValidation.message
        });
      }

      // Check if user already exists
      const existingUser = await UserService.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          error: 'Un utilisateur avec cet email existe déjà'
        });
      }

      // Create new user
      const user = await UserService.createUser(username, email, password);

      // Generate JWT tokens
      const accessToken = generateAccessToken(user.id, user.username);
      const refreshToken = generateRefreshToken(user.id, user.username);

      res.status(201).json({
        message: 'Inscription réussie',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          eloRating: (user as User).eloRating || 1200
        },
        accessToken,
        refreshToken
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Erreur serveur lors de l\'inscription'
      });
    }
  }

  // User login with enhanced security
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate email
      if (!validateEmail(email)) {
        return res.status(400).json({
          error: 'Email invalide'
        });
      }

      // Find user by email
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Identifiants invalides'
        });
      }

      // Verify password
      const isValidPassword = await UserService.verifyPassword(user, password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Identifiants invalides'
        });
      }

      // Generate JWT tokens
      const accessToken = generateAccessToken(user.id, user.username);
      const refreshToken = generateRefreshToken(user.id, user.username);

      res.json({
        message: 'Connexion réussie',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          eloRating: (user as User).eloRating || 1200
        },
        accessToken,
        refreshToken
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Erreur serveur lors de la connexion'
      });
    }
  }

  // Refresh access token using refresh token
  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: 'Token de rafraîchissement requis'
        });
      }

      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({
          error: 'Token de rafraîchissement invalide'
        });
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken(decoded.id, decoded.username);
      const newRefreshToken = generateRefreshToken(decoded.id, decoded.username);

      res.json({
        message: 'Token rafraîchi avec succès',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      });
    } catch (error: any) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        error: 'Erreur serveur lors du rafraîchissement du token'
      });
    }
  }

  // Get user profile
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      const user = await UserService.getUserById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé'
        });
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatarUrl: (user as User).avatarUrl || null,
          eloRating: (user as User).eloRating || 1200
        }
      });
    } catch (error: any) {
      console.error('Profile error:', error);
      res.status(500).json({
        error: 'Erreur serveur lors de la récupération du profil'
      });
    }
  }

  // Update user profile
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { username, email, avatarUrl } = req.body;

      // Check if email is already taken by another user
      if (email) {
        const existingUser = await UserService.getUserByEmail(email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({
            error: 'Cet email est déjà utilisé'
          });
        }
      }

      // Update user profile
      const updatedUser = await UserService.updateUserProfile(userId, {
        username,
        email,
        avatarUrl
      });

      res.json({
        message: 'Profil mis à jour avec succès',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          avatarUrl: (updatedUser as User).avatarUrl || null,
          eloRating: (updatedUser as User).eloRating || 1200
        }
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      res.status(500).json({
        error: 'Erreur serveur lors de la mise à jour du profil'
      });
    }
  }

  // Logout - invalidate token (in production, add to blacklist)
  static async logout(req: Request, res: Response) {
    try {
      // In a real implementation, you would add the token to a blacklist
      // For now, just return success
      res.json({
        message: 'Déconnexion réussie'
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Erreur serveur lors de la déconnexion'
      });
    }
  }

  // Request password reset
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!validateEmail(email)) {
        return res.status(400).json({
          error: 'Email invalide'
        });
      }

      const user = await UserService.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({
          message: 'Si l\'email existe, un lien de réinitialisation a été envoyé'
        });
      }

      // Generate reset token (in production, send email with token)
      const resetToken = generateAccessToken(user.id, user.username);

      res.json({
        message: 'Si l\'email existe, un lien de réinitialisation a été envoyé',
        resetToken // For development only
      });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        error: 'Erreur serveur lors de la demande de réinitialisation'
      });
    }
  }

  // Reset password
  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      // Verify token
      const decoded = verifyAccessToken(token);
      if (!decoded) {
        return res.status(400).json({
          error: 'Token invalide'
        });
      }

      // Validate new password
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return res.status(400).json({
          error: passwordValidation.message
        });
      }

      // Update password
      const hashedPassword = await hashPassword(newPassword);
      await UserService.updateUserProfile(decoded.id, {
        password: hashedPassword
      });

      res.json({
        message: 'Mot de passe réinitialisé avec succès'
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      res.status(500).json({
        error: 'Erreur serveur lors de la réinitialisation du mot de passe'
      });
    }
  }
}
