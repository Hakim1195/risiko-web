import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Home.css';
import config from '../config';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/lobby');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Vérification des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur d\'inscription');
      }

      // Store token
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Navigate to lobby
      navigate('/lobby');
    } catch (err) {
      setError(err.message || 'Erreur d\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="home-hero" style={{ margin: '2rem 0', padding: '3rem 2rem' }}>
        <h1 className="hero-title">Inscription</h1>
        {error && <div className="error-message" style={{ color: '#ff5252', textAlign: 'center', margin: '1rem 0' }}>{error}</div>}
        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Votre pseudo"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="votre@email.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="••••••••"
              />
              <small className="form-hint">Minimum 8 caractères, une majuscule, une minuscule et un chiffre</small>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
          </form>
          <p className="auth-link">
            Vous avez déjà un compte ? <Link to="/login" className="btn-secondary">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
