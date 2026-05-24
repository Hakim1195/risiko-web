import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Lobby.css';

const Lobby = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoomName, setNewRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const navigate = useNavigate();

  // Mock rooms data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setRooms([
        {
          id: 1,
          name: 'Battle Royale',
          maxPlayers: 4,
          currentPlayers: 3,
          status: 'waiting',
          gameType: 'risk'
        },
        {
          id: 2,
          name: 'World Conquest',
          maxPlayers: 6,
          currentPlayers: 6,
          status: 'in_progress',
          gameType: 'risk'
        },
        {
          id: 3,
          name: 'European Wars',
          maxPlayers: 4,
          currentPlayers: 2,
          status: 'waiting',
          gameType: 'risk'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    // In a real app, this would be an API call
    const newRoom = {
      id: rooms.length + 1,
      name: newRoomName || 'New Room',
      maxPlayers,
      currentPlayers: 1,
      status: 'waiting',
      gameType: 'risk'
    };
    setRooms([newRoom, ...rooms]);
    setNewRoomName('');
  };

  const handleJoinRoom = (roomId) => {
    // In a real app, this would be an API call
    console.log(`Joining room ${roomId}`);
    navigate(`/game/${roomId}`);
  };

  const getStatusColor = (status) => {
    return status === 'waiting' ? '#4ECDC4' : '#FF6B6B';
  };

  if (loading) {
    return (
      <div className="lobby-container">
        <div className="loading">Loading lobby...</div>
      </div>
    );
  }

  return (
    <div className="lobby-container">
      <div className="lobby-header">
        <h1>Game Lobby</h1>
        <p>Join or create a room to start playing</p>
      </div>

      <div className="lobby-content">
        <div className="create-room">
          <h2>Create New Room</h2>
          <form onSubmit={handleCreateRoom} className="create-room-form">
            <div className="form-group">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Room name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Max Players:</label>
              <select
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                className="form-select"
              >
                <option value={2}>2 Players</option>
                <option value={3}>3 Players</option>
                <option value={4}>4 Players</option>
                <option value={5}>5 Players</option>
                <option value={6}>6 Players</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Create Room</button>
          </form>
        </div>

        <div className="rooms-list">
          <h2>Available Rooms</h2>
          <div className="rooms-grid">
            {rooms.map(room => (
              <div key={room.id} className="room-card">
                <div className="room-header">
                  <h3>{room.name}</h3>
                  <span className="room-status" style={{ backgroundColor: getStatusColor(room.status) }}>
                    {room.status}
                  </span>
                </div>
                <div className="room-details">
                  <p><strong>Game:</strong> {room.gameType}</p>
                  <p><strong>Players:</strong> {room.currentPlayers}/{room.maxPlayers}</p>
                </div>
                <div className="room-actions">
                  {room.status === 'waiting' && room.currentPlayers < room.maxPlayers ? (
                    <button 
                      className="btn btn-success"
                      onClick={() => handleJoinRoom(room.id)}
                    >
                      Join Room
                    </button>
                  ) : (
                    <button 
                      className="btn btn-secondary"
                      disabled
                    >
                      Room Full
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lobby-footer">
        <button className="btn btn-info" onClick={() => navigate('/profile')}>
          View Profile
        </button>
        <button className="btn btn-warning" onClick={() => navigate('/leaderboard')}>
          Leaderboard
        </button>
      </div>
    </div>
  );
};

export default Lobby;