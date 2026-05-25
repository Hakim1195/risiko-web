import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Lobby.css';
import config from '../config';

const Lobby = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoomName, setNewRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.API_BASE_URL}/rooms`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setRooms(data.rooms || []);
        } else {
          // Fallback to mock data if API fails
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
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        // Fallback to mock data
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
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${config.API_BASE_URL}/rooms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newRoomName || 'New Room',
          maxPlayers
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create room');
      }

      setRooms([data.room, ...rooms]);
      setNewRoomName('');
    } catch (err) {
      setError(err.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${config.API_BASE_URL}/rooms/${roomId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        navigate(`/game/${roomId}`);
      } else {
        setError('Failed to join room');
      }
    } catch (err) {
      console.error('Error joining room:', err);
      setError('Failed to join room');
    }
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

      {error && <div className="error-message">{error}</div>}

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
