import React, { useState, useEffect } from 'react';
import './RoomList.css';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simuler un appel API pour récupérer les salles
    const fetchRooms = async () => {
      try {
        setLoading(true);
        // Simuler un appel API avec délai
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données de salle simulées
        const mockRooms = [
          {
            id: 1,
            name: 'Salle de Stratégie 1',
            game: 'Stratégie Royale',
            players: 2,
            maxPlayers: 4,
            status: 'en attente'
          },
          {
            id: 2,
            name: 'Salle de Conquête',
            game: 'Conquête Territoriale',
            players: 3,
            maxPlayers: 6,
            status: 'en cours'
          },
          {
            id: 3,
            name: 'Salle Classique',
            game: 'Jeux de Société Classiques',
            players: 1,
            maxPlayers: 8,
            status: 'en attente'
          }
        ];
        
        setRooms(mockRooms);
      } catch (err) {
        setError('Erreur lors du chargement des salles');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const joinRoom = (roomId) => {
    // Simuler la rejoindre d'une salle
    console.log(`Rejoindre la salle ${roomId}`);
    alert(`Vous avez rejoint la salle ${roomId}`);
  };

  if (loading) {
    return <div className="loading">Chargement des salles...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="room-list">
      <h2>Liste des Salles</h2>
      <div className="rooms-grid">
        {rooms.map(room => (
          <div key={room.id} className={`room-card ${room.status}`}>
            <h3>{room.name}</h3>
            <p className="room-game">{room.game}</p>
            <div className="room-info">
              <span className="room-players">{room.players}/{room.maxPlayers} joueurs</span>
              <span className={`room-status ${room.status}`}>{room.status}</span>
            </div>
            <button 
              className="btn-join" 
              onClick={() => joinRoom(room.id)}
              disabled={room.status === 'en cours'}
            >
              {room.status === 'en cours' ? 'Salle pleine' : 'Rejoindre'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;