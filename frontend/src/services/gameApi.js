// Game API service
import config from '../config';

class GameApiService {
  constructor() {
    this.baseUrl = config.API_BASE_URL;
  }

  // Create a new game
  async createGame(gameData) {
    try {
      console.log('Attempting to create game at:', `${this.baseUrl}/games/create`);
      const response = await fetch(`${this.baseUrl}/games/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Game created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  // Get game state
  async getGameState(gameId) {
    try {
      console.log('Attempting to get game state for:', gameId);
      const response = await fetch(`${this.baseUrl}/games/state/${gameId}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Game state retrieved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error getting game state:', error);
      throw error;
    }
  }

  // Place armies
  async placeArmies(gameData) {
    try {
      console.log('Attempting to place armies at:', `${this.baseUrl}/games/place-armies`);
      const response = await fetch(`${this.baseUrl}/games/place-armies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Armies placed successfully:', data);
      return data;
    } catch (error) {
      console.error('Error placing armies:', error);
      throw error;
    }
  }

  // Execute attack
  async attack(gameData) {
    try {
      console.log('Attempting to execute attack at:', `${this.baseUrl}/games/attack`);
      const response = await fetch(`${this.baseUrl}/games/attack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Attack executed successfully:', data);
      return data;
    } catch (error) {
      console.error('Error executing attack:', error);
      throw error;
    }
  }

  // Move armies
  async moveArmies(gameData) {
    try {
      console.log('Attempting to move armies at:', `${this.baseUrl}/games/move-armies`);
      const response = await fetch(`${this.baseUrl}/games/move-armies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Armies moved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error moving armies:', error);
      throw error;
    }
  }

  // Draw card
  async drawCard(gameData) {
    try {
      console.log('Attempting to draw card at:', `${this.baseUrl}/games/draw-card`);
      const response = await fetch(`${this.baseUrl}/games/draw-card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Card drawn successfully:', data);
      return data;
    } catch (error) {
      console.error('Error drawing card:', error);
      throw error;
    }
  }

  // End turn
  async endTurn(gameData) {
    try {
      console.log('Attempting to end turn at:', `${this.baseUrl}/games/end-turn`);
      const response = await fetch(`${this.baseUrl}/games/end-turn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData)
      });
      
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Turn ended successfully:', data);
      return data;
    } catch (error) {
      console.error('Error ending turn:', error);
      throw error;
    }
  }
}

export default new GameApiService();