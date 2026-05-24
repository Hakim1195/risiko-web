import React, { useState, useEffect } from 'react';
import './GameList.css';

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simuler un appel API pour récupérer les jeux
    const fetchGames = async () => {
      try {
        setLoading(true);
        // Simuler un appel API avec délai
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données de jeu simulées
        const mockGames = [
          {
            id: 1,
            name: 'Stratégie Royale',
            description: 'Un jeu de stratégie en temps réel pour 2-4 joueurs',
            players: 4,
            category: 'Stratégie'
          },
          {
            id: 2,
            name: 'Conquête Territoriale',
            description: 'Capturez les territoires et dominez la carte',
            players: 6,
            category: 'Stratégie'
          },
          {
            id: 3,
            name: 'Jeux de Société Classiques',
            description: 'Des jeux de société traditionnels modernisés',
            players: 8,
            category: 'Classique'
          }
        ];
        
        setGames(mockGames);
      } catch (err) {
        setError('Erreur lors du chargement des jeux');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <div className="loading">Chargement des jeux...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="game-list">
      <h2>Liste des Jeux</h2>
      <div className="games-grid">
        {games.map(game => (
          <div key={game.id} className="game-card">
            <h3>{game.name}</h3>
            <p className="game-description">{game.description}</p>
            <div className="game-info">
              <span className="game-category">{game.category}</span>
              <span className="game-players">{game.players} joueurs</span>
            </div>
            <button className="btn-play">Jouer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameList;