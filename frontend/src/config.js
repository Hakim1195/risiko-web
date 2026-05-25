// Frontend configuration
const config = {
  // API base URL
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
  
  // WebSocket URL
  WS_URL: process.env.REACT_APP_WS_URL || 'ws://localhost:3000',
  
  // Application settings
  APP_NAME: 'Game Board Strategy',
  VERSION: '1.0.0'
};

export default config;