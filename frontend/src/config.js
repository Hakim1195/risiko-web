// Configuration du frontend pour Game Board Strategy

const config = {
  // URL de l'API backend
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  
  // URL du serveur WebSocket
  socketUrl: process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000',
  
  // Configuration de l'application
  app: {
    name: 'Game Board Strategy',
    version: '1.0.0',
    description: 'Plateforme de jeu de plateau multijoueur'
  },
  
  // Configuration des services
  services: {
    // Configuration de l'authentification
    auth: {
      tokenStorageKey: 'game-board-strategy-token',
      refreshTokenStorageKey: 'game-board-strategy-refresh-token'
    },
    
    // Configuration du WebSocket
    socket: {
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 5000
    }
  }
};

export default config;