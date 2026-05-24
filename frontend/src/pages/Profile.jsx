import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    avatarUrl: ''
  });
  const navigate = useNavigate();

  // Mock user data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setUser({
        id: 1,
        username: 'WarriorPlayer',
        email: 'warrior@example.com',
        avatarUrl: 'https://via.placeholder.com/150',
        eloRating: 1450,
        totalMatches: 124,
        wins: 86,
        losses: 38,
        winRate: 69.3,
        lastLogin: '2026-05-23'
      });
      setProfileData({
        username: 'WarriorPlayer',
        email: 'warrior@example.com',
        avatarUrl: 'https://via.placeholder.com/150'
      });
      setLoading(false);
    }, 500);
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    // In a real app, this would be an API call
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setProfileData({
      username: user?.username || '',
      email: user?.email || '',
      avatarUrl: user?.avatarUrl || ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    // In a real app, this would clear the auth token
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <img 
              src={user.avatarUrl} 
              alt={user.username} 
              className="avatar-img"
            />
            {editing && (
              <input 
                type="text" 
                name="avatarUrl"
                value={profileData.avatarUrl}
                onChange={handleChange}
                className="avatar-input"
                placeholder="Avatar URL"
              />
            )}
          </div>

          <div className="profile-info">
            {editing ? (
              <div className="profile-form">
                <div className="form-group">
                  <label>Username:</label>
                  <input 
                    type="text" 
                    name="username"
                    value={profileData.username}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input 
                    type="email" 
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            ) : (
              <div className="profile-details">
                <h2>{user.username}</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ELO Rating:</strong> {user.eloRating}</p>
                <p><strong>Last Login:</strong> {user.lastLogin}</p>
              </div>
            )}
          </div>

          <div className="profile-actions">
            {editing ? (
              <>
                <button className="btn btn-success" onClick={handleSave}>Save Changes</button>
                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={handleEdit}>Edit Profile</button>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <h3>Game Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Matches</h4>
              <p>{user.totalMatches}</p>
            </div>
            <div className="stat-card">
              <h4>Wins</h4>
              <p>{user.wins}</p>
            </div>
            <div className="stat-card">
              <h4>Losses</h4>
              <p>{user.losses}</p>
            </div>
            <div className="stat-card">
              <h4>Win Rate</h4>
              <p>{user.winRate}%</p>
            </div>
          </div>
        </div>

        <div className="profile-leaderboard">
          <h3>Leaderboard Position</h3>
          <div className="leaderboard-card">
            <div className="leaderboard-item">
              <span className="rank">#12</span>
              <span className="player-name">Overall</span>
              <span className="elo">ELO: {user.eloRating}</span>
            </div>
            <div className="leaderboard-item">
              <span className="rank">#8</span>
              <span className="player-name">Regional</span>
              <span className="elo">ELO: {user.eloRating}</span>
            </div>
            <div className="leaderboard-item">
              <span className="rank">#5</span>
              <span className="player-name">Seasonal</span>
              <span className="elo">ELO: {user.eloRating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;