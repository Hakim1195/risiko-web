import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { hashPassword, comparePassword } from '../utils/helpers';
import jwt from 'jsonwebtoken';

export class AuthController {
  // User registration
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await UserService.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          error: 'User with this email already exists'
        });
      }

      // Create new user
      const user = await UserService.createUser(username, email, password);

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'default_secret_key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Internal server error during registration'
      });
    }
  }

  // User login
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // Verify password
      const isValidPassword = await UserService.verifyPassword(user, password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'default_secret_key',
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          eloRating: (user as any).eloRating || 1200
        },
        token
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Internal server error during login'
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
          error: 'User not found'
        });
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatarUrl: (user as any).avatarUrl || null,
          eloRating: (user as any).eloRating || 1200
        }
      });
    } catch (error: any) {
      console.error('Profile error:', error);
      res.status(500).json({
        error: 'Internal server error retrieving profile'
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
            error: 'Email already in use'
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
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          avatarUrl: (updatedUser as any).avatarUrl || null,
          eloRating: (updatedUser as any).eloRating || 1200
        }
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      res.status(500).json({
        error: 'Internal server error updating profile'
      });
    }
  }
}