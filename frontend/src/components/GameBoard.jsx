import React, { useState, useEffect } from 'react';
import './GameBoard.css';

const GameBoard = ({ gameId, playerId }) => {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for territories (in a real app, this would come from the backend)
  const mockTerritories = [
    { id: 'ALASKA', name: 'Alaska', continent: 'NORTH_AMERICA', armies: 3, owner: 'player1' },
    { id: 'NORTHWEST_TERRITORY', name: 'Territoire du Nord-Ouest', continent: 'NORTH_AMERICA', armies: 2, owner: 'player2' },
    { id: 'GREENLAND', name: 'Groenland', continent: 'NORTH_AMERICA', armies: 1, owner: 'player1' },
    { id: 'ONTARIO', name: 'Ontario', continent: 'NORTH_AMERICA', armies: 4, owner: 'player1' },
    { id: 'QUEBEC', name: 'Québec', continent: 'NORTH_AMERICA', armies: 2, owner: 'player2' },
    { id: 'ALBERTA', name: 'Alberta', continent: 'NORTH_AMERICA', armies: 3, owner: 'player1' },
    { id: 'WESTERN_UNITED_STATES', name: 'États-Unis Occidentaux', continent: 'NORTH_AMERICA', armies: 1, owner: 'player2' },
    { id: 'EASTERN_UNITED_STATES', name: 'États-Unis Orientaux', continent: 'NORTH_AMERICA', armies: 2, owner: 'player1' },
    { id: 'MEXICO', name: 'Mexique', continent: 'NORTH_AMERICA', armies: 3, owner: 'player2' },
    { id: 'AFGHANISTAN', name: 'Afghanistan', continent: 'ASIA', armies: 2, owner: 'player1' },
    { id: 'CHINA', name: 'Chine', continent: 'ASIA', armies: 4, owner: 'player2' },
    { id: 'INDIA', name: 'Inde', continent: 'ASIA', armies: 1, owner: 'player1' },
    { id: 'MIDDLE_EAST', name: 'Moyen-Orient', continent: 'ASIA', armies: 3, owner: 'player2' },
    { id: 'MONGOLIA', name: 'Mongolie', continent: 'ASIA', armies: 2, owner: 'player1' },
    { id: 'SIBERIA', name: 'Sibérie', continent: 'ASIA', armies: 4, owner: 'player2' },
    { id: 'URAL', name: 'Ural', continent: 'ASIA', armies: 1, owner: 'player1' },
    { id: 'KAMCHATKA', name: 'Kamchatka', continent: 'ASIA', armies: 3, owner: 'player2' },
    { id: 'SIAM', name: 'Siam', continent: 'ASIA', armies: 2, owner: 'player1' },
    { id: 'THAILAND', name: 'Thaïlande', continent: 'ASIA', armies: 1, owner: 'player2' },
    { id: 'INDONESIA', name: 'Indonésie', continent: 'ASIA', armies: 3, owner: 'player1' },
    { id: 'ICELAND', name: 'Islande', continent: 'EUROPE', armies: 2, owner: 'player2' },
    { id: 'SCANDINAVIA', name: 'Scandinavie', continent: 'EUROPE', armies: 1, owner: 'player1' },
    { id: 'UNITED_KINGDOM', name: 'Royaume-Uni', continent: 'EUROPE', armies: 4, owner: 'player2' },
    { id: 'NORTHERN_EUROPE', name: 'Europe du Nord', continent: 'EUROPE', armies: 2, owner: 'player1' },
    { id: 'SOUTHERN_EUROPE', name: 'Europe du Sud', continent: 'EUROPE', armies: 3, owner: 'player2' },
    { id: 'WESTERN_EUROPE', name: 'Europe de l\'Ouest', continent: 'EUROPE', armies: 1, owner: 'player1' },
    { id: 'EGYPT', name: 'Égypte', continent: 'AFRICA', armies: 2, owner: 'player2' },
    { id: 'NORTH_AFRICA', name: 'Afrique du Nord', continent: 'AFRICA', armies: 1, owner: 'player1' },
    { id: 'WEST_AFRICA', name: 'Afrique de l\'Ouest', continent: 'AFRICA', armies: 3, owner: 'player2' },
    { id: 'EAST_AFRICA', name: 'Afrique de l\'Est', continent: 'AFRICA', armies: 2, owner: 'player1' },
    { id: 'CENTRAL_AFRICA', name: 'Afrique Centrale', continent: 'AFRICA', armies: 1, owner: 'player2' },
    { id: 'SOUTH_AFRICA', name: 'Afrique du Sud', continent: 'AFRICA', armies: 3, owner: 'player1' },
    { id: 'VENEZUELA', name: 'Venezuela', continent: 'SOUTH_AMERICA', armies: 2, owner: 'player2' },
    { id: 'PERU', name: 'Pérou', continent: 'SOUTH_AMERICA', armies: 1, owner: 'player1' },
    { id: 'BRAZIL', name: 'Brésil', continent: 'SOUTH_AMERICA', armies: 3, owner: 'player2' },
    { id: 'ARGENTINA', name: 'Argentine', continent: 'SOUTH_AMERICA', armies: 2, owner: 'player1' },
    { id: 'NEW_GUINEA', name: 'Nouvelle-Guinée', continent: 'OCEANIA', armies: 1, owner: 'player2' },
    { id: 'EAST_AFRICA', name: 'Afrique de l\'Est', continent: 'OCEANIA', armies: 3, owner: 'player1' },
    { id: 'WEST_AFRICA', name: 'Afrique de l\'Ouest', continent: 'OCEANIA', armies: 2, owner: 'player2' },
    { id: 'NEW_GUINEA', name: 'Nouvelle-Guinée', continent: 'OCEANIA', armies: 1, owner: 'player1' },
  ];

  // Mock data for continents
  const continents = [
    { id: 'ASIA', name: 'Asie', territoryCount: 12, bonusArmies: 7 },
    { id: 'NORTH_AMERICA', name: 'Amérique du Nord', territoryCount: 9, bonusArmies: 5 },
    { id: 'EUROPE', name: 'Europe', territoryCount: 7, bonusArmies: 5 },
    { id: 'AFRICA', name: 'Afrique', territoryCount: 6, bonusArmies: 3 },
    { id: 'SOUTH_AMERICA', name: 'Amérique du Sud', territoryCount: 4, bonusArmies: 2 },
    { id: 'OCEANIA', name: 'Océanie', territoryCount: 4, bonusArmies: 2 }
  ];

  // Mock function to get game state
  const fetchGameState = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/game/state/${gameId}`);
      // const data = await response.json();
      
      // Mock data for now
      setTimeout(() => {
        setGameState({
          territories: mockTerritories,
          currentPlayer: 'player1',
          phase: 'REINFORCEMENT',
          players: [
            { id: 'player1', name: 'Joueur 1', color: 'red' },
            { id: 'player2', name: 'Joueur 2', color: 'blue' }
          ]
        });
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load game state');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameState();
  }, [gameId]);

  if (loading) {
    return <div className="game-board-loading">Chargement de la carte...</div>;
  }

  if (error) {
    return <div className="game-board-error">{error}</div>;
  }

  const getOwnerColor = (owner) => {
    const player = gameState.players.find(p => p.id === owner);
    return player ? player.color : 'gray';
  };

  const getTerritoryClass = (territory) => {
    const ownerColor = getOwnerColor(territory.owner);
    return `territory territory-${ownerColor}`;
  };

  return (
    <div className="game-board">
      <div className="game-header">
        <h2>Carte de Risiko!</h2>
        <div className="game-info">
          <span>Phase: {gameState.phase}</span>
          <span>Joueur actuel: {gameState.currentPlayer}</span>
        </div>
      </div>
      
      <div className="game-board-container">
        <div className="continents">
          {continents.map(continent => (
            <div key={continent.id} className="continent">
              <h3>{continent.name}</h3>
              <p>Bonus: {continent.bonusArmies} armées</p>
            </div>
          ))}
        </div>
        
        <div className="territories-grid">
          {gameState.territories.map(territory => (
            <div 
              key={territory.id} 
              className={getTerritoryClass(territory)}
              title={`${territory.name} - ${territory.armies} armées`}
            >
              <div className="territory-name">{territory.name}</div>
              <div className="territory-armies">{territory.armies}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="game-controls">
        <button className="btn btn-primary">Placer des armées</button>
        <button className="btn btn-secondary">Attaquer</button>
        <button className="btn btn-success">Déplacer</button>
        <button className="btn btn-warning">Piocher une carte</button>
        <button className="btn btn-danger">Finir le tour</button>
      </div>
    </div>
  );
};

export default GameBoard;