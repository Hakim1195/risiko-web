import jwt from 'jsonwebtoken';

// JWT Secret - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-token-key-change-in-production';
const ACCESS_TOKEN_EXPIRY = '24h';
const REFRESH_TOKEN_EXPIRY = '7d';

// Generate access token
export const generateAccessToken = (userId: number, username: string): string => {
  return jwt.sign(
    { id: userId, username: username },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// Generate refresh token
export const generateRefreshToken = (userId: number, username: string): string => {
  return jwt.sign(
    { id: userId, username: username },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

// Verify access token
export const verifyAccessToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

// Type definitions
export interface JwtPayload {
  id: number;
  username: string;
}
