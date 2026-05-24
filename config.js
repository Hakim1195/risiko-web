// Configuration principale de l'application Game Board Strategy

const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    apiVersion: process.env.API_VERSION || 'v1',
    nodeEnv: process.env.NODE_ENV || 'development'
  },

  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'game_board_strategy',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password'
  },

  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // Application settings
  app: {
    name: 'Game Board Strategy',
    version: '1.0.0',
    description: 'A multiplayer board game platform'
  }
};

module.exports = config;