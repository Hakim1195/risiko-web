import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../components/Home.css';
import './Game.css';
import GameBoard from '../components/GameBoard';

const Game = () => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { user: 'Joueur1', text: 'Bonjour à tous !', time: '14:30' },
    { user: 'Joueur2', text: 'Prêt à jouer ?', time: '14:31' }
  ]);
  const navigate = useNavigate();
  const { matchId } = useParams();

  const handleActionClick = (action) => {
    setSelectedAction(action);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      const newMessage = {
        user: 'Vous',
        text: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage('');
    }
  };

  const handleEndTurn = () => {
    // Simulation de fin de tour
    console.log('Fin du tour');
  };

  const handleLeaveGame = () => {
    navigate('/lobby');
  };

  return (
    <div className="home">
      <div className="home-hero" style={{ margin: '2rem 0', padding: '2rem' }}>
        <h1 className="hero-title">Partie en cours</h1>
        <p className="hero-subtitle">Nom de la partie: Partie de test</p>
        <p className="hero-subtitle">ID de la partie: {matchId || 'N/A'}</p>
        
        <main className="game-content">
          <div className="game-panel">
            <div className="player-info">
              <h3 className="hero-subtitle">Joueurs</h3>
              <div className="players-list">
                <div className="player-item">
                  <div className="player-color" style={{ backgroundColor: '#3498db' }}></div>
                  <span>Joueur 1 (Vous)</span>
                  <span className="armies-count">12 armées</span>
                </div>
                <div className="player-item">
                  <div className="player-color" style={{ backgroundColor: '#e74c3c' }}></div>
                  <span>Joueur 2</span>
                  <span className="armies-count">8 armées</span>
                </div>
                <div className="player-item">
                  <div className="player-color" style={{ backgroundColor: '#2ecc71' }}></div>
                  <span>Joueur 3</span>
                  <span className="armies-count">10 armées</span>
                </div>
              </div>
            </div>

            <div className="game-actions">
              <h3 className="hero-subtitle">Actions</h3>
              <div className="action-buttons">
                <button
                  className={`action-btn ${selectedAction === 'deploy' ? 'active' : ''} btn-primary`}
                  onClick={() => handleActionClick('deploy')}
                >
                  Déployer des troupes
                </button>
                <button
                  className={`action-btn ${selectedAction === 'attack' ? 'active' : ''} btn-primary`}
                  onClick={() => handleActionClick('attack')}
                >
                  Attaquer
                </button>
                <button
                  className={`action-btn ${selectedAction === 'move' ? 'active' : ''} btn-primary`}
                  onClick={() => handleActionClick('move')}
                >
                  Déplacer des troupes
                </button>
                <button
                  className={`action-btn ${selectedAction === 'fortify' ? 'active' : ''} btn-primary`}
                  onClick={() => handleActionClick('fortify')}
                >
                  Renforcer
                </button>
              </div>
            </div>

            <div className="chat-section">
              <h3 className="hero-subtitle">Chat</h3>
              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div key={index} className="chat-message">
                    <span className="chat-user">{msg.user}</span>
                    <span className="chat-time">[{msg.time}]</span>
                    <span className="chat-text">{msg.text}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="chat-form">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="chat-input form-input"
                />
                <button type="submit" className="chat-send-btn btn-primary">Envoyer</button>
              </form>
            </div>
          </div>

          <div className="game-board">
            <div className="game-board-header">
              <h2 className="hero-subtitle">Carte du jeu</h2>
            </div>
            <div className="game-board-content">
              <GameBoard gameId={matchId || 'game123'} playerId="player1" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Game;