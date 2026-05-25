// Game API service
import config from '../config';

class GameApiService {
  constructor() {
    this.baseUrl = config.API_BASE_URL;
  }

  // Create a new game
  async createGame(gameData) {
    try {
      const response = await fetch(`${this.baseUrl}/games/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  // Get game state
  async getGameState(gameId) {
    try {
      const response = await fetch(`${this.baseUrl}/games/state/${gameId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting game state:', error);
      throw error;
    }
  }

  // Place armies
  async placeArmies(gameData) {
    try {
      const response = await fetch(`${this.baseUrl}/games/place-armies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error placing armies:', error);
      throw error;
    }
  }

  // Execute attack
  async attack(gameData) {
    try {
      const response = await fetch(`${this.baseUrl}/games/attack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error executing attack:', error);
      throw error;
    }
  }

  // Move armies
  async moveArmies(gameData) {
    try {
      const response = await fetch(`${this.baseUrl}/games/move-armies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error moving armies:', error);
      throw error;
    }
  }

  // Draw card
  async drawCard(gameData) {
    try {
      const response = await fetch(`${this.baseUrl}/games/draw-card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error drawing card:', error);
      throw error;
    }
  }

  // End turn
  async endTurn(gameData) {
    try {
      const response = await fetch(`${this.baseUrl}/games/end-turn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error ending turn:', error);
      throw error;
    }
  }
}

export default new GameApiService();