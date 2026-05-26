// Frontend configuration
const config = {
  // API base URL - Use Traefik proxy URL in Docker environment
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://api.game.local/api',
  
  // WebSocket URL - Use Traefik proxy URL in Docker environment
  WS_URL: process.env.REACT_APP_WS_URL || 'ws://api.game.local',
  
  // Application settings
  APP_NAME: 'Game Board Strategy',
  VERSION: '1.0.0'
};

export default config;