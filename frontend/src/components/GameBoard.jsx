import React, { useState } from 'react';
import './GameBoard.css';

const GameBoard = () => {
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [gamePhase, setGamePhase] = useState('reinforcement');
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [armies, setArmies] = useState(10);
  const [gameState, setGameState] = useState({
    territories: [
      { id: 1, name: 'Alaska', x: 100, y: 100, armies: 3, owner: 1, continent: 'Amérique du Nord' },
      { id: 2, name: 'Alberta', x: 150, y: 120, armies: 2, owner: 1, continent: 'Amérique du Nord' },
      { id: 3, name: 'Northwest Territory', x: 120, y: 80, armies: 1, owner: 2, continent: 'Amérique du Nord' },
      { id: 4, name: 'Greenland', x: 200, y: 60, armies: 4, owner: 2, continent: 'Amérique du Nord' },
      { id: 5, name: 'Ontario', x: 180, y: 140, armies: 2, owner: 1, continent: 'Amérique du Nord' },
      { id: 6, name: 'Quebec', x: 220, y: 160, armies: 1, owner: 1, continent: 'Amérique du Nord' },
      { id: 7, name: 'Western United States', x: 130, y: 180, armies: 3, owner: 1, continent: 'Amérique du Nord' },
      { id: 8, name: 'Eastern United States', x: 200, y: 190, armies: 2, owner: 1, continent: 'Amérique du Nord' },
      { id: 9, name: 'Central America', x: 150, y: 220, armies: 1, owner: 2, continent: 'Amérique du Nord' },
      { id: 10, name: 'Venezuela', x: 180, y: 250, armies: 2, owner: 2, continent: 'Amérique du Sud' },
      { id: 11, name: 'Peru', x: 160, y: 280, armies: 1, owner: 2, continent: 'Amérique du Sud' },
      { id: 12, name: 'Brazil', x: 200, y: 270, armies: 2, owner: 2, continent: 'Amérique du Sud' },
      { id: 13, name: 'Argentina', x: 170, y: 300, armies: 1, owner: 2, continent: 'Amérique du Sud' },
      { id: 14, name: 'North Africa', x: 300, y: 150, armies: 2, owner: 1, continent: 'Afrique' },
      { id: 15, name: 'Egypt', x: 350, y: 170, armies: 1, owner: 1, continent: 'Afrique' },
      { id: 16, name: 'East Africa', x: 380, y: 200, armies: 3, owner: 1, continent: 'Afrique' },
      { id: 17, name: 'Congo', x: 360, y: 230, armies: 2, owner: 1, continent: 'Afrique' },
      { id: 18, name: 'South Africa', x: 370, y: 260, armies: 1, owner: 1, continent: 'Afrique' },
      { id: 19, name: 'Madagascar', x: 400, y: 280, armies: 1, owner: 1, continent: 'Afrique' },
      { id: 20, name: 'Ukraine', x: 400, y: 100, armies: 2, owner: 2, continent: 'Europe' },
      { id: 21, name: 'Scandinavia', x: 420, y: 80, armies: 1, owner: 2, continent: 'Europe' },
      { id: 22, name: 'Great Britain', x: 380, y: 90, armies: 3, owner: 2, continent: 'Europe' },
      { id: 23, name: 'Iberia', x: 340, y: 120, armies: 1, owner: 2, continent: 'Europe' },
      { id: 24, name: 'Northern Europe', x: 400, y: 130, armies: 2, owner: 2, continent: 'Europe' },
      { id: 25, name: 'Western Europe', x: 360, y: 140, armies: 1, owner: 2, continent: 'Europe' },
      { id: 26, name: 'Middle East', x: 420, y: 180, armies: 2, owner: 2, continent: 'Asie' },
      { id: 27, name: 'Afghanistan', x: 450, y: 160, armies: 1, owner: 2, continent: 'Asie' },
      { id: 28, name: 'Ural', x: 480, y: 100, armies: 2, owner: 2, continent: 'Asie' },
      { id: 29, name: 'Siberia', x: 500, y: 80, armies: 1, owner: 2, continent: 'Asie' },
      { id: 30, name: 'Yakutsk', x: 550, y: 70, armies: 1, owner: 2, continent: 'Asie' },
      { id: 31, name: 'Kamchatka', x: 600, y: 80, armies: 2, owner: 2, continent: 'Asie' },
      { id: 32, name: 'Japan', x: 620, y: 120, armies: 1, owner: 2, continent: 'Asie' },
      { id: 33, name: 'Mongolia', x: 550, y: 120, armies: 1, owner: 2, continent: 'Asie' },
      { id: 34, name: 'China', x: 520, y: 150, armies: 2, owner: 2, continent: 'Asie' },
      { id: 35, name: 'India', x: 500, y: 180, armies: 1, owner: 2, continent: 'Asie' },
      { id: 36, name: 'Southeast Asia', x: 540, y: 200, armies: 1, owner: 2, continent: 'Asie' },
      { id: 37, name: 'Indonesia', x: 520, y: 230, armies: 1, owner: 2, continent: 'Asie' },
      { id: 38, name: 'New Guinea', x: 580, y: 250, armies: 1, owner: 2, continent: 'Océanie' },
      { id: 39, name: 'Eastern Australia', x: 600, y: 270, armies: 1, owner: 2, continent: 'Océanie' },
      { id: 40, name: 'Western Australia', x: 580, y: 290, armies: 1, owner: 2, continent: 'Océanie' },
    ],
    players: [
      { id: 1, name: 'Joueur 1', color: '#3498db', armies: 15, cards: 3 },
      { id: 2, name: 'Joueur 2', color: '#e74c3c', armies: 12, cards: 1 },
      { id: 3, name: 'Joueur 3', color: '#2ecc71', armies: 10, cards: 2 }
    ],
    continents: [
      { id: 1, name: 'Amérique du Nord', bonus: 5, territories: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      { id: 2, name: 'Amérique du Sud', bonus: 2, territories: [10, 11, 12, 13] },
      { id: 3, name: 'Afrique', bonus: 3, territories: [14, 15, 16, 17, 18, 19] },
      { id: 4, name: 'Europe', bonus: 5, territories: [20, 21, 22, 23, 24, 25] },
      { id: 5, name: 'Asie', bonus: 7, territories: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37] },
      { id: 6, name: 'Océanie', bonus: 2, territories: [38, 39, 40] }
    ]
  });

  const handleTerritoryClick = (territory) => {
    setSelectedTerritory(territory);
  };

  const getTerritoryColor = (owner) => {
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    return colors[owner - 1] || '#CCCCCC';
  };

  const getPhaseColor = (phase) => {
    const colors = {
      reinforcement: '#4ECDC4',
      attack: '#FF6B6B',
      move: '#45B7D1',
      card: '#96CEB4'
    };
    return colors[phase] || '#CCCCCC';
  };

  const handleReinforce = () => {
    if (selectedTerritory && selectedTerritory.owner === currentPlayer) {
      // In a real implementation, this would call the backend to reinforce
      const updatedTerritories = gameState.territories.map(territory => 
        territory.id === selectedTerritory.id 
          ? { ...territory, armies: territory.armies + 1 } 
          : territory
      );
      setGameState({ ...gameState, territories: updatedTerritories });
      setArmies(armies - 1);
    }
  };

  const handleAttack = () => {
    // In a real implementation, this would initiate an attack
    console.log('Attack phase initiated');
  };

  const handleFortify = () => {
    // In a real implementation, this would initiate a fortify action
    console.log('Fortify phase initiated');
  };

  const handleDrawCard = () => {
    // In a real implementation, this would draw a card
    console.log('Card draw initiated');
  };

  const handleEndTurn = () => {
    // In a real implementation, this would end the current player's turn
    const nextPlayer = currentPlayer === gameState.players.length ? 1 : currentPlayer + 1;
    setCurrentPlayer(nextPlayer);
    setGamePhase('reinforcement');
    // Reset armies for next player
    const updatedPlayers = gameState.players.map(player => 
      player.id === nextPlayer ? { ...player, armies: player.armies + 3 } : player
    );
    setGameState({ ...gameState, players: updatedPlayers });
  };

  return (
    <div className="game-board-container">
      <div className="game-header">
        <h1>Risk Game - V3</h1>
        <div className="game-info">
          <div className="phase-indicator" style={{ backgroundColor: getPhaseColor(gamePhase) }}>
            Phase: {gamePhase}
          </div>
          <div className="current-player">
            Joueur actuel: Joueur {currentPlayer}
          </div>
          <div className="armies-count">
            Troupes: {armies}
          </div>
        </div>
      </div>

      <div className="game-content">
        <div className="territory-map">
          <svg width="1000" height="600" className="territory-svg">
            {/* Draw connections between territories */}
            {/* North America connections */}
            <line x1="100" y1="100" x2="150" y2="120" stroke="#333" strokeWidth="2" />
            <line x1="150" y1="120" x2="180" y2="140" stroke="#333" strokeWidth="2" />
            <line x1="180" y1="140" x2="200" y2="190" stroke="#333" strokeWidth="2" />
            <line x1="130" y1="180" x2="180" y2="140" stroke="#333" strokeWidth="2" />
            <line x1="150" y1="220" x2="180" y2="250" stroke="#333" strokeWidth="2" />
            <line x1="180" y1="250" x2="160" y2="280" stroke="#333" strokeWidth="2" />
            <line x1="160" y1="280" x2="200" y2="270" stroke="#333" strokeWidth="2" />
            <line x1="200" y1="270" x2="170" y2="300" stroke="#333" strokeWidth="2" />
            
            {/* Africa connections */}
            <line x1="300" y1="150" x2="350" y2="170" stroke="#333" strokeWidth="2" />
            <line x1="350" y1="170" x2="380" y2="200" stroke="#333" strokeWidth="2" />
            <line x1="380" y1="200" x2="360" y2="230" stroke="#333" strokeWidth="2" />
            <line x1="360" y1="230" x2="370" y2="260" stroke="#333" strokeWidth="2" />
            <line x1="370" y1="260" x2="400" y2="280" stroke="#333" strokeWidth="2" />
            
            {/* Europe connections */}
            <line x1="400" y1="100" x2="420" y2="80" stroke="#333" strokeWidth="2" />
            <line x1="420" y1="80" x2="380" y2="90" stroke="#333" strokeWidth="2" />
            <line x1="380" y1="90" x2="340" y2="120" stroke="#333" strokeWidth="2" />
            <line x1="340" y1="120" x2="400" y2="130" stroke="#333" strokeWidth="2" />
            <line x1="400" y1="130" x2="360" y2="140" stroke="#333" strokeWidth="2" />
            <line x1="360" y1="140" x2="420" y2="180" stroke="#333" strokeWidth="2" />
            
            {/* Asia connections */}
            <line x1="420" y1="180" x2="450" y2="160" stroke="#333" strokeWidth="2" />
            <line x1="450" y1="160" x2="480" y2="100" stroke="#333" strokeWidth="2" />
            <line x1="480" y1="100" x2="500" y2="80" stroke="#333" strokeWidth="2" />
            <line x1="500" y1="80" x2="550" y2="70" stroke="#333" strokeWidth="2" />
            <line x1="550" y1="70" x2="600" y2="80" stroke="#333" strokeWidth="2" />
            <line x1="600" y1="80" x2="620" y2="120" stroke="#333" strokeWidth="2" />
            <line x1="620" y1="120" x2="550" y2="120" stroke="#333" strokeWidth="2" />
            <line x1="550" y1="120" x2="520" y2="150" stroke="#333" strokeWidth="2" />
            <line x1="520" y1="150" x2="500" y2="180" stroke="#333" strokeWidth="2" />
            <line x1="500" y1="180" x2="540" y2="200" stroke="#333" strokeWidth="2" />
            <line x1="540" y1="200" x2="520" y2="230" stroke="#333" strokeWidth="2" />
            <line x1="520" y1="230" x2="580" y2="250" stroke="#333" strokeWidth="2" />
            <line x1="580" y1="250" x2="600" y2="270" stroke="#333" strokeWidth="2" />
            <line x1="600" y1="270" x2="580" y2="290" stroke="#333" strokeWidth="2" />
            
            {/* Draw territories */}
            {gameState.territories.map(territory => (
              <g key={territory.id} onClick={() => handleTerritoryClick(territory)}>
                <circle
                  cx={territory.x}
                  cy={territory.y}
                  r="20"
                  fill={getTerritoryColor(territory.owner)}
                  stroke={selectedTerritory?.id === territory.id ? "#fff" : "#000"}
                  strokeWidth="2"
                  className="territory"
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x={territory.x}
                  y={territory.y - 5}
                  textAnchor="middle"
                  className="territory-name"
                >
                  {territory.name}
                </text>
                <text
                  x={territory.x}
                  y={territory.y + 10}
                  textAnchor="middle"
                  className="territory-armies"
                >
                  {territory.armies}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="game-controls">
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => setGamePhase('reinforcement')}>
              Renforcer
            </button>
            <button className="btn btn-danger" onClick={() => setGamePhase('attack')}>
              Attaquer
            </button>
            <button className="btn btn-info" onClick={() => setGamePhase('move')}>
              Déplacer
            </button>
            <button className="btn btn-success" onClick={() => setGamePhase('card')}>
              Cartes
            </button>
            <button className="btn btn-warning" onClick={handleEndTurn}>
              Fin du tour
            </button>
          </div>

          {selectedTerritory && (
            <div className="territory-details">
              <h3>{selectedTerritory.name}</h3>
              <p>Propriétaire: Joueur {selectedTerritory.owner}</p>
              <p>Troupes: {selectedTerritory.armies}</p>
              <p>Continent: {selectedTerritory.continent}</p>
              {gamePhase === 'reinforcement' && selectedTerritory.owner === currentPlayer && (
                <button className="btn btn-secondary" onClick={handleReinforce}>Renforcer</button>
              )}
              {gamePhase === 'attack' && selectedTerritory.owner === currentPlayer && (
                <button className="btn btn-danger" onClick={handleAttack}>Attaquer</button>
              )}
              {gamePhase === 'move' && selectedTerritory.owner === currentPlayer && (
                <button className="btn btn-info" onClick={handleFortify}>Déplacer</button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="game-footer">
        <div className="player-stats">
          {gameState.players.map(player => (
            <div key={player.id} className="player-card">
              <h4>{player.name}</h4>
              <p>Troupes: {player.armies}</p>
              <p>Cartes: {player.cards}</p>
              <div className="player-color" style={{ backgroundColor: player.color }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;