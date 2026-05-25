import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Home.css';
import config from '../config';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    avatarUrl: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get user data from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${config.API_BASE_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la récupération du profil');
        }

        setUser(data.user);
        setProfileData({
          username: data.user.username,
          email: data.user.email,
          avatarUrl: data.user.avatarUrl || ''
        });
      } catch (err) {
        setError(err.message);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour du profil');
      }

      setUser(data.user);
      setEditing(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="home">
        <div className="loading">Chargement du profil...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="home">
      <div className="home-hero" style={{ margin: '2rem 0' }}>
        <h1 className="hero-title">Profil Utilisateur</h1>
        {error && <div className="error-message" style={{ color: '#ff5252', textAlign: 'center', margin: '1rem 0' }}>{error}</div>}
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar">
              <img 
                src={user.avatarUrl || 'https://via.placeholder.com/150'} 
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
                  placeholder="URL de l'avatar"
                />
              )}
            </div>
            <div className="profile-info">
              <h2 className="hero-subtitle">{user.username}</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rating ELO:</strong> {user.eloRating}</p>
              {editing ? (
                <>
                  <div className="form-group">
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={profileData.username}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Total Matchs:</strong> {user.totalMatches || 0}</p>
                  <p><strong>Victoires:</strong> {user.wins || 0}</p>
                  <p><strong>Défaites:</strong> {user.losses || 0}</p>
                  <p><strong>Taux de victoire:</strong> {user.winRate ? `${user.winRate}%` : 'N/A'}</p>
                  <p><strong>Inscription:</strong> {new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
                </>
              )}
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
