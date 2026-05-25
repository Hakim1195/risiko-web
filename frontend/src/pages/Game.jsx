import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../components/Home.css';
import './Game.css';
import GameBoard from '../components/GameBoard';
import config from '../config';
import socketService from '../services/socketService';

const Game = () => {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { matchId } = useParams();
  const [playerId, setPlayerId] = useState('player1');
  const [username, setUsername] = useState('');

  // Get player info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setPlayerId(user.id || 'player1');
        setUsername(user.username || 'Player');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  // Connect to Socket.io when game loads
  useEffect(() => {
    if (matchId && playerId && username) {
      socketService.connect(matchId, playerId, username);
      
      // Set up socket listeners
      const handleGameStateUpdate = (data) => {
        setGameState(data.gameState);
      };

      const handleTurnChange = (data) => {
        setGameState(prev => ({
          ...prev,
          turnNumber: data.turnNumber,
          currentPlayerId: data.currentPlayerId,
          currentPlayerName: data.currentPlayerName
        }));
      };

      const handleAttackResult = (data) => {
        console.log('Attack result received:', data);
        if (data.gameState) {
          setGameState(data.gameState);
        }
      };

      socketService.on('gameStateUpdate', handleGameStateUpdate);
      socketService.on('turnChange', handleTurnChange);
      socketService.on('attackResult', handleAttackResult);

      return () => {
        socketService.disconnect();
        socketService.off('gameStateUpdate', handleGameStateUpdate);
        socketService.off('turnChange', handleTurnChange);
        socketService.off('attackResult', handleAttackResult);
      };
    }
  }, [matchId, playerId, username]);

  // Fetch game state from API
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.API_BASE_URL}/games/state/${matchId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setGameState(data.gameState);
          setChatMessages(data.chatMessages || []);
        } else {
          setError('Failed to load game state');
        }
      } catch (err) {
        console.error('Error fetching game state:', err);
        setError('Failed to load game state');
      } finally {
        setLoading(false);
      }
    };

    fetchGameState();
  }, [matchId]);

  const handleActionClick = (action) => {
    setSelectedAction(action);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${config.API_BASE_URL}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            matchId,
            text: chatMessage
          })
        });

        const newMessage = {
          user: 'Vous',
          text: chatMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages([...chatMessages, newMessage]);
        setChatMessage('');
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  const handleEndTurn = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.API_BASE_URL}/games/end-turn/${matchId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGameState(data.gameState);
      }
    } catch (err) {
      console.error('Error ending turn:', err);
    }
  };

  const handleLeaveGame = () => {
    navigate('/lobby');
  };

  if (loading) {
    return (
      <div className="home">
        <div className="loading">Chargement de la partie...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div className="error-message">{error}</div>
        <button className="btn btn-secondary" onClick={handleLeaveGame}>
          Retour au Lobby
        </button>
      </div>
    );
  }

  if (!gameState) {
    return null;
  }

  return (
    <div className="home">
      <div className="home-hero" style={{ margin: '2rem 0', padding: '2rem' }}>
        <h1 className="hero-title">Partie en cours</h1>
        <p className="hero-subtitle">Nom de la partie: {gameState.name || 'Partie de test'}</p>
        <p className="hero-subtitle">ID de la partie: {matchId || 'N/A'}</p>
        <p className="hero-subtitle">Tour: {gameState.turnNumber || 1} | Joueur: {gameState.currentPlayerName || 'Inconnu'}</p>
        
        <main className="game-content">
          <div className="game-panel">
            <div className="player-info">
              <h3 className="hero-subtitle">Joueurs</h3>
              <div className="players-list">
                {gameState.players?.map((player) => (
                  <div key={player.id} className="player-item">
                    <div className="player-color" style={{ backgroundColor: player.color }}></div>
                    <span>{player.name}</span>
                    <span className="armies-count">{player.armies || 0} armées</span>
                    {player.isCurrent && <span className="current-player">●</span>}
                  </div>
                ))}
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
              <button className="btn btn-warning" onClick={handleEndTurn} style={{ marginTop: '1rem' }}>
                Fin du tour
              </button>
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
              <GameBoard gameId={matchId || 'game123'} playerId={gameState.currentPlayerId || 'player1'} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Game;
