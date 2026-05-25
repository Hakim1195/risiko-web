import React, { useState, useEffect } from 'react';
import './GameBoard.css';
import MappeImage from './ui/Mappe.jpg';

const GameBoard = ({ gameId, playerId }) => {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTerritory, setSelectedTerritory] = useState(null);

  // Mock data for territories (in a real app, this would come from the backend)
  const mockTerritories = [
    { id: 'ALASKA', name: 'Alaska', continent: 'NORTH_AMERICA', armies: 3, owner: 'player1', x: 15, y: 20 },
    { id: 'NORTHWEST_TERRITORY', name: 'Territoire du Nord-Ouest', continent: 'NORTH_AMERICA', armies: 2, owner: 'player2', x: 25, y: 25 },
    { id: 'GREENLAND', name: 'Groenland', continent: 'NORTH_AMERICA', armies: 1, owner: 'player1', x: 35, y: 15 },
    { id: 'ONTARIO', name: 'Ontario', continent: 'NORTH_AMERICA', armies: 4, owner: 'player1', x: 30, y: 30 },
    { id: 'QUEBEC', name: 'Québec', continent: 'NORTH_AMERICA', armies: 2, owner: 'player2', x: 35, y: 35 },
    { id: 'ALBERTA', name: 'Alberta', continent: 'NORTH_AMERICA', armies: 3, owner: 'player1', x: 20, y: 30 },
    { id: 'WESTERN_UNITED_STATES', name: 'États-Unis Occidentaux', continent: 'NORTH_AMERICA', armies: 1, owner: 'player2', x: 25, y: 45 },
    { id: 'EASTERN_UNITED_STATES', name: 'États-Unis Orientaux', continent: 'NORTH_AMERICA', armies: 2, owner: 'player1', x: 35, y: 45 },
    { id: 'MEXICO', name: 'Mexique', continent: 'NORTH_AMERICA', armies: 3, owner: 'player2', x: 25, y: 55 },
    { id: 'AFGHANISTAN', name: 'Afghanistan', continent: 'ASIA', armies: 2, owner: 'player1', x: 65, y: 35 },
    { id: 'CHINA', name: 'Chine', continent: 'ASIA', armies: 4, owner: 'player2', x: 75, y: 40 },
    { id: 'INDIA', name: 'Inde', continent: 'ASIA', armies: 1, owner: 'player1', x: 65, y: 50 },
    { id: 'MIDDLE_EAST', name: 'Moyen-Orient', continent: 'ASIA', armies: 3, owner: 'player2', x: 55, y: 45 },
    { id: 'MONGOLIA', name: 'Mongolie', continent: 'ASIA', armies: 2, owner: 'player1', x: 80, y: 30 },
    { id: 'SIBERIA', name: 'Sibérie', continent: 'ASIA', armies: 4, owner: 'player2', x: 75, y: 20 },
    { id: 'URAL', name: 'Ural', continent: 'ASIA', armies: 1, owner: 'player1', x: 60, y: 25 },
    { id: 'KAMCHATKA', name: 'Kamchatka', continent: 'ASIA', armies: 3, owner: 'player2', x: 90, y: 20 },
    { id: 'SIAM', name: 'Siam', continent: 'ASIA', armies: 2, owner: 'player1', x: 75, y: 55 },
    { id: 'THAILAND', name: 'Thaïlande', continent: 'ASIA', armies: 1, owner: 'player2', x: 70, y: 55 },
    { id: 'INDONESIA', name: 'Indonésie', continent: 'ASIA', armies: 3, owner: 'player1', x: 80, y: 65 },
    { id: 'ICELAND', name: 'Islande', continent: 'EUROPE', armies: 2, owner: 'player2', x: 45, y: 20 },
    { id: 'SCANDINAVIA', name: 'Scandinavie', continent: 'EUROPE', armies: 1, owner: 'player1', x: 55, y: 25 },
    { id: 'UNITED_KINGDOM', name: 'Royaume-Uni', continent: 'EUROPE', armies: 4, owner: 'player2', x: 45, y: 30 },
    { id: 'NORTHERN_EUROPE', name: 'Europe du Nord', continent: 'EUROPE', armies: 2, owner: 'player1', x: 50, y: 35 },
    { id: 'SOUTHERN_EUROPE', name: 'Europe du Sud', continent: 'EUROPE', armies: 3, owner: 'player2', x: 55, y: 45 },
    { id: 'WESTERN_EUROPE', name: 'Europe de l\'Ouest', continent: 'EUROPE', armies: 1, owner: 'player1', x: 45, y: 40 },
    { id: 'EGYPT', name: 'Égypte', continent: 'AFRICA', armies: 2, owner: 'player2', x: 55, y: 55 },
    { id: 'NORTH_AFRICA', name: 'Afrique du Nord', continent: 'AFRICA', armies: 1, owner: 'player1', x: 45, y: 60 },
    { id: 'WEST_AFRICA', name: 'Afrique de l\'Ouest', continent: 'AFRICA', armies: 3, owner: 'player2', x: 35, y: 60 },
    { id: 'EAST_AFRICA', name: 'Afrique de l\'Est', continent: 'AFRICA', armies: 2, owner: 'player1', x: 60, y: 65 },
    { id: 'CENTRAL_AFRICA', name: 'Afrique Centrale', continent: 'AFRICA', armies: 1, owner: 'player2', x: 50, y: 65 },
    { id: 'SOUTH_AFRICA', name: 'Afrique du Sud', continent: 'AFRICA', armies: 3, owner: 'player1', x: 50, y: 75 },
    { id: 'VENEZUELA', name: 'Venezuela', continent: 'SOUTH_AMERICA', armies: 2, owner: 'player2', x: 40, y: 70 },
    { id: 'PERU', name: 'Pérou', continent: 'SOUTH_AMERICA', armies: 1, owner: 'player1', x: 40, y: 80 },
    { id: 'BRAZIL', name: 'Brésil', continent: 'SOUTH_AMERICA', armies: 3, owner: 'player2', x: 45, y: 75 },
    { id: 'ARGENTINA', name: 'Argentine', continent: 'SOUTH_AMERICA', armies: 2, owner: 'player1', x: 45, y: 85 },
    { id: 'NEW_GUINEA', name: 'Nouvelle-Guinée', continent: 'OCEANIA', armies: 1, owner: 'player2', x: 85, y: 75 },
    { id: 'EAST_AFRICA', name: 'Afrique de l\'Est', continent: 'OCEANIA', armies: 3, owner: 'player1', x: 75, y: 75 },
    { id: 'WEST_AFRICA', name: 'Afrique de l\'Ouest', continent: 'OCEANIA', armies: 2, owner: 'player2', x: 80, y: 80 },
    { id: 'NEW_GUINEA', name: 'Nouvelle-Guinée', continent: 'OCEANIA', armies: 1, owner: 'player1', x: 85, y: 75 },
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
    const isSelected = selectedTerritory === territory.id;
    return `territory territory-${ownerColor} ${isSelected ? 'selected' : ''}`;
  };

  const handleTerritoryClick = (territory) => {
    setSelectedTerritory(territory.id);
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
        {/* Official Game Map */}
        <div className="map-container">
          <img 
            src={MappeImage} 
            alt="Carte du monde" 
            className="game-map"
          />
          
          {/* Territory markers on map */}
          <div className="territories-overlay">
            {gameState.territories.map(territory => (
              <div 
                key={territory.id} 
                className={getTerritoryClass(territory)}
                style={{
                  left: `${territory.x}%`,
                  top: `${territory.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleTerritoryClick(territory)}
                title={`${territory.name} - ${territory.armies} armées`}
              >
                <div className="territory-name">{territory.name}</div>
                <div className="territory-armies">{territory.armies}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="continents">
          {continents.map(continent => (
            <div key={continent.id} className="continent">
              <h3>{continent.name}</h3>
              <p>Bonus: {continent.bonusArmies} armées</p>
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
