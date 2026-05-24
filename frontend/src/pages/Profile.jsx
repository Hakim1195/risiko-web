import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Home.css';

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
      <div className="home">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home-hero" style={{ margin: '2rem 0' }}>
        <h1 className="hero-title">Profil Utilisateur</h1>
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
                />
              )}
            </div>
            <div className="profile-info">
              <h2 className="hero-subtitle">{user.username}</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rating ELO:</strong> {user.eloRating}</p>
              <p><strong>Matchs totaux:</strong> {user.totalMatches}</p>
              <p><strong>Victoires:</strong> {user.wins}</p>
              <p><strong>Défaites:</strong> {user.losses}</p>
              <p><strong>Taux de victoire:</strong> {user.winRate}%</p>
              <p><strong>Dernière connexion:</strong> {user.lastLogin}</p>
            </div>
            <div className="profile-actions">
              {editing ? (
                <>
                  <button onClick={handleSave} className="btn-primary">Sauvegarder</button>
                  <button onClick={handleCancel} className="btn-secondary">Annuler</button>
                </>
              ) : (
                <button onClick={handleEdit} className="btn-primary">Modifier le profil</button>
              )}
              <button onClick={handleLogout} className="btn-secondary">Déconnexion</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;