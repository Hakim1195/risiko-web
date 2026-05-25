import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware, rateLimiter } from '../middleware/auth';

const router = express.Router();

// Public routes (with rate limiting)
router.post('/register', rateLimiter, AuthController.register);
router.post('/login', rateLimiter, AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/forgot-password', rateLimiter, AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Protected routes
router.get('/profile', authMiddleware, AuthController.getProfile);
router.put('/profile', authMiddleware, AuthController.updateProfile);
router.post('/logout', authMiddleware, AuthController.logout);

export default router;
